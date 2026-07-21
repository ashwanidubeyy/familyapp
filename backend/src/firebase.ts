import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Try to use service account from environment variables if available
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Fallback to Google Cloud Application Default Credentials (for Render)
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
