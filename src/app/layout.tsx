import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { formular } from '@/shared/styles/fonts';

import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ultrastore',
  description: 'Интернет-магазин электроники и техники Apple в Санкт-Петербурге',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={formular.variable}>
      <body>
        <Header />
        <main className="container" style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
