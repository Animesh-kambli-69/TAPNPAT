import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DriverOnboarding from './pages/Driver/DriverOnboarding';
import DriverDashboard from './pages/Driver/DriverDashboard';
import DriverRides from './pages/Driver/Rides';
import DriverEarnings from './pages/Driver/Earnings';
import DriverPaymentDisplay from './pages/Driver/DriverPaymentDisplay';
import CustomerOnboarding from './pages/Customer/CustomerOnboarding';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import CustomerWallet from './pages/Customer/Wallet';
import CustomerTransactions from './pages/Customer/Transactions';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/Users';
import AdminTransactions from './pages/Admin/Transactions';

// Route guard component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Routes component that uses auth
function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue"></div>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {user.role === 'driver' && (
            <>
              <Route path="/driver/onboarding" element={<ProtectedRoute requiredRole="driver"><DriverOnboarding /></ProtectedRoute>} />
              <Route path="/driver/dashboard" element={<ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>} />
              <Route path="/driver/rides" element={<ProtectedRoute requiredRole="driver"><DriverRides /></ProtectedRoute>} />
              <Route path="/driver/earnings" element={<ProtectedRoute requiredRole="driver"><DriverEarnings /></ProtectedRoute>} />
              <Route path="/driver/payment-card" element={<ProtectedRoute requiredRole="driver"><DriverPaymentDisplay /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/driver/onboarding" replace />} />
              <Route path="*" element={<Navigate to="/driver/onboarding" replace />} />
            </>
          )}

          {user.role === 'customer' && (
            <>
              <Route path="/customer/onboarding" element={<ProtectedRoute requiredRole="customer"><CustomerOnboarding /></ProtectedRoute>} />
              <Route path="/customer/dashboard" element={<ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/wallet" element={<ProtectedRoute requiredRole="customer"><CustomerWallet /></ProtectedRoute>} />
              <Route path="/customer/transactions" element={<ProtectedRoute requiredRole="customer"><CustomerTransactions /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/customer/onboarding" replace />} />
              <Route path="*" element={<Navigate to="/customer/onboarding" replace />} />
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/transactions" element={<ProtectedRoute requiredRole="admin"><AdminTransactions /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}

          {!user.role && (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </>
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
