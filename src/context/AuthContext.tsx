import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        setLoading(true);
        setUser(currUser);
        try {
          const userDocRef = doc(db, 'users', currUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setAppUser({ uid: currUser.uid, ...docSnap.data() } as AppUser);
          } else {
            // New user, defaults to 'student' natively as per rules
            const newUserData = {
              email: currUser.email || '',
              fullName: currUser.displayName || 'Anonymous Student',
              role: 'student' as UserRole,
              createdAt: Date.now()
            };
            await setDoc(userDocRef, newUserData).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${currUser.uid}`));
            setAppUser({ uid: currUser.uid, ...newUserData } as AppUser);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currUser.uid}`);
          await firebaseSignOut(auth);
          setUser(null);
          setAppUser(null);
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
