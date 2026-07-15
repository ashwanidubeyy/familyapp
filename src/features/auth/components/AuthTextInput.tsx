import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type KeyboardTypeOptions,
  type TextInputProps,
  View,
} from "react-native";

import { useTheme } from "@/hooks";
import type { Theme } from "@/types";

interface AuthTextInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;

  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const AuthTextInput: React.FC<AuthTextInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputWrap, error ? styles.inputWrapError : undefined]}
      >
        <Text style={styles.icon}>{icon}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize="none"
          placeholderTextColor={styles.placeholder.color}
          style={styles.input}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSecure ? "Show password" : "Hide password"}
            onPress={() => setIsSecure((current) => !current)}
            hitSlop={10}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>{isSecure ? "Show" : "Hide"}</Text>
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRightIconPress}
            hitSlop={10}
            style={styles.toggle}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    label: {
      color: isDark ? "#FFF8F2" : "#2E211B",
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.sm,
    },
    inputWrap: {
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#3B2B25" : "#E8DDD4",
      backgroundColor: isDark ? "#F8F7F4" : "#F7F8F6",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    inputWrapError: {
      borderColor: theme.colors.error,
    },
    icon: {
      color: "#A6765C",
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.sm,
      width: 22,
    },
    input: {
      color: "#2E211B",
      flex: 1,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      paddingVertical: 0,
    },
    placeholder: {
      color: isDark ? "#E9DDD3" : "#8B7568",
    },
    toggle: {
      minHeight: 32,
      justifyContent: "center",
    },
    toggleText: {
      color: "#9B684D",
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.xs,
    },
    error: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
    },
  });
