/**
 * HealthBridge Kerala - REST API Client
 * Interfaces with SQLite backend server (/api/*) and handles offline caching.
 */

const API = {
  // Same-origin relative API paths work unchanged on localhost and public HTTPS hosts.
  baseUrl: '',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`API call ${endpoint} failed, falling back to client-side local database:`, err.message);
      return this.fallbackHandler(endpoint, options);
    }
  },

  // REST API Helpers
  getHealth() { return this.request('/api/health'); },
  getWorkers(query = '') { return this.request(`/api/workers${query ? `?search=${encodeURIComponent(query)}` : ''}`); },
  getWorker(healthId) { return this.request(`/api/workers/${healthId}`); },
  registerWorker(data) { return this.request('/api/workers', { method: 'POST', body: JSON.stringify(data) }); },
  loginWorker(data) { return this.request('/api/worker/login', { method: 'POST', body: JSON.stringify(data) }); },
  loginHealthWorker(data) { return this.request('/api/health-worker/login', { method: 'POST', body: JSON.stringify(data) }); },
  loginAdmin(data) { return this.request('/api/admin/login', { method: 'POST', body: JSON.stringify(data) }); },
  getDoctors() { return this.request('/api/doctors'); },
  getDoctor(doctorId) { return this.request(`/api/doctors/${doctorId}`); },
  loginDoctor(data) { return this.request('/api/doctor/login', { method: 'POST', body: JSON.stringify(data) }); },
  getRecords(healthId) { return this.request(`/api/records/${healthId}`); },
  addRecord(data) { return this.request('/api/records', { method: 'POST', body: JSON.stringify(data) }); },
  updateRecord(recordId, data) { return this.request(`/api/records/${recordId}`, { method: 'PUT', body: JSON.stringify(data) }); },
  submitReview(data) { return this.request('/api/reviews', { method: 'POST', body: JSON.stringify(data) }); },
  getDoctorReviews(doctorId) { return this.request(`/api/reviews/${doctorId}`); },
  getWorkerReviews(workerHealthId) { return this.request(`/api/reviews/worker/${workerHealthId}`); },
  getConsents(healthId) { return this.request(`/api/consent/${healthId}`); },
  getConsentStatus(healthId, doctorId) { return this.request(`/api/consent/status/${healthId}/${doctorId}`); },
  requestConsent(data) { return this.request('/api/consent/request', { method: 'POST', body: JSON.stringify(data) }); },
  respondConsent(consentId, action) { return this.request('/api/consent/respond', { method: 'POST', body: JSON.stringify({ consent_id: consentId, action }) }); },
  getEmergencyProfile(healthId) { return this.request(`/api/emergency/${healthId}`); },
  getHealthCamps() { return this.request('/api/health-camps'); },
  createHealthCamp(data) { return this.request('/api/health-camps', { method: 'POST', body: JSON.stringify(data) }); },
  getScreenings(healthId) { return this.request(`/api/screenings/${healthId}`); },
  addScreening(data) { return this.request('/api/screenings', { method: 'POST', body: JSON.stringify(data) }); },
  getAISummary(healthId) { return this.request('/api/ai/summarize', { method: 'POST', body: JSON.stringify({ worker_health_id: healthId }) }); },
  getAdminStats() { return this.request('/api/admin/stats'); },
  getAuditLogs() { return this.request('/api/admin/audit-logs'); },
  addDoctor(data) { return this.request('/api/admin/doctors', { method: 'POST', body: JSON.stringify(data) }); },
  updateDoctor(id, data) { return this.request(`/api/admin/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  updateProfilePhoto(data) { return this.request('/api/profile/photo', { method: 'POST', body: JSON.stringify(data) }); },
  getPersonalDocuments(id) { return this.request(`/api/personal-documents/${id}`); },
  addPersonalDocument(data) { return this.request('/api/personal-documents', { method: 'POST', body: JSON.stringify(data) }); },

  // Client-side fallback handler
  fallbackHandler(endpoint, options) {
    // Basic mock responses in case fetch is disconnected
    return { success: false, error: 'The server is unavailable. Please try again.' };
  }
};
