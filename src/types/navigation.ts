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
