from pydantic import BaseModel # type: ignore
class APIError(BaseModel):
    code: str
    message: str