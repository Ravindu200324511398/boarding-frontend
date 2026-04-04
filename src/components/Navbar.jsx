// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import useTheme from '../context/useTheme';
// import { useAuth } from '../context/AuthContext';
// import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
// import {
//   FiHome, FiPlusCircle, FiHeart, FiMap, FiBell, FiMessageSquare,
//   FiBarChart2, FiLogOut, FiMenu, FiX,
//   FiShield, FiUser, FiChevronDown, FiCheck, FiMoon, FiSun, FiGrid, FiChevronRight
// } from 'react-icons/fi';
// import NotificationBell from './NotificationBell';

// const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// /* ─── Theme tokens ─── */
// const getTokens = (isDark) => isDark ? {
//   // ── DARK MODE (original, untouched) ──
//   navBg: 'transparent',
//   navBgScrolled: '#060f2a',
//   navBgBase: '#091428',
//   navBorder: 'rgba(14,165,233,0.18)',
//   navShadowScrolled: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(0,212,170,0.15)',
//   navShadow: '0 1px 0 rgba(0,212,170,0.1)',
//   shimmerBorder: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)',

//   linkColor: 'rgba(220,233,255,0.6)',
//   linkActive: '#00d4aa',
//   linkActiveBg: 'rgba(0,212,170,0.1)',
//   linkActiveBorder: 'rgba(0,212,170,0.25)',
//   linkHoverBg: 'rgba(255,255,255,0.07)',
//   linkHoverBorder: 'rgba(255,255,255,0.1)',
//   linkHoverColor: 'rgba(220,233,255,0.95)',

//   brandColor: '#dce9ff',
//   brandAccentFrom: '#00d4aa',
//   brandAccentTo: '#2de2e6',

//   btnBg: 'rgba(255,255,255,0.07)',
//   btnBorder: 'rgba(255,255,255,0.12)',
//   btnColor: 'rgba(220,233,255,0.65)',
//   btnHoverBg: 'rgba(255,255,255,0.12)',
//   btnHoverColor: '#dce9ff',

//   dropdownBg: 'rgba(6,9,20,0.97)',
//   dropdownBorder: 'rgba(255,255,255,0.1)',
//   dropdownShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)',
//   dropdownItemColor: 'rgba(220,233,255,0.7)',
//   dropdownItemActiveBg: 'rgba(0,212,170,0.12)',
//   dropdownItemActiveColor: '#00d4aa',
//   dropdownItemHoverBg: 'rgba(255,255,255,0.06)',
//   dropdownDivider: 'rgba(255,255,255,0.07)',

//   userChipBg: 'rgba(255,255,255,0.07)',
//   userChipBorder: 'rgba(255,255,255,0.12)',
//   userChipHoverBg: 'rgba(255,255,255,0.12)',
//   userNameColor: 'rgba(220,233,255,0.9)',
//   chevronColor: 'rgba(220,233,255,0.4)',

//   mobileBg: 'rgba(5,8,18,0.98)',
//   mobileBorder: 'rgba(14,165,233,0.12)',
//   mobileItemColor: 'rgba(220,233,255,0.65)',
//   mobileItemHoverColor: '#00d4aa',
//   mobileItemHoverBg: 'rgba(0,212,170,0.08)',
//   mobileItemHoverBorder: 'rgba(0,212,170,0.15)',
//   mobileDivider: 'rgba(255,255,255,0.06)',
//   mobileChevronColor: 'rgba(220,233,255,0.2)',

//   currencyBg: 'rgba(255,255,255,0.07)',
//   currencyBorder: 'rgba(255,255,255,0.12)',
//   currencyColor: 'rgba(220,233,255,0.85)',
//   currencyHoverBg: 'rgba(255,255,255,0.12)',

//   logoutColor: '#f87171',
//   logoutHoverBg: 'rgba(248,113,113,0.1)',

//   ctaBg: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
//   ctaColor: '#05060f',
//   ctaShadow: '0 4px 20px rgba(0,212,170,0.35)',
//   ctaHoverShadow: '0 8px 28px rgba(0,212,170,0.5)',

//   dotColor: '#00d4aa',
//   dotShadow: '#00d4aa',

//   signInBg: 'rgba(0,212,170,0.1)',
//   signInColor: '#00d4aa',
//   signInBorder: 'rgba(0,212,170,0.2)',
// } : {
//   // ── LIGHT MODE ──
//   navBg: 'transparent',
//   navBgScrolled: '#ffffff',
//   navBgBase: '#ffffff',
//   navBorder: 'rgba(0,0,0,0.07)',
//   navShadowScrolled: '0 4px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.05)',
//   navShadow: '0 1px 0 rgba(0,0,0,0.05)',
//   shimmerBorder: 'linear-gradient(90deg, transparent, rgba(0,150,200,0.15), rgba(14,165,233,0.12), transparent)',

//   linkColor: 'rgba(30,50,100,0.55)',
//   linkActive: '#0070c0',
//   linkActiveBg: 'rgba(0,112,192,0.08)',
//   linkActiveBorder: 'rgba(0,112,192,0.2)',
//   linkHoverBg: 'rgba(0,0,0,0.04)',
//   linkHoverBorder: 'rgba(0,0,0,0.08)',
//   linkHoverColor: 'rgba(10,30,80,0.9)',

//   brandColor: '#0f1c3f',
//   brandAccentFrom: '#0070c0',
//   brandAccentTo: '#00b4d8',

//   btnBg: 'rgba(0,0,0,0.05)',
//   btnBorder: 'rgba(0,0,0,0.1)',
//   btnColor: 'rgba(30,50,100,0.6)',
//   btnHoverBg: 'rgba(0,0,0,0.09)',
//   btnHoverColor: '#0f1c3f',

