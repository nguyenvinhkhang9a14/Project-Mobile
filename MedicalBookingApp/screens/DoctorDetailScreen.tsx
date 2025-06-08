import React, {useState, useEffect} from 'react';
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
  Alert,
  useWindowDimensions,
} from 'react-native';
import {getDoctorById} from '../services/doctorService'; // Import service
import {Doctor} from '../interfaces'; // Import interface
import RenderHTML from 'react-native-render-html';

interface DoctorDetailScreenProps {
  navigation: any;
  route: {
    params: {
      doctorId: string;
    };
  };
}

const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {doctorId} = route.params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const doctorData = await getDoctorById(doctorId);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setError('Không thể tải thông tin bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const {width} = useWindowDimensions();
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment', {
      doctorId: doctor?.doctorId,
      doctorName: `${doctor?.firstname} ${doctor?.lastname}`,
    });
  };

  // Retry function để thử lại khi có lỗi
  const handleRetry = () => {
    fetchDoctorDetails();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin bác sĩ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Quay lại</Text>
        </TouchableOpacity>
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

  // Tạo tên đầy đủ từ firstname và lastname
  const fullName = `${doctor.firstname} ${doctor.lastname}`;

  // Tạo URL hình ảnh đầy đủ nếu cần

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
        <Text style={styles.headerTitle}>Thông tin bác sĩ</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <Image
            source={{uri: `http://10.0.2.2:5000${doctor.image}`}} // nếu bạn dùng emulator
            style={styles.doctorImage}
            defaultSource={{
              uri: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
            }}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {doctor.title ? `${doctor.title} ${fullName}` : fullName}
            </Text>
            <Text style={styles.doctorSpecialty}>
              {doctor.specialty?.nameSpecialty ||
                'Chưa có thông tin chuyên khoa'}
            </Text>
            <Text style={styles.doctorHospital}>
              {doctor.clinic?.nameClinic || 'Chưa có thông tin phòng khám'}
            </Text>
            {doctor.experience && (
              <Text style={styles.doctorExperience}>
                Kinh nghiệm: {doctor.experience}
              </Text>
            )}
          </View>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.bioText}>
              {doctor.description ||
                `Bác sĩ ${fullName} chuyên khoa ${
                  doctor.specialty?.nameSpecialty || 'Y khoa'
                }. 
               Với nhiều năm kinh nghiệm trong lĩnh vực y tế, bác sĩ cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất cho bệnh nhân.`}
            </Text>
          </View>
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn & Chứng chỉ</Text>
            {doctor.bioHTML ? (
              // Tách bioHTML thành các dòng và hiển thị dưới dạng bullet points
              doctor.bioHTML.split('\n').filter(item => item.trim()).map((edu, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{edu.trim()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bioText}>Chưa có thông tin học vấn</Text>
            )}
          </View> */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn & Chứng chỉ</Text>
            {doctor.bioHTML ? (
              <RenderHTML
                contentWidth={width}
                source={{html: doctor.bioHTML}}
                baseStyle={styles.htmlText}
                tagsStyles={{
                  ul: {paddingLeft: 20, marginBottom: 8},
                  li: {
                    marginBottom: 6,
                    color: '#333',
                    fontSize: 15,
                    lineHeight: 22,
                  },
                }}
              />
            ) : (
              <Text style={styles.bioText}>Chưa có thông tin học vấn</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phí khám</Text>
            <Text style={styles.feeText}>{formatCurrency(doctor.price)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá khám</Text>
          <Text style={styles.priceValue}>{formatCurrency(doctor.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}>
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
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  doctorHospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#666',
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
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginTop: 4,
  },
  feeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 12,
    width: 15,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  htmlText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default DoctorDetailScreen;
