export type JoinRequestStatus = 'pending' | 'approved' | 'declined';
export type UserStatus = 'active' | 'pendingFamily' | 'declined';
export type MemberStatus = 'pending' | 'approved' | 'declined';
export type OwnerType = 'member' | 'dependent';

export type VaultVisibility = 'private' | 'public';

export type VaultItemType =
  | 'document'
  | 'property'
  | 'finance'
  | 'secure'
  | 'password'
  | 'vehicle'
  | 'health'
  | 'pet';

export type ReminderSourceType = 'vaultItem' | 'familyMember' | 'manual';
export type HealthEntryType = 'medicine' | 'expense' | 'doctorVisit' | 'prescriptionDoc';

export interface UserProfile {
  id: string;
  familyId: string | null;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  relation?: string;
  authProviders: string[];
  pinHash?: string | null;
  biometricEnabled: boolean;
  photoURL?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  name: string;
  adminCount: number;
  memberCount: number;
  inviteCode: string;
  inviteCodeExpiresAt?: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
}

export interface FamilyMember {
  userId: string;
  name: string;
  photoURL?: string | null;
  dob?: string;
  relation?: string;
  isAdmin: boolean;
  status: MemberStatus;
  joinedAt: string;
}

export interface Dependent {
  id: string;
  name: string;
  dob?: string;
  photoURL?: string | null;
  relation: string;
  addedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  dob?: string;
  photoURL?: string | null;
  healthNotes?: string;
  addedBy: string;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  familyId: string;
  requestingUserId: string;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VaultItem {
  id: string;
  ownerUserId: string;
  familyId: string | null;
  visibility: VaultVisibility;
  type: VaultItemType;
  title: string;
  data: Record<string, unknown>;
  secure: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface EmergencyInfo {
  ownerId: string;
  ownerType: OwnerType;
  bloodGroup?: string;
  allergies: string[];
  conditions: string[];
  emergencyContacts: EmergencyContact[];
}

export interface Reminder {
  id: string;
  familyId?: string;
  userId?: string;
  sourceType: ReminderSourceType;
  sourceId?: string;
  title: string;
  dueDate: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordEntry {
  id: string;
  ownerId: string;
  ownerType: OwnerType;
  entryType: HealthEntryType;
  title: string;
  notes?: string;
  date: string;
  attachmentURL?: string | null;
  familyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  familyId: string;
  authorId: string;
  text: string;
  isUrgent?: boolean;
  createdAt: string;
  updatedAt: string;
}
