/**
 * HealthBridge Kerala - Master Application Controller
 * Handles SPA navigation, role simulation, API interactions, dynamic timelines,
 * consent workflows, QR rendering, and print/export features.
 */

// Global App State
const AppState = {
  currentView: 'landing',
  currentRole: null,
  activeWorkerHealthId: null,
  isDoctorLoggedIn: false,
  activeDoctorId: null,
  activeDoctorName: null,
  activeHospital: null,
  activeDoctorSpecialization: null,
  activeDoctorRating: null,
  activeDoctorRatingCount: 0,
  workerData: null,
  records: [],
  screenings: [],
  consents: [],
  hasDoctorConsent: false,
  healthWorkerData: null,
  adminData: null,
  workerReviewedRecords: {},
  currentReportId: null
};

// Toast Notification Engine
window.showToast = function (message, type = 'normal') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : (type === 'danger' ? '⚠️' : 'ℹ️')}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// View Navigation Router
function navigateTo(viewName, param = null) {
  AppState.currentView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.location.hash !== `#${viewName}`) {
    history.pushState(null, '', `#${viewName}`);
  }

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSec = document.getElementById(`view-${viewName}`);
  if (targetSec) {
    targetSec.classList.add('active');
  }
  updateAuthenticatedHeader();

  // Update Top Role Switcher Active Class
  document.querySelectorAll('.role-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    const role = btn.getAttribute('data-role');
    if (role === viewName || 
       (viewName === 'worker' && role === 'worker') ||
       (viewName === 'doctor' && role === 'doctor') ||
       (viewName === 'admin' && role === 'admin') ||
       (viewName === 'register' && role === 'register')) {
      btn.classList.add('active');
    }
  });

  // View Initialization Hooks
  if (viewName === 'landing') {
    initLandingView();
  } else if (viewName === 'register') {
    const formWrap = document.getElementById('registration-form-wrap');
    const successWrap = document.getElementById('registration-success-wrap');
    if (formWrap) formWrap.style.display = 'block';
    if (successWrap) successWrap.style.display = 'none';
  } else if (viewName === 'worker') {
    if (!AppState.activeWorkerHealthId) { openModal('modal-worker-login'); return navigateTo('role-select'); }
    loadWorkerDashboard(AppState.activeWorkerHealthId);
  } else if (viewName === 'doctor') {
    if (!AppState.isDoctorLoggedIn) { openModal('modal-doctor-login'); return navigateTo('role-select'); }
    loadDoctorDashboard();
  } else if (viewName === 'admin') {
    if (!AppState.adminData) { openModal('modal-admin-login'); return navigateTo('role-select'); }
    loadAdminDashboard();
  } else if (viewName === 'health-worker') {
    if (!AppState.healthWorkerData) { openModal('modal-health-worker-login'); return navigateTo('role-select'); }
    renderHealthWorkerDashboard();
  } else if (viewName === 'emergency') {
    loadEmergencyView(param || AppState.activeWorkerHealthId);
  } else if (viewName === 'camps') {
    loadHealthCampsView();
  } else if (viewName === 'audit') {
    loadAuditLogsView();
  } else if (viewName === 'sdg') {
    // Scroll or set active
  }
}

function goHome() {
  const roleHomes = { worker:'worker', doctor:'doctor', 'health-worker':'health-worker', admin:'admin' };
  navigateTo(roleHomes[AppState.currentRole] || 'landing');
}

function updateAuthenticatedHeader() {
  const authenticated = ['worker', 'doctor', 'health-worker', 'admin'].includes(AppState.currentRole);
  document.body.classList.toggle('authenticated', authenticated);
  const controls = document.getElementById('authenticated-header-controls');
  const label = document.getElementById('authenticated-role-label');
  const userName = document.getElementById('authenticated-user-name');
  const separator = document.getElementById('authenticated-role-separator');
  if (controls) controls.hidden = !authenticated;
  if (label) {
    const identity = AppState.currentRole === 'worker' ? AppState.workerData?.name :
      AppState.currentRole === 'doctor' ? AppState.activeDoctorName :
      AppState.currentRole === 'health-worker' ? AppState.healthWorkerData?.name : AppState.adminData?.name;
    const roleNames = { worker:'Worker', doctor:'Doctor', 'health-worker':'Health Worker', admin:'Admin' };
    label.textContent = authenticated ? roleNames[AppState.currentRole] : '';
    if (userName) userName.textContent = authenticated ? (identity || '') : '';
    if (separator) separator.hidden = !authenticated || !identity;
  }
  if (authenticated) closePublicMenu();
  if (typeof translateVisibleStrings === 'function') translateVisibleStrings(document);
}

// 1. LANDING VIEW INITIALIZATION
function initLandingView() {
  QRCodeGenerator.render('hero-qr-box', verificationUrl('/demo'), 110, '#0F766E');
}

function verificationUrl(path) {
  const normalized = String(path || '').startsWith('/') ? String(path) : `/${path}`;
  return `${window.location.origin}${normalized}`;
}

function togglePublicMenu(force) {
  const menu = document.getElementById('public-menu');
  const backdrop = document.getElementById('public-menu-backdrop');
  const toggle = document.getElementById('mobile-nav-toggle');
  const open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', open); backdrop.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}
function closePublicMenu(){ togglePublicMenu(false); }
function scrollPublicSection(id){ const fallback={ 'privacy-section':'features-section', 'faq-section':'contact-section' }; navigateTo('landing'); closePublicMenu(); setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}) || document.getElementById(fallback[id])?.scrollIntoView({behavior:'smooth'}),50); }

function useDemoAccount(role) {
  const configs = {
    worker: { modal:'modal-worker-login', id:'KL-MW-DEMO1', idSelector:'input[name="health_id"]' },
    doctor: { modal:'modal-doctor-login', id:'DOC-DEMO1', idSelector:'input[name="doctor_id"]' },
    'health-worker': { modal:'modal-health-worker-login', id:'HW-DEMO1', idSelector:'input[name="worker_id"]' },
    admin: { modal:'modal-admin-login', id:'ADMIN-DEMO1', idSelector:'input[name="admin_id"]' }
  };
  const config = configs[role];
  if (!config) return;
  openModal(config.modal);
  const modal = document.getElementById(config.modal);
  const idInput = modal?.querySelector(config.idSelector);
  const passwordInput = modal?.querySelector('input[name="password"]');
  if (idInput) idInput.value = config.id;
  if (passwordInput) passwordInput.value = 'Demo@1234';
  idInput?.focus();
}

async function handleWorkerLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const res = await API.loginWorker({ health_id: form.health_id.value.trim(), password: form.password.value });
  if (!res.success || !res.worker) return showToast(res.error || 'Invalid worker credentials', 'danger');
  AppState.currentRole = 'worker';
  AppState.activeWorkerHealthId = res.worker.health_id;
  AppState.workerData = res.worker;
  closeModal('modal-worker-login');
  navigateTo('worker');
}

