import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="Va3hG3ieJYtJdYVNOgd1mJOgxobGAL2CryhESUImqOo" />
      </head>
      <body>
        {children}
        {/* Vercel Analytics — tracks page views automatically */}
        <Analytics />
      </body>
    </html>
  );
}