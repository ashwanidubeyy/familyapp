import { useEffect, useState } from 'react';

import { vaultFirestoreService } from '../services/firestoreService';
import type { VaultDocument } from '../types';

interface UseVaultDocumentsResult {
  documents: VaultDocument[];
  loading: boolean;
  error: string | null;
}

export const useVaultDocuments = (category?: string): UseVaultDocumentsResult => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = category
      ? vaultFirestoreService.watchDocumentsByCategory(
          category,
          nextDocuments => {
            setDocuments(nextDocuments);
            setLoading(false);
          },
          watchError => {
            setError(watchError.message);
            setLoading(false);
          },
        )
      : vaultFirestoreService.watchRecentDocuments(
          nextDocuments => {
            setDocuments(nextDocuments);
            setLoading(false);
          },
          watchError => {
            setError(watchError.message);
            setLoading(false);
          },
        );

    return unsubscribe;
  }, [category]);

  return { documents, loading, error };
};
