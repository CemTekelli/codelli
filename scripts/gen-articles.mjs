import { readFileSync, writeFileSync } from 'fs';

// ─── Article 1 ───────────────────────────────────────────────────
const c1 = readFileSync('C:/Users/Tekel/OneDrive/Bureau/test/blog/integrer-chatbot-ia-pme-belgique.html', 'utf-8');
const toc1 = c1.match(/<nav class="toc[\s\S]*?<\/nav>/)[0];
const body1 = c1.match(/<div class="article-body" itemprop="articleBody">([\s\S]*?)<div class="article-cta/)[1];
const ctaIdx1 = c1.indexOf('<div class="article-cta fade-in">');
const ctaEnd1 = c1.indexOf('</div><!-- /article-wrap -->');
const cta1 = c1.slice(ctaIdx1, ctaEnd1).trim();
const intro1 = c1.match(/<p class="article-intro" itemprop="description">\s*([\s\S]*?)\s*<\/p>/)[1].trim();

// ─── Article 2 ───────────────────────────────────────────────────
const c2 = readFileSync('C:/Users/Tekel/OneDrive/Bureau/test/blog/fastapi-vs-nodejs-mvp-2026.html', 'utf-8');
const toc2 = c2.match(/<nav class="toc[\s\S]*?<\/nav>/)[0];
const body2 = c2.match(/<div class="article-body" itemprop="articleBody">([\s\S]*?)<div class="article-cta/)[1];
const ctaIdx2 = c2.indexOf('<div class="article-cta fade-in">');
const ctaEnd2 = c2.indexOf('</div><!-- /article-wrap -->');
const cta2 = c2.slice(ctaIdx2, ctaEnd2).trim();
const intro2 = c2.match(/<p class="article-intro" itemprop="description">\s*([\s\S]*?)\s*<\/p>/)[1].trim();

// ─── Helper: write .astro page ────────────────────────────────────
function writeArticlePage(slug, toc, body, cta, intro, meta) {
  // Escape { and } for Astro JSX — only needed in set:html blocks, which are fine as-is
  // The HTML goes into JS string variables (no template literals to escape)
  // We use JSON.stringify to safely embed the HTML strings in JS

  const page = `---
import BlogArticleLayout from '../../layouts/BlogArticleLayout.astro';
import { getEntry } from 'astro:content';

const entry = await getEntry('blog', '${slug}');
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
  canonical={'/blog/${slug}'}
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

  writeFileSync(
    `C:/Users/Tekel/OneDrive/Bureau/codelli-astro/src/pages/blog/${slug}.astro`,
    page,
    'utf-8'
  );
  console.log(`Written: ${slug}.astro (${page.length} chars)`);
}

// ─── Article 1 — chatbot ────────────────────────────────────────
writeArticlePage(
  'integrer-chatbot-ia-pme-belgique',
  toc1, body1, cta1, intro1,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/blog/integrer-chatbot-ia-pme-belgique#post",
    "headline": "Comment intégrer un chatbot IA dans une PME belge en 2026 — Guide expert",
    "description": "Guide expert complet sur l'intégration d'un chatbot IA dans une PME belge en 2026. LLMs, RAG, subventions belges, RGPD & EU AI Act.",
    "url": "https://codelli.tech/blog/integrer-chatbot-ia-pme-belgique",
    "datePublished": "2026-04-15",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/blog/#blog" },
    "inLanguage": "fr-BE"
  }
);

// ─── Article 2 — FastAPI ─────────────────────────────────────────
writeArticlePage(
  'fastapi-vs-nodejs-mvp-2026',
  toc2, body2, cta2, intro2,
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": "https://codelli.tech/blog/fastapi-vs-nodejs-mvp-2026#post",
    "headline": "FastAPI vs Node.js pour votre MVP en 2026 — Comparatif expert complet",
    "description": "Comparatif expert FastAPI vs Node.js pour choisir le bon backend pour votre MVP en 2026.",
    "url": "https://codelli.tech/blog/fastapi-vs-nodejs-mvp-2026",
    "datePublished": "2026-04-14",
    "dateModified": "2026-04-15",
    "author": { "@id": "https://codelli.tech/cem-tekelli#person" },
    "publisher": { "@id": "https://codelli.tech/#organization" },
    "isPartOf": { "@id": "https://codelli.tech/blog/#blog" },
    "inLanguage": "fr-BE"
  }
);

console.log('Done.');
