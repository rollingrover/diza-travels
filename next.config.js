const createNextIntlPlugin = require('next-intl/plugin');

// next-intl v3: pass the path to i18n.ts (or i18n/request.ts)
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── SECURITY: hide the framework fingerprint (removes X-Powered-By: Next.js) ──
  poweredByHeader: false,

  // ── SECURITY: never emit browser-readable source maps in production ──
  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // ── SECURITY (SSRF hardening): the site only ever renders local images
    // from /public — there is no legitimate need for /_next/image to fetch
    // and optimize an arbitrary remote URL. Leaving remotePatterns empty
    // makes next/image reject every remote src outright. If a remote image
    // host is ever needed, add its exact hostname/path here — do NOT use a
    // wildcard pattern.
    remotePatterns: [],
    // Cap the w=/q= query params the /_next/image endpoint will accept, so
    // it can't be abused to force expensive arbitrary-size/quality renders.
    deviceSizes: [360, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [60, 75, 90],
    minimumCacheTTL: 60 * 60 * 24, // 24h
  },
  trailingSlash: false,

  // NOTE: Security *headers* (CSP, HSTS, X-Content-Type-Options,
  // Referrer-Policy, Permissions-Policy, frame-ancestors) are set in
  // src/middleware.ts instead of here via headers(), because middleware
  // is guaranteed to run on every matched request path (including ones
  // next-intl rewrites) and keeps all security-header logic in one place.
  // See src/middleware.ts for the actual header values.
};

module.exports = withNextIntl(nextConfig);
