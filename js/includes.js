/**
 * includes.js
 * Loads shared header and footer partials via fetch().
 * NOTE: Requires a local HTTP server (e.g. VS Code Live Server, python -m http.server).
 *       Does NOT work when opening files directly via file:// protocol.
 */

(function () {
  // Resolve the base path so partials load from root regardless of which
  // subdirectory the current page lives in (e.g. /characters/oc-name.html)
  function getBasePath() {
    const depth = window.location.pathname.split('/').length - 2;
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  async function loadPartial(selector, partialPath) {
    const el = document.querySelector(selector);
    if (!el) return;

    try {
      const base = getBasePath();
      const res = await fetch(base + partialPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();

      // Mark active nav link after injecting
      markActiveNav();
    } catch (err) {
      console.warn(`[includes.js] Could not load partial "${partialPath}":`, err.message);
      // Graceful fallback: leave placeholder empty so page still renders
    }
  }

  function markActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (
        (href.includes('characters') && currentPath.includes('characters')) ||
        (href.endsWith('index.html') && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
        (href === '/' && currentPath === '/')
      ) {
        link.classList.add('active');
      }
    });
  }

  // Load both partials in parallel
  Promise.all([
    loadPartial('#site-header', 'partials/header.html'),
    loadPartial('#site-footer', 'partials/footer.html'),
  ]).then(() => {
    // Initialize nav toggle after header loads
    if (typeof initNav === 'function') initNav();
  });
})();
