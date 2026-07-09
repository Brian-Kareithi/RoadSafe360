import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { OffenceRecord, OffenceCategory } from '@/types';

export async function createOffence(data: Omit<OffenceRecord, 'id'>) {
  const docRef = await addDoc(collection(db, 'offences'), { ...data, timestamp: Timestamp.now().toDate().toISOString() });
  return docRef;
}

export async function getOffencesByDriver(driverId: string) {
  const q = query(collection(db, 'offences'), where('driverId', '==', driverId), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as OffenceRecord));
}

export async function getOffenceCategories() {
  const snap = await getDocs(collection(db, 'offenceCategories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as OffenceCategory));
}