// CODELLI - Awwwards-Level Animation Engine
// GSAP 3.13 + ScrollTrigger + Lenis 1.3 Integration
// ═══════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────
// GSAP & ScrollTrigger Setup (GSAP 3.13+)
// ─────────────────────────────────────────────────────────────────
// Note: Plugins are pre-registered in vendor/gsap.bundle.min.js

// Configure GSAP defaults for better performance
gsap.defaults({
    ease: "power2.out",
    duration: 0.6
});

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
    toggleActions: "play none none reverse"
});

// Custom easing curves for premium feel
CustomEase.create("smoothOut", "0.16, 1, 0.3, 1");
CustomEase.create("smoothInOut", "0.65, 0, 0.35, 1");

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if mobile device
const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

// ─────────────────────────────────────────────────────────────────
// LENIS - Smooth Scroll Engine
// ─────────────────────────────────────────────────────────────────
let lenis;

// Only enable Lenis on desktop (can cause issues on mobile)
if (!prefersReducedMotion && !isMobile) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false,
        autoRaf: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis with GSAP ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
}

// ─────────────────────────────────────────────────────────────────
// CUSTOM CURSOR - Premium with GSAP
// ─────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

if (cursor && window.matchMedia("(hover: hover)").matches && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // GSAP-powered smooth cursor animation - slower follow for elegance
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        gsap.set(cursor, {
            x: cursorX - 6,
            y: cursorY - 6
        });
    });

    // Standard interactive elements
    const interactiveElements = document.querySelectorAll('a:not(.nav-item), button, .process-step, .tech-item, input, textarea, select');
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursor.classList.remove('hovering-title');
            cursor.classList.remove('hovering-nav');
        });
        elem.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });

    // Special hover for giant service titles
    const serviceTitles = document.querySelectorAll('.service-title');
    serviceTitles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering-title');
            cursor.classList.remove('hovering');
            cursor.classList.remove('hovering-nav');
        });
        title.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering-title');
        });
    });

    // Special hover for nav items (larger cursor)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering-nav');
            cursor.classList.remove('hovering');
            cursor.classList.remove('hovering-title');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering-nav');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
    });
} else if (cursor) {
    cursor.style.display = 'none';
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION - MONOPO WebGL IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────

function initHeroAnimation() {
    initWebGLHero();
}

/* 
   MONOPO WEBGL LOGIC 
*/

function initWebGLHero() {
    // 1. LOADER - Fade out with GSAP for smoother animation
    const loader = document.querySelector('.loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            delay: 0.8,
            ease: "power2.out",
            onComplete: () => {
                loader.style.visibility = 'hidden';
                document.body.classList.add('loaded');
            }
        });
    }

    // 2. Scroll Effects
    initHeroScrollEffects();

    // 3. Hero Interactive Effects (magnetic + parallax)
    try {
        initHeroInteractiveEffects();
    } catch (e) { /* Effects not critical */ }

    // 4. Ambient Particles
    try {
        initHeroParticles();
    } catch (e) { /* Particles not critical */ }
}

// ─────────────────────────────────────────────────────────────────
// HERO AMBIENT PARTICLES - Floating light dots
// ─────────────────────────────────────────────────────────────────
function initHeroParticles() {
    if (prefersReducedMotion || isMobile) return;

    const container = document.getElementById('hero-particles');
    if (!container) return;

    const particleCount = 15; // Subtle, not overwhelming

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';

        // Random variations
        if (Math.random() > 0.7) particle.classList.add('large');
        if (Math.random() > 0.8) particle.classList.add('glow');

        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;

        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;

        container.appendChild(particle);

        // Animate with GSAP - slow, dreamy floating
        animateParticle(particle, startX, startY);
    }
}

function animateParticle(particle, startX, startY) {
    // Random movement parameters
    const duration = 15 + Math.random() * 20; // 15-35s
    const xRange = 20 + Math.random() * 30; // Movement range
    const yRange = 15 + Math.random() * 25;

    gsap.to(particle, {
        x: `${(Math.random() - 0.5) * xRange}vw`,
        y: `${(Math.random() - 0.5) * yRange}vh`,
        opacity: Math.random() * 0.3 + 0.1,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 5
    });
}

