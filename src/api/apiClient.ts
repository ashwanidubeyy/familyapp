import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { ApiResponse, RequestConfig } from '@/types';

import { axiosInstance } from './axios';
import { setupInterceptors } from './interceptors';

setupInterceptors(axiosInstance);

type ApiRequestConfig = AxiosRequestConfig & RequestConfig;

class ApiClient {
  async get<T>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.get<ApiResponse<T>>(url, config);
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.post<ApiResponse<T>>(url, data, config);
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.put<ApiResponse<T>>(url, data, config);
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.patch<ApiResponse<T>>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.delete<ApiResponse<T>>(url, config);
  }
}

export const apiClient = new ApiClient();
