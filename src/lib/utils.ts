import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeed(speed?: number) {
  if (!speed || speed <= 0) return '0 km/h';
  return `${Math.round(speed * 3.6)} km/h`;
}

export function getTimeSinceUpdate(timestamp: string) {
  const updateTime = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - updateTime.getTime()) / 1000);
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function getDriverColor(deviceId: string, colors: readonly string[]) {
  const index = Math.abs(deviceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  return colors[index];
} 