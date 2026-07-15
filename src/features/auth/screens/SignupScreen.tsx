import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';

import { useTheme } from '@/hooks';
import type { AuthStackParamList, Theme } from '@/types';

import { useAuth } from '../AuthProvider';
import { AuthButton, AuthScreen, AuthTextInput } from '../components';
import type { SignupPayload } from '../types';
import { hasErrors, validateSignup, type SignupFormErrors } from '../utils/validation';

const initialForm: SignupPayload = {
  name: '',
  email: '',
  dob: '',
  phone: '',
  password: '',
  address: '',
};

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { theme, isDark } = useTheme();
  const { signup, loading } = useAuth();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const [form, setForm] = useState<SignupPayload>(initialForm);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [formError, setFormError] = useState('');

  const updateField = (field: keyof SignupPayload) => (value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSignup = async () => {
    const nextErrors = validateSignup(form, confirmPassword);
    setErrors(nextErrors);
    setFormError('');

    if (hasErrors(nextErrors)) {
      return;
    }

    try {
      await signup(form);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create account.');
    }
  };

  return (
    <AuthScreen
      title="Create account"
      subtitle="Set up your GharConnect profile"
    >
      <View style={styles.form}>
        <AuthTextInput
          label="Full Name"
          value={form.name}
          onChangeText={updateField('name')}
          icon="Aa"
          error={errors.name}
          autoCapitalize="words"
          placeholder="Sarah Johnson"
        />
        <AuthTextInput
          label="Email"
          value={form.email}
          onChangeText={updateField('email')}
          icon="@"
          error={errors.email}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="sarah@johnson.family"
        />
        <AuthTextInput
          label="DOB"
          value={form.dob}
          onChangeText={updateField('dob')}
          icon="D"
          error={errors.dob}
          placeholder="YYYY-MM-DD"
        />
        <AuthTextInput
          label="Mobile"
          value={form.phone}
          onChangeText={updateField('phone')}
          icon="Ph"
          error={errors.phone}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+91 98765 43210"
        />
        <AuthTextInput
          label="Password"
          value={form.password}
          onChangeText={updateField('password')}
          icon="[]"
          error={errors.password}
          secureTextEntry
          autoComplete="new-password"
          placeholder="Create password"
        />
        <AuthTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon="[]"
          error={errors.confirmPassword}
          secureTextEntry
          autoComplete="new-password"
          placeholder="Confirm password"
        />
        <AuthTextInput
          label="Address"
          value={form.address}
          onChangeText={updateField('address')}
          icon="Ad"
          error={errors.address}
          autoCapitalize="sentences"
          placeholder="Home address"
        />
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <AuthButton title="Create Account" loading={loading} onPress={handleSignup} />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
          style={styles.footerButton}
        >
          <Text style={styles.footerText}>Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    form: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
    },
    formError: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
    footerButton: {
      alignItems: 'center',
      minHeight: 36,
      justifyContent: 'center',
    },
    footerText: {
      color: isDark ? '#E8A17A' : '#B77451',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
  });
