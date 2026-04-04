

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiSlash, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';

// /* ─── Particle canvas ─── */
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
//     const particles = Array.from({ length: 35 }, () => ({
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

// /* ─── 3D House Card ─── */
// const HouseCard3D = () => {
//   const cardRef = useRef(null);
//   const handleMove = useCallback((e) => {
//     const card = cardRef.current;
//     if (!card) return;
//     const r = card.getBoundingClientRect();
//     const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
//     const rx = (e.clientY - cy) / 20, ry = -(e.clientX - cx) / 20;
//     card.style.animation = 'none';
//     card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(0)`;
//   }, []);
//   const handleLeave = useCallback(() => {
//     if (cardRef.current) cardRef.current.style.animation = 'houseFloat 6s ease-in-out infinite';
//   }, []);
//   return (
//     <div style={{ perspective: '1000px' }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
//       <div ref={cardRef} style={{
//         width: 320, borderRadius: 26,
//         background: 'linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
//         border: '1px solid rgba(255,255,255,0.13)',
//         backdropFilter: 'blur(20px)',
//         boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(0,212,170,0.15)',
//         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//         padding: '36px 32px 32px',
//         animation: 'houseFloat 6s ease-in-out infinite',
//         transformStyle: 'preserve-3d', cursor: 'pointer',
//         transition: 'transform 0.12s ease',
//       }}>
//         <div style={{ fontSize: '5.8rem', marginBottom: 14, filter: 'drop-shadow(0 12px 32px rgba(0,212,170,0.55))', animation: 'emojiGlow 4s ease-in-out infinite', lineHeight: 1 }}>🏠</div>
//         <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.25rem', textAlign: 'center', marginBottom: 8, background: 'linear-gradient(135deg, #00d4aa, #2de2e6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Find Your Perfect Room</h3>
//         <p style={{ fontSize: '0.85rem', color: 'rgba(240,244,255,0.45)', textAlign: 'center', lineHeight: 1.6, marginBottom: 26 }}>Sri Lanka's trusted boarding platform for students</p>
//         <div style={{ display: 'flex', gap: 14, width: '100%' }}>
//           {[['2K+', 'Rooms'], ['24/7', 'Support'], ['Verified', 'Listings']].map(([n, l]) => (
//             <div key={l} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14 }}>
//               <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
//               <div style={{ fontSize: '0.68rem', color: 'rgba(240,244,255,0.4)', marginTop: 3, fontWeight: 600, letterSpacing: '0.04em' }}>{l}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Banned Alert Card ─── */
// const BannedAlert = ({ email }) => {
//   const subject = encodeURIComponent('Account Ban Appeal - BoardingFinder');
//   const body = encodeURIComponent(
//     `Hello BoardingFinder Admin,\n\nMy account has been banned and I would like to appeal this decision.\n\nAccount Email: ${email}\n\nReason for appeal:\n[Please describe why you believe your account should be reinstated]\n\nThank you.`
//   );
//   const mailtoLink = `mailto:admin@boardingfinder.lk?subject=${subject}&body=${body}`;

//   return (
//     <div className="banned-alert-card">
//       {/* Animated red glow top border */}
//       <div className="banned-glow-bar" />

//       {/* Icon */}
//       <div className="banned-icon-wrap">
//         <div className="banned-icon-ring" />
//         <FiSlash size={28} color="#f87171" strokeWidth={2.5} />
//       </div>

//       {/* Title */}
//       <h3 className="banned-title">Account Suspended 🚫</h3>

//       {/* Message */}
//       <p className="banned-msg">
//         Your account has been <strong style={{ color: '#f87171' }}>suspended</strong> by an administrator. You cannot sign in at this time.
//       </p>

//       {/* Info rows */}
//       <div className="banned-info-box">
//         <div className="banned-info-row">
//           <span className="banned-info-dot" style={{ background: '#f87171' }} />
//           <span>Access to all features has been restricted</span>
//         </div>
//         <div className="banned-info-row">
//           <span className="banned-info-dot" style={{ background: '#fbbf24' }} />
//           <span>You can appeal this decision via email</span>
//         </div>
//         <div className="banned-info-row">
//           <span className="banned-info-dot" style={{ background: '#00d4aa' }} />
//           <span>Admin will review your appeal within 24–48 hrs</span>
//         </div>
//       </div>

//       {/* Contact button */}
//       <a href={mailtoLink} className="banned-contact-btn">
//         <FiMail size={16} />
//         Contact Admin to Appeal
//         <FiExternalLink size={13} style={{ opacity: 0.7 }} />
//       </a>

//       {/* Footer note */}
//       <p className="banned-footer-note">
//         📧 This will open your email app with a pre-filled appeal message to <strong style={{ color: 'rgba(220,233,255,0.6)' }}>admin@boardingfinder.lk</strong>
//       </p>
//     </div>
//   );
// };

// /* ─── Login ─── */
// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [isBanned, setIsBanned] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPw, setShowPw] = useState(false);
//   const [focused, setFocused] = useState('');
//   const [success, setSuccess] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError(''); setIsBanned(false);
//     try {
//       const res = await api.post('/auth/login', form);
//       setSuccess(true);
//       setTimeout(() => { login(res.data.user, res.data.token); navigate('/'); }, 700);
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Login failed. Please try again.';
//       // Detect ban message from backend
//       if (err.response?.status === 403 || msg.toLowerCase().includes('banned')) {
//         setIsBanned(true);
//       } else {
//         setError(msg);
//       }
//     } finally { setLoading(false); }
//   };

