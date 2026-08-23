"""
HealthBridge Kerala - Database Schema & Demo Data Seeder
SQLite-based database for prototype/hackathon demonstration.
Contains fictional safe demo records aligned with Kerala Migrant Health Context.
"""

import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.abspath(os.environ.get('DATA_DIR', os.path.join(BASE_DIR, 'data')))
DB_PATH = os.path.abspath(os.environ.get('DATABASE_PATH', os.path.join(DB_DIR, 'healthbridge.db')))

def hash_password(password, salt=None):
    """Hash password with PBKDF2-HMAC-SHA256 and salt."""
    if not password:
        password = 'defaultpassword'
    if not salt:
        salt = secrets.token_hex(8)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    return f"pbkdf2:sha256:100000${salt}${pwd_hash}"

def verify_password(password, stored_hash):
    """Verify password against stored PBKDF2 hash or legacy plaintext."""
    if not stored_hash or not password:
        return False
    # Backward compatibility with plaintext in legacy/demo entries
    if stored_hash == password:
        return True
    if stored_hash.startswith("pbkdf2:sha256:"):
        try:
            parts = stored_hash.split('$')
            iterations = int(parts[0].split(':')[2])
            salt = parts[1]
            expected_hash = parts[2]
            pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations).hex()
            return secrets.compare_digest(pwd_hash, expected_hash)
        except Exception:
            return False
    return False

def get_next_doctor_id(conn):
    """Generate next unique sequential Doctor ID (e.g. DOC-1001, DOC-1002)."""
    cursor = conn.cursor()
    cursor.execute("SELECT doctor_id FROM doctors WHERE doctor_id LIKE 'DOC-%'")
    rows = cursor.fetchall()
    nums = []
    for r in rows:
        did = r[0]
        try:
            num_part = int(did.replace('DOC-', ''))
            nums.append(num_part)
        except ValueError:
            pass
    if nums:
        next_num = max(max(nums) + 1, 1001)
    else:
        next_num = 1001
    return f"DOC-{next_num}"

