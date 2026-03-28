import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../api/axios';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites')
      .then(res => setFavorites(res.data.favorites))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (boardingId) => {
    try {
      await api.delete(`/favorites/${boardingId}`);
      setFavorites(prev => prev.filter(f => f._id !== boardingId));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{background:'var(--cream)',minHeight:'100vh'}}>
      <div className="page-header">
        <div className="container">
          <h1><FiHeart style={{marginRight:10,color:'#f08080'}} />Saved Places</h1>
          <p>{favorites.length > 0 ? `${favorites.length} boarding${favorites.length > 1 ? 's' : ''} saved` : 'Your saved boarding places appear here'}</p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="spinner-container"><div className="spinner-border" /></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="icon">❤️</div>
            <h4>Nothing saved yet</h4>
            <p>Browse boardings and tap the heart icon to save your favourites.</p>
            <Link to="/"><button className="btn-primary-custom mt-3">Browse Boardings</button></Link>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {favorites.map(boarding => {
                const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;
                return (
                  <div key={boarding._id} className="col-12 col-sm-6 col-lg-4">
                    <div className="boarding-card">
                      <div className="card-img-wrap">
                        {imageUrl
                          ? <img src={imageUrl} alt={boarding.title} className="card-img" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                          : null}
                        <div className="card-img-placeholder" style={{display: imageUrl ? 'none' : 'flex'}}>🏠</div>
                        <div className="card-img-overlay">
                          <span className="price-pill">LKR {Number(boarding.price).toLocaleString()}</span>
                          <span className="room-pill">{boarding.roomType}</span>
                        </div>
                        {/* Saved badge */}
                        <div style={{position:'absolute',top:'0.8rem',left:'0.8rem',background:'rgba(232,68,68,0.9)',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <FiHeart size={14} color="#fff" fill="#fff" />
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{boarding.title}</h5>
                        <p className="card-location"><FiMapPin size={12} /> {boarding.location}</p>
                        {boarding.amenities?.length > 0 && (
                          <div className="amenities-row">
                            {boarding.amenities.slice(0,3).map((a,i) => <span key={i} className="badge-amenity">{a}</span>)}
                          </div>
                        )}
                        <div className="card-price-row">
                          <div className="card-price">LKR {Number(boarding.price).toLocaleString()}<span>/mo</span></div>
                          <div className="d-flex gap-2">
                            <Link to={`/boarding/${boarding._id}`}>
                              <button className="btn-primary-custom" style={{padding:'0.4rem 0.9rem',fontSize:'0.8rem',borderRadius:'50px'}}>
                                <FiEye size={13} />View
                              </button>
                            </Link>
                            <button onClick={() => handleRemove(boarding._id)}
                              style={{background:'#fef2f0',color:'var(--terracotta)',border:'1.5px solid #f5d5c8',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,transition:'all 0.2s'}}
                              title="Remove from saved"
                              onMouseEnter={e => e.currentTarget.style.background='#fde8e0'}
                              onMouseLeave={e => e.currentTarget.style.background='#fef2f0'}>
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div style={{textAlign:'center',marginTop:'3rem',padding:'2rem',background:'var(--white)',borderRadius:'var(--radius-lg)',border:'1px solid var(--parchment)'}}>
              <p style={{color:'var(--muted)',marginBottom:'1rem',fontSize:'0.95rem'}}>Looking for more options?</p>
              <Link to="/"><button className="btn-outline-custom">Browse More Boardings</button></Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;