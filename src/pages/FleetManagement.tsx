import React, { useState } from 'react';
import { Truck, Plus, Search, Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'inactive';
  assignedDriver?: string;
  mileage: number;
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const FleetManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Mock data - replace with real data from your store
  const vehicles: Vehicle[] = [
    {
      id: '1',
      make: 'Ford',
      model: 'Transit',
      year: 2021,
      licensePlate: 'ABC-123',
      status: 'active',
      assignedDriver: 'John Doe',
      mileage: 45000,
      fuelLevel: 85,
      lastMaintenance: '2024-10-01',
      nextMaintenance: '2024-12-01'
    },
    {
      id: '2',
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2020,
      licensePlate: 'XYZ-789',
      status: 'maintenance',
      assignedDriver: 'Jane Smith',
      mileage: 52000,
      fuelLevel: 40,
      lastMaintenance: '2024-09-15',
      nextMaintenance: '2024-11-15'
    },
    {
      id: '3',
      make: 'Volvo',
      model: 'FH16',
      year: 2022,
      licensePlate: 'DEF-456',
      status: 'active',
      assignedDriver: 'Mike Johnson',
      mileage: 28000,
      fuelLevel: 95,
      lastMaintenance: '2024-10-15',
      nextMaintenance: '2025-01-15'
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vehicle.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-orange-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground">Monitor and manage your vehicle fleet</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {vehicles.filter(v => v.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Mileage</p>
                <p className="text-2xl font-bold">
                  {Math.round(vehicles.reduce((acc, v) => acc + v.mileage, 0) / vehicles.length).toLocaleString()}
                  <span className="text-sm text-muted-foreground ml-1">km</span>
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <span className="text-purple-500 text-xl">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vehicle Fleet</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
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
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedVehicle?.id === vehicle.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(vehicle.status)} rounded-full border-2 border-background`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{vehicle.make} {vehicle.model}</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.licensePlate} • {vehicle.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={vehicle.status === 'active' ? 'default' : vehicle.status === 'maintenance' ? 'warning' : 'secondary'}>
                          {vehicle.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVehicle ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                      <Truck className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg">{selectedVehicle.make} {selectedVehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.licensePlate}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      {getStatusIcon(selectedVehicle.status)}
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {selectedVehicle.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-primary text-lg">👤</span>
                      <div>
                        <p className="text-sm font-medium">Assigned Driver</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedVehicle.assignedDriver || 'Unassigned'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-primary text-lg">⛽</span>
                      <div>
                        <p className="text-sm font-medium">Fuel Level</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${selectedVehicle.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{selectedVehicle.fuelLevel}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-primary text-lg">🔧</span>
                      <div>
                        <p className="text-sm font-medium">Next Maintenance</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedVehicle.nextMaintenance}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="sm">
                      Schedule Maintenance
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      View History
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Select a vehicle to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement; 