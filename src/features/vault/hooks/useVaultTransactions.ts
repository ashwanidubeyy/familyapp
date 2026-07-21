import { useEffect, useMemo, useState } from 'react';

import { vaultFirestoreService } from '../services/firestoreService';
import type { VaultTransaction } from '../types';

export const useVaultTransactions = () => {
  const [transactions, setTransactions] = useState<VaultTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = vaultFirestoreService.watchTransactions(
      records => {
        setTransactions(records);
        setLoading(false);
      },
      watchError => {
        setError(watchError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'income') {
          totals.income += transaction.amount;
        } else {
          totals.expenses += transaction.amount;
        }

        totals.balance = totals.income - totals.expenses;
        return totals;
      },
      { income: 0, expenses: 0, balance: 0 },
    );
  }, [transactions]);

  return { transactions, summary, loading, error };
};
