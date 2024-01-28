from fastapi import APIRouter, HTTPException, File, UploadFile
from helpers import worker
from helpers.geoserver_initializer import GeoServerInitializer
from schemas.response_schema import BaseResponse

router = APIRouter()

@router.get("/", response_model=BaseResponse)
def get_combined_results():
    """
    GET coverage stores converted from .tif files.
    """
    response = worker.list_coverage_store()
    return BaseResponse(**response)

@router.post("/upload")
async def create_file(file: UploadFile = File(...)):
    """
    Post csv files router.
    :param question: The question schema.
    """
    geoserver_initializer = GeoServerInitializer(
        local_tiff_directory='',
    )
    response = await geoserver_initializer.upload_tiff_api(file=file)
    return BaseResponse(**response)


@router.post("/reload_map")
def create_file():
    """
    Post csv files router.
    :param question: The question schema.
    """
    response = worker.reload_map()
    return BaseResponse(**response)