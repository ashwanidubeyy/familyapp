import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";

export async function checkNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const androidPerm = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (!androidPerm) return false;
  }

  const authStatus = await messaging().hasPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export function showPermissionSettingsAlert() {
  Alert.alert(
    "Notifications Disabled",
    "To receive SOS alerts, please enable notifications in your device settings.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ],
  );
}
