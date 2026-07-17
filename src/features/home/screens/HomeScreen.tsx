import React, { useMemo } from "react";
import { Image, Pressable, View } from "react-native";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { Bell, User, Mic, Search } from "lucide-react-native";

import { AppHeader, Button, GradientPageView, ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import type { ModuleRouteName, RootStackParamList } from "@/types";

import { createHomeScreenStyles } from "./styles";

const MODULES: Array<{
  route: ModuleRouteName;
  title: string;
  summary: string;
}> = [
  {
    route: "Vault",
    title: "Vault",
    summary:
      "Documents, bills, warranties, properties, vehicles, and secure items.",
  },
  {
    route: "Family",
    title: "Family",
    summary:
      "Members, join requests, health records, emergency details, and announcements.",
  },
  {
    route: "Calendar",
    title: "Calendar",
    summary: "Birthdays, appointments, bill due dates, and shared reminders.",
  },
  {
    route: "Profile",
    title: "Profile",
    summary:
      "Account settings, family QR code, security, and notification preferences.",
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => createHomeScreenStyles(theme), [theme]);

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader
          eyebrow="Hello, John Smith"
          title="Good Morning!"
          leftIcon={User}
          actions={[
            {
              icon: Bell,
              accessibilityLabel: "Notifications",
              badgeCount: 3,
            },
          ]}
        />

        <View style={styles.search}>
          <Search size={22} color={theme.colors.textSecondary} strokeWidth={2.3} />
          <ThemedText variant="md" color="textSecondary">
            Search documents, reminders, members, or use voice
          </ThemedText>
          <View style={styles.micButton}>
            <Mic size={22} color={theme.colors.primary} strokeWidth={2.4} />
          </View>
        </View>

        <View style={styles.attentionCard}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            accessibilityIgnoresInvertColors
          />
          <ThemedText variant="xxl" weight="bold">
            GharConnect
          </ThemedText>
          <ThemedText variant="md" color="textSecondary">
            Attention feed, birthdays, bills, join requests, and reminders land
            here first.
          </ThemedText>
        </View>

        <View style={styles.grid}>
          <ThemedText variant="lg" weight="semiBold">
            Modules
          </ThemedText>
          {MODULES.map((module) => (
            <Pressable
              key={module.route}
              accessibilityRole="button"
              onPress={() => navigation.navigate(module.route)}
              style={({ pressed }) => [
                styles.moduleRow,
                pressed && styles.moduleRowPressed,
              ]}
            >
              <ThemedText variant="md" weight="semiBold">
                {module.title}
              </ThemedText>
              <ThemedText variant="sm" color="textSecondary">
                {module.summary}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Button
          title={`Theme: ${isDark ? "Dark" : "Light"}`}
          onPress={toggleTheme}
        />
      </View>
    </GradientPageView>
  );
};
