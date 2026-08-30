# ⚙️ GearMind AI — Multimodal Field-Service Maintenance Assistant

<p align="center">
  <img src="frontend/public/logo.png" width="130" alt="GearMind AI Logo" />
</p>

<p align="center">
  <b>Diagnose Machinery Problems Before They Become Downtime.</b><br />
  An enterprise-grade, multimodal AI copilot built for industrial field-service technicians to diagnose equipment failures, perform image/sensor inspections, retrieve OEM manuals via RAG, and execute safety-verified troubleshooting workflows.
</p>

<p align="center">
  <a href="https://gear-mind-ai-delta.vercel.app/"><img src="https://img.shields.io/badge/🚀_Live_Production_Demo-gear--mind--ai--delta.vercel.app-00DC82?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <br /><br />
  <img src="https://img.shields.io/badge/Developer-Yoga%20Sree%20S-FF6B00?style=flat-square&logo=github&logoColor=white" alt="Developer">
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-3178C6?style=flat-square" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=flat-square&logo=fastapi&logoColor=white" alt="Backend">
  <img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20%2B%20pgvector-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Database">
  <img src="https://img.shields.io/badge/AI_Engine-Gemini%201.5%20Pro%20%7C%20Vision%20%7C%20Embeddings-8E75B2?style=flat-square&logo=google&logoColor=white" alt="AI Engine">
</p>

---

## 🌐 Live Deployment

