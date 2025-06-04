import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { Specialty } from '../interfaces';
import api from './api';

// Lấy danh sách tất cả chuyên khoa
export const getAllSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.SPECIALTIES);
    return response.data;
  } catch (error) {
    console.log('Error fetching specialties:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết chuyên khoa
export const getSpecialtyById = async (specialtyId: string): Promise<Specialty> => {
  try {
    const response = await api.get(API_ENDPOINTS.SPECIALTY_BY_ID(specialtyId));
    return response.data;
  } catch (error) {
    console.log('Error fetching specialty details:', error);
    throw error;
  }
};

// Lấy danh sách chuyên khoa phổ biến
export const getPopularSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await api.get('/specialties/popular');
    return response.data;
  } catch (error) {
    console.log('Error fetching popular specialties:', error);
    throw error;
  }
}; 