import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert } from "react-native";
import {
  Plus,
  FileText,
  Edit2,
  Trash2,
  ChevronRight,
  Upload,
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
import { Prescription } from "../types/familyTypes";
import {
  getPrescriptions,
  addPrescription,
  updatePrescription,
  deletePrescription,
} from "../services/familyService";

interface PrescriptionFormData {
  doctor: string;
  hospital: string;
  documentId: string;
  notes: string;
}

const initialFormData: PrescriptionFormData = {
  doctor: "",
  hospital: "",
  documentId: "",
  notes: "",
};

export const PrescriptionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [formData, setFormData] =
    useState<PrescriptionFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId || !user?.uid) return;
    try {
      const data = await getPrescriptions(user.familyId, user.uid);
      setPrescriptions(data);
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId, user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddPrescription = () => {
    setEditingPrescription(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      doctor: prescription.doctor,
      hospital: prescription.hospital,
      documentId: prescription.documentId,
      notes: prescription.notes,
    });
    setModalVisible(true);
  };

  const handleDeletePrescription = (prescription: Prescription) => {
    Alert.alert(
      "Delete Prescription",
      `Are you sure you want to delete this prescription?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.familyId || !user?.uid) return;
            try {
              await deletePrescription(
                user.familyId,
                user.uid,
                prescription.prescriptionId,
              );
              await loadData();
            } catch (err) {
              console.error("Failed to delete prescription:", err);
              Alert.alert("Error", "Failed to delete prescription");
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (!formData.doctor.trim() || !formData.hospital.trim()) {
      Alert.alert("Error", "Please fill in doctor and hospital");
      return;
    }

    if (!user?.familyId || !user?.uid) return;

    try {
      if (editingPrescription) {
        await updatePrescription(
          user.familyId,
          user.uid,
          editingPrescription.prescriptionId,
          formData,
        );
      } else {
        await addPrescription(user.familyId, user.uid, formData);
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save prescription:", err);
      Alert.alert("Error", "Failed to save prescription");
    }
  };

  const renderPrescriptionCard = (prescription: Prescription) => (
    <Pressable key={prescription.prescriptionId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.medicineIcon,
            { backgroundColor: `${theme.colors.secondary}15` },
          ]}
        >
          <FileText size={20} color={theme.colors.secondary} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          {prescription.doctor}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {prescription.hospital}
        </ThemedText>
      </View>
      <Pressable onPress={() => handleEditPrescription(prescription)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeletePrescription(prescription)}>
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
              Prescriptions
            </ThemedText>
            <Pressable onPress={handleAddPrescription}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : prescriptions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No prescriptions yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add prescriptions to track your health
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {prescriptions.map(renderPrescriptionCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingPrescription ? "Edit Prescription" : "Add Prescription"}
        onSubmit={handleSubmit}
      >
        <ThemedTextInput
          label="Doctor"
          value={formData.doctor}
          onChangeText={(text) => setFormData({ ...formData, doctor: text })}
          placeholder="Doctor's name"
        />
        <ThemedTextInput
          label="Hospital"
          value={formData.hospital}
          onChangeText={(text) => setFormData({ ...formData, hospital: text })}
          placeholder="Hospital name"
        />
        {/* TODO: Add Vault integration for document upload */}
        <View style={{ gap: 8 }}>
          <ThemedText variant="sm" weight="medium">
            Prescription Document
          </ThemedText>
          <Button
            title="Upload Document"
            variant="outline"
            icon={<Upload size={16} color={theme.colors.primary} />}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Document upload will be linked to Vault module",
              )
            }
          />
          {formData.documentId ? (
            <ThemedText variant="xs" color="textSecondary">
              Document ID: {formData.documentId}
            </ThemedText>
          ) : null}
        </View>
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
