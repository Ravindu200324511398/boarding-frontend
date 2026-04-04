// ============================================================
// ForgotPassword.jsx — dark/light mode
// ============================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle, FiCopy } from 'react-icons/fi';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const getTokensFP = (isDark) => isDark ? {
  bg: '#060f2a', cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.1)',
  text: 'rgba(220,233,255,0.9)', textMuted: 'rgba(220,233,255,0.45)', textDim: 'rgba(220,233,255,0.25)',
  heading: '#dce9ff', labelColor: 'rgba(220,233,255,0.45)',
  inpBg: 'rgba(255,255,255,0.04)', inpBorder: 'rgba(255,255,255,0.1)',
  inpFocusBorder: 'rgba(0,212,170,0.55)', inpFocusBg: 'rgba(0,212,170,0.04)', inpFocusShadow: 'rgba(0,212,170,0.1)',
  iconBg: 'rgba(255,255,255,0.02)', iconBorder: 'rgba(255,255,255,0.07)', iconColor: 'rgba(0,212,170,0.65)',
  errorBg: 'rgba(239,68,68,0.1)', errorColor: '#fca5a5', errorBorder: 'rgba(239,68,68,0.2)',
  successBg: 'rgba(0,212,170,0.08)', successBorder: 'rgba(0,212,170,0.25)', successColor: '#00d4aa',
  linkBoxBg: 'rgba(255,255,255,0.04)', linkBoxBorder: 'rgba(255,255,255,0.12)',
  linkUrlColor: 'rgba(220,233,255,0.7)', linkLabelColor: 'rgba(220,233,255,0.35)',
  openBtnBg: 'rgba(0,212,170,0.1)', openBtnColor: '#00d4aa', openBtnBorder: 'rgba(0,212,170,0.25)',
  backLinkColor: 'rgba(220,233,255,0.5)',
  orbColors: ['#0ea5e940', '#00d4aa25', '#06b6d428'],
  gridLine: 'rgba(255,255,255,.018)',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  footerColor: 'rgba(220,233,255,0.35)',
} : {
  bg: '#f0f4ff', cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'rgba(0,112,192,0.15)',
  text: '#1a2a4a', textMuted: '#4a6080', textDim: '#7a9ab8',
  heading: '#0d1f3c', labelColor: '#4a6080',
  inpBg: 'rgba(255,255,255,0.9)', inpBorder: 'rgba(0,112,192,0.2)',
  inpFocusBorder: 'rgba(0,112,192,0.55)', inpFocusBg: 'rgba(0,180,216,0.04)', inpFocusShadow: 'rgba(0,112,192,0.12)',
  iconBg: 'rgba(0,112,192,0.04)', iconBorder: 'rgba(0,112,192,0.1)', iconColor: '#0070c0',
  errorBg: 'rgba(239,68,68,0.08)', errorColor: '#dc2626', errorBorder: 'rgba(239,68,68,0.15)',
  successBg: 'rgba(0,112,192,0.08)', successBorder: 'rgba(0,112,192,0.2)', successColor: '#0070c0',
  linkBoxBg: 'rgba(255,255,255,0.7)', linkBoxBorder: 'rgba(0,112,192,0.15)',
  linkUrlColor: '#1a2a4a', linkLabelColor: '#4a6080',
  openBtnBg: 'rgba(0,112,192,0.08)', openBtnColor: '#0070c0', openBtnBorder: 'rgba(0,112,192,0.2)',
  backLinkColor: '#7a9ab8',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  gridLine: 'rgba(0,112,192,.025)',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  footerColor: '#7a9ab8',
};

