'use client';

import type { ReactNode } from 'react';

import { CatalogPopupProvider } from '@/components/ui/catalog-popup';
import { FilterPopupProvider } from '@/components/ui/filter/filter-popup-context';
import { CartProvider } from '@/shared/context/cart-context';
import { CheckoutProvider } from '@/shared/context/checkout-context';

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <CartProvider>
      <CheckoutProvider>
        <FilterPopupProvider>
          <CatalogPopupProvider>
            {children}
          </CatalogPopupProvider>
        </FilterPopupProvider>
      </CheckoutProvider>
    </CartProvider>
  );
};
