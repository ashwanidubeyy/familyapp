export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
  FAMILY: {
    LIST: '/family',
    DETAIL: (id: string) => `/family/${id}`,
    MEMBERS: (id: string) => `/family/${id}/members`,
  },
} as const;
