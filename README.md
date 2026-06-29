# 🦏 DIZA TRAVELS — Next.js 14 Website (10-Language)

A high-performance, SEO-optimized, fully internationalized (10 languages) rebuild of
[dizatravels.co.za](https://www.dizatravels.co.za), built with Next.js 14 App Router,
TypeScript, Tailwind CSS, and `next-intl`.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000  (redirects to /en automatically)
```

```bash
npm run build   # production build — pre-renders ~190 static pages (8 routes × 10 locales,
                # plus 11 tours × 10 locales)
npm run start   # serve the production build locally
```

---

## 🌍 10-Language Architecture

| Locale | Language | Status |
|---|---|---|
| `en` | English | ✅ Fully written |
| `zu` | isiZulu | 🔶 Placeholder — ready for translator |
| `zh` | Chinese (Simplified) | 🔶 Placeholder |
| `ru` | Russian | 🔶 Placeholder |
| `hi` | Hindi | 🔶 Placeholder |
| `pt` | Portuguese | 🔶 Placeholder |
| `es` | Spanish | 🔶 Placeholder |
| `nl` | Dutch | 🔶 Placeholder |
| `de` | German | 🔶 Placeholder |
| `fr` | French | 🔶 Placeholder |

Every route is locale-prefixed: `/en/tours`, `/de/tours`, `/zh/tours`, etc.
`middleware.ts` auto-detects the visitor's browser language and redirects
accordingly on first visit; the `LocaleSwitcher` dropdown in the header lets
visitors change language manually at any time, **preserving their current
page** (switching from `/de/tours/big-5-safari` to French lands on
`/fr/tours/big-5-safari`, not the French homepage).

### Sending files to a translator

See **`messages/README.md`** for the full workflow. Short version: every
non-English `messages/{locale}.json` file has the exact same keys as
`en.json`, with values wrapped like `"[TRANSLATE: English text here]"`.
Send the file, translator replaces the wrapped text, you drop it back in —
zero code changes needed.

**Verify parity any time** (after receiving a translated file, or after
adding new UI text yourself):

```bash
node scripts/verify-locale-parity.js
```

---

## 📸 Adding Real Photos

This build ships with **generated gradient placeholders** for any photo not
supplied in the original asset ZIP, clearly labeled so they're obvious to
spot and swap. Real photos that WERE supplied are already in place:

| Real photo (already in place) | Location |
|---|---|
| Founder Chris Manqele on safari | `public/images/about-founder.jpg` |
| Branded shuttle fleet | `public/images/tours/shuttle-fleet.jpg` |
| Marketing banner (lodge shuttle) | `public/images/tours/shuttle-banner.png` |
| Quad biking (×4) | `public/images/gallery/quad-biking-*.jpg` |
| Safari vehicle with guests | `public/images/gallery/safari-vehicle-guests.jpg` |

### To replace a placeholder:

1. Drop your photo into the relevant folder under `public/images/`
   (`tours/`, `gallery/`, `hero/`, `about-founder.jpg`, etc.) — **keep the
   exact same filename** to avoid touching any code.
2. That's it. Next.js's `<Image>` component picks it up automatically.

### To add a brand-new tour image (not just replace one):

1. Add the photo to `public/images/tours/your-photo.jpg`
2. Open `src/data/tours.ts`, find the relevant tour entry, update its
   `image:` field to point at your new filename.

### To add/reorder Gallery photos:

Edit `src/data/gallery.ts` — see the comment block at the top of that file.

---

## 🗂 Project Structure

```
diza-next/
├── messages/                       ← All 10 language files + README
│   ├── en.json                     ← Source of truth (fully written)
│   ├── zu.json  zh.json  ru.json   ← Placeholder, ready for translation
│   ├── hi.json  pt.json  es.json
│   ├── nl.json  de.json  fr.json
│   └── README.md                   ← Translator workflow instructions
│
├── scripts/
│   └── verify-locale-parity.js     ← Run after editing any locale file
│
├── src/
│   ├── i18n.ts                     ← Locale list, labels, message loader
│   ├── middleware.ts                ← Locale detection & routing
│   ├── navigation.ts                ← Locale-aware Link/router/usePathname
│   │
│   ├── app/
│   │   ├── layout.tsx               ← Minimal root shell (required by Next.js)
│   │   ├── sitemap.ts                ← All routes × all 10 locales
│   │   ├── robots.ts
│   │   ├── favicon.ico  icon.svg  icon.png  apple-icon.png
│   │   │
│   │   └── [locale]/
│   │       ├── layout.tsx           ← <html lang>, hreflang, IntlProvider,
│   │       │                           TravelAgency + LocalBusiness JSON-LD
│   │       ├── page.tsx             ← Homepage
│   │       ├── not-found.tsx        ← Localized 404
│   │       ├── services/page.tsx    ← 4 SEO keyword sections
│   │       ├── tours/
│   │       │   ├── page.tsx         ← All 11 tours grid
│   │       │   └── [slug]/page.tsx  ← Dynamic tour detail (generateStaticParams)
│   │       ├── pricing/page.tsx     ← Full rate card
│   │       ├── gallery/page.tsx     ← Photo grid + lightbox
│   │       ├── about/page.tsx       ← Founder story (Chris Manqele)
│   │       └── contact/page.tsx     ← BookingForm + Google Maps embed
│   │
│   ├── components/
│   │   ├── layout/      Navbar, Footer, LocaleSwitcher, WhatsAppFloat
│   │   ├── booking/      BookingForm (Zod-validated)
│   │   ├── services/     ServiceSection (alternating keyword blocks)
│   │   ├── gallery/      GalleryGrid (lightbox)
│   │   └── ui icons etc.
│   │
│   ├── data/
│   │   ├── business.ts   ← NAP, GPS, socials, partners — single source of truth
│   │   ├── tours.ts       ← All 11 tours: slugs, rates, images
│   │   └── gallery.ts     ← Gallery photo list
│   │
│   └── lib/
│       ├── schema.ts       ← JSON-LD builders (TravelAgency, LocalBusiness,
│       │                      TouristTrip, Service, BreadcrumbList)
│       └── booking-schema.ts ← Zod validation schema
│
└── public/images/           ← All photos (real + placeholder)
```

---

## 🏢 Business Data (Single Source of Truth)

All contact details, GPS coordinates, social links, and tourism partners
live in **`src/data/business.ts`**. Update it once, and it propagates to:
the footer, contact page, JSON-LD `LocalBusiness`/`TravelAgency` schema,
and the Google Maps embed.

**Current values:**
- **Booking Office:** Diza Travels Booking Office, Kwa-Smolo, Hluhluwe
- **GPS:** -28.01° S, 32.25° E
- **Phones:** +27 69 562 0240 / +27 79 670 2530
- **Email:** safari@dizatravels.co.za

---

## 📋 Booking Form

`src/components/booking/BookingForm.tsx` — used on `/contact` and every
tour detail page. Validates with Zod (`src/lib/booking-schema.ts`) for
name, email, phone (regex-checked), service type, date, and guest count.
Currently submits via `mailto:safari@dizatravels.co.za` (zero backend
required). To wire up a real API route later, see the `TODO` comment
inside `handleSubmit()` — it's a one-function change.

---

## 🔍 SEO Implementation Summary

- **`generateMetadata`** on every page — unique title/description per
  locale, pulling from translated content
- **Hreflang**: every page emits `alternates.languages` for all 10 locales
  + `x-default`, rendered by Next.js as `<link rel="alternate" hreflang>`
- **JSON-LD schema**: `TravelAgency` + `LocalBusiness` site-wide (root
  layout), `TouristTrip`/`Service` per tour, `BreadcrumbList` per page,
  `Person` schema for founder Chris Manqele on `/about`
- **`sitemap.ts`**: generates ~190 URLs (8 static routes + 11 tour pages,
  × 10 locales), each with its own hreflang alternates block
- **Images**: 100% `next/image`, 100% descriptive `alt` text (audited —
  zero raw `<img>` tags anywhere in the codebase)
- **Target keywords** woven into H1/H2/alt text/meta across Services,
  Homepage, Contact, Pricing: "Game Drive safari Hluhluwe", "Kwa-Smolo",
  "Mozambique Shuttle", "iSwathini Border", "Airport shuttle King Shaka to
  Hluhluwe", "Lodge shuttle service Zululand"

---

## 🛠 Tech Stack

- **Next.js 14** (App Router, SSG via `generateStaticParams`)
- **TypeScript** (strict mode)
- **Tailwind CSS** (custom brand tokens in `tailwind.config.js`)
- **next-intl** (i18n routing, message loading, locale-aware navigation)
- **Zod** (form validation)
- **react-icons** (social/partner icons)

---

Built for **DIZA TRAVELS Safari's & Shuttle Services** — Hluhluwe, Kwa-Smolo,
KwaZulu-Natal, South Africa 🦏
*From Door to Wild, Your Safari Starts Here.*
