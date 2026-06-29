'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { bookingFormSchema, SERVICE_TYPES, type ServiceType } from '@/lib/booking-schema';
import { business } from '@/data/business';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * BookingForm
 * ─────────────────────────────────────────────────────────────────────────
 * Robust, reusable booking form used on the Contact page (and embeddable
 * on individual tour pages later if desired).
 *
 * VALIDATION: Zod schema (src/lib/booking-schema.ts) runs client-side on
 * submit. HTML5 attributes (required, type="email", type="tel", pattern)
 * provide a first layer of native browser validation/UX (instant feedback,
 * mobile keyboard hints), with Zod as the authoritative second layer that
 * also powers future server-side validation when an API route replaces
 * the mailto: fallback.
 *
 * SUBMIT ACTION: Currently builds a `mailto:safari@dizatravels.co.za` link
 * with the form data URL-encoded into the subject/body, and triggers
 * navigation to it (opens the visitor's email client). This requires NO
 * backend and works everywhere. The `handleSubmit` function is structured
 * so swapping in a real API route later (e.g. POST to /api/booking) is a
 * one-function change — see the TODO comment below.
 * ─────────────────────────────────────────────────────────────────────────
 */

type FormState = {
  name: string;
  email: string;
  phone: string;
  serviceType: ServiceType | '';
  date: string;
  paxCount: string; // kept as string for controlled input, coerced by Zod
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  serviceType: '',
  date: '',
  paxCount: '2',
  message: '',
};

export default function BookingForm() {
  const t = useTranslations('BookingForm');
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  const serviceLabels: Record<ServiceType, string> = {
    'game-drive': t('serviceGameDrive'),
    'shuttle-mozambique-iswatini': t('serviceShuttleMozambiqueIswatini'),
    'airport-transfer': t('serviceAirportTransfer'),
    'lebombo-hike': t('serviceLebomboHike'),
    'boat-cruise': t('serviceBoatCruise'),
    'cultural-tour': t('serviceCulturalTour'),
    'tembe-conservation': t('serviceTembeConservation'),
    'quad-biking': t('serviceQuadBiking'),
    other: t('serviceOther'),
  };

  function handleChange(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear the field's error as soon as the user edits it
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = bookingFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormState;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus('submitting');
    setErrors({});

    const data = result.data;

    // ── TODO (future): replace this block with a fetch() POST to an API
    // route once one exists, e.g.:
    //   await fetch('/api/booking', { method: 'POST', body: JSON.stringify(data) })
    // Keep the Zod-validated `data` object as the payload either way —
    // no other code needs to change.
    const subject = `Booking Request: ${serviceLabels[data.serviceType]} — ${data.name}`;
    const bodyLines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Service: ${serviceLabels[data.serviceType]}`,
      `Preferred Date: ${data.date}`,
      `Number of Guests: ${data.paxCount}`,
      '',
      `Message:`,
      data.message || '(none)',
    ];
    const mailtoUrl = `mailto:${business.contact.emailBusiness}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoUrl;

    // Give the mail client a moment to open before showing the success state
    setTimeout(() => setStatus('sent'), 700);
  }

  function resetForm() {
    setForm(initialState);
    setErrors({});
    setStatus('idle');
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-ivory p-10 text-center">
        <span className="text-5xl" aria-hidden="true">✅</span>
        <h3 className="font-display text-2xl font-semibold text-earth">{t('successTitle')}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-muted">{t('successBody')}</p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 rounded-full border-2 border-earth px-6 py-2.5 font-ui text-sm font-semibold
                     text-earth transition-colors hover:bg-earth hover:text-white"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-2xl bg-ivory p-8 shadow-md md:p-10">
      <div>
        <h3 className="font-display text-2xl font-semibold text-earth">{t('title')}</h3>
        <p className="mt-1 text-sm text-text-muted">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('labelName')} error={errors.name}>
          <input
            type="text"
            required
            minLength={2}
            placeholder={t('placeholderName')}
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass(!!errors.name)}
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field label={t('labelPhone')} error={errors.phone}>
          <input
            type="tel"
            required
            pattern="^\+?[0-9\s\-()]{7,20}$"
            placeholder={t('placeholderPhone')}
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass(!!errors.phone)}
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>

      <Field label={t('labelEmail')} error={errors.email}>
        <input
          type="email"
          required
          placeholder={t('placeholderEmail')}
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={inputClass(!!errors.email)}
          aria-invalid={!!errors.email}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('labelServiceType')} error={errors.serviceType}>
          <select
            required
            value={form.serviceType}
            onChange={(e) => handleChange('serviceType', e.target.value)}
            className={inputClass(!!errors.serviceType)}
            aria-invalid={!!errors.serviceType}
          >
            <option value="">{t('selectService')}</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>{serviceLabels[s]}</option>
            ))}
          </select>
        </Field>

        <Field label={t('labelPax')} error={errors.paxCount}>
          <input
            type="number"
            required
            min={1}
            max={100}
            value={form.paxCount}
            onChange={(e) => handleChange('paxCount', e.target.value)}
            className={inputClass(!!errors.paxCount)}
            aria-invalid={!!errors.paxCount}
          />
        </Field>
      </div>

      <Field label={t('labelDate')} error={errors.date}>
        <input
          type="text"
          required
          placeholder={t('placeholderDate')}
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={inputClass(!!errors.date)}
          aria-invalid={!!errors.date}
        />
      </Field>

      <Field label={t('labelMessage')}>
        <textarea
          rows={4}
          placeholder={t('placeholderMessage')}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={inputClass(false)}
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-1 w-full rounded-full bg-ochre py-3.5 font-ui text-sm font-semibold text-earth
                   transition-colors hover:bg-ochre-light disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submitButton')}
      </button>

      <p className="text-center text-xs text-text-muted">
        {t('whatsappAlternative')}{' '}
        <a
          href={business.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-ochre hover:underline"
        >
          {business.contact.phonePrimaryDisplay}
        </a>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-ui text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `rounded-lg border bg-bone px-4 py-2.5 text-sm text-earth outline-none transition-colors
          placeholder:text-text-muted/60 focus:border-ochre focus:ring-2 focus:ring-ochre/20
          ${hasError ? 'border-red-400' : 'border-mist'}`;
}
