import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAppStore } from '../store/useAppStore';

const Analytics: React.FC = () => {
  const { activeDrivers } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');

  // Mock chart data - replace with real analytics data
  const chartData = {
    daily: [
      { date: '2024-11-01', drivers: 12, distance: 1250, alerts: 3 },
      { date: '2024-11-02', drivers: 15, distance: 1430, alerts: 1 },
      { date: '2024-11-03', drivers: 11, distance: 980, alerts: 5 },
      { date: '2024-11-04', drivers: 18, distance: 1650, alerts: 2 },
      { date: '2024-11-05', drivers: 14, distance: 1320, alerts: 4 },
      { date: '2024-11-06', drivers: 16, distance: 1580, alerts: 1 },
      { date: '2024-11-07', drivers: 13, distance: 1240, alerts: 3 }
    ]
  };

  const metrics = {
    totalDistance: 5420,
    avgSpeed: 65,
    activeDriversAvg: 14,
    alertsTotal: 8,
    efficiency: 85
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Fleet performance insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">{metrics.totalDistance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">km this period</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Speed</p>
                <p className="text-2xl font-bold">{Math.round(metrics.avgSpeed)}</p>
                <p className="text-xs text-muted-foreground">km/h average</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold">{Math.round(metrics.activeDriversAvg)}</p>
                <p className="text-xs text-muted-foreground">avg per day</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{metrics.alertsTotal}</p>
                <p className="text-xs text-muted-foreground">this period</p>
              </div>
              <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-red-500 text-xl">🚨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{Math.round(metrics.efficiency)}%</p>
                <p className="text-xs text-muted-foreground">fleet efficiency</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.daily.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{day.drivers} drivers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{day.distance}km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">🚨</span>
                      <span>{day.alerts} alerts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Driver Utilization</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fleet Efficiency</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">On-Time Performance</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fuel Efficiency</span>
                  <span className="text-sm text-muted-foreground">73%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Safety Score</span>
                  <span className="text-sm text-muted-foreground">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeDrivers.slice(0, 6).map((driver) => (
              <div key={driver.deviceId} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {driver.driverName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{driver.driverName}</h3>
                    <p className="text-xs text-muted-foreground">Driver {driver.deviceId.slice(-4)}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Distance Today:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 200 + 50)}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Speed:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20 + 60)}km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Score:</span>
                    <span className="font-medium text-green-600">{Math.floor(Math.random() * 10 + 90)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics; 