//   const inputWrapStyle = (field) => ({
//     display: 'flex', alignItems: 'center',
//     border: `1.5px solid ${focused === field ? 'rgba(0,212,170,0.6)' : 'rgba(255,255,255,0.1)'}`,
//     borderRadius: 13,
//     background: focused === field ? 'rgba(0,212,170,0.04)' : 'rgba(255,255,255,0.04)',
//     overflow: 'hidden', transition: 'all 0.25s ease',
//     boxShadow: focused === field ? '0 0 0 3px rgba(0,212,170,0.12), 0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
//   });

//   const inputStyle = {
//     border: 'none', outline: 'none', flex: 1,
//     padding: '0.9rem 1rem', fontSize: '0.92rem',
//     background: 'transparent', color: 'rgba(240,244,255,0.9)',
//     fontFamily: "'Plus Jakarta Sans', sans-serif",
//   };

//   const iconStyle = {
//     padding: '0 0.85rem', color: 'rgba(0,212,170,0.7)',
//     display: 'flex', alignItems: 'center',
//     borderRight: '1px solid rgba(255,255,255,0.07)',
//   };

//   const labelStyle = {
//     display: 'block', fontSize: '0.72rem', fontWeight: 700,
//     color: 'rgba(240,244,255,0.45)', marginBottom: '0.45rem',
//     textTransform: 'uppercase', letterSpacing: '0.1em',
//     fontFamily: "'Plus Jakarta Sans', sans-serif",
//   };

//   const CSS = `
//     @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//     @keyframes houseFloat {
//       0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
//       50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
//     }
//     @keyframes emojiGlow {
//       0%,100% { filter: drop-shadow(0 12px 32px rgba(0,212,170,0.55)); }
//       50%      { filter: drop-shadow(0 12px 32px rgba(14,165,233,0.65)); }
//     }
//     @keyframes orbFloat {
//       0%,100% { transform: translate(0,0) scale(1); }
//       33%      { transform: translate(40px,-50px) scale(1.07); }
//       66%      { transform: translate(-25px,30px) scale(0.95); }
//     }
//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(22px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes shimmerBtn {
//       0%   { background-position: 200% center; }
//       100% { background-position: -200% center; }
//     }
//     @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

//     /* ── Ban alert animations ── */
//     @keyframes banSlideIn {
//       0%   { opacity: 0; transform: translateY(-20px) scale(0.96); }
//       60%  { transform: translateY(4px) scale(1.01); }
//       100% { opacity: 1; transform: translateY(0) scale(1); }
//     }
//     @keyframes banPulse {
//       0%,100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); }
//       50%      { box-shadow: 0 0 0 8px rgba(248,113,113,0.08); }
//     }
//     @keyframes glowBar {
//       0%,100% { opacity: 0.6; }
//       50%      { opacity: 1; }
//     }
//     @keyframes iconSpin {
//       0%   { transform: rotate(0deg) scale(1); }
//       25%  { transform: rotate(-15deg) scale(1.15); }
//       75%  { transform: rotate(15deg) scale(1.15); }
//       100% { transform: rotate(0deg) scale(1); }
//     }
//     @keyframes ringPulse {
//       0%,100% { transform: scale(1);   opacity: 0.4; }
//       50%      { transform: scale(1.3); opacity: 0; }
//     }
//     @keyframes dotBlink {
//       0%,100% { opacity: 1; }
//       50%      { opacity: 0.3; }
//     }
//     @keyframes contactBtnShimmer {
//       0%   { background-position: 200% center; }
//       100% { background-position: -200% center; }
//     }

//     /* ── Ban card styles ── */
//     .banned-alert-card {
//       position: relative;
//       background: linear-gradient(135deg, rgba(239,68,68,0.07), rgba(220,38,38,0.04));
//       border: 1.5px solid rgba(248,113,113,0.3);
//       border-radius: 20px;
//       padding: 1.8rem 1.6rem;
//       margin-bottom: 1.5rem;
//       overflow: hidden;
//       animation: banSlideIn 0.5s cubic-bezier(.34,1.56,.64,1) both, banPulse 3s ease-in-out infinite;
//       text-align: center;
//     }

//     .banned-glow-bar {
//       position: absolute;
//       top: 0; left: 0; right: 0;
//       height: 3px;
//       background: linear-gradient(90deg, transparent, #f87171, #fca5a5, #f87171, transparent);
//       animation: glowBar 2s ease-in-out infinite;
//     }

//     .banned-icon-wrap {
//       position: relative;
//       width: 64px; height: 64px;
//       background: rgba(239,68,68,0.1);
//       border: 1.5px solid rgba(248,113,113,0.3);
//       border-radius: 18px;
//       display: flex; align-items: center; justify-content: center;
//       margin: 0 auto 1.1rem;
//       animation: iconSpin 4s ease-in-out infinite;
//     }

//     .banned-icon-ring {
//       position: absolute;
//       inset: -6px;
//       border-radius: 22px;
//       border: 1.5px solid rgba(248,113,113,0.25);
//       animation: ringPulse 2s ease-in-out infinite;
//     }

//     .banned-title {
//       font-family: 'Cabinet Grotesk', sans-serif;
//       font-weight: 800;
//       font-size: 1.2rem;
//       color: #fca5a5;
//       margin: 0 0 0.6rem;
//       letter-spacing: -0.01em;
//     }

