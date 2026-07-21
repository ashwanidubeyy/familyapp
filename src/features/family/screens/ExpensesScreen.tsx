import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert } from "react-native";
import {
  Plus,
  DollarSign,
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
import { MedicalExpense } from "../types/familyTypes";
import {
  getMedicalExpenses,
  addMedicalExpense,
  updateMedicalExpense,
  deleteMedicalExpense,
} from "../services/familyService";

interface MedicalExpenseFormData {
  amount: string;
  paidBy: string;
  notes: string;
  billDocumentId: string;
}

const initialFormData: MedicalExpenseFormData = {
  amount: "",
  paidBy: "",
  notes: "",
  billDocumentId: "",
};

export const ExpensesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [expenses, setExpenses] = useState<MedicalExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<MedicalExpense | null>(
    null,
  );
  const [formData, setFormData] =
    useState<MedicalExpenseFormData>(initialFormData);

  const loadData = useCallback(async () => {
    if (!user?.familyId || !user?.uid) return;
    try {
      const data = await getMedicalExpenses(user.familyId, user.uid);
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId, user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setFormData(initialFormData);
    setModalVisible(true);
  };

  const handleEditExpense = (expense: MedicalExpense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      notes: expense.notes,
      billDocumentId: expense.billDocumentId,
    });
    setModalVisible(true);
  };

  const handleDeleteExpense = (expense: MedicalExpense) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete this expense?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.familyId || !user?.uid) return;
            try {
              await deleteMedicalExpense(
                user.familyId,
                user.uid,
                expense.expenseId,
              );
              await loadData();
            } catch (err) {
              console.error("Failed to delete expense:", err);
              Alert.alert("Error", "Failed to delete expense");
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!formData.paidBy.trim()) {
      Alert.alert("Error", "Please enter who paid");
      return;
    }

    if (!user?.familyId || !user?.uid) return;

    try {
      if (editingExpense) {
        await updateMedicalExpense(
          user.familyId,
          user.uid,
          editingExpense.expenseId,
          {
            ...formData,
            amount,
          },
        );
      } else {
        await addMedicalExpense(user.familyId, user.uid, {
          ...formData,
          amount,
        });
      }
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save expense:", err);
      Alert.alert("Error", "Failed to save expense");
    }
  };

  const renderExpenseCard = (expense: MedicalExpense) => (
    <Pressable key={expense.expenseId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View
          style={[
            styles.medicineIcon,
            { backgroundColor: `${theme.colors.secondary}15` },
          ]}
        >
          <DollarSign size={20} color={theme.colors.secondary} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          ${expense.amount.toFixed(2)}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          Paid by: {expense.paidBy}
        </ThemedText>
      </View>
      <Pressable onPress={() => handleEditExpense(expense)}>
        <Edit2 size={16} color={theme.colors.textSecondary} />
      </Pressable>
      <Pressable onPress={() => handleDeleteExpense(expense)}>
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
              Medical Expenses
            </ThemedText>
            <Pressable onPress={handleAddExpense}>
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          </View>
          {loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : expenses.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <ThemedText
                variant="md"
                weight="medium"
                style={styles.emptyStateTitle}
              >
                No expenses yet
              </ThemedText>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.emptyStateDescription}
              >
                Add expenses to track your health costs
              </ThemedText>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {expenses.map(renderExpenseCard)}
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </GradientPageView>

      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingExpense ? "Edit Expense" : "Add Medical Expense"}
        onSubmit={handleSubmit}
      >
        <ThemedTextInput
          label="Amount"
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        <ThemedTextInput
          label="Paid By"
          value={formData.paidBy}
          onChangeText={(text) => setFormData({ ...formData, paidBy: text })}
          placeholder="Who paid?"
        />
        {/* TODO: Add Vault integration for bill document */}
        <View style={{ gap: 8 }}>
          <ThemedText variant="sm" weight="medium">
            Bill Receipt
          </ThemedText>
          <Button
            title="Upload Bill"
            variant="outline"
            icon={<Upload size={16} color={theme.colors.primary} />}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Bill upload will be linked to Vault module",
              )
            }
          />
          {formData.billDocumentId ? (
            <ThemedText variant="xs" color="textSecondary">
              Bill ID: {formData.billDocumentId}
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
