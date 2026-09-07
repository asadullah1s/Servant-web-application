// ============================================
// PAGE: WORKER (Dashboard, Profile, Docs, Apps)
// ============================================

// --- ڈیمو ڈیٹا ---
const mockApplications = [
    { id: 1, employer: 'Ahmed R.', service: 'Maid', status: 'Applied', date: '2026-09-09' },
    { id: 2, employer: 'Sara T.', service: 'Cook', status: 'Under Review', date: '2026-09-07' },
    { id: 3, employer: 'Usman S.', service: 'Driver', status: 'Accepted', date: '2026-09-04' },
];

// --- ڈیش بورڈ رینڈر ---
function renderWorkerDashboard() {
    const stats = {
        'profileCompletion': '75%',
        'verificationStatus': 'Under Review',
        'availableJobs': 12,
        'applicationsCount': mockApplications.length,
        'acceptedCount': mockApplications.filter(a => a.status === 'Accepted').length,
    };

    Object.keys(stats).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = stats[id];
    });

    // Applications Table
    const tableBody = document.getElementById('applicationsTable');
    if (tableBody) {
        tableBody.innerHTML = mockApplications.map(a => `
            <tr>
                <td>${a.employer}</td>
                <td>${a.service}</td>
                <td><span class="badge bg-${a.status === 'Applied' ? 'info' : a.status === 'Under Review' ? 'warning' : a.status === 'Accepted' ? 'success' : 'secondary'}">${a.status}</span></td>
                <td>${a.date}</td>
                <td><button class="btn btn-sm btn-outline-primary view-app" data-id="${a.id}">Details</button></td>
            </tr>
        `).join('');
    }
}

// --- پروفائل اپ ڈیٹ ---
function initWorkerProfile() {
    const form = document.getElementById('workerProfileForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Profile updated successfully! (Demo)', 'success');
    });

    // Availability toggle
    const toggle = document.getElementById('availabilityToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const status = this.checked ? 'Available' : 'Not Available';
            document.getElementById('availabilityStatus').textContent = status;
            showToast(`Availability set to: ${status}`, 'info');
        });
    }
}

// --- دستاویزات اپ لوڈ (پریویو) ---
function initWorkerDocuments() {
    const fileInputs = document.querySelectorAll('.doc-upload');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'No file selected';
            const previewId = this.getAttribute('data-preview');
            if (previewId) {
                document.getElementById(previewId).textContent = fileName;
            }
            showToast(`File "${fileName}" selected. (Upload demo)`, 'info');
        });
    });

    const form = document.getElementById('documentsForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Documents submitted for verification! (Demo)', 'success');
        });
    }
}

// --- دستیاب نوکریاں ---
function renderAvailableJobs() {
    const container = document.getElementById('availableJobsContainer');
    if (!container) return;

    const jobs = [
        { title: 'Maid needed', employer: 'Household A', salary: 'PKR 25,000', location: 'Karachi' },
        { title: 'Cook for family', employer: 'Family B', salary: 'PKR 35,000', location: 'Lahore' },
        { title: 'Driver required', employer: 'Office C', salary: 'PKR 30,000', location: 'Islamabad' },
    ];

    container.innerHTML = jobs.map(j => `
        <div class="col-md-4">
            <div class="card p-3 shadow-sm h-100">
                <h6>${j.title}</h6>
                <p class="small text-muted">${j.employer} • ${j.location}</p>
                <p class="fw-bold text-primary">${j.salary}</p>
                <button class="btn btn-primary btn-sm apply-job" data-title="${j.title}">Apply Now</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.apply-job').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast(`Applied for "${this.getAttribute('data-title')}" successfully! (Demo)`, 'success');
        });
    });
}

// --- Init Worker Pages ---
function initWorkerPage() {
    if (document.getElementById('workerDashboard')) {
        renderWorkerDashboard();
        console.log('👷 Worker dashboard initialized.');
    }
    if (document.getElementById('workerProfileForm')) {
        initWorkerProfile();
        console.log('👷 Worker profile initialized.');
    }
    if (document.querySelector('.doc-upload')) {
        initWorkerDocuments();
        console.log('👷 Worker documents initialized.');
    }
    if (document.getElementById('availableJobsContainer')) {
        renderAvailableJobs();
        console.log('👷 Available jobs initialized.');
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkerPage);
} else {
    initWorkerPage();
}
