import { Timestamp } from "firebase/firestore";

// Family Document
export interface Family {
  familyId: string;
  familyName: string;
  inviteCode: string;
  createdBy: string;
  adminCount: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  memberCount: number;
  description: string;
  familyPhoto: string;
}

// Member Document
export interface FamilyMember {
  userId: string;
  name: string;
  email: string;
  phone: string;
  relation: string;
  gender: string;
  dob: Timestamp | null;
  bloodGroup: string;
  profileImage: string;
  address: string;
  isAdmin: boolean;
  joinedAt: Timestamp;
  status: "active";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  relationship: string;
}

// Health Information
export interface HealthInfo {
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  insuranceProvider: string;
  insuranceNumber: string;
  notes: string;
  updatedAt: Timestamp;
}

// Medicine
export interface Medicine {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Prescription
export interface Prescription {
  prescriptionId: string;
  doctor: string;
  hospital: string;
  documentId: string;
  prescriptionDate: Timestamp | null;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Doctor Visit
export interface DoctorVisit {
  visitId: string;
  doctor: string;
  hospital: string;
  diagnosis: string;
  nextVisit: Timestamp | null;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Medical Expense
export interface MedicalExpense {
  expenseId: string;
  amount: number;
  billDocumentId: string;
  paidBy: string;
  expenseDate: Timestamp | null;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Health Data Structure
export interface HealthData {
  info: HealthInfo | null;
  medicines: Medicine[];
  visits: DoctorVisit[];
  prescriptions: Prescription[];
  expenses: MedicalExpense[];
}

// Member Document Reference
export interface MemberDocument {
  documentId: string;
  category: string;
}

// Activity
export interface Activity {
  activityId: string;
  type: string;
  performedBy: string;
  createdAt: Timestamp;
}

// Announcement
export interface Announcement {
  announcementId: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  createdBy: string;
  createdAt: Timestamp;
  expiresAt: Timestamp | null;
}

// Emergency Contact
export interface EmergencyContact {
  contactId: string;
  category: EmergencyContactCategory;
  name: string;
  phone: string;
  address: string;
  notes: string;
  isSOSPerson: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type EmergencyContactCategory =
  | "Doctor"
  | "Police"
  | "Fire"
  | "Ambulance"
  | "Electrician"
  | "Plumber"
  | "Gas Agency"
  | "Society Office"
  | "Hospital";

// Join Request
export interface JoinRequest {
  requestId: string;
  userId: string;
  requestedBy: string;
  inviteCode: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
  approvedBy: string | null;
}

// Dependent (Phase 2)
export interface Dependent {
  dependentId: string;
  parentId: string;
  name: string;
  dob: Timestamp;
  gender: string;
  school: string;
  bloodGroup: string;
  notes: string;
  createdAt: Timestamp;
}

// Pet (Phase 2)
export interface Pet {
  petId: string;
  name: string;
  breed: string;
  gender: string;
  dob: Timestamp;
  vaccinationDate: Timestamp;
  doctor: string;
  notes: string;
}

// UI State Types
export type FamilyTab =
  | "members"
  | "health"
  | "emergency"
  | "announcements"
  | "joinRequests";

export interface FamilyScreenState {
  selectedTab: FamilyTab;
  isLoading: boolean;
  error: string | null;
}
