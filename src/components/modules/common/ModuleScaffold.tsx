import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import {
  CalendarDays,
  Search,
  Shield,
  User,
  Users,
  type LucideIcon,
} from "lucide-react-native";

import { AppHeader, GradientPageView, ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import type { ModuleStackParamList } from "@/types";
import { useAuth } from "@/features/auth";
import { Alert } from "react-native";

import { createModuleScaffoldStyles } from "./styles";

export interface ModuleAction {
  title: string;
  summary: string;
  onPress?: () => void;
}

interface ModuleScaffoldProps {
  title: string;
  summary: string;
  actions: ModuleAction[];
}

const MODULE_ICONS: Record<string, LucideIcon> = {
  Vault: Shield,
  Family: Users,
  Calendar: CalendarDays,
  Profile: User,
};

export const ModuleScaffold: React.FC<ModuleScaffoldProps> = ({
  title,
  summary,
  actions,
}) => {
  const navigation = useNavigation<NavigationProp<ModuleStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createModuleScaffoldStyles(theme), [theme]);
  const HeaderIcon = MODULE_ICONS[title] ?? Shield;
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.log("Logout Error:", error);
          }
        },
      },
    ]);
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader
          title={title}
          subtitle={summary}
          leftIcon={HeaderIcon}
          actions={[
            {
              icon: Search,
              accessibilityLabel: `Search ${title}`,
            },
          ]}
        />

        <View style={styles.list}>
          {actions.map((action) => (
            <Pressable
              key={action.title}
              accessibilityRole="button"
              onPress={() => {
                if (action.title === "Security and logout") {
                  handleLogout();
                  return;
                }

                if (action.onPress) {
                  action.onPress();
                  return;
                }

                navigation.navigate("ModuleDetail", {
                  title: action.title,
                  summary: action.summary,
                  parentTitle: title,
                });
              }}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <ThemedText variant="md" weight="medium">
                {action.title}
              </ThemedText>

              <ThemedText variant="sm" color="textSecondary">
                {action.summary}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </GradientPageView>
  );
};
