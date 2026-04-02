import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPlusCircle, FiHeart, FiMap, FiBell, FiMessageSquare, FiBarChart2, FiLogIn, FiLogOut, FiUserPlus, FiMenu, FiX, FiShield, FiUser } from 'react-icons/fi';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const NavAvatar = ({ size = 26 }) => {
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const avatarUrl = user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null;
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)', border: '2px solid #e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          : <span style={{ fontSize: size * 0.38, fontWeight: 800, color: '#fff' }}>{initials}</span>}
      </div>
    );
  };

  return (
    <nav className="bf-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="brand">🏠 Boarding<span>Finder</span></Link>

        <div className="d-none d-md-flex align-items-center gap-1">
          <Link to="/" className={`nav-link ${isActive('/')}`}><FiHome style={{ marginRight: 4 }} />Home</Link>
          <Link to="/compare" className={`nav-link ${isActive('/compare')}`}><FiBarChart2 style={{marginRight:4}}/>Compare</Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`}><FiMap style={{ marginRight: 4 }} />Map</Link>
          {isAuth && (
            <>
              <Link to="/add" className={`nav-link ${isActive('/add')}`}><FiPlusCircle style={{ marginRight: 4 }} />Add Boarding</Link>
              <Link to="/inquiries" className={`nav-link ${isActive('/inquiries')}`}>
                <FiBell style={{marginRight:4}}/>Inquiries
              </Link>
              <Link to="/my-inquiries" className={`nav-link ${isActive('/my-inquiries')}`}>
                <FiMessageSquare style={{marginRight:4}}/>My Requests
              </Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}><FiHeart style={{ marginRight: 4 }} />Favorites</Link>
            </>
          )}
        </div>

        <div className="d-none d-md-flex align-items-center gap-2">
          {isAuth ? (
            <>
              {user?.isAdmin && (
                <Link to="/admin/dashboard">
                  <button style={{ background: 'linear-gradient(135deg,#1a1a2e,#2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                    <FiShield size={13} />Admin Panel
                  </button>
                </Link>
              )}
              <Link to="/profile">
                <button style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.4rem 0.9rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                  <NavAvatar size={24} />
                  {user?.name?.split(' ')[0]}
                </button>
              </Link>
              <button onClick={toggleTheme} title="Toggle theme"
              style={{ background:'transparent', border:'1px solid #e2e8f0', borderRadius:8, padding:'0.4rem 0.65rem', cursor:'pointer', fontSize:'1.1rem', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="btn-outline-custom" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                <FiLogOut style={{ marginRight: 4 }} />Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}><FiLogIn style={{ marginRight: 4 }} />Login</Link>
              <Link to="/register">
                <button className="btn-primary-custom ms-1" style={{ padding: '0.45rem 1.1rem', fontSize: '0.875rem' }}>
                  <FiUserPlus style={{ marginRight: 4 }} />Register
                </button>
              </Link>
              <button onClick={toggleTheme} style={{ background:'transparent', border:'1px solid #e2e8f0', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', color:'inherit' }} title="Toggle dark mode">
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/admin">
                <button style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)' }}>
                  <FiShield size={12} />Admin
                </button>
              </Link>
            </>
          )}
        </div>

        <button className="d-md-none" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#0f172a' }}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="container mt-2 d-md-none" style={{ paddingBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <div className="d-flex flex-column gap-1">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setOpen(false)}><FiHome style={{ marginRight: 6 }} />Home</Link>
            <Link to="/compare" className={`nav-link ${isActive('/compare')}`}><FiBarChart2 style={{marginRight:4}}/>Compare</Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`} onClick={() => setOpen(false)}><FiMap style={{ marginRight: 6 }} />Map</Link>
            {isAuth ? (
              <>
                <Link to="/add" className={`nav-link ${isActive('/add')}`} onClick={() => setOpen(false)}><FiPlusCircle style={{ marginRight: 6 }} />Add Boarding</Link>
                <Link to="/inquiries" className={`nav-link ${isActive('/inquiries')}`}>
                <FiBell style={{marginRight:4}}/>Inquiries
              </Link>
              <Link to="/my-inquiries" className={`nav-link ${isActive('/my-inquiries')}`}>
                <FiMessageSquare style={{marginRight:4}}/>My Requests
              </Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`} onClick={() => setOpen(false)}><FiHeart style={{ marginRight: 6 }} />Favorites</Link>
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={() => setOpen(false)}>
                  <NavAvatar size={18} /><span style={{ marginLeft: 6 }}>My Profile</span>
                </Link>
                {user?.isAdmin && <Link to="/admin/dashboard" className="nav-link" onClick={() => setOpen(false)}><FiShield style={{ marginRight: 6 }} />Admin Panel</Link>}
                <button onClick={handleLogout} className="nav-link text-start" style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer' }}>
                  <FiLogOut style={{ marginRight: 6 }} />Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setOpen(false)}><FiLogIn style={{ marginRight: 6 }} />Login</Link>
                <Link to="/register" className={`nav-link ${isActive('/register')}`} onClick={() => setOpen(false)}><FiUserPlus style={{ marginRight: 6 }} />Register</Link>
                <Link to="/admin" className="nav-link" onClick={() => setOpen(false)}><FiShield style={{ marginRight: 6 }} />Admin Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
