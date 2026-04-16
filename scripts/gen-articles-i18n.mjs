import { readFileSync, writeFileSync } from 'fs';

// ─── Helper: extract parts from HTML ─────────────────────────────
function extractParts(filePath) {
  const c = readFileSync(filePath, 'utf-8');
  const tocMatch = c.match(/<nav class="toc[\s\S]*?<\/nav>/);
  const bodyMatch = c.match(/<div class="article-body" itemprop="articleBody">([\s\S]*?)<div class="article-cta/);
  const ctaIdx = c.indexOf('<div class="article-cta fade-in">');
  const ctaEnd = c.indexOf('</div><!-- /article-wrap -->');
  const introMatch = c.match(/<p class="article-intro" itemprop="description">\s*([\s\S]*?)\s*<\/p>/);

  if (!tocMatch) throw new Error(`No TOC found in ${filePath}`);
  if (!bodyMatch) throw new Error(`No body found in ${filePath}`);
  if (ctaIdx === -1) throw new Error(`No CTA found in ${filePath}`);
  if (!introMatch) throw new Error(`No intro found in ${filePath}`);

  return {
    toc: tocMatch[0],
    body: bodyMatch[1],
    cta: c.slice(ctaIdx, ctaEnd).trim(),
    intro: introMatch[1].trim(),
  };
}

// ─── Helper: write .astro page ────────────────────────────────────
function writeArticlePage(outputPath, slug, entryId, langPrefix, toc, body, cta, intro, meta) {
  const canonical = langPrefix ? `/${langPrefix}/blog/${slug}` : `/blog/${slug}`;
  const layoutImport = langPrefix
    ? `import BlogArticleLayout from '../../../layouts/BlogArticleLayout.astro';`
    : `import BlogArticleLayout from '../../layouts/BlogArticleLayout.astro';`;
  const getEntryImport = langPrefix
    ? `import { getEntry } from 'astro:content';`
    : `import { getEntry } from 'astro:content';`;

  const page = `---
${layoutImport}
${getEntryImport}

const entry = await getEntry('blog', '${entryId}');
const { data } = entry;

const toc = ${JSON.stringify(toc)};
const body = ${JSON.stringify(body)};
const cta = ${JSON.stringify(cta)};
const intro = ${JSON.stringify(intro)};
---

<BlogArticleLayout
  lang={data.lang}
  title={data.title}
  description={data.description}
  canonical={'${canonical}'}
  ogImage={data.ogImage}
  category={data.category}
  readingTime={data.readingTime}
  pubDate={data.pubDate}
  author={data.author}
  authorRole={data.authorRole}
  intro={intro}
  translationSlugs={data.translationSlugs}
>
  <script type="application/ld+json" slot="schema">
  ${JSON.stringify(meta, null, 2)}
  <\/script>

  <div class="article-toc-wrap" set:html={toc} />
  <div class="article-body" itemprop="articleBody" set:html={body} />
  <div set:html={cta} />
</BlogArticleLayout>
`;

  writeFileSync(outputPath, page, 'utf-8');
  console.log(`Written: ${outputPath} (${page.length} chars)`);
}

const BASE = 'C:/Users/Tekel/OneDrive/Bureau/test/blog';
const OUT_EN = 'C:/Users/Tekel/OneDrive/Bureau/codelli-astro/src/pages/en/blog';
const OUT_NL = 'C:/Users/Tekel/OneDrive/Bureau/codelli-astro/src/pages/nl/blog';

// ─── chatbot EN ──────────────────────────────────────────────────
const chatbotEn = extractParts(`${BASE}/integrer-chatbot-ia-pme-belgique-en.html`);
writeArticlePage(
  `${OUT_EN}/integrer-chatbot-ia-pme-belgique-en.astro`,
  'integrer-chatbot-ia-pme-belgique-en',
  'integrer-chatbot-ia-pme-belgique-en',
  'en',
  chatbotEn.toc, chatbotEn.body, chatbotEn.cta, chatbotEn.intro,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/en/blog/integrer-chatbot-ia-pme-belgique-en#post",
    "headline": "How to integrate an AI chatbot in a Belgian SME in 2026 — Expert guide",
    "description": "Complete expert guide on integrating an AI chatbot in a Belgian SME in 2026. LLMs, RAG, Belgian grants, GDPR & EU AI Act.",
    "url": "https://codelli.tech/en/blog/integrer-chatbot-ia-pme-belgique-en",
    "datePublished": "2026-04-15",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/en/blog/#blog" },
    "inLanguage": "en"
  }
);

// ─── chatbot NL ──────────────────────────────────────────────────
const chatbotNl = extractParts(`${BASE}/integrer-chatbot-ia-pme-belgique-nl.html`);
writeArticlePage(
  `${OUT_NL}/integrer-chatbot-ia-pme-belgique-nl.astro`,
  'integrer-chatbot-ia-pme-belgique-nl',
  'integrer-chatbot-ia-pme-belgique-nl',
  'nl',
  chatbotNl.toc, chatbotNl.body, chatbotNl.cta, chatbotNl.intro,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/nl/blog/integrer-chatbot-ia-pme-belgique-nl#post",
    "headline": "Hoe integreer je een AI-chatbot in een Belgische kmo in 2026 — Expert gids",
    "description": "Volledige expert gids over het integreren van een AI-chatbot in een Belgische kmo in 2026. LLMs, RAG, Belgische subsidies, AVG & EU AI Act.",
    "url": "https://codelli.tech/nl/blog/integrer-chatbot-ia-pme-belgique-nl",
    "datePublished": "2026-04-15",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/nl/blog/#blog" },
    "inLanguage": "nl-BE"
  }
);