//     .banned-msg {
//       font-size: 0.875rem;
//       color: rgba(220,233,255,0.5);
//       line-height: 1.65;
//       margin: 0 0 1.1rem;
//     }

//     .banned-info-box {
//       background: rgba(255,255,255,0.03);
//       border: 1px solid rgba(255,255,255,0.07);
//       border-radius: 12px;
//       padding: 0.85rem 1rem;
//       margin-bottom: 1.2rem;
//       text-align: left;
//     }

//     .banned-info-row {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       padding: 0.35rem 0;
//       font-size: 0.8rem;
//       color: rgba(180,210,255,0.55);
//       font-family: 'Plus Jakarta Sans', sans-serif;
//     }

//     .banned-info-dot {
//       width: 6px; height: 6px;
//       border-radius: 50%;
//       flex-shrink: 0;
//       animation: dotBlink 2s ease-in-out infinite;
//     }

//     .banned-contact-btn {
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       width: 100%;
//       padding: 0.85rem 1.2rem;
//       border-radius: 12px;
//       border: none;
//       background: linear-gradient(135deg, #ef4444 0%, #f87171 40%, #fca5a5 70%, #f87171 100%);
//       background-size: 300% 300%;
//       color: #fff;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       font-weight: 800;
//       font-size: 0.9rem;
//       cursor: pointer;
//       text-decoration: none;
//       box-shadow: 0 6px 20px rgba(239,68,68,0.35);
//       transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
//       animation: contactBtnShimmer 4s linear infinite;
//       margin-bottom: 0.8rem;
//     }
//     .banned-contact-btn:hover {
//       transform: translateY(-2px) scale(1.02);
//       box-shadow: 0 10px 30px rgba(239,68,68,0.5);
//       color: #fff;
//       text-decoration: none;
//     }

//     .banned-footer-note {
//       font-size: 0.74rem;
//       color: rgba(220,233,255,0.28);
//       margin: 0;
//       line-height: 1.5;
//     }

//     /* ── Login form styles ── */
//     .login-field { animation: fadeUp 0.5s ease both; }
//     .login-field:nth-child(1) { animation-delay: 0.1s; }
//     .login-field:nth-child(2) { animation-delay: 0.2s; }

//     .login-submit-btn {
//       width: 100%; border: none; border-radius: 14px; padding: 1rem;
//       font-weight: 800; font-size: 0.95rem; cursor: pointer;
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%);
//       background-size: 300% 300%;
//       color: #fff;
//       box-shadow: 0 6px 24px rgba(0,212,170,0.4);
//       transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
//       display: flex; align-items: center; justify-content: center; gap: 0.6rem;
//       animation: shimmerBtn 4s linear infinite;
//     }
//     .login-submit-btn:hover:not(:disabled) {
//       transform: translateY(-3px) scale(1.02);
//       box-shadow: 0 12px 36px rgba(0,212,170,0.55);
//     }
//     .login-submit-btn:active:not(:disabled) { transform: scale(0.97); }
//     .login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

//     input::placeholder { color: rgba(240,244,255,0.22); }
//     input:-webkit-autofill {
//       -webkit-box-shadow: 0 0 0 100px rgba(5,6,15,0.9) inset !important;
//       -webkit-text-fill-color: rgba(240,244,255,0.9) !important;
//     }

//     @media (max-width: 767px) {
//       .login-left-panel { display: none !important; }
//       .login-right-panel { width: 100% !important; max-width: 100% !important; padding: 2rem 1.2rem !important; }
//     }
//   `;

//   return (
//     <div style={{ minHeight: '100vh', background: '#05060f', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
//       <style>{CSS}</style>

//       {/* Background orbs */}
//       <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
//         {[
//           { w: 600, h: 600, color: '#00d4aa33', top: '-180px', left: '-180px', delay: '0s' },
//           { w: 550, h: 550, color: '#0ea5e944', top: '35%', right: '-160px', delay: '-5s' },
//           { w: 400, h: 400, color: '#06b6d42a', bottom: '-120px', left: '25%', delay: '-9s' },
//           { w: 320, h: 320, color: '#0891b233', top: '60%', left: '50%', delay: '-6s' },
//         ].map((o, i) => (
//           <div key={i} style={{
//             position: 'absolute', borderRadius: '50%', width: o.w, height: o.h,
//             background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
//             filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom,
//             animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay,
//           }} />
//         ))}
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
//       </div>

//       <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

//         {/* LEFT PANEL */}
//         <div className="login-left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
//           <ParticleCanvas />
//           <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.7s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, padding: '8px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, backdropFilter: 'blur(10px)' }}>
//               <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite', flexShrink: 0 }} />
//               <span style={{ color: 'rgba(240,244,255,0.55)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sri Lanka's #1 Student Platform</span>
//             </div>
//             <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '2.6rem', lineHeight: 1.18, letterSpacing: '-0.025em', color: '#f0f4ff', maxWidth: 380, marginBottom: 14 }}>
//               Find your{' '}
//               <span style={{ background: 'linear-gradient(135deg, #00d4aa, #2de2e6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>perfect home</span>{' '}
//               away from home
//             </h1>
//             <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
//               Access your account and continue finding the perfect boarding in Sri Lanka.
//             </p>
//             <HouseCard3D />
//             <div style={{ marginTop: 28, padding: '12px 22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
//               <span style={{ color: 'rgba(240,244,255,0.55)', fontSize: '0.82rem', fontWeight: 600 }}>🎓 Trusted by thousands of students across Sri Lanka</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="login-right-panel" style={{ width: '100%', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', background: 'rgba(255,255,255,0.025)', borderLeft: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', position: 'relative' }}>
//           <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)', pointerEvents: 'none' }} />
//           <div style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)', pointerEvents: 'none' }} />

