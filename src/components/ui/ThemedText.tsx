import React, { useMemo } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/hooks';
import type { TypographyVariant } from '@/theme';

interface ThemedTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'error';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  style?: TextStyle;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'md',
  color = 'text',
  weight = 'regular',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const colorMap = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    error: theme.colors.error,
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          fontFamily: theme.typography.fontFamily[weight],
          fontSize: theme.typography.fontSize[variant as TypographyVariant],
          lineHeight: theme.typography.lineHeight[variant as TypographyVariant],
          color: colorMap[color],
        },
      }),
    [theme, variant, color, weight, colorMap],
  );

  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};
