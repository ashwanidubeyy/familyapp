import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface VaultSkeletonProps {
  count?: number;
}

export const VaultSkeleton: React.FC<VaultSkeletonProps> = ({ count = 4 }) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.icon} />
          <View style={styles.label} />
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    card: {
      width: 76,
      minHeight: 104,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: 18,
      backgroundColor: isDark ? '#1B2434' : '#F3F6FA',
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: isDark ? '#273244' : '#E5ECF5',
    },
    label: {
      width: 48,
      height: 10,
      borderRadius: 5,
      backgroundColor: isDark ? '#273244' : '#E5ECF5',
    },
  });
