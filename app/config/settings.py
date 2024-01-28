"""App configuration."""
from typing import List
from pydantic_settings  import BaseSettings


class Settings(BaseSettings):
    """
    Settings class.
    """
    MONGODB_URL: str
    MONGODB_NAME: str
    GEOSERVER_URL: str
    GEOSERVER_WORKSPACE: str
    GEOSERVER_USER: str
    GEOSERVER_PASSWORD: str

    class Config:
        """
        Config class.
        """
        env_file = ".env"
        env_file_encoding = 'utf-8'