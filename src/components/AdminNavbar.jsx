import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiHome, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/admin'); };

  const linkStyle = (path) => ({
    display:'flex', alignItems:'center', gap:'0.5rem',
    padding:'0.45rem 1rem', borderRadius:8, fontSize:'0.875rem', fontWeight:600,
    color: isActive(path) ? '#2563eb' : '#64748b',
    background: isActive(path) ? '#dbeafe' : 'transparent',
    textDecoration:'none', transition:'all 0.15s', cursor:'pointer', border:'none',
    fontFamily:'var(--font-body)',
  });

  return (
    <nav style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0.75rem 0', position:'sticky', top:0, zIndex:1000, boxShadow:'0 2px 8px rgba(15,23,42,0.06)' }}>
      <div className="container d-flex align-items-center justify-content-between">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg, #1a1a2e, #2563eb)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FiShield size={16} color="#fff" />
          </div>
          <span style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'1.1rem', color:'#0f172a' }}>
            Admin <span style={{ color:'#2563eb' }}>Panel</span>
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
          <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}><FiGrid size={14} />Dashboard</Link>
          <Link to="/admin/users" style={linkStyle('/admin/users')}><FiUsers size={14} />Users</Link>
          <Link to="/admin/boardings" style={linkStyle('/admin/boardings')}><FiHome size={14} />Listings</Link>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
          <Link to="/" style={{ fontSize:'0.8rem', color:'#64748b', textDecoration:'none' }}>← Main Site</Link>
          <button onClick={handleLogout}
            style={{ background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:8, padding:'0.4rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.82rem', fontWeight:600, fontFamily:'var(--font-body)' }}>
            <FiLogOut size={13} />Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
