import React, { useMemo } from 'react';
import {
  TextInput,
  StyleSheet,
  type TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '@/hooks';
import { ThemedText } from './ThemedText';

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        input: {
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
          fontSize: theme.typography.fontSize.md,
          fontFamily: theme.typography.fontFamily.regular,
        },
      }),
    [theme, error],
  );

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText variant="sm" weight="medium">
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
      {error && (
        <ThemedText variant="xs" color="error">
          {error}
        </ThemedText>
      )}
    </View>
  );
};
