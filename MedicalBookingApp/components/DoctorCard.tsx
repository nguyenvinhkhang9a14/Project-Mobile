import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './IconButton';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    hospital: string;
    image: string;
    consultationFee: number;
    availability: string;
  };
  onPress: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`star-${i}`} name="star" size={14} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Text key="half-star" style={{ color: '#FFD700', fontSize: 14 }}>★</Text>);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Text key={`empty-${i}`} style={{ color: '#E0E0E0', fontSize: 14 }}>★</Text>);
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{stars}</View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.doctorCard} onPress={onPress}>
      <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.hospital}>{doctor.hospital}</Text>
        {renderStars(doctor.rating)}
        <View style={styles.experienceContainer}>
          <Icon name="time" size={14} color="#666" />
          <Text style={styles.experience}>{doctor.experience}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.fee}>{formatCurrency(doctor.consultationFee)}</Text>
        <View style={[
          styles.availabilityBadge, 
          doctor.availability === 'available' ? styles.availableBadge : styles.busyBadge
        ]}>
          <Text style={[
            styles.availabilityText,
            doctor.availability === 'available' ? styles.availableText : styles.busyText
          ]}>
            {doctor.availability === 'available' ? 'Có lịch trống' : 'Bận'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  hospital: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experience: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  fee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#E8F5E9',
  },
  busyBadge: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: 12,
  },
  availableText: {
    color: '#4CAF50',
  },
  busyText: {
    color: '#F44336',
  },
});

export default DoctorCard; 