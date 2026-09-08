// ============================================
// RTL HANDLER
// RTL / LTR aur Direction manage karega
// ============================================

const RTLHandler = {
    /**
     * Language ke mutabiq RTL/LTR apply karein
     * @param {string} lang - 'en', 'ur', 'ps'
     */
    applyDirection: function(lang) {
        const htmlTag = document.documentElement;
        const body = document.body;

        if (lang === 'ur' || lang === 'ps') {
            htmlTag.setAttribute('dir', 'rtl');
            htmlTag.setAttribute('lang', lang);
            body.setAttribute('dir', 'rtl');
            body.classList.add('rtl-enabled');
        } else {
            htmlTag.setAttribute('dir', 'ltr');
            htmlTag.setAttribute('lang', lang);
            body.setAttribute('dir', 'ltr');
            body.classList.remove('rtl-enabled');
        }

        // Optional: Bootstrap RTL classes ke liye
        // Agar Bootstrap 5 RTL use kar rahe ho toh
        // body.classList.toggle('rtl', lang === 'ur' || lang === 'ps');
    },

    /**
     * Check karein ke current direction RTL hai ya nahi
     */
    isRTL: function() {
        return document.documentElement.getAttribute('dir') === 'rtl';
    },

    /**
     * Current language get karein (localStorage se)
     */
    getCurrentLanguage: function() {
        return localStorage.getItem('app_lang') || 'en';
    },

    /**
     * RTL apply karein current saved language ke mutabiq
     */
    applySavedDirection: function() {
        const lang = this.getCurrentLanguage();
        this.applyDirection(lang);
        return lang;
    }
};

// Agar global scope mein use karna ho
window.RTLHandler = RTLHandler;
