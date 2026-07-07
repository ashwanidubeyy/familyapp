import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks';
import type { SpacingKey } from '@/theme';

interface ContainerProps extends ViewProps {
  padding?: SpacingKey;
  background?: 'background' | 'surface' | 'card';
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'md',
  background = 'background',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const backgroundMap = {
    background: theme.colors.background,
    surface: theme.colors.surface,
    card: theme.colors.card,
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: theme.spacing[padding],
          backgroundColor: backgroundMap[background],
        },
      }),
    [theme, padding, background, backgroundMap],
  );

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};
