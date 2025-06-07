import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Enhanced marker icons with different colors for different drivers
const createCustomIcon = (color: string, driverName: string) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color}">
        <div class="marker-pulse" style="background-color: ${color}"></div>
        <div class="marker-icon">🚛</div>
        <div class="marker-label">${driverName.substring(0, 3)}</div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });
};

const SOCKET_URL = 'http://192.168.48.202:3001';

interface LocationData {
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

interface Driver {
  deviceId: string;
  driverName: string;
  isActive: boolean;
  lastSeen: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

interface LocationHistory {
  id: string;
  location: LocationData;
  timestamp: number;
}

// Component to update map view when location changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

// Component to fit map to show all markers
function FitBounds({ locations }: { locations: LocationHistory[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 1) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.location.latitude, loc.location.longitude])
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, locations]);
  
  return null;
}

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeLocations, setActiveLocations] = useState<Map<string, LocationData>>(new Map());
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showAccuracyCircle, setShowAccuracyCircle] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');

  // Driver colors for different markers
  const driverColors = [
    '#FF5722', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
    '#00BCD4', '#795548', '#607D8B', '#E91E63', '#3F51B5'
  ];

  const getDriverColor = (deviceId: string) => {
    const index = Math.abs(deviceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % driverColors.length;
    return driverColors[index];
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setConnectionStatus('Connected');
      
      // Request initial driver list
      fetchDrivers();
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      setConnectionStatus('Disconnected');
    });

    newSocket.on('connect_error', (error: any) => {
      console.log('Connection error:', error);
      setConnected(false);
      setConnectionStatus('Connection Error');
    });

    // Listen for location updates
    newSocket.on('locationUpdate', (locationData: LocationData) => {
      console.log('Location update received:', locationData);
      
      setLastUpdate(new Date());
      
      // Update active locations map
      setActiveLocations(prev => {
        const newMap = new Map(prev);
        if (locationData.deviceId) {
          newMap.set(locationData.deviceId, locationData);
        }
        return newMap;
      });
      
      // Add to history (keep last 50 locations)
      setLocationHistory(prev => {
        const newHistory = [...prev, {
          id: `${locationData.deviceId}-${Date.now()}`,
          location: locationData,
          timestamp: Date.now()
        }];
        return newHistory.slice(-50);
      });
    });

    // Listen for driver list updates
    newSocket.on('driversUpdate', (driversList: Driver[]) => {
      console.log('Drivers update received:', driversList);
      setDrivers(driversList);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/drivers`);
      const driversList = await response.json();
      setDrivers(driversList);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchDriverHistory = async (deviceId: string) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/locations/${deviceId}?hours=24`);
      const locations = await response.json();
      
      const history = locations.map((loc: any, index: number) => ({
        id: `${deviceId}-${index}`,
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          accuracy: loc.accuracy,
          timestamp: loc.timestamp,
          deviceId: loc.deviceId,
          driverName: drivers.find(d => d.deviceId === deviceId)?.driverName
        },
        timestamp: new Date(loc.timestamp).getTime()
      }));
      
      setLocationHistory(history);
    } catch (error) {
      console.error('Error fetching driver history:', error);
    }
  };

  const defaultCenter: [number, number] = [40.7128, -74.0060];
  
  const getMapCenter = (): [number, number] => {
    if (viewMode === 'single' && selectedDriver) {
      const location = activeLocations.get(selectedDriver);
      if (location) {
        return [location.latitude, location.longitude];
      }
    }
    
    if (activeLocations.size > 0) {
      const locations = Array.from(activeLocations.values());
      const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
      return [avgLat, avgLng];
    }
    
    return defaultCenter;
  };

  const clearHistory = () => {
    setLocationHistory([]);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const selectDriver = (deviceId: string) => {
    setSelectedDriver(deviceId);
    setViewMode('single');
    fetchDriverHistory(deviceId);
  };

  const showAllDrivers = () => {
    setSelectedDriver(null);
    setViewMode('all');
    setLocationHistory([]);
  };

  const getTimeSinceUpdate = (timestamp?: string) => {
    const updateTime = timestamp ? new Date(timestamp) : lastUpdate;
    if (!updateTime) return 'Never';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - updateTime.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const formatSpeed = (speed?: number) => {
    if (!speed || speed <= 0) return '0 km/h';
    return `${Math.round(speed * 3.6)} km/h`;
  };

  return (
    <div className="app">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <h1 className="app-title">🚛 Logistics Tracker Pro</h1>
        </div>
        
        <div className="navbar-center">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">{connectionStatus}</span>
            </div>
          </div>
          <div className="driver-count">
            <span className="count-label">Active Drivers:</span>
            <span className="count-number">{drivers.filter(d => d.isActive).length}</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="toolbar">
            <button 
              className={`tool-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={showAllDrivers}
              title="Show All Drivers"
            >
              🗺️
            </button>
            <button 
              className={`tool-btn ${showAccuracyCircle ? 'active' : ''}`}
              onClick={() => setShowAccuracyCircle(!showAccuracyCircle)}
              title="Toggle Accuracy Circle"
            >
              🎯
            </button>
            <div className="divider"></div>
            {lastUpdate && (
              <div className="last-update-info">
                <span className="update-label">Last Update</span>
                <span className="update-time">{getTimeSinceUpdate()}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
          <div className="sidebar-content">
            
            {/* Driver List Section */}
            <section className="info-section">
              <div className="section-header">
                <h2 className="section-title">🚛 Active Drivers</h2>
                <button className="refresh-btn" onClick={fetchDrivers} title="Refresh">
                  🔄
                </button>
              </div>
              
              <div className="drivers-list">
                {drivers.filter(d => d.isActive).map((driver) => {
                  const location = activeLocations.get(driver.deviceId);
                  const isSelected = selectedDriver === driver.deviceId;
                  
                  return (
                    <div 
                      key={driver.deviceId} 
                      className={`driver-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectDriver(driver.deviceId)}
                    >
                      <div className="driver-header">
                        <div 
                          className="driver-color-indicator" 
                          style={{ backgroundColor: getDriverColor(driver.deviceId) }}
                        ></div>
                        <div className="driver-info">
                          <h3 className="driver-name">{driver.driverName}</h3>
                          <p className="driver-id">ID: {driver.deviceId.slice(-8)}</p>
                        </div>
                        <div className="driver-status">
                          {location ? (
                            <span className="status-online">🟢 LIVE</span>
                          ) : (
                            <span className="status-offline">🔴 OFFLINE</span>
                          )}
                        </div>
                      </div>
                      
                      {location && (
                        <div className="driver-location-info">
                          <div className="location-coords">
                            📍 {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                          </div>
                          <div className="location-meta">
                            <span>⚡ {formatSpeed(location.speed)}</span>
                            <span>🎯 ±{Math.round(location.accuracy)}m</span>
                            <span>🕐 {getTimeSinceUpdate(location.timestamp)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {drivers.filter(d => d.isActive).length === 0 && (
                  <div className="no-drivers">
                    <p>No active drivers</p>
                    <small>Drivers will appear here when they start tracking</small>
                  </div>
                )}
              </div>
            </section>

            {/* Selected Driver Details */}
            {selectedDriver && (
              <section className="info-section">
                <div className="section-header">
                  <h2 className="section-title">📊 Driver Details</h2>
                </div>
                
                <div className="driver-details">
                  {(() => {
                    const driver = drivers.find(d => d.deviceId === selectedDriver);
                    const location = activeLocations.get(selectedDriver);
                    
                    return (
                      <div>
                        <h3>{driver?.driverName}</h3>
                        <p><strong>Device ID:</strong> {selectedDriver}</p>
                        <p><strong>Status:</strong> {driver?.isActive ? 'Active' : 'Inactive'}</p>
                        <p><strong>Last Seen:</strong> {getTimeSinceUpdate(driver?.lastSeen)}</p>
                        
                        {location && (
                          <div className="current-location-details">
                            <h4>Current Location</h4>
                            <p><strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                            <p><strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m</p>
                            <p><strong>Speed:</strong> {formatSpeed(location.speed)}</p>
                            <p><strong>Updated:</strong> {getTimeSinceUpdate(location.timestamp)}</p>
                          </div>
                        )}
                        
                        <div className="driver-actions">
                          <button onClick={() => fetchDriverHistory(selectedDriver)}>
                            📈 Load 24h History
                          </button>
                          <button onClick={showAllDrivers}>
                            🗺️ Show All Drivers
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>
            )}

            {/* Location History Section */}
            {locationHistory.length > 0 && (
              <section className="info-section">
                <div className="section-header">
                  <h2 className="section-title">📈 Location History</h2>
                  <button className="clear-btn" onClick={clearHistory}>Clear</button>
                </div>
                
                <div className="history-list">
                  {locationHistory.slice(0, 10).map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-header">
                        <span className="history-driver">{item.location.driverName || 'Unknown'}</span>
                        <span className="history-time">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="history-coords">
                        {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                      </div>
                      <div className="history-meta">
                        <span>±{Math.round(item.location.accuracy)}m</span>
                        {item.location.speed && item.location.speed > 0 && (
                          <span>{formatSpeed(item.location.speed)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Map Container */}
        <main className="map-container">
          <MapContainer
            center={getMapCenter()}
            zoom={viewMode === 'single' ? 15 : 10}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {viewMode === 'all' && <FitBounds locations={locationHistory} />}
            {viewMode === 'single' && selectedDriver && (
              <ChangeView center={getMapCenter()} zoom={15} />
            )}

            {/* Render markers for active locations */}
            {Array.from(activeLocations.entries()).map(([deviceId, location]) => {
              if (viewMode === 'single' && selectedDriver !== deviceId) return null;
              
              const driver = drivers.find(d => d.deviceId === deviceId);
              const color = getDriverColor(deviceId);
              
              return (
                <React.Fragment key={deviceId}>
                  <Marker
                    position={[location.latitude, location.longitude]}
                    icon={createCustomIcon(color, driver?.driverName || 'Unknown')}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h3>🚛 {driver?.driverName || 'Unknown Driver'}</h3>
                        <p><strong>Device ID:</strong> {deviceId.slice(-8)}</p>
                        <p><strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                        <p><strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m</p>
                        <p><strong>Speed:</strong> {formatSpeed(location.speed)}</p>
                        <p><strong>Last Update:</strong> {getTimeSinceUpdate(location.timestamp)}</p>
                        <button onClick={() => selectDriver(deviceId)}>
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {showAccuracyCircle && (
                    <Circle
                      center={[location.latitude, location.longitude]}
                      radius={location.accuracy}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.1,
                        weight: 1
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* Render historical path for selected driver */}
            {viewMode === 'single' && locationHistory.length > 1 && (
              <React.Fragment>
                {locationHistory.map((item, index) => (
                  <Circle
                    key={item.id}
                    center={[item.location.latitude, item.location.longitude]}
                    radius={3}
                    pathOptions={{
                      color: '#666',
                      fillColor: '#999',
                      fillOpacity: 0.5 + (index / locationHistory.length) * 0.5,
                      weight: 1
                    }}
                  />
                ))}
              </React.Fragment>
            )}
          </MapContainer>
        </main>
      </div>
    </div>
  );
}

export default App;
