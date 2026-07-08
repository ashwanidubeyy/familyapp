import type { Reminder, UserProfile, VaultItem } from '@/domain';

export interface SearchResultSet {
  vaultItems: VaultItem[];
  members: UserProfile[];
  reminders: Reminder[];
}