// ─────────────────────────────────────────────────────────────────
// HERO INTERACTIVE EFFECTS - Magnetic & Parallax
// ─────────────────────────────────────────────────────────────────
function initHeroInteractiveEffects() {
    if (prefersReducedMotion || isMobile) return;

    const hero = document.querySelector('.hero');
    const titleLines = document.querySelectorAll('.title-line');
    const heroContent = document.querySelector('.hero-content');

    if (!hero || !titleLines.length) return;

    // Mouse position tracking
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    // Track mouse within hero
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width;
        targetY = (e.clientY - rect.top) / rect.height;
    });

    hero.addEventListener('mouseleave', () => {
        targetX = 0.5;
        targetY = 0.5;
    });

    // Parallax intensity per line (different speeds create depth)
    const parallaxIntensity = [25, 15, 35]; // px movement for each line

    // Animation loop for smooth effects
    function animateHeroEffects() {
        // Smooth interpolation
        mouseX += (targetX - mouseX) * 0.08;
        mouseY += (targetY - mouseY) * 0.08;

        // Calculate offset from center (-0.5 to 0.5)
        const offsetX = mouseX - 0.5;
        const offsetY = mouseY - 0.5;

        // Apply parallax to each title line with different intensity
        titleLines.forEach((line, index) => {
            const intensity = parallaxIntensity[index] || 20;
            const moveX = offsetX * intensity;
            const moveY = offsetY * intensity * 0.5; // Less vertical movement

            gsap.set(line, {
                x: moveX,
                y: moveY,
            });
        });

        // Subtle rotation on hero content based on mouse
        if (heroContent) {
            gsap.set(heroContent, {
                rotateX: -offsetY * 2,
                rotateY: offsetX * 2,
            });
        }

        requestAnimationFrame(animateHeroEffects);
    }

    // Start animation loop
    animateHeroEffects();

    // Add perspective to hero for 3D effect
    gsap.set(hero, { perspective: 1000 });
    gsap.set(heroContent, { transformStyle: 'preserve-3d' });
}

// Note: Custom cursor is now handled by the GSAP-based implementation at the top of this file

// ─────────────────────────────────────────────────────────────────
// NAVBAR / MENU - Premium Navigation
// ─────────────────────────────────────────────────────────────────
function initNavigation() {
    const navTrigger = document.getElementById('nav-trigger');
    const navOverlay = document.getElementById('nav-overlay');
    const menuClose = document.getElementById('menu-close');
    const navLogo = document.getElementById('nav-logo');
    const navItems = document.querySelectorAll('.nav-item');

    // Open Menu with staggered animations
    if (navTrigger && navOverlay) {
        navTrigger.addEventListener('click', () => {
            navOverlay.classList.add('active');
            document.body.classList.add('menu-open');

            // Animate nav items with premium stagger
            gsap.fromTo('.nav-item',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "power3.out"
                }
            );

            // Animate close button
            gsap.fromTo('#menu-close',
                { opacity: 0, rotate: -90, scale: 0.8 },
                { opacity: 1, rotate: 0, scale: 1, duration: 0.6, delay: 0.1, ease: "power3.out" }
            );

            // Animate footer elements
            gsap.fromTo('.nav-email',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.55, ease: "power2.out" }
            );
            gsap.fromTo('.nav-social a',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.65, ease: "power2.out" }
            );
        });
    }

    // Close Menu with animation
    function closeMenu() {
        if (!navOverlay) return;
        gsap.to('.nav-item', {
            y: -20,
            opacity: 0,
            duration: 0.25,
            stagger: 0.04,
            ease: "power2.in",
            onComplete: () => {
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    if (menuClose) menuClose.addEventListener('click', closeMenu);

    // Close on Link Click
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            closeMenu();

            setTimeout(() => {
                const target = document.querySelector(targetId);
                if (target) {
                    if (window.lenis) {
                        window.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 400);
        });
    });

    // Home Click (Logo)
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            if (window.lenis) window.lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay?.classList.contains('active')) {
            closeMenu();
        }
    });
}

