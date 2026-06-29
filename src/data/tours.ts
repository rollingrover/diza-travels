/**
 * ─────────────────────────────────────────────────────────────────────────
 * TOURS DATA — Single Source of Truth
 * ─────────────────────────────────────────────────────────────────────────
 * This file holds the STRUCTURAL data for every tour/experience: slugs,
 * image paths, prices, durations, category. It does NOT hold display text
 * (titles, descriptions) — that lives in messages/{locale}.json under the
 * "Tours.{key}" namespace, keyed by `i18nKey` below.
 *
 * Why split it this way:
 *   - `generateStaticParams()` for [slug] pages needs this data at BUILD
 *     time, before any locale/message loading happens.
 *   - `sitemap.ts` needs the slug list for every locale × route combo.
 *   - JSON-LD schema generation needs prices/currency, which don't change
 *     per-locale (we don't currency-convert, just translate labels).
 *   - Keeping copy in messages/ keeps ALL translatable text in ONE place
 *     for translators, rather than scattered across data files.
 *
 * To add a new tour: add an entry here, then add a matching
 * "Tours.yourKey" block to ALL 10 messages/{locale}.json files (run
 * scripts/verify-locale-parity.js after).
 * ─────────────────────────────────────────────────────────────────────────
 */

export type TourCategory = 'safari' | 'hike' | 'shuttle' | 'cruise' | 'cultural' | 'conservation' | 'adventure' | 'excursion';

export interface RateRow {
  /** Plain description — NOT translated (kept short/numeric), e.g. "3hrs" */
  duration: string;
  priceZAR: number;
  /** 'person' | 'vehicle' | 'booking' */
  unit: 'person' | 'vehicle' | 'booking';
  /** Optional: only show for SA citizens / international visitors */
  audience?: 'all' | 'sa-citizen' | 'international';
  /** Optional sub-label, e.g. "Adult" / "Child" */
  ageGroup?: 'adult' | 'child';
}

export interface Tour {
  /** URL slug — used in /{locale}/tours/{slug} */
  slug: string;
  /** Key matching messages/{locale}.json → Tours.{i18nKey} */
  i18nKey: string;
  category: TourCategory;
  /** Hero/card image — served from /public/images/tours/ */
  image: string;
  imageAlt: string; // English fallback alt text (locale-aware alt built at render time using i18n + this as fallback)
  gallery?: string[];
  rates: RateRow[];
  /** Lowest price, used for "From RXXX" badges & schema.org priceRange */
  fromPriceZAR: number;
  /** Approx duration for schema.org TouristTrip */
  durationHours?: number;
  /** Is this a new/recently-added experience (badge) */
  isNew?: boolean;
  /** Requires advance booking notice (e.g. cultural tours) */
  requiresAdvanceBooking?: boolean;
  /** Minimum advance notice in days, if applicable */
  minAdvanceDays?: number;
  /** Minimum number of people required to book */
  minPax?: number;
}

