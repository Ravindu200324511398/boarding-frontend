import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBoarding from './pages/AddBoarding';
import EditBoarding from './pages/EditBoarding';
import BoardingDetail from './pages/BoardingDetail';
import Favorites from './pages/Favorites';
import MapPage from './pages/MapPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';

import ComparePage from './pages/ComparePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminBoardings from './pages/AdminBoardings';

const MainLayout = ({ children }) => (
  <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

function App() {
  return (
    <ThemeProvider><AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/boarding/:id" element={<MainLayout><BoardingDetail /></MainLayout>} />
          <Route path="/map" element={<MainLayout><MapPage /></MainLayout>} />
          <Route path="/compare" element={<MainLayout><ComparePage /></MainLayout>} />
          <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
          <Route path="/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />

          {/* Protected user routes */}
          <Route path="/edit/:id" element={<MainLayout><ProtectedRoute><EditBoarding /></ProtectedRoute></MainLayout>} />
          <Route path="/add" element={<MainLayout><ProtectedRoute><AddBoarding /></ProtectedRoute></MainLayout>} />
          <Route path="/favorites" element={<MainLayout><ProtectedRoute><Favorites /></ProtectedRoute></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProtectedRoute><Profile /></ProtectedRoute></MainLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
          <Route path="/admin/boardings" element={<AdminRoute><AdminBoardings /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider></ThemeProvider>
  );
}

export default App;
