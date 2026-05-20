/* KA.architecten — site.js */
(function () {

  // ── Mobile nav ───────────────────────────────────────────
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    // Sync header height so the overlay starts exactly below the header
    function syncHeaderHeight() {
      const header = document.querySelector('.site-header');
      if (header) {
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
      }
    }
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight, { passive: true });

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when a nav link is tapped
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    const header = document.querySelector('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  // ── Lightbox ─────────────────────────────────────────────
  let lbImages = [], lbIndex = 0, lbCaption = '';

  function ensureLb() {
    if (document.getElementById('lightbox')) return;
    const html = `
      <div id="lightbox" role="dialog" aria-modal="true" aria-label="Vergrote afbeelding">
        <span class="lb-close">Sluiten ✕</span>
        <button class="lb-arrow lb-prev" aria-label="Vorige">‹</button>
        <img alt="" />
        <button class="lb-arrow lb-next" aria-label="Volgende">›</button>
        <p class="lb-cap"></p>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const lb = document.getElementById('lightbox');
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', () => navLb(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => navLb(1));

    // Swipe support for touch devices
    let touchStartX = 0;
    lb.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navLb(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox')?.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') navLb(-1);
      if (e.key === 'ArrowRight') navLb(1);
    });
  }

  function openLb(images, index, caption) {
    ensureLb();
    lbImages = images; lbIndex = index || 0; lbCaption = caption || '';
    renderLb();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function navLb(d) {
    lbIndex = Math.max(0, Math.min(lbImages.length - 1, lbIndex + d));
    const img = document.getElementById('lightbox')?.querySelector('img');
    if (img) {
      img.style.opacity = '0';
      setTimeout(() => {
        renderLb();
        img.style.opacity = '1';
      }, 120);
    } else {
      renderLb();
    }
  }

  function renderLb() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const img = lb.querySelector('img');
    img.src = lbImages[lbIndex];
    lb.querySelector('.lb-cap').textContent =
      lbCaption + (lbImages.length > 1 ? '  ' + (lbIndex + 1) + ' / ' + lbImages.length : '');
    lb.querySelector('.lb-prev').style.visibility = lbIndex === 0 ? 'hidden' : '';
    lb.querySelector('.lb-next').style.visibility = lbIndex === lbImages.length - 1 ? 'hidden' : '';
  }

  function closeLb() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    setTimeout(() => { document.body.style.overflow = ''; }, 300);
  }

  function initLightbox() {
    document.querySelectorAll('[data-lightbox-group]').forEach(group => {
      const imgs = JSON.parse(group.getAttribute('data-lightbox-group'));
      const cap  = group.getAttribute('data-lightbox-caption') || '';
      group.querySelectorAll('img').forEach((img, i) => {
        img.addEventListener('click', () => openLb(imgs, i, cap));
        img.style.cursor = 'zoom-in';
      });
    });
  }

  // ── Scroll fade-ins ──────────────────────────────────────
  function initFadeIns() {
    const targets = document.querySelectorAll('.section, .usp, .gallery figure');
    if (!targets.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -48px 0px' });

    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) return;
      el.classList.add('fade-in');
      obs.observe(el);
    });
  }

  // ── Hero parallax (project detail) ──────────────────────
  function initParallax() {
    const hero = document.querySelector('.project-hero');
    if (!hero) return;
    const img = hero.querySelector('img');
    if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.innerWidth >= 720) {
            img.style.transform = `translateY(${window.scrollY * 0.18}px) scale(1.08)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Contactformulier ─────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const naam = data.get('naam') || '';
      const email = data.get('email') || '';
      const onderwerp = data.get('onderwerp') || 'Bericht via website';
      const bericht = data.get('bericht') || '';
      window.location.href =
        'mailto:p.keijsers@ka-architecten.nl' +
        '?subject=' + encodeURIComponent(onderwerp + ' — ' + naam) +
        '&body=' + encodeURIComponent(
          'Naam: ' + naam + '\n' +
          'E-mail: ' + email + '\n\n' +
          bericht
        );
      const thanks = document.getElementById('contact-thanks');
      if (thanks) { form.style.display = 'none'; thanks.style.display = 'block'; }
    });
  }

  // ── Boot ─────────────────────────────────────────────────
  function boot() {
    initNav();
    initLightbox();
    initContactForm();
    initFadeIns();
    initParallax();
  }

  // astro:page-load fires on every navigation, including the first page load.
  // With <ViewTransitions /> enabled this is the only initialisation needed.
  document.addEventListener('astro:page-load', boot);

  window.KA = { openLb };
})();
