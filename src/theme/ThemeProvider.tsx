import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/storage';
import type { Theme, ThemeContextValue, ThemeMode } from '@/types';

import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const getThemeByMode = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    systemColorScheme === 'dark' ? 'dark' : 'light',
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedMode = await storage.getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE);

      if (savedMode) {
        setThemeModeState(savedMode);
      } else if (systemColorScheme) {
        setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }

      setIsReady(true);
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [setThemeMode, themeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getThemeByMode(themeMode),
      themeMode,
      isDark: themeMode === 'dark',
      setThemeMode,
      toggleTheme,
    }),
    [themeMode, setThemeMode, toggleTheme],
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
