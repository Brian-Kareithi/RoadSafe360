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
  apiKey: 'AIzaSyBHkqVST88k1Ojdx_96QWbnjky3-xnwBF8',
  authDomain: 'roadsafe360-95d87.firebaseapp.com',
  projectId: 'roadsafe360-95d87',
  storageBucket: 'roadsafe360-95d87.firebasestorage.app',
  messagingSenderId: '64803316056',
  appId: '1:64803316056:web:5814a4f41f6b467123452d',
  measurementId: 'G-41EBGVFB9N',
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
