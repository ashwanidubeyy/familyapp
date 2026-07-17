import { imagekit } from './imageKitService';
import {
  urlEndpoint,
  publicKey,
  authenticationEndpoint,
} from '../../../app/lib/imagekit';

const authenticator = async () => {
  const response = await fetch(authenticationEndpoint);

  const text = await response.text();

  console.log("Status:", response.status);
  console.log("Auth Response:", text);

  return JSON.parse(text);
};

export const uploadImage = async (asset: any) => {
  const auth = await authenticator();

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: asset.uri,
        fileName:
          asset.fileName ?? `image_${Date.now()}.jpg`,

        token: auth?.token,
        signature: auth?.signature,
        expire: auth?.expire,
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







































// import {
//     launchCamera,
//     launchImageLibrary,
//     type Asset,
//   } from 'react-native-image-picker';
  
//   import DocumentPicker from 'react-native-document-picker';
//   import * as functions from 'firebase-functions';
//   export interface UploadResult {
//     fileName: string;
//     fileSize?: number;
//     mimeType?: string;
//     url: string;
//     thumbnailUrl?: string;
//   }

// import ImageKit from 'imagekit';

// const imagekit = new ImageKit({
//   publicKey: 'YOUR_PUBLIC_KEY',
//   privateKey: 'YOUR_PRIVATE_KEY',
//   urlEndpoint: 'https://ik.imagekit.io/YOUR_IMAGEKIT_ID',
// });

// export const imageKitAuth = functions.https.onRequest(
//   (req: any, res: any) => {
//     try {
//       const authenticationParameters =
//         imagekit.getAuthenticationParameters();

//       res.json(authenticationParameters);
//     } catch (error) {
//       res.status(500).json({
//         message: 'Authentication failed',
//       });
//     }
//   },
// );
  
//   class UploadService {
//     async pickAndUploadImage(): Promise<UploadResult | null> {
//         const response = await launchImageLibrary({
//           mediaType: 'photo',
//           quality: 0.8,
//           selectionLimit: 1,
//         });
    
//         if (response.didCancel) {
//           return null;
//         }
    
//         if (!response.assets?.length) {
//           return null;
//         }
    
//         return this.uploadAsset(response.assets[0]);
//       }

//       async captureAndUploadImage(): Promise<UploadResult | null> {
//         const response = await launchCamera({
//           mediaType: 'photo',
//           quality: 0.8,
//           saveToPhotos: true,
//         });
    
//         if (response.didCancel) {
//           return null;
//         }
    
//         if (!response.assets?.length) {
//           return null;
//         }
    
//         return this.uploadAsset(response.assets[0]);
//       }

//       async pickAndUploadPdf(): Promise<UploadResult | null> {
//         try {
//           const file = await DocumentPicker.pickSingle({
//             type: [DocumentPicker.types.pdf],
//           });
    
//           const result = await imageKitService.uploadFile({
//             uri: file.uri,
//             fileName: file.name ?? `document-${Date.now()}.pdf`,
//             mimeType: file.type ?? 'application/pdf',
//           });
    
//           return {
//             fileName: file.name ?? '',
//             fileSize: file.size,
//             mimeType: file.type,
//             url: result.url,
//             thumbnailUrl: result.thumbnailUrl,
//           };
//         } catch (error) {
//           if (DocumentPicker.isCancel(error)) {
//             return null;
//           }
    
//           throw error;
//         }
//       }
    
//       private async uploadAsset(
//         asset: Asset,
//       ): Promise<UploadResult> {
//         if (!asset.uri) {
//           throw new Error('Image uri not found.');
//         }
    
//         const result = await imageKitService.uploadFile({
//           uri: asset.uri,
//           fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
//           mimeType: asset.type ?? 'image/jpeg',
//         });
    
//         return {
//           fileName: asset.fileName ?? '',
//           fileSize: asset.fileSize,
//           mimeType: asset.type,
//           url: result.url,
//           thumbnailUrl: result.thumbnailUrl,
//         };
//       }
//       /**
//    * Upload any local file directly
//    */
//   async uploadFromPath(
//     uri: string,
//     fileName: string,
//     mimeType: string,
//   ): Promise<UploadResult> {
//     const result = await imageKitService.uploadFile({
//       uri,
//       fileName,
//       mimeType,
//     });

//     return {
//       fileName,
//       mimeType,
//       url: result.url,
//       thumbnailUrl: result.thumbnailUrl,
//     };
//   }

//   /**
//    * Delete uploaded file
//    */
//   async deleteFile(fileId: string): Promise<void> {
//     await imageKitService.deleteFile(fileId);
//   }

//   /**
//    * Get file extension
//    */
//   getFileExtension(fileName: string): string {
//     const index = fileName.lastIndexOf('.');

//     if (index === -1) {
//       return '';
//     }

//     return fileName.substring(index + 1).toLowerCase();
//   }

//   /**
//    * Check if file is an image
//    */
//   isImage(fileName: string): boolean {
//     const extension = this.getFileExtension(fileName);

//     return [
//       'jpg',
//       'jpeg',
//       'png',
//       'gif',
//       'webp',
//       'heic',
//     ].includes(extension);
//   }

//   /**
//    * Check if file is a PDF
//    */
//   isPdf(fileName: string): boolean {
//     return this.getFileExtension(fileName) === 'pdf';
//   }
// }

// export const uploadService = new UploadService();