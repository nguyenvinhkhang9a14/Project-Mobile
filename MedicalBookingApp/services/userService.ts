import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { User, HealthData } from '../interfaces';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get current user ID from AsyncStorage
const getCurrentUserId = async (): Promise<string> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.userId || user.id;
    }
    throw new Error('User data not found');
  } catch (error) {
    console.log('Error getting current user ID:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết người dùng hiện tại
export const getCurrentUserProfile = async (): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    const response = await api.get(`${API_ENDPOINTS.USER_PROFILE}/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching user profile:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    const response = await api.put(`${API_ENDPOINTS.UPDATE_PROFILE}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.log('Error updating user profile:', error);
    throw error;
  }
};

// Cập nhật ảnh đại diện
export const updateUserAvatar = async (imageData: FormData): Promise<{ imageUrl: string }> => {
  try {
    const userId = await getCurrentUserId();
    const response = await api.post(`/users/${userId}/update-avatar`, imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error updating avatar:', error);
    throw error;
  }
};

// Lấy dữ liệu sức khỏe của người dùng
export const getUserHealthData = async (): Promise<HealthData> => {
  try {
    const userId = await getCurrentUserId();
    const response = await api.get(`${API_ENDPOINTS.HEALTH_DATA}/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching health data:', error);
    throw error;
  }
};

// Cập nhật dữ liệu sức khỏe
export const updateUserHealthData = async (healthData: Partial<HealthData>): Promise<HealthData> => {
  try {
    const userId = await getCurrentUserId();
    const response = await api.put(`${API_ENDPOINTS.UPDATE_HEALTH_DATA}/${userId}`, healthData);
    return response.data;
  } catch (error) {
    console.log('Error updating health data:', error);
    throw error;
  }
}; 