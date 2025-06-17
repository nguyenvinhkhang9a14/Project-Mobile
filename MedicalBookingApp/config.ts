export const API_URL = 'http://10.0.2.2:5000'; // URL cho emulator Android
// export const API_URL = 'http://localhost:5000'; // URL cho iOS simulator
// export const API_URL = 'https://your-production-api.com'; // URL production

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Các endpoint API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  USER_PROFILE: '/users', // Will need to append ID from token
  UPDATE_PROFILE: '/users', // Will need to append ID from token
  
  // Health Data - This doesn't exist in backend yet
  HEALTH_DATA: '/health-data',
  UPDATE_HEALTH_DATA: '/health-data/update',
  
  // Doctors
  DOCTORS: '/doctors',
  DOCTOR_BY_ID: (doctorId: string) => `/doctors/${doctorId}`,
  DOCTORS_BY_SPECIALTY: (specialtyId: string) => `/doctors/specialty/${specialtyId}`,
  DOCTORS_BY_CLINIC: (clinicId: string) => `/doctors/clinic/${clinicId}`,
  DOCTOR_SCHEDULE: (doctorId: string) => `/doctors/${doctorId}/schedule`,
  DOCTOR_PROFILE: '/doctors/profile',
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  CANCEL_BOOKING: (id: string) => `/bookings/cancel/${id}`,
  RESCHEDULE_BOOKING: (id: string) => `/bookings/reschedule/${id}`,
  
  // Specialties
  SPECIALTIES: '/specialties',
  SPECIALTY_BY_ID: (id: string) => `/specialties/${id}`,
  
  // Clinics 
  CLINICS: '/clinics',
  CLINIC_BY_ID: (id: string) => `/clinics/${id}`,
  
  // News - This doesn't exist in backend yet
  NEWS: '/news',
};

// Timeout các request API (ms)
export const API_TIMEOUT = 10000; 