import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Linking,
  Switch,
} from "react-native";
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  X,
  AlertTriangle,
  Shield,
  User,
  Stethoscope,
} from "lucide-react-native";

import { ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import {
  EmergencyContact,
  EmergencyContactCategory,
} from "../types/familyTypes";
import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../services/familyService";

import { createEmergencyStyles } from "./styles";

interface EmergencyContactsProps {
  familyId: string;
  isAdmin: boolean;
}

const CATEGORY_ICONS: Record<EmergencyContactCategory, any> = {
  Doctor: Stethoscope,
  Police: Shield,
  Fire: AlertTriangle,
  Ambulance: AlertTriangle,
  Electrician: User,
  Plumber: User,
  "Gas Agency": User,
  "Society Office": User,
  Hospital: Stethoscope,
};

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  familyId,
  isAdmin,
}) => {
  const { theme } = useTheme();
  const styles = createEmergencyStyles(theme);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    category: "Doctor" as EmergencyContactCategory,
    phone: "",
    address: "",
    notes: "",
    isSOSPerson: false,
  });

  useEffect(() => {
    loadContacts();
  }, [familyId]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contactsData = await getEmergencyContacts(familyId);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error loading emergency contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = useCallback(() => {
    setEditingContact(null);
    setFormData({
      name: "",
      category: "Doctor",
      phone: "",
      address: "",
      notes: "",
      isSOSPerson: false,
    });
    setModalVisible(true);
  }, []);

  const handleEditContact = useCallback((contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      category: contact.category,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes,
      isSOSPerson: contact.isSOSPerson ?? false,
    });
    setModalVisible(true);
  }, []);

  const handleDeleteContact = useCallback(
    async (contact: EmergencyContact) => {
      if (!isAdmin) {
        Alert.alert(
          "Permission Denied",
          "Only admins can delete emergency contacts.",
        );
        return;
      }

      Alert.alert(
        "Delete Contact",
        `Are you sure you want to delete ${contact.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteEmergencyContact(familyId, contact.contactId);
                await loadContacts();
              } catch (error) {
                Alert.alert(
                  "Error",
                  error instanceof Error
                    ? error.message
                    : "Failed to delete contact",
                );
              }
            },
          },
        ],
      );
    },
    [familyId, isAdmin],
  );

  const handleSaveContact = useCallback(async () => {
    try {
      if (editingContact) {
        await updateEmergencyContact(
          familyId,
          editingContact.contactId,
          formData,
        );
      } else {
        await addEmergencyContact(familyId, formData);
      }
      setModalVisible(false);
      await loadContacts();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save contact",
      );
    }
  }, [familyId, editingContact, formData, loadContacts]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setEditingContact(null);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText variant="md" color="textSecondary">
          Loading emergency contacts...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAdmin && (
        <Pressable style={styles.addButton} onPress={handleAddContact}>
          <Plus size={20} color={theme.colors.primary} />
          <ThemedText variant="sm" weight="medium" color="primary">
            Add Emergency Contact
          </ThemedText>
        </Pressable>
      )}

      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AlertTriangle size={48} color={theme.colors.textSecondary} />
          <ThemedText
            variant="md"
            color="textSecondary"
            style={styles.emptyText}
          >
            No emergency contacts added
          </ThemedText>
        </View>
      ) : (
        contacts.map((contact) => {
          const Icon = CATEGORY_ICONS[contact.category] || User;
          return (
            <View key={contact.contactId} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactIcon}>
                  <Icon size={20} color={theme.colors.error} />
                </View>
                <View style={styles.contactInfo}>
                  <View style={styles.contactName}>
                    <ThemedText variant="md" weight="semiBold">
                      {contact.name}
                    </ThemedText>
                    {contact.isSOSPerson && (
                      <ThemedText
                        variant="xs"
                        weight="bold"
                        color="primary"
                        style={{ marginLeft: 8 }}
                      >
                        (SOS Person)
                      </ThemedText>
                    )}
                    <View style={styles.categoryBadge}>
                      <ThemedText
                        variant="xs"
                        weight="medium"
                        style={{ color: theme.colors.error }}
                      >
                        {contact.category}
                      </ThemedText>
                    </View>
                  </View>
                  {contact.address && (
                    <View style={styles.detailRow}>
                      <MapPin size={14} color={theme.colors.textSecondary} />
                      <ThemedText
                        variant="sm"
                        color="textSecondary"
                        numberOfLines={1}
                      >
                        {contact.address}
                      </ThemedText>
                    </View>
                  )}
                  {contact.notes && (
                    <ThemedText variant="xs" color="textSecondary">
                      {contact.notes}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.contactActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleCall(contact.phone)}
                  >
                    <Phone size={18} color={theme.colors.primary} />
                  </Pressable>
                  {isAdmin && (
                    <>
                      <Pressable
                        style={styles.actionButton}
                        onPress={() => handleEditContact(contact)}
                      >
                        <Mail size={18} color={theme.colors.textSecondary} />
                      </Pressable>
                      <Pressable
                        style={styles.actionButton}
                        onPress={() => handleDeleteContact(contact)}
                      >
                        <X size={18} color={theme.colors.error} />
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
              <Pressable
                style={styles.phoneButton}
                onPress={() => handleCall(contact.phone)}
              >
                <Phone size={16} color={theme.colors.primary} />
                <ThemedText variant="md" weight="medium" color="primary">
                  {contact.phone}
                </ThemedText>
              </Pressable>
            </View>
          );
        })
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
                {editingContact ? "Edit" : "Add"} Emergency Contact
              </ThemedText>
              <Pressable onPress={handleCloseModal}>
                <X size={20} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Name
                </ThemedText>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  style={styles.textInput}
                  placeholder="Contact name"
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Category
                </ThemedText>
                <TextInput
                  value={formData.category}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      category: text as EmergencyContactCategory,
                    })
                  }
                  style={styles.textInput}
                  placeholder="Doctor, Police, Fire, etc."
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Phone
                </ThemedText>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  style={styles.textInput}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>
              <View
                style={[
                  styles.formGroup,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Set as SOS Person
                </ThemedText>
                <Switch
                  value={formData.isSOSPerson}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isSOSPerson: value })
                  }
                  trackColor={{
                    false: theme.colors.border,
                    true: `${theme.colors.primary}80`,
                  }}
                  thumbColor={
                    formData.isSOSPerson
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Address
                </ThemedText>
                <TextInput
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                  style={styles.textInput}
                  placeholder="Address (optional)"
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText variant="sm" weight="medium" style={styles.label}>
                  Notes
                </ThemedText>
                <TextInput
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData({ ...formData, notes: text })
                  }
                  style={styles.textInput}
                  placeholder="Additional notes (optional)"
                  multiline
                />
              </View>
            </ScrollView>
            <Pressable style={styles.saveButton} onPress={handleSaveContact}>
              <ThemedText
                variant="md"
                weight="medium"
                style={{ color: theme.colors.textInverse }}
              >
                Save
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