function initHeroScrollEffects() {
    const heroTopBar = document.querySelector('.hero-top-bar');
    const heroBottomBar = document.querySelector('.hero-bottom-bar');
    const gradientBg = document.querySelector('.hero-gradient-bg');
    const titleLines = document.querySelectorAll('.title-line-inner');
    const heroContent = document.querySelector('.hero-content');

    if (!heroTopBar || !heroBottomBar) return;

    // On mobile, simplified animations
    if (isMobile) {
        // Just fade in title lines
        gsap.set(titleLines, { y: '0%', opacity: 1 });
        gsap.set(heroTopBar, { y: 0, opacity: 1 });
        gsap.set(heroBottomBar, { y: 0, opacity: 1 });
        
        // Simple fade in animation
        gsap.fromTo(titleLines, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power2.out" }
        );
        
        return;
    }

    // ════════════════════════════════════════════════════════════
    // ENTRANCE ANIMATIONS - Simple and reliable
    // ════════════════════════════════════════════════════════════

    // Title lines - hidden initially via CSS, then reveal
    if (titleLines.length > 0) {
        gsap.set(titleLines, { y: '100%', opacity: 0 });
        gsap.to(titleLines, {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.5
        });
    }

    // Top bar - simple fade in from top
    gsap.set(heroTopBar, { y: -20, opacity: 0 });
    gsap.to(heroTopBar, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.8
    });

    // Bottom bar - ensure visibility immediately
    // Rely on CSS for initial state, but force it just in case GSAP hid it previously
    gsap.set(heroBottomBar, { y: 0, opacity: 1 });

    // Call setup triggers directly since we don't wait for animation anymore
    setupHeroScrollTriggers(heroContent, heroTopBar, heroBottomBar, gradientBg);

    // Add subtle "breath" animation to title
    if (titleLines.length > 0) {
        gsap.to(titleLines, {
            scale: 1.01,
            duration: 2,
            stagger: 0.1,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 2.5
        });
    }
}

// ════════════════════════════════════════════════════════════
// SCROLL TRIGGERS - Set up AFTER entrance animations complete
// ════════════════════════════════════════════════════════════
function setupHeroScrollTriggers(heroContent, heroTopBar, heroBottomBar, gradientBg) {
    // Title parallax - moves up faster than scroll (fromTo for bidirectional scroll)
    if (heroContent) {
        gsap.fromTo(".hero-content", 
            { yPercent: 0, opacity: 1 },
            {
                yPercent: -50,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5
                }
            }
        );
    }

    // Top bar - fades out quickly (fromTo for bidirectional scroll)
    if (heroTopBar) {
        gsap.fromTo(".hero-top-bar", 
            { opacity: 1, y: 0 },
            {
                opacity: 0,
                y: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "5% top",
                    end: "25% top",
                    scrub: 0.5
                }
            }
        );
    }

    // Bottom bar - fades out as we scroll (fromTo for bidirectional scroll)
    if (heroBottomBar) {
        gsap.fromTo(".hero-bottom-bar", 
            { opacity: 1, y: 0 },
            {
                opacity: 0,
                y: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "10% top",
                    end: "30% top",
                    scrub: 0.5
                }
            }
        );
    }

    // Gradient background - fades out on scroll
    if (gradientBg) {
        gsap.to(".hero-gradient-bg", {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "60% top",
                scrub: 0.5
            }
        });
    }
}

// ════════════════════════════════════════════════════════════
// SERVICES SECTION - Giant Typography with Parallax
// ════════════════════════════════════════════════════════════
function initServicesAnimations() {
    // On mobile, show everything immediately
    if (isMobile) {
        gsap.set('.service-title, .service-tagline', { opacity: 1, x: 0 });
        return;
    }

    // Service blocks - Giant titles with parallax
    gsap.utils.toArray('.service-block').forEach((block, i) => {
        const serviceTitle = block.querySelector('.service-title');
        const serviceTagline = block.querySelector('.service-tagline');

        if (serviceTitle) {
            // Initial reveal for title
            gsap.fromTo(serviceTitle,
                { x: -80, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 95%",
                        end: "top 65%",
                        scrub: 0.8
                    }
                }
            );

            // Parallax effect - titles move at different speeds
            gsap.to(serviceTitle, {
                yPercent: -15 * (i + 1) * 0.3,
                ease: "none",
                scrollTrigger: {
                    trigger: block,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5
                }
            });
        }

        // Tagline reveal (slightly delayed)
        if (serviceTagline) {
            gsap.fromTo(serviceTagline,
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: 0.6
                    }
                }
            );
        }
    });
}



