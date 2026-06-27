/* ============================================================
   EXAULUC GROUP — MAIN JAVASCRIPT
   Version 1.0 | Production
   ============================================================ */

(function () {
  'use strict';

  // ── NAV: scroll state ──────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── NAV: active link ──────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav__links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── NAV: mobile drawer ────────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const drawer = document.querySelector('.nav__drawer');
  const drawerClose = document.querySelector('.nav__drawer-close');

  if (hamburger && drawer) {
    const openDrawer = () => {
      drawer.style.display = 'flex';
      requestAnimationFrame(() => {
        drawer.classList.add('open');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
      });
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      setTimeout(() => { drawer.style.display = ''; }, 400);
    };

    hamburger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', e => {
      if (e.target === drawer) closeDrawer();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  // ── FADE-IN on scroll ─────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger for grouped elements
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach((el, i) => {
      if (!el.dataset.delay) {
        // Auto-stagger siblings within the same parent
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        siblings.forEach((sib, j) => {
          if (!sib.dataset.delay) sib.dataset.delay = j * 80;
        });
      }
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── CONTACT FORM: Formspree ───────────────────────────────
  const contactForm = document.querySelector('form.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      const btn = contactForm.querySelector('[type="submit"]');
      if (btn) {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
      }
    });
  }

})();