//   dropdownBg: 'rgba(255,255,255,0.99)',
//   dropdownBorder: 'rgba(0,0,0,0.1)',
//   dropdownShadow: '0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,112,192,0.08)',
//   dropdownItemColor: 'rgba(30,50,100,0.75)',
//   dropdownItemActiveBg: 'rgba(0,112,192,0.08)',
//   dropdownItemActiveColor: '#0070c0',
//   dropdownItemHoverBg: 'rgba(0,0,0,0.04)',
//   dropdownDivider: 'rgba(0,0,0,0.07)',

//   userChipBg: 'rgba(0,0,0,0.05)',
//   userChipBorder: 'rgba(0,0,0,0.1)',
//   userChipHoverBg: 'rgba(0,0,0,0.09)',
//   userNameColor: 'rgba(10,30,80,0.85)',
//   chevronColor: 'rgba(30,50,100,0.35)',

//   mobileBg: 'rgba(255,255,255,0.99)',
//   mobileBorder: 'rgba(0,0,0,0.07)',
//   mobileItemColor: 'rgba(30,50,100,0.6)',
//   mobileItemHoverColor: '#0070c0',
//   mobileItemHoverBg: 'rgba(0,112,192,0.07)',
//   mobileItemHoverBorder: 'rgba(0,112,192,0.15)',
//   mobileDivider: 'rgba(0,0,0,0.07)',
//   mobileChevronColor: 'rgba(30,50,100,0.2)',

//   currencyBg: 'rgba(0,0,0,0.05)',
//   currencyBorder: 'rgba(0,0,0,0.1)',
//   currencyColor: 'rgba(30,50,100,0.8)',
//   currencyHoverBg: 'rgba(0,0,0,0.09)',

//   logoutColor: '#dc2626',
//   logoutHoverBg: 'rgba(220,38,38,0.08)',

//   ctaBg: 'linear-gradient(135deg, #0070c0, #00b4d8)',
//   ctaColor: '#ffffff',
//   ctaShadow: '0 4px 20px rgba(0,112,192,0.3)',
//   ctaHoverShadow: '0 8px 28px rgba(0,112,192,0.45)',

//   dotColor: '#0070c0',
//   dotShadow: '#0070c0',

//   signInBg: 'rgba(0,112,192,0.08)',
//   signInColor: '#0070c0',
//   signInBorder: 'rgba(0,112,192,0.18)',
// };

// /* ─── CurrencySelector ─── */
// const CurrencySelector = ({ mobile = false, t }) => {
//   const { currency, changeCurrency } = useCurrency();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div style={{ position: 'relative' }} ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: 'flex', alignItems: 'center', gap: '0.4rem',
//           background: t.currencyBg,
//           border: `1px solid ${t.currencyBorder}`,
//           borderRadius: '10px', padding: mobile ? '0.4rem 0.7rem' : '0.5rem 0.9rem',
//           cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
//           color: t.currencyColor,
//           transition: 'all 0.25s ease',
//           fontFamily: "'Plus Jakarta Sans', sans-serif",
//         }}
//         onMouseEnter={e => e.currentTarget.style.background = t.currencyHoverBg}
//         onMouseLeave={e => e.currentTarget.style.background = t.currencyBg}
//       >
//         <span>{currency.flag}</span>
//         <span>{currency.code}</span>
//         <FiChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
//       </button>

//       {isOpen && (
//         <div style={{
//           position: 'absolute', top: '115%', right: 0,
//           background: t.dropdownBg,
//           border: `1px solid ${t.dropdownBorder}`,
//           borderRadius: '14px',
//           boxShadow: t.dropdownShadow,
//           minWidth: '145px', zIndex: 2000, padding: '0.5rem',
//           backdropFilter: 'blur(20px)',
//           animation: 'navDropdown 0.2s cubic-bezier(.34,1.56,.64,1)',
//         }}>
//           {CURRENCIES.map((c) => (
//             <button
//               key={c.code}
//               onClick={() => { changeCurrency(c.code); setIsOpen(false); }}
//               style={{
//                 width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
//                 padding: '0.55rem 0.8rem', border: 'none', borderRadius: '9px',
//                 background: currency.code === c.code ? t.dropdownItemActiveBg : 'transparent',
//                 color: currency.code === c.code ? t.dropdownItemActiveColor : t.dropdownItemColor,
//                 fontSize: '0.83rem', fontWeight: currency.code === c.code ? 700 : 500,
//                 textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
//                 fontFamily: "'Plus Jakarta Sans', sans-serif",
//               }}
//               onMouseEnter={e => { if (currency.code !== c.code) e.currentTarget.style.background = t.dropdownItemHoverBg; }}
//               onMouseLeave={e => { if (currency.code !== c.code) e.currentTarget.style.background = 'transparent'; }}
//             >
//               <span>{c.flag}</span>
//               <span>{c.code}</span>
//               {currency.code === c.code && <FiCheck size={13} style={{ marginLeft: 'auto', color: t.dropdownItemActiveColor }} />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─── Navbar ─── */
// const Navbar = () => {
//   const { isAuth, user, logout } = useAuth();
//   const { isDark, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const t = getTokens(isDark);

//   const [showInquiries, setShowInquiries] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const mobileRef = useRef(null);
//   const inquiriesTimer = useRef(null);
//   const userMenuTimer = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleOutside = (e) => {
//       if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileMenuOpen(false);
//     };
//     document.addEventListener('mousedown', handleOutside);
//     return () => document.removeEventListener('mousedown', handleOutside);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (inquiriesTimer.current) clearTimeout(inquiriesTimer.current);
//       if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
//     };
//   }, []);

//   const handleLogout = () => { logout(); setMobileMenuOpen(false); navigate('/login'); };
//   const isActive = (path) => location.pathname === path;

