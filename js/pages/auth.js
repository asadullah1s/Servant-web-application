// ============================================
// PAGE: AUTH - MODULE VERSION
// ============================================

import { 
    auth, 
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    signOut,
    collection,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from '/js/firebase-config.js';

// ============================================
// 1. HELPER: Show Toast
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
}

// ============================================
// 2. VALIDATION HELPERS
// ============================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    return password && password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

// ============================================
// 3. LOGIN
// ============================================
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!email || !password) {
            showToast('Please enter email and password.', 'warning');
            return;
        }
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'danger');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check user role from Firestore
            const employerDoc = await getDoc(doc(db, 'employers', user.uid));
            const workerDoc = await getDoc(doc(db, 'workers', user.uid));
            
            let role = 'user';
            let dashboardUrl = '/index.html';
            
            if (employerDoc.exists()) {
                role = 'employer';
                dashboardUrl = '/pages/employer/dashboard.html';
            } else if (workerDoc.exists()) {
                role = 'worker';
                dashboardUrl = '/pages/worker/dashboard.html';
            }

            // Save session in localStorage
            localStorage.setItem('current_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'User',
                role: role
            }));

            showToast(`Welcome ${user.email}!`, 'success');

            setTimeout(() => {
                window.location.href = dashboardUrl;
            }, 1200);

        } catch (error) {
            console.error('Login error:', error);
            let message = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
            else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
            else if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Please wait.';
            showToast(message, 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// 4. EMPLOYER REGISTRATION
// ============================================
function initMultiStepRegistration() {
    const form = document.getElementById('employerRegisterForm');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 4;
    const steps = document.querySelectorAll('.step-content');
    const progressBar = document.getElementById('stepProgress');

    function updateStep(step) {
        currentStep = step;
        steps.forEach((el, idx) => {
            el.style.display = (idx + 1 === step) ? 'block' : 'none';
        });
        if (progressBar) {
            const percent = ((step - 1) / (totalSteps - 1)) * 100;
            progressBar.style.width = percent + '%';
            progressBar.setAttribute('aria-valuenow', percent);
        }
        document.querySelectorAll('.step-prev').forEach(btn => btn.style.display = step === 1 ? 'none' : 'inline-block');
        document.querySelectorAll('.step-next').forEach(btn => btn.textContent = step === totalSteps ? 'Submit Registration' : 'Next');
        
        const stepNum = document.getElementById('stepNum');
        if (stepNum) stepNum.textContent = step;
    }

    // Next buttons
    document.querySelectorAll('.step-next').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
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
                submitEmployerRegistration(form);
            } else {
                updateStep(currentStep + 1);
            }
        });
    });

    // Previous buttons
    document.querySelectorAll('.step-prev').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentStep > 1) updateStep(currentStep - 1);
        });
    });

    updateStep(1);
}

