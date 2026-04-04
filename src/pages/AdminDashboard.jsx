// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi';
// import api from '../api/axios';
// import UserAvatar from '../components/UserAvatar';

// const ParticleCanvas = () => {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     let animId;
//     const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
//     resize();
//     window.addEventListener('resize', resize);
//     const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
//     const particles = Array.from({ length: 28 }, () => ({
//       x: Math.random() * canvas.width, y: Math.random() * canvas.height,
//       r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
//       vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.2,
//       alpha: Math.random() * 0.5 + 0.2,
//     }));
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach(p => {
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
//         ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
//         p.x += p.vx; p.y += p.vy;
//         if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
//         if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
//       });
//       animId = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
//   }, []);
//   return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
// };

// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//   @keyframes orbFloat {
//     0%,100% { transform:translate(0,0) scale(1); }
//     33%      { transform:translate(30px,-40px) scale(1.06); }
//     66%      { transform:translate(-20px,25px) scale(0.96); }
//   }
//   @keyframes fadeUp {
//     from { opacity:0; transform:translateY(16px); }
//     to   { opacity:1; transform:translateY(0); }
//   }
//   @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
//   .glass-card {
//     background: rgba(255,255,255,0.04);
//     border: 1px solid rgba(255,255,255,0.09);
//     border-radius: 16px;
//     animation: fadeUp 0.5s ease both;
//     transition: all 0.25s ease;
//   }
//   .glass-card:hover {
//     background: rgba(255,255,255,0.06);
//     border-color: rgba(0,212,170,0.2);
//   }
//   .stat-card {
//     background: rgba(255,255,255,0.04);
//     border: 1px solid rgba(255,255,255,0.09);
//     border-radius: 16px;
//     padding: 1.4rem;
//     display: flex; align-items: center; gap: 1rem;
//     animation: fadeUp 0.5s ease both;
//     transition: all 0.25s ease;
//   }
//   .stat-card:hover {
//     background: rgba(255,255,255,0.07);
//     border-color: rgba(0,212,170,0.3);
//     box-shadow: 0 8px 32px rgba(0,212,170,0.08);
//     transform: translateY(-2px);
//   }
//   .glass-table tr:hover td { background: rgba(255,255,255,0.04) !important; }
//   .user-link-card {
//     display: flex; align-items: center; gap: 0.8rem;
//     padding: 0.9rem;
//     border-radius: 12px;
//     border: 1px solid rgba(255,255,255,0.08);
//     background: rgba(255,255,255,0.03);
//     transition: all 0.2s; cursor: pointer;
//     text-decoration: none;
//   }
//   .user-link-card:hover {
//     border-color: rgba(0,212,170,0.3);
//     background: rgba(0,212,170,0.05);
//   }
//   .bar-fill {
//     height: 100%; border-radius: 4px;
//     background: linear-gradient(90deg,#00d4aa,#0ea5e9);
//     transition: width 0.6s ease;
//   }
// `;

// const StatCard = ({ icon, label, value, gradient, sub, delay = '0s' }) => (
//   <div className="stat-card" style={{ animationDelay: delay }}>
//     <div style={{ width: 52, height: 52, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//       {icon}
//     </div>
//     <div>
//       <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#dce9ff', lineHeight: 1 }}>{value}</div>
//       <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.45)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
//       {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(220,233,255,0.3)', marginTop: '0.1rem' }}>{sub}</div>}
//     </div>
//   </div>
// );

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/admin/stats')
//       .then(res => setStats(res.data.stats))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div style={{ minHeight: '100vh', background: '#060f2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div className="spinner-border" style={{ color: '#00d4aa' }} />
//     </div>
//   );

//   const typeGradients = ['#0ea5e9', '#00d4aa', '#fbbf24', '#a78bfa', '#f472b6'];

//   return (
//     <div style={{ minHeight: '100vh', background: '#060f2a', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
//       <style>{CSS}</style>

//       {/* Background orbs */}
//       <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
//         {[
//           { w: 700, h: 700, color: '#0ea5e928', top: '-220px', left: '-180px', delay: '0s' },
//           { w: 550, h: 550, color: '#06b6d425', top: '35%', right: '-170px', delay: '-5s' },
//           { w: 400, h: 400, color: '#00d4aa20', bottom: '-120px', left: '25%', delay: '-10s' },
//         ].map((o, i) => (
//           <div key={i} style={{
//             position: 'absolute', borderRadius: '50%', width: o.w, height: o.h,
//             background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
//             filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom,
//             animation: 'orbFloat 14s ease-in-out infinite', animationDelay: o.delay,
//           }} />
//         ))}
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
//       </div>

//       {/* Header */}
//       <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem', overflow: 'hidden' }}>
//         <ParticleCanvas />
//         <div className="container" style={{ position: 'relative', zIndex: 2 }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 50, padding: '0.3rem 0.9rem', marginBottom: '0.8rem' }}>
//             <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 6px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
//             <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00d4aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Overview</span>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
//             <FiShield size={22} color="#0ea5e9" />
//             <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#dce9ff', margin: 0 }}>Admin Dashboard</h1>
//           </div>
//           <p style={{ color: 'rgba(220,233,255,0.45)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>Overview of your Boarding Finder platform</p>
//         </div>
//       </div>

//       <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
//         {/* Stat Cards */}
//         <div className="row g-3 mb-4">
//           {[
//             { icon: <FiUsers size={22} color="#38bdf8" />, label: 'Total Users', value: stats.totalUsers, gradient: 'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(6,182,212,0.2))', delay: '0s' },
//             { icon: <FiHome size={22} color="#34d399" />, label: 'Total Listings', value: stats.totalBoardings, gradient: 'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(0,212,170,0.2))', delay: '0.1s' },
//             { icon: <FiShield size={22} color="#a78bfa" />, label: 'Admins', value: stats.totalAdmins, gradient: 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(139,92,246,0.2))', delay: '0.2s' },
//             { icon: <FiDollarSign size={22} color="#fbbf24" />, label: 'Avg Price', value: `LKR ${Math.round(stats.avgPrice).toLocaleString()}`, gradient: 'linear-gradient(135deg,rgba(251,191,36,0.3),rgba(217,119,6,0.2))', sub: 'per month', delay: '0.3s' },
//           ].map((s, i) => (
//             <div key={i} className="col-6 col-md-3">
//               <StatCard {...s} />
//             </div>
//           ))}
//         </div>

//         <div className="row g-4">
//           {/* Room type breakdown */}
//           <div className="col-md-4">
//             <div className="glass-card" style={{ padding: '1.5rem', height: '100%', animationDelay: '0.1s' }}>
//               <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, marginBottom: '1.4rem', color: '#dce9ff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
//                 <FiTrendingUp size={16} color="#0ea5e9" /> Listings by Type
//               </h5>
//               {stats.boardingsByType.map((t, i) => {
//                 const pct = Math.round((t.count / stats.totalBoardings) * 100);
//                 return (
//                   <div key={i} style={{ marginBottom: '1rem' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
//                       <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(220,233,255,0.8)' }}>{t._id || 'Other'}</span>
//                       <span style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.4)' }}>{t.count} ({pct}%)</span>
//                     </div>
//                     <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
//                       <div className="bar-fill" style={{ width: `${pct}%` }} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Recent boardings */}
//           <div className="col-md-8">
//             <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
//                 <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
//                   <FiHome size={16} color="#0ea5e9" /> Recent Listings
//                 </h5>
//                 <Link to="/admin/boardings" style={{ fontSize: '0.82rem', color: '#00d4aa', fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
//               </div>
//               <div style={{ overflowX: 'auto' }}>
//                 <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//                       {['Title', 'Location', 'Price', 'Owner', 'Type'].map(h => (
//                         <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(220,233,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.recentBoardings.map(b => (
//                       <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
//                         <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 600, color: '#dce9ff', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
//                         <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: 'rgba(220,233,255,0.5)' }}>{b.location}</td>
//                         <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 700 }}>
//                           <span style={{ background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LKR {b.price.toLocaleString()}</span>
//                         </td>
//                         <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: 'rgba(220,233,255,0.5)' }}>{b.owner?.name}</td>
//                         <td style={{ padding: '0.85rem 0.8rem' }}>
//                           <span style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{b.roomType}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Recent Users */}
//           <div className="col-12">
//             <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
//                 <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
//                   <FiUsers size={16} color="#0ea5e9" /> Recent Users
//                 </h5>
//                 <Link to="/admin/users" style={{ fontSize: '0.82rem', color: '#00d4aa', fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
//               </div>
//               <div className="row g-3">
//                 {stats.recentUsers.map(u => (
//                   <div key={u._id} className="col-12 col-md-6 col-lg-4">
//                     <Link to={`/admin/users/${u._id}`} className="user-link-card">
//                       <UserAvatar name={u.name} size={44} profilePhoto={u.avatar} />
//                       <div style={{ minWidth: 0, flex: 1 }}>
//                         <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#dce9ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
//                         <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
//                       </div>
//                       <span style={{ background: u.isAdmin ? 'rgba(251,191,36,0.15)' : 'rgba(0,212,170,0.12)', color: u.isAdmin ? '#fbbf24' : '#00d4aa', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, border: `1px solid ${u.isAdmin ? 'rgba(251,191,36,0.3)' : 'rgba(0,212,170,0.25)'}` }}>
//                         {u.isAdmin ? '⚡ Admin' : 'User'}
//                       </span>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi';
import api from '../api/axios';
import useTheme from '../context/useTheme';
import UserAvatar from '../components/UserAvatar';

/* ─── Theme tokens ─── */
const getTokens = (isDark) => isDark ? {
  pageBg: '#060f2a',
  pageColor: '#dce9ff',
  gridLine: 'rgba(255,255,255,.02)',
  orbColors: [
    { w: 700, h: 700, color: '#0ea5e928', top: '-220px', left: '-180px', delay: '0s' },
    { w: 550, h: 550, color: '#06b6d425', top: '35%', right: '-170px', delay: '-5s' },
    { w: 400, h: 400, color: '#00d4aa20', bottom: '-120px', left: '25%', delay: '-10s' },
  ],
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
  badgeBg: 'rgba(0,212,170,0.1)', badgeBorder: 'rgba(0,212,170,0.25)', badgeColor: '#00d4aa',
  dot: '#00d4aa',
  titleColor: '#dce9ff', subColor: 'rgba(220,233,255,0.45)',
  glassCardBg: 'rgba(255,255,255,0.04)', glassCardBorder: 'rgba(255,255,255,0.09)',
  glassCardHoverBg: 'rgba(255,255,255,0.06)', glassCardHoverBorder: 'rgba(0,212,170,0.2)',
  statCardBg: 'rgba(255,255,255,0.04)', statCardBorder: 'rgba(255,255,255,0.09)',
  statCardHoverBg: 'rgba(255,255,255,0.07)', statCardHoverBorder: 'rgba(0,212,170,0.3)',
  statCardHoverShadow: '0 8px 32px rgba(0,212,170,0.08)',
  statValueColor: '#dce9ff', statLabelColor: 'rgba(220,233,255,0.45)', statSubColor: 'rgba(220,233,255,0.3)',
  sectionTitleColor: '#dce9ff', sectionIconColor: '#0ea5e9',
  linkColor: '#00d4aa',
  barBg: 'rgba(255,255,255,0.07)',
  barFill: 'linear-gradient(90deg,#00d4aa,#0ea5e9)',
  tableBarLabelColor: 'rgba(220,233,255,0.8)', tableBarCountColor: 'rgba(220,233,255,0.4)',
  tableHeaderBorder: 'rgba(255,255,255,0.08)',
  tableHeaderColor: 'rgba(220,233,255,0.35)',
  tableRowBorder: 'rgba(255,255,255,0.05)',
  tableRowHoverBg: 'rgba(255,255,255,0.04)',
  tableTitleColor: '#dce9ff', tableSubColor: 'rgba(220,233,255,0.5)',
  tablePriceGrad: 'linear-gradient(135deg,#00d4aa,#0ea5e9)',
  tableTypeBg: 'rgba(14,165,233,0.15)', tableTypeColor: '#38bdf8',
  userCardBg: 'rgba(255,255,255,0.03)', userCardBorder: 'rgba(255,255,255,0.08)',
  userCardHoverBorder: 'rgba(0,212,170,0.3)', userCardHoverBg: 'rgba(0,212,170,0.05)',
  userNameColor: '#dce9ff', userEmailColor: 'rgba(220,233,255,0.4)',
  userAdminBg: 'rgba(251,191,36,0.15)', userAdminColor: '#fbbf24', userAdminBorder: 'rgba(251,191,36,0.3)',
  userBg: 'rgba(0,212,170,0.12)', userColor: '#00d4aa', userBorder: 'rgba(0,212,170,0.25)',
  spinnerColor: '#00d4aa',
} : {
  pageBg: '#f0f4ff',
  pageColor: '#0f1c3f',
  gridLine: 'rgba(0,0,0,.015)',
  orbColors: [
    { w: 700, h: 700, color: '#0ea5e918', top: '-220px', left: '-180px', delay: '0s' },
    { w: 550, h: 550, color: '#06b6d415', top: '35%', right: '-170px', delay: '-5s' },
    { w: 400, h: 400, color: '#0070c012', bottom: '-120px', left: '25%', delay: '-10s' },
  ],
  particleColors: ['#0ea5e9', '#06b6d4', '#0070c0', '#00b4d8', '#0891b2'],
  badgeBg: 'rgba(0,112,192,0.1)', badgeBorder: 'rgba(0,112,192,0.25)', badgeColor: '#0070c0',
  dot: '#0070c0',
  titleColor: '#0f1c3f', subColor: 'rgba(30,60,130,0.5)',
  glassCardBg: 'rgba(255,255,255,0.85)', glassCardBorder: 'rgba(0,0,0,0.08)',
  glassCardHoverBg: 'rgba(255,255,255,0.95)', glassCardHoverBorder: 'rgba(0,112,192,0.2)',
  statCardBg: 'rgba(255,255,255,0.85)', statCardBorder: 'rgba(0,0,0,0.08)',
  statCardHoverBg: 'rgba(255,255,255,0.98)', statCardHoverBorder: 'rgba(0,112,192,0.3)',
  statCardHoverShadow: '0 8px 32px rgba(0,112,192,0.1)',
  statValueColor: '#0f1c3f', statLabelColor: 'rgba(30,60,130,0.5)', statSubColor: 'rgba(30,60,130,0.35)',
  sectionTitleColor: '#0f1c3f', sectionIconColor: '#0ea5e9',
  linkColor: '#0070c0',
  barBg: 'rgba(0,0,0,0.07)',
  barFill: 'linear-gradient(90deg,#0070c0,#0ea5e9)',
  tableBarLabelColor: 'rgba(20,50,120,0.8)', tableBarCountColor: 'rgba(30,60,130,0.45)',
  tableHeaderBorder: 'rgba(0,0,0,0.08)',
  tableHeaderColor: 'rgba(30,60,130,0.45)',
  tableRowBorder: 'rgba(0,0,0,0.05)',
  tableRowHoverBg: 'rgba(0,112,192,0.04)',
  tableTitleColor: '#0f1c3f', tableSubColor: 'rgba(30,60,130,0.5)',
  tablePriceGrad: 'linear-gradient(135deg,#0070c0,#0ea5e9)',
  tableTypeBg: 'rgba(14,165,233,0.1)', tableTypeColor: '#0ea5e9',
  userCardBg: 'rgba(255,255,255,0.7)', userCardBorder: 'rgba(0,0,0,0.08)',
  userCardHoverBorder: 'rgba(0,112,192,0.3)', userCardHoverBg: 'rgba(0,112,192,0.05)',
  userNameColor: '#0f1c3f', userEmailColor: 'rgba(30,60,130,0.45)',
  userAdminBg: 'rgba(251,191,36,0.1)', userAdminColor: '#d97706', userAdminBorder: 'rgba(251,191,36,0.3)',
  userBg: 'rgba(0,112,192,0.08)', userColor: '#0070c0', userBorder: 'rgba(0,112,192,0.25)',
  spinnerColor: '#0070c0',
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-40px) scale(1.06);} 66%{transform:translate(-20px,25px) scale(0.96);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .glass-card {
    background: ${t.glassCardBg}; border: 1px solid ${t.glassCardBorder};
    border-radius: 16px; animation: fadeUp 0.5s ease both; transition: all 0.25s ease;
  }
  .glass-card:hover { background: ${t.glassCardHoverBg}; border-color: ${t.glassCardHoverBorder}; }

  .stat-card {
    background: ${t.statCardBg}; border: 1px solid ${t.statCardBorder};
    border-radius: 16px; padding: 1.4rem;
    display: flex; align-items: center; gap: 1rem;
    animation: fadeUp 0.5s ease both; transition: all 0.25s ease;
  }
  .stat-card:hover {
    background: ${t.statCardHoverBg}; border-color: ${t.statCardHoverBorder};
    box-shadow: ${t.statCardHoverShadow}; transform: translateY(-2px);
  }

  .glass-table tr:hover td { background: ${t.tableRowHoverBg} !important; }

  .user-link-card {
    display: flex; align-items: center; gap: 0.8rem;
    padding: 0.9rem; border-radius: 12px;
    border: 1px solid ${t.userCardBorder};
    background: ${t.userCardBg};
    transition: all 0.2s; cursor: pointer; text-decoration: none;
  }
  .user-link-card:hover { border-color: ${t.userCardHoverBorder}; background: ${t.userCardHoverBg}; }

  .bar-fill { height: 100%; border-radius: 4px; background: ${t.barFill}; transition: width 0.6s ease; }
`;

const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.2, alpha: Math.random() * 0.5 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [colors]);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const StatCard = ({ icon, label, value, gradient, sub, delay = '0s' }) => (
  <div className="stat-card" style={{ animationDelay: delay }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', marginTop: '0.1rem', opacity: 0.6 }}>{sub}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data.stats)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: t.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: t.spinnerColor }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, color: t.pageColor, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
      <style>{getCSS(t)}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: 'orbFloat 14s ease-in-out infinite', animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem', overflow: 'hidden' }}>
        <ParticleCanvas colors={t.particleColors} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: t.badgeBg, border: `1px solid ${t.badgeBorder}`, borderRadius: 50, padding: '0.3rem 0.9rem', marginBottom: '0.8rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, boxShadow: `0 0 6px ${t.dot}`, display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: t.badgeColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Overview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiShield size={22} color={t.sectionIconColor} />
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: t.titleColor, margin: 0 }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: t.subColor, margin: '0.3rem 0 0', fontSize: '0.9rem' }}>Overview of your Boarding Finder platform</p>
        </div>
      </div>

      <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {[
            { icon: <FiUsers size={22} color="#38bdf8" />, label: 'Total Users', value: stats.totalUsers, gradient: 'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(6,182,212,0.2))', delay: '0s' },
            { icon: <FiHome size={22} color="#34d399" />, label: 'Total Listings', value: stats.totalBoardings, gradient: 'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(0,212,170,0.2))', delay: '0.1s' },
            { icon: <FiShield size={22} color="#a78bfa" />, label: 'Admins', value: stats.totalAdmins, gradient: 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(139,92,246,0.2))', delay: '0.2s' },
            { icon: <FiDollarSign size={22} color="#fbbf24" />, label: 'Avg Price', value: `LKR ${Math.round(stats.avgPrice).toLocaleString()}`, gradient: 'linear-gradient(135deg,rgba(251,191,36,0.3),rgba(217,119,6,0.2))', sub: 'per month', delay: '0.3s' },
          ].map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <StatCard {...s} />
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Room type breakdown */}
          <div className="col-md-4">
            <div className="glass-card" style={{ padding: '1.5rem', height: '100%', animationDelay: '0.1s' }}>
              <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, marginBottom: '1.4rem', color: t.sectionTitleColor, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <FiTrendingUp size={16} color={t.sectionIconColor} /> Listings by Type
              </h5>
              {stats.boardingsByType.map((row, i) => {
                const pct = Math.round((row.count / stats.totalBoardings) * 100);
                return (
                  <div key={i} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: t.tableBarLabelColor }}>{row._id || 'Other'}</span>
                      <span style={{ fontSize: '0.82rem', color: t.tableBarCountColor }}>{row.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: t.barBg, borderRadius: 4, overflow: 'hidden' }}>
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent listings */}
          <div className="col-md-8">
            <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.sectionTitleColor, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <FiHome size={16} color={t.sectionIconColor} /> Recent Listings
                </h5>
                <Link to="/admin/boardings" style={{ fontSize: '0.82rem', color: t.linkColor, fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.tableHeaderBorder}` }}>
                      {['Title', 'Location', 'Price', 'Owner', 'Type'].map(h => (
                        <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: t.tableHeaderColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBoardings.map(b => (
                      <tr key={b._id} style={{ borderBottom: `1px solid ${t.tableRowBorder}` }}>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 600, color: t.tableTitleColor, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: t.tableSubColor }}>{b.location}</td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 700 }}>
                          <span style={{ background: t.tablePriceGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LKR {b.price.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: t.tableSubColor }}>{b.owner?.name}</td>
                        <td style={{ padding: '0.85rem 0.8rem' }}>
                          <span style={{ background: t.tableTypeBg, color: t.tableTypeColor, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{b.roomType}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="col-12">
            <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.sectionTitleColor, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <FiUsers size={16} color={t.sectionIconColor} /> Recent Users
                </h5>
                <Link to="/admin/users" style={{ fontSize: '0.82rem', color: t.linkColor, fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div className="row g-3">
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="col-12 col-md-6 col-lg-4">
                    <Link to={`/admin/users/${u._id}`} className="user-link-card">
                      <UserAvatar name={u.name} size={44} profilePhoto={u.avatar} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: t.userNameColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: t.userEmailColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                      <span style={{ background: u.isAdmin ? t.userAdminBg : t.userBg, color: u.isAdmin ? t.userAdminColor : t.userColor, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, border: `1px solid ${u.isAdmin ? t.userAdminBorder : t.userBorder}` }}>
                        {u.isAdmin ? '⚡ Admin' : 'User'}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;