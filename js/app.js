// ============================================
// APP.JS - MASTER CONTROLLER
// ============================================

import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

// --- State ---
let currentLang = localStorage.getItem('app_lang') || 'en';
const htmlTag = document.documentElement;

// ============================================
// 1. APPLY LANGUAGE
// ============================================
window.applyLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);

    // RTL
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
    const label = document.getElementById('current-lang-label');
    if (label) label.textContent = lang.toUpperCase();

    // Translate elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const trans = window.translations?.[lang]?.[key];
        if (trans) {
            if (trans.includes('<')) {
                el.innerHTML = trans;
            } else {
                el.textContent = trans;
            }
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const trans = window.translations?.[lang]?.[key];
        if (trans) el.placeholder = trans;
    });

    // Dropdown active
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });
};

// ============================================
// 2. LANGUAGE SWITCH
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
    window.applyLanguage(lang);
    const dropdown = this.closest('.dropdown');
    if (dropdown && typeof bootstrap !== 'undefined') {
        const bs = bootstrap.Dropdown.getInstance(dropdown.querySelector('.dropdown-toggle'));
        if (bs) bs.hide();
    }
}

function handleLangOptionClick(e) {
    const lang = this.getAttribute('data-lang');
    window.applyLanguage(lang);
    const modal = this.closest('.modal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bs = bootstrap.Modal.getInstance(modal);
        if (bs) bs.hide();
    }
}

// ============================================
// 3. LOAD PARTIALS
// ============================================
async function loadPartials() {
    try {
        const navbar = document.getElementById('navbar-container');
        if (navbar) {
            const res = await fetch('/partials/navbar.html');
            if (res.ok) navbar.innerHTML = await res.text();
        }

        const footer = document.getElementById('footer-container');
        if (footer) {
            const res = await fetch('/partials/footer.html');
            if (res.ok) footer.innerHTML = await res.text();
        }

        const modal = document.getElementById('modal-container');
        if (modal) {
            const res = await fetch('/partials/language-modal.html');
            if (res.ok) modal.innerHTML = await res.text();
        }

        const alerts = document.getElementById('alerts-container');
        if (alerts) {
            const res = await fetch('/partials/alert-messages.html');
            if (res.ok) alerts.innerHTML = await res.text();
        }

        window.applyLanguage(currentLang);
        initLanguageSwitch();
        document.dispatchEvent(new Event('partialsLoaded'));

    } catch (error) {
        console.error('Partial load error:', error);
    }
}

// ============================================
// 4. TOAST
// ============================================
window.showToast = function(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) {
        alert(message);
        return;
    }
    const body = document.getElementById('toastMessage');
    if (!body) return;

    const bgMap = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-dark'
    };
    toastEl.className = `toast align-items-center text-white border-0 ${bgMap[type] || 'bg-success'}`;
    body.textContent = message;

    if (typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        toastEl.style.display = 'block';
        setTimeout(() => { toastEl.style.display = 'none'; }, 3000);
    }
};

// ============================================
// 5. AUTH NAVBAR
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
                window.showToast('Logged out.', 'info');
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

console.log('✅ App.js loaded!');
