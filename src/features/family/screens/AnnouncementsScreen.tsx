import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert } from "react-native";
import {
  Plus,
  Megaphone,
  Edit2,
  Trash2,
  ChevronRight,
} from "lucide-react-native";

import {
  ThemedText,
  GradientPageView,
  FormModal,
  ThemedTextInput,
  Button,
} from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { createFamilyMainStyles } from "./styles";
import { Announcement } from "../types/familyTypes";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/familyService";

interface AnnouncementFormData {
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
}

const initialFormData: AnnouncementFormData = {
  title: "",
  message: "",
  priority: "low",
};

export const AnnouncementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] =
    useState<AnnouncementFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId) return;
    try {
      const data = await getAnnouncements(user.familyId);
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority,
    });
    setModalVisible(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    Alert.alert(
      "Delete Announcement",
      `Are you sure you want to delete this announcement?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.familyId) return;
            try {
              await deleteAnnouncement(
                user.familyId,
                announcement.announcementId,
              );
              await loadData();
            } catch (err) {
              console.error("Failed to delete announcement:", err);
              Alert.alert("Error", "Failed to delete announcement");
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      Alert.alert("Error", "Please fill in title and message");
      return;
    }

    if (!user?.familyId || !user?.uid) return;

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(
          user.familyId,
          editingAnnouncement.announcementId,
          formData,
        );
      } else {
        await addAnnouncement(user.familyId, user.uid, formData);
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save announcement:", err);
      Alert.alert("Error", "Failed to save announcement");
    }
  };

  const renderAnnouncementCard = (announcement: Announcement) => (
    <Pressable
      key={announcement.announcementId}
      style={[
        styles.infoCard,
        announcement.priority === "high" && styles.announcementHighPriority,
      ]}
    >
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.medicineIcon,
            { backgroundColor: `${theme.colors.primary}15` },
          ]}
        >
          <Megaphone size={20} color={theme.colors.primary} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          {announcement.title}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {announcement.message}
        </ThemedText>
      </View>
      <Pressable onPress={() => handleEditAnnouncement(announcement)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeleteAnnouncement(announcement)}>
        <Trash2 size={16} color={theme.colors.error} />
      </Pressable>
      <ChevronRight size={16} color={theme.colors.textSecondary} />
    </Pressable>
  );

  return (
    <>
      <GradientPageView scroll showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingTop: 20 }]}>
          <View style={styles.sectionHeader}>
            <ThemedText
              variant="lg"
              weight="semiBold"
              style={styles.sectionTitle}
            >
              Announcements
            </ThemedText>
            <Pressable onPress={handleAddAnnouncement}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : announcements.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No announcements yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add announcements to share with your family
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {announcements.map(renderAnnouncementCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingAnnouncement ? "Edit Announcement" : "Add Announcement"}
        onSubmit={handleSubmit}
      >
        <ThemedTextInput
          label="Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Announcement title"
        />
        <ThemedTextInput
          label="Message"
          value={formData.message}
          onChangeText={(text) => setFormData({ ...formData, message: text })}
          placeholder="Announcement message"
          multiline
          numberOfLines={4}
        />
        <View style={{ gap: 8 }}>
          <ThemedText variant="sm" weight="medium">
            Priority
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["low", "medium", "high"] as const).map((p) => (
              <Pressable
                key={p}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    formData.priority === p
                      ? theme.colors.primary
                      : theme.colors.border,
                  backgroundColor:
                    formData.priority === p
                      ? `${theme.colors.primary}15`
                      : theme.colors.card,
                  alignItems: "center",
                }}
                onPress={() => setFormData({ ...formData, priority: p })}
              >
                <ThemedText
                  variant="sm"
                  weight="medium"
                  color={formData.priority === p ? "primary" : "text"}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </FormModal>
    </>
  );
};
