import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

interface BaseGradientPageViewProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  safeAreaStyle?: ViewStyle;
  scroll?: boolean;
}

type GradientPageViewProps = BaseGradientPageViewProps &
  Omit<ViewProps, 'style'> &
  Pick<ScrollViewProps, 'keyboardShouldPersistTaps' | 'showsVerticalScrollIndicator'>;

export const GradientPageView: React.FC<GradientPageViewProps> = ({
  children,
  contentStyle,
  safeAreaStyle,
  scroll = false,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const gradient = useMemo(
    () => getGradientColors(theme, isDark),
    [theme, isDark],
  );

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="pageGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gradient.start} />
            <Stop offset="0.48" stopColor={gradient.middle} />
            <Stop offset="1" stopColor={gradient.end} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#pageGradient)" />
      </Svg>
      {content}
    </SafeAreaView>
  );
};

const getGradientColors = (theme: Theme, isDark: boolean) => {
  if (isDark) {
    return {
      start: '#141B2B',
      middle: theme.colors.background,
      end: '#241A25',
    };
  }

  return {
    start: '#fff4fb',
    middle: theme.colors.background,
    end: '#FFF6FB',
  };
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: 112,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: 112,
    },
  });
