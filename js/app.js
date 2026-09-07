// ============================================
// APP.JS - Main Application Engine
// ============================================

// --- گلوبل اسٹیٹ ---
let currentLang = localStorage.getItem('app_lang') || 'en';

// ============================================
// 1. TOAST / ALERT SYSTEM (Global)
// ============================================
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) {
        // اگر toast موجود نہ ہو تو alert بطور فال بیک
        alert(message);
        return;
    }
    const toastBody = document.getElementById('toastMessage');
    if (!toastBody) return;

    // Toast کا رنگ تبدیل کریں
    const bgMap = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-dark',
        primary: 'bg-primary'
    };
    toastEl.className = `toast align-items-center text-white border-0 ${bgMap[type] || 'bg-success'}`;
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ============================================
// 2. LANGUAGE & RTL SYSTEM
// ============================================
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);

    // Language label update
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // RTL / LTR
    const htmlTag = document.documentElement;
    if (lang === 'ur' || lang === 'ps') {
        htmlTag.setAttribute('dir', 'rtl');
        htmlTag.setAttribute('lang', lang);
        document.body.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-enabled');
    } else {
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.setAttribute('lang', lang);
        document.body.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-enabled');
    }

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang]?.[key];
        if (translation) {
            if (el.querySelector('br') || translation.includes('<br>')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[lang]?.[key];
        if (translation) el.placeholder = translation;
    });

    // Update dropdown active state
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

    // Page-specific re-render trigger (اگر کسی صفحے کو دوبارہ رینڈر کرنا ہو)
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function initLanguageSwitch() {
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });

    // Modal language options
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });
}

// ============================================
// 3. PARTIALS LOADER
// ============================================
async function loadPartials() {
    try {
        // 1. Navbar
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const res = await fetch('partials/navbar.html');
            if (res.ok) navbarContainer.innerHTML = await res.text();
        }

        // 2. Footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const res = await fetch('partials/footer.html');
            if (res.ok) footerContainer.innerHTML = await res.text();
        }

        // 3. Language Modal
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            const res = await fetch('partials/language-modal.html');
            if (res.ok) modalContainer.innerHTML = await res.text();
        }

        // 4. Alerts (Toast)
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            const res = await fetch('partials/alert-messages.html');
            if (res.ok) alertsContainer.innerHTML = await res.text();
        }

        // --- Partials load ہونے کے بعد Language اور Events دوبارہ لگائیں ---
        applyLanguage(currentLang);
        initLanguageSwitch();

        console.log('✅ Partials loaded successfully.');

    } catch (error) {
        console.error('❌ Error loading partials:', error);
    }
}

// ============================================
// 4. PAGE DETECTION & AUTO-INIT (Optional)
// ============================================
// یہ فنکشن چیک کرتا ہے کہ موجودہ صفحہ کون سا ہے اور متعلقہ page-specific init کو کال کرتا ہے۔
// لیکن چونکہ ہم HTML میں الگ سے page-specific JS include کر رہے ہیں،
// اس لیے یہ صرف ایک اضافی سیفٹی ہے۔
function detectPageAndInit() {
    const body = document.body;
    const pageId = body.id || '';

    if (pageId === 'home-page' || document.getElementById('servicesContainer')) {
        if (typeof renderServices === 'function') renderServices();
        if (typeof renderWorkers === 'function') renderWorkers();
        if (typeof initHomeSearch === 'function') initHomeSearch();
    }
}

// ============================================
// 5. INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    // سب سے پہلے Partials لوڈ کریں
    await loadPartials();

    // پھر اگر کوئی page-specific data render کرنا ہے تو detect کر کے کریں
    detectPageAndInit();

    console.log('🚀 App initialized successfully.');
});

// ============================================
// 6. GLOBAL EXPOSURE (اگر کہیں اور استعمال ہو)
// ============================================
// انہیں global بنا دیں تاکہ page-specific JS (home.js, auth.js) انہیں استعمال کر سکیں
window.showToast = showToast;
window.applyLanguage = applyLanguage;
window.currentLang = currentLang;
