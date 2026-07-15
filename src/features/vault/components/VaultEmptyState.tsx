import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FolderOpen } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface VaultEmptyStateProps {
  title: string;
  message: string;
}

export const VaultEmptyState: React.FC<VaultEmptyStateProps> = ({
  title,
  message,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <FolderOpen size={26} color={theme.colors.primary} strokeWidth={2.3} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      minHeight: 112,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    message: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      textAlign: 'center',
    },
  });
