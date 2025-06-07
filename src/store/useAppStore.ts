import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Driver, LocationData, FilterOptions, AlertData } from '../types';

interface AppState {
  // Driver management
  drivers: Driver[];
  activeDrivers: Driver[];
  selectedDriver: Driver | null;
  
  // Location data
  locations: Map<string, LocationData>;
  locationHistory: LocationData[];
  
  // Real-time connection
  isConnected: boolean;
  connectionStatus: string;
  lastUpdate: Date | null;
  
  // UI state
  sidebarCollapsed: boolean;
  viewMode: 'all' | 'single' | 'fleet';
  showAccuracyCircle: boolean;
  activeTab: string;
  
  // Filters and search
  filters: FilterOptions;
  searchQuery: string;
  
  // Analytics
  analytics: {
    totalDrivers: number;
    activeDrivers: number;
    totalDistance: number;
    averageSpeed: number;
    alerts: AlertData[];
  };
  
  // Actions
  setDrivers: (drivers: Driver[]) => void;
  setActiveDrivers: (drivers: Driver[]) => void;
  selectDriver: (driver: Driver | null) => void;
  updateLocation: (deviceId: string, location: LocationData) => void;
  addLocationToHistory: (location: LocationData) => void;
  clearLocationHistory: () => void;
  setConnectionStatus: (status: string, connected: boolean) => void;
  setLastUpdate: (date: Date) => void;
  toggleSidebar: () => void;
  setViewMode: (mode: 'all' | 'single' | 'fleet') => void;
  toggleAccuracyCircle: () => void;
  setActiveTab: (tab: string) => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  updateAnalytics: (analytics: Partial<AppState['analytics']>) => void;
  addAlert: (alert: AlertData) => void;
  removeAlert: (alertId: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      drivers: [],
      activeDrivers: [],
      selectedDriver: null,
      locations: new Map(),
      locationHistory: [],
      isConnected: false,
      connectionStatus: 'Disconnected',
      lastUpdate: null,
      sidebarCollapsed: false,
      viewMode: 'all',
      showAccuracyCircle: true,
      activeTab: 'dashboard',
      filters: {
        status: 'all',
        dateRange: { start: null, end: null },
        speedRange: { min: 0, max: 200 },
        region: 'all'
      },
      searchQuery: '',
      analytics: {
        totalDrivers: 0,
        activeDrivers: 0,
        totalDistance: 0,
        averageSpeed: 0,
        alerts: []
      },

      // Actions
      setDrivers: (drivers) => set({ drivers }),
      
      setActiveDrivers: (drivers) => 
        set({ 
          activeDrivers: drivers,
          analytics: { ...get().analytics, totalDrivers: drivers.length, activeDrivers: drivers.filter(d => d.isActive).length }
        }),
      
      selectDriver: (driver) => set({ 
        selectedDriver: driver,
        viewMode: driver ? 'single' : 'all'
      }),
      
      updateLocation: (deviceId, location) => {
        const locations = new Map(get().locations);
        locations.set(deviceId, location);
        set({ 
          locations,
          lastUpdate: new Date()
        });
      },
      
      addLocationToHistory: (location) => {
        const history = get().locationHistory;
        set({ 
          locationHistory: [location, ...history.slice(0, 49)] // Keep last 50
        });
      },
      
      clearLocationHistory: () => set({ locationHistory: [] }),
      
      setConnectionStatus: (status, connected) => 
        set({ 
          connectionStatus: status, 
          isConnected: connected 
        }),
      
      setLastUpdate: (date) => set({ lastUpdate: date }),
      
      toggleSidebar: () => 
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleAccuracyCircle: () => 
        set((state) => ({ showAccuracyCircle: !state.showAccuracyCircle })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setFilters: (filters) => set({ filters }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      updateAnalytics: (analytics) => 
        set((state) => ({ 
          analytics: { ...state.analytics, ...analytics }
        })),
      
      addAlert: (alert) => 
        set((state) => ({
          analytics: {
            ...state.analytics,
            alerts: [alert, ...state.analytics.alerts.slice(0, 9)] // Keep last 10
          }
        })),
      
      removeAlert: (alertId) => 
        set((state) => ({
          analytics: {
            ...state.analytics,
            alerts: state.analytics.alerts.filter(a => a.id !== alertId)
          }
        }))
    }),
    { name: 'logistics-admin-store' }
  )
); 