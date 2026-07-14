export const ROUTES = {
  AUTH: 'Auth',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FAMILY_SETUP: 'FamilySetup',
  DASHBOARD: 'Dashboard',
  HOME: 'Home',
} as const;

export type RouteConstant = (typeof ROUTES)[keyof typeof ROUTES];
