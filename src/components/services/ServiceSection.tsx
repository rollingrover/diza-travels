import Image from 'next/image';
import { Link } from '@/navigation';

interface ServiceSectionProps {
  /** Exact H2 heading text — carries the required SEO keyword phrase */
  heading: string;
  body: string;
  /** Descriptive alt text — must also carry the keyword phrase per spec */
  imageAlt: string;
  imageSrc?: string; // undefined → render the placeholder layout
  imagePlaceholderNote: string;
  ctaHref: string;
  ctaLabel: string;
  reverse?: boolean;
  badge?: string;
  /** Custom PNG icon to replace the text badge */
  badgeIcon?: {
    src: string | any;
    alt: string;
    width?: number;
    height?: number;
  };
}

/**
 * ServiceSection — used on the dedicated Services page for the 4 priority
 * keyword sections (Game Drives, Airport Shuttles, Lodge Shuttles,
 * Cross-Border Shuttles). Each renders as a full-width alternating
 * image/text panel so headings get their own crawlable H2 + nearby
 * keyword-rich body copy + descriptive image alt text — all three signals
 * Google uses to understand section relevance.
 */
export default function ServiceSection({
  heading,
  body,
  imageAlt,
  imageSrc,
  imagePlaceholderNote,
  ctaHref,
  ctaLabel,
  reverse = false,
  badge,
  badgeIcon,
}: ServiceSectionProps) {
  return (
    <article
      className={`grid grid-cols-1 overflow-hidden rounded-2xl border border-mist/60
                  shadow-md md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Media */}
      <div className="relative min-h-[280px] md:min-h-[380px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          // Clearly-marked placeholder — easy to swap once real photos/maps
          // are supplied, per spec requirement #4.
          <div
            className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3
                       bg-gradient-to-br from-dusk via-brown to-earth p-8 text-center md:min-h-[380px]"
            role="img"
            aria-label={imageAlt}
          >
            <span className="text-4xl" aria-hidden="true">🗺️</span>
            <p className="max-w-xs font-ui text-sm text-white/60">{imagePlaceholderNote}</p>
          </div>
        )}
        {/* Badge — icon OR text, with icon taking priority */}
        <div className="absolute left-4 top-4">
          {badgeIcon ? (
            <div className="rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm">
              <Image
                src={badgeIcon.src}
                alt={badgeIcon.alt}
                width={badgeIcon.width || 36}
                height={badgeIcon.height || 36}
                className="w-9 h-9 object-contain"
              />
            </div>
          ) : badge ? (
            <span className="rounded-full bg-ochre px-3 py-1 font-ui text-xs font-bold uppercase tracking-wide text-earth">
              {badge}
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-4 bg-ivory p-8 md:p-12">
        {/* This h2 carries the required exact-match SEO keyword phrase */}
        <h2 className="font-display text-3xl font-semibold leading-tight text-earth md:text-4xl">
          {heading}
        </h2>
        <p className="text-sm leading-relaxed text-text-muted md:text-base">{body}</p>
        <Link
          href={ctaHref}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-ochre px-6 py-3
                     font-ui text-sm font-semibold text-earth transition-colors hover:bg-ochre-light"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}