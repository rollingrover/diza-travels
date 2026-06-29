import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTripadvisor } from 'react-icons/fa';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { buildBreadcrumbSchema } from '@/lib/schema';
import BookingForm from '@/components/booking/BookingForm';

const SITE_URL = business.website;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * generateMetadata for /contact — keyword set per final SEO audit:
 * "Hluhluwe", "Kwa-Smolo", "Mozambique Shuttle", "iSwathini Border",
 * "Game Drive" all present in title/description.
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Contact' });

  const title = 'Contact DIZA TRAVELS — Booking Office, Kwa-Smolo, Hluhluwe';
  const description =
    'Contact our Kwa-Smolo, Hluhluwe booking office for Game Drive safaris, Mozambique Shuttle and iSwathini Border transfers, and Lebombo hikes. Call, WhatsApp, or send a booking request.';

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}/contact`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/contact`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: languageAlternates,
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/contact` },
  };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Contact');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/contact' },
  ]);

  // Google Maps embed URL centered on the exact Kwa-Smolo coordinates,
  // with a marker (q= parameter drops a pin at that exact lat/lng).
  const mapEmbedSrc = `https://www.google.com/maps?q=-28.017788,32.198622&hl=en&z=17&output=embed`;
  const mapLinkHref = `https://maps.app.goo.gl/6MFn9qB2PFz9wi1f7`;

  return (
    <div className="bg-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="bg-earth px-6 pb-14 pt-32 text-center md:pt-40">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
          {t('pageEyebrow')}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-normal text-white md:text-6xl">
          {t('pageTitle')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-white/65 md:text-base">{t('pageIntro')}</p>
      </header>

      <div className="mx-auto grid max-w-content gap-10 px-6 py-16 md:grid-cols-[1fr_1.15fr] md:py-24">

        {/* ── Info column ── */}
        <div>
          {/* Office name + address block — Kwa-Smolo Booking Office */}
          <div className="mb-6 rounded-2xl border border-mist bg-ivory p-6">
            <h2 className="font-ui text-xs font-bold uppercase tracking-wide text-ochre">
              Diza Travels Bookings Office — Mthekwini, Kwa-Smolo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-earth">
              {business.address.streetAddress}, {business.address.addressLocality}<br />
              {business.address.addressRegion}, {business.address.countryName}
            </p>
            <p className="mt-2 text-xs italic text-text-muted">{business.address.directions}</p>
          </div>

          <div className="mb-7 flex flex-col gap-3">
            <ContactRow icon="📞" label={t('phoneLabel')}>
              <a href={`tel:${business.contact.phonePrimary}`} className="hover:text-ochre">
                {business.contact.phonePrimaryDisplay}
              </a>
              {' / '}
              <a href={`tel:${business.contact.phoneSecondary}`} className="hover:text-ochre">
                {business.contact.phoneSecondaryDisplay}
              </a>
            </ContactRow>
            <ContactRow icon="✉️" label="Email">
              <a href={`mailto:${business.contact.emailBusiness}`} className="hover:text-ochre">
                {business.contact.emailBusiness}
              </a>
            </ContactRow>
            <ContactRow icon="🌐" label={t('websiteLabel')}>
              <a href={business.website} className="hover:text-ochre">{business.website.replace('https://', '')}</a>
            </ContactRow>
          </div>

          <p className="mb-3 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">
            {t('followUs')}
          </p>
          <div className="mb-8 flex gap-2.5">
            {[
              { label: 'Facebook', href: '#', Icon: FaFacebookF },
              { label: 'Instagram', href: '#', Icon: FaInstagram },
              { label: 'WhatsApp', href: '#', Icon: FaWhatsapp },
              { label: 'TripAdvisor', href: '#', Icon: FaTripadvisor },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-mist
                           text-earth transition-colors hover:border-ochre hover:bg-ochre hover:text-white"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Google Maps embed — centered on exact Kwa-Smolo coordinates */}
          <div className="overflow-hidden rounded-2xl border border-mist shadow-sm">
            <iframe
              title={`Map: $Diza Travels Bookings Office — Mthekwini, Kwa-Smolo`}
              src={mapEmbedSrc}
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={mapLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-earth px-4 py-3 text-center font-ui text-xs font-semibold text-ochre-light hover:text-white"
            >
              {t('mapCta')} →
            </a>
          </div>
        </div>

        {/* ── Booking form column ── */}
        <BookingForm />
      </div>
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-ivory px-4 py-3">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <div>
        <span className="block font-ui text-[0.65rem] font-bold uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <span className="text-sm text-earth">{children}</span>
      </div>
    </div>
  );
}