// Hero animation initialized in main init block below

// Smooth Scroll with Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            if (lenis) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ─────────────────────────────────────────────────────────────────
// SECTION REVEALS - Unified & Cohesive Animations
// ─────────────────────────────────────────────────────────────────

function initSectionReveals() {
    // On mobile or reduced motion, show everything immediately
    if (prefersReducedMotion || isMobile) {
        gsap.set('.service-block, .tech-category, .process-step, .about-value-row, .testimonial-item, .portfolio-card, .service-title, .service-tagline, .service-desc, .service-price, .process-title, .tech-title, .contact-title, .about-title, .testimonials-title, .manifesto-text, .value-number, .value-title, .value-desc, .contact-email, .contact-meta, .contact-social, .contact-form, .contact-calendly-cta, .step-number, .step-name, .tech-category-name, .tech-item, .footer-brand, .footer-col, .subsidy-banner', {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
        });
        return;
    }

    // ══════════════════════════════════════════════════════════════
    // ABOUT - Manifesto Style Reveal
    // ══════════════════════════════════════════════════════════════
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        // Title reveal
        gsap.fromTo(".about-title",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".about-section",
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.8
                }
            }
        );

        // Manifesto text reveal - dramatic entrance
        gsap.fromTo(".manifesto-text",
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".about-manifesto",
                    start: "top 85%",
                    end: "top 45%",
                    scrub: 0.8
                }
            }
        );

        // Value rows - staggered scrub reveal matching process steps
        gsap.utils.toArray('.about-value-row').forEach((row, i) => {
            const num = row.querySelector('.value-number');
            const title = row.querySelector('.value-title');
            const desc = row.querySelector('.value-desc');

            if (num) {
                gsap.fromTo(num,
                    { x: -20, opacity: 0 },
                    {
                        x: 0, opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 92%",
                            end: "top 70%",
                            scrub: 0.6
                        }
                    }
                );
            }
            if (title) {
                gsap.fromTo(title,
                    { y: 20, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 90%",
                            end: "top 68%",
                            scrub: 0.6
                        }
                    }
                );
            }
            if (desc) {
                gsap.fromTo(desc,
                    { x: -15, opacity: 0 },
                    {
                        x: 0, opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 88%",
                            end: "top 65%",
                            scrub: 0.6
                        }
                    }
                );
            }
        });
    }

    // ══════════════════════════════════════════════════════════════
    // PROCESS - Awwwards Level Reveal
    // ══════════════════════════════════════════════════════════════
    const processSection = document.querySelector('.process-section');
    if (processSection) {
        // Title reveal
        gsap.fromTo(".process-title",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".process-section",
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.8
                }
            }
        );

        // Steps with premium staggered animations
        gsap.utils.toArray('.process-step').forEach((step, i) => {
            // Step number - slides in from left
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                gsap.fromTo(stepNumber,
                    { x: -20, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 92%",
                            end: "top 70%",
                            scrub: 0.6
                        }
                    }
                );
            }

            // Step name - fades in
            const stepName = step.querySelector('.step-name');
            if (stepName) {
                gsap.fromTo(stepName,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 90%",
                            end: "top 68%",
                            scrub: 0.6
                        }
                    }
                );
            }

            // Step description - slides in from left (on the right column)
            const stepDesc = step.querySelector('.step-desc');
            if (stepDesc) {
                gsap.fromTo(stepDesc,
                    { x: -15, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 88%",
                            end: "top 65%",
                            scrub: 0.6
                        }
                    }
                );
            }
        });
    }

    // ══════════════════════════════════════════════════════════════
    // TESTIMONIALS - Editorial Stack Reveal
    // ══════════════════════════════════════════════════════════════
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        // Title reveal
        gsap.fromTo(".testimonials-title",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".testimonials-section",
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.8
                }
            }
        );

        // Each testimonial item — scrub reveal matching service-block style
        gsap.utils.toArray('.testimonial-item').forEach((item, i) => {
            gsap.fromTo(item,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        end: "top 65%",
                        scrub: 0.7
                    }
                }
            );
        });
    }

    // ══════════════════════════════════════════════════════════════
    // TECHNOLOGIES - Grid Card Reveal
    // ══════════════════════════════════════════════════════════════
    const techSection = document.querySelector('.tech-section');
    if (techSection) {
        // Title reveal
        gsap.fromTo(".tech-title",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".tech-section",
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.8
                }
            }
        );

        // Tech categories with staggered reveal
        gsap.utils.toArray('.tech-category').forEach((cat, i) => {
            // Category container fade in
            gsap.fromTo(cat,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cat,
                        start: "top 92%",
                        end: "top 70%",
                        scrub: 0.6
                    }
                }
            );

            // Category name
            const catName = cat.querySelector('.tech-category-name');
            if (catName) {
                gsap.fromTo(catName,
                    { y: 15, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: cat,
                            start: "top 88%",
                            end: "top 68%",
                            scrub: 0.5
                        }
                    }
                );
            }

            // Tech items with stagger
            const items = cat.querySelectorAll('.tech-item');
            items.forEach((item, j) => {
                gsap.fromTo(item,
                    { scale: 0.9, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: cat,
                            start: `top ${86 - (j * 3)}%`,
                            end: `top ${66 - (j * 3)}%`,
                            scrub: 0.4
                        }
                    }
                );
            });
        });
    }

    // ══════════════════════════════════════════════════════════════
    // CONTACT - Premium Scroll Reveal
    // ══════════════════════════════════════════════════════════════
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        // Title reveal
        gsap.fromTo('.contact-title',
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".contact-section",
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.8
                }
            }
        );

        // Email reveal
        gsap.fromTo(".contact-email",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".contact-content",
                    start: "top 85%",
                    end: "top 65%",
                    scrub: 0.6
                }
            }
        );

        // Meta and social
        gsap.fromTo(".contact-meta, .contact-social",
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".contact-content",
                    start: "top 80%",
                    end: "top 60%",
                    scrub: 0.6
                }
            }
        );

        // Form reveal
        gsap.fromTo(".contact-form",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".contact-content",
                    start: "top 82%",
                    end: "top 58%",
                    scrub: 0.6
                }
            }
        );
    }

}

