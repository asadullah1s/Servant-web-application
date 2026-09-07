async function loadPartials() {
    // Load Navbar
    const navbar = document.getElementById('navbar-container');
    if (navbar) {
        const res = await fetch('partials/navbar.html');
        navbar.innerHTML = await res.text();
    }
    // Load Footer
    const footer = document.getElementById('footer-container');
    if (footer) {
        const res = await fetch('partials/footer.html');
        footer.innerHTML = await res.text();
    }
    // ... other partials
    // Re-run language apply because new elements with data-i18n are added
    applyLanguage(currentLang);
    // Re-bind language switch events because dropdown is recreated
    initLanguageSwitch();
}
