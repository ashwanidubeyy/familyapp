import auth from '@react-native-firebase/auth';
import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { VaultVisibility } from '@/domain';

import type {
  PasswordRecord,
  TransactionType,
  VaultDocument,
  VaultTransaction,
} from '../types';

type Unsubscribe = () => void;

export interface SaveDocumentInput {
  name: string;
  category: string;
  categoryName?: string;
  url: string;
  fileId?: string | null;
  fileType?: string | null;
  size?: number | string | null;
  vaultType: VaultVisibility;
  familyId?: string | null;
  expiryDate?: string | null;
  reminder?: string | null;
  description?: string;
  tags?: string[];
  assetId?: string | null;
  thumbnail?: string | null;
}

export interface SavePasswordInput {
  title: string;
  username: string;
  password: string;
  website?: string;
  categoryId?: string;
  categoryName?: string;
  notes?: string;
  vaultType: VaultVisibility;
  familyId?: string | null;
}

export interface SaveTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string;
  paymentMethod?: string;
  property?: string;
  description?: string;
  attachmentUrl?: string | null;
  recurring: boolean;
  reminder?: string | null;
  vaultType: VaultVisibility;
  familyId?: string | null;
}

const privateVaultPath = (uid: string): string => `users/${uid}/privateVault`;
const privateSubPath = (uid: string, collection: string): string =>
  `${privateVaultPath(uid)}/${collection}`;
const publicVaultPath = (familyId: string, collection: string): string =>
  `families/${familyId}/publicVault/${collection}`;

const currentUid = (): string => {
  const uid = auth().currentUser?.uid;

  if (!uid) {
    throw new Error('User not logged in');
  }

  return uid;
};

const toIso = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  const timestamp = value as FirebaseFirestoreTypes.Timestamp | undefined;
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }

  return new Date().toISOString();
};

const normalizeCategoryId = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
};

const mapDocument = (
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot | FirebaseFirestoreTypes.DocumentSnapshot,
): VaultDocument => {
  const data = snapshot.data() ?? {};
  const category = typeof data.category === 'string' ? data.category : '';
  const categoryName =
    typeof data.categoryName === 'string'
      ? data.categoryName
      : category.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  const visibility: VaultVisibility = data.vaultType === 'public' ? 'public' : 'private';
  const createdAt = toIso(data.createdAt);
  const updatedAt = toIso(data.updatedAt ?? data.createdAt);

  return {
    id: snapshot.id,
    name: typeof data.name === 'string' ? data.name : undefined,
    title: typeof data.name === 'string' ? data.name : 'Untitled Document',
    description: typeof data.description === 'string' ? data.description : '',
    category,
    categoryId: category,
    categoryName,
    ownerId: typeof data.ownerId === 'string' ? data.ownerId : '',
    familyId: typeof data.familyId === 'string' ? data.familyId : null,
    visibility,
    vaultType: visibility,
    propertyId: typeof data.propertyId === 'string' ? data.propertyId : null,
    assetId: typeof data.assetId === 'string' ? data.assetId : null,
    expiryDate: typeof data.expiryDate === 'string' ? data.expiryDate : null,
    reminderDate: typeof data.reminderDate === 'string' ? data.reminderDate : null,
    reminder: typeof data.reminder === 'string' ? data.reminder : null,
    fileUrl: typeof data.url === 'string' ? data.url : null,
    url: typeof data.url === 'string' ? data.url : null,
    fileId: typeof data.fileId === 'string' ? data.fileId : null,
    fileType: typeof data.fileType === 'string' ? data.fileType : null,
    size: typeof data.size === 'number' || typeof data.size === 'string' ? data.size : null,
    thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : null,
    createdBy: typeof data.createdBy === 'string' ? data.createdBy : '',
    createdAt,
    updatedAt,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
};

const mapPassword = (
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot | FirebaseFirestoreTypes.DocumentSnapshot,
): PasswordRecord => {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    title: typeof data.title === 'string' ? data.title : '',
    website: typeof data.website === 'string' ? data.website : '',
    username: typeof data.username === 'string' ? data.username : '',
    password: typeof data.password === 'string' ? data.password : '',
    notes: typeof data.notes === 'string' ? data.notes : '',
    categoryId: typeof data.categoryId === 'string' ? data.categoryId : 'passwords',
    categoryName: typeof data.categoryName === 'string' ? data.categoryName : 'Passwords',
    visibility: data.vaultType === 'public' ? 'public' : 'private',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt ?? data.createdAt),
  };
};

const mapTransaction = (
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot | FirebaseFirestoreTypes.DocumentSnapshot,
): VaultTransaction => {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    type: data.type === 'income' ? 'income' : 'expense',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    categoryId: typeof data.categoryId === 'string' ? data.categoryId : 'other',
    categoryName: typeof data.categoryName === 'string' ? data.categoryName : 'Other',
    date: typeof data.date === 'string' ? data.date : toIso(data.createdAt),
    paymentMethod: typeof data.paymentMethod === 'string' ? data.paymentMethod : '',
    property: typeof data.property === 'string' ? data.property : '',
    description: typeof data.description === 'string' ? data.description : '',
    attachmentUrl: typeof data.attachmentUrl === 'string' ? data.attachmentUrl : null,
    recurring: Boolean(data.recurring),
    reminder: typeof data.reminder === 'string' ? data.reminder : null,
    visibility: data.vaultType === 'public' ? 'public' : 'private',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt ?? data.createdAt),
  };
};

