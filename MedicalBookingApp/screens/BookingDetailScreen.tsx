import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as bookingService from '../services/bookingService';
import * as doctorService from '../services/doctorService';
import { Icon } from '../components/IconButton';

interface BookingDetailScreenProps {
  navigation: any;
  route: {
    params: {
      bookingId: string;
      mode?: 'reschedule';
    };
  };
}

interface Booking {
  id: string;
  doctorName: string;
  doctorId: string;
  specialty: string;
  hospitalName: string;
  date: string;
  time: string;
  status: string;
  description: string;
  doctorImage: string;
}

const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({ navigation, route }) => {
  const { bookingId, mode } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      fetchBookingDetails();
    }
  }, [isFocused, bookingId]);
  
  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookingDetail(bookingId);
      
      if (response) {
        // Transform API response to match our component props
        setBooking({
          id: (response.bookingId ?? '').toString(),
          doctorName: `${response.doctor?.title || 'BS.'} ${response.doctor?.firstname || ''} ${response.doctor?.lastname || ''}`,
          doctorId: (response.doctorId ?? response.doctor?.doctorId ?? '').toString(),
          specialty: response.doctor?.specialty?.nameSpecialty || 'Chuyên khoa',
          hospitalName: response.doctor?.clinic?.nameClinic || 'Bệnh viện',
          date: response.date,
          time: response.timeType === 'morning' ? '08:00 - 12:00' : '13:00 - 17:00',
          status: getStatusText(response.status),
          description: response.symptomDescription || 'Không có mô tả',
          doctorImage: response.doctor?.image || 'https://via.placeholder.com/150',
        });
      } else {
        // Fallback to mock data
        setBooking({
          id: bookingId,
          doctorName: 'BS. Trần Văn B',
          doctorId: '1',
          specialty: 'Tim mạch',
          hospitalName: 'Bệnh viện Chợ Rẫy',
          date: '2023-06-15',
          time: '09:00',
          status: 'Đã xác nhận',
          description: 'Đau ngực, khó thở khi gắng sức',
          doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
        });
      }
    } catch (error) {
      console.log('Error fetching booking details:', error);
      // Fallback to mock data
      setBooking({
        id: bookingId,
        doctorName: 'BS. Trần Văn B',
        doctorId: '1',
        specialty: 'Tim mạch',
        hospitalName: 'Bệnh viện Chợ Rẫy',
        date: '2023-06-15',
        time: '09:00',
        status: 'Đã xác nhận',
        description: 'Đau ngực, khó thở khi gắng sức',
        doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusText = (statusCode: number): string => {
    switch (statusCode) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã khám xong';
      case 3:
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const handleReschedule = () => {
    if (booking) {
      navigation.navigate('BookAppointment', {
        doctorId: booking.doctorId,
        doctorName: booking.doctorName,
        bookingId: booking.id, // Pass bookingId for rescheduling
      });
    }
  };
  
  const handleCancel = async () => {
    Alert.alert(
      'Xác nhận hủy lịch',
      'Bạn có chắc chắn muốn hủy lịch khám này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có, hủy lịch',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await bookingService.cancelBooking(bookingId);
              Alert.alert('Thành công', 'Đã hủy lịch khám thành công');
              navigation.goBack();
            } catch (error) {
              console.log('Error canceling booking:', error);
              Alert.alert('Lỗi', 'Không thể hủy lịch khám. Vui lòng thử lại sau.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const handleViewDoctorProfile = () => {
    if (booking) {
      navigation.navigate('DoctorDetail', {
        doctorId: booking.doctorId,
      });
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin lịch khám...</Text>
      </SafeAreaView>
    );
  }
  
  if (!booking) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="close-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorTitle}>Không tìm thấy thông tin</Text>
        <Text style={styles.errorText}>Lịch khám không tồn tại hoặc đã bị xóa.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonSmall}>
          <Text style={styles.backButtonTextSmall}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lịch khám</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statusSection}>
          <View style={[
            styles.statusBadge,
            booking.status === 'Đã xác nhận' ? styles.confirmedBadge :
            booking.status === 'Chờ xác nhận' ? styles.pendingBadge :
            booking.status === 'Đã khám xong' ? styles.completedBadge :
            styles.canceledBadge
          ]}>
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin đặt khám</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bác sĩ:</Text>
            <TouchableOpacity onPress={handleViewDoctorProfile}>
              <Text style={styles.infoValueLink}>{booking.doctorName}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chuyên khoa:</Text>
            <Text style={styles.infoValue}>{booking.specialty}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bệnh viện:</Text>
            <Text style={styles.infoValue}>{booking.hospitalName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày khám:</Text>
            <Text style={styles.infoValue}>{formatDate(booking.date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giờ khám:</Text>
            <Text style={styles.infoValue}>{booking.time}</Text>
          </View>
          
          <View style={styles.infoRowFull}>
            <Text style={styles.infoLabel}>Lý do khám:</Text>
            <Text style={styles.infoDescription}>{booking.description}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý</Text>
          <Text style={styles.noteText}>
            • Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục{'\n'}
            • Mang theo CMND/CCCD và thẻ BHYT (nếu có){'\n'}
            • Có thể hủy lịch hẹn trước 24 giờ mà không mất phí
          </Text>
        </View>
        
        {booking.status === 'Đã xác nhận' || booking.status === 'Chờ xác nhận' ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.rescheduleButton}
              onPress={handleReschedule}
            >
              <Icon name="calendar" size={20} color="#007AFF" />
              <Text style={styles.rescheduleText}>Đổi lịch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Icon name="close-circle" size={20} color="#FF3B30" />
              <Text style={styles.cancelText}>Hủy lịch</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
  
        
        {/* Bottom padding */}
        <View style={{ height: 80 }} />
      </ScrollView>
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
  backButtonSmall: {
    padding: 8,
  },
  backButtonTextSmall: {
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
  content: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  confirmedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedBadge: {
    backgroundColor: '#E3F2FD',
  },
  canceledBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoRowFull: {
    marginBottom: 12,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  infoValueLink: {
    flex: 1,
    fontSize: 16,
    color: '#007AFF',
  },
  infoDescription: {
    fontSize: 16,
    color: '#000',
    marginTop: 8,
    lineHeight: 22,
  },
  noteText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  rescheduleText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
  rescheduleBanner: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rescheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  rescheduleMessage: {
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  confirmRescheduleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmRescheduleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingDetailScreen; 