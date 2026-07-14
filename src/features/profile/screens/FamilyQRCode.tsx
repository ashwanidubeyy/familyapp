import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { ThemedText } from "@/components";
import { useTheme } from "@/hooks";
import type { Theme } from "@/types";

interface FamilyQRCodeProps {
  familyName: string;
  inviteCode: string;
  size?: number;
}

export const FamilyQRCode: React.FC<FamilyQRCodeProps> = ({
  familyName,
  inviteCode,
  size = 220,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const qrValue = JSON.stringify({
    type: "familyInvite",
    version: 1,
    inviteCode,
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <QRCode value={qrValue} size={size} quietZone={12} />

        <ThemedText variant="lg" weight="bold" style={styles.familyName}>
          {familyName}
        </ThemedText>

        <ThemedText variant="sm" color="textSecondary" style={styles.label}>
          Invite Code
        </ThemedText>

        <ThemedText variant="xl" weight="bold" style={styles.code}>
          {inviteCode}
        </ThemedText>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.xl,
    },

    card: {
      width: "100%",
      alignItems: "center",
      borderRadius: 20,
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
    },

    familyName: {
      marginTop: theme.spacing.lg,
      textAlign: "center",
    },

    label: {
      marginTop: theme.spacing.lg,
    },

    code: {
      marginTop: theme.spacing.xs,
      letterSpacing: 3,
    },
  });
