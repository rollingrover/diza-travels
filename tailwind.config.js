/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        earth: '#1A1208',
        dusk: '#2C1A0E',
        brown: '#3D2810',
        ochre: '#C4862A',
        'ochre-light': '#E8A84A',
        sand: '#D4A055',
        green: '#2D4A2A',
        bone: '#F5EFE0',
        ivory: '#FAF6EE',
        mist: '#EAE0CC',
        'text-muted': '#6B5D48',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '24px',
      },
      maxWidth: {
        content: '1200px',
      },
      height: {
        '100': '100px',      // scrolled state - smaller
        '70': '70px',      // default state - larger
        // Keep these for reference if used elsewhere
        '30': '30px',
        '42': '42px',
        '50': '50px',
        '60': '60px',
        '70': '70px',
        '80': '80px',
      },
      spacing: {
        '30': '30px',
        '42': '42px',
      },
    },
  },
  plugins: [],
};