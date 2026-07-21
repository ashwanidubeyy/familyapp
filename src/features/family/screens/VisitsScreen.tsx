import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert } from "react-native";
import {
  Plus,
  Calendar,
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
import { DoctorVisit } from "../types/familyTypes";
import {
  getDoctorVisits,
  addDoctorVisit,
  updateDoctorVisit,
  deleteDoctorVisit,
} from "../services/familyService";

interface DoctorVisitFormData {
  doctor: string;
  hospital: string;
  diagnosis: string;
  notes: string;
}

const initialFormData: DoctorVisitFormData = {
  doctor: "",
  hospital: "",
  diagnosis: "",
  notes: "",
};

export const VisitsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVisit, setEditingVisit] = useState<DoctorVisit | null>(null);
  const [formData, setFormData] =
    useState<DoctorVisitFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId || !user?.uid) return;
    try {
      const data = await getDoctorVisits(user.familyId, user.uid);
      setVisits(data);
    } catch (err) {
      console.error("Failed to load doctor visits:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId, user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddVisit = () => {
    setEditingVisit(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditVisit = (visit: DoctorVisit) => {
    setEditingVisit(visit);
    setFormData({
      doctor: visit.doctor,
      hospital: visit.hospital,
      diagnosis: visit.diagnosis,
      notes: visit.notes,
    });
    setModalVisible(true);
  };

  const handleDeleteVisit = (visit: DoctorVisit) => {
    Alert.alert("Delete Visit", `Are you sure you want to delete this visit?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user?.familyId || !user?.uid) return;
          try {
            await deleteDoctorVisit(user.familyId, user.uid, visit.visitId);
            await loadData();
          } catch (err) {
            console.error("Failed to delete visit:", err);
            Alert.alert("Error", "Failed to delete visit");
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!formData.doctor.trim() || !formData.hospital.trim()) {
      Alert.alert("Error", "Please fill in doctor and hospital");
      return;
    }

    if (!user?.familyId || !user?.uid) return;

    try {
      if (editingVisit) {
        await updateDoctorVisit(
          user.familyId,
          user.uid,
          editingVisit.visitId,
          formData,
        );
      } else {
        await addDoctorVisit(user.familyId, user.uid, formData);
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save visit:", err);
      Alert.alert("Error", "Failed to save visit");
    }
  };

  const renderVisitCard = (visit: DoctorVisit) => (
    <Pressable key={visit.visitId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.medicineIcon,
            { backgroundColor: `${theme.colors.warning}15` },
          ]}
        >
          <Calendar size={20} color={theme.colors.warning} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          {visit.doctor}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {visit.hospital}
        </ThemedText>
      </View>
      <Pressable onPress={() => handleEditVisit(visit)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeleteVisit(visit)}>
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
              Doctor Visits
            </ThemedText>
            <Pressable onPress={handleAddVisit}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : visits.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No doctor visits yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add visits to track your health
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {visits.map(renderVisitCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingVisit ? "Edit Visit" : "Add Doctor Visit"}
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
        <ThemedTextInput
          label="Diagnosis"
          value={formData.diagnosis}
          onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
          placeholder="Diagnosis"
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
