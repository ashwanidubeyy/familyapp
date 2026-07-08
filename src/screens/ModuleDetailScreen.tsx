import React, { useMemo } from 'react';
import { View } from 'react-native';
import { type RouteProp, useRoute } from '@react-navigation/native';

import { Container, ThemedText } from '@/components';
import { useTheme } from '@/hooks';
import type { ModuleStackParamList } from '@/types';

import { createModuleDetailScreenStyles } from './moduleDetailStyles';

type ModuleDetailRouteProp = RouteProp<ModuleStackParamList, 'ModuleDetail'>;

export const ModuleDetailScreen: React.FC = () => {
  const { params } = useRoute<ModuleDetailRouteProp>();
  const { theme } = useTheme();
  const styles = useMemo(() => createModuleDetailScreenStyles(theme), [theme]);

  return (
    <Container>
      <View style={styles.content}>
        <ThemedText variant="sm" weight="semiBold" color="textSecondary">
          {params.parentTitle}
        </ThemedText>
        <ThemedText variant="xxl" weight="bold">
          {params.title}
        </ThemedText>
        <ThemedText variant="md" color="textSecondary">
          {params.summary}
        </ThemedText>
      </View>
    </Container>
  );
};