// ─────────────────────────────────────────────────────────────────
// PORTFOLIO SECTION - Staggered Card Reveal
// ─────────────────────────────────────────────────────────────────
function initPortfolioAnimations() {
    if (prefersReducedMotion || isMobile) {
        gsap.set('.portfolio-title, .portfolio-card', { opacity: 1, y: 0 });
        return;
    }

    const portfolioSection = document.querySelector('.portfolio-section');
    if (!portfolioSection) return;

    // Title reveal
    gsap.fromTo(".portfolio-title",
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".portfolio-section",
                start: "top 80%",
                end: "top 50%",
                scrub: 0.8
            }
        }
    );

    // Cards — staggered scrub reveal
    gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                    end: "top 65%",
                    scrub: 0.7
                }
            }
        );
    });

    // CTA button
    gsap.fromTo(".portfolio-cta-btn",
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".portfolio-cta",
                start: "top 95%",
                end: "top 80%",
                scrub: 0.5
            }
        }
    );
}


// ─────────────────────────────────────────────────────────────────
// CONTACT FORM - Minimal Interactions
// ─────────────────────────────────────────────────────────────────
function initContactFormAnimations() {
    if (prefersReducedMotion || isMobile) {
        gsap.set('.form-field', { opacity: 1, y: 0 });
        return;
    }

    // Form fields stagger animation
    const formFields = document.querySelectorAll('.form-field');
    if (formFields.length > 0) {
        gsap.utils.toArray(formFields).forEach((field) => {
            gsap.fromTo(field,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: field,
                        start: "top 95%",
                        end: "top 80%",
                        scrub: 0.5
                    }
                }
            );
        });
    }
}

// Contact form animations initialized in main init block below

// ─────────────────────────────────────────────────────────────────
// FOOTER SCROLL ANIMATION
// ─────────────────────────────────────────────────────────────────
function initFooterAnimations() {
    if (prefersReducedMotion || isMobile) {
        gsap.set('.footer-brand, .footer-col', { opacity: 1, y: 0 });
        return;
    }

    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(".footer-brand",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".footer",
                    start: "top 95%",
                    end: "top 75%",
                    scrub: 0.5
                }
            }
        );

        gsap.utils.toArray('.footer-col').forEach((col) => {
            gsap.fromTo(col,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: col,
                        start: "top 98%",
                        end: "top 85%",
                        scrub: 0.5
                    }
                }
            );
        });
    }
}

