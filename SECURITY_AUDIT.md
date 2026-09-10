# Diza Travels — Security Audit & Hardening Report

**Site:** dizatravels.co.za
**Stack:** Next.js 14.2.35 (App Router), next-intl v3, Vercel
**Date:** 2026-07-26
**Scope:** Headers, framing/embedding, exposed secrets, booking form, image
optimizer, dependencies, information exposure, TLS/hosting.

This audit was run directly against the repository (extracted from the
uploaded zip) using the same tools available in this chat — there was no
`claude` CLI in this sandbox, so every check and fix below was done by hand
against the actual source, then verified with a real `npm run build` and a
running production server (`npm run start` + `curl` against the live
response headers).

---

## 1. Security headers

**Before:** none of the required headers were set anywhere in the app.
**Fix:** all headers are now set in `src/middleware.ts`, applied to every
request the middleware matches (see §2 for why middleware rather than
`next.config.js` `headers()`).

Verified live (`curl -sD -` against a running `npm run start`):

```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google.com
  https://maps.gstatic.com https://maps.googleapis.com; frame-src 'self'
  https://www.google.com; connect-src 'self' https://vitals.vercel-insights.com;
  font-src 'self' data:; frame-ancestors 'self' https://rollingrover.co.za
  https://www.rollingrover.co.za; base-uri 'self'; form-action 'self';
  object-src 'none'; upgrade-insecure-requests
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()
```

`X-Powered-By` is gone (`poweredByHeader: false` in `next.config.js`, plus a
belt-and-braces `res.headers.delete('X-Powered-By')` in middleware).

**Note on `script-src`/`style-src 'unsafe-inline'`:** Next's App Router
injects an inline hydration bootstrap script and Tailwind's runtime uses
inline styles in a few places; without nonce plumbing, CSP has to allow
`'unsafe-inline'` for those two directives or the site breaks. This is a
real (if common) weakening of CSP's XSS mitigation — the stricter fix is a
per-request nonce wired through middleware → `next.config.js` → the root
layout's `<script nonce={nonce}>`. I didn't attempt that here because it
touches every layout/page and needs a full render/browser test pass I can't
do against your live deployment from this sandbox. Flagged as a follow-up
in §10.

---

## 2. Framing / iframe lockdown — CRITICAL REQUIREMENT

> **Post-deploy correction (see changelog at the bottom of this file):** the
> first version of this fix broadened the middleware matcher to cover every
> route, but dropped the exclusion for static-file paths (anything with a
> file extension). That caused next-intl to try to locale-prefix requests
> for the site logo, `robots.txt`, `sitemap.xml`, and the generated icon
> routes — 307-redirecting each to a non-existent `/en/<path>`, which broke
> those assets sitewide (most visibly around the mobile nav re-rendering
> the logo on open). This has been fixed; see the changelog for the exact
> diff and verification.

**Rule set:**
```
frame-ancestors 'self' https://rollingrover.co.za https://www.rollingrover.co.za;
```

Set in `src/middleware.ts`, applied via CSP (not `X-Frame-Options`) because
`X-Frame-Options` only supports a single allow-listed origin via the
deprecated/largely-unsupported `ALLOW-FROM` directive — it cannot express
"allow these two specific origins and no others." CSP `frame-ancestors` is
the correctly-specified mechanism for that, and it takes precedence over
`X-Frame-Options` in every current browser, so no conflicting
`X-Frame-Options` header was added.

**Coverage:** the middleware matcher was widened from the previous
`/((?!api|_next|.*\..*).*)`(which skipped API routes, `_next` internals, and
any dotted asset path) to `/((?!favicon.ico).*)`, with an explicit branch in
the middleware function that routes `/api` and `/_next` requests around the
locale-rewriting logic but still stamps the security headers on them. This
means **every route** — pages, any future API route, and asset requests —
gets `frame-ancestors` applied, not just the locale pages.

**Confirmed:** only `https://rollingrover.co.za` and
`https://www.rollingrover.co.za` (plus same-origin) can frame any page on
the site. No other origin is permitted.

---

## 3. Google Maps API key

**Status: could not locate — needs your input.**

I searched the entire repository (`grep -r "AIzaSy"` across all file types,
including `.env.example`) for the key you mentioned
(`AIzaSyCmL18misQw9KdwqGaw3zHkitj8vG6QF2Y`) and found nothing. The contact
page (`src/app/[locale]/contact/page.tsx`) embeds Google Maps via a
**keyless** iframe:

```
https://www.google.com/maps?q=-28.017788,32.198622&hl=en&z=17&output=embed
```