//   const handleInquiriesEnter = () => { if (inquiriesTimer.current) clearTimeout(inquiriesTimer.current); setShowInquiries(true); };
//   const handleInquiriesLeave = () => { inquiriesTimer.current = setTimeout(() => setShowInquiries(false), 150); };
//   const handleUserMenuEnter = () => { if (userMenuTimer.current) clearTimeout(userMenuTimer.current); setShowUserMenu(true); };
//   const handleUserMenuLeave = () => { userMenuTimer.current = setTimeout(() => setShowUserMenu(false), 150); };

//   const navLinkStyle = (path) => ({
//     display: 'flex', alignItems: 'center', gap: '0.5rem',
//     padding: '0.55rem 0.9rem', borderRadius: '10px',
//     textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
//     transition: 'all 0.2s ease',
//     color: isActive(path) ? t.linkActive : t.linkColor,
//     background: isActive(path) ? t.linkActiveBg : 'transparent',
//     border: isActive(path) ? `1px solid ${t.linkActiveBorder}` : '1px solid transparent',
//     cursor: 'pointer',
//     fontFamily: "'Plus Jakarta Sans', sans-serif",
//   });

//   // ── KEY FIX: key={isDark ? 'dark' : 'light'} forces CSS classes to re-inject on theme toggle ──
//   const CSS = `
//     @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//     @keyframes navDropdown {
//       from { opacity: 0; transform: translateY(-8px) scale(0.96); }
//       to   { opacity: 1; transform: translateY(0) scale(1); }
//     }
//     @keyframes mobileSlideDown {
//       from { opacity: 0; transform: translateY(-12px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

//     .bf-navbar { font-family: 'Plus Jakarta Sans', sans-serif; }

//     .nav-link-hover:hover {
//       color: ${t.linkHoverColor} !important;
//       background: ${t.linkHoverBg} !important;
//       border-color: ${t.linkHoverBorder} !important;
//     }
//     .mobile-nav-item {
//       display: flex; align-items: center; justify-content: space-between;
//       padding: 0.85rem 1rem; text-decoration: none;
//       color: ${t.mobileItemColor}; font-weight: 700; font-size: 0.9rem;
//       border-radius: 12px; transition: all 0.2s;
//       border: 1px solid transparent;
//     }
//     .mobile-nav-item:hover, .mobile-nav-item.active {
//       color: ${t.mobileItemHoverColor}; background: ${t.mobileItemHoverBg};
//       border-color: ${t.mobileItemHoverBorder};
//     }
//     .live-dot {
//       width: 6px; height: 6px; border-radius: 50%;
//       background: ${t.dotColor}; display: inline-block;
//       box-shadow: 0 0 8px ${t.dotShadow};
//       animation: blink 2s infinite;
//     }
//     .dropdown-inner {
//       background: ${t.dropdownBg};
//       border: 1px solid ${t.dropdownBorder};
//       border-radius: 14px; padding: 0.4rem;
//       box-shadow: ${t.dropdownShadow};
//       backdrop-filter: blur(20px);
//       animation: navDropdown 0.2s cubic-bezier(.34,1.56,.64,1);
//     }
//     @media (max-width: 991px) {
//       .desktop-nav-center { display: none !important; }
//       .desktop-nav-right-items { display: none !important; }
//       .mobile-menu-btn { display: flex !important; }
//     }
//     @media (min-width: 992px) {
//       .mobile-menu-btn { display: none !important; }
//     }
//   `;

//   return (
//     <>
//       {/* ── KEY FIX: key prop forces style tag to re-mount when theme changes ── */}
//       <style key={isDark ? 'dark' : 'light'}>{CSS}</style>
//       <nav
//         className="bf-navbar"
//         ref={mobileRef}
//         style={{
//           background: scrolled ? t.navBgScrolled : t.navBgBase,
//           borderBottom: `1px solid ${t.navBorder}`,
//           position: 'sticky', top: 0, zIndex: 1000,
//           transition: 'background 0.4s ease, box-shadow 0.4s ease',
//           boxShadow: scrolled ? t.navShadowScrolled : t.navShadow,
//         }}
//       >
//         {/* Shimmer bottom border */}
//         <div style={{
//           position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
//           background: t.shimmerBorder,
//           pointerEvents: 'none',
//         }} />

//         <div style={{
//           maxWidth: 1280, margin: '0 auto',
//           padding: '0 1.5rem',
//           display: 'flex', alignItems: 'center',
//           justifyContent: 'space-between',
//           height: 68, position: 'relative',
//         }}>

//           {/* Brand */}
//           <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
//             <div style={{
//               width: 36, height: 36, borderRadius: 10,
//               background: `linear-gradient(135deg, ${t.brandAccentFrom}, ${t.brandAccentTo === '#2de2e6' ? '#0ea5e9' : t.brandAccentTo})`,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '1.1rem', boxShadow: `0 0 16px ${t.brandAccentFrom}66`,
//               flexShrink: 0,
//             }}>🏠</div>
//             <span style={{
//               fontFamily: "'Cabinet Grotesk', sans-serif",
//               fontWeight: 800, fontSize: '1.15rem', color: t.brandColor,
//               letterSpacing: '-0.01em',
//             }}>
//               Boarding<span style={{
//                 background: `linear-gradient(135deg, ${t.brandAccentFrom}, ${t.brandAccentTo})`,
//                 WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
//               }}>Finder</span>
//             </span>
//             <span className="live-dot" />
//           </Link>

//           {/* Desktop Nav Center */}
//           <div className="desktop-nav-center" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//             <Link to="/" className="nav-link-hover" style={navLinkStyle('/')}>
//               <FiHome size={15} /> Home
//             </Link>
//             <Link to="/map" className="nav-link-hover" style={navLinkStyle('/map')}>
//               <FiMap size={15} /> Map
//             </Link>
//             <Link to="/compare" className="nav-link-hover" style={navLinkStyle('/compare')}>
//               <FiBarChart2 size={15} /> Compare
//             </Link>