| Component | URL | Status |
| :--- | :--- | :--- |
| **Production Web Application** | **[https://gear-mind-ai-delta.vercel.app/](https://gear-mind-ai-delta.vercel.app/)** | 🟢 **Live & Active** |
| **Authentication Flow** | Supported with **Secure Email Confirmation** via Custom SMTP | 🟢 **Active** |

---

## 👨‍💻 Developer & Author

- **Lead Developer**: **Yoga Sree S**
- **Project**: GearMind AI — Field Service Maintenance Platform

---

## 🚀 Key Features & System Capabilities

### 1. 🔍 Multimodal Diagnostic Assistant Cockpit
- **Interactive Multi-Turn Reasoning**: Field technicians input machine symptoms, error codes, and operational telemetry.
- **Multimodal Visual Inspection**: Upload equipment photos, thermal images, nameplates, and gauge dials for automated defect detection, OCR extraction, and wear assessment.
- **Root Cause & Confidence Scoring**: Outputs structured fault hypotheses with percentage confidence and severity ratings.

### 2. 📚 RAG (Retrieval-Augmented Generation) & OEM Manual Grounding
- **Dense Vector Search**: Powered by `pgvector` with HNSW cosine similarity search.
- **Page-Level Manual Citations**: Every diagnostic recommendation cites exact page numbers, section headers, and OEM manuals (e.g. *Flowserve Mark 3 Pump Manual, Section 5.4*).
- **Anti-Hallucination Guardrails**: Cross-references symptoms directly with technical documentation before generating guidance.

### 3. 🛡️ Safety-First Verification & LOTO Protocols
- **Pre-Execution Safety Verification**: Enforces Lockout/Tagout (LOTO), electrical hazard isolation, PPE compliance, and pressure relief checks prior to repair steps.
- **Warning & Hazard Alerts**: Color-coded safety tags (High/Medium/Low) prevent accidental technician injury and machine damage.

### 4. 🔐 Enterprise Authentication & Email Verification Flow
- **Supabase Authentication**: Secure JWT-based auth supporting multi-role access (`technician`, `senior_engineer`, `supervisor`, `admin`).
- **Real-Time Email Confirmation**: Custom SMTP delivery with dedicated confirmation verification screen (`/email-confirmed`).
- **Self-Service Password Recovery**: Secure password reset flow with token-based authentication.

### 5. 🏭 Asset Inventory & Fleet Health Tracking
- **Equipment Registry**: Real-time management of pumps, compressors, turbines, motors, and conveyor systems.
- **Operational Metrics**: Visual status badges (Operational, Warning, Critical, Offline), serial numbers, and maintenance schedules.
- **QR / Barcode Identification**: Quick lookup for field assets.

### 6. 📊 GenAI Evaluation Dashboard & Analytics
- **Evaluation Metrics**: Faithfulness, Answer Relevance, Context Precision, and Hallucination Index scoring.
- **Interactive Visualizations**: Radar capability charts, latency distribution histograms, and diagnostic accuracy trends.
- **Exportable Reports**: Generate detailed audit reports for safety leads and maintenance supervisors.

### 7. 📝 Human-in-the-Loop Feedback Engine
- **Field Engineer Ratings**: Technicians can upvote/downvote AI diagnostic steps, confirm root cause accuracy, and log field adjustments.
- **Continuous Learning Loop**: Feedback metrics directly inform prompt refinement and knowledge retrieval updates.

---

## 🏗️ System Architecture

```
+---------------------------------------------------------------------------------+
|                                 WEB FRONTEND                                    |
|  React 18 + TypeScript + Vite + Tailwind CSS                                    |
|  - Modern Dark / Clean Enterprise Glassmorphism UI                              |
|  - Diagnostic Assistant & Multimodal Vision Inspector                           |
|  - Asset Catalog, Manual Library, Analytics & Evaluation Dashboard              |
|  - Secure Auth with Real-Time SMTP Email Confirmation Flow                      |
+----------------------------------------+----------------------------------------+
                                         | REST API / JSON / Multipart
                                         v
+---------------------------------------------------------------------------------+
|                                FASTAPI BACKEND                                  |
|  - Modular API Routers: `/api/v1/diagnostics`, `/assets`, `/manuals`, etc.      |
|  - Pydantic v2 Strict Validation & Data Layer Repositories                      |
|  - Service Orchestration & Vision Analysis Pipeline                             |
+----------------------------------------+----------------------------------------+
                    |                                         |
                    v                                         v
+----------------------------------------+   +------------------------------------+
|       SUPABASE POSTGRESQL CLOUD        |   |       MULTIMODAL AI & RAG          |
|  - Relational Schema & Tables          |   |  - Google Gemini 1.5 Pro Vision    |
|  - pgvector HNSW Vector Indexing       |   |  - Text Embeddings (768-dim)       |
|  - Secure Object Storage for Manuals   |   |  - RAG Retrieval & Context Scoring |
|  - Custom SMTP Mail Dispatcher         |   |  - Safety Verification Engine      |
+----------------------------------------+   +------------------------------------+
```

---

## 📁 Repository Directory Structure

```
.
├── backend/                              # FastAPI Python Backend Service
│   ├── app/
│   │   ├── ai/                           # AI Orchestrator & Agents
│   │   │   └── orchestrator.py
│   │   ├── api/                          # Versioned API Endpoints (v1)
│   │   │   └── v1/
│   │   │       ├── analytics.py          # Fleet analytics & metrics
│   │   │       ├── assets.py             # Asset management CRUD
│   │   │       ├── diagnostics.py        # Diagnostic sessions & RAG query
│   │   │       ├── error_codes.py        # DTC error code catalog
│   │   │       ├── feedback.py           # Human feedback logging
│   │   │       ├── health.py             # Health check probe
│   │   │       ├── manuals.py            # PDF manual upload & processing
│   │   │       └── router.py             # Main v1 API aggregator
│   │   ├── core/                         # Configuration & Security
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── database/                     # DB session & Supabase Client
│   │   │   ├── session.py
│   │   │   └── supabase_client.py
│   │   ├── models/                       # SQLAlchemy Database Entities
│   │   │   ├── base.py
│   │   │   └── entities.py
│   │   ├── rag/                          # Text Chunker & Vector Retriever
│   │   │   ├── chunker.py
│   │   │   └── retriever.py
│   │   ├── repositories/                 # Data Access Object (DAO) Pattern
│   │   │   ├── asset_repo.py
│   │   │   ├── base_repo.py
│   │   │   ├── diagnostic_repo.py
│   │   │   ├── feedback_repo.py
│   │   │   └── manual_repo.py
│   │   ├── schemas/                      # Pydantic Request/Response Models
│   │   │   ├── asset.py
│   │   │   ├── common.py
│   │   │   ├── diagnostic.py
│   │   │   ├── error_code.py
│   │   │   ├── feedback.py
│   │   │   ├── manual.py
│   │   │   └── user.py
│   │   ├── services/                     # Business Logic Services
│   │   │   ├── asset_service.py
│   │   │   ├── diagnostic_service.py
│   │   │   ├── feedback_service.py
│   │   │   ├── manual_service.py
│   │   │   └── storage_service.py
│   │   ├── utils/                        # Custom Exceptions & Logging
│   │   │   ├── exceptions.py
│   │   │   └── logger.py
│   │   ├── vision/                       # Image & OCR Analyzer
│   │   │   └── analyzer.py
│   │   └── main.py                       # FastAPI Application Entrypoint
│   ├── .env.example                      # Template for backend environment variables
│   ├── Dockerfile
│   └── requirements.txt                  # Python dependencies
│
├── frontend/                             # React 18 TypeScript Web Application
│   ├── src/
│   │   ├── assets/                       # Static branding & images
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── AlertBanner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── context/                      # State Management (AuthContext, etc.)
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/                        # Custom React Hooks
│   │   │   └── useAsync.ts
│   │   ├── layouts/                      # Layout Shells (AuthLayout, MainLayout)
│   │   │   ├── AuthLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── lib/                          # Third-party Clients (Supabase)
│   │   │   └── supabase.ts
│   │   ├── pages/                        # Application Views & Pages
│   │   │   ├── Analytics.tsx             # Performance metrics & reports
│   │   │   ├── Assets.tsx                # Industrial machine inventory
│   │   │   ├── Dashboard.tsx             # Technician overview cockpit
│   │   │   ├── DiagnosticAssistant.tsx   # AI Copilot & step-by-step troubleshooter
│   │   │   ├── EmailConfirmed.tsx        # Email activation success screen
│   │   │   ├── EvaluationDashboard.tsx   # GenAI RAG evaluation & radar benchmarks
│   │   │   ├── Feedback.tsx              # Diagnostic rating & validation
│   │   │   ├── ForgotPassword.tsx        # Password reset initiation
│   │   │   ├── ImageUpload.tsx           # Multimodal inspection & OCR
│   │   │   ├── LandingPage.tsx           # Product showcase landing page
│   │   │   ├── Login.tsx                 # Technician authentication
│   │   │   ├── MaintenanceHistory.tsx    # Past repairs & service logs
│   │   │   ├── ManualLibrary.tsx         # OEM manuals & schematic library
│   │   │   ├── ResetPassword.tsx         # New password submission
│   │   │   ├── Settings.tsx              # User preferences & profile
│   │   │   └── SignUp.tsx                # User registration & verification
│   │   ├── services/                     # Frontend API Clients
│   │   │   ├── api.ts
│   │   │   ├── assetService.ts
│   │   │   ├── diagnosticService.ts
│   │   │   ├── feedbackService.ts
│   │   │   └── manualService.ts
│   │   ├── types/                        # TypeScript Type Definitions
│   │   │   ├── asset.ts
│   │   │   ├── diagnostic.ts
│   │   │   ├── feedback.ts
│   │   │   ├── index.ts
│   │   │   └── manual.ts
│   │   ├── utils/                        # Helpers, Formatters & Constants
│   │   │   ├── constants.ts
│   │   │   └── formatters.ts
│   │   ├── App.tsx                       # App Router & Auth State Controller
│   │   ├── index.css                     # Global styles & Tailwind utilities
│   │   └── main.tsx                      # Vite React entrypoint
│   ├── .env.example                      # Template for frontend environment variables
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── genai/                                # GenAI Core Engine
│   ├── agents/                           # Multi-agent autonomous technician solver
│   │   └── technician_agent.py
│   ├── embeddings/                       # Embedding generators
│   │   └── base.py
│   ├── evaluation/                       # RAG & hallucination evaluation suite
│   │   └── evaluator.py
│   ├── prompts/                          # System prompts & safety templates
│   │   ├── citation_prompt.py
│   │   ├── diagnostic_prompt.py
│   │   └── vision_prompt.py
│   ├── rag/                              # Ingestion & chunking pipeline
│   │   └── pipeline.py
│   └── vision/                           # Visual defect classifier & OCR
│       └── inspector.py
│
├── database/                             # Database Schema & Migrations
│   └── schema.sql                        # PostgreSQL table DDL & pgvector configuration
├── docs/                                 # Technical Documentation
│   ├── api_spec.md                       # OpenAPI route specifications
│   ├── architecture.md                   # System design & component diagrams
│   ├── authentication-implementation.md  # Auth flow & email confirmation docs
│   └── database_schema.md                # Entity relationship documentation
├── scripts/                              # Integration & verification scripts
│   └── run_demo_integration.py           # End-to-end integration demo script
├── tests/                                # Test Suites
│   ├── backend/
│   └── frontend/
├── docker-compose.yml                    # Multi-container orchestration
└── README.md                             # Project Documentation
```

---

## 🛠️ Local Development Setup

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 2. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```
- Local Web Interface: [http://localhost:5173](http://localhost:5173)

---

## 📄 License & Attribution

Developed with ❤️ by **Yoga Sree S** for industrial field technicians and engineering teams.  
All rights reserved © 2026 GearMind AI.
