import type { Theme } from '@/types';

import { borderRadius } from './borderRadius';
import { lightColors } from './colors';
import { elevation } from './elevation';
import { createShadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  elevation,
  shadows: createShadows(lightColors),
};
