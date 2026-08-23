# HealthBridge Kerala 🌴
### Digital Health Passport for Migrant Workers in Kerala
> **"Your Health. Your Identity. Wherever You Go."**  
> *"Healthcare records should travel with the worker, not remain trapped in one hospital."*

---

## 📌 Project Overview
**HealthBridge Kerala** is a portable digital health record management platform designed specifically for interstate migrant workers in Kerala. The system eliminates paper prescription fragmentation, bridges linguistic barriers across Hindi, Bengali, Malayalam, and English, enforces patient-controlled consent, and provides an instant emergency profile for first responders.

The project is aligned with the **United Nations Sustainable Development Goals (SDGs 3, 10, 9, and 16)**.

> [!NOTE]
> **Hackathon / Educational Prototype Notice**: All patient profiles, diagnoses, doctor details, and health camp entries are fictional demo data. This prototype demonstrates architecture, privacy-first consent management, and portable digital health identity.

---

## 🎯 Sustainable Development Goals (SDG) Alignment

| SDG Badge | Goal | HealthBridge Kerala Alignment & Impact |
| :--- | :--- | :--- |
| **SDG 3** | **Good Health & Well-being** | Target 3.8: Ensures continuity of healthcare, prevents duplicate testing, and tracks chronic ailments (asthma, hypertension, diabetes) across districts. |
| **SDG 10** | **Reduced Inequalities** | Target 10.7: Removes language and accessibility barriers for interstate mobile workers (Hindi, Bengali, Malayalam, English UI). |
| **SDG 9** | **Industry, Innovation & Infrastructure** | Target 9.c: Leverages lightweight QR-based digital identity and offline-friendly verification. |
| **SDG 16** | **Peace, Justice & Strong Institutions** | Target 16.9: Gives workers data sovereignty via 24-hour time-bound consent and tamper-evident security audit logs. |

---

## ✨ Key Features

1. **Digital Health ID**: Generates a standardized identity (e.g., `KL-MW-10234`) across all 14 districts in Kerala.
2. **Privacy-Preserving QR Health Passport**: Offline-capable vector QR code containing a secure verification token—**zero unencrypted medical data is stored inside the QR code**.
3. **Chronological Medical Timeline**: Expandable history showing diagnoses, treatments, prescribed medicines, doctor notes, and follow-up schedules.
4. **Multilingual Support**: Live language switching across **English**, **Malayalam (`മലയാളം`)**, **Hindi (`हिन्दी`)**, and **Bengali (`বাংলা`)**.
5. **Granular Consent Management**: Doctors must request access. Workers can grant 24-hour time-bound access or deny/revoke instantly.
6. **High-Contrast Emergency Mode**: Displays strictly life-saving information (Blood Group, Penicillin/Drug Allergies, Asthma/Conditions, Inhalers, Direct Phone Call to Emergency Contact) with automatic security audit logging.
7. **Community Health Camp Module**: Standardized vitals screening (BP, Random/Fasting Blood Sugar, Height/Weight, Auto-calculated BMI, Vision) synced directly to worker history.
8. **AI Medical Summary (Clinician Assistant)**: Generates structured clinical overviews, detects drug allergies/contraindications, and provides occupational health safety advice.
9. **State Health Admin Analytics**: Real-time charts for monthly registrations, district coverage, health camp screenings, and language demographics.
10. **Security Audit Log**: Complete, tamper-evident record access trail for patient privacy compliance.

---

## 🏗️ Architecture & Project Structure

```
healthbridge-kerala/
├── server.py              # Zero-dependency Python 3 HTTP + SQLite REST API Server
├── app.py                 # Legacy Flask prototype (not the active entry point)
├── database.py            # SQLite schema definition & demo data seeder
├── requirements.txt       # Active runtime dependencies (standard library only)
├── test_server.py         # Unit tests for database & schema
├── test_handler.py        # Unit tests for REST API endpoints
├── index.html             # Standalone root HTML (Direct browser execution)
├── templates/
│   └── index.html         # Main SPA interface template
├── static/
│   ├── css/
│   │   ├── style.css      # Core design system (HSL tokens, cards, responsive layout)
│   │   └── animations.css # Transitions & emergency pulse beacon
│   └── js/
│       ├── app.js         # Master application controller & state management
│       ├── i18n.js        # Multilingual engine (English, Malayalam, Hindi, Bengali)
│       ├── qr.js          # Standalone SVG vector QR generator (Zero external dependencies)
│       ├── charts.js      # Custom SVG charting library for Admin Analytics
│       ├── ai_summary.js  # AI Clinician Summary generator & risk analyzer
│       └── api.js         # REST API client with local offline fallback cache
└── data/
    └── healthbridge.db    # Auto-created SQLite database
```

