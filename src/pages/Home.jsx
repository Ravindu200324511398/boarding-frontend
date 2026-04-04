

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiHeart, FiEye, FiLock, FiX } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';
// import { useCurrency } from '../context/CurrencyContext';
// import api from '../api/axios';
// import { StarDisplay } from '../components/StarRating';

// /* ─── Shared CSS ─── */
// const SHARED_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//   @keyframes houseFloat {
//     0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
//     50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
//   }
//   @keyframes orbFloat {
//     0%,100% { transform: translate(0,0) scale(1); }
//     33%      { transform: translate(40px,-50px) scale(1.07); }
//     66%      { transform: translate(-25px,30px) scale(0.95); }
//   }
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(22px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes shimmerBtn {
//     0%   { background-position: 200% center; }
//     100% { background-position: -200% center; }
//   }
//   @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
//   @keyframes spin { to { transform: rotate(360deg); } }
//   @keyframes modalPop {
//     from { opacity: 0; transform: translateY(20px) scale(0.96); }
//     to   { opacity: 1; transform: translateY(0) scale(1); }
//   }

//   .reg-submit-btn {
//     border: none; border-radius: 14px; padding: 0.85rem 1.5rem;
//     font-weight: 800; font-size: 0.95rem; cursor: pointer;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
//     background-size: 300% 300%;
//     color: #fff;
//     box-shadow: 0 6px 24px rgba(0,212,170,0.35);
//     transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
//     display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
//     animation: shimmerBtn 5s linear infinite;
//   }
//   .reg-submit-btn:hover:not(:disabled) {
//     transform: translateY(-3px) scale(1.02);
//     box-shadow: 0 12px 36px rgba(0,212,170,0.5);
//   }
//   .reg-submit-btn:active:not(:disabled) { transform: scale(0.97); }
//   .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

//   input::placeholder { color: rgba(210,228,255,0.35); }
//   input:-webkit-autofill {
//     -webkit-box-shadow: 0 0 0 100px rgba(10,20,50,0.95) inset !important;
//     -webkit-text-fill-color: rgba(220,235,255,0.9) !important;
//   }
//   select option { background: #0d1b3e; color: #dce9ff; }

//   select {
//     -webkit-appearance: none;
//     -moz-appearance: none;
//     appearance: none;
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300d4aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
//     background-repeat: no-repeat !important;
//     background-position: right 12px center !important;
//     padding-right: 2.2rem !important;
//     cursor: pointer;
//   }
//   select:focus {
//     border-color: rgba(0,212,170,0.6) !important;
//     box-shadow: 0 0 0 3px rgba(0,212,170,0.12) !important;
//     outline: none;
//   }
// `;

// /* ─── Login Gate Modal ─── */
// const LoginGateModal = ({ onClose, boardingTitle }) => {
//   const navigate = useNavigate();
//   return (
//     <div
//       style={{
//         position: 'fixed', inset: 0, zIndex: 9000,
//         background: 'rgba(4,10,30,0.85)',
//         backdropFilter: 'blur(12px)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         padding: '1rem',
//       }}
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div style={{
//         background: 'linear-gradient(160deg, #0d1b3e 0%, #091428 100%)',
//         border: '1px solid rgba(0,212,170,0.25)',
//         borderRadius: 28, padding: '2.8rem 2.4rem',
//         maxWidth: 420, width: '100%',
//         boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)',
//         animation: 'modalPop 0.3s cubic-bezier(.34,1.56,.64,1)',
//         textAlign: 'center', position: 'relative',
//         fontFamily: "'Plus Jakarta Sans', sans-serif",
//       }}>
//         {/* Close */}
//         <button onClick={onClose} style={{
//           position: 'absolute', top: 16, right: 16,
//           background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
//           borderRadius: 10, width: 34, height: 34,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           cursor: 'pointer', color: 'rgba(220,233,255,0.6)',
//           transition: 'all 0.2s',
//         }}
//           onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
//           onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
//         >
//           <FiX size={16} />
//         </button>

//         {/* Lock Icon */}
//         <div style={{
//           width: 72, height: 72, borderRadius: 22,
//           background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(14,165,233,0.1))',
//           border: '1px solid rgba(0,212,170,0.25)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           margin: '0 auto 1.6rem',
//           boxShadow: '0 0 30px rgba(0,212,170,0.15)',
//         }}>
//           <FiLock size={30} color="#00d4aa" />
//         </div>

//         {/* Live dot badge */}
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 8,
//           background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
//           borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem',
//         }}>
//           <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 6px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
//           <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.75rem', fontWeight: 700 }}>Members Only</span>
//         </div>

//         <h2 style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontWeight: 900, fontSize: '1.7rem', color: '#dce9ff',
//           marginBottom: '0.7rem', lineHeight: 1.2,
//         }}>
//           Login to View Details
//         </h2>

//         <p style={{
//           color: 'rgba(180,210,255,0.55)', fontSize: '0.92rem',
//           lineHeight: 1.65, marginBottom: '2rem',
//         }}>
//           {boardingTitle
//             ? <>Create a free account to see full details for <strong style={{ color: 'rgba(220,233,255,0.8)' }}>"{boardingTitle}"</strong> — pricing, contact info, photos & more.</>
//             : <>Create a free account to access full listing details, contact owners, and save your favourites.</>
//           }
//         </p>

//         {/* Buttons */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
//           <button
//             className="reg-submit-btn"
//             style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem' }}
//             onClick={() => navigate('/login')}
//           >
//             Sign In to Continue →
//           </button>
//           <button
//             onClick={() => navigate('/register')}
//             style={{
//               width: '100%', padding: '0.9rem',
//               background: 'rgba(255,255,255,0.05)',
//               border: '1px solid rgba(255,255,255,0.12)',
//               borderRadius: 14, color: 'rgba(220,233,255,0.7)',
//               fontWeight: 700, fontSize: '0.9rem',
//               cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
//               transition: 'all 0.2s',
//             }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
//           >
//             Create Free Account
//           </button>
//         </div>

//         <p style={{ marginTop: '1.2rem', fontSize: '0.75rem', color: 'rgba(180,210,255,0.3)' }}>
//           Free forever • No credit card required
//         </p>
//       </div>
//     </div>
//   );
// };

// /* ─── Particle Canvas ─── */
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
//     const particles = Array.from({ length: 45 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 2 + 0.5,
//       color: colors[Math.floor(Math.random() * colors.length)],
//       vx: (Math.random() - 0.5) * 0.45,
//       vy: -Math.random() * 0.65 - 0.25,
//       alpha: Math.random() * 0.55 + 0.2,
//     }));
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach(p => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
//         ctx.shadowColor = p.color; ctx.shadowBlur = 8;
//         ctx.fill();
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

// /* ─── Floating Orbs Background ─── */
// const OrbBackground = () => (
//   <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
//     {[
//       { w: 700, h: 700, color: '#00d4aa22', top: '-200px', left: '-200px', delay: '0s' },
//       { w: 600, h: 600, color: '#0ea5e933', top: '20%', right: '-180px', delay: '-5s' },
//       { w: 500, h: 500, color: '#06b6d422', bottom: '-150px', left: '20%', delay: '-9s' },
//       { w: 400, h: 400, color: '#0891b222', top: '55%', left: '55%', delay: '-6s' },
//       { w: 350, h: 350, color: '#2de2e611', top: '40%', left: '30%', delay: '-12s' },
//     ].map((o, i) => (
//       <div key={i} style={{
//         position: 'absolute', borderRadius: '50%',
//         width: o.w, height: o.h,
//         background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
//         filter: 'blur(80px)',
//         top: o.top, left: o.left, right: o.right, bottom: o.bottom,
//         animation: `orbFloat 16s ease-in-out infinite`,
//         animationDelay: o.delay,
//       }} />
//     ))}
//     <div style={{
//       position: 'absolute', inset: 0,
//       backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
//       backgroundSize: '60px 60px',
//     }} />
//   </div>
// );

// /* ─── Boarding Card ─── */
// const BoardingCard = ({ boarding, onFavorite, favorites, onViewDetails }) => {
//   const isFav = favorites.includes(boarding._id);
//   const { isAuth } = useAuth();
//   const { format } = useCurrency();
//   const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;

//   return (
//     <div style={{ height: '100%' }}>
//       <div
//         style={{
//           background: 'rgba(255,255,255,0.04)',
//           backdropFilter: 'blur(20px)',
//           border: '1px solid rgba(255,255,255,0.09)',
//           borderRadius: 24,
//           overflow: 'hidden',
//           transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
//           height: '100%', display: 'flex', flexDirection: 'column',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.transform = 'translateY(-10px)';
//           e.currentTarget.style.borderColor = 'rgba(0,212,170,0.4)';
//           e.currentTarget.style.boxShadow = '0 24px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,212,170,0.15)';
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.transform = 'translateY(0)';
//           e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
//           e.currentTarget.style.boxShadow = 'none';
//         }}
//       >
//         {/* Image */}
//         <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
//           {imageUrl
//             ? <img src={imageUrl} alt={boarding.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
//                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
//                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
//             : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,170,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
//           }
//           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,20,50,0.6) 0%, transparent 60%)' }} />

//           {isAuth && (
//             <button onClick={() => onFavorite(boarding._id, isFav)} style={{
//               position: 'absolute', top: 14, right: 14,
//               background: isFav ? 'rgba(239,68,68,0.85)' : 'rgba(8,20,50,0.6)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               borderRadius: '50%', width: 40, height: 40,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease'
//             }}>
//               <FiHeart fill={isFav ? 'white' : 'transparent'} size={17} />
//             </button>
//           )}

//           {/* Lock badge for guests */}
//           {!isAuth && (
//             <div style={{
//               position: 'absolute', top: 14, right: 14,
//               background: 'rgba(0,212,170,0.2)',
//               border: '1px solid rgba(0,212,170,0.35)',
//               borderRadius: 10, padding: '5px 10px',
//               display: 'flex', alignItems: 'center', gap: 5,
//               backdropFilter: 'blur(8px)',
//             }}>
//               <FiLock size={12} color="#00d4aa" />
//               <span style={{ color: '#00d4aa', fontSize: '0.7rem', fontWeight: 700 }}>Login to view</span>
//             </div>
//           )}

//           <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
//             <span style={{
//               background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
//               color: '#fff', padding: '4px 12px', borderRadius: 8,
//               fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
//             }}>{boarding.roomType}</span>
//           </div>
//         </div>

//         {/* Content */}
//         <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
//           <h5 style={{
//             fontFamily: "'Cabinet Grotesk', sans-serif",
//             fontWeight: 800, color: '#dce9ff', fontSize: '1.15rem',
//             marginBottom: '0.5rem', letterSpacing: '-0.01em'
//           }}>{boarding.title}</h5>

//           {boarding.avgRating > 0 && (
//             <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
//               <StarDisplay rating={boarding.avgRating} size={13} />
//               <span style={{ fontSize: '0.78rem', color: 'rgba(180,210,255,0.5)' }}>({boarding.totalRatings})</span>
//             </div>
//           )}

//           <p style={{ color: 'rgba(180,210,255,0.55)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1.2rem' }}>
//             <FiMapPin size={13} color="#06b6d4" /> {boarding.location}
//           </p>

//           <div style={{ marginTop: 'auto' }}>
//             <div style={{ marginBottom: '1rem' }}>
//               <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(180,210,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Monthly</span>
//               {isAuth ? (
//                 <p style={{ margin: 0, fontWeight: 800, color: '#00d4aa', fontSize: '1.4rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
//                   {format(boarding.price)}
//                 </p>
//               ) : (
//                 /* Price blurred for guests */
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <p style={{ margin: 0, fontWeight: 800, color: '#00d4aa', fontSize: '1.4rem', fontFamily: "'Cabinet Grotesk', sans-serif", filter: 'blur(6px)', userSelect: 'none' }}>
//                     LKR 00,000
//                   </p>
//                   <FiLock size={14} color="rgba(180,210,255,0.3)" />
//                 </div>
//               )}
//             </div>

//             {/* View Details button — shows modal if not auth */}
//             <button
//               onClick={() => onViewDetails(boarding)}
//               className="reg-submit-btn"
//               style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', borderRadius: 12, margin: 0 }}
//             >
//               {isAuth ? <><FiEye size={15} /> View Details</> : <><FiLock size={15} /> View Details</>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Home Component ─── */
// const Home = () => {
//   const [boardings, setBoardings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [favorites, setFavorites] = useState([]);
//   const [filters, setFilters] = useState({ search: '', location: '', minPrice: '', maxPrice: '', roomType: '' });
//   const [heroSearch, setHeroSearch] = useState('');
//   const [stats, setStats] = useState({ total: 0 });
//   const [loginGate, setLoginGate] = useState({ open: false, boarding: null });
//   const { isAuth } = useAuth();
//   const navigate = useNavigate();

//   const fetchBoardings = useCallback(async (appliedFilters = filters) => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (appliedFilters.search)   params.search   = appliedFilters.search;
//       if (appliedFilters.location) params.location = appliedFilters.location;
//       if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
//       if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;
//       if (appliedFilters.roomType) params.roomType = appliedFilters.roomType;
//       const res = await api.get('/boardings', { params });
//       setBoardings(res.data.boardings);
//       setStats({ total: res.data.count });
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   }, [filters]);

//   const fetchFavorites = useCallback(async () => {
//     if (!isAuth) return;
//     try {
//       const res = await api.get('/favorites');
//       setFavorites(res.data.favorites.map(f => f._id));
//     } catch {}
//   }, [isAuth]);

//   useEffect(() => { fetchBoardings(); fetchFavorites(); }, [fetchBoardings, fetchFavorites]);

//   const handleFavorite = async (boardingId, isFav) => {
//     if (!isAuth) { navigate('/login'); return; }
//     try {
//       if (isFav) { await api.delete(`/favorites/${boardingId}`); setFavorites(p => p.filter(id => id !== boardingId)); }
//       else { await api.post(`/favorites/${boardingId}`); setFavorites(p => [...p, boardingId]); }
//     } catch {}
//   };

//   /* ── View Details click handler ── */
//   const handleViewDetails = (boarding) => {
//     if (isAuth) {
//       navigate(`/boarding/${boarding._id}`);
//     } else {
//       setLoginGate({ open: true, boarding });
//     }
//   };

//   const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
//   const handleApplyFilters = () => fetchBoardings(filters);
//   const handleClearFilters = () => {
//     const cleared = { search: '', location: '', minPrice: '', maxPrice: '', roomType: '' };
//     setFilters(cleared); setHeroSearch(''); fetchBoardings(cleared);
//   };
//   const handleHeroSearch = e => {
//     e.preventDefault();
//     const updated = { ...filters, search: heroSearch };
//     setFilters(updated); fetchBoardings(updated);
//     document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const inputGlassStyle = {
//     background: 'rgba(255,255,255,0.04)',
//     border: '1px solid rgba(255,255,255,0.1)',
//     borderRadius: 12, color: '#dce9ff',
//     padding: '0.7rem 1rem', fontSize: '0.88rem',
//     outline: 'none', width: '100%',
//     transition: 'border-color 0.3s ease',
//     fontFamily: "'Plus Jakarta Sans', sans-serif",
//   };

//   return (
//     <div style={{ background: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)', minHeight: '100vh', color: '#dce9ff', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <style>{SHARED_CSS}</style>
//       <OrbBackground />

//       {/* Login Gate Modal */}
//       {loginGate.open && (
//         <LoginGateModal
//           boardingTitle={loginGate.boarding?.title}
//           onClose={() => setLoginGate({ open: false, boarding: null })}
//         />
//       )}

//       {/* ── Hero ── */}
//       <section style={{ padding: '140px 0 110px', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
//         <ParticleCanvas />
//         <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 10,
//             background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
//             borderRadius: 99, padding: '6px 18px', marginBottom: '2rem',
//             animation: 'fadeUp 0.6s ease',
//           }}>
//             <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
//             <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>Over 2,000+ verified listings live now</span>
//           </div>

//           <h1 style={{
//             fontFamily: "'Cabinet Grotesk', sans-serif",
//             fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
//             fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05,
//             marginBottom: '1.5rem', color: '#dce9ff',
//             animation: 'fadeUp 0.8s ease 0.1s both'
//           }}>
//             Find Your Next <br />
//             <span style={{
//               background: 'linear-gradient(90deg, #00d4aa, #2de2e6, #0ea5e9)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//               backgroundSize: '200% auto', animation: 'shimmerBtn 4s linear infinite'
//             }}>Perfect Stay</span>
//           </h1>

//           <p style={{ fontSize: '1.15rem', color: 'rgba(180,210,255,0.6)', maxWidth: 620, margin: '0 auto 3rem', animation: 'fadeUp 0.8s ease 0.2s both', lineHeight: 1.65 }}>
//             Discover high-quality, verified boarding places near university hubs across Sri Lanka.
//           </p>

//           <form onSubmit={handleHeroSearch} style={{
//             maxWidth: 760, margin: '0 auto',
//             display: 'flex', gap: 12,
//             background: 'rgba(255,255,255,0.04)',
//             padding: 12, borderRadius: 24,
//             backdropFilter: 'blur(30px)',
//             border: '1px solid rgba(255,255,255,0.1)',
//             animation: 'fadeUp 0.8s ease 0.3s both',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
//           }}>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
//               <FiSearch color="#00d4aa" size={20} style={{ flexShrink: 0 }} />
//               <input
//                 type="text"
//                 placeholder="Where do you want to live? (e.g. Moratuwa)"
//                 value={heroSearch}
//                 onChange={e => setHeroSearch(e.target.value)}
//                 style={{ background: 'none', border: 'none', color: '#dce9ff', width: '100%', padding: '12px 14px', outline: 'none', fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
//               />
//             </div>
//             <button type="submit" className="reg-submit-btn" style={{ padding: '0 32px', height: 52, borderRadius: 16, margin: 0, fontSize: '0.95rem', flexShrink: 0 }}>
//               Search
//             </button>
//           </form>

//           {/* Guest CTA banner */}
//           {!isAuth && (
//             <div style={{
//               marginTop: '2rem',
//               display: 'inline-flex', alignItems: 'center', gap: 12,
//               background: 'rgba(0,212,170,0.06)',
//               border: '1px solid rgba(0,212,170,0.18)',
//               borderRadius: 16, padding: '0.7rem 1.4rem',
//               animation: 'fadeUp 0.8s ease 0.4s both',
//             }}>
//               <FiLock size={15} color="#00d4aa" />
//               <span style={{ color: 'rgba(180,230,220,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>
//                 <Link to="/login" style={{ color: '#00d4aa', textDecoration: 'none', fontWeight: 800 }}>Sign in</Link>
//                 {' '}or{' '}
//                 <Link to="/register" style={{ color: '#2de2e6', textDecoration: 'none', fontWeight: 800 }}>create a free account</Link>
//                 {' '}to view full details, contact owners & more
//               </span>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ── Stats ── */}
//       <div className="container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
//         <div className="row g-4 justify-content-center">
//           {[
//             { num: stats.total || '2K+', label: 'Boarding Houses', color: '#00d4aa' },
//             { num: 'Verified', label: 'Safety First', color: '#2de2e6' },
//             { num: '0%', label: 'Listing Fees', color: '#0ea5e9' },
//           ].map((s, i) => (
//             <div key={i} className="col-12 col-md-3">
//               <div style={{
//                 background: 'rgba(255,255,255,0.04)',
//                 border: '1px solid rgba(255,255,255,0.08)',
//                 borderRadius: 24, padding: '1.8rem', textAlign: 'center',
//                 backdropFilter: 'blur(20px)',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
//                 transition: 'transform 0.3s ease, border-color 0.3s ease',
//               }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${s.color}44`; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
//                 <div style={{ fontSize: '2.2rem', fontWeight: 900, color: s.color, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.num}</div>
//                 <div style={{ fontSize: '0.72rem', color: 'rgba(180,210,255,0.45)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 8, fontWeight: 700 }}>{s.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Main Content ── */}
//       <div className="container py-5" id="listings" style={{ position: 'relative', zIndex: 5 }}>

//         {/* Filters */}
//         <div style={{
//           background: 'rgba(255,255,255,0.03)',
//           border: '1px solid rgba(255,255,255,0.08)',
//           borderRadius: 28, padding: '2rem',
//           marginBottom: '3.5rem',
//           backdropFilter: 'blur(16px)',
//         }}>
//           <div className="row g-3 align-items-end">
//             <div className="col-12 col-md-3">
//               <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//                 <FiSearch size={13} /> Keywords
//               </label>
//               <input type="text" name="search" style={inputGlassStyle} placeholder="WiFi, AC, Single..." value={filters.search} onChange={handleFilterChange} />
//             </div>
//             <div className="col-12 col-md-2">
//               <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//                 <FiMapPin size={13} /> Location
//               </label>
//               <input type="text" name="location" style={inputGlassStyle} placeholder="City name..." value={filters.location} onChange={handleFilterChange} />
//             </div>
//             <div className="col-6 col-md-2">
//               <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Price</label>
//               <input type="number" name="minPrice" style={inputGlassStyle} placeholder="LKR" value={filters.minPrice} onChange={handleFilterChange} />
//             </div>
//             <div className="col-6 col-md-2">
//               <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Price</label>
//               <input type="number" name="maxPrice" style={inputGlassStyle} placeholder="LKR" value={filters.maxPrice} onChange={handleFilterChange} />
//             </div>
//             <div className="col-12 col-md-2">
//               <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Room Type</label>
//               <select
//                 name="roomType"
//                 value={filters.roomType}
//                 onChange={handleFilterChange}
//                 style={{
//                   ...inputGlassStyle,
//                   cursor: 'pointer',
//                   WebkitAppearance: 'none',
//                   MozAppearance: 'none',
//                   appearance: 'none',
//                   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300d4aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                   backgroundRepeat: 'no-repeat',
//                   backgroundPosition: 'right 12px center',
//                   paddingRight: '2.2rem',
//                 }}
//               >
//                 <option value="">All Types</option>
//                 <option>Single</option>
//                 <option>Double</option>
//                 <option>Triple</option>
//                 <option>Annex</option>
//                 <option>Other</option>
//               </select>
//             </div>
//             <div className="col-12 col-md-1">
//               <button className="reg-submit-btn" onClick={handleApplyFilters} style={{ height: 46, width: '100%', margin: 0, padding: 0, borderRadius: 12 }}>
//                 <FiFilter size={18} />
//               </button>
//             </div>
//           </div>
//           <div style={{ marginTop: '1rem', textAlign: 'right' }}>
//             <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'rgba(180,210,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//               Reset all filters
//             </button>
//           </div>
//         </div>

//         {/* Results Header */}
//         <div className="d-flex justify-content-between align-items-center mb-5" style={{ flexWrap: 'wrap', gap: '1rem' }}>
//           <div>
//             <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '2rem', marginBottom: 4, color: '#dce9ff' }}>
//               {loading ? 'Curating Results...' : 'Available Listings'}
//             </h2>
//             <p style={{ color: 'rgba(180,210,255,0.45)', margin: 0, fontSize: '0.9rem' }}>
//               {boardings.length} properties found matching your criteria
//             </p>
//           </div>
//           {isAuth && (
//             <Link to="/add">
//               <button className="reg-submit-btn" style={{ fontSize: '0.88rem', padding: '0.75rem 1.4rem', margin: 0 }}>
//                 + List Your Property
//               </button>
//             </Link>
//           )}
//         </div>

//         {/* Boardings Grid */}
//         {loading ? (
//           <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
//             <div style={{ width: 44, height: 44, border: '3px solid rgba(0,212,170,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//           </div>
//         ) : boardings.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 40, border: '1px dashed rgba(255,255,255,0.1)' }}>
//             <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'grayscale(1)' }}>🏙️</div>
//             <h3 style={{ fontWeight: 800, color: '#dce9ff' }}>No results found</h3>
//             <p style={{ color: 'rgba(180,210,255,0.5)', maxWidth: 400, margin: '0 auto' }}>Try broadening your search criteria.</p>
//           </div>
//         ) : (
//           <div className="row g-4">
//             {boardings.map((b, index) => (
//               <div key={b._id} className="col-12 col-sm-6 col-lg-4" style={{ animation: `fadeUp 0.6s ease ${index * 0.08}s both` }}>
//                 <BoardingCard
//                   boarding={b}
//                   onFavorite={handleFavorite}
//                   favorites={favorites}
//                   onViewDetails={handleViewDetails}
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Bottom CTA for guests */}
//         {!isAuth && boardings.length > 0 && (
//           <div style={{
//             marginTop: '4rem', textAlign: 'center',
//             background: 'rgba(0,212,170,0.04)',
//             border: '1px dashed rgba(0,212,170,0.2)',
//             borderRadius: 28, padding: '3rem 2rem',
//             backdropFilter: 'blur(12px)',
//           }}>
//             <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
//             <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, color: '#dce9ff', marginBottom: '0.7rem' }}>
//               Want to see full details?
//             </h3>
//             <p style={{ color: 'rgba(180,210,255,0.5)', marginBottom: '1.8rem', maxWidth: 420, margin: '0 auto 1.8rem' }}>
//               Create a free account to unlock pricing, contact info, photo galleries, and the ability to save favourites.
//             </p>
//             <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
//               <button className="reg-submit-btn" style={{ padding: '0.85rem 2rem' }} onClick={() => navigate('/register')}>
//                 Create Free Account →
//               </button>
//               <button onClick={() => navigate('/login')} style={{
//                 background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
//                 color: 'rgba(220,233,255,0.8)', borderRadius: 14, padding: '0.85rem 2rem',
//                 fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
//                 fontSize: '0.95rem', transition: 'all 0.2s',
//               }}>
//                 Sign In
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div style={{ padding: '4rem 0', textAlign: 'center', color: 'rgba(180,210,255,0.2)', fontSize: '0.8rem', position: 'relative', zIndex: 5 }}>
//         &copy; 2026 Boarding Finder Sri Lanka. All rights reserved.
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiHeart, FiEye, FiLock, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';
import { useCurrency } from '../context/CurrencyContext';
import api from '../api/axios';
import { StarDisplay } from '../components/StarRating';

/* ─── Theme tokens ─── */
const getTokens = (isDark) => isDark ? {
  // ── DARK (original) ──
  pageBg: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)',
  pageColor: '#dce9ff',

  heroBadgeBg: 'rgba(0,212,170,0.08)',
  heroBadgeBorder: 'rgba(0,212,170,0.2)',
  heroBadgeColor: 'rgba(180,230,220,0.75)',
  heroDotColor: '#00d4aa',
  heroDotShadow: '#00d4aa',
  heroH1Color: '#dce9ff',
  heroSubColor: 'rgba(180,210,255,0.6)',
  heroSearchBg: 'rgba(255,255,255,0.04)',
  heroSearchBorder: 'rgba(255,255,255,0.1)',
  heroSearchShadow: '0 20px 60px rgba(0,0,0,0.3)',
  heroInputColor: '#dce9ff',
  heroIconColor: '#00d4aa',
  heroCtaBg: 'rgba(0,212,170,0.06)',
  heroCtaBorder: 'rgba(0,212,170,0.18)',
  heroCtaColor: 'rgba(180,230,220,0.7)',
  heroCtaLinkColor: '#00d4aa',
  heroCtaLink2Color: '#2de2e6',

  statCardBg: 'rgba(255,255,255,0.04)',
  statCardBorder: 'rgba(255,255,255,0.08)',
  statCardShadow: '0 10px 30px rgba(0,0,0,0.2)',
  statLabelColor: 'rgba(180,210,255,0.45)',

  filterBg: 'rgba(255,255,255,0.03)',
  filterBorder: 'rgba(255,255,255,0.08)',
  filterInputBg: 'rgba(255,255,255,0.04)',
  filterInputBorder: 'rgba(255,255,255,0.1)',
  filterInputColor: '#dce9ff',
  filterLabelColor: 'rgba(180,210,255,0.5)',
  filterResetColor: 'rgba(180,210,255,0.35)',

  listingsTitleColor: '#dce9ff',
  listingsSubColor: 'rgba(180,210,255,0.45)',

  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.09)',
  cardHoverBorder: 'rgba(0,212,170,0.4)',
  cardHoverShadow: '0 24px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,212,170,0.15)',
  cardImgFallbackBg: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,170,0.1))',
  cardImgGradient: 'linear-gradient(to top, rgba(8,20,50,0.6) 0%, transparent 60%)',
  cardFavActiveBg: 'rgba(239,68,68,0.85)',
  cardFavBg: 'rgba(8,20,50,0.6)',
  cardLockBg: 'rgba(0,212,170,0.2)',
  cardLockBorder: 'rgba(0,212,170,0.35)',
  cardLockColor: '#00d4aa',
  cardTitleColor: '#dce9ff',
  cardRatingSubColor: 'rgba(180,210,255,0.5)',
  cardLocationColor: 'rgba(180,210,255,0.55)',
  cardLocationIcon: '#06b6d4',
  cardPriceLabelColor: 'rgba(180,210,255,0.4)',
  cardPriceColor: '#00d4aa',
  cardPriceLockColor: 'rgba(180,210,255,0.3)',

  emptyBg: 'rgba(255,255,255,0.02)',
  emptyBorder: '1px dashed rgba(255,255,255,0.1)',
  emptyTitleColor: '#dce9ff',
  emptySubColor: 'rgba(180,210,255,0.5)',

  bottomCtaBg: 'rgba(0,212,170,0.04)',
  bottomCtaBorder: '1px dashed rgba(0,212,170,0.2)',
  bottomCtaTitleColor: '#dce9ff',
  bottomCtaSubColor: 'rgba(180,210,255,0.5)',
  bottomCtaSecondaryBg: 'rgba(255,255,255,0.06)',
  bottomCtaSecondaryBorder: 'rgba(255,255,255,0.15)',
  bottomCtaSecondaryColor: 'rgba(220,233,255,0.8)',

  modalBg: 'linear-gradient(160deg, #0d1b3e 0%, #091428 100%)',
  modalBorder: 'rgba(0,212,170,0.25)',
  modalShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)',
  modalCloseBg: 'rgba(255,255,255,0.07)',
  modalCloseBorder: 'rgba(255,255,255,0.1)',
  modalCloseColor: 'rgba(220,233,255,0.6)',
  modalCloseHoverBg: 'rgba(255,255,255,0.13)',
  modalIconBg: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(14,165,233,0.1))',
  modalIconBorder: 'rgba(0,212,170,0.25)',
  modalIconShadow: '0 0 30px rgba(0,212,170,0.15)',
  modalIconColor: '#00d4aa',
  modalBadgeBg: 'rgba(0,212,170,0.08)',
  modalBadgeBorder: 'rgba(0,212,170,0.2)',
  modalBadgeDot: '#00d4aa',
  modalBadgeDotShadow: '#00d4aa',
  modalBadgeColor: 'rgba(180,230,220,0.75)',
  modalTitleColor: '#dce9ff',
  modalSubColor: 'rgba(180,210,255,0.55)',
  modalSubStrongColor: 'rgba(220,233,255,0.8)',
  modalSecondaryBg: 'rgba(255,255,255,0.05)',
  modalSecondaryBorder: 'rgba(255,255,255,0.12)',
  modalSecondaryColor: 'rgba(220,233,255,0.7)',
  modalSecondaryHoverBg: 'rgba(255,255,255,0.1)',
  modalNoteColor: 'rgba(180,210,255,0.3)',

  footerColor: 'rgba(180,210,255,0.2)',

  orbColors: [
    { color: '#00d4aa22', top: '-200px', left: '-200px', delay: '0s' },
    { color: '#0ea5e933', top: '20%', right: '-180px', delay: '-5s' },
    { color: '#06b6d422', bottom: '-150px', left: '20%', delay: '-9s' },
    { color: '#0891b222', top: '55%', left: '55%', delay: '-6s' },
    { color: '#2de2e611', top: '40%', left: '30%', delay: '-12s' },
  ],
  gridLineColor: 'rgba(255,255,255,.018)',

  shimmerFrom: '#00d4aa',
  shimmerVia: '#2de2e6',
  shimmerTo: '#0ea5e9',
  spinnerBorder: 'rgba(0,212,170,0.2)',
  spinnerTop: '#00d4aa',

  submitBtnBg: 'linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%)',
  submitBtnColor: '#fff',
  submitBtnShadow: '0 6px 24px rgba(0,212,170,0.35)',

  overlayBg: 'rgba(4,10,30,0.85)',
} : {
  // ── LIGHT ──
  pageBg: 'linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 40%, #eaf7fb 100%)',
  pageColor: '#0f1c3f',

  heroBadgeBg: 'rgba(0,112,192,0.08)',
  heroBadgeBorder: 'rgba(0,112,192,0.2)',
  heroBadgeColor: 'rgba(0,60,130,0.7)',
  heroDotColor: '#0070c0',
  heroDotShadow: '#0070c0',
  heroH1Color: '#0f1c3f',
  heroSubColor: 'rgba(30,60,130,0.55)',
  heroSearchBg: 'rgba(255,255,255,0.7)',
  heroSearchBorder: 'rgba(0,0,0,0.1)',
  heroSearchShadow: '0 20px 60px rgba(0,0,0,0.1)',
  heroInputColor: '#0f1c3f',
  heroIconColor: '#0070c0',
  heroCtaBg: 'rgba(0,112,192,0.06)',
  heroCtaBorder: 'rgba(0,112,192,0.18)',
  heroCtaColor: 'rgba(0,60,130,0.7)',
  heroCtaLinkColor: '#0070c0',
  heroCtaLink2Color: '#0090c0',

  statCardBg: 'rgba(255,255,255,0.8)',
  statCardBorder: 'rgba(0,0,0,0.08)',
  statCardShadow: '0 10px 30px rgba(0,0,0,0.08)',
  statLabelColor: 'rgba(30,60,130,0.45)',

  filterBg: 'rgba(255,255,255,0.7)',
  filterBorder: 'rgba(0,0,0,0.08)',
  filterInputBg: 'rgba(255,255,255,0.9)',
  filterInputBorder: 'rgba(0,0,0,0.12)',
  filterInputColor: '#0f1c3f',
  filterLabelColor: 'rgba(30,60,130,0.5)',
  filterResetColor: 'rgba(30,60,130,0.35)',

  listingsTitleColor: '#0f1c3f',
  listingsSubColor: 'rgba(30,60,130,0.45)',

  cardBg: 'rgba(255,255,255,0.9)',
  cardBorder: 'rgba(0,0,0,0.08)',
  cardHoverBorder: 'rgba(0,112,192,0.4)',
  cardHoverShadow: '0 24px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,112,192,0.15)',
  cardImgFallbackBg: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(0,112,192,0.08))',
  cardImgGradient: 'linear-gradient(to top, rgba(0,20,80,0.35) 0%, transparent 60%)',
  cardFavActiveBg: 'rgba(239,68,68,0.85)',
  cardFavBg: 'rgba(255,255,255,0.7)',
  cardLockBg: 'rgba(0,112,192,0.12)',
  cardLockBorder: 'rgba(0,112,192,0.3)',
  cardLockColor: '#0070c0',
  cardTitleColor: '#0f1c3f',
  cardRatingSubColor: 'rgba(30,60,130,0.45)',
  cardLocationColor: 'rgba(30,60,130,0.55)',
  cardLocationIcon: '#0ea5e9',
  cardPriceLabelColor: 'rgba(30,60,130,0.4)',
  cardPriceColor: '#0070c0',
  cardPriceLockColor: 'rgba(30,60,130,0.3)',

  emptyBg: 'rgba(255,255,255,0.5)',
  emptyBorder: '1px dashed rgba(0,0,0,0.1)',
  emptyTitleColor: '#0f1c3f',
  emptySubColor: 'rgba(30,60,130,0.5)',

  bottomCtaBg: 'rgba(0,112,192,0.04)',
  bottomCtaBorder: '1px dashed rgba(0,112,192,0.2)',
  bottomCtaTitleColor: '#0f1c3f',
  bottomCtaSubColor: 'rgba(30,60,130,0.5)',
  bottomCtaSecondaryBg: 'rgba(0,0,0,0.05)',
  bottomCtaSecondaryBorder: 'rgba(0,0,0,0.12)',
  bottomCtaSecondaryColor: 'rgba(10,30,80,0.75)',

  modalBg: 'linear-gradient(160deg, #ffffff 0%, #f0f6ff 100%)',
  modalBorder: 'rgba(0,112,192,0.2)',
  modalShadow: '0 30px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,112,192,0.08)',
  modalCloseBg: 'rgba(0,0,0,0.05)',
  modalCloseBorder: 'rgba(0,0,0,0.1)',
  modalCloseColor: 'rgba(30,60,130,0.5)',
  modalCloseHoverBg: 'rgba(0,0,0,0.09)',
  modalIconBg: 'linear-gradient(135deg, rgba(0,112,192,0.1), rgba(14,165,233,0.08))',
  modalIconBorder: 'rgba(0,112,192,0.2)',
  modalIconShadow: '0 0 30px rgba(0,112,192,0.1)',
  modalIconColor: '#0070c0',
  modalBadgeBg: 'rgba(0,112,192,0.07)',
  modalBadgeBorder: 'rgba(0,112,192,0.18)',
  modalBadgeDot: '#0070c0',
  modalBadgeDotShadow: '#0070c0',
  modalBadgeColor: 'rgba(0,60,130,0.6)',
  modalTitleColor: '#0f1c3f',
  modalSubColor: 'rgba(30,60,130,0.55)',
  modalSubStrongColor: 'rgba(10,30,80,0.8)',
  modalSecondaryBg: 'rgba(0,0,0,0.04)',
  modalSecondaryBorder: 'rgba(0,0,0,0.1)',
  modalSecondaryColor: 'rgba(20,50,120,0.7)',
  modalSecondaryHoverBg: 'rgba(0,0,0,0.08)',
  modalNoteColor: 'rgba(30,60,130,0.3)',

  footerColor: 'rgba(30,60,130,0.3)',

  orbColors: [
    { color: '#0070c022', top: '-200px', left: '-200px', delay: '0s' },
    { color: '#0ea5e922', top: '20%', right: '-180px', delay: '-5s' },
    { color: '#06b6d415', bottom: '-150px', left: '20%', delay: '-9s' },
    { color: '#0891b218', top: '55%', left: '55%', delay: '-6s' },
    { color: '#00b4d810', top: '40%', left: '30%', delay: '-12s' },
  ],
  gridLineColor: 'rgba(0,0,0,.015)',

  shimmerFrom: '#0070c0',
  shimmerVia: '#00b4d8',
  shimmerTo: '#0ea5e9',
  spinnerBorder: 'rgba(0,112,192,0.2)',
  spinnerTop: '#0070c0',

  submitBtnBg: 'linear-gradient(135deg, #0070c0 0%, #00b4d8 40%, #0ea5e9 80%, #0891b2 100%)',
  submitBtnColor: '#ffffff',
  submitBtnShadow: '0 6px 24px rgba(0,112,192,0.3)',

  overlayBg: 'rgba(200,210,240,0.7)',
};

