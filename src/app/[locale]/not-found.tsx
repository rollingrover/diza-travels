import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-bone px-6 text-center">
      <span className="font-display text-7xl text-ochre/40">404</span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-earth">{t('title')}</h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted">{t('body')}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-ochre px-7 py-3 font-ui text-sm font-semibold text-earth hover:bg-ochre-light"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
