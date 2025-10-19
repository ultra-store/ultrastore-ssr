import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MobileTabBar } from '@/components/mobile-tabbar';
import { getLayoutData } from '@/shared/api/getLayoutData';
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { header, footer, contacts, social } = await getLayoutData('front-page');

  return (
    <html lang="ru" className={formular.variable}>
      <body className="page">
        <Header
          topMenu={header.top_menu}
          categoriesMenu={header.categories_menu}
          contacts={contacts}
          socials={social}
        />
        <main className="main">
          {children}
        </main>
        <Footer socials={social} menu={footer.menu} contacts={contacts} />
        <MobileTabBar />
      </body>
    </html>
  );
}