export const tours: Tour[] = [
  {
    slug: 'big-5-safari',
    i18nKey: 'safari',
    category: 'safari',
    image: '/images/tours/safari-hero.jpg',
    imageAlt: 'Safari game drive vehicle with guests in Hluhluwe-iMfolozi Game Park',
    gallery: [
      '/images/tours/safari-1.jpg',
      '/images/tours/safari-2.jpg',
    ],
    rates: [
      // Individual Safari (min 4 pax) — confirmed Oct 2024 price list
      { duration: '3 hrs',     priceZAR: 550, unit: 'person', audience: 'all' },
      { duration: '6 hrs',     priceZAR: 750, unit: 'person', audience: 'all' },
      { duration: '8–9 hrs',   priceZAR: 1050, unit: 'person', audience: 'all' },
    ],
    fromPriceZAR: 450,
    durationHours: 3,
    minPax: 4,
  },
  {
    slug: 'lebombo-hike',
    i18nKey: 'hike',
    category: 'hike',
    image: '/images/tours/lebombo-hero.jpg',
    imageAlt: 'Hikers overlooking the Lebombo Mountains in KwaZulu-Natal',
    rates: [
      { duration: 'Full day', priceZAR: 500, unit: 'person', audience: 'all' },
    ],
    fromPriceZAR: 500,
    durationHours: 2.5,
    requiresAdvanceBooking: true,
  },
  {
    slug: 'shuttle-transfers',
    i18nKey: 'shuttle',
    category: 'shuttle',
    image: '/images/tours/shuttle-hero.jpg',
    imageAlt: 'DIZA TRAVELS branded shuttle vehicles parked and ready for transfer',
    rates: [
      { duration: 'King Shaka Intl ↔ Hluhluwe', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Hluhluwe ↔ St. Lucia', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Richards Bay ↔ Hluhluwe', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Hluhluwe ↔ Sodwana', priceZAR: 0, unit: 'vehicle' },
    ],
    fromPriceZAR: 0, // "Enquire for rates" — see Pricing.enquireForRates
    minPax: 1,
  },
  {
    slug: 'airport-shuttle-king-shaka',
    i18nKey: 'airportShuttle',
    category: 'shuttle',
    image: '/images/tours/shuttle-fleet.jpg',
    imageAlt: 'DIZA TRAVELS branded shuttle van and vehicles for King Shaka Airport transfers',
    rates: [
      { duration: 'KSIA ↔ Hluhluwe (one-way)', priceZAR: 0, unit: 'vehicle' },
      { duration: 'KSIA ↔ St. Lucia (one-way)', priceZAR: 0, unit: 'vehicle' },
    ],
    fromPriceZAR: 0,
    minPax: 1,
  },
  {
    slug: 'lodge-hotel-shuttle',
    i18nKey: 'lodgeShuttle',
    category: 'shuttle',
    image: '/images/tours/shuttle-banner.png',
    imageAlt: 'DIZA TRAVELS shuttle fleet used for lodge and hotel transfers in Zululand',
    rates: [
      { duration: 'Anew Hotel ↔ KSIA', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Anew Hotel ↔ St. Lucia', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Phinda Lodges ↔ KSIA', priceZAR: 0, unit: 'vehicle' },
      { duration: 'RCB ↔ Anew Hotel', priceZAR: 0, unit: 'vehicle' },
    ],
    fromPriceZAR: 0,
    minPax: 1,
  },
  {
    slug: 'mozambique-iswatini-border-shuttle',
    i18nKey: 'crossBorderShuttle',
    category: 'shuttle',
    image: '/images/tours/border-shuttle-placeholder.jpg',
    imageAlt: 'Cross-border shuttle route map placeholder for Mozambique and iSwathini transfers',
    rates: [
      { duration: 'Hluhluwe ↔ Kosi Bay (Mozambique border)', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Hluhluwe ↔ Ponta do Ouro (Mozambique)', priceZAR: 0, unit: 'vehicle' },
      { duration: 'Hluhluwe ↔ iSwathini border', priceZAR: 0, unit: 'vehicle' },
    ],
    fromPriceZAR: 0,
    minPax: 2,
    requiresAdvanceBooking: true,
    minAdvanceDays: 2,
  },
  {
    slug: 'st-lucia-boat-cruise',
    i18nKey: 'cruise',
    category: 'cruise',
    image: '/images/tours/cruise-hero.jpg',
    imageAlt: 'Boat cruise on the St. Lucia Estuary with hippos nearby',
    rates: [
      { duration: '2 hrs', priceZAR: 550, unit: 'person', ageGroup: 'adult', audience: 'sa-citizen' },
      { duration: '2 hrs', priceZAR: 250, unit: 'person', ageGroup: 'child', audience: 'sa-citizen' },
      { duration: '2 hrs', priceZAR: 550, unit: 'person', ageGroup: 'adult', audience: 'international' },
      { duration: '2 hrs', priceZAR: 250, unit: 'person', ageGroup: 'child', audience: 'international' },
    ],
    fromPriceZAR: 250,
    durationHours: 2,
  },
  {
    slug: 'kwasmolo-cultural-tour',
    i18nKey: 'cultural',
    category: 'cultural',
    image: '/images/tours/cultural-hero.jpg',
    imageAlt: 'Zulu dancers performing traditional dance for visitors in KwaSmolo community',
    gallery: [
      '/images/tours/cultural-1.jpg',
      '/images/tours/cultural-2.jpg',
      '/images/tours/cultural-3.jpg',
    ],
    rates: [
      { duration: 'Half day', priceZAR: 500, unit: 'person', ageGroup: 'adult' },
      { duration: 'Half day', priceZAR: 250, unit: 'person', ageGroup: 'child' },
    ],
    fromPriceZAR: 250,
    durationHours: 4,
    requiresAdvanceBooking: true,
    minAdvanceDays: 2,
    minPax: 2,
  },
  {
    slug: 'tembe-conservation-experience',
    i18nKey: 'tembe',
    category: 'conservation',
    image: '/images/tours/tembe-hero.jpg',
    imageAlt: 'Lion pride at a waterhole in Tembe Elephant Park, KwaZulu-Natal',
    rates: [
      { duration: '2–3 hrs', priceZAR: 1500, unit: 'person' },
    ],
    fromPriceZAR: 1500,
    durationHours: 3,
    isNew: true,
    minPax: 6,
    requiresAdvanceBooking: true,
    minAdvanceDays: 7,
  },
  {
    slug: 'quad-bike-adventure',
    i18nKey: 'quad',
    category: 'adventure',
    image: '/images/tours/quad-hero.jpg',
    imageAlt: 'Guests riding quad bikes on a guided off-road adventure near Hluhluwe',
    gallery: [
      '/images/tours/quad-1.jpg',
      '/images/tours/quad-2.jpg',
      '/images/tours/quad-3.jpg',
    ],
    rates: [
      { duration: 'Half day', priceZAR: 0, unit: 'person' }, // POA — confirm with owner
    ],
    fromPriceZAR: 0,
    isNew: true,
  },
  {
    slug: 'day-excursions',
    i18nKey: 'excursions',
    category: 'excursion',
    image: '/images/tours/excursions-hero.jpg',
    imageAlt: 'Cheetah close-up during a guided excursion in KwaZulu-Natal',
    rates: [
      { duration: 'Cheetah Visit',        priceZAR: 550, unit: 'person', ageGroup: 'adult', audience: 'sa-citizen' },
      { duration: 'Cheetah Visit',        priceZAR: 250, unit: 'person', ageGroup: 'child', audience: 'sa-citizen' },
      { duration: 'Cheetah Visit',        priceZAR: 550, unit: 'person', ageGroup: 'adult', audience: 'international' },
      { duration: 'Cheetah Visit',        priceZAR: 250, unit: 'person', ageGroup: 'child', audience: 'international' },
      { duration: 'Elephant Interaction', priceZAR: 750, unit: 'person', ageGroup: 'adult', audience: 'all' },
      { duration: 'Elephant Interaction', priceZAR: 400, unit: 'person', ageGroup: 'child', audience: 'all' },
      { duration: 'River Cruise',         priceZAR: 550, unit: 'person', ageGroup: 'adult', audience: 'all' },
      { duration: 'River Cruise',         priceZAR: 250, unit: 'person', ageGroup: 'child', audience: 'all' },
      { duration: 'Crocodile Farm',       priceZAR: 170, unit: 'person', ageGroup: 'adult', audience: 'all' },
      { duration: 'Crocodile Farm',       priceZAR: 120, unit: 'person', ageGroup: 'child', audience: 'all' },
      { duration: 'Gin Distillery',       priceZAR: 280, unit: 'person', ageGroup: 'adult', audience: 'all' },
      { duration: 'Beer Tasting',         priceZAR: 100, unit: 'person', ageGroup: 'adult', audience: 'all' },
    ],
    fromPriceZAR: 100,
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}

export function getAllTourSlugs(): string[] {
  return tours.map(t => t.slug);
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * GROUP SAFARI RATES — separate tier for 20+ guest groups
 * ─────────────────────────────────────────────────────────────────────────
 * Sourced from the official Oct 2024 "Pricing & Packages" price list.
 * Distinct from the individual safari rates on the Big 5 Safari tour page
 * (which require a minimum of 4 pax, not 20+), so kept as separate
 * structured data rather than folded into the `tours` array.
 */
export const groupSafariRates: RateRow[] = [
  { duration: '3 hrs',   priceZAR: 400, unit: 'person', audience: 'all' },
  { duration: '6 hrs',   priceZAR: 650, unit: 'person', audience: 'all' },
  { duration: '8–9 hrs', priceZAR: 950, unit: 'person', audience: 'all' },
];

/** Park entry fees — paid directly by guests, not included in tour price */
export const parkEntryFees = {
  international: 300,
  saCitizen: 150,
};

/** Optional lunch add-on for safari tours */
export const lunchAddOnZAR = 300;

/**
 * Quote-on-request extras — niche/seasonal experiences with no fixed
 * public rate. Listed on the Pricing page with a "request a quote" CTA
 * rather than a price.
 */
export const quoteOnRequestExtras = [
  { name: 'Pineapple Farm Tour', note: 'Quote on request' },
  { name: 'Turtle Tours', note: 'Quote on request / Seasonal (Nov–Feb)' },
];
