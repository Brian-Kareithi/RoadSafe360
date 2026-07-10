import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBHkqVST88k1Ojdx_96QWbnjky3-xnwBF8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'roadsafe360-95d87.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'roadsafe360-95d87',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'roadsafe360-95d87.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '64803316056',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:64803316056:web:5814a4f41f6b467123452d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const staff = [
  { email: 'zaahid@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', displayName: 'Zaahid Abdulmalik' },
  { email: 'zaahid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Zaahid Abdulmalik' },
  { email: 'khalid@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', displayName: 'Khalid Salad' },
  { email: 'aisha@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Aisha Abubakar' },
  { email: 'naila@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Naila Amour' },
  { email: 'rania@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Rania Bahlewa' },
  { email: 'zeitun@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Zeitun Hussein' },
  { email: 'reyhan@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Reyhan Fuad' },
  { email: 'turq@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Turq Mahamud' },
  { email: 'fenz@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Fenz Abdisalam' },
  { email: 'umulkheir@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'UmulKheir Aden' },
  { email: 'mohammed@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Mohammed Karshe' },
  { email: 'faizaan@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Faizaan Mohammed' },
  { email: 'adnan@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Adnan Ali' },
  { email: 'abdulhameed@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Abdulhameed Saleh' },
];

const policeOfficers = [
  { badgeNumber: 'POL-001', name: 'Aisha Abubakar', email: 'aisha@roadsafe360.go.ke', region: 'Nairobi', assignedStation: 'Central Police Station' },
  { badgeNumber: 'POL-002', name: 'Naila Amour', email: 'naila@roadsafe360.go.ke', region: 'Mombasa', assignedStation: 'Mombasa Traffic Base' },
  { badgeNumber: 'POL-003', name: 'Rania Bahlewa', email: 'rania@roadsafe360.go.ke', region: 'Kisumu', assignedStation: 'Kisumu Police Station' },
  { badgeNumber: 'POL-004', name: 'Zeitun Hussein', email: 'zeitun@roadsafe360.go.ke', region: 'Nakuru', assignedStation: 'Nakuru Traffic Office' },
  { badgeNumber: 'POL-005', name: 'Reyhan Fuad', email: 'reyhan@roadsafe360.go.ke', region: 'Eldoret', assignedStation: 'Eldoret Police Base' },
  { badgeNumber: 'POL-006', name: 'Turq Mahamud', email: 'turq@roadsafe360.go.ke', region: 'Thika', assignedStation: 'Thika Traffic Unit' },
  { badgeNumber: 'POL-007', name: 'Fenz Abdisalam', email: 'fenz@roadsafe360.go.ke', region: 'Machakos', assignedStation: 'Machakos Police Station' },
  { badgeNumber: 'POL-008', name: 'UmulKheir Aden', email: 'umulkheir@roadsafe360.go.ke', region: 'Nyeri', assignedStation: 'Nyeri Traffic Base' },
  { badgeNumber: 'POL-009', name: 'Mohammed Karshe', email: 'mohammed@roadsafe360.go.ke', region: 'Nairobi', assignedStation: 'Kilimani Police Station' },
  { badgeNumber: 'POL-010', name: 'Faizaan Mohammed', email: 'faizaan@roadsafe360.go.ke', region: 'Mombasa', assignedStation: 'Nyali Traffic Office' },
  { badgeNumber: 'POL-011', name: 'Adnan Ali', email: 'adnan@roadsafe360.go.ke', region: 'Kisumu', assignedStation: 'Kisumu Traffic Base' },
  { badgeNumber: 'POL-012', name: 'Abdulhameed Saleh', email: 'abdulhameed@roadsafe360.go.ke', region: 'Nairobi', assignedStation: 'CBD Traffic Office' },
];

const offenceCategories = [
  { code: 'SPD-01', name: 'Speeding (Excess)', description: 'Exceeding posted speed limit by more than 20 km/h', fineAmount: 10000, demeritPoints: 6, severity: 'serious', courtRequired: false },
  { code: 'SPD-02', name: 'Speeding (Minor)', description: 'Exceeding posted speed limit by less than 20 km/h', fineAmount: 5000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
  { code: 'DUI-01', name: 'Driving Under Influence', description: 'Operating a vehicle under influence of alcohol or drugs', fineAmount: 100000, demeritPoints: 10, severity: 'serious', courtRequired: true },
  { code: 'RDL-01', name: 'Reckless Driving', description: 'Driving without due care and attention', fineAmount: 30000, demeritPoints: 8, severity: 'serious', courtRequired: true },
  { code: 'NLD-01', name: 'No Licence', description: 'Driving without a valid driver licence', fineAmount: 20000, demeritPoints: 4, severity: 'moderate', courtRequired: false },
  { code: 'NIN-01', name: 'No Insurance', description: 'Operating uninsured vehicle on public road', fineAmount: 25000, demeritPoints: 4, severity: 'moderate', courtRequired: false },
  { code: 'TSG-01', name: 'Texting While Driving', description: 'Using mobile phone while operating a vehicle', fineAmount: 5000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
  { code: 'SNL-01', name: 'No Seatbelt', description: 'Driver or passenger not wearing seatbelt', fineAmount: 2000, demeritPoints: 1, severity: 'minor', courtRequired: false },
  { code: 'RTL-01', name: 'Running Red Light', description: 'Failing to stop at red traffic signal', fineAmount: 8000, demeritPoints: 4, severity: 'moderate', courtRequired: false },
  { code: 'OVL-01', name: 'Overloading', description: 'Vehicle carrying excess passengers or load', fineAmount: 15000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
  { code: 'PRK-01', name: 'Illegal Parking', description: 'Parking in prohibited zone', fineAmount: 1500, demeritPoints: 1, severity: 'minor', courtRequired: false },
  { code: 'HLM-01', name: 'Illegal Modification', description: 'Operating vehicle with illegal modifications', fineAmount: 10000, demeritPoints: 2, severity: 'minor', courtRequired: false },
  { code: 'EXC-01', name: 'Excess Passengers (Matatu/Nganya)', description: 'Carrying excess passengers in a matatu or nganya — 3 points per excess passenger', fineAmount: 5000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
  { code: 'HNG-01', name: 'Hanging Outside (Matatu/Nganya)', description: 'Passengers hanging outside a moving matatu or nganya', fineAmount: 3000, demeritPoints: 3, severity: 'moderate', courtRequired: false },
];

const settings = [
  { key: 'demerit_safe_threshold', value: '15', description: 'Minimum points for Safe status' },
  { key: 'demerit_warning_threshold', value: '10', description: 'Minimum points for Warning status' },
  { key: 'demerit_final_warning_threshold', value: '5', description: 'Minimum points for Final Warning status' },
  { key: 'demerit_suspension_review_threshold', value: '1', description: 'Minimum points for Suspension Review status' },
  { key: 'demerit_max_points', value: '20', description: 'Starting demerit points' },
  { key: 'suspension_first_duration', value: '3', description: 'First suspension duration in months' },
  { key: 'suspension_second_duration', value: '6', description: 'Second suspension duration in months' },
  { key: 'suspension_third_action', value: 'revoked', description: 'Action after third suspension' },
  { key: 'appeal_review_days', value: '14', description: 'Days to review an appeal' },
  { key: 'licence_renewal_reminder_days', value: '30', description: 'Days before expiry to send reminder' },
];

const regions = [
  { name: 'Nairobi', code: 'NRB', officerCount: 45, driverCount: 125000, offenceCount: 12340, stations: 12 },
  { name: 'Mombasa', code: 'MSA', officerCount: 28, driverCount: 68000, offenceCount: 7890, stations: 8 },
  { name: 'Kisumu', code: 'KSM', officerCount: 15, driverCount: 42000, offenceCount: 4560, stations: 5 },
  { name: 'Nakuru', code: 'NKR', officerCount: 12, driverCount: 38000, offenceCount: 3890, stations: 4 },
  { name: 'Eldoret', code: 'ELD', officerCount: 10, driverCount: 31000, offenceCount: 2980, stations: 4 },
  { name: 'Thika', code: 'THK', officerCount: 8, driverCount: 28000, offenceCount: 2340, stations: 3 },
  { name: 'Machakos', code: 'MKS', officerCount: 7, driverCount: 22000, offenceCount: 1870, stations: 3 },
  { name: 'Nyeri', code: 'NYR', officerCount: 6, driverCount: 18000, offenceCount: 1560, stations: 2 },
];

async function createOrUpdateAuthUser(email: string, password: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('  ~ ' + email + ' already exists, signing in to update profile');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user.uid;
    }
    throw err;
  }
}

async function seed() {
  console.log('Seeding RoadSafe360 with staff accounts and system data...\n');

  console.log('--- Auth Users (Staff) ---');
  const uidMap: Record<string, string> = {};
  for (const s of staff) {
    try {
      const uid = await createOrUpdateAuthUser(s.email, s.password);
      await setDoc(doc(db, 'users', uid), {
        uid, email: s.email, role: s.role, displayName: s.displayName,
      });
      uidMap[s.email] = uid;
      console.log('  ' + s.displayName + ' (' + s.email + ') - ' + s.role);
    } catch (err: any) {
      console.log('  Failed to create ' + s.email + ': ' + err.message);
    }
  }

  console.log('\n--- Zaahid Driver Profile (Most Mischievous) ---');
  const zaahidDriver = {
    nationalID: '99999999',
    fullName: 'Zaahid Abdulmalik',
    phoneNumber: '+254712345600',
    email: 'zaahid.driver@roadsafe360.go.ke',
    bloodGroup: 'O-',
    emergencyContact: '+254712345601',
    pointsBalance: 0,
    status: 'suspended',
    riskScore: 0.99,
  };
  const driverRef = await addDoc(collection(db, 'drivers'), {
    ...zaahidDriver,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await addDoc(collection(db, 'licences'), {
    licenceNumber: 'K999999',
    licenceClass: 'B',
    issueDate: '2022-06-15',
    expiryDate: '2024-06-15',
    status: 'suspended',
    driverId: driverRef.id,
    vehicleCategories: ['Private', 'Motorcycle'],
    endorsements: [],
    createdAt: new Date().toISOString(),
  });
  console.log('  Zaahid Abdulmalik (99999999) - 0/20 pts - SUSPENDED - Risk: 99%');

  const driverUid = uidMap['zaahid.driver@roadsafe360.go.ke'];
  if (driverUid) {
    await setDoc(doc(db, 'users', driverUid), {
      profileId: driverRef.id,
    }, { merge: true });
  }

  console.log('\n--- Police Officers ---');
  for (const o of policeOfficers) {
    const officerRef = await addDoc(collection(db, 'policeOfficers'), { ...o, createdAt: new Date().toISOString() });
    const userUid = uidMap[o.email];
    if (userUid) {
      await setDoc(doc(db, 'users', userUid), { profileId: officerRef.id }, { merge: true });
    }
    console.log('  ' + o.name + ' (' + o.badgeNumber + ') - ' + o.region);
  }

  console.log('\n--- Offence Categories ---');
  for (const oc of offenceCategories) {
    await addDoc(collection(db, 'offenceCategories'), oc);
    console.log('  ' + oc.code + ' - ' + oc.name + ' (' + oc.demeritPoints + ' pts)');
  }

  console.log('\n--- System Settings ---');
  for (const s of settings) {
    await addDoc(collection(db, 'settings'), s);
  }
  console.log('  System settings configured');

  console.log('\n--- Regions ---');
  for (const r of regions) {
    await addDoc(collection(db, 'regions'), r);
  }
  console.log('  8 regions registered');

  await auth.signOut();

  console.log('\nSeeding complete!');
  console.log('Zaahid Abdulmalik is both admin and the most mischievous driver (suspended, 0 pts, 99% risk).');
  console.log('No mock data. All data is stored in Firebase Firestore.\n');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
