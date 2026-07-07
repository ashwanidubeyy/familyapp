export const ROUTES = {
  HOME: 'Home',
} as const;

export type RouteConstant = (typeof ROUTES)[keyof typeof ROUTES];
