import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import type { Functions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyACqMt6je_xYLwYkVisztg_-YIwnXbq6Ls',
  authDomain: 'life350-bc2d4.firebaseapp.com',
  projectId: 'life350-bc2d4',
  storageBucket: 'life350-bc2d4.firebasestorage.app',
  messagingSenderId: '928575287733',
  appId: '1:928575287733:web:2d2492da360824e9aa69fc',
  measurementId: 'G-8G1LH3TMY8',
};

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;
let _functions: Functions | undefined;

if (typeof window !== 'undefined') {
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _storage = getStorage(_app);
  _functions = getFunctions(_app);
}

export const app = _app!;
export const auth = _auth!;
export const db = _db!;
export const storage = _storage!;
export const functions = _functions!;
