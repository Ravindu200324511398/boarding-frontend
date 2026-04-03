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

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    .admin-nav {
      background: linear-gradient(90deg, #060f2a 0%, #091428 60%, #0a1a35 100%);
      border-bottom: 1px solid rgba(14,165,233,0.18);
      padding: 0 2rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-shadow: 0 2px 24px rgba(0,212,170,0.07);
    }
    .admin-nav::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.4), transparent);
    }
    .admin-nav-link {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 9px;
      font-size: 0.84rem; font-weight: 700;
      color: rgba(220,233,255,0.55);
      text-decoration: none; transition: all 0.2s ease;
      border: 1px solid transparent;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .admin-nav-link:hover {
      color: rgba(220,233,255,0.9);
      background: rgba(14,165,233,0.1);
      border-color: rgba(14,165,233,0.2);
    }
    .admin-nav-link.active {
      color: #00d4aa;
      background: rgba(0,212,170,0.1);
      border-color: rgba(0,212,170,0.25);
      box-shadow: 0 0 12px rgba(0,212,170,0.12);
    }
    @keyframes navblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  `;

  const linkStyle = (path) => ({
    className: `admin-nav-link${isActive(path) ? ' active' : ''}`,
  });

  return (
    <>
      <style>{CSS}</style>
      <nav className="admin-nav">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0,212,170,0.35)',
          }}>
            <FiShield size={16} color="#05060f" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 800, fontSize: '1.05rem', color: '#dce9ff', letterSpacing: '-0.01em',
          }}>
            Admin{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Panel</span>
          </span>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00d4aa', boxShadow: '0 0 6px #00d4aa',
            display: 'inline-block', animation: 'navblink 2s infinite',
          }} />
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/admin/dashboard" className={`admin-nav-link${isActive('/admin/dashboard') ? ' active' : ''}`}>
            <FiGrid size={14} /> Dashboard
          </Link>
          <Link to="/admin/users" className={`admin-nav-link${isActive('/admin/users') ? ' active' : ''}`}>
            <FiUsers size={14} /> Users
          </Link>
          <Link to="/admin/boardings" className={`admin-nav-link${isActive('/admin/boardings') ? ' active' : ''}`}>
            <FiHome size={14} /> Listings
          </Link>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{
            fontSize: '0.78rem', color: 'rgba(220,233,255,0.35)',
            textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
          }}>← Main Site</Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9,
            padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s ease',
          }}>
            <FiLogOut size={13} /> Logout
          </button>
        </div>

      </nav>
    </>
  );
};

export default AdminNavbar;