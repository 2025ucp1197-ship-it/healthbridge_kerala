/**
 * HealthBridge Kerala - Mock AI Medical Summary & Clinician Assistant
 * Demonstrates AI-assisted healthcare record summarization with clinical safety checks.
 */

const AIMedicalSummary = (function () {
  function generateSummary(worker, records = [], screenings = []) {
    const name = worker.name || "Worker";
    const age = worker.age || "N/A";
    const gender = worker.gender || "N/A";
    const allergies = worker.allergies || "None reported";
    const conditions = worker.conditions || "None reported";
    const meds = worker.medications || "None reported";
    const district = worker.current_district || "Kerala";

    // Analyze records
    const recentDiagnoses = records.map(r => r.diagnosis || r.condition).slice(0, 3);
    const hasAsthma = conditions.toLowerCase().includes("asthma") || allergies.toLowerCase().includes("dust");
    const hasPenicillinAllergy = allergies.toLowerCase().includes("penicillin");
    const hasDiabetes = conditions.toLowerCase().includes("diabetes");
    const hasHypertension = conditions.toLowerCase().includes("hypertension");

    // Analyze latest screening
    const latestScreening = screenings[0];
    let vitalsSummary = "Baseline screening indicates vitals are within normal reference limits.";
    if (latestScreening) {
      vitalsSummary = `Recent Camp Screening (${latestScreening.screening_date}): BP ${latestScreening.blood_pressure}, Random Sugar ${latestScreening.blood_sugar}, BMI ${latestScreening.bmi} kg/m² (${latestScreening.status}).`;
    }

    let contraindications = [];
    if (hasPenicillinAllergy) {
      contraindications.push("⚠️ STAMPED ALLERGY: Severe Penicillin hypersensitivity. Do NOT prescribe Amoxicillin, Ampicillin, or beta-lactams. Safe alternatives: Azithromycin, Macrolides, Ciprofloxacin.");
    }
    if (allergies.toLowerCase().includes("sulfa")) {
      contraindications.push("⚠️ SULFA ALLERGY: Avoid Co-trimoxazole, Sulfamethoxazole, and sulfonylurea derivatives.");
    }

    let occupationalAdvice = "Occupational Health: Advise adequate hydration during humid work shifts, scheduled rest breaks, and standard PPE at worksite.";
    if (hasAsthma) {
      occupationalAdvice += " Construction cement dust exposure identified as respiratory trigger. Strongly advise N95 dust mask and carry Salbutamol Inhaler.";
    }

    const summaryText = `
### 🩺 CLINICAL SUMMARY — ${name.toUpperCase()} (ID: ${worker.health_id})
**Demographics**: ${age} yrs | ${gender} | Origin: ${worker.origin_state || "Out-of-state"} | Current Location: ${district}, Kerala
**Language Preference**: ${worker.language || "Hindi"}

---

#### 1. Chronic Baseline & Ongoing Therapy
• **Documented Conditions**: ${conditions}
• **Active Prescription Regimen**: ${meds}
• **Vaccination Status**: ${worker.vaccination_status || "Up to date"}

#### 2. Recent Medical Encounters & Timeline
${recentDiagnoses.length > 0 ? recentDiagnoses.map((d, i) => `• [${records[i]?.visit_date || '2026'}] ${d} (${records[i]?.hospital || 'Kerala Health Facility'})`).join('\n') : '• No recent hospital admissions or acute episodes on record.'}

#### 3. Community Health Screening & Vitals
• ${vitalsSummary}

${contraindications.length > 0 ? `#### 4. Critical Safety & Drug Alerts\n${contraindications.join('\n\n')}` : '#### 4. Safety Alerts\n• No critical adverse drug reactions reported.'}

#### 5. Recommended Clinician Next Steps
• ${hasDiabetes ? 'Schedule 3-month HbA1c glycemic review & diabetic foot inspection.' : (hasHypertension ? 'Routine weekly BP checks at local Primary Health Centre (PHC).' : 'Routine bi-annual occupational health camp review.')}
• ${occupationalAdvice}

---
*Note: Health records travel securely with worker. Records synchronized across Kerala Health facilities.*
    `.trim();

    return {
      formattedText: summaryText,
      hasAlerts: contraindications.length > 0,
      timestamp: new Date().toLocaleString()
    };
  }

  function renderSummaryUI(containerId, summaryData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="ai-summary-card">
        <div class="ai-header-bar">
          <div class="ai-title-wrap">
            <div class="ai-icon-badge">✨</div>
            <div>
              <h3 style="font-size:1.15rem; font-weight:800; color:#0F172A;">AI Medical Summary</h3>
              <p style="font-size:0.75rem; color:#64748B;">Generated: ${summaryData.timestamp}</p>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-copy-ai-summary" title="Copy to clipboard">📋 Copy</button>
            <button class="btn btn-primary btn-sm" id="btn-regen-ai-summary" title="Regenerate">🔄 Regenerate</button>
          </div>
        </div>

        <div class="ai-result-content">
          ${summaryData.formattedText.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)/g, '<h4 style="font-size:1.05rem; font-weight:800; margin:8px 0; color:#0F766E;">$1</h4>').replace(/#### (.*?)/g, '<h5 style="font-size:0.95rem; font-weight:700; margin:8px 0 4px; color:#0369A1;">$1</h5>')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#64748B; padding-top:8px; border-top:1px solid #E2E8F0;">
          <span class="badge badge-primary">AI Clinician Assistant v2.0 (Demo)</span>
          <span>⚠️ For clinician assistance only. Not a medical diagnosis.</span>
        </div>
      </div>
    `;

    document.getElementById('btn-copy-ai-summary')?.addEventListener('click', () => {
      navigator.clipboard.writeText(summaryData.formattedText).then(() => {
        if (window.showToast) window.showToast("AI Summary copied to clipboard!", "success");
      });
    });

    document.getElementById('btn-regen-ai-summary')?.addEventListener('click', () => {
      if (window.regenerateCurrentAISummary) window.regenerateCurrentAISummary();
    });
  }

  return {
    generate: generateSummary,
    render: renderSummaryUI
  };
})();
