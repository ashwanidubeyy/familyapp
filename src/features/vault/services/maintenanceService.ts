import firestore from '@react-native-firebase/firestore';

import type { MaintenanceRecord } from '../types';

const userCollectionPath = (userId: string): string => `users/${userId}/maintenance`;
const familyCollectionPath = (familyId: string): string => `families/${familyId}/maintenance`;

class MaintenanceService {
  watchRecords(
    ownerId: string,
    familyId: string | null,
    visibility: 'private' | 'public',
    onChange: (records: MaintenanceRecord[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const collectionPath =
      visibility === 'public' && familyId
        ? familyCollectionPath(familyId)
        : userCollectionPath(ownerId);

    return firestore()
      .collection(collectionPath)
      .orderBy('serviceDate', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(doc => doc.data() as MaintenanceRecord)),
        error => onError?.(error),
      );
  }
}

export const maintenanceService = new MaintenanceService();
