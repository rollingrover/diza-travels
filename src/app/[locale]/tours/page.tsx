import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { tours } from '@/data/tours';
import { buildBreadcrumbSchema } from '@/lib/schema';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Tours' });

  const title = 'Tours & Experiences — Game Drive, Hikes, Shuttles | DIZA TRAVELS';
  const description =
    'Browse all DIZA TRAVELS experiences: Big 5 Game Drive safaris in Hluhluwe, Lebombo hikes, Mozambique Shuttle & iSwathini Border transfers, cultural tours and conservation experiences.';

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}/tours`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/tours`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tours`,
      languages: languageAlternates,
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/tours` },
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  safari: '🦏',
  hike: '⛰️',
  shuttle: '🚐',
  cruise: '⛵',
  cultural: '🏡',
  conservation: '🐘',
  adventure: '🏍️',
  excursion: '🐆',
};

export default async function ToursPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Tours');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/tours' },
  ]);

  return (
    <div className="bg-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="bg-earth px-6 pb-16 pt-32 text-center md:pt-40">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
          {t('pageEyebrow')}
        </span>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-normal text-white md:text-6xl">
          {t('pageTitle')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-white/65 md:text-base">{t('pageIntro')}</p>
      </header>

      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const name = t(`${tour.i18nKey}.name`);
            const tag = t(`${tour.i18nKey}.tag`);
            const shortDesc = t(`${tour.i18nKey}.shortDescription`);

            return (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-mist/60
                           bg-ivory shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={`${name} — ${tour.imageAlt}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth/70 via-transparent to-transparent" />
                  <span
                    className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg
                               bg-earth/65 text-lg backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {CATEGORY_ICONS[tour.category] || '🌍'}
                  </span>
                  {tour.isNew && (
                    <span className="absolute right-3 top-3 rounded-full bg-ochre px-3 py-1 font-ui text-xs font-bold text-earth">
                      New
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full bg-earth/70 px-3 py-1 font-ui text-[0.65rem]
                                    font-semibold uppercase tracking-wide text-ochre-light backdrop-blur-sm">
                    {tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl font-semibold text-earth">{name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{shortDesc}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-mist pt-4">
                    {tour.fromPriceZAR > 0 ? (
                      <span className="font-ui text-sm font-bold text-ochre">
                        {t('fromPrice')} R{tour.fromPriceZAR}
                      </span>
                    ) : (
                      <span className="font-ui text-xs font-semibold uppercase text-text-muted">
                        Enquire for rates
                      </span>
                    )}
                    <span className="font-ui text-xs font-semibold text-earth group-hover:text-ochre">
                      {t('viewDetails')} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
