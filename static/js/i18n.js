/**
 * HealthBridge Kerala - Multilingual Translation Engine (i18n)
 * Supports English (en), Malayalam (ml), Hindi (hi), Bengali (bn)
 */

const I18N_DICTIONARY = {
  en: {
    app_title: "HealthBridge Kerala",
    app_subtitle: "Digital Health Passport for Migrant Workers",
    tagline: "Your Health. Your Identity. Wherever You Go.",
    hero_title: "Your Health. Your Identity. Wherever You Go.",
    hero_subtitle: "A portable digital health passport designed to provide continuous healthcare access for migrant workers in Kerala.",
    btn_get_started: "Get Started",
    btn_explore_features: "Explore Features",
    btn_emergency_access: "Emergency Access",
    btn_save_health_id: "Save & Create Health ID",
    btn_cancel: "Cancel",
    btn_download_card: "Download Health Card",
    btn_go_dashboard: "Go to Dashboard",
    btn_view_qr: "View QR",
    btn_share_id: "Share Health ID",
    btn_request_access: "Request Access",
    btn_allow_access: "Allow Access",
    btn_deny_access: "Deny Access",
    btn_generate_summary: "Generate AI Summary",
    btn_regenerate: "Regenerate",
    btn_copy_summary: "Copy Summary",
    btn_call_emergency: "Call Emergency Contact",
    btn_add_medical_record: "Add Medical Record",
    btn_submit_screening: "Submit Camp Screening",
    
    // Navigation
    nav_home: "Home",
    nav_register: "Register Worker",
    nav_worker_dashboard: "Worker Dashboard",
    nav_doctor_dashboard: "Doctor Portal",
    nav_admin_dashboard: "Admin Analytics",
    nav_health_camps: "Health Camps",
    nav_sdg_impact: "SDG Impact",
    nav_audit_logs: "Security Audit Logs",
    
    // Roles
    role_worker: "Migrant Worker",
    role_doctor: "Doctor / Healthcare Provider",
    role_admin: "Health Administrator",
    role_emergency: "Emergency Responder",
    continue_as: "Continue as",
    
    // Dashboard Cards & Headers
    health_id_label: "Digital Health ID",
    medical_records_label: "Medical Records",
    vaccinations_label: "Vaccinations",
    prescriptions_label: "Prescriptions",
    lab_reports_label: "Lab & Screening Reports",
    emergency_profile_label: "Emergency Profile",
    consent_mgmt_label: "Consent Management",
    passport_card_title: "Your Digital Health Passport",
    
    // Medical Record Fields
    date_label: "Date",
    hospital_label: "Hospital / Facility",
    condition_label: "Condition / Symptoms",
    diagnosis_label: "Diagnosis",
    medicine_label: "Prescribed Medicines",
    status_label: "Status",
    doctor_label: "Doctor",
    purpose_label: "Purpose",
    expires_in: "Access expires in 24 hours",
    consent_required: "Worker Consent Required",
    consent_prompt: "is requesting access to your digital health records.",
    
    // Emergency Profile
    emergency_title: "EMERGENCY HEALTH PROFILE",
    blood_group_label: "Blood Group",
    allergies_label: "Critical Allergies",
    critical_conditions_label: "Critical Conditions",
    critical_meds_label: "Current Critical Medication",
    emergency_contact_label: "Emergency Contact",
    emergency_phone_label: "Emergency Phone",
    emergency_audit_notice: "Emergency access is logged for patient safety and security.",
    
    // SDG Section
    sdg_section_title: "Aligned with UN Sustainable Development Goals",
    sdg_3_title: "Good Health and Well-being",
    sdg_3_desc: "Improves continuity of healthcare, vaccination tracking, and immediate access to vital medical histories across districts.",
    sdg_10_title: "Reduced Inequalities",
    sdg_10_desc: "Bridges language barriers, empowers vulnerable mobile populations, and ensures universal health protection for guest workers.",
    sdg_9_title: "Industry, Innovation & Infrastructure",
    sdg_9_desc: "Leverages lightweight digital identity, QR verification, and privacy-preserving consent architecture.",
    sdg_16_title: "Peace, Justice & Strong Institutions",
    sdg_16_desc: "Protects patient autonomy via fine-grained consent controls and a tamper-evident security audit log.",
    
    // Why This Matters
    problem_1_title: "Fragmented Medical Records",
    problem_1_desc: "Workers switch employers and districts frequently. Paper prescriptions get lost, leading to repeated tests and misdiagnoses.",
    problem_2_title: "Language & Accessibility Barriers",
    problem_2_desc: "Most interstate workers speak Hindi, Bengali, or Odia, making communication in local clinics difficult during critical consultations.",
    problem_3_title: "Lack of Continuity of Care",
    problem_3_desc: "Chronic conditions like asthma, hypertension, and diabetes go unmanaged when medical records remain trapped in one hospital.",

    // AI Summary
    ai_summary_title: "AI Clinical Summary",
    ai_disclaimer: "AI-generated summary — for clinician assistance only. Prototype demonstration.",

    // Doctor Login & Profile & Ratings
    btn_doctor_login: "Doctor Login",
    btn_doctor_logout: "Logout Doctor",
    btn_edit_record: "Edit Record",
    btn_rate_doctor: "Rate Doctor",
    doctor_rating_title: "Patient Feedback & Rating",
    doctor_profile_title: "Doctor Profile",
    avg_rating_label: "Average Rating",
    total_reviews_label: "Patient Reviews",
    login_prompt_doctor: "Enter your registered Doctor ID or email to access patient records."
  },

  ml: {
    app_title: "ഹെൽത്ത്ബ്രിഡ്ജ് കേരളം",
    app_subtitle: "അതിഥി തൊഴിലാളികൾക്കായുള്ള ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ട്",
    tagline: "നിങ്ങളുടെ ആരോഗ്യം. നിങ്ങളുടെ തിരിച്ചറിയൽ. എവിടെ പോയാലും.",
    hero_title: "നിങ്ങളുടെ ആരോഗ്യം. നിങ്ങളുടെ തിരിച്ചറിയൽ. എവിടെ പോയാലും.",
    hero_subtitle: "കേരളത്തിലെ അതിഥി തൊഴിലാളികൾക്ക് തടസ്സമില്ലാത്ത ആരോഗ്യ സേവനങ്ങൾ ഉറപ്പാക്കുന്ന ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ട്.",
    btn_get_started: "ആരംഭിക്കുക",
    btn_explore_features: "സവിശേഷതകൾ",
    btn_emergency_access: "അടിയന്തര ആക്സസ്",
    btn_save_health_id: "ഹെൽത്ത് ഐഡി ഉണ്ടാക്കുക",
    btn_cancel: "റദ്ദാക്കുക",
    btn_download_card: "ഹെൽത്ത് കാർഡ് ഡൗൺലോഡ് ചെയ്യുക",
    btn_go_dashboard: "ഡാഷ്‌ബോർഡിലേക്ക് പോകൂ",
    btn_view_qr: "ക്യുആർ കാണുക",
    btn_share_id: "ഹെൽത്ത് ഐഡി പങ്കിടുക",
    btn_request_access: "അനുമതി അഭ്യർത്ഥിക്കുക",
    btn_allow_access: "അനുമതി നൽകുക",
    btn_deny_access: "നിരസിക്കുക",
    btn_generate_summary: "AI സംഗ്രഹം തയ്യാറാക്കുക",
    btn_regenerate: "വീണ്ടും ഉണ്ടാക്കുക",
    btn_copy_summary: "പകർത്തുക",
    btn_call_emergency: "അടിയന്തര നമ്പറിലേക്ക് വിളിക്കുക",
    btn_add_medical_record: "ചികിത്സാ വിവരങ്ങൾ ചേർക്കുക",
    btn_submit_screening: "ക്യാമ്പ് പരിശോധന രേഖപ്പെടുത്തുക",

    nav_home: "ഹോം",
    nav_register: "രജിസ്ട്രേഷൻ",
    nav_worker_dashboard: "തൊഴിലാളി ഡാഷ്‌ബോർഡ്",
    nav_doctor_dashboard: "ഡോക്ടർ പോർട്ടൽ",
    nav_admin_dashboard: "അഡ്മിൻ അനലിറ്റിക്സ്",
    nav_health_camps: "മെഡിക്കൽ ക്യാമ്പുകൾ",
    nav_sdg_impact: "എസ്ഡിജി സ്വാധീനം",
    nav_audit_logs: "ഓഡിറ്റ് ലോഗുകൾ",

    role_worker: "അതിഥി തൊഴിലാളി",
    role_doctor: "ഡോക്ടർ / ആരോഗ്യ പ്രവർത്തകൻ",
    role_admin: "ഹെൽത്ത് അഡ്മിനിസ്ട്രേറ്റർ",
    role_emergency: "എമർജൻസി റെസ്‌പോണ്ടർ",
    continue_as: "തുടരുക",

    health_id_label: "ഡിജിറ്റൽ ഹെൽത്ത് ഐഡി",
    medical_records_label: "മെഡിക്കൽ രേഖകൾ",
    vaccinations_label: "വാക്സിനേഷൻ",
    prescriptions_label: "മരുന്ന് കുറിപ്പുകൾ",
    lab_reports_label: "ലാബ് & സ്ക്രീനിംഗ് റിപ്പോർട്ടുകൾ",
    emergency_profile_label: "അടിയന്തര പ്രൊഫൈൽ",
    consent_mgmt_label: "സമ്മതപത്ര നിർവ്വഹണം",
    passport_card_title: "നിങ്ങളുടെ ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ട്",

    date_label: "തീയതി",
    hospital_label: "ആശുപത്രി",
    condition_label: "രോഗലക്ഷണം",
    diagnosis_label: "രോഗനിർണയം",
    medicine_label: "മരുന്നുകൾ",
    status_label: "നില",
    doctor_label: "ഡോക്ടർ",
    purpose_label: "ഉദ്ദേശ്യം",
    expires_in: "അനുമതി 24 മണിക്കൂറിനുള്ളിൽ അവസാനിക്കും",
    consent_required: "തൊഴിലാളിയുടെ അനുമതി ആവശ്യമാണ്",
    consent_prompt: "നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ കാണാൻ അനുവാദം ചോദിക്കുന്നു.",

    emergency_title: "അടിയന്തര മെഡിക്കൽ പ്രൊഫൈൽ",
    blood_group_label: "രക്തഗ്രൂപ്പ്",
    allergies_label: "അലർജികൾ",
    critical_conditions_label: "ഗുരുതര രോഗങ്ങൾ",
    critical_meds_label: "പ്രധാന മരുന്നുകൾ",
    emergency_contact_label: "അടിയന്തര കോൺടാക്റ്റ്",
    emergency_phone_label: "ഫോൺ നമ്പർ",
    emergency_audit_notice: "സുരക്ഷയ്ക്കായി അടിയന്തര ആക്സസ് രേഖപ്പെടുത്തുന്നതാണ്.",

    sdg_section_title: "യുഎൻ സുസ്ഥിര വികസന ലക്ഷ്യങ്ങൾ (SDG)",
    sdg_3_title: "നല്ല ആരോഗ്യവും ക്ഷേമവും",
    sdg_3_desc: "എല്ലാ ജില്ലകളിലും തുടർച്ചയായ ആരോഗ്യ പരിരക്ഷയും ചികിത്സാ രേഖകളും ലഭ്യമാക്കുന്നു.",
    sdg_10_title: "അസമത്വങ്ങൾ കുറയ്ക്കൽ",
    sdg_10_desc: "ഭാഷാ തടസ്സങ്ങൾ ഇല്ലാതാക്കി അതിഥി തൊഴിലാളികൾക്ക് തുല്യ ആരോഗ്യ അവകാശം ഉറപ്പാക്കുന്നു.",
    sdg_9_title: "നവീകരണവും സാങ്കേതികവിദ്യയും",
    sdg_9_desc: "ലളിതമായ ക്യുആർ കോഡും ഡിജിറ്റൽ ഐഡിയും ഉപയോഗിച്ച് വേഗത്തിലുള്ള പരിശോധന.",
    sdg_16_title: "സുതാര്യതയും ഡാറ്റാ സുരക്ഷയും",
    sdg_16_desc: "രോഗിയുടെ പൂർണ്ണ സമ്മതത്തോടെ മാത്രം വിവരങ്ങൾ കൈമാറുന്നു.",

    problem_1_title: "ചിതറിക്കിടക്കുന്ന മെഡിക്കൽ രേഖകൾ",
    problem_1_desc: "ജില്ലകൾ തോറും മാറുമ്പോൾ പഴയ കുറിപ്പടികൾ നഷ്ടപ്പെടുന്നത് തടയുന്നു.",
    problem_2_title: "ഭാഷാ തടസ്സങ്ങൾ",
    problem_2_desc: "ഹിന്ദി, ബംഗാളി തൊഴിലാളികൾക്ക് ഡോക്ടർമാരുമായി കൃത്യമായി ആശയവിനിമയം നടത്താം.",
    problem_3_title: "തുടർചികിത്സയിലെ തടസ്സങ്ങൾ",
    problem_3_desc: "ആസ്ത്മ, പ്രമേഹം തുടങ്ങിയവ കൃത്യമായി നിരീക്ഷിക്കാൻ സാധിക്കുന്നു.",

    ai_summary_title: "AI മെഡിക്കൽ സംഗ്രഹം",
    ai_disclaimer: "AI തയ്യാറാക്കിയ വിവരണം — ഡോക്ടറുടെ സഹായത്തിന് മാത്രം.",

    // Doctor Login & Profile & Ratings
    btn_doctor_login: "ഡോക്ടർ ലോഗിൻ",
    btn_doctor_logout: "ലോഗ് ഔട്ട്",
    btn_edit_record: "റിക്കോർഡ് തിരുത്തുക",
    btn_rate_doctor: "ഡോക്ടറെ റേറ്റ് ചെയ്യുക",
    doctor_rating_title: "രോഗിയുടെ റേറ്റിംഗും പ്രതികരണവും",
    doctor_profile_title: "ഡോക്ടറുടെ പ്രൊഫൈൽ",
    avg_rating_label: "ശരാശരി റേറ്റിംഗ്",
    total_reviews_label: "രോഗി അഭിപ്രായങ്ങൾ",
    login_prompt_doctor: "രോഗികളുടെ വിവരങ്ങൾ കാണാൻ ഡോക്ടർ ഐഡി നൽകുക."
  },

  hi: {
    app_title: "हेल्थब्रिज केरल",
    app_subtitle: "प्रवासी श्रमिकों के लिए डिजिटल स्वास्थ्य पासपोर्ट",
    tagline: "आपका स्वास्थ्य। आपकी पहचान। आप जहाँ भी जाएँ।",
    hero_title: "आपका स्वास्थ्य। आपकी पहचान। आप जहाँ भी जाएँ।",
    hero_subtitle: "केरल में प्रवासी श्रमिकों को निर्बाध स्वास्थ्य सेवाएं प्रदान करने के लिए एक पोर्टेबल डिजिटल हेल्थ पासपोर्ट।",
    btn_get_started: "शुरू करें",
    btn_explore_features: "सुविधाएँ देखें",
    btn_emergency_access: "आपातकालीन एक्सेस",
    btn_save_health_id: "हेल्थ आईडी बनाएं",
    btn_cancel: "रद्द करें",
    btn_download_card: "हेल्थ कार्ड डाउनलोड करें",
    btn_go_dashboard: "डैशबोर्ड पर जाएं",
    btn_view_qr: "क्यूआर देखें",
    btn_share_id: "हेल्थ आईडी साझा करें",
    btn_request_access: "अनुमति का अनुरोध करें",
    btn_allow_access: "अनुमति दें",
    btn_deny_access: "अस्वीकार करें",
    btn_generate_summary: "AI सारांश बनाएं",
    btn_regenerate: "पुनः उत्पन्न करें",
    btn_copy_summary: "कॉपी करें",
    btn_call_emergency: "आपातकालीन संपर्क को कॉल करें",
    btn_add_medical_record: "चिकित्सा रिकॉर्ड जोड़ें",
    btn_submit_screening: "कैंप जांच दर्ज करें",

    nav_home: "होम",
    nav_register: "श्रमिक पंजीकरण",
    nav_worker_dashboard: "श्रमिक डैशबोर्ड",
    nav_doctor_dashboard: "डॉक्टर पोर्टल",
    nav_admin_dashboard: "एडमिन विश्लेषण",
    nav_health_camps: "स्वास्थ्य शिविर",
    nav_sdg_impact: "एसडीजी प्रभाव",
    nav_audit_logs: "सुरक्षा ऑडिट लॉग",

    role_worker: "प्रवासी श्रमिक",
    role_doctor: "डॉक्टर / स्वास्थ्य प्रदाता",
    role_admin: "स्वास्थ्य प्रशासक",
    role_emergency: "आपातकालीन सहायक",
    continue_as: "के रूप में जारी रखें",

    health_id_label: "डिजिटल हेल्थ आईडी",
    medical_records_label: "चिकित्सा रिकॉर्ड",
    vaccinations_label: "टीकाकरण",
    prescriptions_label: "दवा पर्ची",
    lab_reports_label: "लैब और स्क्रीनिंग रिपोर्ट",
    emergency_profile_label: "आपातकालीन प्रोफ़ाइल",
    consent_mgmt_label: "सहमति प्रबंधन",
    passport_card_title: "आपका डिजिटल हेल्थ पासपोर्ट",

    date_label: "दिनांक",
    hospital_label: "अस्पताल",
    condition_label: "लक्षण / बीमारी",
    diagnosis_label: "निदान (डायग्नोसिस)",
    medicine_label: "दवाइयां",
    status_label: "स्थिति",
    doctor_label: "डॉक्टर",
    purpose_label: "उद्देश्य",
    expires_in: "पहुंच 24 घंटे में समाप्त होगी",
    consent_required: "श्रमिक की सहमति आवश्यक है",
    consent_prompt: "आपके स्वास्थ्य रिकॉर्ड देखने का अनुरोध कर रहे हैं।",

    emergency_title: "आपातकालीन स्वास्थ्य प्रोफ़ाइल",
    blood_group_label: "रक्त समूह (Blood Group)",
    allergies_label: "एलर्जी",
    critical_conditions_label: "गंभीर बीमारियां",
    critical_meds_label: "नियमित महत्वपूर्ण दवाएं",
    emergency_contact_label: "आपातकालीन संपर्क",
    emergency_phone_label: "फ़ोन नंबर",
    emergency_audit_notice: "रोगी की सुरक्षा के लिए आपातकालीन पहुंच को लॉग किया जाता है।",

    sdg_section_title: "संयुक्त राष्ट्र सतत विकास लक्ष्य (SDGs)",
    sdg_3_title: "उत्तम स्वास्थ्य और खुशहाली",
    sdg_3_desc: "जिलों में जाने पर भी उपचार और पुराने रिकॉर्ड की निरंतरता सुनिश्चित करता है।",
    sdg_10_title: "असमानताओं में कमी",
    sdg_10_desc: "भाषा और दूरी की बाधाओं को दूर कर श्रमिकों को समान स्वास्थ्य अधिकार देता है।",
    sdg_9_title: "उद्योग, नवाचार और बुनियादी ढांचा",
    sdg_9_desc: "डिजिटल पहचान और क्यूआर कोड आधारित आधुनिक स्वास्थ्य प्रणाली।",
    sdg_16_title: "शांति, न्याय और मजबूत संस्थाएं",
    sdg_16_desc: "रोगी की पूर्ण सहमति और सुरक्षित ऑडिट लॉग से गोपनीयता की रक्षा।",

    problem_1_title: "बिखरे हुए चिकित्सा रिकॉर्ड",
    problem_1_desc: "अस्पताल बदलने पर पुराने पर्चे खो जाते हैं, जिससे बार-बार टेस्ट कराने पड़ते हैं।",
    problem_2_title: "भाषा और पहुंच की बाधाएं",
    problem_2_desc: "हिंदी और बंगाली भाषी श्रमिकों को स्थानीय भाषा में समझाने में आसानी होती है।",
    problem_3_title: "उपचार की निरंतरता का अभाव",
    problem_3_desc: "अस्थमा, उच्च रक्तचाप और मधुमेह का समय पर सही उपचार जारी रहता है।",

    ai_summary_title: "AI चिकित्सा सारांश",
    ai_disclaimer: "AI-जनित सारांश — केवल डॉक्टर की सहायता के लिए।",

    // Doctor Login & Profile & Ratings
    btn_doctor_login: "डॉक्टर लॉगिन",
    btn_doctor_logout: "लॉगआउट",
    btn_edit_record: "रिकॉर्ड संपादित करें",
    btn_rate_doctor: "डॉक्टर को रेटिंग दें",
    doctor_rating_title: "मरीज़ की रेटिंग और प्रतिक्रिया",
    doctor_profile_title: "डॉक्टर प्रोफ़ाइल",
    avg_rating_label: "औसत रेटिंग",
    total_reviews_label: "समीक्षाएं",
    login_prompt_doctor: "रोगी के रिकॉर्ड देखने के लिए डॉक्टर आईडी से लॉगिन करें।"
  },

  bn: {
    app_title: "হেলথব্রিজ কেরালা",
    app_subtitle: "অভিবাসী শ্রমিকদের জন্য ডিজিটাল হেলথ পাসপোর্ট",
    tagline: "আপনার স্বাস্থ্য। আপনার পরিচয়। আপনি যেখানেই যান।",
    hero_title: "আপনার স্বাস্থ্য। আপনার পরিচয়। আপনি যেখানেই যান।",
    hero_subtitle: "কেরালা রাজ্যে কর্মরত অভিবাসী শ্রমিকদের নিরবচ্ছিন্ন স্বাস্থ্যসেবা প্রদানের জন্য একটি বহনযোগ্য ডিজিটাল স্বাস্থ্য পাসপোর্ট।",
    btn_get_started: "শুরু করুন",
    btn_explore_features: "বৈশিষ্ট্যগুলি দেখুন",
    btn_emergency_access: "জরুরী অ্যাক্সেস",
    btn_save_health_id: "হেলথ আইডি তৈরি করুন",
    btn_cancel: "বাতিল করুন",
    btn_download_card: "হেলথ কার্ড ডাউনলোড করুন",
    btn_go_dashboard: "ড্যাশবোর্ডে যান",
    btn_view_qr: "কিউআর দেখুন",
    btn_share_id: "হেলথ আইডি শেয়ার করুন",
    btn_request_access: "অনুমতির অনুরোধ করুন",
    btn_allow_access: "অনুমতি দিন",
    btn_deny_access: "প্রত্যাখ্যান করুন",
    btn_generate_summary: "AI সারাংশ তৈরি করুন",
    btn_regenerate: "পুনরায় তৈরি করুন",
    btn_copy_summary: "কপি করুন",
    btn_call_emergency: "জরুরী নম্বরে কল করুন",
    btn_add_medical_record: "চিকিৎসার বিবরণ যোগ করুন",
    btn_submit_screening: "ক্যাম্প স্ক্রিনিং জমা দিন",

    nav_home: "হোম",
    nav_register: "শ্রমিক নিবন্ধন",
    nav_worker_dashboard: "শ্রমিক ড্যাশবোর্ড",
    nav_doctor_dashboard: "ডাক্তার পোর্টাল",
    nav_admin_dashboard: "অ্যাডমিন বিশ্লেষণ",
    nav_health_camps: "স্বাস্থ্য শিবির",
    nav_sdg_impact: "এসডিজি প্রভাব",
    nav_audit_logs: "অডিট লগ",

    role_worker: "অভিবাসী শ্রমিক",
    role_doctor: "চিকিৎসক / স্বাস্থ্যকর্মী",
    role_admin: "স্বাস্থ্য প্রশাসক",
    role_emergency: "জরুরী সাহায্যকারী",
    continue_as: "হিসাবে চালিয়ে যান",

    health_id_label: "ডিজিটাল হেলথ আইডি",
    medical_records_label: "চিকিৎসা রেকর্ড",
    vaccinations_label: "টিকাকরণ",
    prescriptions_label: "প্রেসক্রিপশন",
    lab_reports_label: "ল্যাব ও স্ক্রিনিং রিপোর্ট",
    emergency_profile_label: "জরুরী প্রোফাইল",
    consent_mgmt_label: "অনুমতি ব্যবস্থাপনা",
    passport_card_title: "আপনার ডিজিটাল হেলথ পাসপোর্ট",

    date_label: "তারিখ",
    hospital_label: "হাসপাতাল",
    condition_label: "লক্ষণ / রোগ",
    diagnosis_label: "রোগ নির্ণয়",
    medicine_label: "ওষুধ",
    status_label: "অবস্থা",
    doctor_label: "ডাক্তার",
    purpose_label: "উদ্দেশ্য",
    expires_in: "অ্যাক্সেস ২৪ ঘন্টার মধ্যে শেষ হবে",
    consent_required: "শ্রমিকের সম্মতি প্রয়োজন",
    consent_prompt: "আপনার স্বাস্থ্য রেকর্ড দেখার অনুমতি চাইছে।",

    emergency_title: "জরুরী স্বাস্থ্য প্রোফাইল",
    blood_group_label: "রক্তের গ্রুপ",
    allergies_label: "অ্যালার্জি",
    critical_conditions_label: "গুরুতর রোগ",
    critical_meds_label: "নিয়মিত প্রয়োজনীয় ওষুধ",
    emergency_contact_label: "জরুরী যোগাযোগ",
    emergency_phone_label: "ফোন নম্বর",
    emergency_audit_notice: "রোগীর নিরাপত্তার জন্য জরুরী অ্যাক্সেস লগ করা হয়।",

    sdg_section_title: "জাতিসংঘের টেকসই উন্নয়ন লক্ষ্যমাত্রা (SDG)",
    sdg_3_title: "সুস্বাস্থ্য ও কল্যাণ",
    sdg_3_desc: "যেকোনো জেলায় গেলে চিকিৎসার তথ্য ও রেকর্ডের ধারাবাহিকতা বজায় রাখে।",
    sdg_10_title: "অসমতা হ্রাস",
    sdg_10_desc: "ভাষার দূরত্ব দূর করে শ্রমিকদের সার্বজনীন স্বাস্থ্য অধিকার নিশ্চিত করে।",
    sdg_9_title: "শিল্প, উদ্ভাবন ও পরিকাঠামো",
    sdg_9_desc: "ডিজিটাল পরিচয় এবং কিউআর কোড ভিত্তিক আধুনিক স্বাস্থ্য পরিকাঠামো।",
    sdg_16_title: "শান্তি, ন্যায়বিচার ও শক্তিশালী প্রতিষ্ঠান",
    sdg_16_desc: "রোগীর সম্পূর্ণ সম্মতি ও স্বচ্ছ অডিট লগের মাধ্যমে তথ্যের নিরাপত্তা প্রদান।",

    problem_1_title: "ছিন্নভিন্ন চিকিৎসা রেকর্ড",
    problem_1_desc: "হাসপাতাল পরিবর্তন করলে পুরোনো প্রেসক্রিপশন হারিয়ে যাওয়া রোধ করে।",
    problem_2_title: "ভাষা ও যোগাযোগের বাধা",
    problem_2_desc: "বাংলা ও হিন্দিভাষী শ্রমিকদের সঠিক চিকিৎসা পেতে সাহায্য করে।",
    problem_3_title: "চিকিৎসার ধারাবাহিকতার অভাব",
    problem_3_desc: "হাঁপানি বা ডায়াবেটিসের মতো দীর্ঘস্থায়ী রোগের সঠিক পর্যবেক্ষণ নিশ্চিত করে।",

    ai_summary_title: "AI চিকিৎসা সারাংশ",
    ai_disclaimer: "AI দ্বারা তৈরি সারাংশ — কেবল চিকিৎসকের সহায়তার জন্য।",

    // Doctor Login & Profile & Ratings
    btn_doctor_login: "ডাক্তার লগইন",
    btn_doctor_logout: "লগআউট",
    btn_edit_record: "রেকর্ড সম্পাদনা করুন",
    btn_rate_doctor: "ডাক্তারকে রেটিং দিন",
    doctor_rating_title: "রোগীর রেটিং এবং মতামত",
    doctor_profile_title: "ডাক্তারের প্রোফাইল",
    avg_rating_label: "গড় রেটিং",
    total_reviews_label: "রোগীর পর্যালোচনা",
    login_prompt_doctor: "রোগীর রেকর্ড দেখতে ডাক্তার আইডি দিয়ে লগইন করুন।"
  }
};

