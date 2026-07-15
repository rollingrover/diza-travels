import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Vercel Analytics — tracks page views automatically */}
        <Analytics />
        </body>
    </html>
  );
}