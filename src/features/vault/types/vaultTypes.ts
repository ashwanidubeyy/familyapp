import type { VaultVisibility } from '@/domain';

export type MasterDataCollection =
  | 'document_categories'
  | 'bill_categories'
  | 'maintenance_categories'
  | 'property_types'
  | 'vehicle_types'
  | 'expense_categories'
  | 'password_categories'
  | 'relationship_types'
  | 'reminder_types'
  | 'health_categories';

export interface MasterDataOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface VaultDocument {
  id: string;
  name?: string;
  title: string;
  description: string;
  category?: string;
  categoryId: string;
  categoryName: string;
  ownerId: string;
  familyId: string | null;
  visibility: VaultVisibility;
  vaultType?: VaultVisibility;
  propertyId?: string | null;
  assetId?: string | null;
  expiryDate?: string | null;
  reminderDate?: string | null;
  reminder?: string | null;
  fileUrl?: string | null;
  url?: string | null;
  fileId?: string | null;
  fileType?: string | null;
  size?: number | string | null;
  thumbnail?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  icon?:string;
  tags?: string[];
}

export type BillStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface FinanceBill {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: BillStatus;
  dueDate: string;
  notes?: string;
  createdBy: string;
  familyId: string | null;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  assetName: string;
  vendorName: string;
  vendorPhone: string;
  serviceDate: string;
  warrantyExpiry?: string | null;
  nextReminder?: string | null;
  invoiceUrl?: string | null;
  images: string[];
  notes?: string;
  costEstimate?: string;
}

export interface PasswordRecord {
  id: string;
  title?: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  categoryId: string;
  categoryName: string;
  visibility?: VaultVisibility;
  updatedAt: string;
  createdAt?: string;
}

export type TransactionType = 'income' | 'expense';

export interface VaultTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string;
  paymentMethod?: string;
  property?: string;
  description?: string;
  attachmentUrl?: string | null;
  recurring: boolean;
  reminder?: string | null;
  visibility: VaultVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceAppliance {
  id: string;
  name: string;
  icon: string;
}

export interface VaultFinanceSummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface VaultStaticData {
  documents: VaultDocument[];
  bills: FinanceBill[];
  maintenance: MaintenanceRecord[];
  passwords: PasswordRecord[];
  financeActions: VaultQuickAction[];
  maintenanceAppliances: MaintenanceAppliance[];
  financeSummary: VaultFinanceSummary;
  storageUsedGb: number;
  storageLimitGb: number;
}

export interface VaultQuickAction {
  id: string;
  title: string;
  icon: string;
  count?: number;
}

export interface CreateDocumentInput {
  title: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  ownerId: string;
  familyId?: string | null;
  visibility: VaultVisibility;
  fileUrl?: string | null;
  thumbnail?: string | null;
  expiryDate?: string | null;
  reminderDate?: string | null;
  propertyId?: string | null;
}

export interface UploadTarget {
  ownerId: string;
  familyId?: string | null;
  visibility: VaultVisibility;
  kind: 'documents' | 'images';
  fileName: string;
}

export interface UploadFileInput extends UploadTarget {
  localUri: string;
  fileType?: string | null;
  contentType?: string;
}

export interface VaultSectionState {
  loading: boolean;
  error: string | null;
}
