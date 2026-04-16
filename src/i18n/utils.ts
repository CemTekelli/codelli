import fr from './fr.json';
import en from './en.json';
import nl from './nl.json';

export type Lang = 'fr' | 'en' | 'nl';

export const SUPPORTED_LANGS: Lang[] = ['fr', 'en', 'nl'];
export const DEFAULT_LANG: Lang = 'fr';

type Translations = typeof fr;

const translations: Record<Lang, Translations> = { fr, en, nl };

/**
 * Resolve a dot-notation key from a nested object.
 * e.g. t('fr', 'hero.line1') → "Nous concevons,"
 */
export function t(lang: Lang, key: string, fallback?: string): string {
  const keys = key.split('.');
  let value: unknown = translations[lang] ?? translations[DEFAULT_LANG];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as object)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Try fallback to default lang
      if (lang !== DEFAULT_LANG) {
        return t(DEFAULT_LANG, key, fallback);
      }
      return fallback ?? key;
    }
  }

  return typeof value === 'string' ? value : (fallback ?? key);
}

/**
 * Get the full translations object for a language (useful for meta tags etc.)
 */
export function getTranslations(lang: Lang): Translations {
  return translations[lang] ?? translations[DEFAULT_LANG];
}

/**
 * Detect language from URL pathname.
 * / or /anything → 'fr' (default)
 * /en/... → 'en'
 * /nl/... → 'nl'
 */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  if (first === 'nl') return 'nl';
  return DEFAULT_LANG;
}

/**
 * Build a localized URL path.
 * e.g. localePath('en', '/blog/') → '/en/blog/'
 *      localePath('fr', '/blog/') → '/blog/'  (FR is root)
 */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return `/${lang}${clean}`;
}

/**
 * HTML lang attribute value per language.
 */
export const HTML_LANG: Record<Lang, string> = {
  fr: 'fr-BE',
  en: 'en',
  nl: 'nl-BE',
};
