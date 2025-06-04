import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDoctorBookings, updateBookingStatus } from '../services/bookingService';
import { getMyDoctorProfile, updateAvailability } from '../services/doctorService';

interface BookingItem {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  symptoms: string;
}

interface DaySchedule {
  day: string;
  available: boolean;
  timeSlots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}

const DoctorScheduleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [todayBookings, setTodayBookings] = useState<BookingItem[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingItem[]>([]);
  const [scheduleSettings, setScheduleSettings] = useState<DaySchedule[]>([
    { day: 'Monday', available: true, timeSlots: { morning: true, afternoon: true, evening: false } },
    { day: 'Tuesday', available: true, timeSlots: { morning: true, afternoon: true, evening: false } },
    { day: 'Wednesday', available: true, timeSlots: { morning: true, afternoon: false, evening: false } },
    { day: 'Thursday', available: true, timeSlots: { morning: true, afternoon: true, evening: false } },
    { day: 'Friday', available: true, timeSlots: { morning: true, afternoon: true, evening: false } },
    { day: 'Saturday', available: false, timeSlots: { morning: false, afternoon: false, evening: false } },
    { day: 'Sunday', available: false, timeSlots: { morning: false, afternoon: false, evening: false } },
  ]);
  
  useEffect(() => {
    fetchDoctorData();
  }, []);
  
  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      // In a real app, use the API services to fetch doctor's profile and bookings
      // const doctorProfile = await getMyDoctorProfile();
      // const bookings = await getDoctorBookings();
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockBookings: BookingItem[] = [
          {
            id: 'B1',
            patientName: 'Nguyễn Văn A',
            date: '2025-06-15',
            time: '09:00',
            status: 'confirmed',
            symptoms: 'Đau đầu, sốt nhẹ kéo dài 3 ngày',
          },
          {
            id: 'B2',
            patientName: 'Trần Thị B',
            date: '2025-06-15',
            time: '10:00',
            status: 'confirmed',
            symptoms: 'Đau bụng dưới bên phải',
          },
          {
            id: 'B3',
            patientName: 'Lê Văn C',
            date: '2025-06-15',
            time: '11:00',
            status: 'pending',
            symptoms: 'Khó thở, ho nhiều',
          },
          {
            id: 'B4',
            patientName: 'Phạm Thị D',
            date: '2025-06-17',
            time: '09:30',
            status: 'confirmed',
            symptoms: 'Đau khớp gối, khó đi lại',
          },
          {
            id: 'B5',
            patientName: 'Hoàng Văn E',
            date: '2025-06-18',
            time: '14:00',
            status: 'confirmed',
            symptoms: 'Chóng mặt, buồn nôn',
          },
        ];
        
        // Filter today's bookings
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = mockBookings.filter(booking => booking.date === today);
        const futureAppointments = mockBookings.filter(booking => booking.date > today);
        
        setTodayBookings(todayAppointments);
        setUpcomingBookings(futureAppointments);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.log('Error fetching doctor data:', error);
      Alert.alert('Error', 'Failed to load your schedule. Please try again.');
      setLoading(false);
    }
  };
  
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      // In a real app, update booking status via API
      // await updateBookingStatus(bookingId, 'confirmed');
      
      // For demo purposes, update local state
      setTodayBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
        )
      );
      setUpcomingBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
        )
      );
      
      Alert.alert('Success', 'Appointment has been confirmed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm appointment.');
    }
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, update booking status via API
              // await updateBookingStatus(bookingId, 'canceled');
              
              // For demo purposes, update local state
              setTodayBookings(prev => 
                prev.map(booking => 
                  booking.id === bookingId ? { ...booking, status: 'canceled' } : booking
                )
              );
              setUpcomingBookings(prev => 
                prev.map(booking => 
                  booking.id === bookingId ? { ...booking, status: 'canceled' } : booking
                )
              );
              
              Alert.alert('Success', 'Appointment has been canceled.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment.');
            }
          },
        },
      ]
    );
  };
  
  const toggleDayAvailability = (dayIndex: number) => {
    const updatedSchedule = [...scheduleSettings];
    updatedSchedule[dayIndex].available = !updatedSchedule[dayIndex].available;
    
    // If day is set to unavailable, clear all time slots
    if (!updatedSchedule[dayIndex].available) {
      updatedSchedule[dayIndex].timeSlots = {
        morning: false,
        afternoon: false,
        evening: false,
      };
    }
    
    setScheduleSettings(updatedSchedule);
    
    // In a real app, update availability via API
    // updateAvailability({ schedule: updatedSchedule });
  };
  
  const toggleTimeSlot = (dayIndex: number, slot: 'morning' | 'afternoon' | 'evening') => {
    const updatedSchedule = [...scheduleSettings];
    updatedSchedule[dayIndex].timeSlots[slot] = !updatedSchedule[dayIndex].timeSlots[slot];
    setScheduleSettings(updatedSchedule);
    
    // In a real app, update availability via API
    // updateAvailability({ schedule: updatedSchedule });
  };
  
  const renderBookingItem = ({ item }: { item: BookingItem }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={[
          styles.statusTag, 
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian:</Text>
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Triệu chứng:</Text>
          <Text style={styles.detailText}>{item.symptoms}</Text>
        </View>
      </View>
      
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => handleConfirmBooking(item.id)}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(item.id)}
          >
            <Text style={styles.cancelButtonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  const renderDaySchedule = ({ item, index }: { item: DaySchedule; index: number }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayName}>{item.day}</Text>
        <TouchableOpacity 
          style={[
            styles.availabilityToggle, 
            { backgroundColor: item.available ? '#E3F2FD' : '#f0f0f0' }
          ]}
          onPress={() => toggleDayAvailability(index)}
        >
          <Text style={[
            styles.availabilityText, 
            { color: item.available ? '#007AFF' : '#666' }
          ]}>
            {item.available ? 'Làm việc' : 'Nghỉ'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {item.available && (
        <View style={styles.timeSlots}>
          <TouchableOpacity 
            style={[
              styles.timeSlot,
              item.timeSlots.morning ? styles.timeSlotActive : styles.timeSlotInactive
            ]}
            onPress={() => toggleTimeSlot(index, 'morning')}
          >
            <Text style={[
              styles.timeSlotText,
              item.timeSlots.morning ? styles.timeSlotTextActive : styles.timeSlotTextInactive
            ]}>
              Sáng
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.timeSlot,
              item.timeSlots.afternoon ? styles.timeSlotActive : styles.timeSlotInactive
            ]}
            onPress={() => toggleTimeSlot(index, 'afternoon')}
          >
            <Text style={[
              styles.timeSlotText,
              item.timeSlots.afternoon ? styles.timeSlotTextActive : styles.timeSlotTextInactive
            ]}>
              Chiều
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.timeSlot,
              item.timeSlots.evening ? styles.timeSlotActive : styles.timeSlotInactive
            ]}
            onPress={() => toggleTimeSlot(index, 'evening')}
          >
            <Text style={[
              styles.timeSlotText,
              item.timeSlots.evening ? styles.timeSlotTextActive : styles.timeSlotTextInactive
            ]}>
              Tối
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return '#4CD964';
      case 'pending':
        return '#FF9500';
      case 'canceled':
        return '#FF3B30';
      default:
        return '#999';
    }
  };
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'canceled':
        return 'Đã hủy';
      default:
        return '';
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải lịch khám...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch khám của tôi</Text>
        <TouchableOpacity onPress={fetchDoctorData}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Doctor welcome message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeMessage}>
            Chào bác sĩ {user?.firstname} {user?.lastname}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Xem và quản lý lịch khám của bạn
          </Text>
        </View>
        
        {/* Today's appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch khám hôm nay</Text>
          
          {todayBookings.length > 0 ? (
            todayBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingItem}>
                {renderBookingItem({ item: booking })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Không có lịch khám nào hôm nay</Text>
            </View>
          )}
        </View>
        
        {/* Upcoming appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch khám sắp tới</Text>
          
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingItem}>
                {renderBookingItem({ item: booking })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Không có lịch khám nào sắp tới</Text>
            </View>
          )}
        </View>
        
        {/* Schedule settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý lịch làm việc</Text>
          <Text style={styles.sectionSubtitle}>Thiết lập thời gian làm việc của bạn</Text>
          
          <FlatList
            data={scheduleSettings}
            renderItem={renderDaySchedule}
            keyExtractor={(item) => item.day}
            scrollEnabled={false}
          />
          
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu lịch làm việc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  refreshIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confirmButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 12,
  },
  confirmButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  scheduleItem: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  availabilityToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlots: {
    flexDirection: 'row',
    marginTop: 8,
  },
  timeSlot: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  timeSlotInactive: {
    backgroundColor: '#f0f0f0',
  },
  timeSlotText: {
    fontSize: 14,
  },
  timeSlotTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  timeSlotTextInactive: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorScheduleScreen; 