import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import {
  Pill,
  Calendar,
  FileText,
  DollarSign,
  Plus,
  X,
  Clock,
} from "lucide-react-native";

import { ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import {
  FamilyMember,
  Medicine,
  Prescription,
  DoctorVisit,
  MedicalExpense,
  HealthInfo,
} from "../types/familyTypes";
import {
  getHealthInfo,
  getMedicines,
  getPrescriptions,
  getDoctorVisits,
  getMedicalExpenses,
  addMedicine,
  addPrescription,
  addDoctorVisit,
  addMedicalExpense,
  updateHealthInfo,
} from "../services/familyService";

import { createHealthRecordsStyles } from "./styles";

interface HealthRecordsProps {
  familyId: string;
  member: FamilyMember;
}

type HealthSection =
  | "info"
  | "medicines"
  | "prescriptions"
  | "visits"
  | "expenses";

export const HealthRecords: React.FC<HealthRecordsProps> = ({
  familyId,
  member,
}) => {
  const { theme } = useTheme();
  const styles = createHealthRecordsStyles(theme);
  const [activeSection, setActiveSection] = useState<HealthSection>("info");
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [expenses, setExpenses] = useState<MedicalExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<HealthSection>("medicines");

  // Form States
  const [formData, setFormData] = useState<any>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        infoData,
        medicinesData,
        prescriptionsData,
        visitsData,
        expensesData,
      ] = await Promise.all([
        getHealthInfo(familyId, member.userId),
        getMedicines(familyId, member.userId),
        getPrescriptions(familyId, member.userId),
        getDoctorVisits(familyId, member.userId),
        getMedicalExpenses(familyId, member.userId),
      ]);
      setHealthInfo(infoData);
      setMedicines(medicinesData);
      setPrescriptions(prescriptionsData);
      setVisits(visitsData);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error loading health data:", error);
    } finally {
      setLoading(false);
    }
  }, [familyId, member.userId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddItem = useCallback((section: HealthSection) => {
    setModalType(section);
    // Reset form data based on section
    switch (section) {
      case "info":
        setFormData({
          bloodGroup: healthInfo?.bloodGroup || "",
          allergies: healthInfo?.allergies?.join(", ") || "",
          medicalConditions: healthInfo?.medicalConditions?.join(", ") || "",
          insuranceProvider: healthInfo?.insuranceProvider || "",
          insuranceNumber: healthInfo?.insuranceNumber || "",
          notes: healthInfo?.notes || "",
        });
        break;
      case "medicines":
        setFormData({
          medicineName: "",
          dosage: "",
          frequency: "",
          morning: false,
          afternoon: false,
          night: false,
          instructions: "",
        });
        break;
      case "prescriptions":
        setFormData({
          title: "",
          doctor: "",
          hospital: "",
          documentId: "",
          prescriptionDate: "",
          notes: "",
        });
        break;
      case "visits":
        setFormData({
          doctor: "",
          hospital: "",
          diagnosis: "",
          nextVisit: "",
          visitDate: "",
          notes: "",
        });
        break;
      case "expenses":
        setFormData({
          amount: "",
          billDocumentId: "",
          paidBy: "",
          expenseDate: "",
          notes: "",
        });
        break;
    }
    setModalVisible(true);
  }, [healthInfo]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setFormData({});
  }, []);

  const handleSaveItem = useCallback(async () => {
    try {
      switch (modalType) {
        case "info":
          await updateHealthInfo(familyId, member.userId, {
            bloodGroup: formData.bloodGroup,
            allergies: formData.allergies ? formData.allergies.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) : [],
            medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) : [],
            insuranceProvider: formData.insuranceProvider,
            insuranceNumber: formData.insuranceNumber,
            notes: formData.notes,
          });
          break;
        case "medicines":
          await addMedicine(familyId, member.userId, {
            medicineName: formData.medicineName,
            dosage: formData.dosage,
            frequency: formData.frequency,
            morning: formData.morning,
            afternoon: formData.afternoon,
            night: formData.night,
            instructions: formData.instructions,
            isActive: true,
          });
          break;
        case "prescriptions":
          await addPrescription(familyId, member.userId, {
            title: formData.title,
            doctor: formData.doctor,
            hospital: formData.hospital,
            documentId: formData.documentId,
            notes: formData.notes,
          });
          break;
        case "visits":
          await addDoctorVisit(familyId, member.userId, {
            doctor: formData.doctor,
            hospital: formData.hospital,
            diagnosis: formData.diagnosis,
            visitDate: formData.visitDate,
            notes: formData.notes,
          });
          break;
        case "expenses":
          await addMedicalExpense(familyId, member.userId, {
            amount: parseFloat(formData.amount),
            billDocumentId: formData.billDocumentId,
            paidBy: formData.paidBy,
            notes: formData.notes,
          });
          break;
      }
      Alert.alert("Success", "Record saved successfully!");
      setModalVisible(false);
      await loadData();
    } catch (error) {
      console.error("Error saving record:", error);
      Alert.alert("Error", "Failed to save record. Please try again.");
    }
  }, [modalType, familyId, member.userId, formData, loadData]);

  const renderInfoForm = () => (
    <View style={styles.formGroup}>
      <ThemedText variant="sm" weight="medium" style={styles.label}>Blood Group</ThemedText>
      <TextInput
        placeholder="e.g., A+, O-"
        style={styles.textInput}
        value={formData.bloodGroup}
        onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
      />
    </View>
  );

  const renderMedicinesForm = () => (
    <>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Medicine Name*</ThemedText>
        <TextInput
          placeholder="e.g., Paracetamol"
          style={styles.textInput}
          value={formData.medicineName}
          onChangeText={(text) => setFormData({ ...formData, medicineName: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Dosage*</ThemedText>
        <TextInput
          placeholder="e.g., 500mg"
          style={styles.textInput}
          value={formData.dosage}
          onChangeText={(text) => setFormData({ ...formData, dosage: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Frequency*</ThemedText>
        <TextInput
          placeholder="e.g., Once daily"
          style={styles.textInput}
          value={formData.frequency}
          onChangeText={(text) => setFormData({ ...formData, frequency: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Take at:</ThemedText>
        <View style={{ flexDirection: "row", gap: theme.spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Switch
              value={formData.morning}
              onValueChange={(value) => setFormData({ ...formData, morning: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={formData.morning ? theme.colors.primary : theme.colors.textSecondary}
            />
            <ThemedText variant="sm">Morning</ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Switch
              value={formData.afternoon}
              onValueChange={(value) => setFormData({ ...formData, afternoon: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={formData.afternoon ? theme.colors.primary : theme.colors.textSecondary}
            />
            <ThemedText variant="sm">Afternoon</ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Switch
              value={formData.night}
              onValueChange={(value) => setFormData({ ...formData, night: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={formData.night ? theme.colors.primary : theme.colors.textSecondary}
            />
            <ThemedText variant="sm">Night</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Instructions</ThemedText>
        <TextInput
          placeholder="Additional instructions"
          style={[styles.textInput, styles.textArea]}
          value={formData.instructions}
          onChangeText={(text) => setFormData({ ...formData, instructions: text })}
          multiline
        />
      </View>
    </>
  );

  const renderPrescriptionsForm = () => (
    <>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Title*</ThemedText>
        <TextInput
          placeholder="e.g., Annual Checkup Prescription"
          style={styles.textInput}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Doctor</ThemedText>
        <TextInput
          placeholder="Doctor's name"
          style={styles.textInput}
          value={formData.doctor}
          onChangeText={(text) => setFormData({ ...formData, doctor: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Hospital</ThemedText>
        <TextInput
          placeholder="Hospital name"
          style={styles.textInput}
          value={formData.hospital}
          onChangeText={(text) => setFormData({ ...formData, hospital: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Notes</ThemedText>
        <TextInput
          placeholder="Additional notes"
          style={[styles.textInput, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
        />
      </View>
    </>
  );

  const renderVisitsForm = () => (
    <>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Doctor*</ThemedText>
        <TextInput
          placeholder="Doctor's name"
          style={styles.textInput}
          value={formData.doctor}
          onChangeText={(text) => setFormData({ ...formData, doctor: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Hospital*</ThemedText>
        <TextInput
          placeholder="Hospital name"
          style={styles.textInput}
          value={formData.hospital}
          onChangeText={(text) => setFormData({ ...formData, hospital: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Diagnosis</ThemedText>
        <TextInput
          placeholder="Diagnosis"
          style={styles.textInput}
          value={formData.diagnosis}
          onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Visit Date</ThemedText>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.textInput}
          value={formData.visitDate}
          onChangeText={(text) => setFormData({ ...formData, visitDate: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Notes</ThemedText>
        <TextInput
          placeholder="Additional notes"
          style={[styles.textInput, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
        />
      </View>
    </>
  );

  const renderExpensesForm = () => (
    <>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Amount*</ThemedText>
        <TextInput
          placeholder="e.g., 100.50"
          style={styles.textInput}
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Paid By</ThemedText>
        <TextInput
          placeholder="Who paid?"
          style={styles.textInput}
          value={formData.paidBy}
          onChangeText={(text) => setFormData({ ...formData, paidBy: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText variant="sm" weight="medium" style={styles.label}>Notes</ThemedText>
        <TextInput
          placeholder="Additional notes"
          style={[styles.textInput, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
        />
      </View>
    </>
  );

  const renderForm = () => {
    switch (modalType) {
      case "info":
        return (
          <>
            {renderInfoForm()}
            <View style={styles.formGroup}>
              <ThemedText variant="sm" weight="medium" style={styles.label}>Allergies (comma separated)</ThemedText>
              <TextInput
                placeholder="e.g., Peanuts, Dust"
                style={styles.textInput}
                value={formData.allergies}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText variant="sm" weight="medium" style={styles.label}>Medical Conditions (comma separated)</ThemedText>
              <TextInput
                placeholder="e.g., Diabetes, Hypertension"
                style={styles.textInput}
                value={formData.medicalConditions}
                onChangeText={(text) => setFormData({ ...formData, medicalConditions: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText variant="sm" weight="medium" style={styles.label}>Insurance Provider</ThemedText>
              <TextInput
                placeholder="Insurance company name"
                style={styles.textInput}
                value={formData.insuranceProvider}
                onChangeText={(text) => setFormData({ ...formData, insuranceProvider: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText variant="sm" weight="medium" style={styles.label}>Insurance Number</ThemedText>
              <TextInput
                placeholder="Insurance policy number"
                style={styles.textInput}
                value={formData.insuranceNumber}
                onChangeText={(text) => setFormData({ ...formData, insuranceNumber: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText variant="sm" weight="medium" style={styles.label}>Notes</ThemedText>
              <TextInput
                placeholder="Additional health notes"
                style={[styles.textInput, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
              />
            </View>
          </>
        );
      case "medicines":
        return renderMedicinesForm();
      case "prescriptions":
        return renderPrescriptionsForm();
      case "visits":
        return renderVisitsForm();
      case "expenses":
        return renderExpensesForm();
      default:
        return null;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "info":
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <FileText size={20} color={theme.colors.primary} />
                <ThemedText variant="md" weight="semiBold">
                  Health Information
                </ThemedText>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddItem("info")}
              >
                <Plus size={16} color={theme.colors.primary} />
              </Pressable>
            </View>
            {healthInfo && (healthInfo.bloodGroup || healthInfo.allergies?.length || healthInfo.medicalConditions?.length || healthInfo.insuranceProvider) ? (
              <View style={styles.itemCard}>
                {healthInfo.bloodGroup && (
                  <ThemedText variant="sm" color="textSecondary">
                    Blood Group: {healthInfo.bloodGroup}
                  </ThemedText>
                )}
                {healthInfo.allergies && healthInfo.allergies.length > 0 && (
                  <ThemedText variant="sm" color="textSecondary">
                    Allergies: {healthInfo.allergies.join(", ")}
                  </ThemedText>
                )}
                {healthInfo.medicalConditions &&
                  healthInfo.medicalConditions.length > 0 && (
                    <ThemedText variant="sm" color="textSecondary">
                      Conditions: {healthInfo.medicalConditions.join(", ")}
                    </ThemedText>
                  )}
                {healthInfo.insuranceProvider && (
                  <ThemedText variant="sm" color="textSecondary">
                    Insurance: {healthInfo.insuranceProvider} {healthInfo.insuranceNumber ? `(${healthInfo.insuranceNumber})` : ""}
                  </ThemedText>
                )}
                {healthInfo.notes && (
                  <ThemedText variant="sm" color="textSecondary">
                    Notes: {healthInfo.notes}
                  </ThemedText>
                )}
              </View>
            ) : (
              <ThemedText variant="sm" color="textSecondary">
                No health information recorded
              </ThemedText>
            )}
          </View>
        );

      case "medicines":
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <Pill size={20} color={theme.colors.primary} />
                <ThemedText variant="md" weight="semiBold">
                  Medicines
                </ThemedText>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddItem("medicines")}
              >
                <Plus size={16} color={theme.colors.primary} />
              </Pressable>
            </View>
            {medicines.length === 0 ? (
              <ThemedText variant="sm" color="textSecondary">
                No medicines recorded
              </ThemedText>
            ) : (
              medicines.map((medicine) => (
                <View key={medicine.medicineId} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <ThemedText
                      variant="sm"
                      weight="medium"
                      style={styles.itemName}
                    >
                      {medicine.medicineName}
                    </ThemedText>
                    <View style={styles.itemMeta}>
                      {medicine.morning && (
                        <Clock size={14} color={theme.colors.textSecondary} />
                      )}
                      {medicine.afternoon && (
                        <Clock size={14} color={theme.colors.textSecondary} />
                      )}
                      {medicine.night && (
                        <Clock size={14} color={theme.colors.textSecondary} />
                      )}
                    </View>
                  </View>
                  <ThemedText variant="xs" color="textSecondary">
                    {medicine.dosage} - {medicine.frequency}
                  </ThemedText>
                  {medicine.instructions && (
                    <ThemedText variant="xs" color="textSecondary">
                      {medicine.instructions}
                    </ThemedText>
                  )}
                </View>
              ))
            )}
          </View>
        );

      case "prescriptions":
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <FileText size={20} color={theme.colors.primary} />
                <ThemedText variant="md" weight="semiBold">
                  Prescriptions
                </ThemedText>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddItem("prescriptions")}
              >
                <Plus size={16} color={theme.colors.primary} />
              </Pressable>
            </View>
            {prescriptions.length === 0 ? (
              <ThemedText variant="sm" color="textSecondary">
                No prescriptions recorded
              </ThemedText>
            ) : (
              prescriptions.map((prescription) => (
                <View key={prescription.prescriptionId} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <ThemedText
                      variant="sm"
                      weight="medium"
                      style={styles.itemName}
                    >
                      {prescription.title || prescription.doctor || "Prescription"}
                    </ThemedText>
                  </View>
                  {prescription.doctor && (
                    <ThemedText variant="xs" color="textSecondary">
                      Doctor: {prescription.doctor}
                    </ThemedText>
                  )}
                  {prescription.hospital && (
                    <ThemedText variant="xs" color="textSecondary">
                      Hospital: {prescription.hospital}
                    </ThemedText>
                  )}
                  {prescription.notes && (
                    <ThemedText
                      variant="xs"
                      color="textSecondary"
                      style={styles.itemNotes}
                    >
                      {prescription.notes}
                    </ThemedText>
                  )}
                </View>
              ))
            )}
          </View>
        );

      case "visits":
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <Calendar size={20} color={theme.colors.primary} />
                <ThemedText variant="md" weight="semiBold">
                  Doctor Visits
                </ThemedText>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddItem("visits")}
              >
                <Plus size={16} color={theme.colors.primary} />
              </Pressable>
            </View>
            {visits.length === 0 ? (
              <ThemedText variant="sm" color="textSecondary">
                No doctor visits recorded
              </ThemedText>
            ) : (
              visits.map((visit) => (
                <View key={visit.visitId} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <ThemedText
                      variant="sm"
                      weight="medium"
                      style={styles.itemName}
                    >
                      {visit.doctor}
                    </ThemedText>
                    {visit.visitDate && (
                      <ThemedText variant="xs" color="textSecondary">
                        {visit.visitDate}
                      </ThemedText>
                    )}
                  </View>
                  {visit.hospital && (
                    <ThemedText variant="xs" color="textSecondary">
                      {visit.hospital}
                    </ThemedText>
                  )}
                  {visit.diagnosis && (
                    <ThemedText variant="xs" color="textSecondary">
                      Diagnosis: {visit.diagnosis}
                    </ThemedText>
                  )}
                  {visit.notes && (
                    <ThemedText
                      variant="xs"
                      color="textSecondary"
                      style={styles.itemNotes}
                    >
                      {visit.notes}
                    </ThemedText>
                  )}
                </View>
              ))
            )}
          </View>
        );

      case "expenses":
        return (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <DollarSign size={20} color={theme.colors.primary} />
                <ThemedText variant="md" weight="semiBold">
                  Medical Expenses
                </ThemedText>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddItem("expenses")}
              >
                <Plus size={16} color={theme.colors.primary} />
              </Pressable>
            </View>
            {expenses.length === 0 ? (
              <ThemedText variant="sm" color="textSecondary">
                No expenses recorded
              </ThemedText>
            ) : (
              expenses.map((expense) => (
                <View key={expense.expenseId} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <ThemedText
                      variant="sm"
                      weight="medium"
                      style={styles.itemName}
                    >
                      ${expense.amount.toFixed(2)}
                    </ThemedText>
                    {expense.paidBy && (
                      <ThemedText variant="xs" color="textSecondary">
                        Paid by {expense.paidBy}
                      </ThemedText>
                    )}
                  </View>
                  {expense.notes && (
                    <ThemedText
                      variant="xs"
                      color="textSecondary"
                      style={styles.itemNotes}
                    >
                      {expense.notes}
                    </ThemedText>
                  )}
                </View>
              ))
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(
          [
            "info",
            "medicines",
            "prescriptions",
            "visits",
            "expenses",
          ] as HealthSection[]
        ).map((section) => (
          <Pressable
            key={section}
            style={[
              styles.sectionCard,
              activeSection === section && styles.sectionCardActive,
            ]}
            onPress={() => setActiveSection(section)}
          >
            <ThemedText
              variant="sm"
              weight={activeSection === section ? "semiBold" : "medium"}
              color={activeSection === section ? "primary" : "textSecondary"}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {renderSection()}

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
                {modalType === "info" ? "Update" : "Add"} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </ThemedText>
              <Pressable onPress={handleCloseModal}>
                <X size={20} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              {renderForm()}
            </ScrollView>
            <Pressable style={styles.saveButton} onPress={handleSaveItem}>
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
