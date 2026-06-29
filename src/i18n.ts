import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = [
  'en', 'zu', 'zh', 'ru', 'hi',
  'pt', 'es', 'nl', 'de', 'fr',
] as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, { nativeName: string; englishName: string; flag: string }> = {
  en: { nativeName: 'English',   englishName: 'English',             flag: '🇬🇧' },
  zu: { nativeName: 'isiZulu',   englishName: 'Zulu',                flag: '🇿🇦' },
  zh: { nativeName: '简体中文',   englishName: 'Chinese (Simplified)', flag: '🇨🇳' },
  ru: { nativeName: 'Русский',   englishName: 'Russian',              flag: '🇷🇺' },
  hi: { nativeName: 'हिन्दी',    englishName: 'Hindi',               flag: '🇮🇳' },
  pt: { nativeName: 'Português', englishName: 'Portuguese',           flag: '🇵🇹' },
  es: { nativeName: 'Español',   englishName: 'Spanish',              flag: '🇪🇸' },
  nl: { nativeName: 'Nederlands',englishName: 'Dutch',                flag: '🇳🇱' },
  de: { nativeName: 'Deutsch',   englishName: 'German',               flag: '🇩🇪' },
  fr: { nativeName: 'Français',  englishName: 'French',               flag: '🇫🇷' },
};

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v3: use requestLocale (was `locale` in v2)
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Africa/Johannesburg',
  };
});