//             {isAuth && (
//               <div
//                 style={{ position: 'relative' }}
//                 onMouseEnter={handleInquiriesEnter}
//                 onMouseLeave={handleInquiriesLeave}
//               >
//                 <button className="nav-link-hover" style={{
//                   ...navLinkStyle(''),
//                   background: (isActive('/inquiries') || isActive('/my-inquiries')) ? t.linkActiveBg : 'transparent',
//                   color: (isActive('/inquiries') || isActive('/my-inquiries')) ? t.linkActive : t.linkColor,
//                   border: '1px solid transparent',
//                 }}>
//                   <FiGrid size={15} /> Activity
//                   <FiChevronDown size={12} style={{ transform: showInquiries ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
//                 </button>
//                 {showInquiries && (
//                   <div
//                     style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '8px', zIndex: 999 }}
//                     onMouseEnter={handleInquiriesEnter}
//                     onMouseLeave={handleInquiriesLeave}
//                   >
//                     <div className="dropdown-inner" style={{ minWidth: '185px' }}>
//                       <Link to="/inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/inquiries'), width: '100%', display: 'flex' }}>
//                         <FiBell size={14} /> Received
//                       </Link>
//                       <Link to="/my-inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/my-inquiries'), width: '100%', display: 'flex' }}>
//                         <FiMessageSquare size={14} /> Sent
//                       </Link>
//                       <Link to="/favorites" className="nav-link-hover" style={{ ...navLinkStyle('/favorites'), width: '100%', display: 'flex' }}>
//                         <FiHeart size={14} /> Saved
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Desktop Nav Right */}
//           <div className="desktop-nav-right-items" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//             <CurrencySelector t={t} />

//             <button
//               onClick={toggleTheme}
//               style={{
//                 background: t.btnBg,
//                 border: `1px solid ${t.btnBorder}`,
//                 borderRadius: '10px', padding: '0.5rem',
//                 cursor: 'pointer', color: t.btnColor,
//                 transition: 'all 0.2s', display: 'flex', alignItems: 'center',
//               }}
//               onMouseEnter={e => { e.currentTarget.style.background = t.btnHoverBg; e.currentTarget.style.color = t.btnHoverColor; }}
//               onMouseLeave={e => { e.currentTarget.style.background = t.btnBg; e.currentTarget.style.color = t.btnColor; }}
//             >
//               {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
//             </button>

//             {isAuth && <NotificationBell />}

//             {isAuth ? (
//               <div
//                 style={{ position: 'relative' }}
//                 onMouseEnter={handleUserMenuEnter}
//                 onMouseLeave={handleUserMenuLeave}
//               >
//                 <div style={{
//                   display: 'flex', alignItems: 'center', gap: '0.6rem',
//                   padding: '0.35rem 0.7rem 0.35rem 0.35rem',
//                   borderRadius: '12px',
//                   background: t.userChipBg,
//                   border: `1px solid ${t.userChipBorder}`,
//                   cursor: 'pointer', transition: 'all 0.2s',
//                 }}
//                   onMouseEnter={e => e.currentTarget.style.background = t.userChipHoverBg}
//                   onMouseLeave={e => e.currentTarget.style.background = t.userChipBg}
//                 >
//                   <div style={{
//                     width: 30, height: 30, borderRadius: '8px',
//                     background: `linear-gradient(135deg, ${t.brandAccentFrom}, #0ea5e9)`,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     color: '#05060f', overflow: 'hidden', flexShrink: 0,
//                   }}>
//                     {user?.avatar
//                       ? <img src={`${AVATAR_BASE}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                       : <FiUser size={15} />}
//                   </div>
//                   <span style={{ fontSize: '0.83rem', fontWeight: 700, color: t.userNameColor }}>
//                     {user?.name?.split(' ')[0]}
//                   </span>
//                   <FiChevronDown size={12} style={{ color: t.chevronColor, transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
//                 </div>

//                 {showUserMenu && (
//                   <div
//                     style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 999 }}
//                     onMouseEnter={handleUserMenuEnter}
//                     onMouseLeave={handleUserMenuLeave}
//                   >
//                     <div className="dropdown-inner" style={{ minWidth: '175px' }}>
//                       {user?.isAdmin && (
//                         <Link to="/admin/dashboard" className="nav-link-hover" style={{ ...navLinkStyle('/admin/dashboard'), width: '100%', display: 'flex' }}>
//                           <FiShield size={14} /> Admin Panel
//                         </Link>
//                       )}
//                       <Link to="/profile" className="nav-link-hover" style={{ ...navLinkStyle('/profile'), width: '100%', display: 'flex' }}>
//                         <FiUser size={14} /> Profile Settings
//                       </Link>
//                       <div style={{ margin: '0.3rem 0.4rem', height: 1, background: t.dropdownDivider }} />
//                       <button
//                         onClick={handleLogout}
//                         style={{
//                           ...navLinkStyle(''), color: t.logoutColor, width: '100%',
//                           border: 'none', background: 'transparent', display: 'flex',
//                           fontFamily: "'Plus Jakarta Sans', sans-serif",
//                         }}
//                         onMouseEnter={e => e.currentTarget.style.background = t.logoutHoverBg}
//                         onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                       >
//                         <FiLogOut size={14} /> Sign Out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/register" style={{ textDecoration: 'none' }}>
//                 <button style={{
//                   background: t.ctaBg,
//                   color: t.ctaColor, border: 'none', borderRadius: '11px',
//                   padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 800,
//                   cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
//                   boxShadow: t.ctaShadow,
//                   fontFamily: "'Plus Jakarta Sans', sans-serif",
//                 }}
//                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = t.ctaHoverShadow; }}
//                   onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = t.ctaShadow; }}
//                 >
//                   Get Started →
//                 </button>
//               </Link>
//             )}
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             className="mobile-menu-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             style={{
//               background: mobileMenuOpen ? t.signInBg : t.btnBg,
//               border: `1px solid ${mobileMenuOpen ? t.signInBorder : t.btnBorder}`,
//               borderRadius: '10px', padding: '0.5rem',
//               cursor: 'pointer', color: mobileMenuOpen ? t.signInColor : t.btnColor,
//               transition: 'all 0.25s', alignItems: 'center',
//             }}
//           >
//             {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
//           </button>
//         </div>

