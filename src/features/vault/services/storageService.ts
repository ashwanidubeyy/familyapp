import type { UploadFileInput, UploadTarget } from '../types';

class StorageService {
  getStoragePath(target: UploadTarget): string {
    const basePath =
      target.visibility === 'public'
        ? `public/${target.familyId ?? 'unassigned'}`
        : `private/${target.ownerId}`;

    return `${basePath}/${target.kind}/${target.fileName}`;
  }

  async uploadFile(input: UploadFileInput): Promise<string> {
    const storagePath = this.getStoragePath(input);

    throw new Error(
      `Firebase Storage upload is not linked yet. Install @react-native-firebase/storage and upload ${input.localUri} to ${storagePath}.`,
    );
  }
}

export const storageService = new StorageService();
