import { imagekit } from './imageKitService';
import { authenticationEndpoint } from '../../../app/lib/imagekit';
import RNFS from 'react-native-fs';

interface UploadAsset {
  uri: string;
  type?: string | null;
  fileName?: string | null;
  name?: string | null;
  size?: number | null;
}

const authenticator = async () => {
  const response = await fetch(authenticationEndpoint);

  const text = await response.text();

  console.log("Status:", response.status);
  console.log("Auth Response:", text);

  return JSON.parse(text);
};

export const uploadFileToImageKit = async (asset: UploadAsset) => {
  const auth = await authenticator();
  const fileUri = asset.uri.replace('file://', '');
  const contentType = asset.type ?? 'application/octet-stream';
  const fileName = asset.fileName ?? asset.name ?? `vault_file_${Date.now()}`;

  const base64 = await RNFS.readFile(fileUri, 'base64');

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: `data:${contentType};base64,${base64}`,
        fileName,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
      },
      (error:any, result:any) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );
  });
};

export const uploadImage = uploadFileToImageKit;
