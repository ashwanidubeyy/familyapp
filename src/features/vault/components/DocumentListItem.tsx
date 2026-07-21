import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import type { VaultDocument } from '../types';
import { getVaultIcon } from './vaultIconMap';

interface DocumentListItemProps {
  document: VaultDocument;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onPress,
  onMenuPress,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const Icon =  getVaultIcon(document.icon === 'Insurance' ? 'Shield' : 'FileText');

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.iconWrap}>
        <Icon size={24} color={theme.colors.primary} strokeWidth={2.4} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{document.title}</Text>
        <Text style={styles.meta}>
          PDF · 2.4 MB · {formatDate(document.createdAt)}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`More options for ${document.title}`}
        onPress={onMenuPress}
        style={styles.menuButton}
      >
        <MoreHorizontal size={22} color={theme.colors.textSecondary} strokeWidth={2.4} />
      </Pressable>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EEF2FF',
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
      fontSize: theme.typography.fontSize.sm,
      marginTop: 3,
    },
    menuButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
  });
