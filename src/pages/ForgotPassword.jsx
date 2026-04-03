import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle, FiCopy } from 'react-icons/fi';
import api from '../api/axios';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .fp-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 460px;
    backdrop-filter: blur(16px);
    animation: fadeUp 0.5s ease;
    position: relative;
    overflow: hidden;
  }

  .fp-submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%);
    background-size: 300% 300%;
    color: #fff; border: none; border-radius: 12px;
    padding: 0.9rem;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-weight: 800; font-size: 0.95rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 4s linear infinite;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .fp-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,212,170,0.5);
  }
  .fp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .fp-input-wrap {
    display: flex; align-items: center;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px; overflow: hidden;
    background: rgba(255,255,255,0.04);
    transition: all 0.2s;
  }
  .fp-input-wrap:focus-within {
    border-color: rgba(0,212,170,0.55);
    background: rgba(0,212,170,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }

  .fp-inp {
    border: none; outline: none; flex: 1;
    padding: 0.75rem 1rem; font-size: 0.95rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: rgba(220,233,255,0.9); background: transparent;
  }
  .fp-inp::placeholder { color: rgba(220,233,255,0.25); }

  .fp-back-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    color: rgba(220,233,255,0.5); font-size: 0.875rem;
    text-decoration: none; margin-bottom: 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.2s;
  }
  .fp-back-link:hover { color: rgba(220,233,255,0.9); }

  .fp-link-url-box {
    background: rgba(255,255,255,0.04);
    border: 1.5px dashed rgba(255,255,255,0.12);
    border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
  }

  .copy-btn {
    flex: 1; color: #fff; border: none; border-radius: 8px;
    padding: 0.55rem; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 0.4rem; transition: background 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .open-btn {
    flex: 1; background: rgba(0,212,170,0.1); color: #00d4aa;
    border: 1px solid rgba(0,212,170,0.25); border-radius: 8px;
    padding: 0.55rem; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.2s;
  }
  .open-btn:hover { background: rgba(0,212,170,0.18); }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(6,15,40,0.95) inset !important;
    -webkit-text-fill-color: rgba(220,233,255,0.9) !important;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetUrl(res.data.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060f2a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {[
          { w: 500, h: 500, color: '#0ea5e940', top: '-120px', left: '-120px', delay: '0s' },
          { w: 450, h: 450, color: '#00d4aa25', bottom: '-100px', right: '-100px', delay: '-7s' },
          { w: 350, h: 350, color: '#06b6d428', top: '50%', left: '40%', delay: '-12s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="fp-card" style={{ zIndex: 2 }}>
        {/* Corner glows */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/login" className="fp-back-link">
          <FiArrowLeft size={14} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(0,212,170,0.35)' }}>
            <FiMail size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.7rem', fontWeight: 800, color: '#dce9ff', marginBottom: '0.4rem' }}>Forgot Password?</h2>
          <p style={{ color: 'rgba(220,233,255,0.45)', fontSize: '0.9rem', margin: 0 }}>Enter your account email and we'll generate a reset link for you.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.875rem', marginBottom: '1.2rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {!resetUrl ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(220,233,255,0.45)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
              <div className="fp-input-wrap">
                <span style={{ padding: '0 0.85rem', color: 'rgba(0,212,170,0.65)', background: 'rgba(255,255,255,0.02)', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                  <FiMail size={16} />
                </span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@email.com" required className="fp-inp" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="fp-submit-btn">
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Generating...</> : <><FiSend size={15} />Send Reset Link</>}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 12, padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
              <FiCheckCircle size={36} color="#00d4aa" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#00d4aa', marginBottom: '0.3rem' }}>Reset link generated!</div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.5)', margin: 0 }}>
                In production this would be sent to <strong style={{ color: 'rgba(220,233,255,0.75)' }}>{email}</strong>. For development, use the link below:
              </p>
            </div>

            <div className="fp-link-url-box">
              <div style={{ fontSize: '0.75rem', color: 'rgba(220,233,255,0.35)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔗 Your Reset Link</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.7)', wordBreak: 'break-all', lineHeight: 1.6, marginBottom: '0.7rem' }}>{resetUrl}</div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleCopy} className="copy-btn" style={{ background: copied ? '#059669' : 'linear-gradient(135deg,#00d4aa,#0ea5e9)' }}>
                  <FiCopy size={13} />{copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={resetUrl} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="open-btn" style={{ width: '100%' }}>Open Link →</button>
                </a>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(220,233,255,0.35)' }}>
              Link expires in 1 hour.{' '}
              <button onClick={() => setResetUrl('')} style={{ background: 'none', border: 'none', color: '#00d4aa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Try again</button>
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(220,233,255,0.35)', marginTop: '1.5rem', marginBottom: 0 }}>
          Remembered it?{' '}
          <Link to="/login" style={{ color: '#00d4aa', fontWeight: 700, textDecoration: 'none' }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;