// ============================================
// PAGE: HOME
// (index.html کے لیے مخصوص)
// ============================================

// --- ڈیٹا (Mock) ---
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
    { name: 'Zara Khan', img: 'https://randomuser.me/api/portraits/women/33.jpg', category: 'Cleaner', rating: 4.6, verified: true, price: 'PKR 20,000' },
    { name: 'Ali Raza', img: 'https://randomuser.me/api/portraits/men/22.jpg', category: 'Gardener', rating: 4.5, verified: false, price: 'PKR 18,000' },
];

// --- Render Functions ---
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
        const verifiedBadge = w.verified 
            ? '<span class="verified-badge"><i class="fas fa-check-circle me-1"></i> Verified</span>' 
            : '<span class="badge bg-warning text-dark">Pending</span>';
        return `
            <div class="col-md-6 col-lg-3">
                <div class="worker-card">
                    <img src="${w.img}" alt="${w.name}" onerror="this.src='https://ui-avatars.com/api/?name=${w.name}&background=0D6EFD&color=fff&size=80'">
                    <div>${verifiedBadge}</div>
                    <h6>${w.name}</h6>
                    <span class="badge bg-light text-dark">${w.category}</span>
                    <div class="rating mt-1"><i class="fas fa-star"></i> ${w.rating}</div>
                    <div class="price">${w.price}</div>
                    <button class="btn btn-outline-primary btn-sm mt-2 view-worker-btn" data-name="${w.name}">View Profile</button>
                </div>
            </div>
        `;
    }).join('');

    // Event listeners for "View Profile" buttons
    document.querySelectorAll('.view-worker-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            alert(`[Demo] Worker profile: ${name}\n(Is page ko baad mein worker-details.html se link karenge)`);
        });
    });
}

// --- Home Search Function ---
function initHomeSearch() {
    const searchBtn = document.querySelector('.search-section .btn-primary');
    if (!searchBtn) return;

    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const service = document.getElementById('searchService')?.value || '';
        const city = document.getElementById('searchCity')?.value || '';
        const area = document.querySelector('.search-section input[type="text"]')?.value || '';

        alert(`[Demo Search]\nService: ${service || 'Any'}\nCity: ${city || 'Any'}\nArea: ${area || 'Any'}\n\n(Results page par redirect hoga)`);
        // Baad mein: window.location.href = 'pages/public/find-workers.html?service='+service+'&city='+city;
    });
}

// --- Init Home Page ---
function initHomePage() {
    // Agar hum home page par hain (yani index.html)
    if (document.getElementById('servicesContainer')) {
        renderServices();
        renderWorkers();
        initHomeSearch();
        console.log('🏠 Home page initialized.');
    }
}

// Jab DOM ready ho toh home page init karein
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}