async function handleHealthWorkerLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const res = await API.loginHealthWorker({ worker_id: form.worker_id.value.trim(), password: form.password.value });
  if (!res.success || !res.health_worker) return showToast(res.error || 'Invalid credentials', 'danger');
  AppState.currentRole = 'health-worker'; AppState.healthWorkerData = res.health_worker;
  closeModal('modal-health-worker-login'); navigateTo('health-worker');
}

async function handleAdminLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const res = await API.loginAdmin({ admin_id: form.admin_id.value.trim(), password: form.password.value });
  if (!res.success || !res.admin) return showToast(res.error || 'Invalid credentials', 'danger');
  AppState.currentRole = 'admin'; AppState.adminData = res.admin;
  closeModal('modal-admin-login'); navigateTo('admin');
}

function renderHealthWorkerDashboard() {
  const hw = AppState.healthWorkerData;
  document.getElementById('health-worker-name').textContent = hw.name;
  document.getElementById('health-worker-meta').textContent = `${hw.designation} • ${hw.center_name} • ${hw.district}`;
}

function logout() {
  Object.assign(AppState, { currentRole:null, activeWorkerHealthId:null, workerData:null, records:[], screenings:[], consents:[], isDoctorLoggedIn:false, activeDoctorId:null, activeDoctorName:null, activeHospital:null, activeDoctorSpecialization:null, hasDoctorConsent:false, healthWorkerData:null, adminData:null });
  history.replaceState(null, '', location.pathname);
  updateAuthenticatedHeader();
  navigateTo('landing'); showToast('You have been logged out', 'normal');
}

function handleEmergencyAccess(event) {
  event.preventDefault();
  const healthId = event.target.health_id.value.trim();
  if (!healthId) return;
  closeModal('modal-emergency-login');
  navigateTo('emergency', healthId);
}

function printHealthCard() {
  if (AppState.currentRole !== 'worker' || !AppState.workerData || !AppState.activeWorkerHealthId || AppState.workerData.health_id !== AppState.activeWorkerHealthId) {
    showToast('Log in as a worker before printing a Health Card', 'danger');
    return;
  }
  renderWorkerProfileBanner(AppState.workerData);
  document.body.classList.add('health-card-print');
  void document.getElementById('printable-health-card').offsetHeight;
  window.print();
}

function clearHealthCardPrint() { document.body.classList.remove('health-card-print'); }
function openHealthCard() {
  if (AppState.currentRole !== 'worker' || !AppState.workerData) return showToast('Log in as a worker to open a Health Card', 'danger');
  renderWorkerProfileBanner(AppState.workerData);
  showWorkerTab('tab-health-card');
}
function renderHealthCardPreview() {
  const source = document.querySelector('#printable-health-card .health-card-print-sheet');
  const target = document.getElementById('health-card-preview');
  if (!source || !target) return;
  const clone = source.cloneNode(true);
  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  target.innerHTML = '';
  target.appendChild(clone);
}

function chooseProfilePhoto() { document.getElementById('profile-photo-input').click(); }
async function handleProfilePhotoFile(event) {
  const file = event.target.files[0]; if (!file) return;
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return showToast('Choose an image smaller than 2 MB', 'danger');
  const photo_url = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
  await saveProfilePhoto(photo_url);
}
async function removeProfilePhoto() { await saveProfilePhoto(null); }
async function saveProfilePhoto(photo_url) {
  const role = AppState.currentRole;
  const account_id = role === 'worker' ? AppState.activeWorkerHealthId : role === 'doctor' ? AppState.activeDoctorId : AppState.healthWorkerData?.worker_id;
  if (!account_id) return showToast('Please log in first', 'danger');
  const res = await API.updateProfilePhoto({ role, account_id, photo_url });
  if (!res.success) return showToast(res.error || 'Photo update failed', 'danger');
  const target = role === 'worker' ? AppState.workerData : role === 'health-worker' ? AppState.healthWorkerData : null;
  if (target) target.photo_url = photo_url;
  document.querySelectorAll('.worker-profile-avatar').forEach(img => img.src = photo_url || '/static/img/generic-avatar.svg');
  showToast(photo_url ? 'Profile photo updated' : 'Profile photo removed', 'success');
}

