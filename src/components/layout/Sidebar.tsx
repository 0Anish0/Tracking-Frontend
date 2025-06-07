import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { 
  BarChart3, 
  Users, 
  Truck, 
  TrendingUp, 
  AlertTriangle,

  FileText,
  Route,
  MapPin
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ROUTES } from '../../constants';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
  color?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analytics, activeDrivers } = useAppStore();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: ROUTES.DASHBOARD,
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Users,
      path: ROUTES.DRIVERS,
      badge: activeDrivers.filter(d => d.isActive).length,
    },
    {
      id: 'fleet',
      label: 'Fleet Management',
      icon: Truck,
      path: ROUTES.FLEET,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      path: ROUTES.ANALYTICS,
    },
    {
      id: 'routes',
      label: 'Routes',
      icon: Route,
      path: ROUTES.ROUTES,
    },
    {
      id: 'geofences',
      label: 'Geofences',
      icon: MapPin,
      path: ROUTES.GEOFENCES,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      path: ROUTES.ALERTS,
      badge: analytics.alerts.filter(alert => !alert.resolved).length,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      path: ROUTES.REPORTS,
    }
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-4">
            <span className="text-2xl">🚛</span>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Logistics Pro
            </span>
          </div>
        ) : (
          <span className="text-2xl">🚛</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <Tooltip.Provider>
          <div className="space-y-1 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-11 px-3",
                          collapsed && "justify-center px-2",
                          active && "bg-primary/10 text-primary border-l-2 border-primary"
                        )}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon className={cn(
                          "h-5 w-5",
                          !collapsed && "mr-3"
                        )} />
                        
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <Badge 
                                variant={item.id === 'alerts' ? 'destructive' : 'secondary'}
                                className="ml-auto h-5 text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    </Tooltip.Trigger>
                    
                    {collapsed && (
                      <Tooltip.Content
                        side="right"
                        className="px-3 py-1.5 text-sm bg-popover text-popover-foreground border border-border rounded-md shadow-lg ml-2"
                      >
                        {item.label}
                        {item.badge && item.badge > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({item.badge})
                          </span>
                        )}
                      </Tooltip.Content>
                    )}
                  </Tooltip.Root>
                </motion.div>
              );
            })}
          </div>
        </Tooltip.Provider>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm font-semibold text-primary mb-1">
              Logistics Pro
            </div>
            <div className="text-xs text-muted-foreground">
              v1.0.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 