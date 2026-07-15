import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createModuleScaffoldStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.md,
    },
    list: {
      gap: theme.spacing.sm,
    },
    row: {
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      shadowColor: '#64748B',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 2,
    },
    rowPressed: {
      opacity: 0.72,
    },
  });
