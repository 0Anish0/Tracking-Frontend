import React from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import type { AlertData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getTimeSinceUpdate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface AlertsListProps {
  alerts: AlertData[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };



  const getBadgeClassName = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activeAlerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-muted-foreground mb-1">
                No Active Alerts
              </h3>
              <p className="text-sm text-muted-foreground">
                All systems running smoothly! 🎉
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {alert.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={cn(
                              "text-xs",
                              getBadgeClassName(alert.severity)
                            )}
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between">
                                                 <span className="text-xs text-muted-foreground">
                           {alert.driverId ? `Driver ${alert.driverId.slice(-4)}` : 'System Alert'}
                         </span>
                        <span className="text-xs text-muted-foreground">
                          {getTimeSinceUpdate(alert.timestamp.toISOString())}
                        </span>
                      </div>
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

export default AlertsList; 