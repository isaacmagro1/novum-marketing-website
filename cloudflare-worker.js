// Enforces the security headers defined in _headers, which GitHub Pages
// silently ignores (GH Pages only serves the file — it never reads it).
//
// Setup (one-time, in the Cloudflare dashboard — Isaac to do this, not run by Claude):
//   1. Add novummarketing.co to a Cloudflare account (free plan is enough).
//   2. Point DNS at Cloudflare and proxy the record that serves GitHub Pages
//      (the CNAME/A record already used for GitHub Pages — just turn the
//      proxy "cloud" icon ON instead of DNS-only). This does NOT change
//      where the site is hosted; GitHub Pages stays the origin.
//   3. Workers & Pages → Create Worker → paste this file's contents in.
//   4. Worker → Settings → Triggers → Add route: www.novummarketing.co/*
//      (and novummarketing.co/* if the bare domain also resolves here).
//   5. Deploy. Re-run: curl -sI https://www.novummarketing.co/ — the headers
//      below should now be present in the response.
//
// Keep this file's header values identical to /_headers. If you ever change
// one, change both — this Worker is the thing that actually ships them.

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "0",
  "X-DNS-Prefetch-Control": "off",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-site",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' data:; " +
    "img-src 'self' data:; " +
    "connect-src 'self' api.web3forms.com www.googletagmanager.com www.google-analytics.com *.google-analytics.com *.analytics.google.com; " +
    "frame-src 'none'; " +
    "frame-ancestors 'none'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self' api.web3forms.com; " +
    "upgrade-insecure-requests;",
};

// Cross-origin assets that intentionally need to be loadable from other sites.
const CORS_OPEN_PATHS = new Set(["/Novum.svg", "/favicon.svg"]);

export default {
  async fetch(request) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    const path = new URL(request.url).pathname;
    if (CORS_OPEN_PATHS.has(path)) {
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