// Complete-page translations for legacy/static text and dynamically rendered UI.
// Medical values, names, IDs, medicines and facility names are intentionally untouched.
const UI_PHRASES = {
  "Login": ["ലോഗിൻ", "लॉगिन", "লগইন"], "Get Started": ["ആരംഭിക്കുക", "शुरू करें", "শুরু করুন"],
  "Home": ["ഹോം", "होम", "হোম"], "About HealthBridge Kerala": ["ഹെൽത്ത്ബ്രിഡ്ജ് കേരളത്തെക്കുറിച്ച്", "हेल्थब्रिज केरल के बारे में", "হেলথব্রিজ কেরালা সম্পর্কে"],
  "How It Works": ["ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു", "यह कैसे काम करता है", "এটি কীভাবে কাজ করে"], "Features": ["സവിശേഷതകൾ", "विशेषताएँ", "বৈশিষ্ট্য"],
  "SDG Impact": ["SDG സ്വാധീനം", "SDG प्रभाव", "SDG প্রভাব"], "Privacy & Security": ["സ്വകാര്യതയും സുരക്ഷയും", "गोपनीयता और सुरक्षा", "গোপনীয়তা ও নিরাপত্তা"],
  "Help / FAQ": ["സഹായം / ചോദ്യങ്ങൾ", "सहायता / सामान्य प्रश्न", "সহায়তা / প্রশ্নাবলী"], "Contact": ["ബന്ധപ്പെടുക", "संपर्क", "যোগাযোগ"],
  "Register Worker": ["തൊഴിലാളിയെ രജിസ്റ്റർ ചെയ്യുക", "श्रमिक पंजीकरण", "কর্মী নিবন্ধন"], "Explore HealthBridge": ["ഹെൽത്ത്ബ്രിഡ്ജ് അറിയുക", "हेल्थब्रिज देखें", "হেলথব্রিজ দেখুন"],
  "How would you like to get started?": ["എങ്ങനെ ആരംഭിക്കാനാണ് ആഗ്രഹിക്കുന്നത്?", "आप कैसे शुरू करना चाहेंगे?", "আপনি কীভাবে শুরু করতে চান?"],
  "Register New Migrant Worker": ["പുതിയ അതിഥി തൊഴിലാളിയെ രജിസ്റ്റർ ചെയ്യുക", "नए प्रवासी श्रमिक का पंजीकरण", "নতুন অভিবাসী কর্মী নিবন্ধন"],
  "Existing Worker Login": ["നിലവിലുള്ള തൊഴിലാളി ലോഗിൻ", "मौजूदा श्रमिक लॉगिन", "বিদ্যমান কর্মী লগইন"], "Doctor Login": ["ഡോക്ടർ ലോഗിൻ", "डॉक्टर लॉगिन", "ডাক্তার লগইন"],
  "Health Worker Login": ["ആരോഗ്യ പ്രവർത്തക ലോഗിൻ", "स्वास्थ्य कार्यकर्ता लॉगिन", "স্বাস্থ্যকর্মী লগইন"], "Admin Login": ["അഡ്മിൻ ലോഗിൻ", "एडमिन लॉगिन", "অ্যাডমিন লগইন"],
  "Login to HealthBridge Kerala": ["ഹെൽത്ത്ബ്രിഡ്ജ് കേരളത്തിലേക്ക് ലോഗിൻ ചെയ്യുക", "हेल्थब्रिज केरल में लॉगिन करें", "হেলথব্রিজ কেরালায় লগইন করুন"],
  "Worker Login": ["തൊഴിലാളി ലോഗിൻ", "श्रमिक लॉगिन", "কর্মী লগইন"], "Health ID": ["ഹെൽത്ത് ഐഡി", "हेल्थ आईडी", "হেলথ আইডি"], "Password": ["പാസ്‌വേഡ്", "पासवर्ड", "পাসওয়ার্ড"],
  "Login to Portal": ["പോർട്ടലിലേക്ക് ലോഗിൻ ചെയ്യുക", "पोर्टल में लॉगिन करें", "পোর্টালে লগইন করুন"], "Logout": ["ലോഗൗട്ട്", "लॉगआउट", "লগআউট"],
  "My Profile": ["എന്റെ പ്രൊഫൈൽ", "मेरी प्रोफ़ाइल", "আমার প্রোফাইল"], "My Health Card": ["എന്റെ ഹെൽത്ത് കാർഡ്", "मेरा हेल्थ कार्ड", "আমার হেলথ কার্ড"],
  "My Medical Reports": ["എന്റെ മെഡിക്കൽ റിപ്പോർട്ടുകൾ", "मेरी मेडिकल रिपोर्ट", "আমার মেডিকেল রিপোর্ট"], "Lab Reports & Screenings": ["ലാബ് റിപ്പോർട്ടുകളും സ്ക്രീനിംഗുകളും", "लैब रिपोर्ट और स्क्रीनिंग", "ল্যাব রিপোর্ট ও স্ক্রিনিং"],
  "Consent & Requests": ["സമ്മതവും അഭ്യർത്ഥനകളും", "सहमति और अनुरोध", "সম্মতি ও অনুরোধ"], "Upload Health Document": ["ആരോഗ്യ രേഖ അപ്‌ലോഡ് ചെയ്യുക", "स्वास्थ्य दस्तावेज़ अपलोड करें", "স্বাস্থ্য নথি আপলোড করুন"],
  "Doctor Ratings & Summary": ["ഡോക്ടർ റേറ്റിംഗും സംഗ്രഹവും", "डॉक्टर रेटिंग और सारांश", "ডাক্তার রেটিং ও সারাংশ"],
  "Health Card": ["ഹെൽത്ത് കാർഡ്", "हेल्थ कार्ड", "হেলথ কার্ড"], "Latest Medical Report": ["ഏറ്റവും പുതിയ മെഡിക്കൽ റിപ്പോർട്ട്", "नवीनतम मेडिकल रिपोर्ट", "সর্বশেষ মেডিকেল রিপোর্ট"],
  "Upcoming Follow-up": ["വരാനിരിക്കുന്ന ഫോളോ-അപ്പ്", "आगामी फॉलो-अप", "আসন্ন ফলো-আপ"], "Emergency Information": ["അടിയന്തര വിവരങ്ങൾ", "आपातकालीन जानकारी", "জরুরি তথ্য"],
  "Print / Download Health Card": ["ഹെൽത്ത് കാർഡ് പ്രിന്റ് / ഡൗൺലോഡ്", "हेल्थ कार्ड प्रिंट / डाउनलोड", "হেলথ কার্ড প্রিন্ট / ডাউনলোড"],
  "Print Health Card": ["ഹെൽത്ത് കാർഡ് പ്രിന്റ് ചെയ്യുക", "हेल्थ कार्ड प्रिंट करें", "হেলথ কার্ড প্রিন্ট করুন"], "Download Health Card": ["ഹെൽത്ത് കാർഡ് ഡൗൺലോഡ് ചെയ്യുക", "हेल्थ कार्ड डाउनलोड करें", "হেলথ কার্ড ডাউনলোড করুন"],
  "All": ["എല്ലാം", "सभी", "সব"], "Doctor Visit": ["ഡോക്ടർ സന്ദർശനം", "डॉक्टर विज़िट", "ডাক্তার সাক্ষাৎ"], "Prescription": ["മരുന്നുകുറിപ്പ്", "प्रिस्क्रिप्शन", "প্রেসক্রিপশন"],
  "Lab Report": ["ലാബ് റിപ്പോർട്ട്", "लैब रिपोर्ट", "ল্যাব রিপোর্ট"], "Vaccination": ["വാക്സിനേഷൻ", "टीकाकरण", "টিকাদান"], "Screening": ["സ്ക്രീനിംഗ്", "स्क्रीनिंग", "স্ক্রিনিং"],
  "Date / Type": ["തീയതി / തരം", "तारीख / प्रकार", "তারিখ / ধরন"], "Created By": ["സൃഷ്ടിച്ചത്", "बनाने वाला", "তৈরি করেছেন"], "Diagnosis & Treatment": ["രോഗനിർണയവും ചികിത്സയും", "निदान और उपचार", "রোগনির্ণয় ও চিকিৎসা"],
  "Prescription / Follow-up": ["മരുന്നുകുറിപ്പ് / ഫോളോ-അപ്പ്", "प्रिस्क्रिप्शन / फॉलो-अप", "প্রেসক্রিপশন / ফলো-আপ"], "Actions": ["നടപടികൾ", "कार्रवाई", "কাজ"],
  "View": ["കാണുക", "देखें", "দেখুন"], "Print": ["പ്രിന്റ്", "प्रिंट", "প্রিন্ট"], "Download / Save as PDF": ["PDF ആയി ഡൗൺലോഡ് / സേവ് ചെയ്യുക", "PDF डाउनलोड / सेव करें", "PDF ডাউনলোড / সেভ করুন"],
  "Medical Report": ["മെഡിക്കൽ റിപ്പോർട്ട്", "मेडिकल रिपोर्ट", "মেডিকেল রিপোর্ট"], "Close": ["അടയ്ക്കുക", "बंद करें", "বন্ধ করুন"], "Print / Save as PDF": ["PDF ആയി പ്രിന്റ് / സേവ് ചെയ്യുക", "PDF प्रिंट / सेव करें", "PDF প্রিন্ট / সেভ করুন"],
  "Change Photo": ["ഫോട്ടോ മാറ്റുക", "फोटो बदलें", "ছবি পরিবর্তন করুন"], "Remove": ["നീക്കം ചെയ്യുക", "हटाएँ", "সরান"],
  "Emergency Access": ["അടിയന്തര പ്രവേശനം", "आपातकालीन एक्सेस", "জরুরি অ্যাক্সেস"], "Back to Home": ["ഹോമിലേക്ക് മടങ്ങുക", "होम पर वापस जाएँ", "হোমে ফিরুন"],
  "Add Doctor": ["ഡോക്ടറെ ചേർക്കുക", "डॉक्टर जोड़ें", "ডাক্তার যোগ করুন"], "Doctor Account Management": ["ഡോക്ടർ അക്കൗണ്ട് മാനേജ്മെന്റ്", "डॉक्टर खाता प्रबंधन", "ডাক্তার অ্যাকাউন্ট ব্যবস্থাপনা"],
  "Open Screening Workflows": ["സ്ക്രീനിംഗ് പ്രവർത്തനങ്ങൾ തുറക്കുക", "स्क्रीनिंग कार्य खोलें", "স্ক্রিনিং কাজ খুলুন"], "Health Worker Portal": ["ആരോഗ്യ പ്രവർത്തക പോർട്ടൽ", "स्वास्थ्य कार्यकर्ता पोर्टल", "স্বাস্থ্যকর্মী পোর্টাল"]
};
const UI_LANG_INDEX = { ml:0, hi:1, bn:2 };
const UI_TEXT_NODES = new WeakMap();
Object.assign(UI_PHRASES, {
  "Capabilities": ["കഴിവുകൾ","क्षमताएँ","সক্ষমতা"],
  "Platform Capabilities": ["പ്ലാറ്റ്‌ഫോം കഴിവുകൾ","प्लेटफ़ॉर्म क्षमताएँ","প্ল্যাটফর্ম সক্ষমতা"],
  "Comprehensive Healthcare Features": ["സമഗ്ര ആരോഗ്യപരിചരണ സവിശേഷതകൾ","व्यापक स्वास्थ्य सेवा सुविधाएँ","সমন্বিত স্বাস্থ্যসেবা বৈশিষ্ট্য"],
  "Engineered specifically for low-friction, high-trust healthcare delivery in Kerala.": ["കേരളത്തിൽ എളുപ്പവും വിശ്വസനീയവുമായ ആരോഗ്യസേവനത്തിനായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്തത്.","केरल में सरल और भरोसेमंद स्वास्थ्य सेवा के लिए विशेष रूप से निर्मित।","কেরালায় সহজ ও বিশ্বস্ত স্বাস্থ্যসেবার জন্য বিশেষভাবে নির্মিত।"],
  "Our Solution: HealthBridge Kerala": ["ഞങ്ങളുടെ പരിഹാരം: ഹെൽത്ത്ബ്രിഡ്ജ് കേരളം","हमारा समाधान: हेल्थब्रिज केरल","আমাদের সমাধান: হেলথব্রিজ কেরালা"],
  "Portable QR-Based Health Identity": ["കൈമാറ്റയോഗ്യമായ QR അധിഷ്ഠിത ആരോഗ്യ തിരിച്ചറിയൽ","पोर्टेबल QR-आधारित स्वास्थ्य पहचान","বহনযোগ্য QR-ভিত্তিক স্বাস্থ্য পরিচয়"],
  "Granular 24-Hour Patient Consent": ["സൂക്ഷ്മമായ 24 മണിക്കൂർ രോഗി സമ്മതം","विस्तृत 24-घंटे की रोगी सहमति","নির্দিষ্ট ২৪-ঘণ্টার রোগী সম্মতি"],
  "Instant Life-Saving Emergency Profile": ["തൽക്ഷണ ജീവൻരക്ഷാ അടിയന്തര പ്രൊഫൈൽ","तत्काल जीवनरक्षक आपातकालीन प्रोफ़ाइल","তাৎক্ষণিক জীবনরক্ষাকারী জরুরি প্রোফাইল"],
  "1. Digital Health ID": ["1. ഡിജിറ്റൽ ഹെൽത്ത് ഐഡി","1. डिजिटल हेल्थ आईडी","১. ডিজিটাল হেলথ আইডি"],
  "2. QR Health Passport": ["2. QR ഹെൽത്ത് പാസ്‌പോർട്ട്","2. QR हेल्थ पासपोर्ट","২. QR হেলথ পাসপোর্ট"],
  "3. Medical Timeline": ["3. മെഡിക്കൽ ടൈംലൈൻ","3. मेडिकल समयरेखा","৩. মেডিকেল টাইমলাইন"],
  "4. Multilingual Interface": ["4. ബഹുഭാഷാ ഇന്റർഫേസ്","4. बहुभाषी इंटरफ़ेस","৪. বহুভাষিক ইন্টারফেস"],
  "5. Consent Management": ["5. സമ്മത മാനേജ്മെന്റ്","5. सहमति प्रबंधन","৫. সম্মতি ব্যবস্থাপনা"],
  "6. Emergency Mode": ["6. അടിയന്തര മോഡ്","6. आपातकालीन मोड","৬. জরুরি মোড"],
  "7. Health Camp Records": ["7. ആരോഗ്യ ക്യാമ്പ് രേഖകൾ","7. स्वास्थ्य शिविर रिकॉर्ड","৭. স্বাস্থ্য শিবির রেকর্ড"],
  "8. AI Medical Summary": ["8. AI മെഡിക്കൽ സംഗ്രഹം","8. AI मेडिकल सारांश","৮. AI মেডিকেল সারাংশ"],
  "9. Nearby Healthcare Facilities": ["9. സമീപ ആരോഗ്യസേവന കേന്ദ്രങ്ങൾ","9. नज़दीकी स्वास्थ्य सुविधाएँ","৯. নিকটবর্তী স্বাস্থ্যসেবা কেন্দ্র"],
  "10. Follow-up Reminders": ["10. ഫോളോ-അപ്പ് ഓർമ്മപ്പെടുത്തലുകൾ","10. फॉलो-अप अनुस्मारक","১০. ফলো-আপ অনুস্মারক"],
  "Unique standardized identifier (e.g. KL-MW-10234) linked to worker identity across all 14 districts.": ["14 ജില്ലകളിലുമുള്ള തൊഴിലാളിയുടെ തിരിച്ചറിയലുമായി ബന്ധിപ്പിച്ച ഏകീകൃത ഐഡി (ഉദാ. KL-MW-10234).","सभी 14 जिलों में श्रमिक पहचान से जुड़ी विशिष्ट मानकीकृत आईडी (जैसे KL-MW-10234)।","সব ১৪ জেলায় কর্মীর পরিচয়ের সঙ্গে যুক্ত স্বতন্ত্র মানসম্মত আইডি (যেমন KL-MW-10234)।"],
  "Offline-friendly QR code containing secure verification tokens with zero unencrypted medical data.": ["എൻക്രിപ്റ്റ് ചെയ്യാത്ത മെഡിക്കൽ വിവരങ്ങളില്ലാത്ത സുരക്ഷിത സ്ഥിരീകരണ ടോക്കണുകൾ ഉൾക്കൊള്ളുന്ന ഓഫ്‌ലൈൻ സൗഹൃദ QR കോഡ്.","बिना किसी अनएन्क्रिप्टेड चिकित्सा डेटा के सुरक्षित सत्यापन टोकन वाला ऑफ़लाइन-अनुकूल QR कोड।","কোনো এনক্রিপ্ট না-করা চিকিৎসা তথ্য ছাড়াই নিরাপদ যাচাইকরণ টোকেনসহ অফলাইন-বান্ধব QR কোড।"],
  "Chronological, expandable health history spanning hospital visits, prescriptions, and treatments.": ["ആശുപത്രി സന്ദർശനങ്ങൾ, മരുന്നുകുറിപ്പുകൾ, ചികിത്സകൾ എന്നിവ ഉൾപ്പെടുന്ന കാലക്രമത്തിലുള്ള വിശദമായ ആരോഗ്യചരിത്രം.","अस्पताल यात्राओं, नुस्खों और उपचारों की क्रमवार विस्तृत स्वास्थ्य जानकारी।","হাসপাতাল ভিজিট, প্রেসক্রিপশন ও চিকিৎসার ধারাবাহিক বিস্তৃত স্বাস্থ্য-ইতিহাস।"],
  "Full native translation in English, Malayalam (മലയാളം), Hindi (हिन्दी), and Bengali (বাংলা).": ["ഇംഗ്ലീഷ്, മലയാളം, ഹിന്ദി, ബംഗാളി ഭാഷകളിൽ പൂർണ്ണ പരിഭാഷ.","अंग्रेज़ी, मलयालम, हिन्दी और बंगाली में पूर्ण अनुवाद।","ইংরেজি, মালয়ালম, হিন্দি ও বাংলায় সম্পূর্ণ অনুবাদ।"],
  "Workers grant explicit 24-hour time-bound access to doctors with one-tap revocation capability.": ["ഒറ്റ ടാപ്പിൽ പിൻവലിക്കാവുന്ന വ്യക്തമായ 24 മണിക്കൂർ ഡോക്ടർ പ്രവേശനം തൊഴിലാളികൾ നൽകുന്നു.","श्रमिक डॉक्टरों को स्पष्ट 24-घंटे की पहुँच देते हैं, जिसे एक टैप में रद्द किया जा सकता है।","কর্মীরা ডাক্তারদের স্পষ্ট ২৪-ঘণ্টার প্রবেশাধিকার দেন, যা এক ট্যাপে বাতিল করা যায়।"],
  "High-contrast life-saving profile showing only blood group, severe allergies, inhaler meds, and emergency contacts.": ["രക്തഗ്രൂപ്പ്, ഗുരുതര അലർജികൾ, ഇൻഹേലർ മരുന്നുകൾ, അടിയന്തര ബന്ധങ്ങൾ മാത്രം കാണിക്കുന്ന ജീവൻരക്ഷാ പ്രൊഫൈൽ.","केवल रक्त समूह, गंभीर एलर्जी, इनहेलर दवाएँ और आपात संपर्क दिखाने वाली जीवनरक्षक प्रोफ़ाइल।","শুধু রক্তের গ্রুপ, গুরুতর অ্যালার্জি, ইনহেলার ওষুধ ও জরুরি যোগাযোগ দেখানো জীবনরক্ষাকারী প্রোফাইল।"],
  "Home": ["ഹോം","होम","হোম"],
  "Worker": ["തൊഴിലാളി","श्रमिक","কর্মী"],
  "Admin": ["അഡ്മിൻ","एडमिन","অ্যাডমিন"],
  "Government of Kerala • National Health Mission (NHM) Prototype": ["കേരള സർക്കാർ • ദേശീയ ആരോഗ്യ ദൗത്യം (NHM) മാതൃക","केरल सरकार • राष्ट्रीय स्वास्थ्य मिशन (NHM) प्रोटोटाइप","কেরালা সরকার • জাতীয় স্বাস্থ্য মিশন (NHM) প্রোটোটাইপ"],
  "Demo System • Aligned with UN SDGs 3, 10, 9 & 16 • Fictional Medical Data": ["ഡെമോ സംവിധാനം • UN SDG 3, 10, 9, 16 അനുസൃതം • സാങ്കൽപ്പിക മെഡിക്കൽ വിവരങ്ങൾ","डेमो प्रणाली • UN SDG 3, 10, 9 व 16 के अनुरूप • काल्पनिक चिकित्सा डेटा","ডেমো সিস্টেম • UN SDG ৩, ১০, ৯ ও ১৬-এর সঙ্গে সামঞ্জস্যপূর্ণ • কাল্পনিক চিকিৎসা তথ্য"],
  "\"Healthcare records should travel with the worker, not remain trapped in one hospital.\" A secure, mobile-friendly digital health passport that gives workers ownership of their health data.": ["\"ആരോഗ്യ രേഖകൾ ഒരു ആശുപത്രിയിൽ കുടുങ്ങാതെ തൊഴിലാളിയോടൊപ്പം സഞ്ചരിക്കണം.\" തൊഴിലാളികൾക്ക് സ്വന്തം ആരോഗ്യവിവരങ്ങളുടെ നിയന്ത്രണം നൽകുന്ന സുരക്ഷിത മൊബൈൽ സൗഹൃദ ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ട്.","\"स्वास्थ्य रिकॉर्ड श्रमिक के साथ चलने चाहिए, किसी एक अस्पताल में बंद नहीं रहने चाहिए।\" श्रमिकों को अपने स्वास्थ्य डेटा का नियंत्रण देने वाला सुरक्षित, मोबाइल-अनुकूल डिजिटल हेल्थ पासपोर्ट।","\"স্বাস্থ্য রেকর্ড কর্মীর সঙ্গে চলবে, একটি হাসপাতালে আটকে থাকবে না।\" কর্মীদের নিজস্ব স্বাস্থ্যতথ্যের নিয়ন্ত্রণ দেওয়া নিরাপদ, মোবাইল-বান্ধব ডিজিটাল হেলথ পাসপোর্ট।"],
  "Direct synchronization of community health screenings (BP, Blood Sugar, BMI, Vision) to worker history.": ["സാമൂഹിക ആരോഗ്യ പരിശോധനകൾ (BP, രക്തത്തിലെ പഞ്ചസാര, BMI, കാഴ്ച) തൊഴിലാളിയുടെ ചരിത്രത്തിലേക്ക് നേരിട്ട് ചേർക്കുന്നു.","सामुदायिक स्वास्थ्य जाँच (BP, रक्त शर्करा, BMI, दृष्टि) सीधे श्रमिक इतिहास में जुड़ती हैं।","কমিউনিটি স্বাস্থ্য পরীক্ষা (BP, রক্তে শর্করা, BMI, দৃষ্টি) সরাসরি কর্মীর ইতিহাসে যুক্ত হয়।"],
  "Automated clinical risk assistant generating concise history summaries and drug allergy warnings for clinicians.": ["ഡോക്ടർമാർക്കായി ചുരുക്ക ചരിത്രവും മരുന്ന് അലർജി മുന്നറിയിപ്പുകളും സൃഷ്ടിക്കുന്ന യാന്ത്രിക ക്ലിനിക്കൽ റിസ്ക് സഹായി.","चिकित्सकों के लिए संक्षिप्त इतिहास और दवा एलर्जी चेतावनी बनाने वाला स्वचालित क्लिनिकल जोखिम सहायक।","চিকিৎসকদের জন্য সংক্ষিপ্ত ইতিহাস ও ওষুধের অ্যালার্জি সতর্কতা তৈরি করা স্বয়ংক্রিয় ক্লিনিক্যাল ঝুঁকি সহায়ক।"],
  "Directory of Primary Health Centres (PHCs), Taluk Hospitals, and Community Health Centres in Kerala.": ["കേരളത്തിലെ പ്രാഥമിക ആരോഗ്യകേന്ദ്രങ്ങൾ, താലൂക്ക് ആശുപത്രികൾ, സാമൂഹിക ആരോഗ്യകേന്ദ്രങ്ങൾ എന്നിവയുടെ ഡയറക്ടറി.","केरल के प्राथमिक स्वास्थ्य केंद्रों, तालुक अस्पतालों और सामुदायिक स्वास्थ्य केंद्रों की सूची।","কেরালার প্রাথমিক স্বাস্থ্যকেন্দ্র, তালুক হাসপাতাল ও কমিউনিটি স্বাস্থ্যকেন্দ্রের তালিকা।"],
  "Automated alerts for wound dressing changes, vaccination boosters, and chronic medication refills.": ["മുറിവ് ഡ്രസ്സിംഗ് മാറ്റം, വാക്സിൻ ബൂസ്റ്റർ, സ്ഥിരമരുന്ന് റീഫിൽ എന്നിവയ്ക്കുള്ള യാന്ത്രിക അറിയിപ്പുകൾ.","घाव की ड्रेसिंग, टीका बूस्टर और नियमित दवा रीफिल के लिए स्वचालित सूचनाएँ।","ক্ষতের ড্রেসিং, টিকা বুস্টার ও নিয়মিত ওষুধ রিফিলের স্বয়ংক্রিয় সতর্কতা।"],
  "Choose the portal for your existing account.": ["നിങ്ങളുടെ നിലവിലുള്ള അക്കൗണ്ടിനുള്ള പോർട്ടൽ തിരഞ്ഞെടുക്കുക.","अपने मौजूदा खाते का पोर्टल चुनें।","আপনার বর্তমান অ্যাকাউন্টের পোর্টাল বেছে নিন।"],
  "Enter Worker Portal": ["തൊഴിലാളി പോർട്ടലിൽ പ്രവേശിക്കുക","श्रमिक पोर्टल खोलें","কর্মী পোর্টালে প্রবেশ করুন"],
  "Enter Doctor Portal": ["ഡോക്ടർ പോർട്ടലിൽ പ്രവേശിക്കുക","डॉक्टर पोर्टल खोलें","ডাক্তার পোর্টালে প্রবেশ করুন"],
  "Enter Admin Portal": ["അഡ്മിൻ പോർട്ടലിൽ പ്രവേശിക്കുക","एडमिन पोर्टल खोलें","অ্যাডমিন পোর্টালে প্রবেশ করুন"],
  "You have been logged out": ["നിങ്ങൾ ലോഗൗട്ട് ചെയ്തു","आप लॉगआउट हो गए हैं","আপনি লগআউট করেছেন"],
  "Select Access Portal": ["ആക്സസ് പോർട്ടൽ തിരഞ്ഞെടുക്കുക","एक्सेस पोर्टल चुनें","অ্যাক্সেস পোর্টাল নির্বাচন করুন"],
  "Kerala State Migrant Health Initiative": ["കേരള സംസ്ഥാന അതിഥി തൊഴിലാളി ആരോഗ്യ സംരംഭം","केरल राज्य प्रवासी स्वास्थ्य पहल","কেরালা রাজ্য অভিবাসী স্বাস্থ্য উদ্যোগ"],
  "Get Started ➔": ["തുടങ്ങുക ➔","शुरू करें ➔","শুরু করুন ➔"],
  "🚨 Emergency Access": ["🚨 അടിയന്തര പ്രവേശനം","🚨 आपातकालीन एक्सेस","🚨 জরুরি অ্যাক্সেস"],
  "New Migrant Worker in Kerala?": ["കേരളത്തിലെ പുതിയ അതിഥി തൊഴിലാളിയാണോ?","केरल में नए प्रवासी श्रमिक हैं?","কেরালায় নতুন অভিবাসী কর্মী?"],
  "Generate your portable Digital Health Passport in 2 minutes.": ["നിങ്ങളുടെ കൈമാറ്റയോഗ്യമായ ഡിജിറ്റൽ ഹെൽത്ത് പാസ്‌പോർട്ട് 2 മിനിറ്റിൽ സൃഷ്ടിക്കുക.","अपना पोर्टेबल डिजिटल हेल्थ पासपोर्ट 2 मिनट में बनाएं।","২ মিনিটে আপনার বহনযোগ্য ডিজিটাল হেলথ পাসপোর্ট তৈরি করুন।"],
  "Register New Worker ➔": ["പുതിയ തൊഴിലാളിയെ രജിസ്റ്റർ ചെയ്യുക ➔","नए श्रमिक का पंजीकरण ➔","নতুন কর্মী নিবন্ধন ➔"],
  "Migrant Workers Registered": ["രജിസ്റ്റർ ചെയ്ത അതിഥി തൊഴിലാളികൾ","पंजीकृत प्रवासी श्रमिक","নিবন্ধিত অভিবাসী কর্মী"],
  "Districts Covered in Kerala": ["കേരളത്തിൽ ഉൾപ്പെട്ട ജില്ലകൾ","केरल में शामिल जिले","কেরালায় অন্তর্ভুক্ত জেলা"],
  "Consent-Driven Privacy": ["സമ്മതാധിഷ്ഠിത സ്വകാര്യത","सहमति-आधारित गोपनीयता","সম্মতি-ভিত্তিক গোপনীয়তা"],
  "Kerala Health Mission": ["കേരള ആരോഗ്യ ദൗത്യം","केरल स्वास्थ्य मिशन","কেরালা স্বাস্থ্য মিশন"],
  "Health Passport": ["ഹെൽത്ത് പാസ്‌പോർട്ട്","हेल्थ पासपोर्ट","হেলথ পাসপোর্ট"],
  "Demo Health Passport": ["ഡെമോ ഹെൽത്ത് പാസ്‌പോർട്ട്","डेमो हेल्थ पासपोर्ट","ডেমো হেলথ পাসপোর্ট"],
  "Worker profile available after login": ["ലോഗിൻ ചെയ്ത ശേഷം തൊഴിലാളിയുടെ പ്രൊഫൈൽ ലഭ്യമാണ്","लॉगिन के बाद श्रमिक प्रोफ़ाइल उपलब्ध है","লগইনের পরে কর্মীর প্রোফাইল পাওয়া যাবে"],
  "Blood Group": ["രക്തഗ്രൂപ്പ്","रक्त समूह","রক্তের গ্রুপ"],
  "Available after login": ["ലോഗിൻ ചെയ്ത ശേഷം ലഭ്യമാണ്","लॉगिन के बाद उपलब्ध","লগইনের পরে পাওয়া যাবে"],
  "Language": ["ഭാഷ","भाषा","ভাষা"],
  "Your preferred language": ["നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന ഭാഷ","आपकी पसंदीदा भाषा","আপনার পছন্দের ভাষা"],
  "Origin State": ["സ്വദേശ സംസ്ഥാനം","मूल राज्य","নিজ রাজ্য"],
  "Private": ["സ്വകാര്യം","निजी","ব্যক্তিগত"],
  "Status": ["നില","स्थिति","অবস্থা"],
  "Active Verified": ["സജീവം, സ്ഥിരീകരിച്ചു","सक्रिय, सत्यापित","সক্রিয়, যাচাইকৃত"],
  "Scan for Verified Verification Token": ["സ്ഥിരീകരണ ടോക്കൺ പരിശോധിക്കാൻ സ്കാൻ ചെയ്യുക","सत्यापित टोकन के लिए स्कैन करें","যাচাইকৃত টোকেনের জন্য স্ক্যান করুন"],
  "Why This Matters": ["ഇത് എന്തുകൊണ്ട് പ്രധാനമാണ്","यह क्यों महत्वपूर्ण है","এটি কেন গুরুত্বপূর্ণ"],
  "The Healthcare Challenge for Mobile Workers": ["സഞ്ചരിക്കുന്ന തൊഴിലാളികളുടെ ആരോഗ്യപരിചരണ വെല്ലുവിളി","गतिशील श्रमिकों की स्वास्थ्य सेवा चुनौती","চলমান কর্মীদের স্বাস্থ্যসেবার চ্যালেঞ্জ"],
  "Migrant workers frequently move between construction sites, plywood factories, and districts. Their healthcare history gets lost along the way.": ["അതിഥി തൊഴിലാളികൾ നിർമ്മാണ സ്ഥലങ്ങൾ, പ്ലൈവുഡ് ഫാക്ടറികൾ, ജില്ലകൾ എന്നിവയ്ക്കിടയിൽ പതിവായി സഞ്ചരിക്കുന്നു. അവരുടെ ആരോഗ്യചരിത്രം വഴിയിൽ നഷ്ടപ്പെടുന്നു.","प्रवासी श्रमिक अक्सर निर्माण स्थलों, प्लाईवुड कारखानों और जिलों के बीच जाते हैं। इस दौरान उनका स्वास्थ्य इतिहास खो जाता है।","অভিবাসী কর্মীরা প্রায়ই নির্মাণস্থান, প্লাইউড কারখানা ও জেলার মধ্যে যাতায়াত করেন। পথে তাঁদের স্বাস্থ্য-ইতিহাস হারিয়ে যায়।"],
  "Choose Your Starting Point": ["ആരംഭ മാർഗം തിരഞ്ഞെടുക്കുക","शुरुआत का तरीका चुनें","শুরুর পথ বেছে নিন"],
  "Worker / Patient Login": ["തൊഴിലാളി / രോഗി ലോഗിൻ","श्रमिक / रोगी लॉगिन","কর্মী / রোগী লগইন"],
  "Patient / Migrant Worker": ["രോഗി / അതിഥി തൊഴിലാളി","रोगी / प्रवासी श्रमिक","রোগী / অভিবাসী কর্মী"],
  "Doctor / Healthcare Provider": ["ഡോക്ടർ / ആരോഗ്യ സേവനദാതാവ്","डॉक्टर / स्वास्थ्य सेवा प्रदाता","ডাক্তার / স্বাস্থ্যসেবা প্রদানকারী"],
  "Administrator": ["അഡ്മിനിസ്ട്രേറ്റർ","प्रशासक","প্রশাসক"], "Health Worker": ["ആരോഗ്യ പ്രവർത്തകൻ","स्वास्थ्य कार्यकर्ता","স্বাস্থ্যকর্মী"],
  "Demo Login Credentials": ["ഡെമോ ലോഗിൻ വിവരങ്ങൾ","डेमो लॉगिन विवरण","ডেমো লগইন তথ্য"],
  "Welcome,": ["സ്വാഗതം,","स्वागत है,","স্বাগতম,"], "Verified Active": ["സജീവമായി സ്ഥിരീകരിച്ചു","सक्रिय सत्यापित","সক্রিয় যাচাইকৃত"],
  "Identity and emergency summary": ["തിരിച്ചറിയലും അടിയന്തര സംഗ്രഹവും","पहचान और आपातकालीन सारांश","পরিচয় ও জরুরি সারাংশ"],
  "No report available": ["റിപ്പോർട്ട് ലഭ്യമല്ല","कोई रिपोर्ट उपलब्ध नहीं","কোনো রিপোর্ট নেই"], "No follow-up scheduled": ["ഫോളോ-അപ്പ് നിശ്ചയിച്ചിട്ടില്ല","कोई फॉलो-अप निर्धारित नहीं","কোনো ফলো-আপ নির্ধারিত নেই"],
  "Restricted essential profile": ["നിയന്ത്രിത അത്യാവശ്യ പ്രൊഫൈൽ","प्रतिबंधित आवश्यक प्रोफ़ाइल","সীমিত জরুরি প্রোফাইল"],
  "Short identity and emergency summary. Medical reports remain separate.": ["ചുരുക്ക തിരിച്ചറിയലും അടിയന്തര സംഗ്രഹവും. മെഡിക്കൽ റിപ്പോർട്ടുകൾ വേറെയാണ്.","संक्षिप्त पहचान और आपातकालीन सारांश। मेडिकल रिपोर्ट अलग रहती हैं।","সংক্ষিপ্ত পরিচয় ও জরুরি সারাংশ। মেডিকেল রিপোর্ট আলাদা থাকে।"],
  "Doctor-authored • Read only": ["ഡോക്ടർ തയ്യാറാക്കിയത് • വായിക്കാൻ മാത്രം","डॉक्टर द्वारा लिखित • केवल पढ़ने हेतु","ডাক্তার-লিখিত • শুধু পড়ার জন্য"],
  "Upload Personal Health Document": ["വ്യക്തിഗത ആരോഗ്യ രേഖ അപ്‌ലോഡ് ചെയ്യുക","व्यक्तिगत स्वास्थ्य दस्तावेज़ अपलोड करें","ব্যক্তিগত স্বাস্থ্য নথি আপলোড করুন"],
  "Add Personal Document": ["വ്യക്തിഗത രേഖ ചേർക്കുക","व्यक्तिगत दस्तावेज़ जोड़ें","ব্যক্তিগত নথি যোগ করুন"],
  "No personal documents uploaded.": ["വ്യക്തിഗത രേഖകൾ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.","कोई व्यक्तिगत दस्तावेज़ अपलोड नहीं हुआ।","কোনো ব্যক্তিগত নথি আপলোড হয়নি।"],
  "Date": ["തീയതി","तारीख","তারিখ"], "Report Type": ["റിപ്പോർട്ട് തരം","रिपोर्ट प्रकार","রিপোর্টের ধরন"], "Doctor": ["ഡോക്ടർ","डॉक्टर","ডাক্তার"],
  "Doctor ID": ["ഡോക്ടർ ഐഡി","डॉक्टर आईडी","ডাক্তার আইডি"], "Hospital / Clinic": ["ആശുപത്രി / ക്ലിനിക്","अस्पताल / क्लिनिक","হাসপাতাল / ক্লিনিক"],
  "Diagnosis": ["രോഗനിർണയം","निदान","রোগনির্ণয়"], "Treatment": ["ചികിത്സ","उपचार","চিকিৎসা"], "Prescription / Medicines": ["മരുന്നുകുറിപ്പ് / മരുന്നുകൾ","प्रिस्क्रिप्शन / दवाइयाँ","প্রেসক্রিপশন / ওষুধ"],
  "Follow-up": ["ഫോളോ-അപ്പ്","फॉलो-अप","ফলো-আপ"], "Clinical Notes": ["ക്ലിനിക്കൽ കുറിപ്പുകൾ","क्लिनिकल नोट्स","ক্লিনিক্যাল নোট"], "Allergies": ["അലർജികൾ","एलर्जी","অ্যালার্জি"],
  "Important Conditions": ["പ്രധാന ആരോഗ്യാവസ്ഥകൾ","महत्वपूर्ण स्थितियाँ","গুরুত্বপূর্ণ অবস্থা"],
  "FIRST RESPONDER / TRIAGE MODE": ["ആദ്യ പ്രതികരണ / ട്രയേജ് മോഡ്","प्रथम प्रत्युत्तर / ट्रायेज मोड","প্রথম সাড়া / ট্রায়াজ মোড"],
  "DESIGNATED EMERGENCY CONTACT": ["നിർദ്ദിഷ്ട അടിയന്തര ബന്ധപ്പെടൽ","निर्धारित आपातकालीन संपर्क","নির্ধারিত জরুরি যোগাযোগ"],
  "Call Contact Now": ["ഇപ്പോൾ ബന്ധപ്പെടുക","अभी संपर्क करें","এখনই যোগাযোগ করুন"],
  "e.g. KL-MW-10234": ["ഉദാ. KL-MW-10234","उदा. KL-MW-10234","যেমন KL-MW-10234"],
  "Personal note or correction request (optional)": ["വ്യക്തിഗത കുറിപ്പ് അല്ലെങ്കിൽ തിരുത്തൽ അഭ്യർത്ഥന (ഐച്ഛികം)","व्यक्तिगत नोट या सुधार अनुरोध (वैकल्पिक)","ব্যক্তিগত নোট বা সংশোধনের অনুরোধ (ঐচ্ছিক)"],
  "Enter worker Health ID": ["തൊഴിലാളിയുടെ ഹെൽത്ത് ഐഡി നൽകുക","श्रमिक हेल्थ आईडी दर्ज करें","কর্মীর হেলথ আইডি লিখুন"],
  "Password": ["പാസ്‌വേഡ്","पासवर्ड","পাসওয়ার্ড"]
});

