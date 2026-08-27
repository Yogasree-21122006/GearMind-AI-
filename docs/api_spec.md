# API Specification (REST v1)

## Base URL
`/api/v1`

---

## Endpoints Summary

### Health & System Status
- `GET /health` -> `{ status: "ok", timestamp: "...", environment: "...", database: "connected" }`
- `GET /system/info` -> System capabilities and version details.

### Assets & Equipment Management
- `GET /assets` -> List equipment with filtering (category, status, facility).
- `POST /assets` -> Register a new asset tag/equipment profile.
- `GET /assets/{asset_id}` -> Retrieve detailed asset profile, specifications, and linked manuals.
- `PUT /assets/{asset_id}` -> Update asset status, location, or metadata.
- `DELETE /assets/{asset_id}` -> Decommission/remove asset.
- `POST /assets/{asset_id}/images` -> Upload and associate inspection image.
- `GET /assets/{asset_id}/images` -> List inspection images for asset.

### Technical Manuals & Documents
- `GET /manuals` -> List uploaded technical manuals and indexing status.
- `POST /manuals/upload` -> Upload manual PDF, record metadata, trigger parsing.
- `GET /manuals/{manual_id}` -> Retrieve manual details & processing status.
- `POST /manuals/{manual_id}/reindex` -> Re-trigger text extraction & vector embedding.

### Error Codes
- `GET /error-codes` -> Search error codes by code string, manufacturer, or keyword.
- `POST /error-codes` -> Add a new error code definition to fault catalog.
- `GET /error-codes/{code}` -> Get error code details, resolution steps, and safety hazards.

### Maintenance History
- `GET /maintenance-records` -> Retrieve maintenance history logs.
- `POST /maintenance-records` -> Log a completed work order / maintenance entry.

### Diagnostics & AI Assistant
- `GET /diagnostics/sessions` -> List past diagnostic sessions.
- `POST /diagnostics/sessions` -> Initiate a new troubleshooting session.
- `GET /diagnostics/sessions/{session_id}` -> Retrieve session history and results.
- `POST /diagnostics/sessions/{session_id}/query` -> Submit technician query + optional image ID for multimodal RAG analysis.
- `POST /diagnostics/vision/inspect` -> Dedicated endpoint for image inspection and anomaly classification.

### Technician Feedback & Quality
- `POST /feedback` -> Submit feedback for a diagnostic result (rating, accuracy, safety, actual fix).
- `GET /feedback/stats` -> Aggregate quality metrics and satisfaction rates.

### Analytics & Reports
- `GET /analytics/dashboard` -> High-level asset health metrics, active fault breakdown, MTTR indicators.