//           <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>

//             {/* Tab switcher */}
//             <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 13, padding: 4, marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
//               <div style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 800, background: 'linear-gradient(135deg, #00d4aa, #2de2e6)', color: '#05060f' }}>Sign In</div>
//               <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(240,244,255,0.5)', transition: 'all 0.2s' }}>Create Account</Link>
//             </div>

//             {/* Heading */}
//             <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
//               <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#f0f4ff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Welcome back ✨</h2>
//               <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6 }}>Access your BoardingFinder account</p>
//             </div>

//             {/* ── BANNED ALERT ── */}
//             {isBanned && <BannedAlert email={form.email} />}

//             {/* ── NORMAL ERROR ── */}
//             {error && !isBanned && (
//               <div style={{ background: 'rgba(248,113,113,0.08)', color: '#fca5a5', padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeUp 0.3s ease' }}>
//                 <FiAlertTriangle size={15} /> {error}
//               </div>
//             )}

//             {/* Form — hide when banned */}
//             {!isBanned && (
//               <form onSubmit={handleSubmit}>
//                 <div className="login-field" style={{ marginBottom: '1.1rem' }}>
//                   <label style={labelStyle}>Email Address</label>
//                   <div style={inputWrapStyle('email')}>
//                     <span style={iconStyle}><FiMail size={16} /></span>
//                     <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required style={inputStyle} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
//                   </div>
//                 </div>

//                 <div className="login-field" style={{ marginBottom: '1.8rem' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
//                     <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
//                     <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#00d4aa', fontWeight: 700, textDecoration: 'none', opacity: 0.85 }}>Forgot password?</Link>
//                   </div>
//                   <div style={inputWrapStyle('password')}>
//                     <span style={iconStyle}><FiLock size={16} /></span>
//                     <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required style={inputStyle} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
//                     <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', padding: '0 0.9rem', cursor: 'pointer', color: 'rgba(240,244,255,0.3)', display: 'flex', alignItems: 'center' }}>
//                       {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 <button type="submit" disabled={loading || success} className="login-submit-btn">
//                   {success ? '✅ Welcome back!' : loading ? '⏳ Signing in...' : <><FiLogIn size={17} /> Sign In</>}
//                 </button>
//               </form>
//             )}

//             {/* If banned — show try different account link */}
//             {isBanned && (
//               <button onClick={() => { setIsBanned(false); setForm({ email: '', password: '' }); }} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem', color: 'rgba(220,233,255,0.45)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
//                 onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
//                 onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.04)'}>
//                 ← Try a different account
//               </button>
//             )}

//             <div style={{ marginTop: '1.8rem', textAlign: 'center', color: 'rgba(240,244,255,0.4)', fontSize: '0.88rem', animation: 'fadeUp 0.5s ease 0.4s both' }}>
//               New here?{' '}
//               <Link to="/register" style={{ color: '#00d4aa', fontWeight: 800, textDecoration: 'none' }}>Create Account →</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiSlash, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';
import api from '../api/axios';

