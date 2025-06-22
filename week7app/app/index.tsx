import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import HomeTab from './(tabs)/HomeTab';
import WorkshopsTab from './(tabs)/WorkshopsTab';
import ProfileTab from './(tabs)/ProfileTab';
import BottomNavigation from './components/BottomNavigation';
import LoginSignupScreen from './screens/LoginSignupScreen';

export type TabType = 'home' | 'workshops' | 'profile';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { isInitialized, currentUser, logoutUser } = useDatabase();

  const handleLogout = () => {
    logoutUser();
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigateToWorkshops={() => setActiveTab('workshops')} />;
      case 'workshops':
        return <WorkshopsTab />;
      case 'profile':
        return <ProfileTab onLogout={handleLogout} />;
      default:
        return <HomeTab onNavigateToWorkshops={() => setActiveTab('workshops')} />;
    }
  };

  if (!isInitialized) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Initializing app...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return <LoginSignupScreen />;
  }

  return (
    <>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <AppContent />
        </SafeAreaView>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
});