---

## 🚀 How to Run the Application

### Native Python 3 Server
HealthBridge Kerala is engineered to run out of the box on **any standard Python 3 installation** without requiring `pip install`:

```bash
# Start the server
python3 server.py
```
Open your browser at: **`http://localhost:8090`**. `server.py` is the active application entry point. `app.py` remains only as legacy prototype code.

---

## 🎭 Public Prototype Demo Accounts

| Role | Identifier | Password |
| :--- | :--- | :--- |
| Worker | `KL-MW-DEMO1` | `Demo@1234` |
| Doctor | `DOC-DEMO1` | `Demo@1234` |
| Health Worker | `HW-DEMO1` | `Demo@1234` |
| Admin | `ADMIN-DEMO1` | `Demo@1234` |

These credentials are intentionally public for prototype testing only. They must not be reused in a real healthcare system. Passwords are stored in SQLite as salted PBKDF2 hashes, never as plaintext.

---

## 🎬 Step-by-Step Hackathon Demonstration Script

1. **Explore Landing Page**:
   - Notice the modern, trustworthy blue/teal government-healthcare aesthetic.
   - Switch language at top-right to **Malayalam (`മലയാളം`)**, **Hindi (`हिन्दी`)**, or **Bengali (`বাংলা`)** to see live multi-language UI translation.
2. **Register a New Worker**:
   - Click **"Get Started"** $\rightarrow$ **"Register New Migrant Worker"**.
   - Fill in details and click **"Save & Create Health ID"**.
   - Notice the instant generation of a unique `KL-MW-XXXXX` Health ID, vector QR code, and **"Download / Print Health Card"** badge.
3. **Inspect Worker Dashboard & Patient Star Ratings**:
   - View Rahul Kumar's profile (`KL-MW-10234`).
   - In the Medical Timeline, click on any doctor's name (e.g., **Dr. Anil Kumar**) to open their **Doctor Profile Modal** with credentials and verified patient reviews.
   - Click the **"⭐ Rate Doctor"** button on an unreviewed consultation: submit a 1–5 star rating and optional comments.
   - Observe that the button updates to **"✓ Rated (5★)"** and prevents duplicate reviews for the same visit.
4. **Doctor Login & Multi-Account Switching**:
   - Switch to the **Doctor Portal** from the header.
   - Click **"🔐 Switch Doctor Account"** or open the Doctor Login modal.
   - Use the 1-click quick credentials chips to log in as **Dr. Anil Kumar (`DOC-101`)**, **Dr. Meera Nair (`DOC-102`)**, **Dr. Rajesh Varma (`DOC-103`)**, or **Dr. Fatima Beevi (`DOC-104`)**.
   - Notice the doctor's average rating and total patient review count displayed on their dashboard badge.
5. **Doctor Health Report Updates & Audit Signature**:
   - Search worker `KL-MW-10234` as the logged-in doctor.
   - Click **"✏️ Edit Report"** on any existing clinical encounter record in the unlocked timeline.
   - Update diagnosis, advice, or medication $\rightarrow$ Submit.
   - Observe that the timeline immediately reflects the change with an **"✏️ Updated on [Date] by [Doctor Name]"** clinician signature badge.
6. **Test Emergency Mode**:
   - Click the pulsing red **"🚨 Emergency Mode"** button in the header.
   - Observe that **ONLY** critical life-saving data (Blood group B+, Penicillin allergy, Asthma, Inhaler, emergency contact with 1-tap dial button) is displayed.
   - Psychiatric and non-emergency records remain sealed.
