(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── CSS cross-document View Transitions (Chrome 126+) ─────────────
     Inject @view-transition so the browser handles the animation
     natively — no JS event interception, no z-index issues. Browsers
     that don't support the rule silently ignore it.
  ──────────────────────────────────────────────────────────────────── */
  var css = '@view-transition{navigation:auto}';

  if (!reduced) {
    css +=
      /* Leaving page: fade + very slight scale-down */
      '::view-transition-old(root){' +
        'animation:pg-out 220ms cubic-bezier(.16,1,.3,1) both' +
      '}' +
      /* Arriving page: fade + scale up from slightly behind */
      '::view-transition-new(root){' +
        'animation:pg-in 500ms cubic-bezier(.16,1,.3,1) both' +
      '}' +
      '@keyframes pg-out{' +
        'to{opacity:0;transform:scale(.97)}' +
      '}' +
      '@keyframes pg-in{' +
        'from{opacity:0;transform:scale(.97)}' +
      '}';
  }

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── JS overlay fallback for Firefox / Safari ───────────────────────
     Only runs when the native VT API is absent. Uses capture-phase
     listener so it fires before carousel drag-guards.
  ──────────────────────────────────────────────────────────────────── */
  if ('onpagereveal' in self) return; /* native VT active — done */

  if (reduced) return;

  var fStyle = document.createElement('style');
  fStyle.textContent =
    '.pg-cover{position:fixed;inset:0;background:#000;' +
    'z-index:2147483647;pointer-events:none;will-change:opacity}';
  document.head.appendChild(fStyle);

  var cover = document.createElement('div');
  cover.className = 'pg-cover';
  document.body.appendChild(cover);
  cover.style.opacity = '1';

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      cover.style.transition = 'opacity 500ms cubic-bezier(.16,1,.3,1)';
      cover.style.opacity = '0';
    });
  });

  function normPath(p) { return p.replace(/\/index\.html$/, '/'); }

  document.addEventListener('click', function (e) {
    if (document.querySelector('.is-dragging')) return;
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    try {
      var url = new URL(href, location.href);
      if (
        url.host !== location.host ||
        normPath(url.pathname) === normPath(location.pathname) ||
        (url.protocol !== 'http:' && url.protocol !== 'https:') ||
        link.target === '_blank'
      ) return;
    } catch (err) { return; }
    e.preventDefault();
    cover.style.transition = 'opacity 220ms cubic-bezier(.16,1,.3,1)';
    cover.style.opacity = '1';
    var dest = url.href;
    setTimeout(function () { window.location.href = dest; }, 240);
  }, true);
})();
