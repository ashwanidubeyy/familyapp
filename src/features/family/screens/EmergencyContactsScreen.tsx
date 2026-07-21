import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert, Linking } from "react-native";
import {
  Plus,
  AlertTriangle,
  Phone,
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
import { ThemedSwitch } from "@/components/ui/ThemedSwitch";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { createFamilyMainStyles } from "./styles";
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

interface EmergencyContactFormData {
  name: string;
  phone: string;
  category: EmergencyContactCategory;
  address: string;
  notes: string;
  isSOSPerson: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const initialFormData: EmergencyContactFormData = {
  name: "",
  phone: "",
  category: "Doctor",
  address: "",
  notes: "",
  isSOSPerson: false,
  createdAt: null,
  updatedAt: null,
};

const categories: EmergencyContactCategory[] = [
  "Doctor",
  "Police",
  "Fire",
  "Ambulance",
  "Electrician",
  "Plumber",
  "Gas Agency",
  "Society Office",
  "Hospital",
];

export const EmergencyContactsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null,
  );
  const [formData, setFormData] =
    useState<EmergencyContactFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId) return;
    try {
      const data = await getEmergencyContacts(user.familyId);
      setContacts(data);
    } catch (err) {
      console.error("Failed to load emergency contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddContact = () => {
    setEditingContact(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      category: contact.category,
      address: contact.address,
      notes: contact.notes,
      isSOSPerson: contact.isSOSPerson ?? false,
    });
    setModalVisible(true);
  };

  const handleDeleteContact = (contact: EmergencyContact) => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.familyId) return;
            try {
              await deleteEmergencyContact(user.familyId, contact.contactId);
              await loadData();
            } catch (err) {
              console.error("Failed to delete contact:", err);
              Alert.alert("Error", "Failed to delete contact");
            }
          },
        },
      ],
    );
  };

  const handleCallContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert("Error", "Please fill in name and phone number");
      return;
    }

    if (!user?.familyId) return;

    try {
      if (editingContact) {
        await updateEmergencyContact(
          user.familyId,
          editingContact.contactId,
          formData,
        );
      } else {
        await addEmergencyContact(user.familyId, formData);
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save contact:", err);
      Alert.alert("Error", "Failed to save contact");
    }
  };

  const renderContactCard = (contact: EmergencyContact) => (
    <Pressable key={contact.contactId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.emergencyIcon,
            { backgroundColor: `${theme.colors.error}15` },
          ]}
        >
          <AlertTriangle size={20} color={theme.colors.error} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          {contact.name}
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
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {contact.phone}
        </ThemedText>
      </View>
      <Pressable
        onPress={() => handleCallContact(contact.phone)}
        style={styles.emergencyCallButton}
      >
        <Phone size={16} color={theme.colors.textInverse} />
      </Pressable>
      <Pressable onPress={() => handleEditContact(contact)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeleteContact(contact)}>
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
              Emergency Contacts
            </ThemedText>
            <Pressable onPress={handleAddContact}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : contacts.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No emergency contacts yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add important contacts for safety
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {contacts.map(renderContactCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingContact ? "Edit Contact" : "Add Emergency Contact"}
        onSubmit={handleSubmit}
      >
        <ThemedTextInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Contact name"
        />
        <ThemedTextInput
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <View style={{ gap: 8 }}>
          <ThemedText variant="sm" weight="medium">
            Category
          </ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor:
                    formData.category === cat
                      ? theme.colors.primary
                      : theme.colors.border,
                  backgroundColor:
                    formData.category === cat
                      ? `${theme.colors.primary}15`
                      : theme.colors.card,
                }}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <ThemedText
                  variant="xs"
                  weight="medium"
                  color={formData.category === cat ? "primary" : "text"}
                >
                  {cat}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
        <ThemedSwitch
          label="Set as SOS Person"
          value={formData.isSOSPerson}
          onValueChange={(value) =>
            setFormData({ ...formData, isSOSPerson: value })
          }
        />
        <ThemedTextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Address"
        />
        <ThemedTextInput
          label="Notes"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Additional notes"
          multiline
          numberOfLines={3}
        />
      </FormModal>
    </>
  );
};
