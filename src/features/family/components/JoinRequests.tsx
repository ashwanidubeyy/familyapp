import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { UserPlus, Check, X, Clock, User } from 'lucide-react-native';

import { ThemedText } from '@/components';
import { useTheme } from '@/hooks';
import { JoinRequest } from '../types/familyTypes';
import {
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from '../services/familyService';

import { createJoinRequestsStyles } from './styles';

interface JoinRequestsProps {
  familyId: string;
  isAdmin: boolean;
  currentUserId: string;
}

export const JoinRequests: React.FC<JoinRequestsProps> = ({
  familyId,
  isAdmin,
  currentUserId,
}) => {
  const { theme } = useTheme();
  const styles = createJoinRequestsStyles(theme);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [familyId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await getJoinRequests(familyId);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading join requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = useCallback(
    async (request: JoinRequest) => {
      if (!isAdmin) {
        Alert.alert('Permission Denied', 'Only admins can approve join requests.');
        return;
      }

      Alert.alert(
        'Approve Request',
        `Approve ${request.requestedBy} to join the family?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve',
            style: 'default',
            onPress: async () => {
              try {
                await approveJoinRequest(familyId, request.requestId, currentUserId);
                await loadRequests();
              } catch (error) {
                Alert.alert('Error', error instanceof Error ? error.message : 'Failed to approve request');
              }
            },
          },
        ],
      );
    },
    [familyId, isAdmin, currentUserId],
  );

  const handleReject = useCallback(
    async (request: JoinRequest) => {
      if (!isAdmin) {
        Alert.alert('Permission Denied', 'Only admins can reject join requests.');
        return;
      }

      Alert.alert(
        'Reject Request',
        `Reject ${request.requestedBy}'s request to join the family?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              try {
                await rejectJoinRequest(familyId, request.requestId);
                await loadRequests();
              } catch (error) {
                Alert.alert('Error', error instanceof Error ? error.message : 'Failed to reject request');
              }
            },
          },
        ],
      );
    },
    [familyId, isAdmin],
  );

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <UserPlus size={48} color={theme.colors.textSecondary} />
          <ThemedText variant="md" color="textSecondary" style={styles.emptyText}>
            Only admins can view join requests
          </ThemedText>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText variant="md" color="textSecondary">
          Loading join requests...
        </ThemedText>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <UserPlus size={48} color={theme.colors.textSecondary} />
          <ThemedText variant="md" color="textSecondary" style={styles.emptyText}>
            No pending join requests
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {requests.map((request) => (
        <View key={request.requestId} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestAvatar}>
              <User size={24} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.requestInfo}>
              <ThemedText variant="md" weight="semiBold">
                {request.requestedBy}
              </ThemedText>
              <View style={styles.requestMeta}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <ThemedText variant="xs" color="textSecondary">
                  {formatDate(request.createdAt)}
                </ThemedText>
              </View>
              <ThemedText variant="xs" color="textSecondary">
                Invite Code: {request.inviteCode}
              </ThemedText>
            </View>
          </View>
          <View style={styles.requestActions}>
            <Pressable
              style={styles.rejectButton}
              onPress={() => handleReject(request)}
            >
              <X size={16} color={theme.colors.textInverse} />
              <ThemedText variant="sm" weight="medium" style={{ color: theme.colors.textInverse }}>
                Reject
              </ThemedText>
            </Pressable>
            <Pressable
              style={styles.approveButton}
              onPress={() => handleApprove(request)}
            >
              <Check size={16} color={theme.colors.textInverse} />
              <ThemedText variant="sm" weight="medium" style={{ color: theme.colors.textInverse }}>
                Approve
              </ThemedText>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
