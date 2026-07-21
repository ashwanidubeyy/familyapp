import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable, Alert, Image } from 'react-native';
import { User, Shield, MoreVertical, Crown, Phone, Mail, MapPin } from 'lucide-react-native';

import { ThemedText } from '@/components';
import { useTheme } from '@/hooks';
import { FamilyMember } from '../types/familyTypes';
import {
  getAllMembers,
  toggleAdminRole,
  removeMember,
} from '../services/familyService';

import { createMembersListStyles } from './styles';

interface MembersListProps {
  familyId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export const MembersList: React.FC<MembersListProps> = ({
  familyId,
  currentUserId,
  isAdmin,
}) => {
  const { theme } = useTheme();
  const styles = createMembersListStyles(theme);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [familyId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const membersData = await getAllMembers(familyId);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = useCallback(
    async (member: FamilyMember) => {
      if (!isAdmin) {
        Alert.alert('Permission Denied', 'Only admins can change member roles.');
        return;
      }

      if (member.userId === currentUserId) {
        Alert.alert('Cannot Change', 'You cannot change your own admin status.');
        return;
      }

      Alert.alert(
        'Change Admin Role',
        `${member.isAdmin ? 'Remove admin rights from' : 'Make'} ${member.name} ${member.isAdmin ? 'a regular member' : 'an admin'}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: member.isAdmin ? 'Remove' : 'Make Admin',
            style: member.isAdmin ? 'destructive' : 'default',
            onPress: async () => {
              try {
                await toggleAdminRole(familyId, member.userId, !member.isAdmin);
                await loadMembers();
              } catch (error) {
                Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update role');
              }
            },
          },
        ],
      );
    },
    [familyId, isAdmin, currentUserId],
  );

  const handleRemoveMember = useCallback(
    async (member: FamilyMember) => {
      if (!isAdmin) {
        Alert.alert('Permission Denied', 'Only admins can remove members.');
        return;
      }

      if (member.userId === currentUserId) {
        Alert.alert('Cannot Remove', 'You cannot remove yourself from the family.');
        return;
      }

      Alert.alert(
        'Remove Member',
        `Are you sure you want to remove ${member.name} from the family?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                await removeMember(familyId, member.userId);
                await loadMembers();
              } catch (error) {
                Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove member');
              }
            },
          },
        ],
      );
    },
    [familyId, isAdmin, currentUserId],
  );

  const handleMemberPress = useCallback((member: FamilyMember) => {
    Alert.alert(member.name, `${member.relation || 'Family Member'}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'View Profile',
        onPress: () => console.log('View profile:', member.userId),
      },
    ]);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText variant="md" color="textSecondary">
          Loading members...
        </ThemedText>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <User size={48} color={theme.colors.textSecondary} />
        <ThemedText variant="md" color="textSecondary" style={styles.emptyText}>
          No members yet
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {members.map((member) => (
        <Pressable
          key={member.userId}
          style={({ pressed }) => [styles.memberCard, pressed && styles.memberCardPressed]}
          onPress={() => handleMemberPress(member)}
        >
          <View style={styles.memberHeader}>
            <View style={styles.avatarContainer}>
              {member.profileImage ? (
                <Image source={{ uri: member.profileImage }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <User size={24} color={theme.colors.textSecondary} />
                </View>
              )}
              {member.isAdmin && (
                <View style={styles.adminBadge}>
                  <Crown size={12} color={theme.colors.textInverse} />
                </View>
              )}
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.memberNameRow}>
                <ThemedText variant="md" weight="semiBold">
                  {member.name}
                </ThemedText>
                {member.isAdmin && (
                  <View style={styles.adminTag}>
                    <Shield size={12} color={theme.colors.primary} />
                    <ThemedText variant="xs" weight="medium" color="primary">
                      Admin
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText variant="sm" color="textSecondary">
                {member.relation || 'Family Member'}
              </ThemedText>
            </View>
            {isAdmin && member.userId !== currentUserId && (
              <Pressable
                style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
                onPress={() => handleToggleAdmin(member)}
              >
                <MoreVertical size={20} color={theme.colors.textSecondary} />
              </Pressable>
            )}
          </View>
          <View style={styles.memberDetails}>
            {member.phone && (
              <View style={styles.detailRow}>
                <Phone size={14} color={theme.colors.textSecondary} />
                <ThemedText variant="sm" color="textSecondary">
                  {member.phone}
                </ThemedText>
              </View>
            )}
            {member.email && (
              <View style={styles.detailRow}>
                <Mail size={14} color={theme.colors.textSecondary} />
                <ThemedText variant="sm" color="textSecondary">
                  {member.email}
                </ThemedText>
              </View>
            )}
            {member.address && (
              <View style={styles.detailRow}>
                <MapPin size={14} color={theme.colors.textSecondary} />
                <ThemedText variant="sm" color="textSecondary" numberOfLines={1}>
                  {member.address}
                </ThemedText>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};
