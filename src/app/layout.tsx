import type { Metadata } from "next";
import { App } from "../components/App";
import { Header } from "../components/Header";

import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Ultrastore",
  description:
    "Ultrastore — интернет-магазин Apple в Санкт-Петербурге. Оригинальные iPhone, iPad, MacBook, Apple Watch и аксессуары по выгодным ценам. Продажа новой техники, трейд-ин, быстрая доставка и гарантия. Купить Apple в СПб с гарантией.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={"body"}>
        <App>
          <Header />
          {children}
        </App>
      </body>
    </html>
  );
}
