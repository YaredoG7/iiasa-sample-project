from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from schemas import csv_schema, response_schema
from helpers import worker

router = APIRouter()

@router.get("/", response_model=csv_schema.ListCsvResponse)
def get_filemetadata(skip: int = 0, limit: int = 10):
    """
    Get all uploaded files metadata.
    :param skip: The offset used when paging.
    :param limit: The number of items to retrieve per query.
    :param mongo_db: The database client.
    """
    try:
        metadata = worker.get_files(skip=skip, limit=limit)
        response = {'status': 'success', 'results': len(metadata), 'data': metadata}
    except HTTPException as e:
        response = {"id": "", "code": 500, "message": str(e) },
    return csv_schema.ListCsvResponse(**response)


@router.get("/{id}", response_description="Get document by id",)
def read_csv_file(id: str, skip: int = 0, limit: int = 10):
    """
    Get uploaded file contents.
    :param skip: The offset used when paging.
    :param limit: The number of items to retrieve per query.
    :param mongo_db: The database client.
    """
    try:
        readings = worker.read_file_content(id=id, skip=skip, limit=limit )
        return readings
    except HTTPException as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/upload", response_model=csv_schema.CsvResponse)
async def create_file(file: UploadFile = File(...)):
    """
    Post csv files router.
    :param question: The question schema.
    """
    try:
        upload = worker.upload_file(file)
        resp = upload[0]
    except HTTPException as e:
        resp = {"id": "", "code": 500, "message": str(e) },
    return csv_schema.CsvResponse(**resp)
