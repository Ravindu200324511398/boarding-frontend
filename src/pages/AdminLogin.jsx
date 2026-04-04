import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const getTokens = (isDark) => isDark ? {
  bg: '#060f2a', cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.1)',
  cardShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
  text: 'rgba(240,244,255,0.9)', textMuted: 'rgba(220,233,255,0.45)',
  inpBg: 'rgba(255,255,255,0.04)', inpBorder: 'rgba(255,255,255,0.1)',
  inpFocusBorder: 'rgba(0,212,170,0.6)', inpFocusBg: 'rgba(0,212,170,0.04)',
  inpFocusShadow: '0 0 0 3px rgba(0,212,170,0.12), 0 4px 20px rgba(0,0,0,0.2)',
  iconColor: 'rgba(0,212,170,0.7)', iconBorder: 'rgba(255,255,255,0.07)',
  labelColor: 'rgba(240,244,255,0.45)',
  errorBg: 'rgba(239,68,68,0.1)', errorColor: '#f87171', errorBorder: 'rgba(239,68,68,0.25)',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  gridLine: 'rgba(255,255,255,.02)',
  orbColors: ['#0ea5e930', '#06b6d428', '#00d4aa22'],
  autofillBg: 'rgba(5,6,15,0.9)', autofillColor: 'rgba(240,244,255,0.9)',
  backLinkColor: 'rgba(220,233,255,0.4)', backLinkHover: '#00d4aa',
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
} : {
  bg: '#f0f4ff', cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'rgba(0,112,192,0.15)',
  cardShadow: '0 40px 80px rgba(0,80,160,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
  text: '#1a2a4a', textMuted: '#4a6080',
  inpBg: 'rgba(255,255,255,0.9)', inpBorder: 'rgba(0,112,192,0.2)',
  inpFocusBorder: 'rgba(0,112,192,0.6)', inpFocusBg: 'rgba(0,180,216,0.04)',
  inpFocusShadow: '0 0 0 3px rgba(0,112,192,0.12), 0 4px 20px rgba(0,80,160,0.08)',
  iconColor: '#0070c0', iconBorder: 'rgba(0,112,192,0.12)',
  labelColor: '#4a6080',
  errorBg: 'rgba(239,68,68,0.08)', errorColor: '#dc2626', errorBorder: 'rgba(239,68,68,0.2)',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  gridLine: 'rgba(0,112,192,.025)',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  autofillBg: 'rgba(240,247,255,0.95)', autofillColor: '#1a2a4a',
  backLinkColor: '#7a9ab8', backLinkHover: '#0070c0',
  particleColors: ['#0070c0', '#00b4d8', '#0096c7', '#0077b6', '#48cae4'],
};

