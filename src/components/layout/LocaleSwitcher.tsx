'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { locales, localeLabels, type Locale } from '@/i18n';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const current = localeLabels[currentLocale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('ariaLabel')}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5
                   px-3 py-1.5 text-sm font-medium text-white/85 transition-colors
                   hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round"
             className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" aria-label={t('label')}
            className="absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl
                       border border-mist bg-ivory py-1.5 shadow-xl">
          {locales.map((loc) => {
            const { nativeName, englishName, flag } = localeLabels[loc];
            const isActive = loc === currentLocale;
            return (
              <li key={loc} role="option" aria-selected={isActive}>
                <button type="button" onClick={() => switchLocale(loc)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm
                                    transition-colors hover:bg-bone
                                    ${isActive ? 'font-semibold text-ochre' : 'text-earth'}`}>
                  <span aria-hidden="true" className="text-base">{flag}</span>
                  <span className="flex flex-col">
                    <span>{nativeName}</span>
                    {nativeName !== englishName && (
                      <span className="text-xs text-text-muted">{englishName}</span>
                    )}
                  </span>
                  {isActive && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                         className="ml-auto shrink-0 text-ochre" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
