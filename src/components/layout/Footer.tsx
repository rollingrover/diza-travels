import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTripadvisor, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from '@/navigation';
import { business } from '@/data/business';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Nav');
  const year = new Date().getFullYear();

  const experienceLinks = [
    { label: 'Big 5 Safari', href: '/tours/big-5-safari' },
    { label: 'Lebombo Hike', href: '/tours/lebombo-hike' },
    { label: 'Shuttle & Transfers', href: '/tours/shuttle-transfers' },
    { label: 'Boat Cruise', href: '/tours/st-lucia-boat-cruise' },
    { label: 'Cultural Tour', href: '/tours/kwasmolo-cultural-tour' },
  ];

  const exploreLinks = [
    { label: tNav('home'), href: '/' },
    { label: tNav('services'), href: '/services' },
    { label: tNav('tours'), href: '/tours' },
    { label: tNav('gallery'), href: '/gallery' },
    { label: tNav('about'), href: '/about' },
    { label: tNav('contact'), href: '/contact' },
  ];

  // Social icons — all hrefs set to "#" per spec except real existing
  // Facebook/Instagram/WhatsApp links already confirmed; TripAdvisor has
  // no confirmed listing yet so stays "#" until supplied.
  const socialIcons = [
    { label: 'Facebook',    href: '#', Icon: FaFacebookF },
    { label: 'Instagram',   href: '#', Icon: FaInstagram },
    { label: 'WhatsApp',    href: '#', Icon: FaWhatsapp },
    { label: 'TripAdvisor', href: '#', Icon: FaTripadvisor },
  ];

  return (
    <footer className="bg-earth text-white/70">
      <div className="flex items-center gap-4 px-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ochre/40 to-transparent" />
        <span className="text-[0.6rem] text-ochre/60">◆</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ochre/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/logo/diza-logo-horizontal.png"
                alt={business.legalName}
                width={638}
                height={382}
                className="h-36 w-auto"
                style={{ mixBlendMode: 'screen' }}
              />
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/55">
              {t('tagline')}
            </p>
            <div className="mb-7 flex flex-col gap-2 text-sm">
              <a href={`tel:${business.contact.phonePrimary}`} className="text-white/65 hover:text-ochre-light">
                📞 {business.contact.phonePrimaryDisplay}
              </a>
              <a href={`tel:${business.contact.phoneSecondary}`} className="text-white/65 hover:text-ochre-light">
                📞 {business.contact.phoneSecondaryDisplay}
              </a>
              <a href={`mailto:${business.contact.emailBusiness}`} className="text-white/65 hover:text-ochre-light">
                ✉️ {business.contact.emailBusiness}
              </a>
              <span className="text-white/65">📍 {business.address.officeName}</span>
            </div>

            {/* Social icons — react-icons, hover effects, href="#" placeholders */}
            <div className="flex gap-2.5">
              {socialIcons.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15
                             text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-ochre
                             hover:bg-ochre/10 hover:text-ochre-light"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.18em] text-ochre-light">
              {t('experiencesTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {experienceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/58 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.18em] text-ochre-light">
              {t('exploreTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/58 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage area */}
          <div>
            <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.18em] text-ochre-light">
              {t('coverageTitle')}
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/50">
              {business.areasServed.map((place) => (
                <li key={place} className="flex items-start gap-1.5">
                  <span className="text-ochre">›</span> {place}
                </li>
              ))}
            </ul>
          </div>

          {/* Tourism Partners — new dedicated section */}
          <div>
            <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.18em] text-ochre-light">
              {t('partnersTitle')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {business.partners.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-sm text-white/58 hover:text-white"
                  >
                    {partner.name}
                    <FaExternalLinkAlt
                      size={9}
                      className="text-white/30 transition-colors group-hover:text-ochre-light"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] py-5">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-2 px-6">
          <span className="text-xs text-white/35">
            © {year} {business.legalName} — {t('copyright')}
          </span>
          <span className="font-ui text-[0.72rem] tracking-[0.1em] text-white/30">
            {t('location')}
          </span>
        </div>
        {/* Web design credit — separate final line per spec */}
        <div className="mx-auto mt-2 max-w-content px-6 text-center">
          <a
            href={business.credit.href}
            className="text-[0.68rem] text-white/25 transition-colors hover:text-ochre-light"
          >
            {business.credit.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
