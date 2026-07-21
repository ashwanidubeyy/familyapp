import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable, Alert, Share } from "react-native";
import {
  Users,
  Heart,
  Pill,
  FileText,
  Calendar,
  DollarSign,
  Megaphone,
  AlertTriangle,
  FolderOpen,
  FileCheck,
  UserPlus,
  QrCode,
  Settings,
  Copy,
  Share2,
  Plus,
  ChevronRight,
  Phone,
  MapPin,
} from "lucide-react-native";
import { ThemedText, AppHeader, GradientPageView } from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ModuleStackParamList } from "@/types";
import {
  Family,
  FamilyMember,
  Medicine,
  Prescription,
  DoctorVisit,
  MedicalExpense,
  Announcement,
  EmergencyContact,
  JoinRequest,
} from "../types/familyTypes";
import {
  getFamily,
  getAllMembers,
  getMedicines,
  getPrescriptions,
  getDoctorVisits,
  getMedicalExpenses,
  getAnnouncements,
  getEmergencyContacts,
  getJoinRequests,
} from "../services/familyService";

import { createFamilyMainStyles } from "./styles";

interface QuickLink {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

type FamilyNavigationProp = NativeStackNavigationProp<
  ModuleStackParamList,
  "ModuleHome"
>;

export const FamilyMainScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<FamilyNavigationProp>();
  const styles = createFamilyMainStyles(theme);

  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [expenses, setExpenses] = useState<MedicalExpense[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const quickLinks: QuickLink[] = [
    {
      id: "members",
      title: "Members",
      icon: Users,
      color: theme.colors.primary,
    },
    { id: "health", title: "Health", icon: Heart, color: theme.colors.error },
    { id: "medicines", title: "Medicines", icon: Pill, color: "#10b981" },
    {
      id: "prescriptions",
      title: "Prescriptions",
      icon: FileText,
      color: "#6366f1",
    },
    { id: "visits", title: "Doctor Visits", icon: Calendar, color: "#f59e0b" },
    { id: "expenses", title: "Expenses", icon: DollarSign, color: "#8b5cf6" },
    {
      id: "announcements",
      title: "Announcements",
      icon: Megaphone,
      color: "#ec4899",
    },
    {
      id: "emergency",
      title: "Emergency",
      icon: AlertTriangle,
      color: theme.colors.error,
    },
    { id: "vault", title: "Public Vault", icon: FolderOpen, color: "#06b6d4" },
    { id: "documents", title: "Documents", icon: FileCheck, color: "#14b8a6" },
    {
      id: "joinRequests",
      title: "Join Requests",
      icon: UserPlus,
      color: "#84cc16",
    },
    {
      id: "inviteQR",
      title: "Invite QR",
      icon: QrCode,
      color: theme.colors.primary,
    },
  ];

  const loadData = useCallback(async () => {
    if (!user?.familyId) return;
    try {
      setLoading(true);

      // Load data one by one with graceful failures so a single failure doesn't break everything!
      const familyData = await getFamily(user.familyId).catch((e) => {
        console.error("Failed to get family:", e);
        return null;
      });
      const membersData = await getAllMembers(user.familyId).catch((e) => {
        console.error("Failed to get members:", e);
        return [];
      });
      const medsData = await getMedicines(user.familyId, user.uid).catch(
        (e) => {
          console.error("Failed to get medicines:", e);
          return [];
        },
      );
      const prescriptionsData = await getPrescriptions(
        user.familyId,
        user.uid,
      ).catch((e) => {
        console.error("Failed to get prescriptions:", e);
        return [];
      });
      const visitsData = await getDoctorVisits(user.familyId, user.uid).catch(
        (e) => {
          console.error("Failed to get doctor visits:", e);
          return [];
        },
      );
      const expensesData = await getMedicalExpenses(
        user.familyId,
        user.uid,
      ).catch((e) => {
        console.error("Failed to get expenses:", e);
        return [];
      });
      const announcementsData = await getAnnouncements(user.familyId).catch(
        (e) => {
          console.error("Failed to get announcements:", e);
          return [];
        },
      );
      const emergencyData = await getEmergencyContacts(user.familyId).catch(
        (e) => {
          console.error("Failed to get emergency contacts:", e);
          return [];
        },
      );
      const requestsData = await getJoinRequests(user.familyId).catch((e) => {
        console.error("Failed to get join requests:", e);
        return [];
      });

      setFamily(familyData);
      setMembers(membersData);
      setMedicines(medsData);
      setPrescriptions(prescriptionsData);
      setVisits(visitsData);
      setExpenses(expensesData);
      setAnnouncements(announcementsData);
      setEmergencyContacts(emergencyData);
      setJoinRequests(requestsData);
    } catch (error) {
      console.error("Error loading family data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.familyId, user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyInviteCode = async () => {
    if (!family?.inviteCode) return;
    try {
      await Share.share({
        message: `Join my family on GharConnect! Use invite code: ${family.inviteCode}`,
      });
    } catch (error) {
      console.error("Error sharing invite code:", error);
    }
  };

  const handleQuickLinkPress = (id: string) => {
    // Map quick link ID to navigation route name
    const routeMap: Record<string, keyof ModuleStackParamList | null> = {
      members: "Members",
      health: "Health",
      medicines: "Medicines",
      prescriptions: "Prescriptions",
      visits: "Visits",
      expenses: "Expenses",
      announcements: "Announcements",
      emergency: "Emergency",
      vault: null, // TODO: Build Public Vault screen
      documents: null, // TODO: Build Documents screen
      joinRequests: "JoinRequests",
      inviteQR: "FamilyQRCode",
    };

    const routeName = routeMap[id];
    if (routeName) {
      if (routeName === "FamilyQRCode" && family) {
        navigation.navigate("FamilyQRCode", {
          familyName: family.familyName,
          inviteCode: family.inviteCode,
          size: 200,
        });
      } else {
        navigation.navigate(routeName);
      }
    } else {
      Alert.alert(
        "Coming Soon",
        `The ${
          quickLinks.find((link) => link.id === id)?.title
        } screen is under construction!`,
        [{ text: "OK" }],
      );
    }
  };

  const renderQuickLink = (link: QuickLink) => (
    <Pressable
      key={link.id}
      style={({ pressed }) => [
        styles.quickLinkCard,
        pressed && styles.quickLinkPressed,
      ]}
      onPress={() => handleQuickLinkPress(link.id)}
    >
      <View
        style={[
          styles.quickLinkIconContainer,
          { backgroundColor: `${link.color}15` },
        ]}
      >
        <link.icon size={28} color={link.color} />
      </View>
      <ThemedText
        variant="xs" // Smaller font to prevent wrapping
        weight="medium"
        style={styles.quickLinkTitle}
        numberOfLines={1} // Ensure only one line
        adjustsFontSizeToFit // Adjust font size to fit
        minimumFontScale={0.7} // Minimum scale for small text
      >
        {link.title}
      </ThemedText>
    </Pressable>
  );

  const renderFamilyHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.photoPlaceholder}>
          <Users size={48} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.headerInfo}>
          <ThemedText variant="xl" weight="bold" style={styles.familyName}>
            {family?.familyName || "My Family"}
          </ThemedText>
          <ThemedText
            variant="sm"
            color="textSecondary"
            style={styles.familyDescription}
          >
            {family?.description || "Welcome to your family hub"}
          </ThemedText>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerActionButton}>
            <Settings size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.inviteSection}>
        <View style={styles.inviteCodeContainer}>
          <ThemedText
            variant="xs"
            color="textSecondary"
            style={styles.inviteLabel}
          >
            Invite Code
          </ThemedText>
          <ThemedText variant="lg" weight="bold" style={styles.inviteCode}>
            {family?.inviteCode || "GHRCNT"}
          </ThemedText>
        </View>
        <View style={styles.inviteButtons}>
          <Pressable style={styles.inviteButton} onPress={handleCopyInviteCode}>
            <Share2 size={16} color={theme.colors.primary} />
            <ThemedText
              variant="sm"
              weight="medium"
              color="primary"
              style={styles.inviteButtonText}
            >
              Share
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.inviteButton, styles.inviteButtonSecondary]}
          >
            <QrCode size={16} color={theme.colors.textSecondary} />
            <ThemedText
              variant="sm"
              weight="medium"
              style={styles.inviteButtonText}
            >
              QR
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText variant="xl" weight="bold" style={styles.statNumber}>
            {members.length}
          </ThemedText>
          <ThemedText variant="xs" color="textSecondary">
            Members
          </ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText variant="xl" weight="bold" style={styles.statNumber}>
            {family?.adminCount || 1}
          </ThemedText>
          <ThemedText variant="xs" color="textSecondary">
            Admins
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderQuickLinks = () => (
    <View style={styles.section}>
      <ThemedText variant="md" weight="semiBold" style={styles.sectionTitle}>
        Quick Links
      </ThemedText>
      <View style={styles.quickLinksGrid}>
        {quickLinks.map(renderQuickLink)}
      </View>
    </View>
  );

  const renderEmptyState = (title: string, description: string) => (
    <View style={styles.emptyStateContainer}>
      <ThemedText variant="md" weight="medium" style={styles.emptyStateTitle}>
        {title}
      </ThemedText>
      <ThemedText
        variant="sm"
        color="textSecondary"
        style={styles.emptyStateDescription}
      >
        {description}
      </ThemedText>
    </View>
  );

  const renderMembersSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="md" weight="semiBold" style={styles.sectionTitle}>
          Family Members
        </ThemedText>
        <Pressable>
          <ThemedText variant="sm" color="primary" weight="medium">
            View All
          </ThemedText>
        </Pressable>
      </View>
      {members.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.membersScroll}
        >
          {members.slice(0, 5).map((member) => (
            <View key={member.userId} style={styles.memberCard}>
              <View style={styles.memberAvatar}>
                <Users size={24} color={theme.colors.textSecondary} />
              </View>
              <ThemedText
                variant="sm"
                weight="medium"
                style={styles.memberName}
              >
                {member.name || member.displayName || "Member"}
              </ThemedText>
              <ThemedText
                variant="xs"
                color="textSecondary"
                style={styles.memberRelation}
              >
                {member.relation || member.relationship || "Family"}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      ) : (
        renderEmptyState(
          "No members yet",
          "Invite family members to get started",
        )
      )}
    </View>
  );

  const renderMedicinesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="md" weight="semiBold" style={styles.sectionTitle}>
          Upcoming Medicines
        </ThemedText>
        <Pressable>
          <ThemedText variant="sm" color="primary" weight="medium">
            View All
          </ThemedText>
        </Pressable>
      </View>
      {medicines.length > 0 ? (
        <View style={styles.cardsContainer}>
          {medicines.slice(0, 3).map((medicine) => (
            <View key={medicine.medicineId} style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <View
                  style={[
                    styles.medicineIcon,
                    { backgroundColor: `${theme.colors.primary}15` },
                  ]}
                >
                  <Pill size={20} color={theme.colors.primary} />
                </View>
              </View>
              <View style={styles.infoCardContent}>
                <ThemedText
                  variant="sm"
                  weight="medium"
                  style={styles.infoCardTitle}
                >
                  {medicine.medicineName}
                </ThemedText>
                <ThemedText variant="xs" color="textSecondary">
                  {medicine.dosage} • {medicine.frequency}
                </ThemedText>
              </View>
              <ChevronRight size={16} color={theme.colors.textSecondary} />
            </View>
          ))}
        </View>
      ) : (
        renderEmptyState(
          "No medicines yet",
          "Add medications to track your health",
        )
      )}
    </View>
  );

  const renderAnnouncementsSection = () => {
    const latest = announcements[0];
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText
            variant="md"
            weight="semiBold"
            style={styles.sectionTitle}
          >
            Announcements
          </ThemedText>
          <Pressable>
            <ThemedText variant="sm" color="primary" weight="medium">
              View All
            </ThemedText>
          </Pressable>
        </View>
        {announcements.length > 0 ? (
          <View
            style={[
              styles.infoCard,
              latest.priority === "high" && styles.announcementHighPriority,
            ]}
          >
            <View style={styles.infoCardContent}>
              <View style={styles.announcementHeader}>
                <ThemedText
                  variant="sm"
                  weight="medium"
                  style={styles.infoCardTitle}
                >
                  {latest.title}
                </ThemedText>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        latest.priority === "high"
                          ? `${theme.colors.error}15`
                          : latest.priority === "medium"
                          ? `${theme.colors.warning}15`
                          : `${theme.colors.success}15`,
                    },
                  ]}
                >
                  <ThemedText
                    variant="xs"
                    weight="medium"
                    style={{
                      color:
                        latest.priority === "high"
                          ? theme.colors.error
                          : latest.priority === "medium"
                          ? theme.colors.warning
                          : theme.colors.success,
                    }}
                  >
                    {latest.priority}
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                variant="sm"
                color="textSecondary"
                style={styles.announcementMessage}
              >
                {latest.message}
              </ThemedText>
            </View>
          </View>
        ) : (
          renderEmptyState(
            "No announcements yet",
            "Share important updates with your family",
          )
        )}
      </View>
    );
  };

  const renderEmergencySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="md" weight="semiBold" style={styles.sectionTitle}>
          Emergency Contacts
        </ThemedText>
        <Pressable>
          <ThemedText variant="sm" color="primary" weight="medium">
            View All
          </ThemedText>
        </Pressable>
      </View>
      {emergencyContacts.length > 0 ? (
        <View style={styles.cardsContainer}>
          {emergencyContacts.slice(0, 3).map((contact) => (
            <View key={contact.contactId} style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <View
                  style={[
                    styles.emergencyIcon,
                    { backgroundColor: `${theme.colors.error}15` },
                  ]}
                >
                  <AlertTriangle size={20} color={theme.colors.error} />
                </View>
              </View>
              <View style={styles.infoCardContent}>
                <ThemedText
                  variant="sm"
                  weight="medium"
                  style={styles.infoCardTitle}
                >
                  {contact.name}
                </ThemedText>
                <ThemedText variant="xs" color="textSecondary">
                  {contact.phone}
                </ThemedText>
              </View>
              <Pressable style={styles.emergencyCallButton}>
                <Phone size={16} color={theme.colors.textInverse} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        renderEmptyState(
          "No emergency contacts yet",
          "Add important contacts for safety",
        )
      )}
    </View>
  );

  const renderJoinRequestsSection = () => {
    const isAdmin =
      user?.role === "admin" ||
      members.find((m) => m.userId === user?.uid)?.isAdmin;
    if (!isAdmin) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText
            variant="md"
            weight="semiBold"
            style={styles.sectionTitle}
          >
            Join Requests
          </ThemedText>
          {joinRequests.length > 0 && (
            <View style={styles.badge}>
              <ThemedText
                variant="xs"
                weight="bold"
                style={{ color: theme.colors.textInverse }}
              >
                {joinRequests.length}
              </ThemedText>
            </View>
          )}
        </View>
        {joinRequests.length > 0 ? (
          <View style={styles.cardsContainer}>
            {joinRequests.slice(0, 2).map((request) => (
              <View key={request.requestId} style={styles.infoCard}>
                <View style={styles.infoCardLeft}>
                  <View style={styles.requestAvatar}>
                    <UserPlus size={20} color={theme.colors.primary} />
                  </View>
                </View>
                <View style={styles.infoCardContent}>
                  <ThemedText
                    variant="sm"
                    weight="medium"
                    style={styles.infoCardTitle}
                  >
                    New Request
                  </ThemedText>
                  <ThemedText variant="xs" color="textSecondary">
                    Requested to join family
                  </ThemedText>
                </View>
                <View style={styles.requestActions}>
                  <Pressable
                    style={[
                      styles.requestActionButton,
                      styles.requestActionButtonReject,
                    ]}
                  >
                    <ThemedText variant="xs" weight="medium" color="error">
                      Reject
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.requestActionButton,
                      styles.requestActionButtonApprove,
                    ]}
                  >
                    <ThemedText
                      variant="xs"
                      weight="medium"
                      style={{ color: theme.colors.textInverse }}
                    >
                      Approve
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          renderEmptyState("No pending requests", "You're all caught up!")
        )}
      </View>
    );
  };

  return (
    <GradientPageView scroll={true} showsVerticalScrollIndicator={false}>
      {renderFamilyHeader()}
      {renderQuickLinks()}
      {renderMembersSection()}
      {renderMedicinesSection()}
      {renderAnnouncementsSection()}
      {renderEmergencySection()}
      {renderJoinRequestsSection()}
      <View style={styles.bottomSpacer} />
    </GradientPageView>
  );
};
