import type { SignupPayload } from '../types';

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface SignupFormErrors {
  name?: string;
  email?: string;
  dob?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{8,16}$/;

export const validateLogin = (
  email: string,
  password: string,
): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return errors;
};

export const validateSignup = (
  payload: SignupPayload,
  confirmPassword: string,
): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  if (!payload.name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!payload.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!payload.dob.trim()) {
    errors.dob = 'Date of birth is required.';
  }

  if (!payload.phone.trim()) {
    errors.phone = 'Mobile number is required.';
  } else if (!phoneRegex.test(payload.phone.trim())) {
    errors.phone = 'Enter a valid mobile number.';
  }

  if (payload.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (confirmPassword !== payload.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!payload.address.trim()) {
    errors.address = 'Address is required.';
  }

  return errors;
};

export const hasErrors = <T extends object>(errors: T): boolean => {
  return Object.values(errors).some(Boolean);
};
