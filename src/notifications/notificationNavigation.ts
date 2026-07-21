import messaging from "@react-native-firebase/messaging";
import type { NotificationData } from "./types";

export function listenForNotificationOpenedApp(
  callback: (data: NotificationData) => void,
): () => void {
  return messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Notification opened app (background):", remoteMessage);
    if (remoteMessage.data) {
      callback(remoteMessage.data as unknown as NotificationData);
    }
  });
}

export async function getInitialNotification(
  callback: (data: NotificationData) => void,
): Promise<void> {
  const remoteMessage = await messaging().getInitialNotification();
  console.log("Initial notification (closed app):", remoteMessage);
  if (remoteMessage?.data) {
    callback(remoteMessage.data as unknown as NotificationData);
  }
}
