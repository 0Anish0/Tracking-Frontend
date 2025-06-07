import React from 'react';
import { Clock, MapPin, Truck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getTimeSinceUpdate } from '../../lib/utils';

const RecentActivity: React.FC = () => {
  const { locationHistory, activeDrivers } = useAppStore();

  const getActivityIcon = (activity: string) => {
    if (activity.includes('started')) return <Truck className="h-4 w-4 text-green-500" />;
    if (activity.includes('stopped')) return <MapPin className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getDriverName = (deviceId: string) => {
    const driver = activeDrivers.find(d => d.deviceId === deviceId);
    return driver?.driverName || `Driver ${deviceId.slice(-4)}`;
  };

  // Generate some mock activities based on location history
  const recentActivities = locationHistory.slice(0, 10)
    .filter(location => location.deviceId) // Filter out entries without deviceId
    .map(location => ({
      id: `${location.deviceId}-${location.timestamp || Date.now()}`,
      driverName: getDriverName(location.deviceId!),
      activity: `Updated location`,
      timestamp: location.timestamp || new Date().toISOString(),
      location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-muted-foreground mb-1">
                No Recent Activity
              </h3>
              <p className="text-sm text-muted-foreground">
                Driver activities will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.activity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.driverName}
                        </p>
                                                 <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                           {getTimeSinceUpdate(activity.timestamp)}
                         </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📍 {activity.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity; 