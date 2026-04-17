// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://codelli.tech';

// Blog articles with different slugs per language — sitemap plugin can't auto-detect these
const BLOG_HREFLANG_MAP = {
  '/blog/fastapi-vs-nodejs-mvp-2026/': {
    'fr-BE': '/blog/fastapi-vs-nodejs-mvp-2026/',
    'en':    '/en/blog/fastapi-vs-nodejs-mvp-2026-en/',
    'nl-BE': '/nl/blog/fastapi-vs-nodejs-mvp-2026-nl/',
  },
  '/blog/integrer-chatbot-ia-pme-belgique/': {
    'fr-BE': '/blog/integrer-chatbot-ia-pme-belgique/',
    'en':    '/en/blog/integrer-chatbot-ia-pme-belgique-en/',
    'nl-BE': '/nl/blog/integrer-chatbot-ia-pme-belgique-nl/',
  },
};

// Build a lookup: any blog article path → its hreflang group
const blogPathLookup = new Map();
for (const [frPath, variants] of Object.entries(BLOG_HREFLANG_MAP)) {
  for (const path of Object.values(variants)) {
    blogPathLookup.set(path, variants);
  }
}

export default defineConfig({
  site: SITE,
  output: 'static',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-BE',
          en: 'en',
          nl: 'nl-BE',
        },
      },
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/api/'),
      serialize(item) {
        const path = item.url.replace(SITE, '');
        const variants = blogPathLookup.get(path);
        if (variants) {
          return {
            ...item,
            links: Object.entries(variants).map(([lang, p]) => ({
              lang,
              url: `${SITE}${p}`,
            })),
          };
        }
        return item;
      },
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
