import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';
import { DRIVER_COLORS, MAP_CONFIG } from '../../constants';
import { Eye, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { formatSpeed, getTimeSinceUpdate, getDriverColor } from '../../lib/utils';

// Enhanced marker icons
const createCustomIcon = (color: string, driverName: string) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 3px solid white;
          font-size: 18px;
          position: relative;
          z-index: 2;
        ">
          🚛
        </div>
        <div style="
          position: absolute;
          bottom: -2px;
          width: 12px;
          height: 12px;
          background: ${color};
          transform: rotate(45deg);
          z-index: 1;
          border: 2px solid white;
        "></div>
        <div style="
          position: absolute;
          top: -8px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          z-index: 3;
        ">
          ${driverName.substring(0, 8)}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45]
  });
};

// Component to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

// Component to fit bounds
function FitBounds({ locations }: { locations: Array<{ latitude: number; longitude: number }> }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 1) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, locations]);
  
  return null;
}

const MapView: React.FC = () => {
  const {
    locations,
    activeDrivers,
    showAccuracyCircle,
    viewMode,
    selectedDriver,
    toggleAccuracyCircle,
    selectDriver
  } = useAppStore();

  const getMapCenter = (): [number, number] => {
    if (viewMode === 'single' && selectedDriver) {
      const location = locations.get(selectedDriver.deviceId);
      if (location) {
        return [location.latitude, location.longitude];
      }
    }
    
    if (locations.size > 0) {
      const locationArray = Array.from(locations.values());
      const avgLat = locationArray.reduce((sum, loc) => sum + loc.latitude, 0) / locationArray.length;
      const avgLng = locationArray.reduce((sum, loc) => sum + loc.longitude, 0) / locationArray.length;
      return [avgLat, avgLng];
    }
    
    return MAP_CONFIG.DEFAULT_CENTER;
  };

  const activeLocations = Array.from(locations.values()).filter(loc => 
    loc.deviceId && activeDrivers.some(d => d.deviceId === loc.deviceId && d.isActive)
  );

  return (
    <div className="relative h-full w-full">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-card/90 backdrop-blur-md rounded-lg p-2 flex flex-col gap-1 border border-border/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAccuracyCircle}
            className={cn(
              "h-8 w-8",
              showAccuracyCircle ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Drivers Count */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Badge 
          variant="success"
          className="bg-green-500/10 text-green-600 border border-green-500/30 font-semibold"
        >
          {activeLocations.length} Active Drivers
        </Badge>
      </div>

      {/* Map Container */}
      <MapContainer
        center={getMapCenter()}
        zoom={viewMode === 'single' ? 15 : MAP_CONFIG.DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.ATTRIBUTION}
        />
        
        {viewMode === 'all' && activeLocations.length > 1 && (
          <FitBounds locations={activeLocations} />
        )}
        
        {viewMode === 'single' && selectedDriver && (
          <ChangeView center={getMapCenter()} zoom={15} />
        )}

        {/* Render markers for active locations */}
        {Array.from(locations.entries()).map(([deviceId, location]) => {
          if (viewMode === 'single' && selectedDriver?.deviceId !== deviceId) return null;
          
          const driver = activeDrivers.find(d => d.deviceId === deviceId);
          if (!driver?.isActive) return null;
          
          const color = getDriverColor(deviceId, DRIVER_COLORS);
          
          return (
            <React.Fragment key={deviceId}>
              <Marker
                position={[location.latitude, location.longitude]}
                icon={createCustomIcon(color, driver?.driverName || 'Unknown')}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      🚛 {driver?.driverName || 'Unknown Driver'}
                      <Badge variant="success" className="text-xs">
                        LIVE
                      </Badge>
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Device:</strong> {deviceId.slice(-8)}
                      </p>
                      <p>
                        <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                      <p>
                        <strong>Accuracy:</strong> ±{Math.round(location.accuracy || 0)}m
                      </p>
                      <p>
                        <strong>Speed:</strong> {formatSpeed(location.speed)}
                      </p>
                      <p className="mb-2">
                        <strong>Last Update:</strong> {getTimeSinceUpdate(location.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        className="cursor-pointer"
                        onClick={() => selectDriver(driver)}
                      >
                        View Details
                      </Badge>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {showAccuracyCircle && (
                <Circle
                  center={[location.latitude, location.longitude]}
                  radius={location.accuracy || 0}
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
      </MapContainer>

      {/* No Data State */}
      {activeLocations.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[1000] bg-card/90 p-6 rounded-lg border border-border/20">
          <h3 className="text-lg font-semibold mb-2">
            No Active Drivers
          </h3>
          <p className="text-sm text-muted-foreground">
            Drivers will appear on the map when they start tracking
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView; 