import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import {
  FiHome, FiPlusCircle, FiHeart, FiMap, FiBell, FiMessageSquare,
  FiBarChart2, FiLogIn, FiLogOut, FiUserPlus, FiMenu, FiX,
  FiShield, FiUser, FiChevronDown, FiCheck
} from 'react-icons/fi';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// ── CURRENCY SELECTOR DROPDOWN ────────────────────────────
const CurrencySelector = () => {
  const { currency, changeCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Change currency"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: open ? '#eff6ff' : '#f8fafc',
          border: `1.5px solid ${open ? '#2563eb' : '#e2e8f0'}`,
          borderRadius: 10, padding: '0.4rem 0.75rem',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          fontSize: '0.82rem', fontWeight: 700,
          color: open ? '#2563eb' : '#374151',
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currency.flag}</span>
        <span>{currency.code}</span>
        <FiChevronDown
          size={12}
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff', border: '1.5px solid #e2e8f0',
          borderRadius: 16, boxShadow: '0 12px 40px rgba(15,23,42,0.15)',
          minWidth: 240, zIndex: 9999, overflow: 'hidden',
          animation: 'fadeSlideDown 0.15s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '0.75rem 1rem 0.5rem',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.72rem', fontWeight: 800,
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em',
          }}>
            Select Currency
          </div>

          {/* Options */}
          <div style={{ maxHeight: 340, overflowY: 'auto', padding: '0.4rem 0' }}>
            {CURRENCIES.map(c => {
              const isSelected = c.code === currency.code;
              return (
                <button
                  key={c.code}
                  onClick={() => { changeCurrency(c.code); setOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '0.75rem', padding: '0.6rem 1rem',
                    background: isSelected ? '#eff6ff' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.12s', fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                        {c.code}
                      </span>
                      <span style={{
                        fontSize: '0.7rem', color: '#fff', fontWeight: 700,
                        background: '#94a3b8', borderRadius: 4, padding: '0.05rem 0.35rem',
                      }}>
                        {c.symbol}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.05rem' }}>
                      {c.name}
                    </div>
                  </div>
                  {isSelected && <FiCheck size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div style={{
            padding: '0.5rem 1rem 0.65rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center',
          }}>
            Rates are approximate · Prices stored in LKR
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── NAVBAR ────────────────────────────────────────────────
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

        {/* Desktop Nav Links */}
        <div className="d-none d-md-flex align-items-center gap-1">
          <Link to="/" className={`nav-link ${isActive('/')}`}><FiHome style={{ marginRight: 4 }} />Home</Link>
          <Link to="/compare" className={`nav-link ${isActive('/compare')}`}><FiBarChart2 style={{ marginRight: 4 }} />Compare</Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`}><FiMap style={{ marginRight: 4 }} />Map</Link>
          {isAuth && (
            <>
              <Link to="/add" className={`nav-link ${isActive('/add')}`}><FiPlusCircle style={{ marginRight: 4 }} />Add Boarding</Link>
              <Link to="/inquiries" className={`nav-link ${isActive('/inquiries')}`}><FiBell style={{ marginRight: 4 }} />Inquiries</Link>
              <Link to="/my-inquiries" className={`nav-link ${isActive('/my-inquiries')}`}><FiMessageSquare style={{ marginRight: 4 }} />My Requests</Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}><FiHeart style={{ marginRight: 4 }} />Favorites</Link>
            </>
          )}
        </div>

        {/* Desktop Right Actions */}
        <div className="d-none d-md-flex align-items-center gap-2">
          {/* 💱 Currency Selector — always visible */}
          <CurrencySelector />

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
                style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.4rem 0.65rem', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.4rem 0.7rem', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }} title="Toggle dark mode">
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

        {/* Mobile hamburger */}
        <button className="d-md-none" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#0f172a' }}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="container mt-2 d-md-none" style={{ paddingBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <div className="d-flex flex-column gap-1">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setOpen(false)}><FiHome style={{ marginRight: 6 }} />Home</Link>
            <Link to="/compare" className={`nav-link ${isActive('/compare')}`} onClick={() => setOpen(false)}><FiBarChart2 style={{ marginRight: 4 }} />Compare</Link>
            <Link to="/map" className={`nav-link ${isActive('/map')}`} onClick={() => setOpen(false)}><FiMap style={{ marginRight: 6 }} />Map</Link>

            {/* Mobile currency row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Currency:</span>
              <CurrencySelector />
            </div>

            {isAuth ? (
              <>
                <Link to="/add" className={`nav-link ${isActive('/add')}`} onClick={() => setOpen(false)}><FiPlusCircle style={{ marginRight: 6 }} />Add Boarding</Link>
                <Link to="/inquiries" className={`nav-link ${isActive('/inquiries')}`} onClick={() => setOpen(false)}><FiBell style={{ marginRight: 4 }} />Inquiries</Link>
                <Link to="/my-inquiries" className={`nav-link ${isActive('/my-inquiries')}`} onClick={() => setOpen(false)}><FiMessageSquare style={{ marginRight: 4 }} />My Requests</Link>
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