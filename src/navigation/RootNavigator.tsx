import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import {
  FamilySetupScreen,
  LoginScreen,
  SignupScreen,
  useAuth,
} from "@/features/auth";

import {
  AddDocumentScreen,
  AddPasswordScreen,
  AddTransactionScreen,
  CalendarScreen,
  DocumentDetailsScreen,
  DocumentListScreen,
  FamilyScreen,
  FinanceDashboardScreen,
  HomeScreen,
  MaintenanceDetailsScreen,
  MaintenanceListScreen,
  ModuleDetailScreen,
  PasswordDetailsScreen,
  PasswordListScreen,
  ProfileScreen,
  TransactionDetailsScreen,
  VaultScreen,
} from "@/screens";
import AppLockScreen from "@/features/auth/screens/AppLockScreen";
import type { AppStackParamList, AuthStackParamList, ModuleStackParamList, RootTabParamList, VaultStackParamList } from '@/types';
import { FamilyQRCodeScreen } from "@/features/profile/screens/FamilyQRCodeScreen";
import CustomTabBar from "./components/CustomTabBar";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<ModuleStackParamList>();
const RootStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const VaultNativeStack = createNativeStackNavigator<VaultStackParamList>();

interface ModuleStackProps {
  component: React.ComponentType;
  title: string;
}

const createModuleStack = ({
  component: Component,
  title,
}: ModuleStackProps) => {
  const ModuleStack: React.FC = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="ModuleHome"
        component={Component}
        options={{ title, headerShown: false }}
      />
      <Stack.Screen
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="FamilyQRCode"
        component={FamilyQRCodeScreen}
        options={{ title: "Family QR Code" }}
      />
    </Stack.Navigator>
  );

  return ModuleStack;
};

const HomeStack = createModuleStack({
  component: HomeScreen,
  title: "GharConnect",
});
const FamilyStack = createModuleStack({
  component: FamilyScreen,
  title: "Family",
});
const CalendarStack = createModuleStack({
  component: CalendarScreen,
  title: "Calendar",
});
const ProfileStack = createModuleStack({
  component: ProfileScreen,
  title: "Profile",
});

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const VaultNavigator: React.FC = () => {
  return (
    <VaultNativeStack.Navigator screenOptions={{ headerShown: false }}>
      <VaultNativeStack.Screen name="VaultHome" component={VaultScreen} />
      <VaultNativeStack.Screen name="DocumentList" component={DocumentListScreen} />
      <VaultNativeStack.Screen name="DocumentDetails" component={DocumentDetailsScreen} />
      <VaultNativeStack.Screen name="PasswordList" component={PasswordListScreen} />
      <VaultNativeStack.Screen name="PasswordDetails" component={PasswordDetailsScreen} />
      <VaultNativeStack.Screen name="FinanceDashboard" component={FinanceDashboardScreen} />
      <VaultNativeStack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
      <VaultNativeStack.Screen name="MaintenanceList" component={MaintenanceListScreen} />
      <VaultNativeStack.Screen name="MaintenanceDetails" component={MaintenanceDetailsScreen} />
      <VaultNativeStack.Screen name="AddDocument" component={AddDocumentScreen} />
      <VaultNativeStack.Screen name="AddPassword" component={AddPasswordScreen} />
      <VaultNativeStack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </VaultNativeStack.Navigator>
  );
};

const DashboardNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Vault" component={VaultNavigator} />
      <Tab.Screen name="Family" component={FamilyStack} />
      <Tab.Screen name="Calendar" component={CalendarStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { user, initializing } = useAuth();
  const [skipLock, setSkipLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const initialize = async () => {
      // User logged out
      if (!user) {
        setSkipLock(false);
        setIsUnlocked(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const value = await AsyncStorage.getItem("JUST_LOGGED_IN");

        if (value === "true") {
          setSkipLock(true);
          setIsUnlocked(true); // Don't ask for biometric immediately after login
          await AsyncStorage.removeItem("JUST_LOGGED_IN");
        } else {
          setSkipLock(false);
          setIsUnlocked(false); // Returning user should see App Lock
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();

    const subscription = AppState.addEventListener("change", (nextState) => {
      // App moved to background
      if (
        appState.current === "active" &&
        (nextState === "inactive" || nextState === "background")
      ) {
        if (user) {
          setIsUnlocked(false);
          setSkipLock(false);
        }
      }

      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  if (initializing || loading) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Not logged in
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : !user.familyId ? (
          // Logged in but hasn't joined/created a family yet
          <RootStack.Screen name="FamilySetup" component={FamilySetupScreen} />
        ) : skipLock || isUnlocked ? (
          // Logged in + family exists + unlocked
          <RootStack.Screen name="Dashboard" component={DashboardNavigator} />
        ) : (
          // Logged in + family exists + locked
          <RootStack.Screen name="AppLock">
            {() => <AppLockScreen onUnlock={() => setIsUnlocked(true)} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
