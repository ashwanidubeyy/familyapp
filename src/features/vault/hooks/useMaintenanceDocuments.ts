import { useEffect, useState } from 'react';

import { vaultFirestoreService } from '../services/firestoreService';
import type { VaultDocument } from '../types';

export const useMaintenanceDocuments = (assetId: string) => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = vaultFirestoreService.watchMaintenanceDocuments(
      assetId,
      records => {
        setDocuments(records);
        setLoading(false);
      },
      watchError => {
        setError(watchError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [assetId]);

  return { documents, loading, error };
};
