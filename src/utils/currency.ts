export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};
