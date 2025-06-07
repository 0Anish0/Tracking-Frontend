import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, Gauge, AlertTriangle, RefreshCw, Maximize2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { socketService } from '../services/socketService';
import { MapView, StatsCard, RecentActivity, AlertsList } from '../components';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

const Dashboard: React.FC = () => {
  const {
    drivers,
    activeDrivers,
    analytics,
    isConnected,
    setConnectionStatus,
    setActiveDrivers,
    updateLocation,
    addAlert
  } = useAppStore();

  useEffect(() => {
    // Initialize socket connection
    const initializeConnection = async () => {
      try {
        await socketService.connect({
          onConnect: () => {
            setConnectionStatus('Connected', true);
            socketService.requestDrivers();
          },
          onDisconnect: () => {
            setConnectionStatus('Disconnected', false);
          },
          onConnectionError: (error) => {
            setConnectionStatus('Connection Error', false);
            console.error('Socket connection error:', error);
          },
          onDriversUpdate: (driversData) => {
            setActiveDrivers(driversData);
          },
          onLocationUpdate: (locationData) => {
            if (locationData.deviceId) {
              updateLocation(locationData.deviceId, locationData);
            }
          },
          onAlertUpdate: (alertData) => {
            addAlert(alertData);
          }
        });
      } catch (error) {
        setConnectionStatus('Failed to Connect', false);
        console.error('Failed to connect to socket:', error);
      }
    };

    initializeConnection();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const statsData = [
    {
      title: 'Active Drivers',
      value: activeDrivers.filter(d => d.isActive).length,
      total: drivers.length,
      icon: Users,
      color: 'rgb(76 175 80)',
      trend: '+5.2%',
      trendUp: true
    },
    {
      title: 'Fleet Vehicles',
      value: 24,
      total: 30,
      icon: Truck,
      color: 'rgb(33 150 243)',
      trend: '+2.1%',
      trendUp: true
    },
    {
      title: 'Avg Speed',
      value: Math.round(analytics.averageSpeed || 0),
      unit: 'km/h',
      icon: Gauge,
      color: 'rgb(255 152 0)',
      trend: '-1.8%',
      trendUp: false
    },
    {
      title: 'Active Alerts',
      value: analytics.alerts.filter(alert => !alert.resolved).length,
      icon: AlertTriangle,
      color: 'rgb(244 67 54)',
      trend: '-12.5%',
      trendUp: false
    }
  ];

  return (
    <div className="flex-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time logistics monitoring and fleet management
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? 'success' : 'destructive'}
              className="flex items-center gap-1"
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              )} />
              {isConnected ? 'Live Data' : 'Disconnected'}
            </Badge>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-[600px] overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      Live Fleet Tracking
                    </CardTitle>
                    <Button variant="ghost" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  <MapView />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RecentActivity />
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <AlertsList alerts={analytics.alerts.slice(0, 5)} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 