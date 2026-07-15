import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface AuthButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        isDisabled ? styles.disabled : undefined,
        pressed ? styles.pressed : undefined,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#E8A17A'} />
      ) : (
        <Text style={variant === 'primary' ? styles.primaryText : styles.secondaryText}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    button: {
      minHeight: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    primary: {
      backgroundColor: isDark ? '#9B5F3E' : '#A96745',
    },
    secondary: {
      backgroundColor: isDark ? '#251D19' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#4B352C' : '#EEE2DA',
    },
    disabled: {
      opacity: 0.6,
    },
    pressed: {
      opacity: 0.82,
    },
    primaryText: {
      color: '#FFFFFF',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    secondaryText: {
      color: isDark ? '#FFF8F2' : '#2E211B',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
  });
