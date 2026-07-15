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
        <Analytics />
      </body>
    </html>
  );
}