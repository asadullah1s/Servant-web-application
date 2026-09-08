// ============================================
// FIREBASE CONFIG
// ============================================

// IMPORTANT: Apna config yahan paste karein
// Jo Firebase Console se mila hai.
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyHere123456789",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// (Optional) Enable offline persistence for Firestore
db.enablePersistence()
    .catch((err) => {
        console.warn('Firestore persistence error:', err);
    });

// Make them globally accessible
window.auth = auth;
window.db = db;
window.storage = storage;

console.log('🔥 Firebase initialized successfully!');
