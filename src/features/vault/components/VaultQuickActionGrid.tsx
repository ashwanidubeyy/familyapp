import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import type { VaultQuickAction } from '../types';
import { getVaultIcon } from './vaultIconMap';

interface VaultQuickActionGridProps {
  actions: VaultQuickAction[];
  onPress?: (actionId: string) => void;
}

export const VaultQuickActionGrid: React.FC<VaultQuickActionGridProps> = ({
  actions,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.grid}>
      {actions.map(action => {
        const Icon = getVaultIcon(action.icon);

        return (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            onPress={() => onPress?.(action.id)}
            style={styles.action}
          >
            <Icon size={22} color={theme.colors.primary} strokeWidth={2.4} />
            <Text style={styles.actionText}>{action.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    action: {
      width: '48%',
      minHeight: 76,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    actionText: {
      flex: 1,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
  });
