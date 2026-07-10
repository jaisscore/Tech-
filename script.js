/* =========================================================
   TechVerse — script.js
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
      status.style.color = '#f87171';
      return;
    }
    if (!emailPattern.test(email)) {
      status.textContent = 'That email address doesn\u2019t look right — double check it.';
      status.style.color = '#f87171';
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
    const dotColor = isLight ? '100, 110, 160' : '160, 175, 220';
    const lineColor = isLight ? '90, 100, 200' : '124, 107, 255';

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
      ctx.fillStyle = `rgba(230, 235, 255, ${0.15 + flicker * 0.55})`;
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
    document.addEventListener('techverse:loaded', start, { once: true });
  }
}

/* ---------------------------------------------------------
   Loading overlay — a short cinematic rocket launch sequence
   (systems check → ignition → liftoff → exit) that then
   reveals the site. Skippable and fully disabled for
   prefers-reduced-motion.
--------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  const launch = document.getElementById('launch');
  const statusText = document.getElementById('launchStatus');
  const skipBtn = document.getElementById('loaderSkip');

  if (!loader) {
    document.body.classList.add('is-loaded');
    document.dispatchEvent(new CustomEvent('techverse:loaded'));
    return;
  }

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
    document.dispatchEvent(new CustomEvent('techverse:loaded'));

    // Fully stop rendering/animating the loader once it's invisible.
    setTimeout(() => { loader.style.display = 'none'; }, 750);
  };

  skipBtn?.addEventListener('click', reveal);
  document.addEventListener('keydown', (e) => {
    if (!revealed && e.key === 'Escape') reveal();
  });

  if (reduceMotion) {
    // Respect the user's preference: skip straight to the site.
    reveal();
    return;
  }

  // Cinematic timeline — roughly 3 seconds end to end, skippable any time.
  schedule(() => { launch.classList.add('is-ignite'); setStatus('Ignition sequence'); }, 300);
  schedule(() => { launch.classList.remove('is-ignite'); launch.classList.add('is-liftoff'); setStatus('Liftoff'); }, 1050);
  schedule(() => { launch.classList.add('is-exit'); setStatus('Welcome to TechVerse'); }, 2300);
  schedule(reveal, 2950);
}
