// CODELLI — Animation Engine
// GSAP 3.13 + ScrollTrigger + Lenis 1.3
// Chargé après vendor/gsap.bundle.min.js et vendor/lenis.min.js
// ═══════════════════════════════════════════════════════════════════

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

// ─── GSAP defaults ────────────────────────────────────────────────
if (typeof gsap !== 'undefined') {
  gsap.defaults({ ease: 'power2.out', duration: 0.6 });
  ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });
}

// ─── HERO ANIMATIONS ─────────────────────────────────────────────
function initHeroAnimation() {
  const loader = document.querySelector('.loader');
  if (loader) {
    // Skip loader animation on subsequent navigations within the same session
    const alreadyLoaded = sessionStorage.getItem('codelli_loaded');
    if (alreadyLoaded) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      document.body.classList.add('loaded');
    } else {
      gsap.to(loader, {
        opacity: 0, duration: 0.8, delay: 0.8, ease: 'power2.out',
        onComplete: () => {
          loader.style.visibility = 'hidden';
          document.body.classList.add('loaded');
          sessionStorage.setItem('codelli_loaded', '1');
        }
      });
    }
  }

  initHeroScrollEffects();
  try { initHeroInteractiveEffects(); } catch(e) {}
  try { initHeroParticles(); } catch(e) {}
}

function initHeroParticles() {
  if (prefersReducedMotion || isMobile) return;
  const container = document.getElementById('hero-particles');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    if (Math.random() > 0.7) p.classList.add('large');
    if (Math.random() > 0.8) p.classList.add('glow');
    const x = Math.random() * 100, y = Math.random() * 100;
    p.style.left = `${x}%`;
    p.style.top = `${y}%`;
    container.appendChild(p);
    gsap.to(p, {
      x: `${(Math.random() - 0.5) * (20 + Math.random() * 30)}vw`,
      y: `${(Math.random() - 0.5) * (15 + Math.random() * 25)}vh`,
      opacity: Math.random() * 0.3 + 0.1,
      duration: 15 + Math.random() * 20,
      ease: 'sine.inOut', repeat: -1, yoyo: true, delay: Math.random() * 5
    });
  }
}

function initHeroInteractiveEffects() {
  if (prefersReducedMotion || isMobile) return;
  const hero = document.querySelector('.hero');
  const titleLines = document.querySelectorAll('.title-line');
  const heroContent = document.querySelector('.hero-content');
  if (!hero || !titleLines.length) return;

  let mouseX = 0.5, mouseY = 0.5, targetX = 0.5, targetY = 0.5;
  const parallaxIntensity = [25, 15, 35];

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    targetX = (e.clientX - r.left) / r.width;
    targetY = (e.clientY - r.top) / r.height;
  });
  hero.addEventListener('mouseleave', () => { targetX = 0.5; targetY = 0.5; });

  function animateHero() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;
    const ox = mouseX - 0.5, oy = mouseY - 0.5;
    titleLines.forEach((line, i) => {
      const intensity = parallaxIntensity[i] || 20;
      gsap.set(line, { x: ox * intensity, y: oy * intensity * 0.5 });
    });
    if (heroContent) gsap.set(heroContent, { rotateX: -oy * 2, rotateY: ox * 2 });
    requestAnimationFrame(animateHero);
  }
  animateHero();
  gsap.set(hero, { perspective: 1000 });
  gsap.set(heroContent, { transformStyle: 'preserve-3d' });
}

