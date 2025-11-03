'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  id: string | number
  productId: number
  name: string
  image?: string
  price: string
  quantity: number
  currency?: string
  variationSlug?: string
  variationId?: number
}

interface CartContextType {
  items: CartItem[]
  isHydrated: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getCartItem: (productId: number, variationSlug?: string, variationId?: number) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ultrastore_cart';

// Load cart from localStorage synchronously
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      return JSON.parse(savedCart) as CartItem[];
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }

  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // On server, items start as empty array
  // On client, items will be loaded from localStorage after hydration
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = loadCartFromStorage();

      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setItems(savedItems);
        setIsHydrated(true);
      }, 0);
    }
  }, []);

  // Save cart to localStorage whenever items change (only on client)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  const generateCartItemId = useCallback((productId: number, variationSlug?: string, variationId?: number): string => {
    if (variationSlug) {
      return `${productId}_${variationSlug}`;
    }
    if (variationId) {
      return `${productId}_variation_${variationId}`;
    }

    return String(productId);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const cartItemId = generateCartItemId(item.productId, item.variationSlug, item.variationId);
      const existingItem = prevItems.find((i) => {
        const existingId = generateCartItemId(i.productId, i.variationSlug, i.variationId);

        return existingId === cartItemId;
      });

      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map((i) => {
          const existingId = generateCartItemId(i.productId, i.variationSlug, i.variationId);

          if (existingId === cartItemId) {
            return {
              ...i,
              quantity: i.quantity + 1,
            };
          }

          return i;
        });
      }

      // Add new item
      return [...prevItems, {
        ...item,
        quantity: 1,
      }];
    });
  }, [generateCartItemId]);

  const removeItem = useCallback((id: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => {
      const itemId = generateCartItemId(item.productId, item.variationSlug, item.variationId);

      return itemId !== String(id);
    }));
  }, [generateCartItemId]);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);

      return;
    }

    setItems((prevItems) => prevItems.map((item) => {
      const itemId = generateCartItemId(item.productId, item.variationSlug, item.variationId);

      if (itemId === String(id)) {
        return {
          ...item,
          quantity,
        };
      }

      return item;
    }));
  }, [removeItem, generateCartItemId]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;

      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  // Normalize items for display (assign proper ids)
  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      const itemId = generateCartItemId(item.productId, item.variationSlug, item.variationId);

      return {
        ...item,
        id: itemId,
      };
    });
  }, [items, generateCartItemId]);

  const getCartItem = useCallback((
    productId: number,
    variationSlug?: string,
    variationId?: number,
  ): CartItem | undefined => {
    const cartItemId = generateCartItemId(productId, variationSlug, variationId);

    return normalizedItems.find((item) => {
      const itemId = generateCartItemId(item.productId, item.variationSlug, item.variationId);

      return itemId === cartItemId;
    });
  }, [normalizedItems, generateCartItemId]);

  const value: CartContextType = {
    items: normalizedItems,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
