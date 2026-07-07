export const formatDate = (
  date: Date | string | number,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, options).format(parsedDate);
};

export const formatRelativeDate = (
  date: Date | string | number,
  locale = 'en-US',
): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffMs = parsedDate.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    return rtf.format(diffHours, 'hour');
  }

  return rtf.format(diffDays, 'day');
};
