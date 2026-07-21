import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { BanknoteArrowDown, ChartPie } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { FinanceSummaryCard, VaultEmptyState, VaultSkeleton } from '../components';
import { useVaultTransactions } from '../hooks';

export const FinanceDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<VaultStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { transactions, summary, loading, error } = useVaultTransactions();

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Finance" subtitle="Income, expenses and monthly activity" leftIcon={ChartPie} />
        <FinanceSummaryCard summary={summary} />
        <View style={styles.graphCard}>
          <Text style={styles.sectionTitle}>Monthly Graph</Text>
          <View style={styles.graphBar}>
            <View style={styles.graphFill} />
          </View>
        </View>
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <Text style={styles.muted}>Updates automatically from your transactions.</Text>
        </View>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? (
          <VaultSkeleton count={3} />
        ) : transactions.length ? (
          <View style={styles.list}>
            {transactions.map(transaction => (
              <Pressable
                key={transaction.id}
                accessibilityRole="button"
                style={styles.row}
                onPress={() => navigation.navigate('TransactionDetails', {
                  transactionId: transaction.id,
                  source: transaction.visibility,
                })}
              >
                <BanknoteArrowDown
                  size={22}
                  color={transaction.type === 'income' ? theme.colors.success : theme.colors.error}
                  strokeWidth={2.4}
                />
                <View style={styles.body}>
                  <Text style={styles.rowTitle}>{transaction.categoryName}</Text>
                  <Text style={styles.muted}>{transaction.description || transaction.date}</Text>
                </View>
                <Text style={transaction.type === 'income' ? styles.income : styles.expense}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <VaultEmptyState title="No transactions" message="Add income or expenses from the Vault create menu." />
        )}
      </View>
    </GradientPageView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    graphCard: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    graphBar: {
      height: 90,
      justifyContent: 'flex-end',
      borderRadius: 16,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    graphFill: {
      height: 52,
      backgroundColor: theme.colors.primary,
    },
    breakdownCard: {
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    list: {
      gap: theme.spacing.sm,
    },
    row: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    rowTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    muted: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      marginTop: 3,
    },
    income: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.bold,
    },
    expense: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.bold,
    },
    error: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
    },
  });