// 2. WORKER REGISTRATION & HEALTH ID GENERATION
function calculateAgeFromDOB(dobString) {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

async function handleWorkerRegistration(event) {
  event.preventDefault();
  const form = event.target;

  const rawPhone = form.phone.value.trim();
  const cleanPhone = rawPhone.replace(/\D/g, '');

  // 1. Mobile Number Validation
  if (cleanPhone.length < 10) {
    window.showToast('Please enter a valid 10-digit mobile number', 'danger');
    form.phone.focus();
    return;
  }

  // 2. Date of Birth & Age Validation
  const dobVal = form.dob ? form.dob.value.trim() : '';
  const calculatedAge = calculateAgeFromDOB(dobVal);
  const ageVal = parseInt(calculatedAge || form.age.value, 10);

  if (!dobVal || isNaN(ageVal) || ageVal < 14) {
    window.showToast('Please enter a valid Date of Birth (minimum age is 14 years)', 'danger');
    if (form.dob) form.dob.focus();
    return;
  }

  // 3. Consent Validation
  if (form.consent_agreed && !form.consent_agreed.checked) {
    window.showToast('Consent is required to store and share health information', 'danger');
    form.consent_agreed.focus();
    return;
  }

  const formData = {
    name: form.name.value.trim(),
    dob: dobVal,
    age: ageVal,
    gender: form.gender.value,
    phone: rawPhone,
    email: form.email ? form.email.value.trim() : '',
    photo_url: form.photo_url ? form.photo_url.value.trim() : '',
    govt_id_type: form.govt_id_type ? form.govt_id_type.value : 'Aadhaar Card',
    govt_id_number: form.govt_id_number ? form.govt_id_number.value.trim() : '',
    origin_state: form.origin_state.value,
    origin_district: form.origin_district ? form.origin_district.value.trim() : '',
    current_address: form.current_address ? form.current_address.value.trim() : '',
    current_district: form.current_district.value,
    occupation: form.occupation ? form.occupation.value.trim() : 'General Worker',
    employer_name: form.employer_name ? form.employer_name.value.trim() : '',
    workplace_location: form.workplace_location ? form.workplace_location.value.trim() : '',
    arrival_date: form.arrival_date ? form.arrival_date.value : '',
    blood_group: form.blood_group.value,
    allergies: form.allergies.value.trim() || 'None reported',
    conditions: form.conditions.value.trim() || 'None reported',
    medications: form.medications.value.trim() || 'None reported',
    vaccination_status: form.vaccination_status ? form.vaccination_status.value : 'Fully Vaccinated',
    emergency_name: form.emergency_name.value.trim(),
    emergency_phone: form.emergency_phone.value.trim(),
    emergency_relation: form.emergency_relation.value,
    language: form.language.value,
    consent_agreed: true
  };

  // Required Field Checks
  if (!formData.name || !formData.phone || !formData.emergency_name || !formData.emergency_phone) {
    window.showToast('Please fill all required fields marked with *', 'danger');
    return;
  }

  const result = await API.registerWorker(formData);

  if (result.success && result.data) {
    const worker = result.data;
    AppState.activeWorkerHealthId = worker.health_id;
    AppState.workerData = worker;

    // Show Success Screen
    document.getElementById('registration-form-wrap').style.display = 'none';
    const successWrap = document.getElementById('registration-success-wrap');
    successWrap.style.display = 'block';

    document.getElementById('reg-success-name').textContent = worker.name;
    document.getElementById('reg-success-id').textContent = worker.health_id;
    
    const regDate = result.registration_date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const regDateEl = document.getElementById('reg-success-date');
    if (regDateEl) regDateEl.textContent = `Registered: ${regDate}`;

    QRCodeGenerator.render('reg-success-qr', verificationUrl(`/verify/${worker.health_id}`), 140, '#0F766E');

    // Configure success buttons
    const btnViewProfile = document.getElementById('btn-view-profile');
    if (btnViewProfile) {
      btnViewProfile.onclick = () => navigateTo('worker', worker.health_id);
    }

    window.showToast(`Registration Successful! Health ID ${worker.health_id} created.`, 'success');
  } else {
    window.showToast(result.error || 'Registration failed. Please retry.', 'danger');
  }
}

// 3. WORKER DASHBOARD
async function loadWorkerDashboard(healthId) {
  if (!healthId || healthId !== AppState.activeWorkerHealthId) return logout();
  AppState.activeWorkerHealthId = healthId;

  // Fetch Worker Profile
  const workerRes = await API.getWorker(healthId);
  if (workerRes.success && workerRes.data) {
    AppState.workerData = workerRes.data;
    renderWorkerProfileBanner(workerRes.data);
  }

  // Fetch Worker Doctor Reviews Status
  const revRes = await API.getWorkerReviews(healthId);
  AppState.workerReviewedRecords = {};
  if (revRes.success && revRes.data) {
    revRes.data.forEach(rv => {
      if (rv.record_id) {
        AppState.workerReviewedRecords[rv.record_id] = rv.rating;
      }
    });
  }

  // Fetch Medical Records Timeline
  const recordsRes = await API.getRecords(healthId);
  AppState.records = recordsRes.data || [];
  renderMedicalTimeline(AppState.records, false);

  // Fetch Screenings
  const screenRes = await API.getScreenings(healthId);
  AppState.screenings = screenRes.data || [];
  renderWorkerScreenings(AppState.screenings);

  // Fetch Consents
  const consentRes = await API.getConsents(healthId);
  AppState.consents = consentRes.data || [];
  renderWorkerConsents(AppState.consents);
  const docsRes = await API.getPersonalDocuments(healthId);
  renderPersonalDocuments(docsRes.data || []);

  // Render QR Card
  QRCodeGenerator.render('worker-dash-qr', verificationUrl(`/verify/${healthId}`), 130, '#0D9488');
  QRCodeGenerator.render('modal-qr-large', verificationUrl(`/verify/${healthId}`), 200, '#0F172A');
}

function renderWorkerProfileBanner(worker) {
  document.getElementById('dash-worker-name').textContent = worker.name;
  const nameBanner = document.getElementById('dash-worker-name-banner');
  if (nameBanner) nameBanner.textContent = worker.name;
  document.getElementById('dash-worker-id').textContent = worker.health_id;
  
  const occupationStr = worker.occupation ? ` • ${worker.occupation}` : '';
  const originStr = worker.origin_district ? `${worker.origin_district}, ${worker.origin_state}` : worker.origin_state;
  document.getElementById('dash-worker-meta').textContent = `${worker.age} yrs • ${worker.gender} • Blood: ${worker.blood_group}${occupationStr} • From ${originStr} (In ${worker.current_district})`;
  
  document.getElementById('dash-worker-lang-badge').textContent = `🗣️ Preferred: ${worker.language}`;

  // Update Widget names
  const widgetName = document.getElementById('widget-worker-name');
  if (widgetName) widgetName.textContent = worker.name;
  const widgetId = document.getElementById('widget-worker-id');
  if (widgetId) widgetId.textContent = worker.health_id;

  // Update printable card fields
  document.getElementById('print-card-name').textContent = worker.name;
  document.getElementById('print-card-id').textContent = worker.health_id;
  document.getElementById('print-card-blood').textContent = worker.blood_group;
  document.getElementById('print-card-district').textContent = worker.current_district;
  document.getElementById('print-card-emergency').textContent = `${worker.emergency_name} (${worker.emergency_phone})`;
  document.getElementById('print-card-allergies').textContent = worker.allergies || 'None reported';
  document.getElementById('print-card-medical').textContent = [worker.conditions, worker.medications].filter(Boolean).join(' • ') || 'None reported';
  document.getElementById('print-card-demographics').textContent = [worker.age ? `${worker.age} years` : null, worker.gender || null].filter(Boolean).join(' • ') || 'Not available';
  document.getElementById('print-card-updated').textContent = worker.updated_at ? `Updated ${worker.updated_at}` : (worker.created_at ? `Registered ${worker.created_at}` : 'Not available');
  const avatar = worker.photo_url || '/static/img/generic-avatar.svg';
  document.querySelectorAll('.worker-profile-avatar').forEach(img => img.src = avatar);
  document.getElementById('print-card-avatar').src = avatar;
  QRCodeGenerator.render('print-card-qr', verificationUrl(`/verify/${worker.health_id}`), 110, '#0F766E');
  document.getElementById('print-card-verification').textContent = `Verify: ${worker.health_id}`;
  renderHealthCardPreview();
  const profile = document.getElementById('worker-profile-details');
  if (profile) profile.innerHTML = `<div class="form-grid-2"><div><strong>Health ID</strong><br>${worker.health_id}</div><div><strong>Phone</strong><br>${worker.phone || 'Not available'}</div><div><strong>Blood Group</strong><br>${worker.blood_group || 'Not available'}</div><div><strong>Preferred Language</strong><br>${worker.language || 'Not available'}</div><div><strong>Occupation</strong><br>${worker.occupation || 'Not available'}</div><div><strong>Current District</strong><br>${worker.current_district || 'Not available'}</div><div><strong>Allergies</strong><br>${worker.allergies || 'None reported'}</div><div><strong>Conditions</strong><br>${worker.conditions || 'None reported'}</div></div>`;
}

function renderMedicalTimeline(records, isDoctorView = false) {
  const containerId = isDoctorView ? 'doctor-medical-timeline' : 'worker-medical-timeline';
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!isDoctorView) {
    renderPatientReports(records, container);
    return;
  }

  if (records.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0; color:#64748B;">
        <p>No hospital clinical encounters recorded yet.</p>
      </div>
    `;
    return;
  }

  let html = '';
  records.forEach(r => {
    const medsList = r.medicines ? r.medicines.split(',').map(m => `<span class="med-pill">💊 ${m.trim()}</span>`).join('') : '';
    const isReviewed = AppState.workerReviewedRecords && AppState.workerReviewedRecords[r.record_id];
    const docId = r.doctor_id || '';

    html += `
      <div class="timeline-event-card">
        <div class="timeline-event-header">
          <div class="timeline-event-title">
            <h4>${r.condition || r.diagnosis}</h4>
            <div class="hospital-name">
              🏥 ${r.hospital} • Attending: 
              <button onclick="openDoctorProfileModal('${docId}')" style="background:none; border:none; padding:0; color:var(--primary-700); font-weight:700; cursor:pointer; text-decoration:underline; font-size:inherit;">
                ${r.doctor_name}
              </button>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
            <div class="timeline-event-date">📅 ${r.visit_date}</div>
            ${r.updated_at ? `<span class="edited-badge" title="Updated by ${r.updated_by_doctor_name || r.doctor_name}">✏️ Updated (${r.updated_at.split(' ')[0]})</span>` : ''}
          </div>
        </div>

        <div class="timeline-event-body">
          <div class="timeline-diagnosis-box">
            <strong>Diagnosis / Clinical Assessment:</strong><br>
            <span>${r.diagnosis}</span>
          </div>

          ${r.treatment ? `<div><strong>Treatment & Procedures:</strong> <span>${r.treatment}</span></div>` : ''}

          ${medsList ? `<div><strong>Prescribed Medications:</strong><div class="timeline-meds-list" style="margin-top:4px;">${medsList}</div></div>` : ''}

          ${r.notes ? `<div style="font-size:0.8125rem; color:#475569; background:#F1F5F9; padding:8px 12px; border-radius:6px;"><strong>Clinical Advice:</strong> ${r.notes}</div>` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:0.75rem; color:#64748B; margin-top:8px; padding-top:8px; border-top:1px dashed #E2E8F0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-success">✓ ${r.status || 'Completed'}</span>
              ${r.follow_up_days > 0 ? `<span>🔔 Follow-up in <strong>${r.follow_up_days} days</strong></span>` : ''}
            </div>

            <!-- Contextual Actions for Doctor (Edit) vs Worker (Rate) -->
            <div>
              ${isDoctorView || AppState.currentView === 'doctor' ? `
                <button class="btn btn-secondary btn-sm" onclick="openEditRecordModal('${r.record_id}')" style="font-weight:600; padding:4px 10px;">
                  ✏️ Edit Report
                </button>
              ` : `
                ${isReviewed ? `
                  <span class="rating-badge" title="Reviewed by patient">✓ Rated (${isReviewed}★)</span>
                ` : `
                  <button class="btn btn-secondary btn-sm" onclick="openRatingModal('${r.record_id}', '${docId}', '${r.doctor_name.replace(/'/g, "\\'")}', '${r.hospital.replace(/'/g, "\\'")}')" style="font-weight:600; padding:4px 10px; color:#92400E; border-color:#FDE68A; background:#FEF3C7;">
                    ⭐ Rate Doctor
                  </button>
                `}
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function reportType(record) {
  if (/vaccin/i.test(`${record.condition} ${record.diagnosis}`)) return 'Vaccination';
  if (/lab|test|screen/i.test(`${record.condition} ${record.diagnosis}`)) return 'Lab Report';
  return 'Doctor Visit';
}

function renderPatientReports(records, container, filter = 'all') {
  const filtered = filter === 'all' ? records : records.filter(r => reportType(r).toLowerCase().includes(filter) || (filter === 'prescription' && r.medicines));
  if (!filtered.length) { container.innerHTML = '<div class="empty-state">No reports match this filter.</div>'; return; }
  container.innerHTML = `<div class="table-responsive"><table class="data-table medical-report-table"><thead><tr><th>Date / Type</th><th>Created By</th><th>Diagnosis & Treatment</th><th>Prescription / Follow-up</th><th>Actions</th></tr></thead><tbody>${filtered.map(r => `<tr><td><strong>${r.visit_date}</strong><br><span class="badge badge-slate">${reportType(r)}</span></td><td><strong>${r.doctor_name}</strong><br><small>${r.doctor_id || 'ID unavailable'} • ${r.hospital}</small></td><td>${r.diagnosis || 'Not recorded'}<br><small>${r.treatment || 'No treatment recorded'}</small></td><td>${r.medicines || 'None recorded'}<br><small>${r.follow_up_days ? `Follow-up in ${r.follow_up_days} days` : 'No follow-up recorded'}</small></td><td><div class="report-actions"><button class="btn btn-secondary btn-sm" onclick="viewMedicalReport('${r.record_id}')">View</button><button class="btn btn-secondary btn-sm" onclick="printMedicalReport('${r.record_id}')">Print</button><button class="btn btn-primary btn-sm" onclick="downloadMedicalReport('${r.record_id}')">Download / Save as PDF</button></div></td></tr>`).join('')}</tbody></table></div>`;
  const latest = records[0];
  if (latest) document.getElementById('worker-latest-report').textContent = `${latest.visit_date} • ${reportType(latest)}`;
  const follow = records.find(r => Number(r.follow_up_days) > 0);
  document.getElementById('worker-follow-up').textContent = follow ? `${follow.follow_up_days} days after ${follow.visit_date}` : 'No follow-up scheduled';
}

function populateMedicalReport(recordId) {
  const r = AppState.records.find(item => item.record_id === recordId);
  const w = AppState.workerData;
  if (!r || !w || w.health_id !== AppState.activeWorkerHealthId) return null;
  const values = { 'report-patient':w.name, 'report-health-id':w.health_id, 'report-date':r.visit_date, 'report-type':reportType(r), 'report-doctor':r.doctor_name, 'report-doctor-id':r.doctor_id || 'Not available', 'report-hospital':r.hospital, 'report-diagnosis':r.diagnosis || 'Not recorded', 'report-treatment':r.treatment || 'Not recorded', 'report-medicines':r.medicines || 'None recorded', 'report-follow-up':r.follow_up_days ? `${r.follow_up_days} days` : 'Not scheduled', 'report-notes':r.notes || 'None', 'report-allergies':w.allergies || 'None reported', 'report-conditions':w.conditions || 'None reported' };
  Object.entries(values).forEach(([id,value]) => { const el=document.getElementById(id); if(el) el.textContent=value; });
  document.getElementById('report-avatar').src = w.photo_url || '/static/img/generic-avatar.svg';
  QRCodeGenerator.render('report-qr', verificationUrl(`/verify/${w.health_id}/${r.record_id}`), 90, '#0F766E');
  AppState.currentReportId = recordId;
  return r;
}
function viewMedicalReport(id) { if (populateMedicalReport(id)) { const source=document.querySelector('#printable-medical-report .print-report-sheet'); const preview=document.getElementById('medical-report-preview'); preview.innerHTML=''; preview.appendChild(source.cloneNode(true)); openModal('modal-medical-report'); } }
function printMedicalReport(id) { if (!populateMedicalReport(id)) return; document.body.classList.add('report-print'); const printable=document.getElementById('printable-medical-report'); printable.classList.add('print-active'); void printable.offsetHeight; window.print(); }
function downloadMedicalReport(id) { printMedicalReport(id); }
function clearReportPrint(){ document.body.classList.remove('report-print'); document.getElementById('printable-medical-report')?.classList.remove('print-active'); }
function showWorkerTab(id){ document.querySelector(`.worker-tab-btn[data-tab="${id}"]`)?.click(); }
async function addPersonalHealthDocument(){ const file=document.getElementById('health-document-input').files[0]; const note=document.getElementById('patient-note').value.trim(); if(!file) return showToast('Choose a document first','danger'); if(file.size>3*1024*1024) return showToast('Choose a document smaller than 3 MB','danger'); const document_data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)}); const res=await API.addPersonalDocument({worker_health_id:AppState.activeWorkerHealthId,file_name:file.name,mime_type:file.type,document_data,patient_note:note}); if(!res.success)return showToast(res.error||'Upload failed','danger'); document.getElementById('health-document-input').value=''; document.getElementById('patient-note').value=''; renderPersonalDocuments((await API.getPersonalDocuments(AppState.activeWorkerHealthId)).data||[]); showToast('Personal document saved without changing clinical records','success'); }
function renderPersonalDocuments(docs){const el=document.getElementById('personal-documents-list');if(!el)return;el.innerHTML=docs.length?docs.map(d=>`<div class="form-card" style="padding:1rem;margin-bottom:.5rem"><strong>Patient-provided: ${d.file_name}</strong><br><small>${d.created_at}${d.patient_note?` • Note/correction request: ${d.patient_note}`:''}</small>${d.document_data?`<br><a class="btn btn-secondary btn-sm" href="${d.document_data}" download="${d.file_name}" style="margin-top:.5rem">Open / Download</a>`:''}</div>`).join(''):'<p>No personal documents uploaded.</p>';}

function renderWorkerScreenings(screenings) {
  const container = document.getElementById('worker-screenings-list');
  if (!container) return;

  if (screenings.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0; color:#64748B;">
        <p>No community health camp screenings recorded yet.</p>
      </div>
    `;
    return;
  }

  let html = '';
  screenings.forEach(s => {
    html += `
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; margin-bottom:1rem; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h4 style="font-size:1.05rem; font-weight:700; color:#0F172A;">🏕️ ${s.camp_name}</h4>
          <span class="badge badge-primary">📅 ${s.screening_date}</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.75rem; background:#F8FAFC; padding:0.75rem; border-radius:8px; font-size:0.8125rem; margin-bottom:0.5rem;">
          <div><span style="color:#64748B;">Blood Pressure:</span><br><strong>${s.blood_pressure}</strong></div>
          <div><span style="color:#64748B;">Blood Sugar:</span><br><strong>${s.blood_sugar}</strong></div>
          <div><span style="color:#64748B;">BMI:</span><br><strong>${s.bmi} kg/m²</strong></div>
          <div><span style="color:#64748B;">Vision:</span><br><strong>${s.vision}</strong></div>
        </div>
        <p style="font-size:0.8125rem; color:#475569;"><strong>Notes:</strong> ${s.notes || 'Normal vitals recorded.'}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderWorkerConsents(consents) {
  const container = document.getElementById('worker-consents-list');
  if (!container) return;

  if (consents.length === 0) {
    container.innerHTML = `<p style="color:#64748B;">No active consent requests.</p>`;
    return;
  }

  let html = '';
  consents.forEach(c => {
    const isPending = c.status === 'pending';
    const isGranted = c.status === 'granted';

    html += `
      <div style="background:#FFFFFF; border:1px solid ${isPending ? 'var(--warning-border)' : '#E2E8F0'}; border-radius:12px; padding:1.25rem; margin-bottom:1rem; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div>
            <h4 style="font-size:1rem; font-weight:700; color:#0F172A;">👨‍⚕️ ${c.doctor_name} (${c.hospital})</h4>
            <p style="font-size:0.8125rem; color:#64748B;"><strong>Purpose:</strong> ${c.purpose}</p>
            <p style="font-size:0.75rem; color:#64748B;"><strong>Scope:</strong> ${c.access_scope} • Requested: ${c.created_at}</p>
          </div>
          <span class="badge ${isGranted ? 'badge-success' : (isPending ? 'badge-warning' : 'badge-danger')}">
            ${c.status.toUpperCase()}
          </span>
        </div>

        ${isPending ? `
          <div style="display:flex; gap:8px; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid #F1F5F9;">
            <button class="btn btn-primary btn-sm" onclick="handleConsentAction('${c.consent_id}', 'allow')">✓ Allow Access (24 Hours)</button>
            <button class="btn btn-secondary btn-sm" onclick="handleConsentAction('${c.consent_id}', 'deny')">✕ Deny</button>
          </div>
        ` : (isGranted ? `
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#64748B; margin-top:0.5rem;">
            <span>⏳ Access valid until: <strong>${c.expires_at}</strong></span>
            <button class="btn btn-secondary btn-sm" style="color:var(--danger-text);" onclick="handleConsentAction('${c.consent_id}', 'revoke')">Revoke Access</button>
          </div>
        ` : '')}
      </div>
    `;
  });

  container.innerHTML = html;
}

async function handleConsentAction(consentId, action) {
  const res = await API.respondConsent(consentId, action);
  if (res.success) {
    window.showToast(`Consent updated: ${res.status.toUpperCase()}`, 'success');
    loadWorkerDashboard(AppState.activeWorkerHealthId);
  }
}

// 4. DOCTOR DASHBOARD & WORKFLOW
async function loadDoctorDashboard() {
  // Update Doctor UI in Sidebar and Header
  const nameEl = document.getElementById('doc-profile-name');
  if (nameEl) nameEl.textContent = AppState.activeDoctorName;

  const hospEl = document.getElementById('doc-profile-hospital');
  if (hospEl) hospEl.textContent = AppState.activeHospital;

  const ratingEl = document.getElementById('doc-profile-rating');
  if (ratingEl) {
    ratingEl.innerHTML = `<span class="rating-badge">⭐ ${AppState.activeDoctorRating ?? '—'} (${AppState.activeDoctorRatingCount || 0})</span>`;
  }

  document.getElementById('doctor-medical-timeline').innerHTML = '<div class="empty-state">Search for a worker by Health ID to begin.</div>';
}

async function handleDoctorLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const identifier = form.doctor_id.value.trim();
  const password = form.password.value.trim();

  if (!identifier || !password) {
    window.showToast('Please enter your Doctor ID/Email and password', 'warning');
    return;
  }

  const res = await API.loginDoctor({ doctor_id: identifier, password: password });
  if (res.success && res.doctor) {
    const doc = res.doctor;
    AppState.isDoctorLoggedIn = true;
    AppState.activeDoctorId = doc.doctor_id;
    AppState.activeDoctorName = doc.name;
    AppState.activeHospital = doc.hospital;
    AppState.activeDoctorSpecialization = doc.specialization;
    AppState.activeDoctorRating = doc.avg_rating || 5.0;
    AppState.activeDoctorRatingCount = doc.rating_count || 0;
    AppState.currentRole = 'doctor';

    window.showToast(`Logged in successfully as ${doc.name}`, 'success');
    closeModal('modal-doctor-login');
    loadDoctorDashboard();
    navigateTo('doctor');
  } else {
    window.showToast(res.error || 'Invalid doctor credentials', 'danger');
  }
}

function quickSelectDoctor(docId, name, hospital, pwd = 'doctor123') {
  const idInput = document.getElementById('login-doctor-id');
  const pwdInput = document.getElementById('login-doctor-pwd');
  if (idInput) idInput.value = docId;
  if (pwdInput) pwdInput.value = pwd;

  document.querySelectorAll('.doctor-quick-pill').forEach(pill => pill.classList.remove('selected'));
  const activePill = document.getElementById(`quick-doc-${docId.toLowerCase().replace('-', '')}`);
  if (activePill) activePill.classList.add('selected');
}

function logoutDoctor() {
  logout();
}

async function openDoctorProfileModal(doctorId) {
  const docId = doctorId || AppState.activeDoctorId;
  const res = await API.getDoctor(docId);
  if (res.success && res.data) {
    const doc = res.data;
    document.getElementById('modal-doc-name').textContent = doc.name;
    document.getElementById('modal-doc-spec').textContent = doc.specialization;
    document.getElementById('modal-doc-hospital').textContent = `${doc.hospital} (${doc.district})`;
    document.getElementById('modal-doc-phone').textContent = doc.phone;
    document.getElementById('modal-doc-email').textContent = doc.email;
    document.getElementById('modal-doc-rating-badge').innerHTML = `⭐ <strong>${doc.avg_rating || '5.0'}</strong> / 5.0 (${doc.rating_count || 0} patient ratings)`;

    // Render Reviews List
    const reviewsContainer = document.getElementById('modal-doc-reviews-list');
    if (reviewsContainer) {
      const revs = doc.reviews || [];
      if (revs.length === 0) {
        reviewsContainer.innerHTML = `<p style="font-size:0.875rem; color:var(--slate-500); text-align:center; padding:1.5rem 0;">No patient reviews recorded yet.</p>`;
      } else {
        reviewsContainer.innerHTML = revs.map(r => `
          <div class="review-card-item">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:700; font-size:0.875rem; color:var(--slate-900);">👷 ${r.worker_name}</span>
              <span style="color:#F59E0B; font-size:0.875rem; letter-spacing:1px;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
            </div>
            ${r.review_text ? `<p style="font-size:0.8125rem; color:var(--slate-700); margin:0;">"${r.review_text}"</p>` : ''}
            <div style="font-size:0.75rem; color:var(--slate-400); margin-top:4px;">📅 ${r.created_at}</div>
          </div>
        `).join('');
      }
    }

    openModal('modal-doctor-profile');
  } else {
    window.showToast('Could not load doctor profile', 'danger');
  }
}

async function searchWorkerAsDoctor(searchQuery) {
  const query = searchQuery || document.getElementById('doctor-search-input').value.trim();
  if (!query) {
    window.showToast('Please enter a Health ID or Phone Number', 'warning');
    return;
  }

  const res = await API.getWorker(query);
  const resultCard = document.getElementById('doctor-worker-result');

  if (res.success && res.data) {
    const worker = res.data;
    AppState.workerData = worker;
    resultCard.style.display = 'block';

    document.getElementById('doc-worker-name').textContent = worker.name;
    document.getElementById('doc-worker-id').textContent = worker.health_id;
    document.getElementById('doc-worker-details').textContent = `${worker.age}y / ${worker.gender} • Blood: ${worker.blood_group} • State: ${worker.origin_state} • Language: ${worker.language}`;

    // Check Consent
    const consentRes = await API.getConsentStatus(worker.health_id, AppState.activeDoctorId);
    const hasConsent = consentRes.has_consent;

    const consentGate = document.getElementById('doctor-consent-gate');
    const recordsArea = document.getElementById('doctor-records-unlocked');

    if (hasConsent) {
      consentGate.style.display = 'none';
      recordsArea.style.display = 'block';

      // Load Records and Timeline
      const recRes = await API.getRecords(worker.health_id);
      const scrRes = await API.getScreenings(worker.health_id);
      AppState.records = recRes.data || [];
      renderMedicalTimeline(AppState.records, true);
      
      // Auto-generate AI Summary in Doctor Dashboard
      const aiSummaryData = AIMedicalSummary.generate(worker, recRes.data || [], scrRes.data || []);
      AIMedicalSummary.render('doc-ai-summary-container', aiSummaryData);
    } else {
      consentGate.style.display = 'block';
      recordsArea.style.display = 'none';
    }
  } else {
    window.showToast(`No worker found matching "${query}"`, 'danger');
    resultCard.style.display = 'none';
  }
}

async function requestWorkerConsentFromDoctor() {
  if (!AppState.workerData) return;

  const res = await API.requestConsent({
    worker_health_id: AppState.workerData.health_id,
    doctor_id: AppState.activeDoctorId,
    doctor_name: AppState.activeDoctorName,
    hospital: AppState.activeHospital,
    purpose: 'Clinical Consultation & Prescription Review',
    access_scope: 'Medical history, Prescriptions, Health Camp vitals'
  });

  if (res.success) {
    window.showToast("Consent request sent to worker's health passport!", "success");
    document.getElementById('consent-sim-notice').style.display = 'block';
  }
}

function simulateWorkerApproval() {
  AppState.hasDoctorConsent = true;
  window.showToast("Worker approved 24-hour access consent!", "success");
  searchWorkerAsDoctor(AppState.workerData.health_id);
}

async function handleAddMedicalRecord(event) {
  event.preventDefault();
  const form = event.target;

  if (!AppState.workerData) {
    window.showToast('Please search and select a worker first', 'danger');
    return;
  }

  const recordData = {
    worker_health_id: AppState.workerData.health_id,
    doctor_id: AppState.activeDoctorId,
    doctor_name: AppState.activeDoctorName,
    hospital: AppState.activeHospital,
    diagnosis: form.diagnosis.value.trim(),
    condition: form.condition.value.trim() || form.diagnosis.value.trim(),
    medicines: form.medicines.value.trim(),
    treatment: form.treatment.value.trim(),
    follow_up_days: form.follow_up_days.value || 0,
    notes: form.notes.value.trim()
  };

  if (!recordData.diagnosis || !recordData.medicines) {
    window.showToast('Diagnosis and Prescribed Medicines are required', 'warning');
    return;
  }

  const res = await API.addRecord(recordData);
  if (res.success) {
    window.showToast('Medical record securely saved to worker timeline!', 'success');
    form.reset();
    closeModal('modal-add-record');
    searchWorkerAsDoctor(AppState.workerData.health_id);
  } else {
    window.showToast('Failed to save record', 'danger');
  }
}

function openEditRecordModal(recordId) {
  const rec = (AppState.records || []).find(r => r.record_id === recordId);
  if (!rec) {
    window.showToast('Record not found', 'danger');
    return;
  }

  document.getElementById('edit-rec-id').value = rec.record_id;
  document.getElementById('edit-rec-condition').value = rec.condition || rec.diagnosis;
  document.getElementById('edit-rec-diagnosis').value = rec.diagnosis;
  document.getElementById('edit-rec-medicines').value = rec.medicines;
  document.getElementById('edit-rec-treatment').value = rec.treatment || '';
  document.getElementById('edit-rec-follow-up').value = rec.follow_up_days || 0;
  document.getElementById('edit-rec-notes').value = rec.notes || '';
  document.getElementById('edit-rec-status').value = rec.status || 'Completed';

  openModal('modal-edit-record');
}

async function handleUpdateMedicalRecord(event) {
  event.preventDefault();
  const form = event.target;
  const recordId = form.record_id.value;

  const updateData = {
    diagnosis: form.diagnosis.value.trim(),
    condition: form.condition.value.trim() || form.diagnosis.value.trim(),
    medicines: form.medicines.value.trim(),
    treatment: form.treatment.value.trim(),
    follow_up_days: parseInt(form.follow_up_days.value || 0),
    notes: form.notes.value.trim(),
    status: form.status.value,
    updated_by_doctor_id: AppState.activeDoctorId,
    updated_by_doctor_name: AppState.activeDoctorName
  };

  const res = await API.updateRecord(recordId, updateData);
  if (res.success) {
    window.showToast('Medical report updated with clinician signature!', 'success');
    closeModal('modal-edit-record');
    if (AppState.currentView === 'doctor' && AppState.workerData) {
      searchWorkerAsDoctor(AppState.workerData.health_id);
    } else {
      loadWorkerDashboard(AppState.activeWorkerHealthId);
    }
  } else {
    window.showToast(res.error || 'Failed to update report', 'danger');
  }
}

// 4.1 PATIENT DOCTOR RATING & REVIEWS
let currentRatingStars = 5;

function openRatingModal(recordId, doctorId, doctorName, hospitalName) {
  document.getElementById('rating-rec-id').value = recordId;
  document.getElementById('rating-doc-id').value = doctorId;
  document.getElementById('rating-doc-name').textContent = doctorName;
  document.getElementById('rating-doc-hospital').textContent = hospitalName;
  document.getElementById('rating-review-text').value = '';
  setRatingStars(5);
  openModal('modal-rate-doctor');
}

function setRatingStars(count) {
  currentRatingStars = count;
  document.getElementById('rating-star-input').value = count;
  document.querySelectorAll('#star-widget-container .star-icon').forEach(star => {
    const val = parseInt(star.getAttribute('data-val'));
    if (val <= count) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
  const labelMap = { 1: '1/5 - Poor', 2: '2/5 - Fair', 3: '3/5 - Good', 4: '4/5 - Very Good', 5: '5/5 - Excellent' };
  const labelEl = document.getElementById('rating-star-label');
  if (labelEl) labelEl.textContent = labelMap[count] || `${count} Stars`;
}

async function handleSubmitRating(event) {
  event.preventDefault();
  const form = event.target;
  const doctorId = form.doctor_id.value;
  const recordId = form.record_id.value;
  const reviewText = form.review_text.value.trim();

  const data = {
    doctor_id: doctorId,
    worker_health_id: AppState.activeWorkerHealthId,
    worker_name: AppState.workerData ? AppState.workerData.name : 'Patient',
    record_id: recordId,
    rating: currentRatingStars,
    review_text: reviewText
  };

  const res = await API.submitReview(data);
  if (res.success) {
    window.showToast('Thank you! Your doctor rating and feedback was submitted.', 'success');
    if (!AppState.workerReviewedRecords) AppState.workerReviewedRecords = {};
    AppState.workerReviewedRecords[recordId] = currentRatingStars;

    closeModal('modal-rate-doctor');
    loadWorkerDashboard(AppState.activeWorkerHealthId);
  } else {
    window.showToast(res.error || 'Failed to submit rating', 'danger');
  }
}

// 5. EMERGENCY PROFILE VIEW
async function loadEmergencyView(healthId) {
  const res = await API.getEmergencyProfile(healthId);
  if (res.success && res.emergency_profile) {
    const ep = res.emergency_profile;
    document.getElementById('emg-name').textContent = ep.name;
    document.getElementById('emg-id').textContent = ep.health_id;
    document.getElementById('emg-blood').textContent = ep.blood_group;
    document.getElementById('emg-allergies').textContent = ep.allergies || 'None';
    document.getElementById('emg-conditions').textContent = ep.conditions || 'None';
    document.getElementById('emg-meds').textContent = ep.medications || 'None';
    document.getElementById('emg-contact-name').textContent = `${ep.emergency_name} (${ep.emergency_relation})`;
    document.getElementById('emg-contact-phone').textContent = ep.emergency_phone;
    document.getElementById('emg-call-btn').setAttribute('href', `tel:${ep.emergency_phone.replace(/\s+/g, '')}`);

    QRCodeGenerator.render('emg-qr', verificationUrl(`/emergency/${ep.health_id}`), 110, '#E11D48');
  }
}

// 6. HEALTH CAMPS MODULE
async function loadHealthCampsView() {
  const res = await API.getHealthCamps();
  const container = document.getElementById('health-camps-list');
  if (!container) return;

  const camps = res.data || [];
  let html = '';
  camps.forEach(c => {
    html += `
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:1.5rem; margin-bottom:1rem; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <div>
            <h4 style="font-size:1.15rem; font-weight:800; color:#0F172A;">🏕️ ${c.name}</h4>
            <p style="font-size:0.875rem; color:#64748B;">📍 ${c.location} (${c.district})</p>
          </div>
          <span class="badge badge-primary">📅 ${c.camp_date}</span>
        </div>
        <div style="font-size:0.8125rem; color:#475569; margin-bottom:1rem;">
          <strong>Organizer:</strong> ${c.organizer} • <strong>Target:</strong> ${c.target_group} • <strong>Screened:</strong> ${c.total_screened || 150}+ workers
        </div>
        <button class="btn btn-primary btn-sm" onclick="openScreeningModal('${c.name}')">+ Record Worker Screening</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openScreeningModal(campName) {
  document.getElementById('scr-camp-name').value = campName;
  document.getElementById('scr-worker-id').value = AppState.activeWorkerHealthId;
  openModal('modal-screening');
}

async function handleSubmitScreening(event) {
  event.preventDefault();
  const form = event.target;

  const data = {
    worker_health_id: form.worker_id.value.trim(),
    camp_name: form.camp_name.value.trim(),
    blood_pressure: form.blood_pressure.value.trim(),
    blood_sugar: form.blood_sugar.value.trim(),
    height_cm: parseFloat(form.height_cm.value),
    weight_kg: parseFloat(form.weight_kg.value),
    vision: form.vision.value,
    vaccination_status: form.vaccination_status.value,
    notes: form.notes.value.trim()
  };

  const res = await API.addScreening(data);
  if (res.success) {
    window.showToast(`Screening saved! Calculated BMI: ${res.bmi} kg/m²`, 'success');
    closeModal('modal-screening');
    form.reset();
  }
}

// 7. ADMIN DASHBOARD & ANALYTICS
async function loadAdminDashboard() {
  const statsRes = await API.getAdminStats();
  if (statsRes.success && statsRes.stats) {
    const s = statsRes.stats;
    document.getElementById('stat-total-workers').textContent = s.total_workers.toLocaleString();
    document.getElementById('stat-total-doctors').textContent = s.total_doctors.toLocaleString();
    document.getElementById('stat-total-camps').textContent = s.total_camps.toLocaleString();
    document.getElementById('stat-total-records').textContent = s.total_records.toLocaleString();

    // Render Charts
    HealthBridgeCharts.renderBarChart('chart-registrations', s.reg_by_month);
    HealthBridgeCharts.renderDistrictProgress('chart-districts', s.district_stats);
    HealthBridgeCharts.renderScreeningDonut('chart-screening-breakdown', s.screening_breakdown);
    HealthBridgeCharts.renderLanguages('chart-languages', s.languages);
  }

  // Load Workers Table
  const workersRes = await API.getWorkers();
  renderAdminWorkersTable(workersRes.data || []);

  // Load Audit Logs
  const auditRes = await API.getAuditLogs();
  renderAdminAuditTable(auditRes.data || []);
  const doctorsRes = await API.getDoctors();
  renderAdminDoctors(doctorsRes.data || []);
}

function renderAdminDoctors(doctors) {
  const tbody = document.getElementById('admin-doctors-tbody');
  if (!tbody) return;
  tbody.innerHTML = doctors.map(d => `<tr><td><strong>${d.doctor_id}</strong></td><td>${d.name}</td><td>${d.hospital}</td><td><span class="badge">${d.status || 'Active'}</span></td><td><button class="btn btn-secondary btn-sm" onclick="toggleDoctorStatus('${d.doctor_id}','${d.status || 'Active'}')">${(d.status || 'Active') === 'Active' ? 'Deactivate' : 'Activate'}</button></td></tr>`).join('');
}

async function handleAddDoctor(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  const res = await API.addDoctor(data);
  if (!res.success) return showToast(res.error || 'Could not add doctor', 'danger');
  closeModal('modal-add-doctor'); event.target.reset(); showToast(`Doctor ${res.doctor_id} created`, 'success'); loadAdminDashboard();
}

async function toggleDoctorStatus(id, current) {
  const status = current === 'Active' ? 'Inactive' : 'Active';
  const res = await API.updateDoctor(id, { status });
  if (!res.success) return showToast(res.error || 'Could not update doctor', 'danger');
  showToast(`${id} is now ${status}`, 'success'); loadAdminDashboard();
}

function renderAdminWorkersTable(workers) {
  const tbody = document.getElementById('admin-workers-tbody');
  if (!tbody) return;

  let html = '';
  workers.forEach(w => {
    html += `
      <tr>
        <td><strong>${w.name}</strong></td>
        <td><span style="font-family:monospace; font-weight:700; color:#0F766E;">${w.health_id}</span></td>
        <td>${w.age} / ${w.gender}</td>
        <td>${w.origin_state} ➔ <strong>${w.current_district}</strong></td>
        <td><span class="badge badge-primary">${w.language}</span></td>
        <td><span class="badge badge-danger">${w.blood_group}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('worker', '${w.health_id}')">View</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function renderAdminAuditTable(logs) {
  const tbody = document.getElementById('admin-audit-tbody');
  if (!tbody) return;

  let html = '';
  logs.forEach(l => {
    const isEmerg = l.status.toLowerCase().includes('emergency');
    html += `
      <tr>
        <td style="font-size:0.75rem; color:#64748B;">${l.timestamp}</td>
        <td><strong>${l.user_name}</strong></td>
        <td><span class="badge badge-slate">${l.role}</span></td>
        <td>${l.action}</td>
        <td style="font-family:monospace; font-size:0.8rem;">${l.target_resource}</td>
        <td><span class="badge ${isEmerg ? 'badge-danger' : 'badge-success'}">${l.status}</span></td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function loadAuditLogsView() {
  loadAdminDashboard();
}

// 8. MODAL HELPERS
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

// Global Regenerate Callback for AI Summary
window.regenerateCurrentAISummary = function () {
  if (AppState.workerData) {
    const aiSummaryData = AIMedicalSummary.generate(AppState.workerData, AppState.records, AppState.screenings);
    AIMedicalSummary.render('doc-ai-summary-container', aiSummaryData);
    AIMedicalSummary.render('worker-ai-summary-tab', aiSummaryData);
    window.showToast("AI Clinical Summary regenerated with latest timeline vitals.", "success");
  }
};

// INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  // Check initial hash/query routing
  const initialHash = window.location.hash.replace('#', '').trim();
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view') || initialHash;

  if (viewParam && ['register', 'get-started', 'worker', 'doctor', 'admin', 'health-worker', 'emergency', 'camps', 'audit', 'role-select'].includes(viewParam)) {
    navigateTo(viewParam);
  } else {
    initLandingView();
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && hash !== AppState.currentView) {
      navigateTo(hash);
    }
  });

  // Tab switcher in Worker Dashboard
  document.querySelectorAll('.worker-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.worker-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.worker-tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) targetPane.style.display = 'block';

      if (btn.getAttribute('data-tab') === 'tab-ai-summary' && AppState.workerData) {
        const aiSummaryData = AIMedicalSummary.generate(AppState.workerData, AppState.records, AppState.screenings);
        AIMedicalSummary.render('worker-ai-summary-tab', aiSummaryData);
      }
    });
  });

  // Mobile menu toggle
  document.getElementById('mobile-nav-toggle')?.addEventListener('click', () => {
    togglePublicMenu();
  });
  document.getElementById('public-menu-close')?.addEventListener('click', closePublicMenu);
  document.getElementById('public-menu-backdrop')?.addEventListener('click', closePublicMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePublicMenu(); });
  document.querySelectorAll('#report-filter-row button').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('#report-filter-row button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderPatientReports(AppState.records, document.getElementById('worker-medical-timeline'), btn.dataset.filter); }));
  window.addEventListener('afterprint', clearReportPrint);
  window.addEventListener('afterprint', clearHealthCardPrint);

  // Live Age calculation from Date of Birth in Worker Registration form
  const dobInput = document.getElementById('reg-dob');
  const ageInput = document.getElementById('reg-age');

  function updateAgeFromDOB() {
    if (dobInput && ageInput) {
      const age = calculateAgeFromDOB(dobInput.value);
      if (age !== '') {
        ageInput.value = age;
      }
    }
  }

  if (dobInput) {
    dobInput.addEventListener('input', updateAgeFromDOB);
    dobInput.addEventListener('change', updateAgeFromDOB);
    // Trigger initial calculation
    updateAgeFromDOB();
  }

  // Live BMI calculation in screening modal
  const heightInput = document.getElementById('scr-height');
  const weightInput = document.getElementById('scr-weight');
  const bmiDisplay = document.getElementById('scr-bmi-display');

  function updateBMI() {
    const h = parseFloat(heightInput?.value || 0);
    const w = parseFloat(weightInput?.value || 0);
    if (h > 0 && w > 0) {
      const bmi = (w / ((h / 100) ** 2)).toFixed(1);
      if (bmiDisplay) bmiDisplay.textContent = `Calculated BMI: ${bmi} kg/m²`;
    }
  }

  heightInput?.addEventListener('input', updateBMI);
  weightInput?.addEventListener('input', updateBMI);
});
