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
  Dimensions,
} from 'react-native';

interface Specialty {
  id: string;
  name: string;
  description: string;
  // doctorCount: number;
  icon: string; // URL or asset name
}

interface SpecialtyListScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;

const SpecialtyListScreen: React.FC<SpecialtyListScreenProps> = ({ navigation }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  
  useEffect(() => {
    fetchSpecialties();
  }, []);
  
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty => 
        specialty.name.toLowerCase().includes(searchText.toLowerCase()) ||
        specialty.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchText, specialties]);
  
  const fetchSpecialties = async () => {
    setLoading(true);
    
    // In a real app, fetch from API
    setTimeout(() => {
      const mockSpecialties: Specialty[] = [
        {
          id: '1',
          name: 'Tim mạch',
          description: 'Chẩn đoán và điều trị các bệnh lý về tim mạch',
         
          icon: 'https://img.icons8.com/color/96/000000/heart-with-pulse.png',
        },
        {
          id: '2',
          name: 'Da liễu',
          description: 'Chẩn đoán và điều trị các bệnh về da',
       
          icon: 'https://img.icons8.com/color/96/000000/skin.png',
        },
        {
          id: '3',
          name: 'Thần kinh',
          description: 'Chẩn đoán và điều trị các bệnh về hệ thần kinh',
        
          icon: 'https://img.icons8.com/color/96/000000/brain.png',
        },
        {
          id: '4',
          name: 'Tai mũi họng',
          description: 'Chẩn đoán và điều trị các bệnh về tai, mũi, họng',
        
          icon: 'https://img.icons8.com/color/96/000000/throat.png',
        },
        {
          id: '5',
          name: 'Nhãn khoa',
          description: 'Chẩn đoán và điều trị các bệnh về mắt',
      
          icon: 'https://img.icons8.com/color/96/000000/ophthalmology.png',
        },
        {
          id: '6',
          name: 'Nhi khoa',
          description: 'Chẩn đoán và điều trị các bệnh ở trẻ em',
         
          icon: 'https://img.icons8.com/color/96/000000/baby.png',
        },
        {
          id: '7',
          name: 'Nội tiết',
          description: 'Chẩn đoán và điều trị các bệnh về nội tiết',
        
          icon: 'https://img.icons8.com/color/96/000000/insulin-pen.png',
        },
        {
          id: '8',
          name: 'Sản phụ khoa',
          description: 'Chẩn đoán và điều trị các bệnh phụ nữ và thai sản',
         
          icon: 'https://img.icons8.com/color/96/000000/mother.png',
        },
      ];
      
      setSpecialties(mockSpecialties);
      setFilteredSpecialties(mockSpecialties);
      setLoading(false);
    }, 1500);
  };
  
  const handleSpecialtyPress = (specialtyId: string, specialtyName: string) => {
    navigation.navigate('DoctorsBySpecialty', { specialtyId, specialtyName });
  };
  
  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() => handleSpecialtyPress(item.id, item.name)}
    >
      <Image source={{ uri: item.icon }} style={styles.specialtyIcon} />
      <Text style={styles.specialtyName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chuyên khoa</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm chuyên khoa..."
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải danh sách chuyên khoa...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpecialties}
          renderItem={renderSpecialtyItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không tìm thấy chuyên khoa nào phù hợp.
              </Text>
            </View>
          }
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    color: '#999',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  specialtyCard: {
    width: (width - 48) / COLUMN_COUNT,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  specialtyIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  doctorCount: {
    fontSize: 13,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SpecialtyListScreen; 