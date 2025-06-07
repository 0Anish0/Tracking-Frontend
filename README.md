# Location Tracker Admin Panel

React + Vite web application for viewing real-time location updates on OpenStreetMap.

## Features

- Real-time location tracking
- Interactive OpenStreetMap integration
- WebSocket connection status monitoring
- Location details panel
- Responsive design
- Live location updates with markers

## Prerequisites

- Node.js 18+
- Modern web browser

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

The development server will run on `http://localhost:5173`

## Configuration

### Socket URL
The admin panel connects to the backend server via WebSocket. Update the `SOCKET_URL` in `src/App.tsx` if your backend runs on a different address:

```typescript
const SOCKET_URL = 'http://localhost:3001';
```

## Map Features

- **OpenStreetMap Tiles**: Uses free OpenStreetMap tiles
- **Real-time Markers**: Shows current location with detailed popup
- **Auto Zoom**: Automatically centers and zooms to new locations
- **Location Details**: Displays coordinates, accuracy, and timestamp

## Connection Status

The admin panel shows real-time connection status:
- 🟢 **Connected**: Successfully connected to backend
- 🔴 **Disconnected**: Connection lost or server unavailable

## Location Information Panel

The right sidebar displays:
- **Current coordinates** (latitude/longitude)
- **Location accuracy** in meters
- **Timestamp** of last update  
- **Connection status** and server URL

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Deployment

### Static Hosting
1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Update the socket URL to point to your production backend

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

## Troubleshooting

### Connection Issues
1. Ensure the backend server is running
2. Check the `SOCKET_URL` matches your backend address
3. Verify CORS is enabled on the backend
4. Check browser console for WebSocket errors

### Map Not Loading
1. Check internet connection (OpenStreetMap requires internet)
2. Clear browser cache
3. Check browser console for tile loading errors

### Location Not Updating
1. Verify mobile app is sending location data
2. Check backend logs for incoming location events
3. Ensure WebSocket connection is established
4. Check browser network tab for WebSocket messages

## Development

### Project Structure
- `src/App.tsx` - Main application component
- `src/App.css` - Styling and responsive design
- `public/` - Static assets

### Dependencies
- **React** - UI framework
- **Leaflet** - Map library
- **React-Leaflet** - React wrapper for Leaflet
- **Socket.IO Client** - WebSocket communication
- **Vite** - Build tool and dev server

## Usage

1. Start the backend server first
2. Launch the admin panel
3. Check connection status in the header
4. Send location from mobile app
5. View real-time location updates on the map
6. Click markers for detailed location information
