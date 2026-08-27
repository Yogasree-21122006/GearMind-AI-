# Multimodal Field-Service Maintenance Assistant

A production-grade, enterprise-ready AI assistant architecture engineered for industrial field-service technicians to diagnose equipment failures, perform multimodal inspection, and execute safety-grounded troubleshooting routines backed by technical manuals and RAG.

---

## 1. System Architecture Overview

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|  React 18 + TypeScript + Vite + Tailwind CSS                            |
|  - Diagnostic Assistant Cockpit & Safety Verifier                       |
|  - Asset Inventory & Status Tracker                                     |
|  - Technical Manuals Library & Processing Pipeline                      |
|  - Maintenance History & Analytical Reports                             |
+------------------------------------+------------------------------------+
                                     | REST API (JSON / FormData)
                                     v
+------------------------------------+------------------------------------+
|                            FASTAPI BACKEND                              |
|  - API Gateway / Modular Routers (`app/api/v1`)                         |
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

## 2. Directory Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── analytics.py
│   │   │       ├── assets.py
│   │   │       ├── diagnostics.py
│   │   │       ├── error_codes.py
│   │   │       ├── feedback.py
│   │   │       ├── health.py
│   │   │       ├── manuals.py
│   │   │       └── router.py
│   │   ├── ai/
│   │   │   └── orchestrator.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── database/
│   │   │   ├── session.py
│   │   │   └── supabase_client.py
│   │   ├── models/
│   │   │   ├── base.py
│   │   │   └── entities.py
│   │   ├── rag/
│   │   │   ├── chunker.py
│   │   │   └── retriever.py
│   │   ├── repositories/
│   │   │   ├── asset_repo.py
│   │   │   ├── base_repo.py
│   │   │   ├── diagnostic_repo.py
│   │   │   ├── feedback_repo.py
│   │   │   └── manual_repo.py
│   │   ├── schemas/
│   │   │   ├── asset.py
│   │   │   ├── common.py
│   │   │   ├── diagnostic.py
│   │   │   ├── error_code.py
│   │   │   ├── feedback.py
│   │   │   ├── manual.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── asset_service.py
│   │   │   ├── diagnostic_service.py
│   │   │   ├── feedback_service.py
│   │   │   ├── manual_service.py
│   │   │   └── storage_service.py
│   │   ├── utils/
│   │   │   ├── exceptions.py
│   │   │   └── logger.py
│   │   ├── vision/
│   │   │   └── analyzer.py
│   │   └── main.py
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBanner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── hooks/
│   │   │   └── useAsync.ts
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── pages/
│   │   │   ├── Analytics.tsx
│   │   │   ├── Assets.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DiagnosticAssistant.tsx
│   │   │   ├── Feedback.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MaintenanceHistory.tsx
│   │   │   ├── ManualLibrary.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── assetService.ts
│   │   │   ├── diagnosticService.ts
│   │   │   ├── feedbackService.ts
│   │   │   └── manualService.ts
│   │   ├── types/
│   │   │   ├── asset.ts
│   │   │   ├── diagnostic.ts
│   │   │   ├── feedback.ts
│   │   │   ├── index.ts
│   │   │   └── manual.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── formatters.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── genai/
│   ├── agents/
│   │   └── technician_agent.py
│   ├── embeddings/
│   │   └── base.py
│   ├── evaluation/
│   │   └── evaluator.py
│   ├── prompts/
│   │   ├── citation_prompt.py
│   │   ├── diagnostic_prompt.py
│   │   └── vision_prompt.py
│   ├── rag/
│   │   └── pipeline.py
│   └── vision/
│       └── inspector.py
├── database/
│   └── schema.sql
├── data/
│   ├── raw/
│   └── processed/
├── docs/
│   ├── api_spec.md
│   ├── architecture.md
│   └── database_schema.md
├── tests/
│   ├── backend/
│   │   └── test_health.py
│   └── frontend/
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 3. Technology Choices

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite | Rapid compile times, strict type safety, modular component hierarchy. |
| **Styling** | Tailwind CSS | Clean, custom enterprise UI design system without third-party theme lock-in. |
| **Backend Framework** | FastAPI (Python 3.11) | High asynchronous throughput, native OpenAPI/Swagger generation, Pydantic v2 validation. |
| **Relational & Vector DB** | Supabase PostgreSQL + `pgvector` | Unified storage for business entities and dense document embeddings with HNSW indexing. |
| **Object Storage** | Supabase Storage | Scalable, access-controlled bucket storage for high-resolution images and PDF manuals. |
| **AI Layer Structure** | Modular GenAI Package | Decoupled prompts, embeddings, multimodal vision analyzer, and RAG evaluation harnesses. |

---

## 4. Database Planning & Entity Relationships

The PostgreSQL database schema is defined in [`database/schema.sql`](database/schema.sql) and includes:
1. **`technicians`**: Field engineers and operators with role/certification profiles.
2. **`assets`**: Industrial machinery with serial numbers, facility locations, and status.
3. **`asset_images`**: Inspection photos and thermal scans linked to assets and technician uploads.
4. **`error_codes`**: Diagnostic Trouble Code (DTC) catalog with standard OEM resolution steps.
5. **`maintenance_records`**: Work order history, root cause analyses, and actions taken.
6. **`manuals`**: Technical PDF manuals and electrical schematics.
7. **`document_chunks`**: Text chunks with `vector(768)` embedding and HNSW cosine similarity index.
8. **`diagnostic_sessions`**: Active troubleshooting sessions opened by field technicians.
9. **`diagnostic_results`**: AI outputs containing hypotheses, step-by-step sequences, safety warnings, and citations.
10. **`technician_feedback`**: Human-in-the-loop ratings and validation logs.

---

## 5. Environment Variables

Create `.env` at root or in `backend/` and `frontend/` using `.env.example`:

```bash
# Application Environment
ENVIRONMENT=development
LOG_LEVEL=INFO
PORT=8000

# Supabase Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres

# AI / LLM Configuration
LLM_PROVIDER=gemini
LLM_API_KEY=your-llm-api-key
LLM_MODEL=gemini-1.5-pro
EMBEDDING_PROVIDER=gemini
EMBEDDING_API_KEY=your-embedding-api-key
EMBEDDING_MODEL=text-embedding-004
EMBEDDING_DIMENSION=768

# Storage Buckets
SUPABASE_STORAGE_BUCKET_IMAGES=equipment-images
SUPABASE_STORAGE_BUCKET_DOCS=manuals-and-docs

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JWT_SECRET_KEY=your-jwt-secret-key
```

---

## 6. How to Run the Backend

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Launch FastAPI development server (from project root)
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
# OR if inside the backend/ folder:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 7. How to Run the Frontend

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env

# 4. Start Vite development server
npm run dev
```
- Frontend UI: [http://localhost:5173](http://localhost:5173)

---

## 8. What is Intentionally NOT Implemented Yet

In strict accordance with the foundation phase requirements:
- **No Mock / Hallucinated AI Responses**: Live LLM reasoning inference and prompt execution are scaffolded as structured interfaces in `backend/app/ai/`, `genai/`, and `backend/app/vision/` ready for active integration.
- **No Fake Data Injection**: The database schema and entities are designed cleanly without inserting artificial mock rows.
- **RAG Text Extraction & Vector Generation Engine**: PDF parsing (`pypdf`), chunking tokenizers, and embedding ingestion pipelines are mapped out as interfaces to be wired to the live LLM API keys in the AI phase.
