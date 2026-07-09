import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyACqMt6je_xYLwYkVisztg_-YIwnXbq6Ls',
  authDomain: 'life350-bc2d4.firebaseapp.com',
  projectId: 'life350-bc2d4',
  storageBucket: 'life350-bc2d4.firebasestorage.app',
  messagingSenderId: '928575287733',
  appId: '1:928575287733:web:2d2492da360824e9aa69fc',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

const newOffences = [
  { code: 'EXC-01', name: 'Excess Passengers (Matatu/Nganya)', description: 'Carrying excess passengers in a matatu or nganya — 3 points per excess passenger', fineAmount: 5000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
  { code: 'HNG-01', name: 'Hanging Outside (Matatu/Nganya)', description: 'Passengers hanging outside a moving matatu or nganya', fineAmount: 3000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
] as const;

async function addNewOffences() {
  console.log('Adding new matatu/nganya offence categories...\n');

  await signInWithEmailAndPassword(auth, 'admin@roadsafe360.go.ke', 'Admin123!');
  console.log('  ✓ Authenticated as admin\n');

  for (const oc of newOffences) {
    const q = query(collection(db, 'offenceCategories'), where('code', '==', oc.code));
    const snap = await getDocs(q);

    if (snap.empty) {
      await addDoc(collection(db, 'offenceCategories'), oc);
      console.log(`  ✓ Added ${oc.code} — ${oc.name}`);
    } else {
      console.log(`  ~ ${oc.code} already exists, skipping`);
    }
  }

  console.log('\nDone. You can now issue these offences from the app.');
}

addNewOffences().catch(console.error);
