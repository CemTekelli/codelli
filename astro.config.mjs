// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://codelli.tech',
  output: 'static',

  integrations: [
    sitemap({
      // Toutes les locales
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-BE',
          en: 'en',
          nl: 'nl-BE',
        },
      },
      // Exclure les pages sans valeur SEO
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/api/'),
    }),
  ],

  // i18n routing : FR à la racine, EN sous /en/, NL sous /nl/
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
