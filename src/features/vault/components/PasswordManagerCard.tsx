import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Copy, KeyRound, Lock, WandSparkles } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface PasswordManagerCardProps {
  count: number;
}

export const PasswordManagerCard: React.FC<PasswordManagerCardProps> = ({
  count,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.leading}>
        <View style={styles.iconWrap}>
          <Lock size={24} color={theme.colors.success} strokeWidth={2.6} />
        </View>
        <View>
          <Text style={styles.title}>My Passwords</Text>
          <Text style={styles.subtitle}>{count} secured entries</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Copy size={20} color={theme.colors.textSecondary} strokeWidth={2.3} />
        <WandSparkles size={20} color={theme.colors.primary} strokeWidth={2.3} />
        <KeyRound size={20} color={theme.colors.success} strokeWidth={2.3} />
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      minHeight: 78,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#DCFCE7',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      marginTop: 3,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });
