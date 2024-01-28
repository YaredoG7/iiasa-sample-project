"""
Entry to a light weight FastApi
"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import csv_data
from dependencies import get_token_header
from routers import raster_data
from helpers.geoserver_initializer import GeoServerInitializer

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    - FastAPi is waiting for Geoserver container to spin-up
    - Reads GeoTiff files locally and push it to geoserver for wms access
    - Only some files are processed due to the size and its implication on the docker image size (in docker hub)
    - Remaing files can be uploaded form UI and visualized
    """
    try:
        await asyncio.sleep(15)
        geoserver_initializer = GeoServerInitializer(
            local_tiff_directory="/app/30s_raster",
        )
        geoserver_initializer.create_geoserver_workspace()
        await asyncio.sleep(5)
        print("DONE: Configuration competed.")
        yield
    except Exception as e:
        print(f"Exception during initialization: {e}")
        yield
    finally:
        # Clean up and release the resources below
        pass


app = FastAPI(
    lifespan=lifespan,
    title="IIASA-Sample-Project",
    dependencies=[Depends(get_token_header)],
    version="0.0.1",
)

API_VERSION = "/api/v1"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    csv_data.router,
    prefix=f"{API_VERSION}/csv",
    tags=["csv"],
)

app.include_router(
    raster_data.router,
    prefix=f"{API_VERSION}/raster",
    tags=["raster"],
)
