import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import * as bookingService from '../services/bookingService';
import {Booking} from '../interfaces';

interface BookingDisplay {
  id: string;
  doctorName: string;
  specialty: string;
  nameClinic: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  originalBooking: Booking;
}

interface MyBookingsScreenProps {
  navigation: any;
}

const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({navigation}) => {
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBookings();
    }
  }, [isFocused]);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const response = await bookingService.getMyBookings();
      console.log('API Response:', response); 

      if (response && Array.isArray(response)) {
        const formattedBookings: BookingDisplay[] = response.map(
          (booking: Booking) => {
            const doctorTitle = booking.doctor?.title || 'BS.';
            const doctorFirstName = booking.doctor?.firstname || '';
            const doctorLastName = booking.doctor?.lastname || '';
            const doctorName =
              `${doctorTitle} ${doctorFirstName} ${doctorLastName}`.trim();

            return {
              id: (booking.bookingId ?? booking.id ?? '').toString(),
              doctorName: doctorName,
              specialty:
                booking.doctor?.specialty?.nameSpecialty || 'Chuyên khoa',
              nameClinic: booking.doctor?.clinic?.nameClinic || 'Phòng khám',
              date: booking.date,
              time:
                booking.timeType === 'morning'
                  ? '08:00 - 12:00'
                  : '13:00 - 17:00',
              status: getStatusFromCode(booking.status),
              originalBooking: booking,
            };
          },
        );

        setBookings(formattedBookings);
      } else {
        console.log('Invalid API response format:', response);
        setBookings([]);
      }
    } catch (error) {
      console.log('Error fetching bookings:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách lịch khám. Vui lòng thử lại sau.',
      );
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusFromCode = (statusCode: number): BookingDisplay['status'] => {
    switch (statusCode) {
      case 0:
        return 'pending';
      case 1:
        return 'confirmed';
      case 2:
        return 'completed';
      case 3:
        return 'canceled';
      default:
        return 'pending';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Xác nhận hủy lịch',
      'Bạn có chắc chắn muốn hủy lịch khám này không?',
      [
        {text: 'Không', style: 'cancel'},
        {
          text: 'Có, hủy lịch',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await bookingService.cancelBooking(bookingId);
              Alert.alert('Thành công', 'Đã hủy lịch khám thành công');
              fetchBookings();
            } catch (error) {
              console.log('Error canceling booking:', error);
              Alert.alert(
                'Lỗi',
                'Không thể hủy lịch khám. Vui lòng thử lại sau.',
              );
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleRescheduleBooking = async (bookingId: string, formattedDate: string, selectedSlot: {timeType: string}) => {
    if (bookingId) {
      try {
        await bookingService.rescheduleBooking(bookingId, formattedDate, selectedSlot.timeType);
        Alert.alert('Thành công', 'Lịch khám của bạn đã được đổi.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể đổi lịch. Vui lòng thử lại.');
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return (
        bookingDate >= today &&
        (booking.status === 'confirmed' || booking.status === 'pending')
      );
    });
  };

  const getPastBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return (
        bookingDate < today ||
        booking.status === 'completed' ||
        booking.status === 'canceled'
      );
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: BookingDisplay['status']): string => {
    switch (status) {
      case 'confirmed':
        return '#4CD964';
      case 'pending':
        return '#FF9500';
      case 'completed':
        return '#007AFF';
      case 'canceled':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: BookingDisplay['status']): string => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Đã khám';
      case 'canceled':
        return 'Đã hủy';
      default:
        return '';
    }
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingDetail', {bookingId});
  };

  const handleReviewPress = (bookingId: string) => {
    navigation.navigate('ReviewBooking', {bookingId});
  };

  const handleBookAgainPress = (booking: BookingDisplay) => {
    navigation.navigate('BookingConfirm', {
      doctorId: booking.originalBooking.doctorId,
      doctor: booking.originalBooking.doctor,
    });
  };

  const renderBookingItem = ({item}: {item: BookingDisplay}) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item.id)}>
      <View style={styles.bookingHeader}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        </View>
        <View
          style={[
            styles.statusTag,
            {backgroundColor: `${getStatusColor(item.status)}20`},
          ]}>
          <Text
            style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🕒</Text>
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🏥</Text>
          <Text style={styles.infoText}>{item.nameClinic}</Text>
        </View>
        {item.originalBooking.symptomDescription && (
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📝</Text>
            <Text style={styles.infoText} numberOfLines={2}>
              {item.originalBooking.symptomDescription}
            </Text>
          </View>
        )}
      </View>

      

      <Text style={styles.bookingId}>Mã đặt lịch: #{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch khám của tôi</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'upcoming' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('upcoming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}>
            Sắp tới ({getUpcomingBookings().length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'past' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}>
            Đã hủy ({getPastBookings().length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải lịch khám...</Text>
        </View>
      ) : (
        <FlatList
          data={
            activeTab === 'upcoming' ? getUpcomingBookings() : getPastBookings()
          }
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming'
                  ? 'Bạn chưa có lịch khám sắp tới'
                  : 'Không có lịch khám nào trong lịch sử'}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  style={styles.newBookingButton}
                  onPress={() => navigation.navigate('DoctorList')}>
                  <Text style={styles.newBookingText}>Đặt lịch khám</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInfo: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  rescheduleButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  rescheduleText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  reviewButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#4CD964',
    fontWeight: '500',
  },
  bookAgainButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookAgainText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  bookingId: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  newBookingButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newBookingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyBookingsScreen;
