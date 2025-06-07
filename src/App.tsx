import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import FleetManagement from './pages/FleetManagement';
import Analytics from './pages/Analytics';
import RoutesPage from './pages/Routes';
import Geofences from './pages/Geofences';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import { ROUTES } from './constants';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.DRIVERS} element={<Drivers />} />
            <Route path={ROUTES.FLEET} element={<FleetManagement />} />
            <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
            <Route path={ROUTES.ROUTES} element={<RoutesPage />} />
            <Route path={ROUTES.GEOFENCES} element={<Geofences />} />
            <Route path={ROUTES.ALERTS} element={<Alerts />} />
            <Route path={ROUTES.REPORTS} element={<Reports />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
