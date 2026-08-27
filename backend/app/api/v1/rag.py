from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from fastapi import APIRouter, status
from backend.app.rag.retrieval_service import RetrievalService

router = APIRouter(prefix="/rag", tags=["RAG & Knowledge Retrieval"])

class RAGCitation(BaseModel):
    manual_id: Optional[UUID] = None
    document_title: str
    page_number: int
    similarity: float

    model_config = ConfigDict(from_attributes=True)

class RAGSearchResultItem(BaseModel):
    chunk_id: Optional[UUID] = None
    manual_id: Optional[UUID] = None
    manual_title: str
    equipment_type: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    page_number: int
    content: str
    similarity: float
    citation: RAGCitation

    model_config = ConfigDict(from_attributes=True)

class RAGSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, examples=["What is the recommended discharge pressure for RTWD-150?"])
    top_k: Optional[int] = Field(default=5, ge=1, le=20)
    similarity_threshold: Optional[float] = Field(default=0.5, ge=0.0, le=1.0)

class RAGSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[RAGSearchResultItem]

    model_config = ConfigDict(from_attributes=True)

@router.post(
    "/search",
    response_model=RAGSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Semantic Search on Manuals",
    description="Embeds search query into 768-dim vector and executes pgvector cosine similarity search over indexed OEM technical manual chunks."
)
def semantic_search(request: RAGSearchRequest):
    """Retrieval-only semantic search over technical documentation chunks."""
    retriever = RetrievalService()
    results = retriever.search_similar_chunks(
        query=request.query,
        top_k=request.top_k,
        similarity_threshold=request.similarity_threshold
    )
    return {
        "query": request.query,
        "total_results": len(results),
        "results": results
    }
