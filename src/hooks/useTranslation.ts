import { useTranslation as useI18nextTranslation } from 'react-i18next';

import type en from '@/localization/locales/en.json';

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof en>;

export const useTranslation = () => {
  const { t, i18n } = useI18nextTranslation();

  const translate = (key: TranslationKey, options?: Record<string, unknown>) =>
    t(key, options);

  return {
    t: translate,
    i18n,
    currentLanguage: i18n.language,
  };
};