//         {/* Mobile Dropdown */}
//         {mobileMenuOpen && (
//           <div style={{
//             background: t.mobileBg,
//             backdropFilter: 'blur(24px)',
//             borderTop: `1px solid ${t.mobileBorder}`,
//             padding: '0.75rem 1rem 1.25rem',
//             display: 'flex', flexDirection: 'column', gap: '0.3rem',
//             animation: 'mobileSlideDown 0.3s cubic-bezier(.34,1.56,.64,1)',
//             fontFamily: "'Plus Jakarta Sans', sans-serif",
//           }}>
//             <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHome size={17} /> Home</span>
//               <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//             </Link>
//             <Link to="/map" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMap size={17} /> Explore Map</span>
//               <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//             </Link>
//             <Link to="/compare" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//               <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBarChart2 size={17} /> Compare</span>
//               <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//             </Link>

//             {isAuth && (
//               <>
//                 <div style={{ height: 1, background: t.mobileDivider, margin: '0.4rem 0' }} />
//                 <Link to="/inquiries" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBell size={17} /> Inquiries</span>
//                   <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//                 </Link>
//                 <Link to="/my-inquiries" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMessageSquare size={17} /> Sent Requests</span>
//                   <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//                 </Link>
//                 <Link to="/favorites" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHeart size={17} /> Saved</span>
//                   <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//                 </Link>
//                 <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiUser size={17} /> Profile</span>
//                   <FiChevronRight size={14} style={{ color: t.mobileChevronColor }} />
//                 </Link>
//               </>
//             )}

//             <div style={{ height: 1, background: t.mobileDivider, margin: '0.4rem 0' }} />

//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem' }}>
//               <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
//                 <CurrencySelector mobile t={t} />
//                 <button
//                   onClick={toggleTheme}
//                   style={{
//                     background: t.btnBg, border: `1px solid ${t.btnBorder}`,
//                     borderRadius: '9px', padding: '0.4rem 0.6rem',
//                     cursor: 'pointer', color: t.btnColor,
//                     display: 'flex', alignItems: 'center',
//                   }}
//                 >
//                   {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
//                 </button>
//                 {isAuth && <NotificationBell />}
//               </div>
//               {isAuth ? (
//                 <button onClick={handleLogout} style={{
//                   border: 'none', background: t.logoutHoverBg,
//                   color: t.logoutColor, fontWeight: 700, fontSize: '0.88rem',
//                   borderRadius: '9px', padding: '0.4rem 0.8rem', cursor: 'pointer',
//                   fontFamily: "'Plus Jakarta Sans', sans-serif",
//                 }}>
//                   Sign Out
//                 </button>
//               ) : (
//                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
//                   color: t.signInColor, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem',
//                   background: t.signInBg, padding: '0.4rem 0.9rem',
//                   borderRadius: '9px', border: `1px solid ${t.signInBorder}`,
//                 }}>
//                   Sign In
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Navbar;


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
import NotificationBell from './NotificationBell';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// Robust avatar URL builder
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar; // already full URL
  return `${AVATAR_BASE}${avatar}`;
};

