import firestore from '@react-native-firebase/firestore';

import type { PasswordRecord } from '../types';

const userCollectionPath = (userId: string): string => `users/${userId}/passwords`;
const familyCollectionPath = (familyId: string): string => `families/${familyId}/passwords`;

class PasswordService {
  generatePassword(length = 16): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

    return Array.from({ length })
      .map(() => characters[Math.floor(Math.random() * characters.length)])
      .join('');
  }

  watchPasswords(
    ownerId: string,
    familyId: string | null,
    visibility: 'private' | 'public',
    onChange: (records: PasswordRecord[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const collectionPath =
      visibility === 'public' && familyId
        ? familyCollectionPath(familyId)
        : userCollectionPath(ownerId);

    return firestore()
      .collection(collectionPath)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(doc => doc.data() as PasswordRecord)),
        error => onError?.(error),
      );
  }
}

export const passwordService = new PasswordService();
