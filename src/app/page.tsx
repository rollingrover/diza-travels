import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * Root page — handles the bare `/` route.
 *
 * next-intl middleware with `localePrefix: 'always'` should redirect `/`
 * to `/{defaultLocale}` automatically, but having an explicit page here
 * acts as a bulletproof fallback: if for any reason the middleware doesn't
 * intercept the request (e.g. during static export, edge cases in some
 * deployment environments), this page performs the redirect directly.
 *
 * This prevents `/` from ever accidentally rendering the wrong page.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
