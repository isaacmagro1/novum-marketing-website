(function () {
  var style = document.createElement('style');
  style.textContent = '.pg-cover{position:fixed;inset:0;background:#000;z-index:99998;pointer-events:none;opacity:1}';
  document.head.appendChild(style);

  var cover = document.createElement('div');
  cover.className = 'pg-cover';
  document.body.appendChild(cover);

  // Fade in on page load
  cover.style.transition = 'none';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      cover.style.transition = 'opacity 420ms cubic-bezier(.23,1,.32,1)';
      cover.style.opacity = '0';
    });
  });

  // Fade out on navigation
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    try {
      var url = new URL(href, location.href);
      // Skip: same page, anchor-only, external, non-http, new tab
      if (
        url.pathname === location.pathname ||
        url.host !== location.host ||
        (url.protocol !== 'http:' && url.protocol !== 'https:') ||
        link.target === '_blank'
      ) return;
    } catch (e) { return; }

    e.preventDefault();
    var dest = link.href;
    cover.style.transition = 'opacity 260ms cubic-bezier(.55,0,1,.45)';
    cover.style.opacity = '1';
    cover.addEventListener('transitionend', function () {
      window.location.href = dest;
    }, { once: true });
  });
})();
