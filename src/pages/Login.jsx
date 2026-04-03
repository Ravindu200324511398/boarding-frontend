
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/* ─── Particle canvas ─── */
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

    const colors = ['#7b2fff', '#ff3cac', '#00d4aa', '#2de2e6', '#ff6b35'];
    const particles = Array.from({ length: 35 }, () => ({
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
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

/* ─── 3D House Card ─── */
const HouseCard3D = () => {
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const rx = (e.clientY - cy) / 20, ry = -(e.clientX - cx) / 20;
    card.style.animation = 'none';
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(0)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.animation = 'houseFloat 6s ease-in-out infinite';
  }, []);

  return (
    <div style={{ perspective: '1000px' }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div ref={cardRef} style={{
        width: 260, height: 300,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(0,212,170,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 28,
        animation: 'houseFloat 6s ease-in-out infinite',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        transition: 'transform 0.12s ease',
      }}>
        <div style={{ fontSize: '4.2rem', marginBottom: 14, filter: 'drop-shadow(0 8px 24px rgba(0,212,170,0.5))', animation: 'emojiGlow 4s ease-in-out infinite' }}>🏠</div>
        <h3 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.05rem',
          textAlign: 'center', marginBottom: 8,
          background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Find Your Perfect Room</h3>
        <p style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)', textAlign: 'center', lineHeight: 1.55 }}>
          Sri Lanka's trusted boarding platform for students
        </p>
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          {[['2K+', 'Rooms'], ['24/7', 'Support'], ['Verified', 'Listings']].map(([n, l]) => (
            <div key={l} style={{
              textAlign: 'center', padding: '7px 9px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9,
            }}>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '0.8rem',
                background: 'linear-gradient(135deg, #ff6b35, #ff3cac)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{n}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(240,244,255,0.4)', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Login ─── */
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      setSuccess(true);
      setTimeout(() => { login(res.data.user, res.data.token); navigate('/'); }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
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
    padding: '0.9rem 1rem', fontSize: '0.92rem',
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
      0%,100% { filter: drop-shadow(0 8px 24px rgba(0,212,170,0.5)); }
      50%      { filter: drop-shadow(0 8px 24px rgba(123,47,255,0.6)); }
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

    .login-field { animation: fadeUp 0.5s ease both; }
    .login-field:nth-child(1) { animation-delay: 0.1s; }
    .login-field:nth-child(2) { animation-delay: 0.2s; }

    .login-submit-btn {
      width: 100%; border: none; border-radius: 14px; padding: 1rem;
      font-weight: 800; font-size: 0.95rem; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #00d4aa 80%);
      background-size: 300% 300%;
      color: #05060f;
      box-shadow: 0 6px 24px rgba(0,212,170,0.4);
      transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      animation: shimmerBtn 4s linear infinite;
    }
    .login-submit-btn:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 36px rgba(0,212,170,0.55);
    }
    .login-submit-btn:active:not(:disabled) { transform: scale(0.97); }
    .login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    input::placeholder { color: rgba(240,244,255,0.22); }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 100px rgba(5,6,15,0.9) inset !important;
      -webkit-text-fill-color: rgba(240,244,255,0.9) !important;
    }

    @media (max-width: 767px) {
      .login-left-panel { display: none !important; }
      .login-right-panel { width: 100% !important; max-width: 100% !important; padding: 2rem 1.2rem !important; }
    }
  `;

  return (
    <div style={{
      minHeight: '100vh', background: '#05060f',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{CSS}</style>

      {/* ── Background orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: '#00d4aa33', top: '-180px', left: '-180px', delay: '0s' },
          { w: 550, h: 550, color: '#7b2fff44', top: '35%', right: '-160px', delay: '-5s' },
          { w: 400, h: 400, color: '#ff3cac2a', bottom: '-120px', left: '25%', delay: '-9s' },
          { w: 320, h: 320, color: '#ff6b3533', top: '60%', left: '50%', delay: '-6s' },
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

      {/* ── Split layout ── */}
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

        {/* LEFT decorative */}
        <div className="login-left-panel" style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 40px', position: 'relative', overflow: 'hidden',
        }}>
          <ParticleCanvas />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.7s ease' }}>
            <HouseCard3D />
            <div style={{
              marginTop: 32, padding: '12px 22px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, backdropFilter: 'blur(10px)',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
              <span style={{ color: 'rgba(240,244,255,0.55)', fontSize: '0.8rem', fontWeight: 600 }}>
                Over 2,000+ verified listings live now
              </span>
            </div>
            <p style={{
              marginTop: 24, color: 'rgba(240,244,255,0.35)', fontSize: '0.88rem',
              lineHeight: 1.7, maxWidth: 320, margin: '20px auto 0',
            }}>
              Access your account and continue finding the perfect boarding in Sri Lanka.
            </p>
          </div>
        </div>

        {/* RIGHT form */}
        <div className="login-right-panel" style={{
          width: '100%', maxWidth: 520,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2.5rem',
          background: 'rgba(255,255,255,0.025)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
        }}>
          {/* Corner glows */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(123,47,255,0.08), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>

            {/* Tab switcher */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 13, padding: 4, marginBottom: '2rem',
              animation: 'fadeUp 0.4s ease',
            }}>
              <div style={{
                flex: 1, textAlign: 'center', padding: '0.6rem',
                borderRadius: 10, fontSize: '0.85rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #00d4aa, #2de2e6)',
                color: '#05060f',
              }}>Sign In</div>
              <Link to="/register" style={{
                flex: 1, textAlign: 'center', padding: '0.6rem',
                borderRadius: 10, textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 700,
                color: 'rgba(240,244,255,0.5)', transition: 'all 0.2s',
              }}>Create Account</Link>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
              <h2 style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800, fontSize: '2rem', color: '#f0f4ff',
                marginBottom: '0.4rem', letterSpacing: '-0.02em',
              }}>Welcome back ✨</h2>
              <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Access your BoardingFinder account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,107,53,0.1)', color: '#ff8c60',
                padding: '0.85rem 1rem', borderRadius: 12, fontSize: '0.85rem',
                marginBottom: '1.5rem', border: '1px solid rgba(255,107,53,0.25)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                animation: 'fadeUp 0.3s ease',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="login-field" style={{ marginBottom: '1.1rem' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapStyle('email')}>
                  <span style={iconStyle}><FiMail size={16} /></span>
                  <input
                    type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com" required
                    style={inputStyle}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                  />
                </div>
              </div>

              <div className="login-field" style={{ marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{
                    fontSize: '0.78rem', color: '#00d4aa', fontWeight: 700,
                    textDecoration: 'none', opacity: 0.85,
                    transition: 'opacity 0.2s',
                  }}>Forgot password?</Link>
                </div>
                <div style={inputWrapStyle('password')}>
                  <span style={iconStyle}><FiLock size={16} /></span>
                  <input
                    type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" required
                    style={inputStyle}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ background: 'none', border: 'none', padding: '0 0.9rem', cursor: 'pointer', color: 'rgba(240,244,255,0.3)', display: 'flex', alignItems: 'center' }}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="login-submit-btn"
              >
                {success
                  ? '✅ Welcome back!'
                  : loading
                    ? '⏳ Signing in...'
                    : <><FiLogIn size={17} /> Sign In</>}
              </button>
            </form>

            <div style={{ marginTop: '1.8rem', textAlign: 'center', color: 'rgba(240,244,255,0.4)', fontSize: '0.88rem', animation: 'fadeUp 0.5s ease 0.4s both' }}>
              New here?{' '}
              <Link to="/register" style={{ color: '#00d4aa', fontWeight: 800, textDecoration: 'none' }}>Create Account →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;