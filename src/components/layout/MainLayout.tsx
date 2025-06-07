import React from 'react';
import { Bell, User, Menu, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useAppStore } from '../../store/useAppStore';
import Sidebar from './Sidebar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    analytics, 
    isConnected,
    connectionStatus 
  } = useAppStore();

  const unreadAlerts = analytics.alerts.filter(alert => !alert.resolved).length;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              )} />
              <span className="text-sm text-muted-foreground">
                {connectionStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="relative">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Bell className="h-4 w-4" />
                    </Button>
                    {unreadAlerts > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadAlerts}
                      </Badge>
                    )}
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content
                  className="px-3 py-1.5 text-xs bg-popover text-popover-foreground border border-border rounded-md shadow-lg"
                  sideOffset={5}
                >
                  {unreadAlerts > 0 ? `${unreadAlerts} new alerts` : 'No new alerts'}
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </Button>
              </DropdownMenu.Trigger>
              
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="min-w-[200px] bg-popover text-popover-foreground border border-border rounded-md shadow-lg p-1"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                    Admin User
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded cursor-pointer">
                    Profile Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded cursor-pointer">
                    Preferences
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-destructive">
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 