// ─── fastapi EN ──────────────────────────────────────────────────
const fastapiEn = extractParts(`${BASE}/fastapi-vs-nodejs-mvp-2026-en.html`);
writeArticlePage(
  `${OUT_EN}/fastapi-vs-nodejs-mvp-2026-en.astro`,
  'fastapi-vs-nodejs-mvp-2026-en',
  'fastapi-vs-nodejs-mvp-2026-en',
  'en',
  fastapiEn.toc, fastapiEn.body, fastapiEn.cta, fastapiEn.intro,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/en/blog/fastapi-vs-nodejs-mvp-2026-en#post",
    "headline": "FastAPI vs Node.js for your MVP in 2026 — Complete expert comparison",
    "description": "Expert comparison FastAPI vs Node.js to choose the right backend for your MVP in 2026.",
    "url": "https://codelli.tech/en/blog/fastapi-vs-nodejs-mvp-2026-en",
    "datePublished": "2026-04-14",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/en/blog/#blog" },
    "inLanguage": "en"
  }
);

// ─── fastapi NL ──────────────────────────────────────────────────
const fastapiNl = extractParts(`${BASE}/fastapi-vs-nodejs-mvp-2026-nl.html`);
writeArticlePage(
  `${OUT_NL}/fastapi-vs-nodejs-mvp-2026-nl.astro`,
  'fastapi-vs-nodejs-mvp-2026-nl',
  'fastapi-vs-nodejs-mvp-2026-nl',
  'nl',
  fastapiNl.toc, fastapiNl.body, fastapiNl.cta, fastapiNl.intro,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/nl/blog/fastapi-vs-nodejs-mvp-2026-nl#post",
    "headline": "FastAPI vs Node.js voor uw MVP in 2026 — Volledig expert vergelijk",
    "description": "Expert vergelijking FastAPI vs Node.js om de juiste backend te kiezen voor uw MVP in 2026.",
    "url": "https://codelli.tech/nl/blog/fastapi-vs-nodejs-mvp-2026-nl",
    "datePublished": "2026-04-14",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/nl/blog/#blog" },
    "inLanguage": "nl-BE"
  }
);

console.log('Done.');
