// src/screens/AppLockScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BiometricService } from '@/config/BiometricService';
// Example:
// const { unlockApp } = useSecurity();

const AppLockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // A tiny 250ms delay pushes execution to the end of the frame queue,
    // ensuring the navigation/screen transition completes cleanly first.
    const timer = setTimeout(() => {
      authenticate();
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const authenticate = async () => {
    if (loading) {
      return;
    }
  
    setLoading(true);
  
    try {
      const success = await BiometricService.authenticate();
  
      if (success) {
        onUnlock();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} width={100} height={100}/>
        </Text>

        <Text style={styles.title}>
          GharConnect
        </Text>

        <Text style={styles.subtitle}>
          Authenticate to continue
        </Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={authenticate}
          >
            <Text style={styles.buttonText}>
              Unlock
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppLockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },

  subtitle: {
    marginTop: 12,
    marginBottom: 40,
    color: '#9CA3AF',
    fontSize: 16,
  },

  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});