import firestore from '@react-native-firebase/firestore';

import type { VaultVisibility } from '@/domain';

import type { CreateDocumentInput, VaultDocument } from '../types';

const nowIso = (): string => new Date().toISOString();

const userCollectionPath = (userId: string): string => `users/${userId}/documents`;
const familyCollectionPath = (familyId: string): string => `families/${familyId}/documents`;

class DocumentService {
  async createDocument(input: CreateDocumentInput): Promise<VaultDocument> {
    const collectionPath =
      input.visibility === 'public' && input.familyId
        ? familyCollectionPath(input.familyId)
        : userCollectionPath(input.ownerId);
    const ref = firestore().collection(collectionPath).doc();
    const timestamp = nowIso();
    const document: VaultDocument = {
      id: ref.id,
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      categoryId: input.categoryId,
      categoryName: input.categoryName,
      ownerId: input.ownerId,
      familyId: input.familyId ?? null,
      visibility: input.visibility,
      propertyId: input.propertyId ?? null,
      expiryDate: input.expiryDate ?? null,
      reminderDate: input.reminderDate ?? null,
      fileUrl: input.fileUrl ?? null,
      thumbnail: input.thumbnail ?? null,
      createdBy: input.ownerId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await ref.set(document);

    return document;
  }

  async renameDocument(
    documentId: string,
    title: string,
    ownerId: string,
    visibility: VaultVisibility,
    familyId?: string | null,
  ): Promise<void> {
    await this.getDocumentRef(documentId, ownerId, visibility, familyId).update({
      title: title.trim(),
      updatedAt: nowIso(),
    });
  }

  async deleteDocument(
    documentId: string,
    ownerId: string,
    visibility: VaultVisibility,
    familyId?: string | null,
  ): Promise<void> {
    await this.getDocumentRef(documentId, ownerId, visibility, familyId).delete();
  }

  async movePrivateToPublic(
    document: VaultDocument,
    familyId: string,
  ): Promise<VaultDocument> {
    if (document.visibility === 'public') {
      return document;
    }

    const db = firestore();
    const privateRef = db.collection(userCollectionPath(document.ownerId)).doc(document.id);
    const publicRef = db.collection(familyCollectionPath(familyId)).doc(document.id);
    const updatedDocument: VaultDocument = {
      ...document,
      familyId,
      visibility: 'public',
      updatedAt: nowIso(),
    };
    const batch = db.batch();
    batch.set(publicRef, updatedDocument);
    batch.delete(privateRef);
    await batch.commit();

    return updatedDocument;
  }

  watchDocuments(
    visibility: VaultVisibility,
    ownerId: string,
    familyId: string | null,
    onChange: (documents: VaultDocument[]) => void,
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
        snapshot => {
          onChange(snapshot.docs.map(doc => doc.data() as VaultDocument));
        },
        error => onError?.(error),
      );
  }

  private getDocumentRef(
    documentId: string,
    ownerId: string,
    visibility: VaultVisibility,
    familyId?: string | null,
  ) {
    const collectionPath =
      visibility === 'public' && familyId
        ? familyCollectionPath(familyId)
        : userCollectionPath(ownerId);

    return firestore().collection(collectionPath).doc(documentId);
  }
}

export const documentService = new DocumentService();
