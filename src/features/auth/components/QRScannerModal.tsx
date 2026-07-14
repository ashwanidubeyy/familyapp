import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";

import { Camera } from "react-native-camera-kit";

interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
}

export const QRScannerModal = ({ visible, onClose, onScanned }: Props) => {
  const scanned = useRef(false);

  useEffect(() => {
    scanned.current = false;
  }, [visible]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          scanBarcode
          onReadCode={(event: any) => {
            const raw =
              event.nativeEvent?.codeStringValue ??
              event?.codeStringValue ??
              "";

            console.log("RAW QR:", raw);

            try {
              const data = JSON.parse(raw);

              console.log("PARSED:", data);

              if (data.type === "familyInvite") {
                console.log("Invite Code:", data.inviteCode);

                onScanned(data.inviteCode);
              } else {
                console.log("Unexpected type:", data.type);
              }
            } catch (e) {
              console.log("JSON Parse Error:", e);
              Alert.alert("Invalid QR");
            }
          }}
        />

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "white",
    fontSize: 22,
  },
});
