import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { Container, ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import type { ModuleStackParamList } from "@/types";

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

export const ModuleScaffold: React.FC<ModuleScaffoldProps> = ({
  title,
  summary,
  actions,
}) => {
  const navigation = useNavigation<NavigationProp<ModuleStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createModuleScaffoldStyles(theme), [theme]);

  const handlePress = (action: ModuleAction) => {
    if (action.onPress) {
      action.onPress();
      return;
    }

    navigation.navigate("ModuleDetail", {
      title: action.title,
      summary: action.summary,
      parentTitle: title,
    });
  };

  return (
    <Container>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="xxl" weight="bold">
            {title}
          </ThemedText>

          <ThemedText variant="md" color="textSecondary">
            {summary}
          </ThemedText>
        </View>

        <View style={styles.list}>
          {actions.map((action) => (
            <Pressable
              key={action.title}
              accessibilityRole="button"
              onPress={() => handlePress(action)}
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
    </Container>
  );
};
