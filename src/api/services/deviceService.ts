import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/constants';
import { Platform } from 'react-native';

export const registerDevice = async (token: string): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.DEVICE.REGISTER, {
    token,
    platform: Platform.OS,
  });
};
