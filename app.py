"""
HealthBridge Kerala - Flask Application Server
Alternative Flask REST API server for developers who prefer running with Flask/Gunicorn.
"""

from flask import Flask, request, jsonify, send_from_directory, render_template
import sqlite3
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static', template_folder='templates')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data', 'healthbridge.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def log_audit(user_name, role, action, target_resource, status='Authorized', ip='127.0.0.1'):
    try:
        conn = get_db()
        cursor = conn.cursor()
        log_id = f"LOG-{int(datetime.now().timestamp()*1000)%100000:05d}"
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute('''
        INSERT INTO audit_logs (log_id, user_name, role, action, target_resource, status, timestamp, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (log_id, user_name, role, action, target_resource, status, now_str, ip))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit log error: {e}")

@app.route('/')
@app.route('/worker')
@app.route('/doctor')
@app.route('/admin')
@app.route('/emergency')
def index():
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "system": "HealthBridge Kerala",
        "version": "2.0.0-hackathon",
        "framework": "Flask",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/workers', methods=['GET', 'POST'])
def handle_workers():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        search = request.args.get('search', '').strip().lower()
        district = request.args.get('district', '').strip()
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
        conn.close()
        return jsonify({"success": True, "count": len(workers), "data": workers})

    elif request.method == 'POST':
        data = request.get_json() or {}
        phone_raw = str(data.get('phone', '')).strip()
        clean_digits = ''.join(c for c in phone_raw if c.isdigit())
        if len(clean_digits) < 10:
            conn.close()
            return jsonify({"success": False, "error": "Please enter a valid 10-digit mobile number"}), 400

        formatted_phone = f"+91 {clean_digits[-10:-5]} {clean_digits[-5:]}" if len(clean_digits) == 10 else phone_raw

        dob_str = str(data.get('dob', '')).strip()
        age = int(data.get('age', 0)) if data.get('age') else None
        if dob_str:
            try:
                birth_date = datetime.strptime(dob_str, '%Y-%m-%d')
                today = datetime.now()
                calc_age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                if age is None or age <= 0:
                    age = max(0, calc_age)
            except Exception:
                pass

        if age is None or age < 14:
            conn.close()
            return jsonify({"success": False, "error": "Please provide a valid Date of Birth and age"}), 400

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
            data.get('name', '').strip(),
            dob_str or '1998-01-01',
            age,
            data.get('gender', 'Male'),
            formatted_phone,
            data.get('email', '').strip(),
            data.get('govt_id_type', 'Aadhaar Card'),
            data.get('govt_id_number', '').strip() or 'Not Specified',
            data.get('origin_state', 'Bihar'),
            data.get('origin_district', '').strip() or 'Patna',
            data.get('current_address', '').strip() or 'Kerala Residence',
            data.get('current_district', 'Ernakulam'),
            data.get('occupation', '').strip() or 'General Worker',
            data.get('employer_name', '').strip() or 'Contractor',
            data.get('workplace_location', '').strip() or 'Kerala Worksite',
            data.get('arrival_date', '').strip() or datetime.now().strftime('%Y-%m-%d'),
            data.get('language', 'Hindi'),
            data.get('blood_group', 'B+'),
            data.get('allergies', '').strip() or 'None reported',
            data.get('conditions', '').strip() or 'None reported',
            data.get('medications', '').strip() or 'None reported',
            data.get('vaccination_status', 'Fully Vaccinated'),
            data.get('emergency_name', '').strip(),
            data.get('emergency_phone', '').strip(),
            data.get('emergency_relation', 'Family'),
            1,
            data.get('photo_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
            now_str
        ))
        conn.commit()
        log_audit("System", "Worker", f"Created Health ID {health_id}", health_id, "Success")
        cursor.execute("SELECT * FROM workers WHERE health_id = ?", (health_id,))
        new_w = dict(cursor.fetchone())
        conn.close()
        return jsonify({
            "success": True,
            "message": "Worker registered successfully",
            "data": new_w,
            "registration_date": datetime.now().strftime('%d %b %Y')
        }), 201

@app.route('/api/workers/<health_id>', methods=['GET'])
def get_worker(health_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workers WHERE health_id = ? OR phone = ?", (health_id, health_id))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({"success": True, "data": dict(row)})
    return jsonify({"success": False, "error": "Worker not found"}), 404

@app.route('/api/doctor/login', methods=['POST'])
def doctor_login():
    data = request.get_json() or {}
    identifier = (data.get('doctor_id') or data.get('email') or data.get('username') or '').strip()
    password = str(data.get('password', '')).strip()

    if not identifier or not password:
        return jsonify({"success": False, "error": "Doctor ID/Email and password are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
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
    conn.close()

    if not doc_row or doc_row['password'] != password:
        return jsonify({"success": False, "error": "Invalid Doctor ID or password"}), 401

    doc_dict = dict(doc_row)
    del doc_dict['password']
    log_audit(doc_dict['name'], "Doctor", f"Doctor logged in: {doc_dict['doctor_id']}", doc_dict['doctor_id'], "Authorized")
    return jsonify({"success": True, "message": "Doctor authenticated", "doctor": doc_dict})

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT d.doctor_id, d.name, d.hospital, d.specialization, d.district, d.phone, d.email,
           COALESCE(ROUND(AVG(r.rating), 1), 5.0) as avg_rating,
           COUNT(r.id) as rating_count
    FROM doctors d
    LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
    GROUP BY d.doctor_id
    ORDER BY d.name ASC
    """)
    doctors = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"success": True, "data": doctors})

@app.route('/api/doctors/<doctor_id>', methods=['GET'])
def get_doctor_profile(doctor_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT d.doctor_id, d.name, d.hospital, d.specialization, d.district, d.phone, d.email,
           COALESCE(ROUND(AVG(r.rating), 1), 5.0) as avg_rating,
           COUNT(r.id) as rating_count
    FROM doctors d
    LEFT JOIN doctor_reviews r ON d.doctor_id = r.doctor_id
    WHERE d.doctor_id = ?
    GROUP BY d.doctor_id
    """, (doctor_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "error": "Doctor not found"}), 404
    
    doc_data = dict(row)
    cursor.execute("SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY id DESC", (doctor_id,))
    doc_data['reviews'] = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"success": True, "data": doc_data})

@app.route('/api/records/<health_id>', methods=['GET'])
def get_records(health_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medical_records WHERE worker_health_id = ? ORDER BY visit_date DESC, id DESC", (health_id,))
    records = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"success": True, "count": len(records), "data": records})

@app.route('/api/records', methods=['POST'])
def add_record():
    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()
    record_id = f"REC-2026-{random.randint(100, 999):03d}"
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    visit_date = datetime.now().strftime('%Y-%m-%d')
    doctor_id = data.get('doctor_id', 'DOC-101')
    doctor_name = data.get('doctor_name', 'Dr. Anil Kumar')

    cursor.execute('''
    INSERT INTO medical_records (
        record_id, worker_health_id, doctor_id, doctor_name, hospital, visit_date,
        condition, diagnosis, medicines, treatment, follow_up_days, notes, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        record_id,
        data.get('worker_health_id'),
        doctor_id,
        doctor_name,
        data.get('hospital', 'Government General Hospital, Kochi'),
        visit_date,
        data.get('condition', data.get('diagnosis')),
        data.get('diagnosis'),
        data.get('medicines', 'As prescribed'),
        data.get('treatment', 'Clinical consultation'),
        int(data.get('follow_up_days', 0)),
        data.get('notes', ''),
        'Completed',
        now_str
    ))
    conn.commit()
    log_audit(doctor_name, "Doctor", f"Added record {record_id}", data.get('worker_health_id'), "Authorized")
    cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
    rec = dict(cursor.fetchone())
    conn.close()
    return jsonify({"success": True, "message": "Record added", "data": rec}), 201

