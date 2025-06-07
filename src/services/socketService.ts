import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants';
import type { LocationData, Driver, AlertData } from '../types';

export type SocketEventCallbacks = {
  onConnect: () => void;
  onDisconnect: () => void;
  onLocationUpdate: (data: LocationData) => void;
  onDriversUpdate: (data: Driver[]) => void;
  onAlertUpdate: (data: AlertData) => void;
  onConnectionError: (error: Error) => void;
  onReconnectAttempt: (attemptNumber: number) => void;
  onDriverStatusChange: (data: { driverId: string; status: string }) => void;
};

class SocketService {
  private socket: Socket | null = null;
  private callbacks: Partial<SocketEventCallbacks> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  connect(callbacks: Partial<SocketEventCallbacks> = {}) {
    if (this.socket?.connected || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;
    this.callbacks = callbacks;

    return new Promise<void>((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          forceNew: true
        });

        this.setupEventListeners();

        // Resolve on successful connection
        this.socket.on('connect', () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        });

        // Reject on connection error
        this.socket.on('connect_error', (error) => {
          this.isConnecting = false;
          reject(error);
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.callbacks.onDisconnect?.();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.callbacks.onConnectionError?.(error);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
      this.reconnectAttempts = attemptNumber;
      this.callbacks.onReconnectAttempt?.(attemptNumber);
    });

    this.socket.on('locationUpdate', (data: LocationData) => {
      console.log('Location update received:', data);
      this.callbacks.onLocationUpdate?.(data);
    });

    this.socket.on('driversUpdate', (data: Driver[]) => {
      console.log('Drivers update received:', data);
      this.callbacks.onDriversUpdate?.(data);
    });

    this.socket.on('alertUpdate', (data: AlertData) => {
      console.log('Alert update received:', data);
      this.callbacks.onAlertUpdate?.(data);
    });

    this.socket.on('driverStatusChange', (data: { driverId: string; status: string }) => {
      console.log('Driver status change:', data);
      this.callbacks.onDriverStatusChange?.(data);
    });

    // Handle server errors
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.callbacks.onConnectionError?.(new Error(error));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.callbacks = {};
    this.isConnecting = false;
  }

  // Emit events to server
  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  // Request data from server
  requestDrivers() {
    this.emit('requestDrivers');
  }

  requestDriverHistory(deviceId: string, hours: number = 24) {
    this.emit('requestDriverHistory', { deviceId, hours });
  }

  // Get connection status
  get connected() {
    return this.socket?.connected || false;
  }

  get connecting() {
    return this.isConnecting;
  }

  get connectionId() {
    return this.socket?.id;
  }

  get currentReconnectAttempts() {
    return this.reconnectAttempts;
  }

  // Event subscription methods for better API
  onConnect(callback: () => void) {
    this.callbacks.onConnect = callback;
  }

  onDisconnect(callback: () => void) {
    this.callbacks.onDisconnect = callback;
  }

  onLocationUpdate(callback: (data: LocationData) => void) {
    this.callbacks.onLocationUpdate = callback;
  }

  onDriversUpdate(callback: (data: Driver[]) => void) {
    this.callbacks.onDriversUpdate = callback;
  }

  onAlertUpdate(callback: (data: AlertData) => void) {
    this.callbacks.onAlertUpdate = callback;
  }

  onConnectionError(callback: (error: Error) => void) {
    this.callbacks.onConnectionError = callback;
  }

  onReconnectAttempt(callback: (attemptNumber: number) => void) {
    this.callbacks.onReconnectAttempt = callback;
  }

  onDriverStatusChange(callback: (data: { driverId: string; status: string }) => void) {
    this.callbacks.onDriverStatusChange = callback;
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Also export the class for testing or multiple instances if needed
export default SocketService; 