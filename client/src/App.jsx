import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages - to be created next
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
