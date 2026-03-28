import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiHeart, FiArrowLeft, FiTrash2, FiExternalLink, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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
    fetchBoarding();
    fetchFavStatus();
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
    if (!window.confirm('Delete this boarding listing?')) return;
    try { await api.delete(`/boardings/${id}`); navigate('/'); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border" /></div>;
  if (error) return (
    <div className="container py-5 text-center">
      <div className="empty-state"><div className="icon">😕</div><h4>{error}</h4></div>
      <Link to="/"><button className="btn-primary-custom mt-2">Go Home</button></Link>
    </div>
  );

  const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;
  const isOwner = user && boarding.owner?._id === user.id;

  return (
    <div style={{background:'var(--cream)',minHeight:'100vh'}}>
      {/* Back bar */}
      <div style={{background:'var(--white)',borderBottom:'1px solid var(--parchment)',padding:'0.8rem 0'}}>
        <div className="container">
          <button className="btn-ghost" onClick={() => navigate(-1)} style={{fontSize:'0.875rem'}}>
            <FiArrowLeft size={14} />Back to listings
          </button>
        </div>
      </div>

      <div className="container py-4" style={{maxWidth:1000}}>
        <div className="row g-4">
          {/* Left col */}
          <div className="col-md-8">
            {/* Image */}
            {imageUrl
              ? <img src={imageUrl} alt={boarding.title} className="detail-image" />
              : <div className="detail-image-placeholder">🏠</div>}

            {/* Title & badges */}
            <div style={{marginTop:'1.5rem',marginBottom:'1.2rem'}}>
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="room-pill" style={{fontSize:'0.82rem',padding:'0.3rem 0.9rem',borderRadius:'50px',background:'var(--terracotta)',color:'#fff'}}>{boarding.roomType}</span>
                {boarding.amenities?.slice(0,4).map((a,i) => <span key={i} className="badge-amenity">{a}</span>)}
              </div>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,color:'var(--ink)',marginBottom:'0.5rem'}}>{boarding.title}</h1>
              <p style={{color:'var(--muted)',display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.95rem'}}>
                <FiMapPin size={14} color="var(--terracotta)" />{boarding.location}
              </p>
            </div>

            {/* Description */}
            <div className="description-box mb-3">
              <h5>About this place</h5>
              <p>{boarding.description}</p>
            </div>

            {/* All amenities */}
            {boarding.amenities?.length > 0 && (
              <div style={{background:'var(--white)',borderRadius:'var(--radius)',padding:'1.3rem',border:'1px solid var(--parchment)',marginBottom:'1rem'}}>
                <h5 style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',marginBottom:'0.8rem'}}>Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {boarding.amenities.map((a,i) => (
                    <span key={i} style={{background:'var(--forest-light)',color:'var(--forest)',padding:'0.35rem 0.9rem',borderRadius:'50px',fontSize:'0.85rem',fontWeight:500}}>✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Map coordinates */}
            {boarding.lat && boarding.lng && (
              <div className="coords-box mb-3">
                <div>
                  <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--gold)',marginBottom:'0.2rem'}}>📍 GPS Location</div>
                  <div style={{fontSize:'0.9rem',color:'var(--ink-soft)',fontWeight:500}}>{boarding.lat}, {boarding.lng}</div>
                </div>
                <a href={`https://maps.google.com/?q=${boarding.lat},${boarding.lng}`} target="_blank" rel="noreferrer">
                  <button className="btn-ghost" style={{fontSize:'0.82rem',padding:'0.4rem 0.9rem'}}>
                    <FiExternalLink size={13} />Open Map
                  </button>
                </a>
              </div>
            )}

            {/* Delete button for owner */}
            {isOwner && (
              <button onClick={handleDelete}
                style={{background:'#fef2f0',color:'#c4622d',border:'1.5px solid #f5d5c8',borderRadius:'10px',padding:'0.6rem 1.2rem',fontWeight:600,cursor:'pointer',fontSize:'0.875rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <FiTrash2 size={14} />Delete This Listing
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            <div className="detail-sidebar">
              <div className="detail-price">
                LKR {Number(boarding.price).toLocaleString()}
                <span style={{display:'block',fontSize:'0.85rem',fontFamily:'var(--font-body)',fontWeight:400,color:'var(--muted)',marginTop:'0.1rem'}}>per month</span>
              </div>

              <div style={{margin:'1.2rem 0',borderTop:'1px solid var(--parchment)'}} />

              {boarding.contact && (
                <div className="info-row">
                  <div className="info-icon"><FiPhone size={15} /></div>
                  <div><div className="info-label">Contact</div><div className="info-value">{boarding.contact}</div></div>
                </div>
              )}

              {boarding.owner && (
                <div className="info-row">
                  <div className="info-icon"><FiUser size={15} /></div>
                  <div>
                    <div className="info-label">Listed by</div>
                    <div className="info-value">{boarding.owner.name}</div>
                    <div style={{fontSize:'0.78rem',color:'var(--muted)'}}>{boarding.owner.email}</div>
                  </div>
                </div>
              )}

              <div className="info-row">
                <div className="info-icon"><FiCalendar size={15} /></div>
                <div>
                  <div className="info-label">Listed on</div>
                  <div className="info-value">{new Date(boarding.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
                </div>
              </div>

              <div style={{marginTop:'1.2rem'}}>
                {isAuth ? (
                  <button onClick={handleFavorite} disabled={favLoading}
                    className={isFav ? 'btn-ghost w-100 justify-content-center' : 'btn-primary-custom w-100 justify-content-center'}
                    style={{padding:'0.75rem',fontSize:'0.9rem',borderRadius:'12px'}}>
                    <FiHeart fill={isFav ? 'currentColor' : 'none'} size={15} />
                    {isFav ? 'Saved to Favourites' : 'Save to Favourites'}
                  </button>
                ) : (
                  <Link to="/login">
                    <button className="btn-primary-custom w-100 justify-content-center" style={{padding:'0.75rem',fontSize:'0.9rem',borderRadius:'12px'}}>
                      Login to Save
                    </button>
                  </Link>
                )}
              </div>

              {boarding.contact && (
                <a href={`tel:${boarding.contact}`}>
                  <button className="btn-ghost w-100 justify-content-center mt-2" style={{padding:'0.7rem',fontSize:'0.9rem',borderRadius:'12px'}}>
                    <FiPhone size={14} />Call Now
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingDetail;