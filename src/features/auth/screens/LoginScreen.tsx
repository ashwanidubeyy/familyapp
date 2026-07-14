import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';

import type { AuthStackParamList, Theme } from '@/types';
import { useTheme } from '@/hooks';

import { AuthButton, AuthScreen, AuthTextInput } from '../components';
import { useAuth } from '../AuthProvider';
import { hasErrors, validateLogin, type LoginFormErrors } from '../utils/validation';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { theme, isDark } = useTheme();
  const { login, loading, sendPasswordReset } = useAuth();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const [email, setEmail] = useState('testing@gmail.com');
  const [password, setPassword] = useState('Test123');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const handleLogin = async () => {
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    setFormError('');
    setNotice('');

    if (hasErrors(nextErrors)) {
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const handlePasswordReset = async () => {
    const nextErrors = validateLogin(email, 'temporary');
    setErrors({ email: nextErrors.email });
    setFormError('');
    setNotice('');

    if (nextErrors.email) {
      return;
    }

    try {
      await sendPasswordReset(email);
      setNotice('Password reset email sent.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to send reset email.');
    }
  };

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to your GharConnect account"
    >
      <View style={styles.form}>
        <AuthTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          icon="@"
          error={errors.email}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="sarah@johnson.family"
        />
        <AuthTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          icon="[]"
          error={errors.password}
          secureTextEntry
          autoComplete="password"
          placeholder="Enter password"
        />
        <Pressable
          accessibilityRole="button"
          onPress={handlePasswordReset}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <AuthButton title="Sign In" loading={loading} onPress={handleLogin} />
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>
        <AuthButton title="Create Account" variant="secondary" onPress={() => navigation.navigate('Signup')} />
      </View>
    </AuthScreen>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    form: {
      gap: theme.spacing.lg,
    },
    forgotButton: {
      alignSelf: 'flex-end',
      minHeight: 28,
      justifyContent: 'center',
    },
    forgotText: {
      color: isDark ? '#E8A17A' : '#B77451',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
    formError: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
    notice: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
    dividerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? '#3B2B25' : '#E8DDD4',
    },
    dividerText: {
      color: isDark ? '#C8A08D' : '#8C634E',
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
    },
  });
