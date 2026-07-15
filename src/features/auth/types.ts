import type { UserProfile } from '@/domain';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  dob: string;
  phone: string;
  password: string;
  address: string;
}

export interface FamilySetupResult {
  user: UserProfile;
  familyId: string;
}

export interface AuthContextValue {
  user: UserProfile | null;
  initializing: boolean;
  loading: boolean;
  login(credentials: LoginCredentials): Promise<void>;
  signup(payload: SignupPayload): Promise<void>;
  createFamily(name: string): Promise<void>;
  joinFamily(inviteCode: string): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  refreshUser(): Promise<void>;
}
