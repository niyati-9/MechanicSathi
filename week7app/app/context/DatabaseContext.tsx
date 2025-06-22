import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatabaseManager, { User, Workshop, SavedLocation, Review } from '../database/DatabaseManager';

interface DatabaseContextType {
  isInitialized: boolean;
  currentUser: User | null;
  workshops: Workshop[];
  savedLocations: SavedLocation[];
  userReviews: Review[];
  
  // User operations
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (userData: Omit<User, 'id' | 'created_at'>) => Promise<boolean>;
  logoutUser: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  
  // Workshop operations
  loadWorkshops: () => Promise<void>;
  searchWorkshops: (query: string) => Promise<Workshop[]>;
  getNearbyWorkshops: (lat: number, lng: number) => Promise<Workshop[]>;
  
  // Location operations
  saveLocation: (location: Omit<SavedLocation, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  loadSavedLocations: () => Promise<void>;
  deleteSavedLocation: (id: number) => Promise<void>;
  
  // Review operations
  addWorkshopReview: (workshopId: number, rating: number, comment: string) => Promise<void>;
  loadUserReviews: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await DatabaseManager.initializeDatabase();
      setIsInitialized(true);
      await loadWorkshops();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await DatabaseManager.getUserByEmail(email);
      if (user) {
        setCurrentUser(user);
        await loadSavedLocations();
        await loadUserReviews();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const registerUser = async (userData: Omit<User, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const userId = await DatabaseManager.createUser(userData);
      const newUser = { ...userData, id: userId };
      setCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setSavedLocations([]);
    setUserReviews([]);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) return;
    
    try {
      await DatabaseManager.updateUser(currentUser.id!, userData);
      setCurrentUser({ ...currentUser, ...userData });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const loadWorkshops = async () => {
    try {
      const allWorkshops = await DatabaseManager.getAllWorkshops();
      setWorkshops(allWorkshops);
    } catch (error) {
      console.error('Failed to load workshops:', error);
    }
  };

  const searchWorkshops = async (query: string): Promise<Workshop[]> => {
    try {
      return await DatabaseManager.searchWorkshops(query);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  const getNearbyWorkshops = async (lat: number, lng: number): Promise<Workshop[]> => {
    try {
      return await DatabaseManager.getWorkshopsByLocation(lat, lng);
    } catch (error) {
      console.error('Failed to get nearby workshops:', error);
      return [];
    }
  };

  const saveLocation = async (location: Omit<SavedLocation, 'id' | 'created_at' | 'user_id'>) => {
    if (!currentUser) return;
    
    try {
      await DatabaseManager.saveFavoriteLocation({
        ...location,
        user_id: currentUser.id!
      });
      await loadSavedLocations();
    } catch (error) {
      console.error('Failed to save location:', error);
      throw error;
    }
  };

  const loadSavedLocations = async () => {
    if (!currentUser) return;
    
    try {
      const locations = await DatabaseManager.getUserSavedLocations(currentUser.id!);
      setSavedLocations(locations);
    } catch (error) {
      console.error('Failed to load saved locations:', error);
    }
  };

  const deleteSavedLocation = async (id: number) => {
    try {
      await DatabaseManager.deleteSavedLocation(id);
      await loadSavedLocations();
    } catch (error) {
      console.error('Failed to delete location:', error);
      throw error;
    }
  };

  const addWorkshopReview = async (workshopId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    
    try {
      await DatabaseManager.addReview({
        user_id: currentUser.id!,
        workshop_id: workshopId,
        rating,
        comment
      });
      await loadUserReviews();
      await loadWorkshops(); // Refresh to get updated ratings
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  };

  const loadUserReviews = async () => {
    if (!currentUser) return;
    
    try {
      const reviews = await DatabaseManager.getUserReviews(currentUser.id!);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Failed to load user reviews:', error);
    }
  };

  const value: DatabaseContextType = {
    isInitialized,
    currentUser,
    workshops,
    savedLocations,
    userReviews,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    loadWorkshops,
    searchWorkshops,
    getNearbyWorkshops,
    saveLocation,
    loadSavedLocations,
    deleteSavedLocation,
    addWorkshopReview,
    loadUserReviews,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

// Default export - required for route files (using React Native components)
const DatabaseContextPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Context</Text>
      <Text style={styles.description}>
        This is a React Context provider for database operations. 
        It should typically be used to wrap your app components, not as a standalone page.
      </Text>
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Note:</Text>
        <Text style={styles.noteText}>
          If you're seeing this page, you may have accidentally navigated to the context file. 
          Context providers are usually imported and used in your main App component or layout.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  noteContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});

export default DatabaseContextPage;