function initHeroScrollEffects() {
  const heroTopBar = document.querySelector('.hero-top-bar');
  const heroBottomBar = document.querySelector('.hero-bottom-bar');
  const gradientBg = document.querySelector('.hero-gradient-bg');
  const titleLines = document.querySelectorAll('.title-line-inner');
  const heroContent = document.querySelector('.hero-content');

  if (!heroTopBar || !heroBottomBar) return;

  const alreadyLoaded = sessionStorage.getItem('codelli_loaded');

  const heroSubtitle = document.querySelector('.hero-subtitle');

  if (isMobile) {
    gsap.set(titleLines, { y: '0%', opacity: 1 });
    gsap.set(heroTopBar, { y: 0, opacity: 1 });
    gsap.set(heroBottomBar, { y: 0, opacity: 1 });
    if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 1 });
    if (!alreadyLoaded) {
      gsap.fromTo(titleLines, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
      if (heroSubtitle) gsap.fromTo(heroSubtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power2.out' });
    }
    return;
  }

  if (titleLines.length > 0) {
    if (alreadyLoaded) {
      gsap.set(titleLines, { y: '0%', opacity: 1 });
      if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 1 });
      gsap.to(titleLines, { scale: 1.01, duration: 2, stagger: 0.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
    } else {
      gsap.set(titleLines, { y: '100%', opacity: 0 });
      gsap.to(titleLines, { y: '0%', opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.5 });
      if (heroSubtitle) gsap.to(heroSubtitle, { y: 0, opacity: 1, duration: 0.8, delay: 1.3, ease: 'power2.out' });
      gsap.to(titleLines, { scale: 1.01, duration: 2, stagger: 0.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.5 });
    }
  }

  if (alreadyLoaded) {
    gsap.set(heroTopBar, { y: 0, opacity: 1 });
  } else {
    gsap.set(heroTopBar, { y: -20, opacity: 0 });
    gsap.to(heroTopBar, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 });
  }
  gsap.set(heroBottomBar, { y: 0, opacity: 1 });

  // Scroll triggers
  if (heroContent) {
    gsap.fromTo('.hero-content', { yPercent: 0, opacity: 1 }, {
      yPercent: -50, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });
  }
  gsap.fromTo('.hero-top-bar', { opacity: 1, y: 0 }, {
    opacity: 0, y: -30, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '5% top', end: '25% top', scrub: 0.5 }
  });
  gsap.fromTo('.hero-bottom-bar', { opacity: 1, y: 0 }, {
    opacity: 0, y: 20, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '10% top', end: '30% top', scrub: 0.5 }
  });
  if (gradientBg) {
    gsap.to('.hero-gradient-bg', {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 0.5 }
    });
  }
}

