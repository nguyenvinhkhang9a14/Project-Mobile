import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Share,
} from 'react-native';

interface BookingCompleteScreenProps {
  navigation: any;
  route: {
    params: {
      doctorName: string;
      date: string;
      time: string;
    };
  };
}

const BookingCompleteScreen: React.FC<BookingCompleteScreenProps> = ({ navigation, route }) => {
  const { doctorName, date, time } = route.params;
  const bookingId = `BK${Math.floor(10000 + Math.random() * 90000)}`; // Generate random booking ID
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tôi đã đặt lịch khám với ${doctorName} vào lúc ${time}, ${date}. Mã đặt lịch: ${bookingId}`,
        title: 'Lịch khám Medical Booking App',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleViewBookings = () => {
    // Navigate to user's appointments/bookings screen
    navigation.navigate('MyBookings');
  };
  
  const handleGoHome = () => {
    // Navigate to home screen and reset navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.successTitle}>Đặt lịch thành công!</Text>
        <Text style={styles.successMessage}>
          Lịch khám của bạn đã được xác nhận. Chúng tôi đã gửi thông tin chi tiết qua email và SMS.
        </Text>
        
        {/* Booking details card */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>Thông tin lịch khám</Text>
            <View style={styles.bookingIdContainer}>
              <Text style={styles.bookingIdLabel}>Mã đặt lịch:</Text>
              <Text style={styles.bookingId}>{bookingId}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Bác sĩ:</Text>
            <Text style={styles.detailValue}>{doctorName}</Text>
          </View>
          
          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Ngày khám:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          
          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Giờ khám:</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>
          
          <View style={styles.bookingDetail}>
            <Text style={styles.detailLabel}>Trạng thái:</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Đã xác nhận</Text>
            </View>
          </View>
          
          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <Text style={styles.noteText}>
              Vui lòng đến trước 15 phút để làm thủ tục. Mang theo CMND/CCCD và thẻ BHYT (nếu có).
            </Text>
          </View>
        </View>
        
        
        {/* Reminder card */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIconContainer}>
            <Text style={styles.reminderIcon}>🔔</Text>
          </View>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Cài đặt nhắc nhở</Text>
            <Text style={styles.reminderText}>
              Đừng quên lịch khám của bạn! Chúng tôi sẽ gửi thông báo trước 24 giờ.
            </Text>
          </View>
        </View>
        
        {/* Sharing button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareIcon}>🔗</Text>
          <Text style={styles.shareText}>Chia sẻ lịch khám</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewBookings}>
          <Text style={styles.secondaryButtonText}>Xem lịch đã đặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  successIconContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingIdLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  bookingId: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  bookingDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  statusContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  mapButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  reminderIconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderIcon: {
    fontSize: 32,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  shareIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  shareText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 80,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BookingCompleteScreen; 