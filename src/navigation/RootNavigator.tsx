import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  CalendarScreen,
  FamilyScreen,
  HomeScreen,
  ModuleDetailScreen,
  ProfileScreen,
  VaultScreen,
} from '@/screens';
import type { ModuleStackParamList, RootTabParamList } from '@/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<ModuleStackParamList>();

interface ModuleStackProps {
  component: React.ComponentType;
  title: string;
}

const createModuleStack = ({ component: Component, title }: ModuleStackProps) => {
  const ModuleStack: React.FC = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="ModuleHome"
        component={Component}
        options={{ title }}
      />
      <Stack.Screen
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );

  return ModuleStack;
};

const HomeStack = createModuleStack({ component: HomeScreen, title: 'GharConnect' });
const VaultStack = createModuleStack({ component: VaultScreen, title: 'Vault' });
const FamilyStack = createModuleStack({ component: FamilyScreen, title: 'Family' });
const CalendarStack = createModuleStack({ component: CalendarScreen, title: 'Calendar' });
const ProfileStack = createModuleStack({ component: ProfileScreen, title: 'Profile' });

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Vault" component={VaultStack} />
        <Tab.Screen name="Family" component={FamilyStack} />
        <Tab.Screen name="Calendar" component={CalendarStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
