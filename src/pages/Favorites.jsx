import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiEye, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

const getTokens = (isDark) => isDark ? {
  bg: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)',
  text: '#dce9ff', textMuted: 'rgba(180,210,255,0.55)', textSub: 'rgba(180,210,255,0.4)',
  heading: '#dce9ff',
  emptyBg: 'rgba(255,255,255,0.03)', emptyBorder: 'rgba(0,212,170,0.2)',
  cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.08)',
  cardHoverBorder: 'rgba(0,212,170,0.3)',
  imgPlaceholderBg: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,170,0.1))',
  backBtnBg: 'rgba(255,255,255,0.06)', backBtnBorder: 'rgba(255,255,255,0.12)',
  backBtnColor: '#dce9ff', backBtnHoverBg: 'rgba(0,212,170,0.1)',
  removeBtnBg: 'rgba(239,68,68,0.1)', removeBtnColor: '#f87171',
  removeBtnBorder: 'rgba(239,68,68,0.2)', removeBtnHoverBg: 'rgba(239,68,68,0.2)',
  removeBtnHoverBorder: 'rgba(239,68,68,0.4)',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  priceColor: '#00d4aa', monthColor: 'rgba(180,210,255,0.4)',
  locationColor: 'rgba(180,210,255,0.5)',
  savedBadgeBg: 'rgba(0,212,170,0.12)', savedBadgeColor: '#00d4aa', savedBadgeBorder: 'rgba(0,212,170,0.2)',
  orbColors: ['#00d4aa22', '#0ea5e933', '#06b6d422', '#2de2e611'],
  gridLine: 'rgba(255,255,255,.018)',
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
  currencyNote: 'rgba(180,210,255,0.35)',
} : {
  bg: 'linear-gradient(160deg, #e8f0fe 0%, #f0f7ff 40%, #e6f7fa 100%)',
  text: '#0d1f3c', textMuted: '#4a6080', textSub: '#6a8aaa',
  heading: '#0d1f3c',
  emptyBg: 'rgba(255,255,255,0.8)', emptyBorder: 'rgba(0,112,192,0.2)',
  cardBg: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,112,192,0.1)',
  cardHoverBorder: 'rgba(0,112,192,0.3)',
  imgPlaceholderBg: 'linear-gradient(135deg, rgba(0,112,192,0.1), rgba(0,180,216,0.07))',
  backBtnBg: 'rgba(255,255,255,0.7)', backBtnBorder: 'rgba(0,112,192,0.15)',
  backBtnColor: '#1a2a4a', backBtnHoverBg: 'rgba(0,112,192,0.08)',
  removeBtnBg: 'rgba(239,68,68,0.06)', removeBtnColor: '#dc2626',
  removeBtnBorder: 'rgba(239,68,68,0.15)', removeBtnHoverBg: 'rgba(239,68,68,0.12)',
  removeBtnHoverBorder: 'rgba(239,68,68,0.3)',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  priceColor: '#0070c0', monthColor: '#7a9ab8',
  locationColor: '#4a6080',
  savedBadgeBg: 'rgba(0,112,192,0.1)', savedBadgeColor: '#0070c0', savedBadgeBorder: 'rgba(0,112,192,0.2)',
  orbColors: ['#0070c018', '#00b4d812', '#0096c710', '#48cae40a'],
  gridLine: 'rgba(0,112,192,.025)',
  particleColors: ['#0070c0', '#00b4d8', '#0096c7', '#0077b6', '#48cae4'],
  currencyNote: '#7a9ab8',
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(40px,-50px) scale(1.07);} 66%{transform:translate(-25px,30px) scale(0.95);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmerBtn { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(0,180,192,0.3);} 50%{box-shadow:0 0 40px rgba(0,180,192,0.6);} }

  .browse-btn {
    border:none; border-radius:14px; padding:0.8rem 1.4rem;
    font-weight:800; font-size:0.9rem; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    background:linear-gradient(135deg, ${t.accent} 0%, #2de2e6 40%, ${t.accentSecondary} 80%);
    background-size:300% 300%; color:#fff;
    box-shadow:0 6px 24px rgba(0,180,192,0.3);
    transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
    display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
    animation:shimmerBtn 5s linear infinite;
  }
  .browse-btn:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 12px 36px rgba(0,180,192,0.45); }

  .fav-card {
    animation:slideUp 0.4s ease-out forwards;
    transition:transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border:1px solid ${t.cardBorder}; background:${t.cardBg};
    border-radius:24px; overflow:hidden; backdrop-filter:blur(16px);
  }
  .fav-card:hover { transform:translateY(-10px); box-shadow:0 24px 50px rgba(0,0,0,0.15); border-color:${t.cardHoverBorder} !important; }
  .fav-card:hover .fav-img { transform:scale(1.05); }
  .fav-img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease; }
