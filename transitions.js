(function () {
  var style = document.createElement('style');
  style.textContent = '.pg-cover{position:fixed;inset:0;background:#000;z-index:99998;pointer-events:none;opacity:1;transition:opacity 400ms cubic-bezier(.23,1,.32,1)}';
  document.head.appendChild(style);

  var cover = document.createElement('div');
  cover.className = 'pg-cover';
  document.body.appendChild(cover);

  // Fade in on load
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      cover.style.opacity = '0';
    });
  });

  // Treat /index.html and / as the same page
  function normPath(p) {
    return p.replace(/\/index\.html$/, '/');
  }

  // Fade out on link click, then navigate
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
    cover.style.transition = 'opacity 260ms cubic-bezier(.55,0,1,.45)';
    cover.style.opacity = '1';
    setTimeout(function () {
      window.location.href = dest;
    }, 280);
  });
})();
