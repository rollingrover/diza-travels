import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
import { tours, groupSafariRates, parkEntryFees, lunchAddOnZAR, quoteOnRequestExtras } from '@/data/tours';
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
  const t = await getTranslations({ locale, namespace: 'Pricing' });

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}/pricing`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/pricing`;

  return {
    title: `${t('pageTitle')} | DIZA TRAVELS`,
    description: t('pageMetaDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/pricing`,
      languages: languageAlternates,
    },
  };
}

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Pricing');
  const tTours = await getTranslations('Tours');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/pricing' },
  ]);

  const individualSafari = tours.find((t) => t.slug === 'big-5-safari')!;
  const cruise = tours.find((t) => t.slug === 'st-lucia-boat-cruise')!;
  const cultural = tours.find((t) => t.slug === 'kwasmolo-cultural-tour')!;
  const hike = tours.find((t) => t.slug === 'lebombo-hike')!;
  const tembe = tours.find((t) => t.slug === 'tembe-conservation-experience')!;
  const excursions = tours.find((t) => t.slug === 'day-excursions')!;
  const shuttleTours = tours.filter((t) => t.category === 'shuttle');

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

      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Group Safari */}
          <PriceCard title={t('groupSafariTitle')} accent="earth">
            {groupSafariRates.map((r, i) => (
              <RateRow key={i} label={r.duration} price={r.priceZAR} unit="person" />
            ))}
            <Note>{t('entryFeeNote')}</Note>
            <Note>{t('lunchNote')}</Note>
          </PriceCard>

          {/* Individual Safari */}
          <PriceCard title={t('individualSafariTitle')} accent="ochre">
            {individualSafari.rates.map((r, i) => (
              <RateRow key={i} label={r.duration} price={r.priceZAR} unit="person" />
            ))}
            <Note>{t('entryFeeNote')}</Note>
            <Note>{t('lunchNote')}</Note>
          </PriceCard>

          {/* Lunch Menu */}
          <PriceCard title={t('menuTitle')} accent="green">
            <p className="text-sm leading-relaxed text-text-muted">{t('menuItems')}</p>
            <Note>{`R${lunchAddOnZAR} per person, added to any safari booking.`}</Note>
          </PriceCard>

          {/* Lebombo Hike */}
          <PriceCard title={tTours('hike.name')} accent="green">
            {hike.rates.map((r, i) => (
              <RateRow key={i} label={r.duration} price={r.priceZAR} unit="person" />
            ))}
            <Note>Transport to trailhead can be arranged at extra cost.</Note>
          </PriceCard>

          {/* St Lucia Boat Cruise */}
          <PriceCard title={tTours('cruise.name')} accent="ochre">
            <p className="mb-1 font-ui text-[0.65rem] font-bold uppercase tracking-wide text-text-muted">
              {t('southAfrican')}
            </p>
            {cruise.rates
              .filter((r) => r.audience === 'sa-citizen')
              .map((r, i) => (
                <RateRow key={i} label={`${r.ageGroup === 'adult' ? t('adult') : t('child')}`} price={r.priceZAR} unit="person" />
              ))}
            <p className="mb-1 mt-3 font-ui text-[0.65rem] font-bold uppercase tracking-wide text-text-muted">
              {t('international')}
            </p>
            {cruise.rates
              .filter((r) => r.audience === 'international')
              .map((r, i) => (
                <RateRow key={i} label={`${r.ageGroup === 'adult' ? t('adult') : t('child')}`} price={r.priceZAR} unit="person" />
              ))}
          </PriceCard>

          {/* Cultural Tour */}
          <PriceCard title={tTours('cultural.name')} accent="earth">
            {cultural.rates.map((r, i) => (
              <RateRow
                key={i}
                label={r.ageGroup === 'adult' ? t('adult') : t('child')}
                price={r.priceZAR}
                unit="person"
              />
            ))}
            <Note>Requires 2+ days advance booking. Minimum 2 guests.</Note>
          </PriceCard>

          {/* Tembe Conservation */}
          <PriceCard title={tTours('tembe.name')} accent="green">
            {tembe.rates.map((r, i) => (
              <RateRow key={i} label={r.duration} price={r.priceZAR} unit="person" />
            ))}
            <Note>Minimum 6 guests, maximum 10. Requires 7+ days advance booking.</Note>
          </PriceCard>

          {/* Transfers */}
          <PriceCard title={t('transfersTitle')} accent="ochre" wide>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {shuttleTours.flatMap((tour) =>
                tour.rates.map((r, i) => (
                  <div key={`${tour.slug}-${i}`} className="flex items-center justify-between border-b border-mist/60 pb-2 text-sm">
                    <span className="text-earth">{r.duration}</span>
                    <span className="font-ui text-xs font-semibold uppercase text-text-muted">
                      {t('enquireForRates')}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/services"
              className="mt-4 inline-block font-ui text-sm font-semibold text-ochre hover:underline"
            >
              View all shuttle routes →
            </Link>
          </PriceCard>

        </div>

        {/* Excursions Menu — full width table */}
        <div className="mt-6 rounded-2xl border border-mist bg-ivory p-6 shadow-sm md:p-8">
          <h2 className="font-display text-2xl font-semibold text-earth">{t('excursionsTitle')}</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-mist text-left">
                  <th className="pb-2 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">Excursion</th>
                  <th className="pb-2 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">SA Adult</th>
                  <th className="pb-2 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">SA Child</th>
                  <th className="pb-2 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">Intl Adult</th>
                  <th className="pb-2 font-ui text-xs font-bold uppercase tracking-wide text-text-muted">Intl Child</th>
                </tr>
              </thead>
              <tbody>
                {groupExcursionRows(excursions.rates).map((row) => (
                  <tr key={row.name} className="border-b border-mist/50">
                    <td className="py-2.5 text-earth">{row.name}</td>
                    <td className="py-2.5 font-ui font-semibold text-ochre">{row.saAdult ? `R${row.saAdult}` : '—'}</td>
                    <td className="py-2.5 font-ui font-semibold text-ochre">{row.saChild ? `R${row.saChild}` : '—'}</td>
                    <td className="py-2.5 font-ui font-semibold text-ochre">{row.intlAdult ? `R${row.intlAdult}` : '—'}</td>
                    <td className="py-2.5 font-ui font-semibold text-ochre">{row.intlChild ? `R${row.intlChild}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote on request extras */}
        <div className="mt-6 rounded-2xl border border-dashed border-mist bg-ivory/50 p-6">
          <h2 className="font-display text-xl font-semibold text-earth">{t('quoteExtrasTitle')}</h2>
          <div className="mt-4 flex flex-col gap-2">
            {quoteOnRequestExtras.map((extra) => (
              <div key={extra.name} className="flex items-center justify-between text-sm">
                <span className="text-earth">{extra.name}</span>
                <span className="font-ui text-xs font-semibold uppercase text-text-muted">{extra.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-earth p-10 text-center">
          <h2 className="font-display text-2xl italic text-white md:text-3xl">{t('ctaTitle')}</h2>
          <p className="mt-2 text-sm text-white/60">{t('ctaBody')}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ochre px-8 py-4
                       font-ui text-sm font-semibold text-earth transition-colors hover:bg-ochre-light"
          >
            {t('ctaTitle')}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──

function PriceCard({
  title,
  accent,
  wide,
  children,
}: {
  title: string;
  accent: 'earth' | 'ochre' | 'green';
  wide?: boolean;
  children: React.ReactNode;
}) {
  const borderColor = { earth: 'border-l-earth', ochre: 'border-l-ochre', green: 'border-l-green' }[accent];
  return (
    <div className={`rounded-2xl border border-mist border-l-4 ${borderColor} bg-ivory p-6 shadow-sm ${wide ? 'lg:col-span-2' : ''}`}>
      <h3 className="mb-4 font-display text-xl font-semibold text-earth">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function RateRow({ label, price, unit }: { label: string; price: number; unit: 'person' | 'vehicle' | 'booking' }) {
  return (
    <div className="flex items-center justify-between border-b border-mist/60 pb-2 text-sm">
      <span className="text-earth">{label}</span>
      <span className="font-ui font-bold text-ochre">
        R{price} <span className="text-xs font-normal text-text-muted">/{unit}</span>
      </span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs italic leading-relaxed text-text-muted">{children}</p>;
}

/** Groups the flat excursions rate array (12 rows) back into the original
 * 6-excursion × 4-price-column table shape for display. */
function groupExcursionRows(
  rates: { duration: string; priceZAR: number; ageGroup?: 'adult' | 'child'; audience?: string }[]
) {
  const names = [...new Set(rates.map((r) => r.duration))];
  return names.map((name) => {
    const rowsForName = rates.filter((r) => r.duration === name);
    const find = (ageGroup: 'adult' | 'child', audience: string) =>
      rowsForName.find((r) => r.ageGroup === ageGroup && r.audience === audience)?.priceZAR;
    return {
      name,
      saAdult: find('adult', 'sa-citizen') ?? find('adult', 'all'),
      saChild: find('child', 'sa-citizen') ?? find('child', 'all'),
      intlAdult: find('adult', 'international') ?? find('adult', 'all'),
      intlChild: find('child', 'international') ?? find('child', 'all'),
    };
  });
}
