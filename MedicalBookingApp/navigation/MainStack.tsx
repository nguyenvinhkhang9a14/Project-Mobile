import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomePage';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import BookingCompleteScreen from '../screens/BookingCompleteScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SpecialtyListScreen from '../screens/SpecialtyListScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditMedicalInfoScreen from '../screens/EditMedicalInfoScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  DoctorList: undefined;
  DoctorDetail: { doctorId: string };
  BookAppointment: { doctorId: string; doctorName: string };
  BookingComplete: { doctorName: string; date: string; time: string };
  MyBookings: undefined;
  BookingDetail: { bookingId: string; mode?: string };
  SpecialtyList: undefined;
  DoctorsBySpecialty: { specialtyId: string; specialtyName: string };
  EditProfile: undefined;
  EditMedicalInfo: undefined;
  Settings: undefined;
};

export type PatientTabsParamList = {
  Home: undefined;
  Doctors: undefined;
  Specialties: undefined;
  Appointments: undefined;
  Profile: undefined;
  BookingDetail: { bookingId: string; mode?: string };
  DoctorDetail: { doctorId: string };
};

export type DoctorTabsParamList = {
  Home: undefined;
  Schedule: undefined;
  Patients: undefined;
  Profile: undefined;
};


const Stack = createNativeStackNavigator<MainStackParamList>();
const PatientTab = createBottomTabNavigator<PatientTabsParamList>();
const DoctorTab = createBottomTabNavigator<DoctorTabsParamList>();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Doctors':
        return '👨‍⚕️';
      case 'Specialties':
        return '🏥';
      case 'Appointments':
      case 'Schedule':
        return '📅';
      case 'Profile':
        return '👤';
      case 'Patients':
        return '👥';
      default:
        return '•';
    }
  };
  
  return (
    <Text style={{ 
      fontSize: 20, 
      opacity: focused ? 1 : 0.5,
    }}>
      {getIcon()}
    </Text>
  );
};

// Patient tabs navigator
const PatientTabs = () => {
  return (
    <PatientTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingVertical: 5,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <PatientTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <PatientTab.Screen
        name="Doctors"
        component={DoctorListScreen}
        options={{
          tabBarLabel: 'Bác sĩ',
          tabBarIcon: ({ focused }) => <TabIcon name="Doctors" focused={focused} />,
        }}
      />
      <PatientTab.Screen
        name="Specialties"
        component={SpecialtyListScreen}
        options={{
          tabBarLabel: 'Chuyên khoa',
          tabBarIcon: ({ focused }) => <TabIcon name="Specialties" focused={focused} />,
        }}
      />
      <PatientTab.Screen
        name="Appointments"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Lịch khám',
          tabBarIcon: ({ focused }) => <TabIcon name="Appointments" focused={focused} />,
        }}
      />
      <PatientTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </PatientTab.Navigator>
  );
};

// Doctor tabs navigator
const DoctorTabs = () => {
  return (
    <DoctorTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingVertical: 5,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <DoctorTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <DoctorTab.Screen
        name="Patients"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Bệnh nhân',
          tabBarIcon: ({ focused }) => <TabIcon name="Patients" focused={focused} />,
        }}
      />
      <DoctorTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </DoctorTab.Navigator>
  );
};

// Role-based tabs selector component
const RoleBasedTabs = () => {
  const { user, isDoctor, isPatient } = useAuth();
  
  if (isDoctor()) {
    return <DoctorTabs />;
  } else {
    return <PatientTabs />;
  }
};

// Add type casting for screens with props to fix type errors
const typedBookingDetailScreen = BookingDetailScreen as React.ComponentType<any>;

// Main stack navigator
const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={RoleBasedTabs} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="BookingComplete" component={BookingCompleteScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="BookingDetail" component={typedBookingDetailScreen} />
      <Stack.Screen name="SpecialtyList" component={SpecialtyListScreen} />
      <Stack.Screen name="DoctorsBySpecialty" component={SpecialtyListScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditMedicalInfo" component={EditMedicalInfoScreen} />
    </Stack.Navigator>
  );
};

export default MainStack; 