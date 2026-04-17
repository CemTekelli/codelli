# SEO + AEO Tasks — Codelli

Audit réalisé le 2026-04-17. Objectif : top des recherches B2B "agence IA / développement / design" en Belgique, France, Luxembourg et Pays-Bas.

---

## PRIORITÉ 1 — Cette semaine

### 1.1 Meta title et description — repositionnement IA
- [x] Réécrire le `title` dans `src/i18n/fr.json`
  - De : `"Codelli - Agence Web & Application Mobile | Bruxelles, Belgique"`
  - À  : `"Codelli — Studio IA & Développement Web B2B | Bruxelles, Belgique"`
- [x] Réécrire la `description` FR pour mentionner IA + B2B + Benelux + délai + devis gratuit
- [x] Réécrire le `title` dans `src/i18n/en.json`
  - À  : `"Codelli — AI Studio & Web Development B2B | Brussels, Belgium"`
- [x] Réécrire le `title` dans `src/i18n/nl.json`
  - À  : `"Codelli — AI Studio & Digitaal Bureau | Brussel, België"` (déjà correct, descriptions améliorées)
- [x] Réécrire les `og:title`, `og:description`, `twitter:title`, `twitter:description` dans les 3 fichiers i18n en cohérence

---

### 1.2 Blocs "direct answer" sur chaque page de service
> Levier n°1 pour Google AI Overviews : format = qui + quoi + pour qui + où + délai + prix

- [x] Ajouter un paragraphe introductif factuel en tout premier sur la page d'accueil — `hero.subtitle` rendu dans Hero.astro, texte direct answer (IA + B2B + Benelux + 6 semaines)
- [x] Ajouter un bloc "direct answer" (`services.intro`) en tête de la section services — rendu dans Services.astro, prix + délai + zéro sous-traitance
- [x] Ajouter un bloc "direct answer" sur `/audit-ia`, `/en/audit-ia`, `/nl/audit-ia` — `audit.hero.intro` rendu après les meta items

Exemple de format :
```
Codelli intègre ChatGPT, Claude et des LLMs open-source dans vos processus métier.
Pour les PME B2B en Belgique, France et Luxembourg.
Livraison en 4-6 semaines. À partir de 5 000 €. Subventions Innoviris jusqu'à 75%.
```

---

### 1.3 FAQPage schema sur les pages de services
> Les pages avec FAQPage schema sont 3,2× plus citées dans les AI Overviews

- [x] Ajout de 3 questions B2B manquantes aux FAQPage des 3 homepages (FR/EN/NL) : ChatGPT/LLM integration, France/Luxembourg/NL coverage, ROI intégration IA
- [x] FAQPage schema créé sur `/audit-ia`, `/en/audit-ia`, `/nl/audit-ia` — 5 questions sur l'appel découverte, le process, les subventions et le budget minimum
- [ ] Quand les pages de service individuelles seront créées (voir P3.1), ajouter un `FAQPage` schema sur chacune (5 questions minimum)

---

### 1.4 S'inscrire sur Clutch.co et Sortlist.be
> ChatGPT et Perplexity agrègent leurs réponses "meilleure agence IA Belgique" depuis ces répertoires

- [ ] Créer profil **Clutch.co** — catégories : "AI Company" + "Web Developer" + localisation Belgique
- [ ] Créer profil **Sortlist.be** — services listés individuellement, description complète
- [ ] Créer profil **GoodFirms.co** — signal E-E-A-T secondaire
- [ ] Vérifier que le NAP (Name / Address / Phone) est identique sur les 3 profils ET dans le schema.org du site
- [ ] Contacter 3-5 clients pour demander une review sur Clutch et/ou Sortlist

---

### 1.5 Fix bug hreflang sitemap — articles blog NL
> Les URLs NL des articles blog n'apparaissent pas avec leurs alternates hreflang dans le sitemap

