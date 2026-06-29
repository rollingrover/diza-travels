'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { business } from '@/data/business';

export default function WhatsAppFloat() {
  const t = useTranslations('Nav');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href={`https://wa.me/${business.contact.whatsapp}?text=${encodeURIComponent(
        'Hi DIZA TRAVELS! I would like to enquire about a safari or shuttle.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className={`fixed bottom-8 right-8 z-[500] flex h-14 w-14 items-center justify-center
                  rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40
                  transition-all duration-300 hover:scale-110
                  ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-50 opacity-0'}`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.301A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
      </svg>
    </a>
  );
}
