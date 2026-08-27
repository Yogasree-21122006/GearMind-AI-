# System Architecture Document

## 1. System Overview
The **Multimodal Field-Service Maintenance Assistant** is an enterprise-grade AI diagnostic platform designed to accelerate industrial equipment troubleshooting, minimize operational downtime, and ensure safety compliance for field service technicians.

---

## 2. Layered Architecture

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons             |
|  - Diagnostic Assistant Cockpit & Safety Visualizer                     |
|  - Asset Inventory & Status Tracker                                     |
|  - Technical Manuals Library & Processing Pipeline                      |
|  - Maintenance History & Analytical Reports                             |
+------------------------------------+------------------------------------+
                                     | HTTPS / JSON REST API
                                     v
+------------------------------------+------------------------------------+
|                            FASTAPI BACKEND                              |
|  - API Gateway / Routing (`app/api/v1`)                                 |
|  - Validation Layer (Pydantic v2 Models & Schemas)                      |
|  - Service Orchestration Layer (`app/services`)                         |
|  - Data Access & Storage Layer (`app/repositories`)                     |
+------------------------------------+------------------------------------+
                   |                                       |
                   v                                       v
+------------------------------------+   +--------------------------------+
|       SUPABASE CLOUD / POSTGRES    |   |     MULTIMODAL AI & RAG        |
|  - Relational Schema (PostgreSQL)  |   |  - Multimodal Vision Engine    |
|  - pgvector Dense Indexing (HNSW)  |   |  - Embedding Engine            |
|  - Object Storage (Images/Manuals) |   |  - Vector Search & Reranker    |
|  - Row-Level Security (RLS)        |   |  - Grounded Chain-of-Thought   |
+------------------------------------+   +--------------------------------+
```

---

## 3. Data & Diagnostic Ingestion Flow

1. **Asset & Manual Ingestion**:
   - Technicians/Admins register equipment metadata.
   - OEM manuals (PDF/DOCX) are uploaded to Supabase Object Storage.
   - The backend chunking pipeline extracts text, page boundaries, and section headers.
   - Vector embeddings are generated and stored in `document_chunks` with HNSW indexing.

2. **Multimodal Diagnostic Query**:
   - The technician inputs equipment symptoms, error codes, and optionally captures/uploads inspection photos.
   - **Vision Processing**: Multimodal LLM inspects the photo for component tags, visual wear, burnt contacts, or leaks.
   - **Hybrid Retrieval**: Query and visual annotations trigger semantic retrieval in pgvector against the asset's specific manuals and historical records.
   - **Grounded Reasoning**: The AI agent synthesizes safety precautions, step-by-step troubleshooting instructions, required PPE/tools, and explicit source citations.
   - **Audit & Feedback**: Technician reviews the recommendations, performs the physical actions, and submits validation feedback.

---

## 4. Security & Safety Principles
- **No Secret Leakage**: Service-role keys and LLM API keys reside strictly on the FastAPI server environment.
- **Source Grounding**: All diagnostic procedures mandate traceable citations back to OEM manuals and verified error-code entries.
- **Safety First**: Every diagnostic sequence emphasizes PPE, Lockout/Tagout (LOTO), and hazardous energy isolation.
