import * as SQLite from 'expo-sqlite';

const DB_NAME = 'highway_mechanic.db';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export interface Workshop {
  id?: number;
  name: string;
  location: string;
  highway: string;
  latitude: number;
  longitude: number;
  phone: string;
  rating: number;
  services: string;
  is_24x7: boolean;
  hours: string;
  created_at?: string;
}

export interface SavedLocation {
  id?: number;
  user_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at?: string;
}

export interface Review {
  id?: number;
  user_id: number;
  workshop_id: number;
  rating: number;
  comment: string;
  created_at?: string;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Users table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Workshops table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workshops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        highway TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        phone TEXT NOT NULL,
        rating REAL DEFAULT 0,
        services TEXT NOT NULL,
        is_24x7 BOOLEAN DEFAULT 0,
        hours TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Saved locations table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Reviews table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workshop_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (workshop_id) REFERENCES workshops (id)
      );
    `);
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) return;

    // Check if workshops already exist
    const result = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM workshops');
    if ((result as any)?.count > 0) return;

    // Insert sample workshops
    const workshops = [
      {
        name: "Kathmandu Auto Service",
        location: "Kalanki, Kathmandu",
        highway: "Prithvi Highway",
        latitude: 27.6915,
        longitude: 85.2890,
        phone: "+977-1-4123456",
        rating: 4.5,
        services: "Engine Repair,Tire Change,Battery",
        is_24x7: 0,
        hours: "6:00 AM - 8:00 PM"
      },
      {
        name: "Pokhara Highway Garage",
        location: "Dumre, Tanahun",
        highway: "Prithvi Highway",
        latitude: 27.9881,
        longitude: 84.4100,
        phone: "+977-65-123456",
        rating: 4.2,
        services: "Towing,Engine Repair,AC Service",
        is_24x7: 1,
        hours: "24/7"
      },
      {
        name: "Chitwan Auto Works",
        location: "Bharatpur, Chitwan",
        highway: "East-West Highway",
        latitude: 27.6839,
        longitude: 84.4347,
        phone: "+977-56-789012",
        rating: 4.0,
        services: "Brake Service,Tire Change,Oil Change",
        is_24x7: 0,
        hours: "7:00 AM - 6:00 PM"
      }
    ];

    for (const workshop of workshops) {
      await this.db.runAsync(
        `INSERT INTO workshops (name, location, highway, latitude, longitude, phone, rating, services, is_24x7, hours) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [workshop.name, workshop.location, workshop.highway, workshop.latitude, workshop.longitude, 
         workshop.phone, workshop.rating, workshop.services, workshop.is_24x7, workshop.hours]
      );
    }
  }

  // User operations
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
      [user.name, user.email, user.phone]
    );
    return result.lastInsertRowId;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as User | null;
    return user;
  }

  async updateUser(id: number, user: Partial<User>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');
    const values = Object.values(user);
    
    await this.db.runAsync(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, id]
    );
  }

  // Workshop operations
  async getAllWorkshops(): Promise<Workshop[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const workshops = await this.db.getAllAsync('SELECT * FROM workshops ORDER BY rating DESC') as Workshop[];
    return workshops.map(workshop => ({
      ...workshop,
      services: workshop.services.split(','),
      is_24x7: Boolean(workshop.is_24x7)
    })) as any[];
  }

  async getWorkshopsByLocation(latitude: number, longitude: number, radius: number = 50): Promise<Workshop[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Simple distance calculation (for more accurate results, use Haversine formula)
    const workshops = await this.db.getAllAsync(`
      SELECT *, 
        ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) as distance
      FROM workshops 
      WHERE distance < ? 
      ORDER BY distance, rating DESC
    `, [latitude, latitude, longitude, longitude, radius]) as Workshop[];
    
    return workshops.map(workshop => ({
      ...workshop,
      services: workshop.services.split(','),
      is_24x7: Boolean(workshop.is_24x7)
    })) as any[];
  }

  async searchWorkshops(query: string): Promise<Workshop[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const workshops = await this.db.getAllAsync(`
      SELECT * FROM workshops 
      WHERE name LIKE ? OR location LIKE ? OR highway LIKE ? OR services LIKE ?
      ORDER BY rating DESC
    `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]) as Workshop[];
    
    return workshops.map(workshop => ({
      ...workshop,
      services: workshop.services.split(','),
      is_24x7: Boolean(workshop.is_24x7)
    })) as any[];
  }

  // Saved locations operations
  async saveFavoriteLocation(location: Omit<SavedLocation, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO saved_locations (user_id, name, latitude, longitude, address) VALUES (?, ?, ?, ?, ?)',
      [location.user_id, location.name, location.latitude, location.longitude, location.address]
    );
    return result.lastInsertRowId;
  }

  async getUserSavedLocations(userId: number): Promise<SavedLocation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync(
      'SELECT * FROM saved_locations WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    ) as SavedLocation[];
  }

  async deleteSavedLocation(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync('DELETE FROM saved_locations WHERE id = ?', [id]);
  }

  // Review operations
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO reviews (user_id, workshop_id, rating, comment) VALUES (?, ?, ?, ?)',
      [review.user_id, review.workshop_id, review.rating, review.comment]
    );
    
    // Update workshop rating
    await this.updateWorkshopRating(review.workshop_id);
    
    return result.lastInsertRowId;
  }

  async getWorkshopReviews(workshopId: number): Promise<Review[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.workshop_id = ? 
      ORDER BY r.created_at DESC
    `, [workshopId]) as Review[];
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync(`
      SELECT r.*, w.name as workshop_name 
      FROM reviews r 
      JOIN workshops w ON r.workshop_id = w.id 
      WHERE r.user_id = ? 
      ORDER BY r.created_at DESC
    `, [userId]) as Review[];
  }

  private async updateWorkshopRating(workshopId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE workshop_id = ?',
      [workshopId]
    ) as { avg_rating: number };
    
    if (result.avg_rating) {
      await this.db.runAsync(
        'UPDATE workshops SET rating = ? WHERE id = ?',
        [Math.round(result.avg_rating * 10) / 10, workshopId]
      );
    }
  }

  // Close database connection
  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new DatabaseManager();