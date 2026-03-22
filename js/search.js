/**
 * search.js
 * Client-side character search + tag filter for characters.html.
 * Uses data attributes on each .character-card:
 *   data-name        — character name (lowercase)
 *   data-tags        — space-separated trait/species tags (lowercase)
 *   data-description — short description text
 */

(function () {
  // Only run on the characters page
  const grid = document.getElementById('characters-grid');
  if (!grid) return;

  const searchInput = document.getElementById('character-search');
  const emptyState  = document.getElementById('empty-state');
  const countNumber = document.getElementById('count-number');
  const filterPills = document.querySelectorAll('.filter-pill');

  let activeFilter = 'all';
  let searchQuery  = '';
  let debounceTimer;

  // ── Filtering logic ─────────────────────────────────────
  function filterCards() {
    const cards = grid.querySelectorAll('.character-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = (card.dataset.name || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const desc = (card.dataset.description || '').toLowerCase();

      const matchesSearch =
        searchQuery === '' ||
        name.includes(searchQuery) ||
        tags.includes(searchQuery) ||
        desc.includes(searchQuery);

      const matchesFilter =
        activeFilter === 'all' ||
        tags.includes(activeFilter);

      if (matchesSearch && matchesFilter) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    // Update count
    if (countNumber) countNumber.textContent = visibleCount;

    // Show/hide empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
      }
    }
  }

  // ── Search input ─────────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterCards();
      }, 200);
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        filterCards();
      }
    });
  }

  // ── Filter pills ──────────────────────────────────────────
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = (pill.dataset.filter || 'all').toLowerCase();
      filterCards();
    });
  });

  // ── Initial render ────────────────────────────────────────
  filterCards();
})();
