import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { Doctor, TimeSlot } from '../interfaces';
import api from './api';

// Interface cho dữ liệu lịch làm việc của bác sĩ
interface DoctorSchedule {
  doctorId: string;
  date: string;
  timeSlots: Array<{
    id: string;
    time: string;
    timeType: 'morning' | 'afternoon';
    available: boolean;
  }>;
}

// Lấy danh sách tất cả bác sĩ
export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.DOCTORS);
    return response.data;
  } catch (error) {
    console.log('Error loading doctors:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết của bác sĩ theo ID
export const getDoctorById = async (doctorId: string): Promise<Doctor> => {
  try {
    const response = await api.get(API_ENDPOINTS.DOCTOR_BY_ID(doctorId));
    return response.data;
  } catch (error) {
    console.log('Error loading doctor details:', error);
    throw error;
  }
};

// Lấy thông tin profile của bác sĩ đăng nhập
export const getMyDoctorProfile = async (): Promise<Doctor> => {
  try {
    const response = await api.get(API_ENDPOINTS.DOCTOR_PROFILE);
    return response.data;
  } catch (error) {
    console.log('Error getting doctor profile:', error);
    throw error;
  }
};

// Cập nhật trạng thái làm việc (availability) của bác sĩ
export const updateAvailability = async (availability: 'available' | 'busy'): Promise<Doctor> => {
  try {
    const response = await api.put('/doctors/availability', { availability });
    return response.data;
  } catch (error) {
    console.log('Error updating doctor availability:', error);
    throw error;
  }
};

// Lấy danh sách bác sĩ theo chuyên khoa
export const getDoctorsBySpecialty = async (specialtyId: string): Promise<Doctor[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.DOCTORS_BY_SPECIALTY(specialtyId));
    return response.data;
  } catch (error) {
    console.log('Error loading doctors by specialty:', error);
    throw error;
  }
};

// Lấy danh sách bác sĩ nổi bật
export const getFeaturedDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await api.get('/doctors/featured');
    return response.data;
  } catch (error) {
    console.log('Error loading featured doctors:', error);
    throw error;
  }
};

// Tìm kiếm bác sĩ theo từ khóa
export const searchDoctors = async (keyword: string): Promise<Doctor[]> => {
  try {
    const response = await api.get('/doctors/search', { 
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.log('Error searching doctors:', error);
    throw error;
  }
};

// Lấy lịch khám của bác sĩ
export const getDoctorSchedule = async (doctorId: string, date: string): Promise<DoctorSchedule> => {
  try {
    const response = await api.get(API_ENDPOINTS.DOCTOR_SCHEDULE(doctorId), { 
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.log('Error loading doctor schedule:', error);
    throw error;
  }
};

// Lấy time slots khả dụng của bác sĩ
export const getAvailableTimeSlots = async (doctorId: string, date: string): Promise<any[]> => {
  try {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, { 
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching time slots:', error);
    throw error;
  }
}; 