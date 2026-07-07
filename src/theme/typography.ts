import { FONTS } from '@/constants';
import type { TypographyScale } from '@/types';

export const typography: TypographyScale = {
  fontFamily: {
    regular: FONTS.REGULAR,
    medium: FONTS.MEDIUM,
    semiBold: FONTS.SEMI_BOLD,
    bold: FONTS.BOLD,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    xxl: 32,
    xxxl: 40,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

export type TypographyVariant = keyof TypographyScale['fontSize'];
