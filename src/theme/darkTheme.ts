import type { Theme } from '@/types';

import { borderRadius } from './borderRadius';
import { darkColors } from './colors';
import { elevation } from './elevation';
import { createShadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  elevation,
  shadows: createShadows(darkColors),
};
