import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as bookingService from '../services/bookingService';
import * as doctorService from '../services/doctorService';

// Định nghĩa kiểu TimeSlot phù hợp với API và UI
interface TimeSlot {
  id: string;
  time: string;
  timeType: 'morning' | 'afternoon';
  available: boolean;
}

interface BookAppointmentScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
      doctorName: string;
      bookingId?: string;
    };
  };
}

const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ navigation, route }) => {
  const { doctorId, doctorName, bookingId } = route.params;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [symptomDescription, setSymptomDescription] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Initialize available dates only once
  useEffect(() => {
    // Generate available dates for the next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
    setAvailableDates(dates);
  }, []);
  
  // Memoize fetchTimeSlots function to avoid recreation on every render
  const fetchTimeSlots = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    
    try {
      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Fetch doctor's schedule for the selected date
      const schedule = await doctorService.getDoctorSchedule(doctorId, formattedDate);
      
      if (schedule && schedule.timeSlots) {
        setTimeSlots(schedule.timeSlots);
      } else {
        // Fallback to mock data if no schedule is available
        const slots: TimeSlot[] = [
          { id: '1', time: '09:00', timeType: 'morning', available: true },
          { id: '2', time: '09:30', timeType: 'morning', available: true },
          { id: '3', time: '10:00', timeType: 'morning', available: false },
          { id: '4', time: '10:30', timeType: 'morning', available: true },
          { id: '5', time: '11:00', timeType: 'morning', available: true },
          { id: '6', time: '11:30', timeType: 'morning', available: false },
          { id: '7', time: '14:00', timeType: 'afternoon', available: true },
          { id: '8', time: '14:30', timeType: 'afternoon', available: true },
          { id: '9', time: '15:00', timeType: 'afternoon', available: true },
          { id: '10', time: '15:30', timeType: 'afternoon', available: false },
          { id: '11', time: '16:00', timeType: 'afternoon', available: true },
          { id: '12', time: '16:30', timeType: 'afternoon', available: true },
        ];
        
        setTimeSlots(slots);
      }
    } catch (error) {
      console.log('Error fetching time slots:', error);
     
      
      // Fallback to mock data
      const slots: TimeSlot[] = [
        { id: '1', time: '09:00', timeType: 'morning', available: true },
        { id: '2', time: '09:30', timeType: 'morning', available: true },
        { id: '3', time: '10:00', timeType: 'morning', available: false },
        { id: '4', time: '10:30', timeType: 'morning', available: true },
        { id: '5', time: '11:00', timeType: 'morning', available: true },
        { id: '6', time: '11:30', timeType: 'morning', available: false },
        { id: '7', time: '14:00', timeType: 'afternoon', available: true },
        { id: '8', time: '14:30', timeType: 'afternoon', available: true },
        { id: '9', time: '15:00', timeType: 'afternoon', available: true },
        { id: '10', time: '15:30', timeType: 'afternoon', available: false },
        { id: '11', time: '16:00', timeType: 'afternoon', available: true },
        { id: '12', time: '16:30', timeType: 'afternoon', available: true },
      ];
      
      setTimeSlots(slots);
    } finally {
      setLoading(false);
    }
  }, [doctorId, selectedDate]);
  
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate, doctorId, fetchTimeSlots]);
  
  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dayLabel = '';
    if (date.toDateString() === today.toDateString()) {
      dayLabel = 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayLabel = 'Ngày mai';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    };
    
    const formatted = date.toLocaleDateString('vi-VN', options);
    return dayLabel ? `${dayLabel}, ${formatted}` : formatted;
  };
  
  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày và giờ khám');
      return;
    }
    
    if (!symptomDescription) {
      Alert.alert('Lỗi', 'Vui lòng mô tả triệu chứng của bạn');
      return;
    }
    
    setLoading(true);
    
    try {
      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Get selected time slot details
      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      
      if (!selectedSlot) {
        throw new Error('Không tìm thấy khung giờ đã chọn');
      }
      
      if (bookingId) {
        // Đổi lịch: gọi rescheduleBooking
        await bookingService.rescheduleBooking(bookingId, formattedDate, selectedSlot.timeType, symptomDescription);
        Alert.alert('Thành công', 'Lịch khám của bạn đã được đổi.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // Đặt mới
        await bookingService.createBooking({
          doctorId: doctorId,
          patientId: user?.userId,
          date: formattedDate,
          timeType: selectedSlot.timeType as 'morning' | 'afternoon',
          symptomDescription: symptomDescription,
          status: 0, // Pending
        });
        Alert.alert('Đặt lịch thành công', 'Lịch khám của bạn đã được đặt. Bạn sẽ nhận được thông báo xác nhận qua email và điện thoại.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BookingComplete', {
              doctorName,
              date: formatFullDate(selectedDate),
              time: selectedSlot.time,
            }),
          },
        ]);
      }
    } catch (error) {
      console.log('Error booking appointment:', error);
      Alert.alert('Lỗi', 'Không thể đặt/đổi lịch khám. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch khám</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Doctor Info */}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.bookingTitle}>Chọn ngày và giờ khám</Text>
        </View>
        
        {/* Date Selection */}
        <View style={styles.dateSelectionContainer}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
          >
            {availableDates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateButton,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text 
                  style={[
                    styles.dateDay, 
                    selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text 
                  style={[
                    styles.dateMonth, 
                    selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                  ]}
                >
                  {date.toLocaleDateString('vi-VN', { month: 'short' })}
                </Text>
                <Text 
                  style={[
                    styles.dateWeekday, 
                    selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                  ]}
                >
                  {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Time Slot Selection */}
        {selectedDate && (
          <View style={styles.timeSelectionContainer}>
            <Text style={styles.sectionTitle}>Chọn giờ khám</Text>
            <Text style={styles.selectedDateText2}>{formatFullDate(selectedDate)}</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            ) : (
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.unavailableTimeSlot,
                      selectedTimeSlot === slot.id && styles.selectedTimeSlot,
                    ]}
                    disabled={!slot.available}
                    onPress={() => handleTimeSlotSelect(slot.id)}
                  >
                    <Text 
                      style={[
                        styles.timeSlotText,
                        !slot.available && styles.unavailableTimeSlotText,
                        selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Symptom Description */}
        <View style={styles.symptomContainer}>
          <Text style={styles.sectionTitle}>Mô tả triệu chứng</Text>
          <TextInput
            style={styles.symptomInput}
            multiline
            placeholder="Mô tả triệu chứng của bạn hoặc lý do khám bệnh..."
            value={symptomDescription}
            onChangeText={setSymptomDescription}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>
        
        {/* Booking Policy */}
        <View style={styles.policyContainer}>
          <Text style={styles.policyTitle}>Lưu ý khi đặt lịch</Text>
          <View style={styles.policyItem}>
            <Text style={styles.policyBullet}>•</Text>
            <Text style={styles.policyText}>Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục.</Text>
          </View>
          <View style={styles.policyItem}>
            <Text style={styles.policyBullet}>•</Text>
            <Text style={styles.policyText}>Mang theo CMND/CCCD và thẻ BHYT (nếu có).</Text>
          </View>
          <View style={styles.policyItem}>
            <Text style={styles.policyBullet}>•</Text>
            <Text style={styles.policyText}>Bạn có thể hủy lịch hẹn trước 24 giờ mà không mất phí.</Text>
          </View>
        </View>
        
        {/* Bottom padding for button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[
            styles.bookButton,
            (!selectedDate || !selectedTimeSlot || !symptomDescription) && styles.disabledButton,
          ]}
          disabled={!selectedDate || !selectedTimeSlot || !symptomDescription || loading}
          onPress={handleBooking}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>Xác nhận đặt lịch</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 30,
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  doctorInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  bookingTitle: {
    fontSize: 14,
    color: '#666',
  },
  dateSelectionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  dateScrollView: {
    flexGrow: 0,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    padding: 8,
  },
  selectedDateButton: {
    backgroundColor: '#007AFF',
  },
  dateDay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  dateMonth: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  dateWeekday: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateText: {
    color: '#fff',
  },
  selectedDateText2: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 16,
    fontWeight: '500',
  },
  timeSelectionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '31%',
    height: 45,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  unavailableTimeSlot: {
    backgroundColor: '#eee',
    opacity: 0.6,
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
  },
  timeSlotText: {
    color: '#333',
    fontSize: 16,
  },
  unavailableTimeSlotText: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  symptomContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  symptomInput: {
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  policyContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  policyBullet: {
    color: '#007AFF',
    fontSize: 16,
    marginRight: 8,
    width: 10,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    height: 80,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookAppointmentScreen; 