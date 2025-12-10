// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// App Pages
import Dashboard from './pages/dashboard/Dashboard';
import MotorcycleList from './pages/motorcycles/MotorcycleList';
import MotorcycleForm from './pages/motorcycles/MotorcycleForm';
import MotorcycleDetail from './pages/motorcycles/MotorcycleDetail';
import MotorcycleEdit from './pages/motorcycles/MotorcycleEdit';
import PartsPage from './pages/parts/PartsPage';   // ✅ ROUTE BARU DITAMBAHKAN

import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Create theme
const theme = createTheme({
  palette: {
    primary: { main: '#4f46e5' },
    secondary: { main: '#10b981' },
    error: { main: '#ef4444' },
    background: { default: '#f9fafb' },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, padding: '8px 16px' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiSvgIcon: { styleOverrides: { root: { fontSize: '0.875rem' } } },
  },
});

// Wrapper for auth logic
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />

      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />

      <Route
        path="/forgot-password"
        element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" replace />}
      />
      
      <Route
        path="/reset-password"
        element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" replace />}
      />

      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Motorcycle List */}
        <Route
          path="motorcycles"
          element={
            <PrivateRoute>
              <MotorcycleList />
            </PrivateRoute>
          }
        />

        {/* Add Motorcycle */}
        <Route
          path="motorcycles/add"
          element={
            <PrivateRoute>
              <MotorcycleForm />
            </PrivateRoute>
          }
        />
        
        {/* Redirect /motorcycles/new to /motorcycles/add for backward compatibility */}
        <Route
          path="motorcycles/new"
          element={
            <PrivateRoute>
              <Navigate to="/motorcycles/add" replace />
            </PrivateRoute>
          }
        />

        {/* Motorcycle Detail */}
        <Route
          path="motorcycles/:id"
          element={
            <PrivateRoute>
              <MotorcycleDetail />
            </PrivateRoute>
          }
        />

        {/* Edit Motorcycle */}
        <Route
          path="motorcycles/:id/edit"
          element={
            <PrivateRoute>
              <MotorcycleEdit />
            </PrivateRoute>
          }
        />

        {/* NEW: Parts Management Page */}
        <Route
          path="motorcycles/:id/parts"
          element={
            <PrivateRoute>
              <PartsPage />
            </PrivateRoute>
          }
        />

        {/* Profile */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
