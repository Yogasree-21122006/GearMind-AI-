from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimodal Field-Service Maintenance Assistant API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    PORT: int = 8000

    # Supabase configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    DATABASE_URL: str = ""

    # Storage buckets
    SUPABASE_STORAGE_BUCKET_IMAGES: str = "equipment-images"
    SUPABASE_STORAGE_BUCKET_DOCS: str = "manuals-and-docs"

    # AI, Multimodal Vision & Embedding Providers
    VISION_PROVIDER: str = "gemini"
    VISION_MODEL: str = "gemini-1.5-pro"
    LLM_PROVIDER: str = "gemini"
    LLM_MODEL: str = "gemini-1.5-pro"
    LLM_API_KEY: str = ""
    
    EMBEDDING_PROVIDER: str = "gemini"
    EMBEDDING_API_KEY: str = ""
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    EMBEDDING_DIMENSION: int = 768

    # RAG & Diagnostic Analysis Parameters
    CHUNK_SIZE: int = 650
    CHUNK_OVERLAP: int = 100
    SIMILARITY_THRESHOLD: float = 0.50
    DEFAULT_TOP_K: int = 5
    DIAGNOSTIC_CONFIDENCE_THRESHOLD: float = 0.65

    # Security & CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    JWT_SECRET_KEY: str = "insecure-default-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        return ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
