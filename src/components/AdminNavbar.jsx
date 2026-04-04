import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiHome, FiLogOut, FiShield, FiChevronDown, FiUser, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const getTokens = (isDark) => isDark ? {
  navBg: 'linear-gradient(90deg, #060f2a 0%, #091428 60%, #0a1a35 100%)',
  navBorder: 'rgba(14,165,233,0.18)',
  navShadow: '0 2px 24px rgba(0,212,170,0.07)',
  glowLine: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.4), transparent)',
  linkColor: 'rgba(220,233,255,0.55)',
  linkHoverBg: 'rgba(14,165,233,0.1)',
  linkHoverBorder: 'rgba(14,165,233,0.2)',
  linkHoverColor: 'rgba(220,233,255,0.9)',
  linkActiveBg: 'rgba(0,212,170,0.1)',
  linkActiveBorder: 'rgba(0,212,170,0.25)',
  linkActiveColor: '#00d4aa',
  linkActiveShadow: '0 0 12px rgba(0,212,170,0.12)',
  logoText: '#dce9ff',
  logoDot: '#00d4aa',
  logoDotShadow: '#00d4aa',
  dropdownBg: 'rgba(6,9,20,0.97)',
  dropdownBorder: 'rgba(255,255,255,0.1)',
  dropdownShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.07)',
  divider: 'rgba(255,255,255,0.07)',
  userMenuBg: 'rgba(255,255,255,0.07)',
  userMenuBorder: 'rgba(255,255,255,0.12)',
  userMenuHoverBg: 'rgba(255,255,255,0.12)',
  userName: 'rgba(220,233,255,0.85)',
  chevronColor: 'rgba(220,233,255,0.4)',
  mainSiteColor: 'rgba(220,233,255,0.35)',
  mainSiteHoverColor: 'rgba(220,233,255,0.7)',
  logoutBg: 'rgba(239,68,68,0.08)',
  logoutColor: '#f87171',
  logoutBorder: 'rgba(239,68,68,0.2)',
  logoutHoverBg: 'rgba(239,68,68,0.15)',
  logoutHoverBorder: 'rgba(239,68,68,0.35)',
  logoutDropdownHoverBg: 'rgba(248,113,113,0.1)',
  logoutDropdownHoverBorder: 'rgba(248,113,113,0.2)',
  logoIconBg: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
  logoIconShadow: '0 0 14px rgba(0,212,170,0.35)',
  logoIconColor: '#05060f',
  userIconBg: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
} : {
  navBg: 'linear-gradient(90deg, #f0f4ff 0%, #e8f0fe 60%, #eaf4fb 100%)',
  navBorder: 'rgba(0,112,192,0.18)',
  navShadow: '0 2px 24px rgba(0,112,192,0.08)',
  glowLine: 'linear-gradient(90deg, transparent, rgba(0,112,192,0.3), rgba(0,180,216,0.3), transparent)',
  linkColor: '#4a6080',
  linkHoverBg: 'rgba(0,112,192,0.08)',
  linkHoverBorder: 'rgba(0,112,192,0.18)',
  linkHoverColor: '#1a2a4a',
  linkActiveBg: 'rgba(0,112,192,0.1)',
  linkActiveBorder: 'rgba(0,112,192,0.3)',
  linkActiveColor: '#0070c0',
  linkActiveShadow: '0 0 12px rgba(0,112,192,0.1)',
  logoText: '#1a2a4a',
  logoDot: '#0070c0',
  logoDotShadow: '#0070c0',
  dropdownBg: 'rgba(245,248,255,0.98)',
  dropdownBorder: 'rgba(0,112,192,0.12)',
  dropdownShadow: '0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,112,192,0.08)',
  divider: 'rgba(0,112,192,0.1)',
  userMenuBg: 'rgba(0,112,192,0.06)',
  userMenuBorder: 'rgba(0,112,192,0.15)',
  userMenuHoverBg: 'rgba(0,112,192,0.12)',
  userName: '#1a2a4a',
  chevronColor: '#4a6080',
  mainSiteColor: '#7a9ab8',
  mainSiteHoverColor: '#1a2a4a',
  logoutBg: 'rgba(239,68,68,0.06)',
  logoutColor: '#dc2626',
  logoutBorder: 'rgba(239,68,68,0.15)',
  logoutHoverBg: 'rgba(239,68,68,0.12)',
  logoutHoverBorder: 'rgba(239,68,68,0.28)',
  logoutDropdownHoverBg: 'rgba(239,68,68,0.08)',
  logoutDropdownHoverBorder: 'rgba(239,68,68,0.18)',
  logoIconBg: 'linear-gradient(135deg, #0070c0, #00b4d8)',
  logoIconShadow: '0 0 14px rgba(0,112,192,0.25)',
  logoIconColor: '#fff',
  userIconBg: 'linear-gradient(135deg, #0070c0, #00b4d8)',
};

const AdminNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const isActive = (path) => location.pathname === path;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuTimer = useRef(null);

  const handleLogout = () => { logout(); navigate('/admin'); };

  const handleUserMenuEnter = () => {
    if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    setShowUserMenu(true);
  };
  const handleUserMenuLeave = () => {
    userMenuTimer.current = setTimeout(() => setShowUserMenu(false), 150);
  };

  useEffect(() => {
    return () => { if (userMenuTimer.current) clearTimeout(userMenuTimer.current); };
  }, []);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    .admin-nav {
      background: ${t.navBg};
      border-bottom: 1px solid ${t.navBorder};
      padding: 0 2rem; height: 60px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 1000;
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-shadow: ${t.navShadow};
      transition: background 0.3s ease, border-color 0.3s ease;
    }
    .admin-nav::after {
      content: '';
      position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
      background: ${t.glowLine};
    }
    .admin-nav-link {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 9px;
      font-size: 0.84rem; font-weight: 700;
      color: ${t.linkColor};
      text-decoration: none; transition: all 0.2s ease;
      border: 1px solid transparent;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer; background: transparent;
    }
    .admin-nav-link:hover {
      color: ${t.linkHoverColor};
      background: ${t.linkHoverBg};
      border-color: ${t.linkHoverBorder};
    }
    .admin-nav-link.active {
      color: ${t.linkActiveColor};
      background: ${t.linkActiveBg};
      border-color: ${t.linkActiveBorder};
      box-shadow: ${t.linkActiveShadow};
    }
    .admin-dropdown-inner {
      background: ${t.dropdownBg};
      border: 1px solid ${t.dropdownBorder};
      border-radius: 14px; padding: 0.4rem; min-width: 175px;
      box-shadow: ${t.dropdownShadow};
      backdrop-filter: blur(20px);
      animation: adminDropdown 0.2s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes adminDropdown {
      from { opacity: 0; transform: translateY(-8px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes navblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  `;

  return (
    <>
      <style>{CSS}</style>
      <nav className="admin-nav">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: t.logoIconBg,
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: t.logoIconShadow,
          }}>
            <FiShield size={16} color={t.logoIconColor} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: t.logoText, letterSpacing: '-0.01em' }}>
            Admin{' '}
            <span style={{ background: 'linear-gradient(135deg, #00d4aa, #2de2e6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Panel</span>
          </span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.logoDot, boxShadow: `0 0 6px ${t.logoDotShadow}`, display: 'inline-block', animation: 'navblink 2s infinite' }} />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/" style={{ fontSize: '0.78rem', color: t.mainSiteColor, textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s', padding: '6px 10px', borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.color = t.mainSiteHoverColor}
            onMouseLeave={e => e.currentTarget.style.color = t.mainSiteColor}>
            ← Main Site
          </Link>

          {/* User dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px 5px 6px',
              background: t.userMenuBg, border: `1px solid ${t.userMenuBorder}`,
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = t.userMenuHoverBg}
              onMouseLeave={e => e.currentTarget.style.background = t.userMenuBg}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: t.userIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiUser size={13} color="#fff" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: t.userName, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
              <FiChevronDown size={11} style={{ color: t.chevronColor, transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>

            {showUserMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 1001 }}
                onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                <div className="admin-dropdown-inner">
                  <Link to="/" className="admin-nav-link" style={{ width: '100%', display: 'flex' }}>
                    <FiHome size={13} /> Main Site
                  </Link>
                  <div style={{ margin: '0.3rem 0.4rem', height: 1, background: t.divider }} />
                  <button onClick={handleLogout} className="admin-nav-link"
                    style={{ color: t.logoutColor, width: '100%', border: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.logoutDropdownHoverBg; e.currentTarget.style.borderColor = t.logoutDropdownHoverBorder; e.currentTarget.style.color = t.logoutColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    <FiLogOut size={13} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Standalone Logout button */}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: t.logoutBg, color: t.logoutColor,
            border: `1px solid ${t.logoutBorder}`, borderRadius: 9,
            padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = t.logoutHoverBg; e.currentTarget.style.borderColor = t.logoutHoverBorder; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.logoutBg; e.currentTarget.style.borderColor = t.logoutBorder; }}>
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;