import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initI18n } from '@/localization';
import { useTheme } from '@/hooks';
import { RootNavigator } from '@/navigation';
import { ThemeProvider } from '@/theme';
import { AuthProvider, useAuth } from '@/features/auth';
import { SOSButton } from '@/components';
import { NotificationProvider } from '@/notifications/NotificationProvider';

const AppStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
  );
};

const AppContentWithSOS: React.FC = () => {
  const { user } = useAuth();
  const isUserAuthenticated = !!user && !!user.familyId;

  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <RootNavigator />
      {isUserAuthenticated && <SOSButton />}
    </View>
  );
};

const AppContent: React.FC = () => {
  return (
    <AppContentWithSOS />
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
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
