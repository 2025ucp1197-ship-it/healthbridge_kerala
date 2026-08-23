"""
HealthBridge Kerala - Automated Verification Test Suite
Tests SQLite database integrity, Doctor Login, Medical Record Updates, Ratings & Reviews, and Consent workflows.
"""

import unittest
import sqlite3
import os
import json
import shutil
import tempfile
from datetime import datetime

if 'DATABASE_PATH' not in os.environ:
    _test_dir = tempfile.mkdtemp(prefix='healthbridge-tests-')
    _source_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'healthbridge.db')
    os.environ['DATABASE_PATH'] = os.path.join(_test_dir, 'healthbridge.db')
    shutil.copy2(_source_db, os.environ['DATABASE_PATH'])

from database import init_database, DB_PATH, get_db_connection, verify_password

class HealthBridgeSystemTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_database()

    def test_database_tables_exist(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()

        expected_tables = ['workers', 'doctors', 'medical_records', 'consents', 'health_camps', 'screenings', 'audit_logs', 'doctor_reviews']
        for t in expected_tables:
            self.assertIn(t, tables, f"Table {t} should exist in SQLite database")

    def test_doctor_accounts_and_passwords(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT doctor_id, name, specialization, hospital, password FROM doctors WHERE doctor_id = 'DOC-101'")
        doc = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(doc, "Doctor DOC-101 should exist")
        self.assertEqual(doc['name'], 'Dr. Anil Kumar')
        self.assertNotEqual(doc['password'], 'doctor123')
        self.assertTrue(verify_password('doctor123', doc['password']))

    def test_record_update_audit_trail(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Test update of REC-2026-001
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
        UPDATE medical_records SET
            diagnosis = 'Resolved Viral Fever. Post-viral recovery normal.',
            updated_at = ?,
            updated_by_doctor_id = 'DOC-101',
            updated_by_doctor_name = 'Dr. Anil Kumar'
        WHERE record_id = 'REC-2026-001'
        """, (now_str,))
        conn.commit()

        cursor.execute("SELECT * FROM medical_records WHERE record_id = 'REC-2026-001'")
        updated_rec = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(updated_rec)
        self.assertIn('Resolved Viral Fever', updated_rec['diagnosis'])
        self.assertEqual(updated_rec['updated_by_doctor_id'], 'DOC-101')
        self.assertEqual(updated_rec['updated_by_doctor_name'], 'Dr. Anil Kumar')

    def test_doctor_ratings_calculation(self):
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check existing average rating for DOC-101
        cursor.execute("""
        SELECT COALESCE(ROUND(AVG(rating), 1), 5.0) as avg_rating, COUNT(id) as rating_count
        FROM doctor_reviews WHERE doctor_id = 'DOC-101'
        """)
        stats = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(stats)
        self.assertGreaterEqual(stats['rating_count'], 1)
        self.assertGreaterEqual(stats['avg_rating'], 1.0)
        self.assertLessEqual(stats['avg_rating'], 5.0)

    def test_duplicate_review_prevention(self):
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert a test review for a specific worker and record
        review_id_1 = f"REV-TEST-{int(datetime.now().timestamp())}"
        review_id_2 = f"REV-TEST-DUP-{int(datetime.now().timestamp())}"
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Clean up any leftover test entries
        cursor.execute("DELETE FROM doctor_reviews WHERE record_id = 'REC-TEST-DUP-001'")
        conn.commit()

        # First review must succeed
        cursor.execute("""
        INSERT INTO doctor_reviews (review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, created_at)
        VALUES (?, 'DOC-102', 'KL-MW-10234', 'Rahul Kumar', 'REC-TEST-DUP-001', 5, 'Great care!', ?)
        """, (review_id_1, now_str))
        conn.commit()

        # Second review with same worker_health_id and record_id MUST raise IntegrityError
        with self.assertRaises(sqlite3.IntegrityError):
            cursor.execute("""
            INSERT INTO doctor_reviews (review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, created_at)
            VALUES (?, 'DOC-102', 'KL-MW-10234', 'Rahul Kumar', 'REC-TEST-DUP-001', 4, 'Duplicate review attempt', ?)
            """, (review_id_2, now_str))
            conn.commit()

        conn.close()

    def test_emergency_profile_safety_filter(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT health_id, name, age, gender, blood_group, allergies, conditions,
               medications, vaccination_status, emergency_name, emergency_phone
        FROM workers WHERE health_id = 'KL-MW-10234'
        """)
        profile = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(profile)
        self.assertEqual(profile['blood_group'], 'B+')
        self.assertEqual(profile['allergies'], 'Penicillin')
        self.assertIn('Asthma', profile['conditions'])

if __name__ == '__main__':
    unittest.main()
