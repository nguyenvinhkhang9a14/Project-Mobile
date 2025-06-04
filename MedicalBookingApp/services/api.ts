import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, DEFAULT_HEADERS, API_TIMEOUT } from '../config';

// Tạo axios instance với cấu hình cơ bản
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT,
});

// Thêm token vào requests nếu có
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding auth token to request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý responses và errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Xử lý token hết hạn
    if (error.response && error.response.status === 401) {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        // Có thể thêm chuyển hướng đến màn hình đăng nhập ở đây
      } catch (storageError) {
        console.error('Error clearing user data:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 