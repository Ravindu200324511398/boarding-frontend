// import React from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FiGrid, FiUsers, FiHome, FiLogOut, FiShield } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';

// const AdminNavbar = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isActive = (path) => location.pathname === path;

//   const handleLogout = () => { logout(); navigate('/admin'); };

//   const CSS = `
//     @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

//     .admin-nav {
//       background: linear-gradient(90deg, #060f2a 0%, #091428 60%, #0a1a35 100%);
//       border-bottom: 1px solid rgba(14,165,233,0.18);
//       padding: 0 2rem;
//       height: 60px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       position: sticky;
//       top: 0;
//       z-index: 1000;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       box-shadow: 0 2px 24px rgba(0,212,170,0.07);
//     }
//     .admin-nav::after {
//       content: '';
//       position: absolute;
//       bottom: 0; left: 0; right: 0;
//       height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.4), transparent);
//     }
//     .admin-nav-link {
//       display: flex; align-items: center; gap: 6px;
//       padding: 6px 14px; border-radius: 9px;
//       font-size: 0.84rem; font-weight: 700;
//       color: rgba(220,233,255,0.55);
//       text-decoration: none; transition: all 0.2s ease;
//       border: 1px solid transparent;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//     }
//     .admin-nav-link:hover {
//       color: rgba(220,233,255,0.9);
//       background: rgba(14,165,233,0.1);
//       border-color: rgba(14,165,233,0.2);
//     }
//     .admin-nav-link.active {
//       color: #00d4aa;
//       background: rgba(0,212,170,0.1);
//       border-color: rgba(0,212,170,0.25);
//       box-shadow: 0 0 12px rgba(0,212,170,0.12);
//     }
//     @keyframes navblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
//   `;

//   const linkStyle = (path) => ({
//     className: `admin-nav-link${isActive(path) ? ' active' : ''}`,
//   });

//   return (
//     <>
//       <style>{CSS}</style>
//       <nav className="admin-nav">

//         {/* Logo */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div style={{
//             width: 34, height: 34,
//             background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
//             borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             boxShadow: '0 0 14px rgba(0,212,170,0.35)',
//           }}>
//             <FiShield size={16} color="#05060f" strokeWidth={2.5} />
//           </div>
//           <span style={{
//             fontFamily: "'Cabinet Grotesk', sans-serif",
//             fontWeight: 800, fontSize: '1.05rem', color: '#dce9ff', letterSpacing: '-0.01em',
//           }}>
//             Admin{' '}
//             <span style={{
//               background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//             }}>Panel</span>
//           </span>
//           <span style={{
//             width: 6, height: 6, borderRadius: '50%',
//             background: '#00d4aa', boxShadow: '0 0 6px #00d4aa',
//             display: 'inline-block', animation: 'navblink 2s infinite',
//           }} />
//         </div>

//         {/* Nav Links */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//           <Link to="/admin/dashboard" className={`admin-nav-link${isActive('/admin/dashboard') ? ' active' : ''}`}>
//             <FiGrid size={14} /> Dashboard
//           </Link>
//           <Link to="/admin/users" className={`admin-nav-link${isActive('/admin/users') ? ' active' : ''}`}>
//             <FiUsers size={14} /> Users
//           </Link>
//           <Link to="/admin/boardings" className={`admin-nav-link${isActive('/admin/boardings') ? ' active' : ''}`}>
//             <FiHome size={14} /> Listings
//           </Link>
//         </div>

//         {/* Right Side */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <Link to="/" style={{
//             fontSize: '0.78rem', color: 'rgba(220,233,255,0.35)',
//             textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
//           }}>← Main Site</Link>
//           <button onClick={handleLogout} style={{
//             display: 'flex', alignItems: 'center', gap: 6,
//             background: 'rgba(239,68,68,0.08)', color: '#f87171',
//             border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9,
//             padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700,
//             cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
//             transition: 'all 0.2s ease',
//           }}>
//             <FiLogOut size={13} /> Logout
//           </button>
//         </div>

//       </nav>
//     </>
//   );
// };

// export default AdminNavbar;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiHome, FiLogOut, FiShield, FiChevronDown, FiUser, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuTimer = useRef(null);

  const handleLogout = () => { logout(); navigate('/admin'); };

  // User menu with delay so mouse can travel to dropdown
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
      padding: 7px 16px; border-radius: 9px;
      font-size: 0.84rem; font-weight: 700;
      color: rgba(220,233,255,0.55);
      text-decoration: none; transition: all 0.2s ease;
      border: 1px solid transparent;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer;
      background: transparent;
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
    .admin-dropdown-inner {
      background: rgba(6,9,20,0.97);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 0.4rem;
      min-width: 175px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.07);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/" style={{
            fontSize: '0.78rem', color: 'rgba(220,233,255,0.35)',
            textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
            padding: '6px 10px', borderRadius: 8,
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(220,233,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,233,255,0.35)'}
          >← Main Site</Link>

          {/* User dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={handleUserMenuEnter}
            onMouseLeave={handleUserMenuLeave}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px 5px 6px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FiUser size={13} color="#05060f" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(220,233,255,0.85)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
              <FiChevronDown size={11} style={{ color: 'rgba(220,233,255,0.4)', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>

            {showUserMenu && (
              /* Outer wrapper with paddingTop creates hover bridge */
              <div
                style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 1001 }}
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <div className="admin-dropdown-inner">
                  <Link to="/" className="admin-nav-link" style={{ width: '100%', display: 'flex' }}>
                    <FiHome size={13} /> Main Site
                  </Link>
                  <div style={{ margin: '0.3rem 0.4rem', height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <button
                    onClick={handleLogout}
                    className="admin-nav-link"
                    style={{
                      color: '#f87171', width: '100%', border: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <FiLogOut size={13} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Standalone Logout button */}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9,
            padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          >
            <FiLogOut size={13} /> Logout
          </button>
        </div>

      </nav>
    </>
  );
};

export default AdminNavbar;