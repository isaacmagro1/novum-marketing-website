(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var style = document.createElement('style');
  style.textContent =
    '.pg-cover{' +
      'position:fixed;inset:0;' +
      'background:radial-gradient(ellipse 90% 60% at 50% 45%,rgba(52,159,168,.09) 0%,#000 58%);' +
      'z-index:99998;pointer-events:none;' +
      'will-change:opacity,transform' +
    '}';
  document.head.appendChild(style);

  var cover = document.createElement('div');
  cover.className = 'pg-cover';
  document.body.appendChild(cover);

  // Initial state: fully opaque, slightly zoomed out
  cover.style.opacity = '1';
  cover.style.transform = 'scale(1.04)';

  if (reduced) {
    cover.style.opacity = '0';
    cover.style.transform = 'scale(1)';
    return;
  }

  // Enter: cover zooms toward viewer while fading, revealing the page beneath
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      cover.style.transition =
        'opacity 500ms cubic-bezier(.16,1,.3,1),' +
        'transform 500ms cubic-bezier(.16,1,.3,1)';
      cover.style.opacity = '0';
      cover.style.transform = 'scale(1)';
    });
  });

  function normPath(p) {
    return p.replace(/\/index\.html$/, '/');
  }

  // Exit: cover zooms back in while fading opaque, then navigate
  document.addEventListener('click', function (e) {
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
    var dest = url.href;
    cover.style.transition =
      'opacity 220ms cubic-bezier(.16,1,.3,1),' +
      'transform 220ms cubic-bezier(.16,1,.3,1)';
    cover.style.opacity = '1';
    cover.style.transform = 'scale(1.04)';
    setTimeout(function () {
      window.location.href = dest;
    }, 240);
  });
})();
