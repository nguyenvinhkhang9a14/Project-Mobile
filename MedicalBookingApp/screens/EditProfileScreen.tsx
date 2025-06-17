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
  Image,
} from 'react-native';
import * as userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user, updateUserInfo } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face');
  
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await userService.getCurrentUserProfile();
      
      if (profile) {
        setFirstName(profile.firstname || '');
        setLastName(profile.lastname || '');
        setEmail(profile.email || '');
        setPhoneNumber(profile.phoneNumber || '');
        setAddress(profile.address || '');
        if (profile.image) {
          setAvatar(profile.image);
        }
      }
    } catch (error) {
      console.log('Error loading user profile:', error);
      
      if (user) {
        setFirstName(user.firstname || '');
        setLastName(user.lastname || '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }
    
    setSaving(true);
    
    try {
      const updatedProfile = await userService.updateUserProfile({
        firstname: firstName,
        lastname: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
      });
      
      if (updateUserInfo) {
        updateUserInfo({
          firstname: firstName,
          lastname: lastName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
        });
      }
      
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error updating profile:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleChangeAvatar = () => {
    Alert.alert('Tính năng đang phát triển', 'Chức năng thay đổi ảnh đại diện sẽ sớm được cập nhật');
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
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChangeAvatar}>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Nhập họ của bạn"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nhập tên của bạn"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ của bạn"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  changeAvatarButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  changeAvatarText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
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

export default EditProfileScreen; 