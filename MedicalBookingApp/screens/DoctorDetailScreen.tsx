import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  hospital: string;
  clinicName?: string;
  image: string;
  bioHTML: string;
  consultationFee: number;
  availability: {
    days: string[];
    hours: string[];
  };
  education: string[];
  languages: string[];
  reviews: {
    id: string;
    patientName: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

interface DoctorDetailScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
    };
  };
}

const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({ navigation, route }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'schedule'>('about');

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    
    // In a real app, fetch from API using doctorId
    setTimeout(() => {
      // Sample detailed doctor data
      const doctorData: Doctor = {
        id: doctorId,
        name: 'PGS.TS Nguyễn Văn D',
        specialty: 'Thần kinh',
        rating: 4.9,
        experience: '15+ năm',
        hospital: 'Bệnh viện Đại học Y Dược',
        clinicName: 'Phòng khám Thần kinh',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
        bioHTML: 'Tiến sĩ Nguyễn Văn D là bác sĩ chuyên khoa Thần kinh với hơn 15 năm kinh nghiệm. Ông tốt nghiệp Đại học Y Hà Nội và nhận bằng Tiến sĩ từ Đại học Y Dược TP.HCM. Ông đã có nhiều năm làm việc tại các bệnh viện lớn trong nước và quốc tế.',
        consultationFee: 300000,
        availability: {
          days: ['Thứ 2', 'Thứ 3', 'Thứ 5', 'Thứ 6'],
          hours: ['08:00 - 12:00', '14:00 - 17:00'],
        },
        education: [
          'Tiến sĩ Y khoa - Đại học Y Dược TP.HCM (2010)',
          'Bác sĩ Chuyên khoa II - Đại học Y Hà Nội (2005)',
          'Bác sĩ Y khoa - Đại học Y Hà Nội (2000)',
        ],
        languages: ['Tiếng Việt', 'Tiếng Anh'],
        reviews: [
          {
            id: '1',
            patientName: 'Nguyễn Văn X',
            rating: 5,
            date: '2025-05-28',
            comment: 'Bác sĩ rất tận tâm và giải thích chi tiết về tình trạng bệnh của tôi. Tôi cảm thấy rất an tâm khi được điều trị.',
          },
          {
            id: '2',
            patientName: 'Trần Thị Y',
            rating: 4.5,
            date: '2025-05-20',
            comment: 'Bác sĩ chuyên môn tốt, tư vấn rõ ràng. Chỉ tiếc là phải chờ đợi hơi lâu.',
          },
          {
            id: '3',
            patientName: 'Lê Minh Z',
            rating: 5,
            date: '2025-05-15',
            comment: 'Tôi đã điều trị với bác sĩ nhiều lần và luôn hài lòng với kết quả. Rất nhiệt tình và chu đáo.',
          },
        ],
      };
      
      setDoctor(doctorData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment', { doctorId: doctor?.id, doctorName: doctor?.name });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin bác sĩ...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin bác sĩ.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin bác sĩ</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{doctor.rating}</Text>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.reviewCount}>({doctor.reviews.length} đánh giá)</Text>
            </View>
            <Text style={styles.doctorHospital}>{doctor.hospital}</Text>
            <Text style={styles.doctorExperience}>{doctor.experience} kinh nghiệm</Text>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'about' && styles.activeTabButton]} 
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'about' && styles.activeTabText]}>Thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'schedule' && styles.activeTabButton]} 
            onPress={() => setActiveTab('schedule')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'schedule' && styles.activeTabText]}>Lịch khám</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]} 
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'reviews' && styles.activeTabText]}>Đánh giá</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Giới thiệu</Text>
                <Text style={styles.bioText}>{doctor.bioHTML}</Text>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Học vấn & Chứng chỉ</Text>
                {doctor.education.map((edu, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{edu}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
                <View style={styles.languageContainer}>
                  {doctor.languages.map((lang, index) => (
                    <View key={index} style={styles.languageTag}>
                      <Text style={styles.languageText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phí khám</Text>
                <Text style={styles.feeText}>{formatCurrency(doctor.consultationFee)}</Text>
              </View>
            </>
          )}
          
          {activeTab === 'schedule' && (
            <View style={styles.scheduleContainer}>
              <Text style={styles.scheduleTitle}>Lịch làm việc</Text>
              
              <View style={styles.section}>
                <Text style={styles.scheduleSubtitle}>Ngày làm việc</Text>
                <View style={styles.daysList}>
                  {doctor.availability.days.map((day, index) => (
                    <View key={index} style={styles.dayItem}>
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.scheduleSubtitle}>Giờ làm việc</Text>
                {doctor.availability.hours.map((hour, index) => (
                  <View key={index} style={styles.hourItem}>
                    <Text style={styles.hourText}>{hour}</Text>
                  </View>
                ))}
              </View>
              
              <Text style={styles.noteText}>
                * Lịch có thể thay đổi theo từng tuần. Vui lòng đặt lịch trước để được sắp xếp thời gian phù hợp.
              </Text>
            </View>
          )}
          
          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewsSummary}>
                <View style={styles.ratingLargeContainer}>
                  <Text style={styles.ratingLargeText}>{doctor.rating}</Text>
                  <Text style={styles.ratingMaxText}>/5</Text>
                </View>
                <View style={styles.starRow}>
                  <Text style={styles.starIcon}>⭐⭐⭐⭐⭐</Text>
                  <Text style={styles.reviewCountText}>{doctor.reviews.length} đánh giá</Text>
                </View>
              </View>
              
              <View style={styles.reviewsList}>
                {doctor.reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.patientName}</Text>
                      <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      <Text style={styles.reviewStars}>
                        {'⭐'.repeat(Math.floor(review.rating))}
                        {review.rating % 1 !== 0 ? '⭐' : ''}
                      </Text>
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá khám</Text>
          <Text style={styles.priceValue}>{formatCurrency(doctor.consultationFee)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Đặt lịch khám</Text>
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#007AFF',
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
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#ff3b30',
  },
  scrollView: {
    flex: 1,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  ratingIcon: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  doctorHospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 48,
    marginBottom: 16,
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
  tabButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra padding for bottom bar
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#007AFF',
    marginRight: 8,
    width: 15,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: '#e6f2ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    color: '#007AFF',
    fontSize: 14,
  },
  feeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  scheduleSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  daysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  hourItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hourText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 12,
  },
  reviewsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewsSummary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLargeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingMaxText: {
    fontSize: 18,
    color: '#666',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starIcon: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 8,
  },
  reviewCountText: {
    fontSize: 14,
    color: '#666',
  },
  reviewsList: {
    marginTop: 16,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewStars: {
    marginRight: 8,
    fontSize: 14,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 80,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DoctorDetailScreen; 