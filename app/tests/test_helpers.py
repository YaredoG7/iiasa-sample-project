import os
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from helpers.geoserver_initializer import GeoServerInitializer  

@pytest.fixture
def app():
    return FastAPI()

@pytest.fixture
def client(app):
    return TestClient(app)

def test_geoserver_initializer():
    local_tiff_directory = '/app/30s_raster'
    geo_server_initializer = GeoServerInitializer(local_tiff_directory=local_tiff_directory)

    # Perform setup or initialization if needed

    # Example: Test GeoServer workspace creation
    geo_server_initializer.create_geoserver_workspace()
    assert geo_server_initializer.catalog.get_workspace(geo_server_initializer.workspace) is not None

    # Example: Test GeoServer upload of TIFF files
    geo_server_initializer.upload_tiff_files()
    # Add more assertions based on the expected state after upload

    # Perform cleanup or teardown if needed

# Run the tests by executing: pytest test_geoserver_initializer.py
