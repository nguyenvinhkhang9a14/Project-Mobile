import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face',
    medicalInfo: {
      height: 175, // cm
      weight: 70, // kg
      bloodType: 'O+',
      allergies: ['Penicillin', 'Hải sản'],
      chronicDiseases: ['Không'],
    },
  });
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    try {
      const profile = await userService.getCurrentUserProfile();
      if (profile) {
        setUserProfile({
          ...userProfile,
          firstname: profile.firstname || '',
          lastname: profile.lastname || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
        });
        
        // Load health data if available
        try {
          const healthData = await userService.getUserHealthData();
          if (healthData) {
            setUserProfile(prev => ({
              ...prev,
              medicalInfo: {
                height: healthData.height || 175,
                weight: healthData.weight || 70,
                bloodType: healthData.bloodType || 'O+',
                allergies: healthData.allergies || ['Không'],
                chronicDiseases: healthData.chronicDiseases || ['Không'],
              }
            }));
          }
        } catch (error) {
          console.log('Error loading health data:', error);
        }
      }
    } catch (error) {
      console.log('Error loading user profile:', error);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by AuthContext
            } catch (error) {
              Alert.alert('Lỗi', 'Đăng xuất thất bại. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };
  
  const calculateBMI = (weight: number, heightInCm: number): number => {
    const heightInM = heightInCm / 100;
    return weight / (heightInM * heightInM);
  };
  
  const getBMIStatus = (bmi: number): string => {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi >= 18.5 && bmi < 25) return 'Bình thường';
    if (bmi >= 25 && bmi < 30) return 'Thừa cân';
    return 'Béo phì';
  };
  
  const bmi = calculateBMI(userProfile.medicalInfo.weight, userProfile.medicalInfo.height);
  const bmiStatus = getBMIStatus(bmi);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userProfile.firstname} {userProfile.lastname}</Text>
            <Text style={styles.contactInfo}>{userProfile.email}</Text>
            <Text style={styles.contactInfo}>{userProfile.phoneNumber}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>
        
        {/* Medical info section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin sức khỏe</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.healthMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{userProfile.medicalInfo.height}</Text>
                <Text style={styles.metricLabel}>Chiều cao (cm)</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{userProfile.medicalInfo.weight}</Text>
                <Text style={styles.metricLabel}>Cân nặng (kg)</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{userProfile.medicalInfo.bloodType}</Text>
                <Text style={styles.metricLabel}>Nhóm máu</Text>
              </View>
            </View>
            
            <View style={styles.bmiContainer}>
              <View style={styles.bmiInfo}>
                <Text style={styles.bmiLabel}>Chỉ số BMI</Text>
                <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
              </View>
              <View style={styles.bmiStatus}>
                <Text style={styles.bmiStatusText}>{bmiStatus}</Text>
              </View>
            </View>
            
            <View style={styles.medicalInfoItem}>
              <Text style={styles.medicalInfoLabel}>Dị ứng:</Text>
              <Text style={styles.medicalInfoValue}>
                {userProfile.medicalInfo.allergies.join(', ')}
              </Text>
            </View>
            
            <View style={styles.medicalInfoItem}>
              <Text style={styles.medicalInfoLabel}>Bệnh mãn tính:</Text>
              <Text style={styles.medicalInfoValue}>
                {userProfile.medicalInfo.chronicDiseases.join(', ')}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.editMedicalButton} onPress={() => navigation.navigate('EditMedicalInfo')}>
              <Text style={styles.editMedicalText}>Cập nhật thông tin sức khỏe</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Settings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Thông báo đẩy</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d4d4d4', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Chế độ tối</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d4d4d4', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
        
        {/* Actions section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          
          <View style={styles.actionCard}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('MedicalRecords')}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>Hồ sơ bệnh án</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PaymentMethods')}>
              <Text style={styles.actionIcon}>💳</Text>
              <Text style={styles.actionLabel}>Phương thức thanh toán</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('FAQ')}>
              <Text style={styles.actionIcon}>❔</Text>
              <Text style={styles.actionLabel}>Câu hỏi thường gặp</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Support')}>
              <Text style={styles.actionIcon}>🛟</Text>
              <Text style={styles.actionLabel}>Hỗ trợ</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Privacy')}>
              <Text style={styles.actionIcon}>🔒</Text>
              <Text style={styles.actionLabel}>Chính sách bảo mật</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
  settingsIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 18,
    color: '#007AFF',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  bmiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bmiInfo: {
    flex: 1,
  },
  bmiLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  bmiStatus: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bmiStatusText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  medicalInfoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  medicalInfoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  medicalInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  editMedicalButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  editMedicalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionArrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen; 