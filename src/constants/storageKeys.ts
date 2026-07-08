export const STORAGE_KEYS = {
  AUTH_TOKEN: '@familyhub/auth_token',
  REFRESH_TOKEN: '@familyhub/refresh_token',
  THEME_MODE: '@familyhub/theme_mode',
  LANGUAGE: '@familyhub/language',
  USER_PROFILE: '@familyhub/user_profile',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
