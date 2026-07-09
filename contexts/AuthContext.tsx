'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getUserProfile, logout as authLogout } from '@/services/authService';
import { type User } from 'firebase/auth';
import type { AppUser, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  role: UserRole | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, role: null, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p as AppUser | null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => { await authLogout(); setProfile(null); setUser(null); };

  return <AuthContext.Provider value={{ user, profile, loading, role: profile?.role || null, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);