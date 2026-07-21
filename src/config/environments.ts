export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  timeout: number;
  enableLogging: boolean;
}

export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    environment: 'development',
    apiUrl: 'http://localhost:3000',
    timeout: 30000,
    enableLogging: true,
  },
  staging: {
    environment: 'staging',
    apiUrl: 'https://your-render-staging-url.onrender.com',
    timeout: 30000,
    enableLogging: true,
  },
  production: {
    environment: 'production',
    apiUrl: 'https://your-render-production-url.onrender.com',
    timeout: 15000,
    enableLogging: false,
  },
};
