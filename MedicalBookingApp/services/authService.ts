import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_ENDPOINTS, DEFAULT_HEADERS } from '../config';
import { User } from '../interfaces';
import api from './api';

// Key lưu token trong AsyncStorage
export const TOKEN_KEY = 'userToken';
export const USER_KEY = 'user';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
      email,
      password,
    }, {
      headers: DEFAULT_HEADERS,
    });
    
    const { token, user } = response.data;
    
    // Lưu token và thông tin user
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.log('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Gọi API logout nếu cần
    try {
      await api.post(API_ENDPOINTS.LOGOUT, {});
    } catch (logoutError) {
      console.log('Error during logout API call:', logoutError);
      // Bỏ qua lỗi API và tiếp tục xóa token
    }
    
    // Xóa token và thông tin user
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    
    return true;
  } catch (error) {
    console.log('Logout error:', error);
    throw error;
  }
};

export const register = async (userData: Partial<User>) => {
  try {
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.REGISTER}`, userData, {
      headers: DEFAULT_HEADERS,
    });
    return response.data;
  } catch (error) {
    console.log('Register error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.log('Get current user error:', error);
    return null;
  }
};

export const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error('No auth token found');
  }
  return {
    ...DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`,
  };
};

export const refreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('No refresh token available');
    
    const response = await axios.post(
      `${API_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
      {},
      { headers: { ...DEFAULT_HEADERS, Authorization: `Bearer ${token}` } }
    );
    
    const newToken = response.data.token;
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    
    return newToken;
  } catch (error) {
    console.log('Token refresh error:', error);
    // Nếu lỗi refresh, logout user
    await logout();
    throw error;
  }
};

// Không cần interceptor này nữa vì đã được xử lý trong api.ts
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Thử refresh token
//         const newToken = await refreshToken();
        
//         // Cập nhật token trong request và gửi lại
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         // Nếu refresh thất bại, chuyển người dùng về màn hình login
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// ); 