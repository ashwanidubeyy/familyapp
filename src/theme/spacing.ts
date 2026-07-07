import type { SpacingScale } from '@/types';

export const spacing: SpacingScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export type SpacingKey = keyof SpacingScale;