const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45, vy: -Math.random() * 0.65 - 0.25, alpha: Math.random() * 0.55 + 0.2,
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

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(40px,-50px) scale(1.07);} 66%{transform:translate(-25px,30px) scale(0.95);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmerBtn { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
  @keyframes shieldPulse { 0%,100%{filter:drop-shadow(0 0 12px rgba(0,212,170,0.6));} 50%{filter:drop-shadow(0 0 24px rgba(14,165,233,0.8));} }

  .admin-login-btn {
    width:100%; border:none; border-radius:14px; padding:1rem;
    font-weight:800; font-size:0.95rem; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    background:linear-gradient(135deg, ${t.accent} 0%, #2de2e6 40%, ${t.accentSecondary} 80%);
    background-size:300% 300%; color:#fff;
    box-shadow:0 6px 24px rgba(0,180,192,0.35); transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
    display:flex; align-items:center; justify-content:center; gap:0.6rem;
    animation:shimmerBtn 4s linear infinite;
  }
  .admin-login-btn:hover:not(:disabled) { transform:translateY(-3px) scale(1.02); box-shadow:0 12px 36px rgba(0,180,192,0.5); }
  .admin-login-btn:disabled { opacity:0.7; cursor:not-allowed; }
  .admin-input-wrap {
    display:flex; align-items:center; border-radius:13px;
    background:${t.inpBg}; overflow:hidden; transition:all 0.25s ease;
  }
  .admin-input-wrap.focused {
    border-color:${t.inpFocusBorder} !important;
    background:${t.inpFocusBg} !important;
    box-shadow:${t.inpFocusShadow} !important;
  }
  .admin-input { border:none; outline:none; flex:1; padding:0.9rem 1rem; font-size:0.92rem; background:transparent; color:${t.text}; font-family:'Plus Jakarta Sans',sans-serif; }
  .admin-input::placeholder { color:${t.text === '#1a2a4a' ? '#7a9ab8' : 'rgba(240,244,255,0.22)'}; }
  .admin-input:-webkit-autofill { -webkit-box-shadow:0 0 0 100px ${t.autofillBg} inset !important; -webkit-text-fill-color:${t.autofillColor} !important; }
`;

const AdminLogin = () => {
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      if (!res.data.user.isAdmin) { setError('Access denied. Admin accounts only.'); setLoading(false); return; }
      login(res.data.user, res.data.token); navigate('/admin/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  const iconStyle = { padding: '0 0.85rem', color: t.iconColor, display: 'flex', alignItems: 'center', borderRight: `1px solid ${t.iconBorder}` };
  const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: t.labelColor, marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{getCSS(t)}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((color, i) => {
          const pos = [{ top: '-180px', left: '-180px' }, { top: '40%', right: '-150px' }, { bottom: '-120px', left: '30%' }];
          const sizes = [600, 500, 380]; const delays = ['0s', '-5s', '-9s'];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: 'blur(70px)', ...pos[i], animation: 'orbFloat 14s ease-in-out infinite', animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
        <ParticleCanvas colors={t.particleColors} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 24, padding: '2.5rem 2rem', backdropFilter: 'blur(20px)', boxShadow: t.cardShadow, animation: 'fadeUp 0.6s ease' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(0,212,170,0.12), transparent 70%)`, pointerEvents: 'none', borderRadius: 24 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)`, pointerEvents: 'none', borderRadius: 24 }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(14,165,233,0.2))', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', animation: 'shieldPulse 4s ease-in-out infinite' }}>
            <FiShield size={30} color={t.accent} />
          </div>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: t.text, marginBottom: '0.3rem' }}>Admin Portal</h2>
          <p style={{ color: t.textMuted, fontSize: '0.9rem', margin: 0 }}>Boarding Finder Administration</p>
        </div>

        {error && (
          <div style={{ background: t.errorBg, color: t.errorColor, padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.85rem', marginBottom: '1.4rem', border: `1px solid ${t.errorBorder}`, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeUp 0.3s ease' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Admin Email</label>
            <div className={`admin-input-wrap ${focused === 'email' ? 'focused' : ''}`} style={{ border: `1.5px solid ${focused === 'email' ? t.inpFocusBorder : t.inpBorder}` }}>
              <span style={iconStyle}><FiMail size={16} /></span>
              <input type="email" value={form.email} className="admin-input" onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@boardingfinder.com" required onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
            </div>
          </div>
          <div style={{ marginBottom: '1.8rem' }}>
            <label style={labelStyle}>Password</label>
            <div className={`admin-input-wrap ${focused === 'password' ? 'focused' : ''}`} style={{ border: `1.5px solid ${focused === 'password' ? t.inpFocusBorder : t.inpBorder}` }}>
              <span style={iconStyle}><FiLock size={16} /></span>
              <input type="password" value={form.password} className="admin-input" onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? <><span className="spinner-border spinner-border-sm" style={{ width: '1rem', height: '1rem' }} /> Signing in...</> : <><FiShield size={17} /> Access Admin Panel</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontSize: '0.85rem', color: t.backLinkColor, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = t.backLinkHover}
            onMouseLeave={e => e.target.style.color = t.backLinkColor}>
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;