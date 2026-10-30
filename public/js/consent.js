/*
 * Toestemming voor Google Analytics (basismodus van Consent Mode).
 * Zonder "ja" laadt er niets van Google. Keuze in localStorage ('ka-cookies': 'ja' | 'nee').
 * Staat in <head>, dus draait één keer; ViewTransitions houdt hem tussen pagina's vast.
 * Paginaweergaven na een overgang meet GA4 zelf (verbeterde meting: geschiedenis).
 */
(function () {
  var gaId = document.currentScript && document.currentScript.dataset.gaId;
  if (!gaId) return;

  var KEY = 'ka-cookies';
  var loaded = false;
  var returnFocus = null;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* privévenster: alleen deze pagina */ }
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function loadGa() {
    if (loaded) {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    });
    gtag('js', new Date());
    gtag('config', gaId);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(s);
  }

  // Gebeurtenissen van de site (bijv. generate_lead na het contactformulier).
  // Alleen met toestemming; anders zou de wachtrij later alsnog verstuurd worden.
  window.kaEvent = function (name) {
    if (loaded && read() === 'ja') gtag('event', name);
  };

  function stopGa() {
    if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
    // Eerder geplaatste GA-cookies weghalen (op dit domein en het hoofddomein).
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        var gone = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = gone;
        document.cookie = gone + '; domain=.' + host;
      }
    });
  }

  function banner() {
    return document.querySelector('[data-cookie-banner]');
  }

  function show(focus) {
    var el = banner();
    if (!el) return;
    el.hidden = false;
    document.documentElement.classList.add('cookie-open');
    if (focus) el.querySelector('[data-cookie-accept]').focus();
  }

  function hide() {
    var el = banner();
    if (el) el.hidden = true;
    document.documentElement.classList.remove('cookie-open');
    if (returnFocus) { returnFocus.focus(); returnFocus = null; }
  }

  if (read() === 'ja') loadGa();

  document.addEventListener('astro:page-load', function () {
    if (read() === null) show(false);
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-accept], [data-cookie-refuse], [data-cookie-settings]');
    if (!t) return;
    if (t.hasAttribute('data-cookie-settings')) {
      returnFocus = t;
      show(true);
    } else if (t.hasAttribute('data-cookie-accept')) {
      save('ja');
      loadGa();
      hide();
    } else {
      save('nee');
      stopGa();
      hide();
    }
  });

  document.addEventListener('keydown', function (e) {
    // Esc sluit alleen als er al een keuze is (via Cookie-instellingen geopend).
    if (e.key === 'Escape' && read() !== null && banner() && !banner().hidden) hide();
  });
})();
