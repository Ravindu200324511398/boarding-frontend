
// import React, { useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FiLock, FiArrowLeft } from 'react-icons/fi';

// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

//   @keyframes orbFloat {
//     0%,100% { transform: translate(0,0) scale(1); }
//     33%      { transform: translate(40px,-50px) scale(1.07); }
//     66%      { transform: translate(-25px,30px) scale(0.95); }
//   }
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(24px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes shimmerBtn {
//     0%   { background-position: 200% center; }
//     100% { background-position: -200% center; }
//   }
//   @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
//   @keyframes lockBounce {
//     0%,100% { transform: translateY(0) rotate(-4deg); }
//     50%     { transform: translateY(-12px) rotate(4deg); }
//   }

//   .pr-btn-primary {
//     border: none; border-radius: 14px; padding: 1rem 2.2rem;
//     font-weight: 800; font-size: 1rem; cursor: pointer;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
//     background-size: 300% 300%;
//     color: #fff;
//     box-shadow: 0 6px 24px rgba(0,212,170,0.4);
//     transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
//     display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
//     animation: shimmerBtn 5s linear infinite;
//     width: 100%;
//   }
//   .pr-btn-primary:hover {
//     transform: translateY(-3px) scale(1.02);
//     box-shadow: 0 12px 36px rgba(0,212,170,0.55);
//   }

//   .pr-btn-secondary {
//     width: 100%; padding: 0.95rem;
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.12);
//     border-radius: 14px;
//     color: rgba(220,233,255,0.7);
//     font-weight: 700; font-size: 0.95rem;
//     cursor: pointer;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
//     transition: all 0.2s;
//   }
//   .pr-btn-secondary:hover {
//     background: rgba(255,255,255,0.1);
//     color: #dce9ff;
//   }

//   .pr-back-btn {
//     background: rgba(255,255,255,0.07);
//     border: 1px solid rgba(255,255,255,0.12);
//     color: rgba(220,233,255,0.6);
//     border-radius: 11px; padding: 0.5rem 1.1rem;
//     cursor: pointer;
//     display: inline-flex; align-items: center; gap: 0.5rem;
//     font-size: 0.85rem; font-weight: 600;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     transition: all 0.2s;
//   }
//   .pr-back-btn:hover {
//     background: rgba(255,255,255,0.13);
//     color: #dce9ff;
//   }

//   .pr-feature-item {
//     display: flex; align-items: center; gap: 10px;
//     padding: 0.55rem 0;
//     color: rgba(180,210,255,0.6);
//     font-size: 0.88rem; font-weight: 500;
//   }
//   .pr-feature-item span.dot {
//     width: 6px; height: 6px; border-radius: 50%;
//     background: #00d4aa;
//     box-shadow: 0 0 6px #00d4aa;
//     flex-shrink: 0;
//     animation: blink 2.5s ease-in-out infinite;
//   }
// `;

// const ParticleCanvas = () => {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     let animId;
//     const resize = () => {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//     };
//     resize();
//     window.addEventListener('resize', resize);

//     const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
//     const particles = Array.from({ length: 55 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 2 + 0.4,
//       color: colors[Math.floor(Math.random() * colors.length)],
//       vx: (Math.random() - 0.5) * 0.4,
//       vy: -Math.random() * 0.6 - 0.2,
//       alpha: Math.random() * 0.5 + 0.15,
//     }));

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach(p => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
//         ctx.shadowColor = p.color;
//         ctx.shadowBlur = 8;
//         ctx.fill();
//         p.x += p.vx;
//         p.y += p.vy;
//         if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
//         if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
//       });
//       animId = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => {
//       cancelAnimationFrame(animId);
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'absolute', inset: 0,
//         width: '100%', height: '100%',
//         pointerEvents: 'none', zIndex: 1,
//       }}
//     />
//   );
// };

// const ProtectedRoute = ({ children }) => {
//   const { isAuth } = useAuth();
//   const navigate = useNavigate();

//   if (isAuth) return children;

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(160deg, #060f2a 0%, #091428 50%, #071a1f 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       fontFamily: "'Plus Jakarta Sans', sans-serif",
//       position: 'relative', overflow: 'hidden',
//       padding: '2rem 1rem',
//     }}>
//       <style>{CSS}</style>

//       {/* Particle canvas */}
//       <ParticleCanvas />

//       {/* Orbs */}
//       <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
//         {[
//           { w: 700, h: 700, color: '#00d4aa1a', top: '-200px', left: '-200px', delay: '0s' },
//           { w: 600, h: 600, color: '#0ea5e92a', top: '30%', right: '-180px', delay: '-5s' },
//           { w: 500, h: 500, color: '#06b6d41a', bottom: '-150px', left: '20%', delay: '-9s' },
//           { w: 350, h: 350, color: '#2de2e615', top: '60%', left: '55%', delay: '-7s' },
//         ].map((o, i) => (
//           <div key={i} style={{
//             position: 'absolute', borderRadius: '50%',
//             width: o.w, height: o.h,
//             background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
//             filter: 'blur(80px)',
//             top: o.top, left: o.left, right: o.right, bottom: o.bottom,
//             animation: 'orbFloat 16s ease-in-out infinite',
//             animationDelay: o.delay,
//           }} />
//         ))}
//         {/* Grid */}
//         <div style={{
//           position: 'absolute', inset: 0,
//           backgroundImage: 'linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)',
//           backgroundSize: '60px 60px',
//         }} />
//       </div>

//       {/* Card */}
//       <div style={{
//         position: 'relative', zIndex: 2,
//         background: 'rgba(255,255,255,0.04)',
//         backdropFilter: 'blur(24px)',
//         border: '1px solid rgba(0,212,170,0.2)',
//         borderRadius: 32,
//         padding: '3rem 2.6rem',
//         width: '100%', maxWidth: 460,
//         boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.06)',
//         animation: 'fadeUp 0.6s ease',
//         textAlign: 'center',
//       }}>

//         {/* Back button */}
//         <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
//           <button className="pr-back-btn" onClick={() => navigate(-1)}>
//             <FiArrowLeft size={15} /> Go Back
//           </button>
//         </div>

//         {/* Lock icon */}
//         <div style={{
//           width: 88, height: 88,
//           background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(14,165,233,0.08))',
//           border: '1px solid rgba(0,212,170,0.25)',
//           borderRadius: 26,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           margin: '0 auto 1.8rem',
//           boxShadow: '0 0 40px rgba(0,212,170,0.15)',
//           animation: 'lockBounce 3s ease-in-out infinite',
//         }}>
//           <FiLock size={36} color="#00d4aa" strokeWidth={1.8} />
//         </div>

//         {/* Badge */}
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 8,
//           background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
//           borderRadius: 99, padding: '5px 16px', marginBottom: '1.4rem',
//         }}>
//           <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 6px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
//           <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>Members Only Area</span>
//         </div>

//         <h2 style={{
//           fontFamily: "'Cabinet Grotesk', sans-serif",
//           fontWeight: 900, fontSize: '2rem', color: '#dce9ff',
//           marginBottom: '0.8rem', lineHeight: 1.15,
//         }}>
//           Login Required
//         </h2>

//         <p style={{
//           color: 'rgba(180,210,255,0.55)',
//           fontSize: '0.95rem', lineHeight: 1.7,
//           marginBottom: '2rem',
//         }}>
//           This page is only available to registered members. Sign in to access full listings, contact owners, explore the map, and compare properties.
//         </p>

//         {/* Feature list */}
//         <div style={{
//           background: 'rgba(255,255,255,0.03)',
//           border: '1px solid rgba(255,255,255,0.07)',
//           borderRadius: 16, padding: '1.1rem 1.4rem',
//           marginBottom: '2rem', textAlign: 'left',
//         }}>
//           {[
//             'View full listing details & photos',
//             'See pricing & contact information',
//             'Explore the interactive map',
//             'Compare properties side by side',
//             'Save favourites & send inquiries',
//           ].map((f, i) => (
//             <div key={i} className="pr-feature-item" style={{ animationDelay: `${i * 0.1}s` }}>
//               <span className="dot" />
//               {f}
//             </div>
//           ))}
//         </div>

//         {/* Action buttons */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//           <button className="pr-btn-primary" onClick={() => navigate('/login')}>
//             Sign In to Continue →
//           </button>
//           <button className="pr-btn-secondary" onClick={() => navigate('/register')}>
//             Create Free Account
//           </button>
//         </div>

//         <p style={{ marginTop: '1.3rem', fontSize: '0.74rem', color: 'rgba(180,210,255,0.28)' }}>
//           Free forever • No credit card required
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ProtectedRoute;

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';
import { FiLock, FiArrowLeft } from 'react-icons/fi';

/* ─── Theme tokens (mirrors Home.jsx getTokens exactly) ─── */
const getTokens = (isDark) => isDark ? {
  pageBg: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)',
  pageColor: '#dce9ff',

  heroBadgeBg: 'rgba(0,212,170,0.08)',
  heroBadgeBorder: 'rgba(0,212,170,0.2)',
  heroBadgeColor: 'rgba(180,230,220,0.75)',
  heroDotColor: '#00d4aa',
  heroDotShadow: '#00d4aa',

  shimmerFrom: '#00d4aa',
  shimmerVia: '#2de2e6',
  shimmerTo: '#0ea5e9',

  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(0,212,170,0.2)',
  cardShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.06)',

  backBtnBg: 'rgba(255,255,255,0.07)',
  backBtnBorder: 'rgba(255,255,255,0.12)',
  backBtnColor: 'rgba(220,233,255,0.6)',
  backBtnHoverBg: 'rgba(255,255,255,0.13)',
  backBtnHoverColor: '#dce9ff',

  iconBg: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(14,165,233,0.08))',
  iconBorder: 'rgba(0,212,170,0.25)',
  iconShadow: '0 0 40px rgba(0,212,170,0.15)',
  iconColor: '#00d4aa',

  badgeBg: 'rgba(0,212,170,0.08)',
  badgeBorder: 'rgba(0,212,170,0.2)',
  badgeDot: '#00d4aa',
  badgeDotShadow: '#00d4aa',
  badgeColor: 'rgba(180,230,220,0.75)',

  titleColor: '#dce9ff',
  subColor: 'rgba(180,210,255,0.55)',

  featureBoxBg: 'rgba(255,255,255,0.03)',
  featureBoxBorder: 'rgba(255,255,255,0.07)',
  featureItemColor: 'rgba(180,210,255,0.6)',
  featureDot: '#00d4aa',

  primaryBtnBg: 'linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%)',
  primaryBtnColor: '#fff',
  primaryBtnShadow: '0 6px 24px rgba(0,212,170,0.4)',
  primaryBtnHoverShadow: '0 12px 36px rgba(0,212,170,0.55)',

  secondaryBtnBg: 'rgba(255,255,255,0.05)',
  secondaryBtnBorder: 'rgba(255,255,255,0.12)',
  secondaryBtnColor: 'rgba(220,233,255,0.7)',
  secondaryBtnHoverBg: 'rgba(255,255,255,0.1)',
  secondaryBtnHoverColor: '#dce9ff',

  noteColor: 'rgba(180,210,255,0.28)',

  overlayBg: 'rgba(4,10,30,0.85)',

  orbColors: [
    { color: '#00d4aa1a', top: '-200px', left: '-200px', delay: '0s' },
    { color: '#0ea5e92a', top: '30%', right: '-180px', delay: '-5s' },
    { color: '#06b6d41a', bottom: '-150px', left: '20%', delay: '-9s' },
    { color: '#2de2e615', top: '60%', left: '55%', delay: '-7s' },
  ],
  gridLineColor: 'rgba(255,255,255,.015)',
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
} : {
  pageBg: 'linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 40%, #eaf7fb 100%)',
  pageColor: '#0f1c3f',

  heroBadgeBg: 'rgba(0,112,192,0.08)',
  heroBadgeBorder: 'rgba(0,112,192,0.2)',
  heroBadgeColor: 'rgba(0,60,130,0.7)',
  heroDotColor: '#0070c0',
  heroDotShadow: '#0070c0',

  shimmerFrom: '#0070c0',
  shimmerVia: '#00b4d8',
  shimmerTo: '#0ea5e9',

  cardBg: 'rgba(255,255,255,0.85)',
  cardBorder: 'rgba(0,112,192,0.2)',
  cardShadow: '0 30px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,112,192,0.08)',

  backBtnBg: 'rgba(0,0,0,0.05)',
  backBtnBorder: 'rgba(0,0,0,0.1)',
  backBtnColor: 'rgba(30,60,130,0.55)',
  backBtnHoverBg: 'rgba(0,0,0,0.09)',
  backBtnHoverColor: '#0f1c3f',

  iconBg: 'linear-gradient(135deg, rgba(0,112,192,0.1), rgba(14,165,233,0.08))',
  iconBorder: 'rgba(0,112,192,0.2)',
  iconShadow: '0 0 40px rgba(0,112,192,0.1)',
  iconColor: '#0070c0',

  badgeBg: 'rgba(0,112,192,0.07)',
  badgeBorder: 'rgba(0,112,192,0.18)',
  badgeDot: '#0070c0',
  badgeDotShadow: '#0070c0',
  badgeColor: 'rgba(0,60,130,0.6)',

  titleColor: '#0f1c3f',
  subColor: 'rgba(30,60,130,0.55)',

  featureBoxBg: 'rgba(0,112,192,0.04)',
  featureBoxBorder: 'rgba(0,112,192,0.1)',
  featureItemColor: 'rgba(30,60,130,0.6)',
  featureDot: '#0070c0',

  primaryBtnBg: 'linear-gradient(135deg, #0070c0 0%, #00b4d8 40%, #0ea5e9 80%, #0891b2 100%)',
  primaryBtnColor: '#ffffff',
  primaryBtnShadow: '0 6px 24px rgba(0,112,192,0.3)',
  primaryBtnHoverShadow: '0 12px 36px rgba(0,112,192,0.45)',

  secondaryBtnBg: 'rgba(0,0,0,0.05)',
  secondaryBtnBorder: 'rgba(0,0,0,0.12)',
  secondaryBtnColor: 'rgba(20,50,120,0.7)',
  secondaryBtnHoverBg: 'rgba(0,0,0,0.09)',
  secondaryBtnHoverColor: '#0f1c3f',

  noteColor: 'rgba(30,60,130,0.3)',

  overlayBg: 'rgba(200,210,240,0.7)',

  orbColors: [
    { color: '#0070c022', top: '-200px', left: '-200px', delay: '0s' },
    { color: '#0ea5e922', top: '30%', right: '-180px', delay: '-5s' },
    { color: '#06b6d415', bottom: '-150px', left: '20%', delay: '-9s' },
    { color: '#00b4d810', top: '60%', left: '55%', delay: '-7s' },
  ],
  gridLineColor: 'rgba(0,0,0,.015)',
  particleColors: ['#0ea5e9', '#06b6d4', '#0070c0', '#00b4d8', '#0891b2'],
};

