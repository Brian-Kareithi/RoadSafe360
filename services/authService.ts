import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { AppUser, UserRole } from '@/types';

export function onAuthChange(cb: (user: User | null) => void) { return onAuthStateChanged(auth, cb); }

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string, role: UserRole, profile: Record<string, any>) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, email, role, displayName: profile.displayName || '', profileId: '', ...profile });
  return cred;
}

export async function logout() { return signOut(auth); }

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}