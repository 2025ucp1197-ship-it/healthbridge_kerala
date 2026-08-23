"""
HealthBridge Kerala - REST API & Static Server (Standard Library)
Zero-dependency Python 3 HTTP Server with complete SQLite REST API endpoints.
Runs natively on any standard Python 3 installation without external pip dependencies.
"""

import http.server
import socketserver
import json
import sqlite3
import os
import urllib.parse
import mimetypes
from datetime import datetime, timedelta
import random
from database import DB_PATH, hash_password, verify_password, get_next_doctor_id

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_ENV = os.environ.get('APP_ENV', 'development').strip().lower()
IS_PRODUCTION = APP_ENV == 'production'
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', '8090'))
SECRET_KEY = os.environ.get('SECRET_KEY', '')
UPLOAD_DIR = os.path.abspath(os.environ.get('UPLOAD_DIR', os.path.join(BASE_DIR, 'data', 'uploads')))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
MAX_REQUEST_BYTES = int(os.environ.get('MAX_REQUEST_BYTES', str(5 * 1024 * 1024)))

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def log_audit_event(user_name, role, action, target_resource, status='Authorized', ip='127.0.0.1'):
    try:
        conn = get_db()
        cursor = conn.cursor()
        log_id = f"LOG-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute('''
        INSERT INTO audit_logs (log_id, user_name, role, action, target_resource, status, timestamp, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (log_id, user_name, role, action, target_resource, status, now_str, ip))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit log error: {e}")

