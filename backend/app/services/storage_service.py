import logging
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException, status
from backend.app.database.supabase_client import get_supabase_client
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Constants for validation
MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB
MAX_DOC_SIZE_BYTES = 100 * 1024 * 1024   # 100 MB

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}
ALLOWED_DOC_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

class StorageService:
    """Service for handling file uploads, deletes, and signed URLs with Supabase Storage."""

    def __init__(self):
        self.supabase = get_supabase_client()

    def _ensure_client(self):
        if not self.supabase:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase Storage service is not configured or unavailable."
            )

    async def validate_and_read_image(self, file: UploadFile) -> Tuple[bytes, str]:
        """Validates uploaded image MIME type and file size, returns file bytes and content type."""
        content_type = file.content_type or "image/jpeg"
        if content_type.lower() not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type '{content_type}'. Allowed types: JPEG, PNG, WEBP, HEIC."
            )
        
        file_bytes = await file.read()
        if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Image file exceeds maximum allowable size of {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)} MB."
            )
        if len(file_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty."
            )
        return file_bytes, content_type

    async def validate_and_read_doc(self, file: UploadFile) -> Tuple[bytes, str]:
        """Validates uploaded manual/document MIME type and size."""
        content_type = file.content_type or "application/pdf"
        # Support PDF and Word documents
        if content_type.lower() not in ALLOWED_DOC_TYPES and not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid document type '{content_type}'. Allowed: PDF, DOCX."
            )
        
        file_bytes = await file.read()
        if len(file_bytes) > MAX_DOC_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Document file exceeds maximum allowable size of {MAX_DOC_SIZE_BYTES // (1024 * 1024)} MB."
            )
        if len(file_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded document file is empty."
            )
        return file_bytes, content_type

    async def upload_file(self, bucket: str, path: str, file_bytes: bytes, mime_type: str) -> str:
        """Uploads binary file to the specified Supabase bucket."""
        self._ensure_client()
        try:
            self.supabase.storage.from_(bucket).upload(
                path=path,
                file=file_bytes,
                file_options={"content-type": mime_type, "upsert": "true"}
            )
            return path
        except Exception as e:
            logger.error(f"Error uploading file to storage bucket '{bucket}': {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file to storage bucket: {str(e)}"
            )

    def delete_file(self, bucket: str, path: str) -> bool:
        """Deletes file from Supabase storage bucket."""
        self._ensure_client()
        try:
            self.supabase.storage.from_(bucket).remove([path])
            return True
        except Exception as e:
            logger.error(f"Error deleting file from bucket '{bucket}': {e}")
            return False

    def get_public_url(self, bucket: str, path: str) -> Optional[str]:
        """Retrieves public URL for an asset in a public bucket."""
        if not self.supabase:
            return None
        try:
            return self.supabase.storage.from_(bucket).get_public_url(path)
        except Exception as e:
            logger.error(f"Error generating public URL: {e}")
            return None
