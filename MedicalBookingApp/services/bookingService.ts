import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';
import { Booking } from '../interfaces';
import api from './api';

// Lấy tất cả lịch đặt khám của người dùng
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    // Sử dụng endpoint my-bookings thay vì bookings chung
    const response = await api.get('/bookings/my-bookings');
       console.log(response.data);
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
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching booking detail:', error);
    throw error;
  }
};

// Lấy các lịch đặt khám sắp tới
export const getUpcomingAppointments = async (): Promise<Booking[]> => {
  try {
    const allBookings = await getUserBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allBookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today && (booking.status === 1 || booking.status === 0); // confirmed or pending
    });
  } catch (error) {
    console.log('Error fetching upcoming appointments:', error);
    throw error;
  }
};

// Lấy lịch sử đặt khám
export const getBookingHistory = async (): Promise<Booking[]> => {
  try {
    const allBookings = await getUserBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allBookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate < today || booking.status === 2 || booking.status === 3; // completed or canceled
    });
  } catch (error) {
    console.log('Error fetching booking history:', error);
    throw error;
  }
};

// Đặt lịch khám mới
export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.log('Error creating booking:', error);
    throw error;
  }
};

// Cập nhật thông tin đặt lịch
export const updateBooking = async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, data);
    return response.data;
  } catch (error) {
    console.log('Error updating booking:', error);
    throw error;
  }
};

// Lấy danh sách lịch hẹn của bác sĩ
export const getDoctorBookings = async (doctorId?: string, date?: string): Promise<Booking[]> => {
  try {
    const response = await api.get('/bookings/doctor-bookings');
    return response.data;
  } catch (error) {
    console.log('Error fetching doctor bookings:', error);
    throw error;
  }
};

// Cập nhật trạng thái lịch hẹn
export const updateBookingStatus = async (bookingId: string, status: number): Promise<Booking> => {
  try {
    const response = await api.put(`/bookings/${bookingId}/status`, { status });
    return response.data.booking;
  } catch (error) {
    console.log('Error updating booking status:', error);
    throw error;
  }
};

// Hủy lịch khám
export const cancelBooking = async (bookingId: string): Promise<any> => {
  try {
    const response = await api.put(`/bookings/${bookingId}/status`, { status: 3 }); // 3 = canceled
    return response.data;
  } catch (error) {
    console.log('Error canceling booking:', error);
    throw error;
  }
};

// Đổi lịch khám
export const rescheduleBooking = async (bookingId: string, newDate: string, newTimeType: string): Promise<any> => {
  try {
    const response = await api.put(`/bookings/${bookingId}/reschedule`, {
      date: newDate,
      time: newTimeType, // Backend expects 'time' not 'timeType'
    });
    return response.data;
  } catch (error) {
    console.log('Error rescheduling booking:', error);
    throw error;
  }
};

// Thêm đánh giá cho lịch khám đã hoàn thành
export const addBookingReview = async (bookingId: string, rating: number, comment?: string): Promise<any> => {
  try {
    const response = await api.post(`/bookings/${bookingId}/review`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    console.log('Error adding booking review:', error);
    throw error;
  }
};