class VaultFirestoreService {
  watchDocumentsByCategory(
    category: string,
    onChange: (documents: VaultDocument[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const uid = currentUid();

    return firestore()
      .collection(privateVaultPath(uid))
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(mapDocument)),
        error => onError?.(error),
      );
  }

  watchRecentDocuments(
    onChange: (documents: VaultDocument[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const uid = currentUid();

    return firestore()
      .collection(privateVaultPath(uid))
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(mapDocument)),
        error => onError?.(error),
      );
  }

  async getDocument(documentId: string, source: VaultVisibility, familyId?: string | null): Promise<VaultDocument> {
    const uid = currentUid();
    const path = source === 'public' && familyId
      ? publicVaultPath(familyId, 'documents')
      : privateVaultPath(uid);
    const snapshot = await firestore().collection(path).doc(documentId).get();

    if (!snapshot.exists) {
      throw new Error('Document not found');
    }

    return mapDocument(snapshot);
  }

  async saveDocument(input: SaveDocumentInput): Promise<string> {
    const uid = currentUid();
    const category = normalizeCategoryId(input.category);
    const payload = {
      name: input.name.trim(),
      category,
      categoryName: input.categoryName ?? input.category,
      url: input.url,
      fileId: input.fileId ?? null,
      fileType: input.fileType ?? null,
      size: input.size ?? null,
      vaultType: input.vaultType,
      familyId: input.familyId ?? null,
      ownerId: uid,
      createdBy: uid,
      expiryDate: input.expiryDate ?? null,
      reminder: input.reminder ?? null,
      reminderDate: input.reminder ?? null,
      description: input.description?.trim() ?? '',
      tags: input.tags ?? [],
      assetId: input.assetId ?? null,
      thumbnail: input.thumbnail ?? null,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (input.vaultType === 'public' && input.familyId) {
      const ref = await firestore()
        .collection(publicVaultPath(input.familyId, 'documents'))
        .add(payload);
      return ref.id;
    }

    const ref = await firestore().collection(privateVaultPath(uid)).add(payload);
    return ref.id;
  }

  async updateDocument(documentId: string, input: Partial<SaveDocumentInput>): Promise<void> {
    const uid = currentUid();
    await firestore()
      .collection(privateVaultPath(uid))
      .doc(documentId)
      .update({
        ...input,
        category: input.category ? normalizeCategoryId(input.category) : undefined,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async deleteDocument(documentId: string): Promise<void> {
    const uid = currentUid();
    await firestore().collection(privateVaultPath(uid)).doc(documentId).delete();
  }

  async savePassword(input: SavePasswordInput): Promise<string> {
    const uid = currentUid();
    const path = input.vaultType === 'public' && input.familyId
      ? publicVaultPath(input.familyId, 'passwords')
      : privateSubPath(uid, 'passwords');
    const ref = await firestore().collection(path).add({
      ...input,
      ownerId: uid,
      vaultType: input.vaultType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
  }

  watchPasswords(
    onChange: (passwords: PasswordRecord[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const uid = currentUid();
    return firestore()
      .collection(privateSubPath(uid, 'passwords'))
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(mapPassword)),
        error => onError?.(error),
      );
  }

  async getPassword(passwordId: string): Promise<PasswordRecord> {
    const uid = currentUid();
    const snapshot = await firestore()
      .collection(privateSubPath(uid, 'passwords'))
      .doc(passwordId)
      .get();

    if (!snapshot.exists) {
      throw new Error('Password not found');
    }

    return mapPassword(snapshot);
  }

  async deletePassword(passwordId: string): Promise<void> {
    const uid = currentUid();
    await firestore().collection(privateSubPath(uid, 'passwords')).doc(passwordId).delete();
  }

  async saveTransaction(input: SaveTransactionInput): Promise<string> {
    const uid = currentUid();
    const path = input.vaultType === 'public' && input.familyId
      ? publicVaultPath(input.familyId, 'transactions')
      : privateSubPath(uid, 'transactions');
    const ref = await firestore().collection(path).add({
      ...input,
      ownerId: uid,
      vaultType: input.vaultType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
  }

  watchTransactions(
    onChange: (transactions: VaultTransaction[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const uid = currentUid();
    return firestore()
      .collection(privateSubPath(uid, 'transactions'))
      .orderBy('date', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(mapTransaction)),
        error => onError?.(error),
      );
  }

  async getTransaction(transactionId: string): Promise<VaultTransaction> {
    const uid = currentUid();
    const snapshot = await firestore()
      .collection(privateSubPath(uid, 'transactions'))
      .doc(transactionId)
      .get();

    if (!snapshot.exists) {
      throw new Error('Transaction not found');
    }

    return mapTransaction(snapshot);
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const uid = currentUid();
    await firestore()
      .collection(privateSubPath(uid, 'transactions'))
      .doc(transactionId)
      .delete();
  }

  watchMaintenanceDocuments(
    assetId: string,
    onChange: (documents: VaultDocument[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const uid = currentUid();
    return firestore()
      .collection(privateVaultPath(uid))
      .where('category', '==', 'maintenance')
      .where('assetId', '==', assetId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => onChange(snapshot.docs.map(mapDocument)),
        error => onError?.(error),
      );
  }
}

export const vaultFirestoreService = new VaultFirestoreService();

export const saveImageToFirestore = async (image: {
  name?: string;
  url: string;
  fileId?: string;
  fileType?: string;
  size?: number;
}) => {
  return vaultFirestoreService.saveDocument({
    name: image.name ?? 'Untitled image',
    category: 'insurance',
    categoryName: 'Insurance',
    url: image.url,
    fileId: image.fileId,
    fileType: image.fileType,
    size: image.size,
    vaultType: 'private',
  });
};
