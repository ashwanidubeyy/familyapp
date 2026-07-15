import firestore from '@react-native-firebase/firestore';

import type { FinanceBill } from '../types';

const userCollectionPath = (userId: string): string => `users/${userId}/finance`;
const familyCollectionPath = (familyId: string): string => `families/${familyId}/finance`;

class FinanceService {
  watchBills(
    ownerId: string,
    familyId: string | null,
    visibility: 'private' | 'public',
    onChange: (bills: FinanceBill[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const collectionPath =
      visibility === 'public' && familyId
        ? familyCollectionPath(familyId)
        : userCollectionPath(ownerId);

    return firestore()
      .collection(collectionPath)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(doc => doc.data() as FinanceBill)),
        error => onError?.(error),
      );
  }
}

export const financeService = new FinanceService();
