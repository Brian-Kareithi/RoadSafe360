import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyACqMt6je_xYLwYkVisztg_-YIwnXbq6Ls',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'life350-bc2d4.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'life350-bc2d4',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'life350-bc2d4.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '928575287733',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:928575287733:web:2d2492da360824e9aa69fc',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const quickLoginUsers = [
  { email: 'admin@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', displayName: 'Admin User' },
  { email: 'officer@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Insp. John Kimani' },
  { email: 'driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Brian Kareithi' },
  { email: 'authority@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', displayName: 'Authority User' },
];

async function createOrUpdateAuthUser(email: string, password: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`  ~ ${email} already exists, signing in to update profile`);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user.uid;
    }
    throw err;
  }
}

const kenyanDrivers = [
  { nationalID: '12345678', fullName: 'Brian Kareithi', phoneNumber: '+254712345678', email: 'brian.k@example.com', bloodGroup: 'O+', emergencyContact: '+254712345679', pointsBalance: 18, status: 'active', riskScore: 0.15 },
  { nationalID: '23456789', fullName: 'Grace Wanjiku', phoneNumber: '+254723456789', email: 'grace.w@example.com', bloodGroup: 'A+', emergencyContact: '+254723456780', pointsBalance: 12, status: 'active', riskScore: 0.35 },
  { nationalID: '34567890', fullName: 'Peter Kamau', phoneNumber: '+254734567890', email: 'peter.k@example.com', bloodGroup: 'B+', emergencyContact: '+254734567891', pointsBalance: 6, status: 'warning', riskScore: 0.65 },
  { nationalID: '45678901', fullName: 'Mary Akinyi', phoneNumber: '+254745678901', email: 'mary.a@example.com', bloodGroup: 'AB+', emergencyContact: '+254745678902', pointsBalance: 20, status: 'active', riskScore: 0.05 },
  { nationalID: '56789012', fullName: 'James Ochieng', phoneNumber: '+254756789012', email: 'james.o@example.com', bloodGroup: 'O-', emergencyContact: '+254756789013', pointsBalance: 3, status: 'suspension_review', riskScore: 0.82 },
  { nationalID: '67890123', fullName: 'Faith Nyambura', phoneNumber: '+254767890123', email: 'faith.n@example.com', bloodGroup: 'A-', emergencyContact: '+254767890124', pointsBalance: 0, status: 'suspended', riskScore: 0.95 },
  { nationalID: '78901234', fullName: 'Samuel Mutua', phoneNumber: '+254778901234', email: 'samuel.m@example.com', bloodGroup: 'B-', emergencyContact: '+254778901235', pointsBalance: 15, status: 'active', riskScore: 0.22 },
  { nationalID: '89012345', fullName: 'Diana Chebet', phoneNumber: '+254789012345', email: 'diana.c@example.com', bloodGroup: 'O+', emergencyContact: '+254789012346', pointsBalance: 9, status: 'warning', riskScore: 0.55 },
  { nationalID: '90123456', fullName: 'David Mwangi', phoneNumber: '+254790123456', email: 'david.m@example.com', bloodGroup: 'AB-', emergencyContact: '+254790123457', pointsBalance: 1, status: 'suspension_review', riskScore: 0.78 },
  { nationalID: '01234567', fullName: 'Sarah Wambui', phoneNumber: '+254701234567', email: 'sarah.w@example.com', bloodGroup: 'A+', emergencyContact: '+254701234568', pointsBalance: 16, status: 'active', riskScore: 0.18 },
];

const licenceClasses = ['A', 'B', 'C', 'D', 'E', 'G'];

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

