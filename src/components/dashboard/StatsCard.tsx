import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  unit?: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  total,
  unit,
  icon: Icon,
  color,
  trend,
  trendUp
}) => {
  return (
    <Card className="h-full border border-border/12 bg-card overflow-hidden relative transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            
            <div className="flex items-baseline gap-1 mb-2">
              <h3 className="text-3xl font-bold text-foreground leading-none">
                {value.toLocaleString()}
              </h3>
              {unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
              {total && (
                <span className="text-sm text-muted-foreground ml-1">
                  / {total}
                </span>
              )}
            </div>

            {trend && (
              <div className="flex items-center gap-1">
                {trendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  "text-xs font-semibold",
                  trendUp ? "text-green-500" : "text-red-500"
                )}>
                  {trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last week
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div 
            className="w-14 h-14 rounded-lg border flex items-center justify-center"
            style={{
              backgroundColor: `${color}0D`, // 5% opacity
              borderColor: `${color}33` // 20% opacity
            }}
          >
            <Icon 
              className="h-7 w-7" 
              style={{ color }} 
            />
          </div>
        </div>

        {/* Progress Bar */}
        {total && (
          <div className="mt-4">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-600 ease-out"
                style={{
                  width: `${Math.min((value / total) * 100, 100)}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((value / total) * 100)}% of total capacity
            </p>
          </div>
        )}
      </CardContent>

      {/* Gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}99)`
        }}
      />
    </Card>
  );
};

export default StatsCard; 