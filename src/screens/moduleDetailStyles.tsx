import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createModuleDetailScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.sm,
    },
  });
