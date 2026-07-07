import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initI18n } from '@/localization';
import { useTheme } from '@/hooks';
import { RootNavigator } from '@/navigation';
import { ThemeProvider } from '@/theme';

const AppStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <AppStatusBar />
      <RootNavigator />
    </>
  );
};

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await initI18n();
      setIsInitialized(true);
    };

    bootstrap();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
