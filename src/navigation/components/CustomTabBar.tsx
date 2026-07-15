import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks';
import type { RootTabParamList, Theme } from '@/types';

import { TabBarIcon } from './TabBarIcon';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HORIZONTAL_MARGIN = 1;
const TAB_BAR_HEIGHT = 78;
const SVG_HEIGHT = 104;
const CORNER_RADIUS = 18;
const NOTCH_WIDTH = 105;
const NOTCH_DEPTH = 20;
const FLOATING_BUTTON_SIZE = 68;
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 170,
  mass: 0.8,
};

const getTabCenter = (
  tabBarWidth: number,
  routeCount: number,
  index: number,
): number => {
  'worklet';

  return (tabBarWidth / routeCount) * index + tabBarWidth / routeCount / 2;
};

const createNotchedPath = (totalWidth: number, notchCenter: number): string => {
  'worklet';

  const notchLeft = notchCenter - NOTCH_WIDTH / 2;
  const notchRight = notchCenter + NOTCH_WIDTH / 2;
  const top = NOTCH_DEPTH;
  const bottom = SVG_HEIGHT;
  const barBottom = top + TAB_BAR_HEIGHT;

  return [
    `M${CORNER_RADIUS} ${top}`,
    `H${notchLeft - 18}`,
    `C${notchLeft - 4} ${top} ${notchLeft + 2} ${top + 6} ${notchLeft + 9} ${top + 17}`,
    `C${notchLeft + 21} ${top + 37} ${notchLeft + 34} ${top + 48} ${notchCenter} ${top + 48}`,
    `C${notchRight - 34} ${top + 48} ${notchRight - 21} ${top + 37} ${notchRight - 9} ${top + 17}`,
    `C${notchRight - 2} ${top + 6} ${notchRight + 4} ${top} ${notchRight + 18} ${top}`,
    `H${totalWidth - CORNER_RADIUS}`,
    `Q${totalWidth} ${top} ${totalWidth} ${top + CORNER_RADIUS}`,
    `V${barBottom - CORNER_RADIUS}`,
    `Q${totalWidth} ${barBottom} ${totalWidth - CORNER_RADIUS} ${barBottom}`,
    `H${CORNER_RADIUS}`,
    `Q0 ${barBottom} 0 ${barBottom - CORNER_RADIUS}`,
    `V${top + CORNER_RADIUS}`,
    `Q0 ${top} ${CORNER_RADIUS} ${top}`,
    `Z`,
    `M0 ${barBottom} H${totalWidth} V${bottom} H0 Z`,
  ].join(' ');
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();
  const tabBarWidth = width - HORIZONTAL_MARGIN * 2;
  const activeCenter = getTabCenter(tabBarWidth, state.routes.length, state.index);
  const animatedCenter = useSharedValue(activeCenter);
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  useEffect(() => {
    animatedCenter.value = withSpring(activeCenter, SPRING_CONFIG);
  }, [activeCenter, animatedCenter]);

  const pathAnimatedProps = useAnimatedProps(() => {
    return {
      d: createNotchedPath(tabBarWidth, animatedCenter.value),
    };
  });

  const floatingButtonStyle = useAnimatedStyle(() => {
    const routeWidth = tabBarWidth / state.routes.length;
    const progress = animatedCenter.value / routeWidth - 0.5;
    const translateY = interpolate(
      progress,
      [state.index - 1, state.index, state.index + 1],
      [-2, -10, -2],
      'clamp',
    );

    return {
      transform: [
        { translateX: animatedCenter.value - FLOATING_BUTTON_SIZE / 2 },
        { translateY },
      ],
    };
  });

  const activeRoute = state.routes[state.index];
  const activeDescriptor = descriptors[activeRoute.key];

  const handlePress = (routeKey: string, routeName: string, focused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!focused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={styles.shadowLayer}>
        <Svg
          width={tabBarWidth}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${tabBarWidth} ${SVG_HEIGHT}`}
          style={styles.svg}
        >
          <AnimatedPath
            animatedProps={pathAnimatedProps}
            fill={isDark ? '#211915' : theme.colors.surface}
          />
        </Svg>
      </View>

      <Animated.View style={[styles.floatingButton, floatingButtonStyle]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={activeDescriptor.options.tabBarAccessibilityLabel}
          testID={activeDescriptor.options.tabBarButtonTestID}
          onPress={() => handlePress(activeRoute.key, activeRoute.name, true)}
          style={styles.floatingPressable}
        >
          <TabBarIcon
            routeName={activeRoute.name as keyof RootTabParamList}
            focused
          />
        </Pressable>
      </Animated.View>

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const descriptor = descriptors[route.key];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : undefined}
              accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
              testID={descriptor.options.tabBarButtonTestID}
              onPress={() => handlePress(route.key, route.name, focused)}
              onLongPress={() => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }}
              style={styles.item}
            >
              {focused ? null : (
                <TabBarIcon
                  routeName={route.name as keyof RootTabParamList}
                  focused={false}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: HORIZONTAL_MARGIN,
      right: HORIZONTAL_MARGIN,
      bottom: 0,
      height: SVG_HEIGHT,
    },
    shadowLayer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: SVG_HEIGHT,
      shadowColor: isDark ? '#000000' : '#8A6B5C',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: isDark ? 0.42 : 0.18,
      shadowRadius: 16,
      elevation: 10,
      
    },
    svg: {
      position: 'absolute',
      left: 0,
      bottom: 0,
    },
    row: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: TAB_BAR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
    },
    item: {
      flex: 1,
      height: TAB_BAR_HEIGHT,
      alignItems: 'center',
      justifyContent: 'flex-start',
       paddingTop: NOTCH_DEPTH / 2,
    },
    floatingButton: {
      position: 'absolute',
      top: 0,
      width: FLOATING_BUTTON_SIZE,
      height: FLOATING_BUTTON_SIZE,
      borderRadius: FLOATING_BUTTON_SIZE / 2,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: isDark ? '#211915' : theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isDark ? '#000000' : '#8F5139',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: isDark ? 0.36 : 0.24,
      shadowRadius: 12,
      elevation: 12,
      zIndex: 10,
    },
    floatingPressable: {
      width: '100%',
      height: '100%',
      borderRadius: FLOATING_BUTTON_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default CustomTabBar;
