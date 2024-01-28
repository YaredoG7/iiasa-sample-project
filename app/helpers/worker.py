import io
import requests
import pandas as pd
from fastapi import File, HTTPException
from bson.objectid import ObjectId
from .collections import files_collection, gird_fs, geoserver_config


def get_files(skip: int = 0, limit: int = 10):
    """
    Get all uploaded files metadata.
    :param skip: The offset used when paging.
    :param limit: The number of items to retrieve per query.
    :param mongo_db: The database client.
    """
    csv_docs = []
    csv_doc_results = files_collection.find().limit(limit).skip(skip)
    for csv_doc in csv_doc_results:
        csv_docs.append(csv_doc)
    return csv_docs


def upload_file(file: File(...)):
    """
    Post csv files router.
    :param question: The question schema.
    """
    with gird_fs.new_file(
        filename=file.filename, content_type=file.content_type
    ) as gridfs_file:
        gridfs_file.write(file.file.read())

    return (
        {
            "id": str(gridfs_file._id),
            "code": 200,
            "message": "File uploaded successfully",
        },
    )


def read_file_content(id: str, skip: int = 0, limit: int = 100):
    """
    GET file from mongodb, should be updated so that it queries chunks in streaming fashsion
    for large files loading the entire file in memory could exahust machine performance
    """
    object_id = ObjectId(id)
    # Retrieve the file from GridFS
    gridfs_file = gird_fs.get(object_id)
    # Read the content of the file
    file_content = gridfs_file.read()
    # Create a Pandas DataFrame from the CSV content
    df = pd.read_csv(io.StringIO(file_content.decode("utf-8")))
    # cut data size
    start_idx = skip
    end_idx = skip + limit
    processed_data = df[start_idx:end_idx].to_dict(orient="records")
    return processed_data


def list_coverage_store():
    """
    GET coverage stores converted from .tif files.
    """
    geoserver_url = geoserver_config["url"]
    geoserver_workspace = geoserver_config["workspace"]
    username = geoserver_config["user"]
    password = geoserver_config["password"]
    # Get list of coverage stores
    coverage_stores_url = (
        f"{geoserver_url}/workspaces/{geoserver_workspace}/coveragestores.json"
    )
    try:
        response_stores = requests.get(
            coverage_stores_url, auth=(username, password), timeout=3000
        )
        response_stores.raise_for_status()

        # Parse the response JSON to get the list of coverage stores
        coverage_stores = response_stores.json()

        # Extract layer names from coverage stores
        layer_names = [
            store["name"] for store in coverage_stores["coverageStores"]["coverageStore"]
        ]

        # Get detailed information for each layer
        combined_results = []
        for layer_name in layer_names:
            # layer_info_url = f"{geoserver_url}/rest/workspaces/{geoserver_workspace}/coveragestores/{layer_name}/coverages/{layer_name}.json"
            layer_info_url = f"{geoserver_url}/workspaces/{geoserver_workspace}/coveragestores/{layer_name}.json"
            response_info = requests.get(
                layer_info_url, auth=(username, password), timeout=3000
            )
            response_info.raise_for_status()
            # Parse the response JSON to get detailed information for each layer
            layer_info = response_info.json()
            # Add the layer information to the combined results
            combined_results.append({"layer_name": layer_name, "layer_info": layer_info})
        return {"code": 200, "message": "success", "data": combined_results}
    except HTTPException as e:
        return {"code": 500, "message": "error occured accessing geoserver api", "data": []}


def reload_map():
    """
    Post geoserver endpoint for reloading 
    """
    geoserver_url = geoserver_config["url"]
    username = geoserver_config["user"]
    password = geoserver_config["password"]
    try:
        response_stores = requests.post(
            f"{geoserver_url}reload", auth=(username, password), timeout=3000
        )
        return {"code": 200, "message": "success", "data": []}
    except HTTPException as e:
        return {"code": 500, "message": "error occured accessing geoserver api", "data": []}




