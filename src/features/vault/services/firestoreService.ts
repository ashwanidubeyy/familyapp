import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const saveImageToFirestore = async (image: any) => {
  const uid = auth().currentUser?.uid;

  if (!uid) {
    throw new Error('User not logged in');
  }

  return firestore()
    .collection('users')
    .doc(uid)
    .collection('documents')
    .add({
      name: image.name,
      url: image.url,
      thumbnailUrl: image.thumbnailUrl,
      fileId: image.fileId,
      fileType: image.fileType,
      size: image.size,
      createdAt: firestore.FieldValue.serverTimestamp(),
      uploadedBy: uid,
    // need to update later
    category: 'insurance', 
    vaultType: 'private', 
    });
};