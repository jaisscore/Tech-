/* =========================================================
   FutureSwarm — script.js
   Vanilla JS only. No dependencies, no build step.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initSmoothAnchors();
  initScrollReveal();
  initCounters();
  initFAQ();
  initContactForm();
  initParticleField();
  initStarfield();
  initNavShrink();
  initFloaters();
  initTilt();
  initTypewriter();
  initSearch();
  initLoader();
});

/* ---------------------------------------------------------
   Theme toggle (dark default, light optional)
   In-memory only — artifacts environments do not persist
   browser storage, so state lives for the session.
--------------------------------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  let isLight = prefersLight;

  applyTheme();

  toggle.addEventListener('click', () => {
    isLight = !isLight;
    applyTheme();
  });

  function applyTheme() {
    document.body.classList.toggle('light-mode', isLight);
    toggle.setAttribute('aria-pressed', String(isLight));
  }
}

/* ---------------------------------------------------------
   Mobile nav burger
--------------------------------------------------------- */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   Smooth scroll for in-page anchors (CSS handles most of it,
   this adds an offset correction for the fixed nav)
--------------------------------------------------------- */
function initSmoothAnchors() {
  const nav = document.getElementById('nav');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 24;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------------------------------------------------------
   Nav background intensifies on scroll
--------------------------------------------------------- */
function initNavShrink() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.padding = window.scrollY > 20 ? '10px 5vw' : '18px 5vw';
  }, { passive: true });
}

/* ---------------------------------------------------------
   Scroll reveal via IntersectionObserver
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   Animated counters (readout stats)
--------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
}

/* ---------------------------------------------------------
   FAQ accordion
--------------------------------------------------------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-item__q');
    const answer = item.querySelector('.faq-item__a');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------------------------------------------------
   Contact form — client-side only demo submit
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const success = document.getElementById('formSuccess');
  const successText = document.getElementById('formSuccessText');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    success.classList.remove('is-visible');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !message) {
      status.textContent = 'Please fill in your name and message before transmitting.';
      status.style.color = '#c9776a';
      return;
    }
    if (!emailPattern.test(email)) {
      status.textContent = 'That email address doesn\u2019t look right — double check it.';
      status.style.color = '#c9776a';
      return;
    }

    status.textContent = '';
    const submitBtn = form.querySelector('.contact-form__submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn__label').textContent = 'Transmitting…';

    setTimeout(() => {
      submitBtn.querySelector('.btn__label').textContent = 'Send transmission';
      submitBtn.disabled = false;

      successText.textContent = `Signal received, ${name.split(' ')[0]}. The ${form.division.value} division will respond shortly.`;
      success.classList.add('is-visible');
      form.reset();

      setTimeout(() => success.classList.remove('is-visible'), 6000);
    }, 900);
  });
}

/* ---------------------------------------------------------
   Ambient constellation particle field (hero + full-page backdrop)
--------------------------------------------------------- */
function initParticleField() {
  const canvas = document.getElementById('field-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
  const isMobile = window.innerWidth < 720;
  const density = isMobile ? 14000 : 9000;
  const linkDist = 130;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.floor((width * height) / density);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.body.classList.contains('light-mode');
    const dotColor = isLight ? '120, 112, 96' : '208, 200, 184';
    const lineColor = isLight ? '140, 95, 55' : '184, 112, 63';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, 0.6)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    step(); // draw a single static frame
  } else {
    requestAnimationFrame(step);
  }
}

