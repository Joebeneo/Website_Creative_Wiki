/**
 * bubbles.js
 * Spawns animated floating bubble elements into .bubble-target containers.
 * Respects prefers-reduced-motion — skips animation if user prefers reduced motion.
 *
 * Usage: Add class="bubble-target" to any section that should have bubbles.
 * Bubbles are purely decorative (aria-hidden).
 */

(function () {
  // Respect user preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll('.bubble-target');
  if (!targets.length) return;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createBubble() {
    const el = document.createElement('div');
    el.className = 'bubble';
    el.setAttribute('aria-hidden', 'true');

    const size     = rand(20, 90);
    const x        = rand(0, 100);      // % from left
    const y        = rand(0, 100);      // % from top
    const duration = rand(5, 12);       // seconds
    const delay    = rand(0, 6);        // seconds

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      ${prefersReduced ? '' : `animation-duration: ${duration}s; animation-delay: -${delay}s;`}
    `;

    return el;
  }

  targets.forEach((target) => {
    const count = parseInt(target.dataset.bubbles || '6', 10);

    // Ensure positioning context
    const pos = getComputedStyle(target).position;
    if (pos === 'static') target.style.position = 'relative';

    // Add overflow hidden if not already clipping
    target.style.overflow = 'hidden';

    const layer = document.createElement('div');
    layer.className = 'bubble-layer';
    layer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < count; i++) {
      layer.appendChild(createBubble());
    }

    // Insert as first child so bubbles appear behind content
    target.insertBefore(layer, target.firstChild);
  });
})();
