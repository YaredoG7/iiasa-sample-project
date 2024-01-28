"""
Geoserver automated file uploading and processing of GeoTiff files in 
"""
import os
import tempfile
from pathlib import Path
import requests
from geoserver.catalog import Catalog
from fastapi import HTTPException, File
from .collections import geoserver_config, net_loc


class GeoServerInitializer:
    """
    a calss used for automation of geoserver interaction
    """
    def __init__(self, local_tiff_directory):
        self.base_url = geoserver_config["url"]
        self.user = geoserver_config["user"]
        self.password = geoserver_config["password"]
        self.workspace = geoserver_config["workspace"]
        self.local_tiff_directory = Path(local_tiff_directory)
        self.upload_timeout = 60 # to accomdate large files
        self.catalog = Catalog(self.base_url, self.user, self.password)
        self.wms_url = net_loc(self.base_url)
    def create_geoserver_workspace(self):
        """
        initial step of local file processing
        creates a pre-defined workspace
        """
        try:
            # Create GeoServer workspace
            self.catalog.create_workspace(
                uri=f"{self.wms_url}/{self.workspace}", name=self.workspace
            )
            self.upload_tiff_files()
        except Exception as e:
            print(f"Error: {str(e)}")
            return None

    def upload_tiff_files(self):
        """
        Iterate over all local files with supported extenstions
        """
        for file_name in os.listdir(self.local_tiff_directory):
            if file_name.endswith(".tif") or file_name.endswith(".tiff"):
                tiff_path = os.path.join(self.local_tiff_directory, file_name)
                layer_name = file_name.split(".tif")[
                    0
                ]  # Extract layer name from the file name
                self.upload_tiff_to_geoserver(layer_name, tiff_path)

    def upload_tiff_to_geoserver(self, layer_name, tiff_path):
        """
        Uploads a GeoTIFF file to GeoServer under predefined workspace.
        """
        url = f"{self.base_url}/workspaces/{self.workspace}/coveragestores/{layer_name}/file.geotiff"
        # Configure authentication
        auth = (self.user, self.password)
        # Upload GeoTIFF to GeoServer
        with open(tiff_path, "rb") as file:
            response = requests.put(
                url, data=file, auth=auth, headers={"Content-type": "image/tiff"}, timeout=self.upload_timeout
            )
        if response.status_code == 201:
            print(f"Uploaded {layer_name} to GeoServer")
        else:
            print(
                f"Failed to upload {layer_name}. Status Code: {response.status_code}, Response: {response.text}"
            )

    async def save_temp_file(self, file):
        """
        temporary storage before the file is proccessed and pushed to geoserver
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_file:
            temp_filename = temp_file.name
            contents = await file.read()
            temp_file.write(contents)
            return temp_filename
        
    async def upload_tiff_api(self, file: File):
        """
        used for uploading raster data from the frontend application
        """
        try:
            layer_name = file.filename  # use file name as layer name
            file_location = await self.save_temp_file(file)
            # Get or create GeoServer coverage store
            self.upload_tiff_to_geoserver(layer_name, file_location)
            return {
                "code": 200,
                "message": f"success! raster added to {layer_name}",
                "data": [],
            }
        except HTTPException as e:
            return {
                "code": 500,
                "message": f"error occured uploading raster: {str(e)}",
                "data": [],
            }
