import type { LucideIcon } from 'lucide-react-native';
import {
  Building2,
  Calculator,
  Car,
  Clock,
  FileArchive,
  FileImage,
  FileText,
  Flame,
  Folder,
  KeyRound,
  Landmark,
  Lock,
  Package,
  ReceiptText,
  Shield,
  SprayCan,
  WalletCards,
  Wifi,
  Wrench,
} from 'lucide-react-native';

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Calculator,
  Car,
  Clock,
  FileArchive,
  FileImage,
  FileText,
  Flame,
  Folder,
  KeyRound,
  Landmark,
  Lock,
  Package,
  ReceiptText,
  Shield,
  SprayCan,
  WalletCards,
  Wifi,
  Wrench,
};

export const getVaultIcon = (iconName: string): LucideIcon => {
  if (!iconName) {
    return Folder;
  }
  return ICONS[iconName] ?? Folder;
};
