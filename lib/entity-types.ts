export interface AppointmentByPatient {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDateByPatient: Date;
  specialization: string;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  phone: string;
  email: string;
  reExamination: boolean;
  reason: string;
}

export interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
export interface Doctor {
  _id: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
  roomNumber?: string;
  specialization?: string;
  isDepartmentHead?: boolean;
}
export interface Patient {
  _id?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  medicalHistory?: MedicalHistory[];
}

export interface MedicalHistory {
  _id: string;
  disease: string;
  diagnosisDate: string;
  treatment: string;
  appointmentId: string;
}
export interface Appointment {
  _id: string;
  patientId: string;
  appointmentDate: string;
  reason: string;
  status: string;
  specialization: string;
  priority: boolean;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  medicalHistory?: MedicalHistory[];
}

export interface CompletedAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  reason: string;
}

export interface MedicationRow {
  id: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  instructions: string;
  price: number;
  quantityRemaining: number;
}

export interface Medication {
  medicationName: string;
  dosage: string;
  quantityImported: number;
  quantityRemaining: number;
  quantity: number;
  price: number;
  instructions: string;
  _id: string;
  expirationDate: Date;
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  dateIssued: Date;
  visitorName: string;
  visitorPhone: string;
  appointmentId: string;
}

export interface PatientPrescriptionInvoiceProps {
  prescription: Prescription;
  newMedication: Medication[];
}

export interface Pharmacist {
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}

export interface Receptionist {
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}

export interface LaboratoryTechnician {
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}

export interface Staff {
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
  labTestNumber?: string;
  role?: string;
  specialization?: string;
  isDepartmentHead: boolean;
}
export interface TestType {
  _id: string;
  testName: string;
  description: string;
  price: number;
}
export interface RequestTest {
  _id: string;
  testTypes: TestType[];
  patientId: Patient;
  doctorId: string;
  reason: string;
  requestDate: Date;
  isTestInvoiceCreated: boolean;
  appointmentId: string;
}

export interface TestResult {
  testName: string;
  testResult: string;
  referenceRange: string;
  measurementUnit: string;
  equipment: string;
}
export interface Test {
  _id: string;
  testTypes: TestType[];
  patientId: string;
  doctorId: string;
  technicianId: string;
  reasonByDoctor: string;
  results: [TestResult];
  datePerformed: Date;
  dateRequested: Date;
  testsPerformed: [TestType];
  labTestId: string;
  appointmentId: string;
}
export interface LoginResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    role: string;
  };
}

export interface Notification {
  id?: string;
  message?: string;
  createdAt?: Date;
}

export interface User {
  _id: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface Invoice {
  _id: string;
  issueDate: Date;
  paymentMethod: string;
  status: string;
  type: string;
  image: string;
  staffId: string;
  staffRole: string;
}
