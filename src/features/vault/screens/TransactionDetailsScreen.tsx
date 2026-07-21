import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { ReceiptText } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { vaultFirestoreService } from '../services/firestoreService';
import type { VaultTransaction } from '../types';

export const TransactionDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<VaultStackParamList, 'TransactionDetails'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [transaction, setTransaction] = useState<VaultTransaction | null>(null);

  useEffect(() => {
    vaultFirestoreService.getTransaction(route.params.transactionId).then(setTransaction);
  }, [route.params.transactionId]);

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Transaction" leftIcon={ReceiptText} />
        {transaction ? (
          <View style={styles.card}>
            <Info label="Type" value={transaction.type} />
            <Info label="Amount" value={`₹${transaction.amount}`} />
            <Info label="Category" value={transaction.categoryName} />
            <Info label="Date" value={transaction.date} />
            <Info label="Payment Method" value={transaction.paymentMethod || '-'} />
            <Info label="Property" value={transaction.property || '-'} />
            <Info label="Recurring" value={transaction.recurring ? 'Yes' : 'No'} />
            <Info label="Reminder" value={transaction.reminder || '-'} />
            <Info label="Description" value={transaction.description || '-'} />
          </View>
        ) : null}
      </View>
    </GradientPageView>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    card: {
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    row: {
      minHeight: 54,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
      gap: theme.spacing.md,
    },
    label: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    value: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
  });
