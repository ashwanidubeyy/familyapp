import type { UserProfile } from '@/domain';

export interface AuthRepository {
  getCurrentUser(): Promise<UserProfile | null>;
  signInWithEmail(email: string, password: string): Promise<UserProfile>;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
}
