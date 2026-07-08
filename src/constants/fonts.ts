export const FONTS = {
  REGULAR: 'System',
  MEDIUM: 'System',
  SEMI_BOLD: 'System',
  BOLD: 'System',
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];