- [x] Ajout d'une fonction `serialize()` dans `astro.config.mjs` avec un `BLOG_HREFLANG_MAP` — injecte les `xhtml:link` hreflang (fr-BE / en / nl-BE) sur les 6 URLs d'articles blog
- [x] Vérifié dans `dist/sitemap-0.xml` : les 6 URLs ont maintenant leurs 3 alternates hreflang corrects
- [ ] **À faire à chaque nouvel article** : ajouter l'entrée correspondante dans `BLOG_HREFLANG_MAP` dans `astro.config.mjs`
- [ ] Soumettre `https://codelli.tech/sitemap-index.xml` dans Google Search Console après déploiement

---

## PRIORITÉ 2 — Ce mois-ci

### 2.1 BreadcrumbList schema sur tous les articles blog
> Seule la page /audit-ia a un BreadcrumbList. Les articles blog n'en ont pas.

- [x] BreadcrumbList JSON-LD ajouté directement dans `BlogArticleLayout.astro` — dynamique (lang, title, canonical) — s'applique automatiquement à tous les articles présents et futurs
- [ ] Tester via Google Rich Results Test après déploiement

---

### 2.2 Optimiser les images portfolio en WebP
> ex2.png fait 522 KB — critique pour LCP mobile

- [x] Images déplacées vers `src/assets/`, composant `<Image>` d'Astro dans Portfolio.astro, sharp installé
- [x] Résultats build : ex1 264KB→**30KB** WebP · ex2 510KB→**22KB** WebP · ex3 117KB→**26KB** WebP — réduction **-94%**
- [ ] Mesurer LCP via PageSpeed Insights mobile après déploiement

---

### 2.3 Google Business Profile — compléter toutes les sections
> Alimente directement les AI Local answers de Gemini et Google AI Overviews

- [ ] Vérifier que le profil GBP existe et est vérifié pour Codelli
- [ ] Catégorie principale : **"Agence de marketing numérique"**
- [ ] Ajouter catégories secondaires : "Concepteur de site web", "Consultant en informatique"
- [ ] Lister chaque service individuellement dans GBP (les services alimentent les réponses AI Local) :
  - Intégration IA & Automatisation
  - Développement Web & SaaS
  - Développement Mobile
  - UX/UI Design
  - Audit IA Gratuit
- [ ] Ajouter le lien Calendly dans le champ "Prise de rendez-vous en ligne"
- [ ] Rédiger 5-10 Q&R dans la section Questions (contrôler le narrative avant que les clients posent les leurs)
- [ ] Contacter 5 clients pour demander un avis Google (objectif : minimum 5 reviews pour AggregateRating)
- [ ] Répondre à tous les avis existants (le texte des réponses est indexé et cité par les AI)
- [ ] Ajouter photos : équipe, bureau, captures d'écran projets

---

### 2.4 Soumettre le sitemap à Bing Webmaster Tools
> Le marché NL utilise Bing/Copilot — trafic B2B corporate réel aux Pays-Bas

- [ ] Aller sur `bing.com/webmasters`
- [ ] Ajouter le site `https://codelli.tech`
- [ ] Soumettre `https://codelli.tech/sitemap-index.xml`
- [ ] Vérifier l'indexation des pages FR + NL après 48h

---

### 2.5 AggregateRating sur les schemas Service individuels
> Fichier : `src/pages/index.astro` — les 4 schemas Service n'ont pas de rating

- [x] `aggregateRating` ajouté sur les 4 schemas Service dans `src/pages/index.astro` (FR)
- [x] `areaServed` corrigé sur les 4 services — Pays-Bas ajouté (était absent)
- [ ] Mettre à jour `reviewCount` dans les 4 services dès que de nouveaux avis Clutch/Google arrivent

---

### 2.6 Preload du LCP hero
> Améliore le score LCP sur mobile

- [x] `rel="preconnect"` ajouté pour `https://api.fontshare.com` dans `BaseLayout.astro` — réduit le DNS/TCP time pour la font Satoshi (H1)
- [ ] Mesurer LCP via PageSpeed Insights mobile après déploiement

---

## PRIORITÉ 3 — Mois 2-3

