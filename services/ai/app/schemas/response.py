from typing import Any
from pydantic import BaseModel # type: ignore
from app.schemas.errors import APIError # type: ignore
class APIResponse(BaseModel):
    success: bool
    data: Any | None = None
    error: APIError | None = None