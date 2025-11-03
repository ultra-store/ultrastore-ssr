/**
 * Normalize currency code to symbol
 * Converts currency codes (RUB, USD, EUR) to their symbols (₽, $, €)
 */
export const normalizeCurrency = (currency?: string): string => {
  if (!currency) {
    return '₽';
  }

  // Convert currency codes to symbols
  const currencyMap: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };

  return currencyMap[currency.toUpperCase()] || currency;
};

