import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { locales, type Locale } from '@/i18n';
import { business } from '@/data/business';
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
  const t = await getTranslations({ locale, namespace: 'About' });

  const title = `${t('pageTitle')} | DIZA TRAVELS — Hluhluwe, Kwa-Smolo`;

  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => { languageAlternates[loc] = `${SITE_URL}/${loc}/about`; });
  languageAlternates['x-default'] = `${SITE_URL}/${locales[0]}/about`;

  return {
    title,
    description: t('pageMetaDescription'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: languageAlternates,
    },
  };
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('About');

  const breadcrumbSchema = buildBreadcrumbSchema(locale as Locale, [
    { name: 'Home', path: '/' },
    { name: t('pageTitle'), path: '/about' },
  ]);

  // Person schema for Chris Manqele — supplements the LocalBusiness/
  // TravelAgency schema with a named founder entity, which strengthens
  // E-E-A-T (Experience, Expertise, Authoritativeness, Trust) signals.
  const founderSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: business.founder.name,
    jobTitle: business.founder.title,
    worksFor: {
      '@type': 'TravelAgency',
      '@id': `${SITE_URL}/#organization`,
      name: business.legalName,
    },
  };

  const pillars = [
    { img: '/images/icons/expert-local-guides-zululand.png', alt: 'Expert local safari guides born in Zululand', title: t('pillarGuides'), desc: t('pillarGuidesDesc') },
    { img: '/images/icons/big5-wildlife-conservation-badge.png', alt: 'Big 5 wildlife conservation Hluhluwe-iMfolozi', title: t('pillarConservation'), desc: t('pillarConservationDesc') },
    { img: '/images/icons/icon-community-rooted-zululand-family.png', alt: 'Community-rooted tourism supporting local Zululand families', title: t('pillarCommunity'), desc: t('pillarCommunityDesc') },
    { img: '/images/icons/icon-local-partners-2.png', alt: 'Personalised safari booking service Diza Travels', title: t('pillarService'), desc: t('pillarServiceDesc') },
  ];

  return (
    <div className="bg-bone">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }} />

      <header className="bg-earth px-6 pb-14 pt-32 text-center md:pt-40">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre-light">
          {t('pageEyebrow')}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-normal text-white md:text-6xl">
          {t('heroTitle')}
        </h1>
      </header>

      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        {/* Founder feature */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/about-founder.jpg"
              alt={`${business.founder.name}, ${business.founder.title} of DIZA TRAVELS, on a Big 5 Game Drive safari with guests in Hluhluwe-iMfolozi`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <p className="text-base leading-relaxed text-text-muted md:text-lg">{t('body1')}</p>
            <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">{t('body2')}</p>

            {/* Founder card */}
            <div className="mt-7 flex items-start gap-4 rounded-2xl border border-mist bg-ivory p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ochre/15 overflow-hidden">
                <Image src="/images/icons/chris-manqele-founder-lead-guide.png" alt="Chris Manqele Founder Lead Guide Diza Travels Hluhluwe" width={56} height={56} className="h-14 w-14 object-contain" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-earth">{t('founderName')}</h2>
                <p className="font-ui text-xs font-semibold uppercase tracking-wide text-ochre">{t('founderTitle')}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{t('founderBio')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-mist bg-ivory p-6 text-center shadow-sm">
              <Image src={p.img} alt={p.alt} width={80} height={80} className="mx-auto mb-1 h-20 w-20 object-contain" />
              <h3 className="mt-3 font-display text-lg font-semibold text-earth">{p.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-earth p-10 text-center md:p-14">
          <h2 className="font-display text-2xl italic text-white md:text-3xl">
            Ready to meet Chris and the team?
          </h2>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ochre px-8 py-4
                       font-ui text-sm font-semibold text-earth transition-colors hover:bg-ochre-light"
          >
            Plan your adventure →
          </Link>
        </div>
      </div>
    </div>
  );
}
