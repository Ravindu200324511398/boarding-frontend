import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiHeart, FiArrowLeft, FiTrash2, FiExternalLink, FiCalendar, FiEdit2, FiX, FiCheck, FiWifi, FiHome, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AIReviewAssistant from '../components/AIReviewAssistant';
import StarRating, { StarDisplay } from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const amenityIcons = {
  'WiFi': '📶', 'Water': '💧', 'Electricity': '⚡', 'Kitchen': '🍳',
  'Parking': '🚗', 'Air Conditioning': '❄️', 'Laundry': '👕',
  'Security': '🔒', 'CCTV': '📷', 'Meals Included': '🍽️',
  'Meals Available': '🍽️', 'Study Table': '📚', 'Fan': '🌀',
  'Hot Water': '🚿', 'Rooftop': '🏙️', 'Private Bathroom': '🛁',
  'WiFi 100Mbps': '📶', 'Security Gate': '🚪', 'Peaceful Environment': '🌿',
  'Meals on Request': '🍽️',
};

const BoardingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [copied, setCopied] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formStars, setFormStars] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [deleteRatingLoading, setDeleteRatingLoading] = useState(false);
  const [deleteListingModal, setDeleteListingModal] = useState(false);
  const [deleteRatingModal, setDeleteRatingModal] = useState(false);

  useEffect(() => {
    const fetchBoarding = async () => {
      try {
        const res = await api.get(`/boardings/${id}`);
        setBoarding(res.data.boarding);
      } catch { setError('Boarding not found.'); }
      finally { setLoading(false); }
    };
    const fetchFavStatus = async () => {
      if (!isAuth) return;
      try {
        const res = await api.get('/favorites');
        setIsFav(res.data.favorites.map(f => f._id).includes(id));
      } catch {}
    };
    const fetchRatings = async () => {
      try {
        const res = await api.get(`/ratings/${id}`);
        setRatings(res.data.ratings);
        setAvgRating(res.data.average);
        setTotalRatings(res.data.total);
        if (isAuth && user) {
          const mine = res.data.ratings.find(r => r.user._id === user.id);
          if (mine) { setMyRating(mine); setFormStars(mine.stars); setFormComment(mine.comment || ''); }
        }
      } catch {}
    };
    fetchBoarding(); fetchFavStatus(); fetchRatings();
  }, [id, isAuth]);

  const handleFavorite = async () => {
    if (!isAuth) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      if (isFav) { await api.delete(`/favorites/${id}`); setIsFav(false); }
      else { await api.post(`/favorites/${id}`); setIsFav(true); }
    } finally { setFavLoading(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/boardings/${id}`); navigate('/'); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmitRating = async () => {
    if (!formStars) return alert('Please select a star rating');
    setRatingLoading(true);
    try {
      await api.post(`/ratings/${id}`, { stars: formStars, comment: formComment });
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings); setAvgRating(res.data.average); setTotalRatings(res.data.total);
      const mine = res.data.ratings.find(r => r.user._id === user.id);
      setMyRating(mine); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save rating'); }
    finally { setRatingLoading(false); }
  };

  const handleDeleteRating = async () => {
    setDeleteRatingLoading(true);
    try {
      await api.delete(`/ratings/${id}`);
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings); setAvgRating(res.data.average); setTotalRatings(res.data.total);
      setMyRating(null); setFormStars(0); setFormComment(''); setShowForm(false); setDeleteRatingModal(false);
    } catch {}
    finally { setDeleteRatingLoading(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading listing...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
      <h4 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>{error}</h4>
      <Link to="/"><button className="btn-primary-custom mt-2">Go Home</button></Link>
    </div>
  );

  const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;
  const isOwner = user && (boarding.owner?._id === user.id || boarding.owner?._id === user._id);
  const starCounts = [5,4,3,2,1].map(s => ({
    star: s,
    count: ratings.filter(r => r.stars === s).length,
    pct: ratings.length ? Math.round((ratings.filter(r => r.stars === s).length / ratings.length) * 100) : 0
  }));

  const typeColors = {
    Single: { bg: '#dbeafe', color: '#1d4ed8' },
    Double: { bg: '#d1fae5', color: '#065f46' },
    Triple: { bg: '#fef3c7', color: '#92400e' },
    Annex:  { bg: '#ede9fe', color: '#5b21b6' },
    Other:  { bg: '#f1f5f9', color: '#475569' },
  };
  const tc = typeColors[boarding.roomType] || typeColors.Other;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .bd-fade { animation: fadeUp 0.4s ease forwards; }
        .tab-btn { background: transparent; border: none; padding: 0.65rem 1.2rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; border-bottom: 2.5px solid transparent; color: #64748b; transition: all 0.2s; font-family: var(--font-body); }
        .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
        .tab-btn:hover { color: #2563eb; }
        .review-card:hover { background: #f0f9ff !important; }
        .action-btn { transition: all 0.15s; }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <ConfirmModal isOpen={deleteListingModal} onClose={() => setDeleteListingModal(false)} onConfirm={handleDelete}
        title="Delete This Listing?" message={`"${boarding.title}" will be permanently removed.`}
        confirmText="Yes, Delete" cancelText="Keep It" type="danger" />
      <ConfirmModal isOpen={deleteRatingModal} onClose={() => setDeleteRatingModal(false)} onConfirm={handleDeleteRating}
        loading={deleteRatingLoading} title="Remove Your Review?" message="Your rating and comment will be permanently deleted."
        confirmText="Yes, Remove" cancelText="Keep It" type="danger" />

      {/* ── HERO IMAGE SECTION ── */}
      <div style={{ position: 'relative', height: 420, background: '#0f172a', overflow: 'hidden' }}>
        {(() => {
          const allImages = boarding.images && boarding.images.length > 0
            ? boarding.images
            : imageUrl ? [boarding.image] : [];
          return allImages.length > 0 ? (
            <>
              <img src={`${IMAGE_BASE}${allImages[activePhoto]}`} alt={boarding.title}
                style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85, transition:'opacity 0.3s ease' }} />
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setActivePhoto(p => p === 0 ? allImages.length-1 : p-1)}
                    style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:'1rem', zIndex:5 }}>‹</button>
                  <button onClick={() => setActivePhoto(p => p === allImages.length-1 ? 0 : p+1)}
                    style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:'1rem', zIndex:5 }}>›</button>
                  <div style={{ position:'absolute', bottom:80, left:'50%', transform:'translateX(-50%)', display:'flex', gap:'0.4rem', zIndex:5 }}>
                    {allImages.map((_, i) => (
                      <button key={i} onClick={() => setActivePhoto(i)}
                        style={{ width: i===activePhoto ? 20 : 8, height:8, borderRadius:4, background: i===activePhoto ? '#fff' : 'rgba(255,255,255,0.5)', border:'none', cursor:'pointer', transition:'all 0.2s', padding:0 }} />
                    ))}
                  </div>
                  <div style={{ position:'absolute', top:70, right:16, background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:'0.78rem', fontWeight:600, padding:'0.25rem 0.7rem', borderRadius:20 }}>
                    {activePhoto+1} / {allImages.length}
                  </div>
                  <div style={{ position:'absolute', bottom:78, right:16, display:'flex', gap:'0.3rem', zIndex:5 }}>
                    {allImages.slice(0,4).map((img, i) => (
                      <div key={i} onClick={() => setActivePhoto(i)}
                        style={{ width:44, height:36, borderRadius:6, overflow:'hidden', cursor:'pointer', border: i===activePhoto ? '2px solid #fff' : '2px solid transparent', opacity: i===activePhoto ? 1 : 0.7, transition:'all 0.15s' }}>
                        <img src={`${IMAGE_BASE}${img}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      </div>
                    ))}
                    {allImages.length > 4 && (
                      <div style={{ width:44, height:36, borderRadius:6, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}
                        onClick={() => setActivePhoto(4)}>
                        +{allImages.length-4}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1e293b,#334155)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'6rem' }}>🏠</div>
          );
        })()}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 10, padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            <FiArrowLeft size={15} /> Back
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleShare} className="action-btn"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 10, padding: '0.5rem 0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
              <FiShare2 size={14} /> {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={handleFavorite} disabled={favLoading} className="action-btn"
              style={{ background: isFav ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 10, padding: '0.5rem 0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
              <FiHeart size={14} fill={isFav ? '#fff' : 'none'} /> {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Bottom hero info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ background: tc.bg, color: tc.color, padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
              {boarding.roomType}
            </span>
            {totalRatings > 0 && (
              <span style={{ background: 'rgba(245,158,11,0.9)', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ★ {avgRating} · {totalRatings} review{totalRatings !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, margin: '0 0 0.4rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)', lineHeight: 1.2 }}>
            {boarding.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <FiMapPin size={14} /> {boarding.location}
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container bd-fade" style={{ maxWidth: 1060, paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <div className="row g-4">

          {/* LEFT COLUMN */}
          <div className="col-lg-8">

            {/* Tab Navigation */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: '1.2rem', overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingLeft: '0.5rem' }}>
                {[
                  { key: 'about', label: '📋 About' },
                  { key: 'amenities', label: '✨ Amenities' },
                  { key: 'reviews', label: `⭐ Reviews${totalRatings > 0 ? ` (${totalRatings})` : ''}` },
                ].map(tab => (
                  <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: '1.5rem' }}>

                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                  <div>
                    <p style={{ color: '#475569', lineHeight: 1.85, margin: 0, fontSize: '0.95rem' }}>{boarding.description}</p>

                    {boarding.lat && boarding.lng && (
                      <div style={{ marginTop: '1.2rem', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: 12, padding: '1rem 1.2rem', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>📍 GPS Location</div>
                          <div style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: 600 }}>{boarding.lat}, {boarding.lng}</div>
                        </div>
                        <a href={`https://maps.google.com/?q=${boarding.lat},${boarding.lng}`} target="_blank" rel="noreferrer">
                          <button style={{ background: '#fff', color: '#d97706', border: '1px solid #fde68a', borderRadius: 9, padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)' }}>
                            <FiExternalLink size={13} /> Open Maps
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* AMENITIES TAB */}
                {activeTab === 'amenities' && (
                  <div>
                    {boarding.amenities?.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.7rem' }}>
                        {boarding.amenities.map((a, i) => (
                          <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#6ee7b7'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                            <span style={{ fontSize: '1.2rem' }}>{amenityIcons[a] || '✓'}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{a}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1.5rem 0' }}>No amenities listed.</p>
                    )}
                  </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                  <div>
                    {/* AI Summary */}
                    <AIReviewAssistant reviews={ratings} boarding={boarding} isOwner={isOwner} />

                    {/* Rating Summary */}
                    {totalRatings > 0 && (
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', background: '#f8fafc', borderRadius: 14, padding: '1.2rem', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center', minWidth: 80 }}>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{avgRating}</div>
                          <StarDisplay rating={avgRating} size={16} showNumber={false} />
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>{totalRatings} review{totalRatings !== 1 ? 's' : ''}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          {starCounts.map(({ star, count, pct }) => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 8 }}>{star}</span>
                              <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★</span>
                              <div style={{ flex: 1, height: 7, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#cbd5e1', width: 18 }}>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* My Rating / Review Form */}
                    {isAuth && !isOwner ? (
                      <div style={{ marginBottom: '1.5rem' }}>
                        {myRating && !showForm ? (
                          <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 14, padding: '1.1rem 1.3rem', border: '1px solid #86efac' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <span style={{ width: 16, height: 16, background: '#059669', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem' }}>✓</span>
                                  Your Review
                                </div>
                                <StarDisplay rating={myRating.stars} size={18} />
                                {myRating.comment && <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.65 }}>{myRating.comment}</p>}
                              </div>
                              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, marginLeft: '0.8rem' }}>
                                <button onClick={() => setShowForm(true)}
                                  style={{ background: '#fff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)' }}>
                                  <FiEdit2 size={12} /> Edit
                                </button>
                                <button onClick={() => setDeleteRatingModal(true)}
                                  style={{ background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)' }}>
                                  <FiTrash2 size={12} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : showForm || !myRating ? (
                          <div style={{ background: '#fff', borderRadius: 14, padding: '1.3rem', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                              {myRating ? '✏️ Edit Your Review' : '✏️ Write a Review'}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rating *</div>
                              <StarRating value={formStars} onChange={setFormStars} size={34} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment (optional)</div>
                              <textarea value={formComment} onChange={e => setFormComment(e.target.value)}
                                placeholder="Share your experience with other students..."
                                rows={3}
                                style={{ width: '100%', borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '0.75rem 1rem', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', color: '#334155', lineHeight: 1.6, transition: 'border 0.15s' }}
                                onFocus={e => e.target.style.borderColor = '#93c5fd'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={handleSubmitRating} disabled={ratingLoading || !formStars}
                                style={{ background: (!ratingLoading && formStars) ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#e2e8f0', color: (!ratingLoading && formStars) ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10, padding: '0.6rem 1.3rem', fontWeight: 700, cursor: (!ratingLoading && formStars) ? 'pointer' : 'not-allowed', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                                {ratingLoading ? <span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> : <FiCheck size={14} />}
                                {myRating ? 'Update Review' : 'Submit Review'}
                              </button>
                              {(myRating || showForm) && (
                                <button onClick={() => setShowForm(false)}
                                  style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)' }}>
                                  <FiX size={14} /> Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        ) : null}

                        {false && !myRating && !showForm && (
                          <button onClick={() => setShowForm(true)}
                            style={{ marginTop: '0.8rem', background: '#f8fafc', color: '#2563eb', border: '1.5px dashed #93c5fd', borderRadius: 12, padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', width: '100%', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                            ⭐ Write a Review
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: 14, padding: '1.2rem', border: '1px solid #bae6fd', marginBottom: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#0369a1', margin: '0 0 0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>Login to share your experience</p>
                        <Link to="/login">
                          <button style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.55rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
                            Login to Review
                          </button>
                        </Link>
                      </div>
                    )}

                    {/* Reviews List */}
                    {ratings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                        <p style={{ margin: 0, fontWeight: 500 }}>No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {ratings.map(r => (
                          <div key={r._id} className="review-card"
                            style={{ padding: '1.1rem 1.3rem', borderRadius: 14, border: '1px solid #f1f5f9', background: '#fafbfc', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                                  {r.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{r.user?.name}</div>
                                  <StarDisplay rating={r.stars} size={13} showNumber={false} />
                                </div>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#cbd5e1', background: '#f8fafc', padding: '0.2rem 0.6rem', borderRadius: 20, border: '1px solid #f1f5f9' }}>
                                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            {r.comment && <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.7, paddingLeft: '0.2rem' }}>{r.comment}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Owner delete */}
            {isOwner && (
              <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
                <Link to={`/edit/${id}`}>
                  <button style={{ background:'#eff6ff', color:'#2563eb', border:'1.5px solid #bfdbfe', borderRadius:12, padding:'0.7rem 1.4rem', fontWeight:700, cursor:'pointer', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--font-body)' }}>
                    <FiEdit2 size={15}/> Edit Listing
                  </button>
                </Link>
                <button onClick={() => setDeleteListingModal(true)}
                style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 12, padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                <FiTrash2 size={15} /> Delete This Listing
              </button>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Price Card */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.6rem', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(15,23,42,0.08)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Monthly Rent</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    LKR {Number(boarding.price).toLocaleString()}
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/mo</span>
                  </div>
                  {totalRatings > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <StarDisplay rating={avgRating} size={14} />
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({totalRatings} review{totalRatings !== 1 ? 's' : ''})</span>
                    </div>
                  )}
                </div>

                <div style={{ height: 1, background: '#f1f5f9', margin: '1rem 0' }} />

                {/* Contact info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  {boarding.contact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ width: 32, height: 32, background: '#dbeafe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiPhone size={14} color="#2563eb" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{boarding.contact}</div>
                      </div>
                    </div>
                  )}
                  {boarding.owner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                        {boarding.owner.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listed by</div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.owner.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.owner.email}</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <FiCalendar size={12} />
                    Listed {new Date(boarding.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* CTA Buttons */}
                {isAuth && !isOwner ? (
                  <button onClick={handleFavorite} disabled={favLoading}
                    style={{ width: '100%', background: isFav ? '#fef2f2' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: isFav ? '#dc2626' : '#fff', border: isFav ? '1.5px solid #fecaca' : 'none', borderRadius: 12, padding: '0.8rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s', boxShadow: isFav ? 'none' : '0 4px 16px rgba(37,99,235,0.3)' }}>
                    <FiHeart fill={isFav ? '#dc2626' : 'none'} size={16} />
                    {isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                  </button>
                ) : (
                  <Link to="/login">
                    <button style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.8rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
                      Login to Save
                    </button>
                  </Link>
                )}

                {!showForm && !myRating && isAuth && (
                  <button onClick={() => { setActiveTab('reviews'); setShowForm(true); }}
                    style={{ width: '100%', marginTop: '0.6rem', background: '#f8fafc', color: '#2563eb', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                    ⭐ Write a Review
                  </button>
                )}
              </div>

              {/* Quick Amenities preview */}
              {boarding.amenities?.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '1.2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>What's Included</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {boarding.amenities.slice(0, 6).map((a, i) => (
                      <span key={i} style={{ background: '#f0fdf4', color: '#059669', padding: '0.25rem 0.7rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {amenityIcons[a] || '✓'} {a}
                      </span>
                    ))}
                    {boarding.amenities.length > 6 && (
                      <button onClick={() => setActiveTab('amenities')}
                        style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '0.25rem 0.7rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        +{boarding.amenities.length - 6} more
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardingDetail;