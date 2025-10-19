import { useMemo } from 'react';

export const formatPriceNumber = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return '0';
  }

  return numPrice.toLocaleString('ru-RU');
};

export const formatPrice = (price: string | number, currency = '₽'): string => {
  return `${formatPriceNumber(price)} ${currency}`;
};

export const useFormattedPrice = (
  price: string | number,
  currency = '₽',
  regularPrice?: string | number,
  salePrice?: string | number,
  onSale?: boolean,
): string => {
  return useMemo(() => {
    if (onSale && regularPrice && salePrice) {
      return `${formatPriceNumber(salePrice)} ${currency} ${formatPriceNumber(regularPrice)} ${currency}`;
    }

    return formatPrice(price, currency);
  }, [price, currency, regularPrice, salePrice, onSale]);
};
