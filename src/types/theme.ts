export type ThemeMode = 'light' | 'dark';

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  overlay: string;
  disabled: string;
  placeholder: string;
}

export interface TypographyScale {
  fontFamily: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semiBold: '600';
    bold: '700';
  };
}

export interface SpacingScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface BorderRadiusScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ElevationScale {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowScale {
  none: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
}

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  elevation: ElevationScale;
  shadows: ShadowScale;
}

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
