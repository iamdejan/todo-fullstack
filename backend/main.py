from contextlib import asynccontextmanager
from psycopg_pool import AsyncConnectionPool
from fastapi import FastAPI

import os

host = "database"
port = 5432
dbname = os.environ["POSTGRES_DB"]
user = os.environ["POSTGRES_USER"]
password = os.environ["POSTGRES_PASSWORD"]

# initiate connection pool for database
pool = AsyncConnectionPool(conninfo=F"host=database port=5432 dbname={dbname} user={user} password={password}", open=False)

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
async def get_all_todos() -> list:
    return []
