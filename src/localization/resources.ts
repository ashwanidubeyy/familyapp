import en from './locales/en.json';

export const resources = {
  en: { translation: en },
} as const;

export type SupportedLanguage = keyof typeof resources;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en'];
