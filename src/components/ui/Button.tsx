import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.borderRadius.md,
          opacity: disabled ? 0.6 : 1,
        },
        sm: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        md: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
        },
        lg: {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
        },
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        },
        text: {
          fontFamily: theme.typography.fontFamily.semiBold,
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.textInverse,
        },
        outlineText: {
          color: theme.colors.primary,
        },
      }),
    [theme, disabled],
  );

  const variantStyle =
    variant === 'outline' ? styles.outline : styles[variant];
  const sizeStyle = styles[size];
  const labelStyle = variant === 'outline' ? styles.outlineText : undefined;

  return (
    <Pressable
      disabled={disabled}
      style={[styles.base, sizeStyle, variantStyle, style]}
      {...props}>
      <Text style={[styles.text, labelStyle, textStyle]}>{title}</Text>
    </Pressable>
  );
};
