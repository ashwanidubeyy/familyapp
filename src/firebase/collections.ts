export const FIREBASE_COLLECTIONS = {
  users: 'users',
  families: 'families',
  members: 'members',
  dependents: 'dependents',
  pets: 'pets',
  joinRequests: 'joinRequests',
  announcements: 'announcements',
  publicVault: 'publicVault',
  documents: 'documents',
  properties: 'properties',
  maintenanceLog: 'maintenanceLog',
  finance: 'finance',
  history: 'history',
  passwords: 'passwords',
  privateVault: 'privateVault',
  healthRecords: 'healthRecords',
  entries: 'entries',
  emergencyInfo: 'emergencyInfo',
  contacts: 'contacts',
  calendarEvents: 'calendarEvents',
  reminders: 'reminders',
  notifications: 'notifications',
} as const;

type FamilyCollection =
  | 'members'
  | 'dependents'
  | 'pets'
  | 'joinRequests'
  | 'announcements'
  | 'contacts'
  | 'calendarEvents'
  | 'reminders';

type PublicVaultCollection = 'documents' | 'properties' | 'finance' | 'passwords';

export const familyScopedPath = (familyId: string, collection: FamilyCollection): string => {
  return `${FIREBASE_COLLECTIONS.families}/${familyId}/${FIREBASE_COLLECTIONS[collection]}`;
};

export const publicVaultPath = (
  familyId: string,
  collection: PublicVaultCollection,
): string => {
  return `${FIREBASE_COLLECTIONS.families}/${familyId}/${FIREBASE_COLLECTIONS.publicVault}/${FIREBASE_COLLECTIONS[collection]}`;
};

export const propertyMaintenancePath = (familyId: string, propertyId: string): string => {
  return `${publicVaultPath(familyId, 'properties')}/${propertyId}/${FIREBASE_COLLECTIONS.maintenanceLog}`;
};

export const financeHistoryPath = (familyId: string, entryId: string): string => {
  return `${publicVaultPath(familyId, 'finance')}/${entryId}/${FIREBASE_COLLECTIONS.history}`;
};

export const userPrivateVaultPath = (userId: string): string => {
  return `${FIREBASE_COLLECTIONS.users}/${userId}/${FIREBASE_COLLECTIONS.privateVault}`;
};

export const healthRecordEntriesPath = (familyId: string, ownerId: string): string => {
  return `${FIREBASE_COLLECTIONS.families}/${familyId}/${FIREBASE_COLLECTIONS.healthRecords}/${ownerId}/${FIREBASE_COLLECTIONS.entries}`;
};

export const emergencyInfoPath = (familyId: string, ownerId: string): string => {
  return `${FIREBASE_COLLECTIONS.families}/${familyId}/${FIREBASE_COLLECTIONS.emergencyInfo}/${ownerId}`;
};

export const userNotificationsPath = (userId: string): string => {
  return `${FIREBASE_COLLECTIONS.users}/${userId}/${FIREBASE_COLLECTIONS.notifications}`;
};
