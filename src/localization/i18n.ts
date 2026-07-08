import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/storage';

import {
  DEFAULT_LANGUAGE,
  resources,
  type SupportedLanguage,
} from './resources';

const initI18n = async (): Promise<void> => {
  const savedLanguage = await storage.getItem<SupportedLanguage>(
    STORAGE_KEYS.LANGUAGE,
  );

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage ?? DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  await i18n.changeLanguage(language);
  await storage.setItem(STORAGE_KEYS.LANGUAGE, language);
};

export { initI18n };
export default i18n;
