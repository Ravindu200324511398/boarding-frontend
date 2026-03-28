// ============================================
// App.js — Router Setup
// ============================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./context/AuthContext.jsx";

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBoarding from './pages/AddBoarding';
import BoardingDetail from './pages/BoardingDetail';
import Favorites from './pages/Favorites';
import MapPage from './pages/MapPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/boarding/:id" element={<BoardingDetail />} />
          <Route path="/map" element={<MapPage />} />

          {/* Protected routes — require login */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddBoarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;