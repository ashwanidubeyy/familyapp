import type { FamilyMember, HealthRecordEntry, UserProfile, VaultItem } from './models';

export const canReadVaultItem = (user: UserProfile, item: VaultItem): boolean => {
  if (item.visibility === 'private') {
    return item.ownerUserId === user.id;
  }

  return Boolean(user.familyId && item.familyId === user.familyId);
};

export const canWriteSharedFamilyData = (user: UserProfile, familyId: string): boolean => {
  return user.familyId === familyId && user.status === 'active';
};

export const canApproveJoinRequests = (member: FamilyMember): boolean => {
  return member.status === 'approved' && member.isAdmin;
};

export const canReadHealthEntry = (
  user: UserProfile,
  entry: HealthRecordEntry,
  familyId: string,
): boolean => {
  if (user.familyId !== familyId || user.status !== 'active') {
    return false;
  }

  return entry.ownerType === 'dependent' || entry.ownerId === user.id || entry.familyVisible;
};
