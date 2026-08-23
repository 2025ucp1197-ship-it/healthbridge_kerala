"""
HealthBridge Kerala - Direct Server Handler Test Suite
Tests HealthBridgeHandler logic and API routing directly inside Python in-memory without TCP socket sandbox restrictions.
"""

import unittest
import json
import io
import sqlite3
import os
import shutil
import tempfile

if 'DATABASE_PATH' not in os.environ:
    _test_dir = tempfile.mkdtemp(prefix='healthbridge-tests-')
    _source_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'healthbridge.db')
    os.environ['DATABASE_PATH'] = os.path.join(_test_dir, 'healthbridge.db')
    shutil.copy2(_source_db, os.environ['DATABASE_PATH'])

from server import HealthBridgeHandler, get_db, generate_mock_clinical_summary
from database import init_database, DB_PATH

class MockServerRequest:
    def __init__(self, method='GET', path='/api/health', body=None):
        self.method = method
        self.path = path
        self.body_bytes = json.dumps(body).encode('utf-8') if body else b''
        self.headers = {
            'Content-Length': str(len(self.body_bytes)),
            'Content-Type': 'application/json'
        }

    def makefile(self, *args, **kwargs):
        if 'r' in args[0] or 'rb' in args[0]:
            return io.BytesIO(self.body_bytes)
        return io.BytesIO()

class MockHandler(HealthBridgeHandler):
    def __init__(self, mock_req):
        self.request = mock_req
        self.client_address = ('127.0.0.1', 8080)
        self.server = None
        self.command = mock_req.method
        self.path = mock_req.path
        self.request_version = 'HTTP/1.1'
        self.headers = mock_req.headers
        self.rfile = io.BytesIO(mock_req.body_bytes)
        self.wfile = io.BytesIO()
        self.response_status = None
        self.response_headers = {}

    def send_response(self, code, message=None):
        self.response_status = code

    def send_header(self, keyword, value):
        self.response_headers[keyword] = value

    def end_headers(self):
        pass

    def get_json_response(self):
        self.wfile.seek(0)
        content = self.wfile.read().decode('utf-8')
        return json.loads(content) if content else {}

