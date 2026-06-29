'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Testimonials
 * ─────────────────────────────────────────────────────────────────────────
 * Brings back the guest-reviews section from the original Vite/React
 * design. A featured large review on the left with a clickable list of
 * the other reviews on the right — visitors can click any name to bring
 * that review into the spotlight.
 * ─────────────────────────────────────────────────────────────────────────
 */
export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const [active, setActive] = useState(0);

  const reviews = [1, 2, 3, 4, 5].map((n) => ({
    name: t(`review${n}Name`),
    origin: t(`review${n}Origin`),
    text: t(`review${n}Text`),
    service: t(`review${n}Service`),
  }));

  const featured = reviews[active];

  return (
    <section className="bg-ivory px-6 py-20 md:py-28">
      <div className="mx-auto max-w-content">
        <div className="mb-12 text-center">
          <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ochre">
            {t('eyebrow')}
          </span>
          <h2 className="mt-3 font-display text-3xl font-normal text-earth md:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured review */}
          <div
            key={active}
            className="relative rounded-2xl border border-mist bg-bone p-8 shadow-sm md:p-10
                       animate-[fadeIn_0.4s_ease]"
          >
            <span
              className="pointer-events-none absolute left-6 top-2 select-none font-display text-7xl
                         leading-none text-ochre/15 md:text-8xl"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <div className="relative mb-4 flex gap-1 text-ochre" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <blockquote className="relative font-display text-lg italic leading-relaxed text-earth md:text-xl">
              {featured.text}
            </blockquote>
            <div className="relative mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ochre/15 text-xl">
                🧑🏻‍🤝‍🧑🏾
              </div>
              <div>
                <p className="font-ui text-sm font-semibold text-earth">{featured.name}</p>
                <p className="text-xs text-text-muted">{featured.origin}</p>
              </div>
              <span className="ml-auto rounded-full border border-ochre/30 bg-ochre/10 px-3 py-1 font-ui text-[0.65rem] font-semibold uppercase tracking-wide text-ochre">
                {featured.service}
              </span>
            </div>
          </div>

          {/* Review list / selector */}
          <div className="flex flex-col gap-3">
            {reviews.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors
                  ${i === active ? 'border-ochre bg-ochre/5' : 'border-mist bg-bone hover:border-ochre/40'}`}
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ochre/15 text-sm">
                  🧑🏻‍🤝‍🧑🏾
                </div>
                <div className="min-w-0">
                  <p className="truncate font-ui text-sm font-semibold text-earth">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.origin} · {r.service}</p>
                </div>
                <div className="ml-auto mt-0.5 flex shrink-0 gap-0.5 text-ochre">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} size={11} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
