// ============================================
// Boarding Detail Page
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiHeart, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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
      } catch {
        setError('Boarding not found.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavStatus = async () => {
      if (!isAuth) return;
      try {
        const res = await api.get('/favorites');
        const favIds = res.data.favorites.map((f) => f._id);
        setIsFav(favIds.includes(id));
      } catch {}
    };

    fetchBoarding();
    fetchFavStatus();
  }, [id, isAuth]);

  const handleFavorite = async () => {
    if (!isAuth) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        setIsFav(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this boarding?')) return;
    try {
      await api.delete(`/boardings/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;
  if (error) return <div className="container py-5 text-center"><p style={{color:'#ef4444'}}>{error}</p><Link to="/"><button className="btn-primary-custom mt-2">Go Home</button></Link></div>;

  const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;
  const isOwner = user && boarding.owner?._id === user.id;

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      {/* Back Button */}
      <button className="btn-outline-custom mb-4" onClick={() => navigate(-1)} style={{ fontSize:'0.875rem' }}>
        <FiArrowLeft style={{marginRight:6}} />Back
      </button>

      <div className="row g-4">
        {/* Image */}
        <div className="col-12">
          {imageUrl ? (
            <img src={imageUrl} alt={boarding.title} className="detail-image" />
          ) : (
            <div className="detail-image-placeholder">🏠</div>
          )}
        </div>

        {/* Main Info */}
        <div className="col-md-8">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, color:'var(--dark)' }}>
              {boarding.title}
            </h1>
            {isAuth && (
              <button className="fav-btn ms-3" onClick={handleFavorite} disabled={favLoading}>
                <FiHeart className={`heart ${isFav ? 'active' : ''}`} style={{ fontSize:'1.8rem' }} />
              </button>
            )}
          </div>

          <p className="card-location mb-3" style={{ fontSize:'1rem' }}>
            <FiMapPin /> {boarding.location}
          </p>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge-room" style={{ fontSize:'0.85rem', padding:'0.35rem 0.9rem' }}>{boarding.roomType}</span>
            {boarding.amenities?.map((a, i) => (
              <span key={i} className="badge-amenity" style={{ fontSize:'0.85rem' }}>{a}</span>
            ))}
          </div>

          <div style={{ background:'#f8fafc', borderRadius:12, padding:'1.2rem', marginBottom:'1.5rem', border:'1px solid var(--border)' }}>
            <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:700, marginBottom:'0.6rem' }}>Description</h5>
            <p style={{ color:'#475569', lineHeight:1.7 }}>{boarding.description}</p>
          </div>

          {/* Coordinates */}
          {boarding.lat && boarding.lng && (
            <div style={{ background:'#eff6ff', borderRadius:12, padding:'1rem', marginBottom:'1.5rem', border:'1px solid #bfdbfe' }}>
              <h6 style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'#1d4ed8', marginBottom:'0.3rem' }}>📍 GPS Coordinates</h6>
              <p style={{ fontSize:'0.875rem', color:'#1e40af', marginBottom:0 }}>
                Lat: {boarding.lat}, Lng: {boarding.lng}
              </p>
              <a
                href={`https://maps.google.com/?q=${boarding.lat},${boarding.lng}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize:'0.85rem', color:'#2563eb', fontWeight:600 }}
              >
                Open in Google Maps →
              </a>
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <button className="btn btn-danger" onClick={handleDelete} style={{ borderRadius:10 }}>
              <FiTrash2 style={{marginRight:6}} />Delete This Boarding
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          <div style={{ background:'#fff', borderRadius:'var(--radius)', padding:'1.5rem', boxShadow:'var(--shadow)', border:'1px solid var(--border)', position:'sticky', top:90 }}>
            <p className="card-price" style={{ fontSize:'1.8rem', marginBottom:'0.3rem' }}>
              LKR {Number(boarding.price).toLocaleString()}
              <span style={{ fontSize:'0.85rem' }}>/month</span>
            </p>

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
              Listed on {new Date(boarding.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
            </div>

            {isAuth ? (
              <button
                className={`w-100 mt-3 ${isFav ? 'btn-outline-custom' : 'btn-accent-custom'}`}
                onClick={handleFavorite}
                disabled={favLoading}
                style={{ justifyContent:'center', padding:'0.7rem' }}
              >
                <FiHeart style={{marginRight:6}} />
                {isFav ? 'Remove from Favorites' : 'Save to Favorites'}
              </button>
            ) : (
              <Link to="/login">
                <button className="btn-primary-custom w-100 mt-3 justify-content-center">
                  Login to Save
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingDetail;