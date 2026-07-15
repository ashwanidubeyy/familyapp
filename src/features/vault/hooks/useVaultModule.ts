import { useEffect, useMemo, useState } from 'react';

import type { VaultVisibility } from '@/domain';
import { useAuth } from '@/features/auth';

import { vaultStaticData } from '../data/vaultStaticData';
import { masterDataService } from '../services/masterDataService';
import type {
  MasterDataOption,
  VaultDocument,
} from '../types';

interface VaultMasterData {
  documentCategories: MasterDataOption[];
  billCategories: MasterDataOption[];
  maintenanceCategories: MasterDataOption[];
  passwordCategories: MasterDataOption[];
}

interface UseVaultModuleResult {
  visibility: VaultVisibility;
  setVisibility: (visibility: VaultVisibility) => void;
  masterData: VaultMasterData;
  loadingMasterData: boolean;
  error: string | null;
  documents: VaultDocument[];
  staticData: typeof vaultStaticData;
  ownerId: string;
  familyId: string | null;
}

const emptyMasterData: VaultMasterData = {
  documentCategories: [],
  billCategories: [],
  maintenanceCategories: [],
  passwordCategories: [],
};

export const useVaultModule = (): UseVaultModuleResult => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState<VaultVisibility>('private');
  const [masterData, setMasterData] = useState<VaultMasterData>(emptyMasterData);
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ownerId = user?.uid ?? user?.id ?? 'demo-user';
  const familyId = user?.familyId ?? 'demo-family';

  useEffect(() => {
    setLoadingMasterData(true);
    setError(null);

    const unsubscriptions = [
      masterDataService.watchOptions(
        'document_categories',
        options => {
          setMasterData(current => ({ ...current, documentCategories: options }));
          setLoadingMasterData(false);
        },
        watchError => {
          setError(watchError.message);
          setLoadingMasterData(false);
        },
      ),
      masterDataService.watchOptions(
        'bill_categories',
        options => {
          setMasterData(current => ({ ...current, billCategories: options }));
        },
        watchError => setError(watchError.message),
      ),
      masterDataService.watchOptions(
        'maintenance_categories',
        options => {
          setMasterData(current => ({ ...current, maintenanceCategories: options }));
        },
        watchError => setError(watchError.message),
      ),
      masterDataService.watchOptions(
        'password_categories',
        options => {
          setMasterData(current => ({ ...current, passwordCategories: options }));
        },
        watchError => setError(watchError.message),
      ),
    ];

    return () => {
      unsubscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const documents = useMemo(() => {
    return vaultStaticData.documents.filter(document => {
      if (visibility === 'private') {
        return document.visibility === 'private';
      }

      return document.visibility === 'public';
    });
  }, [visibility]);

  return {
    visibility,
    setVisibility,
    masterData,
    loadingMasterData,
    error,
    documents,
    staticData: vaultStaticData,
    ownerId,
    familyId,
  };
};
