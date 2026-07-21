import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Alert } from "react-native";
import { UserPlus, Check, X } from "lucide-react-native";

import { ThemedText, GradientPageView } from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { createFamilyMainStyles } from "./styles";
import { JoinRequest } from "../types/familyTypes";
import { getJoinRequests, approveJoinRequest } from "../services/familyService";

export const JoinRequestsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.familyId) return;
    try {
      const data = await getJoinRequests(user.familyId);
      setRequests(data);
    } catch (err) {
      console.error("Failed to load join requests:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId]);

  useEffect(() => {
    loadData();
    // Check if current user is admin (simplified for now)
    if (user) {
      setIsAdmin(user.role === "admin");
    }
  }, [loadData, user]);

  const handleApproveRequest = async (request: JoinRequest) => {
    if (!user?.familyId || !user?.uid) return;
    try {
      await approveJoinRequest(user.familyId, request.requestId, user.uid);
      await loadData();
    } catch (err) {
      console.error("Failed to approve request:", err);
      Alert.alert("Error", "Failed to approve request");
    }
  };

  const handleRejectRequest = (request: JoinRequest) => {
    Alert.alert("Reject Request", "Reject functionality coming soon!", [{ text: "OK" }]);
  };

  const renderRequestCard = (request: JoinRequest) => (
    <View key={request.requestId} style={styles.infoCard}>
      <View style={styles.infoCardLeft}>
        <View style={styles.requestAvatar}>
          <UserPlus size={20} color={theme.colors.primary} />
        </View>
      </View>
      <View style={styles.infoCardContent}>
        <ThemedText variant="sm" weight="medium" style={styles.infoCardTitle}>
          New Request
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          Requested to join family
        </ThemedText>
      </View>
      {isAdmin && (
        <View style={styles.requestActions}>
          <Pressable
            style={[styles.requestActionButton, styles.requestActionButtonReject]}
            onPress={() => handleRejectRequest(request)}
          >
            <X size={16} color={theme.colors.error} />
          </Pressable>
          <Pressable
            style={[styles.requestActionButton, styles.requestActionButtonApprove]}
            onPress={() => handleApproveRequest(request)}
          >
            <Check size={16} color={theme.colors.textInverse} />
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <GradientPageView scroll showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { paddingTop: 20 }]}>
        <View style={styles.sectionHeader}>
          <ThemedText variant="lg" weight="semiBold" style={styles.sectionTitle}>
            Join Requests
          </ThemedText>
          {requests.length > 0 && (
            <View style={styles.badge}>
              <ThemedText variant="xs" weight="bold" style={{ color: theme.colors.textInverse }}>
                {requests.length}
              </ThemedText>
            </View>
          )}
        </View>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : requests.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <ThemedText variant="md" weight="medium" style={styles.emptyStateTitle}>
              No pending requests
            </ThemedText>
            <ThemedText variant="sm" color="textSecondary" style={styles.emptyStateDescription}>
              You're all caught up!
            </ThemedText>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {requests.map(renderRequestCard)}
          </View>
        )}
      </View>
      <View style={styles.bottomSpacer} />
    </GradientPageView>
  );
};
