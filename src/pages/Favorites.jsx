import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiEye, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import { useCurrency } from '../context/CurrencyContext';

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
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
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(0,212,170,0.3); }
    50%      { box-shadow: 0 0 40px rgba(0,212,170,0.6); }
  }

  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.8rem 1.4rem;
    font-weight: 800; font-size: 0.9rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%;
    color: #fff;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
  }
  .reg-submit-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,212,170,0.5);
  }

  .fav-card {
    animation: slideUp 0.4s ease-out forwards;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    border-radius: 24px; overflow: hidden;
    backdropFilter: blur(16px);
  }
  .fav-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 24px 50px rgba(0,0,0,0.35);
    border-color: rgba(0,212,170,0.3) !important;
  }
  .fav-card:hover .fav-img {
    transform: scale(1.05);
  }
  .fav-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s ease;
  }
`;

/* ─── Particle Canvas ─── */
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
    const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.55 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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

/* ─── Orb Background ─── */
const OrbBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[
      { w: 650, h: 650, color: '#00d4aa22', top: '-200px', left: '-200px', delay: '0s' },
      { w: 550, h: 550, color: '#0ea5e933', top: '30%', right: '-180px', delay: '-5s' },
      { w: 450, h: 450, color: '#06b6d422', bottom: '-140px', left: '20%', delay: '-9s' },
      { w: 300, h: 300, color: '#2de2e611', top: '60%', left: '60%', delay: '-7s' },
    ].map((o, i) => (
      <div key={i} style={{
        position: 'absolute', borderRadius: '50%',
        width: o.w, height: o.h,
        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        filter: 'blur(80px)',
        top: o.top, left: o.left, right: o.right, bottom: o.bottom,
        animation: `orbFloat 16s ease-in-out infinite`,
        animationDelay: o.delay,
      }} />
    ))}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
      backgroundSize: '60px 60px',
    }} />
  </div>
);

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { format, currency } = useCurrency();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data.favorites);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (boardingId) => {
    try {
      await api.delete(`/favorites/${boardingId}`);
      setFavorites(prev => prev.filter(f => f._id !== boardingId));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(160deg, #060f2a, #091428)' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(0,212,170,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)', minHeight: '100vh', color: '#dce9ff', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      <style>{SHARED_CSS}</style>
      <OrbBackground />

      {/* ── Hero Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '110px 0 80px', zIndex: 2 }}>
        <ParticleCanvas />

        {/* Corner glows */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ maxWidth: 1100, position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#dce9ff', borderRadius: 12, padding: '0.55rem 1.2rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.88rem', fontWeight: 600, marginBottom: '2rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,170,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
            <FiArrowLeft size={17} /> Back
          </button>

          <div style={{ animation: 'fadeUp 0.7s ease' }}>
            {/* Glowing heart icon */}
            <div style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
              borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'pulseGlow 3s ease-in-out infinite',
              boxShadow: '0 10px 30px rgba(0,212,170,0.3)',
            }}>
              <FiHeart size={32} color="#fff" fill="#fff" />
            </div>

            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2.8rem', fontWeight: 900, color: '#dce9ff', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
              Saved Places
            </h1>
            <p style={{ color: 'rgba(180,210,255,0.55)', fontSize: '1.05rem', margin: 0 }}>
              Your personal collection of favorite boardings
              {favorites.length > 0 && (
                <span style={{ marginLeft: 12, background: 'rgba(0,212,170,0.12)', color: '#00d4aa', padding: '2px 12px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(0,212,170,0.2)' }}>
                  {favorites.length} saved
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container" style={{ maxWidth: 1100, paddingBottom: '5rem', position: 'relative', zIndex: 5 }}>

        {favorites.length === 0 ? (
          /* Empty State */
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 36,
            padding: '6rem 2rem', textAlign: 'center',
            border: '1px dashed rgba(0,212,170,0.2)',
            backdropFilter: 'blur(16px)',
            animation: 'fadeUp 0.6s ease',
          }}>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,212,170,0.08)', borderRadius: '50%', transform: 'scale(1.4)' }} />
              <div style={{
                width: 88, height: 88,
                background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(0,212,170,0.35)', zIndex: 2,
              }}>
                <FiHeart size={36} color="#fff" />
              </div>
            </div>
            <h3 style={{ fontWeight: 900, color: '#dce9ff', fontSize: '1.9rem', marginBottom: '0.8rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>No favorites yet</h3>
            <p style={{ color: 'rgba(180,210,255,0.45)', maxWidth: 360, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Start exploring boarding places and save the ones that catch your eye!
            </p>
            <Link to="/">
              <button className="reg-submit-btn" style={{ padding: '0.9rem 2.5rem', fontSize: '0.95rem' }}>
                Browse Boardings
              </button>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((boarding, index) => {
              const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;
              return (
                <div key={boarding._id} className="col-12 col-sm-6 col-lg-4" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="fav-card">
                    {/* Image */}
                    <div style={{ height: 210, width: '100%', overflow: 'hidden', position: 'relative' }}>
                      {imageUrl
                        ? <img src={imageUrl} alt={boarding.title} className="fav-img" />
                        : <div style={{ height: '100%', background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,170,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
                      }
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,42,0.65) 0%, transparent 55%)' }} />

                      {/* Room type badge */}
                      <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                          color: '#fff', padding: '4px 12px', borderRadius: 8,
                          fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>{boarding.roomType}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '1.5rem' }}>
                      <h5 style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        fontWeight: 800, color: '#dce9ff', fontSize: '1.15rem',
                        marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{boarding.title}</h5>

                      <p style={{ color: 'rgba(180,210,255,0.5)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.2rem' }}>
                        <FiMapPin size={13} color="#06b6d4" /> {boarding.location}
                      </p>

                      <div style={{ marginBottom: '1.2rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00d4aa', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                          {format(boarding.price)}
                        </span>
                        <span style={{ color: 'rgba(180,210,255,0.4)', fontSize: '0.82rem', marginLeft: 4 }}>/ month</span>
                      </div>

                      {currency.code !== 'LKR' && (
                        <p style={{ fontSize: '0.72rem', color: 'rgba(180,210,255,0.35)', marginTop: '-12px', marginBottom: '16px' }}>
                          ≈ LKR {Number(boarding.price).toLocaleString()} original
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link to={`/boarding/${boarding._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                          <button className="reg-submit-btn" style={{ width: '100%', padding: '0.75rem', borderRadius: 14, margin: 0, fontSize: '0.88rem' }}>
                            <FiEye size={15} /> View Details
                          </button>
                        </Link>
                        <button
                          onClick={() => handleRemove(boarding._id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.2)',
                            padding: '0.75rem', borderRadius: 14, cursor: 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title="Remove from favorites"
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}>
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;