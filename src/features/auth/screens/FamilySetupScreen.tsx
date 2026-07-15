import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks";
import type { Theme } from "@/types";

import { useAuth } from "../AuthProvider";
import { AuthButton, AuthScreen, AuthTextInput } from "../components";

type FamilyMode = "create" | "join";
import { QRScannerModal } from "../components/QRScannerModal";

export const FamilySetupScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { createFamily, joinFamily, loading, signOut } = useAuth();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const [mode, setMode] = useState<FamilyMode>("create");
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);

  const handleContinue = async () => {
    const value = mode === "create" ? familyName.trim() : inviteCode.trim();
    setFieldError("");
    setFormError("");

    if (!value) {
      setFieldError(
        mode === "create"
          ? "Family name is required."
          : "Invite code is required.",
      );
      return;
    }

    try {
      if (mode === "create") {
        await createFamily(value);
      } else {
        await joinFamily(value);
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to continue.",
      );
    }
  };

  return (
    <AuthScreen
      title="Family space"
      subtitle="Create your home group or join an existing family"
    >
      <View style={styles.form}>
        <View style={styles.segment}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode("create")}
            style={[
              styles.segmentButton,
              mode === "create" ? styles.segmentButtonActive : undefined,
            ]}
          >
            <Text
              style={
                mode === "create"
                  ? styles.segmentTextActive
                  : styles.segmentText
              }
            >
              Create
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode("join")}
            style={[
              styles.segmentButton,
              mode === "join" ? styles.segmentButtonActive : undefined,
            ]}
          >
            <Text
              style={
                mode === "join" ? styles.segmentTextActive : styles.segmentText
              }
            >
              Join
            </Text>
          </Pressable>
        </View>
        {mode === "create" ? (
          <AuthTextInput
            label="Family Name"
            value={familyName}
            onChangeText={setFamilyName}
            icon="Fm"
            error={fieldError}
            autoCapitalize="words"
            placeholder="Johnson Family"
          />
        ) : (
          <AuthTextInput
            label="Invite Code"
            value={inviteCode}
            onChangeText={setInviteCode}
            icon="#"
            error={fieldError}
            autoCapitalize="characters"
            placeholder="ABC123"
            rightIcon={<Text style={{ fontSize: 20 }}>📷</Text>}
            onRightIconPress={() => setScannerVisible(true)}
          />
        )}
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <AuthButton
          title={mode === "create" ? "Create Family" : "Join Family"}
          loading={loading}
          onPress={handleContinue}
        />
        <Pressable
          accessibilityRole="button"
          onPress={signOut}
          style={styles.footerButton}
        >
          <Text style={styles.footerText}>Use another account</Text>
        </Pressable>
      </View>
      <QRScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={(code) => {
          setInviteCode(code);
          setScannerVisible(false);

          // Optional
          // joinFamily(code);
        }}
      />
    </AuthScreen>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    form: {
      gap: theme.spacing.lg,
    },
    segment: {
      flexDirection: "row",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? "#3B2B25" : "#E8DDD4",
      padding: 4,
      backgroundColor: isDark ? "#211915" : "#FFFFFF",
    },
    segmentButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    segmentButtonActive: {
      backgroundColor: isDark ? "#9B5F3E" : "#A96745",
    },
    segmentText: {
      color: isDark ? "#E2BCA8" : "#8C634E",
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
    segmentTextActive: {
      color: "#FFFFFF",
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
    formError: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      textAlign: "center",
    },
    footerButton: {
      alignItems: "center",
      minHeight: 36,
      justifyContent: "center",
    },
    footerText: {
      color: isDark ? "#E8A17A" : "#B77451",
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
    },
  });
