import express from "express";
import { auth, db } from "../firebase";
import {
  sendSOSNotifications,
  sendSOSCancelNotifications,
} from "../services/notificationService";

const router = express.Router();

// Middleware to verify Firebase ID token
const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

// POST /api/sos
router.post("/sos", verifyToken, async (req, res) => {
  try {
    const { familyId, latitude, longitude, message } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Validate required fields
    if (!familyId) {
      return res
        .status(400)
        .json({ success: false, message: "familyId is required" });
    }

    // Get sender's name
    const userDoc = await db.collection("users").doc(userId).get();
    const senderName = userDoc.data()?.displayName || userDoc.data()?.name;

    // Get emergency contacts from firestore
    const contactsSnapshot = await db
      .collection("families")
      .doc(familyId)
      .collection("emergencyContacts")
      .get();

    const emergencyContacts = contactsSnapshot.docs.map((doc) => ({
      name: doc.data()?.name,
      phone: doc.data()?.phone,
      category: doc.data()?.category,
    }));

    // Create SOS alert document in firestore
    const sosAlertData = {
      familyId,
      senderId: userId,
      senderName,
      location: latitude && longitude ? { latitude, longitude } : undefined,
      message: message || "EMERGENCY! Please help immediately!",
      status: "ACTIVE",
      createdAt: new Date(),
      emergencyContacts,
    };

    const sosAlertRef = await db
      .collection("families")
      .doc(familyId)
      .collection("sosAlerts")
      .add(sosAlertData);

    // Send notifications
    await sendSOSNotifications(familyId, userId, senderName, sosAlertRef.id);

    return res.status(200).json({
      success: true,
      data: { alertId: sosAlertRef.id },
      message: "SOS sent successfully",
    });
  } catch (error) {
    console.error("Error processing SOS:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// POST /api/device/register
router.post("/device/register", verifyToken, async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "token is required" });
    }

    // Store device token in Firestore
    const deviceData = {
      token,
      platform: platform || "unknown",
      createdAt: new Date(),
    };

    // Create a document with a unique ID (we can use the token as the ID)
    const deviceId = token.substring(0, 20); // Shorten token for document ID
    await db
      .collection("users")
      .doc(userId)
      .collection("devices")
      .doc(deviceId)
      .set(deviceData, { merge: true });

    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "Device registered successfully",
      });
  } catch (error) {
    console.error("Error registering device:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// POST /api/sos/cancel
router.post("/sos/cancel", verifyToken, async (req, res) => {
  try {
    const { familyId, alertId } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!familyId || !alertId) {
      return res
        .status(400)
        .json({ success: false, message: "familyId and alertId are required" });
    }

    // Get sender's name
    const userDoc = await db.collection("users").doc(userId).get();
    const senderName = userDoc.data()?.displayName || userDoc.data()?.name;

    // Update SOS alert status to RESOLVED
    await db
      .collection("families")
      .doc(familyId)
      .collection("sosAlerts")
      .doc(alertId)
      .update({
        status: "RESOLVED",
        resolvedAt: new Date(),
      });

    // Send cancel notifications
    await sendSOSCancelNotifications(familyId, userId, senderName, alertId);

    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "SOS canceled successfully",
      });
  } catch (error) {
    console.error("Error canceling SOS:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
