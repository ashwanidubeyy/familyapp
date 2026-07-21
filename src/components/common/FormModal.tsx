import React from "react";
import { Modal, View, ScrollView, Pressable, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/hooks";
import { ThemedText, Button } from "@/components/ui";

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
  submitTitle?: string;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  visible,
  onClose,
  title,
  onSubmit,
  submitDisabled = false,
  submitTitle = "Save",
  children,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      maxHeight: "80%",
      gap: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    scrollContainer: {
      flexGrow: 1,
    },
    formContent: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <ThemedText variant="lg" weight="bold">
                {title}
              </ThemedText>
              <Pressable onPress={onClose}>
                <X size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContent}>{children}</View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                variant="outline"
                style={{ flex: 1 }}
                onPress={onClose}
              />
              <Button
                title={submitTitle}
                style={{ flex: 1 }}
                onPress={onSubmit}
                disabled={submitDisabled}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