// --- Employer Registration Submit ---
async function submitEmployerRegistration(form) {
    const submitBtn = form.querySelector('.step-next');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Gather data
        const data = {
            fullName: form.querySelector('input[placeholder="John Doe"]')?.value || '',
            email: form.querySelector('input[placeholder="your@email.com"]')?.value || '',
            phone: form.querySelector('input[placeholder="+92 300 1234567"]')?.value || '',
            password: form.querySelector('input[placeholder="Min 8 chars"]')?.value || '',
            gender: form.querySelector('select:has(option[value="Male"])')?.value || '',
            dob: form.querySelector('input[type="date"]')?.value || '',
            cnic: form.querySelector('input[placeholder="12345-1234567-1"]')?.value || '',
            address: form.querySelector('input[placeholder="House #, Street"]')?.value || '',
            city: form.querySelector('input[placeholder="Karachi"]')?.value || '',
            area: form.querySelector('input[placeholder="Gulshan"]')?.value || '',
            service: form.querySelector('select:has(option[value="Cleaner"])')?.value || '',
            employmentType: form.querySelector('select:has(option[value="Full-time"])')?.value || '',
            salary: form.querySelector('input[placeholder="PKR 25000"]')?.value || '',
            startDate: form.querySelector('input[type="date"]:not([name])')?.value || '',
            workingHours: form.querySelector('input[placeholder="e.g. 9am - 5pm"]')?.value || '',
            role: 'employer'
        };

        if (!isValidEmail(data.email)) throw new Error('Invalid email');
        if (!isStrongPassword(data.password)) throw new Error('Password must be 8+ chars with uppercase, lowercase, number');

        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const uid = userCredential.user.uid;

        // 2. Save to Firestore
        delete data.password;
        await setDoc(doc(db, 'employers', uid), {
            ...data,
            uid: uid,
            status: 'Active',
            verified: false,
            createdAt: serverTimestamp()
        });

        // 3. Update Auth Profile
        await updateProfile(userCredential.user, {
            displayName: data.fullName
        });

        showToast('Registration successful! Please login.', 'success');
        setTimeout(() => {
            window.location.href = '/pages/auth/login.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        let message = error.message || 'Registration failed.';
        if (error.code === 'auth/email-already-in-use') message = 'Email already registered.';
        showToast(message, 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ============================================
// 5. WORKER REGISTRATION
// ============================================
function initWorkerRegister() {
    const form = document.getElementById('workerRegisterForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Gather data
            const data = {
                fullName: form.querySelector('input[placeholder="Muhammad Ali"]')?.value || '',
                fatherName: form.querySelector('input[placeholder="Father\'s name"]')?.value || '',
                gender: form.querySelector('select:has(option[value="Male"])')?.value || '',
                dob: form.querySelector('input[type="date"]')?.value || '',
                phone: form.querySelector('input[placeholder="+92 300 1234567"]')?.value || '',
                whatsapp: form.querySelector('input[placeholder="+92 300 1234567"]:not([required])')?.value || '',
                cnic: form.querySelector('input[placeholder="12345-1234567-1"]')?.value || '',
                country: form.querySelector('input[value="Pakistan"]')?.value || 'Pakistan',
                province: form.querySelector('input[placeholder="Sindh"]')?.value || '',
                city: form.querySelector('input[placeholder="Karachi"]')?.value || '',
                area: form.querySelector('input[placeholder="Gulshan"]')?.value || '',
                address: form.querySelector('input[placeholder="House #, Street"]')?.value || '',
                category: form.querySelector('select:has(option[value="Cleaner"])')?.value || '',
                experience: form.querySelector('input[placeholder="5"]')?.value || '0',
                skills: form.querySelector('input[placeholder="Cleaning, Cooking, Child Care"]')?.value || '',
                previousWork: form.querySelector('input[placeholder="Family A, Family B"]')?.value || '',
                expectedSalary: form.querySelector('input[placeholder="PKR 25,000"]')?.value || '',
                employmentType: form.querySelector('select:has(option[value="Full-time"])')?.value || '',
                availableFrom: form.querySelector('input[type="date"]')?.value || '',
                workingHours: form.querySelector('input[placeholder="9am - 5pm"]')?.value || '',
                refName: form.querySelector('input[placeholder="Mr. Ahmed"]')?.value || '',
                refPhone: form.querySelector('input[placeholder="+92 300 1234567"]')?.value || '',
                refRelation: form.querySelector('input[placeholder="Previous Employer"]')?.value || '',
                role: 'worker',
                status: 'Pending',
                verified: false,
                rating: 0,
                totalReviews: 0
            };

            // Password - prompt user
            const password = prompt('Set a password for your account (min 8 chars with uppercase, lowercase, number):');
            if (!password || !isStrongPassword(password)) {
                showToast('Password must be 8+ chars with uppercase, lowercase, and number.', 'warning');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            // If no email, use phone or generate
            let email = data.email;
            if (!email) {
                email = data.phone + '@staffing.com';
            }

            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // 2. Save to Firestore
            await setDoc(doc(db, 'workers', uid), {
                ...data,
                uid: uid,
                email: email,
                createdAt: serverTimestamp()
            });

            // 3. Update Auth Profile
            await updateProfile(userCredential.user, {
                displayName: data.fullName
            });

            showToast('Worker registration submitted for verification!', 'success');
            setTimeout(() => {
                window.location.href = '/pages/auth/login.html';
            }, 1500);

        } catch (error) {
            console.error('Worker registration error:', error);
            let message = error.message || 'Registration failed.';
            if (error.code === 'auth/email-already-in-use') message = 'Email already registered.';
            showToast(message, 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// 6. FORGOT PASSWORD
// ============================================
function initForgotPassword() {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail')?.value.trim();

        if (!email || !isValidEmail(email)) {
            showToast('Please enter a valid email.', 'warning');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset link sent to your email.', 'success');
            form.reset();
        } catch (error) {
            console.error('Reset password error:', error);
            let message = 'Failed to send reset email.';
            if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
            showToast(message, 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// 7. AUTH STATE LISTENER
// ============================================
function initAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User logged in:', user.uid);
            
            // Update UI: show dashboard link, hide login/register
            const loginBtn = document.querySelector('a[href="/pages/auth/login.html"]');
            const registerBtn = document.querySelector('a[href="/pages/auth/employer-register.html"]');
            
            if (loginBtn) {
                // Check role
                const employerDoc = await getDoc(doc(db, 'employers', user.uid));
                const workerDoc = await getDoc(doc(db, 'workers', user.uid));
                
                if (employerDoc.exists()) {
                    loginBtn.textContent = 'Dashboard';
                    loginBtn.href = '/pages/employer/dashboard.html';
                } else if (workerDoc.exists()) {
                    loginBtn.textContent = 'Dashboard';
                    loginBtn.href = '/pages/worker/dashboard.html';
                } else {
                    loginBtn.textContent = 'Dashboard';
                    loginBtn.href = '/index.html';
                }
            }
            
            if (registerBtn) {
                registerBtn.textContent = 'Logout';
                registerBtn.href = '#';
                registerBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    signOut(auth);
                    localStorage.removeItem('current_user');
                    showToast('Logged out successfully.', 'info');
                    window.location.href = '/index.html';
                });
            }
        } else {
            console.log('User logged out.');
            // Reset UI to login/register
            const loginBtn = document.querySelector('a[href="/pages/auth/login.html"]');
            const registerBtn = document.querySelector('a[href="/pages/auth/employer-register.html"]');
            if (loginBtn && !loginBtn.textContent.includes('Login')) {
                loginBtn.textContent = 'Login';
                loginBtn.href = '/pages/auth/login.html';
            }
            if (registerBtn && !registerBtn.textContent.includes('Register')) {
                registerBtn.textContent = 'Register';
                registerBtn.href = '/pages/auth/employer-register.html';
            }
        }
    });
}

// ============================================
// 8. INIT
// ============================================
function initAuthPage() {
    initAuthStateListener();

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
    if (document.getElementById('forgotPasswordForm')) {
        initForgotPassword();
        console.log('🔐 Forgot password initialized.');
    }
}

// Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    initAuthPage();
}
