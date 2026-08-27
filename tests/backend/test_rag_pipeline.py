import io
import uuid
import pytest
import pymupdf
import docx
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.document_processor import DocumentProcessor, DocumentContent, DocumentPage
from backend.app.rag.chunker import DocumentChunker
from backend.app.rag.embedding_service import EmbeddingService
from backend.app.rag.ingestion_service import IngestionService
from backend.app.rag.retrieval_service import RetrievalService

client = TestClient(app)

# Helper function to generate sample PDF bytes in memory
def create_sample_pdf_bytes(pages_text: list) -> bytes:
    doc = pymupdf.open()
    for text in pages_text:
        page = doc.new_page(width=595, height=842)
        page.insert_text((50, 50), text, fontsize=12)
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes

# Helper function to generate sample DOCX bytes in memory
def create_sample_docx_bytes(paragraphs: list) -> bytes:
    doc = docx.Document()
    for p in paragraphs:
        doc.add_paragraph(p)
    docx_file = io.BytesIO()
    doc.save(docx_file)
    return docx_file.getvalue()

def test_pdf_text_extraction_and_page_preservation():
    processor = DocumentProcessor()
    pdf_bytes = create_sample_pdf_bytes([
        "Section 1: Operating Procedures\nVerify chiller refrigerant charge at 380 PSIG.",
        "Section 2: Error Code Diagnostic\nCode E-241 indicates High Discharge Pressure.",
        "Section 3: Preventive Maintenance\nClean coils every 6 months."
    ])

    extracted = processor.extract_from_pdf(pdf_bytes, title="Trane Chiller Manual")
    assert extracted.total_pages == 3
    assert len(extracted.pages) == 3
    assert extracted.pages[0].page_number == 1
    assert "Operating Procedures" in extracted.pages[0].text
    assert extracted.pages[1].page_number == 2
    assert "Code E-241" in extracted.pages[1].text
    assert extracted.pages[2].page_number == 3

def test_docx_text_extraction():
    processor = DocumentProcessor()
    docx_bytes = create_sample_docx_bytes([
        "Standard Operating Procedure for Industrial Water Pumps.",
        "Step 1: Check mechanical seal lubrication level.",
        "Step 2: Inspect suction strainer for debris."
    ])

    extracted = processor.extract_from_docx(docx_bytes, title="Pump SOP")
    assert extracted.total_pages >= 1
    assert len(extracted.pages) >= 1
    assert "Standard Operating Procedure" in extracted.pages[0].text
    assert "mechanical seal" in extracted.pages[0].text

def test_chunk_generation_and_overlap():
    chunker = DocumentChunker(chunk_size=30, chunk_overlap=10)
    
    long_text = " ".join([f"Word{i}" for i in range(100)])
    doc_content = DocumentContent(
        title="Sample Spec",
        pages=[DocumentPage(page_number=4, text=long_text)],
        total_pages=1,
        metadata={"equipment_type": "Generator", "manufacturer": "CAT", "model": "C32"}
    )

    chunks = chunker.chunk_document(doc_content, manual_id="manual-uuid-123")
    assert len(chunks) > 1
    assert chunks[0].page_number == 4
    assert chunks[0].metadata["manual_id"] == "manual-uuid-123"
    assert chunks[0].metadata["equipment_type"] == "Generator"
    assert chunks[0].metadata["page_number"] == 4
    assert chunks[0].metadata["chunk_index"] == 0
    assert chunks[1].metadata["chunk_index"] == 1

def test_embedding_dimension_validation_strict():
    embedder = EmbeddingService(dimension=768)
    
    # 1. Valid 768-dim vector
    valid_vec = [0.1] * 768
    validated = embedder._validate_dimension(valid_vec, "test")
    assert len(validated) == 768

    # 2. Invalid dimension (e.g. 1536) must raise ValueError
    invalid_vec = [0.1] * 1536
    with pytest.raises(ValueError) as exc:
        embedder._validate_dimension(invalid_vec, "mismatch test")
    assert "Embedding dimension mismatch" in str(exc.value)

    # 3. Deterministic generator produces exactly 768 dimensions
    gen_vec = embedder.generate_embedding("Test prompt for vector generation")
    assert len(gen_vec) == 768
    assert isinstance(gen_vec[0], float)

