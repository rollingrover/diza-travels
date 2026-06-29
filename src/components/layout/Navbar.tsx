// components/layout/Navbar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import { business } from '@/data/business';

export default function Navbar() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const onScroll = useCallback(() => setScrolled(window.scrollY > 64), []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const NAV_LINKS = [
    { label: t('home'), href: '/' },
    { label: t('services'), href: '/services' },
    { label: t('tours'), href: '/tours' },
    { label: t('pricing'), href: '/pricing' },
    { label: t('gallery'), href: '/gallery' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] transition-all duration-300
        ${scrolled ? 'bg-earth/96 backdrop-blur-md shadow-lg py-3' : 'py-4'}`}
    >
      <div className="mx-auto flex max-w-content items-center gap-8 px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${business.shortName} – Home`}>
          <Image
            src="/images/logo/diza-logo-horizontal.png"
            alt={`${business.legalName} logo`}
            width={638}
            height={382}
            priority
            className={`w-auto transition-all duration-300 ${scrolled ? 'h-70' : 'h-100'}`}
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 font-ui text-sm font-medium 
                          text-sand transition-all duration-200
                          hover:text-ochre-light hover:bg-white/5
                          ${pathname === l.href ? 'text-ochre-light font-semibold' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LocaleSwitcher />
        </div>

        <a
          href={`tel:${business.contact.phonePrimary}`}
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-ochre px-5
                     py-2 font-ui text-sm font-semibold text-earth transition-colors
                     hover:bg-ochre-light md:flex"
        >
          {t('bookNow')}
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          className="ml-auto rounded-md p-2 text-sand md:hidden"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[999] transition-opacity duration-300 md:hidden
          ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <div
          className={`absolute inset-y-0 right-0 w-[85vw] max-w-sm overflow-y-auto
                      bg-dusk px-8 pb-12 pt-20 transition-transform duration-500
                      ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="mb-6 border-b border-ochre/20 pb-4">
            <LocaleSwitcher />
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-white/5 py-3 font-ui text-lg text-sand hover:text-ochre-light transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`tel:${business.contact.phonePrimary}`}
              className="rounded-full bg-ochre px-6 py-3 text-center font-ui font-semibold text-earth"
            >
              {business.contact.phonePrimaryDisplay}
            </a>
            <a
              href={`https://wa.me/${business.contact.whatsapp}`}
              className="rounded-full border-2 border-white/40 px-6 py-3 text-center font-ui font-semibold text-sand"
            >
              {t('whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}