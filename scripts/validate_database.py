"""
Database & Supabase Storage Validation Script
Validates:
1. Database connection
2. Asset creation & retrieval
3. Manual creation
4. Error-code creation & retrieval
5. Maintenance record creation & retrieval
6. Diagnostic session creation & retrieval
7. Feedback creation & retrieval
8. Vector search stored function (match_document_chunks) availability
9. Supabase Storage bucket verification & test file upload/deletion
"""

import os
import sys
import uuid
from datetime import datetime, date

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[ERROR] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from environment.")
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def run_validation():
    print("=" * 70)
    print("SUPABASE DATABASE & STORAGE VALIDATION SUITE")
    print(f"Target URL: {SUPABASE_URL}")
    print("=" * 70)

    client = get_client()
    test_run_id = str(uuid.uuid4())[:8]
    test_asset_code = f"TEST-ASSET-{test_run_id}"

    results = {}

    # 1. Database Connection Check
    print("\n[1/10] Testing Database Connection...")
    try:
        res = client.table("assets").select("id").limit(1).execute()
        print("  [SUCCESS] Successfully connected to Supabase PostgreSQL.")
        results["connection"] = True
    except Exception as e:
        print(f"  [FAILED] Connection error: {e}")
        results["connection"] = False

    # 2. Asset Creation
    print("\n[2/10] Testing Asset Creation...")
    created_asset_id = None
    try:
        asset_data = {
            "asset_code": test_asset_code,
            "name": f"Test Chiller Unit {test_run_id}",
            "equipment_type": "Chiller",
            "manufacturer": "Test-OEM-Industries",
            "model": "CH-500X",
            "serial_number": f"SN-{test_run_id}",
            "location": "Test Facility Bay 3",
            "operational_status": "operational",
            "installation_date": str(date.today()),
        }
        res = client.table("assets").insert(asset_data).execute()
        if res.data and len(res.data) > 0:
            created_asset_id = res.data[0]["id"]
            print(f"  [SUCCESS] Asset created with ID: {created_asset_id}")
            results["asset_creation"] = True
        else:
            print("  [FAILED] No data returned from insert.")
            results["asset_creation"] = False
    except Exception as e:
        print(f"  [FAILED] Asset creation error: {e}")
        results["asset_creation"] = False

    # 3. Asset Retrieval
    print("\n[3/10] Testing Asset Retrieval...")
    try:
        res = client.table("assets").select("*").eq("asset_code", test_asset_code).execute()
        if res.data and len(res.data) > 0:
            print(f"  [SUCCESS] Retrieved asset: {res.data[0]['name']} ({res.data[0]['asset_code']})")
            results["asset_retrieval"] = True
        else:
            print("  [FAILED] Asset not found.")
            results["asset_retrieval"] = False
    except Exception as e:
        print(f"  [FAILED] Asset retrieval error: {e}")
        results["asset_retrieval"] = False

    # 4. Manual Creation
    print("\n[4/10] Testing Manual Metadata Creation...")
    created_manual_id = None
    try:
        manual_data = {
            "title": f"Test Operation Manual {test_run_id}",
            "manufacturer": "Test-OEM-Industries",
            "equipment_type": "Chiller",
            "model": "CH-500X",
            "document_type": "oem_manual",
            "storage_path": f"manuals/test_manual_{test_run_id}.pdf",
            "file_name": f"test_manual_{test_run_id}.pdf",
            "processing_status": "pending",
            "page_count": 10
        }
        res = client.table("manuals").insert(manual_data).execute()
        if res.data and len(res.data) > 0:
            created_manual_id = res.data[0]["id"]
            print(f"  [SUCCESS] Manual record created with ID: {created_manual_id}")
            results["manual_creation"] = True
        else:
            print("  [FAILED] No manual data returned.")
            results["manual_creation"] = False
    except Exception as e:
        print(f"  [FAILED] Manual creation error: {e}")
        results["manual_creation"] = False

    # 5. Error Code Creation & Retrieval
    print("\n[5/10] Testing Error-Code Retrieval...")
    test_error_code = f"E-{test_run_id}"
    try:
        ec_data = {
            "equipment_type": "Chiller",
            "manufacturer": "Test-OEM-Industries",
            "code": test_error_code,
            "title": "High Temperature Warning",
            "description": "Temperature exceeded 95 degrees C.",
            "possible_causes": ["Clogged filter", "Low coolant"],
            "recommended_checks": ["Check coolant level", "Inspect intake filter"],
            "safety_warnings": ["Allow unit to cool before servicing"],
            "severity": "warning"
        }
        client.table("error_codes").insert(ec_data).execute()
        res = client.table("error_codes").select("*").eq("code", test_error_code).execute()
        if res.data and len(res.data) > 0:
            print(f"  [SUCCESS] Error code registered and retrieved: {res.data[0]['code']} - {res.data[0]['title']}")
            results["error_code"] = True
        else:
            print("  [FAILED] Error code not retrieved.")
            results["error_code"] = False
    except Exception as e:
        print(f"  [FAILED] Error code test error: {e}")
        results["error_code"] = False

    # 6. Maintenance History Retrieval
    print("\n[6/10] Testing Maintenance Record Insertion & Retrieval...")
    if created_asset_id:
        try:
            maint_data = {
                "asset_id": created_asset_id,
                "maintenance_type": "preventive",
                "issue_description": "Routine quarterly inspection",
                "diagnosis": "All systems nominal",
                "action_taken": "Replaced air filter and lubricated bearings",
                "parts_replaced": [{"part": "Filter-A", "qty": 1}],
                "downtime_minutes": 20,
                "notes": "Unit running at standard operating efficiency."
            }
            client.table("maintenance_records").insert(maint_data).execute()
            res = client.table("maintenance_records").select("*").eq("asset_id", created_asset_id).execute()
            if res.data and len(res.data) > 0:
                print(f"  [SUCCESS] Maintenance record retrieved for asset {created_asset_id}")
                results["maintenance_history"] = True
            else:
                print("  [FAILED] Maintenance record not found.")
                results["maintenance_history"] = False
        except Exception as e:
            print(f"  [FAILED] Maintenance history error: {e}")
            results["maintenance_history"] = False
    else:
        print("  [SKIPPED] No test asset created.")
        results["maintenance_history"] = False

    # 7. Diagnostic Session Creation
    print("\n[7/10] Testing Diagnostic Session Creation...")
    created_session_id = None
    try:
        session_data = {
            "asset_id": created_asset_id,
            "user_question": "Why is the discharge pressure fluctuating abnormally?",
            "status": "pending"
        }
        res = client.table("diagnostic_sessions").insert(session_data).execute()
        if res.data and len(res.data) > 0:
            created_session_id = res.data[0]["id"]
            print(f"  [SUCCESS] Diagnostic session created with ID: {created_session_id}")
            results["diagnostic_session"] = True
        else:
            print("  [FAILED] No diagnostic session data returned.")
            results["diagnostic_session"] = False
    except Exception as e:
        print(f"  [FAILED] Diagnostic session error: {e}")
        results["diagnostic_session"] = False

    # 8. Feedback Creation
    print("\n[8/10] Testing Feedback Creation...")
    if created_session_id:
        try:
            feedback_data = {
                "diagnostic_session_id": created_session_id,
                "rating": 5,
                "feedback_text": "Troubleshooting sequence was accurate and safe.",
                "was_helpful": True,
                "actual_root_cause": "Blocked condenser inlet line."
            }
            res = client.table("technician_feedback").insert(feedback_data).execute()
            if res.data and len(res.data) > 0:
                print(f"  [SUCCESS] Technician feedback logged for session {created_session_id}")
                results["feedback"] = True
            else:
                print("  [FAILED] No feedback data returned.")
                results["feedback"] = False
        except Exception as e:
            print(f"  [FAILED] Feedback logging error: {e}")
            results["feedback"] = False
    else:
        print("  [SKIPPED] No test session created.")
        results["feedback"] = False

    # 9. Vector Search Function Availability
    print("\n[9/10] Testing match_document_chunks RPC Vector Search Function...")
    try:
        dummy_vector = [0.0] * 768
        res = client.rpc(
            "match_document_chunks",
            {
                "query_embedding": dummy_vector,
                "match_threshold": 0.0,
                "match_count": 5
            }
        ).execute()
        print("  [SUCCESS] match_document_chunks RPC function is available and callable.")
        results["vector_search_rpc"] = True
    except Exception as e:
        print(f"  [FAILED/UNINITIALIZED] Vector search RPC check: {e}")
        results["vector_search_rpc"] = False

    # 10. Supabase Storage Buckets & Upload Test
    print("\n[10/10] Testing Supabase Storage Buckets...")
    try:
        # Check buckets
        buckets = client.storage.list_buckets()
        bucket_names = [b.name for b in buckets] if buckets else []
        print(f"  Existing buckets: {bucket_names}")

        # Ensure equipment-images bucket
        if "equipment-images" not in bucket_names:
            try:
                client.storage.create_bucket("equipment-images", options={"public": True})
                print("  [SUCCESS] Created 'equipment-images' bucket.")
            except Exception as be:
                print(f"  Note on creating equipment-images: {be}")

        # Ensure manuals-and-docs bucket
        if "manuals-and-docs" not in bucket_names:
            try:
                client.storage.create_bucket("manuals-and-docs", options={"public": False})
                print("  [SUCCESS] Created 'manuals-and-docs' bucket.")
            except Exception as be:
                print(f"  Note on creating manuals-and-docs: {be}")

        # Test upload / remove in equipment-images
        test_file_path = f"test_validations/ping_{test_run_id}.txt"
        test_content = b"Storage connectivity test payload"
        client.storage.from_("equipment-images").upload(test_file_path, test_content, file_options={"content-type": "text/plain"})
        print(f"  [SUCCESS] Test file uploaded to storage: {test_file_path}")

        # Clean up test file
        client.storage.from_("equipment-images").remove([test_file_path])
        print("  [SUCCESS] Test file removed from storage.")
        results["storage"] = True
    except Exception as e:
        print(f"  [FAILED] Storage check error: {e}")
        results["storage"] = False

    # Clean up test database rows
    print("\nCleaning up test-only records...")
    try:
        if created_asset_id:
            client.table("assets").delete().eq("id", created_asset_id).execute()
        if created_manual_id:
            client.table("manuals").delete().eq("id", created_manual_id).execute()
        if test_error_code:
            client.table("error_codes").delete().eq("code", test_error_code).execute()
        print("  [SUCCESS] Test cleanup completed.")
    except Exception as e:
        print(f"  Note during cleanup: {e}")

    print("\n" + "=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)
    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        print(f"  {test_name.ljust(25)} : {status}")
    print("=" * 70)

if __name__ == "__main__":
    run_validation()
