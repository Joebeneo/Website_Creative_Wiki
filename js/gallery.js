/**
 * gallery.js
 * Lightbox for the OC art gallery.
 * Handles: open, close, prev/next navigation, keyboard, loading spinner.
 */

(function () {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  // Collect all real gallery items (skip placeholders)
  const items = Array.from(
    galleryGrid.querySelectorAll('.gallery-item:not(.gallery-item--placeholder)')
  );

  if (items.length === 0) return;

  let currentIndex = 0;

  // ── Build lightbox DOM ────────────────────────────────────
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image viewer');

  lightbox.innerHTML = `
    <div class="lightbox__content">
      <div class="lightbox__spinner" aria-hidden="true"></div>
      <img class="lightbox__img" src="" alt="">
    </div>
    <button class="lightbox__btn lightbox__btn--prev" aria-label="Previous image">&#8592;</button>
    <button class="lightbox__btn lightbox__btn--next" aria-label="Next image">&#8594;</button>
    <button class="lightbox__close" aria-label="Close image viewer">&#10005;</button>
    <div class="lightbox__caption" aria-live="polite"></div>
  `;

  document.body.appendChild(lightbox);

  const lbImg     = lightbox.querySelector('.lightbox__img');
  const lbSpinner = lightbox.querySelector('.lightbox__spinner');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbPrev    = lightbox.querySelector('.lightbox__btn--prev');
  const lbNext    = lightbox.querySelector('.lightbox__btn--next');
  const lbClose   = lightbox.querySelector('.lightbox__close');

  // ── Open / Close ──────────────────────────────────────────
  function openAt(index) {
    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    // Return focus to the item that opened the lightbox
    if (items[currentIndex]) items[currentIndex].focus();
  }

  function showImage(index) {
    const item = items[index];
    const img  = item.querySelector('img');
    const src  = item.getAttribute('href') || (img && img.getAttribute('src')) || '';
    const alt  = (img && img.getAttribute('alt')) || '';
    const cap  = item.dataset.caption || alt;

    // Show spinner while loading
    lbImg.classList.add('loading');
    lbSpinner.classList.add('visible');
    lbCaption.textContent = '';

    lbImg.onload = () => {
      lbImg.classList.remove('loading');
      lbSpinner.classList.remove('visible');
      lbCaption.textContent = cap ? `${cap} (${index + 1} / ${items.length})` : `${index + 1} / ${items.length}`;
    };

    lbImg.onerror = () => {
      lbImg.classList.remove('loading');
      lbSpinner.classList.remove('visible');
    };

    lbImg.src = src;
    lbImg.alt = alt;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showImage(currentIndex);
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    showImage(currentIndex);
  }

  // ── Event listeners ───────────────────────────────────────

  // Open on click
  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openAt(index);
    });

    // Make gallery items keyboard-accessible
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt(index);
      }
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    switch (e.key) {
      case 'Escape':     close(); break;
      case 'ArrowLeft':  prev();  break;
      case 'ArrowRight': next();  break;
    }
  });

  // Hide prev/next if only 1 image
  if (items.length <= 1) {
    lbPrev.hidden = true;
    lbNext.hidden = true;
  }
})();
