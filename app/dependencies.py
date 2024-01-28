"""
Authentication and authorization
"""
from typing import Annotated
from fastapi import Header, HTTPException


async def get_token_header(x_token: Annotated[str, Header()]):
    """
    @TODO: proper implementation of user autehntication and access control 
    """
    if x_token != "placeholder_token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")