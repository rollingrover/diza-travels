/**
 * ─────────────────────────────────────────────────────────────────────────
 * BUSINESS DATA — Single Source of Truth
 * ─────────────────────────────────────────────────────────────────────────
 * Name / Address / Phone (NAP) consistency is a major local-SEO ranking
 * factor — this data must be byte-for-byte identical everywhere it
 * appears: footer, contact page, JSON-LD schema, Google Business Profile.
 * Keeping it in one file prevents drift.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const business = {
  legalName: "DIZA TRAVELS Safari's & Shuttle Services",
  shortName: 'DIZA TRAVELS',
  tagline: "From Door to Wild, Your Safari Starts Here.",

  // Confirmed from uploaded marketing flyers (lebombohike.png, CulturalTour.png)
  founder: {
    name: 'Chris Manqele',
    title: 'Founder & Lead Guide',
  },

  contact: {
    phonePrimary: '+27695620240',       // tel: link format
    phonePrimaryDisplay: '+27 69 562 0240',
    phoneSecondary: '+27796702530',     // confirmed via vehicle livery + Embark banner
    phoneSecondaryDisplay: '+27 79 670 2530',
    emailBusiness: 'safari@dizatravels.co.za',
    whatsapp: '27695620240',            // wa.me format (no +)
  },

  address: {
    officeName: 'Diza Travels Booking Office, Kwa-Smolo',
    streetAddress: 'R22, Kwa Smolo Area',
    addressLocality: 'Hluhluwe',
    addressRegion: 'KwaZulu-Natal',
    postalCode: '3960', // Hluhluwe postal code — verify before launch
    addressCountry: 'ZA',
    countryName: 'South Africa',
    // Human-readable directions, sourced from CulturalTour.png flyer
    directions: "On the left as you pass Ubizane Zululand Safari Lodge, on your way to Memorial Gate.",
  },

  geo: {
    // Exact GPS coordinates for the DIZA TRAVELS pinned business location,
    // verified directly from the official Google Earth/Maps place listing
    // "Diza Travels, Hluhluwe" (Place ID encoded in the source URL).
    // Source: https://earth.google.com/web/@-28.0175361,32.19773362,...
    latitude: -28.017788,
    longitude: 32.198622,
  },

  social: {
    facebook: 'https://www.facebook.com/safari.diza.travels',
    instagram: 'https://www.instagram.com/dizatravels/',
    tiktok: 'https://www.tiktok.com/@dizatravelsshuttl',
    whatsapp: 'https://wa.me/27695620240',
    // Placeholder — no confirmed TripAdvisor listing yet, link to # until provided
    tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g2279042-d28498702-Reviews-Diza_Travels-Hluhluwe_KwaZulu_Natal.html',
  },

  /**
   * Tourism Partners — cross-promoted local/regional operators.
   * Per final audit: all hrefs as provided, vertical list in footer.
   */
  partners: [
    { name: 'Diza Kwa-Smolo Community Uplifting Initiative', href: 'https://www.dizakwasmolo.co.za' },
    { name: 'Zatours', href: 'https://zatours.co.za' },
    { name: 'Mzamo Cultural Village & Homestead', href: 'https://www.mzamovillagehomestead.co.za' },
    { name: 'eThlathini Rest Camp', href: 'https://www.ethlathini.co.za' },
    { name: 'Opdesk', href: 'https://www.opdesk.app' },    
  ],

  credit: {
    label: 'Web Design by RollingRover Productions',
    href: 'https://www.rollingrover.co.za',
  },

  website: 'https://www.dizatravels.co.za',

  areasServed: [
    'Hluhluwe–iMfolozi Game Reserve',
    'St. Lucia / iSimangaliso Wetland Park',
    'Lebombo Mountains',
    'Tembe Elephant Park',
    'King Shaka International Airport',
    'Richards Bay Airport',
    'Durban',
    'Sodwana Bay',
    'Phinda Private Game Reserve',
  ],

  priceRange: 'R100 – R1,200 per person',
  currenciesAccepted: 'ZAR',

  foundingDate: undefined, // unknown — add if confirmed
} as const;
