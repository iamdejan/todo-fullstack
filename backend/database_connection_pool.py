from psycopg_pool import AsyncConnectionPool
from dotenv import load_dotenv

import os

load_dotenv()

host = os.environ["POSTGRES_HOST"]
dbport = int(os.environ["POSTGRES_PORT"])
dbname = os.environ["POSTGRES_DB"]
user = os.environ["POSTGRES_USER"]
password = os.environ["POSTGRES_PASSWORD"]

# initiate connection pool for database
pool = AsyncConnectionPool(conninfo=F"host={host} port={dbport} dbname={dbname} user={user} password={password}", open=False)
