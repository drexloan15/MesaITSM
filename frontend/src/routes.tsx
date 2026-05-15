import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Layout/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="problems" element={<PlaceholderPage title="Problemas" />} />
        <Route path="changes" element={<PlaceholderPage title="Cambios (RFC)" />} />
        <Route path="knowledge-base" element={<PlaceholderPage title="Base de Conocimiento" />} />
        <Route path="users" element={<PlaceholderPage title="Usuarios" />} />
        <Route path="admin" element={<PlaceholderPage title="Administración" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
