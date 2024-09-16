from contextlib import asynccontextmanager
from fastapi import FastAPI
from pypika import Table, Query # type: ignore
from pypika.enums import Order # type: ignore
from ulid import ULID
from pydantic_types import ToDoItem, ToDoItemRequest
from const import zero_ulid, default_page_limit
from database_connection_pool import pool

import time


server_start_time = time.time()


# integrate pool's lifespan with FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.open()
    yield
    await pool.close()

# inintiate FastAPI
app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root() -> dict:
    return {"message": "Hello world!"}


@app.get("/todos")
async def get_all_todos(last_id: str = zero_ulid, limit: int = default_page_limit) -> list:
    todo_items = Table("todo_items")
    q = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description, todo_items.finished).\
        where(last_id < todo_items.id).\
        orderby(todo_items.id, order=Order.asc).\
        limit(limit)

    results = []
    q_str = str(q)
    async with pool.connection() as conn:
        cursor = await conn.execute(q_str)
        async for record in cursor:
            result = ToDoItem(id=record[0], title=record[1], description=record[2], finished=record[3])
            results.append(result)

    return results


@app.post("/todos")
async def create_todo(request: ToDoItemRequest):
    item_id = ULID.from_timestamp(server_start_time)
    item_id_str: str = str(item_id)

    todo_items = Table("todo_items")
    q = Query.into(todo_items).\
        columns(todo_items.id, todo_items.title, todo_items.description, todo_items.finished).\
        insert(item_id_str, request.title, request.description, False)

    q_str = str(q)
    async with pool.connection() as conn:
        await conn.execute(q_str)

    return {}
