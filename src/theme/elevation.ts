import type { ElevationScale } from '@/types';

export const elevation: ElevationScale = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
};

export type ElevationKey = keyof ElevationScale;
