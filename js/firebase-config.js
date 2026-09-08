// ============================================
// FIREBASE CONFIG - MODULE VERSION
// ============================================

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

// Your Firebase Config (from console)
const firebaseConfig = {
    apiKey: "AIzaSyBDwu0ajN3u_3vbzQ4Yom7-JFgRXgW3ImQ",
    authDomain: "rent-a-servant.firebaseapp.com",
    projectId: "rent-a-servant",
    storageBucket: "rent-a-servant.firebasestorage.app",
    messagingSenderId: "105118617152",
    appId: "1:105118617152:web:23871656054820f1bed9a5",
    measurementId: "G-9JTN3K15XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { 
    app, 
    auth, 
    db, 
    storage,
    // Auth functions
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    signOut,
    // Firestore functions
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    onSnapshot,
    addDoc,
    serverTimestamp,
    // Storage functions
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll
};

console.log('🔥 Firebase initialized successfully! (Module)');
