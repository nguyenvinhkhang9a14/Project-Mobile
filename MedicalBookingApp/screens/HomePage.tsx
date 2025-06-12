/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import IconButton, { Icon } from '../components/IconButton';
import AppointmentCard from '../components/AppointmentCard';
import DoctorCard from '../components/DoctorCard';
import NewsCard from '../components/NewsCard';

import * as bookingService from '../services/bookingService';
import * as doctorService from '../services/doctorService';
import * as newsService from '../services/newsService';
import * as userService from '../services/userService';

// Import types
import { MainStackParamList } from '../navigation/MainStack';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  type UpcomingAppointment = {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    hospital: string;
    doctorImage: string;
  };
  
  type FeaturedDoctor = {
    id: string,
    name: string,
    specialty: string,
    rating: number,
    experience: string,
    hospital: string,
    image: string,
    consultationFee: number,
    availability: string,
  };
  
  type NewsItem = {
    id: string,
    title: string,
    summary: string,
    category: string,
    publishedAt: string,
    source: string,
    imageUrl: string,
  };
  
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user, logout } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [featuredDoctors, setFeaturedDoctors] = useState<FeaturedDoctor[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
  
      try {
        const userProfile = await userService.getCurrentUserProfile();
        if (userProfile) {
          setUserName(userProfile.firstname + ' ' + userProfile.lastname);
        } else {
          setUserName(user?.firstname || 'Người dùng');
        }
      } catch (error) {
        console.log('Error loading user profile:', error);
        setUserName(user?.firstname || 'Người dùng');
      }
      
      try {
        const appointments = await bookingService.getUpcomingAppointments();
        if (appointments && appointments.length > 0) {
          const formattedAppointments = appointments.map(appointment => ({
            id: appointment.id.toString(),
            doctorName: `BS. ${appointment.doctor.firstname} ${appointment.doctor.lastname}`,
            specialty: appointment.doctor.specialty?.nameSpecialty || 'Chuyên khoa',
            date: appointment.date,
            time: appointment.timeType === 'morning' ? '09:00' : '14:30',
            status: appointment.status === 0 ? 'pending' : 'confirmed',
            hospital: appointment.doctor.clinic?.nameClinic || 'Bệnh viện',
            doctorImage: appointment.doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
          }));
          setUpcomingAppointments(formattedAppointments);
        } else {
          setUpcomingAppointments([
            {
              id: '1',
              doctorName: 'BS. Trần Văn B',
              specialty: 'Tim mạch',
              date: '2025-06-05',
              time: '09:00',
              status: 'upcoming',
              hospital: 'Bệnh viện Chợ Rẫy',
              doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
            },
          ]);
        }
      } catch (error) {
        console.log('Error loading appointments:', error);
        setUpcomingAppointments([
          {
            id: '1',
            doctorName: 'BS. Trần Văn B',
            specialty: 'Tim mạch',
            date: '2025-06-05',
            time: '09:00',
            status: 'upcoming',
            hospital: 'Bệnh viện Chợ Rẫy',
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
          },
        ]);
      }
      try {
        const doctors = await doctorService.getFeaturedDoctors();
        if (doctors && doctors.length > 0) {s
          const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id.toString(),
            name: `${doctor.firstname} ${doctor.lastname}`,
            specialty: doctor.specialty?.nameSpecialty || 'Chuyên khoa',
            rating: 4.8,
            experience: '10+ năm', 
            hospital: doctor.clinic?.nameClinic || 'Bệnh viện',
            image: doctor.image || 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
            consultationFee: 300000, 
            availability: 'available', 
          }));
          setFeaturedDoctors(formattedDoctors);
        } else {
          setFeaturedDoctors([
            {
              id: '1',
              name: 'PGS.TS Nguyễn Văn D',
              specialty: 'Thần kinh',
              rating: 4.9,
              experience: '15+ năm',
              hospital: 'BV Đại học Y Dược',
              image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
              consultationFee: 300000,
              availability: 'available',
            },
          ]);
        }
      } catch (error) {
        console.log('Error loading doctors:', error);
        setFeaturedDoctors([
          {
            id: '1',
            name: 'PGS.TS Nguyễn Văn D',
            specialty: 'Thần kinh',
            rating: 4.9,
            experience: '15+ năm',
            hospital: 'BV Đại học Y Dược',
            image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
            consultationFee: 300000,
            availability: 'available',
          },
        ]);
      }
      
      try {
        const news = await newsService.getHealthNews();
        if (news && news.length > 0) {
          setNewsItems(news);
        } else {
          setNewsItems([
            {
              id: '1',
              title: 'Phát hiện mới về phòng chống ung thư',
              summary: 'Nghiên cứu mới cho thấy việc tập thể dục thường xuyên có thể giảm 30% nguy cơ mắc ung thư...',
              category: 'Sức khỏe',
              publishedAt: '2025-06-04',
              source: 'VnExpress Sức khỏe',
              imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=100&fit=crop',
            },
          ]);
        }
      } catch (error) {
        console.log('Error fetching news:', error);
        setNewsItems([
          {
            id: '1',
            title: 'Phát hiện mới về phòng chống ung thư',
            summary: 'Nghiên cứu mới cho thấy việc tập thể dục thường xuyên có thể giảm 30% nguy cơ mắc ung thư...',
            category: 'Sức khỏe',
            publishedAt: '2025-06-04',
            source: 'VnExpress Sức khỏe',
            imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=100&fit=crop',
          },
        ]);
      }
    } catch (error) {
      console.log('Error loading data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng xuất thất bại. Vui lòng thử lại.');
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    navigation.navigate('BookingDetail', { bookingId: appointmentId, mode: 'reschedule' });
  };

  const handleCancelAppointment = async (appointmentId: string) => {
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
              await bookingService.cancelBooking(appointmentId);
              Alert.alert('Thành công', 'Đã hủy lịch khám thành công');
              loadData();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể hủy lịch khám. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  const handleViewAppointmentDetails = (appointmentId: string) => {
    navigation.navigate('BookingDetail', { bookingId: appointmentId });
  };

  const handleViewDoctorDetails = (doctorId: string) => {
    navigation.navigate('DoctorDetail', { doctorId });
  };

  const handleViewNewsDetails = (newsId: string) => {
    Alert.alert('Tin tức', 'Chi tiết tin tức sẽ được hiển thị ở đây');
  };

  const handleViewAllDoctors = () => {
    navigation.navigate('DoctorList');
  };

  const handleViewAllAppointments = () => {
    navigation.navigate('MyBookings');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{userName || 'Người dùng'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert('Thông báo', 'Không có thông báo mới')}
        >
          <Icon name="notifications" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionsContainer}>
        <IconButton
          icon="medical"
          text="Đặt khám"
          color="#4CAF50"
          onPress={() => navigation.navigate('DoctorList')}
        />
        <IconButton
          icon="calendar"
          text="Lịch khám"
          color="#FF9800"
          onPress={() => navigation.navigate('MyBookings')}
        />
        <IconButton
          icon="heart"
          text="Sức khỏe"
          color="#F44336"
          onPress={() => navigation.navigate('MainTabs')}
        />
        <IconButton
          icon="document-text"
          text="Kết quả"
          color="#2196F3"
          onPress={() => Alert.alert('Kết quả', 'Tính năng đang phát triển')}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch khám sắp tới</Text>
          <TouchableOpacity onPress={handleViewAllAppointments}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onReschedule={() => handleRescheduleAppointment(appointment.id)}
              onCancel={() => handleCancelAppointment(appointment.id)}
              onViewDetails={() => handleViewAppointmentDetails(appointment.id)}
            />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon name="calendar-outline" size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>Bạn chưa có lịch khám nào</Text>
            <TouchableOpacity
              style={styles.bookAppointmentButton}
              onPress={() => navigation.navigate('DoctorList')}
            >
              <Text style={styles.bookAppointmentText}>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bác sĩ nổi bật</Text>
          <TouchableOpacity onPress={handleViewAllDoctors}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {featuredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onPress={() => handleViewDoctorDetails(doctor.id)}
          />
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tin tức sức khỏe</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {newsItems.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onPress={() => handleViewNewsDetails(news.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  bookAppointmentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookAppointmentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 