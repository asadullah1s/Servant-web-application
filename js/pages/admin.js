// ============================================
// PAGE: ADMIN (Dashboard, Manage, Settings)
// ============================================

// --- ڈیمو ڈیٹا ---
const mockWorkers = [
    { id: 1, name: 'Fatima Noor', category: 'Maid', status: 'Pending', documents: '2/3' },
    { id: 2, name: 'Ahmed Khan', category: 'Cook', status: 'Verified', documents: '3/3' },
    { id: 3, name: 'Sara Ali', category: 'Nanny', status: 'Under Review', documents: '2/3' },
    { id: 4, name: 'Usman Shah', category: 'Driver', status: 'Rejected', documents: '1/3' },
];

const mockEmployers = [
    { id: 1, name: 'Ali Raza', email: 'ali@email.com', status: 'Active' },
    { id: 2, name: 'Sana Tariq', email: 'sana@email.com', status: 'Active' },
    { id: 3, name: 'Usman Siddiqui', email: 'usman@email.com', status: 'Suspended' },
];

// --- ڈیش بورڈ سٹیٹس ---
function renderAdminDashboard() {
    const stats = {
        'totalWorkers': mockWorkers.length,
        'verifiedWorkers': mockWorkers.filter(w => w.status === 'Verified').length,
        'pendingVerification': mockWorkers.filter(w => w.status === 'Pending' || w.status === 'Under Review').length,
        'totalEmployers': mockEmployers.length,
        'activeRequests': 8,
        'completedHires': 24,
    };

    Object.keys(stats).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = stats[id];
    });
}

// --- ورکرز لسٹ ---
function renderWorkerList() {
    const container = document.getElementById('adminWorkerTable');
    if (!container) return;

    container.innerHTML = mockWorkers.map(w => `
        <tr>
            <td>${w.id}</td>
            <td>${w.name}</td>
            <td>${w.category}</td>
            <td><span class="badge bg-${w.status === 'Verified' ? 'success' : w.status === 'Pending' ? 'warning' : w.status === 'Under Review' ? 'info' : 'danger'}">${w.status}</span></td>
            <td>${w.documents}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-worker" data-id="${w.id}">View</button>
                <button class="btn btn-sm btn-outline-success verify-worker" data-id="${w.id}" ${w.status === 'Verified' ? 'disabled' : ''}>Verify</button>
                <button class="btn btn-sm btn-outline-danger suspend-worker" data-id="${w.id}">Suspend</button>
            </td>
        </tr>
    `).join('');

    // Event listeners
    document.querySelectorAll('.verify-worker').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showToast(`Worker ID ${id} verified! (Demo)`, 'success');
            // Baad mein: update worker status
        });
    });

    document.querySelectorAll('.suspend-worker').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showToast(`Worker ID ${id} suspended! (Demo)`, 'warning');
        });
    });

    document.querySelectorAll('.view-worker').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            alert(`[Demo] Worker ID: ${id} profile details.`);
        });
    });
}

// --- ایمپلائرز لسٹ ---
function renderEmployerList() {
    const container = document.getElementById('adminEmployerTable');
    if (!container) return;

    container.innerHTML = mockEmployers.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td><span class="badge bg-${e.status === 'Active' ? 'success' : 'danger'}">${e.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-employer" data-id="${e.id}">View</button>
                <button class="btn btn-sm btn-outline-danger suspend-employer" data-id="${e.id}" ${e.status === 'Suspended' ? 'disabled' : ''}>Suspend</button>
            </td>
        </tr>
    `).join('');
}

// --- کیٹیگری مینجمنٹ ---
function initCategoryManagement() {
    const form = document.getElementById('categoryForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('categoryName')?.value || '';
        if (name.trim()) {
            showToast(`Category "${name}" added successfully! (Demo)`, 'success');
            // Baad mein: add to DB and refresh list
            this.reset();
        } else {
            showToast('Please enter category name.', 'warning');
        }
    });

    // Existing categories list (demo)
    const list = document.getElementById('categoryList');
    if (list) {
        const cats = ['Cleaner', 'Maid', 'Cook', 'Babysitter', 'Driver'];
        list.innerHTML = cats.map(c => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${c}
                <span>
                    <button class="btn btn-sm btn-outline-secondary edit-cat">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-cat">Delete</button>
                </span>
            </li>
        `).join('');
    }
}

// --- لوکیشن مینجمنٹ ---
function initLocationManagement() {
    const form = document.getElementById('locationForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = document.getElementById('cityName')?.value || '';
        const area = document.getElementById('areaName')?.value || '';
        if (city.trim() && area.trim()) {
            showToast(`Location "${city}, ${area}" added! (Demo)`, 'success');
            this.reset();
        } else {
            showToast('Please fill all fields.', 'warning');
        }
    });
}

// --- Init Admin Pages ---
function initAdminPage() {
    if (document.getElementById('adminDashboard')) {
        renderAdminDashboard();
        console.log('🛡️ Admin dashboard initialized.');
    }
    if (document.getElementById('adminWorkerTable')) {
        renderWorkerList();
        console.log('🛡️ Admin worker list initialized.');
    }
    if (document.getElementById('adminEmployerTable')) {
        renderEmployerList();
        console.log('🛡️ Admin employer list initialized.');
    }
    if (document.getElementById('categoryForm')) {
        initCategoryManagement();
        console.log('🛡️ Category management initialized.');
    }
    if (document.getElementById('locationForm')) {
        initLocationManagement();
        console.log('🛡️ Location management initialized.');
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
    initAdminPage();
}
