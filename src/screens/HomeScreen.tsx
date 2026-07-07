import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Container, ThemedText } from '@/components';
import { useTheme, useTranslation } from '@/hooks';

export const HomeScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    card: {
      width: '100%',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      ...theme.shadows.md,
    },
    actions: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
      width: '100%',
    },
  });

  return (
    <Container>
      <View style={styles.content}>
        <View style={styles.card}>
          <ThemedText variant="xxl" weight="bold">
            {t('home.title')}
          </ThemedText>
          <ThemedText variant="lg" color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
            {t('home.welcome')}
          </ThemedText>
          <ThemedText variant="md" color="textSecondary">
            {t('home.subtitle')}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Button
            title={`${t('home.toggleTheme')} (${isDark ? 'Dark' : 'Light'})`}
            onPress={toggleTheme}
          />
        </View>
      </View>
    </Container>
  );
};
