export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
  role?: string;
}

export interface Doctor {
  id: string;
  title?: string;
  firstname: string;
  lastname: string;
  specialty: Specialty;
  clinic?: Clinic;
  rating?: number;
  experience?: string;
  image?: string;
  consultationFee: number;
  availability: 'available' | 'busy';
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeType: 'morning' | 'afternoon';
  status: number;
  symptomDescription?: string;
  doctor: Doctor;
}

export interface Clinic {
  id: string;
  nameClinic: string;
  address?: string;
}

export interface Specialty {
  id: string;
  nameSpecialty: string;
  description?: string;
  image?: string;
}

export interface HealthData {
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  source: string;
  imageUrl: string;
}

export interface TimeSlot {
  id: string;
  timeType: 'morning' | 'afternoon';
  date: string;
  isAvailable: boolean;
} 