import type { VaultItemType, VaultVisibility } from '@/domain';

export interface CreateVaultItemInput {
  ownerUserId: string;
  familyId?: string;
  visibility: VaultVisibility;
  type: VaultItemType;
  title: string;
  data: Record<string, unknown>;
  secure?: boolean;
}
