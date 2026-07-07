import type { BorderRadiusScale } from '@/types';

export const borderRadius: BorderRadiusScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export type BorderRadiusKey = keyof BorderRadiusScale;
