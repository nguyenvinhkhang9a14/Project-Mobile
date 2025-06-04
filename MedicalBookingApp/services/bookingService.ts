import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { Booking } from '../interfaces';
import api from './api';

// Lấy tất cả lịch đặt khám của người dùng
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.BOOKINGS);
    return response.data;
  } catch (error) {
    console.log('Error fetching user bookings:', error);
    throw error;
  }
};

// Alias của getUserBookings để tương thích với code cũ
export const getMyBookings = getUserBookings;

// Lấy thông tin chi tiết lịch đặt khám
export const getBookingDetail = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await api.get(API_ENDPOINTS.BOOKING_BY_ID(bookingId));
    return response.data;
  } catch (error) {
    console.log('Error fetching booking detail:', error);
    throw error;
  }
};

// Lấy các lịch đặt khám sắp tới
export const getUpcomingAppointments = async (): Promise<Booking[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.BOOKINGS}?status=upcoming`);
    return response.data;
  } catch (error) {
    console.log('Error fetching upcoming appointments:', error);
    throw error;
  }
};

// Lấy lịch sử đặt khám
export const getBookingHistory = async (): Promise<Booking[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.BOOKINGS}?status=completed`);
    return response.data;
  } catch (error) {
    console.log('Error fetching booking history:', error);
    throw error;
  }
};

// Đặt lịch khám mới
export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  try {
    const response = await api.post(API_ENDPOINTS.BOOKINGS, bookingData);
    return response.data;
  } catch (error) {
    console.log('Error creating booking:', error);
    throw error;
  }
};

// Cập nhật thông tin đặt lịch
export const updateBooking = async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
  try {
    const response = await api.put(API_ENDPOINTS.BOOKING_BY_ID(bookingId), data);
    return response.data;
  } catch (error) {
    console.log('Error updating booking:', error);
    throw error;
  }
};

// Lấy danh sách lịch hẹn của bác sĩ
export const getDoctorBookings = async (doctorId: string, date?: string): Promise<Booking[]> => {
  try {
    const params = date ? { date } : {};
    const response = await api.get(`/doctors/${doctorId}/bookings`, { params });
    return response.data;
  } catch (error) {
    console.log('Error fetching doctor bookings:', error);
    throw error;
  }
};

// Cập nhật trạng thái lịch hẹn
export const updateBookingStatus = async (bookingId: string, status: number): Promise<Booking> => {
  try {
    return await updateBooking(bookingId, { status });
  } catch (error) {
    console.log('Error updating booking status:', error);
    throw error;
  }
};

// Hủy lịch khám
export const cancelBooking = async (bookingId: string): Promise<any> => {
  try {
    const response = await api.post(API_ENDPOINTS.CANCEL_BOOKING(bookingId), {});
    return response.data;
  } catch (error) {
    console.log('Error canceling booking:', error);
    throw error;
  }
};

// Đổi lịch khám
export const rescheduleBooking = async (bookingId: string, newDate: string, newTimeType: string): Promise<any> => {
  try {
    const response = await api.post(API_ENDPOINTS.RESCHEDULE_BOOKING(bookingId), {
      date: newDate,
      timeType: newTimeType,
    });
    return response.data;
  } catch (error) {
    console.log('Error rescheduling booking:', error);
    throw error;
  }
}; 