// Footer animations initialized in main init block below

// Floating Action Buttons Scroll Control
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactFab = document.getElementById('contactFab');
let fabsVisible = false;

function toggleFabVisibility() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Show FABs after scrolling down 60% of viewport height with smoother transition
    const shouldShow = scrollPosition > windowHeight * 0.6;

    if (shouldShow && !fabsVisible) {
        fabsVisible = true;
        // Staggered appearance
        setTimeout(() => scrollToTopBtn?.classList.add('visible'), 0);
        setTimeout(() => contactFab?.classList.add('visible'), 100);
    } else if (!shouldShow && fabsVisible) {
        fabsVisible = false;
        // Simultaneous disappearance
        scrollToTopBtn?.classList.remove('visible');
        contactFab?.classList.remove('visible');
    }
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(toggleFabVisibility, 10);
});

// Initial check
toggleFabVisibility();

// FAB Click Handlers - Using Lenis for smooth scroll
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

if (contactFab) {
    contactFab.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            if (window.lenis) {
                window.lenis.scrollTo(contactSection, { duration: 1.2 });
            } else {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Notification utility function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'var(--color-error)' : type === 'success' ? 'var(--color-success)' : 'var(--color-accent)';
    const icon = type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        z-index: var(--z-overlay);
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 350px;
    `;

    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, type === 'success' ? 5000 : 3000);
}

// Enhanced Form Validation Functions
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const fieldGroup = field.closest('.form-field');

    // Remove previous validation states
    field.classList.remove('valid', 'error');
    fieldGroup.classList.remove('valid', 'error');

    let isValid = false;

    // Validation rules
    switch (fieldName) {
        case 'name':
            isValid = fieldValue.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(fieldValue);
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(fieldValue);
            break;
        case 'company':
            isValid = true; // Optional field
            break;
        case 'message':
            isValid = fieldValue.length >= 10;
            break;
        default:
            isValid = fieldValue !== '';
    }

    // Apply validation state
    if (fieldValue !== '') {
        if (isValid) {
            field.classList.add('valid');
            fieldGroup.classList.add('valid');
        } else {
            field.classList.add('error');
            fieldGroup.classList.add('error');
        }
    }

    return isValid;
}

function clearValidationState(field) {
    const fieldGroup = field.closest('.form-field');
    field.classList.remove('valid', 'error');
    fieldGroup.classList.remove('valid', 'error');
}

// Contact Form Handling - Enhanced with Real-time Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Handle select value styling
    // Add real-time validation to all form fields
    const formFields = contactForm.querySelectorAll('.field-input, .field-textarea');

    formFields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => {
            if (field.value.trim() !== '') {
                validateField(field);
            }
        });

        // Clear validation on focus
        field.addEventListener('focus', () => {
            if (field.classList.contains('error')) {
                clearValidationState(field);
            }
        });

        // Real-time validation for email, message and select
        if (field.name === 'email' || field.name === 'message') {
            field.addEventListener('input', () => {
                if (field.value.trim() !== '') {
                    setTimeout(() => validateField(field), 500); // Debounced validation
                }
            });
        }

        // Immediate validation for select changes
        if (field.tagName.toLowerCase() === 'select') {
            field.addEventListener('change', () => {
                validateField(field);
            });
        }
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validate all required fields
        const requiredFields = ['name', 'email', 'message'];
        let allValid = true;

        requiredFields.forEach(fieldName => {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const isValid = validateField(field);
                if (!isValid || !data[fieldName] || data[fieldName].trim() === '') {
                    allValid = false;
                }
            }
        });

        if (!allValid) {
            showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
            return;
        }

        // Form submission
        const submitButton = contactForm.querySelector('.form-submit-btn');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = `
            <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            Envoi en cours...
        `;
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Simulate API call with better UX
        setTimeout(() => {
            // Success message
            showNotification('Message envoyé avec succès ! Nous vous répondrons sous 24h', 'success');

            // Reset form and clear validation states
            contactForm.reset();
            formFields.forEach(field => {
                clearValidationState(field);
                if (field.classList.contains('form-select')) {
                    field.classList.remove('has-value');
                }
            });

            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.opacity = '';

            // Remove spinner style
            setTimeout(() => {
                style.remove();
            }, 100);
        }, 1500);
    });
}

// ─────────────────────────────────────────────────────────────────
// CONSOLIDATED INITIALIZATION
// ─────────────────────────────────────────────────────────────────

function initAllAnimations() {
    // Navigation (must be initialized regardless of WebGL)
    initNavigation();

    // Core animations
    initHeroAnimation();
    initServicesAnimations();
    initSectionReveals();
    initPortfolioAnimations();

    // Form & footer
    initContactFormAnimations();
    initFooterAnimations();
}

// ─────────────────────────────────────────────────────────────────
// DOM READY & WINDOW LOAD (Best practices GSAP 3.13+)
// ─────────────────────────────────────────────────────────────────

// Since scripts are now at end of body, DOM is ready
// Use requestAnimationFrame to ensure layout is complete
requestAnimationFrame(() => {
    // Fallback if GSAP fails to load
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('.hero-top-bar, .hero-bottom-bar, .title-line-inner').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    initAllAnimations();
});

// Fallback: if elements are still hidden after 3 seconds, force show them
setTimeout(() => {
    const bottomBar = document.querySelector('.hero-bottom-bar');
    if (bottomBar) {
        const computedStyle = window.getComputedStyle(bottomBar);
        if (computedStyle.opacity === '0' || parseFloat(computedStyle.opacity) < 0.1) {
            bottomBar.style.cssText = 'opacity: 1 !important; transform: translateY(0) !important;';
        }
    }
}, 3000);

// Also handle window load for any late-loading resources
window.addEventListener('load', () => {
    // Refresh ScrollTrigger after all resources loaded (GSAP 3.13+)
    ScrollTrigger.refresh();

    // Clear inline styles that might interfere with ScrollTrigger
    ScrollTrigger.clearScrollMemory();
});

// Handle resize events properly (GSAP 3.13+ best practice)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Handle visibility change to refresh on tab focus
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        ScrollTrigger.refresh();
    }
});


// ─────────────────────────────────────────────────────────────────
// STICKY MOBILE CTA BAR - Shows after hero, hidden on desktop
// ─────────────────────────────────────────────────────────────────
(function initStickyMobileCta() {
    const stickyCta = document.getElementById('stickyMobileCta');
    if (!stickyCta) return;

    let isVisible = false;

    function updateStickyCtaVisibility() {
        // Only on mobile viewports
        if (window.innerWidth > 768) {
            stickyCta.classList.remove('visible');
            return;
        }

        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const shouldShow = heroBottom < 0; // Past the hero

        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            if (isVisible) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', updateStickyCtaVisibility, { passive: true });
    window.addEventListener('resize', updateStickyCtaVisibility, { passive: true });
    updateStickyCtaVisibility();
})();


// ─────────────────────────────────────────────────────────────────
// COOKIE CONSENT BANNER - GDPR compliant
// ─────────────────────────────────────────────────────────────────
(function initCookieConsent() {
    const banner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');

    if (!banner) return;

    // Check if consent already given
    const consent = localStorage.getItem('codelli_cookie_consent');
    if (!consent) {
        // Show after a short delay
        setTimeout(() => {
            banner.style.display = 'block';
        }, 1500);
    } else if (consent === 'accepted') {
        // GA4 already configured, nothing to do
    }

    function hideBanner() {
        banner.style.opacity = '0';
        banner.style.transition = 'opacity 0.3s ease';
        setTimeout(() => { banner.style.display = 'none'; }, 300);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('codelli_cookie_consent', 'accepted');
            hideBanner();
            // Enable GA4 (already loaded, just mark as consented)
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('codelli_cookie_consent', 'rejected');
            hideBanner();
            // Disable GA4 cookies
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        });
    }
})();


// ─────────────────────────────────────────────────────────────────
// NAV OVERLAY CTA — animate in with other nav elements
// ─────────────────────────────────────────────────────────────────
(function patchNavOverlayCta() {
    const navTrigger = document.getElementById('nav-trigger');
    if (!navTrigger) return;

    navTrigger.addEventListener('click', () => {
        gsap.fromTo('.nav-overlay-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' }
        );
    });
})();