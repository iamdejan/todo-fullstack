from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pypika import Table, Query  # type: ignore
from pypika.enums import Order  # type: ignore
from ulid import ULID
from pydantic_types import ToDoItem, CreateToDoItemRequest
from const import zero_ulid, default_page_limit
from database_connection_pool import pool
from fastapi.middleware.cors import CORSMiddleware

todo_item_not_found_code = "TODO_ITEM_NOT_FOUND"


def construct_not_found_detail(item_id: str) -> dict:
    return {
        "message": "To-do item not found",
        "code": todo_item_not_found_code,
        "value": item_id
    }


# integrate pool's lifespan with FastAPI
@asynccontextmanager
async def lifespan(_: FastAPI):
    await pool.open()
    yield
    await pool.close()


# initiate FastAPI
app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict:
    return {"message": "Hello world!"}


@app.get("/todos")
async def get_all_todos(last_id: str = zero_ulid, limit: int = default_page_limit) -> list[ToDoItem]:
    todo_items = Table("todo_items")
    q = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description, todo_items.finished). \
        where(last_id < todo_items.id). \
        orderby(todo_items.id, order=Order.asc). \
        limit(limit)

    results = []
    q_str = str(q)
    async with pool.connection() as conn:
        cursor = await conn.execute(q_str)
        async for record in cursor:
            result = ToDoItem(id=record[0], title=record[1], description=record[2], finished=record[3])
            results.append(result)

    return results


@app.get("/todos/{item_id}")
async def get_todo_by_id(item_id: str) -> ToDoItem | None:
    todo_items = Table("todo_items")
    q = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description, todo_items.finished). \
        where(todo_items.id == item_id). \
        limit(1)

    q_str = str(q)
    async with pool.connection() as conn:
        cursor = await conn.execute(q_str)
        record = await cursor.fetchone()
        if record is None:
            raise HTTPException(status_code=404, detail=construct_not_found_detail(item_id))
    result = ToDoItem(id=record[0], title=record[1], description=record[2], finished=record[3])
    return result


@app.post("/todos")
async def create_todo(request: CreateToDoItemRequest):
    item_id = ULID()
    item_id_str: str = str(item_id)

    description = None
    if isinstance(request.description, str):
        request.description = request.description.strip()
        description = request.description if len(request.description) > 1 else None

    todo_items = Table("todo_items")
    q = Query.into(todo_items). \
        columns(todo_items.id, todo_items.title, todo_items.description, todo_items.finished). \
        insert(item_id_str, request.title, description, False)

    q_str = str(q)
    async with pool.connection() as conn:
        await conn.execute(q_str)

    return {}


@app.put("/todos/{item_id}")
async def update_todo_by_id(item_id: str, request: ToDoItem):
    todo_items = Table("todo_items")

    description = None
    if isinstance(request.description, str):
        request.description = request.description.strip()
        description = request.description if len(request.description) > 1 else None

    get_query = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description,
                                               todo_items.finished). \
        where(todo_items.id == item_id). \
        limit(1)

    update_query = Query.update(todo_items). \
        set(todo_items.title, request.title). \
        set(todo_items.description, description). \
        set(todo_items.finished, request.finished). \
        where(todo_items.id == item_id)

    get_query_str = str(get_query)
    update_query_str = str(update_query)
    print("update query = ", update_query_str)
    async with pool.connection() as conn:
        cursor = await conn.execute(get_query_str)
        record = await cursor.fetchone()
        if record is None:
            raise HTTPException(status_code=404, detail=construct_not_found_detail(item_id))

        # actual delete process
        await conn.execute(update_query_str)

    return {}


@app.delete("/todos/{item_id}")
async def delete_todo(item_id: str):
    todo_items = Table("todo_items")
    get_query = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description,
                                               todo_items.finished). \
        where(todo_items.id == item_id). \
        limit(1)

    delete_query = Query.from_(todo_items).delete(). \
        where(todo_items.id == item_id)

    get_query_str = str(get_query)
    delete_query_str = str(delete_query)
    async with pool.connection() as conn:
        cursor = await conn.execute(get_query_str)
        record = await cursor.fetchone()
        if record is None:
            raise HTTPException(status_code=404, detail=construct_not_found_detail(item_id))

        # actual delete process
        await conn.execute(delete_query_str)

    result = ToDoItem(id=record[0], title=record[1], description=record[2], finished=record[3])
    return result
