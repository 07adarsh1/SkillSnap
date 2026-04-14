import os
from pydantic import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Resume Analyzer"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "ai-resume-400b1")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    FIREBASE_CREDENTIALS_JSON: str = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-long-secret-key")
    SPACY_MODEL: str = "en_core_web_sm"
    TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
