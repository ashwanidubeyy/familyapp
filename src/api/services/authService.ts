import { API_ENDPOINTS } from '@/constants';

import { apiClient } from '../apiClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthTokens>(API_ENDPOINTS.AUTH.LOGIN, payload),

  logout: () => apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT),

  getProfile: () =>
    apiClient.get<UserProfile>(API_ENDPOINTS.USER.PROFILE),
};

export const userService = {
  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, data),
};
