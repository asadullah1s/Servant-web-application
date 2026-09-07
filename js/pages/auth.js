// ============================================
// PAGE: AUTH (Login / Register)
// ============================================

// --- عام ویلڈیشن ہیلپرز ---
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\+\d\s\-\(\)]{7,15}$/.test(phone);
}

function validateCNIC(cnic) {
    return /^[0-9]{5}-[0-9]{7}-[0-9]$/.test(cnic) || /^[0-9]{13}$/.test(cnic);
}

function showToast(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) return;
    const toastBody = document.getElementById('toastMessage');
    if (!toastBody) return;

    // Background color change
    const bgMap = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-dark'
    };
    toastEl.className = `toast align-items-center text-white border-0 ${bgMap[type] || 'bg-success'}`;
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// --- ملٹی-سٹیپ رجسٹریشن (Employer) ---
function initMultiStepRegistration() {
    const form = document.getElementById('employerRegisterForm');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 4;
    const steps = document.querySelectorAll('.step-content');
    const nextBtns = document.querySelectorAll('.step-next');
    const prevBtns = document.querySelectorAll('.step-prev');
    const progressBar = document.getElementById('stepProgress');

    function updateStep(step) {
        currentStep = step;
        steps.forEach((el, idx) => {
            el.style.display = (idx + 1 === step) ? 'block' : 'none';
        });
        // Progress bar update
        if (progressBar) {
            const percent = ((step - 1) / (totalSteps - 1)) * 100;
            progressBar.style.width = percent + '%';
            progressBar.setAttribute('aria-valuenow', percent);
        }
        // Buttons visibility
        document.querySelectorAll('.step-prev').forEach(btn => btn.style.display = step === 1 ? 'none' : 'inline-block');
        document.querySelectorAll('.step-next').forEach(btn => btn.textContent = step === totalSteps ? 'Submit Registration' : 'Next');
    }

    // Next buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Validation for current step
            const currentStepEl = steps[currentStep - 1];
            const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
            let valid = true;
            inputs.forEach(inp => {
                if (!inp.value.trim()) {
                    inp.classList.add('is-invalid');
                    valid = false;
                } else {
                    inp.classList.remove('is-invalid');
                }
            });

            if (!valid) {
                showToast('Please fill all required fields.', 'warning');
                return;
            }

            if (currentStep === totalSteps) {
                // Submit form
                showToast('Registration submitted successfully! (Demo)', 'success');
                // form.submit(); // Baad mein backend se connect
            } else {
                updateStep(currentStep + 1);
            }
        });
    });

    // Previous buttons
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentStep > 1) updateStep(currentStep - 1);
        });
    });

    updateStep(1);
}

// --- لاگ ان فارم ---
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value || '';
        const password = document.getElementById('loginPassword')?.value || '';

        if (!email || !password) {
            showToast('Please enter email and password.', 'warning');
            return;
        }
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'danger');
            return;
        }

        // Demo login
        showToast(`Login successful! (Demo)\nWelcome ${email}`, 'success');
        // Baad mein: window.location.href = 'dashboard.html';
    });
}

// --- ورکر رجسٹریشن (پہلا سٹیپ صرف) ---
function initWorkerRegister() {
    const form = document.getElementById('workerRegisterForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // یہاں بہت سارے فیلڈز ہوں گے، صرف ڈیمو کے لیے
        showToast('Worker registration submitted! (Demo - will be multi-step)', 'success');
    });
}

// --- Init Auth Pages ---
function initAuthPage() {
    // Check karen hum kis page par hain
    if (document.getElementById('employerRegisterForm')) {
        initMultiStepRegistration();
        console.log('🔐 Employer registration initialized.');
    }
    if (document.getElementById('loginForm')) {
        initLoginForm();
        console.log('🔐 Login form initialized.');
    }
    if (document.getElementById('workerRegisterForm')) {
        initWorkerRegister();
        console.log('🔐 Worker registration initialized.');
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    initAuthPage();
}
