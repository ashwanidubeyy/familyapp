import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createHomeScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.md,
    },
    search: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.surface,
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
    micButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      marginLeft: 'auto',
    },
    attentionCard: {
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
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
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    moduleRowPressed: {
      opacity: 0.72,
    },
  });
