const createNextIntlPlugin = require('next-intl/plugin');

// next-intl v3: pass the path to i18n.ts (or i18n/request.ts)
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: false,
};

module.exports = withNextIntl(nextConfig);
