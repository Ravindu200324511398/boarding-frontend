import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#00d4aa', '#2de2e6'];

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#0891b2', '#2de2e6'];
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.7 - 0.3,
      alpha: Math.random() * 0.5 + 0.2,
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
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

// ── LEFT PANEL: redesigned ────────────────────────────────────────────────────
const HouseCard3D = () => {
  const cardRef = useRef(null);
  const wrapRef = useRef(null);

  const handleMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const rx = (e.clientY - cy) / 18, ry = -(e.clientX - cx) / 18;
    card.style.animation = 'none';
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(0)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.animation = 'houseFloat 6s ease-in-out infinite';
  }, []);

  return (
    <div ref={wrapRef} style={{ perspective: '1000px' }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div ref={cardRef} style={{
        width: 320,
        borderRadius: 26,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
        border: '1px solid rgba(255,255,255,0.13)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(14,165,233,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '36px 32px 32px',
        animation: 'houseFloat 6s ease-in-out infinite',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        transition: 'transform 0.12s ease',
      }}>
        {/* Big emoji */}
        <div style={{
          fontSize: '5.8rem',
          marginBottom: 14,
          filter: 'drop-shadow(0 12px 32px rgba(14,165,233,0.6))',
          animation: 'emojiGlow 4s ease-in-out infinite',
          lineHeight: 1,
        }}>🏡</div>

        {/* Card title */}
        <h3 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: '1.25rem',
          textAlign: 'center',
          marginBottom: 8,
          background: 'linear-gradient(135deg, #0ea5e9, #2de2e6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Join Our Community</h3>

        {/* Card sub */}
        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(240,244,255,0.45)',
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: 26,
        }}>
          Find perfect boarding near your campus
        </p>

        {/* Stats row — bigger */}
        <div style={{ display: 'flex', gap: 14, width: '100%' }}>
          {[['2K+', 'Listings'], ['5★', 'Rated'], ['Free', 'Always']].map(([n, l]) => (
            <div key={l} style={{
              flex: 1,
              textAlign: 'center',
              padding: '14px 8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 14,
            }}>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{n}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(240,244,255,0.4)', marginTop: 3, fontWeight: 600, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const pwStrength = getStrength(form.password);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setIsRegistering(true);
      setTimeout(() => { login(res.data.user, res.data.token); navigate('/'); }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const inputWrapStyle = (field) => ({
    display: 'flex', alignItems: 'center',
    border: `1.5px solid ${focused === field ? 'rgba(0,212,170,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 13,
    background: focused === field ? 'rgba(0,212,170,0.04)' : 'rgba(255,255,255,0.04)',
    overflow: 'hidden', transition: 'all 0.25s ease',
    boxShadow: focused === field ? '0 0 0 3px rgba(0,212,170,0.12), 0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
  });

  const inputStyle = {
    border: 'none', outline: 'none', flex: 1,
    padding: '0.85rem 1rem', fontSize: '0.9rem',
    background: 'transparent', color: 'rgba(240,244,255,0.9)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const iconStyle = {
    padding: '0 0.85rem', color: 'rgba(0,212,170,0.7)',
    display: 'flex', alignItems: 'center',
    borderRight: '1px solid rgba(255,255,255,0.07)',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: 'rgba(240,244,255,0.45)', marginBottom: '0.45rem',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @keyframes houseFloat {
      0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
      50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
    }
    @keyframes emojiGlow {
      0%,100% { filter: drop-shadow(0 12px 32px rgba(14,165,233,0.6)); }
      50%      { filter: drop-shadow(0 12px 32px rgba(8,145,178,0.75)); }
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
    @keyframes successPop {
      0%   { transform: scale(0.85); opacity: 0; }
      70%  { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

    .reg-field { animation: fadeUp 0.5s ease both; }
    .reg-field:nth-child(1) { animation-delay: 0.1s; }
    .reg-field:nth-child(2) { animation-delay: 0.2s; }
    .reg-field:nth-child(3) { animation-delay: 0.3s; }
    .reg-field:nth-child(4) { animation-delay: 0.4s; }

    .reg-submit-btn {
      width: 100%; border: none; border-radius: 14px; padding: 1rem;
      font-weight: 800; font-size: 0.95rem; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
      background-size: 300% 300%;
      color: #fff;
      box-shadow: 0 6px 24px rgba(0,212,170,0.35);
      transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      letter-spacing: 0.01em;
      animation: shimmerBtn 5s linear infinite;
    }
    .reg-submit-btn:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 36px rgba(0,212,170,0.5);
    }
    .reg-submit-btn:active:not(:disabled) { transform: scale(0.97); }
    .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    .pw-bar { height: 3px; border-radius: 99px; flex: 1; background: rgba(255,255,255,0.1); transition: background 0.3s; }

    input::placeholder { color: rgba(240,244,255,0.25); }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 100px rgba(5,6,15,0.9) inset !important;
      -webkit-text-fill-color: rgba(240,244,255,0.9) !important;
    }

    @media (max-width: 767px) {
      .reg-left-panel { display: none !important; }
      .reg-right-panel { width: 100% !important; max-width: 100% !important; padding: 2rem 1.2rem !important; }
      .reg-wrapper { flex-direction: column !important; }
    }
  `;

  return (
    <div style={{
      minHeight: '100vh', background: '#05060f',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{CSS}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 650, h: 650, color: '#0ea5e944', top: '-200px', left: '-200px', delay: '0s' },
          { w: 550, h: 550, color: '#06b6d433', top: '30%', right: '-180px', delay: '-5s' },
          { w: 450, h: 450, color: '#00d4aa33', bottom: '-130px', left: '20%', delay: '-10s' },
          { w: 350, h: 350, color: '#0891b233', top: '55%', left: '55%', delay: '-7s' },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: o.w, height: o.h,
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            filter: 'blur(70px)',
            top: o.top, left: o.left, right: o.right, bottom: o.bottom,
            animation: `orbFloat 14s ease-in-out infinite`,
            animationDelay: o.delay,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="reg-wrapper" style={{
        display: 'flex', minHeight: '100vh',
        position: 'relative', zIndex: 2,
      }}>

        {/* ── LEFT PANEL (only this section changed) ── */}
        <div className="reg-left-panel" style={{
          flex: 1.1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 40px', position: 'relative', overflow: 'hidden',
        }}>
          <ParticleCanvas />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.7s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Top tagline pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 22,
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 99,
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite', flexShrink: 0 }} />
              <span style={{ color: 'rgba(240,244,255,0.55)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Sri Lanka's #1 Student Platform
              </span>
            </div>

            {/* Big headline */}
            <h1 style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '2.6rem',
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              color: '#f0f4ff',
              maxWidth: 380,
              marginBottom: 14,
            }}>
              Find your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00d4aa, #2de2e6, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>perfect home</span>{' '}
              away from home
            </h1>

            {/* Sub-headline */}
            <p style={{
              color: 'rgba(240,244,255,0.4)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: 340,
              marginBottom: 36,
            }}>
              Verified listings near every major campus — no middlemen, no hassle.
            </p>

            {/* 3D card */}
            <HouseCard3D />

            {/* Bottom badge */}
            <div style={{
              marginTop: 28,
              padding: '12px 22px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              backdropFilter: 'blur(10px)',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ color: 'rgba(240,244,255,0.55)', fontSize: '0.82rem', fontWeight: 600 }}>
                🎓 Trusted by thousands of students across Sri Lanka
              </span>
            </div>

          </div>
        </div>
        {/* ── END LEFT PANEL ── */}

        <div className="reg-right-panel" style={{
          width: '100%', maxWidth: 520,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2.5rem',
          background: 'rgba(255,255,255,0.025)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 13, padding: 4, marginBottom: '2rem',
              animation: 'fadeUp 0.4s ease',
            }}>
              <Link to="/login" style={{
                flex: 1, textAlign: 'center', padding: '0.6rem',
                borderRadius: 10, textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 700,
                color: 'rgba(240,244,255,0.5)', transition: 'all 0.2s',
              }}>Sign In</Link>
              <div style={{
                flex: 1, textAlign: 'center', padding: '0.6rem',
                borderRadius: 10, fontSize: '0.85rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
                color: '#05060f',
              }}>Create Account</div>
            </div>

            <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
              <h2 style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800, fontSize: '2rem', color: '#f0f4ff',
                marginBottom: '0.4rem', letterSpacing: '-0.02em',
              }}>Get started 🚀</h2>
              <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Join the largest student housing network in Sri Lanka.
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(14,165,233,0.1)', color: '#7dd3fc',
                padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.85rem',
                marginBottom: '1.5rem', border: '1px solid rgba(14,165,233,0.25)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                animation: 'fadeUp 0.3s ease',
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="reg-field" style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Full Name</label>
                <div style={inputWrapStyle('name')}>
                  <span style={iconStyle}><FiUser size={16} /></span>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="John Doe" required
                    style={inputStyle}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                  />
                </div>
              </div>

              <div className="reg-field" style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapStyle('email')}>
                  <span style={iconStyle}><FiMail size={16} /></span>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@email.com" required
                    style={inputStyle}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                  />
                </div>
              </div>

              <div className="reg-field" style={{ marginBottom: '0.5rem' }}>
                <label style={labelStyle}>Password</label>
                <div style={inputWrapStyle('password')}>
                  <span style={iconStyle}><FiLock size={16} /></span>
                  <input
                    type={showPw ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} placeholder="Min 6 characters" required
                    style={inputStyle}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ background: 'none', border: 'none', padding: '0 0.9rem', cursor: 'pointer', color: 'rgba(240,244,255,0.3)', display: 'flex', alignItems: 'center' }}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="pw-bar" style={{ background: i <= pwStrength ? strengthColor[pwStrength] : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: strengthColor[pwStrength] || 'transparent', fontWeight: 600 }}>
                      {strengthLabel[pwStrength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="reg-field" style={{ marginBottom: '1.8rem', marginTop: '0.5rem' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={inputWrapStyle('confirmPassword')}>
                  <span style={iconStyle}><FiLock size={16} /></span>
                  <input
                    type={showCPw ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} placeholder="Repeat password" required
                    style={inputStyle}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused('')}
                  />
                  <button type="button" onClick={() => setShowCPw(!showCPw)}
                    style={{ background: 'none', border: 'none', padding: '0 0.9rem', cursor: 'pointer', color: 'rgba(240,244,255,0.3)', display: 'flex', alignItems: 'center' }}>
                    {showCPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {form.confirmPassword && (
                  <div style={{ marginTop: 6, fontSize: '0.72rem', fontWeight: 600, color: form.password === form.confirmPassword ? '#00d4aa' : '#ef4444' }}>
                    {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || isRegistering}
                className="reg-submit-btn"
              >
                {isRegistering
                  ? '🎉 Account Created!'
                  : loading
                    ? '⏳ Setting up...'
                    : <><FiUserPlus size={17} /> Get Started</>}
              </button>
            </form>

            <div style={{ marginTop: '1.8rem', textAlign: 'center', color: 'rgba(240,244,255,0.4)', fontSize: '0.88rem', animation: 'fadeUp 0.5s ease 0.5s both' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#00d4aa', fontWeight: 800, textDecoration: 'none' }}>Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;