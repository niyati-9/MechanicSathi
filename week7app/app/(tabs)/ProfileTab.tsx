// app/tabs/ProfileTab.tsx
import { ChevronRight, MapPin, Settings, Star, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

interface ProfileTabProps {
  onLogout?: () => void;
}

export default function ProfileTab({ onLogout }: ProfileTabProps) {
  const handleAccountSettings = () => {
    console.log('Navigate to Account Settings');
  };

  const handleSavedLocations = () => {
    console.log('Navigate to Saved Locations');
  };

  const handleMyReviews = () => {
    console.log('Navigate to My Reviews');
  };

  const handleAppSettings = () => {
    console.log('Navigate to App Settings');
  };

  const handleSignOut = () => {
    console.log('Sign out user');
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: User,
      onPress: handleAccountSettings,
    },
    {
      id: 'locations',
      title: 'Saved Locations',
      icon: MapPin,
      onPress: handleSavedLocations,
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      icon: Star,
      onPress: handleMyReviews,
    },
    {
      id: 'settings',
      title: 'App Settings',
      icon: Settings,
      onPress: handleAppSettings,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#9CA3AF" />
            </View>
          </View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Manage your account and preferences</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Section */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuContainer: {
    gap: 1,
    marginBottom: 32,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  signOutContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  signOutButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
});
