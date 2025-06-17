import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Password Reset Email Sent',
          'If an account exists with this email, you will receive password reset instructions.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Gửi email đặt lại mật khẩu</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen; 