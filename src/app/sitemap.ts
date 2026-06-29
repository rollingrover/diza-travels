import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { business } from '@/data/business';
import { tours } from '@/data/tours';

const SITE_URL = business.website;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * sitemap.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Generates a single sitemap.xml covering EVERY route × ALL 10 locales.
 * Next.js's MetadataRoute.Sitemap type auto-serializes this array to valid
 * XML at /sitemap.xml — no manual XML string-building needed.
 *
 * Each entry also includes `alternates.languages`, which Next.js renders
 * as <xhtml:link rel="alternate" hreflang="xx"> tags inside the sitemap
 * itself — this is the sitemap-level complement to the per-page <head>
 * hreflang tags emitted by generateMetadata, giving search engines two
 * independent signals that reinforce the same language-relationship data.
 *
 * Static routes (locale-only): /, /services, /tours, /pricing, /gallery,
 * /about, /contact
 * Dynamic routes: /tours/{slug} for all 8 tour entries in src/data/tours.ts
 *
 * Total URLs = 10 locales × (7 static + 8 tour) = 150 URLs
 * ─────────────────────────────────────────────────────────────────────────
 */

const STATIC_PATHS = [
  '',           // homepage
  '/services',
  '/tours',
  '/pricing',
  '/gallery',
  '/about',
  '/contact',
];

function buildLanguageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  locales.forEach((loc) => {
    alternates[loc] = `${SITE_URL}/${loc}${path}`;
  });
  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Static routes × all 10 locales ──
  for (const path of STATIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: buildLanguageAlternates(path),
        },
      });
    }
  }

  // ── Dynamic tour detail routes × all 10 locales ──
  for (const tour of tours) {
    const path = `/tours/${tour.slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: buildLanguageAlternates(path),
        },
      });
    }
  }

  return entries;
}
