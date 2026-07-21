import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Copy, ExternalLink, KeyRound, Trash2 } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { vaultFirestoreService } from '../services/firestoreService';
import type { PasswordRecord } from '../types';

export const PasswordDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<VaultStackParamList, 'PasswordDetails'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [password, setPassword] = useState<PasswordRecord | null>(null);

  useEffect(() => {
    vaultFirestoreService.getPassword(route.params.passwordId).then(setPassword);
  }, [route.params.passwordId]);

  const deletePassword = async () => {
    await vaultFirestoreService.deletePassword(route.params.passwordId);
    navigation.goBack();
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Password" leftIcon={KeyRound} />
        {password ? (
          <View style={styles.card}>
            <InfoRow label="Title" value={password.title || password.website} />
            <InfoRow label="Username" value={password.username} />
            <InfoRow label="Password" value="••••••••••••" />
            <InfoRow label="Website" value={password.website || '-'} />
            <InfoRow label="Notes" value={password.notes || '-'} />
            <View style={styles.actions}>
              <Action title="Copy Username" icon={Copy} onPress={() => Alert.alert('Copied', password.username)} />
              <Action title="Copy Password" icon={Copy} onPress={() => Alert.alert('Copied', 'Password copied')} />
              <Action title="Launch Website" icon={ExternalLink} onPress={() => password.website && Linking.openURL(password.website)} />
              <Action title="Delete" icon={Trash2} danger onPress={deletePassword} />
            </View>
          </View>
        ) : null}
      </View>
    </GradientPageView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const Action: React.FC<{
  title: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  onPress: () => void;
  danger?: boolean;
}> = ({ title, icon: Icon, onPress, danger = false }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable accessibilityRole="button" style={styles.action} onPress={onPress}>
      <Icon size={18} color={danger ? theme.colors.error : theme.colors.primary} strokeWidth={2.3} />
      <Text style={danger ? styles.actionTextDanger : styles.actionText}>{title}</Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    card: {
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    infoRow: {
      minHeight: 54,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    infoValue: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    actions: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    action: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
    },
    actionTextDanger: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.bold,
    },
  });
