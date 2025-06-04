// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import axios from 'axios';

// Import navigation stacks
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';

// Import context
import { AuthProvider, useAuth } from './context/AuthContext';

// Add axios dependencies
axios.defaults.timeout = 15000;

// Main navigator component that handles auth state
const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
