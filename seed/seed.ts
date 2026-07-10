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

// ─── ROLE ASSIGNMENT ───
// Admin: Aisha Abubakar (lady)
// Authority: Khalid Salad
// Police (2): Mohammed Karshe, Adnan Ali
// Drivers (10): rest + staff also get off-duty driver profiles

const staffAccounts = [
  // Admin + her off-duty driver profile
  { email: 'aisha@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', displayName: 'Aisha Abubakar' },
  { email: 'aisha.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Aisha Abubakar' },
  // Authority + his off-duty driver profile
  { email: 'khalid@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', displayName: 'Khalid Salad' },
  { email: 'khalid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Khalid Salad' },
  // Police 1 + off-duty driver profile
  { email: 'mohammed@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Mohammed Karshe' },
  { email: 'mohammed.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Mohammed Karshe' },
  // Police 2 + off-duty driver profile
  { email: 'adnan@roadsafe360.go.ke', password: 'Officer123!', role: 'police', displayName: 'Adnan Ali' },
  { email: 'adnan.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Adnan Ali' },
  // 10 pure drivers
  { email: 'zaahid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Zaahid Abdulmalik' },
  { email: 'naila@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Naila Amour' },
  { email: 'rania@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Rania Bahlewa' },
  { email: 'zeitun@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Zeitun Hussein' },
  { email: 'reyhan@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Reyhan Fuad' },
  { email: 'turq@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Turq Mahamud' },
  { email: 'fenz@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Fenz Abdisalam' },
  { email: 'umulkheir@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'UmulKheir Aden' },
  { email: 'faizaan@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Faizaan Mohammed' },
  { email: 'abdulhameed@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', displayName: 'Abdulhameed Saleh' },
];

// Only 2 police officers in the force
const policeOfficers = [
  { badgeNumber: 'POL-001', name: 'Mohammed Karshe', email: 'mohammed@roadsafe360.go.ke', region: 'Nairobi', assignedStation: 'Kilimani Police Station' },
  { badgeNumber: 'POL-002', name: 'Adnan Ali', email: 'adnan@roadsafe360.go.ke', region: 'Mombasa', assignedStation: 'Mombasa Traffic Base' },
];

// 14 driver profiles (10 pure + 4 off-duty for admin/authority/police)
const driverProfiles = [
  { nationalID: '99999999', fullName: 'Zaahid Abdulmalik', email: 'zaahid.driver@roadsafe360.go.ke', phoneNumber: '+254712345600', bloodGroup: 'O-', emergencyContact: '+254712345601', pointsBalance: 0, status: 'suspended', riskScore: 0.99 },
  { nationalID: '11111111', fullName: 'Aisha Abubakar', email: 'aisha.driver@roadsafe360.go.ke', phoneNumber: '+254712345601', bloodGroup: 'A+', emergencyContact: '+254712345602', pointsBalance: 18, status: 'active', riskScore: 0.10 },
  { nationalID: '22222222', fullName: 'Khalid Salad', email: 'khalid.driver@roadsafe360.go.ke', phoneNumber: '+254712345602', bloodGroup: 'B+', emergencyContact: '+254712345603', pointsBalance: 16, status: 'active', riskScore: 0.15 },
  { nationalID: '33333333', fullName: 'Mohammed Karshe', email: 'mohammed.driver@roadsafe360.go.ke', phoneNumber: '+254712345603', bloodGroup: 'O+', emergencyContact: '+254712345604', pointsBalance: 20, status: 'active', riskScore: 0.05 },
  { nationalID: '44444444', fullName: 'Adnan Ali', email: 'adnan.driver@roadsafe360.go.ke', phoneNumber: '+254712345604', bloodGroup: 'AB+', emergencyContact: '+254712345605', pointsBalance: 19, status: 'active', riskScore: 0.08 },
  { nationalID: '55555551', fullName: 'Naila Amour', email: 'naila@roadsafe360.go.ke', phoneNumber: '+254712345605', bloodGroup: 'A-', emergencyContact: '+254712345606', pointsBalance: 14, status: 'active', riskScore: 0.28 },
  { nationalID: '55555552', fullName: 'Rania Bahlewa', email: 'rania@roadsafe360.go.ke', phoneNumber: '+254712345606', bloodGroup: 'B-', emergencyContact: '+254712345607', pointsBalance: 8, status: 'warning', riskScore: 0.55 },
  { nationalID: '55555553', fullName: 'Zeitun Hussein', email: 'zeitun@roadsafe360.go.ke', phoneNumber: '+254712345607', bloodGroup: 'O+', emergencyContact: '+254712345608', pointsBalance: 12, status: 'active', riskScore: 0.32 },
  { nationalID: '55555554', fullName: 'Reyhan Fuad', email: 'reyhan@roadsafe360.go.ke', phoneNumber: '+254712345608', bloodGroup: 'AB-', emergencyContact: '+254712345609', pointsBalance: 5, status: 'final_warning', riskScore: 0.68 },
  { nationalID: '55555555', fullName: 'Turq Mahamud', email: 'turq@roadsafe360.go.ke', phoneNumber: '+254712345609', bloodGroup: 'A+', emergencyContact: '+254712345610', pointsBalance: 10, status: 'warning', riskScore: 0.42 },
  { nationalID: '55555556', fullName: 'Fenz Abdisalam', email: 'fenz@roadsafe360.go.ke', phoneNumber: '+254712345610', bloodGroup: 'B+', emergencyContact: '+254712345611', pointsBalance: 17, status: 'active', riskScore: 0.18 },
  { nationalID: '55555557', fullName: 'UmulKheir Aden', email: 'umulkheir@roadsafe360.go.ke', phoneNumber: '+254712345611', bloodGroup: 'O-', emergencyContact: '+254712345612', pointsBalance: 3, status: 'suspension_review', riskScore: 0.78 },
  { nationalID: '55555558', fullName: 'Faizaan Mohammed', email: 'faizaan@roadsafe360.go.ke', phoneNumber: '+254712345612', bloodGroup: 'A+', emergencyContact: '+254712345613', pointsBalance: 15, status: 'active', riskScore: 0.22 },
  { nationalID: '55555559', fullName: 'Abdulhameed Saleh', email: 'abdulhameed@roadsafe360.go.ke', phoneNumber: '+254712345613', bloodGroup: 'AB+', emergencyContact: '+254712345614', pointsBalance: 1, status: 'suspension_review', riskScore: 0.85 },
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
  { name: 'Nairobi', code: 'NRB', officerCount: 25, driverCount: 125000, offenceCount: 12340, stations: 12 },
  { name: 'Mombasa', code: 'MSA', officerCount: 15, driverCount: 68000, offenceCount: 7890, stations: 8 },
  { name: 'Kisumu', code: 'KSM', officerCount: 10, driverCount: 42000, offenceCount: 4560, stations: 5 },
  { name: 'Nakuru', code: 'NKR', officerCount: 8, driverCount: 38000, offenceCount: 3890, stations: 4 },
  { name: 'Eldoret', code: 'ELD', officerCount: 7, driverCount: 31000, offenceCount: 2980, stations: 4 },
  { name: 'Thika', code: 'THK', officerCount: 6, driverCount: 28000, offenceCount: 2340, stations: 3 },
  { name: 'Machakos', code: 'MKS', officerCount: 5, driverCount: 22000, offenceCount: 1870, stations: 3 },
  { name: 'Nyeri', code: 'NYR', officerCount: 4, driverCount: 18000, offenceCount: 1560, stations: 2 },
];

const licenceClasses = ['A', 'B', 'C', 'D', 'E', 'G'];

async function createOrUpdateAuthUser(email: string, password: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('  ~ ' + email + ' already exists, signing in to update');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user.uid;
    }
    throw err;
  }
}

