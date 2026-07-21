import React, { useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { sendSOSAlert, callSOSPerson } from "@/services/sosService";
import { ThemedText } from "@/components";
import { useNotifications } from "@/notifications";

export const SOSButton: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { checkPermission, requestPermission, showSettingsAlert } =
    useNotifications();
  const [isPressed, setIsPressed] = useState(false);

  const handleSOSPress = async () => {
    if (!user?.familyId || !user?.uid) {
      Alert.alert("Error", "User not authenticated or family not set up");
      return;
    }

    // Check notification permissions first
    const hasPermission = await checkPermission();
    if (!hasPermission) {
      // Try to request again
      const granted = await requestPermission();
      if (!granted) {
        // If still denied, show settings alert
        showSettingsAlert();
        return;
      }
    }

    // Show confirmation dialog
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to send an emergency alert and call your SOS person?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS & Call",
          style: "destructive",
          onPress: async () => {
            setIsPressed(true);
            // First call the SOS person
            await callSOSPerson(user.familyId!);
            // Then send the alert to family members
            await sendSOSAlert(user.familyId!, user.uid, user.name);
            setIsPressed(false);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.error,
            shadowColor: theme.colors.error,
          },
        ]}
        onPress={handleSOSPress}
        disabled={isPressed}
      >
        <ThemedText
          variant="lg"
          weight="semiBold"
          style={{ color: theme.colors.textInverse }}
        >
          SOS
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