/* ─── Theme tokens ─── */
const getTokens = (isDark) => isDark ? {
  pageBg: '#05060f',
  pageColor: '#dce9ff',
  gridLine: 'rgba(255,255,255,.025)',
  orbColors: [
    { w: 600, h: 600, color: '#00d4aa33', top: '-180px', left: '-180px', delay: '0s' },
    { w: 550, h: 550, color: '#0ea5e944', top: '35%', right: '-160px', delay: '-5s' },
    { w: 400, h: 400, color: '#06b6d42a', bottom: '-120px', left: '25%', delay: '-9s' },
    { w: 320, h: 320, color: '#0891b233', top: '60%', left: '50%', delay: '-6s' },
  ],
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
  leftPillBg: 'rgba(255,255,255,0.04)',
  leftPillBorder: 'rgba(255,255,255,0.08)',
  leftPillColor: 'rgba(240,244,255,0.55)',
  leftDot: '#00d4aa',
  leftH1Color: '#f0f4ff',
  leftSubColor: 'rgba(240,244,255,0.4)',
  leftBadgeBg: 'rgba(255,255,255,0.04)',
  leftBadgeBorder: 'rgba(255,255,255,0.08)',
  leftBadgeColor: 'rgba(240,244,255,0.55)',
  leftGradText: 'linear-gradient(135deg, #00d4aa, #2de2e6, #0ea5e9)',
  card3dBg: 'linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
  card3dBorder: 'rgba(255,255,255,0.13)',
  card3dShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(0,212,170,0.15)',
  card3dStatBg: 'rgba(255,255,255,0.05)',
  card3dStatBorder: 'rgba(255,255,255,0.09)',
  card3dSubColor: 'rgba(240,244,255,0.45)',
  card3dStatLabelColor: 'rgba(240,244,255,0.4)',
  rightPanelBg: 'rgba(255,255,255,0.025)',
  rightPanelBorder: 'rgba(255,255,255,0.07)',
  rightGlowTL: 'rgba(0,212,170,0.1)',
  rightGlowBR: 'rgba(14,165,233,0.08)',
  tabBg: 'rgba(255,255,255,0.05)',
  tabBorder: 'rgba(255,255,255,0.08)',
  tabActiveGrad: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
  tabActiveColor: '#05060f',
  tabInactiveColor: 'rgba(240,244,255,0.5)',
  headingColor: '#f0f4ff',
  subColor: 'rgba(240,244,255,0.45)',
  inputBorderNormal: 'rgba(255,255,255,0.1)',
  inputBorderFocused: 'rgba(0,212,170,0.6)',
  inputBgNormal: 'rgba(255,255,255,0.04)',
  inputBgFocused: 'rgba(0,212,170,0.04)',
  inputShadowFocused: '0 0 0 3px rgba(0,212,170,0.12), 0 4px 20px rgba(0,0,0,0.2)',
  inputShadowNormal: '0 2px 8px rgba(0,0,0,0.15)',
  inputColor: 'rgba(240,244,255,0.9)',
  inputIconColor: 'rgba(0,212,170,0.7)',
  inputIconBorder: 'rgba(255,255,255,0.07)',
  labelColor: 'rgba(240,244,255,0.45)',
  forgotColor: '#00d4aa',
  pwToggleColor: 'rgba(240,244,255,0.3)',
  submitBtnBg: 'linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%)',
  submitBtnShadow: '0 6px 24px rgba(0,212,170,0.4)',
  submitBtnHoverShadow: '0 12px 36px rgba(0,212,170,0.55)',
  submitBtnColor: '#fff',
  errorBg: 'rgba(248,113,113,0.08)',
  errorColor: '#fca5a5',
  errorBorder: 'rgba(248,113,113,0.2)',
  linkColor: '#00d4aa',
  footerColor: 'rgba(240,244,255,0.4)',
  tryDiffBg: 'rgba(255,255,255,0.04)',
  tryDiffBorder: 'rgba(255,255,255,0.1)',
  tryDiffColor: 'rgba(220,233,255,0.45)',
  tryDiffHoverBg: 'rgba(255,255,255,0.08)',
  autofillBg: 'rgba(5,6,15,0.9)',
  autofillColor: 'rgba(240,244,255,0.9)',
  placeholderColor: 'rgba(240,244,255,0.22)',
} : {
  pageBg: '#f0f4ff',
  pageColor: '#0f1c3f',
  gridLine: 'rgba(0,0,0,.015)',
  orbColors: [
    { w: 600, h: 600, color: '#0070c022', top: '-180px', left: '-180px', delay: '0s' },
    { w: 550, h: 550, color: '#0ea5e922', top: '35%', right: '-160px', delay: '-5s' },
    { w: 400, h: 400, color: '#06b6d415', bottom: '-120px', left: '25%', delay: '-9s' },
    { w: 320, h: 320, color: '#0891b218', top: '60%', left: '50%', delay: '-6s' },
  ],
  particleColors: ['#0ea5e9', '#06b6d4', '#0070c0', '#00b4d8', '#0891b2'],
  leftPillBg: 'rgba(0,112,192,0.07)',
  leftPillBorder: 'rgba(0,112,192,0.15)',
  leftPillColor: 'rgba(0,60,130,0.6)',
  leftDot: '#0070c0',
  leftH1Color: '#0f1c3f',
  leftSubColor: 'rgba(30,60,130,0.5)',
  leftBadgeBg: 'rgba(0,112,192,0.06)',
  leftBadgeBorder: 'rgba(0,112,192,0.14)',
  leftBadgeColor: 'rgba(0,60,130,0.55)',
  leftGradText: 'linear-gradient(135deg, #0070c0, #00b4d8, #0ea5e9)',
  card3dBg: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(240,248,255,0.7))',
  card3dBorder: 'rgba(0,112,192,0.15)',
  card3dShadow: '0 40px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(0,112,192,0.1)',
  card3dStatBg: 'rgba(0,112,192,0.06)',
  card3dStatBorder: 'rgba(0,112,192,0.12)',
  card3dSubColor: 'rgba(30,60,130,0.5)',
  card3dStatLabelColor: 'rgba(30,60,130,0.45)',
  rightPanelBg: 'rgba(255,255,255,0.75)',
  rightPanelBorder: 'rgba(0,0,0,0.08)',
  rightGlowTL: 'rgba(0,112,192,0.08)',
  rightGlowBR: 'rgba(14,165,233,0.06)',
  tabBg: 'rgba(0,0,0,0.04)',
  tabBorder: 'rgba(0,0,0,0.08)',
  tabActiveGrad: 'linear-gradient(135deg, #0070c0, #00b4d8)',
  tabActiveColor: '#fff',
  tabInactiveColor: 'rgba(30,60,130,0.5)',
  headingColor: '#0f1c3f',
  subColor: 'rgba(30,60,130,0.5)',
  inputBorderNormal: 'rgba(0,0,0,0.12)',
  inputBorderFocused: 'rgba(0,112,192,0.6)',
  inputBgNormal: 'rgba(255,255,255,0.8)',
  inputBgFocused: 'rgba(0,112,192,0.04)',
  inputShadowFocused: '0 0 0 3px rgba(0,112,192,0.12), 0 4px 20px rgba(0,0,0,0.06)',
  inputShadowNormal: '0 2px 8px rgba(0,0,0,0.06)',
  inputColor: '#0f1c3f',
  inputIconColor: '#0070c0',
  inputIconBorder: 'rgba(0,0,0,0.08)',
  labelColor: 'rgba(30,60,130,0.5)',
  forgotColor: '#0070c0',
  pwToggleColor: 'rgba(30,60,130,0.35)',
  submitBtnBg: 'linear-gradient(135deg, #0070c0 0%, #00b4d8 40%, #0ea5e9 80%)',
  submitBtnShadow: '0 6px 24px rgba(0,112,192,0.3)',
  submitBtnHoverShadow: '0 12px 36px rgba(0,112,192,0.45)',
  submitBtnColor: '#fff',
  errorBg: 'rgba(239,68,68,0.08)',
  errorColor: '#dc2626',
  errorBorder: 'rgba(239,68,68,0.2)',
  linkColor: '#0070c0',
  footerColor: 'rgba(30,60,130,0.45)',
  tryDiffBg: 'rgba(0,0,0,0.04)',
  tryDiffBorder: 'rgba(0,0,0,0.1)',
  tryDiffColor: 'rgba(30,60,130,0.5)',
  tryDiffHoverBg: 'rgba(0,0,0,0.08)',
  autofillBg: 'rgba(240,246,255,0.95)',
  autofillColor: '#0f1c3f',
  placeholderColor: 'rgba(30,60,130,0.25)',
};

