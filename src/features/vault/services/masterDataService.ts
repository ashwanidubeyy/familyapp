import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { MasterDataCollection, MasterDataOption } from '../types';

const MASTER_DATA_ROOT = 'master_data';
const ITEMS_COLLECTION = 'items';

const toSortOrder = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

const mapMasterDataOption = (
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): MasterDataOption => {
  const data = doc.data();

  return {
    id: typeof data.id === 'string' ? data.id : doc.id,
    name: typeof data.name === 'string' ? data.name : doc.id,
    icon: typeof data.icon === 'string' ? data.icon : 'Folder',
    color: typeof data.color === 'string' ? data.color : '#2563EB',
    sortOrder: toSortOrder(data.sortOrder),
    isActive: data.isActive !== false,
  };
};

class MasterDataService {
  async getOptions(collection: MasterDataCollection): Promise<MasterDataOption[]> {
    const snapshot = await firestore()
      .collection(MASTER_DATA_ROOT)
      .doc(collection)
      .collection(ITEMS_COLLECTION)
      .where('isActive', '==', true)
      .get();

    return snapshot.docs
      .map(mapMasterDataOption)
      .sort((first, second) => first.sortOrder - second.sortOrder);
  }

  watchOptions(
    collection: MasterDataCollection,
    onChange: (options: MasterDataOption[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    return firestore()
      .collection(MASTER_DATA_ROOT)
      .doc(collection)
      .collection(ITEMS_COLLECTION)
      .where('isActive', '==', true)
      .onSnapshot(
        snapshot => {
          const options = snapshot.docs
            .map(mapMasterDataOption)
            .sort((first, second) => first.sortOrder - second.sortOrder);
          onChange(options);
        },
        error => {
          onError?.(error);
        },
      );
  }
}

export const masterDataService = new MasterDataService();
