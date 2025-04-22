import asyncpg
import dataclasses
from threading import Lock

from CASD_Database.src.db.models import Passport, DriverLicense, Snils, Inn


class DB:
    __instance = None
    __lock = Lock()

    def __new__(cls, *args, **kwargs):
        if cls.__instance is None:
            with cls.__lock:
                if cls.__instance is None:
                    cls.__instance = super().__new__(cls)
                    cls.__instance.__initialized = False
        return cls.__instance



    def __init__(self, user: str, password: str, host: str, port: str, database: str):
        if self.__initialized:
            return
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.database = database


class AsyncSession:
    def __init__(self, db: DB):
        self.db = db
        self.connection: asyncpg.Connection | None = None

    @staticmethod
    def record_to_dataclass(record: asyncpg.Record, model_data):
        fields = {f.name for f in dataclasses.fields(model_data)}
        kwargs = {k: v for k, v in record.items() if k in fields}
        if model_data == Passport or model_data == DriverLicense or model_data == Inn or model_data == Snils:
            if kwargs["get_date"] is None:
                for k, v in record.items():
                    if k == "get_date" and v is not None:
                        kwargs["get_date"] = v
                        break

        return model_data(**kwargs)

    async def __aenter__(self) -> asyncpg.Connection:
        try:
            self.connection = await asyncpg.connect(user=self.db.user,
                                                    password=self.db.password,
                                                    host=self.db.host,
                                                    port=self.db.port,
                                                    database=self.db.database)
            return self.connection
        except asyncpg.PostgresError as e:
            print(f"Ошибка подключения к сессии {e}")
            raise

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            await self.connection.close()

def get_db():
    db = DB("danil", "123", "127.0.0.1", "5431", "Cargo Transportation")
    return db