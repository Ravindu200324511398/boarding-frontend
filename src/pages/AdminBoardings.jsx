import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTrash2, FiEye, FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

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

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.06); }
    66%      { transform: translate(-20px,25px) scale(0.96); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .ab-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 1rem 1.2rem;
    display: flex; align-items: center; gap: 1rem;
    transition: all 0.25s ease;
    position: relative;
    animation: fadeUp 0.4s ease both;
  }
  .ab-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(0,212,170,0.3);
    box-shadow: 0 4px 24px rgba(0,212,170,0.1);
    transform: translateY(-1px);
  }
  .ab-card.promoted {
    border-color: rgba(251,191,36,0.4);
    box-shadow: 0 4px 20px rgba(251,191,36,0.12);
  }
  .filter-bar {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1rem 1.4rem;
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  }
  .filter-input {
    border: none; outline: none; flex: 1;
    font-size: 0.9rem; background: transparent;
    color: rgba(220,233,255,0.9);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .filter-select {
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 10px; padding: 0.5rem 0.8rem;
    font-size: 0.875rem; color: rgba(220,233,255,0.8);
    background: rgba(255,255,255,0.06); outline: none;
  }
  .pill-btn {
    padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.82rem;
    font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;
  }
  .pill-btn.active { background: linear-gradient(135deg,#00d4aa,#0ea5e9); color: #fff; }
  .pill-btn.inactive { background: rgba(255,255,255,0.07); color: rgba(220,233,255,0.5); }
  .action-btn {
    border: none; border-radius: 8px; padding: 0.45rem 0.9rem;
    cursor: pointer; display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; font-weight: 700; transition: all 0.2s;
  }
  .btn-promote { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .btn-promote.active { background: linear-gradient(135deg,#f59e0b,#d97706); color: #fff; border-color: transparent; }
  .btn-view { background: rgba(14,165,233,0.12); color: #38bdf8; border: 1px solid rgba(14,165,233,0.25); }
  .btn-delete { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .amenity-tag {
    background: rgba(0,212,170,0.1); color: #00d4aa;
    padding: 0.12rem 0.55rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600;
  }
  .type-badge { padding: 0.15rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
`;

const AdminBoardings = () => {
  const [boardings, setBoardings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [promotingId, setPromotingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [promoteFilter, setPromoteFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, id: null, title: '' });

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
    <div style={{ minHeight: '100vh', background: '#060f2a', position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Orbs Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', width: 600, height: 600, background: 'radial-gradient(circle, #0ea5e930, transparent 70%)', filter: 'blur(70px)', top: '-200px', left: '-150px', animation: 'orbFloat 14s infinite' }} />
      </div>

      <ConfirmModal
        isOpen={modal.open} 
        onCancel={closeModal} // Fix: Matches the "onCancel" prop in your modal file
        onConfirm={handleDelete}
        confirmText={deletingId ? "Deleting..." : "Yes, Delete"}
        confirmColor="red"
        icon={<FiTrash2 color="#ef4444" />}
        title="Delete Listing?"
        message={`"${modal.title}" will be permanently removed.`}
      />

      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem' }}>
        <ParticleCanvas />
        <div className="container">
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#dce9ff', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiHome size={22} color="#0ea5e9" /> Listings Management
          </h1>
        </div>
      </div>

      <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <FiSearch color="rgba(0,212,170,0.7)" size={16} />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="filter-input" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            {['Single', 'Double', 'Triple', 'Annex', 'Other'].map(t => <option key={t}>{t}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setPromoteFilter('all')} className={`pill-btn ${promoteFilter === 'all' ? 'active' : 'inactive'}`}>All</button>
            <button onClick={() => setPromoteFilter('promoted')} className={`pill-btn ${promoteFilter === 'promoted' ? 'active' : 'inactive'}`}>⭐ Promoted</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#00d4aa' }}>Loading...</div>
        ) : (
          <div className="row g-3">
            {filtered.map((b) => {
              const [bgColor, textColor] = typeColorMap[b.roomType] || typeColorMap.Other;
              return (
                <div key={b._id} className="col-12">
                  <div className={`ab-card ${b.isPromoted ? 'promoted' : ''}`}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, color: '#dce9ff' }}>{b.title}</span>
                        <span className="type-badge" style={{ background: bgColor, color: textColor }}>{b.roomType}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(220,233,255,0.5)' }}>{b.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => handleTogglePromote(b._id)} disabled={promotingId === b._id} className={`action-btn btn-promote ${b.isPromoted ? 'active' : ''}`}>
                         {promotingId === b._id ? '...' : <><FiStar size={13} fill={b.isPromoted ? '#fff' : 'none'} /> {b.isPromoted ? 'Unpin' : 'Promote'}</>}
                      </button>
                      <Link to={`/boarding/${b._id}`} target="_blank">
                        <button className="action-btn btn-view"><FiEye size={14} />View</button>
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