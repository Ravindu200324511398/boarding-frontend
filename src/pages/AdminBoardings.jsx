import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTrash2, FiEye, FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import { useTheme } from '../context/ThemeContext';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const getTokens = (isDark) => isDark ? {
  pageBg: '#060f2a',
  heading: '#dce9ff',
  textMuted: 'rgba(220,233,255,0.45)',
  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.09)',
  cardHoverBg: 'rgba(255,255,255,0.07)',
  cardHoverBorder: 'rgba(0,212,170,0.3)',
  cardHoverShadow: '0 4px 24px rgba(0,212,170,0.1)',
  promotedBorder: 'rgba(251,191,36,0.4)',
  promotedShadow: '0 4px 20px rgba(251,191,36,0.12)',
  filterBg: 'rgba(255,255,255,0.05)',
  filterBorder: 'rgba(255,255,255,0.1)',
  searchBg: 'rgba(255,255,255,0.05)',
  searchBorder: 'rgba(255,255,255,0.1)',
  inputColor: 'rgba(220,233,255,0.9)',
  inputPlaceholder: 'rgba(220,233,255,0.3)',
  selectBg: 'rgba(255,255,255,0.06)',
  selectBorder: 'rgba(255,255,255,0.12)',
  selectColor: 'rgba(220,233,255,0.8)',
  pillActive: 'linear-gradient(135deg,#00d4aa,#0ea5e9)',
  pillInactiveBg: 'rgba(255,255,255,0.07)',
  pillInactiveColor: 'rgba(220,233,255,0.5)',
  accent: '#00d4aa',
  orbColors: ['#0ea5e928', '#06b6d425', '#00d4aa1a'],
  gridLine: 'rgba(255,255,255,.02)',
  titleColor: '#dce9ff',
  locationColor: 'rgba(220,233,255,0.5)',
  ownerColor: 'rgba(220,233,255,0.4)',
} : {
  pageBg: '#f0f4ff',
  heading: '#0d1f3c',
  textMuted: '#4a6080',
  cardBg: 'rgba(255,255,255,0.9)',
  cardBorder: 'rgba(0,112,192,0.1)',
  cardHoverBg: 'rgba(255,255,255,0.98)',
  cardHoverBorder: 'rgba(0,112,192,0.3)',
  cardHoverShadow: '0 4px 24px rgba(0,112,192,0.1)',
  promotedBorder: 'rgba(251,191,36,0.5)',
  promotedShadow: '0 4px 20px rgba(251,191,36,0.15)',
  filterBg: 'rgba(255,255,255,0.8)',
  filterBorder: 'rgba(0,112,192,0.12)',
  searchBg: 'rgba(255,255,255,0.9)',
  searchBorder: 'rgba(0,112,192,0.15)',
  inputColor: '#1a2a4a',
  inputPlaceholder: '#8aa0c0',
  selectBg: 'rgba(255,255,255,0.9)',
  selectBorder: 'rgba(0,112,192,0.2)',
  selectColor: '#1a2a4a',
  pillActive: 'linear-gradient(135deg,#0070c0,#00b4d8)',
  pillInactiveBg: 'rgba(0,112,192,0.07)',
  pillInactiveColor: '#6a86a8',
  accent: '#0070c0',
  orbColors: ['#0070c018', '#00b4d810', '#0096c70c'],
  gridLine: 'rgba(0,112,192,.02)',
  titleColor: '#0d1f3c',
  locationColor: '#4a6080',
  ownerColor: '#6a86a8',
};

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
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
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
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const AdminBoardings = () => {
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const [boardings, setBoardings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [promotingId, setPromotingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [promoteFilter, setPromoteFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, id: null, title: '' });

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-40px) scale(1.06);} 66%{transform:translate(-20px,25px) scale(0.96);} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
    .ab-card { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:14px; padding:1rem 1.2rem; display:flex; align-items:center; gap:1rem; transition:all 0.25s ease; position:relative; animation:fadeUp 0.4s ease both; }
    .ab-card:hover { background:${t.cardHoverBg}; border-color:${t.cardHoverBorder}; box-shadow:${t.cardHoverShadow}; transform:translateY(-1px); }
    .ab-card.promoted { border-color:${t.promotedBorder}; box-shadow:${t.promotedShadow}; }
    .filter-input { border:none; outline:none; flex:1; font-size:0.9rem; background:transparent; color:${t.inputColor}; font-family:'Plus Jakarta Sans',sans-serif; }
    .filter-input::placeholder { color:${t.inputPlaceholder}; }
    .filter-select { border:1.5px solid ${t.selectBorder}; border-radius:10px; padding:0.5rem 0.8rem; font-size:0.875rem; color:${t.selectColor}; background:${t.selectBg}; outline:none; font-family:'Plus Jakarta Sans',sans-serif; }
    .pill-btn { padding:0.4rem 1rem; border-radius:50px; font-size:0.82rem; font-weight:700; border:none; cursor:pointer; transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif; }
    .pill-btn.active { background:${t.pillActive}; color:#fff; }
    .pill-btn.inactive { background:${t.pillInactiveBg}; color:${t.pillInactiveColor}; }
    .action-btn { border:none; border-radius:8px; padding:0.45rem 0.9rem; cursor:pointer; display:flex; align-items:center; gap:0.4rem; font-size:0.82rem; font-weight:700; transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif; text-decoration:none; }
    .btn-promote { background:rgba(251,191,36,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.3); }
    .btn-promote.active { background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; border-color:transparent; }
    .btn-view { background:rgba(14,165,233,0.12); color:#38bdf8; border:1px solid rgba(14,165,233,0.25); }
    .btn-delete { background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.25); }
    .amenity-tag { background:rgba(0,212,170,0.1); color:#00d4aa; padding:0.12rem 0.55rem; border-radius:20px; font-size:0.7rem; font-weight:600; }
    .type-badge { padding:0.15rem 0.65rem; border-radius:20px; font-size:0.72rem; font-weight:700; }
  `;

  useEffect(() => {
    api.get('/admin/boardings')
      .then(res => { setBoardings(res.data.boardings); setFiltered(res.data.boardings); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = boardings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.owner?.name?.toLowerCase().includes(q));
    }
    if (typeFilter) result = result.filter(b => b.roomType === typeFilter);
    if (promoteFilter === 'promoted') result = result.filter(b => b.isPromoted);
    if (promoteFilter === 'normal') result = result.filter(b => !b.isPromoted);
    setFiltered(result);
  }, [search, typeFilter, promoteFilter, boardings]);

  const openDeleteModal = (id, title) => setModal({ open: true, id, title });
  const closeModal = () => setModal({ open: false, id: null, title: '' });

  const handleDelete = async () => {
    setDeletingId(modal.id);
    try {
      await api.delete(`/admin/boardings/${modal.id}`);
      setBoardings(prev => prev.filter(b => b._id !== modal.id));
      closeModal();
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleTogglePromote = async (id) => {
    setPromotingId(id);
    try {
      const res = await api.patch(`/admin/boardings/${id}/toggle-promote`);
      setBoardings(prev => prev.map(b => b._id === id ? { ...b, isPromoted: res.data.isPromoted } : b));
    } catch (err) { alert(err.response?.data?.message || 'Failed to update'); }
    finally { setPromotingId(null); }
  };

  const typeColorMap = {
    Single: ['rgba(59,130,246,0.15)', '#60a5fa'],
    Double: ['rgba(16,185,129,0.15)', '#34d399'],
    Triple: ['rgba(251,191,36,0.15)', '#fbbf24'],
    Annex: ['rgba(167,139,250,0.15)', '#a78bfa'],
    Other: ['rgba(148,163,184,0.15)', '#94a3b8'],
  };

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style key={isDark ? 'dark' : 'light'}>{CSS}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((color, i) => {
          const pos = [{ top: '-200px', left: '-150px' }, { top: '40%', right: '-150px' }, { bottom: '-100px', left: '30%' }];
          const sizes = [600, 500, 350]; const delays = ['0s', '-6s', '-11s'];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle,${color},transparent 70%)`, filter: 'blur(70px)', ...pos[i], animation: 'orbFloat 14s ease-in-out infinite', animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <ConfirmModal
        isOpen={modal.open} onCancel={closeModal} onConfirm={handleDelete}
        confirmText={deletingId ? 'Deleting...' : 'Yes, Delete'} confirmColor="red"
        icon={<FiTrash2 color="#ef4444" />} title="Delete Listing?"
        message={`"${modal.title}" will be permanently removed.`}
      />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem' }}>
        <ParticleCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: t.heading, display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
            <FiHome size={22} color={t.accent} /> Listings Management
          </h1>
          <p style={{ color: t.textMuted, margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{boardings.length} total listings</p>
        </div>
      </div>

      <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Filter Bar */}
        <div style={{ background: t.filterBg, border: `1px solid ${t.filterBorder}`, borderRadius: 16, padding: '1rem 1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 200, background: t.searchBg, borderRadius: 10, padding: '0.5rem 1rem', border: `1px solid ${t.searchBorder}` }}>
            <FiSearch color={t.accent} size={16} />
            <input type="text" placeholder="Search by title, location, or owner..." value={search} onChange={e => setSearch(e.target.value)} className="filter-input" />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '1rem' }}>×</button>}
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            {['Single', 'Double', 'Triple', 'Annex', 'Other'].map(tp => <option key={tp}>{tp}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setPromoteFilter('all')} className={`pill-btn ${promoteFilter === 'all' ? 'active' : 'inactive'}`}>All</button>
            <button onClick={() => setPromoteFilter('promoted')} className={`pill-btn ${promoteFilter === 'promoted' ? 'active' : 'inactive'}`}>⭐ Promoted</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: t.accent }}>
            <div className="spinner-border" style={{ color: t.accent }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: t.textMuted }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏠</div>
            <p style={{ margin: 0 }}>No listings found.</p>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((b, idx) => {
              const [bgColor, textColor] = typeColorMap[b.roomType] || typeColorMap.Other;
              const imgUrl = b.images?.[0] ? `${IMAGE_BASE}${b.images[0]}` : (b.image ? `${IMAGE_BASE}${b.image}` : null);
              return (
                <div key={b._id} className="col-12">
                  <div className={`ab-card ${b.isPromoted ? 'promoted' : ''}`} style={{ animationDelay: `${idx * 0.04}s` }}>
                    {/* Thumbnail */}
                    {imgUrl
                      ? <img src={imgUrl} alt={b.title} style={{ width: 72, height: 58, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: `1px solid ${t.cardBorder}` }} onError={e => e.target.style.display = 'none'} />
                      : <div style={{ width: 72, height: 58, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,112,192,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🏠</div>}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        {b.isPromoted && <span style={{ fontSize: '0.75rem' }}>⭐</span>}
                        <span style={{ fontWeight: 700, color: t.titleColor, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
                        <span className="type-badge" style={{ background: bgColor, color: textColor }}>{b.roomType}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: t.locationColor, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiMapPin size={11} />{b.location}</span>
                        {b.owner?.name && <span style={{ fontSize: '0.8rem', color: t.ownerColor }}>👤 {b.owner.name}</span>}
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: t.accent }}>LKR {b.price?.toLocaleString()}/mo</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                      <button onClick={() => handleTogglePromote(b._id)} disabled={promotingId === b._id} className={`action-btn btn-promote ${b.isPromoted ? 'active' : ''}`}>
                        {promotingId === b._id ? '...' : <><FiStar size={13} fill={b.isPromoted ? '#fff' : 'none'} />{b.isPromoted ? 'Unpin' : 'Promote'}</>}
                      </button>
                      <Link to={`/boarding/${b._id}`} target="_blank" className="action-btn btn-view">
                        <FiEye size={14} />View
                      </Link>
                      <button onClick={() => openDeleteModal(b._id, b.title)} className="action-btn btn-delete">
                        <FiTrash2 size={14} />Delete
                      </button>
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

export default AdminBoardings;