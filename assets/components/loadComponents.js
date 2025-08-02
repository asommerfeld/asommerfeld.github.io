async function loadComponents() {
    try {
        // Load navigation
        const navResponse = await fetch(`assets/components/nav-${currentLanguage}.html`);
        if (!navResponse.ok) throw new Error('Navigation not found');
        document.getElementById('nav-container').innerHTML = await navResponse.text();

        // Load footer
        const footerResponse = await fetch(`assets/components/footer-${currentLanguage}.html`);
        if (!footerResponse.ok) throw new Error('Footer not found');
        document.getElementById('footer-container').innerHTML = await footerResponse.text();

        // Re-setup components
        setupLanguageSwitcher();
        setupMobileMenu();
        applyTranslations();
    } catch (error) {
        console.error('Failed to load components:', error);
        if (currentLanguage !== 'en') {
            currentLanguage = 'en';
            loadComponents();
        }
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);