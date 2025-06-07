import React, { useState } from 'react';
import { Search, Plus, MapPin, Clock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../store/useAppStore';
import type { Driver } from '../types';

const Drivers: React.FC = () => {
  const { activeDrivers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = activeDrivers.filter(driver => {
    const matchesSearch = driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.deviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && driver.isActive) ||
                         (selectedStatus === 'inactive' && !driver.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400';
  };

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
          <p className="text-muted-foreground">Manage and monitor your fleet drivers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl font-bold">{activeDrivers.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-500 text-xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeDrivers.filter(d => d.isActive).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-green-500 text-xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-600">
                  {activeDrivers.filter(d => !d.isActive).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-red-500 text-xl">❌</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">2.4<span className="text-sm text-muted-foreground">min</span></p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drivers List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Driver List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Offline</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.deviceId}
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedDriver?.deviceId === driver.deviceId ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {driver.driverName.charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(driver.isActive)} rounded-full border-2 border-background`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{driver.driverName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {driver.deviceId.slice(-6)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={driver.isActive ? 'default' : 'secondary'}>
                          {driver.isActive ? 'Active' : 'Offline'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatLastSeen(driver.lastSeen)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Driver Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDriver ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {selectedDriver.driverName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-lg">{selectedDriver.driverName}</h3>
                    <p className="text-sm text-muted-foreground">Device: {selectedDriver.deviceId}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`h-3 w-3 ${getStatusColor(selectedDriver.isActive)} rounded-full`}></div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedDriver.isActive ? 'Online & Active' : 'Offline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Current Location</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedDriver.currentLocation?.latitude.toFixed(4)}, {selectedDriver.currentLocation?.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Last Seen</p>
                        <p className="text-xs text-muted-foreground">
                          {formatLastSeen(selectedDriver.lastSeen)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <p className="text-xs text-muted-foreground">
                          +1 (555) {selectedDriver.deviceId.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="sm">
                      View Route History
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Send Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-muted-foreground">Select a driver to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Drivers; 