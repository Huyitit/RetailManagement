import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import POSScreen from './pages/POSScreen';
import Orders from './pages/Orders';
import Warranty from './pages/Warranty';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const hideSidebar = ['/login', '/register', '/pos', '/'].includes(location.pathname);

  if (hideSidebar) {
    return <div style={{ width: '100vw', height: '100vh' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', background: '#f8fafc' }}>
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
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POSScreen />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;