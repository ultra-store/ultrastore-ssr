'use client';

import type { ReactNode } from 'react';

import { FilterPopupProvider } from './filter-popup-context';

export const FilterPopupLayout = ({ children }: { children: ReactNode }) => {
  return (
    <FilterPopupProvider>
      {children}
    </FilterPopupProvider>
  );
};
