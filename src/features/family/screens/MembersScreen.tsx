
import React, { useEffect, useState } from "react";
import { View, Pressable, Alert } from "react-native";
import { Plus, User } from "lucide-react-native";

import { ThemedText, GradientPageView, Button } from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { MembersList } from "../components/MembersList";
import { createFamilyMainStyles } from "./styles";

export const MembersScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if current user is admin
    // For now we'll use user.role or we can get from members list later
    if (user) {
      setIsAdmin(user.role === "admin");
      setLoading(false);
    }
  }, [user]);

  if (!user || !user.familyId) {
    return null;
  }

  return (
    <GradientPageView scroll showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { paddingTop: 20 }]}>
        <View style={styles.sectionHeader}>
          <ThemedText variant="lg" weight="semiBold" style={styles.sectionTitle}>
            Family Members
          </ThemedText>
          {isAdmin && (
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Add Member",
                  "Use the invite code to add new members",
                  [{ text: "OK" }]
                )
              }
            >
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          )}
        </View>
        <MembersList
          familyId={user.familyId}
          currentUserId={user.uid}
          isAdmin={isAdmin}
        />
      </View>
      <View style={styles.bottomSpacer} />
    </GradientPageView>
  );
};
