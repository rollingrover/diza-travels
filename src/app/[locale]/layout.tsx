// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { buildTravelAgencySchema, buildLocalBusinessSchema } from '@/lib/schema';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!locales.includes(locale as Locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'Meta' });

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    languageAlternates[loc] = `${SITE_URL}/${loc}`;
  });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('defaultDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates,
    },
    openGraph: {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      url: `${SITE_URL}/${locale}`,
      siteName: t('siteName'),
      images: [{
        url: `${SITE_URL}/images/og/diza-og-default.jpg`,
        width: 1200,
        height: 630,
        alt: t('defaultTitle'),
      }],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: [`${SITE_URL}/images/og/diza-og-default.jpg`],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const travelAgencySchema = buildTravelAgencySchema(locale as Locale);
  const localBusinessSchema = buildLocalBusinessSchema(locale as Locale);

  return (
    <html lang={locale}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}