@patch("backend.app.rag.ingestion_service.get_supabase_client")
def test_ingestion_service_pipeline(mock_get_supabase):
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase

    sample_pdf = create_sample_pdf_bytes(["Test Content Page 1", "Test Content Page 2"])
    mock_supabase.table().select().eq().execute.return_value.data = [{
        "id": "11111111-1111-1111-1111-111111111111",
        "title": "Chiller Manual",
        "file_name": "chiller_manual.pdf",
        "storage_path": "manuals/chiller_manual.pdf",
        "equipment_type": "Chiller",
        "manufacturer": "Trane",
        "model": "RTWD-150"
    }]
    mock_supabase.storage.from_().download.return_value = sample_pdf

    ingestor = IngestionService()
    res = ingestor.process_manual(uuid.UUID("11111111-1111-1111-1111-111111111111"))
    
    assert res["status"] == "completed"
    assert res["total_pages"] == 2
    assert res["chunks_count"] >= 2

@patch("backend.app.rag.ingestion_service.get_supabase_client")
def test_ingestion_failure_handling(mock_get_supabase):
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase

    mock_supabase.table().select().eq().execute.return_value.data = [{
        "id": "22222222-2222-2222-2222-222222222222",
        "title": "Broken Document",
        "file_name": "corrupted.pdf",
        "storage_path": "manuals/corrupted.pdf"
    }]
    mock_supabase.storage.from_().download.side_effect = Exception("Storage connection error")

    ingestor = IngestionService()
    res = ingestor.process_manual(uuid.UUID("22222222-2222-2222-2222-222222222222"))
    assert res["status"] == "failed"
    assert "Storage connection error" in res["error"]

@patch("backend.app.rag.retrieval_service.get_supabase_client")
def test_vector_retrieval_and_citation_preservation(mock_get_supabase):
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase

    manual_id = str(uuid.uuid4())
    mock_supabase.rpc().execute.return_value.data = [
        {
            "id": str(uuid.uuid4()),
            "manual_id": manual_id,
            "content": "Verify that condenser water flow rate is at least 3 GPM per ton.",
            "page_number": 84,
            "similarity": 0.885,
            "metadata": {
                "document_title": "Trane RTWD Technical Manual",
                "equipment_type": "Chiller",
                "manufacturer": "Trane",
                "model": "RTWD-150",
                "page_number": 84
            }
        }
    ]

    retriever = RetrievalService()
    results = retriever.search_similar_chunks("chiller flow rate", top_k=3, similarity_threshold=0.6)

    assert len(results) == 1
    assert results[0]["page_number"] == 84
    assert results[0]["citation"]["document_title"] == "Trane RTWD Technical Manual"
    assert results[0]["citation"]["page_number"] == 84
    assert results[0]["similarity"] == 0.885

@patch("backend.app.rag.retrieval_service.RetrievalService.search_similar_chunks")
def test_rag_search_api_endpoint(mock_search):
    mock_search.return_value = [
        {
            "chunk_id": str(uuid.uuid4()),
            "manual_id": str(uuid.uuid4()),
            "manual_title": "OEM Chiller SOP",
            "equipment_type": "Chiller",
            "manufacturer": "Trane",
            "model": "RTWD-150",
            "page_number": 42,
            "content": "Perform quarterly chemical clean on evaporator tubes.",
            "similarity": 0.912,
            "citation": {
                "manual_id": str(uuid.uuid4()),
                "document_title": "OEM Chiller SOP",
                "page_number": 42,
                "similarity": 0.912
            }
        }
    ]

    response = client.post(
        "/api/v1/rag/search",
        json={"query": "How to clean evaporator tubes?", "top_k": 3, "similarity_threshold": 0.5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_results"] == 1
    assert data["results"][0]["page_number"] == 42
    assert data["results"][0]["citation"]["document_title"] == "OEM Chiller SOP"
