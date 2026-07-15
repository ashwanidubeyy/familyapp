import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import {
  CalendarDays,
  House,
  Shield,
  User,
  Users,
} from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { RootTabParamList } from '@/types';

type TabRouteName = keyof RootTabParamList;

interface TabBarIconProps {
  routeName: TabRouteName;
  focused: boolean;
}

const TAB_ICONS: Record<TabRouteName, LucideIcon> = {
  Home: House,
  Vault: Shield,
  Family: Users,
  Calendar: CalendarDays,
  Profile: User,
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  focused,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () => createStyles(),
    [],
  );

  const Icon = TAB_ICONS[routeName];

  return (
    <View style={focused ? styles.activeContainer : styles.container}>
      <Icon
        size={focused ? 26 : 25}
        color={focused ? theme.colors.background : theme.colors.primary}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activeContainer: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
