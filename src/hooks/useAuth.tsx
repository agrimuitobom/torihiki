import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result when returning from Google login
    getRedirectResult(auth).catch(() => {});

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithRedirect(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return { user, loading, signInWithGoogle, signOut };
};
