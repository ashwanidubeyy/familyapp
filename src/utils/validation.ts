export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

export const maxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

export const isStrongPassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return (
    password.length >= 8 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};
