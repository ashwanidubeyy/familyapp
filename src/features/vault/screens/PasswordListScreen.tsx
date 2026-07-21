import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { KeyRound } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { VaultEmptyState, VaultSkeleton } from '../components';
import { useVaultPasswords } from '../hooks';

export const PasswordListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<VaultStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { passwords, loading, error } = useVaultPasswords();

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="My Passwords" subtitle="Secure vault credentials" leftIcon={KeyRound} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? (
          <VaultSkeleton count={3} />
        ) : passwords.length ? (
          passwords.map(password => (
            <Pressable
              key={password.id}
              accessibilityRole="button"
              style={styles.row}
              onPress={() => navigation.navigate('PasswordDetails', {
                passwordId: password.id,
                source: password.visibility ?? 'private',
              })}
            >
              <View style={styles.logo}>
                <Text style={styles.logoText}>{(password.title || password.website || 'P').charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{password.title || password.website}</Text>
                <Text style={styles.meta}>{password.username} · ••••••••</Text>
              </View>
              <Text style={styles.date}>{formatDate(password.updatedAt)}</Text>
            </Pressable>
          ))
        ) : (
          <VaultEmptyState title="No passwords saved" message="Add your first password from the Vault create menu." />
        )}
      </View>
    </GradientPageView>
  );
};

const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
}).format(new Date(date));

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    row: {
      minHeight: 76,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    logo: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#DCFCE7',
    },
    logoText: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    meta: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      marginTop: 3,
    },
    date: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
    },
    error: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
    },
  });
