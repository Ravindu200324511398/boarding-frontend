import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import {
  FiHome, FiPlusCircle, FiHeart, FiMap, FiBell, FiMessageSquare,
  FiBarChart2, FiLogOut, FiMenu, FiX,
  FiShield, FiUser, FiChevronDown, FiCheck, FiMoon, FiSun, FiGrid, FiChevronRight
} from 'react-icons/fi';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

const CurrencySelector = ({ mobile = false }) => {
  const { currency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
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
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: mobile ? '0.4rem 0.7rem' : '0.5rem 0.9rem',
          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
          color: 'rgba(220,233,255,0.85)',
          transition: 'all 0.25s ease',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      >
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <FiChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '115%', right: 0,
          background: 'rgba(6,9,20,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)',
          minWidth: '145px', zIndex: 2000, padding: '0.5rem',
          backdropFilter: 'blur(20px)',
          animation: 'navDropdown 0.2s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { changeCurrency(c.code); setIsOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.55rem 0.8rem', border: 'none', borderRadius: '9px',
                background: currency.code === c.code ? 'rgba(0,212,170,0.12)' : 'transparent',
                color: currency.code === c.code ? '#00d4aa' : 'rgba(220,233,255,0.7)',
                fontSize: '0.83rem', fontWeight: currency.code === c.code ? 700 : 500,
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={e => { if (currency.code !== c.code) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (currency.code !== c.code) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
              {currency.code === c.code && <FiCheck size={13} style={{ marginLeft: 'auto', color: '#00d4aa' }} />}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => { logout(); setMobileMenuOpen(false); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.55rem 0.9rem', borderRadius: '10px',
    textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
    transition: 'all 0.2s ease',
    color: isActive(path) ? '#00d4aa' : 'rgba(220,233,255,0.6)',
    background: isActive(path) ? 'rgba(0,212,170,0.1)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(0,212,170,0.25)' : '1px solid transparent',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  });

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @keyframes navDropdown {
      from { opacity: 0; transform: translateY(-8px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes mobileSlideDown {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

    .bf-navbar { font-family: 'Plus Jakarta Sans', sans-serif; }

    .nav-link-hover:hover {
      color: rgba(220,233,255,0.95) !important;
      background: rgba(255,255,255,0.07) !important;
      border-color: rgba(255,255,255,0.1) !important;
    }
    .mobile-nav-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.85rem 1rem; text-decoration: none;
      color: rgba(220,233,255,0.65); font-weight: 700; font-size: 0.9rem;
      border-radius: 12px; transition: all 0.2s;
      border: 1px solid transparent;
    }
    .mobile-nav-item:hover, .mobile-nav-item.active {
      color: #00d4aa; background: rgba(0,212,170,0.08);
      border-color: rgba(0,212,170,0.15);
    }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #00d4aa; display: inline-block;
      box-shadow: 0 0 8px #00d4aa;
      animation: blink 2s infinite;
    }
    @media (max-width: 991px) {
      .desktop-nav-center { display: none !important; }
      .desktop-nav-right-items { display: none !important; }
      .mobile-menu-btn { display: flex !important; }
    }
    @media (min-width: 992px) {
      .mobile-menu-btn { display: none !important; }
    }
  `;

  const dropdownStyle = {
    position: 'absolute', top: '110%',
    background: 'rgba(6,9,20,0.97)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '0.4rem',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.07)',
    backdropFilter: 'blur(20px)',
    animation: 'navDropdown 0.2s cubic-bezier(.34,1.56,.64,1)',
    zIndex: 999,
  };

  return (
    <>
      <style>{CSS}</style>
      <nav
        className="bf-navbar"
        ref={mobileRef}
        style={{
          // background: scrolled ? 'rgba(6,9,20,0.92)' : 'rgba(6,9,20,0.78)',
          // backdropFilter: 'blur(24px) saturate(180%)',
          // WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          background: scrolled ? '#060f2a' : '#091428',
          borderBottom: '1px solid rgba(14,165,233,0.18)',
          position: 'sticky', top: 0, zIndex: 1000,
          transition: 'background 0.4s ease, box-shadow 0.4s ease',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(0,212,170,0.15)'
            : '0 1px 0 rgba(0,212,170,0.1)',
        }}
      >
        {/* Shimmer bottom border */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 68, position: 'relative',
        }}>

          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', boxShadow: '0 0 16px rgba(0,212,170,0.4)',
              flexShrink: 0,
            }}>🏠</div>
            <span style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1.15rem', color: '#dce9ff',
              letterSpacing: '-0.01em',
            }}>
              Boarding<span style={{
                background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Finder</span>
            </span>
            <span className="live-dot" />
          </Link>

          {/* Desktop Nav Center */}
          <div className="desktop-nav-center" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link to="/" className="nav-link-hover" style={navLinkStyle('/')}>
              <FiHome size={15} /> Home
            </Link>
            <Link to="/map" className="nav-link-hover" style={navLinkStyle('/map')}>
              <FiMap size={15} /> Map
            </Link>
            <Link to="/compare" className="nav-link-hover" style={navLinkStyle('/compare')}>
              <FiBarChart2 size={15} /> Compare
            </Link>

            {isAuth && (
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowInquiries(true)}
                onMouseLeave={() => setShowInquiries(false)}
              >
                <button className="nav-link-hover" style={{
                  ...navLinkStyle(''),
                  background: (isActive('/inquiries') || isActive('/my-inquiries')) ? 'rgba(0,212,170,0.1)' : 'transparent',
                  color: (isActive('/inquiries') || isActive('/my-inquiries')) ? '#00d4aa' : 'rgba(220,233,255,0.6)',
                  border: '1px solid transparent',
                }}>
                  <FiGrid size={15} /> Activity
                  <FiChevronDown size={12} style={{ transform: showInquiries ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
                {showInquiries && (
                  <div style={{ ...dropdownStyle, left: 0, minWidth: '185px' }}>
                    <Link to="/inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/inquiries'), width: '100%', display: 'flex' }}>
                      <FiBell size={14} /> Received
                    </Link>
                    <Link to="/my-inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/my-inquiries'), width: '100%', display: 'flex' }}>
                      <FiMessageSquare size={14} /> Sent
                    </Link>
                    <Link to="/favorites" className="nav-link-hover" style={{ ...navLinkStyle('/favorites'), width: '100%', display: 'flex' }}>
                      <FiHeart size={14} /> Saved
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Right */}
          <div className="desktop-nav-right-items" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CurrencySelector />

            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px', padding: '0.5rem',
                cursor: 'pointer', color: 'rgba(220,233,255,0.65)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#dce9ff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(220,233,255,0.65)'; }}
            >
              {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            {isAuth ? (
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.35rem 0.7rem 0.35rem 0.35rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#05060f', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {user?.avatar
                      ? <img src={`${AVATAR_BASE}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <FiUser size={15} />}
                  </div>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'rgba(220,233,255,0.9)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={12} style={{ color: 'rgba(220,233,255,0.4)', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>

                {showUserMenu && (
                  <div style={{ ...dropdownStyle, right: 0, minWidth: '175px' }}>
                    {user?.isAdmin && (
                      <Link to="/admin/dashboard" className="nav-link-hover" style={{ ...navLinkStyle('/admin/dashboard'), width: '100%', display: 'flex' }}>
                        <FiShield size={14} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/profile" className="nav-link-hover" style={{ ...navLinkStyle('/profile'), width: '100%', display: 'flex' }}>
                      <FiUser size={14} /> Profile Settings
                    </Link>
                    <div style={{ margin: '0.3rem 0.4rem', height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        ...navLinkStyle(''), color: '#f87171', width: '100%',
                        border: 'none', background: 'transparent', display: 'flex',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
                  color: '#05060f', border: 'none', borderRadius: '11px',
                  padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                  boxShadow: '0 4px 20px rgba(0,212,170,0.35)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,212,170,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,212,170,0.35)'; }}
                >
                  Get Started →
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: mobileMenuOpen ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${mobileMenuOpen ? 'rgba(0,212,170,0.35)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '10px', padding: '0.5rem',
              cursor: 'pointer', color: mobileMenuOpen ? '#00d4aa' : 'rgba(220,233,255,0.7)',
              transition: 'all 0.25s', alignItems: 'center',
            }}
          >
            {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(5,8,18,0.98)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(14,165,233,0.12)',
            padding: '0.75rem 1rem 1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.3rem',
            animation: 'mobileSlideDown 0.3s cubic-bezier(.34,1.56,.64,1)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHome size={17} /> Home</span>
              <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
            </Link>
            <Link to="/map" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMap size={17} /> Explore Map</span>
              <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
            </Link>
            <Link to="/compare" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBarChart2 size={17} /> Compare</span>
              <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
            </Link>

            {isAuth && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.4rem 0' }} />
                <Link to="/inquiries" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBell size={17} /> Inquiries</span>
                  <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
                </Link>
                <Link to="/favorites" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHeart size={17} /> Saved</span>
                  <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
                </Link>
                <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiUser size={17} /> Profile</span>
                  <FiChevronRight size={14} style={{ color: 'rgba(220,233,255,0.2)' }} />
                </Link>
              </>
            )}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.4rem 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <CurrencySelector mobile />
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '9px', padding: '0.4rem 0.6rem',
                    cursor: 'pointer', color: 'rgba(220,233,255,0.7)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                </button>
              </div>
              {isAuth ? (
                <button onClick={handleLogout} style={{
                  border: 'none', background: 'rgba(248,113,113,0.1)',
                  color: '#f87171', fontWeight: 700, fontSize: '0.88rem',
                  borderRadius: '9px', padding: '0.4rem 0.8rem', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                  color: '#00d4aa', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem',
                  background: 'rgba(0,212,170,0.1)', padding: '0.4rem 0.9rem',
                  borderRadius: '9px', border: '1px solid rgba(0,212,170,0.2)',
                }}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;