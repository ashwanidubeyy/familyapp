import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "@/features/auth";
import {
  requestNotificationPermission,
  checkNotificationPermission,
  showPermissionSettingsAlert,
  getDeviceToken,
  saveDeviceToken,
  listenForTokenRefresh,
  listenForForegroundMessages,
  getInitialNotification,
  listenForNotificationOpenedApp,
  createNotificationChannel,
  displaySOSNotification,
} from "./";
import firestore from "@react-native-firebase/firestore";
import notifee, { EventType } from "@notifee/react-native";
import { SOSAlert } from "@/services/sosService";
import { navigateToSOSAlert } from "@/navigation";

interface NotificationContextType {
  checkPermission: () => Promise<boolean>;
  requestPermission: () => Promise<boolean>;
  showSettingsAlert: () => void;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const processedAlertIds = useRef<Set<string>>(new Set());

  const checkPermission = useCallback(async () => {
    return await checkNotificationPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    return await requestNotificationPermission();
  }, []);

  const showSettingsAlert = useCallback(() => {
    showPermissionSettingsAlert();
  }, []);

  const getNotificationType = useCallback(
    (value: string | number | object | undefined): string | undefined =>
      typeof value === "string" ? value : undefined,
    [],
  );

  const handleNotificationNavigation = useCallback((type?: string) => {
    if (type === "SOS") {
      navigateToSOSAlert();
    }
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      // 1. Create Android notification channel
      await createNotificationChannel();

      // 2. Check and request notification permission at app startup
      const hasPermission = await checkNotificationPermission();
      if (!hasPermission) {
        await requestNotificationPermission();
      }

      // 3. Get and save device token if user is signed in
      if (user?.uid) {
        const token = await getDeviceToken();
        if (token) {
          await saveDeviceToken(token);
        }
      }
    };

    initializeNotifications();
  }, [user]);

  // Token refresh listener
  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | undefined;
    if (user?.uid) {
      unsubscribeTokenRefresh = listenForTokenRefresh();
    }

    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, [user?.uid]);

  // Listen for foreground messages
  useEffect(() => {
    const unsubscribe = listenForForegroundMessages();

    return () => unsubscribe();
  }, []);

  // Listen for initial notification
  useEffect(() => {
    getInitialNotification((data) => {
      handleNotificationNavigation(data.type);
    });
  }, [handleNotificationNavigation]);

  // Listen for notification opening from background
  useEffect(() => {
    const unsubscribe = listenForNotificationOpenedApp((data) => {
      handleNotificationNavigation(data.type);
    });

    return () => unsubscribe();
  }, [handleNotificationNavigation]);

  // Handle local Notifee notification taps while app is running
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationNavigation(
          getNotificationType(detail.notification?.data?.type),
        );
      }
    });

    return () => unsubscribe();
  }, [getNotificationType, handleNotificationNavigation]);

  // Handle local Notifee notification taps that launch the app
  useEffect(() => {
    const handleInitialLocalNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      handleNotificationNavigation(
        getNotificationType(initialNotification?.notification?.data?.type),
      );
    };
    handleInitialLocalNotification();
  }, [getNotificationType, handleNotificationNavigation]);

  // Listen for SOS alerts in Firestore
  useEffect(() => {
    if (!user?.familyId) {
      return;
    }

    const sosAlertsRef = firestore()
      .collection("families")
      .doc(user.familyId)
      .collection("sosAlerts")
      .where("status", "==", "ACTIVE");

    const unsubscribe = sosAlertsRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const alertData = change.doc.data() as Omit<SOSAlert, "id">;
            const alertId = change.doc.id;

            // Skip if this is the sender's own alert or already processed
            if (alertData.senderId === user.uid) {
              return;
            }
            if (processedAlertIds.current.has(alertId)) {
              return;
            }

            processedAlertIds.current.add(alertId);

            const sosAlert: SOSAlert = {
              ...alertData,
              id: alertId,
            };

            await displaySOSNotification(sosAlert);
          }
        });
      },
      (error) => {
        console.error("Error listening for SOS alerts:", error);
      },
    );

    return () => unsubscribe();
  }, [user?.familyId, user?.uid]);

  return (
    <NotificationContext.Provider
      value={{ checkPermission, requestPermission, showSettingsAlert }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};
