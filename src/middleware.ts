// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * SECURITY HEADERS
 * ─────────────────────────────────────────────────────────────────────────
 * Applied to EVERY response this middleware touches (pages, API routes,
 * and static asset requests alike — see `config.matcher` below). This is
 * the single source of truth for the site's security headers.
 *
 * FRAMING LOCKDOWN (hard requirement): the ONLY origins permitted to embed
 * this site in an <iframe>/<frame>/<object> are rollingrover.co.za and its
 * www. subdomain. No other origin — including any future Diza subdomain —
 * may frame this site unless explicitly added here. We rely on CSP
 * `frame-ancestors` (not X-Frame-Options) because X-Frame-Options only
 * supports a single allowed origin via the deprecated/unsupported
 * ALLOW-FROM directive; frame-ancestors is the modern, correctly-specified
 * mechanism for allow-listing multiple framing origins and takes
 * precedence over X-Frame-Options in all current browsers.
 * ─────────────────────────────────────────────────────────────────────────
 */
const FRAME_ANCESTORS = ["'self'", 'https://rollingrover.co.za', 'https://www.rollingrover.co.za'];

function buildCsp(): string {
  return [
    `default-src 'self'`,
    // Vercel Analytics + Next's own inline bootstrap scripts are same-origin;
    // 'unsafe-inline' is required for Next's inline hydration script in the
    // App Router (no nonce plumbing is set up here — see report for the
    // stricter nonce-based follow-up option).
    `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://www.google.com https://maps.gstatic.com https://maps.googleapis.com`,
    // The Contact page embeds a keyless Google Maps iframe.
    `frame-src 'self' https://www.google.com`,
    `connect-src 'self' https://vitals.vercel-insights.com`,
    `font-src 'self' data:`,
    `frame-ancestors ${FRAME_ANCESTORS.join(' ')}`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('Content-Security-Policy', buildCsp());
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Defense in depth: strip X-Powered-By here too, in case anything upstream
  // (e.g. a custom server or platform layer) ever re-adds it. The primary
  // fix is `poweredByHeader: false` in next.config.js.
  res.headers.delete('X-Powered-By');
  return res;
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Requests that must NEVER be run through next-intl's locale-rewriting
  // logic: API routes, Next.js internals, and any request for a static
  // file — anything with a file extension (images under /public,
  // robots.txt, sitemap.xml, icon.png/svg, fonts, etc.). next-intl treats
  // an unprefixed path as "missing its locale" and 307-redirects it to
  // `/en/<path>`, which doesn't exist for these — that redirect-to-nowhere
  // is exactly what silently broke the site logo, robots.txt, and the
  // generated icon/sitemap routes in an earlier version of this file.
  // These still get the security headers below; they just skip intl.
  const isStaticAsset = /\.[a-zA-Z0-9]+$/.test(pathname);
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || isStaticAsset) {
    return withSecurityHeaders(NextResponse.next());
  }

  const intlResponse = intlMiddleware(request);
  return withSecurityHeaders(intlResponse);
}

export const config = {
  // Runs on every route (pages, api, static assets, generated files like
  // robots.txt/sitemap.xml) so security headers are guaranteed everywhere.
  // The function body above decides, per-request, whether to also run
  // next-intl's locale-rewriting logic (only for actual page routes).
  matcher: ['/((?!favicon.ico).*)'],
};