import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Megaphone,
  Plus,
  X,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react-native";
import firestore from "@react-native-firebase/firestore";

import { ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import { Announcement } from "../types/familyTypes";
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
} from "../services/familyService";

import { createAnnouncementsStyles } from "./styles";

interface AnnouncementsProps {
  familyId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  familyId,
  currentUserId,
  isAdmin,
}) => {
  const { theme } = useTheme();
  const styles = createAnnouncementsStyles(theme);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high",
    expiresAt: null as Date | null,
  });

  useEffect(() => {
    loadAnnouncements();
  }, [familyId]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const announcementsData = await getAnnouncements(familyId);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = useCallback(() => {
    setFormData({
      title: "",
      message: "",
      priority: "medium",
      expiresAt: null,
    });
    setModalVisible(true);
  }, []);

  const handleDeleteAnnouncement = useCallback(
    async (announcement: Announcement) => {
      if (announcement.createdBy !== currentUserId && !isAdmin) {
        Alert.alert(
          "Permission Denied",
          "You can only delete your own announcements.",
        );
        return;
      }

      Alert.alert(
        "Delete Announcement",
        "Are you sure you want to delete this announcement?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAnnouncement(familyId, announcement.announcementId);
                await loadAnnouncements();
              } catch (error) {
                Alert.alert(
                  "Error",
                  error instanceof Error
                    ? error.message
                    : "Failed to delete announcement",
                );
              }
            },
          },
        ],
      );
    },
    [familyId, currentUserId, isAdmin],
  );

  const handleSaveAnnouncement = useCallback(async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      Alert.alert("Validation Error", "Please enter both title and message.");
      return;
    }

    try {
      await addAnnouncement(familyId, {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        createdBy: currentUserId,
        expiresAt: null, // TODO: Implement expiry date picker
      });
      setModalVisible(false);
      await loadAnnouncements();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to create announcement",
      );
    }
  }, [familyId, formData, currentUserId, loadAnnouncements]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityBadgeHigh;
      case "medium":
        return styles.priorityBadgeMedium;
      case "low":
        return styles.priorityBadgeLow;
      default:
        return styles.priorityBadgeLow;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText variant="md" color="textSecondary">
          Loading announcements...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(isAdmin || true) && (
        <Pressable style={styles.addButton} onPress={handleAddAnnouncement}>
          <Plus size={20} color={theme.colors.primary} />
          <ThemedText variant="sm" weight="medium" color="primary">
            Create Announcement
          </ThemedText>
        </Pressable>
      )}

      {announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Megaphone size={48} color={theme.colors.textSecondary} />
          <ThemedText
            variant="md"
            color="textSecondary"
            style={styles.emptyText}
          >
            No announcements yet
          </ThemedText>
        </View>
      ) : (
        announcements.map((announcement) => (
          <View
            key={announcement.announcementId}
            style={[
              styles.announcementCard,
              getPriorityStyle(announcement.priority),
            ]}
          >
            <View style={styles.announcementHeader}>
              <ThemedText
                variant="md"
                weight="semiBold"
                style={styles.announcementTitle}
              >
                {announcement.title}
              </ThemedText>
              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.priorityBadge,
                    getPriorityBadgeStyle(announcement.priority),
                  ]}
                >
                  <ThemedText
                    variant="xs"
                    weight="medium"
                    style={{
                      color: getPriorityColor(announcement.priority, theme),
                    }}
                  >
                    {announcement.priority.toUpperCase()}
                  </ThemedText>
                </View>
                {(announcement.createdBy === currentUserId || isAdmin) && (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAnnouncement(announcement)}
                  >
                    <Trash2 size={16} color={theme.colors.error} />
                  </Pressable>
                )}
              </View>
            </View>
            <ThemedText variant="sm" style={styles.announcementMessage}>
              {announcement.message}
            </ThemedText>
            <View style={styles.announcementMeta}>
              <Clock size={12} color={theme.colors.textSecondary} />
              <ThemedText variant="xs" color="textSecondary">
                {formatDate(announcement.createdAt)}
              </ThemedText>
              {announcement.expiresAt && (
                <>
                  <AlertCircle size={12} color={theme.colors.warning} />
                  <ThemedText
                    variant="xs"
                    style={{ color: theme.colors.warning }}
                  >
                    Expires: {formatDate(announcement.expiresAt)}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
        ))
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText variant="md" weight="semiBold">
                Create Announcement
              </ThemedText>
              <Pressable onPress={handleCloseModal}>
                <X size={20} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Title
                </ThemedText>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData({ ...formData, title: text })
                  }
                  style={styles.textInput}
                  placeholder="Announcement title"
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Message
                </ThemedText>
                <TextInput
                  value={formData.message}
                  onChangeText={(text) =>
                    setFormData({ ...formData, message: text })
                  }
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Announcement message"
                  multiline
                  numberOfLines={4}
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Priority
                </ThemedText>
                <View style={styles.priorityOptions}>
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <Pressable
                      key={priority}
                      style={[
                        styles.priorityOption,
                        formData.priority === priority &&
                          styles.priorityOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, priority })}
                    >
                      <ThemedText
                        variant="sm"
                        weight="medium"
                        color={
                          formData.priority === priority
                            ? "primary"
                            : "textSecondary"
                        }
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>
            <Pressable
              style={styles.saveButton}
              onPress={handleSaveAnnouncement}
            >
              <ThemedText
                variant="md"
                weight="medium"
                style={{ color: theme.colors.textInverse }}
              >
                Publish
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper functions
const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getPriorityColor = (priority: string, theme: any) => {
  switch (priority) {
    case "high":
      return theme.colors.error;
    case "medium":
      return theme.colors.warning;
    case "low":
      return theme.colors.success;
    default:
      return theme.colors.textSecondary;
  }
};
