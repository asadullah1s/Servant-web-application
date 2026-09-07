// ============================================
// PAGE: EMPLOYER (Dashboard, Profile, Requests)
// ============================================

// --- ڈیمو ڈیٹا ---
const mockRequests = [
    { id: 1, worker: 'Fatima Noor', service: 'Maid', status: 'Pending', date: '2026-09-10' },
    { id: 2, worker: 'Ahmed Khan', service: 'Cook', status: 'Accepted', date: '2026-09-08' },
    { id: 3, worker: 'Usman Shah', service: 'Driver', status: 'Completed', date: '2026-09-05' },
];

const mockFavorites = ['Sara Ali (Nanny)', 'Zara Khan (Cleaner)'];

// --- ڈیش بورڈ سٹیٹس رینڈر ---
function renderEmployerDashboard() {
    // Stats
    const statContainers = {
        'totalRequests': mockRequests.length,
        'pendingRequests': mockRequests.filter(r => r.status === 'Pending').length,
        'acceptedWorkers': mockRequests.filter(r => r.status === 'Accepted' || r.status === 'Completed').length,
        'favorites': mockFavorites.length
    };

    Object.keys(statContainers).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = statContainers[id];
    });

    // Recent Requests Table
    const tableBody = document.getElementById('recentRequestsTable');
    if (tableBody) {
        tableBody.innerHTML = mockRequests.map(r => `
            <tr>
                <td>${r.worker}</td>
                <td>${r.service}</td>
                <td><span class="badge bg-${r.status === 'Pending' ? 'warning' : r.status === 'Accepted' ? 'success' : 'secondary'}">${r.status}</span></td>
                <td>${r.date}</td>
                <td><button class="btn btn-sm btn-outline-primary view-request" data-id="${r.id}">View</button></td>
            </tr>
        `).join('');

        // Event listeners for "View" buttons
        document.querySelectorAll('.view-request').forEach(btn => {
            btn.addEventListener('click', function() {
                alert(`[Demo] Request ID: ${this.getAttribute('data-id')} details.`);
            });
        });
    }

    // Favorites list
    const favList = document.getElementById('favoritesList');
    if (favList) {
        favList.innerHTML = mockFavorites.map(f => `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${f}
            <button class="btn btn-sm btn-outline-danger remove-fav">Remove</button>
        </li>`).join('');
    }
}

// --- پروفائل ایڈٹ ---
function initEmployerProfile() {
    const form = document.getElementById('employerProfileForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Profile updated successfully! (Demo)', 'success');
    });
}

// --- نیا ہائرنگ ریسپویز ---
function initHireRequest() {
    const form = document.getElementById('hireRequestForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const worker = document.getElementById('hireWorker')?.value || 'Selected Worker';
        showToast(`Hiring request sent to ${worker}! (Demo)`, 'success');
        // Baad mein backend call
    });
}

// --- Init Employer Pages ---
function initEmployerPage() {
    if (document.getElementById('employerDashboard')) {
        renderEmployerDashboard();
        console.log('👔 Employer dashboard initialized.');
    }
    if (document.getElementById('employerProfileForm')) {
        initEmployerProfile();
        console.log('👔 Employer profile initialized.');
    }
    if (document.getElementById('hireRequestForm')) {
        initHireRequest();
        console.log('👔 Hire request form initialized.');
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmployerPage);
} else {
    initEmployerPage();
}
