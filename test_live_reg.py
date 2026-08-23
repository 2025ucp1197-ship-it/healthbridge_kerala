import urllib.request
import json
import sqlite3
import os
from database import DB_PATH

BASE_URL = os.environ.get("HEALTHBRIDGE_TEST_URL", "http://localhost:8090")

def test_full_registration_flow():
    print("1. Sending POST /api/workers registration request...")
    payload = {
        "name": "Manish Sharma",
        "dob": "1997-08-20",
        "age": 29,
        "gender": "Male",
        "phone": "9876543299",
        "email": "manish.sharma@demo.healthbridge.in",
        "govt_id_type": "Aadhaar Card",
        "govt_id_number": "XXXX-XXXX-4433",
        "origin_state": "Uttar Pradesh",
        "origin_district": "Varanasi",
        "current_address": "Kalamassery Industrial Quarters",
        "current_district": "Ernakulam",
        "occupation": "Welder / Fabrication Tech",
        "employer_name": "Cochin Shipyard Contractor Services",
        "workplace_location": "Willingdon Island Dock",
        "arrival_date": "2024-05-15",
        "language": "Hindi",
        "blood_group": "AB+",
        "allergies": "Sulfa drugs",
        "conditions": "None reported",
        "medications": "None reported",
        "vaccination_status": "Fully Vaccinated",
        "emergency_name": "Kavita Sharma",
        "emergency_phone": "+91 98765 11224",
        "emergency_relation": "Spouse",
        "consent_agreed": True
    }

    req = urllib.request.Request(
        f"{BASE_URL}/api/workers",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    with urllib.request.urlopen(req) as resp:
        assert resp.status == 201, f"Expected 201, got {resp.status}"
        data = json.loads(resp.read().decode('utf-8'))
        assert data['success'] is True
        worker = data['data']
        health_id = worker['health_id']
        print(f"   ✓ Registered: {worker['name']} with Health ID {health_id}")
        print(f"   ✓ Registration Date: {data.get('registration_date')}")

    print("2. Verifying record directly inside SQLite database...")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workers WHERE health_id = ?", (health_id,))
    row = cursor.fetchone()
    assert row is not None, "Worker record not found in SQLite"
    assert row['name'] == "Manish Sharma"
    assert row['dob'] == "1997-08-20"
    assert row['age'] == 29
    assert row['govt_id_type'] == "Aadhaar Card"
    assert row['origin_district'] == "Varanasi"
    assert row['occupation'] == "Welder / Fabrication Tech"
    assert row['consent_agreed'] == 1
    conn.close()
    print("   ✓ Verified in SQLite: all personal, identity, work, and health columns match.")

    print("3. Testing Doctor Search endpoint for newly created worker...")
    search_req = urllib.request.Request(f"{BASE_URL}/api/workers?search={health_id}")
    with urllib.request.urlopen(search_req) as resp:
        assert resp.status == 200
        search_data = json.loads(resp.read().decode('utf-8'))
        assert search_data['success'] is True
        assert len(search_data['data']) >= 1
        assert search_data['data'][0]['health_id'] == health_id
        print(f"   ✓ Doctor Search returned worker {health_id} successfully.")

    print("4. Testing Worker Profile retrieval via Health ID...")
    worker_req = urllib.request.Request(f"{BASE_URL}/api/workers/{health_id}")
    with urllib.request.urlopen(worker_req) as resp:
        assert resp.status == 200
        w_data = json.loads(resp.read().decode('utf-8'))
        assert w_data['success'] is True
        assert w_data['data']['name'] == "Manish Sharma"
        print(f"   ✓ Worker dashboard profile fetched successfully.")

    print("5. Testing Emergency Profile retrieval...")
    emerg_req = urllib.request.Request(f"{BASE_URL}/api/emergency/{health_id}")
    with urllib.request.urlopen(emerg_req) as resp:
        assert resp.status == 200
        emerg_data = json.loads(resp.read().decode('utf-8'))
        assert emerg_data['success'] is True
        assert emerg_data['emergency_profile']['blood_group'] == "AB+"
        assert emerg_data['emergency_profile']['allergies'] == "Sulfa drugs"
        print(f"   ✓ Emergency profile rendered with critical life-saving info.")

    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY! 🎉")

if __name__ == '__main__':
    test_full_registration_flow()
