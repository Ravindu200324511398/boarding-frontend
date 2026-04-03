import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import {
  FiHome, FiPlusCircle, FiHeart, FiMap, FiBell, FiMessageSquare,
  FiBarChart2, FiLogIn, FiLogOut, FiUserPlus, FiMenu, FiX,
  FiShield, FiUser, FiChevronDown, FiCheck, FiMoon, FiSun, FiGrid
} from 'react-icons/fi';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// --- Added Currency Selector Component ---
const CurrencySelector = () => {
  const { currency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '12px', padding: '0.5rem 0.8rem',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#334155'
        }}
      >
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <FiChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}/>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '115%', right: 0,
          background: '#fff', border: '1px solid #f1f5f9',
          borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          minWidth: '160px', zIndex: 1100, padding: '0.4rem', overflow: 'hidden'
        }}>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { changeCurrency(c.code); setIsOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 0.8rem', border: 'none', borderRadius: '10px',
                background: currency.code === c.code ? '#f0fdf4' : 'transparent',
                color: currency.code === c.code ? '#10b981' : '#475569',
                fontSize: '0.85rem', fontWeight: currency.code === c.code ? 800 : 500,
                textAlign: 'left', cursor: 'pointer', transition: '0.2s'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
              <span>{c.code}</span>
              {currency.code === c.code && <FiCheck style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showInquiries, setShowInquiries] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: '0.2s all ease',
    color: isActive(path) ? '#10b981' : '#475569',
    background: isActive(path) ? '#f0fdf4' : 'transparent',
  });

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky', top: 0, zIndex: 1000,
      padding: '0.7rem 0'
    }}>
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Left: Brand */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.6rem' }}>🏠</span>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 800, fontSize: '1.4rem', color: '#0f172a' }}>
            Boarding<span style={{ color: '#10b981' }}>Finder</span>
          </span>
        </Link>

        {/* Center: Essential Navigation */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          <Link to="/" style={navLinkStyle('/')}><FiHome size={18}/>Home</Link>
          <Link to="/map" style={navLinkStyle('/map')}><FiMap size={18}/>Map</Link>
          <Link to="/compare" style={navLinkStyle('/compare')}><FiBarChart2 size={18}/>Compare</Link>
          
          {isAuth && (
            <div style={{ position: 'relative' }} 
                 onMouseEnter={() => setShowInquiries(true)} 
                 onMouseLeave={() => setShowInquiries(false)}>
              <button style={{
                ...navLinkStyle('/inquiries'),
                border: 'none', background: (isActive('/inquiries') || isActive('/my-inquiries')) ? '#f0fdf4' : 'transparent',
                cursor: 'pointer'
              }}>
                <FiGrid size={18}/> My Activity <FiChevronDown size={14}/>
              </button>
              
              {showInquiries && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, background: '#fff',
                  border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.5rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)', minWidth: '200px', animation: 'navFadeIn 0.2s ease'
                }}>
                  <Link to="/inquiries" style={navLinkStyle('/inquiries')}><FiBell size={16}/> Received Inquiries</Link>
                  <Link to="/my-inquiries" style={navLinkStyle('/my-inquiries')}><FiMessageSquare size={16}/> Sent Requests</Link>
                  <Link to="/favorites" style={navLinkStyle('/favorites')}><FiHeart size={16}/> Saved Places</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="d-flex align-items-center gap-3">
          
          {/* --- Placement of Currency Selector --- */}
          <CurrencySelector />

          {isAuth ? (
            <>
              <Link to="/add" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#10b981', color: '#fff', border: 'none',
                  borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem',
                  fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                }}>
                  <FiPlusCircle size={16}/> List Property
                </button>
              </Link>

              <div style={{ position: 'relative' }}
                   onMouseEnter={() => setShowUserMenu(true)}
                   onMouseLeave={() => setShowUserMenu(false)}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.6rem', 
                  padding: '0.4rem 0.8rem', borderRadius: '12px', 
                  background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' 
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', overflow: 'hidden' }}>
                    {user?.avatar ? <img src={`${AVATAR_BASE}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{user?.name?.split(' ')[0]}</span>
                </div>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, background: '#fff',
                    border: '1px solid #f1f5f9', borderRadius: '14px', padding: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)', minWidth: '180px'
                  }}>
                    {user?.isAdmin && (
                      <Link to="/admin/dashboard" style={navLinkStyle('/admin/dashboard')}><FiShield size={16}/> Admin Panel</Link>
                    )}
                    <Link to="/profile" style={navLinkStyle('/profile')}><FiUser size={16}/> Profile Settings</Link>
                    <hr style={{ margin: '0.5rem', opacity: 0.1 }} />
                    <button onClick={handleLogout} style={{
                      ...navLinkStyle(''), color: '#ef4444', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer'
                    }}><FiLogOut size={16}/> Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" style={{ textDecoration: 'none', color: '#475569', fontWeight: 700, fontSize: '0.9rem', padding: '0.6rem 1rem' }}>Sign In</Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  background: '#10b981', color: '#fff', border: 'none', 
                  borderRadius: '12px', padding: '0.6rem 1.3rem', fontSize: '0.85rem', 
                  fontWeight: 700, cursor: 'pointer' 
                }}>Get Started</button>
              </Link>
            </div>
          )}
          
          <button onClick={toggleTheme} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
            {isDark ? <FiSun size={18}/> : <FiMoon size={18}/>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;