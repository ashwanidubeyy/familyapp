import { Alert } from 'react-native';
import { BiometricAuth } from '@/config/BiometricAuth';

class BiometricServiceClass {
  async authenticate(): Promise<boolean> {
    try {
      const result = await BiometricAuth.authenticate({
        title: 'Unlock GharConnect',
        subtitle: 'Verify your identity to continue',
      });

      return result.success;
    } catch (error: any) {
      console.log("========== BIOMETRIC ERROR ==========");
      console.log("Code:", error?.code);
      console.log("Message:", error?.message);
      console.log("====================================");

      // Handle custom mapped error codes consistently across iOS and Android
      switch (error?.code) {
        case 'USER_CANCEL':
          // User intentionally tapped cancel, closed the prompt, or backed out.
          // Quietly fail without an disruptive alert.
          return false;

        case 'LOCKOUT':
          Alert.alert(
            'Too Many Attempts',
            'Biometrics are temporarily locked due to too many failed tries. Please wait a moment or use your fallback device pin.'
          );
          return false;

        case 'LOCKOUT_PERMANENT':
          Alert.alert(
            'Authentication Locked',
            'Biometrics are permanently locked. Please lock and unlock your device with your passcode to re-enable.'
          );
          return false;

        case 'NOT_ENROLLED':
          Alert.alert(
            'Biometrics Not Configured',
            'Please enable Fingerprint, Face ID, or a device lock screen PIN in your system settings.'
          );
          return false;

        case 'NOT_AVAILABLE':
        case 'NO_HARDWARE':
          Alert.alert(
            'Not Supported',
            'This device does not support biometric or device credential authentication.'
          );
          return false;

        case 'DEVICE_CREDENTIAL_UNAVAILABLE':
          Alert.alert(
            'Security Required',
            'Please configure a secure device PIN, Pattern, or Password in your system settings.'
          );
          return false;

        default:
          Alert.alert(
            'Authentication Failed',
            error?.message || 'Unable to verify your identity. Please try again.'
          );
          return false;
      }
    }
  }
}

export const BiometricService = new BiometricServiceClass();