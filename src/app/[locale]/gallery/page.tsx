import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { galleryPhotos } from '@/data/gallery';
import { buildBreadcrumbSchema } from '@/lib/schema';
import GalleryGrid from '@/components/gallery/GalleryGrid';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Gallery' });

  const title = `${t('pageTitle')} | DIZA TRAVELS — Hluhluwe, Kwa-Smolo`;
  const description =
    'Photo gallery of Big 5 Game Drive safaris, quad biking, and shuttle services from DIZA TRAVELS, based in Hluhluwe, Kwa-Smolo, KwaZulu-Natal.';

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}/gallery`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/gallery`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/gallery`,
      languages: languageAlternates,
    },
  };
}

export default async function GalleryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Gallery');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/gallery' },
  ]);

  // Resolve all alt texts server-side (translations aren't available in
  // the 'use client' GalleryGrid component), pass as a plain object.
  const altTexts: Record<string, string> = {};
  galleryPhotos.forEach((photo) => {
    altTexts[photo.altKey] = t(photo.altKey);
  });

  return (
    <div className="bg-earth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="px-6 pb-12 pt-32 text-center md:pt-40">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
          {t('pageEyebrow')}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-normal text-white md:text-6xl">
          {t('pageTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/55">{t('pageIntro')}</p>
      </header>

      <GalleryGrid altTexts={altTexts} />

      <p className="px-6 py-10 text-center font-ui text-xs text-white/30">{t('addPhotosNote')}</p>
    </div>
  );
}
