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
    apiUrl: 'https://dev-api.familyhub.com/v1',
    timeout: 30000,
    enableLogging: true,
  },
  staging: {
    environment: 'staging',
    apiUrl: 'https://staging-api.familyhub.com/v1',
    timeout: 30000,
    enableLogging: true,
  },
  production: {
    environment: 'production',
    apiUrl: 'https://api.familyhub.com/v1',
    timeout: 15000,
    enableLogging: false,
  },
};
