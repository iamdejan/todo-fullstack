from pydantic import BaseModel

class ToDoItem(BaseModel):
    id: str
    title: str
    description: str | None = None
    finished: bool


class ToDoItemRequest(BaseModel):
    title: str
    description: str | None = None
