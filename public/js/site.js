/* Gedeeld voor alle pagina's: nav, lightbox, contact-form, projecten-grid renderer. */
(function () {
  // ── Mobile nav ─────────────────────────────────────────
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', links.classList.contains('open'));
      });
    }
    const header = document.querySelector('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  // ── Lightbox ───────────────────────────────────────────
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
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
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
    renderLb();
  }
  function renderLb() {
    const lb = document.getElementById('lightbox');
    lb.querySelector('img').src = lbImages[lbIndex];
    lb.querySelector('.lb-cap').textContent =
      lbCaption + (lbImages.length > 1 ? '  ' + (lbIndex + 1) + ' / ' + lbImages.length : '');
    lb.querySelector('.lb-prev').style.visibility = lbIndex === 0 ? 'hidden' : '';
    lb.querySelector('.lb-next').style.visibility = lbIndex === lbImages.length - 1 ? 'hidden' : '';
  }
  function closeLb() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
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

  // ── Contactformulier ──────────────────────────────────
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

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initLightbox();
    initContactForm();
  });

  window.KA = { openLb };
})();