/* ─── Dynamic CSS ─── */
const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes houseFloat {
    0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
    50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
  }
  @keyframes emojiGlow {
    0%,100% { filter: drop-shadow(0 12px 32px rgba(0,212,170,0.55)); }
    50%      { filter: drop-shadow(0 12px 32px rgba(14,165,233,0.65)); }
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
  @keyframes banSlideIn {
    0%   { opacity: 0; transform: translateY(-20px) scale(0.96); }
    60%  { transform: translateY(4px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes banPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); }
    50%      { box-shadow: 0 0 0 8px rgba(248,113,113,0.08); }
  }
  @keyframes glowBar { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
  @keyframes iconSpin {
    0%   { transform: rotate(0deg) scale(1); }
    25%  { transform: rotate(-15deg) scale(1.15); }
    75%  { transform: rotate(15deg) scale(1.15); }
    100% { transform: rotate(0deg) scale(1); }
  }
  @keyframes ringPulse {
    0%,100% { transform: scale(1); opacity: 0.4; }
    50%      { transform: scale(1.3); opacity: 0; }
  }
  @keyframes dotBlink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes contactBtnShimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .banned-alert-card {
    position: relative;
    background: linear-gradient(135deg, rgba(239,68,68,0.07), rgba(220,38,38,0.04));
    border: 1.5px solid rgba(248,113,113,0.3);
    border-radius: 20px; padding: 1.8rem 1.6rem;
    margin-bottom: 1.5rem; overflow: hidden;
    animation: banSlideIn 0.5s cubic-bezier(.34,1.56,.64,1) both, banPulse 3s ease-in-out infinite;
    text-align: center;
  }
  .banned-glow-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #f87171, #fca5a5, #f87171, transparent);
    animation: glowBar 2s ease-in-out infinite;
  }
  .banned-icon-wrap {
    position: relative; width: 64px; height: 64px;
    background: rgba(239,68,68,0.1); border: 1.5px solid rgba(248,113,113,0.3);
    border-radius: 18px; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.1rem; animation: iconSpin 4s ease-in-out infinite;
  }
  .banned-icon-ring {
    position: absolute; inset: -6px; border-radius: 22px;
    border: 1.5px solid rgba(248,113,113,0.25);
    animation: ringPulse 2s ease-in-out infinite;
  }
  .banned-title { font-family: 'Cabinet Grotesk', sans-serif; font-weight: 800; font-size: 1.2rem; color: #fca5a5; margin: 0 0 0.6rem; letter-spacing: -0.01em; }
  .banned-msg { font-size: 0.875rem; color: rgba(220,233,255,0.5); line-height: 1.65; margin: 0 0 1.1rem; }
  .banned-info-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1.2rem; text-align: left; }
  .banned-info-row { display: flex; align-items: center; gap: 10px; padding: 0.35rem 0; font-size: 0.8rem; color: rgba(180,210,255,0.55); font-family: 'Plus Jakarta Sans', sans-serif; }
  .banned-info-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; animation: dotBlink 2s ease-in-out infinite; }
  .banned-contact-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; padding: 0.85rem 1.2rem; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #ef4444 0%, #f87171 40%, #fca5a5 70%, #f87171 100%);
    background-size: 300% 300%; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.9rem;
    cursor: pointer; text-decoration: none;
    box-shadow: 0 6px 20px rgba(239,68,68,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    animation: contactBtnShimmer 4s linear infinite; margin-bottom: 0.8rem;
  }
  .banned-contact-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 30px rgba(239,68,68,0.5); color: #fff; text-decoration: none; }
  .banned-footer-note { font-size: 0.74rem; color: rgba(220,233,255,0.28); margin: 0; line-height: 1.5; }

  .login-field { animation: fadeUp 0.5s ease both; }
  .login-field:nth-child(1) { animation-delay: 0.1s; }
  .login-field:nth-child(2) { animation-delay: 0.2s; }

  .login-submit-btn {
    width: 100%; border: none; border-radius: 14px; padding: 1rem;
    font-weight: 800; font-size: 0.95rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${t.submitBtnBg};
    background-size: 300% 300%;
    color: ${t.submitBtnColor};
    box-shadow: ${t.submitBtnShadow};
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    animation: shimmerBtn 4s linear infinite;
  }
  .login-submit-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: ${t.submitBtnHoverShadow}; }
  .login-submit-btn:active:not(:disabled) { transform: scale(0.97); }
  .login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  input::placeholder { color: ${t.placeholderColor}; }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px ${t.autofillBg} inset !important;
    -webkit-text-fill-color: ${t.autofillColor} !important;
  }

  @media (max-width: 767px) {
    .login-left-panel { display: none !important; }
    .login-right-panel { width: 100% !important; max-width: 100% !important; padding: 2rem 1.2rem !important; }
  }