async function seed() {
  console.log('🌱 Seeding RoadSafe360 with Kenyan data...\n');

  // ── PART 1: Firebase Auth Users (Quick Login) ──
  console.log('─── Auth Users ───');
  const driverUidMap: Record<string, string> = {};
  for (const u of quickLoginUsers) {
    try {
      const uid = await createOrUpdateAuthUser(u.email, u.password);
      await setDoc(doc(db, 'users', uid), {
        uid, email: u.email, role: u.role, displayName: u.displayName,
      });
      driverUidMap[u.role] = uid;
      console.log(`  ✓ ${u.displayName} (${u.email}) — role: ${u.role}`);
    } catch (err: any) {
      console.log(`  ✗ Failed to create ${u.email}: ${err.message}`);
    }
  }

  // ── PART 2: Drivers & Licences ──
  console.log('\n─── Drivers ───');
  const driverIdMap: Record<string, string> = {};
  for (const d of kenyanDrivers) {
    const driverRef = await addDoc(collection(db, 'drivers'), { ...d, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    driverIdMap[d.fullName] = driverRef.id;

    const licenceClass = licenceClasses[Math.floor(Math.random() * licenceClasses.length)];
    const licenceNumber = `K${String(Math.floor(100000 + Math.random() * 900000))}`;
    await addDoc(collection(db, 'licences'), {
      licenceNumber,
      licenceClass,
      issueDate: '2024-01-01',
      expiryDate: '2029-01-01',
      status: d.status === 'suspended' ? 'suspended' : 'active',
      driverId: driverRef.id,
      vehicleCategories: ['Private'],
      endorsements: [],
      createdAt: new Date().toISOString(),
    });
    console.log(`  ✓ ${d.fullName} (${d.nationalID}) — ${d.pointsBalance}/20 pts`);
  }

  // Link the "driver" quick-login user to Brian Kareithi
  if (driverUidMap['driver'] && driverIdMap['Brian Kareithi']) {
    await setDoc(doc(db, 'users', driverUidMap['driver']), {
      uid: driverUidMap['driver'],
      email: 'driver@roadsafe360.go.ke',
      role: 'driver',
      displayName: 'Brian Kareithi',
      profileId: driverIdMap['Brian Kareithi'],
    }, { merge: true });
  }

  // ── PART 3: Offence Categories ──
  console.log('\n─── Offence Categories ───');
  for (const oc of offenceCategories) {
    await addDoc(collection(db, 'offenceCategories'), oc);
    console.log(`  ✓ ${oc.code} — ${oc.name} (${oc.demeritPoints} pts)`);
  }

  // ── PART 4: Sample Offences ──
  console.log('\n─── Sample Offences ───');
  const driversSnap = await getDocs(collection(db, 'drivers'));
  const driverIds = driversSnap.docs.map(d => d.id);
  const categoriesSnap = await getDocs(collection(db, 'offenceCategories'));
  const catIds = categoriesSnap.docs.map(d => ({ id: d.id, data: d.data() }));

  const locations = [
    '-1.2921,36.8219',  '-4.0435,39.6682',  '-0.1022,34.7617',
    '-0.3031,36.0800',  '0.5143,35.2698',   '-1.0384,37.0834',
  ];

  for (let i = 0; i < 20; i++) {
    const driverId = driverIds[Math.floor(Math.random() * driverIds.length)];
    const cat = catIds[Math.floor(Math.random() * catIds.length)];
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    await addDoc(collection(db, 'offences'), {
      driverId,
      offenceCategoryId: cat.id,
      pointsDeducted: (cat.data as any).demeritPoints,
      fineAmount: (cat.data as any).fineAmount,
      gpsLocation: locations[Math.floor(Math.random() * locations.length)],
      notes: `Sample ${(cat.data as any).name} offence`,
      status: ['issued', 'paid', 'paid', 'resolved'][Math.floor(Math.random() * 4)],
      timestamp: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }
  console.log('  ✓ 20 sample offences created');

  // ── PART 5: Appeals ──
  console.log('\n─── Appeals ───');
  for (let i = 0; i < 5; i++) {
    const driverId = driverIds[Math.floor(Math.random() * driverIds.length)];
    await addDoc(collection(db, 'appeals'), {
      driverId,
      offenceRecordId: 'sample',
      reason: 'I believe this offence was issued in error. I was not exceeding the speed limit.',
      status: ['submitted', 'under_review', 'approved', 'rejected'][Math.floor(Math.random() * 4)],
      submissionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }
  console.log('  ✓ 5 sample appeals created');

  // ── PART 6: Notifications ──
  console.log('\n─── Notifications ───');
  for (let i = 0; i < 10; i++) {
    await addDoc(collection(db, 'notifications'), {
      recipientID: driverIds[Math.floor(Math.random() * driverIds.length)],
      type: ['email', 'sms', 'push', 'in_app'][Math.floor(Math.random() * 4)],
      title: ['Offence Issued', 'Licence Expiring', 'Appeal Update', 'Suspension Warning', 'Payment Due'][Math.floor(Math.random() * 5)],
      message: 'This is a sample notification for testing purposes.',
      isRead: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
    });
  }
  console.log('  ✓ 10 sample notifications created');

  // ── PART 7: Settings ──
  console.log('\n─── System Settings ───');
  for (const s of settings) {
    await addDoc(collection(db, 'settings'), s);
  }
  console.log('  ✓ System settings configured');

  // ── PART 8: Police Officers ──
  console.log('\n─── Police Officers ───');
  const officers = [
    { badgeNumber: 'POL-001', name: 'Insp. John Kimani', email: 'officer@roadsafe360.go.ke', region: 'Nairobi', assignedStation: 'Central Police Station' },
    { badgeNumber: 'POL-002', name: 'Sgt. Alice Wanjiku', email: 'alice.wanjiku@roadsafe360.go.ke', region: 'Mombasa', assignedStation: 'Mombasa Traffic Base' },
    { badgeNumber: 'POL-003', name: 'Cpl. David Omondi', email: 'david.omondi@roadsafe360.go.ke', region: 'Kisumu', assignedStation: 'Kisumu Police Station' },
  ];
  for (const o of officers) {
    const officerRef = await addDoc(collection(db, 'policeOfficers'), { ...o, createdAt: new Date().toISOString() });
    if (o.email === 'officer@roadsafe360.go.ke' && driverUidMap['police']) {
      await setDoc(doc(db, 'users', driverUidMap['police']), {
        profileId: officerRef.id,
      }, { merge: true });
    }
    console.log(`  ✓ ${o.name} (${o.badgeNumber})`);
  }

  // ── PART 9: Regions ──
  console.log('\n─── Regions ───');
  const regions = [
    { name: 'Nairobi', code: 'NRB', officerCount: 45, driverCount: 125000, offenceCount: 12340, stations: 12 },
    { name: 'Mombasa', code: 'MSA', officerCount: 28, driverCount: 68000, offenceCount: 7890, stations: 8 },
    { name: 'Kisumu', code: 'KSM', officerCount: 15, driverCount: 42000, offenceCount: 4560, stations: 5 },
    { name: 'Nakuru', code: 'NKR', officerCount: 12, driverCount: 38000, offenceCount: 3890, stations: 4 },
    { name: 'Eldoret', code: 'ELD', officerCount: 10, driverCount: 31000, offenceCount: 2980, stations: 4 },
    { name: 'Thika', code: 'THK', officerCount: 8, driverCount: 28000, offenceCount: 2340, stations: 3 },
  ];
  for (const r of regions) {
    await addDoc(collection(db, 'regions'), r);
  }
  console.log('  ✓ 6 regions registered');

  // ── PART 10: Link authority user ──
  if (driverUidMap['authority']) {
    await setDoc(doc(db, 'users', driverUidMap['authority']), {
      profileId: 'authority-profile',
    }, { merge: true });
  }

  // Sign out so the session doesn't persist
  await auth.signOut();

  console.log('\n✅ Seeding complete!');
  console.log('   Quick logins are now fully functional.\n');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
