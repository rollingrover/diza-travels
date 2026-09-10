import { z } from 'zod';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * BOOKING FORM VALIDATION SCHEMA
 * ─────────────────────────────────────────────────────────────────────────
 * Shared Zod schema used by BookingForm.tsx (client-side validation before
 * the mailto: fallback fires) and, when an API route is added later, by
 * the server-side handler too — so validation rules never drift between
 * client and server.
 *
 * Phone regex accepts South African and international formats with
 * optional +, spaces, and hyphens (e.g. "+27 69 562 0240", "0695620240").
 * ─────────────────────────────────────────────────────────────────────────
 */

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * SECURITY: strips CR/LF (and other control characters) from a string.
 * Defense-in-depth against email header injection — this form currently
 * builds a `mailto:` link (see BookingForm.tsx), so an attacker cannot
 * actually inject SMTP headers from the browser today. But every field
 * that will ever be interpolated into an email subject/header (name,
 * email, service, date) is scrubbed here so this schema stays safe if/when
 * it's reused by a real server-side mail-sending API route.
 */
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\r\n\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim();
}

export const SERVICE_TYPES = [
  'game-drive',
  'shuttle-mozambique-iswatini',
  'airport-transfer',
  'lebombo-hike',
  'boat-cruise',
  'cultural-tour',
  'tembe-conservation',
  'quad-biking',
  'other',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const bookingFormSchema = z.object({
  name: z
    .string()
    .transform(stripControlChars)
    .pipe(
      z
        .string()
        .min(2, { message: 'Please enter your full name (at least 2 characters).' })
        .max(100)
    ),

  email: z
    .string()
    .transform(stripControlChars)
    .pipe(
      z
        .string()
        .min(1, { message: 'Email address is required.' })
        .email({ message: 'Please enter a valid email address.' })
    ),

  phone: z
    .string()
    .trim()
    .min(7, { message: 'Please enter a valid phone number.' })
    .regex(phoneRegex, { message: 'Please enter a valid phone number (digits, spaces, +, - only).' }),

  serviceType: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: 'Please select a service.' }),
  }),

  date: z
    .string()
    .transform(stripControlChars)
    .pipe(z.string().min(1, { message: 'Please provide a preferred date, or write "Flexible".' })),

  paxCount: z
    .coerce
    .number({ invalid_type_error: 'Number of guests must be a number.' })
    .int()
    .min(1, { message: 'At least 1 guest is required.' })
    .max(100, { message: 'For groups over 100, please contact us directly.' }),

  message: z
    .string()
    .trim()
    .max(2000, { message: 'Message is too long (max 2000 characters).' })
    .optional()
    .or(z.literal('')),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

/** Convenience: validate and return a typed result without throwing */
export function validateBookingForm(data: unknown) {
  return bookingFormSchema.safeParse(data);
}