/* ─── Dynamic CSS (theme-aware) ─── */
const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes lockBounce {
    0%,100% { transform: translateY(0) rotate(-4deg); }
    50%     { transform: translateY(-12px) rotate(4deg); }
  }

  .pr-btn-primary {
    border: none; border-radius: 14px; padding: 1rem 2.2rem;
    font-weight: 800; font-size: 1rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${t.primaryBtnBg};
    background-size: 300% 300%;
    color: ${t.primaryBtnColor};
    box-shadow: ${t.primaryBtnShadow};
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
    width: 100%;
  }
  .pr-btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${t.primaryBtnHoverShadow};
  }

  .pr-btn-secondary {
    width: 100%; padding: 0.95rem;
    background: ${t.secondaryBtnBg};
    border: 1px solid ${t.secondaryBtnBorder};
    border-radius: 14px;
    color: ${t.secondaryBtnColor};
    font-weight: 700; font-size: 0.95rem;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.2s;
  }
  .pr-btn-secondary:hover {
    background: ${t.secondaryBtnHoverBg};
    color: ${t.secondaryBtnHoverColor};
  }

  .pr-back-btn {
    background: ${t.backBtnBg};
    border: 1px solid ${t.backBtnBorder};
    color: ${t.backBtnColor};
    border-radius: 11px; padding: 0.5rem 1.1rem;
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s;
  }
  .pr-back-btn:hover {
    background: ${t.backBtnHoverBg};
    color: ${t.backBtnHoverColor};
  }

  .pr-feature-item {
    display: flex; align-items: center; gap: 10px;
    padding: 0.55rem 0;
    color: ${t.featureItemColor};
    font-size: 0.88rem; font-weight: 500;
  }
  .pr-feature-item span.dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${t.featureDot};
    box-shadow: 0 0 6px ${t.featureDot};
    flex-shrink: 0;
    animation: blink 2.5s ease-in-out infinite;
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
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
};

