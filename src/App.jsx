import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBoarding from './pages/AddBoarding';
import BoardingDetail from './pages/BoardingDetail';
import Favorites from './pages/Favorites';
import MapPage from './pages/MapPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminBoardings from './pages/AdminBoardings';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/boarding/:id" element={<MainLayout><BoardingDetail /></MainLayout>} />
          <Route path="/map" element={<MainLayout><MapPage /></MainLayout>} />
          <Route path="/add" element={<MainLayout><ProtectedRoute><AddBoarding /></ProtectedRoute></MainLayout>} />
          <Route path="/favorites" element={<MainLayout><ProtectedRoute><Favorites /></ProtectedRoute></MainLayout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
          <Route path="/admin/boardings" element={<AdminRoute><AdminBoardings /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
