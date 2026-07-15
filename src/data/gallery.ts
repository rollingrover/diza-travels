/**
 * ─────────────────────────────────────────────────────────────────────────
 * GALLERY DATA
 * ─────────────────────────────────────────────────────────────────────────
 * All photos below are REAL photos supplied by the client (curated from
 * uploaded ZIP files of wildlife and activity photography taken in and
 * around Hluhluwe-iMfolozi). No placeholder/generated images remain in
 * the gallery.
 *
 * `altKey` references a Gallery.* translation key in messages/{locale}.json
 * so every photo's alt text is translated, not hardcoded English.
 *
 * ─── HOW TO ADD MORE PHOTOS LATER ──────────────────────────────────────
 * 1. Drop your photo into: public/images/gallery/your-photo.jpg
 * 2. Add an entry to the array below with a new unique `altKey`
 * 3. Add a matching `Gallery.yourAltKey` string to messages/en.json,
 *    then run the placeholder-regeneration step for the other 9 locales
 *    (or translate directly) and verify with
 *    `node scripts/verify-locale-parity.js`
 * ──────────────────────────────────────────────────────────────────────────
 */

/**
 * ─────────────────────────────────────────────────────────────────────────
 * GALLERY DATA
 * ─────────────────────────────────────────────────────────────────────────
 * All photos below are REAL photos supplied by the client...
 */

export interface GalleryPhoto {
  src: string;
  altKey: string;
  /** 'wide' spans 2 grid columns, 'tall' spans 2 rows, '' is a normal 1x1 cell */
  span?: 'wide' | 'tall' | '';
  isReal: boolean;
}

export const galleryPhotos: GalleryPhoto[] = [
  // ── Big 5 & wildlife ──
  { src: '/images/gallery/lion-pride-resting.jpg', altKey: 'lionPrideResting', span: 'wide', isReal: true },
  { src: '/images/gallery/rhino-grazing.jpg',       altKey: 'rhinoGrazing',     span: 'tall', isReal: true },
  { src: '/images/gallery/lion-portrait.jpg',       altKey: 'lionPortrait',     span: '',     isReal: true },
  { src: '/images/gallery/rhino-profile.jpg',       altKey: 'rhinoProfile',     span: '',     isReal: true },
  { src: '/images/gallery/giraffe-acacia-tree.jpg', altKey: 'giraffeAcaciaTree', span: 'wide', isReal: true },
  { src: '/images/gallery/buffalo-portrait.jpg',    altKey: 'buffaloPortrait',  span: '',     isReal: true },
  { src: '/images/gallery/rhino-closeup.jpg',       altKey: 'rhinoCloseup',     span: '',     isReal: true },
  { src: '/images/gallery/giraffe-portrait.jpg',    altKey: 'giraffePortrait',  span: '',     isReal: true },
  { src: '/images/gallery/giraffe-walking.jpg',     altKey: 'giraffeWalking',   span: '',     isReal: true },
  { src: '/images/gallery/impala-herd.jpg',         altKey: 'impalaHerd',       span: 'tall', isReal: true },
  { src: '/images/gallery/impala-grazing.jpg',      altKey: 'impalaGrazing',    span: '',     isReal: true },
  { src: '/images/gallery/nyala-male.jpg',          altKey: 'nyalaMale',        span: '',     isReal: true },
  { src: '/images/gallery/nyala-bush.jpg',          altKey: 'nyalaBush',        span: '',     isReal: true },

  // ── Activities & fleet ──
  { src: '/images/gallery/safari-vehicle-guests.jpg', altKey: 'safariVehicleGuests', span: 'wide', isReal: true },
  { src: '/images/gallery/fleet-vehicles.jpg',          altKey: 'fleetVehicles',       span: '',     isReal: true },
  { src: '/images/gallery/quad-biking-1.jpg',           altKey: 'quadBiking1',         span: '',     isReal: true },
  { src: '/images/gallery/quad-biking-2.jpg',           altKey: 'quadBiking2',         span: '',     isReal: true },
  { src: '/images/gallery/quad-biking-3.jpg',           altKey: 'quadBiking3',         span: '',     isReal: true },
  { src: '/images/gallery/quad-biking-4.jpg',           altKey: 'quadBiking4',         span: '',     isReal: true },

  // ── New Facebook group photos (June 2026) ──
  { src: '/images/gallery/elephant-herd-waterhole-hluhluwe-imfolozi.jpg', altKey: 'elephantHerdWaterhole', span: 'wide', isReal: true },
  { src: '/images/gallery/male-lions-road-hluhluwe-imfolozi.jpg',         altKey: 'maleLionsRoad',        span: 'tall', isReal: true },
  { src: '/images/gallery/diza-travels-guests-elephant-connections.jpg',  altKey: 'guestsElephantConnections', span: '', isReal: true },
  { src: '/images/gallery/diza-travels-hiace-shuttle-kzn.jpg',            altKey: 'hiaceShuttleKzn',      span: 'wide', isReal: true },
  { src: '/images/gallery/nyala-female-bushveld-hluhluwe.jpg',            altKey: 'nyalaFemaleBushveld',  span: '',     isReal: true },
  { src: '/images/gallery/safari-hluhluwe-zululand-01.jpg',               altKey: 'safariZululand01',     span: '',     isReal: true },
  { src: '/images/gallery/safari-hluhluwe-zululand-02.jpg',               altKey: 'safariZululand02',     span: '',     isReal: true },
  { src: '/images/gallery/safari-hluhluwe-zululand-03.jpg',               altKey: 'safariZululand03',     span: '',     isReal: true },
  { src: '/images/gallery/safari-hluhluwe-zululand-04.jpg',               altKey: 'safariZululand04',     span: '',     isReal: true },
];