/* ─── Shared CSS (theme-aware via JS variables injected) ─── */
const getSharedCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes houseFloat {
    0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
    50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
  }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes modalPop {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.85rem 1.5rem;
    font-weight: 800; font-size: 0.95rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${t.submitBtnBg};
    background-size: 300% 300%;
    color: ${t.submitBtnColor};
    box-shadow: ${t.submitBtnShadow};
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
  }
  .reg-submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,112,192,0.4);
  }
  .reg-submit-btn:active:not(:disabled) { transform: scale(0.97); }
  .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  input::placeholder { color: rgba(80,120,200,0.35); }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(240,245,255,0.95) inset !important;
    -webkit-text-fill-color: ${t.filterInputColor} !important;
  }
  select option { background: #f0f6ff; color: #0f1c3f; }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230070c0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 12px center !important;
    padding-right: 2.2rem !important;
    cursor: pointer;
  }
  select:focus {
    border-color: rgba(0,112,192,0.6) !important;
    box-shadow: 0 0 0 3px rgba(0,112,192,0.12) !important;
    outline: none;
  }
`;

/* ─── Login Gate Modal ─── */
const LoginGateModal = ({ onClose, boardingTitle, t }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: t.overlayBg,
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: t.modalBg,
        border: `1px solid ${t.modalBorder}`,
        borderRadius: 28, padding: '2.8rem 2.4rem',
        maxWidth: 420, width: '100%',
        boxShadow: t.modalShadow,
        animation: 'modalPop 0.3s cubic-bezier(.34,1.56,.64,1)',
        textAlign: 'center', position: 'relative',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: t.modalCloseBg, border: `1px solid ${t.modalCloseBorder}`,
          borderRadius: 10, width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: t.modalCloseColor, transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = t.modalCloseHoverBg}
          onMouseLeave={e => e.currentTarget.style.background = t.modalCloseBg}
        >
          <FiX size={16} />
        </button>

        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: t.modalIconBg,
          border: `1px solid ${t.modalIconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.6rem',
          boxShadow: t.modalIconShadow,
        }}>
          <FiLock size={30} color={t.modalIconColor} />
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: t.modalBadgeBg, border: `1px solid ${t.modalBadgeBorder}`,
          borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.modalBadgeDot, boxShadow: `0 0 6px ${t.modalBadgeDotShadow}`, display: 'inline-block', animation: 'blink 2s infinite' }} />
          <span style={{ color: t.modalBadgeColor, fontSize: '0.75rem', fontWeight: 700 }}>Members Only</span>
        </div>

        <h2 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 900, fontSize: '1.7rem', color: t.modalTitleColor,
          marginBottom: '0.7rem', lineHeight: 1.2,
        }}>
          Login to View Details
        </h2>

        <p style={{ color: t.modalSubColor, fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          {boardingTitle
            ? <>Create a free account to see full details for <strong style={{ color: t.modalSubStrongColor }}>"{boardingTitle}"</strong> — pricing, contact info, photos & more.</>
            : <>Create a free account to access full listing details, contact owners, and save your favourites.</>
          }
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button className="reg-submit-btn" style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem' }} onClick={() => navigate('/login')}>
            Sign In to Continue →
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              width: '100%', padding: '0.9rem',
              background: t.modalSecondaryBg, border: `1px solid ${t.modalSecondaryBorder}`,
              borderRadius: 14, color: t.modalSecondaryColor,
              fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = t.modalSecondaryHoverBg}
            onMouseLeave={e => e.currentTarget.style.background = t.modalSecondaryBg}
          >
            Create Free Account
          </button>
        </div>

        <p style={{ marginTop: '1.2rem', fontSize: '0.75rem', color: t.modalNoteColor }}>
          Free forever • No credit card required
        </p>
      </div>
    </div>
  );
};

