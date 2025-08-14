"use client";

import React from "react";
import { ThemeProvider } from "@gravity-ui/uikit";
import { CartProvider } from "@/contexts/CartContext";
import { ServerUnavailable } from "./ServerUnavailable";

interface AppProps {
  children: React.ReactNode;
}
export const App: React.FC<AppProps> = ({ children }) => {
  const [serverOk, setServerOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    async function ping() {
      try {
        const res = await fetch('/api/woocommerce/ping', {signal: controller.signal, cache: 'no-store'});
        if (!aborted) setServerOk(res.ok);
      } catch {
        if (!aborted) setServerOk(false);
      }
    }
    ping();
    const id = setInterval(ping, 15000);
    return () => {
      aborted = true;
      controller.abort();
      clearInterval(id);
    };
  }, []);

  return (
    <ThemeProvider theme={'light'}>
      <CartProvider>
        {serverOk === false ? <ServerUnavailable /> : <div>{children}</div>}
      </CartProvider>
    </ThemeProvider>
  );
};
