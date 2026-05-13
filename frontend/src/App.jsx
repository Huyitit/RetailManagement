import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import POSScreen from './pages/POSScreen';
import Orders from './pages/Orders';
import Warranty from './pages/Warranty';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Staff from './pages/Staff';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';

const FULLSCREEN_ROUTES = ['/login', '/pos', '/'];

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const fullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  if (fullscreen) {
    return <div style={{ width: '100vw', height: '100vh' }}>{children}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--page-bg)'
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', background: 'var(--page-bg)' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POSScreen />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
