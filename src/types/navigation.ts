export type RootTabParamList = {
  Home: undefined;
  Vault: undefined;
  Family: undefined;
  Calendar: undefined;
  Profile: undefined;
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
};

export type RootStackParamList = ModuleStackParamList;
export type ModuleRouteName = Exclude<keyof RootTabParamList, 'Home'>;
export type RouteName = keyof RootTabParamList;
