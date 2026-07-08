import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FamilySetupScreen, LoginScreen, SignupScreen, useAuth } from '@/features/auth';
import {
  CalendarScreen,
  FamilyScreen,
  HomeScreen,
  ModuleDetailScreen,
  ProfileScreen,
  VaultScreen,
} from '@/screens';
import type { AppStackParamList, AuthStackParamList, ModuleStackParamList, RootTabParamList } from '@/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<ModuleStackParamList>();
const RootStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

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

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const DashboardNavigator: React.FC = () => {
  return (
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
  );
};

export const RootNavigator: React.FC = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user.familyId && user.status === 'active' ? (
          <RootStack.Screen name="Dashboard" component={DashboardNavigator} />
        ) : (
          <RootStack.Screen name="FamilySetup" component={FamilySetupScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
