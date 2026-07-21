import React, { useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
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
  CalendarScreen,
  FamilyScreen,
  HomeScreen,
  ModuleDetailScreen,
  ProfileScreen,
  VaultScreen,
} from "@/screens";

import type {
  AppStackParamList,
  AuthStackParamList,
  ModuleStackParamList,
  RootTabParamList,
} from "@/types";
import AppLockScreen from "@/features/auth/screens/AppLockScreen";
import CustomTabBar from "./components/CustomTabBar";
import { FamilyQRCodeScreen } from "@/features/profile/screens/FamilyQRCodeScreen";
import {
  FamilyMainScreen,
  MembersScreen,
  HealthScreen,
  MedicinesScreen,
  PrescriptionsScreen,
  VisitsScreen,
  ExpensesScreen,
  AnnouncementsScreen,
  EmergencyContactsScreen,
  JoinRequestsScreen,
} from "@/features/family";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<ModuleStackParamList>();
const RootStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const navigationRef = createNavigationContainerRef();

export function navigateToSOSAlert(): void {
  if (!navigationRef.isReady()) {
    return;
  }

  (navigationRef as any).navigate("Dashboard", {
    screen: "Family",
    params: {
      screen: "Emergency",
    },
  });
}

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
const VaultStack = createModuleStack({
  component: VaultScreen,
  title: "Vault",
});

// Custom Family Stack with all the new screens
const FamilyStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ModuleHome"
        component={FamilyMainScreen}
        options={{ title: "Family", headerShown: false }}
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
      <Stack.Screen
        name="Members"
        component={MembersScreen}
        options={{ title: "Members" }}
      />
      <Stack.Screen
        name="Health"
        component={HealthScreen}
        options={{ title: "Health" }}
      />
      <Stack.Screen
        name="Medicines"
        component={MedicinesScreen}
        options={{ title: "Medicines" }}
      />
      <Stack.Screen
        name="Prescriptions"
        component={PrescriptionsScreen}
        options={{ title: "Prescriptions" }}
      />
      <Stack.Screen
        name="Visits"
        component={VisitsScreen}
        options={{ title: "Doctor Visits" }}
      />
      <Stack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: "Medical Expenses" }}
      />
      <Stack.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{ title: "Announcements" }}
      />
      <Stack.Screen
        name="Emergency"
        component={EmergencyContactsScreen}
        options={{ title: "Emergency Contacts" }}
      />
      <Stack.Screen
        name="JoinRequests"
        component={JoinRequestsScreen}
        options={{ title: "Join Requests" }}
      />
    </Stack.Navigator>
  );
};

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

const DashboardNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
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
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Not logged in
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : !user.familyId ? (
          // Logged in but hasn't joined/created a family yet
          <RootStack.Screen name="FamilySetup" component={FamilySetupScreen} />
        ) : true ? ( //: skipLock || isUnlocked ? (
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
