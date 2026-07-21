import { PermissionsAndroid, Platform, Alert } from "react-native";
import Geolocation from "react-native-geolocation-service";
import firestore from "@react-native-firebase/firestore";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { apiClient } from "@/api";
import { API_ENDPOINTS } from "@/constants";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export type SOSAlertStatus = "ACTIVE" | "RESOLVED";

export interface SOSAlert {
  id?: string;
  familyId: string;
  senderId: string;
  senderName?: string;
  location?: LocationData;
  message: string;
  status: SOSAlertStatus;
  createdAt: any; // Use Firestore Timestamp
  emergencyContacts: Array<{
    name: string;
    phone: string;
    category: string;
  }>;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    const permission = await Geolocation.requestAuthorization("whenInUse");
    return permission === "granted";
  }

  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  return false;
};

export const requestCallPhonePermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: "Phone Call Permission",
          message:
            "This app needs access to your phone to make direct calls during emergencies.",
          buttonPositive: "OK",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS doesn't need runtime permission
};

export const getCurrentLocation = async (): Promise<
  LocationData | undefined
> => {
  const hasPermission = await requestLocationPermission();

  return new Promise((resolve) => {
    if (!hasPermission) {
      // If no permission, just resolve without location
      resolve(undefined);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn("Location error:", error);
        resolve(undefined);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

export const getSOSPerson = async (familyId: string) => {
  const contactsSnapshot = await firestore()
    .collection("families")
    .doc(familyId)
    .collection("emergencyContacts")
    .where("isSOSPerson", "==", true)
    .get();

  if (contactsSnapshot.docs.length > 0) {
    const doc = contactsSnapshot.docs[0];
    return doc.data();
  }
  return null;
};

export const callSOSPerson = async (familyId: string) => {
  const sosPerson = await getSOSPerson(familyId);
  if (!sosPerson) {
    Alert.alert(
      "No SOS Person Set",
      "Please set an SOS person in emergency contacts first.",
    );
    return;
  }

  const hasPermission = await requestCallPhonePermission();
  if (!hasPermission) {
    Alert.alert(
      "Permission Denied",
      "Phone call permission is required to make emergency calls.",
    );
    return;
  }

  try {
    RNImmediatePhoneCall.immediatePhoneCall(sosPerson.phone);
  } catch (error) {
    console.error("Error making SOS call:", error);
    Alert.alert("Error", "Failed to make SOS call. Please try again.");
  }
};

export const sendSOSAlert = async (
  familyId: string,
  _senderId: string,
  _senderName?: string,
): Promise<string | null> => {
  try {
    // Get current location
    const location = await getCurrentLocation();

    // Call backend API to send SOS
    const response = await apiClient.post<{ alertId: string }>(
      API_ENDPOINTS.SOS.SEND,
      {
        familyId,
        latitude: location?.latitude,
        longitude: location?.longitude,
        message: "EMERGENCY! Please help immediately!",
      },
    );

    Alert.alert(
      "SOS Alert Sent",
      "Your family members and emergency contacts have been notified!",
    );

    return response.data.data?.alertId || null;
  } catch (error) {
    console.error("Error sending SOS alert:", error);
    Alert.alert("Error", "Failed to send SOS alert. Please try again.");
    return null;
  }
};

export const cancelSOSAlert = async (
  familyId: string,
  alertId: string,
): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.SOS.CANCEL, {
      familyId,
      alertId,
    });

    Alert.alert(
      "SOS Cancelled",
      "Your family members have been notified that you're safe!",
    );
  } catch (error) {
    console.error("Error canceling SOS alert:", error);
    Alert.alert("Error", "Failed to cancel SOS alert. Please try again.");
  }
};
