"""
Database configuration.
"""
from functools import lru_cache
from pymongo import MongoClient
from . import settings


@lru_cache()
def get_settings():
    """
    Config settings function.
    """
    return settings.Settings()

conf_settings = get_settings()

MONGODB_URL = conf_settings.MONGODB_URL
MONGODB_NAME = conf_settings.MONGODB_NAME
GEOSERVER_URL = conf_settings.GEOSERVER_URL
GEOSERVER_WORKSPACE = conf_settings.GEOSERVER_WORKSPACE
GEOSERVER_USER = conf_settings.GEOSERVER_USER
GEOSERVER_PASSWORD = conf_settings.GEOSERVER_PASSWORD

mongodb_client = MongoClient(MONGODB_URL)

def get_mongodb():
    """
    Init MongoDB Database.
    """
    mongo_db = mongodb_client[MONGODB_NAME]
    return mongo_db

def geoserver_config():
    """
    GEO server configurations
    """
    return {"url":f"{GEOSERVER_URL}rest", "workspace": GEOSERVER_WORKSPACE, "user": GEOSERVER_USER, "password": GEOSERVER_PASSWORD}
