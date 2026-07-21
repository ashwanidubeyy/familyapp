import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import auth from "@react-native-firebase/auth";

import type { ApiErrorResponse } from "@/types";
import { logger } from "@/utils";

type RequestConfigWithAuth = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
};

export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    async (requestConfig: RequestConfigWithAuth) => {
      if (!requestConfig.skipAuth) {
        // Get Firebase ID token
        const currentUser = auth().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      logger.debug(
        `[API Request] ${requestConfig.method?.toUpperCase()} ${
          requestConfig.url
        }`,
        requestConfig.data,
      );

      return requestConfig;
    },
    (error: AxiosError) => {
      logger.error("[API Request Error]", error.message);
      return Promise.reject(error);
    },
  );
};

export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.debug(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
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

      if (!originalRequest.skipErrorHandling) {
        const message =
          error.response?.data?.message ??
          error.message ??
          "An unexpected error occurred";

        logger.error("[API Response Error]", message, error.response?.status);
      }

      return Promise.reject(error);
    },
  );
};

export const setupInterceptors = (instance: AxiosInstance): void => {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
};
