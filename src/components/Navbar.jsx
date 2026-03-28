import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPlusCircle, FiHeart, FiMap, FiLogIn, FiLogOut, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="bf-navbar" style={{ boxShadow: scrolled ? '0 4px 24px rgba(26,18,8,0.1)' : 'none' }}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="brand">
          <span style={{ fontSize:'1.4rem' }}>🏠</span>
          Boarding<span className="brand-accent">Finder</span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-md-flex align-items-center gap-1">
          <Link to="/" className={`nav-link ${isActive('/')}`}><FiHome size={14} style={{marginRight:5}} />Home</Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`}><FiMap size={14} style={{marginRight:5}} />Map</Link>
          {isAuth && (
            <>
              <Link to="/add" className={`nav-link ${isActive('/add')}`}><FiPlusCircle size={14} style={{marginRight:5}} />Add</Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}><FiHeart size={14} style={{marginRight:5}} />Saved</Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="d-none d-md-flex align-items-center gap-2">
          {isAuth ? (
            <>
              <span className="nav-user-chip">👋 {user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-ghost" style={{fontSize:'0.85rem',padding:'0.4rem 1rem'}}>
                <FiLogOut size={14} />Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-ghost" style={{fontSize:'0.85rem',padding:'0.4rem 1rem'}}><FiLogIn size={14} />Login</button></Link>
              <Link to="/register"><button className="btn-primary-custom" style={{padding:'0.5rem 1.2rem',fontSize:'0.85rem'}}><FiUserPlus size={14} />Register</button></Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="d-md-none"
          style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',color:'var(--ink)',padding:'0.2rem'}}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="container d-md-none" style={{paddingTop:'1rem',paddingBottom:'1.2rem',borderTop:'1px solid var(--sand)',marginTop:'0.8rem'}}>
          <div className="d-flex flex-column gap-1">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setOpen(false)}><FiHome size={14} style={{marginRight:6}} />Home</Link>
            <Link to="/map" className={`nav-link ${isActive('/map')}`} onClick={() => setOpen(false)}><FiMap size={14} style={{marginRight:6}} />Map</Link>
            {isAuth ? (
              <>
                <Link to="/add" className={`nav-link ${isActive('/add')}`} onClick={() => setOpen(false)}><FiPlusCircle size={14} style={{marginRight:6}} />Add Boarding</Link>
                <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`} onClick={() => setOpen(false)}><FiHeart size={14} style={{marginRight:6}} />Saved</Link>
                <button onClick={handleLogout} className="nav-link text-start" style={{background:'none',border:'none',color:'var(--terracotta)',fontWeight:500,cursor:'pointer',padding:'0.45rem 1rem'}}><FiLogOut size={14} style={{marginRight:6}} />Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setOpen(false)}><FiLogIn size={14} style={{marginRight:6}} />Login</Link>
                <Link to="/register" className={`nav-link ${isActive('/register')}`} onClick={() => setOpen(false)}><FiUserPlus size={14} style={{marginRight:6}} />Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;