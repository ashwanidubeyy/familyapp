import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import type { MasterDataOption } from '../types';
import { getVaultIcon } from './vaultIconMap';

interface VaultCategoryCardProps {
  option: MasterDataOption;
  count?: number;
  onPress?: () => void;
}

export const VaultCategoryCard: React.FC<VaultCategoryCardProps> = ({
  option,
  count,
  onPress,
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark, option.color), [
    theme,
    isDark,
    option.color,
  ]);
  // const Icon = getVaultIcon(option.icon);
  const Icon =
  (Icons as any)[option.icon] ??
  Icons.Folder;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconWrap}>
        <Icon size={24} color={option.color} strokeWidth={2.4} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {option.name}
      </Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme, isDark: boolean, color: string) =>
  StyleSheet.create({
    card: {
      width: 76,
      minHeight: 90,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      shadowColor: '#64748B',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: isDark ? 0.16 : 0.09,
      shadowRadius: 14,
      elevation: 2,
    },
    cardPressed: {
      opacity: 0.72,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${color}18`,
    },
    title: {
      maxWidth: 64,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
    },
    countBadge: {
      minWidth: 22,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${color}22`,
      paddingHorizontal: 5,
    },
    countText: {
      color,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: 10,
      lineHeight: 12,
    },
  });
