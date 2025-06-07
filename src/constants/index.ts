export const SOCKET_URL = 'http://192.168.48.202:3001';

export const ROUTES = {
  DASHBOARD: '/',
  DRIVERS: '/drivers',
  FLEET: '/fleet',
  ANALYTICS: '/analytics',
  GEOFENCES: '/geofences',
  ROUTES: '/routes',
  ALERTS: '/alerts',
  REPORTS: '/reports'
} as const;

export const DRIVER_COLORS = [
  '#FF5722', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
  '#00BCD4', '#795548', '#607D8B', '#E91E63', '#3F51B5'
] as const;

export const ALERT_TYPES = {
  SPEED: 'speed',
  OFFLINE: 'offline',
  GEOFENCE: 'geofence', 
  MAINTENANCE: 'maintenance',
  EMERGENCY: 'emergency'
} as const;

export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const DRIVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OFFLINE: 'offline'
} as const;

export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive'
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: [40.7128, -74.0060] as [number, number],
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
} as const;

export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,     // 5 seconds
  NORMAL: 30000,       // 30 seconds  
  SLOW: 60000,         // 1 minute
  VERY_SLOW: 300000    // 5 minutes
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy HH:mm',
  DISPLAY_SHORT: 'MMM dd HH:mm',
  API: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss'
} as const;

export const CHART_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3'
} as const;

export const SPEED_LIMITS = {
  CITY: 60,      // km/h
  HIGHWAY: 120,  // km/h
  ZONE_30: 30    // km/h
} as const;

export const GEOFENCE_TYPES = {
  CIRCLE: 'circle',
  POLYGON: 'polygon'
} as const;

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_DRIVERS: 'manage_drivers',
  MANAGE_FLEET: 'manage_fleet',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_ALERTS: 'manage_alerts',
  MANAGE_SETTINGS: 'manage_settings',
  EXPORT_DATA: 'export_data'
} as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  VIEWER: 'viewer'
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const;

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const; 