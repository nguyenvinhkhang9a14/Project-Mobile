import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './IconButton';

interface AppointmentCardProps {
  appointment: {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
    hospital: string;
    doctorImage: string;
  };
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onViewDetails,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Image
          source={{ uri: appointment.doctorImage }}
          style={styles.doctorAvatar}
        />
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.specialty}>{appointment.specialty}</Text>
          <Text style={styles.hospital}>{appointment.hospital}</Text>
        </View>
        <View style={styles.appointmentTime}>
          <Text style={styles.appointmentDate}>{formatDate(appointment.date)}</Text>
          <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
        </View>
      </View>
      <View style={styles.appointmentActions}>
        {onReschedule && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={onReschedule}
          >
            <Icon name="calendar" size={16} color="#007AFF" />
            <Text style={styles.rescheduleText}>Đổi lịch</Text>
          </TouchableOpacity>
        )}
        {onCancel && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Icon name="close-circle" size={16} color="#FF3B30" />
            <Text style={styles.cancelText}>Hủy lịch</Text>
          </TouchableOpacity>
        )}
        {onViewDetails && (
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton]}
            onPress={onViewDetails}
          >
            <Icon name="info" size={16} color="#5AC8FA" />
            <Text style={styles.detailsText}>Chi tiết</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
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
    fontSize: 12,
    color: '#888',
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  appointmentTimeText: {
    fontSize: 14,
    color: '#666',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  rescheduleButton: {
    backgroundColor: '#E3F2FD',
  },
  rescheduleText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
  },
  cancelText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FF3B30',
  },
  detailsButton: {
    backgroundColor: '#E1F5FE',
  },
  detailsText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#5AC8FA',
  },
});

export default AppointmentCard; 