'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface CatalogPopupContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const CatalogPopupContext = createContext<CatalogPopupContextType | undefined>(undefined);

export const CatalogPopupProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CatalogPopupContext.Provider value={{
      isOpen,
      setIsOpen,
    }}
    >
      {children}
    </CatalogPopupContext.Provider>
  );
};

export const useCatalogPopup = () => {
  const context = useContext(CatalogPopupContext);

  if (context === undefined) {
    throw new Error('useCatalogPopup must be used within a CatalogPopupProvider');
  }

  return context;
};
