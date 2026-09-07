// ============================================
// GLOBAL STATE
// ============================================
let currentLang = localStorage.getItem('app_lang') || 'en';

// ============================================
// DOM REFS
// ============================================
const htmlTag = document.documentElement;
const langLabel = document.getElementById('current-lang-label');

// ============================================
// SERVICES DATA (Mock)
// ============================================
const servicesData = [
    { icon: 'fa-broom', name: 'Cleaner' },
    { icon: 'fa-female', name: 'Maid' },
    { icon: 'fa-utensils', name: 'Cook' },
    { icon: 'fa-baby', name: 'Babysitter' },
    { icon: 'fa-car', name: 'Driver' },
    { icon: 'fa-leaf', name: 'Gardener' },
];

// ============================================
// WORKERS DATA (Mock)
// ============================================
const workersData = [
    { name: 'Fatima Noor', img: 'https://randomuser.me/api/portraits/women/45.jpg', category: 'Maid', rating: 4.8, verified: true, price: 'PKR 25,000' },
    { name: 'Ahmed Khan', img: 'https://randomuser.me/api/portraits/men/32.jpg', category: 'Cook', rating: 4.9, verified: true, price: 'PKR 35,000' },
    { name: 'Sara Ali', img: 'https://randomuser.me/api/portraits/women/68.jpg', category: 'Nanny', rating: 4.7, verified: false, price: 'PKR 28,000' },
    { name: 'Usman Shah', img: 'https://randomuser.me/api/portraits/men/75.jpg', category: 'Driver', rating: 4.8, verified: true, price: 'PKR 30,000' },
];

// ============================================
// RENDER SERVICES
// ============================================
function renderServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;
    container.innerHTML = servicesData.map(s => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="service-card">
                <i class="fas ${s.icon}"></i>
                <h5>${s.name}</h5>
                <p>${s.name} Service</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// RENDER WORKERS
// ============================================
function renderWorkers() {
    const container = document.getElementById('workersContainer');
    if (!container) return;
    container.innerHTML = workersData.map(w => `
        <div class="col-md-6 col-lg-3">
            <div class="worker-card">
                <img src="${w.img}" alt="${w.name}" onerror="this.src='https://ui-avatars.com/api/?name=${w.name}&background=0D6EFD&color=fff&size=80'">
                <div>
                    ${w.verified ? '<span class="verified-badge"><i class="fas fa-check-circle me-1"></i> Verified</span>' : ''}
                </div>
                <h6>${w.name}</h6>
                <span class="badge bg-light text-dark">${w.category}</span>
                <div class="rating mt-1"><i class="fas fa-star"></i> ${w.rating}</div>
                <div class="price">${w.price}</div>
                <button class="btn btn-outline-primary btn-sm mt-2">View Profile</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// APPLY LANGUAGE
// ============================================
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);

    // Update label
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // 1. RTL / LTR
    if (lang === 'ur' || lang === 'ps') {
        htmlTag.setAttribute('dir', 'rtl');
        htmlTag.setAttribute('lang', lang);
        document.body.setAttribute('dir', 'rtl');
        // Bootstrap RTL classes (optional)
        document.body.classList.add('rtl-enabled');
    } else {
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.setAttribute('lang', lang);
        document.body.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-enabled');
    }

    // 2. Translate all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang]?.[key];
        if (translation) {
            // If element contains HTML (like <br>) we use innerHTML, else textContent
            if (el.querySelector('br') || translation.includes('<br>')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // 3. Placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[lang]?.[key];
        if (translation) el.placeholder = translation;
    });

    // Update dropdown active state
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });
}

// ============================================
// LANGUAGE SWITCH LISTENERS
// ============================================
function initLanguageSwitch() {
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    renderWorkers();
    applyLanguage(currentLang);
    initLanguageSwitch();
});
