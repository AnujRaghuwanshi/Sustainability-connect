import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './pages/AdminLayout.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProviderPage from './pages/ProviderPage.jsx';
import PickupsPage from './pages/PickupsStatusPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

function RequireAuth({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="providers" element={<ProviderPage />} />
        <Route path="pickups" element={<PickupsPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
