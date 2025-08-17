import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "UltraStore - WooCommerce & Next.js",
  description:
    "Интеграция WooCommerce и Next.js для современного интернет-магазина",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
