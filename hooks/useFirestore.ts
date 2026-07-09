'use client';
import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, getDoc, addDoc, updateDoc, deleteDoc, type QueryConstraint, type DocumentData } from 'firebase/firestore';
import { db } from '@/firebase/config';

export function useCollection<T = DocumentData>(collectionName: string, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = constraints.length ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName);
    const unsub = onSnapshot(q,
      (snap) => { setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T))); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [collectionName]);

  return { data, loading, error };
}

export function useDocument<T>(collectionName: string, docId: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, collectionName, docId), (snap) => {
      setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null);
      setLoading(false);
    });
    return unsub;
  }, [collectionName, docId]);

  return { data, loading };
}

export async function addDocument(collectionName: string, data: DocumentData) {
  return addDoc(collection(db, collectionName), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

export async function updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>) {
  return updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteDocument(collectionName: string, docId: string) {
  return deleteDoc(doc(db, collectionName, docId));
}

export async function getDocument<T>(collectionName: string, docId: string) {
  const snap = await getDoc(doc(db, collectionName, docId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}