// ============================================
// APP.JS - MASTER CONTROLLER
// Partials Load, Language Switch, RTL, Translation
// ============================================

// --- Global State ---
let currentLang = localStorage.getItem('app_lang') || 'en';

// --- DOM Refs ---
const htmlTag = document.documentElement;

// ============================================
// 1. APPLY LANGUAGE & RTL
// ============================================
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);

    // --- RTL / LTR Logic ---
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

    // --- Update Language Label in Navbar ---
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // --- Translate all elements with [data-i18n] ---
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang]?.[key];
        if (translation) {
            // Agar HTML tags ho (jaise <br>) toh innerHTML, warna textContent
            if (el.querySelector('br') || translation.includes('<br>') || translation.includes('<')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // --- Translate placeholders [data-i18n-placeholder] ---
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[lang]?.[key];
        if (translation) el.placeholder = translation;
    });

    // --- Update active state in dropdown ---
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });
}

// ============================================
// 2. LANGUAGE SWITCH LISTENERS
// ============================================
function initLanguageSwitch() {
    // Navbar dropdown items
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.removeEventListener('click', handleLangClick);
        item.addEventListener('click', handleLangClick);
    });

    // Modal language options (if exists)
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.removeEventListener('click', handleLangOptionClick);
        btn.addEventListener('click', handleLangOptionClick);
    });
}

function handleLangClick(e) {
    e.preventDefault();
    const lang = this.getAttribute('data-lang');
    applyLanguage(lang);
    // Close dropdown
    const dropdown = this.closest('.dropdown');
    if (dropdown && typeof bootstrap !== 'undefined') {
        const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('.dropdown-toggle'));
        if (bsDropdown) bsDropdown.hide();
    }
}

function handleLangOptionClick(e) {
    const lang = this.getAttribute('data-lang');
    applyLanguage(lang);
    // Close modal
    const modal = this.closest('.modal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// ============================================
// 3. LOAD PARTIALS (Navbar, Footer, Modals)
// ============================================
async function loadPartials() {
    try {
        // 1. Navbar
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const res = await fetch('/partials/navbar.html');
            if (res.ok) {
                navbarContainer.innerHTML = await res.text();
            } else {
                console.warn('Navbar partial not found, using fallback.');
                navbarContainer.innerHTML = `<nav class="navbar navbar-expand-lg bg-light p-3"><div class="container"><span class="navbar-brand">Staffing Platform</span></div></nav>`;
            }
        }

        // 2. Footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const res = await fetch('/partials/footer.html');
            if (res.ok) {
                footerContainer.innerHTML = await res.text();
            } else {
                console.warn('Footer partial not found.');
                footerContainer.innerHTML = `<footer class="bg-dark text-white text-center py-3"><p>© 2026 Staffing Platform</p></footer>`;
            }
        }

        // 3. Modal (optional)
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            const res = await fetch('/partials/language-modal.html');
            if (res.ok) {
                modalContainer.innerHTML = await res.text();
            }
        }

        // 4. Alerts (optional)
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            const res = await fetch('/partials/alert-messages.html');
            if (res.ok) {
                alertsContainer.innerHTML = await res.text();
            }
        }

        // --- IMPORTANT: Re-apply language and init events for dynamically loaded content ---
        applyLanguage(currentLang);
        initLanguageSwitch();

        // --- Trigger event for page-specific JS (home.js etc.) ---
        document.dispatchEvent(new Event('partialsLoaded'));

    } catch (error) {
        console.error('Error loading partials:', error);
    }
}

// ============================================
// 4. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Load partials (navbar/footer)
    loadPartials().then(() => {
        console.log('✅ Partials loaded. App ready.');
    });

    // Attach listeners to any static language elements (if any)
    initLanguageSwitch();

    // Note: Page-specific JS (home.js, auth.js, etc.) will handle their own rendering
    // as they run independently after this file.
});

// ============================================
// 5. GLOBAL TOAST HELPER (for all pages)
// ============================================
window.showToast = function(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) {
        alert(message); // Fallback if toast not found
        return;
    }
    const toastBody = document.getElementById('toastMessage');
    if (!toastBody) return;

    const bgMap = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-dark'
    };
    toastEl.className = `toast align-items-center text-white border-0 ${bgMap[type] || 'bg-success'}`;
    toastBody.textContent = message;

    if (typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        toastEl.style.display = 'block';
        setTimeout(() => { toastEl.style.display = 'none'; }, 3000);
    }
};
