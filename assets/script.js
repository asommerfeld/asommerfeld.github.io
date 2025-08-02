let currentLanguage = localStorage.getItem('language') || 'en';
const translationCache = {};

async function loadTranslationFile(path) {
    if (translationCache[path]) return translationCache[path];

    try {
        const response = await fetch(path);
        if (!response.ok) {
            console.warn(`Translation file not found: ${path}`);
            return {};
        }
        const translations = await response.json();
        translationCache[path] = translations;
        return translations;
    } catch (error) {
        console.error(`Error loading ${path}:`, error);
        return {};
    }
}

function getPageIdentifier() {
    const path = window.location.pathname.toLowerCase();
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('/about')) return 'about';
    return 'home';
}

async function applyTranslations() {
    const pageId = getPageIdentifier();
    const translationFiles = [
        `assets/translations/${currentLanguage}/general.json`,
        `assets/translations/${currentLanguage}/${pageId}.json`
    ];

    try {
        const translations = await Promise.all(
            translationFiles.map(file => loadTranslationFile(file))
        );

        const combined = Object.assign({}, ...translations);

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (combined[key]) {
                el.textContent = combined[key];
            }
        });

        document.documentElement.lang = currentLanguage;
    } catch (error) {
        console.error('Error applying translations:', error);
    }
}

function setupLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        switcher.value = currentLanguage;
        switcher.addEventListener('change', async (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            await applyTranslations();
            loadComponents();
        });
    }
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSwitcher();
    setupMobileMenu();
    applyTranslations();
});