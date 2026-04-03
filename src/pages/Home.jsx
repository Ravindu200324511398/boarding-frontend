
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiHeart, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../api/axios';
import { StarDisplay } from '../components/StarRating';

/* ─── Shared CSS ─── */
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes houseFloat {
    0%,100% { transform: rotateX(4deg) rotateY(-6deg) translateY(0px); }
    50%      { transform: rotateX(-4deg) rotateY(6deg) translateY(-14px); }
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
  @keyframes spin { to { transform: rotate(360deg); } }

  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.85rem 1.5rem;
    font-weight: 800; font-size: 0.95rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%;
    color: #fff;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
  }
  .reg-submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,212,170,0.5);
  }
  .reg-submit-btn:active:not(:disabled) { transform: scale(0.97); }
  .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  input::placeholder { color: rgba(210,228,255,0.35); }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(10,20,50,0.95) inset !important;
    -webkit-text-fill-color: rgba(220,235,255,0.9) !important;
  }
  select option { background: #0d1b3e; color: #dce9ff; }
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
    const particles = Array.from({ length: 45 }, () => ({
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

/* ─── Floating Orbs Background ─── */
const OrbBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[
      { w: 700, h: 700, color: '#00d4aa22', top: '-200px', left: '-200px', delay: '0s' },
      { w: 600, h: 600, color: '#0ea5e933', top: '20%', right: '-180px', delay: '-5s' },
      { w: 500, h: 500, color: '#06b6d422', bottom: '-150px', left: '20%', delay: '-9s' },
      { w: 400, h: 400, color: '#0891b222', top: '55%', left: '55%', delay: '-6s' },
      { w: 350, h: 350, color: '#2de2e611', top: '40%', left: '30%', delay: '-12s' },
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

/* ─── Boarding Card ─── */
const BoardingCard = ({ boarding, onFavorite, favorites }) => {
  const isFav = favorites.includes(boarding._id);
  const { isAuth } = useAuth();
  const { format } = useCurrency();
  const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;

  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.borderColor = 'rgba(0,212,170,0.4)';
          e.currentTarget.style.boxShadow = '0 24px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,212,170,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          {imageUrl
            ? <img src={imageUrl} alt={boarding.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,170,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,20,50,0.6) 0%, transparent 60%)' }} />

          {isAuth && (
            <button onClick={() => onFavorite(boarding._id, isFav)} style={{
              position: 'absolute', top: 14, right: 14,
              background: isFav ? 'rgba(239,68,68,0.85)' : 'rgba(8,20,50,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease'
            }}>
              <FiHeart fill={isFav ? 'white' : 'transparent'} size={17} />
            </button>
          )}

          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span style={{
              background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
              color: '#fff', padding: '4px 12px', borderRadius: 8,
              fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{boarding.roomType}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h5 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 800, color: '#dce9ff', fontSize: '1.15rem',
            marginBottom: '0.5rem', letterSpacing: '-0.01em'
          }}>{boarding.title}</h5>

          {boarding.avgRating > 0 && (
            <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarDisplay rating={boarding.avgRating} size={13} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(180,210,255,0.5)' }}>({boarding.totalRatings})</span>
            </div>
          )}

          <p style={{ color: 'rgba(180,210,255,0.55)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 7, marginBottom: '1.2rem' }}>
            <FiMapPin size={13} color="#06b6d4" /> {boarding.location}
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(180,210,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Monthly</span>
              <p style={{ margin: 0, fontWeight: 800, color: '#00d4aa', fontSize: '1.4rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {format(boarding.price)}
              </p>
            </div>
            <Link to={`/boarding/${boarding._id}`} style={{ textDecoration: 'none' }}>
              <button className="reg-submit-btn" style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', borderRadius: 12, margin: 0 }}>
                <FiEye size={15} /> View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Home Component ─── */
const Home = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ search: '', location: '', minPrice: '', maxPrice: '', roomType: '' });
  const [heroSearch, setHeroSearch] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const fetchBoardings = useCallback(async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (appliedFilters.search)   params.search   = appliedFilters.search;
      if (appliedFilters.location) params.location = appliedFilters.location;
      if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
      if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;
      if (appliedFilters.roomType) params.roomType = appliedFilters.roomType;
      const res = await api.get('/boardings', { params });
      setBoardings(res.data.boardings);
      setStats({ total: res.data.count });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  const fetchFavorites = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.favorites.map(f => f._id));
    } catch {}
  }, [isAuth]);

  useEffect(() => { fetchBoardings(); fetchFavorites(); }, [fetchBoardings, fetchFavorites]);

  const handleFavorite = async (boardingId, isFav) => {
    if (!isAuth) { navigate('/login'); return; }
    try {
      if (isFav) { await api.delete(`/favorites/${boardingId}`); setFavorites(p => p.filter(id => id !== boardingId)); }
      else { await api.post(`/favorites/${boardingId}`); setFavorites(p => [...p, boardingId]); }
    } catch {}
  };

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleApplyFilters = () => fetchBoardings(filters);
  const handleClearFilters = () => {
    const cleared = { search: '', location: '', minPrice: '', maxPrice: '', roomType: '' };
    setFilters(cleared); setHeroSearch(''); fetchBoardings(cleared);
  };
  const handleHeroSearch = e => {
    e.preventDefault();
    const updated = { ...filters, search: heroSearch };
    setFilters(updated); fetchBoardings(updated);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const inputGlassStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#dce9ff',
    padding: '0.7rem 1rem', fontSize: '0.88rem',
    outline: 'none', width: '100%',
    transition: 'border-color 0.3s ease',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div style={{ background: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)', minHeight: '100vh', color: '#dce9ff', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{SHARED_CSS}</style>
      <OrbBackground />

      {/* ── Hero ── */}
      <section style={{ padding: '140px 0 110px', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
        <ParticleCanvas />
        <div className="container position-relative" style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
            borderRadius: 99, padding: '6px 18px', marginBottom: '2rem',
            animation: 'fadeUp 0.6s ease',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>Over 2,000+ verified listings live now</span>
          </div>

          <h1 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05,
            marginBottom: '1.5rem', color: '#dce9ff',
            animation: 'fadeUp 0.8s ease 0.1s both'
          }}>
            Find Your Next <br />
            <span style={{
              background: 'linear-gradient(90deg, #00d4aa, #2de2e6, #0ea5e9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto', animation: 'shimmerBtn 4s linear infinite'
            }}>Perfect Stay</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'rgba(180,210,255,0.6)', maxWidth: 620, margin: '0 auto 3rem', animation: 'fadeUp 0.8s ease 0.2s both', lineHeight: 1.65 }}>
            Discover high-quality, verified boarding places near university hubs across Sri Lanka.
          </p>

          <form onSubmit={handleHeroSearch} style={{
            maxWidth: 760, margin: '0 auto',
            display: 'flex', gap: 12,
            background: 'rgba(255,255,255,0.04)',
            padding: 12, borderRadius: 24,
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeUp 0.8s ease 0.3s both',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <FiSearch color="#00d4aa" size={20} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Where do you want to live? (e.g. Moratuwa)"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#dce9ff', width: '100%', padding: '12px 14px', outline: 'none', fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
            <button type="submit" className="reg-submit-btn" style={{ padding: '0 32px', height: 52, borderRadius: 16, margin: 0, fontSize: '0.95rem', flexShrink: 0 }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        <div className="row g-4 justify-content-center">
          {[
            { num: stats.total || '2K+', label: 'Boarding Houses', color: '#00d4aa' },
            { num: 'Verified', label: 'Safety First', color: '#2de2e6' },
            { num: '0%', label: 'Listing Fees', color: '#0ea5e9' },
          ].map((s, i) => (
            <div key={i} className="col-12 col-md-3">
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24, padding: '1.8rem', textAlign: 'center',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${s.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: s.color, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.num}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(180,210,255,0.45)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 8, fontWeight: 700 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container py-5" id="listings" style={{ position: 'relative', zIndex: 5 }}>

        {/* Filters */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28, padding: '2rem',
          marginBottom: '3.5rem',
          backdropFilter: 'blur(16px)',
        }}>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <FiSearch size={13} /> Keywords
              </label>
              <input type="text" name="search" style={inputGlassStyle} placeholder="WiFi, AC, Single..." value={filters.search} onChange={handleFilterChange} />
            </div>
            <div className="col-12 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <FiMapPin size={13} /> Location
              </label>
              <input type="text" name="location" style={inputGlassStyle} placeholder="City name..." value={filters.location} onChange={handleFilterChange} />
            </div>
            <div className="col-6 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Price</label>
              <input type="number" name="minPrice" style={inputGlassStyle} placeholder="LKR" value={filters.minPrice} onChange={handleFilterChange} />
            </div>
            <div className="col-6 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Price</label>
              <input type="number" name="maxPrice" style={inputGlassStyle} placeholder="LKR" value={filters.maxPrice} onChange={handleFilterChange} />
            </div>
            <div className="col-12 col-md-2">
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(180,210,255,0.5)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Room Type</label>
              <select name="roomType" style={{ ...inputGlassStyle, cursor: 'pointer' }} value={filters.roomType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option>Single</option><option>Double</option>
                <option>Triple</option><option>Annex</option><option>Other</option>
              </select>
            </div>
            <div className="col-12 col-md-1">
              <button className="reg-submit-btn" onClick={handleApplyFilters} style={{ height: 46, width: '100%', margin: 0, padding: 0, borderRadius: 12 }}>
                <FiFilter size={18} />
              </button>
            </div>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'rgba(180,210,255,0.35)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Reset all filters
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '2rem', marginBottom: 4, color: '#dce9ff' }}>
              {loading ? 'Curating Results...' : 'Available Listings'}
            </h2>
            <p style={{ color: 'rgba(180,210,255,0.45)', margin: 0, fontSize: '0.9rem' }}>
              {boardings.length} properties found matching your criteria
            </p>
          </div>
          {isAuth && (
            <Link to="/add">
              <button className="reg-submit-btn" style={{ fontSize: '0.88rem', padding: '0.75rem 1.4rem', margin: 0 }}>
                + List Your Property
              </button>
            </Link>
          )}
        </div>

        {/* Boardings Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(0,212,170,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : boardings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 40, border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'grayscale(1)' }}>🏙️</div>
            <h3 style={{ fontWeight: 800, color: '#dce9ff' }}>No results found</h3>
            <p style={{ color: 'rgba(180,210,255,0.5)', maxWidth: 400, margin: '0 auto' }}>Try broadening your search criteria.</p>
          </div>
        ) : (
          <div className="row g-4">
            {boardings.map((b, index) => (
              <div key={b._id} className="col-12 col-sm-6 col-lg-4" style={{ animation: `fadeUp 0.6s ease ${index * 0.08}s both` }}>
                <BoardingCard boarding={b} onFavorite={handleFavorite} favorites={favorites} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'rgba(180,210,255,0.2)', fontSize: '0.8rem', position: 'relative', zIndex: 5 }}>
        &copy; 2026 Boarding Finder Sri Lanka. All rights reserved.
      </div>
    </div>
  );
};

export default Home;