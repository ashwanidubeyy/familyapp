import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BanknoteArrowDown } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useAuth } from '@/features/auth';
import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import { vaultFirestoreService } from '../services/firestoreService';
import type { TransactionType } from '../types';
import type { VaultVisibility } from '@/domain';

export const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('');
  const [property, setProperty] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('');
  const [vaultType, setVaultType] = useState<VaultVisibility>('private');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || !category.trim()) {
      Alert.alert('Missing details', 'Amount and category are required.');
      return;
    }

    setSaving(true);
    try {
      await vaultFirestoreService.saveTransaction({
        type,
        amount: parsedAmount,
        categoryId: category.toLowerCase().replace(/\s+/g, '_'),
        categoryName: category,
        date,
        paymentMethod,
        property,
        description,
        recurring: false,
        reminder,
        vaultType,
        familyId: user?.familyId,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Add Income / Expense" leftIcon={BanknoteArrowDown} />
        <View style={styles.segment}>
          <Pressable style={[styles.segmentButton, type === 'income' && styles.segmentButtonActive]} onPress={() => setType('income')}>
            <Text style={styles.segmentText}>Income</Text>
          </Pressable>
          <Pressable style={[styles.segmentButton, type === 'expense' && styles.segmentButtonActive]} onPress={() => setType('expense')}>
            <Text style={styles.segmentText}>Expense</Text>
          </Pressable>
        </View>
        <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
        <Field label="Category" value={category} onChangeText={setCategory} />
        <Field label="Date" value={date} onChangeText={setDate} />
        <Field label="Payment Method" value={paymentMethod} onChangeText={setPaymentMethod} />
        <Field label="Property" value={property} onChangeText={setProperty} />
        <Field label="Description" value={description} onChangeText={setDescription} multiline />
        <Field label="Reminder" value={reminder} onChangeText={setReminder} />
        <View style={styles.segment}>
          <Pressable style={[styles.segmentButton, vaultType === 'private' && styles.segmentButtonActive]} onPress={() => setVaultType('private')}>
            <Text style={styles.segmentText}>Private</Text>
          </Pressable>
          <Pressable style={[styles.segmentButton, vaultType === 'public' && styles.segmentButtonActive]} onPress={() => setVaultType('public')}>
            <Text style={styles.segmentText}>Public</Text>
          </Pressable>
        </View>
        <Pressable style={styles.saveButton} onPress={save} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </View>
    </GradientPageView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}> = props => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        keyboardType={props.keyboardType}
        style={props.multiline ? styles.inputMultiline : styles.input}
        placeholderTextColor={theme.colors.placeholder}
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.md,
    },
    field: {
      gap: theme.spacing.xs,
    },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    input: {
      minHeight: 52,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    inputMultiline: {
      minHeight: 96,
      borderRadius: 16,
      padding: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      textAlignVertical: 'top',
    },
    segment: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    segmentButton: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: theme.colors.card,
    },
    segmentButtonActive: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    segmentText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    saveButton: {
      minHeight: 54,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
    },
    saveText: {
      color: theme.colors.textInverse,
      fontFamily: theme.typography.fontFamily.bold,
    },
  });