`;

const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.55 - 0.2, alpha: Math.random() * 0.5 + 0.2,
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

const Favorites = () => {
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { format, currency } = useCurrency();

  useEffect(() => {
    api.get('/favorites').then(res => setFavorites(res.data.favorites)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (boardingId) => {
    try { await api.delete(`/favorites/${boardingId}`); setFavorites(prev => prev.filter(f => f._id !== boardingId)); }
    catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: t.bg }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${isDark ? 'rgba(0,212,170,0.2)' : 'rgba(0,112,192,0.2)'}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      <style>{getCSS(t)}</style>

      {/* Orb background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((color, i) => {
          const pos = [{ top: '-200px', left: '-200px' }, { top: '30%', right: '-180px' }, { bottom: '-140px', left: '20%' }, { top: '60%', left: '60%' }];
          const sizes = [650, 550, 450, 300]; const delays = ['0s', '-5s', '-9s', '-7s'];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: 'blur(80px)', ...pos[i], animation: `orbFloat 16s ease-in-out infinite`, animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Hero Header */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '110px 0 80px', zIndex: 2 }}>
        <ParticleCanvas colors={t.particleColors} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ maxWidth: 1100, position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} style={{ background: t.backBtnBg, border: `1px solid ${t.backBtnBorder}`, color: t.backBtnColor, borderRadius: 12, padding: '0.55rem 1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, marginBottom: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = t.backBtnHoverBg}
            onMouseLeave={e => e.currentTarget.style.background = t.backBtnBg}>
            <FiArrowLeft size={17} /> Back
          </button>

          <div style={{ animation: 'fadeUp 0.7s ease' }}>
            <div style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', animation: 'pulseGlow 3s ease-in-out infinite', boxShadow: '0 10px 30px rgba(0,180,192,0.25)' }}>
              <FiHeart size={32} color="#fff" fill="#fff" />
            </div>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2.8rem', fontWeight: 900, color: t.heading, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Saved Places</h1>
            <p style={{ color: t.textMuted, fontSize: '1.05rem', margin: 0 }}>
              Your personal collection of favorite boardings
              {favorites.length > 0 && (
                <span style={{ marginLeft: 12, background: t.savedBadgeBg, color: t.savedBadgeColor, padding: '2px 12px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700, border: `1px solid ${t.savedBadgeBorder}` }}>
                  {favorites.length} saved
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: 1100, paddingBottom: '5rem', position: 'relative', zIndex: 5 }}>
        {favorites.length === 0 ? (
          <div style={{ background: t.emptyBg, borderRadius: 36, padding: '6rem 2rem', textAlign: 'center', border: `1px dashed ${t.emptyBorder}`, backdropFilter: 'blur(16px)', animation: 'fadeUp 0.6s ease' }}>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: `rgba(0,180,192,0.08)`, borderRadius: '50%', transform: 'scale(1.4)' }} />
              <div style={{ width: 88, height: 88, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,180,192,0.3)', zIndex: 2 }}>
                <FiHeart size={36} color="#fff" />
              </div>
            </div>
            <h3 style={{ fontWeight: 900, color: t.heading, fontSize: '1.9rem', marginBottom: '0.8rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>No favorites yet</h3>
            <p style={{ color: t.textMuted, maxWidth: 360, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>Start exploring boarding places and save the ones that catch your eye!</p>
            <Link to=""><button className="browse-btn" style={{ padding: '0.9rem 2.5rem', fontSize: '0.95rem' }}>Browse Boardings</button></Link>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((boarding, index) => {
              const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;
              return (
                <div key={boarding._id} className="col-12 col-sm-6 col-lg-4" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="fav-card">
                    <div style={{ height: 210, width: '100%', overflow: 'hidden', position: 'relative' }}>
                      {imageUrl
                        ? <img src={imageUrl} alt={boarding.title} className="fav-img" />
                        : <div style={{ height: '100%', background: t.imgPlaceholderBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,42,0.5) 0%, transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                        <span style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`, color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{boarding.roomType}</span>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, fontSize: '1.15rem', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.title}</h5>
                      <p style={{ color: t.locationColor, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.2rem' }}>
                        <FiMapPin size={13} color={t.accentSecondary} /> {boarding.location}
                      </p>
                      <div style={{ marginBottom: '1.2rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: t.priceColor, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{format(boarding.price)}</span>
                        <span style={{ color: t.monthColor, fontSize: '0.82rem', marginLeft: 4 }}>/ month</span>
                      </div>
                      {currency.code !== 'LKR' && (
                        <p style={{ fontSize: '0.72rem', color: t.currencyNote, marginTop: '-12px', marginBottom: '16px' }}>≈ LKR {Number(boarding.price).toLocaleString()} original</p>
                      )}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link to={`/boarding/${boarding._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                          <button className="browse-btn" style={{ width: '100%', padding: '0.75rem', borderRadius: 14, margin: 0, fontSize: '0.88rem' }}>
                            <FiEye size={15} /> View Details
                          </button>
                        </Link>
                        <button onClick={() => handleRemove(boarding._id)}
                          style={{ background: t.removeBtnBg, color: t.removeBtnColor, border: `1px solid ${t.removeBtnBorder}`, padding: '0.75rem', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove from favorites"
                          onMouseEnter={e => { e.currentTarget.style.background = t.removeBtnHoverBg; e.currentTarget.style.borderColor = t.removeBtnHoverBorder; }}
                          onMouseLeave={e => { e.currentTarget.style.background = t.removeBtnBg; e.currentTarget.style.borderColor = t.removeBtnBorder; }}>
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