def get_next_health_worker_id(conn):
    """Generate next unique sequential Health Worker ID (e.g. HW-1001, HW-1002)."""
    cursor = conn.cursor()
    cursor.execute("SELECT worker_id FROM health_workers WHERE worker_id LIKE 'HW-%'")
    rows = cursor.fetchall()
    nums = []
    for r in rows:
        wid = r[0]
        try:
            num_part = int(wid.replace('HW-', ''))
            nums.append(num_part)
        except ValueError:
            pass
    if nums:
        next_num = max(max(nums) + 1, 1001)
    else:
        next_num = 1001
    return f"HW-{next_num}"

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def migrate_database_schema(conn):
    """Ensure any newly added columns exist in older database files without breaking data."""
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS personal_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT UNIQUE NOT NULL,
        worker_health_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT,
        document_data TEXT,
        patient_note TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (worker_health_id) REFERENCES workers (health_id)
    )''')
    
    # 1. Workers table migration
    cursor.execute("PRAGMA table_info(workers)")
    worker_columns = [row[1] for row in cursor.fetchall()]

    new_worker_columns = [
        ('dob', 'TEXT DEFAULT "1998-01-01"'),
        ('email', 'TEXT'),
        ('password', f"TEXT DEFAULT '{hash_password('patient123')}'"),
        ('photo_url', 'TEXT'),
        ('govt_id_type', 'TEXT DEFAULT "Aadhaar Card"'),
        ('govt_id_number', 'TEXT DEFAULT "XXXX-XXXX-1234"'),
        ('origin_district', 'TEXT DEFAULT "Patna"'),
        ('current_address', 'TEXT DEFAULT "Labour Camp, Kaloor, Kochi"'),
        ('occupation', 'TEXT DEFAULT "Construction Worker"'),
        ('employer_name', 'TEXT DEFAULT "Kerala Infrastructure Builders Ltd"'),
        ('workplace_location', 'TEXT DEFAULT "Kochi Metro Site"'),
        ('arrival_date', 'TEXT DEFAULT "2025-06-01"'),
        ('consent_agreed', 'INTEGER DEFAULT 1')
    ]

    for col_name, col_def in new_worker_columns:
        if col_name not in worker_columns:
            try:
                cursor.execute(f"ALTER TABLE workers ADD COLUMN {col_name} {col_def}")
            except Exception as e:
                print(f"Migration notice for workers.{col_name}: {e}")

    # 2. Doctors table migration
    cursor.execute("PRAGMA table_info(doctors)")
    doctor_columns = [row[1] for row in cursor.fetchall()]
    new_doctor_columns = [
        ('password', f"TEXT DEFAULT '{hash_password('doctor123')}'"),
        ('status', 'TEXT DEFAULT "Active"'),
        ('photo_url', 'TEXT')
    ]
    for col_name, col_def in new_doctor_columns:
        if col_name not in doctor_columns:
            try:
                cursor.execute(f"ALTER TABLE doctors ADD COLUMN {col_name} {col_def}")
            except Exception as e:
                print(f"Migration notice for doctors.{col_name}: {e}")

    # 3. Medical records table migration
    cursor.execute("PRAGMA table_info(medical_records)")
    record_columns = [row[1] for row in cursor.fetchall()]
    new_record_columns = [
        ('doctor_id', 'TEXT DEFAULT "DOC-101"'),
        ('updated_at', 'TEXT'),
        ('updated_by_doctor_id', 'TEXT'),
        ('updated_by_doctor_name', 'TEXT')
    ]
    for col_name, col_def in new_record_columns:
        if col_name not in record_columns:
            try:
                cursor.execute(f"ALTER TABLE medical_records ADD COLUMN {col_name} {col_def}")
            except Exception as e:
                print(f"Migration notice for medical_records.{col_name}: {e}")

    # 4. Health Workers table creation & seeding if needed
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS health_workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        center_name TEXT NOT NULL,
        designation TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        photo_url TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TEXT NOT NULL
    )
    ''')

    # Seed baseline health workers if empty
    cursor.execute("SELECT COUNT(*) FROM health_workers")
    if cursor.fetchone()[0] == 0:
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        hw_data = [
            ('HW-1001', 'Suma K.', 'Ernakulam', 'Primary Health Centre, Kalamassery', 'Community Health Officer (CHO)', '+91 94475 55011', 'suma.k@keralahealth.gov.in', hash_password('doctor123'), 'Active', None, now_str),
            ('HW-1002', 'Anjali R.', 'Ernakulam', 'Taluk Hospital, Aluva', 'Migrant Camp Field Nurse', '+91 94475 55022', 'anjali.r@keralahealth.gov.in', hash_password('doctor123'), 'Active', None, now_str),
            ('HW-1003', 'Biju Mathew', 'Ernakulam', 'General Hospital, Kochi', 'Public Health Inspector (PHI)', '+91 94475 55033', 'biju.m@keralahealth.gov.in', hash_password('doctor123'), 'Active', None, now_str)
        ]
        cursor.executemany('''
        INSERT INTO health_workers (worker_id, name, district, center_name, designation, phone, email, password, status, photo_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', hw_data)

    # Seed standard DOC-1001 to DOC-1004 aliases if not present
    std_docs = [
        ('DOC-1001', 'Dr. Anil Kumar', 'Government General Hospital, Kochi', 'General Medicine & Occupational Health', 'Ernakulam', '+91 94471 10022', 'dr.anilkumar@keralahealth.gov.in', hash_password('doctor123'), 'Active', None),
        ('DOC-1002', 'Dr. Meera Nair', 'District Hospital, Aluva', 'Pulmonology & Respiratory Care', 'Ernakulam', '+91 94472 22033', 'dr.meeranair@keralahealth.gov.in', hash_password('doctor123'), 'Active', None),
        ('DOC-1003', 'Dr. Rajesh Varma', 'Primary Health Centre, Kalamassery', 'Community Medicine & Preventative Care', 'Ernakulam', '+91 94473 33044', 'dr.rajeshvarma@keralahealth.gov.in', hash_password('doctor123'), 'Active', None),
        ('DOC-1004', 'Dr. Fatima Beevi', 'Taluk Hospital, Perumbavoor', 'Emergency Medicine & Trauma Care', 'Ernakulam', '+91 94474 44055', 'dr.fatimabeevi@keralahealth.gov.in', hash_password('doctor123'), 'Active', None)
    ]
    for doc in std_docs:
        cursor.execute("SELECT 1 FROM doctors WHERE doctor_id = ?", (doc[0],))
        if not cursor.fetchone():
            cursor.execute('''
            INSERT INTO doctors (doctor_id, name, hospital, specialization, district, phone, email, password, status, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', doc)

    # Ensure doctor_id is backfilled for seeded records if null
    try:
        cursor.execute("UPDATE medical_records SET doctor_id = 'DOC-101' WHERE doctor_id IS NULL OR doctor_id = ''")
    except Exception:
        pass

    # Transparently upgrade legacy/demo plaintext credentials without resetting data.
    for table in ('workers', 'doctors', 'health_workers', 'admins'):
        cursor.execute(f"SELECT id, password FROM {table}")
        for row in cursor.fetchall():
            stored = row['password'] if isinstance(row, sqlite3.Row) else row[1]
            if stored and not stored.startswith('pbkdf2:sha256:'):
                cursor.execute(f"UPDATE {table} SET password = ? WHERE id = ?", (hash_password(stored), row['id'] if isinstance(row, sqlite3.Row) else row[0]))

    seed_public_demo_accounts(cursor)

    conn.commit()

def seed_public_demo_accounts(cursor):
    """Create stable, fictional public prototype accounts without modifying existing rows."""
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    demo_password = 'Demo@1234'

    cursor.execute("SELECT 1 FROM workers WHERE health_id = ?", ('KL-MW-DEMO1',))
    if not cursor.fetchone():
        cursor.execute('''INSERT INTO workers
            (health_id,name,dob,age,gender,phone,email,password,govt_id_type,govt_id_number,
             origin_state,origin_district,current_address,current_district,occupation,employer_name,
             workplace_location,arrival_date,language,blood_group,allergies,conditions,medications,
             vaccination_status,emergency_name,emergency_phone,emergency_relation,consent_agreed,photo_url,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', (
            'KL-MW-DEMO1', 'Demo Worker', '1995-06-15', 31, 'Other', '+91 90000 00001',
            'worker.demo@example.invalid', hash_password(demo_password), 'Prototype ID', 'DEMO-ONLY-0001',
            'Demo State', 'Demo District', 'Prototype Worker Residence', 'Ernakulam',
            'Prototype Tester', 'Fictional Demo Employer', 'Demo Site, Kochi', '2026-01-01',
            'English', 'O+', 'None recorded', 'None recorded', 'None recorded', 'Demo record only',
            'Demo Emergency Contact', '+91 90000 00002', 'Demo contact', 1, None, now_str
        ))

    cursor.execute("SELECT 1 FROM doctors WHERE doctor_id = ?", ('DOC-DEMO1',))
    if not cursor.fetchone():
        cursor.execute('''INSERT INTO doctors
            (doctor_id,name,hospital,specialization,district,phone,email,password,status,photo_url)
            VALUES (?,?,?,?,?,?,?,?,?,?)''', (
            'DOC-DEMO1', 'Dr. Demo Clinician', 'HealthBridge Prototype Clinic',
            'Prototype Clinical Testing', 'Ernakulam', '+91 90000 00003',
            'doctor.demo@example.invalid', hash_password(demo_password), 'Active', None
        ))

    cursor.execute("SELECT 1 FROM health_workers WHERE worker_id = ?", ('HW-DEMO1',))
    if not cursor.fetchone():
        cursor.execute('''INSERT INTO health_workers
            (worker_id,name,district,center_name,designation,phone,email,password,status,photo_url,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)''', (
            'HW-DEMO1', 'Demo Health Worker', 'Ernakulam', 'HealthBridge Prototype Centre',
            'Prototype Health Worker', '+91 90000 00004', 'healthworker.demo@example.invalid',
            hash_password(demo_password), 'Active', None, now_str
        ))

    cursor.execute("SELECT 1 FROM admins WHERE admin_id = ?", ('ADMIN-DEMO1',))
    if not cursor.fetchone():
        cursor.execute('''INSERT INTO admins (admin_id,name,password,status,created_at)
                          VALUES (?,?,?,?,?)''', (
            'ADMIN-DEMO1', 'HealthBridge Demo Administrator', hash_password(demo_password), 'Active', now_str
        ))

def init_database():
    """Create all tables and seed with initial realistic demo data if empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Workers Table with Complete Personal, Identity, Work, Health, and Consent details
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        health_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        dob TEXT,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        password TEXT DEFAULT 'patient123',
        govt_id_type TEXT,
        govt_id_number TEXT,
        origin_state TEXT NOT NULL,
        origin_district TEXT,
        current_address TEXT,
        current_district TEXT NOT NULL,
        occupation TEXT,
        employer_name TEXT,
        workplace_location TEXT,
        arrival_date TEXT,
        language TEXT NOT NULL,
        blood_group TEXT NOT NULL,
        allergies TEXT,
        conditions TEXT,
        medications TEXT,
        vaccination_status TEXT,
        emergency_name TEXT NOT NULL,
        emergency_phone TEXT NOT NULL,
        emergency_relation TEXT NOT NULL,
        consent_agreed INTEGER DEFAULT 1,
        photo_url TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    # 2. Doctors Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        hospital TEXT NOT NULL,
        specialization TEXT NOT NULL,
        district TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT DEFAULT 'doctor123',
        status TEXT DEFAULT 'Active',
        photo_url TEXT
    )
    ''')

    # 3. Medical Records Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        record_id TEXT UNIQUE NOT NULL,
        worker_health_id TEXT NOT NULL,
        doctor_id TEXT DEFAULT 'DOC-101',
        doctor_name TEXT NOT NULL,
        hospital TEXT NOT NULL,
        visit_date TEXT NOT NULL,
        condition TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        medicines TEXT NOT NULL,
        treatment TEXT,
        follow_up_days INTEGER DEFAULT 0,
        notes TEXT,
        status TEXT DEFAULT 'Completed',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        updated_by_doctor_id TEXT,
        updated_by_doctor_name TEXT,
        FOREIGN KEY (worker_health_id) REFERENCES workers (health_id)
    )
    ''')

    # 4. Consents Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS consents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consent_id TEXT UNIQUE NOT NULL,
        worker_health_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        hospital TEXT NOT NULL,
        purpose TEXT NOT NULL,
        access_scope TEXT NOT NULL,
        status TEXT NOT NULL, -- 'pending', 'granted', 'denied', 'revoked', 'expired'
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (worker_health_id) REFERENCES workers (health_id)
    )
    ''')

    # 5. Health Camps Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS health_camps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        camp_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        district TEXT NOT NULL,
        camp_date TEXT NOT NULL,
        organizer TEXT NOT NULL,
        target_group TEXT NOT NULL,
        total_screened INTEGER DEFAULT 0
    )
    ''')

    # 6. Screenings Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS screenings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        screening_id TEXT UNIQUE NOT NULL,
        worker_health_id TEXT NOT NULL,
        camp_id TEXT,
        camp_name TEXT NOT NULL,
        screening_date TEXT NOT NULL,
        blood_pressure TEXT NOT NULL,
        blood_sugar TEXT NOT NULL,
        height_cm REAL NOT NULL,
        weight_kg REAL NOT NULL,
        bmi REAL NOT NULL,
        vision TEXT DEFAULT '6/6',
        vaccination_status TEXT DEFAULT 'Fully Vaccinated',
        notes TEXT,
        status TEXT DEFAULT 'Normal',
        FOREIGN KEY (worker_health_id) REFERENCES workers (health_id)
    )
    ''')

    # 7. Audit Logs Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        log_id TEXT UNIQUE NOT NULL,
        user_name TEXT NOT NULL,
        role TEXT NOT NULL, -- 'Worker', 'Doctor', 'Admin', 'Emergency Responder'
        action TEXT NOT NULL,
        target_resource TEXT NOT NULL,
        status TEXT NOT NULL, -- 'Authorized', 'Emergency Override', 'Granted', 'Denied', 'Success'
        timestamp TEXT NOT NULL,
        ip_address TEXT DEFAULT '127.0.0.1'
    )
    ''')

    # 8. Doctor Patient Reviews Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctor_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review_id TEXT UNIQUE NOT NULL,
        doctor_id TEXT NOT NULL,
        worker_health_id TEXT NOT NULL,
        worker_name TEXT NOT NULL,
        record_id TEXT,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(worker_health_id, record_id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id),
        FOREIGN KEY (worker_health_id) REFERENCES workers (health_id)
    )
    ''')

    conn.commit()

    # Migrate any existing tables if needed
    migrate_database_schema(conn)

    # Check if demo data needs seeding
    cursor.execute('SELECT COUNT(*) FROM workers')
    count = cursor.fetchone()[0]

    if count == 0:
        seed_demo_data(cursor)
        conn.commit()
    else:
        # Seed initial doctor reviews if not present
        seed_reviews_if_needed(cursor)
        conn.commit()

    conn.close()

    conn.close()

