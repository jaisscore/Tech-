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
  initNavShrink();
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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

    const submitBtn = form.querySelector('.contact-form__submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn__label').textContent = 'Transmitting…';

    setTimeout(() => {
      status.style.color = '';
      status.textContent = `Signal received, ${name.split(' ')[0]}. The ${form.division.value} division will respond shortly.`;
      submitBtn.querySelector('.btn__label').textContent = 'Send transmission';
      submitBtn.disabled = false;
      form.reset();
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
