import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type TabType = 'login' | 'register';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  
  const isValidEmail = (email: string) => {
    // Regex kiểm tra email cơ bản
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await login(loginEmail, loginPassword);
      // Navigation will be handled by the AuthContext
    } catch (error) {
      Alert.alert('Login Failed', typeof error === 'string' ? error : 'Please check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!isValidEmail(registerEmail)) {
      Alert.alert('Error', 'Email không hợp lệ');
      return;
    }
    if (registerPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await register({
        email: registerEmail,
        password: registerPassword,
        firstname: firstName,
        lastname: lastName,
        role,
      });
      
      Alert.alert(
        'Registration Successful', 
        'Your account has been created. You can now login.',
        [{ text: 'OK', onPress: () => setActiveTab('login') }]
      );
    } catch (error) {
      Alert.alert('Registration Failed', typeof error === 'string' ? error : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  const renderLoginTab = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginEmail}
        onChangeText={setLoginEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.forgotPasswordButton}
        onPress={() => Alert.alert('Lỗi', 'Chức năng đang phát triển')}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
    </View>
  );
  
  const renderRegisterTab = () => (
    <View style={styles.formContainer}>
      <View style={styles.nameInputContainer}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Họ"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Tên"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={registerEmail}
        onChangeText={setRegisterEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={registerPassword}
        onChangeText={setRegisterPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <View style={styles.roleSelector}>
        <Text style={styles.roleSelectorLabel}>Đăng ký với tư cách:</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[
              styles.roleOption,
              role === 'patient' && styles.roleOptionSelected,
            ]}
            onPress={() => setRole('patient')}
          >
            <Text style={[
              styles.roleOptionText,
              role === 'patient' && styles.roleOptionTextSelected,
            ]}>
              Bệnh nhân
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.roleOption}
            disabled={true}
          >
            <Text style={[
              styles.roleOptionText,
              role === 'doctor' && styles.roleOptionTextSelected,
              { color: '#ccc' }
            ]}>
              Bác sĩ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Đăng ký</Text>
        )}
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoTitle}>Medical Booking App</Text>
            <Text style={styles.logoSubtitle}>Đặt lịch khám y tế trực tuyến</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'login' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText,
              ]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'register' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'register' && styles.activeTabText,
              ]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 'login' ? renderLoginTab() : renderRegisterTab()}
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleSelector: {
    marginBottom: 20,
  },
  roleSelectorLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  roleOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#666',
  },
  roleOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LoginScreen; 