import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert, ScrollView } from "react-native";
import { Plus, Pill, Edit2, Trash2, ChevronRight } from "lucide-react-native";

import {
  ThemedText,
  GradientPageView,
  FormModal,
  ThemedTextInput,
  ThemedSwitch,
  Button,
} from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { createFamilyMainStyles } from "./styles";
import { Medicine } from "../types/familyTypes";
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../services/familyService";

interface MedicineFormData {
  medicineName: string;
  dosage: string;
  frequency: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  notes: string;
}

const initialFormData: MedicineFormData = {
  medicineName: "",
  dosage: "",
  frequency: "",
  morning: false,
  afternoon: false,
  night: false,
  notes: "",
};

export const MedicinesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState<MedicineFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId || !user?.uid) return;
    try {
      const data = await getMedicines(user.familyId, user.uid);
      setMedicines(data);
    } catch (err) {
      console.error("Failed to load medicines:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId, user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      medicineName: medicine.medicineName,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      morning: medicine.morning,
      afternoon: medicine.afternoon,
      night: medicine.night,
      notes: medicine.notes,
    });
    setModalVisible(true);
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    Alert.alert(
      "Delete Medicine",
      `Are you sure you want to delete ${medicine.medicineName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.familyId || !user?.uid) return;
            try {
              await deleteMedicine(
                user.familyId,
                user.uid,
                medicine.medicineId,
              );
              await loadData();
            } catch (err) {
              console.error("Failed to delete medicine:", err);
              Alert.alert("Error", "Failed to delete medicine");
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (
      !formData.medicineName.trim() ||
      !formData.dosage.trim() ||
      !formData.frequency.trim()
    ) {
      Alert.alert(
        "Error",
        "Please fill in medicine name, dosage, and frequency",
      );
      return;
    }

    if (!user?.familyId || !user?.uid) return;

    try {
      if (editingMedicine) {
        await updateMedicine(
          user.familyId,
          user.uid,
          editingMedicine.medicineId,
          formData,
        );
      } else {
        await addMedicine(user.familyId, user.uid, formData);
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save medicine:", err);
      Alert.alert("Error", "Failed to save medicine");
    }
  };

  const renderMedicineCard = (medicine: Medicine) => (
    <Pressable key={medicine.medicineId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.medicineIcon,
            { backgroundColor: `${theme.colors.primary}15` },
          ]}
        >
          <Pill size={20} color={theme.colors.primary} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          {medicine.medicineName}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {medicine.dosage} • {medicine.frequency}
        </ThemedText>
      </View>
      <Pressable onPress={() => handleEditMedicine(medicine)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeleteMedicine(medicine)}>
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
              Medicines
            </ThemedText>
            <Pressable onPress={handleAddMedicine}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : medicines.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No medicines yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add medications to track your health
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {medicines.map(renderMedicineCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingMedicine ? "Edit Medicine" : "Add Medicine"}
        onSubmit={handleSubmit}
      >
        <ThemedTextInput
          label="Medicine Name"
          value={formData.medicineName}
          onChangeText={(text) =>
            setFormData({ ...formData, medicineName: text })
          }
          placeholder="Enter medicine name"
        />
        <ThemedTextInput
          label="Dosage"
          value={formData.dosage}
          onChangeText={(text) => setFormData({ ...formData, dosage: text })}
          placeholder="e.g., 1 tablet"
        />
        <ThemedTextInput
          label="Frequency"
          value={formData.frequency}
          onChangeText={(text) => setFormData({ ...formData, frequency: text })}
          placeholder="e.g., Once daily"
        />
        <ThemedSwitch
          label="Morning"
          value={formData.morning}
          onValueChange={(value) =>
            setFormData({ ...formData, morning: value })
          }
        />
        <ThemedSwitch
          label="Afternoon"
          value={formData.afternoon}
          onValueChange={(value) =>
            setFormData({ ...formData, afternoon: value })
          }
        />
        <ThemedSwitch
          label="Night"
          value={formData.night}
          onValueChange={(value) => setFormData({ ...formData, night: value })}
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
