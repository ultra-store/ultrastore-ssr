"use client";

import React from "react";
import { ThemeProvider } from "@gravity-ui/uikit";
import { CartProvider } from "@/contexts/CartContext";

interface AppProps {
  children: React.ReactNode;
}
export const App: React.FC<AppProps> = ({ children }) => {
  return (
    <ThemeProvider theme={'light'}>
      <CartProvider>
        <div>{children}</div>
      </CartProvider>
    </ThemeProvider>
  );
};
