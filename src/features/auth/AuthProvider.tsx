import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import auth from '@react-native-firebase/auth';

import type { UserProfile } from '@/domain';

import { firebaseAuthRepository } from './services/firebaseAuthRepository';
import type { AuthContextValue, LoginCredentials, SignupPayload } from './types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    const currentUser = await firebaseAuthRepository.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      try {
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        const currentUser = await firebaseAuthRepository.getCurrentUser();
        setUser(currentUser);
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const signedInUser = await firebaseAuthRepository.signInWithEmail(
        credentials.email,
        credentials.password,
      );
      setUser(signedInUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    setLoading(true);
    try {
      const createdUser = await firebaseAuthRepository.createAccount(payload);
      setUser(createdUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFamily = useCallback(
    async (name: string) => {
      if (!user) {
        throw new Error('You must be signed in to create a family.');
      }

      setLoading(true);
      try {
        const updatedUser = await firebaseAuthRepository.createFamily(name, user);
        setUser(updatedUser);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const joinFamily = useCallback(
    async (inviteCode: string) => {
      if (!user) {
        throw new Error('You must be signed in to join a family.');
      }

      setLoading(true);
      try {
        const updatedUser = await firebaseAuthRepository.requestToJoinFamily(
          inviteCode,
          user,
        );
        setUser(updatedUser);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    try {
      await firebaseAuthRepository.sendPasswordReset(email);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseAuthRepository.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      loading,
      login,
      signup,
      createFamily,
      joinFamily,
      sendPasswordReset,
      signOut,
      refreshUser,
    }),
    [
      user,
      initializing,
      loading,
      login,
      signup,
      createFamily,
      joinFamily,
      sendPasswordReset,
      signOut,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
