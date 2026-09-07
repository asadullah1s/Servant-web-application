// ============================================
// I18N: MAIN TRANSLATIONS OBJECT
// (en, ur, ps ko combine karega)
// ============================================

// NOTE: en, ur, ps already defined in their respective files
// which must be loaded before this file.

const translations = {
    en: en,
    ur: ur,
    ps: ps
};

// Agar koi language missing ho toh fallback
if (typeof translations.en === 'undefined') {
    console.warn('English translations not loaded properly.');
}
if (typeof translations.ur === 'undefined') {
    console.warn('Urdu translations not loaded properly.');
}
if (typeof translations.ps === 'undefined') {
    console.warn('Pashto translations not loaded properly.');
}

// (Optional) Make it globally accessible
window.translations = translations;