/* ─── Orb Background ─── */
const OrbBackground = ({ t }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {t.orbColors.map((o, i) => (
      <div key={i} style={{
        position: 'absolute', borderRadius: '50%',
        width: [700, 600, 500, 350][i], height: [700, 600, 500, 350][i],
        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        filter: 'blur(80px)',
        top: o.top, left: o.left, right: o.right, bottom: o.bottom,
        animation: 'orbFloat 16s ease-in-out infinite',
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

/* ─── ProtectedRoute ─── */
const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const t = getTokens(isDark);

  if (isAuth) return children;

  return (
    <div style={{
      minHeight: '100vh',
      background: t.pageBg,
      color: t.pageColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
      padding: '2rem 1rem',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      <style>{getCSS(t)}</style>

      {/* Particle canvas */}
      <ParticleCanvas colors={t.particleColors} />

      {/* Orb background */}
      <OrbBackground t={t} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 2,
        background: t.cardBg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 32,
        padding: '3rem 2.6rem',
        width: '100%', maxWidth: 460,
        boxShadow: t.cardShadow,
        animation: 'fadeUp 0.6s ease',
        textAlign: 'center',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}>

        {/* Back button */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <button className="pr-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={15} /> Go Back
          </button>
        </div>

        {/* Lock icon */}
        <div style={{
          width: 88, height: 88,
          background: t.iconBg,
          border: `1px solid ${t.iconBorder}`,
          borderRadius: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.8rem',
          boxShadow: t.iconShadow,
          animation: 'lockBounce 3s ease-in-out infinite',
        }}>
          <FiLock size={36} color={t.iconColor} strokeWidth={1.8} />
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: t.badgeBg,
          border: `1px solid ${t.badgeBorder}`,
          borderRadius: 99, padding: '5px 16px', marginBottom: '1.4rem',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: t.badgeDot,
            boxShadow: `0 0 6px ${t.badgeDotShadow}`,
            display: 'inline-block',
            animation: 'blink 2s infinite',
          }} />
          <span style={{ color: t.badgeColor, fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            Members Only Area
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 900, fontSize: '2rem',
          color: t.titleColor,
          marginBottom: '0.8rem', lineHeight: 1.15,
        }}>
          Login Required
        </h2>

        {/* Sub */}
        <p style={{
          color: t.subColor,
          fontSize: '0.95rem', lineHeight: 1.7,
          marginBottom: '2rem',
        }}>
          This page is only available to registered members. Sign in to access full listings, contact owners, explore the map, and compare properties.
        </p>

        {/* Feature list */}
        <div style={{
          background: t.featureBoxBg,
          border: `1px solid ${t.featureBoxBorder}`,
          borderRadius: 16, padding: '1.1rem 1.4rem',
          marginBottom: '2rem', textAlign: 'left',
        }}>
          {[
            'View full listing details & photos',
            'See pricing & contact information',
            'Explore the interactive map',
            'Compare properties side by side',
            'Save favourites & send inquiries',
          ].map((f, i) => (
            <div key={i} className="pr-feature-item">
              <span className="dot" />
              {f}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="pr-btn-primary" onClick={() => navigate('/login')}>
            Sign In to Continue →
          </button>
          <button className="pr-btn-secondary" onClick={() => navigate('/register')}>
            Create Free Account
          </button>
        </div>

        <p style={{ marginTop: '1.3rem', fontSize: '0.74rem', color: t.noteColor }}>
          Free forever • No credit card required
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;