async function seed() {
  console.log('Seeding RoadSafe360...\n');

  // ── 1. AUTH USERS ──
  console.log('--- Auth Users ---');
  const uidMap: Record<string, string> = {};
  for (const s of staffAccounts) {
    try {
      const uid = await createOrUpdateAuthUser(s.email, s.password);
      await setDoc(doc(db, 'users', uid), {
        uid, email: s.email, role: s.role, displayName: s.displayName,
      });
      uidMap[s.email] = uid;
      console.log('  ' + s.displayName + ' (' + s.email + ') - ' + s.role);
    } catch (err: any) {
      console.log('  FAILED ' + s.email + ': ' + err.message);
    }
  }

  // ── 2. DRIVERS & LICENCES ──
  console.log('\n--- Drivers & Licences ---');
  const driverIdMap: Record<string, string> = {};
  for (const d of driverProfiles) {
    const driverRef = await addDoc(collection(db, 'drivers'), {
      ...d,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    driverIdMap[d.fullName] = driverRef.id;

    const licenceClass = licenceClasses[Math.floor(Math.random() * licenceClasses.length)];
    const licenceNumber = 'K' + String(100000 + Math.floor(Math.random() * 900000));
    const isSuspended = d.status === 'suspended' || d.status === 'suspension_review';
    await addDoc(collection(db, 'licences'), {
      licenceNumber,
      licenceClass,
      issueDate: '2023-06-01',
      expiryDate: '2028-06-01',
      status: isSuspended ? 'suspended' : 'active',
      driverId: driverRef.id,
      vehicleCategories: ['Private'],
      endorsements: [],
      createdAt: new Date().toISOString(),
    });

    // Link driver auth user to driver profile
    const driverAuthEmail = d.email;
    const driverUid = uidMap[driverAuthEmail];
    if (driverUid) {
      await setDoc(doc(db, 'users', driverUid), { profileId: driverRef.id }, { merge: true });
    }

    console.log('  ' + d.fullName + ' (' + d.nationalID + ') - ' + d.pointsBalance + '/20 pts - ' + d.status);
  }

  // ── 3. POLICE OFFICERS (only 2) ──
  console.log('\n--- Police Officers ---');
  for (const o of policeOfficers) {
    const officerRef = await addDoc(collection(db, 'policeOfficers'), { ...o, createdAt: new Date().toISOString() });
    const userUid = uidMap[o.email];
    if (userUid) {
      await setDoc(doc(db, 'users', userUid), { profileId: officerRef.id }, { merge: true });
    }
    console.log('  ' + o.name + ' (' + o.badgeNumber + ') - ' + o.region);
  }

  // ── 4. OFFENCE CATEGORIES ──
  console.log('\n--- Offence Categories ---');
  const catIdMap: Record<string, string> = {};
  for (const oc of offenceCategories) {
    const ref = await addDoc(collection(db, 'offenceCategories'), oc);
    catIdMap[oc.code] = ref.id;
    console.log('  ' + oc.code + ' - ' + oc.name);
  }

  // ── 5. SAMPLE OFFENCES (Zaahid gets many, others get a few) ──
  console.log('\n--- Sample Offences ---');
  const zaahidId = driverIdMap['Zaahid Abdulmalik'];
  const karsheDriverId = driverIdMap['Mohammed Karshe'];
  const aishaDriverId = driverIdMap['Aisha Abubakar'];
  const nailaId = driverIdMap['Naila Amour'];
  const raniaId = driverIdMap['Rania Bahlewa'];
  const reyhanId = driverIdMap['Reyhan Fuad'];
  const umulkheirId = driverIdMap['UmulKheir Aden'];
  const abdulhameedId = driverIdMap['Abdulhameed Saleh'];

  const locations = [
    '-1.2921,36.8219', '-4.0435,39.6682', '-0.1022,34.7617',
    '-0.3031,36.0800', '0.5143,35.2698', '-1.0384,37.0834',
  ];

  // Zaahid - the reckless one - 8 offences
  const zaahidOffences = [
    { cat: 'SPD-01', pts: 6, fine: 10000 },
    { cat: 'SPD-01', pts: 6, fine: 10000 },
    { cat: 'DUI-01', pts: 10, fine: 100000 },
    { cat: 'RDL-01', pts: 8, fine: 30000 },
    { cat: 'TSG-01', pts: 3, fine: 5000 },
    { cat: 'RTL-01', pts: 4, fine: 8000 },
    { cat: 'NLD-01', pts: 4, fine: 20000 },
    { cat: 'HLM-01', pts: 2, fine: 10000 },
  ];
  for (let i = 0; i < zaahidOffences.length; i++) {
    const o = zaahidOffences[i];
    const d = new Date();
    d.setMonth(d.getMonth() - (zaahidOffences.length - i));
    await addDoc(collection(db, 'offences'), {
      driverId: zaahidId,
      offenceCategoryId: catIdMap[o.cat],
      pointsDeducted: o.pts,
      fineAmount: o.fine,
      gpsLocation: locations[i % locations.length],
      notes: o.cat === 'DUI-01' ? 'Found driving under influence - arrested at checkpoint' :
             o.cat === 'RDL-01' ? 'Swerving through traffic on Mombasa Road' :
             o.cat === 'SPD-01' ? 'Clock at 145 km/h in 80 zone' : 'Traffic violation',
      status: i < 3 ? 'paid' : 'issued',
      timestamp: d.toISOString(),
      createdAt: d.toISOString(),
    });
  }
  console.log('  Zaahid Abdulmalik - 8 offences (most reckless)');

  // Other drivers - 1-2 offences each
  const otherOffences = [
    { driverId: nailaId, cat: 'SPD-02', pts: 3, fine: 5000 },
    { driverId: nailaId, cat: 'PRK-01', pts: 1, fine: 1500 },
    { driverId: raniaId, cat: 'TSG-01', pts: 3, fine: 5000 },
    { driverId: raniaId, cat: 'SNL-01', pts: 1, fine: 2000 },
    { driverId: reyhanId, cat: 'RTL-01', pts: 4, fine: 8000 },
    { driverId: reyhanId, cat: 'SPD-01', pts: 6, fine: 10000 },
    { driverId: umulkheirId, cat: 'NIN-01', pts: 4, fine: 25000 },
    { driverId: abdulhameedId, cat: 'DUI-01', pts: 10, fine: 100000 },
    { driverId: abdulhameedId, cat: 'SPD-01', pts: 6, fine: 10000 },
    { driverId: karsheDriverId, cat: 'PRK-01', pts: 1, fine: 1500 },
    { driverId: aishaDriverId, cat: 'SNL-01', pts: 1, fine: 2000 },
  ];
  for (const o of otherOffences) {
    const d = new Date();
    d.setMonth(d.getMonth() - Math.floor(Math.random() * 4));
    await addDoc(collection(db, 'offences'), {
      driverId: o.driverId,
      offenceCategoryId: catIdMap[o.cat],
      pointsDeducted: o.pts,
      fineAmount: o.fine,
      gpsLocation: locations[Math.floor(Math.random() * locations.length)],
      notes: 'Traffic violation',
      status: Math.random() > 0.4 ? 'paid' : 'issued',
      timestamp: d.toISOString(),
      createdAt: d.toISOString(),
    });
  }
  console.log('  Other drivers - sample offences added');

  // ── 6. APPEALS (Zaahid has an appeal) ──
  console.log('\n--- Appeals ---');
  await addDoc(collection(db, 'appeals'), {
    driverId: zaahidId,
    offenceRecordId: 'pending',
    reason: 'I was not driving under influence. The breathalyzer reading was inaccurate.',
    status: 'submitted',
    submissionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  console.log('  Zaahid Abdulmalik - 1 appeal submitted');

  // ── 7. SETTINGS ──
  console.log('\n--- Settings ---');
  for (const s of settings) {
    await addDoc(collection(db, 'settings'), s);
  }
  console.log('  Settings configured');

  // ── 8. REGIONS ──
  console.log('\n--- Regions ---');
  for (const r of regions) {
    await addDoc(collection(db, 'regions'), r);
  }
  console.log('  8 regions registered');

  // ── 9. NOTIFICATIONS ──
  console.log('\n--- Notifications ---');
  const allDriverIds = Object.values(driverIdMap);
  for (let i = 0; i < 8; i++) {
    const randomDriver = allDriverIds[Math.floor(Math.random() * allDriverIds.length)];
    await addDoc(collection(db, 'notifications'), {
      recipientID: randomDriver,
      type: ['email', 'sms', 'in_app'][Math.floor(Math.random() * 3)],
      title: ['Offence Issued', 'Licence Expiring', 'Appeal Update', 'Payment Reminder'][Math.floor(Math.random() * 4)],
      message: 'Please check your dashboard for details.',
      isRead: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }
  console.log('  8 notifications created');

  await auth.signOut();

  console.log('\n=== SEED COMPLETE ===');
  console.log('Admin: Aisha Abubakar (aisha@roadsafe360.go.ke / Admin123!)');
  console.log('Authority: Khalid Salad (khalid@roadsafe360.go.ke / Auth123!)');
  console.log('Police: Mohammed Karshe (mohammed@roadsafe360.go.ke / Officer123!)');
  console.log('Police: Adnan Ali (adnan@roadsafe360.go.ke / Officer123!)');
  console.log('Driver (reckless): Zaahid Abdulmalik (zaahid.driver@roadsafe360.go.ke / Driver123!)');
  console.log('All staff also have off-duty driver profiles.\n');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