// ─── SERVICES ANIMATIONS ─────────────────────────────────────────
function initServicesAnimations() {
  if (isMobile) {
    gsap.set('.service-title, .service-tagline', { opacity: 1, x: 0 });
    return;
  }
  gsap.utils.toArray('.service-block').forEach((block, i) => {
    const title = block.querySelector('.service-title');
    const tagline = block.querySelector('.service-tagline');
    if (title) {
      gsap.fromTo(title, { x: -80, opacity: 0 }, { x: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: block, start: 'top 95%', end: 'top 65%', scrub: 0.8 } });
      gsap.to(title, { yPercent: -15 * (i + 1) * 0.3, ease: 'none', scrollTrigger: { trigger: block, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    }
    if (tagline) {
      gsap.fromTo(tagline, { x: -30, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: block, start: 'top 90%', end: 'top 60%', scrub: 0.6 } });
    }
  });
}

// ─── PORTFOLIO ANIMATIONS ────────────────────────────────────────
function initPortfolioAnimations() {
  if (prefersReducedMotion || isMobile) {
    gsap.set('.portfolio-title, .project-row', { opacity: 1, y: 0 });
    return;
  }
  if (!document.querySelector('.portfolio-section')) return;
  gsap.fromTo('.portfolio-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.portfolio-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
  gsap.utils.toArray('.project-row').forEach((card) => {
    gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 65%', scrub: 0.7 } });
  });
}

// ─── SECTION REVEALS ─────────────────────────────────────────────
function initSectionReveals() {
  if (prefersReducedMotion || isMobile) {
    gsap.set('.service-block,.tech-category,.process-step,.about-value-row,.testimonial-item,.service-title,.service-tagline,.service-desc,.service-price,.process-title,.tech-title,.contact-title,.about-title,.testimonials-title,.manifesto-text,.value-number,.value-title,.value-desc,.contact-email,.contact-meta,.contact-social,.contact-form,.contact-calendly-cta,.step-index,.step-name,.tech-category-name,.tech-item,.footer-brand,.footer-col,.subsidy-banner', { opacity: 1, y: 0, x: 0, scale: 1 });
    return;
  }

  // About
  if (document.querySelector('.about-section')) {
    gsap.fromTo('.about-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
    gsap.fromTo('.manifesto-text', { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-manifesto', start: 'top 85%', end: 'top 45%', scrub: 0.8 } });
    gsap.utils.toArray('.about-value-row').forEach((row) => {
      const num = row.querySelector('.value-number');
      const title = row.querySelector('.value-title');
      const desc = row.querySelector('.value-desc');
      if (num) gsap.fromTo(num, { x: -20, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 70%', scrub: 0.6 } });
      if (title) gsap.fromTo(title, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 68%', scrub: 0.6 } });
      if (desc) gsap.fromTo(desc, { x: -15, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 65%', scrub: 0.6 } });
    });
  }

  // Process
  if (document.querySelector('.process-section')) {
    gsap.fromTo('.process-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.process-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
    gsap.utils.toArray('.process-step').forEach((step) => {
      const idx = step.querySelector('.step-index');
      const name = step.querySelector('.step-name');
      const desc = step.querySelector('.step-desc');
      if (idx) gsap.fromTo(idx, { x: -20, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 92%', end: 'top 70%', scrub: 0.6 } });
      if (name) gsap.fromTo(name, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 90%', end: 'top 68%', scrub: 0.6 } });
      if (desc) gsap.fromTo(desc, { x: -15, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 88%', end: 'top 65%', scrub: 0.6 } });
    });
  }

  // Testimonials
  if (document.querySelector('.testimonials-section')) {
    gsap.fromTo('.testimonials-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
    gsap.utils.toArray('.testimonial-item').forEach((item) => {
      gsap.fromTo(item, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%', end: 'top 65%', scrub: 0.7 } });
    });
  }

  // Tech
  if (document.querySelector('.tech-section')) {
    gsap.fromTo('.tech-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.tech-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
    gsap.utils.toArray('.tech-category').forEach((cat) => {
      gsap.fromTo(cat, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: cat, start: 'top 92%', end: 'top 70%', scrub: 0.6 } });
      const catName = cat.querySelector('.tech-category-name');
      if (catName) gsap.fromTo(catName, { y: 15, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: cat, start: 'top 88%', end: 'top 68%', scrub: 0.5 } });
      cat.querySelectorAll('.tech-item').forEach((item, j) => {
        gsap.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: cat, start: `top ${86 - j * 3}%`, end: `top ${66 - j * 3}%`, scrub: 0.4 } });
      });
    });
  }

  // Contact
  if (document.querySelector('.contact-section')) {
    gsap.fromTo('.contact-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-section', start: 'top 80%', end: 'top 50%', scrub: 0.8 } });
    gsap.fromTo('.contact-email', { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: '.contact-content', start: 'top 85%', end: 'top 65%', scrub: 0.6 } });
    gsap.fromTo('.contact-meta, .contact-social', { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: '.contact-content', start: 'top 80%', end: 'top 60%', scrub: 0.6 } });
    gsap.fromTo('.contact-form', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: '.contact-content', start: 'top 82%', end: 'top 58%', scrub: 0.6 } });
  }
}

// ─── CONTACT FORM FIELD ANIMATIONS ───────────────────────────────
function initContactFormAnimations() {
  if (prefersReducedMotion || isMobile) {
    gsap.set('.form-field', { opacity: 1, y: 0 });
    return;
  }
  document.querySelectorAll('.form-field').forEach((field) => {
    gsap.fromTo(field, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: field, start: 'top 95%', end: 'top 80%', scrub: 0.5 } });
  });
}

// ─── CONTACT FORM SUBMISSION ──────────────────────────────────────
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Detect page language from <html lang> attribute
  const pageLang = (document.documentElement.lang || 'fr-BE').toLowerCase();
  const isNL = pageLang.startsWith('nl');
  const isEN = pageLang === 'en';

  const i18n = {
    formErrors: isEN ? 'Please fix the errors in the form.'
                : isNL ? 'Gelieve de fouten in het formulier te corrigeren.'
                : 'Veuillez corriger les erreurs dans le formulaire.',
    sending:    isEN ? 'Sending...'
                : isNL ? 'Bezig met verzenden...'
                : 'Envoi en cours...',
    success:    isEN ? 'Message sent! We\'ll get back to you within 24h.'
                : isNL ? 'Bericht verzonden! We antwoorden binnen 24u.'
                : 'Message envoyé avec succès ! Nous vous répondrons sous 24h.',
    error:      isEN ? 'Send error. Please try again.'
                : isNL ? 'Verzendfout. Probeer opnieuw.'
                : 'Erreur lors de l\'envoi. Veuillez réessayer.',
  };

  function showNotification(message, type = 'info') {
    const el = document.createElement('div');
    const bg = type === 'error' ? 'var(--color-error)' : type === 'success' ? 'var(--color-success)' : 'var(--color-accent)';
    const icon = type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ';
    el.style.cssText = `position:fixed;top:20px;right:20px;background:${bg};color:white;padding:1rem 1.5rem;border-radius:var(--radius-sm);font-size:.875rem;z-index:var(--z-overlay);animation:slideInRight 0.3s ease-out;box-shadow:var(--shadow-md);display:flex;align-items:center;gap:8px;max-width:350px;`;
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), type === 'success' ? 5000 : 3000);
  }

  function validateField(field) {
    const val = field.value.trim();
    const group = field.closest('.form-field');
    field.classList.remove('valid', 'error');
    group.classList.remove('valid', 'error');
    let ok = false;
    if (field.name === 'name') ok = val.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val);
    else if (field.name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    else if (field.name === 'company') ok = true;
    else if (field.name === 'message') ok = val.length >= 10;
    else ok = val !== '';
    if (val !== '') { field.classList.add(ok ? 'valid' : 'error'); group.classList.add(ok ? 'valid' : 'error'); }
    return ok;
  }

  const fields = contactForm.querySelectorAll('.field-input, .field-textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => { if (field.value.trim()) validateField(field); });
    field.addEventListener('focus', () => { if (field.classList.contains('error')) { field.classList.remove('valid','error'); field.closest('.form-field').classList.remove('valid','error'); } });
    if (field.name === 'email' || field.name === 'message') {
      field.addEventListener('input', () => { if (field.value.trim()) setTimeout(() => validateField(field), 500); });
    }
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm));
    const allValid = ['name', 'email', 'message'].every(n => {
      const f = contactForm.querySelector(`[name="${n}"]`);
      return f && validateField(f) && data[n]?.trim();
    });
    if (!allValid) { showNotification(i18n.formErrors, 'error'); return; }

    const btn = contactForm.querySelector('.form-submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = `<span style="display:inline-block;width:16px;height:16px;border:2px solid transparent;border-top:2px solid currentColor;border-radius:50%;animation:spin 1s linear infinite"></span> ${i18n.sending}`;
    btn.disabled = true; btn.style.opacity = '0.7';
    const spinStyle = document.createElement('style');
    spinStyle.textContent = '@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}';
    document.head.appendChild(spinStyle);

    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(contactForm)).toString() })
      .then(r => {
        if (!r.ok) throw new Error();
        showNotification(i18n.success, 'success');
        contactForm.reset();
        fields.forEach(f => { f.classList.remove('valid','error'); f.closest('.form-field').classList.remove('valid','error'); });
      })
      .catch(() => showNotification(i18n.error, 'error'))
      .finally(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.opacity = ''; setTimeout(() => spinStyle.remove(), 100); });
  });
}

