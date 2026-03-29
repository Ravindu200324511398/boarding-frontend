import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiHeart, FiArrowLeft, FiTrash2, FiExternalLink, FiCalendar, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StarRating, { StarDisplay } from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const BoardingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState('');

  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formStars, setFormStars] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [deleteRatingLoading, setDeleteRatingLoading] = useState(false);

  // Modals
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
          if (mine) {
            setMyRating(mine);
            setFormStars(mine.stars);
            setFormComment(mine.comment || '');
          }
        }
      } catch {}
    };
    fetchBoarding();
    fetchFavStatus();
    fetchRatings();
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
    try {
      await api.delete(`/boardings/${id}`);
      navigate('/');
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmitRating = async () => {
    if (!formStars) return alert('Please select a star rating');
    setRatingLoading(true);
    try {
      await api.post(`/ratings/${id}`, { stars: formStars, comment: formComment });
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings);
      setAvgRating(res.data.average);
      setTotalRatings(res.data.total);
      const mine = res.data.ratings.find(r => r.user._id === user.id);
      setMyRating(mine);
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save rating'); }
    finally { setRatingLoading(false); }
  };

  const handleDeleteRating = async () => {
    setDeleteRatingLoading(true);
    try {
      await api.delete(`/ratings/${id}`);
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings);
      setAvgRating(res.data.average);
      setTotalRatings(res.data.total);
      setMyRating(null);
      setFormStars(0);
      setFormComment('');
      setShowForm(false);
      setDeleteRatingModal(false);
    } catch {}
    finally { setDeleteRatingLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;
  if (error) return (
    <div className="container py-5 text-center">
      <div className="empty-state"><div className="icon">😕</div><h4>{error}</h4></div>
      <Link to="/"><button className="btn-primary-custom mt-2">Go Home</button></Link>
    </div>
  );

  const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;
  const isOwner = user && boarding.owner?._id === user.id;

  const starCounts = [5,4,3,2,1].map(s => ({
    star: s,
    count: ratings.filter(r => r.stars === s).length,
    pct: ratings.length ? Math.round((ratings.filter(r => r.stars === s).length / ratings.length) * 100) : 0
  }));

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      {/* Delete Listing Modal */}
      <ConfirmModal
        isOpen={deleteListingModal}
        onClose={() => setDeleteListingModal(false)}
        onConfirm={handleDelete}
        title="Delete This Listing?"
        message={`"${boarding.title}" will be permanently removed. All reviews will also be deleted.`}
        confirmText="Yes, Delete Listing"
        cancelText="Keep It"
        type="danger"
      />

      {/* Delete Rating Modal */}
      <ConfirmModal
        isOpen={deleteRatingModal}
        onClose={() => setDeleteRatingModal(false)}
        onConfirm={handleDeleteRating}
        loading={deleteRatingLoading}
        title="Remove Your Review?"
        message="Your rating and comment will be permanently deleted."
        confirmText="Yes, Remove"
        cancelText="Keep It"
        type="danger"
      />

      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0.8rem 0' }}>
        <div className="container">
          <button className="btn-outline-custom" onClick={() => navigate(-1)} style={{ fontSize:'0.875rem' }}>
            <FiArrowLeft size={14} />Back
          </button>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth:980 }}>
        <div className="row g-4">
          <div className="col-md-8">
            {imageUrl
              ? <img src={imageUrl} alt={boarding.title} className="detail-image" />
              : <div className="detail-image-placeholder">🏠</div>}

            <div style={{ marginTop:'1.5rem', marginBottom:'1rem' }}>
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'0.25rem 0.8rem', borderRadius:20, fontSize:'0.8rem', fontWeight:700 }}>{boarding.roomType}</span>
                {boarding.amenities?.slice(0,3).map((a,i) => (
                  <span key={i} style={{ background:'#f0fdf4', color:'#059669', padding:'0.25rem 0.7rem', borderRadius:20, fontSize:'0.78rem', fontWeight:600 }}>{a}</span>
                ))}
              </div>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.9rem', fontWeight:800, color:'#0f172a', marginBottom:'0.5rem' }}>{boarding.title}</h1>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                <p style={{ color:'#64748b', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.95rem', margin:0 }}>
                  <FiMapPin size={14} color="#2563eb" />{boarding.location}
                </p>
                {totalRatings > 0 && (
                  <span style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <StarDisplay rating={avgRating} size={16} />
                    <span style={{ fontSize:'0.82rem', color:'#64748b' }}>({totalRatings} review{totalRatings !== 1 ? 's' : ''})</span>
                  </span>
                )}
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #e2e8f0', marginBottom:'1rem' }}>
              <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.8rem', color:'#0f172a' }}>About this place</h5>
              <p style={{ color:'#475569', lineHeight:1.8, margin:0 }}>{boarding.description}</p>
            </div>

            {boarding.amenities?.length > 0 && (
              <div style={{ background:'#fff', borderRadius:16, padding:'1.3rem', border:'1px solid #e2e8f0', marginBottom:'1rem' }}>
                <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.8rem', color:'#0f172a' }}>Amenities</h5>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                  {boarding.amenities.map((a,i) => (
                    <span key={i} style={{ background:'#f0fdf4', color:'#059669', padding:'0.35rem 0.9rem', borderRadius:50, fontSize:'0.85rem', fontWeight:600 }}>✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {boarding.lat && boarding.lng && (
              <div style={{ background:'#fffbeb', borderRadius:12, padding:'1rem 1.2rem', border:'1px solid #fde68a', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#d97706', textTransform:'uppercase', letterSpacing:'0.05em' }}>📍 GPS Location</div>
                  <div style={{ fontSize:'0.875rem', color:'#92400e', fontWeight:500, marginTop:'0.2rem' }}>{boarding.lat}, {boarding.lng}</div>
                </div>
                <a href={`https://maps.google.com/?q=${boarding.lat},${boarding.lng}`} target="_blank" rel="noreferrer">
                  <button className="btn-ghost" style={{ fontSize:'0.82rem' }}><FiExternalLink size={13} />Open Map</button>
                </a>
              </div>
            )}

            {/* RATINGS SECTION */}
            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #e2e8f0', marginBottom:'1rem' }}>
              <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', marginBottom:'1.2rem', fontSize:'1.2rem' }}>
                ⭐ Reviews & Ratings
              </h5>

              {totalRatings > 0 && (
                <div style={{ display:'flex', gap:'2rem', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                  <div style={{ textAlign:'center', minWidth:80 }}>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:'3.5rem', fontWeight:800, color:'#0f172a', lineHeight:1 }}>{avgRating}</div>
                    <StarDisplay rating={avgRating} size={18} showNumber={false} />
                    <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.3rem' }}>{totalRatings} review{totalRatings !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ flex:1, minWidth:160 }}>
                    {starCounts.map(({ star, count, pct }) => (
                      <div key={star} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem' }}>
                        <span style={{ fontSize:'0.78rem', color:'#64748b', width:12, textAlign:'right' }}>{star}</span>
                        <span style={{ color:'#f59e0b', fontSize:'0.8rem' }}>★</span>
                        <div style={{ flex:1, height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${pct}%`, background:'#f59e0b', borderRadius:4, transition:'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize:'0.75rem', color:'#94a3b8', width:20 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isAuth ? (
                <div style={{ marginBottom:'1.5rem' }}>
                  {myRating && !showForm ? (
                    <div style={{ background:'#f0fdf4', borderRadius:12, padding:'1rem 1.2rem', border:'1px solid #bbf7d0' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <div>
                          <div style={{ fontSize:'0.78rem', color:'#059669', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>✓ Your Review</div>
                          <StarDisplay rating={myRating.stars} size={18} />
                          {myRating.comment && <p style={{ fontSize:'0.875rem', color:'#374151', marginTop:'0.4rem', marginBottom:0 }}>{myRating.comment}</p>}
                        </div>
                        <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                          <button onClick={() => setShowForm(true)}
                            style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:8, padding:'0.4rem 0.8rem', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                            <FiEdit2 size={12} />Edit
                          </button>
                          <button onClick={() => setDeleteRatingModal(true)}
                            style={{ background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:8, padding:'0.4rem 0.8rem', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                            <FiTrash2 size={12} />Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : showForm || !myRating ? (
                    <div style={{ background:'#f8fafc', borderRadius:12, padding:'1.2rem', border:'1px solid #e2e8f0' }}>
                      <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#0f172a', marginBottom:'0.8rem' }}>
                        {myRating ? '✏️ Edit Your Review' : '✏️ Write a Review'}
                      </div>
                      <div style={{ marginBottom:'0.8rem' }}>
                        <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'0.4rem', fontWeight:600 }}>Your Rating *</div>
                        <StarRating value={formStars} onChange={setFormStars} size={32} />
                      </div>
                      <div style={{ marginBottom:'0.8rem' }}>
                        <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'0.4rem', fontWeight:600 }}>Comment (optional)</div>
                        <textarea
                          value={formComment}
                          onChange={e => setFormComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={3}
                          style={{ width:'100%', borderRadius:10, border:'1.5px solid #e2e8f0', padding:'0.7rem 0.9rem', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', resize:'vertical' }}
                        />
                      </div>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <button onClick={handleSubmitRating} disabled={ratingLoading || !formStars}
                          className="btn-primary-custom" style={{ fontSize:'0.875rem', padding:'0.55rem 1.2rem' }}>
                          {ratingLoading ? <span className="spinner-border spinner-border-sm" /> : <><FiCheck size={14} />{myRating ? 'Update' : 'Submit'}</>}
                        </button>
                        {(myRating || showForm) && (
                          <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize:'0.875rem' }}>
                            <FiX size={14} />Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {!myRating && !showForm && (
                    <button onClick={() => setShowForm(true)} className="btn-outline-custom" style={{ fontSize:'0.875rem', marginTop:'0.5rem' }}>
                      ⭐ Write a Review
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ background:'#f8fafc', borderRadius:12, padding:'1rem', border:'1px solid #e2e8f0', marginBottom:'1.5rem', textAlign:'center' }}>
                  <p style={{ color:'#64748b', margin:'0 0 0.8rem', fontSize:'0.9rem' }}>Login to leave a review</p>
                  <Link to="/login"><button className="btn-primary-custom" style={{ fontSize:'0.85rem' }}>Login to Review</button></Link>
                </div>
              )}

              {ratings.length === 0 ? (
                <div style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>💬</div>
                  <p style={{ margin:0 }}>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  {ratings.map(r => (
                    <div key={r._id} style={{ padding:'1rem 1.2rem', borderRadius:12, border:'1px solid #f1f5f9', background:'#fafbfc' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.4rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.9rem', flexShrink:0 }}>
                            {r.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#0f172a' }}>{r.user?.name}</div>
                            <StarDisplay rating={r.stars} size={13} showNumber={false} />
                          </div>
                        </div>
                        <span style={{ fontSize:'0.75rem', color:'#cbd5e1' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                        </span>
                      </div>
                      {r.comment && <p style={{ fontSize:'0.875rem', color:'#475569', margin:'0.5rem 0 0', lineHeight:1.6 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isOwner && (
              <button onClick={() => setDeleteListingModal(true)}
                style={{ background:'#fef2f2', color:'#dc2626', border:'1.5px solid #fecaca', borderRadius:10, padding:'0.6rem 1.2rem', fontWeight:600, cursor:'pointer', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <FiTrash2 size={14} />Delete This Listing
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            <div className="detail-sidebar">
              <p className="card-price" style={{ fontSize:'1.8rem', marginBottom:'0.3rem' }}>
                LKR {Number(boarding.price).toLocaleString()}
                <span style={{ fontSize:'0.85rem' }}>/month</span>
              </p>

              {totalRatings > 0 && (
                <div style={{ marginBottom:'1rem' }}>
                  <StarDisplay rating={avgRating} size={16} />
                  <span style={{ fontSize:'0.8rem', color:'#64748b', marginLeft:'0.4rem' }}>({totalRatings} review{totalRatings !== 1 ? 's' : ''})</span>
                </div>
              )}

              <hr />

              {boarding.contact && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiPhone color="#2563eb" />
                  <div>
                    <div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>Contact</div>
                    <div style={{ fontWeight:600 }}>{boarding.contact}</div>
                  </div>
                </div>
              )}

              {boarding.owner && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiUser color="#2563eb" />
                  <div>
                    <div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>Listed by</div>
                    <div style={{ fontWeight:600 }}>{boarding.owner.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'#94a3b8' }}>{boarding.owner.email}</div>
                  </div>
                </div>
              )}

              <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.5rem' }}>
                <FiCalendar size={12} style={{ marginRight:4 }} />
                Listed {new Date(boarding.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
              </div>

              {isAuth ? (
                <button onClick={handleFavorite} disabled={favLoading}
                  className={isFav ? 'btn-outline-custom w-100 mt-3 justify-content-center' : 'btn-primary-custom w-100 mt-3 justify-content-center'}
                  style={{ padding:'0.7rem' }}>
                  <FiHeart style={{ marginRight:6 }} fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Saved' : 'Save to Favorites'}
                </button>
              ) : (
                <Link to="/login">
                  <button className="btn-primary-custom w-100 mt-3 justify-content-center" style={{ padding:'0.7rem' }}>
                    Login to Save
                  </button>
                </Link>
              )}

              {!showForm && !myRating && isAuth && (
                <button onClick={() => setShowForm(true)}
                  className="btn-outline-custom w-100 mt-2 justify-content-center" style={{ padding:'0.65rem' }}>
                  ⭐ Write a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingDetail;