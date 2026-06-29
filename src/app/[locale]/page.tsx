import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { tours } from '@/data/tours';
import Testimonials from '@/components/home/Testimonials';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta' });

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}`;

  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates,
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('Home');
  const tTours = await getTranslations('Tours');

  // Feature the first 4 tours on the homepage; full list lives on /tours
  const featured = tours.slice(0, 4);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero/hero-elephants.jpg"
            alt="Elephants at golden hour in Hluhluwe-iMfolozi Game Park"
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-earth/75 via-dusk/58 to-green/48" />
          <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-transparent to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-content px-6 pb-16 pt-40">
          <div className="max-w-2xl">
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
              {t('heroEyebrow')}
            </span>

            {/* H1 — primary page heading */}
            <h1 className="mt-4 font-display leading-[0.95]">
              <span className="block text-3xl font-light text-white md:text-5xl lg:text-6xl">
                {t('heroTitleLine1')}
              </span>
              <span className="block text-5xl italic text-ochre-light md:text-7xl lg:text-8xl">
                {t('heroTitleLine2')}
              </span>
              <span className="block text-6xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl">
                {t('heroTitleLine3')}
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              {t('heroBody')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/tours"
                className="rounded-full bg-ochre px-8 py-4 font-ui text-sm font-semibold text-earth
                           transition-all hover:-translate-y-0.5 hover:bg-ochre-light hover:shadow-lg"
              >
                {t('heroCtaPrimary')}
              </Link>
              <a
                href={`tel:${business.contact.phonePrimary}`}
                className="rounded-full border-2 border-white/50 px-8 py-4 font-ui text-sm font-semibold
                           text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                {t('heroCtaSecondary')}
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4 rounded-2xl border border-ochre/20
                          bg-earth/60 p-6 backdrop-blur-md md:grid-cols-4">
            {[
              { num: t('statBig5'), label: t('statBig5Label'), icon: '🦏' },
              { num: t('statLebombo'), label: t('statLebomboLabel'), icon: '⛰️' },
              { num: t('statShuttle'), label: t('statShuttleLabel'), icon: '🚐' },
              { num: t('statLocal'), label: t('statLocalLabel'), icon: '🌍' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xl" aria-hidden="true">{stat.icon}</span>
                <span className="font-display text-xl font-semibold text-ochre-light md:text-2xl">{stat.num}</span>
                <span className="text-[0.65rem] text-white/55">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="bg-ivory px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre">
            {t('missionEyebrow')}
          </span>
          {/* H2 */}
          <h2 className="mt-3 font-display text-3xl font-normal text-earth md:text-4xl">
            {t('missionTitle')}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted">
            {t('missionBody')}
          </p>
        </div>
      </section>

      {/* ═══ FEATURED SERVICES ═══ */}
      <section className="bg-bone px-6 py-20 md:py-28">
        <div className="mx-auto max-w-content">
          <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre">
                {t('servicesEyebrow')}
              </span>
              {/* H2 */}
              <h2 className="mt-3 font-display text-4xl font-normal leading-tight text-earth md:text-5xl">
                {t('servicesTitle')}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-text-muted md:justify-self-end md:text-right">
              {t('servicesIntro')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {featured.map((tour) => {
              const name = tTours(`${tour.i18nKey}.name`);
              const shortDesc = tTours(`${tour.i18nKey}.shortDescription`);
              return (
                <Link
                  key={tour.slug}
                  href={`/tours/${tour.slug}`}
                  className="group overflow-hidden rounded-2xl border border-mist/60 bg-ivory shadow-sm
                             transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={`${name} — ${tour.imageAlt}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {tour.isNew && (
                      <span className="absolute right-3 top-3 rounded-full bg-ochre px-3 py-1 font-ui text-xs font-bold text-earth">
                        New
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {/* H3 */}
                    <h3 className="font-display text-xl font-semibold text-earth">{name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">{shortDesc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full border-2 border-earth px-8 py-3.5
                         font-ui text-sm font-semibold text-earth transition-colors hover:bg-earth hover:text-white"
            >
              {t('viewAllTours')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Testimonials />

      {/* ═══ CTA STRIP ═══ */}
      <section className="bg-earth px-6 py-16 text-center">
        <h2 className="font-display text-2xl italic text-white md:text-3xl">{t('ctaTitle')}</h2>
        <p className="mt-2 text-sm text-white/60">{t('ctaBody')}</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ochre px-8 py-4
                     font-ui text-sm font-semibold text-earth transition-colors hover:bg-ochre-light"
        >
          {t('ctaButton')}
        </Link>
      </section>
    </>
  );
}
