from pydantic import BaseModel

class ToDoItem(BaseModel):
    id: str
    title: str
    description: str | None = None
    finished: bool


class CreateToDoItemRequest(BaseModel):
    title: str
    description: str | None = None
