import sys
import os
from pathlib import Path

# Ensure all parent directories and current directory are in sys.path
CURRENT_FILE = Path(__file__).resolve()
for p in [CURRENT_FILE.parent, CURRENT_FILE.parent.parent, CURRENT_FILE.parent.parent.parent]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from backend.app.core.config import settings
from backend.app.api.v1.router import api_router
from backend.app.utils.logger import app_logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    app_logger.info(f"Starting {settings.PROJECT_NAME} in [{settings.ENVIRONMENT}] mode.")
    yield
    app_logger.info("Shutting down application.")

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Production-grade backend API for Multimodal Field-Service Maintenance Assistant with Supabase & pgvector integration.",
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan
    )

    # CORS configuration
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handlers
    @application.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "status_code": exc.status_code}
        )

    @application.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors(), "message": "Request body validation failed."}
        )

    # Mount API Router under prefix
    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application

app = create_application()
