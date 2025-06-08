import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { Users, MapPin, Clock, Gauge, LogOut, Eye, EyeOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './styles/globals.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Types
interface Driver {
  deviceId: string;
  driverName: string;
  isOnline: boolean;
  lastSeen: string;
}

interface Location {
  deviceId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
  isOnline: boolean;
}

const SOCKET_URL = 'http://localhost:3001';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      initializeSocket();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      initializeSocket();
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isLoggedIn]);

  const initializeSocket = () => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('drivers-updated', (updatedDrivers: Driver[]) => {
      setDrivers(updatedDrivers);
    });

    newSocket.on('location-update', (location: Location) => {
      setLocations(prev => {
        const existingIndex = prev.findIndex(loc => loc.deviceId === location.deviceId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = location;
          return updated;
        } else {
          return [...prev, location];
        }
      });
    });

    fetchDrivers();
    fetchLocations();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${SOCKET_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', 'logged-in');
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    if (socket) {
      socket.close();
    }
    setSocket(null);
    setDrivers([]);
    setLocations([]);
    setSelectedDriver(null);
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/drivers`);
      const data = await response.json();
      if (data.success) {
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/locations`);
      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const getDisplayedLocations = () => {
    if (viewMode === 'all') {
      return locations;
    } else if (selectedDriver) {
      return locations.filter(loc => loc.deviceId === selectedDriver);
    }
    return [];
  };

  const getMapCenter = (): [number, number] => {
    const displayedLocations = getDisplayedLocations();
    if (displayedLocations.length === 0) return [40.7128, -74.0060]; // Default to NYC
    
    if (displayedLocations.length === 1) {
      return [displayedLocations[0].latitude, displayedLocations[0].longitude];
    }
    
    // Calculate center of all locations
    const avgLat = displayedLocations.reduce((sum, loc) => sum + loc.latitude, 0) / displayedLocations.length;
    const avgLng = displayedLocations.reduce((sum, loc) => sum + loc.longitude, 0) / displayedLocations.length;
    return [avgLat, avgLng];
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatSpeed = (speed?: number) => {
    if (!speed) return 'N/A';
    return `${Math.round(speed * 3.6)} km/h`;
  };

  const formatAccuracy = (accuracy?: number) => {
    if (!accuracy) return 'N/A';
    return `±${Math.round(accuracy)}m`;
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Location Tracker Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Demo credentials: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Location Tracker</h1>
                <p className="text-sm text-gray-600">
                  {drivers.filter(d => d.isOnline).length} of {drivers.length} drivers online
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* View Mode Toggle */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">View Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => setViewMode('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
                  viewMode === 'all' 
                    ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Show All Drivers
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`w-full text-left px-3 py-2 rounded-lg transition duration-200 ${
                  viewMode === 'single' 
                    ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Single Driver View
              </button>
            </div>
          </div>

          {/* Drivers List */}
          <div className="bg-white rounded-xl shadow-sm p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Drivers ({drivers.length})
            </h3>
            
            <div className="space-y-2">
              {drivers.length === 0 ? (
                <p className="text-gray-500 text-sm">No drivers registered</p>
              ) : (
                drivers.map((driver) => {
                  const driverLocation = locations.find(loc => loc.deviceId === driver.deviceId);
                  const isSelected = selectedDriver === driver.deviceId;
                  
                  return (
                    <div
                      key={driver.deviceId}
                      onClick={() => {
                        if (viewMode === 'single') {
                          setSelectedDriver(isSelected ? null : driver.deviceId);
                        }
                      }}
                      className={`p-3 rounded-lg border transition duration-200 cursor-pointer ${
                        isSelected && viewMode === 'single'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            driver.isOnline ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">{driver.driverName}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(driver.lastSeen)}
                        </span>
                      </div>
                      
                      {driverLocation && (
                        <div className="mt-2 text-xs text-gray-600">
                          📍 {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Driver Details */}
          {selectedDriver && viewMode === 'single' && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Driver Details</h3>
              {(() => {
                const driver = drivers.find(d => d.deviceId === selectedDriver);
                const location = locations.find(loc => loc.deviceId === selectedDriver);
                
                if (!driver) return <p className="text-gray-500">Driver not found</p>;
                
                return (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{driver.driverName}</p>
                      <p className="text-xs text-gray-500">ID: {driver.deviceId.slice(0, 8)}...</p>
                    </div>
                    
                    {location && (
                      <>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{formatSpeed(location.speed)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{formatTime(location.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <p>Accuracy: {formatAccuracy(location.accuracy)}</p>
                          <p>Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
            <div className="h-full">
              <MapContainer
                center={getMapCenter()}
                zoom={13}
                className="h-full w-full"
                key={`${viewMode}-${selectedDriver}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {getDisplayedLocations().map((location, index) => {
                  const driver = drivers.find(d => d.deviceId === location.deviceId);
                  return (
                    <Marker
                      key={`${location.deviceId}-${index}`}
                      position={[location.latitude, location.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{location.driverName}</h3>
                          <p className="text-sm text-gray-600">
                            Status: {driver?.isOnline ? '🟢 Online' : '🔴 Offline'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Speed: {formatSpeed(location.speed)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last update: {formatTime(location.timestamp)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Accuracy: {formatAccuracy(location.accuracy)}
                          </p>
                          <div className="mt-2">
                            <a
                              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              Open in Google Maps
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
