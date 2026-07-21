import React, { useMemo } from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks';
import { ThemedText } from './ThemedText';

interface ThemedSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ThemedSwitch: React.FC<ThemedSwitchProps> = ({
  label,
  value,
  onValueChange,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: theme.spacing.sm,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <ThemedText variant="sm" weight="medium">
        {label}
      </ThemedText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}80` }}
        thumbColor={value ? theme.colors.primary : theme.colors.textSecondary}
      />
    </View>
  );
};
