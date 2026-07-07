import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageAdapter } from './types';

export const asyncStorageAdapter: StorageAdapter = {
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  getItem: (key) => AsyncStorage.getItem(key),
  removeItem: (key) => AsyncStorage.removeItem(key),
  clear: () => AsyncStorage.clear(),
};
