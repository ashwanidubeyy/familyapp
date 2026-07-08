import { Environment, environmentConfigs } from './environments';

/**
 * Override via Metro bundler or build scripts:
 * process.env.APP_ENV = 'staging' | 'production'
 */
const resolveEnvironment = (): Environment => {
  const envFromProcess =
    typeof process !== 'undefined'
      ? (process.env.APP_ENV as Environment | undefined)
      : undefined;

  if (
    envFromProcess &&
    Object.prototype.hasOwnProperty.call(environmentConfigs, envFromProcess)
  ) {
    return envFromProcess;
  }

  return __DEV__ ? 'development' : 'production';
};

const activeEnvironment = resolveEnvironment();
const activeConfig = environmentConfigs[activeEnvironment];

export const config = {
  ...activeConfig,
  isDevelopment: activeEnvironment === 'development',
  isStaging: activeEnvironment === 'staging',
  isProduction: activeEnvironment === 'production',
} as const;

export type AppConfig = typeof config;
