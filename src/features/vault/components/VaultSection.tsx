import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface VaultSectionProps {
  title: string;
  children: React.ReactNode;
  onViewAll?: () => void;
}

export const VaultSection: React.FC<VaultSectionProps> = ({
  title,
  children,
  onViewAll,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll ? (
          <Pressable
            accessibilityRole="button"
            onPress={onViewAll}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={15} color={theme.colors.primary} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    header: {
      minHeight: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    viewAllButton: {
      minHeight: 30,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    viewAllText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
  });
