-- ==============================================================================
-- MULTIMODAL FIELD-SERVICE MAINTENANCE ASSISTANT
-- Production Database Schema for Supabase PostgreSQL + pgvector + Storage
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Automatic Timestamp Update Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. TECHNICIANS / USERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'technician' CHECK (role IN ('technician', 'senior_technician', 'supervisor', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_technicians_email ON technicians(email);
CREATE INDEX IF NOT EXISTS idx_technicians_role ON technicians(role);
CREATE INDEX IF NOT EXISTS idx_technicians_created_at ON technicians(created_at);

DROP TRIGGER IF EXISTS set_technicians_timestamp ON technicians;
CREATE TRIGGER set_technicians_timestamp
BEFORE UPDATE ON technicians
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 2. ASSETS / EQUIPMENT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    model VARCHAR(150) NOT NULL,
    serial_number VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    operational_status VARCHAR(50) NOT NULL DEFAULT 'operational' CHECK (operational_status IN ('operational', 'degraded', 'critical', 'under_maintenance', 'decommissioned')),
    installation_date DATE,
    last_maintenance_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_asset_code ON assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_assets_equipment_type ON assets(equipment_type);
CREATE INDEX IF NOT EXISTS idx_assets_manufacturer ON assets(manufacturer);
CREATE INDEX IF NOT EXISTS idx_assets_operational_status ON assets(operational_status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);

DROP TRIGGER IF EXISTS set_assets_timestamp ON assets;
CREATE TRIGGER set_assets_timestamp
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. ASSET IMAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS asset_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
    image_type VARCHAR(50) NOT NULL DEFAULT 'inspection' CHECK (image_type IN ('nameplate', 'overall', 'component', 'damage', 'thermal', 'inspection')),
    analysis_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asset_images_asset_id ON asset_images(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_images_technician_id ON asset_images(technician_id);
CREATE INDEX IF NOT EXISTS idx_asset_images_image_type ON asset_images(image_type);
CREATE INDEX IF NOT EXISTS idx_asset_images_created_at ON asset_images(created_at);

-- ==============================================================================
-- 4. ERROR CODE DATABASE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS error_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    code VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    possible_causes JSONB DEFAULT '[]'::jsonb,
    recommended_checks JSONB DEFAULT '[]'::jsonb,
    safety_warnings JSONB DEFAULT '[]'::jsonb,
    severity VARCHAR(50) NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical', 'fatal')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_error_code_mfg UNIQUE (code, manufacturer)
);

CREATE INDEX IF NOT EXISTS idx_error_codes_code ON error_codes(code);
CREATE INDEX IF NOT EXISTS idx_error_codes_equipment_type ON error_codes(equipment_type);
CREATE INDEX IF NOT EXISTS idx_error_codes_manufacturer ON error_codes(manufacturer);
CREATE INDEX IF NOT EXISTS idx_error_codes_severity ON error_codes(severity);
CREATE INDEX IF NOT EXISTS idx_error_codes_created_at ON error_codes(created_at);

DROP TRIGGER IF EXISTS set_error_codes_timestamp ON error_codes;
CREATE TRIGGER set_error_codes_timestamp
BEFORE UPDATE ON error_codes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. MAINTENANCE RECORDS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    maintenance_type VARCHAR(100) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'emergency', 'inspection', 'calibration')),
    issue_description TEXT,
    diagnosis TEXT,
    action_taken TEXT NOT NULL,
    parts_replaced JSONB DEFAULT '[]'::jsonb,
    downtime_minutes INTEGER DEFAULT 0,
    maintenance_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_records_asset_id ON maintenance_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_technician_id ON maintenance_records(technician_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_maintenance_type ON maintenance_records(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_maintenance_date ON maintenance_records(maintenance_date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_created_at ON maintenance_records(created_at);

-- ==============================================================================
-- 6. MANUALS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS manuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    model VARCHAR(150),
    document_type VARCHAR(100) NOT NULL DEFAULT 'oem_manual' CHECK (document_type IN ('oem_manual', 'service_bulletin', 'schematic', 'sop', 'troubleshooting_guide', 'parts_catalog')),
    storage_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'indexed', 'failed')),
    page_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES technicians(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_manuals_equipment_type ON manuals(equipment_type);
CREATE INDEX IF NOT EXISTS idx_manuals_manufacturer ON manuals(manufacturer);
CREATE INDEX IF NOT EXISTS idx_manuals_model ON manuals(model);
CREATE INDEX IF NOT EXISTS idx_manuals_processing_status ON manuals(processing_status);
CREATE INDEX IF NOT EXISTS idx_manuals_uploaded_by ON manuals(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_manuals_created_at ON manuals(created_at);

DROP TRIGGER IF EXISTS set_manuals_timestamp ON manuals;
CREATE TRIGGER set_manuals_timestamp
BEFORE UPDATE ON manuals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. DOCUMENT CHUNKS (RAG & PGVECTOR 768-DIM)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manual_id UUID NOT NULL REFERENCES manuals(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_manual_id ON document_chunks(manual_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_page_number ON document_chunks(page_number);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_created_at ON document_chunks(created_at);

-- HNSW Vector Index for Cosine Distance Search
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding_hnsw 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ==============================================================================
-- 8. VECTOR SEARCH STORED FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(768),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    manual_id UUID,
    content TEXT,
    page_number INT,
    metadata JSONB,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.manual_id,
        dc.content,
        dc.page_number,
        dc.metadata,
        (1 - (dc.embedding <=> query_embedding))::float AS similarity
    FROM document_chunks dc
    WHERE dc.embedding IS NOT NULL
      AND (1 - (dc.embedding <=> query_embedding)) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ==============================================================================
-- 9. DIAGNOSTIC SESSIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS diagnostic_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    user_question TEXT NOT NULL,
    image_id UUID REFERENCES asset_images(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_diag_sessions_asset_id ON diagnostic_sessions(asset_id);
CREATE INDEX IF NOT EXISTS idx_diag_sessions_technician_id ON diagnostic_sessions(technician_id);
CREATE INDEX IF NOT EXISTS idx_diag_sessions_image_id ON diagnostic_sessions(image_id);
CREATE INDEX IF NOT EXISTS idx_diag_sessions_status ON diagnostic_sessions(status);
CREATE INDEX IF NOT EXISTS idx_diag_sessions_created_at ON diagnostic_sessions(created_at);

-- ==============================================================================
-- 10. DIAGNOSTIC RESULTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS diagnostic_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
    issue_summary TEXT NOT NULL,
    identified_error_code VARCHAR(100),
    confidence NUMERIC(5, 4),
    probable_causes JSONB DEFAULT '[]'::jsonb,
    recommended_steps JSONB DEFAULT '[]'::jsonb,
    required_tools JSONB DEFAULT '[]'::jsonb,
    safety_warnings JSONB DEFAULT '[]'::jsonb,
    citations JSONB DEFAULT '[]'::jsonb,
    model_name VARCHAR(100),
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diag_results_session_id ON diagnostic_results(diagnostic_session_id);
CREATE INDEX IF NOT EXISTS idx_diag_results_error_code ON diagnostic_results(identified_error_code);
CREATE INDEX IF NOT EXISTS idx_diag_results_created_at ON diagnostic_results(created_at);

-- ==============================================================================
-- 11. TECHNICIAN FEEDBACK
-- ==============================================================================
CREATE TABLE IF NOT EXISTS technician_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    was_helpful BOOLEAN NOT NULL,
    actual_root_cause TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tech_feedback_session_id ON technician_feedback(diagnostic_session_id);
CREATE INDEX IF NOT EXISTS idx_tech_feedback_technician_id ON technician_feedback(technician_id);
CREATE INDEX IF NOT EXISTS idx_tech_feedback_rating ON technician_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_tech_feedback_created_at ON technician_feedback(created_at);

-- ==============================================================================
-- 12. STORAGE BUCKET INITIALIZATION & PERMISSIONS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('equipment-images', 'equipment-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
    ('manuals-and-docs', 'manuals-and-docs', false, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_feedback ENABLE ROW LEVEL SECURITY;

-- 13.1 Service Role Policy (Full Access for Backend Service-Role Key)
CREATE POLICY "Service Role Full Access technicians" ON technicians FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access assets" ON assets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access asset_images" ON asset_images FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access error_codes" ON error_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access maintenance_records" ON maintenance_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access manuals" ON manuals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access document_chunks" ON document_chunks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access diagnostic_sessions" ON diagnostic_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access diagnostic_results" ON diagnostic_results FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access technician_feedback" ON technician_feedback FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 13.2 Read-Only Policies for Authenticated/Public Users where appropriate
CREATE POLICY "Allow authenticated read on assets" ON assets FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on error_codes" ON error_codes FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on manuals" ON manuals FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on maintenance_records" ON maintenance_records FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on technicians" ON technicians FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on asset_images" ON asset_images FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on diagnostic_sessions" ON diagnostic_sessions FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on diagnostic_results" ON diagnostic_results FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated read on technician_feedback" ON technician_feedback FOR SELECT TO authenticated, anon USING (true);
