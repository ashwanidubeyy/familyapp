import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock, Users } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';
import type { VaultVisibility } from '@/domain';

interface VaultSegmentedControlProps {
  value: VaultVisibility;
  onChange: (value: VaultVisibility) => void;
}

export const VaultSegmentedControl: React.FC<VaultSegmentedControlProps> = ({
  value,
  onChange,
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'private' }}
        onPress={() => onChange('private')}
        style={[styles.option, value === 'private' && styles.optionActive]}
      >
        <Lock
          size={18}
          color={value === 'private' ? theme.colors.text : theme.colors.textSecondary}
          strokeWidth={2.4}
        />
        <Text style={value === 'private' ? styles.optionTextActive : styles.optionText}>
          Private
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'public' }}
        onPress={() => onChange('public')}
        style={[styles.option, value === 'public' && styles.optionActive]}
      >
        <Users
          size={18}
          color={value === 'public' ? theme.colors.text : theme.colors.textSecondary}
          strokeWidth={2.4}
        />
        <Text style={value === 'public' ? styles.optionTextActive : styles.optionText}>
          Family Shared
        </Text>
      </Pressable>
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      borderRadius: 16,
      backgroundColor: isDark ? '#151D2E' : '#EEF4F8',
      gap: 4,
    },
    option: {
      flex: 1,
      minHeight: 44,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    optionActive: {
      backgroundColor: theme.colors.surface,
      shadowColor: '#64748B',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: isDark ? 0.18 : 0.14,
      shadowRadius: 12,
      elevation: 4,
    },
    optionText: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
    optionTextActive: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
  });
