import * as admin from "firebase-admin";
import { db, messaging } from "../firebase";

export const sendSOSNotifications = async (
  familyId: string,
  senderId: string,
  senderName: string | undefined,
  alertId: string,
) => {
  // Get all family members
  const membersSnapshot = await db
    .collection(`families/${familyId}/members`)
    .get();

  const tokens: string[] = [];

  // Get device tokens for each family member
  for (const memberDoc of membersSnapshot.docs) {
    const memberData = memberDoc.data() as any;
    const userId = memberData.userId;

    if (!userId) continue;

    // Skip the sender
    if (userId === senderId) continue;

    // Get all devices for this user
    const devicesSnapshot = await db
      .collection(`users/${userId}/devices`)
      .get();

    devicesSnapshot.docs.forEach(
      (deviceDoc: admin.firestore.QueryDocumentSnapshot) => {
        const deviceData = deviceDoc.data() as any;
        if (deviceData?.token) {
          tokens.push(deviceData.token);
        }
      },
    );
  }

  if (tokens.length === 0) {
    console.log("No tokens found to send SOS notification");
    return;
  }

  // Build notification payload
  const payload: admin.messaging.MulticastMessage = {
    notification: {
      title: "🚨 SOS Alert!",
      body: `${senderName || "Someone"} needs help immediately!`,
    },
    data: {
      type: "SOS",
      familyId: familyId,
      alertId: alertId,
    },
    android: {
      notification: {
        sound: "default",
        channelId: "default",
        priority: "high",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
    tokens: tokens,
  };

  // Send notification
  try {
    const response = await messaging.sendEachForMulticast(payload);
    console.log(`Successfully sent ${response.successCount} messages`);
    console.log(`Failed to send ${response.failureCount} messages`);

    // Log failures if any
    response.responses.forEach(
      (res: admin.messaging.SendResponse, index: number) => {
        if (res.error) {
          console.error(`Failed to send to token ${tokens[index]}:`, res.error);
        }
      },
    );
  } catch (error) {
    console.error("Error sending SOS notifications:", error);
  }
};

export const sendSOSCancelNotifications = async (
  familyId: string,
  senderId: string,
  senderName: string | undefined,
  alertId: string,
) => {
  // Get all family members
  const membersSnapshot = await db
    .collection(`families/${familyId}/members`)
    .get();

  const tokens: string[] = [];

  // Get device tokens for each family member
  for (const memberDoc of membersSnapshot.docs) {
    const memberData = memberDoc.data() as any;
    const userId = memberData.userId;

    if (!userId) continue;

    // Skip the sender
    if (userId === senderId) continue;

    // Get all devices for this user
    const devicesSnapshot = await db
      .collection(`users/${userId}/devices`)
      .get();

    devicesSnapshot.docs.forEach(
      (deviceDoc: admin.firestore.QueryDocumentSnapshot) => {
        const deviceData = deviceDoc.data() as any;
        if (deviceData?.token) {
          tokens.push(deviceData.token);
        }
      },
    );
  }

  if (tokens.length === 0) {
    console.log("No tokens found to send SOS cancel notification");
    return;
  }

  // Build notification payload
  const payload: admin.messaging.MulticastMessage = {
    notification: {
      title: "✅ SOS Cancelled",
      body: `${senderName || "Someone"} is safe now!`,
    },
    data: {
      type: "SOS_CANCEL",
      familyId: familyId,
      alertId: alertId,
    },
    android: {
      notification: {
        sound: "default",
        channelId: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
    tokens: tokens,
  };

  // Send notification
  try {
    const response = await messaging.sendEachForMulticast(payload);
    console.log(`Successfully sent ${response.successCount} messages`);
    console.log(`Failed to send ${response.failureCount} messages`);

    // Log failures if any
    response.responses.forEach(
      (res: admin.messaging.SendResponse, index: number) => {
        if (res.error) {
          console.error(`Failed to send to token ${tokens[index]}:`, res.error);
        }
      },
    );
  } catch (error) {
    console.error("Error sending SOS cancel notifications:", error);
  }
};