No `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` or any API key is referenced anywhere
in the codebase. `.env.example` has a commented-out placeholder for one,
reserved for if the embed is ever swapped for the JS Maps API, but it's
unused and empty.

**Action needed from you:** if you saw this key live on
`dizatravels.co.za/en/contact`, please check:
- View-source / Network tab on the *actual deployed* site (not this repo) —
  it's possible an older deployment, a different branch, or a build cache
  on Vercel still has it.
- Whether it's coming from a third-party script or embed unrelated to this
  codebase.

I don't want to mark this "fixed" without having actually found and moved
the key — that would be a false sense of security. If you can tell me
which file/URL you saw it in, I'll take it from there.

---

## 4. Booking form (`/en/contact` + tour pages)

**Important context first:** `BookingForm.tsx` has **no backend**. On
submit it Zod-validates the data, then builds a `mailto:` link and
navigates the browser to it — there is no `POST /api/booking`, no database,
no server-side code path at all. Several of the requested items (server-side
validation *on a server*, IP-based rate limiting, CSRF protection on a POST
endpoint) don't apply because there's no server-side endpoint to protect —
there's nothing for an attacker to abuse beyond what their own browser and
mail client can already do. Claiming to "add rate limiting" to something
with no server would be fabricated, not a fix, so instead:

| Item | Status |
|---|---|
| Server-side validation on every field | N/A — no server. Client-side Zod validation (`booking-schema.ts`) already covers all fields; kept and hardened. |
| Strip newlines from email/name (header injection) | **Fixed.** Added `stripControlChars()` in `booking-schema.ts` (strips CR/LF/control chars from `name`, `email`, `date`) and a second `singleLine()` guard in `BookingForm.tsx` right before the `mailto:` subject is built, since that's the one place a raw newline could visually spoof extra content in a recipient's mail client. |
| Escape user input on render | Reviewed. The only `dangerouslySetInnerHTML` usages in the app are `JSON.stringify()` of static JSON-LD schema objects (business info, breadcrumbs) — none of them interpolate booking-form or any other user-submitted input. No XSS sink found. |
| Rate limiting by IP | N/A — no server-side endpoint exists to rate-limit. If/when you add a real API route (see the `TODO` already in `BookingForm.tsx`), this becomes straightforward with Vercel's `@vercel/kv` or `Upstash` rate-limit middleware — flagged for that future work. |
| CAPTCHA / honeypot | **Added a honeypot field** (`website`, visually hidden, `tabIndex={-1}`, `aria-hidden`) — if it's non-empty on submit, the form silently no-ops. This is a genuine (if modest) deterrent against naive bots that fill every input, even with no backend to protect. A real CAPTCHA (hCaptcha/Turnstile) only makes sense once there's a server endpoint to gate — otherwise it just adds friction with no attacker it stops. |
| CSRF protection on POST endpoint | N/A — no POST endpoint exists (see above). |

**Recommendation:** if bookings matter enough to want real spam/abuse
protection, replace the `mailto:` fallback with an actual
`POST /api/booking` route (the code is already structured for this — see
the `TODO` comment in `handleSubmit`). Once that exists, rate limiting,
CAPTCHA, and CSRF protection all become meaningful and I'm happy to build
that route.

---

## 5. Next.js Image Optimizer (`/_next/image`)

**Before:** no `images.remotePatterns` configured at all.
**Finding:** every `<Image>` usage in the codebase (`grep -rn "<Image"`)
uses a local path under `/public` — there are zero remote image sources in
the app today. Next.js already refuses any remote `src` that isn't
explicitly allow-listed, so this wasn't actively exploitable, but leaving
it unconfigured is a footgun for the future (adding one remote image
anywhere silently opens the optimizer to that host, or worse, to
`domains: ['*']`-style mistakes).

**Fix**, in `next.config.js`:
```js
images: {
  remotePatterns: [],       // no remote hosts allow-listed — SSRF-proof by default
  deviceSizes: [360, 640, 768, 1024, 1280, 1600, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  qualities: [60, 75, 90],
  minimumCacheTTL: 60 * 60 * 24,
}
```
`deviceSizes`/`imageSizes`/`qualities` cap the `w=`/`q=` values the
optimizer endpoint will honor, so it can't be hit with arbitrary
oversized/high-quality render requests.

---

## 6. Dependencies

Ran `npm audit --audit-level=moderate` after `npm install`. Full findings:

| Package | Severity | Where used | Status |
|---|---|---|---|
| `next` | High (multiple CVEs) | production | **Partially fixed** — bumped `14.2.18` → `14.2.35` (latest patch on the 14.x line). See note below — this does **not** close everything. |
| `next-intl` | Moderate (open redirect, prototype pollution) | production | **Not fixed** — fix requires `next-intl@4.13.4`, a breaking major-version bump (v3 → v4). Documented, not applied blind. |
| `postcss` | High (XSS in stringify output, source-map path traversal) | **build-time only**, bundled transitively via `next`'s own dependency tree | Fix ships with the Next.js major upgrade (§ below). Not exploitable at runtime — it's a build tool, not shipped to the browser. |
| `brace-expansion`, `glob`, `eslint`, `eslint-config-next` | High | **devDependencies only** (lint tooling) | Not shipped to production/runtime at all — these never run on `dizatravels.co.za` or touch a visitor's request. Lower real-world risk; still worth fixing via `npm audit fix --force` on `eslint` when convenient, since it's a dev-only major bump with no site impact. |

**Next.js — the important finding:** as of Vercel's May 2026 and July 2026
coordinated security releases, **Next.js 14.x is fully end-of-life and no
longer receives security back-ports at all.** Only the 15.5.x and 16.2.x
lines get patches now. That means several of the advisories `npm audit`
flags (SSRF in Server Actions/rewrites, RSC cache poisoning, App Router XSS
via CSP nonces, DoS in Server Components) have **no fix available on 14.x,
full stop** — the only way to close them is upgrading to `next@15.5.21` or
`next@16.2.11` (current LTS lines as of this writing).

**Why I didn't do that in this pass:** it's a breaking major-version
migration, not a patch bump:
- 9 page files (`src/app/[locale]/**/page.tsx`, `layout.tsx`) destructure
  `params: { locale }` synchronously — Next.js 15+ requires `params` (and
  `searchParams`) to be awaited as a `Promise`. Every one of those files
  needs a signature change.
- `next-intl` v3 → v4 has its own breaking changes tracking the Next.js
  bump.
- React 18 → 19 comes along with it.
- I have no way to browser-test the result against your real production
  traffic/CDN/edge config from this sandbox — a live travel-booking site is
  the wrong place to land an untested major upgrade in one shot.

**Recommendation:** treat "upgrade to Next 15.5.21 or 16.2.11" as the
**single highest-priority follow-up** from this audit — ideally on a
preview branch/deployment first. I'm happy to do that migration as a
dedicated piece of work with you reviewing the preview URL before it goes
to production.

---

## 7. Exposures

Checked and confirmed clean:
- **`.env*`**: only `.env.example` is committed (placeholders/comments
  only, no real values). `.gitignore` already excludes `.env`, `.env*.local`.
- **`/next.config.js`, `/.env` served directly**: tested against a running
  production build — both return `307` (redirected into the locale-prefixed
  404 flow), not file contents.
- **Source maps**: `productionBrowserSourceMaps` was unset (defaults to
  `false`, i.e. already off) — set explicitly to `false` now so it can't
  silently regress.
- **`robots.txt`**: disallows `/api/` (no API routes exist yet, but this is
  correctly future-proofed), allows everything else — appropriate for a
  public marketing/booking site.
- **`sitemap.xml`**: generated from static route + tour data, no
  sensitive/internal URLs.
- **`/api` routes**: none exist in this codebase.
- **No secrets or PII** found committed anywhere in `src/` or `messages/`.

---

## 8. TLS / hosting — needs to be done at the Vercel/Cloudflare level

