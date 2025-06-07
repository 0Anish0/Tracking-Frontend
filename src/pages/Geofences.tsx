import React from 'react';
import { MapPin, Plus, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Geofences: React.FC = () => {
  const geofences = [
    { id: '1', name: 'Warehouse Zone A', type: 'circle', radius: '500m', status: 'active', alerts: 2 },
    { id: '2', name: 'City Center Restricted', type: 'polygon', area: '2.5km²', status: 'active', alerts: 0 },
    { id: '3', name: 'Highway Rest Area', type: 'circle', radius: '200m', status: 'inactive', alerts: 1 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geofences</h1>
          <p className="text-muted-foreground">Manage geographical boundaries and alerts</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Geofence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Geofences</p>
                <p className="text-2xl font-bold">{geofences.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{geofences.filter(g => g.status === 'active').length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts Today</p>
                <p className="text-2xl font-bold">{geofences.reduce((acc, g) => acc + g.alerts, 0)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geofence Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geofences.map((geofence) => (
              <div key={geofence.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      {geofence.type === 'circle' ? (
                        <span className="text-blue-500 text-xl">⭕</span>
                      ) : (
                        <span className="text-blue-500 text-xl">📐</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{geofence.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {geofence.type === 'circle' ? geofence.radius : geofence.area} • 
                        {geofence.alerts} alerts today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={geofence.status === 'active' ? 'default' : 'secondary'}>
                      {geofence.status}
                    </Badge>
                    <Button variant="outline" size="sm">Edit</Button>
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

export default Geofences; 