const getCSS_FP = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(40px,-50px) scale(1.07);} 66%{transform:translate(-25px,30px) scale(0.95);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmerBtn { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
  .fp-card { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:24px; padding:2.5rem 2rem; width:100%; max-width:460px; backdrop-filter:blur(16px); animation:fadeUp 0.5s ease; position:relative; overflow:hidden; }
  .fp-submit-btn { width:100%; background:linear-gradient(135deg, ${t.accent} 0%, #2de2e6 40%, ${t.accentSecondary} 80%); background-size:300% 300%; color:#fff; border:none; border-radius:12px; padding:0.9rem; font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:0.95rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; animation:shimmerBtn 4s linear infinite; box-shadow:0 6px 24px rgba(0,180,192,0.3); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .fp-submit-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); }
  .fp-submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
  .fp-input-wrap { display:flex; align-items:center; border:1.5px solid ${t.inpBorder}; border-radius:12px; overflow:hidden; background:${t.inpBg}; transition:all 0.2s; }
  .fp-input-wrap:focus-within { border-color:${t.inpFocusBorder}; background:${t.inpFocusBg}; box-shadow:0 0 0 3px ${t.inpFocusShadow}; }
  .fp-inp { border:none; outline:none; flex:1; padding:0.75rem 1rem; font-size:0.95rem; font-family:'Plus Jakarta Sans',sans-serif; color:${t.text}; background:transparent; }
  .fp-inp::placeholder { color:${t.textDim}; }
  .fp-back-link { display:inline-flex; align-items:center; gap:0.4rem; color:${t.backLinkColor}; font-size:0.875rem; text-decoration:none; margin-bottom:1.5rem; font-family:'Plus Jakarta Sans',sans-serif; transition:color 0.2s; }
  .fp-back-link:hover { color:${t.text}; }
  .open-btn { flex:1; background:${t.openBtnBg}; color:${t.openBtnColor}; border:1px solid ${t.openBtnBorder}; border-radius:8px; padding:0.55rem; font-size:0.82rem; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.2s; width:100%; }
  input:-webkit-autofill { -webkit-box-shadow:0 0 0 100px ${t.cardBg} inset !important; -webkit-text-fill-color:${t.text} !important; }
`;

export const ForgotPassword = () => {
  const { isDark } = useTheme();
  const t = getTokensFP(isDark);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const res = await api.post('/auth/forgot-password', { email }); setResetUrl(res.data.resetUrl); }
    catch (err) { setError(err.response?.data?.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(resetUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{getCSS_FP(t)}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {t.orbColors.map((color, i) => {
          const pos = [{ top: '-120px', left: '-120px' }, { bottom: '-100px', right: '-100px' }, { top: '50%', left: '40%' }];
          const sizes = [500, 450, 350]; const delays = ['0s', '-7s', '-12s'];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: 'blur(70px)', ...pos[i], animation: `orbFloat 14s ease-in-out infinite`, animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <div className="fp-card" style={{ zIndex: 2 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, background: `radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)`, pointerEvents: 'none' }} />

        <Link to="/login" className="fp-back-link"><FiArrowLeft size={14} /> Back to Login</Link>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(0,180,192,0.3)' }}>
            <FiMail size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.7rem', fontWeight: 800, color: t.heading, marginBottom: '0.4rem' }}>Forgot Password?</h2>
          <p style={{ color: t.textMuted, fontSize: '0.9rem', margin: 0 }}>Enter your account email and we'll generate a reset link for you.</p>
        </div>

        {error && <div style={{ background: t.errorBg, color: t.errorColor, padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.875rem', marginBottom: '1.2rem', border: `1px solid ${t.errorBorder}` }}>⚠️ {error}</div>}

        {!resetUrl ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: t.labelColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
              <div className="fp-input-wrap">
                <span style={{ padding: '0 0.85rem', color: t.iconColor, background: t.iconBg, alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: `1px solid ${t.iconBorder}` }}><FiMail size={16} /></span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@email.com" required className="fp-inp" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="fp-submit-btn">
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Generating...</> : <><FiSend size={15} />Send Reset Link</>}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: t.successBg, border: `1px solid ${t.successBorder}`, borderRadius: 12, padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
              <FiCheckCircle size={36} color={t.successColor} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: t.successColor, marginBottom: '0.3rem' }}>Reset link generated!</div>
              <p style={{ fontSize: '0.82rem', color: t.textMuted, margin: 0 }}>
                In production this would be sent to <strong style={{ color: t.text }}>{email}</strong>. For development, use the link below:
              </p>
            </div>
            <div style={{ background: t.linkBoxBg, border: `1.5px dashed ${t.linkBoxBorder}`, borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: t.linkLabelColor, fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔗 Your Reset Link</div>
              <div style={{ fontSize: '0.82rem', color: t.linkUrlColor, wordBreak: 'break-all', lineHeight: 1.6, marginBottom: '0.7rem' }}>{resetUrl}</div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleCopy} style={{ flex: 1, background: copied ? '#059669' : `linear-gradient(135deg,${t.accent},${t.accentSecondary})`, color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <FiCopy size={13} />{copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={resetUrl} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="open-btn">Open Link →</button>
                </a>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: t.footerColor }}>
              Link expires in 1 hour.{' '}
              <button onClick={() => setResetUrl('')} style={{ background: 'none', border: 'none', color: t.accent, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Try again</button>
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: t.footerColor, marginTop: '1.5rem', marginBottom: 0 }}>
          Remembered it?{' '}<Link to="/login" style={{ color: t.accent, fontWeight: 700, textDecoration: 'none' }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;