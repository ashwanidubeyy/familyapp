export interface DeviceToken {
  token: string;
  platform: "ios" | "android";
  updatedAt: any; // Timestamp from firestore
}

export interface SOSNotificationData {
  type: "SOS";
  familyId: string;
  alertId: string;
}

export type NotificationData = SOSNotificationData;
