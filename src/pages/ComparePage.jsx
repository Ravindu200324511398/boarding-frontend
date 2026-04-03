import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiX, FiMapPin, FiCheck, FiMinus, FiArrowLeft,
  FiHome, FiSearch, FiInfo, FiBarChart2
} from 'react-icons/fi';
import api from '../api/axios';
import { StarDisplay } from '../components/StarRating';
import { useCurrency } from '../context/CurrencyContext';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const amenityIcons = {
  'WiFi': '📶', 'Water': '💧', 'Electricity': '⚡', 'Kitchen': '🍳', 'Parking': '🚗',
  'Air Conditioning': '❄️', 'Laundry': '👕', 'Security': '🔒', 'CCTV': '📷',
  'Meals Included': '🍽️', 'Meals Available': '🍽️', 'Study Table': '📚', 'Fan': '🌀',
  'Hot Water': '🚿', 'Rooftop': '🏙️', 'Private Bathroom': '🛁', 'WiFi 100Mbps': '📶',
  'Security Gate': '🚪', 'Peaceful Environment': '🌿', 'Meals on Request': '🍽️',
};

const typeColors = {
  Single: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
  Double: { bg: 'rgba(0,212,170,0.15)', color: '#00d4aa' },
  Triple: { bg: 'rgba(45,226,230,0.15)', color: '#2de2e6' },
  Annex:  { bg: 'rgba(8,145,178,0.15)', color: '#0891b2' },
  Other:  { bg: 'rgba(255,255,255,0.08)', color: 'rgba(180,210,255,0.5)' },
};

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .cf { animation: fadeUp 0.5s ease forwards; }

  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.75rem 1.4rem;
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

  .si { background: transparent; transition: all 0.2s; }
  .si:hover { background: rgba(0,212,170,0.08) !important; }

  input::placeholder { color: rgba(180,210,255,0.3); }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(6,15,42,0.95) inset !important;
    -webkit-text-fill-color: rgba(220,235,255,0.9) !important;
  }
  .teal-gradient-text {
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
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
    const particles = Array.from({ length: 32 }, () => ({
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
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── Orb Background ─── */
const OrbBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[
      { w: 600, h: 600, color: '#00d4aa22', top: '-160px', left: '-160px', delay: '0s' },
      { w: 550, h: 550, color: '#0ea5e933', top: '30%', right: '-160px', delay: '-5s' },
      { w: 400, h: 400, color: '#06b6d422', bottom: '-130px', left: '22%', delay: '-9s' },
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

const CompareRow = ({ label, children, alt }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `220px repeat(${React.Children.count(children)}, 1fr)`,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: alt ? 'rgba(0,212,170,0.02)' : 'transparent'
  }}>
    <div style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(180,210,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    </div>
    {children}
  </div>
);

const CellValue = ({ children, highlight }) => (
  <div style={{
    padding: '1.2rem', textAlign: 'center',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    background: highlight ? 'rgba(0,212,170,0.06)' : 'transparent',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease'
  }}>
    {children}
  </div>
);

const ComparePage = () => {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [allBoardings, setAllBoardings] = useState([]);
  const [selected, setSelected] = useState([null, null, null]);
  const [search, setSearch] = useState(['', '', '']);
  const [dropdownOpen, setDropdownOpen] = useState([false, false, false]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/boardings')
      .then(res => setAllBoardings(res.data.boardings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    selected.forEach(b => {
      if (b && !ratingsMap[b._id]) {
        api.get(`/ratings/${b._id}`)
          .then(res => setRatingsMap(prev => ({ ...prev, [b._id]: { avg: res.data.average, total: res.data.total } })))
          .catch(() => {});
      }
    });
  }, [selected]);

  const handleSelect = (idx, boarding) => {
    const u = [...selected]; u[idx] = boarding; setSelected(u);
    const s = [...search]; s[idx] = ''; setSearch(s);
    setDropdownOpen([false, false, false]);
  };
  const handleRemove = (idx) => { const u = [...selected]; u[idx] = null; setSelected(u); };
  const handleSearchChange = (idx, val) => {
    const s = [...search]; s[idx] = val; setSearch(s);
    const d = [false, false, false]; d[idx] = true; setDropdownOpen(d);
  };
  const getFiltered = (idx) => {
    const q = search[idx].toLowerCase();
    const ids = selected.map(b => b?._id).filter(Boolean);
    return allBoardings.filter(b => !ids.includes(b._id) && (b.title.toLowerCase().includes(q) || b.location.toLowerCase().includes(q))).slice(0, 6);
  };

  const allAmenities = [...new Set(selected.filter(Boolean).flatMap(b => b.amenities || []))].sort();
  const filledCount = selected.filter(Boolean).length;
  const prices = selected.map(b => b ? b.price : null);
  const minPrice = Math.min(...prices.filter(Boolean));
  const ratingVals = selected.map(b => b ? (ratingsMap[b._id]?.avg || 0) : null);
  const maxRating = Math.max(...ratingVals.filter(Boolean));

  return (
    <div style={{ background: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)', minHeight: '100vh', color: '#dce9ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{SHARED_CSS}</style>
      <OrbBackground />

      {/* ── Header ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '110px 0 70px', zIndex: 2 }}>
        <ParticleCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#dce9ff', borderRadius: 12, padding: '0.5rem 1.2rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
            fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,170,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
            <FiArrowLeft size={16} /> Back
          </button>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
            borderRadius: 99, padding: '6px 18px', marginBottom: '1.2rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>Side-by-side analysis</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#dce9ff', margin: 0, letterSpacing: '-0.03em', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Compare <span className="teal-gradient-text">Listings</span>
          </h1>
          <p style={{ color: 'rgba(180,210,255,0.55)', margin: '0.6rem 0 0', fontSize: '1.05rem' }}>
            Find your ideal boarding place with a detailed comparison.
          </p>
        </div>
      </div>

      <div className="container cf" style={{ paddingBottom: '5rem', maxWidth: 1200, position: 'relative', zIndex: 5 }}>

        {/* ── Selection Cards ── */}
        <div className="row g-4 mb-5">
          {[0, 1, 2].map(idx => (
            <div key={idx} className="col-md-4">
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 24,
                border: selected[idx] ? '1px solid rgba(0,212,170,0.4)' : '1px dashed rgba(255,255,255,0.12)',
                boxShadow: selected[idx] ? '0 10px 40px rgba(0,212,170,0.12)' : 'none',
                position: 'relative',
                overflow: selected[idx] ? 'hidden' : 'visible',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(12px)',
                zIndex: dropdownOpen[idx] ? 100 : 1
              }}>
                {selected[idx] ? (
                  <div>
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                      {selected[idx].image
                        ? <img src={`${IMAGE_BASE}${selected[idx].image}`} alt={selected[idx].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(0,212,170,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #060f2a, transparent)' }} />
                      <button onClick={() => handleRemove(idx)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}>
                        <FiX size={16} />
                      </button>
                      {(() => { const tc = typeColors[selected[idx].roomType] || typeColors.Other; return (
                        <span style={{ position: 'absolute', bottom: 12, left: 14, background: tc.bg, color: tc.color, padding: '0.3rem 0.8rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800, border: `1px solid ${tc.color}33` }}>{selected[idx].roomType}</span>
                      ); })()}
                    </div>
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#dce9ff', marginBottom: '0.4rem', lineHeight: 1.3 }}>{selected[idx].title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(180,210,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
                        <FiMapPin size={12} color="#06b6d4" />{selected[idx].location}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00d4aa', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                        {format(selected[idx].price)}<span style={{ fontSize: '0.8rem', color: 'rgba(180,210,255,0.4)', fontWeight: 400 }}> / mo</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '2.5rem 1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ width: 60, height: 60, background: 'rgba(0,212,170,0.08)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 800, color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{idx + 1}</div>
                      <p style={{ color: 'rgba(180,210,255,0.45)', fontSize: '0.85rem', margin: 0 }}>Search for a boarding</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,210,255,0.4)', zIndex: 10 }} size={15} />
                      <input
                        type="text"
                        placeholder="Search boarding..."
                        value={search[idx]}
                        onChange={e => handleSearchChange(idx, e.target.value)}
                        onFocus={() => { const d = [false, false, false]; d[idx] = true; setDropdownOpen(d); }}
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                          padding: '0.75rem 1rem 0.75rem 2.6rem',
                          fontSize: '0.88rem', outline: 'none', color: '#dce9ff',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      />
                      {dropdownOpen[idx] && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
                          background: '#0d1b3e', borderRadius: 16,
                          border: '1px solid rgba(0,212,170,0.25)',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                          zIndex: 1000, overflow: 'hidden', maxHeight: 280,
                        }}>
                          {loading ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(180,210,255,0.4)', fontSize: '0.85rem' }}>Fetching data...</div>
                          ) : getFiltered(idx).length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(180,210,255,0.4)', fontSize: '0.85rem' }}>No matches found</div>
                          ) : (
                            getFiltered(idx).map(b => (
                              <div key={b._id} className="si"
                                style={{ padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                onMouseDown={e => { e.preventDefault(); handleSelect(idx, b); }}>
                                {b.image
                                  ? <img src={`${IMAGE_BASE}${b.image}`} alt={b.title} style={{ width: 45, height: 38, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                  : <div style={{ width: 45, height: 38, background: 'rgba(0,212,170,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏠</div>}
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dce9ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'rgba(180,210,255,0.45)' }}>{b.location}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {dropdownOpen.some(Boolean) && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen([false, false, false])} />}

        {/* ── Comparison Table ── */}
        {filledCount >= 2 ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 28, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden', backdropFilter: 'blur(16px)',
          }}>
            {/* Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: `220px repeat(${filledCount},1fr)`, background: 'rgba(0,212,170,0.06)', borderBottom: '1px solid rgba(0,212,170,0.15)' }}>
              <div style={{ padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.06)' }} />
              {selected.filter(Boolean).map((b, i) => (
                <div key={b._id} style={{ padding: '1.5rem', borderRight: i < filledCount - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#dce9ff', lineHeight: 1.3, marginBottom: '0.4rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{b.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(180,210,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <FiMapPin size={11} color="#00d4aa" />{b.location}
                  </div>
                </div>
              ))}
            </div>

            {/* Rent */}
            <CompareRow label="💰 Rent / Month">
              {selected.filter(Boolean).map(b => (
                <CellValue key={b._id} highlight={b.price === minPrice}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: b.price === minPrice ? '#00d4aa' : '#dce9ff', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {format(b.price)}
                  </div>
                  {b.price === minPrice && filledCount > 1 && (
                    <span style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 8, marginTop: '0.5rem', display: 'inline-block', border: '1px solid rgba(0,212,170,0.25)' }}>BEST PRICE</span>
                  )}
                </CellValue>
              ))}
            </CompareRow>

            {/* Category */}
            <CompareRow label="🏠 Category" alt>
              {selected.filter(Boolean).map(b => {
                const tc = typeColors[b.roomType] || typeColors.Other;
                return (
                  <CellValue key={b._id}>
                    <span style={{ background: tc.bg, color: tc.color, padding: '0.4rem 1rem', borderRadius: 10, fontSize: '0.78rem', fontWeight: 800, border: `1px solid ${tc.color}33` }}>
                      {b.roomType}
                    </span>
                  </CellValue>
                );
              })}
            </CompareRow>

            {/* Rating */}
            <CompareRow label="⭐ Rating">
              {selected.filter(Boolean).map(b => {
                const r = ratingsMap[b._id];
                const isTop = r?.avg && r.avg === maxRating && maxRating > 0;
                return (
                  <CellValue key={b._id} highlight={isTop}>
                    {r && r.total > 0 ? (
                      <div>
                        <StarDisplay rating={r.avg} size={18} />
                        <div style={{ fontSize: '0.78rem', color: 'rgba(180,210,255,0.45)', marginTop: '0.4rem' }}>{r.total} review{r.total !== 1 ? 's' : ''}</div>
                        {isTop && filledCount > 1 && (
                          <span style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 8, marginTop: '0.5rem', display: 'inline-block', border: '1px solid rgba(14,165,233,0.25)' }}>TOP RATED</span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(180,210,255,0.25)', fontSize: '0.82rem' }}>No reviews</span>
                    )}
                  </CellValue>
                );
              })}
            </CompareRow>

            {/* Amenities count */}
            <CompareRow label="✨ Amenities" alt>
              {selected.filter(Boolean).map(b => {
                const count = b.amenities?.length || 0;
                const maxCount = Math.max(...selected.filter(Boolean).map(x => x.amenities?.length || 0));
                return (
                  <CellValue key={b._id} highlight={count === maxCount && maxCount > 0}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: count === maxCount ? '#2de2e6' : '#dce9ff', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(180,210,255,0.45)', marginTop: '-2px' }}>Features included</div>
                  </CellValue>
                );
              })}
            </CompareRow>

            {/* Contact */}
            <CompareRow label="👤 Contact Info">
              {selected.filter(Boolean).map(b => (
                <CellValue key={b._id}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#dce9ff' }}>{b.contact || b.owner?.name || '—'}</span>
                </CellValue>
              ))}
            </CompareRow>

            {/* Detailed Amenities */}
            {allAmenities.length > 0 && (
              <>
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,212,170,0.04)', borderTop: '1px solid rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiCheck color="#00d4aa" size={15} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'rgba(180,210,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detailed Amenities Check</span>
                </div>
                {allAmenities.map((amenity, i) => (
                  <CompareRow key={amenity} label={`${amenityIcons[amenity] || '•'} ${amenity}`} alt={i % 2 === 0}>
                    {selected.filter(Boolean).map(b => {
                      const has = b.amenities?.includes(amenity);
                      return (
                        <CellValue key={b._id}>
                          {has
                            ? <div style={{ width: 32, height: 32, background: 'rgba(0,212,170,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(0,212,170,0.25)' }}><FiCheck size={17} color="#00d4aa" /></div>
                            : <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(255,255,255,0.06)' }}><FiMinus size={17} color="rgba(180,210,255,0.15)" /></div>
                          }
                        </CellValue>
                      );
                    })}
                  </CompareRow>
                ))}
              </>
            )}

            {/* Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: `220px repeat(${filledCount},1fr)`, borderTop: '1px solid rgba(0,212,170,0.12)', background: 'rgba(0,212,170,0.03)' }}>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'rgba(180,210,255,0.4)', textTransform: 'uppercase' }}>Actions</span>
              </div>
              {selected.filter(Boolean).map(b => (
                <div key={b._id} style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <Link to={`/boarding/${b._id}`}>
                    <button className="reg-submit-btn" style={{ padding: '0.65rem 1.3rem', borderRadius: 12, fontSize: '0.82rem' }}>
                      <FiHome size={14} /> View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Empty State ── */
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 32,
            border: '1px dashed rgba(0,212,170,0.2)',
            padding: '5rem 2rem', textAlign: 'center',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ width: 100, height: 100, background: 'rgba(0,212,170,0.08)', borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(0,212,170,0.18)' }}>
              <FiBarChart2 size={38} color="#00d4aa" />
            </div>
            <h3 style={{ fontWeight: 900, color: '#dce9ff', marginBottom: '1rem', fontSize: '1.8rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Ready to compare?</h3>
            <p style={{ color: 'rgba(180,210,255,0.45)', margin: '0 auto 2.5rem', maxWidth: 400 }}>
              Pick at least two listings to compare prices, ratings, and features side by side.
            </p>
            <Link to="/">
              <button className="reg-submit-btn" style={{ padding: '1rem 2.5rem' }}>
                Browse Listings
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;