/* ─── Theme tokens ─── */
const getTokens = (isDark) => isDark ? {
  navBg: 'transparent',
  navBgScrolled: '#060f2a',
  navBgBase: '#091428',
  navBorder: 'rgba(14,165,233,0.18)',
  navShadowScrolled: '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(0,212,170,0.15)',
  navShadow: '0 1px 0 rgba(0,212,170,0.1)',
  shimmerBorder: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)',
  linkColor: 'rgba(220,233,255,0.6)',
  linkActive: '#00d4aa',
  linkActiveBg: 'rgba(0,212,170,0.1)',
  linkActiveBorder: 'rgba(0,212,170,0.25)',
  linkHoverBg: 'rgba(255,255,255,0.07)',
  linkHoverBorder: 'rgba(255,255,255,0.1)',
  linkHoverColor: 'rgba(220,233,255,0.95)',
  brandColor: '#dce9ff',
  brandAccentFrom: '#00d4aa',
  brandAccentTo: '#2de2e6',
  btnBg: 'rgba(255,255,255,0.07)',
  btnBorder: 'rgba(255,255,255,0.12)',
  btnColor: 'rgba(220,233,255,0.65)',
  btnHoverBg: 'rgba(255,255,255,0.12)',
  btnHoverColor: '#dce9ff',
  dropdownBg: 'rgba(6,9,20,0.97)',
  dropdownBorder: 'rgba(255,255,255,0.1)',
  dropdownShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)',
  dropdownItemColor: 'rgba(220,233,255,0.7)',
  dropdownItemActiveBg: 'rgba(0,212,170,0.12)',
  dropdownItemActiveColor: '#00d4aa',
  dropdownItemHoverBg: 'rgba(255,255,255,0.06)',
  dropdownDivider: 'rgba(255,255,255,0.07)',
  userChipBg: 'rgba(255,255,255,0.07)',
  userChipBorder: 'rgba(255,255,255,0.12)',
  userChipHoverBg: 'rgba(255,255,255,0.12)',
  userNameColor: 'rgba(220,233,255,0.9)',
  chevronColor: 'rgba(220,233,255,0.4)',
  mobileBg: 'rgba(5,8,18,0.98)',
  mobileBorder: 'rgba(14,165,233,0.12)',
  mobileItemColor: 'rgba(220,233,255,0.65)',
  mobileItemHoverColor: '#00d4aa',
  mobileItemHoverBg: 'rgba(0,212,170,0.08)',
  mobileItemHoverBorder: 'rgba(0,212,170,0.15)',
  mobileDivider: 'rgba(255,255,255,0.06)',
  mobileChevronColor: 'rgba(220,233,255,0.2)',
  currencyBg: 'rgba(255,255,255,0.07)',
  currencyBorder: 'rgba(255,255,255,0.12)',
  currencyColor: 'rgba(220,233,255,0.85)',
  currencyHoverBg: 'rgba(255,255,255,0.12)',
  logoutColor: '#f87171',
  logoutHoverBg: 'rgba(248,113,113,0.1)',
  ctaBg: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
  ctaColor: '#05060f',
  ctaShadow: '0 4px 20px rgba(0,212,170,0.35)',
  ctaHoverShadow: '0 8px 28px rgba(0,212,170,0.5)',
  dotColor: '#00d4aa',
  dotShadow: '#00d4aa',
  signInBg: 'rgba(0,212,170,0.1)',
  signInColor: '#00d4aa',
  signInBorder: 'rgba(0,212,170,0.2)',
  avatarFallbackBg: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
  avatarFallbackColor: '#fff',
} : {
  navBg: 'transparent',
  navBgScrolled: '#ffffff',
  navBgBase: '#ffffff',
  navBorder: 'rgba(0,0,0,0.07)',
  navShadowScrolled: '0 4px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.05)',
  navShadow: '0 1px 0 rgba(0,0,0,0.05)',
  shimmerBorder: 'linear-gradient(90deg, transparent, rgba(0,150,200,0.15), rgba(14,165,233,0.12), transparent)',
  linkColor: 'rgba(30,50,100,0.55)',
  linkActive: '#0070c0',
  linkActiveBg: 'rgba(0,112,192,0.08)',
  linkActiveBorder: 'rgba(0,112,192,0.2)',
  linkHoverBg: 'rgba(0,0,0,0.04)',
  linkHoverBorder: 'rgba(0,0,0,0.08)',
  linkHoverColor: 'rgba(10,30,80,0.9)',
  brandColor: '#0f1c3f',
  brandAccentFrom: '#0070c0',
  brandAccentTo: '#00b4d8',
  btnBg: 'rgba(0,0,0,0.05)',
  btnBorder: 'rgba(0,0,0,0.1)',
  btnColor: 'rgba(30,50,100,0.6)',
  btnHoverBg: 'rgba(0,0,0,0.09)',
  btnHoverColor: '#0f1c3f',
  dropdownBg: 'rgba(255,255,255,0.99)',
  dropdownBorder: 'rgba(0,0,0,0.1)',
  dropdownShadow: '0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,112,192,0.08)',
  dropdownItemColor: 'rgba(30,50,100,0.75)',
  dropdownItemActiveBg: 'rgba(0,112,192,0.08)',
  dropdownItemActiveColor: '#0070c0',
  dropdownItemHoverBg: 'rgba(0,0,0,0.04)',
  dropdownDivider: 'rgba(0,0,0,0.07)',
  userChipBg: 'rgba(0,0,0,0.05)',
  userChipBorder: 'rgba(0,0,0,0.1)',
  userChipHoverBg: 'rgba(0,0,0,0.09)',
  userNameColor: 'rgba(10,30,80,0.85)',
  chevronColor: 'rgba(30,50,100,0.35)',
  mobileBg: 'rgba(255,255,255,0.99)',
  mobileBorder: 'rgba(0,0,0,0.07)',
  mobileItemColor: 'rgba(30,50,100,0.6)',
  mobileItemHoverColor: '#0070c0',
  mobileItemHoverBg: 'rgba(0,112,192,0.07)',
  mobileItemHoverBorder: 'rgba(0,112,192,0.15)',
  mobileDivider: 'rgba(0,0,0,0.07)',
  mobileChevronColor: 'rgba(30,50,100,0.2)',
  currencyBg: 'rgba(0,0,0,0.05)',
  currencyBorder: 'rgba(0,0,0,0.1)',
  currencyColor: 'rgba(30,50,100,0.8)',
  currencyHoverBg: 'rgba(0,0,0,0.09)',
  logoutColor: '#dc2626',
  logoutHoverBg: 'rgba(220,38,38,0.08)',
  ctaBg: 'linear-gradient(135deg, #0070c0, #00b4d8)',
  ctaColor: '#ffffff',
  ctaShadow: '0 4px 20px rgba(0,112,192,0.3)',
  ctaHoverShadow: '0 8px 28px rgba(0,112,192,0.45)',
  dotColor: '#0070c0',
  dotShadow: '#0070c0',
  signInBg: 'rgba(0,112,192,0.08)',
  signInColor: '#0070c0',
  signInBorder: 'rgba(0,112,192,0.18)',
  avatarFallbackBg: 'linear-gradient(135deg, #0070c0, #0ea5e9)',
  avatarFallbackColor: '#fff',
};

/* ─── UserAvatar component (for navbar chip) ─── */
const NavAvatar = ({ user, size = 30, t }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getAvatarUrl(user?.avatar);
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={user?.name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
      />
    );
  }
  return (
    <span style={{
      fontSize: size * 0.38, fontWeight: 800, color: t.avatarFallbackColor,
      fontFamily: "'Cabinet Grotesk', sans-serif",
    }}>
      {initials}
    </span>
  );
};