7. **View Admin Analytics & Audit Logs**:
   - Switch to **Admin Portal**.
   - View interactive SVG charts (Registrations by Month, District Coverage, Screening Breakdown, Language Demographics).
   - Scroll to **Security Audit Logs** to verify that doctor accesses, record updates, and emergency overrides are logged with exact timestamps.
8. **Inspect SDG Alignment**:
   - Scroll to the **SDG Impact Section** to review alignment with SDGs 3, 10, 9, and 16.

---

## 🧪 Running Automated Tests
To verify database integrity, authentication, report updates, ratings, and REST endpoints:

```bash
python3 test_server.py
python3 test_handler.py
```

---

## 🔒 Security & Privacy Practices
- **Role-Based Access Control**: Strict segregation between Worker, Doctor, Emergency Responder, and Admin views.
- **Clinician Signatures & Audit**: Every medical report modification stores the doctor ID, timestamp, and audit event.
- **Anti-Spam Duplicate Prevention**: Database `UNIQUE(worker_health_id, record_id)` constraint ensures each completed patient visit can only be rated once.
- **Privacy-Preserving QR**: The QR code stores only a verification token; medical records require authorized clinician consent.
- **Time-Bound Consent**: Permissions expire automatically after 24 hours and can be revoked by the worker anytime.
- **Tamper-Evident Audit Logging**: Every profile lookup, record creation, consent grant, and emergency override is recorded with timestamps and user roles.

## PUBLIC DEPLOYMENT

### Local development

```bash
python3 server.py
```

The default local URL is `http://localhost:8090`. Localhost is reachable only from the computer running the server. No automatic browser opening or automatic user login occurs.

### Production

The active application is the standard-library server in `server.py`; it is not a Flask/WSGI application. The correct provider start command is:

```bash
python3 server.py
```

The server listens on `0.0.0.0` and reads the provider-assigned `PORT`. Configure:

- `APP_ENV=production`
- `SECRET_KEY`: a long random value supplied by the hosting platform
- `DATABASE_PATH`: absolute path on a persistent volume, including the database filename
- `UPLOAD_DIR`: directory on a persistent volume reserved for file-backed uploads
- `PORT`: supplied by the hosting platform
- `HOST=0.0.0.0` (optional; this is already the default)
- `MAX_REQUEST_BYTES` (optional; defaults to 5 MiB)
- `HEALTHBRIDGE_ADMIN_ID` and `HEALTHBRIDGE_ADMIN_PASSWORD` only if the legacy environment-configured administrator is intentionally retained

The current profile photos and personal health documents are stored inside SQLite as data, so `DATABASE_PATH` preserves them along with accounts and medical records. `UPLOAD_DIR` is created for future filesystem-backed uploads. Both paths should point to provider-mounted persistent storage. Never run multiple application instances against the same SQLite file; use a single instance for this prototype.

The hosting provider should terminate HTTPS in front of the application. The frontend uses same-origin `/api/...` requests, QR links use the current browser origin, wildcard CORS is disabled, and responses include baseline security headers. The current application does not issue authentication cookies; authentication state is held in the browser application and passwords are verified server-side using salted PBKDF2 hashes.

The safe health check is `GET /api/health` and returns only service status. A public provider will supply an HTTPS URL accessible from phones, tablets, and other computers.

### GitHub and hosting sequence

1. Review `.env.example`, generate a real production `SECRET_KEY`, and keep the real `.env` outside Git.
2. Initialize Git in this project if needed and review `git status`. Keep SQLite files out of Git because they contain password hashes; the application initializes fictional demo data on first startup.
3. Create an empty GitHub repository, add it as the remote, and push this project.
4. Create one Python web service from that repository with start command `python3 server.py`.
5. Attach a persistent volume and set `DATABASE_PATH` and `UPLOAD_DIR` to paths on that volume.
6. Add the production environment variables in the provider dashboard and deploy one application instance.
7. Confirm the HTTPS URL, `/api/health`, all four demo logins, QR origin, and persistence after a provider restart.

---
*Developed for the Kerala Migrant Worker Digital Health Record Initiative.*
