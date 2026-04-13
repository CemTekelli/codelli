/**
 * Codelli i18n - Internationalization System
 * Supports: English (en), French (fr), Dutch (nl)
 */

const I18n = {
  // Supported languages
  supportedLangs: ['en', 'fr', 'nl'],
  defaultLang: 'en',
  currentLang: null,
  translations: {},

  /**
   * Initialize the i18n system
   */
  async init() {
    // Determine initial language
    this.currentLang = this.detectLanguage();

    // Load translation file
    await this.loadTranslation(this.currentLang);

    // Apply translations to the page
    this.applyTranslations();

    // Update document lang attribute
    this.updateDocumentLang();

    // Update meta tags
    this.updateMetaTags();

    // Setup language switcher
    this.setupLanguageSwitcher();

    console.log(`[i18n] Initialized with language: ${this.currentLang}`);
  },

  /**
   * Detect language from URL, localStorage, or browser
   */
  detectLanguage() {
    // 1. Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.supportedLangs.includes(urlLang)) {
      localStorage.setItem('codelli-lang', urlLang);
      return urlLang;
    }

    // 2. Check localStorage
    const storedLang = localStorage.getItem('codelli-lang');
    if (storedLang && this.supportedLangs.includes(storedLang)) {
      return storedLang;
    }

    // 3. Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    // 4. Fallback to default
    return this.defaultLang;
  },

  /**
   * Load translation file for a language
   */
  async loadTranslation(lang) {
    if (this.translations[lang]) {
      return this.translations[lang];
    }

    try {
      const response = await fetch(`./i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`[i18n] Error loading translation: ${error.message}`);
      // Fallback to default language if not already
      if (lang !== this.defaultLang) {
        return this.loadTranslation(this.defaultLang);
      }
      return {};
    }
  },

  /**
   * Get a translation by key path (e.g., "hero.line1")
   */
  t(keyPath) {
    const keys = keyPath.split('.');
    let value = this.translations[this.currentLang];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`[i18n] Missing translation: ${keyPath}`);
        return keyPath;
      }
    }

    return value;
  },

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    // Handle text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation !== key) {
        el.textContent = translation;
      }
    });

    // Handle innerHTML (for content with embedded HTML tags)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const translation = this.t(key);
      if (translation !== key) {
        el.innerHTML = translation;
      }
    });

    // Handle placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation !== key) {
        el.placeholder = translation;
      }
    });

    // Handle aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const translation = this.t(key);
      if (translation !== key) {
        el.setAttribute('aria-label', translation);
      }
    });

    // Handle title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation !== key) {
        el.setAttribute('title', translation);
      }
    });

    // Handle alt attributes (images)
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const translation = this.t(key);
      if (translation !== key) {
        el.setAttribute('alt', translation);
      }
    });
  },

  /**
   * Update document lang attribute
   */
  updateDocumentLang() {
    const langMap = {
      'en': 'en',
      'fr': 'fr-BE',
      'nl': 'nl-BE'
    };
    document.documentElement.lang = langMap[this.currentLang] || this.currentLang;
  },

  /**
   * Update meta tags dynamically
   */
  updateMetaTags() {
    const meta = this.translations[this.currentLang]?.meta;
    if (!meta) return;

    // Title
    if (meta.title) {
      document.title = meta.title;
    }

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && meta.description) {
      metaDesc.setAttribute('content', meta.description);
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && meta.keywords) {
      metaKeywords.setAttribute('content', meta.keywords);
    }

    // Open Graph - use dedicated og fields or fallback to main meta
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.og?.title || meta.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.og?.description || meta.description);
    }

    // Twitter - use dedicated twitter fields or fallback to og, then main meta
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', meta.twitter?.title || meta.og?.title || meta.title);
    }

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', meta.twitter?.description || meta.og?.description || meta.description);
    }
  },

  /**
   * Setup language switcher buttons
   */
  setupLanguageSwitcher() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      // Mark current language as active
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const newLang = btn.getAttribute('data-lang');
        if (newLang !== this.currentLang) {
          await this.switchLanguage(newLang);
        }
      });
    });
  },

  /**
   * Switch to a new language
   */
  async switchLanguage(lang) {
    if (!this.supportedLangs.includes(lang)) {
      console.error(`[i18n] Unsupported language: ${lang}`);
      return;
    }

    // Save to localStorage
    localStorage.setItem('codelli-lang', lang);
    this.currentLang = lang;

    // Load translation if needed
    await this.loadTranslation(lang);

    // Apply all translations
    this.applyTranslations();
    this.updateDocumentLang();
    this.updateMetaTags();

    // Update active state on buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update URL without reload (optional)
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    console.log(`[i18n] Switched to language: ${lang}`);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});

// Export for use in other scripts
window.I18n = I18n;
