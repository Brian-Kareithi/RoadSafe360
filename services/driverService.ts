import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Driver } from '@/types';

export async function searchDrivers(term: string): Promise<Driver[]> {
  const collections = ['drivers'];
  const results: Driver[] = [];
  for (const col of collections) {
    const q = query(collection(db, col),
      where('fullName', '>=', term),
      where('fullName', '<=', term + '\uf8ff')
    );
    const snap = await getDocs(q);
    snap.forEach(d => results.push({ id: d.id, ...d.data() } as Driver));
  }
  return results;
}

export async function getDriverByLicence(licenceNumber: string): Promise<Driver | null> {
  const q = query(collection(db, 'drivers'), where('licenceNumber', '==', licenceNumber));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Driver;
}