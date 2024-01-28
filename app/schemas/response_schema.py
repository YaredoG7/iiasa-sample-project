"""
Gneric http response. Similar model with the frontend
"""
from pydantic import BaseModel
from typing import List, Optional

class BaseResponse(BaseModel):
    """
    Basic HTTP Response Schema.
    """
    code: int
    message: str
    data: Optional[List]

