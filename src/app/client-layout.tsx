'use client';

import type { ReactNode } from 'react';

import { FilterPopupProvider } from '@/components/ui/filter/filter-popup-context';

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <FilterPopupProvider>
      {children}
    </FilterPopupProvider>
  );
};
