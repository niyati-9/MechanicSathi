// app/components/BottomNavigation.tsx
import { Home, Settings, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabType = 'home' | 'workshops' | 'profile';

interface TabItem {
  id: TabType;
  icon: React.ComponentType<any>;
  label: string;
}

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs: TabItem[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'workshops', icon: Settings, label: 'Workshops' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <tab.icon
              size={20}
              color={activeTab === tab.id ? '#3B82F6' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.id ? '#3B82F6' : '#6B7280' }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});