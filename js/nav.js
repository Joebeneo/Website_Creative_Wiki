/**
 * nav.js
 * Handles:
 *  - Mobile hamburger menu toggle
 *  - Scroll-shrink effect on header
 *  - Close on outside click or Escape key
 */

function initNav() {
  const header    = document.getElementById('site-header');
  const toggle    = header && header.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggle || !mobileNav) return;

  function openMenu() {
    toggle.classList.add('is-open');
    mobileNav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (mobileNav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when a mobile nav link is clicked
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Scroll-shrink header
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }
}

// If includes.js already loaded the header, initNav is called from there.
// If nav.js loads after the header is already in the DOM, call directly.
document.addEventListener('DOMContentLoaded', () => {
  // Only auto-init if header is already in DOM (i.e. not using includes.js)
  if (document.querySelector('.nav-toggle')) {
    initNav();
  }
});
