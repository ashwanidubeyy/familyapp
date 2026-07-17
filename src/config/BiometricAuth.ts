import { NativeModules } from 'react-native';

export interface AuthenticateOptions {
  title: string;
  subtitle?: string;
}

export interface AuthenticateResult {
  success: boolean;
  authType: 'biometric' | 'deviceCredential' | 'unknown';
}

interface BiometricAuthNativeModule {
  authenticate(
    options: AuthenticateOptions
  ): Promise<AuthenticateResult>;
}

const LINKING_ERROR =
  'BiometricAuth native module is not linked correctly.';

const NativeBiometric = NativeModules.BiometricAuth as
  | BiometricAuthNativeModule
  | undefined;

if (!NativeBiometric && __DEV__) {
  console.warn(LINKING_ERROR);
}

export const BiometricAuth = {
  authenticate(options: AuthenticateOptions) {
    if (!NativeBiometric) {
      return Promise.reject(new Error(LINKING_ERROR));
    }

    return NativeBiometric.authenticate(options);
  },
};
