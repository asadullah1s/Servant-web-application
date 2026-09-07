// ============================================
// APP.JS - Main Application Engine (WITH FALLBACK)
// ============================================

// --- گلوبل اسٹیٹ ---
let currentLang = localStorage.getItem('app_lang') || 'en';

// ============================================
// 1. TOAST / ALERT SYSTEM (Global)
// ============================================
function showToast(message, type = 'success') {
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

    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

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

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[lang]?.[key];
        if (translation) el.placeholder = translation;
    });

    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

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
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });
}

// ============================================
// 3. PARTIALS LOADER (WITH FALLBACK HTML)
// ============================================
function getDefaultNavbar() {
    return `
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">
                <i class="fas fa-hands-helping me-2 text-primary"></i>
                <span data-i18n="brand">Staffing Platform</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center">
                    <li class="nav-item"><a class="nav-link active" href="index.html" data-i18n="nav_home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/public/services.html" data-i18n="nav_services">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/public/find-workers.html" data-i18n="nav_workers">Find Workers</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/public/about.html" data-i18n="nav_about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="pages/public/contact.html" data-i18n="nav_contact">Contact</a></li>
                    <li class="nav-item dropdown ms-2">
                        <a class="nav-link dropdown-toggle lang-btn" href="#" id="langDropdown" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-globe"></i> <span id="current-lang-label">EN</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="langDropdown">
                            <li><a class="dropdown-item" data-lang="en" href="#">🇬🇧 English</a></li>
                            <li><a class="dropdown-item" data-lang="ur" href="#">🇵🇰 اردو</a></li>
                            <li><a class="dropdown-item" data-lang="ps" href="#">🇦🇫 پښتو</a></li>
                        </ul>
                    </li>
                    <li class="nav-item ms-2">
                        <a href="pages/auth/login.html" class="btn btn-outline-primary btn-sm me-1" data-i18n="login">Login</a>
                        <a href="pages/auth/employer-register.html" class="btn btn-primary btn-sm" data-i18n="register">Register</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>`;
}

function getDefaultFooter() {
    return `
    <footer class="footer bg-dark text-white py-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <h5 class="fw-bold"><i class="fas fa-hands-helping me-2 text-primary"></i> <span data-i18n="brand">Staffing Platform</span></h5>
                    <p data-i18n="footer_desc">Your trusted partner for home and office staffing solutions.</p>
                    <div class="social-links mt-3">
                        <a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-white"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="col-md-2">
                    <h6 data-i18n="footer_quick">Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><a href="pages/public/about.html" class="text-white-50 text-decoration-none" data-i18n="nav_about">About</a></li>
                        <li><a href="pages/public/services.html" class="text-white-50 text-decoration-none" data-i18n="nav_services">Services</a></li>
                        <li><a href="pages/public/faq.html" class="text-white-50 text-decoration-none">FAQ</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h6 data-i18n="footer_services">Services</h6>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white-50 text-decoration-none">Cleaner</a></li>
                        <li><a href="#" class="text-white-50 text-decoration-none">Maid</a></li>
                        <li><a href="#" class="text-white-50 text-decoration-none">Cook</a></li>
                        <li><a href="#" class="text-white-50 text-decoration-none">Driver</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h6 data-i18n="footer_contact">Contact</h6>
                    <ul class="list-unstyled text-white-50">
                        <li><i class="fas fa-phone me-2"></i> +92 300 1234567</li>
                        <li><i class="fas fa-envelope me-2"></i> info@staffing.com</li>
                        <li><i class="fas fa-map-marker-alt me-2"></i> Karachi, Pakistan</li>
                    </ul>
                </div>
            </div>
            <hr class="mt-4">
            <p class="text-center text-white-50 small mb-0" data-i18n="copyright">© 2026 Staffing Platform. All rights reserved.</p>
        </div>
    </footer>`;
}

function getDefaultAlerts() {
    return `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
        <div id="liveToast" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" id="toastMessage"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>`;
}

function getDefaultModal() {
    return `
    <div class="modal fade" id="languageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" data-i18n="select_language">Select Language</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary lang-option" data-lang="en" data-bs-dismiss="modal">🇬🇧 English</button>
                        <button class="btn btn-outline-primary lang-option" data-lang="ur" data-bs-dismiss="modal">🇵🇰 اردو</button>
                        <button class="btn btn-outline-primary lang-option" data-lang="ps" data-bs-dismiss="modal">🇦🇫 پښتو</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

async function loadPartials() {
    try {
        // 1. Navbar
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            try {
                const res = await fetch('partials/navbar.html');
                if (res.ok) {
                    navbarContainer.innerHTML = await res.text();
                } else {
                    navbarContainer.innerHTML = getDefaultNavbar();
                }
            } catch (e) {
                navbarContainer.innerHTML = getDefaultNavbar();
            }
        }

        // 2. Footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            try {
                const res = await fetch('partials/footer.html');
                if (res.ok) {
                    footerContainer.innerHTML = await res.text();
                } else {
                    footerContainer.innerHTML = getDefaultFooter();
                }
            } catch (e) {
                footerContainer.innerHTML = getDefaultFooter();
            }
        }

        // 3. Alerts
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            try {
                const res = await fetch('partials/alert-messages.html');
                if (res.ok) {
                    alertsContainer.innerHTML = await res.text();
                } else {
                    alertsContainer.innerHTML = getDefaultAlerts();
                }
            } catch (e) {
                alertsContainer.innerHTML = getDefaultAlerts();
            }
        }

        // 4. Modal
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            try {
                const res = await fetch('partials/language-modal.html');
                if (res.ok) {
                    modalContainer.innerHTML = await res.text();
                } else {
                    modalContainer.innerHTML = getDefaultModal();
                }
            } catch (e) {
                modalContainer.innerHTML = getDefaultModal();
            }
        }

        // --- Partials کے بعد Language اور Events لگائیں ---
        applyLanguage(currentLang);
        initLanguageSwitch();

        console.log('✅ Partials loaded (with fallback if needed).');

    } catch (error) {
        console.error('❌ Error in loadPartials:', error);
        // آخری حربہ: تمام کنٹینرز میں ڈیفالٹ ڈال دو
        const navbar = document.getElementById('navbar-container');
        if (navbar) navbar.innerHTML = getDefaultNavbar();
        const footer = document.getElementById('footer-container');
        if (footer) footer.innerHTML = getDefaultFooter();
        const alerts = document.getElementById('alerts-container');
        if (alerts) alerts.innerHTML = getDefaultAlerts();
        const modal = document.getElementById('modal-container');
        if (modal) modal.innerHTML = getDefaultModal();
        
        applyLanguage(currentLang);
        initLanguageSwitch();
    }
}

// ============================================
// 4. PAGE DETECTION
// ============================================
function detectPageAndInit() {
    if (document.getElementById('servicesContainer')) {
        if (typeof renderServices === 'function') renderServices();
        if (typeof renderWorkers === 'function') renderWorkers();
        if (typeof initHomeSearch === 'function') initHomeSearch();
    }
}

// ============================================
// 5. INIT
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    await loadPartials();
    detectPageAndInit();
    console.log('🚀 App initialized successfully.');
});

// ============================================
// 6. GLOBAL EXPOSURE
// ============================================
window.showToast = showToast;
window.applyLanguage = applyLanguage;
window.currentLang = currentLang;
