import type { VaultItem } from '@/domain';
import type { CreateVaultItemInput } from '@/types';

export interface VaultRepository {
  createItem(input: CreateVaultItemInput): Promise<VaultItem>;
  updateItem(item: VaultItem): Promise<void>;
  movePrivateItemToPublic(itemId: string, familyId: string): Promise<void>;
  markFinanceItemPaid(itemId: string, paidAmount?: number): Promise<void>;
  watchPrivateVault(userId: string, onChange: (items: VaultItem[]) => void): () => void;
  watchPublicVault(familyId: string, onChange: (items: VaultItem[]) => void): () => void;
}
