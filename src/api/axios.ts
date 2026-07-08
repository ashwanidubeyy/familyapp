import axios, { type AxiosInstance } from 'axios';

import { config } from '@/config';

export const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: config.apiUrl,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const axiosInstance = createAxiosInstance();
