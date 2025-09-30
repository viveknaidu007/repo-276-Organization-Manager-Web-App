from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'), env_file_encoding='utf-8', extra='ignore')

    APP_NAME: str = 'OrgManagerAPI'
    APP_ENV: str = 'development'
    DEBUG: bool = True
    PORT: int = 8000

    # Accept string (comma-separated) or list of strings from env
    CORS_ORIGINS: Union[str, List[str]] = 'http://localhost:5173'

    DATABASE_URL: str

    SUPABASE_URL: str | None = None
    SUPABASE_ANON_KEY: str | None = None
    SUPABASE_JWT_SECRET: str | None = None

    LOG_LEVEL: str = 'INFO'

settings = Settings()