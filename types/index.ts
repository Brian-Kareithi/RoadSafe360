export interface Driver {
  id?: string;
  nationalID: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  photoURL?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  pointsBalance: number;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  riskScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Licence {
  id?: string;
  licenceNumber: string;
  licenceClass: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  driverId: string;
  vehicleCategories?: string[];
  endorsements?: string[];
}

export interface PoliceOfficer {
  id?: string;
  badgeNumber: string;
  name: string;
  email: string;
  region: string;
  assignedStation?: string;
  userId: string;
}

export interface OffenceCategory {
  id?: string;
  code: string;
  name: string;
  description?: string;
  fineAmount: number;
  demeritPoints: number;
  severity: 'minor' | 'moderate' | 'serious';
  applicableVehicleClasses?: string[];
  repeatOffenderMultiplier?: number;
  courtRequired: boolean;
}

export interface OffenceRecord {
  id?: string;
  timestamp: string;
  gpsLocation?: string;
  notes?: string;
  pointsDeducted: number;
  status: 'issued' | 'paid' | 'contested' | 'resolved';
  driverId: string;
  offenceCategoryId: string;
  officerId: string;
  mediaUrls?: string[];
  fineAmount: number;
}

export interface Appeal {
  id?: string;
  submissionDate: string;
  reason: string;
  evidenceURL?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  offenceRecordId: string;
  driverId: string;
  resolution?: string;
  resolvedAt?: string;
}

export interface Suspension {
  id?: string;
  startDate: string;
  endDate?: string;
  reason: string;
  durationMonths: number;
  driverId: string;
  suspensionCount: number;
}

export interface AuditLog {
  id?: string;
  actorID: string;
  actionType: string;
  timestamp: string;
  targetEntityID: string;
  details?: string;
}

export interface Notification {
  id?: string;
  recipientID: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export interface SystemSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
}

export interface Payment {
  id?: string;
  driverId: string;
  offenceRecordId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
}

export type UserRole = 'admin' | 'police' | 'driver' | 'authority';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  profileId?: string;
}