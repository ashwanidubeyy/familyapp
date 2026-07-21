export type RootTabParamList = {
  Home: undefined;
  Vault: undefined;
  Family: undefined;
  Calendar: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Auth: undefined;
  FamilySetup: undefined;
  Dashboard: undefined;
  AppLock: undefined;
};

export type VaultStackParamList = {
  VaultHome: undefined;
  DocumentList: { categoryId: string; categoryName: string };
  DocumentDetails: { documentId: string; source: 'private' | 'public' };
  PasswordList: undefined;
  PasswordDetails: { passwordId: string; source: 'private' | 'public' };
  FinanceDashboard: undefined;
  TransactionDetails: { transactionId: string; source: 'private' | 'public' };
  MaintenanceList: { categoryId?: string; categoryName?: string };
  MaintenanceDetails: { applianceId: string; applianceName: string };
  AddDocument: { categoryId?: string; categoryName?: string } | undefined;
  AddPassword: undefined;
  AddTransaction: undefined;
};

export interface ModuleDetailParams {
  title: string;
  summary: string;
  parentTitle: string;
}

export type ModuleStackParamList = {
  ModuleHome: undefined;

  ModuleDetail: {
    title: string;
    summary: string;
    parentTitle: string;
  };

  FamilyQRCode: {
    familyName: string;
    inviteCode: string;
    size: number;
  };
};

export type RootStackParamList = AppStackParamList &
  RootTabParamList &
  ModuleStackParamList;

export type ModuleRouteName = Exclude<keyof RootTabParamList, "Home">;
export type RouteName = keyof RootTabParamList;