These can't be set in application code — you'll need to configure them in
the Vercel dashboard (and Cloudflare, if it's in front of Vercel):

- **HSTS preload submission**: the header now sends `preload`, but being on
  the actual [hstspreload.org](https://hstspreload.org) list requires
  submitting `dizatravels.co.za` there separately. Do this only once you're
  confident every subdomain you'll ever use is HTTPS-only — `preload` is
  very hard to reverse quickly.
- **TLS version/cipher policy**: Vercel manages this automatically (TLS 1.2+
  by default) — nothing to configure unless you're on a custom SSL setup;
  worth a quick check in Project Settings → Domains that the cert is valid
  and auto-renewing.
- **WAF / bot protection**: not enabled by default. If you want protection
  beyond the honeypot in §4, Vercel's Attack Challenge Mode / Firewall
  (paid tiers) or putting Cloudflare in front with its WAF rules would be
  the next layer.
- **Redirect enforcement**: confirm in Vercel that HTTP→HTTPS redirect is
  enforced project-wide (it is by default on Vercel, but worth a manual
  check given the custom domain).

---

## 9. Verification performed

- `npm run build` — succeeds, all 200 pages (10 locales × routes) generate
  cleanly, middleware compiles without error.
- `npm run start` + `curl -sD -` against `/en` and `/en/contact` — confirmed
  every header from §1 and the exact `frame-ancestors` rule from §2 are
  present on live responses.
- `curl` against `/.env` and `/next.config.js` on the running build — both
  return `307`, not file contents.
- `npm audit --audit-level=moderate` — run before and after fixes; results
  captured in §6.

---

## 10. Follow-up work (not done in this pass, flagged intentionally)

1. **Upgrade Next.js to 15.5.21 or 16.2.11 LTS** (§6) — highest priority,
   needs a dedicated migration + preview-deploy test cycle.
2. **Nonce-based CSP** to drop `'unsafe-inline'` from `script-src`/
   `style-src` (§1) — meaningfully tightens XSS mitigation, needs
   layout-wide changes and browser testing.
3. **Real `/api/booking` route** if you want actual rate limiting/CAPTCHA/
   CSRF protection on bookings (§4) — currently N/A because there's no
   backend to protect.
4. **Confirm/locate the Google Maps key** (§3) — I could not find it in
   this codebase and need your input on where you saw it.
5. **`eslint`/`glob`/`brace-expansion` dev-tooling bump** (§6) — low
   priority, zero runtime/production impact, but a `npm audit fix --force`
   on the lint toolchain when convenient would clear the remaining
   `npm audit` noise.

---

## Summary table

| Issue | Severity | Status |
|---|---|---|
| Missing security headers (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy) | High | **Fixed** |
| `X-Powered-By` header exposed | Low | **Fixed** |
| No framing restriction (clickjacking) | Critical | **Fixed** — `frame-ancestors 'self' https://rollingrover.co.za https://www.rollingrover.co.za` |
| Google Maps API key allegedly exposed | High (if real) | **Needs your input** — key not found anywhere in this repo |
| Booking form: header-injection hardening | Medium | **Fixed** (control-char stripping, defense-in-depth) |
| Booking form: XSS via rendered input | Medium | **Verified clean** — no sink found |
| Booking form: server-side validation/rate limit/CSRF/CAPTCHA | Medium | **N/A** — no backend exists; documented, honeypot added as the one applicable mitigation |
| `/_next/image` open to arbitrary remote URLs (SSRF) | Medium | **Fixed** — `remotePatterns: []`, size/quality caps |
| `next` — multiple high-severity CVEs, several unpatched on 14.x | High | **Partially fixed** (14.2.18→14.2.35); full fix **needs-major-upgrade** to 15.5.21/16.2.11 |
| `next-intl` — open redirect, prototype pollution | Moderate | **needs-major-upgrade** (v3→v4, breaking) |
| `postcss`, `eslint`/`glob`/`brace-expansion` | High | **needs-dev-tooling-update** — build-time/dev-only, not exploitable in production |
| Source maps / `.env` / `next.config.js` exposure | — | **Verified clean**, hardened explicitly |
| `productionBrowserSourceMaps` unset | Low | **Fixed** — explicitly disabled |
| robots.txt / sitemap leaking sensitive routes | — | **Verified clean** |
| HSTS preload list submission | — | **needs-host-config** (hstspreload.org, manual) |
| TLS version / cert management | — | **needs-host-config** (Vercel manages by default — verify) |
| WAF / bot protection beyond honeypot | — | **needs-host-config** (Vercel Firewall or Cloudflare, optional) |

---

## Changelog

**2026-07-26 (follow-up):** Fixed a regression introduced by the original
`src/middleware.ts` change in this audit. The matcher was widened to
`/((?!favicon.ico).*)` so security headers apply to every route, but the
function body only excluded `/api` and `/_next` from next-intl's
locale-rewriting — it no longer excluded static asset paths (anything with
a file extension), which the *original* pre-audit matcher had correctly
excluded via `.*\..*`. Result: requests for `/images/logo/...png`,
`/robots.txt`, `/sitemap.xml`, `/icon.png`, and `/apple-icon.png` were being
run through `next-intl`'s middleware, which treats an unprefixed path as
missing its locale and 307-redirects it to `/en/<path>` — a URL that
doesn't exist for any of these, since they're static files or generated
root-level routes, not locale pages. This silently broke the site logo and
those root files sitewide (most visible on mobile, where the nav re-renders
the logo image on menu open/scroll).

**Fix:** added a regex check (`/\.[a-zA-Z0-9]+$/`) alongside the `/api` and
`/_next` checks, so any path with a file extension skips locale-rewriting
but still gets the full security header set. Verified via `curl` against a
running production build: `/images/logo/diza-logo-horizontal.png`,
`/robots.txt`, `/sitemap.xml`, `/icon.png`, `/apple-icon.png`, and
`/favicon.ico` all return `200` (previously `307`), while `/en`, `/fr`, and
the image path itself all still carry the complete CSP/HSTS/etc. header
set including `frame-ancestors`.