/* ─── CurrencySelector ─── */
const CurrencySelector = ({ mobile = false, t }) => {
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
          background: t.currencyBg, border: `1px solid ${t.currencyBorder}`,
          borderRadius: '10px', padding: mobile ? '0.4rem 0.7rem' : '0.5rem 0.9rem',
          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: t.currencyColor,
          transition: 'all 0.25s ease', fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={e => e.currentTarget.style.background = t.currencyHoverBg}
        onMouseLeave={e => e.currentTarget.style.background = t.currencyBg}
      >
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <FiChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '115%', right: 0,
          background: t.dropdownBg, border: `1px solid ${t.dropdownBorder}`,
          borderRadius: '14px', boxShadow: t.dropdownShadow,
          minWidth: '145px', zIndex: 2000, padding: '0.5rem',
          backdropFilter: 'blur(20px)',
          animation: 'navDropdown 0.2s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {CURRENCIES.map((c) => (
            <button key={c.code} onClick={() => { changeCurrency(c.code); setIsOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.55rem 0.8rem', border: 'none', borderRadius: '9px',
                background: currency.code === c.code ? t.dropdownItemActiveBg : 'transparent',
                color: currency.code === c.code ? t.dropdownItemActiveColor : t.dropdownItemColor,
                fontSize: '0.83rem', fontWeight: currency.code === c.code ? 700 : 500,
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={e => { if (currency.code !== c.code) e.currentTarget.style.background = t.dropdownItemHoverBg; }}
              onMouseLeave={e => { if (currency.code !== c.code) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{c.flag}</span><span>{c.code}</span>
              {currency.code === c.code && <FiCheck size={13} style={{ marginLeft: 'auto', color: t.dropdownItemActiveColor }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Navbar ─── */
const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const t = getTokens(isDark);

  const [showInquiries, setShowInquiries] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileRef = useRef(null);
  const inquiriesTimer = useRef(null);
  const userMenuTimer = useRef(null);

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

  useEffect(() => {
    return () => {
      if (inquiriesTimer.current) clearTimeout(inquiriesTimer.current);
      if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    };
  }, []);

  const handleLogout = () => { logout(); setMobileMenuOpen(false); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const handleInquiriesEnter = () => { if (inquiriesTimer.current) clearTimeout(inquiriesTimer.current); setShowInquiries(true); };
  const handleInquiriesLeave = () => { inquiriesTimer.current = setTimeout(() => setShowInquiries(false), 150); };
  const handleUserMenuEnter = () => { if (userMenuTimer.current) clearTimeout(userMenuTimer.current); setShowUserMenu(true); };
  const handleUserMenuLeave = () => { userMenuTimer.current = setTimeout(() => setShowUserMenu(false), 150); };

  const navLinkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.55rem 0.9rem', borderRadius: '10px',
    textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
    transition: 'all 0.2s ease',
    color: isActive(path) ? t.linkActive : t.linkColor,
    background: isActive(path) ? t.linkActiveBg : 'transparent',
    border: isActive(path) ? `1px solid ${t.linkActiveBorder}` : '1px solid transparent',
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
  });

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes navDropdown { from{opacity:0;transform:translateY(-8px) scale(0.96);} to{opacity:1;transform:translateY(0) scale(1);} }
    @keyframes mobileSlideDown { from{opacity:0;transform:translateY(-12px);} to{opacity:1;transform:translateY(0);} }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
    .bf-navbar { font-family: 'Plus Jakarta Sans', sans-serif; }
    .nav-link-hover:hover { color:${t.linkHoverColor} !important; background:${t.linkHoverBg} !important; border-color:${t.linkHoverBorder} !important; }
    .mobile-nav-item { display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; text-decoration:none; color:${t.mobileItemColor}; font-weight:700; font-size:0.9rem; border-radius:12px; transition:all 0.2s; border:1px solid transparent; }
    .mobile-nav-item:hover, .mobile-nav-item.active { color:${t.mobileItemHoverColor}; background:${t.mobileItemHoverBg}; border-color:${t.mobileItemHoverBorder}; }
    .live-dot { width:6px; height:6px; border-radius:50%; background:${t.dotColor}; display:inline-block; box-shadow:0 0 8px ${t.dotShadow}; animation:blink 2s infinite; }
    .dropdown-inner { background:${t.dropdownBg}; border:1px solid ${t.dropdownBorder}; border-radius:14px; padding:0.4rem; box-shadow:${t.dropdownShadow}; backdrop-filter:blur(20px); animation:navDropdown 0.2s cubic-bezier(.34,1.56,.64,1); }
    @media (max-width:991px) { .desktop-nav-center{display:none !important;} .desktop-nav-right-items{display:none !important;} .mobile-menu-btn{display:flex !important;} }
    @media (min-width:992px) { .mobile-menu-btn{display:none !important;} }
  `;

  return (
    <>
      <style key={isDark ? 'dark' : 'light'}>{CSS}</style>
      <nav className="bf-navbar" ref={mobileRef} style={{
        background: scrolled ? t.navBgScrolled : t.navBgBase,
        borderBottom: `1px solid ${t.navBorder}`,
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        boxShadow: scrolled ? t.navShadowScrolled : t.navShadow,
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: t.shimmerBorder, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, position: 'relative' }}>

          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.brandAccentFrom}, ${t.brandAccentTo === '#2de2e6' ? '#0ea5e9' : t.brandAccentTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: `0 0 16px ${t.brandAccentFrom}66`, flexShrink: 0 }}>🏠</div>
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.15rem', color: t.brandColor, letterSpacing: '-0.01em' }}>
              Boarding<span style={{ background: `linear-gradient(135deg, ${t.brandAccentFrom}, ${t.brandAccentTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Finder</span>
            </span>
            <span className="live-dot" />
          </Link>

          {/* Desktop Nav Center */}
          <div className="desktop-nav-center" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link to="/" className="nav-link-hover" style={navLinkStyle('/')}><FiHome size={15} /> Home</Link>
            <Link to="/map" className="nav-link-hover" style={navLinkStyle('/map')}><FiMap size={15} /> Map</Link>
            <Link to="/compare" className="nav-link-hover" style={navLinkStyle('/compare')}><FiBarChart2 size={15} /> Compare</Link>
            {isAuth && (
              <div style={{ position: 'relative' }} onMouseEnter={handleInquiriesEnter} onMouseLeave={handleInquiriesLeave}>
                <button className="nav-link-hover" style={{ ...navLinkStyle(''), background: (isActive('/inquiries') || isActive('/my-inquiries')) ? t.linkActiveBg : 'transparent', color: (isActive('/inquiries') || isActive('/my-inquiries')) ? t.linkActive : t.linkColor, border: '1px solid transparent' }}>
                  <FiGrid size={15} /> Activity
                  <FiChevronDown size={12} style={{ transform: showInquiries ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
                {showInquiries && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '8px', zIndex: 999 }} onMouseEnter={handleInquiriesEnter} onMouseLeave={handleInquiriesLeave}>
                    <div className="dropdown-inner" style={{ minWidth: '185px' }}>
                      <Link to="/inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/inquiries'), width: '100%', display: 'flex' }}><FiBell size={14} /> Received</Link>
                      <Link to="/my-inquiries" className="nav-link-hover" style={{ ...navLinkStyle('/my-inquiries'), width: '100%', display: 'flex' }}><FiMessageSquare size={14} /> Sent</Link>
                      <Link to="/favorites" className="nav-link-hover" style={{ ...navLinkStyle('/favorites'), width: '100%', display: 'flex' }}><FiHeart size={14} /> Saved</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Right */}
          <div className="desktop-nav-right-items" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CurrencySelector t={t} />
            <button onClick={toggleTheme} style={{ background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', color: t.btnColor, transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = t.btnHoverBg; e.currentTarget.style.color = t.btnHoverColor; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.btnBg; e.currentTarget.style.color = t.btnColor; }}>
              {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            {isAuth && <NotificationBell />}
            {isAuth ? (
              <div style={{ position: 'relative' }} onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                {/* User chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.7rem 0.35rem 0.35rem', borderRadius: '12px', background: t.userChipBg, border: `1px solid ${t.userChipBorder}`, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.userChipHoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = t.userChipBg}>
                  {/* ── FIXED AVATAR ── */}
                  <div style={{ width: 30, height: 30, borderRadius: '8px', background: t.avatarFallbackBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <NavAvatar user={user} size={30} t={t} />
                  </div>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: t.userNameColor }}>{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={12} style={{ color: t.chevronColor, transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>

                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 999 }} onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                    <div className="dropdown-inner" style={{ minWidth: '175px' }}>
                      {user?.isAdmin && (
                        <Link to="/admin/dashboard" className="nav-link-hover" style={{ ...navLinkStyle('/admin/dashboard'), width: '100%', display: 'flex' }}><FiShield size={14} /> Admin Panel</Link>
                      )}
                      <Link to="/profile" className="nav-link-hover" style={{ ...navLinkStyle('/profile'), width: '100%', display: 'flex' }}><FiUser size={14} /> Profile Settings</Link>
                      <div style={{ margin: '0.3rem 0.4rem', height: 1, background: t.dropdownDivider }} />
                      <button onClick={handleLogout} style={{ ...navLinkStyle(''), color: t.logoutColor, width: '100%', border: 'none', background: 'transparent', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        onMouseEnter={e => e.currentTarget.style.background = t.logoutHoverBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{ background: t.ctaBg, color: t.ctaColor, border: 'none', borderRadius: '11px', padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)', boxShadow: t.ctaShadow, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = t.ctaHoverShadow; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = t.ctaShadow; }}>
                  Get Started →
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: mobileMenuOpen ? t.signInBg : t.btnBg, border: `1px solid ${mobileMenuOpen ? t.signInBorder : t.btnBorder}`, borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', color: mobileMenuOpen ? t.signInColor : t.btnColor, transition: 'all 0.25s', alignItems: 'center' }}>
            {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: t.mobileBg, backdropFilter: 'blur(24px)', borderTop: `1px solid ${t.mobileBorder}`, padding: '0.75rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', animation: 'mobileSlideDown 0.3s cubic-bezier(.34,1.56,.64,1)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHome size={17} /> Home</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
            <Link to="/map" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMap size={17} /> Explore Map</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
            <Link to="/compare" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBarChart2 size={17} /> Compare</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
            {isAuth && (
              <>
                <div style={{ height: 1, background: t.mobileDivider, margin: '0.4rem 0' }} />
                <Link to="/inquiries" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiBell size={17} /> Inquiries</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
                <Link to="/my-inquiries" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMessageSquare size={17} /> Sent Requests</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
                <Link to="/favorites" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiHeart size={17} /> Saved</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
                <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}><span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiUser size={17} /> Profile</span><FiChevronRight size={14} style={{ color: t.mobileChevronColor }} /></Link>
              </>
            )}
            <div style={{ height: 1, background: t.mobileDivider, margin: '0.4rem 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <CurrencySelector mobile t={t} />
                <button onClick={toggleTheme} style={{ background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: '9px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: t.btnColor, display: 'flex', alignItems: 'center' }}>
                  {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                </button>
                {isAuth && <NotificationBell />}
              </div>
              {isAuth ? (
                <button onClick={handleLogout} style={{ border: 'none', background: t.logoutHoverBg, color: t.logoutColor, fontWeight: 700, fontSize: '0.88rem', borderRadius: '9px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sign Out</button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: t.signInColor, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem', background: t.signInBg, padding: '0.4rem 0.9rem', borderRadius: '9px', border: `1px solid ${t.signInBorder}` }}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;