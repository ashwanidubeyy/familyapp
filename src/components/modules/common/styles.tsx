import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createModuleScaffoldStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.md,
    },
    header: {
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    list: {
      gap: theme.spacing.sm,
    },
    row: {
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    rowPressed: {
      opacity: 0.72,
    },
  });