def seed_demo_data(cursor):
    """Seed comprehensive realistic mock data for Kerala Migrant Worker healthcare context."""
    now = datetime.now()

    # 1. Seed Workers
    workers_data = [
        (
            'KL-MW-10234',
            'Rahul Kumar',
            '1998-05-14',
            28,
            'Male',
            '+91 98765 43210',
            'rahul.kumar.demo@healthbridge.in',
            'Aadhaar Card',
            'XXXX-XXXX-8921',
            'Bihar',
            'Patna',
            'Room 14, Metro Worker Camp, Kaloor, Kochi',
            'Ernakulam',
            'Construction Steel Fixer',
            'L&T Metro Construction Kochi',
            'Kaloor Metro Viaduct Site',
            '2024-03-10',
            'Hindi',
            'B+',
            'Penicillin',
            'Asthma (Mild intermittent)',
            'Salbutamol Inhaler (100 mcg as needed)',
            'Fully Vaccinated (COVID-19 2 Doses + Booster, Tetanus 2025)',
            'Priya Kumar',
            '+91 98765 00112',
            'Spouse',
            1,
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            (now - timedelta(days=90)).strftime('%Y-%m-%d %H:%M:%S')
        ),
        (
            'KL-MW-20451',
            'Arjun Das',
            '1992-08-22',
            34,
            'Male',
            '+91 98451 23456',
            'arjun.das.demo@healthbridge.in',
            'Voter ID',
            'WB/24/109/482910',
            'West Bengal',
            'Murshidabad',
            'Plywood Workers Colony, Perumbavoor',
            'Ernakulam',
            'Plywood Machine Operator',
            'Malabar Wood Industries Pvt Ltd',
            'Perumbavoor Industrial Zone',
            '2023-11-15',
            'Bengali',
            'O+',
            'None reported',
            'Primary Hypertension',
            'Amlodipine 5mg once daily',
            'Fully Vaccinated',
            'Bikram Das',
            '+91 98451 99887',
            'Brother',
            1,
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            (now - timedelta(days=120)).strftime('%Y-%m-%d %H:%M:%S')
        ),
        (
            'KL-MW-30912',
            'Mohan Singh',
            '1985-03-10',
            41,
            'Male',
            '+91 97123 88990',
            'mohan.singh.demo@healthbridge.in',
            'Aadhaar Card',
            'XXXX-XXXX-4512',
            'Uttar Pradesh',
            'Gorakhpur',
            'Railway Goods Shed Quarters, Aluva',
            'Ernakulam',
            'Logistics / Freight Handler',
            'Southern Logistics Express',
            'Aluva Railway Yard',
            '2022-09-01',
            'Hindi',
            'A+',
            'Sulfa drugs, Dust allergy',
            'Type 2 Diabetes Mellitus',
            'Metformin 500mg BD',
            'Partially Vaccinated (Tetanus booster due)',
            'Sunita Devi',
            '+91 97123 11223',
            'Spouse',
            1,
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            (now - timedelta(days=60)).strftime('%Y-%m-%d %H:%M:%S')
        )
    ]

    cursor.executemany('''
    INSERT INTO workers (
        health_id, name, dob, age, gender, phone, email, govt_id_type, govt_id_number,
        origin_state, origin_district, current_address, current_district,
        occupation, employer_name, workplace_location, arrival_date,
        language, blood_group, allergies, conditions, medications,
        vaccination_status, emergency_name, emergency_phone, emergency_relation,
        consent_agreed, photo_url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', workers_data)

    # 2. Seed Doctors
    doctors_data = [
        (
            'DOC-101',
            'Dr. Anil Kumar',
            'Government General Hospital, Kochi',
            'General Medicine & Occupational Health',
            'Ernakulam',
            '+91 94471 10022',
            'dr.anilkumar@keralahealth.gov.in',
            'doctor123'
        ),
        (
            'DOC-102',
            'Dr. Meera Nair',
            'District Hospital, Aluva',
            'Pulmonology & Respiratory Care',
            'Ernakulam',
            '+91 94472 22033',
            'dr.meeranair@keralahealth.gov.in',
            'doctor123'
        ),
        (
            'DOC-103',
            'Dr. Rajesh Varma',
            'Primary Health Centre, Kalamassery',
            'Community Medicine & Preventative Care',
            'Ernakulam',
            '+91 94473 33044',
            'dr.rajeshvarma@keralahealth.gov.in',
            'doctor123'
        ),
        (
            'DOC-104',
            'Dr. Fatima Beevi',
            'Taluk Hospital, Perumbavoor',
            'Emergency Medicine & Trauma Care',
            'Ernakulam',
            '+91 94474 44055',
            'dr.fatimabeevi@keralahealth.gov.in',
            'doctor123'
        )
    ]

    cursor.executemany('''
    INSERT INTO doctors (
        doctor_id, name, hospital, specialization, district, phone, email, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', doctors_data)

    # 3. Seed Health Camps
    camps_data = [
        (
            'CAMP-2026-01',
            'Kochi Metro Labour Colony Health Screening Camp',
            'Jawaharlal Nehru International Stadium Complex, Kaloor',
            'Ernakulam',
            '2026-03-02',
            'National Health Mission (NHM) Kerala & Kochi Metro Rail Ltd',
            'Construction & Infrastructure Workers',
            184
        ),
        (
            'CAMP-2026-02',
            'Perumbavoor Plywood & Timber Cluster Free Health Drive',
            'Municipal Town Hall, Perumbavoor',
            'Ernakulam',
            '2026-04-12',
            'Kerala State Migrant Welfare Board & Department of Health',
            'Industrial & Plywood Factory Workers',
            245
        ),
        (
            'CAMP-2026-03',
            'Aluva Railway & Logistics Worker Wellness Camp',
            'Railway Community Centre, Aluva',
            'Ernakulam',
            '2026-05-20',
            'Indian Medical Association (IMA) Kochi & Southern Railway',
            'Railway, Porter & Loading Workers',
            132
        )
    ]

    cursor.executemany('''
    INSERT INTO health_camps (
        camp_id, name, location, district, camp_date, organizer, target_group, total_screened
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', camps_data)

    # 4. Seed Medical Records for Rahul Kumar (KL-MW-10234)
    records_data = [
        (
            'REC-2026-001',
            'KL-MW-10234',
            'DOC-101',
            'Dr. Anil Kumar',
            'Government General Hospital, Kochi',
            '2026-01-15',
            'Acute Viral Fever & Upper Respiratory Tract Infection',
            'Viral fever with mild dehydration and throat congestion. Vitals stable.',
            'Tab Paracetamol 650mg TDS x 3 days, Tab Cetirizine 10mg OD x 3 days, ORS sachets',
            'Rest advised for 2 days, adequate hydration, return if fever persists > 3 days',
            3,
            'Patient presented with high grade fever (101.4 F) and myalgia. Lungs clear.',
            'Completed',
            '2026-01-15 11:30:00',
            None,
            None,
            None
        ),
        (
            'REC-2026-002',
            'KL-MW-10234',
            'DOC-103',
            'Dr. Rajesh Varma',
            'Primary Health Centre, Kalamassery',
            '2026-05-18',
            'Minor Workplace Laceration (Right Forearm)',
            'Superficial laceration (approx 3.5 cm) on right anterior forearm sustained at construction site. No tendon or nerve involvement.',
            'Tetanus Toxoid (TT) 0.5ml IM stat, Tab Amoxicillin-Clavulanate avoided due to Penicillin Allergy -> Prescribed Tab Azithromycin 500mg OD x 3 days, Tab Aceclofenac-Paracetamol BD x 3 days',
            'Wound cleansed with Betadine, sterile surgical dressing applied. Dressing change scheduled in 48 hours.',
            7,
            'Highlighted Penicillin allergy on prescription. Advised worker to keep wound dry during bath.',
            'Completed',
            '2026-05-18 15:45:00',
            None,
            None,
            None
        ),
        (
            'REC-2026-003',
            'KL-MW-10234',
            'DOC-102',
            'Dr. Meera Nair',
            'District Hospital, Aluva',
            '2026-07-22',
            'Seasonal Bronchospasm / Asthma Exacerbation',
            'Mild wheezing on bilateral lung auscultation triggered by monsoon cement dust exposure. SpO2 97% on room air.',
            'Salbutamol Metered Dose Inhaler (MDI) 100mcg 2 puffs SOS with Spacer, Syrup Levosalbutamol + Ambroxol 5ml TDS x 5 days',
            'Demonstrated proper MDI spacer inhalation technique. Advised using N95 dust mask at worksite.',
            14,
            'Worker understands asthma trigger avoidance. Advised review if nocturnal cough increases.',
            'Completed',
            '2026-07-22 10:15:00',
            None,
            None,
            None
        )
    ]

    cursor.executemany('''
    INSERT INTO medical_records (
        record_id, worker_health_id, doctor_id, doctor_name, hospital, visit_date,
        condition, diagnosis, medicines, treatment, follow_up_days, notes, status, created_at,
        updated_at, updated_by_doctor_id, updated_by_doctor_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', records_data)

    # 5. Seed Health Screenings
    screenings_data = [
        (
            'SCR-2026-101',
            'KL-MW-10234',
            'CAMP-2026-01',
            'Kochi Metro Labour Colony Health Screening Camp',
            '2026-03-02',
            '128/82 mmHg',
            '96 mg/dL (Random)',
            172.0,
            67.5,
            22.8,
            '6/6 (Normal)',
            'Fully Vaccinated',
            'Vitals within normal limits. BMI 22.8 kg/m² (Healthy range). Chest auscultation clear.',
            'Normal'
        )
    ]

    cursor.executemany('''
    INSERT INTO screenings (
        screening_id, worker_health_id, camp_id, camp_name, screening_date,
        blood_pressure, blood_sugar, height_cm, weight_kg, bmi, vision,
        vaccination_status, notes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', screenings_data)

    # 6. Seed Consents
    consents_data = [
        (
            'CON-2026-001',
            'KL-MW-10234',
            'DOC-101',
            'Dr. Anil Kumar',
            'Government General Hospital, Kochi',
            'Clinical Consultation & General Health Review',
            'Medical History, Prescriptions, Lab Reports',
            'granted',
            (now - timedelta(hours=4)).strftime('%Y-%m-%d %H:%M:%S'),
            (now + timedelta(hours=20)).strftime('%Y-%m-%d %H:%M:%S')
        )
    ]

    cursor.executemany('''
    INSERT INTO consents (
        consent_id, worker_health_id, doctor_id, doctor_name, hospital,
        purpose, access_scope, status, created_at, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', consents_data)

    # 7. Seed Audit Logs
    audit_data = [
        (
            'LOG-1001',
            'Dr. Anil Kumar',
            'Doctor',
            'Viewed medical history & active prescriptions',
            'KL-MW-10234 (Rahul Kumar)',
            'Authorized',
            (now - timedelta(hours=3, minutes=40)).strftime('%Y-%m-%d %H:%M:%S'),
            '10.0.4.12'
        ),
        (
            'LOG-1002',
            'Rahul Kumar',
            'Worker',
            'Granted 24-hour access consent to Dr. Anil Kumar',
            'CON-2026-001',
            'Granted',
            (now - timedelta(hours=4)).strftime('%Y-%m-%d %H:%M:%S'),
            '192.168.1.45'
        )
    ]

    cursor.executemany('''
    INSERT INTO audit_logs (
        log_id, user_name, role, action, target_resource, status, timestamp, ip_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', audit_data)

    # 8. Seed Initial Doctor Reviews
    seed_reviews_if_needed(cursor)

def seed_reviews_if_needed(cursor):
    """Seed initial realistic patient reviews for doctors if table is empty."""
    cursor.execute('SELECT COUNT(*) FROM doctor_reviews')
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        demo_reviews = [
            (
                'REV-1001',
                'DOC-101',
                'KL-MW-10234',
                'Rahul Kumar',
                'REC-2026-001',
                5,
                'Dr. Anil explained everything in Hindi very clearly and gave the right medicines for viral fever. Felt much better in 2 days.',
                (now - timedelta(days=25)).strftime('%Y-%m-%d %H:%M:%S')
            ),
            (
                'REV-1002',
                'DOC-102',
                'KL-MW-20451',
                'Arjun Das',
                None,
                5,
                'Dr. Meera is very patient and explained asthma inhaler technique properly in simple language.',
                (now - timedelta(days=18)).strftime('%Y-%m-%d %H:%M:%S')
            ),
            (
                'REV-1003',
                'DOC-103',
                'KL-MW-30912',
                'Mohan Singh',
                None,
                4,
                'Good consultation at PHC Kalamassery, minimal waiting time and careful allergy checking.',
                (now - timedelta(days=12)).strftime('%Y-%m-%d %H:%M:%S')
            ),
            (
                'REV-1004',
                'DOC-104',
                'KL-MW-20451',
                'Arjun Das',
                None,
                5,
                'Quick emergency attention for wound dressing. Very reassuring staff.',
                (now - timedelta(days=5)).strftime('%Y-%m-%d %H:%M:%S')
            )
        ]
        cursor.executemany('''
        INSERT INTO doctor_reviews (
            review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', demo_reviews)

if __name__ == '__main__':
    init_database()
    print(f"Database initialized and migrated successfully at: {DB_PATH}")
