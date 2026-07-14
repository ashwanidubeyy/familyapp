import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface AuthScreenProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  title,
  subtitle,
  children,
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.mark}>
              <Text style={styles.markText}>GC</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? '#171411' : '#FBF4ED',
    },
    keyboard: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 28,
      paddingTop: 56,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 44,
    },
    mark: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#E8A17A' : '#B77451',
      marginBottom: 28,
    },
    markText: {
      color: '#FFF8F2',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
    title: {
      color: isDark ? '#FFF8F2' : '#2E211B',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: 31,
      lineHeight: 38,
    },
    subtitle: {
      color: isDark ? '#E2BCA8' : '#8C634E',
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.lg,
      marginTop: theme.spacing.sm,
    },
  });