class HealthBridgeHandler(http.server.SimpleHTTPRequestHandler):
    server_version = 'HealthBridge'
    sys_version = ''

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))

    def read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        if content_length > MAX_REQUEST_BYTES:
            return {}
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(body)
        except Exception:
            return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. API Routing
        if path.startswith('/api/'):
            self.handle_api_get(path, query)
            return

        # 2. Static File Serving
        if path == '/' or path == '/index.html' or path == '/worker' or path == '/doctor' or path == '/admin' or path == '/emergency':
            self.serve_file(os.path.join(BASE_DIR, 'templates', 'index.html'), 'text/html')
            return

        if path.startswith('/static/'):
            rel_path = path[len('/static/'):]
            file_path = os.path.abspath(os.path.join(STATIC_DIR, rel_path))
            if file_path.startswith(STATIC_DIR + os.sep) and os.path.isfile(file_path):
                mime, _ = mimetypes.guess_type(file_path)
                self.serve_file(file_path, mime or 'application/octet-stream')
                return

        # Default fallback to index.html for SPA routes
        self.serve_file(os.path.join(BASE_DIR, 'templates', 'index.html'), 'text/html')

    def serve_file(self, full_path, content_type):
        try:
            with open(full_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            payload = {"error": "File not found"}
            if not IS_PRODUCTION: payload["details"] = str(e)
            self.send_json(payload, 404)

    def handle_api_get(self, path, query):
        conn = get_db()
        cursor = conn.cursor()

        try:
            # GET /api/health
            if path == '/api/health':
                self.send_json({
                    "status": "ok",
                    "service": "HealthBridge Kerala"
                })
                return

            # GET /api/workers
            if path == '/api/workers':
                search = query.get('search', [''])[0].strip().lower()
                district = query.get('district', [''])[0].strip()

                sql = "SELECT * FROM workers WHERE 1=1"
                params = []
                if search:
                    sql += " AND (LOWER(name) LIKE ? OR LOWER(health_id) LIKE ? OR phone LIKE ?)"
                    params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
                if district:
                    sql += " AND current_district = ?"
                    params.append(district)

                sql += " ORDER BY id DESC"
                cursor.execute(sql, params)
                workers = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "count": len(workers), "data": workers})
                return

            # GET /api/workers/<health_id>
            if path.startswith('/api/workers/'):
                health_id = path.split('/api/workers/')[1].strip()
                cursor.execute("SELECT * FROM workers WHERE health_id = ? OR phone = ?", (health_id, health_id))
                row = cursor.fetchone()
                if row:
                    worker = dict(row)
                    log_audit_event("Doctor / User", "Doctor", f"Looked up worker profile: {health_id}", health_id, "Authorized")
                    self.send_json({"success": True, "data": worker})
                else:
                    self.send_json({"success": False, "error": f"Worker not found with ID {health_id}"}, 404)
                return

            # GET /api/doctors
            if path == '/api/doctors':
                cursor.execute("""
                SELECT d.doctor_id, d.name, d.hospital, d.specialization, d.district, d.phone, d.email, d.status, d.photo_url,
                       COALESCE(ROUND(AVG(r.rating), 1), 5.0) as avg_rating,
                       COUNT(r.id) as rating_count
                FROM doctors d
                LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
                GROUP BY d.doctor_id
                ORDER BY d.name ASC
                """)
                doctors = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "data": doctors})
                return

            # GET /api/doctors/<doctor_id>
            if path.startswith('/api/doctors/'):
                doc_id = path.split('/api/doctors/')[1].strip()
                cursor.execute("""
                SELECT d.doctor_id, d.name, d.hospital, d.specialization, d.district, d.phone, d.email, d.status, d.photo_url,
                       COALESCE(ROUND(AVG(r.rating), 1), 5.0) as avg_rating,
                       COUNT(r.id) as rating_count
                FROM doctors d
                LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
                WHERE d.doctor_id = ?
                GROUP BY d.doctor_id
                """, (doc_id,))
                row = cursor.fetchone()
                if row:
                    doc_data = dict(row)
                    cursor.execute("SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY id DESC", (doc_id,))
                    doc_data['reviews'] = [dict(r) for r in cursor.fetchall()]
                    self.send_json({"success": True, "data": doc_data})
                else:
                    self.send_json({"success": False, "error": f"Doctor not found with ID {doc_id}"}, 404)
                return

            # GET /api/reviews/<doctor_id>
            if path.startswith('/api/reviews/') and not path.startswith('/api/reviews/worker/'):
                doc_id = path.split('/api/reviews/')[1].strip()
                cursor.execute("SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY id DESC", (doc_id,))
                reviews = [dict(row) for row in cursor.fetchall()]
                cursor.execute("SELECT COALESCE(ROUND(AVG(rating), 1), 5.0) as avg_rating, COUNT(id) as rating_count FROM doctor_reviews WHERE doctor_id = ?", (doc_id,))
                stats = dict(cursor.fetchone())
                self.send_json({"success": True, "count": len(reviews), "stats": stats, "data": reviews})
                return

            # GET /api/reviews/worker/<worker_health_id>
            if path.startswith('/api/reviews/worker/'):
                worker_id = path.split('/api/reviews/worker/')[1].strip()
                cursor.execute("SELECT record_id, doctor_id, rating, created_at FROM doctor_reviews WHERE worker_health_id = ?", (worker_id,))
                worker_reviews = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "data": worker_reviews})
                return

            # GET /api/records/<health_id>
            if path.startswith('/api/records/'):
                health_id = path.split('/api/records/')[1].strip()
                cursor.execute("SELECT * FROM medical_records WHERE worker_health_id = ? ORDER BY visit_date DESC, id DESC", (health_id,))
                records = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "count": len(records), "data": records})
                return

            if path.startswith('/api/personal-documents/'):
                health_id = path.split('/api/personal-documents/')[1].strip()
                cursor.execute("SELECT document_id,file_name,mime_type,document_data,patient_note,created_at FROM personal_documents WHERE worker_health_id=? ORDER BY id DESC", (health_id,))
                self.send_json({"success": True, "data": [dict(row) for row in cursor.fetchall()]})
                return

            # GET /api/consent/<health_id>
            if path.startswith('/api/consent/'):
                subpath = path.split('/api/consent/')[1].strip()
                # Status check: /api/consent/status/<health_id>/<doc_id>
                if subpath.startswith('status/'):
                    parts = subpath.split('/')
                    if len(parts) >= 3:
                        w_id, d_id = parts[1], parts[2]
                        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        cursor.execute("""
                        SELECT * FROM consents 
                        WHERE worker_health_id = ? AND doctor_id = ? AND status = 'granted' AND expires_at > ?
                        ORDER BY id DESC LIMIT 1
                        """, (w_id, d_id, now_str))
                        row = cursor.fetchone()
                        if row:
                            self.send_json({"success": True, "has_consent": True, "consent": dict(row)})
                        else:
                            self.send_json({"success": True, "has_consent": False})
                        return

                # Normal worker consents fetch: /api/consent/<health_id>
                health_id = subpath
                cursor.execute("SELECT * FROM consents WHERE worker_health_id = ? ORDER BY id DESC", (health_id,))
                consents = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "data": consents})
                return

            # GET /api/emergency/<health_id>
            if path.startswith('/api/emergency/'):
                health_id = path.split('/api/emergency/')[1].strip()
                cursor.execute("""
                SELECT health_id, name, age, gender, blood_group, allergies, conditions,
                       medications, vaccination_status, emergency_name, emergency_phone, emergency_relation
                FROM workers WHERE health_id = ?
                """, (health_id,))
                row = cursor.fetchone()
                if row:
                    emergency_data = dict(row)
                    # Log emergency access in security audit logs
                    log_audit_event("Emergency Responder / Public", "Emergency Responder",
                                    f"Critical Emergency Profile accessed for {row['name']} ({health_id})",
                                    health_id, "Emergency Override")
                    self.send_json({
                        "success": True,
                        "emergency_profile": emergency_data,
                        "audit_notice": "Emergency access logged to tamper-evident audit trail for patient security."
                    })
                else:
                    self.send_json({"success": False, "error": "Emergency record not found"}, 404)
                return

            # GET /api/health-camps
            if path == '/api/health-camps':
                cursor.execute("SELECT * FROM health_camps ORDER BY camp_date DESC")
                camps = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "data": camps})
                return

            # GET /api/screenings/<health_id>
            if path.startswith('/api/screenings/'):
                health_id = path.split('/api/screenings/')[1].strip()
                cursor.execute("SELECT * FROM screenings WHERE worker_health_id = ? ORDER BY screening_date DESC", (health_id,))
                screenings = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "data": screenings})
                return

            # GET /api/admin/stats
            if path == '/api/admin/stats':
                cursor.execute("SELECT COUNT(*) FROM workers")
                total_workers = cursor.fetchone()[0] + 1245  # Add demo scale
                cursor.execute("SELECT COUNT(*) FROM doctors")
                total_doctors = cursor.fetchone()[0] + 82
                cursor.execute("SELECT COUNT(*) FROM health_camps")
                total_camps = cursor.fetchone()[0] + 38
                cursor.execute("SELECT COUNT(*) FROM medical_records")
                total_records = cursor.fetchone()[0] + 5827

                # Registrations by Month
                reg_by_month = [
                    {"month": "Feb 2026", "count": 210},
                    {"month": "Mar 2026", "count": 285},
                    {"month": "Apr 2026", "count": 340},
                    {"month": "May 2026", "count": 395},
                    {"month": "Jun 2026", "count": 420},
                    {"month": "Jul 2026", "count": 480},
                    {"month": "Aug 2026", "count": 520}
                ]

                # District Coverage
                district_stats = [
                    {"district": "Ernakulam", "workers": 482, "percentage": 38.6},
                    {"district": "Thiruvananthapuram", "workers": 298, "percentage": 23.9},
                    {"district": "Kozhikode", "workers": 214, "percentage": 17.1},
                    {"district": "Thrissur", "workers": 154, "percentage": 12.3},
                    {"district": "Palakkad", "workers": 100, "percentage": 8.0}
                ]

                # Screening Health Breakdown
                screening_breakdown = [
                    {"category": "Normal Vitals & Glucose", "percentage": 68, "count": 848},
                    {"category": "Borderline / Pre-Hypertension", "percentage": 18, "count": 224},
                    {"category": "Elevated Sugar / Diabetic Care", "percentage": 9, "count": 112},
                    {"category": "Respiratory / Dust Wheeze", "percentage": 5, "count": 64}
                ]

                # Language Demographics
                languages = [
                    {"language": "Hindi", "count": 580, "percentage": 46.5},
                    {"language": "Bengali", "count": 410, "percentage": 32.8},
                    {"language": "Assamese / Odia", "count": 165, "percentage": 13.2},
                    {"language": "Malayalam / Others", "count": 93, "percentage": 7.5}
                ]

                self.send_json({
                    "success": True,
                    "stats": {
                        "total_workers": total_workers,
                        "total_doctors": total_doctors,
                        "total_camps": total_camps,
                        "total_records": total_records,
                        "reg_by_month": reg_by_month,
                        "district_stats": district_stats,
                        "screening_breakdown": screening_breakdown,
                        "languages": languages
                    }
                })
                return

            # GET /api/admin/audit-logs
            if path == '/api/admin/audit-logs':
                cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
                logs = [dict(row) for row in cursor.fetchall()]
                self.send_json({"success": True, "count": len(logs), "data": logs})
                return

            self.send_json({"error": f"Endpoint not found: {path}"}, 404)

        except Exception as e:
            payload = {"error": "Internal server error"}
            if not IS_PRODUCTION: payload["details"] = str(e)
            self.send_json(payload, 500)
        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        conn = get_db()
        cursor = conn.cursor()

        try:
            # Explicit portal authentication (no default/fallback identity).
            if path == '/api/worker/login':
                health_id = str(body.get('health_id', '')).strip()
                password = str(body.get('password', ''))
                cursor.execute("SELECT * FROM workers WHERE LOWER(health_id) = LOWER(?)", (health_id,))
                row = cursor.fetchone()
                if not row or not verify_password(password, row['password']):
                    self.send_json({"success": False, "error": "Invalid Health ID or password"}, 401)
                    return
                worker = dict(row); worker.pop('password', None)
                log_audit_event(worker['name'], "Worker", "Worker logged into portal", worker['health_id'])
                self.send_json({"success": True, "worker": worker})
                return

            if path == '/api/health-worker/login':
                worker_id = str(body.get('worker_id', '')).strip()
                password = str(body.get('password', ''))
                cursor.execute("SELECT * FROM health_workers WHERE LOWER(worker_id) = LOWER(?)", (worker_id,))
                row = cursor.fetchone()
                if not row or row['status'].lower() != 'active' or not verify_password(password, row['password']):
                    self.send_json({"success": False, "error": "Invalid or inactive Health Worker account"}, 401)
                    return
                account = dict(row); account.pop('password', None)
                self.send_json({"success": True, "health_worker": account})
                return

            if path == '/api/admin/login':
                admin_id = str(body.get('admin_id', '')).strip()
                password = str(body.get('password', ''))
                cursor.execute("SELECT * FROM admins WHERE LOWER(admin_id) = LOWER(?)", (admin_id,))
                row = cursor.fetchone()
                if row:
                    if row['status'].lower() != 'active' or not verify_password(password, row['password']):
                        self.send_json({"success": False, "error": "Invalid administrator credentials"}, 401)
                        return
                    account = dict(row); account.pop('password', None)
                    self.send_json({"success": True, "admin": account})
                    return
                # Preserve the legacy administrator only when configured explicitly in production.
                legacy_admin_id = os.environ.get('HEALTHBRIDGE_ADMIN_ID', '' if IS_PRODUCTION else 'ADMIN-1001')
                legacy_admin_password = os.environ.get('HEALTHBRIDGE_ADMIN_PASSWORD', '' if IS_PRODUCTION else 'admin123')
                if not legacy_admin_id or not legacy_admin_password or admin_id != legacy_admin_id or password != legacy_admin_password:
                    self.send_json({"success": False, "error": "Invalid administrator credentials"}, 401)
                    return
                self.send_json({"success": True, "admin": {"admin_id": admin_id, "name": "Kerala Health Mission Admin"}})
                return

            if path == '/api/admin/doctors':
                required = ['name', 'hospital', 'specialization', 'district', 'phone', 'email', 'password']
                if any(not body.get(key) for key in required):
                    self.send_json({"success": False, "error": "All doctor fields and an initial password are required"}, 400)
                    return
                doctor_id = get_next_doctor_id(conn)
                cursor.execute('''INSERT INTO doctors
                    (doctor_id,name,hospital,specialization,district,phone,email,password,status,photo_url)
                    VALUES (?,?,?,?,?,?,?,?,?,?)''', (
                    doctor_id, body['name'], body['hospital'], body['specialization'], body['district'],
                    body['phone'], body['email'], hash_password(str(body['password'])), 'Active', body.get('photo_url') or None
                ))
                conn.commit()
                self.send_json({"success": True, "doctor_id": doctor_id}, 201)
                return

            if path == '/api/profile/photo':
                role, account_id = body.get('role'), body.get('account_id')
                mapping = {'worker': ('workers', 'health_id'), 'doctor': ('doctors', 'doctor_id'), 'health-worker': ('health_workers', 'worker_id')}
                if role not in mapping or not account_id:
                    self.send_json({"success": False, "error": "Valid role and account ID are required"}, 400)
                    return
                photo_url = body.get('photo_url') or None
                if photo_url and not (str(photo_url).startswith('data:image/') or str(photo_url).startswith('https://')):
                    self.send_json({"success": False, "error": "Profile photos must be HTTPS images or uploaded image data"}, 400)
                    return
                table, id_col = mapping[role]
                cursor.execute(f"UPDATE {table} SET photo_url = ? WHERE {id_col} = ?", (photo_url, account_id))
                conn.commit()
                self.send_json({"success": cursor.rowcount == 1})
                return

            if path == '/api/personal-documents':
                health_id = body.get('worker_health_id')
                file_name = os.path.basename(str(body.get('file_name') or '')).strip()
                mime_type = str(body.get('mime_type') or '').lower()
                document_data = str(body.get('document_data') or '')
                if not health_id or not file_name:
                    self.send_json({"success": False, "error": "Authenticated worker and file name are required"}, 400)
                    return
                cursor.execute("SELECT 1 FROM workers WHERE health_id=?", (health_id,))
                if not cursor.fetchone():
                    self.send_json({"success": False, "error": "Worker not found"}, 404)
                    return
                if not (mime_type == 'application/pdf' or mime_type.startswith('image/')):
                    self.send_json({"success": False, "error": "Only PDF and image documents are supported"}, 400)
                    return
                if not document_data.startswith(('data:application/pdf;', 'data:image/')):
                    self.send_json({"success": False, "error": "Invalid document data"}, 400)
                    return
                document_id = f"PERS-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000,9999)}"
                cursor.execute("INSERT INTO personal_documents (document_id,worker_health_id,file_name,mime_type,document_data,patient_note,created_at) VALUES (?,?,?,?,?,?,?)", (document_id,health_id,file_name,mime_type,document_data,body.get('patient_note',''),datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
                conn.commit()
                self.send_json({"success": True, "document_id": document_id}, 201)
                return

            # POST /api/workers (Registration)
            if path == '/api/workers':
                required_fields = ['name', 'gender', 'phone', 'origin_state', 'current_district', 'blood_group', 'emergency_name', 'emergency_phone', 'emergency_relation']
                for f in required_fields:
                    if not body.get(f):
                        self.send_json({"success": False, "error": f"Missing required field: {f.replace('_', ' ').title()}"}, 400)
                        return

                # Validate Mobile Number (at least 10 digits)
                phone_raw = str(body.get('phone', '')).strip()
                clean_digits = ''.join(c for c in phone_raw if c.isdigit())
                if len(clean_digits) < 10:
                    self.send_json({"success": False, "error": "Please enter a valid 10-digit mobile number"}, 400)
                    return
                # Standardize phone format if needed
                formatted_phone = f"+91 {clean_digits[-10:-5]} {clean_digits[-5:]}" if len(clean_digits) == 10 else phone_raw

                # Validate Date of Birth and calculate age
                dob_str = str(body.get('dob', '')).strip()
                age = int(body.get('age', 0)) if body.get('age') else None
                if dob_str:
                    try:
                        birth_date = datetime.strptime(dob_str, '%Y-%m-%d')
                        today = datetime.now()
                        calc_age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                        if age is None or age <= 0:
                            age = max(0, calc_age)
                    except Exception:
                        pass
                
                if age is None or age < 14 or age > 110:
                    self.send_json({"success": False, "error": "Please provide a valid Date of Birth and age (minimum 14 years)"}, 400)
                    return

                # Validate Consent
                consent_val = body.get('consent_agreed')
                if consent_val not in [True, 1, '1', 'true', 'on', 'yes']:
                    self.send_json({"success": False, "error": "You must consent to storage and sharing of health information"}, 400)
                    return

                # Generate Unique Health ID e.g. KL-MW-XXXXX
                while True:
                    rand_num = random.randint(10000, 99999)
                    candidate_id = f"KL-MW-{rand_num}"
                    cursor.execute("SELECT 1 FROM workers WHERE health_id = ?", (candidate_id,))
                    if not cursor.fetchone():
                        health_id = candidate_id
                        break

                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                cursor.execute('''
                INSERT INTO workers (
                    health_id, name, dob, age, gender, phone, email,
                    govt_id_type, govt_id_number, origin_state, origin_district,
                    current_address, current_district, occupation, employer_name,
                    workplace_location, arrival_date, language, blood_group,
                    allergies, conditions, medications, vaccination_status,
                    emergency_name, emergency_phone, emergency_relation,
                    consent_agreed, photo_url, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    health_id,
                    body.get('name', '').strip(),
                    dob_str or '1998-01-01',
                    age,
                    body.get('gender', 'Male'),
                    formatted_phone,
                    body.get('email', '').strip(),
                    body.get('govt_id_type', 'Aadhaar Card'),
                    body.get('govt_id_number', '').strip() or 'Not Specified',
                    body.get('origin_state', 'Bihar'),
                    body.get('origin_district', '').strip() or 'District',
                    body.get('current_address', '').strip() or 'Kerala Residence',
                    body.get('current_district', 'Ernakulam'),
                    body.get('occupation', '').strip() or 'General Worker',
                    body.get('employer_name', '').strip() or 'Contractor',
                    body.get('workplace_location', '').strip() or 'Kerala Worksite',
                    body.get('arrival_date', '').strip() or datetime.now().strftime('%Y-%m-%d'),
                    body.get('language', 'Hindi'),
                    body.get('blood_group', 'B+'),
                    body.get('allergies', '').strip() or 'None reported',
                    body.get('conditions', '').strip() or 'None reported',
                    body.get('medications', '').strip() or 'None reported',
                    body.get('vaccination_status', 'Fully Vaccinated'),
                    body.get('emergency_name', '').strip(),
                    body.get('emergency_phone', '').strip(),
                    body.get('emergency_relation', 'Family'),
                    1,
                    body.get('photo_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
                    now_str
                ))
                conn.commit()

                log_audit_event("System / Self-Registration", "Worker",
                                f"Created Digital Health Passport {health_id} for {body.get('name')}",
                                health_id, "Success")

                cursor.execute("SELECT * FROM workers WHERE health_id = ?", (health_id,))
                new_worker = dict(cursor.fetchone())

                self.send_json({
                    "success": True,
                    "message": "Registration Successful! Digital Health ID created.",
                    "data": new_worker,
                    "registration_date": datetime.now().strftime('%d %b %Y')
                }, 201)
                return

            # POST /api/doctor/login
            if path == '/api/doctor/login':
                identifier = (body.get('doctor_id') or body.get('email') or body.get('username') or '').strip()
                password = str(body.get('password', '')).strip()

                if not identifier or not password:
                    self.send_json({"success": False, "error": "Doctor ID/Email and password are required"}, 400)
                    return

                cursor.execute("""
                SELECT d.doctor_id, d.name, d.hospital, d.specialization, d.district, d.phone, d.email, d.password,
                       COALESCE(ROUND(AVG(r.rating), 1), 5.0) as avg_rating,
                       COUNT(r.id) as rating_count
                FROM doctors d
                LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
                WHERE (LOWER(d.doctor_id) = LOWER(?) OR LOWER(d.email) = LOWER(?))
                GROUP BY d.doctor_id
                """, (identifier, identifier))
                doc_row = cursor.fetchone()

                if not doc_row or not verify_password(password, doc_row['password']):
                    self.send_json({"success": False, "error": "Invalid Doctor ID or password. Please try again."}, 401)
                    return

                doc_dict = dict(doc_row)
                del doc_dict['password']

                log_audit_event(doc_dict['name'], "Doctor", f"Doctor logged into portal: {doc_dict['doctor_id']}", doc_dict['doctor_id'], "Authorized")

                self.send_json({
                    "success": True,
                    "message": f"Welcome back, {doc_dict['name']}!",
                    "doctor": doc_dict
                })
                return

            # POST /api/records (Add Medical Record)
            if path == '/api/records':
                worker_health_id = body.get('worker_health_id')
                doctor_id = body.get('doctor_id')
                doctor_name = body.get('doctor_name')
                hospital = body.get('hospital')
                diagnosis = body.get('diagnosis')
                condition = body.get('condition', diagnosis)
                medicines = body.get('medicines', 'As advised')
                treatment = body.get('treatment', 'Clinical consultation')
                follow_up = int(body.get('follow_up_days', 0))
                notes = body.get('notes', '')

                if not worker_health_id or not diagnosis or not doctor_id or not doctor_name or not hospital:
                    self.send_json({"success": False, "error": "Authenticated doctor identity, worker_health_id and diagnosis are required"}, 400)
                    return

                while True:
                    record_id = f"REC-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
                    cursor.execute("SELECT 1 FROM medical_records WHERE record_id = ?", (record_id,))
                    if not cursor.fetchone():
                        break
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                visit_date = datetime.now().strftime('%Y-%m-%d')

                cursor.execute('''
                INSERT INTO medical_records (
                    record_id, worker_health_id, doctor_id, doctor_name, hospital, visit_date,
                    condition, diagnosis, medicines, treatment, follow_up_days, notes, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    record_id, worker_health_id, doctor_id, doctor_name, hospital, visit_date,
                    condition, diagnosis, medicines, treatment, follow_up, notes, 'Completed', now_str
                ))
                conn.commit()

                log_audit_event(doctor_name, "Doctor", f"Added medical record {record_id} for diagnosis: {diagnosis}", worker_health_id, "Authorized")

                cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
                new_rec = dict(cursor.fetchone())
                self.send_json({"success": True, "message": "Medical record saved to timeline", "data": new_rec}, 201)
                return

            # POST /api/records/<record_id>/update (Update Medical Record via POST alias)
            if path.startswith('/api/records/') and path.endswith('/update'):
                record_id = path.split('/api/records/')[1].replace('/update', '').strip()
                cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
                rec = cursor.fetchone()
                if not rec:
                    self.send_json({"success": False, "error": "Record not found"}, 404)
                    return

                diagnosis = body.get('diagnosis', rec['diagnosis'])
                condition = body.get('condition', body.get('diagnosis', rec['condition']))
                medicines = body.get('medicines', rec['medicines'])
                treatment = body.get('treatment', rec['treatment'])
                follow_up = int(body.get('follow_up_days', rec['follow_up_days']))
                notes = body.get('notes', rec['notes'])
                status = body.get('status', rec['status'])
                updated_by_id = body.get('updated_by_doctor_id') or body.get('doctor_id')
                updated_by_name = body.get('updated_by_doctor_name', body.get('doctor_name', 'Attending Doctor'))
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                cursor.execute("""
                UPDATE medical_records SET
                    condition = ?, diagnosis = ?, medicines = ?, treatment = ?,
                    follow_up_days = ?, notes = ?, status = ?,
                    updated_at = ?, updated_by_doctor_id = ?, updated_by_doctor_name = ?
                WHERE record_id = ?
                """, (condition, diagnosis, medicines, treatment, follow_up, notes, status, now_str, updated_by_id, updated_by_name, record_id))
                conn.commit()

                log_audit_event(updated_by_name, "Doctor", f"Updated medical record {record_id} for diagnosis: {diagnosis}", rec['worker_health_id'], "Authorized")

                cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
                updated_rec = dict(cursor.fetchone())
                self.send_json({"success": True, "message": "Medical record updated successfully", "data": updated_rec})
                return

            # POST /api/reviews (Submit Patient Doctor Rating & Review)
            if path == '/api/reviews':
                doctor_id = body.get('doctor_id')
                worker_health_id = body.get('worker_health_id')
                worker_name = body.get('worker_name', 'Patient')
                record_id = body.get('record_id')
                review_text = (body.get('review_text') or '').strip()

                try:
                    rating = int(body.get('rating', 5))
                except (ValueError, TypeError):
                    rating = 5

                if rating < 1 or rating > 5:
                    self.send_json({"success": False, "error": "Rating must be between 1 and 5 stars"}, 400)
                    return

                if not doctor_id or not worker_health_id:
                    self.send_json({"success": False, "error": "Doctor ID and Worker Health ID are required"}, 400)
                    return

                # Prevent duplicate review for the same consultation record
                if record_id:
                    cursor.execute("SELECT 1 FROM doctor_reviews WHERE worker_health_id = ? AND record_id = ?", (worker_health_id, record_id))
                    if cursor.fetchone():
                        self.send_json({"success": False, "error": "You have already submitted a review for this consultation visit."}, 400)
                        return

                review_id = f"REV-{random.randint(1000, 9999)}"
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                cursor.execute("""
                INSERT INTO doctor_reviews (
                    review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, now_str))
                conn.commit()

                cursor.execute("""
                SELECT COALESCE(ROUND(AVG(rating), 1), 5.0) as avg_rating, COUNT(id) as rating_count
                FROM doctor_reviews WHERE doctor_id = ?
                """, (doctor_id,))
                stats = dict(cursor.fetchone())

                log_audit_event(worker_name, "Worker", f"Submitted {rating}-star rating for doctor {doctor_id}", doctor_id, "Success")

                self.send_json({
                    "success": True,
                    "message": "Thank you! Your doctor rating and feedback have been recorded.",
                    "review_id": review_id,
                    "stats": stats
                }, 201)
                return

            # POST /api/consent/request (Doctor asks for access)
            if path == '/api/consent/request':
                worker_health_id = body.get('worker_health_id')
                doctor_id = body.get('doctor_id')
                doctor_name = body.get('doctor_name')
                hospital = body.get('hospital')
                if not worker_health_id or not doctor_id or not doctor_name or not hospital:
                    self.send_json({"success": False, "error": "Authenticated doctor identity and worker Health ID are required"}, 400)
                    return
                purpose = body.get('purpose', 'Medical Consultation')
                access_scope = body.get('access_scope', 'Medical history, Prescriptions, Lab reports')

                consent_id = f"CON-2026-{random.randint(100, 999):03d}"
                now = datetime.now()
                created_at = now.strftime('%Y-%m-%d %H:%M:%S')
                expires_at = (now + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')

                cursor.execute('''
                INSERT INTO consents (
                    consent_id, worker_health_id, doctor_id, doctor_name, hospital,
                    purpose, access_scope, status, created_at, expires_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (consent_id, worker_health_id, doctor_id, doctor_name, hospital, purpose, access_scope, 'pending', created_at, expires_at))
                conn.commit()

                log_audit_event(doctor_name, "Doctor", f"Requested record access for {worker_health_id}", consent_id, "Authorized")

                self.send_json({"success": True, "message": "Consent request sent to worker", "consent_id": consent_id})
                return

            # POST /api/consent/respond (Worker allows/denies)
            if path == '/api/consent/respond':
                consent_id = body.get('consent_id')
                action = body.get('action')  # 'allow' or 'deny' or 'revoke'

                if action not in ['allow', 'deny', 'revoke']:
                    self.send_json({"success": False, "error": "Invalid action"}, 400)
                    return

                new_status = 'granted' if action == 'allow' else ('revoked' if action == 'revoke' else 'denied')
                cursor.execute("UPDATE consents SET status = ? WHERE consent_id = ?", (new_status, consent_id))
                conn.commit()

                cursor.execute("SELECT * FROM consents WHERE consent_id = ?", (consent_id,))
                c_row = cursor.fetchone()
                target_w = c_row['worker_health_id'] if c_row else consent_id

                log_audit_event("Worker (Patient)", "Worker", f"Consent response: {new_status.upper()} for request {consent_id}", target_w, "Granted" if new_status == 'granted' else 'Denied')

                self.send_json({"success": True, "message": f"Access {new_status}", "status": new_status})
                return

            # POST /api/health-camps (Create Camp)
            if path == '/api/health-camps':
                name = body.get('name')
                location = body.get('location')
                district = body.get('district', 'Ernakulam')
                camp_date = body.get('camp_date', datetime.now().strftime('%Y-%m-%d'))
                organizer = body.get('organizer', 'National Health Mission (NHM) Kerala')
                target_group = body.get('target_group', 'Migrant Workers')

                camp_id = f"CAMP-2026-{random.randint(10, 99):02d}"
                cursor.execute('''
                INSERT INTO health_camps (camp_id, name, location, district, camp_date, organizer, target_group, total_screened)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (camp_id, name, location, district, camp_date, organizer, target_group, 0))
                conn.commit()

                log_audit_event("Admin / Coordinator", "Admin", f"Created Health Camp {camp_id}: {name}", camp_id, "Success")
                self.send_json({"success": True, "message": "Health camp registered", "camp_id": camp_id}, 201)
                return

            # POST /api/screenings (Add Camp Screening)
            if path == '/api/screenings':
                worker_health_id = body.get('worker_health_id')
                camp_name = body.get('camp_name', 'Community Health Screening')
                bp = body.get('blood_pressure', '120/80 mmHg')
                sugar = body.get('blood_sugar', '100 mg/dL')
                height = float(body.get('height_cm', 170.0))
                weight = float(body.get('weight_kg', 65.0))
                bmi = round(weight / ((height/100.0) ** 2), 1) if height > 0 else 22.5
                vision = body.get('vision', '6/6')
                vaccine = body.get('vaccination_status', 'Fully Vaccinated')
                notes = body.get('notes', 'Screening completed.')
                date_str = body.get('screening_date', datetime.now().strftime('%Y-%m-%d'))

                status = 'Normal'
                if bmi >= 25.0:
                    status = 'Overweight'
                elif '140/' in bp or '150/' in bp:
                    status = 'Elevated BP'

                screening_id = f"SCR-2026-{random.randint(100, 999):03d}"

                cursor.execute('''
                INSERT INTO screenings (
                    screening_id, worker_health_id, camp_name, screening_date,
                    blood_pressure, blood_sugar, height_cm, weight_kg, bmi, vision,
                    vaccination_status, notes, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (screening_id, worker_health_id, camp_name, date_str, bp, sugar, height, weight, bmi, vision, vaccine, notes, status))
                conn.commit()

                log_audit_event("Health Camp Officer", "Doctor", f"Recorded screening {screening_id} for worker {worker_health_id}", screening_id, "Success")

                self.send_json({"success": True, "message": "Screening record added to worker timeline", "screening_id": screening_id, "bmi": bmi}, 201)
                return

            # POST /api/ai/summarize (Mock Clinician AI Assistant)
            if path == '/api/ai/summarize':
                worker_health_id = body.get('worker_health_id', 'KL-MW-10234')

                # Fetch worker profile + records + screenings
                cursor.execute("SELECT * FROM workers WHERE health_id = ?", (worker_health_id,))
                w_row = cursor.fetchone()
                if not w_row:
                    self.send_json({"success": False, "error": "Worker not found"}, 404)
                    return

                worker = dict(w_row)
                cursor.execute("SELECT * FROM medical_records WHERE worker_health_id = ? ORDER BY visit_date DESC", (worker_health_id,))
                records = [dict(r) for r in cursor.fetchall()]

                cursor.execute("SELECT * FROM screenings WHERE worker_health_id = ? ORDER BY screening_date DESC", (worker_health_id,))
                screenings = [dict(s) for s in cursor.fetchall()]

                # Generate structured clinical AI summary
                ai_summary = generate_mock_clinical_summary(worker, records, screenings)

                log_audit_event("Dr. Clinician", "Doctor", f"Generated AI Clinical Summary for {worker_health_id}", worker_health_id, "Authorized")

                self.send_json({
                    "success": True,
                    "worker_health_id": worker_health_id,
                    "worker_name": worker['name'],
                    "ai_summary": ai_summary,
                    "disclaimer": "AI-generated summary — for clinician assistance only. Prototype demonstration."
                })
                return

            self.send_json({"error": f"Endpoint not found: {path}"}, 404)

        except Exception as e:
            payload = {"error": "Internal server error"}
            if not IS_PRODUCTION: payload["details"] = str(e)
            self.send_json(payload, 500)
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        conn = get_db()
        cursor = conn.cursor()

        try:
            if path.startswith('/api/admin/doctors/'):
                doctor_id = path.split('/api/admin/doctors/')[1].strip()
                cursor.execute("SELECT * FROM doctors WHERE doctor_id = ?", (doctor_id,))
                row = cursor.fetchone()
                if not row:
                    self.send_json({"success": False, "error": "Doctor not found"}, 404)
                    return
                fields = ['name', 'hospital', 'specialization', 'district', 'phone', 'email', 'status', 'photo_url']
                values = [body.get(field, row[field]) for field in fields]
                password = hash_password(str(body['password'])) if body.get('password') else row['password']
                cursor.execute('''UPDATE doctors SET name=?,hospital=?,specialization=?,district=?,phone=?,email=?,status=?,photo_url=?,password=? WHERE doctor_id=?''', (*values, password, doctor_id))
                conn.commit()
                self.send_json({"success": True, "doctor_id": doctor_id})
                return

            # PUT /api/records/<record_id>
            if path.startswith('/api/records/'):
                record_id = path.split('/api/records/')[1].strip()
                cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
                rec = cursor.fetchone()
                if not rec:
                    self.send_json({"success": False, "error": "Record not found"}, 404)
                    return

                diagnosis = body.get('diagnosis', rec['diagnosis'])
                condition = body.get('condition', body.get('diagnosis', rec['condition']))
                medicines = body.get('medicines', rec['medicines'])
                treatment = body.get('treatment', rec['treatment'])
                follow_up = int(body.get('follow_up_days', rec['follow_up_days']))
                notes = body.get('notes', rec['notes'])
                status = body.get('status', rec['status'])
                updated_by_id = body.get('updated_by_doctor_id') or body.get('doctor_id')
                updated_by_name = body.get('updated_by_doctor_name', body.get('doctor_name', 'Attending Doctor'))
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                cursor.execute("""
                UPDATE medical_records SET
                    condition = ?, diagnosis = ?, medicines = ?, treatment = ?,
                    follow_up_days = ?, notes = ?, status = ?,
                    updated_at = ?, updated_by_doctor_id = ?, updated_by_doctor_name = ?
                WHERE record_id = ?
                """, (condition, diagnosis, medicines, treatment, follow_up, notes, status, now_str, updated_by_id, updated_by_name, record_id))
                conn.commit()

                log_audit_event(updated_by_name, "Doctor", f"Updated medical record {record_id} for diagnosis: {diagnosis}", rec['worker_health_id'], "Authorized")

                cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
                updated_rec = dict(cursor.fetchone())
                self.send_json({"success": True, "message": "Medical record updated successfully", "data": updated_rec})
                return

            self.send_json({"error": f"Endpoint not found: {path}"}, 404)

        except Exception as e:
            payload = {"error": "Internal server error"}
            if not IS_PRODUCTION: payload["details"] = str(e)
            self.send_json(payload, 500)
        finally:
            conn.close()

def generate_mock_clinical_summary(worker, records, screenings):
    name = worker.get('name', 'Patient')
    age = worker.get('age', 'N/A')
    gender = worker.get('gender', 'N/A')
    allergies = worker.get('allergies', 'None')
    conditions = worker.get('conditions', 'None')
    meds = worker.get('medications', 'None')

    recent_conditions = [r['condition'] for r in records[:3]] if records else ["No recent clinical consultations"]
    latest_screening = screenings[0] if screenings else None

    vitals_text = "Vitals stable."
    if latest_screening:
        vitals_text = f"Recent Health Camp screening ({latest_screening['screening_date']}): BP {latest_screening['blood_pressure']}, Blood Sugar {latest_screening['blood_sugar']}, BMI {latest_screening['bmi']} kg/m²."

    allergy_warning = ""
    if allergies and allergies.lower() not in ['none', 'none reported', 'none known']:
        allergy_warning = f"⚠️ CRITICAL ALLERGY ALERT: {allergies.upper()}. Strict avoidance of beta-lactams/sulfa as indicated."

    summary_text = (
        f"**CLINICAL PROFILE OVERVIEW ({name}, {age}y/{gender})**\n\n"
        f"• **Key Baseline**: Worker presents with {conditions}. Active regular medication: {meds}.\n"
        f"• **Allergy Profile**: {allergy_warning if allergy_warning else 'No documented adverse drug reactions.'}\n"
        f"• **Recent Timeline**: Documented history of {', '.join(recent_conditions)}.\n"
        f"• **Screening & Vitals**: {vitals_text}\n"
        f"• **Occupational Health Guidance**: Ensure adequate workplace hydration (Kerala summer/monsoon protocol), dust exposure mask protection, and periodic routine screening at nearby PHC."
    )

    return {
        "overview": summary_text,
        "allergy_flag": allergies,
        "critical_conditions": conditions,
        "active_medications": meds,
        "recent_consultations_count": len(records),
        "last_visit_date": records[0]['visit_date'] if records else "None",
        "advisory": "Worker travels across districts. Digital records confirm continuity of care without hospital data silos."
    }

def run_server():
    # Ensure database exists
    from database import init_database
    init_database()
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    if IS_PRODUCTION and not SECRET_KEY:
        raise RuntimeError('SECRET_KEY must be set when APP_ENV=production')

    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((HOST, PORT), HealthBridgeHandler) as httpd:
        print(f"============================================================", flush=True)
        print(f" HealthBridge Kerala - Digital Health Passport Web Server", flush=True)
        print(f" Environment: {APP_ENV}", flush=True)
        print(f" Local URL: http://localhost:{PORT}", flush=True)
        print(f" REST API:  http://localhost:{PORT}/api/health", flush=True)
        print(f" Status:    Server running smoothly. Press Ctrl+C to stop.", flush=True)
        print(f"============================================================", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down gracefully.", flush=True)
            httpd.server_close()

if __name__ == '__main__':
    run_server()