// ─── FAB BUTTONS ─────────────────────────────────────────────────
function initFabButtons() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const contactFab = document.getElementById('contactFab');
  let fabsVisible = false;

  function toggle() {
    const should = window.pageYOffset > window.innerHeight * 0.6;
    if (should && !fabsVisible) {
      fabsVisible = true;
      setTimeout(() => scrollToTopBtn?.classList.add('visible'), 0);
      setTimeout(() => contactFab?.classList.add('visible'), 100);
    } else if (!should && fabsVisible) {
      fabsVisible = false;
      scrollToTopBtn?.classList.remove('visible');
      contactFab?.classList.remove('visible');
    }
  }

  let t;
  window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(toggle, 10); });
  toggle();

  scrollToTopBtn?.addEventListener('click', () => {
    if (window.lenis) window.lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  contactFab?.addEventListener('click', () => {
    const s = document.getElementById('contact');
    if (s) {
      if (window.lenis) window.lenis.scrollTo(s, { duration: 1.2 });
      else s.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ─── INIT ─────────────────────────────────────────────────────────
requestAnimationFrame(() => {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.hero-top-bar,.hero-bottom-bar,.title-line-inner').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    return;
  }
  initHeroAnimation();
  initServicesAnimations();
  initSectionReveals();
  initPortfolioAnimations();
  initContactFormAnimations();
  initContactForm();
  initFabButtons();
});

// Fallback visibility
setTimeout(() => {
  const b = document.querySelector('.hero-bottom-bar');
  if (b && parseFloat(window.getComputedStyle(b).opacity) < 0.1) {
    b.style.cssText = 'opacity:1!important;transform:translateY(0)!important;';
  }
}, 3000);

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  ScrollTrigger.clearScrollMemory();
});

let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) ScrollTrigger.refresh(); });
