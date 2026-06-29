import { business } from '@/data/business';
import { tours, type Tour } from '@/data/tours';
import { locales, type Locale } from '@/i18n';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * JSON-LD SCHEMA BUILDERS
 * ─────────────────────────────────────────────────────────────────────────
 * Centralised structured-data generation so every page emits consistent,
 * valid schema.org markup. Inject the returned object into a page via:
 *
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 *
 * Three schema types are covered per the brief:
 *   1. TravelAgency   — the business itself (site-wide, in root layout)
 *   2. TouristAttraction (mapped to TouristTrip for individual tours, which
 *      is the more precise schema.org type for a bookable guided
 *      experience — TouristAttraction is reserved for the destination/
 *      place itself, e.g. "Hluhluwe-iMfolozi Park". We use TouristTrip for
 *      our tour PRODUCT pages and additionally emit a lightweight
 *      "about" TouristAttraction reference where the tour visits a named
 *      attraction.)
 *   3. Service        — for the shuttle/transfer offering, which is a
 *      transport service rather than a "trip" in the schema.org sense.
 * ─────────────────────────────────────────────────────────────────────────
 */

const SITE_URL = business.website;

/** Build the canonical + hreflang-aware URL for a given locale/path */
function localizedUrl(locale: string, path: string = '') {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * 0. LocalBusiness schema — supplements TravelAgency with the precise
 * physical-location signals Google Local Pack / Maps relies on most
 * heavily. TravelAgency (above) is itself a subtype of LocalBusiness in
 * schema.org's hierarchy, but we emit both: TravelAgency for the rich
 * "makesOffer" tour catalogue, and this leaner LocalBusiness block
 * specifically for local-pack/map accuracy with the exact GPS pin.
 */
export function buildLocalBusinessSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: business.address.officeName,
    alternateName: business.legalName,
    image: `${SITE_URL}/images/og/diza-og-default.jpg`,
    url: localizedUrl(locale),
    telephone: [business.contact.phonePrimaryDisplay, business.contact.phoneSecondaryDisplay],
    email: business.contact.emailBusiness,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    hasMap: `https://www.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '20:00',
    },
    sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok],
  };
}

/**
 * 1. TravelAgency schema — represents DIZA TRAVELS as a business entity.
 * Place this once in the root layout so it's present on every page.
 */
export function buildTravelAgencySchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: business.legalName,
    alternateName: business.shortName,
    description:
      'Authentic Big 5 safaris, Lebombo mountain hikes, cultural tours, conservation experiences and shuttle transfers across KwaZulu-Natal, South Africa.',
    url: localizedUrl(locale),
    logo: `${SITE_URL}/images/logo/diza-logo.png`,
    image: `${SITE_URL}/images/og/diza-og-default.jpg`,
    telephone: business.contact.phonePrimaryDisplay,
    email: business.contact.emailBusiness,
    priceRange: business.priceRange,
    currenciesAccepted: business.currenciesAccepted,
    founder: {
      '@type': 'Person',
      name: business.founder.name,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.areasServed.map(name => ({
      '@type': 'Place',
      name,
    })),
    sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok],
    // Every available tour, referenced as offerings of this agency
    makesOffer: tours.map(tour => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'TouristTrip',
        name: tour.i18nKey, // resolved client-side via translations; raw key kept simple here
        url: localizedUrl(locale, `/tours/${tour.slug}`),
      },
      priceCurrency: 'ZAR',
      price: tour.fromPriceZAR || undefined,
    })),
  };
}

/**
 * 2. TouristTrip schema — for an individual bookable tour/experience page.
 * `translatedName` / `translatedDescription` should come from the
 * resolved next-intl messages for the current locale (passed in by the
 * page component, since this lib file has no access to the `t()` hook).
 */
export function buildTouristTripSchema(
  tour: Tour,
  locale: Locale,
  translatedName: string,
  translatedDescription: string
) {
  const url = localizedUrl(locale, `/tours/${tour.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: translatedName,
    description: translatedDescription,
    url,
    image: `${SITE_URL}${tour.image}`,
    provider: {
      '@type': 'TravelAgency',
      '@id': `${SITE_URL}/#organization`,
      name: business.legalName,
    },
    touristType: ['Families', 'Couples', 'Solo Travelers', 'Groups'],
    ...(tour.durationHours && {
      duration: `PT${tour.durationHours}H`, // ISO 8601 duration
    }),
    offers: tour.rates
      .filter(r => r.priceZAR > 0)
      .map(rate => ({
        '@type': 'Offer',
        name: rate.duration,
        priceCurrency: 'ZAR',
        price: rate.priceZAR,
        availability: 'https://schema.org/InStock',
        ...(rate.unit === 'person' && {
          eligibleQuantity: { '@type': 'QuantitativeValue', unitText: 'per person' },
        }),
      })),
  };
}

/**
 * 3. Service schema — specifically for the Shuttle & Transfers offering,
 * which is better modelled as a transport Service than a TouristTrip.
 */
export function buildShuttleServiceSchema(locale: Locale, translatedName: string, translatedDescription: string) {
  const url = localizedUrl(locale, '/tours/shuttle-transfers');

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    serviceType: 'Airport Transfer & Shuttle Service',
    name: translatedName,
    description: translatedDescription,
    url,
    provider: {
      '@type': 'TravelAgency',
      '@id': `${SITE_URL}/#organization`,
      name: business.legalName,
    },
    areaServed: business.areasServed.map(name => ({
      '@type': 'Place',
      name,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: business.contact.phonePrimaryDisplay,
      availableLanguage: locales,
    },
  };
}

/**
 * BreadcrumbList schema — recommended alongside the above for any
 * non-homepage route. Improves rich-result breadcrumb display in
 * Google search results.
 */
export function buildBreadcrumbSchema(
  locale: Locale,
  crumbs: { name: string; path: string }[] // path WITHOUT locale prefix, e.g. "/tours/big-5-safari"
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: localizedUrl(locale, crumb.path),
    })),
  };
}