/* ─── Particle Canvas ─── */
const ParticleCanvas = ({ t }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#0ea5e9', '#06b6d4', t.heroDotColor, '#2de2e6', '#0891b2'];
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45,
      vy: -Math.random() * 0.65 - 0.25,
      alpha: Math.random() * 0.55 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [t.heroDotColor]);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

/* ─── Orb Background ─── */
const OrbBackground = ({ t }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {t.orbColors.map((o, i) => (
      <div key={i} style={{
        position: 'absolute', borderRadius: '50%',
        width: [700, 600, 500, 400, 350][i], height: [700, 600, 500, 400, 350][i],
        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        filter: 'blur(80px)',
        top: o.top, left: o.left, right: o.right, bottom: o.bottom,
        animation: `orbFloat 16s ease-in-out infinite`,
        animationDelay: o.delay,
      }} />
    ))}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `linear-gradient(${t.gridLineColor} 1px,transparent 1px), linear-gradient(90deg,${t.gridLineColor} 1px,transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

/* ─── Boarding Card ─── */
const BoardingCard = ({ boarding, onFavorite, favorites, onViewDetails, t }) => {
  const isFav = favorites.includes(boarding._id);
  const { isAuth } = useAuth();
  const { format } = useCurrency();
  const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;

  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          background: t.cardBg,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 24, overflow: 'hidden',
          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.borderColor = t.cardHoverBorder;
          e.currentTarget.style.boxShadow = t.cardHoverShadow;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = t.cardBorder;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          {imageUrl
            ? <img src={imageUrl} alt={boarding.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
            : <div style={{ width: '100%', height: '100%', background: t.cardImgFallbackBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
          }
          <div style={{ position: 'absolute', inset: 0, background: t.cardImgGradient }} />

          {isAuth && (
            <button onClick={() => onFavorite(boarding._id, isFav)} style={{
              position: 'absolute', top: 14, right: 14,
              background: isFav ? t.cardFavActiveBg : t.cardFavBg,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease'
            }}>
              <FiHeart fill={isFav ? 'white' : 'transparent'} size={17} />
            </button>
          )}

          {!isAuth && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: t.cardLockBg, border: `1px solid ${t.cardLockBorder}`,
              borderRadius: 10, padding: '5px 10px',
              display: 'flex', alignItems: 'center', gap: 5,
              backdropFilter: 'blur(8px)',
            }}>
              <FiLock size={12} color={t.cardLockColor} />
              <span style={{ color: t.cardLockColor, fontSize: '0.7rem', fontWeight: 700 }}>Login to view</span>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span style={{
              background: `linear-gradient(135deg, ${t.heroDotColor}, #0ea5e9)`,
              color: '#fff', padding: '4px 12px', borderRadius: 8,
              fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{boarding.roomType}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h5 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 800, color: t.cardTitleColor, fontSize: '1.15rem',
            marginBottom: '0.5rem', letterSpacing: '-0.01em'
          }}>{boarding.title}</h5>

          {boarding.avgRating > 0 && (
            <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarDisplay rating={boarding.avgRating} size={13} />
              <span style={{ fontSize: '0.78rem', color: t.cardRatingSubColor }}>({boarding.totalRatings})</span>
            </div>
          )}

          <p style={{ color: t.cardLocationColor, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1.2rem' }}>
            <FiMapPin size={13} color={t.cardLocationIcon} /> {boarding.location}
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.68rem', color: t.cardPriceLabelColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Monthly</span>
              {isAuth ? (
                <p style={{ margin: 0, fontWeight: 800, color: t.cardPriceColor, fontSize: '1.4rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {format(boarding.price)}
                </p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 800, color: t.cardPriceColor, fontSize: '1.4rem', fontFamily: "'Cabinet Grotesk', sans-serif", filter: 'blur(6px)', userSelect: 'none' }}>
                    LKR 00,000
                  </p>
                  <FiLock size={14} color={t.cardPriceLockColor} />
                </div>
              )}
            </div>

            <button
              onClick={() => onViewDetails(boarding)}
              className="reg-submit-btn"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', borderRadius: 12, margin: 0 }}
            >
              {isAuth ? <><FiEye size={15} /> View Details</> : <><FiLock size={15} /> View Details</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Home Component ─── */
const Home = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ search: '', location: '', minPrice: '', maxPrice: '', roomType: '' });
  const [heroSearch, setHeroSearch] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const [loginGate, setLoginGate] = useState({ open: false, boarding: null });
  const { isAuth } = useAuth();
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const navigate = useNavigate();

  const fetchBoardings = useCallback(async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (appliedFilters.search)   params.search   = appliedFilters.search;
      if (appliedFilters.location) params.location = appliedFilters.location;
      if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
      if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;
      if (appliedFilters.roomType) params.roomType = appliedFilters.roomType;
      const res = await api.get('/boardings', { params });
      setBoardings(res.data.boardings);
      setStats({ total: res.data.count });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  const fetchFavorites = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.favorites.map(f => f._id));
    } catch {}
  }, [isAuth]);

  useEffect(() => { fetchBoardings(); fetchFavorites(); }, [fetchBoardings, fetchFavorites]);

  const handleFavorite = async (boardingId, isFav) => {
    if (!isAuth) { navigate('/login'); return; }
    try {
      if (isFav) { await api.delete(`/favorites/${boardingId}`); setFavorites(p => p.filter(id => id !== boardingId)); }
      else { await api.post(`/favorites/${boardingId}`); setFavorites(p => [...p, boardingId]); }
    } catch {}
  };

  const handleViewDetails = (boarding) => {
    if (isAuth) navigate(`/boarding/${boarding._id}`);
    else setLoginGate({ open: true, boarding });
  };

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleApplyFilters = () => fetchBoardings(filters);
  const handleClearFilters = () => {
    const cleared = { search: '', location: '', minPrice: '', maxPrice: '', roomType: '' };
    setFilters(cleared); setHeroSearch(''); fetchBoardings(cleared);
  };
  const handleHeroSearch = e => {
    e.preventDefault();
    const updated = { ...filters, search: heroSearch };
    setFilters(updated); fetchBoardings(updated);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const inputGlassStyle = {
    background: t.filterInputBg,
    border: `1px solid ${t.filterInputBorder}`,
    borderRadius: 12, color: t.filterInputColor,
    padding: '0.7rem 1rem', fontSize: '0.88rem',
    outline: 'none', width: '100%',
    transition: 'border-color 0.3s ease',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const statColors = [t.heroDotColor, t.shimmerVia, t.shimmerTo];

  return (
    <div style={{ background: t.pageBg, minHeight: '100vh', color: t.pageColor, position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{getSharedCSS(t)}</style>
      <OrbBackground t={t} />

      {/* Login Gate Modal */}
      {loginGate.open && (
        <LoginGateModal
          boardingTitle={loginGate.boarding?.title}
          onClose={() => setLoginGate({ open: false, boarding: null })}
          t={t}
        />
      )}

      {/* ── Hero ── */}
      <section style={{ padding: '140px 0 110px', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
        <ParticleCanvas t={t} />
        <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: t.heroBadgeBg, border: `1px solid ${t.heroBadgeBorder}`,
            borderRadius: 99, padding: '6px 18px', marginBottom: '2rem',
            animation: 'fadeUp 0.6s ease',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.heroDotColor, boxShadow: `0 0 8px ${t.heroDotShadow}`, display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ color: t.heroBadgeColor, fontSize: '0.8rem', fontWeight: 600 }}>Over 2,000+ verified listings live now</span>
          </div>

          <h1 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05,
            marginBottom: '1.5rem', color: t.heroH1Color,
            animation: 'fadeUp 0.8s ease 0.1s both'
          }}>
            Find Your Next <br />
            <span style={{
              background: `linear-gradient(90deg, ${t.shimmerFrom}, ${t.shimmerVia}, ${t.shimmerTo})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto', animation: 'shimmerBtn 4s linear infinite'
            }}>Perfect Stay</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: t.heroSubColor, maxWidth: 620, margin: '0 auto 3rem', animation: 'fadeUp 0.8s ease 0.2s both', lineHeight: 1.65 }}>
            Discover high-quality, verified boarding places near university hubs across Sri Lanka.
          </p>

          <form onSubmit={handleHeroSearch} style={{
            maxWidth: 760, margin: '0 auto',
            display: 'flex', gap: 12,
            background: t.heroSearchBg,
            padding: 12, borderRadius: 24,
            backdropFilter: 'blur(30px)',
            border: `1px solid ${t.heroSearchBorder}`,
            animation: 'fadeUp 0.8s ease 0.3s both',
            boxShadow: t.heroSearchShadow,
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <FiSearch color={t.heroIconColor} size={20} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Where do you want to live? (e.g. Moratuwa)"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                style={{ background: 'none', border: 'none', color: t.heroInputColor, width: '100%', padding: '12px 14px', outline: 'none', fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
            <button type="submit" className="reg-submit-btn" style={{ padding: '0 32px', height: 52, borderRadius: 16, margin: 0, fontSize: '0.95rem', flexShrink: 0 }}>
              Search
            </button>
          </form>

          {!isAuth && (
            <div style={{
              marginTop: '2rem',
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: t.heroCtaBg, border: `1px solid ${t.heroCtaBorder}`,
              borderRadius: 16, padding: '0.7rem 1.4rem',
              animation: 'fadeUp 0.8s ease 0.4s both',
            }}>
              <FiLock size={15} color={t.heroDotColor} />
              <span style={{ color: t.heroCtaColor, fontSize: '0.85rem', fontWeight: 600 }}>
                <Link to="/login" style={{ color: t.heroCtaLinkColor, textDecoration: 'none', fontWeight: 800 }}>Sign in</Link>
                {' '}or{' '}
                <Link to="/register" style={{ color: t.heroCtaLink2Color, textDecoration: 'none', fontWeight: 800 }}>create a free account</Link>
                {' '}to view full details, contact owners & more
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="row g-4 justify-content-center">
          {[
            { num: stats.total || '2K+', label: 'Boarding Houses', color: statColors[0] },
            { num: 'Verified', label: 'Safety First', color: statColors[1] },
            { num: '0%', label: 'Listing Fees', color: statColors[2] },
          ].map((s, i) => (
            <div key={i} className="col-12 col-md-3">
              <div style={{
                background: t.statCardBg, border: `1px solid ${t.statCardBorder}`,
                borderRadius: 24, padding: '1.8rem', textAlign: 'center',
                backdropFilter: 'blur(20px)', boxShadow: t.statCardShadow,
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${s.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.statCardBorder; }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: s.color, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.num}</div>
                <div style={{ fontSize: '0.72rem', color: t.statLabelColor, textTransform: 'uppercase', letterSpacing: '2px', marginTop: 8, fontWeight: 700 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container py-5" id="listings" style={{ position: 'relative', zIndex: 5 }}>

        {/* Filters */}
        <div style={{
          background: t.filterBg, border: `1px solid ${t.filterBorder}`,
          borderRadius: 28, padding: '2rem', marginBottom: '3.5rem',
          backdropFilter: 'blur(16px)',
        }}>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.filterLabelColor, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <FiSearch size={13} /> Keywords
              </label>
              <input type="text" name="search" style={inputGlassStyle} placeholder="WiFi, AC, Single..." value={filters.search} onChange={handleFilterChange} />
            </div>
            <div className="col-12 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.filterLabelColor, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <FiMapPin size={13} /> Location
              </label>
              <input type="text" name="location" style={inputGlassStyle} placeholder="City name..." value={filters.location} onChange={handleFilterChange} />
            </div>
            <div className="col-6 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.filterLabelColor, marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Price</label>
              <input type="number" name="minPrice" style={inputGlassStyle} placeholder="LKR" value={filters.minPrice} onChange={handleFilterChange} />
            </div>
            <div className="col-6 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.filterLabelColor, marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Price</label>
              <input type="number" name="maxPrice" style={inputGlassStyle} placeholder="LKR" value={filters.maxPrice} onChange={handleFilterChange} />
            </div>
            <div className="col-12 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.filterLabelColor, marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Room Type</label>
              <select
                name="roomType"
                value={filters.roomType}
                onChange={handleFilterChange}
                style={{
                  ...inputGlassStyle,
                  cursor: 'pointer',
                  WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230070c0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '2.2rem',
                }}
              >
                <option value="">All Types</option>
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
                <option>Annex</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-12 col-md-1">
              <button className="reg-submit-btn" onClick={handleApplyFilters} style={{ height: 46, width: '100%', margin: 0, padding: 0, borderRadius: 12 }}>
                <FiFilter size={18} />
              </button>
            </div>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: t.filterResetColor, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Reset all filters
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '2rem', marginBottom: 4, color: t.listingsTitleColor }}>
              {loading ? 'Curating Results...' : 'Available Listings'}
            </h2>
            <p style={{ color: t.listingsSubColor, margin: 0, fontSize: '0.9rem' }}>
              {boardings.length} properties found matching your criteria
            </p>
          </div>
          {isAuth && (
            <Link to="/add">
              <button className="reg-submit-btn" style={{ fontSize: '0.88rem', padding: '0.75rem 1.4rem', margin: 0 }}>
                + List Your Property
              </button>
            </Link>
          )}
        </div>

        {/* Boardings Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
            <div style={{ width: 44, height: 44, border: `3px solid ${t.spinnerBorder}`, borderTopColor: t.spinnerTop, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : boardings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: t.emptyBg, borderRadius: 40, border: t.emptyBorder }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'grayscale(1)' }}>🏙️</div>
            <h3 style={{ fontWeight: 800, color: t.emptyTitleColor }}>No results found</h3>
            <p style={{ color: t.emptySubColor, maxWidth: 400, margin: '0 auto' }}>Try broadening your search criteria.</p>
          </div>
        ) : (
          <div className="row g-4">
            {boardings.map((b, index) => (
              <div key={b._id} className="col-12 col-sm-6 col-lg-4" style={{ animation: `fadeUp 0.6s ease ${index * 0.08}s both` }}>
                <BoardingCard
                  boarding={b}
                  onFavorite={handleFavorite}
                  favorites={favorites}
                  onViewDetails={handleViewDetails}
                  t={t}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA for guests */}
        {!isAuth && boardings.length > 0 && (
          <div style={{
            marginTop: '4rem', textAlign: 'center',
            background: t.bottomCtaBg, border: t.bottomCtaBorder,
            borderRadius: 28, padding: '3rem 2rem',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, color: t.bottomCtaTitleColor, marginBottom: '0.7rem' }}>
              Want to see full details?
            </h3>
            <p style={{ color: t.bottomCtaSubColor, marginBottom: '1.8rem', maxWidth: 420, margin: '0 auto 1.8rem' }}>
              Create a free account to unlock pricing, contact info, photo galleries, and the ability to save favourites.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="reg-submit-btn" style={{ padding: '0.85rem 2rem' }} onClick={() => navigate('/register')}>
                Create Free Account →
              </button>
              <button onClick={() => navigate('/login')} style={{
                background: t.bottomCtaSecondaryBg, border: `1px solid ${t.bottomCtaSecondaryBorder}`,
                color: t.bottomCtaSecondaryColor, borderRadius: 14, padding: '0.85rem 2rem',
                fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem', transition: 'all 0.2s',
              }}>
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '4rem 0', textAlign: 'center', color: t.footerColor, fontSize: '0.8rem', position: 'relative', zIndex: 5 }}>
        &copy; 2026 Boarding Finder Sri Lanka. All rights reserved.
      </div>
    </div>
  );
};

export default Home;