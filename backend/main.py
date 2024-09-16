from contextlib import asynccontextmanager
from psycopg_pool import AsyncConnectionPool
from fastapi import FastAPI
from dotenv import load_dotenv
from pydantic import BaseModel
from pypika import Table, Query
from pypika.enums import Order
from ulid import ULID

import time
import os

load_dotenv()

host = os.environ["POSTGRES_HOST"]
dbport = int(os.environ["POSTGRES_PORT"])
dbname = os.environ["POSTGRES_DB"]
user = os.environ["POSTGRES_USER"]
password = os.environ["POSTGRES_PASSWORD"]

# initiate connection pool for database
pool = AsyncConnectionPool(conninfo=F"host={host} port={dbport} dbname={dbname} user={user} password={password}", open=False)

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


class ToDoItem(BaseModel):
    id: str
    title: str
    description: str | None = None
    finished: bool


@app.get("/todos")
async def get_all_todos(last_id: str = "00000000000000000000000000", limit: int = 10) -> list:
    todo_items = Table("todo_items")
    q = Query.from_(todo_items).select(todo_items.id, todo_items.title, todo_items.description, todo_items.finished).\
        where(last_id < todo_items.id).\
        orderby(todo_items.id, order=Order.asc).\
        limit(limit)

    results = []
    async with pool.connection() as conn:
        cursor = await conn.execute(str(q))
        async for record in cursor:
            result = ToDoItem(id=record[0], title=record[1], description=record[2], finished=record[3])
            results.append(result)

    return results


class ToDoItemRequest(BaseModel):
    title: str
    description: str | None = None


server_start_time = time.time()


@app.post("/todos")
async def create_todo(request: ToDoItemRequest):
    item_id = ULID.from_timestamp(server_start_time)

    todo_items = Table("todo_items")
    q = Query.into(todo_items).\
        columns(todo_items.id, todo_items.title, todo_items.description, todo_items.finished).\
        insert(str(item_id), request.title, request.description, False)

    async with pool.connection() as conn:
        await conn.execute(str(q))

    return {}