`;

/* ─── Particle Canvas ─── */
const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45, vy: -Math.random() * 0.65 - 0.25,
      alpha: Math.random() * 0.55 + 0.2,
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

/* ─── 3D House Card ─── */
const HouseCard3D = ({ t }) => {
  const cardRef = useRef(null);
  const handleMove = useCallback((e) => {
    const card = cardRef.current; if (!card) return;
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    card.style.animation = 'none';
    card.style.transform = `rotateX(${(e.clientY - cy) / 20}deg) rotateY(${-(e.clientX - cx) / 20}deg) translateY(0)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.animation = 'houseFloat 6s ease-in-out infinite';
  }, []);
  return (
    <div style={{ perspective: '1000px' }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div ref={cardRef} style={{
        width: 320, borderRadius: 26,
        background: t.card3dBg, border: `1px solid ${t.card3dBorder}`,
        backdropFilter: 'blur(20px)', boxShadow: t.card3dShadow,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '36px 32px 32px', animation: 'houseFloat 6s ease-in-out infinite',
        transformStyle: 'preserve-3d', cursor: 'pointer', transition: 'transform 0.12s ease',
      }}>
        <div style={{ fontSize: '5.8rem', marginBottom: 14, filter: 'drop-shadow(0 12px 32px rgba(0,212,170,0.55))', animation: 'emojiGlow 4s ease-in-out infinite', lineHeight: 1 }}>🏠</div>
        <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.25rem', textAlign: 'center', marginBottom: 8, background: t.leftGradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Find Your Perfect Room</h3>
        <p style={{ fontSize: '0.85rem', color: t.card3dSubColor, textAlign: 'center', lineHeight: 1.6, marginBottom: 26 }}>Sri Lanka's trusted boarding platform for students</p>
        <div style={{ display: 'flex', gap: 14, width: '100%' }}>
          {[['2K+', 'Rooms'], ['24/7', 'Support'], ['Verified', 'Listings']].map(([n, l]) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', background: t.card3dStatBg, border: `1px solid ${t.card3dStatBorder}`, borderRadius: 14 }}>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.05rem', background: t.leftGradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
              <div style={{ fontSize: '0.68rem', color: t.card3dStatLabelColor, marginTop: 3, fontWeight: 600, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Banned Alert ─── */
const BannedAlert = ({ email }) => {
  const subject = encodeURIComponent('Account Ban Appeal - BoardingFinder');
  const body = encodeURIComponent(`Hello BoardingFinder Admin,\n\nMy account has been banned and I would like to appeal this decision.\n\nAccount Email: ${email}\n\nReason for appeal:\n[Please describe why you believe your account should be reinstated]\n\nThank you.`);
  return (
    <div className="banned-alert-card">
      <div className="banned-glow-bar" />
      <div className="banned-icon-wrap">
        <div className="banned-icon-ring" />
        <FiSlash size={28} color="#f87171" strokeWidth={2.5} />
      </div>
      <h3 className="banned-title">Account Suspended 🚫</h3>
      <p className="banned-msg">Your account has been <strong style={{ color: '#f87171' }}>suspended</strong> by an administrator. You cannot sign in at this time.</p>
      <div className="banned-info-box">
        {[['#f87171','Access to all features has been restricted'],['#fbbf24','You can appeal this decision via email'],['#00d4aa','Admin will review your appeal within 24–48 hrs']].map(([c,t],i) => (
          <div key={i} className="banned-info-row"><span className="banned-info-dot" style={{ background: c }} /><span>{t}</span></div>
        ))}
      </div>
      <a href={`mailto:admin@boardingfinder.lk?subject=${subject}&body=${body}`} className="banned-contact-btn">
        <FiMail size={16} /> Contact Admin to Appeal <FiExternalLink size={13} style={{ opacity: 0.7 }} />
      </a>
      <p className="banned-footer-note">📧 This will open your email app with a pre-filled appeal message to <strong style={{ color: 'rgba(220,233,255,0.6)' }}>admin@boardingfinder.lk</strong></p>
    </div>
  );
};

/* ─── Login ─── */
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setIsBanned(false);
    try {
      const res = await api.post('/auth/login', form);
      setSuccess(true);
      setTimeout(() => { login(res.data.user, res.data.token); navigate('/'); }, 700);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      if (err.response?.status === 403 || msg.toLowerCase().includes('banned')) setIsBanned(true);
      else setError(msg);
    } finally { setLoading(false); }
  };

  const inputWrapStyle = (field) => ({
    display: 'flex', alignItems: 'center',
    border: `1.5px solid ${focused === field ? t.inputBorderFocused : t.inputBorderNormal}`,
    borderRadius: 13,
    background: focused === field ? t.inputBgFocused : t.inputBgNormal,
    overflow: 'hidden', transition: 'all 0.25s ease',
    boxShadow: focused === field ? t.inputShadowFocused : t.inputShadowNormal,
  });

  const inputStyle = { border: 'none', outline: 'none', flex: 1, padding: '0.9rem 1rem', fontSize: '0.92rem', background: 'transparent', color: t.inputColor, fontFamily: "'Plus Jakarta Sans', sans-serif" };
  const iconStyle = { padding: '0 0.85rem', color: t.inputIconColor, display: 'flex', alignItems: 'center', borderRight: `1px solid ${t.inputIconBorder}` };
  const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: t.labelColor, marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, color: t.pageColor, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
      <style>{getCSS(t)}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

        {/* LEFT PANEL */}
        <div className="login-left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
          <ParticleCanvas colors={t.particleColors} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.7s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, padding: '8px 18px', background: t.leftPillBg, border: `1px solid ${t.leftPillBorder}`, borderRadius: 99, backdropFilter: 'blur(10px)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.leftDot, boxShadow: `0 0 8px ${t.leftDot}`, display: 'inline-block', animation: 'blink 2s infinite', flexShrink: 0 }} />
              <span style={{ color: t.leftPillColor, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sri Lanka's #1 Student Platform</span>
            </div>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '2.6rem', lineHeight: 1.18, letterSpacing: '-0.025em', color: t.leftH1Color, maxWidth: 380, marginBottom: 14 }}>
              Find your{' '}
              <span style={{ background: t.leftGradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>perfect home</span>{' '}
              away from home
            </h1>
            <p style={{ color: t.leftSubColor, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
              Access your account and continue finding the perfect boarding in Sri Lanka.
            </p>
            <HouseCard3D t={t} />
            <div style={{ marginTop: 28, padding: '12px 22px', background: t.leftBadgeBg, border: `1px solid ${t.leftBadgeBorder}`, borderRadius: 16, backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: t.leftBadgeColor, fontSize: '0.82rem', fontWeight: 600 }}>🎓 Trusted by thousands of students across Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right-panel" style={{ width: '100%', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', background: t.rightPanelBg, borderLeft: `1px solid ${t.rightPanelBorder}`, backdropFilter: 'blur(12px)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, ${t.rightGlowTL}, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 200, background: `radial-gradient(circle, ${t.rightGlowBR}, transparent 70%)`, pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: t.tabBg, border: `1px solid ${t.tabBorder}`, borderRadius: 13, padding: 4, marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 800, background: t.tabActiveGrad, color: t.tabActiveColor }}>Sign In</div>
              <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, color: t.tabInactiveColor, transition: 'all 0.2s' }}>Create Account</Link>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
              <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '2rem', color: t.headingColor, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Welcome back ✨</h2>
              <p style={{ color: t.subColor, fontSize: '0.9rem', lineHeight: 1.6 }}>Access your BoardingFinder account</p>
            </div>

            {isBanned && <BannedAlert email={form.email} />}

            {error && !isBanned && (
              <div style={{ background: t.errorBg, color: t.errorColor, padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.85rem', marginBottom: '1.5rem', border: `1px solid ${t.errorBorder}`, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeUp 0.3s ease' }}>
                <FiAlertTriangle size={15} /> {error}
              </div>
            )}

            {!isBanned && (
              <form onSubmit={handleSubmit}>
                <div className="login-field" style={{ marginBottom: '1.1rem' }}>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapStyle('email')}>
                    <span style={iconStyle}><FiMail size={16} /></span>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required style={inputStyle} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
                  </div>
                </div>

                <div className="login-field" style={{ marginBottom: '1.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: t.forgotColor, fontWeight: 700, textDecoration: 'none', opacity: 0.85 }}>Forgot password?</Link>
                  </div>
                  <div style={inputWrapStyle('password')}>
                    <span style={iconStyle}><FiLock size={16} /></span>
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required style={inputStyle} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', padding: '0 0.9rem', cursor: 'pointer', color: t.pwToggleColor, display: 'flex', alignItems: 'center' }}>
                      {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading || success} className="login-submit-btn">
                  {success ? '✅ Welcome back!' : loading ? '⏳ Signing in...' : <><FiLogIn size={17} /> Sign In</>}
                </button>
              </form>
            )}

            {isBanned && (
              <button onClick={() => { setIsBanned(false); setForm({ email: '', password: '' }); }}
                style={{ width: '100%', background: t.tryDiffBg, border: `1px solid ${t.tryDiffBorder}`, borderRadius: 12, padding: '0.75rem', color: t.tryDiffColor, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
                onMouseEnter={e => e.target.style.background = t.tryDiffHoverBg}
                onMouseLeave={e => e.target.style.background = t.tryDiffBg}>
                ← Try a different account
              </button>
            )}

            <div style={{ marginTop: '1.8rem', textAlign: 'center', color: t.footerColor, fontSize: '0.88rem', animation: 'fadeUp 0.5s ease 0.4s both' }}>
              New here?{' '}
              <Link to="/register" style={{ color: t.linkColor, fontWeight: 800, textDecoration: 'none' }}>Create Account →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;