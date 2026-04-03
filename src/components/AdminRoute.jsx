import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';

const AdminRoute = ({ children }) => {
  const { isAuth, user, loading } = useAuth();

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;
  if (!isAuth || !user?.isAdmin) return <Navigate to="/admin" replace />;

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

export default AdminRoute;
