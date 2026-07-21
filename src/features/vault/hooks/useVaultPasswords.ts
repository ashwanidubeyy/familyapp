import { useEffect, useState } from 'react';

import { vaultFirestoreService } from '../services/firestoreService';
import type { PasswordRecord } from '../types';

export const useVaultPasswords = () => {
  const [passwords, setPasswords] = useState<PasswordRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = vaultFirestoreService.watchPasswords(
      records => {
        setPasswords(records);
        setLoading(false);
      },
      watchError => {
        setError(watchError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { passwords, loading, error };
};