@app.route('/api/records/<record_id>', methods=['PUT', 'POST'])
def update_record(record_id):
    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
    rec = cursor.fetchone()
    if not rec:
        conn.close()
        return jsonify({"success": False, "error": "Record not found"}), 404

    diagnosis = data.get('diagnosis', rec['diagnosis'])
    condition = data.get('condition', data.get('diagnosis', rec['condition']))
    medicines = data.get('medicines', rec['medicines'])
    treatment = data.get('treatment', rec['treatment'])
    follow_up = int(data.get('follow_up_days', rec['follow_up_days']))
    notes = data.get('notes', rec['notes'])
    status = data.get('status', rec['status'])
    updated_by_id = data.get('updated_by_doctor_id', data.get('doctor_id', 'DOC-101'))
    updated_by_name = data.get('updated_by_doctor_name', data.get('doctor_name', 'Attending Doctor'))
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("""
    UPDATE medical_records SET
        condition = ?, diagnosis = ?, medicines = ?, treatment = ?,
        follow_up_days = ?, notes = ?, status = ?,
        updated_at = ?, updated_by_doctor_id = ?, updated_by_doctor_name = ?
    WHERE record_id = ?
    """, (condition, diagnosis, medicines, treatment, follow_up, notes, status, now_str, updated_by_id, updated_by_name, record_id))
    conn.commit()
    log_audit(updated_by_name, "Doctor", f"Updated medical record {record_id}", rec['worker_health_id'], "Authorized")

    cursor.execute("SELECT * FROM medical_records WHERE record_id = ?", (record_id,))
    updated_rec = dict(cursor.fetchone())
    conn.close()
    return jsonify({"success": True, "message": "Record updated successfully", "data": updated_rec})

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json() or {}
    doctor_id = data.get('doctor_id')
    worker_health_id = data.get('worker_health_id')
    worker_name = data.get('worker_name', 'Patient')
    record_id = data.get('record_id')
    review_text = (data.get('review_text') or '').strip()

    try:
        rating = int(data.get('rating', 5))
    except (ValueError, TypeError):
        rating = 5

    if rating < 1 or rating > 5:
        return jsonify({"success": False, "error": "Rating must be between 1 and 5 stars"}), 400

    if not doctor_id or not worker_health_id:
        return jsonify({"success": False, "error": "Doctor ID and Worker Health ID are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    if record_id:
        cursor.execute("SELECT 1 FROM doctor_reviews WHERE worker_health_id = ? AND record_id = ?", (worker_health_id, record_id))
        if cursor.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "You have already reviewed this visit."}), 400

    review_id = f"REV-{random.randint(1000, 9999)}"
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("""
    INSERT INTO doctor_reviews (
        review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (review_id, doctor_id, worker_health_id, worker_name, record_id, rating, review_text, now_str))
    conn.commit()

    cursor.execute("SELECT COALESCE(ROUND(AVG(rating), 1), 5.0) as avg_rating, COUNT(id) as rating_count FROM doctor_reviews WHERE doctor_id = ?", (doctor_id,))
    stats = dict(cursor.fetchone())
    log_audit(worker_name, "Worker", f"Submitted {rating}-star rating for doctor {doctor_id}", doctor_id, "Success")
    conn.close()
    return jsonify({"success": True, "message": "Doctor rating submitted", "review_id": review_id, "stats": stats}), 201

@app.route('/api/reviews/<doctor_id>', methods=['GET'])
def get_doctor_reviews(doctor_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctor_reviews WHERE doctor_id = ? ORDER BY id DESC", (doctor_id,))
    reviews = [dict(row) for row in cursor.fetchall()]
    cursor.execute("SELECT COALESCE(ROUND(AVG(rating), 1), 5.0) as avg_rating, COUNT(id) as rating_count FROM doctor_reviews WHERE doctor_id = ?", (doctor_id,))
    stats = dict(cursor.fetchone())
    conn.close()
    return jsonify({"success": True, "count": len(reviews), "stats": stats, "data": reviews})

@app.route('/api/reviews/worker/<worker_health_id>', methods=['GET'])
def get_worker_reviews(worker_health_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT record_id, doctor_id, rating, created_at FROM doctor_reviews WHERE worker_health_id = ?", (worker_health_id,))
    worker_reviews = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"success": True, "data": worker_reviews})

@app.route('/api/emergency/<health_id>', methods=['GET'])
def get_emergency(health_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT health_id, name, age, gender, blood_group, allergies, conditions,
           medications, vaccination_status, emergency_name, emergency_phone, emergency_relation
    FROM workers WHERE health_id = ?
    """, (health_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        log_audit("Emergency Responder", "Emergency Responder", f"Emergency override for {health_id}", health_id, "Emergency Override")
        return jsonify({"success": True, "emergency_profile": dict(row), "audit_notice": "Logged for security."})
    return jsonify({"success": False, "error": "Record not found"}), 404

if __name__ == '__main__':
    from database import init_database
    init_database()
    app.run(host='0.0.0.0', port=5000, debug=True)
