import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { NewsItem } from '../interfaces';
import api from './api';

// Lấy tất cả bài viết tin tức
export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.NEWS);
    return response.data;
  } catch (error) {
    console.log('Error fetching news:', error);
    throw error;
  }
};

// Lấy tin tức về sức khỏe cho trang chủ
export const getHealthNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS}?category=health&limit=3`);
    return response.data;
  } catch (error) {
    console.log('Error fetching health news:', error);
    throw error;
  }
};

// Lấy tin tức theo danh mục
export const getNewsByCategory = async (category: string): Promise<NewsItem[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS}/category/${category}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching news by category:', error);
    throw error;
  }
};

// Lấy chi tiết bài viết
export const getNewsById = async (newsId: string): Promise<NewsItem> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS}/${newsId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching news details:', error);
    throw error;
  }
};

// Lấy tin tức nổi bật
export const getFeaturedNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS}/featured`);
    return response.data;
  } catch (error) {
    console.log('Error fetching featured news:', error);
    throw error;
  }
};

// Tìm kiếm tin tức
export const searchNews = async (keyword: string): Promise<NewsItem[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.NEWS}/search`, { 
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.log('Error searching news:', error);
    throw error;
  }
}; 