let currentLanguage = 'en';

function translateVisibleStrings(root = document) {
  const index = UI_LANG_INDEX[currentLanguage];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent || /^(SCRIPT|STYLE|CODE|OPTION)$/.test(parent.tagName)) return;
    let source = UI_TEXT_NODES.get(node);
    if (!source) {
      const candidate = node.nodeValue.trim();
      if (!UI_PHRASES[candidate]) return;
      source = candidate;
      UI_TEXT_NODES.set(node, source);
    }
    const translated = index === undefined ? source : UI_PHRASES[source][index];
    const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
    const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
    const desired = `${leading}${translated}${trailing}`;
    if (node.nodeValue !== desired) node.nodeValue = desired;
  });
  const scope = root.querySelectorAll ? root : document;
  scope.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    if (!el.dataset.i18nPlaceholderSource && UI_PHRASES[el.placeholder]) el.dataset.i18nPlaceholderSource = el.placeholder;
    const source = el.dataset.i18nPlaceholderSource;
    if (source) {
      const desired = index === undefined ? source : UI_PHRASES[source][index];
      if (el.placeholder !== desired) el.placeholder = desired;
    }
  });
}

function setLanguage(lang) {
  if (!I18N_DICTIONARY[lang]) lang = 'en';
  currentLanguage = lang;
  localStorage.setItem('healthbridge_lang', lang);

  // Update all DOM elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N_DICTIONARY[lang][key]) {
      if (el.tagName === 'INPUT' && el.getAttribute('type') === 'button') {
        el.value = I18N_DICTIONARY[lang][key];
      } else {
        el.textContent = I18N_DICTIONARY[lang][key];
      }
    }
  });

  // Update language select dropdowns
  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.value = lang;
  });
  translateVisibleStrings(document);
}

function t(key) {
  return (I18N_DICTIONARY[currentLanguage] && I18N_DICTIONARY[currentLanguage][key]) ||
         (I18N_DICTIONARY['en'] && I18N_DICTIONARY['en'][key]) || key;
}

// Auto-load saved language or default to en
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('healthbridge_lang') || 'en';
  setLanguage(savedLang);
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) translateVisibleStrings(node);
    else if (node.nodeType === Node.TEXT_NODE && node.parentElement) translateVisibleStrings(node.parentElement);
  })));
  observer.observe(document.body, { childList:true, subtree:true });
});
