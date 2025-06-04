import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Định nghĩa interfaces
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  hospital: string;
  image: string;
  consultationFee: number;
}

type SpecialtyTab = string;

// Sample doctor data - would be fetched from API
const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'PGS.TS Nguyễn Văn D',
    specialty: 'Thần kinh',
    rating: 4.9,
    experience: '15+ năm',
    hospital: 'BV Đại học Y Dược',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
    consultationFee: 300000,
  },
  {
    id: '2',
    name: 'ThS.BS Phạm Thị E',
    specialty: 'Sản phụ khoa',
    rating: 4.8,
    experience: '12+ năm',
    hospital: 'BV Từ Dũ',
    image: 'https://images.unsplash.com/photo-1594824811330-29bb38ce51d3?w=80&h=80&fit=crop&crop=face',
    consultationFee: 250000,
  },
  {
    id: '3',
    name: 'BS.CK2 Trần Minh F',
    specialty: 'Nhi khoa',
    rating: 4.7,
    experience: '10+ năm',
    hospital: 'BV Nhi Đồng 1',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face',
    consultationFee: 280000,
  },
  {
    id: '4',
    name: 'BS. Lê Hoàng G',
    specialty: 'Da liễu',
    rating: 4.5,
    experience: '8+ năm',
    hospital: 'BV Da Liễu',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face',
    consultationFee: 220000,
  },
];

// Sample specialties for filtering
const specialties = [
  'Tất cả',
  'Thần kinh',
  'Sản phụ khoa',
  'Nhi khoa',
  'Da liễu',
  'Tim mạch',
  'Tai mũi họng',
];

const DoctorListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả');
  const [filteredDoctors, setFilteredDoctors] = useState(initialDoctors);

  useEffect(() => {
    // In a real app, fetch data from API here
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDoctors(initialDoctors);
      setFilteredDoctors(initialDoctors);
      setLoading(false);
    }, 1000);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(text.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
    if (specialty === 'Tất cả') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorHospital}>{item.hospital}</Text>
        <View style={styles.doctorDetails}>
          <View style={styles.doctorDetail}>
            <Text style={styles.doctorDetailLabel}>Kinh nghiệm:</Text>
            <Text style={styles.doctorDetailValue}>{item.experience}</Text>
          </View>
          <View style={styles.doctorDetail}>
            <Text style={styles.doctorDetailLabel}>Giá khám:</Text>
            <Text style={styles.doctorDetailValue}>{formatCurrency(item.consultationFee)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Text style={styles.ratingIcon}>⭐</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSpecialtyItem = ({ item }: { item: SpecialtyTab }) => (
    <TouchableOpacity
      style={[
        styles.specialtyButton,
        selectedSpecialty === item && styles.specialtyButtonActive,
      ]}
      onPress={() => handleSpecialtyFilter(item)}
    >
      <Text
        style={[
          styles.specialtyButtonText,
          selectedSpecialty === item && styles.specialtyButtonTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bác sĩ</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
          value={searchText}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Specialty Filter */}
      <FlatList
        horizontal
        data={specialties}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyList}
      />

      {/* Doctor List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.doctorList}
        />
      )}
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
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  specialtyList: {
    maxHeight: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specialtyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  specialtyButtonActive: {
    backgroundColor: '#007AFF',
  },
  specialtyButtonText: {
    fontSize: 14,
    color: '#555',
  },
  specialtyButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorList: {
    padding: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  doctorHospital: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  doctorDetails: {
    flexDirection: 'column',
    gap: 4,
  },
  doctorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorDetailLabel: {
    fontSize: 13,
    color: '#888',
    marginRight: 4,
  },
  doctorDetailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 2,
  },
  ratingIcon: {
    fontSize: 12,
  },
});

export default DoctorListScreen; 