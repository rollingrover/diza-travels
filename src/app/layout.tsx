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
        <meta name="yandex-verification" content="4c96689fd352fbbc" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}