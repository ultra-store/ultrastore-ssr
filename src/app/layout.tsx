import type { Metadata } from "next";
import Header from "@/components/Header";
import { formular } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultrastore",
  description: "Интернет-магазин электроники и техники Apple в Санкт-Петербурге",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={formular.variable}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
