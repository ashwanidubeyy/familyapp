import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_ENDPOINTS } from '@/constants';
import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/storage';
import type { ApiErrorResponse } from '@/types';
import { logger } from '@/utils';

type RequestConfigWithAuth = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  _retry?: boolean;
};

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processRefreshQueue = (token: string | null): void => {
  refreshQueue.forEach(callback => callback(token));
  refreshQueue = [];
};

/**
 * Extension point: implement token refresh logic when backend is ready.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await storage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    return null;
  }

  logger.info('Token refresh placeholder invoked');

  // Replace with actual refresh API call:
  // const response = await axios.post(`${config.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken });
  // return response.data.accessToken;

  return null;
};

export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    async (requestConfig: RequestConfigWithAuth) => {
      if (!requestConfig.skipAuth) {
        const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      logger.debug(
        `[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
        requestConfig.data,
      );

      return requestConfig;
    },
    (error: AxiosError) => {
      logger.error('[API Request Error]', error.message);
      return Promise.reject(error);
    },
  );
};

export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.debug(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.status,
        response.data,
      );
      return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as RequestConfigWithAuth | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const isUnauthorized = error.response?.status === 401;
      const isRefreshEndpoint = originalRequest.url?.includes(
        API_ENDPOINTS.AUTH.REFRESH,
      );

      if (isUnauthorized && !originalRequest._retry && !isRefreshEndpoint) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push((token: string | null) => {
              if (!token) {
                reject(error);
                return;
              }

              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processRefreshQueue(newToken);
            return instance(originalRequest);
          }

          processRefreshQueue(null);
          await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        } catch (refreshError) {
          processRefreshQueue(null);
          logger.error('[Token Refresh Failed]', refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (!originalRequest.skipErrorHandling) {
        const message =
          error.response?.data?.message ??
          error.message ??
          'An unexpected error occurred';

        logger.error('[API Response Error]', message, error.response?.status);
      }

      return Promise.reject(error);
    },
  );
};

export const setupInterceptors = (instance: AxiosInstance): void => {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
};
