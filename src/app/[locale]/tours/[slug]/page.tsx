import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { tours, getTourBySlug } from '@/data/tours';
import {
  buildTouristTripSchema,
  buildShuttleServiceSchema,
  buildBreadcrumbSchema,
} from '@/lib/schema';
import BookingForm from '@/components/booking/BookingForm';

const SITE_URL = business.website;

/**
 * generateStaticParams — pre-renders EVERY tour × EVERY locale combination
 * at build time (11 tours × 10 locales = 110 static pages). This is full
 * SSG: zero runtime cost per page request, and every URL is a real,
 * crawlable static file from the moment the build completes.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tours.map((tour) => ({ locale, slug: tour.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const tour = getTourBySlug(slug);
  if (!tour) return {};

  const t = await getTranslations({ locale, namespace: 'Tours' });
  const name = t(`${tour.i18nKey}.name`);
  const description = t(`${tour.i18nKey}.shortDescription`);

  const title = `${name} | DIZA TRAVELS — Hluhluwe, Kwa-Smolo`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${SITE_URL}/${loc}/tours/${slug}`;
  });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/tours/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tours/${slug}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/tours/${slug}`,
      images: [`${SITE_URL}${tour.image}`],
    },
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  safari: '🦏', hike: '⛰️', shuttle: '🚐', cruise: '⛵',
  cultural: '🏡', conservation: '🐘', adventure: '🏍️', excursion: '🐆',
};

export default async function TourDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const t = await getTranslations('Tours');
  const tPricing = await getTranslations('Pricing');
  const name = t(`${tour.i18nKey}.name`);
  const tag = t(`${tour.i18nKey}.tag`);
  const description = t(`${tour.i18nKey}.description`);
  const shortDescription = t(`${tour.i18nKey}.shortDescription`);

  // Use Service schema for shuttle-category tours (more precise schema.org
  // type for transport), TouristTrip for everything else.
  const schema =
    tour.category === 'shuttle'
      ? buildShuttleServiceSchema(locale as Locale, name, description)
      : buildTouristTripSchema(tour, locale as Locale, name, description);

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/tours' },
    { name, path: `/tours/${tour.slug}` },
  ]);

  // Related tours: same category first, then fill with others, max 3
  const related = [
    ...tours.filter((tr) => tr.slug !== tour.slug && tr.category === tour.category),
    ...tours.filter((tr) => tr.slug !== tour.slug && tr.category !== tour.category),
  ].slice(0, 3);

  const hasRealRates = tour.rates.some((r) => r.priceZAR > 0);

  return (
    <div className="bg-bone">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <header className="relative flex min-h-[60vh] items-end overflow-hidden">
        <Image
          src={tour.image}
          alt={`${name} — ${tour.imageAlt}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/50 to-earth/20" />

        <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-12 pt-32">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-white">{t('pageTitle')}</Link>
            <span>/</span>
            <span className="text-white/80">{name}</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth/60 text-2xl backdrop-blur-sm" aria-hidden="true">
              {CATEGORY_ICONS[tour.category] || '🌍'}
            </span>
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-ochre-light">
              {tag}
            </span>
            {tour.isNew && (
              <span className="rounded-full bg-ochre px-3 py-1 font-ui text-xs font-bold text-earth">New!</span>
            )}
          </div>

          {/* H1 */}
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold text-white md:text-5xl">
            {name}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/75 md:text-base">{shortDescription}</p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-content gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">

        {/* Left: description, options, gallery */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="font-display text-2xl font-semibold text-earth">About this experience</h2>
            <div className="mt-4 flex flex-col gap-4">
              {description.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-text-muted md:text-base">
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Booking conditions */}
          {(tour.requiresAdvanceBooking || tour.minPax) && (
            <div className="rounded-xl border border-ochre/30 bg-ochre/5 p-5">
              <h3 className="font-ui text-xs font-bold uppercase tracking-wide text-ochre">
                {t('importantNote')}
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-earth">
                {tour.requiresAdvanceBooking && (
                  <li>
                    ⚠️ Requires advance booking{tour.minAdvanceDays ? ` (minimum ${tour.minAdvanceDays} days)` : ''}.
                  </li>
                )}
                {tour.minPax && <li>👥 Minimum {tour.minPax} guests required.</li>}
              </ul>
            </div>
          )}

          {/* Gallery strip, if available */}
          {tour.gallery && tour.gallery.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-semibold text-earth">Gallery</h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {tour.gallery.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`${name} — photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 220px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross-border note, only rendered for the border-shuttle tour */}
          {tour.i18nKey === 'crossBorderShuttle' && (
            <div className="rounded-xl bg-dusk p-5 text-sm leading-relaxed text-white/75">
              {t('crossBorderShuttle.borderNote')}
            </div>
          )}
        </div>

        {/* Right: rates card + sticky booking CTA */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-mist bg-ivory p-6 shadow-sm">
            <h3 className="font-ui text-xs font-bold uppercase tracking-wide text-text-muted">
              {t('rates')}
            </h3>
            {hasRealRates ? (
              <ul className="mt-3 flex flex-col gap-2.5">
                {tour.rates
                  .filter((r) => r.priceZAR > 0)
                  .map((rate, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-mist/60 pb-2.5 text-sm">
                      <span className="text-earth">
                        {rate.duration}
                        {rate.ageGroup && (
                          <span className="ml-1.5 text-xs text-text-muted">
                            ({rate.ageGroup === 'adult' ? tPricing('adult') : tPricing('child')})
                          </span>
                        )}
                      </span>
                      <span className="font-ui font-bold text-ochre">
                        R{rate.priceZAR} <span className="text-xs font-normal text-text-muted">/{rate.unit === 'person' ? t('perPerson') : rate.unit === 'vehicle' ? t('perVehicle') : ''}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-text-muted">
                Contact us for current rates and availability for this experience.
              </p>
            )}
            <Link
              href="/contact"
              className="mt-5 block w-full rounded-full bg-ochre py-3 text-center font-ui text-sm font-semibold
                         text-earth transition-colors hover:bg-ochre-light"
            >
              {t('bookThisTour')}
            </Link>
          </div>

          {/* Quick contact */}
          <div className="rounded-2xl bg-earth p-6 text-white">
            <h3 className="font-display text-lg font-semibold">Quick questions?</h3>
            <p className="mt-2 text-sm text-white/65">Call or WhatsApp us directly.</p>
            <a href={`tel:${business.contact.phonePrimary}`} className="mt-3 block text-sm text-ochre-light hover:text-white">
              📞 {business.contact.phonePrimaryDisplay}
            </a>
            <a href={`tel:${business.contact.phoneSecondary}`} className="mt-1 block text-sm text-ochre-light hover:text-white">
              📞 {business.contact.phoneSecondaryDisplay}
            </a>
          </div>
        </aside>
      </div>

      {/* Booking form */}
      <div className="mx-auto max-w-2xl px-6 pb-20">
        <BookingForm />
      </div>

      {/* Related tours */}
      {related.length > 0 && (
        <div className="bg-ivory px-6 py-16 md:py-20">
          <div className="mx-auto max-w-content">
            <h2 className="font-display text-2xl font-semibold text-earth">{t('relatedTours')}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((rt) => {
                const rtName = t(`${rt.i18nKey}.name`);
                return (
                  <Link
                    key={rt.slug}
                    href={`/tours/${rt.slug}`}
                    className="group overflow-hidden rounded-xl border border-mist bg-bone shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={rt.image}
                        alt={rtName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base font-semibold text-earth">{rtName}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pb-12 pt-8 text-center">
        <Link href="/tours" className="font-ui text-sm font-semibold text-ochre hover:underline">
          ← {t('backToTours')}
        </Link>
      </div>
    </div>
  );
}
