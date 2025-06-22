import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { MapPin, Phone, Clock, Star } from 'lucide-react-native';
import { useDatabase } from '../context/DatabaseContext';
import { Workshop } from '../database/DatabaseManager';

// Extend the Workshop type to include isOpen status
interface WorkshopWithStatus extends Workshop {
  isOpen: boolean;
}

export default function WorkshopsTab() {
  const { workshops } = useDatabase();

  // Function to determine if workshop is currently open
  const isWorkshopOpen = (hours: string, is24x7?: boolean): boolean => {
    // Always return true to show all workshops as open
    return true;
  };

  const handleCallWorkshop = async (phone: string) => {
    try {
      const phoneUrl = `tel:${phone}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      console.error('Error making phone call:', error);
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleGetDirections = async () => {
    try {
      // Just open Google Maps without any specific location
      const googleMapsApp = `comgooglemaps://`;
      const googleMapsWeb = `https://maps.google.com/`;
      
      const canOpenApp = await Linking.canOpenURL(googleMapsApp);
      
      if (canOpenApp) {
        await Linking.openURL(googleMapsApp);
      } else {
        // Fallback to web version
        const canOpenWeb = await Linking.canOpenURL(googleMapsWeb);
        if (canOpenWeb) {
          await Linking.openURL(googleMapsWeb);
        } else {
          Alert.alert('Error', 'Unable to open maps application');
        }
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert('Error', 'Unable to open directions');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Nearby Workshops</Text>
          <Text style={styles.subtitle}>{workshops.length} found</Text>
        </View>

        {workshops.map((workshop) => {
          // Add isOpen status to workshop
          const workshopWithStatus: WorkshopWithStatus = {
            ...workshop,
            isOpen: isWorkshopOpen(workshop.hours, (workshop as any).is24x7)
          };
          
          const parsedServices = Array.isArray(workshopWithStatus.services)
            ? workshopWithStatus.services
            : JSON.parse(workshopWithStatus.services || '[]');

          return (
            <View key={workshopWithStatus.id} style={styles.workshopCard}>
              <View style={styles.workshopHeader}>
                <Text style={styles.workshopName}>{workshopWithStatus.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FCD34D" fill="#FCD34D" />
                  <Text style={styles.rating}>{workshopWithStatus.rating}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {workshopWithStatus.location} • {workshopWithStatus.highway}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {workshopWithStatus.hours} • 
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      workshopWithStatus.isOpen ? styles.openStatus : styles.closedStatus
                    ]}
                  >
                    {workshopWithStatus.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>

              <View style={styles.servicesContainer}>
                {parsedServices.map((service: string, index: number) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCallWorkshop(workshopWithStatus.phone)}
                >
                  <Phone size={16} color="white" />
                  <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => handleGetDirections()}
                >
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  workshopCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workshopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  openStatus: {
    color: '#16A34A', // Green color for open
  },
  closedStatus: {
    color: '#DC2626', // Red color for closed
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  serviceTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 12,
    color: '#374151',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});