"""
Exposes MongoDB credentials and Geosevre config 
"""
import gridfs
from config.database import get_mongodb, geoserver_config
import re

db = get_mongodb()
files_collection = db["csv_files.files"]
gird_fs = gridfs.GridFS(db, collection="csv_files")
geoserver_config = geoserver_config()

def net_loc(url: str):
    """
    format url so that it matches streaming WMS
    """
    return re.sub(r'://\S+?(\d+)', '//localhost:\\1', url)
