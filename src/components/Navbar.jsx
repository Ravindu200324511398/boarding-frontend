import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiPlusCircle, FiHeart, FiMap,
  FiLogIn, FiLogOut, FiUserPlus, FiMenu, FiX, FiShield
} from 'react-icons/fi';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="bf-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="brand">
          🏠 Boarding<span>Finder</span>
        </Link>

        {/* Desktop Menu */}
        <div className="d-none d-md-flex align-items-center gap-1">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FiHome style={{marginRight:4}} />Home
          </Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`}>
            <FiMap style={{marginRight:4}} />Map
          </Link>
          {isAuth && (
            <>
              <Link to="/add" className={`nav-link ${isActive('/add')}`}>
                <FiPlusCircle style={{marginRight:4}} />Add Boarding
              </Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}>
                <FiHeart style={{marginRight:4}} />Favorites
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="d-none d-md-flex align-items-center gap-2">
          {isAuth ? (
            <>
              {/* Show Admin Panel button if user is admin */}
              {user?.isAdmin && (
                <Link to="/admin/dashboard">
                  <button style={{
                    background:'linear-gradient(135deg,#1a1a2e,#2563eb)',
                    color:'#fff', border:'none', borderRadius:10,
                    padding:'0.45rem 1rem', fontSize:'0.82rem',
                    fontWeight:700, cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'0.4rem',
                    fontFamily:'var(--font-heading)'
                  }}>
                    <FiShield size={13} />Admin Panel
                  </button>
                </Link>
              )}
              <span style={{fontSize:'0.85rem', color:'#64748b', fontWeight:500}}>
                Hi, {user?.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline-custom"
                style={{padding:'0.45rem 1rem', fontSize:'0.875rem'}}>
                <FiLogOut style={{marginRight:4}} />Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                <FiLogIn style={{marginRight:4}} />Login
              </Link>
              <Link to="/register">
                <button className="btn-primary-custom ms-1"
                  style={{padding:'0.45rem 1.1rem', fontSize:'0.875rem'}}>
                  <FiUserPlus style={{marginRight:4}} />Register
                </button>
              </Link>
              {/* Admin login link */}
              <Link to="/admin">
                <button style={{
                  background:'transparent', color:'#94a3b8',
                  border:'1px solid #e2e8f0', borderRadius:8,
                  padding:'0.4rem 0.8rem', fontSize:'0.78rem',
                  cursor:'pointer', display:'flex', alignItems:'center',
                  gap:'0.3rem', fontFamily:'var(--font-body)'
                }}>
                  <FiShield size={12} />Admin
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="d-md-none" onClick={() => setOpen(!open)}
          style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#0f172a'}}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="container mt-2 d-md-none"
          style={{paddingBottom:'1rem', borderTop:'1px solid #e2e8f0', paddingTop:'1rem'}}>
          <div className="d-flex flex-column gap-1">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setOpen(false)}>
              <FiHome style={{marginRight:6}} />Home
            </Link>
            <Link to="/map" className={`nav-link ${isActive('/map')}`} onClick={() => setOpen(false)}>
              <FiMap style={{marginRight:6}} />Map
            </Link>
            {isAuth ? (
              <>
                <Link to="/add" className={`nav-link ${isActive('/add')}`} onClick={() => setOpen(false)}>
                  <FiPlusCircle style={{marginRight:6}} />Add Boarding
                </Link>
                <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`} onClick={() => setOpen(false)}>
                  <FiHeart style={{marginRight:6}} />Favorites
                </Link>
                {user?.isAdmin && (
                  <Link to="/admin/dashboard" className="nav-link" onClick={() => setOpen(false)}>
                    <FiShield style={{marginRight:6}} />Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-link text-start"
                  style={{background:'none', border:'none', color:'#ef4444', fontWeight:500, cursor:'pointer'}}>
                  <FiLogOut style={{marginRight:6}} />Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setOpen(false)}>
                  <FiLogIn style={{marginRight:6}} />Login
                </Link>
                <Link to="/register" className={`nav-link ${isActive('/register')}`} onClick={() => setOpen(false)}>
                  <FiUserPlus style={{marginRight:6}} />Register
                </Link>
                <Link to="/admin" className="nav-link" onClick={() => setOpen(false)}>
                  <FiShield style={{marginRight:6}} />Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
