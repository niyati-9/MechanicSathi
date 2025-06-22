import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { AlertTriangle, Phone } from 'lucide-react-native';

interface VehicleType {
  id: string;
  name: string;
  icon: string;
}

interface HomeTabProps {
  onNavigateToWorkshops: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToWorkshops }) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');

  const vehicleTypes: VehicleType[] = [
    { id: 'bike', name: 'Motorcycle', icon: '🏍️' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'bus', name: 'Bus', icon: '🚌' },
    { id: 'truck', name: 'Truck', icon: '🚛' }
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleType(vehicleId);
    // Add a small delay to show the selection before navigating
    setTimeout(() => {
      onNavigateToWorkshops();
    }, 200);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Call 111 Traffic Police for emergency assistance?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:111').catch(err => {
              Alert.alert('Error', 'Unable to make phone call');
              console.error('Error making phone call:', err);
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mechanic Sathi</Text>
          <Text style={styles.subtitle}>Find verified workshops along Nepal's highways</Text>
        </View>

        {/* Emergency SOS Button - Enhanced */}
        <View style={styles.emergencyContainer}>
          <TouchableOpacity 
            style={styles.sosButton}
            onPress={handleEmergencyCall}
            activeOpacity={0.8}
          >
            <View style={styles.sosIconContainer}>
              <AlertTriangle size={32} color="white" />
              <Phone size={24} color="white" style={styles.phoneIcon} />
            </View>
            <View style={styles.sosTextContainer}>
              <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
              <Text style={styles.sosCallText}>Call 111 Traffic Police</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.sosDescription}>
            🚨 Tap to instantly call 111 for traffic police assistance
          </Text>
        </View>

        {/* Vehicle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
          <View style={styles.vehicleGrid}>
            {vehicleTypes.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                onPress={() => handleVehicleSelect(vehicle.id)}
                style={[
                  styles.vehicleButton,
                  selectedVehicleType === vehicle.id && styles.vehicleButtonActive
                ]}
              >
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <Text style={[
                  styles.vehicleName,
                  selectedVehicleType === vehicle.id && styles.vehicleNameActive
                ]}>{vehicle.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Verified Workshops</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
            <Text style={[styles.statNumber, { color: '#2563EB' }]}>24/7</Text>
            <Text style={[styles.statLabel, { color: '#1D4ED8' }]}>Emergency Support</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 13,
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#DC2626',
    paddingBottom: 8,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F87171',
    marginBottom: 28,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  sosButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#991B1B',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#B91C1C',
  },
  sosIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  phoneIcon: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#991B1B',
    borderRadius: 10,
    padding: 1,
  },
  sosTextContainer: {
    alignItems: 'center',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sosCallText: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  sosDescription: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  vehicleButtonActive: {
    borderColor: '#1D4ED8',
    borderWidth: 4,
    backgroundColor: '#EBF4FF',
    transform: [{ scale: 1.05 }],
  },
  vehicleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  vehicleNameActive: {
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#15803D',
    textAlign: 'center',
  },
});

export default HomeTab;