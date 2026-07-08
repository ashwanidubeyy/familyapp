export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiErrorResponse {
  message: string;
  code?: string | number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
