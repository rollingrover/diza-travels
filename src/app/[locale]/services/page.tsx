import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { buildBreadcrumbSchema } from '@/lib/schema';
import ServiceSection from '@/components/services/ServiceSection';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * generateMetadata for /services — uses the dedicated Services.pageMetaTitle
 * and Services.pageMetaDescription keys, which were specifically written
 * to contain the 5 required exact-match SEO phrases:
 *   "Game drive safari Hluhluwe", "Airport shuttle King Shaka to Hluhluwe",
 *   "Lodge shuttle service Zululand", "Mozambique border transfer from
 *   Hluhluwe", "iSwathini border shuttle service"
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Services' });

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${SITE_URL}/${loc}/services`;
  });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/services`;

  return {
    title: t('pageMetaTitle'),
    description: t('pageMetaDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/services`,
      languages: languageAlternates,
    },
    openGraph: {
      title: t('pageMetaTitle'),
      description: t('pageMetaDescription'),
      url: `${SITE_URL}/${locale}/services`,
      images: [`${SITE_URL}/images/og/diza-og-services.jpg`],
    },
  };
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Services');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/services' },
  ]);

  return (
    <div className="bg-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page header */}
      <header className="bg-earth px-6 pb-16 pt-32 text-center md:pt-40">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
          {t('pageEyebrow')}
        </span>
        {/* H1 — the single page-level H1, distinct from each section's H2 below */}
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-normal text-white md:text-6xl">
          {t('pageTitle')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-white/65 md:text-base">
          {t('pageIntro')}
        </p>
      </header>

      {/* Four dedicated keyword sections */}
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-16 md:py-24">

        {/* 1. Game Drives & Safari Drives */}
        <ServiceSection
          heading={t('safariSectionTitle')}
          body={t('safariSectionBody')}
          imageAlt="Game drive safari Hluhluwe — open safari vehicle with guests in Hluhluwe-iMfolozi Game Park"
          imageSrc="/images/tours/safari-hero.jpg"
          imagePlaceholderNote={t('imagePlaceholderNote')}
          ctaHref="/tours/big-5-safari"
          ctaLabel={t('viewRoutesAndRates')}
          badge="🦏 Big 5"
        />

        {/* 2. Airport Shuttles */}
        <ServiceSection
          heading={t('airportSectionTitle')}
          body={t('airportSectionBody')}
          imageAlt="Airport shuttle King Shaka to Hluhluwe — DIZA TRAVELS branded shuttle van for King Shaka International Airport transfers"
          imageSrc="/images/tours/shuttle-fleet.jpg"
          imagePlaceholderNote={t('imagePlaceholderNote')}
          ctaHref="/tours/airport-shuttle-king-shaka"
          ctaLabel={t('viewRoutesAndRates')}
          reverse
          badge="✈️ DUR"
        />

        {/* 3. Lodge & Hotel Shuttles */}
        <ServiceSection
          heading={t('lodgeSectionTitle')}
          body={t('lodgeSectionBody')}
          imageAlt="Lodge shuttle service Zululand — DIZA TRAVELS vehicle fleet for hotel and game reserve transfers"
          imageSrc="/images/tours/shuttle-banner.png"
          imagePlaceholderNote={t('imagePlaceholderNote')}
          ctaHref="/tours/lodge-hotel-shuttle"
          ctaLabel={t('viewRoutesAndRates')}
          badge="🏨 Lodges"
        />

        {/* 4. Cross-Border Shuttles — no real photo/map supplied, uses
            the clearly-marked placeholder layout per spec requirement 4 */}
        <ServiceSection
          heading={t('crossBorderSectionTitle')}
          body={t('crossBorderSectionBody')}
          imageAlt="Mozambique border transfer from Hluhluwe and iSwathini border shuttle service route placeholder map"
          imageSrc="/images/tours/border-shuttle-placeholder.jpg"
          imagePlaceholderNote={t('imagePlaceholderNote')}
          ctaHref="/tours/mozambique-iswatini-border-shuttle"
          ctaLabel={t('viewRoutesAndRates')}
          reverse
          badge="🌍 Cross-Border"
        />

      </div>
    </div>
  );
}
