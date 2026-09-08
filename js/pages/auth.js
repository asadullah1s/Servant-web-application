// ============================================
// AUTH.JS - Login, Register, Forgot
// ============================================

import { 
    auth, db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    doc, setDoc, getDoc, serverTimestamp
} from '../firebase-config.js';

// ============================================
// 1. LOGIN
// ============================================
function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!email || !password) {
            window.showToast('Please fill all fields.', 'warning');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Logging in...';

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const user = cred.user;

            // Check role
            const empDoc = await getDoc(doc(db, 'employers', user.uid));
            const workDoc = await getDoc(doc(db, 'workers', user.uid));

            let dash = '/index.html';
            if (empDoc.exists()) dash = '/pages/employer/dashboard.html';
            else if (workDoc.exists()) dash = '/pages/worker/dashboard.html';

            localStorage.setItem('current_user', JSON.stringify({
                uid: user.uid, email: user.email, displayName: user.displayName || 'User'
            }));

            window.showToast(`Welcome ${user.email}!`, 'success');
            setTimeout(() => { window.location.href = dash; }, 1200);

        } catch (error) {
            let msg = 'Login failed.';
            if (error.code === 'auth/user-not-found') msg = 'No account found.';
            else if (error.code === 'auth/wrong-password') msg = 'Wrong password.';
            else if (error.code === 'auth/too-many-requests') msg = 'Too many attempts.';
            window.showToast(msg, 'danger');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = orig;
        }
    });
}

// ============================================
// 2. EMPLOYER REGISTER
// ============================================
function initEmployerRegister() {
    const form = document.getElementById('employerRegisterForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Submitting...';

        try {
            const email = form.querySelector('input[placeholder="your@email.com"]')?.value || '';
            const password = form.querySelector('input[placeholder="Min 8 chars"]')?.value || '';
            const name = form.querySelector('input[placeholder="John Doe"]')?.value || '';
            const phone = form.querySelector('input[placeholder="+92 300 1234567"]')?.value || '';

            if (!email || !password || !name) {
                window.showToast('Please fill all required fields.', 'warning');
                btn.disabled = false;
                btn.textContent = orig;
                return;
            }

            // Create Auth
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

            // Save to Firestore
            await setDoc(doc(db, 'employers', uid), {
                fullName: name,
                email: email,
                phone: phone,
                uid: uid,
                role: 'employer',
                status: 'Active',
                verified: false,
                createdAt: serverTimestamp()
            });

            await updateProfile(cred.user, { displayName: name });

            window.showToast('Registration successful! Please login.', 'success');
            setTimeout(() => { window.location.href = '/pages/auth/login.html'; }, 1500);

        } catch (error) {
            let msg = error.message || 'Registration failed.';
            if (error.code === 'auth/email-already-in-use') msg = 'Email already registered.';
            window.showToast(msg, 'danger');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = orig;
        }
    });
}

// ============================================
// 3. WORKER REGISTER
// ============================================
function initWorkerRegister() {
    const form = document.getElementById('workerRegisterForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Submitting...';

        try {
            const name = form.querySelector('input[placeholder="Muhammad Ali"]')?.value || '';
            const phone = form.querySelector('input[placeholder="+92 300 1234567"]')?.value || '';

            if (!name || !phone) {
                window.showToast('Please fill name and phone.', 'warning');
                btn.disabled = false;
                btn.textContent = orig;
                return;
            }

            const email = phone + '@staffing.com';
            const password = prompt('Set a password (min 8 chars):');
            if (!password || password.length < 8) {
                window.showToast('Password must be 8+ characters.', 'warning');
                btn.disabled = false;
                btn.textContent = orig;
                return;
            }

            // Create Auth
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

            // Save to Firestore
            await setDoc(doc(db, 'workers', uid), {
                fullName: name,
                phone: phone,
                email: email,
                uid: uid,
                role: 'worker',
                status: 'Pending',
                verified: false,
                rating: 0,
                totalReviews: 0,
                createdAt: serverTimestamp()
            });

            await updateProfile(cred.user, { displayName: name });

            window.showToast('Worker registration submitted! Please login.', 'success');
            setTimeout(() => { window.location.href = '/pages/auth/login.html'; }, 1500);

        } catch (error) {
            let msg = error.message || 'Registration failed.';
            if (error.code === 'auth/email-already-in-use') msg = 'Email already registered.';
            window.showToast(msg, 'danger');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = orig;
        }
    });
}

// ============================================
// 4. FORGOT PASSWORD
// ============================================
function initForgotPassword() {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail')?.value.trim();

        if (!email) {
            window.showToast('Please enter your email.', 'warning');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            await sendPasswordResetEmail(auth, email);
            window.showToast('Reset link sent to your email.', 'success');
            form.reset();
        } catch (error) {
            let msg = 'Failed to send reset email.';
            if (error.code === 'auth/user-not-found') msg = 'No account found.';
            window.showToast(msg, 'danger');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = orig;
        }
    });
}

// ============================================
// 5. INIT
// ============================================
function init() {
    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('employerRegisterForm')) initEmployerRegister();
    if (document.getElementById('workerRegisterForm')) initWorkerRegister();
    if (document.getElementById('forgotPasswordForm')) initForgotPassword();
    console.log('🔐 Auth page initialized.');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
