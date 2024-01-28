"""Pydantic CSV schemas."""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, validator
from bson import ObjectId 

class CsvBase(BaseModel):
    """
    Csv Base Schema.
    """
    id: str
    filename: str
    contentType: str
    chunkSize: int
    length: Optional[int]
    uploadDate: Optional[datetime]

    class Config:
        arbitrary_types_allowed=True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }



class CsvResponse(BaseModel):
    """
    Csv Response Schema.
    """
    id: str
    code: int
    message: Optional[str]

class ListCsvResponse(BaseModel):
    """
    Csv Response List Schema.
    """
    status: str
    results: int
    data: List[CsvBase]
    @validator("data", pre=True, each_item=True)
    def convert_object_id(cls, value):
        """
        validate the mongodb _id field
        """
        if "_id" in value and isinstance(value["_id"], ObjectId):
            value["id"] = str(value["_id"])
            del value["_id"]
        return value