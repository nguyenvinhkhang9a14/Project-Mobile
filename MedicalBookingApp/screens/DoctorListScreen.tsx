import React, {useState, useEffect} from 'react';
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
  Alert,
} from 'react-native';
import {
  getAllDoctors,
  searchDoctors,
} from '../services/doctorService';
import {Doctor, Specialty} from '../interfaces';

const DoctorListScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, filterDoctors, searchText]);

  const fetchInitialData = async () => {
    await Promise.all([fetchDoctors()]);
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await getAllDoctors();
      console.log('Doctors list:', doctorsData);
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDoctors();
    setRefreshing(false);
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(
        doctor => doctor.specialty?.id === selectedSpecialty,
      );
    }

    // Filter by search text
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(doctor => {
        const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
        const specialtyName =
          doctor.specialty?.nameSpecialty?.toLowerCase() || '';
        const clinicName = doctor.clinic?.nameClinic?.toLowerCase() || '';

        return (
          fullName.includes(searchLower) ||
          specialtyName.includes(searchLower) ||
          clinicName.includes(searchLower)
        );
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleSearch = async (keyword: string) => {
    if (keyword.trim() === '') {
      await fetchDoctors();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchDoctors(keyword);
      setDoctors(searchResults);
      setFilteredDoctors(searchResults);
    } catch (error) {
      console.error('Error searching doctors:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getFullName = (doctor: Doctor) => {
    const title = doctor.title ? `${doctor.title} ` : '';
    return `${title}${doctor.firstname} ${doctor.lastname}`;
  };

  const renderDoctorItem = ({item}: {item: Doctor}) => {
    console.log('Doctor image path:', item.image);
    console.log('Doctor object:', item);

    return (
      <TouchableOpacity
        style={styles.doctorCard}
        onPress={() =>
          navigation.navigate('DoctorDetail', {doctorId: item.doctorId})
        }>
        <Image
          source={{uri: `http://10.0.2.2:5000${item.image}`}}
          style={styles.doctorImage}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{getFullName(item)}</Text>
          <Text style={styles.doctorSpecialty}>
            {item.specialty?.nameSpecialty || 'Chưa có chuyên khoa'}
          </Text>
          <Text style={styles.doctorHospital}>
            {item.clinic?.nameClinic || 'Chưa có phòng khám'}
          </Text>
          <View style={styles.doctorDetails}>
            <View style={styles.doctorDetail}>
              <Text style={styles.doctorDetailLabel}>Giá khám:</Text>
              <Text style={styles.doctorDetailValue}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchText || selectedSpecialty !== 'all'
          ? 'Không tìm thấy bác sĩ phù hợp'
          : 'Chưa có bác sĩ nào'}
      </Text>
      {searchText || selectedSpecialty !== 'all'}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />

  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bác sĩ</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.refreshButton}>⟳</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bác sĩ..."
          value={searchText}
          onChangeText={handleSearchChange}
          onSubmitEditing={() => handleSearch(searchText)}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyList}
        contentContainerStyle={styles.specialtyListContent}
        data={undefined}
        renderItem={undefined}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => (item.doctorId?.toString() ?? item.id?.toString() ?? Math.random().toString())}
          renderItem={renderDoctorItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.doctorList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
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
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  refreshButton: {
    fontSize: 20,
    color: '#007AFF',
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
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  specialtyList: {
    maxHeight: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specialtyListContent: {
    paddingHorizontal: 10,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  doctorList: {
    padding: 16,
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DoctorListScreen;
