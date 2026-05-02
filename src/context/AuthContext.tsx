import { Provider } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, OAuthProvider } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin';

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  activeRoles: UserRole[];
  setActiveRoles: (roles: UserRole[]) => void;
  signIn: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  activeRoles: [],
  loading: true,
  setActiveRoles: () => {},
  signIn: async () => {},
  signInWithApple: async () => {},
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [activeRoles, setActiveRolesState] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync active roles with localStorage to persist selection
  useEffect(() => {
    const saved = localStorage.getItem('activeRoles');
    if (saved) {
      try {
        setActiveRolesState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse activeRoles from localStorage", e);
      }
    }
  }, []);

  const setActiveRoles = (roles: UserRole[]) => {
    setActiveRolesState(roles);
    localStorage.setItem('activeRoles', JSON.stringify(roles));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        try {
          const userDocRef = doc(db, 'users', currUser.uid);
          let docSnap = await getDoc(userDocRef);
          
          let data: any = null;

          if (!docSnap.exists() && currUser.email) {
            // Check for pre-registered user (ID is email with _ instead of .)
            const tempId = currUser.email.replace(/\./g, '_');
            const preRegDocRef = doc(db, 'users', tempId);
            const preRegSnap = await getDoc(preRegDocRef);
            
            if (preRegSnap.exists()) {
              data = preRegSnap.data();
              // Migrate to UID-based doc
              await setDoc(userDocRef, { ...data, uid: currUser.uid }, { merge: true });
              // Clean up pre-reg doc
              await deleteDoc(preRegDocRef);
              docSnap = await getDoc(userDocRef);
            }
          }

          if (docSnap.exists() || data) {
            if (!data) data = docSnap.data();
            
            let currentRoles: UserRole[] = data.roles || [];
            if (data.role && currentRoles.length === 0) {
              currentRoles = [data.role];
            }
            if (currentRoles.length === 0) currentRoles = ['student'];
            
            let needsUpdate = false;
            let updatePayload: any = {};

            if (!data.roles) {
              needsUpdate = true;
              updatePayload.roles = currentRoles;
            }

            // Always fix superadmin for DARO (as fallback/failsafe)
            if (currUser.email === 'dariolloshi2023@gmail.com' && !currentRoles.includes('superadmin')) {
               currentRoles.push('superadmin');
               needsUpdate = true;
               updatePayload.roles = currentRoles;
            }

            if (needsUpdate) {
               try {
                 await setDoc(userDocRef, updatePayload, { merge: true });
               } catch(err) {
                 handleFirestoreError(err, OperationType.UPDATE, `users/${currUser.uid}`);
               }
            }

            setAppUser({ uid: currUser.uid, ...data, roles: currentRoles } as AppUser);
            
            // Auto-initialize active roles if not set
            const saved = localStorage.getItem('activeRoles');
            if (!saved) {
              setActiveRoles(currentRoles);
            }
          } else {
            // New user (not pre-registered)
            const determinedRoles: UserRole[] = currUser.email === 'dariolloshi2023@gmail.com' ? ['superadmin'] : ['student'];
            const newUserData = {
              email: currUser.email || '',
              fullName: currUser.displayName || 'Anonymous Student',
              roles: determinedRoles,
              role: determinedRoles[0],
              createdAt: Date.now()
            };
            try {
              await setDoc(userDocRef, newUserData);
            } catch(err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${currUser.uid}`);
            }
            setAppUser({ uid: currUser.uid, ...newUserData } as AppUser);
            setActiveRoles(determinedRoles);
          }
        } catch (err: any) {
          if (err instanceof Error && err.message.includes('authInfo')) {
            throw err;
          }
          handleFirestoreError(err, OperationType.GET, `users/${currUser.uid}`);
        }
      } else {
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

  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, activeRoles, setActiveRoles, loading, signIn, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