### 3.1 Architecture topique — créer 10+ articles par pilier de service

> Avec 2 articles, Google ne reconnaît pas Codelli comme autorité thématique

**Cluster Intégration IA** (créer d'abord la page pilier `/services/integration-ia`)
- [ ] Page pilier : `/services/integration-ia` — guide complet 2 000+ mots avec tous les sous-sujets
- [ ] Article : `/blog/cout-integration-chatgpt-pme-belgique` ← haute intention B2B
- [ ] Article : `/blog/subventions-ia-pme-belgique-2026` ← fort potentiel Perplexity
- [ ] Article : `/blog/rag-vs-fine-tuning-entreprise-guide`
- [ ] Article : `/blog/n8n-automatisation-workflows-ia-tutorial`
- [ ] Article : `/blog/roi-ia-generative-b2b-2026`
- [ ] Article : `/blog/integrer-ia-crm-erp-pme`
- [ ] Chaque article : lien bidirectionnel vers la page pilier (pilier→article ET article→pilier)

**Cluster Développement Web B2B** (déjà commencé)
- [ ] Articles FastAPI et chatbot existants ✅
- [ ] Article : `/blog/astro-nextjs-site-vitrine-b2b-comparatif`
- [ ] Article : `/blog/headless-cms-agence-bruxelles`
- [ ] Article : `/blog/saas-development-cost-belgium-2026`

**Cluster Géographique** (cibler Pays-Bas + Luxembourg + marché anglophone)
- [ ] Page : `/en/ai-agency-belgium` — pour les recherches EN des multinationales et expats
- [ ] Page : `/nl/ai-bureau-belgie` — marché flamand + Pays-Bas
- [ ] Page : `/fr/agence-ia-luxembourg` — marché luxembourgeois

---

### 3.2 Ajouter des données originales dans chaque article
> Les pages avec 3+ points de données uniques sont 4× plus citées dans les AI Overviews

- [ ] Pour chaque nouvel article, inclure au moins 3 données chiffrées issues de tes propres projets :
  - "Sur X projets livrés, le ROI moyen client était de Y% à 6 mois"
  - "Délai moyen de livraison Codelli : 5,2 semaines (vs 12-16 semaines marché)"
  - Benchmarks techniques issus de tes builds réels
- [ ] Ajouter un tableau comparatif par article (format favori de Perplexity pour les citations)
- [ ] Dater clairement chaque donnée ("données Q1 2026") pour signaler la fraîcheur

---

### 3.3 E-E-A-T — construire la crédibilité externe de Cem Tekelli
> Google poids fortement l'autorité de l'auteur pour les requêtes B2B

- [ ] Publier un guest post sur **Digimedia.be** (média digital belge)
- [ ] Publier un guest post sur **e-marketing.fr** (média digital francophone)
- [ ] Publier un guest post sur **Emerce.nl** (média digital NL) — version EN ou NL
- [ ] Publier des articles LinkedIn Pulse régulièrement (minimum 1/mois) — alimentent les citations AI
- [ ] Vérifier que la page `/cem-tekelli` a son propre schema `Person` complet avec `sameAs` LinkedIn
- [ ] Ajouter les certifications visibles sur le site : Google Partner, certifications cloud, etc.
- [ ] Objectif : Cem doit être mentionné dans 3+ sources externes pour que son schema Person soit validé par Google

---

### 3.4 Contenu localisé — pas juste traduit, culturellement adapté
> fr-BE ≠ fr-FR, nl-BE ≠ nl-NL

- [ ] Versions fr-BE : références au droit belge (BCE, TVA belge, RGPD implémentation belge), vocabulaire belge
- [ ] Versions nl-BE : vocabulaire flamand (différences avec nl-NL), références locales Bruxelles/Gand/Anvers
- [ ] Versions fr-FR : adapter les références réglementaires (SIRET vs BCE, DGE, BPI France pour subventions)
- [ ] Versions fr-LU : références au marché luxembourgeois (grande entreprise, secteur financier)
- [ ] Prix en contexte local : "à partir de 5 000 €, subventions belges disponibles" sur fr-BE, différent sur fr-FR

---

### 3.5 ImageObject schema dans les articles blog
> Les articles blog utilisent tous `og-image.jpg` par défaut — aucune image spécifique par article

- [ ] Créer une image featured dédiée pour chaque article (1200×630 px, WebP)
- [ ] Ajouter dans le frontmatter de chaque article : `ogImage: /blog/images/[article-slug].webp`
- [ ] Mettre à jour le schema `BlogPosting` pour référencer l'image avec width/height :
  ```json
  "image": {
    "@type": "ImageObject",
    "url": "https://codelli.tech/blog/images/[slug].webp",
    "width": 1200,
    "height": 630
  }
  ```

---

## Suivi technique continu

### Mensuel
- [ ] Lancer PageSpeed Insights sur homepage + page service IA → cibler 90+ mobile
- [ ] Vérifier Google Search Console : couverture index, erreurs de crawl, soft 404
- [ ] Vérifier Bing Webmaster Tools : même chose
- [ ] Mettre à jour `lastmod` dans le sitemap pour les pages modifiées
- [ ] Mettre à jour la section "Blog Articles" dans `llms.txt` et `llms-full.txt` à chaque nouvel article publié

### À chaque nouvel article publié
- [ ] Vérifier la structure H1/H2/H3 (une seule H1, H2 pour sections principales)
- [ ] Inclure un bloc "direct answer" dans les 60 premiers mots
- [ ] Ajouter un schema `FAQPage` avec 3-5 questions en bas d'article
- [ ] Ajouter le schema `BreadcrumbList` (Accueil > Blog > Titre)
- [ ] Ajouter le schema `BlogPosting` avec `datePublished`, `dateModified`, `author`, `image`
- [ ] Lien bidirectionnel vers la page pilier du cluster correspondant
- [ ] Ajouter l'article dans `llms.txt` et `llms-full.txt`
- [ ] Soumettre l'URL dans Google Search Console (Inspection d'URL > Demander l'indexation)

---

## Récapitulatif par impact

| # | Tâche | Impact | Effort | Priorité |
|---|---|---|---|---|
| 1.1 | Réécrire meta title (positionnement IA) | ⭐⭐⭐⭐⭐ | 30 min | P1 |
| 1.2 | Blocs direct answer sur pages services | ⭐⭐⭐⭐⭐ | 2h | P1 |
| 1.3 | FAQPage schema sur pages services | ⭐⭐⭐⭐⭐ | 2h | P1 |
| 1.4 | Inscription Clutch + Sortlist | ⭐⭐⭐⭐⭐ | 2h | P1 |
| 1.5 | Fix bug hreflang sitemap NL | ⭐⭐⭐ | 30 min | P1 |
| 2.1 | BreadcrumbList blog | ⭐⭐⭐ | 1h | P2 |
| 2.2 | Images portfolio WebP | ⭐⭐⭐⭐ | 1h | P2 |
| 2.3 | Google Business Profile complet | ⭐⭐⭐⭐⭐ | 2h | P2 |
| 2.4 | Bing Webmaster Tools | ⭐⭐⭐ | 15 min | P2 |
| 2.5 | AggregateRating sur Service schemas | ⭐⭐ | 30 min | P2 |
| 2.6 | Preload LCP hero | ⭐⭐⭐ | 30 min | P2 |
| 3.1 | 10+ articles par pilier thématique | ⭐⭐⭐⭐⭐ | Long terme | P3 |
| 3.2 | Données originales dans articles | ⭐⭐⭐⭐ | Par article | P3 |
| 3.3 | Guest posts Benelux (E-E-A-T) | ⭐⭐⭐⭐ | 1 mois | P3 |
| 3.4 | Localisation culturelle fr-BE/nl-BE | ⭐⭐⭐ | Par page | P3 |
| 3.5 | ImageObject schema blog | ⭐⭐ | 1h | P3 |
