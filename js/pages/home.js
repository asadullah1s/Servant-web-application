// ============================================
// HOME.JS
// ============================================

const servicesData = [
    { icon: 'fa-broom', name: 'Cleaner' },
    { icon: 'fa-female', name: 'Maid' },
    { icon: 'fa-utensils', name: 'Cook' },
    { icon: 'fa-baby', name: 'Babysitter' },
    { icon: 'fa-car', name: 'Driver' },
    { icon: 'fa-leaf', name: 'Gardener' },
    { icon: 'fa-tools', name: 'Home Helper' },
    { icon: 'fa-briefcase', name: 'Office Boy' },
];

const workersData = [
    { name: 'Fatima Noor', img: 'https://randomuser.me/api/portraits/women/45.jpg', category: 'Maid', rating: 4.8, verified: true, price: 'PKR 25,000' },
    { name: 'Ahmed Khan', img: 'https://randomuser.me/api/portraits/men/32.jpg', category: 'Cook', rating: 4.9, verified: true, price: 'PKR 35,000' },
    { name: 'Sara Ali', img: 'https://randomuser.me/api/portraits/women/68.jpg', category: 'Nanny', rating: 4.7, verified: false, price: 'PKR 28,000' },
    { name: 'Usman Shah', img: 'https://randomuser.me/api/portraits/men/75.jpg', category: 'Driver', rating: 4.8, verified: true, price: 'PKR 30,000' },
];

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

function renderWorkers() {
    const container = document.getElementById('workersContainer');
    if (!container) return;
    container.innerHTML = workersData.map(w => {
        const badge = w.verified 
            ? '<span class="verified-badge"><i class="fas fa-check-circle me-1"></i> Verified</span>' 
            : '<span class="badge bg-warning text-dark">Pending</span>';
        return `
            <div class="col-md-6 col-lg-3">
                <div class="worker-card">
                    <img src="${w.img}" alt="${w.name}" onerror="this.src='https://ui-avatars.com/api/?name=${w.name}&background=0D6EFD&color=fff&size=80'">
                    <div>${badge}</div>
                    <h6>${w.name}</h6>
                    <span class="badge bg-light text-dark">${w.category}</span>
                    <div class="rating mt-1"><i class="fas fa-star"></i> ${w.rating}</div>
                    <div class="price">${w.price}</div>
                    <button class="btn btn-outline-primary btn-sm mt-2 view-worker" data-name="${w.name}">View Profile</button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.view-worker').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            window.showToast(`Viewing ${name}'s profile (Demo)`, 'info');
        });
    });
}

function initSearch() {
    const btn = document.getElementById('homeSearchBtn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const service = document.getElementById('searchService')?.value || 'Any';
        const city = document.getElementById('searchCity')?.value || 'Any';
        window.showToast(`Searching: ${service} in ${city} (Demo)`, 'info');
    });
}

function init() {
    if (document.getElementById('servicesContainer')) {
        renderServices();
        renderWorkers();
        initSearch();
        console.log('🏠 Home page loaded.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