class TestHealthBridgeHandler(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_database()

    def test_api_health(self):
        req = MockServerRequest('GET', '/api/health')
        handler = MockHandler(req)
        handler.do_GET()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertEqual(data['status'], 'ok')
        self.assertEqual(data['service'], 'HealthBridge Kerala')

    def test_api_get_worker(self):
        req = MockServerRequest('GET', '/api/workers/KL-MW-10234')
        handler = MockHandler(req)
        handler.do_GET()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['name'], 'Rahul Kumar')
        self.assertEqual(data['data']['blood_group'], 'B+')

    def test_api_emergency_profile(self):
        req = MockServerRequest('GET', '/api/emergency/KL-MW-10234')
        handler = MockHandler(req)
        handler.do_GET()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['emergency_profile']['blood_group'], 'B+')
        self.assertEqual(data['emergency_profile']['allergies'], 'Penicillin')
        self.assertIn('audit_notice', data)

    def test_api_ai_summary(self):
        req = MockServerRequest('POST', '/api/ai/summarize', {'worker_health_id': 'KL-MW-10234'})
        handler = MockHandler(req)
        handler.do_POST()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertTrue('penicillin' in data['ai_summary']['overview'].lower())
        self.assertIn('disclaimer', data)

    def test_api_add_medical_record(self):
        req = MockServerRequest('POST', '/api/records', {
            'worker_health_id': 'KL-MW-10234',
            'doctor_id': 'DOC-1001',
            'doctor_name': 'Dr. Anil Kumar',
            'hospital': 'Government General Hospital, Kochi',
            'diagnosis': 'Seasonal Allergic Rhinitis',
            'medicines': 'Tab Levocetirizine 5mg OD x 5 days',
            'treatment': 'Saline nasal spray'
        })
        handler = MockHandler(req)
        handler.do_POST()
        self.assertEqual(handler.response_status, 201)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['diagnosis'], 'Seasonal Allergic Rhinitis')

    def test_api_register_worker_success(self):
        payload = {
            'name': 'Bikash Mondal',
            'dob': '1995-10-12',
            'age': 30,
            'gender': 'Male',
            'phone': '9812345678',
            'email': 'bikash.mondal@demo.healthbridge.in',
            'govt_id_type': 'Aadhaar Card',
            'govt_id_number': 'XXXX-XXXX-9911',
            'origin_state': 'West Bengal',
            'origin_district': 'Malda',
            'current_address': 'Room 12, Plywood Colony, Perumbavoor',
            'current_district': 'Ernakulam',
            'occupation': 'Plywood Machine Helper',
            'employer_name': 'Greenwood Plywood Mills',
            'workplace_location': 'Perumbavoor Industrial Area',
            'arrival_date': '2024-01-10',
            'language': 'Bengali',
            'blood_group': 'A+',
            'allergies': 'None reported',
            'conditions': 'Mild Acidity',
            'medications': 'None reported',
            'vaccination_status': 'Fully Vaccinated',
            'emergency_name': 'Subrata Mondal',
            'emergency_phone': '+91 98123 00000',
            'emergency_relation': 'Brother',
            'consent_agreed': True
        }
        req = MockServerRequest('POST', '/api/workers', payload)
        handler = MockHandler(req)
        handler.do_POST()
        self.assertEqual(handler.response_status, 201)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertIn('KL-MW-', data['data']['health_id'])
        self.assertEqual(data['data']['name'], 'Bikash Mondal')
        self.assertEqual(data['data']['blood_group'], 'A+')
        self.assertEqual(data['data']['origin_district'], 'Malda')
        self.assertEqual(data['data']['occupation'], 'Plywood Machine Helper')

        # Test Doctor search for this newly registered worker
        new_health_id = data['data']['health_id']
        search_req = MockServerRequest('GET', f'/api/workers?search={new_health_id}')
        search_handler = MockHandler(search_req)
        search_handler.do_GET()
        self.assertEqual(search_handler.response_status, 200)
        search_res = search_handler.get_json_response()
        self.assertTrue(search_res['success'])
        self.assertGreaterEqual(search_res['count'], 1)
        found_ids = [w['health_id'] for w in search_res['data']]
        self.assertIn(new_health_id, found_ids)

    def test_api_doctor_login(self):
        # 1. Valid login
        req = MockServerRequest('POST', '/api/doctor/login', {'doctor_id': 'DOC-101', 'password': 'doctor123'})
        handler = MockHandler(req)
        handler.do_POST()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['doctor']['name'], 'Dr. Anil Kumar')
        self.assertIn('avg_rating', data['doctor'])

        # 2. Invalid password
        bad_req = MockServerRequest('POST', '/api/doctor/login', {'doctor_id': 'DOC-101', 'password': 'wrongpassword'})
        bad_handler = MockHandler(bad_req)
        bad_handler.do_POST()
        self.assertEqual(bad_handler.response_status, 401)
        bad_data = bad_handler.get_json_response()
        self.assertFalse(bad_data['success'])

    def test_api_update_medical_record(self):
        # Update record REC-2026-001
        update_payload = {
            'condition': 'Viral Bronchitis (Resolved)',
            'diagnosis': 'Patient showed complete recovery after course of medication.',
            'medicines': 'Multivitamins once daily x 5 days',
            'treatment': 'Adequate hydration',
            'follow_up_days': 0,
            'notes': 'Normal chest auscultation',
            'status': 'Completed',
            'updated_by_doctor_id': 'DOC-101',
            'updated_by_doctor_name': 'Dr. Anil Kumar'
        }
        req = MockServerRequest('PUT', '/api/records/REC-2026-001', update_payload)
        handler = MockHandler(req)
        handler.do_PUT()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['diagnosis'], 'Patient showed complete recovery after course of medication.')
        self.assertEqual(data['data']['updated_by_doctor_id'], 'DOC-101')

    def test_api_submit_review_and_stats(self):
        # Clean up any past test reviews for REC-2026-TEST-REV
        conn = sqlite3.connect(DB_PATH)
        conn.execute("DELETE FROM doctor_reviews WHERE record_id = 'REC-2026-TEST-REV'")
        conn.commit()
        conn.close()

        review_payload = {
            'doctor_id': 'DOC-103',
            'worker_health_id': 'KL-MW-10234',
            'worker_name': 'Rahul Kumar',
            'record_id': 'REC-2026-TEST-REV',
            'rating': 5,
            'review_text': 'Dr. Rajesh was very careful about my Penicillin allergy and prescribed safe alternatives.'
        }
        req = MockServerRequest('POST', '/api/reviews', review_payload)
        handler = MockHandler(req)
        handler.do_POST()
        self.assertEqual(handler.response_status, 201)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertIn('review_id', data)
        self.assertIn('stats', data)
        self.assertGreaterEqual(data['stats']['avg_rating'], 4.0)

    def test_api_get_doctor_profile(self):
        req = MockServerRequest('GET', '/api/doctors/DOC-101')
        handler = MockHandler(req)
        handler.do_GET()
        self.assertEqual(handler.response_status, 200)
        data = handler.get_json_response()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['doctor_id'], 'DOC-101')
        self.assertIn('reviews', data['data'])
        self.assertIn('avg_rating', data['data'])

if __name__ == '__main__':
    unittest.main()
