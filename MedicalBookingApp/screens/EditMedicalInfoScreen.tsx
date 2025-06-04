import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as userService from '../services/userService';

interface EditMedicalInfoScreenProps {
  navigation: any;
}

interface MedicalInfo {
  height: number;
  weight: number;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditMedicalInfoScreen: React.FC<EditMedicalInfoScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [bloodType, setBloodType] = useState<string>('O+');
  const [allergies, setAllergies] = useState<string>('');
  const [chronicDiseases, setChronicDiseases] = useState<string>('');
  
  useEffect(() => {
    loadHealthData();
  }, []);
  
  const loadHealthData = async () => {
    setLoading(true);
    try {
      const healthData = await userService.getUserHealthData();
      
      if (healthData) {
        setHeight(healthData.height?.toString() || '170');
        setWeight(healthData.weight?.toString() || '65');
        setBloodType(healthData.bloodType || 'O+');
        setAllergies(healthData.allergies?.join(', ') || '');
        setChronicDiseases(healthData.chronicDiseases?.join(', ') || '');
      }
    } catch (error) {
      console.log('Error loading health data:', error);
      // Default values are already set
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveHealthData = async () => {
    // Validate inputs
    if (!height || !weight) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin chiều cao và cân nặng');
      return;
    }
    
    const heightNum = parseInt(height, 10);
    const weightNum = parseInt(weight, 10);
    
    if (isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
      Alert.alert('Lỗi', 'Chiều cao không hợp lệ. Vui lòng nhập giá trị từ 50cm đến 250cm');
      return;
    }
    
    if (isNaN(weightNum) || weightNum < 10 || weightNum > 300) {
      Alert.alert('Lỗi', 'Cân nặng không hợp lệ. Vui lòng nhập giá trị từ 10kg đến 300kg');
      return;
    }
    
    setSaving(true);
    
    try {
      // Format health data
      const healthData = {
        height: heightNum,
        weight: weightNum,
        bloodType: bloodType,
        allergies: allergies.split(',').map(item => item.trim()).filter(item => item !== ''),
        chronicDiseases: chronicDiseases.split(',').map(item => item.trim()).filter(item => item !== ''),
      };
      
      // Save to API
      await userService.updateUserHealthData(healthData);
      
      Alert.alert('Thành công', 'Thông tin sức khỏe đã được cập nhật', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error updating health data:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin sức khỏe. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };
  
  const selectBloodType = (type: string) => {
    setBloodType(type);
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin sức khỏe</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Nhập chiều cao (cm)"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Nhập cân nặng (kg)"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nhóm máu</Text>
            <View style={styles.bloodTypeContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodTypeButton,
                    bloodType === type && styles.bloodTypeButtonActive,
                  ]}
                  onPress={() => selectBloodType(type)}
                >
                  <Text
                    style={[
                      styles.bloodTypeText,
                      bloodType === type && styles.bloodTypeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dị ứng</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Nhập các dị ứng, cách nhau bằng dấu phẩy"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bệnh mãn tính</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={chronicDiseases}
              onChangeText={setChronicDiseases}
              placeholder="Nhập các bệnh mãn tính, cách nhau bằng dấu phẩy"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Lưu ý</Text>
            <Text style={styles.infoText}>
              Thông tin sức khỏe của bạn giúp bác sĩ có cái nhìn tổng quan về tình trạng sức khỏe, từ đó đưa ra phương pháp điều trị phù hợp nhất.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveHealthData}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thông tin</Text>
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  bloodTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bloodTypeButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  bloodTypeText: {
    fontSize: 14,
    color: '#333',
  },
  bloodTypeTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditMedicalInfoScreen; 