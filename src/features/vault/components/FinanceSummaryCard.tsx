import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import type { VaultFinanceSummary } from '../types';

interface FinanceSummaryCardProps {
  summary: VaultFinanceSummary;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const FinanceSummaryCard: React.FC<FinanceSummaryCardProps> = ({
  summary,
}) => {
  const { theme, isDark } = useTheme();
  const total = Math.max(summary.income, 1);
  const expensePercent = Math.min((summary.expenses / total) * 100, 100);
  const styles = useMemo(
    () => createStyles(theme, isDark, expensePercent),
    [theme, isDark, expensePercent],
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.caption}>Total Balance</Text>
          <Text style={styles.balance}>{formatCurrency(summary.balance)}</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>This Month</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.incomeProgress} />
        <View style={styles.expenseProgress} />
      </View>
      <View style={styles.legend}>
        <Text style={styles.incomeText}>Income {formatCurrency(summary.income)}</Text>
        <Text style={styles.expenseText}>Expenses {formatCurrency(summary.expenses)}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean, expensePercent: number) =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      shadowColor: '#64748B',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: isDark ? 0.16 : 0.09,
      shadowRadius: 14,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
    },
    caption: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
    },
    balance: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xxl,
      lineHeight: theme.typography.lineHeight.xxl,
      marginTop: 4,
    },
    filterPill: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDark ? '#1B2434' : '#F1F5FF',
    },
    filterText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: isDark ? '#223047' : '#E8EEF7',
      overflow: 'hidden',
    },
    incomeProgress: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.colors.success,
    },
    expenseProgress: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: `${expensePercent}%`,
      backgroundColor: '#F472B6',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    incomeText: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
    },
    expenseText: {
      color: '#F472B6',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
    },
  });