/* ---------------------------------------------------------
   Parallax star-field — a slow, deep backdrop layer that
   drifts opposite scroll direction for a sense of depth.
--------------------------------------------------------- */
function initStarfield() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, stars;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * 1.2;
    const count = Math.floor((width * height) / 6000);
    stars = Array.from({ length: count }, () => {
      const depth = Math.random() * 0.8 + 0.2; // 0.2 (far) – 1 (near)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: depth * 1.1 + 0.2,
        depth,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005
      };
    });
    draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      if (!reduceMotion) {
        // Nearer stars drift very slightly faster — a subtle sense of
        // gliding forward through the field, never fast enough to distract.
        s.x -= s.depth * 0.045;
        s.y += s.depth * 0.018;
        if (s.x < -2) s.x = width + 2;
        if (s.y > height + 2) s.y = -2;
      }
      const flicker = reduceMotion ? 0.7 : 0.5 + Math.sin(s.twinkle + time * s.speed) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 238, 224, ${0.15 + flicker * 0.55})`;
      ctx.fill();
    });
  }

  function loop(time) {
    draw(time * 0.05);
    if (!reduceMotion) requestAnimationFrame(loop);
  }

  function onScroll() {
    // Star layer moves slower than the page for a parallax depth cue
    const offset = window.scrollY * 0.12;
    canvas.style.transform = `translateY(${-offset}px)`;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', onScroll, { passive: true });

  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(loop);
  }
}

/* ---------------------------------------------------------
   Floating ambient particles — lightweight CSS-driven embers
   that drift upward through the hero section.
--------------------------------------------------------- */
function initFloaters() {
  const container = document.getElementById('heroFloaters');
  if (!container) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const count = window.innerWidth < 720 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'floater';
    el.style.left = `${Math.random() * 100}%`;
    el.style.setProperty('--fs', `${(Math.random() * 3 + 2).toFixed(1)}px`);
    el.style.setProperty('--fdur', `${(Math.random() * 10 + 10).toFixed(1)}s`);
    el.style.setProperty('--fdelay', `${(Math.random() * 12).toFixed(1)}s`);
    el.style.setProperty('--fx', `${Math.round(Math.random() * 80 - 40)}px`);
    container.appendChild(el);
  }
}

/* ---------------------------------------------------------
   Subtle 3D tilt on feature cards (division HUD frames and
   future-project cards). Pointer-fine devices only.
--------------------------------------------------------- */
function initTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduceMotion) return;

  const targets = document.querySelectorAll('.hud-frame, .future-card');

  targets.forEach(el => {
    el.classList.add('tilt-target');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--tilt-y', `${px * 10}deg`);
      el.style.setProperty('--tilt-x', `${py * -10}deg`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    });
  });
}

/* ---------------------------------------------------------
   Hero typewriter — types the two headline lines in sequence,
   then leaves a blinking caret that fades after a pause.
--------------------------------------------------------- */
function initTypewriter() {
  const line1 = document.getElementById('typeLine1');
  const line2 = document.getElementById('typeLine2');
  const caret = document.getElementById('typeCaret');
  if (!line1 || !line2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const text1 = line1.dataset.typeText || '';
  const text2 = line2.dataset.typeText || '';

  if (reduceMotion) {
    line1.textContent = text1;
    line2.textContent = text2;
    if (caret) caret.classList.add('is-done');
    return;
  }

  line1.textContent = '';
  line2.textContent = '';

  let i = 0;
  const speed = 32;

  function typeLine(text, el, onDone) {
    i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else if (onDone) {
        onDone();
      }
    })();
  }

  // Start typing exactly when the loader clears, so the reveal and the
  // typing motion always land together regardless of load speed.
  const start = () => {
    typeLine(text1, line1, () => {
      typeLine(text2, line2, () => {
        if (caret) caret.classList.add('is-done');
      });
    });
  };

  if (document.body.classList.contains('is-loaded')) {
    start();
  } else {
    document.addEventListener('futureswarm:loaded', start, { once: true });
  }
}

/* ---------------------------------------------------------
   Loading overlay — a cinematic rocket launch sequence
   (systems check → ignition → liftoff → orbit → reveal) that
   then hands off to the site. Skippable, disabled for
   prefers-reduced-motion, and — per the brief — only plays in
   full on a visitor's first visit. Returning visitors (same
   browser) get an instant, near-invisible reveal instead.

   Note: "first visit only" relies on localStorage, which is
   unavailable inside Claude.ai's in-chat preview sandbox. The
   code below fails safe — if storage can't be read or written,
   it simply treats every load as a first visit — and works as
   intended the moment this file is opened directly or hosted
   on GitHub Pages.
--------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  const launch = document.getElementById('launch');
  const statusText = document.getElementById('launchStatus');
  const skipBtn = document.getElementById('loaderSkip');

  if (!loader) {
    document.body.classList.add('is-loaded');
    document.dispatchEvent(new CustomEvent('futureswarm:loaded'));
    return;
  }

  const STORAGE_KEY = 'futureswarm:intro-seen';
  const hasSeenIntro = () => {
    try { return window.localStorage.getItem(STORAGE_KEY) === '1'; }
    catch (err) { return false; }
  };
  const markIntroSeen = () => {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); }
    catch (err) { /* storage unavailable — replay next time, no harm done */ }
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealed = false;
  const timers = [];
  const schedule = (fn, delay) => timers.push(setTimeout(fn, delay));

  document.body.classList.add('is-loading');

  const setStatus = (text) => {
    if (!statusText) return;
    statusText.style.opacity = '0';
    setTimeout(() => {
      statusText.textContent = text;
      statusText.style.opacity = '1';
    }, 180);
  };

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    timers.forEach(clearTimeout);

    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
    document.dispatchEvent(new CustomEvent('futureswarm:loaded'));

    // Fully stop rendering/animating the loader once it's invisible.
    setTimeout(() => { loader.style.display = 'none'; }, 750);
  };

  skipBtn?.addEventListener('click', reveal);
  document.addEventListener('keydown', (e) => {
    if (!revealed && e.key === 'Escape') reveal();
  });

  if (reduceMotion || hasSeenIntro()) {
    // Reduced motion, or a returning visitor: skip straight to the site.
    markIntroSeen();
    reveal();
    return;
  }

  markIntroSeen();

  // Cinematic timeline — ~5 seconds end to end, skippable any time.
  schedule(() => { launch.classList.add('is-ignite'); setStatus('Ignition sequence'); }, 400);
  schedule(() => { launch.classList.remove('is-ignite'); launch.classList.add('is-liftoff'); setStatus('Liftoff'); }, 1400);
  schedule(() => { setStatus('Approaching orbit'); }, 2900);
  schedule(() => { launch.classList.add('is-exit'); setStatus('Welcome to FutureSwarm'); }, 4400);
  schedule(reveal, 5000);
}

/* ---------------------------------------------------------
   Site-wide search — a lightweight spotlight-style overlay
   that indexes every section on the page (vision, research
   divisions, future projects, timeline, news, publications,
   careers, FAQ, contact). Opens via the nav button or Cmd/
   Ctrl+K, closes on Esc or backdrop click.
--------------------------------------------------------- */
function initSearch() {
  const trigger = document.getElementById('searchTrigger');
  const overlay = document.getElementById('searchOverlay');
  const backdrop = document.getElementById('searchBackdrop');
  const input = document.getElementById('searchInput');
  const closeBtn = document.getElementById('searchClose');
  const resultsEl = document.getElementById('searchResults');
  if (!trigger || !overlay || !input || !resultsEl) return;

  const INDEX = [
    { cat: 'Vision', title: 'Our vision', snippet: "Contributing to humanity's long-term future through space technology, AI, and Dyson Sphere-scale engineering.", id: 'vision' },
    { cat: 'Mission', title: 'Our mission', snippet: 'Building technologies that improve humanity every day through innovation and engineering excellence.', id: 'vision' },
    { cat: 'Research', title: 'Cognition Division — Artificial Intelligence', snippet: 'Multi-modal reasoning cores, autonomous research agents, cross-modal perception.', id: 'ai' },
    { cat: 'Research', title: 'Orbital Division — Space Infrastructure', snippet: 'Reusable heavy-lift fleet, autonomous orbital relays, lunar supply corridors.', id: 'space' },
    { cat: 'Research', title: 'Quantum Division — Quantum Computing', snippet: 'Logical qubits, room-temperature coherence shielding, cryptographic-grade simulation.', id: 'quantum' },
    { cat: 'Research', title: 'Motion Division — Robotics', snippet: 'Swarm-coordinated units, self-repairing actuators, terrain-adaptive locomotion.', id: 'robotics' },
    { cat: 'Research', title: 'Aegis Division — Cybersecurity', snippet: 'Post-quantum encryption, autonomous intrusion response, zero-trust architecture.', id: 'cyber' },
    { cat: 'Future Projects', title: 'Dyson Sphere Research & Concepts', snippet: 'Long-term structural and energy-collection concepts for Dyson Sphere-scale engineering.', id: 'future' },
    { cat: 'Future Projects', title: 'Sustainable Energy Systems', snippet: 'Energy infrastructure research supporting long-term, planet-scale sustainability.', id: 'future' },
    { cat: 'Future Projects', title: 'Deep Space Technologies', snippet: 'Research frontiers beyond the five active divisions.', id: 'future' },
    { cat: 'Roadmap', title: 'Company timeline', snippet: 'Grid ignition, lunar corridor, logical qubit milestone, autonomous motion fleet, full mesh encryption.', id: 'timeline' },
    { cat: 'Newsroom', title: 'Latest news', snippet: 'Company announcements, engineering milestones, and press coverage.', id: 'news' },
    { cat: 'Research', title: 'Publications', snippet: 'Technical papers and research notes from across the five divisions.', id: 'publications' },
    { cat: 'Careers', title: 'Careers at FutureSwarm', snippet: 'Founding roles across every division — research, systems, and robotics engineering.', id: 'careers' },
    { cat: 'Support', title: 'Frequently asked questions', snippet: 'What FutureSwarm builds, security, enterprise integration, developer access, getting involved.', id: 'faq' },
    { cat: 'Contact', title: 'Connect with FutureSwarm', snippet: 'Email, GitHub, LinkedIn, X, and Instagram — reach the right division directly.', id: 'contact' }
  ];

  let activeIndex = -1;
  let currentResults = [];

  const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const render = (items) => {
    currentResults = items;
    activeIndex = items.length ? 0 : -1;

    if (!items.length) {
      resultsEl.innerHTML = '<p class="search-overlay__empty">No results. Try a different term.</p>';
      return;
    }

    resultsEl.innerHTML = items.map((item, i) => `
      <button type="button" class="search-result${i === 0 ? ' is-active' : ''}" data-target="${item.id}" data-index="${i}">
        <span class="search-result__cat">${escapeHtml(item.cat)}</span>
        <span class="search-result__title">${escapeHtml(item.title)}</span>
        <span class="search-result__snippet">${escapeHtml(item.snippet)}</span>
      </button>
    `).join('');
  };

  const showHint = () => {
    resultsEl.innerHTML = `
      <p class="search-overlay__hint">
        Try <button type="button" class="search-overlay__chip" data-query="Dyson Sphere">Dyson Sphere</button>
        <button type="button" class="search-overlay__chip" data-query="careers">careers</button>
        <button type="button" class="search-overlay__chip" data-query="quantum">quantum</button>
        <button type="button" class="search-overlay__chip" data-query="publications">publications</button>
      </p>`;
    currentResults = [];
    activeIndex = -1;
  };

  const runQuery = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) { showHint(); return; }
    const matches = INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.cat.toLowerCase().includes(q)
    );
    render(matches);
  };

  const goToResult = (id) => {
    close();
    const target = document.getElementById(id);
    if (!target) return;
    const nav = document.getElementById('nav');
    const offset = (nav ? nav.offsetHeight : 0) + 24;
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  };

  const open = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('search-open');
    showHint();
    input.value = '';
    setTimeout(() => input.focus(), 50);
  };

  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('search-open');
  };

  trigger.addEventListener('click', () => {
    overlay.classList.contains('is-open') ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  input.addEventListener('input', () => runQuery(input.value));

  resultsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.search-overlay__chip');
    if (chip) { input.value = chip.dataset.query; input.focus(); runQuery(input.value); return; }
    const result = e.target.closest('.search-result');
    if (result) goToResult(result.dataset.target);
  });

  document.addEventListener('keydown', (e) => {
    const isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
    if (isK) { e.preventDefault(); overlay.classList.contains('is-open') ? close() : open(); return; }

    if (!overlay.classList.contains('is-open')) return;

    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown' && currentResults.length) {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % currentResults.length;
      updateActive();
    }
    if (e.key === 'ArrowUp' && currentResults.length) {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
      updateActive();
    }
    if (e.key === 'Enter' && activeIndex > -1 && currentResults[activeIndex]) {
      goToResult(currentResults[activeIndex].id);
    }
  });

  function updateActive() {
    resultsEl.querySelectorAll('.search-result').forEach((el, i) => {
      el.classList.toggle('is-active', i === activeIndex);
    });
  }
}
