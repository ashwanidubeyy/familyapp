import { StyleSheet } from 'react-native';

import type { Theme } from '@/types';

export const createFamilyMainStyles = (theme: Theme) =>
  StyleSheet.create({
    bottomSpacer: {
      height: 100, // More bottom space
    },

    // Header styles
    headerContainer: {
      paddingHorizontal: 24,
      paddingTop: 40, // More top padding
      paddingBottom: 24,
      gap: 24, // Increased gap between header elements
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    photoPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerInfo: {
      flex: 1,
      gap: 8, // More gap
    },
    familyName: {
      color: theme.colors.text,
    },
    familyDescription: {},
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerActionButton: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inviteSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    inviteCodeContainer: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inviteLabel: {
      marginBottom: 4,
    },
    inviteCode: {
      color: theme.colors.primary,
      letterSpacing: 2,
    },
    inviteButtons: {
      flexDirection: 'column',
      gap: 8,
    },
    inviteButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary}15`,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    inviteButtonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inviteButtonText: {},
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: 4,
    },
    statNumber: {
      color: theme.colors.primary,
    },

    // Section styles
    section: {
      paddingHorizontal: 24,
      marginBottom: 40, // Even more spacing between sections
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16, // More bottom margin
    },
    sectionTitle: {
      color: theme.colors.text,
    },

    // Quick Links
    quickLinksGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between', // Better spacing
    },
    quickLinkCard: {
      width: '30%', // Exactly 3 per row with spacing
      aspectRatio: 1,
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    quickLinkPressed: {
      transform: [{ scale: 0.96 }],
      opacity: 0.8,
    },
    quickLinkIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickLinkTitle: {
      color: theme.colors.text,
      textAlign: 'center',
    },

    // Members
    membersScroll: {
      marginLeft: -24,
      paddingLeft: 24,
      paddingRight: 24,
      marginHorizontal: -24,
      // Add some bottom margin just in case
      marginBottom: 8, 
    },
    memberCard: {
      width: 100,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: 8,
      marginRight: 12,
    },
    memberAvatar: {
      width: 48,
      height: 48,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    memberName: {
      color: theme.colors.text,
    },
    memberRelation: {
      textAlign: 'center',
    },

    // Info Cards
    cardsContainer: {
      gap: 12,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    infoCardLeft: {},
    medicineIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emergencyIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestAvatar: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoCardContent: {
      flex: 1,
      gap: 4,
    },
    infoCardTitle: {
      color: theme.colors.text,
    },

    // Announcements
    announcementHighPriority: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    announcementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    announcementMessage: {
      lineHeight: 20,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },

    // Emergency
    emergencyCallButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Join Requests
    badge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestActions: {
      flexDirection: 'row',
      gap: 8,
    },
    requestActionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    requestActionButtonReject: {
      backgroundColor: `${theme.colors.error}15`,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    requestActionButtonApprove: {
      backgroundColor: theme.colors.primary,
    },

    // Empty State
    emptyStateContainer: {
      padding: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: 12,
    },
    emptyStateTitle: {
      color: theme.colors.text,
    },
    emptyStateDescription: {
      textAlign: 'center',
    },
  });
