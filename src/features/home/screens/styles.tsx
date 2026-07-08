import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createHomeScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.md,
    },
    search: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    attentionCard: {
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    logo: {
      width: 88,
      height: 88,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    grid: {
      gap: theme.spacing.sm,
    },
    moduleRow: {
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    moduleRowPressed: {
      opacity: 0.72,
    },
  });
