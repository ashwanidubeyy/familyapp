import { StyleSheet } from "react-native";

import type { Theme } from "@/types";

export const createMembersListStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    loadingContainer: {
      paddingVertical: theme.spacing.xxl,
      alignItems: "center",
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxl,
      alignItems: "center",
      gap: theme.spacing.md,
    },
    emptyText: {
      color: theme.colors.textSecondary,
    },
    memberCard: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    memberCardPressed: {
      opacity: 0.8,
    },
    memberHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    avatarContainer: {
      position: "relative",
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    avatarPlaceholder: {
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    adminBadge: {
      position: "absolute",
      bottom: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    memberInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    memberNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    adminTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primaryLight,
    },
    menuButton: {
      padding: theme.spacing.sm,
    },
    menuButtonPressed: {
      opacity: 0.6,
    },
    memberDetails: {
      gap: theme.spacing.xs,
      paddingLeft: 64,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
  });

export const createHealthRecordsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    sectionCard: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
      minWidth: 120,
    },
    sectionCardActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    addButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primaryLight,
    },
    itemCard: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemName: {
      flex: 1,
    },
    itemMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    itemNotes: {
      marginTop: theme.spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: "100%",
      maxHeight: "80%",
      gap: theme.spacing.md,
      flexDirection: "column",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalBody: {
      flexGrow: 1,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      minHeight: 48,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    formGroup: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    label: {
      color: theme.colors.text,
    },
    saveButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
    },
  });

export const createEmergencyStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    contactCard: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    contactHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.error + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    contactInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    contactName: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    categoryBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.error + "20",
    },
    contactActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primaryLight,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primaryLight,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxl,
      alignItems: "center",
      gap: theme.spacing.md,
    },
    emptyText: {
      color: theme.colors.textSecondary,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    phoneButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primaryLight,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: "100%",
      maxHeight: "80%",
      gap: theme.spacing.md,
      flexDirection: "column",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalBody: {
      flexGrow: 1,
    },
    formGroup: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    label: {
      color: theme.colors.text,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      minHeight: 48,
    },
    saveButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
    },
  });

export const createAnnouncementsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    announcementCard: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    priorityHigh: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    priorityMedium: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    priorityLow: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.success,
    },
    announcementHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    announcementTitle: {
      flex: 1,
    },
    priorityBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    priorityBadgeHigh: {
      backgroundColor: theme.colors.error + "20",
    },
    priorityBadgeMedium: {
      backgroundColor: theme.colors.warning + "20",
    },
    priorityBadgeLow: {
      backgroundColor: theme.colors.success + "20",
    },
    announcementMessage: {
      marginTop: theme.spacing.xs,
    },
    announcementMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primaryLight,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxl,
      alignItems: "center",
      gap: theme.spacing.md,
    },
    emptyText: {
      color: theme.colors.textSecondary,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    deleteButton: {
      padding: theme.spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: "100%",
      maxHeight: "80%",
      gap: theme.spacing.md,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalBody: {
      flex: 1,
    },
    formGroup: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    label: {
      color: theme.colors.text,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      minHeight: 48,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    priorityOptions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    priorityOption: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    priorityOptionActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    saveButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
    },
  });

export const createJoinRequestsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xxl,
      alignItems: "center",
      gap: theme.spacing.md,
    },
    emptyText: {
      color: theme.colors.textSecondary,
    },
    requestCard: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    requestHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    requestAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    requestInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    requestMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    requestActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    approveButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.success,
    },
    rejectButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.error,
    },
  });
