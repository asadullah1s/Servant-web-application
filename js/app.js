// ============================================
// APP.JS - MASTER CONTROLLER (Module Version)
// Partials Load, Language Switch, RTL, Translation
// ============================================

// Import Firebase auth for logout functionality
import { auth, signOut, onAuthStateChanged } from '/js/firebase-config.js';

// --- Global State ---
let currentLang = localStorage.getItem('app_lang') || 'en';
const htmlTag = document.documentElement;

// ============================================
// 1. APPLY LANGUAGE & RTL
// ============================================
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);

    // RTL / LTR
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

    // Update label
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // Translate elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang]?.[key];
        if (translation) {
            if (el.querySelector('br') || translation.includes('<br>') || translation.includes('<')) {
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

    // Update dropdown
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });
}

// ============================================
// 2. LANGUAGE SWITCH LISTENERS
// ============================================
function initLanguageSwitch() {
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.removeEventListener('click', handleLangClick);
        item.addEventListener('click', handleLangClick);
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.removeEventListener('click', handleLangOptionClick);
        btn.addEventListener('click', handleLangOptionClick);
    });
}

function handleLangClick(e) {
    e.preventDefault();
    const lang = this.getAttribute('data-lang');
    applyLanguage(lang);
    const dropdown = this.closest('.dropdown');
    if (dropdown && typeof bootstrap !== 'undefined') {
        const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('.dropdown-toggle'));
        if (bsDropdown) bsDropdown.hide();
    }
}

function handleLangOptionClick(e) {
    const lang = this.getAttribute('data-lang');
    applyLanguage(lang);
    const modal = this.closest('.modal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// ============================================
// 3. LOAD PARTIALS
// ============================================
async function loadPartials() {
    try {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const res = await fetch('/partials/navbar.html');
            if (res.ok) navbarContainer.innerHTML = await res.text();
        }

        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const res = await fetch('/partials/footer.html');
            if (res.ok) footerContainer.innerHTML = await res.text();
        }

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            const res = await fetch('/partials/language-modal.html');
            if (res.ok) modalContainer.innerHTML = await res.text();
        }

        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            const res = await fetch('/partials/alert-messages.html');
            if (res.ok) alertsContainer.innerHTML = await res.text();
        }

        applyLanguage(currentLang);
        initLanguageSwitch();
        document.dispatchEvent(new Event('partialsLoaded'));

    } catch (error) {
        console.error('Error loading partials:', error);
    }
}

// ============================================
// 4. GLOBAL SHOW TOAST
// ============================================
window.showToast = function(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) {
        alert(message);
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

// ============================================
// 5. AUTH STATE - UPDATE NAVBAR
// ============================================
function updateNavbarAuth(user) {
    const loginBtn = document.querySelector('a[href="/pages/auth/login.html"]');
    const registerBtn = document.querySelector('a[href="/pages/auth/employer-register.html"]');

    if (user) {
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = '/pages/employer/dashboard.html';
        }
        if (registerBtn) {
            registerBtn.textContent = 'Logout';
            registerBtn.href = '#';
            registerBtn.onclick = function(e) {
                e.preventDefault();
                signOut(auth);
                localStorage.removeItem('current_user');
                window.showToast('Logged out successfully.', 'info');
                window.location.href = '/index.html';
            };
        }
    } else {
        if (loginBtn && !loginBtn.textContent.includes('Login')) {
            loginBtn.textContent = 'Login';
            loginBtn.href = '/pages/auth/login.html';
        }
        if (registerBtn && !registerBtn.textContent.includes('Register')) {
            registerBtn.textContent = 'Register';
            registerBtn.href = '/pages/auth/employer-register.html';
        }
    }
}

// ============================================
// 6. INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadPartials();

    // Firebase Auth State
    onAuthStateChanged(auth, (user) => {
        updateNavbarAuth(user);
        if (user) {
            localStorage.setItem('current_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'User'
            }));
        } else {
            localStorage.removeItem('current_user');
        }
    });
});

console.log('✅ App.js (Module) loaded.');
