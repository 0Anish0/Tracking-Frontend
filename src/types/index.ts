export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  socketId?: string;
  deviceId?: string;
  driverName?: string;
  speed?: number;
  heading?: number;
}

export interface Driver {
  deviceId: string;
  driverName: string;
  isActive: boolean;
  lastSeen: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  phoneNumber?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
  };
  status: 'active' | 'inactive' | 'offline';
  totalDistance?: number;
  averageSpeed?: number;
  hoursWorked?: number;
}

export interface LocationHistory {
  id: string;
  location: LocationData;
  timestamp: number;
}

export interface FilterOptions {
  status: 'all' | 'active' | 'inactive' | 'offline';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  speedRange: {
    min: number;
    max: number;
  };
  region: string;
}

export interface AlertData {
  id: string;
  type: 'speed' | 'offline' | 'geofence' | 'maintenance' | 'emergency';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  driverId?: string;
  resolved: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface GeofenceData {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: number[][];
  radius?: number; // for circle type
  active: boolean;
  alertOnEntry: boolean;
  alertOnExit: boolean;
}

export interface TripData {
  id: string;
  driverId: string;
  startTime: Date;
  endTime?: Date;
  startLocation: LocationData;
  endLocation?: LocationData;
  distance: number;
  averageSpeed: number;
  maxSpeed: number;
  route: LocationData[];
  status: 'ongoing' | 'completed' | 'paused';
}

export interface AnalyticsData {
  totalDrivers: number;
  activeDrivers: number;
  totalDistance: number;
  averageSpeed: number;
  totalTrips: number;
  fuelConsumption?: number;
  alerts: AlertData[];
  dailyStats: {
    date: string;
    activeDrivers: number;
    totalDistance: number;
    averageSpeed: number;
    alerts: number;
  }[];
  weeklyStats: {
    week: string;
    activeDrivers: number;
    totalDistance: number;
    averageSpeed: number;
    efficiency: number;
  }[];
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  permissions: string[];
  lastLogin: Date;
}

export interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'active' | 'maintenance' | 'inactive';
  assignedDriverId?: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  insurance: {
    provider: string;
    expiryDate: Date;
    policyNumber: string;
  };
}

export interface RouteData {
  id: string;
  name: string;
  description?: string;
  waypoints: LocationData[];
  estimatedDuration: number; // in minutes
  estimatedDistance: number; // in km
  assignedDriverIds: string[];
  active: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'delivery' | 'pickup' | 'transport' | 'maintenance';
}

export interface DashboardConfig {
  widgets: {
    id: string;
    type: 'map' | 'stats' | 'alerts' | 'drivers' | 'analytics';
    position: { x: number; y: number; w: number; h: number };
    visible: boolean;
    config?: Record<string, any>;
  }[];
  theme: 'light' | 'dark';
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket Events
export interface SocketEvents {
  'connect': () => void;
  'disconnect': () => void;
  'locationUpdate': (data: LocationData) => void;
  'driversUpdate': (data: Driver[]) => void;
  'alertUpdate': (data: AlertData) => void;
  'driverStatusChange': (data: { driverId: string; status: Driver['status'] }) => void;
}