from psycopg_pool import AsyncConnectionPool
from dotenv import load_dotenv

import os

load_dotenv()

host = os.getenv("POSTGRES_HOST")
dbport = int(os.environ["POSTGRES_PORT"])
dbname = os.environ["POSTGRES_DB"]
user = os.environ["POSTGRES_USER"]
password = os.environ["POSTGRES_PASSWORD"]

connection_info = f"host={host} port={dbport} dbname={dbname} user={user} password={password}"

pool = AsyncConnectionPool(conninfo=connection_info, open=False)
