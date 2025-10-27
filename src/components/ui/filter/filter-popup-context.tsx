'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface FilterPopupContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const FilterPopupContext = createContext<FilterPopupContextType | undefined>(undefined);

export const FilterPopupProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterPopupContext.Provider value={{
      isOpen,
      setIsOpen,
    }}
    >
      {children}
    </FilterPopupContext.Provider>
  );
};

export const useFilterPopup = () => {
  const context = useContext(FilterPopupContext);

  if (context === undefined) {
    throw new Error('useFilterPopup must be used within a FilterPopupProvider');
  }

  return context;
};
