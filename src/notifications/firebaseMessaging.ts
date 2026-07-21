import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";
import { SOSAlert } from "@/services/sosService";
import { registerDevice } from "@/api/services";

export async function getDeviceToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export async function saveDeviceToken(
  token: string,
): Promise<void> {
  try {
    await registerDevice(token);
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
}

export function listenForTokenRefresh(): () => void {
  return messaging().onTokenRefresh(async (token) => {
    console.log("FCM Token refreshed:", token);
    await saveDeviceToken(token);
  });
}

export function listenForForegroundMessages(): () => void {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground message received:", remoteMessage);

    if (remoteMessage.notification) {
      await notifee.displayNotification({
        title: remoteMessage.notification.title || "Notification",
        body: remoteMessage.notification.body || "",
        data: remoteMessage.data,
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH,
          sound: "default",
          pressAction: {
            id: "default",
          },
        },
        ios: {
          sound: "default",
        },
      });
    }
  });
}

// Create a default channel for Android (required for notifications)
export async function createNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
  }
}

export async function displaySOSNotification(
  sosAlert: SOSAlert,
): Promise<void> {
  try {
    await notifee.displayNotification({
      id: sosAlert.id,
      title: "🚨 EMERGENCY SOS ALERT",
      body: `${sosAlert.senderName || "Someone"} needs help immediately!`,
      data: {
        type: "SOS",
        familyId: sosAlert.familyId,
        alertId: sosAlert.id ?? "",
      },
      android: {
        channelId: "default",
        importance: AndroidImportance.HIGH,
        sound: "default",
        pressAction: {
          id: "default",
        },
      },
      ios: {
        sound: "default",
      },
    });
    console.log("SOS local notification displayed:", sosAlert);
  } catch (error) {
    console.error("Error displaying SOS notification:", error);
  }
}
