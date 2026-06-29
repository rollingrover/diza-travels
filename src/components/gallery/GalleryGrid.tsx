'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { galleryPhotos } from '@/data/gallery';

interface GalleryGridProps {
  altTexts: Record<string, string>;
}

export default function GalleryGrid({ altTexts }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close  = useCallback(() => setLightboxIndex(null), []);
  const prev   = useCallback(() => setLightboxIndex(i =>
    i === null ? null : (i - 1 + galleryPhotos.length) % galleryPhotos.length), []);
  const next   = useCallback(() => setLightboxIndex(i =>
    i === null ? null : (i + 1) % galleryPhotos.length), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      {/* ── Masonry-style grid ── */}
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
        {galleryPhotos.map((photo, i) => {
          const alt = altTexts[photo.altKey] || photo.altKey;
          return (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View photo: ${alt}`}
              className={`group relative overflow-hidden bg-dusk
                ${photo.span === 'wide' ? 'col-span-2' : ''}
                ${photo.span === 'tall' ? 'row-span-2' : ''}
                h-44 sm:h-56 md:h-64 ${photo.span === 'tall' ? 'row-span-2' : ''}`}
            >
              <Image
                src={photo.src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              {/* Hover overlay with caption */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-earth/80
                              via-transparent to-transparent p-3 opacity-0 transition-opacity
                              duration-300 group-hover:opacity-100">
                <span className="line-clamp-2 font-ui text-xs text-white/90">{alt}</span>
              </div>
              {/* Zoom indicator */}
              <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center
                               rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm
                               transition-opacity group-hover:opacity-100"
                    aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          className="fixed inset-0 z-[2000] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={close}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center
                       rounded-full border border-white/20 bg-white/10 text-xl text-white
                       transition-colors hover:bg-white/20 md:right-6 md:top-6"
          >
            ✕
          </button>

          {/* ← Prev arrow — large, always visible, left edge */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center
                       justify-center rounded-full bg-ochre shadow-xl transition-all
                       hover:bg-ochre-light hover:scale-110 active:scale-95 md:left-6 md:h-16 md:w-16"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white"
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Image + caption */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-20 md:px-28">
            <div className="relative h-[65vh] w-[80vw] max-w-4xl">
              <Image
                src={galleryPhotos[lightboxIndex].src}
                alt={altTexts[galleryPhotos[lightboxIndex].altKey] || ''}
                fill
                className="rounded-xl object-contain drop-shadow-2xl"
                sizes="90vw"
                priority
              />
            </div>
            {/* Caption */}
            <p className="max-w-xl text-center font-display text-base italic text-ochre-light">
              {altTexts[galleryPhotos[lightboxIndex].altKey]}
            </p>
            {/* Counter */}
            <p className="font-ui text-xs tracking-[0.2em] text-white/40">
              {lightboxIndex + 1} / {galleryPhotos.length}
            </p>
            {/* Dot indicator */}
            <div className="flex gap-1.5" aria-hidden="true">
              {galleryPhotos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === lightboxIndex ? 'w-6 bg-ochre' : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* → Next arrow — large, always visible, right edge */}
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center
                       justify-center rounded-full bg-ochre shadow-xl transition-all
                       hover:bg-ochre-light hover:scale-110 active:scale-95 md:right-6 md:h-16 md:w-16"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white"
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
