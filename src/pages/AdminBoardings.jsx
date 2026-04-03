import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTrash2, FiEye, FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

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

  const typeColors = { Single:'#dbeafe|#1d4ed8', Double:'#d1fae5|#065f46', Triple:'#fef3c7|#92400e', Annex:'#ede9fe|#5b21b6', Other:'#f1f5f9|#475569' };
  const getTypeStyle = (type) => {
    const [bg, color] = (typeColors[type] || '#f1f5f9|#475569').split('|');
    return { background: bg, color };
  };

  const promotedCount = boardings.filter(b => b.isPromoted).length;

  return (
    <div>
      <ConfirmModal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deletingId === modal.id}
        title="Delete Listing?"
        message={`"${modal.title}" will be permanently removed. This cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Keep It"
      />

      <div style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding:'2.5rem 0', marginBottom:'2rem' }}>
        <div className="container">
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:'0.8rem' }}>
            <FiHome size={22} color="#60a5fa" /> Listings Management
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', margin:'0.3rem 0 0', fontSize:'0.95rem' }}>
            {boardings.length} total listings · <span style={{ color:'#fbbf24' }}>⭐ {promotedCount} promoted</span>
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Filter Bar */}
        <div style={{ background:'#fff', borderRadius:16, padding:'1.2rem 1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, minWidth:200 }}>
            <FiSearch color="#94a3b8" size={16} />
            <input type="text" placeholder="Search title, location, owner..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border:'none', outline:'none', flex:1, fontSize:'0.9rem', fontFamily:'var(--font-body)', color:'#0f172a', background:'transparent' }} />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0.5rem 0.8rem', fontSize:'0.875rem', fontFamily:'var(--font-body)', color:'#0f172a', outline:'none' }}>
            <option value="">All Types</option>
            {['Single','Double','Triple','Annex','Other'].map(t => <option key={t}>{t}</option>)}
          </select>
          {/* Promote filter pills */}
          <div style={{ display:'flex', gap:'0.4rem' }}>
            {[
              { key:'all', label:'All' },
              { key:'promoted', label:'⭐ Promoted' },
              { key:'normal', label:'Normal' },
            ].map(f => (
              <button key={f.key} onClick={() => setPromoteFilter(f.key)}
                style={{ padding:'0.4rem 0.9rem', borderRadius:50, fontSize:'0.82rem', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', background: promoteFilter === f.key ? '#0f172a' : '#f1f5f9', color: promoteFilter === f.key ? '#fff' : '#64748b' }}>
                {f.label}
              </button>
            ))}
          </div>
          {(search || typeFilter) && (
            <button onClick={() => { setSearch(''); setTypeFilter(''); }}
              style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'0.5rem 0.9rem', fontSize:'0.82rem', color:'#64748b', cursor:'pointer', fontWeight:600 }}>
              Clear
            </button>
          )}
          <span style={{ fontSize:'0.82rem', color:'#94a3b8', whiteSpace:'nowrap' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="row g-3">
            {filtered.map(b => {
              const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
              const ts = getTypeStyle(b.roomType);
              return (
                <div key={b._id} className="col-12">
                  <div style={{ background:'#fff', borderRadius:14, padding:'1rem 1.2rem', boxShadow: b.isPromoted ? '0 4px 20px rgba(251,191,36,0.2)' : '0 2px 12px rgba(15,23,42,0.06)', border: b.isPromoted ? '1.5px solid #fbbf24' : '1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'1rem', transition:'box-shadow 0.2s', position:'relative' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = b.isPromoted ? '0 6px 28px rgba(251,191,36,0.3)' : '0 6px 24px rgba(15,23,42,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = b.isPromoted ? '0 4px 20px rgba(251,191,36,0.2)' : '0 2px 12px rgba(15,23,42,0.06)'}>

                    {/* Promoted badge */}
                    {b.isPromoted && (
                      <div style={{ position:'absolute', top:10, right:10, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontSize:'0.68rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:20, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                        <FiStar size={10} fill="#fff" /> PROMOTED
                      </div>
                    )}

                    {imgUrl
                      ? <img src={imgUrl} alt={b.title} style={{ width:80, height:64, objectFit:'cover', borderRadius:10, flexShrink:0 }} onError={e => e.target.style.display='none'} />
                      : <div style={{ width:80, height:64, background:'#e2e8f0', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>🏠</div>}

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                        <span style={{ fontWeight:700, fontSize:'0.95rem', color:'#0f172a' }}>{b.title}</span>
                        <span style={{ ...ts, padding:'0.15rem 0.6rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700 }}>{b.roomType}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.8rem', color:'#64748b', display:'flex', alignItems:'center', gap:'0.3rem' }}><FiMapPin size={11} />{b.location}</span>
                        <span style={{ fontSize:'0.875rem', fontWeight:700, color:'#2563eb' }}>LKR {b.price.toLocaleString()}/mo</span>
                        <span style={{ fontSize:'0.78rem', color:'#94a3b8' }}>by {b.owner?.name || 'Unknown'}</span>
                        <span style={{ fontSize:'0.75rem', color:'#cbd5e1' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>
                      {b.amenities?.length > 0 && (
                        <div style={{ display:'flex', gap:'0.3rem', marginTop:'0.4rem', flexWrap:'wrap' }}>
                          {b.amenities.slice(0,4).map((a,i) => (
                            <span key={i} style={{ background:'#f0fdf4', color:'#059669', padding:'0.1rem 0.5rem', borderRadius:20, fontSize:'0.7rem', fontWeight:600 }}>{a}</span>
                          ))}
                          {b.amenities.length > 4 && <span style={{ background:'#f1f5f9', color:'#94a3b8', padding:'0.1rem 0.5rem', borderRadius:20, fontSize:'0.7rem' }}>+{b.amenities.length-4}</span>}
                        </div>
                      )}
                    </div>

                    <div style={{ display:'flex', gap:'0.5rem', flexShrink:0, alignItems:'center' }}>
                      {/* Promote toggle */}
                      <button
                        onClick={() => handleTogglePromote(b._id)}
                        disabled={promotingId === b._id}
                        title={b.isPromoted ? 'Remove promotion' : 'Promote to top'}
                        style={{ background: b.isPromoted ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#f1f5f9', color: b.isPromoted ? '#fff' : '#64748b', border:'none', borderRadius:8, padding:'0.5rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.82rem', fontWeight:700, transition:'all 0.2s' }}>
                        {promotingId === b._id
                          ? <span className="spinner-border spinner-border-sm" style={{ width:'0.8rem', height:'0.8rem' }} />
                          : <><FiStar size={13} fill={b.isPromoted ? '#fff' : 'none'} />{b.isPromoted ? 'Unpin' : 'Promote'}</>}
                      </button>

                      <Link to={`/boarding/${b._id}`} target="_blank">
                        <button title="View listing" style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:8, padding:'0.5rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.82rem', fontWeight:600 }}>
                          <FiEye size={14} />View
                        </button>
                      </Link>
                      <button onClick={() => openDeleteModal(b._id, b.title)}
                        style={{ background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:8, padding:'0.5rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.82rem', fontWeight:600 }}>
                        <FiTrash2 size={14} />Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-12">
                <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8', background:'#fff', borderRadius:16, border:'1px solid #e2e8f0' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🏠</div>
                  <p>No listings found.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBoardings;
