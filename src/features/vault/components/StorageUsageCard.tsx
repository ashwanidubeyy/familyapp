import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface StorageUsageCardProps {
  usedGb: number;
  limitGb: number;
}

export const StorageUsageCard: React.FC<StorageUsageCardProps> = ({
  usedGb,
  limitGb,
}) => {
  const { theme } = useTheme();
  const percent = Math.min((usedGb / Math.max(limitGb, 1)) * 100, 100);
  const styles = useMemo(() => createStyles(theme, percent), [theme, percent]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Storage Used</Text>
        <Text style={styles.value}>{usedGb} GB / {limitGb} GB</Text>
      </View>
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, percent: number) =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    value: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
    track: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: theme.colors.divider,
    },
    fill: {
      width: `${percent}%`,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#B77451',
    },
  });
