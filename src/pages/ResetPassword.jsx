import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const getTokens = (isDark) => isDark ? {
  bg: '#060f2a', cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.1)',
  heading: '#dce9ff', text: 'rgba(220,233,255,0.9)', textMuted: 'rgba(220,233,255,0.45)', textDim: 'rgba(220,233,255,0.25)',
  labelColor: 'rgba(220,233,255,0.45)',
  inpBg: 'rgba(255,255,255,0.04)', inpBorder: 'rgba(255,255,255,0.1)',
  inpFocusBorder: 'rgba(0,212,170,0.55)', inpFocusBg: 'rgba(0,212,170,0.04)', inpFocusShadow: 'rgba(0,212,170,0.1)',
  inpErrBorder: 'rgba(248,113,113,0.5)',
  iconBg: 'rgba(255,255,255,0.02)', iconBorder: 'rgba(255,255,255,0.07)', iconColor: 'rgba(0,212,170,0.65)',
  eyeColor: 'rgba(220,233,255,0.3)',
  errorBg: 'rgba(239,68,68,0.1)', errorColor: '#fca5a5', errorBorder: 'rgba(239,68,68,0.2)',
  barBg: 'rgba(255,255,255,0.08)',
  orbColors: ['#0ea5e940', '#00d4aa25', '#06b6d428'],
  gridLine: 'rgba(255,255,255,.018)',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  footerColor: 'rgba(220,233,255,0.35)',
  autofillBg: 'rgba(6,15,40,0.95)', autofillColor: 'rgba(220,233,255,0.9)',
} : {
  bg: '#f0f4ff', cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'rgba(0,112,192,0.15)',
  heading: '#0d1f3c', text: '#1a2a4a', textMuted: '#4a6080', textDim: '#7a9ab8',
  labelColor: '#4a6080',
  inpBg: 'rgba(255,255,255,0.9)', inpBorder: 'rgba(0,112,192,0.2)',
  inpFocusBorder: 'rgba(0,112,192,0.55)', inpFocusBg: 'rgba(0,180,216,0.04)', inpFocusShadow: 'rgba(0,112,192,0.12)',
  inpErrBorder: 'rgba(239,68,68,0.5)',
  iconBg: 'rgba(0,112,192,0.04)', iconBorder: 'rgba(0,112,192,0.1)', iconColor: '#0070c0',
  eyeColor: '#7a9ab8',
  errorBg: 'rgba(239,68,68,0.08)', errorColor: '#dc2626', errorBorder: 'rgba(239,68,68,0.15)',
  barBg: 'rgba(0,112,192,0.1)',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  gridLine: 'rgba(0,112,192,.025)',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  footerColor: '#7a9ab8',
  autofillBg: 'rgba(240,247,255,0.95)', autofillColor: '#1a2a4a',
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(40px,-50px) scale(1.07);} 66%{transform:translate(-25px,30px) scale(0.95);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmerBtn { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
  @keyframes successPop { 0%{transform:scale(0.85);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
  .rp-card { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:24px; padding:2.5rem 2rem; width:100%; max-width:440px; backdrop-filter:blur(16px); animation:fadeUp 0.5s ease; position:relative; overflow:hidden; }
  .rp-submit-btn { width:100%; background:linear-gradient(135deg, ${t.accent} 0%, #2de2e6 40%, ${t.accentSecondary} 80%); background-size:300% 300%; color:#fff; border:none; border-radius:13px; padding:0.9rem; font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:0.95rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; animation:shimmerBtn 4s linear infinite; box-shadow:0 6px 24px rgba(0,180,192,0.3); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .rp-submit-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); }
  .rp-submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
  .rp-inp-wrap { display:flex; align-items:center; border:1.5px solid ${t.inpBorder}; border-radius:12px; overflow:hidden; background:${t.inpBg}; transition:all 0.2s; }
  .rp-inp-wrap:focus-within { border-color:${t.inpFocusBorder}; background:${t.inpFocusBg}; box-shadow:0 0 0 3px ${t.inpFocusShadow}; }
  .rp-inp-wrap.err { border-color:${t.inpErrBorder}; }
  .rp-inp { border:none; outline:none; flex:1; padding:0.75rem 1rem; font-size:0.95rem; font-family:'Plus Jakarta Sans',sans-serif; color:${t.text}; background:transparent; }
  .rp-inp::placeholder { color:${t.textDim}; }
  .rp-inp-icon { padding:0 0.85rem; color:${t.iconColor}; background:${t.iconBg}; align-self:stretch; display:flex; align-items:center; border-right:1px solid ${t.iconBorder}; }
  .rp-label { display:block; font-size:0.78rem; font-weight:700; color:${t.labelColor}; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem; font-family:'Plus Jakarta Sans',sans-serif; }
  .strength-bar-bg { height:4px; background:${t.barBg}; border-radius:4px; overflow:hidden; margin-top:0.5rem; }
  .success-card { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:24px; padding:3rem 2rem; max-width:420px; width:100%; text-align:center; backdrop-filter:blur(16px); animation:successPop 0.5s ease forwards; }
  input:-webkit-autofill { -webkit-box-shadow:0 0 0 100px ${t.autofillBg} inset !important; -webkit-text-fill-color:${t.autofillColor} !important; }
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = () => {
    if (!password) return { level: 0, label: '', color: t.barBg };
    if (password.length < 6) return { level: 1, label: 'Too short', color: '#ef4444' };
    if (password.length < 8) return { level: 2, label: 'Weak', color: '#f59e0b' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, label: 'Strong', color: t.accent };
    return { level: 3, label: 'Good', color: t.accentSecondary };
  };
  const str = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try { const res = await api.post(`/auth/reset-password/${token}`, { password }); login(res.data.user, res.data.token); setSuccess(true); setTimeout(() => navigate('/'), 2500); }
    catch (err) { setError(err.response?.data?.message || 'Reset failed. The link may have expired.'); }
    finally { setLoading(false); }
  };

  const orbsEl = t.orbColors.map((color, i) => {
    const pos = [{ top: '-120px', left: '-120px' }, { bottom: '-100px', right: '-100px' }, { top: '50%', left: '40%' }];
    const sizes = [500, 450, 350]; const delays = ['0s', '-7s', '-12s'];
    return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: 'blur(70px)', ...pos[i], animation: `orbFloat 14s ease-in-out infinite`, animationDelay: delays[i] }} />;
  });

  const bgStyle = { minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' };

  if (success) return (
    <div style={bgStyle}>
      <style>{getCSS(t)}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>{orbsEl}</div>
      <div className="success-card" style={{ zIndex: 2 }}>
        <div style={{ width: 80, height: 80, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 10px 30px rgba(0,180,192,0.35)' }}>
          <FiCheckCircle size={36} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, marginBottom: '0.5rem' }}>Password Reset!</h2>
        <p style={{ color: t.textMuted }}>Your password has been updated. Redirecting you home...</p>
        <div style={{ width: 40, height: 3, background: `linear-gradient(135deg,${t.accent},${t.accentSecondary})`, borderRadius: 3, margin: '1.2rem auto 0' }} />
      </div>
    </div>
  );

  return (
    <div style={bgStyle}>
      <style>{getCSS(t)}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {orbsEl}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <div className="rp-card" style={{ zIndex: 2 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(0,180,192,0.3)' }}>
            <FiLock size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.7rem', fontWeight: 800, color: t.heading, marginBottom: '0.4rem' }}>Set New Password</h2>
          <p style={{ color: t.textMuted, fontSize: '0.9rem', margin: 0 }}>Choose a strong password for your account.</p>
        </div>

        {error && <div style={{ background: t.errorBg, color: t.errorColor, padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.875rem', marginBottom: '1.2rem', border: `1px solid ${t.errorBorder}` }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="rp-label">New Password</label>
            <div className="rp-inp-wrap">
              <span className="rp-inp-icon"><FiLock size={16} /></span>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="rp-inp" />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: t.eyeColor }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {password && (
              <div>
                <div className="strength-bar-bg">
                  <div style={{ height: '100%', width: `${str.level * 25}%`, background: str.color, transition: 'width 0.3s, background 0.3s', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: str.color, fontWeight: 600, marginTop: '0.25rem' }}>{str.label}</div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="rp-label">Confirm Password</label>
            <div className={`rp-inp-wrap${confirm && confirm !== password ? ' err' : ''}`}>
              <span className="rp-inp-icon"><FiLock size={16} /></span>
              <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" required className="rp-inp" />
            </div>
            {confirm && confirm !== password && <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>⚠ Passwords don't match</div>}
            {confirm && confirm === password && <div style={{ fontSize: '0.78rem', color: t.accent, marginTop: '0.3rem' }}>✓ Passwords match</div>}
          </div>

          <button type="submit" disabled={loading} className="rp-submit-btn">
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</> : <><FiLock size={15} />Reset Password</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: t.footerColor, marginTop: '1.5rem', marginBottom: 0 }}>
          <Link to="/login" style={{ color: t.accent, fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;