"""
Citation extraction and verification prompt templates.
"""

CITATION_VERIFICATION_PROMPT = """Review the generated troubleshooting steps against the retrieved document excerpts.
For each step:
1. Identify the exact document chunk and page number supporting the instruction.
2. If any step is not supported by the context, flag it for safety review.
3. Extract structured citation objects containing: manual_id, document_title, page_number, chunk_id, excerpt, and confidence.
"""
