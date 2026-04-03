import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiEye, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import { useCurrency } from '../context/CurrencyContext';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { format, currency } = useCurrency();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data.favorites);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (boardingId) => {
    try {
      await api.delete(`/favorites/${boardingId}`);
      setFavorites((prev) => prev.filter((f) => f._id !== boardingId));
    } catch (err) {
      console.error('Remove favorite failed:', err);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fff' }}>
      <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fav-card { animation: slideUp 0.4s ease-out forwards; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #f1f5f9; background: #fff; border-radius: 28px; overflow: hidden; }
        .fav-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .fav-img-container { height: 200px; width: 100%; overflow: hidden; position: relative; }
        .fav-img { width: 100%; height: 100%; object-fit: cover; }
        .fav-badge { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); color: #10b981; padding: 5px 12px; borderRadius: 12px; font-weight: 800; font-size: 0.75rem; backdrop-filter: blur(4px); }
      `}</style>

      {/* Header - Emerald Brand Gradient */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #10b981 100%)", padding: "4rem 0 6.5rem" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 12, padding: "0.6rem 1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, marginBottom: "2rem" }}>
            <FiArrowLeft size={18} /> Back
          </button>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.8rem", fontWeight: 800, color: "#fff", margin: 0 }}>Saved Places</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", marginTop: "10px" }}>Your personal collection of favorite boardings</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, marginTop: "-4rem", paddingBottom: "6rem" }}>
        {favorites.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 32, padding: "6rem 2rem", textAlign: "center", border: '1px solid #f1f5f9', boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
            {/* Emerald Styled Symbol */}
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: '#10b981', opacity: 0.1, borderRadius: '50%', transform: 'scale(1.4)' }}></div>
              <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)", borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(16,185,129,0.3)', zIndex: 2 }}>
                <FiHeart size={35} color="#fff" />
              </div>
            </div>
            <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: '1.8rem', marginBottom: '0.8rem', fontFamily: "Georgia, serif" }}>No favorites yet</h3>
            <p style={{ color: "#64748b", maxWidth: '350px', margin: '0 auto 2rem', lineHeight: 1.6 }}>Start exploring boarding places and save the ones that catch your eye!</p>
            <Link to="/"><button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}>Browse Boardings</button></Link>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((boarding) => {
              const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;
              return (
                <div key={boarding._id} className="col-12 col-sm-6 col-lg-4">
                  <div className="fav-card">
                    {/* Image Section */}
                    <div className="fav-img-container">
                      {imageUrl ? (
                        <img src={imageUrl} alt={boarding.title} className="fav-img" />
                      ) : (
                        <div style={{ height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
                      )}
                      <div className="fav-badge">{boarding.roomType}</div>
                    </div>

                    {/* Details Section */}
                    <div style={{ padding: '1.8rem' }}>
                      <h5 style={{ fontWeight: 800, color: "#1e293b", fontSize: '1.25rem', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.title}</h5>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.2rem' }}>
                        <FiMapPin color="#10b981" /> {boarding.location}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{format(boarding.price)}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>/ month</span>
                      </div>

                      {currency.code !== 'LKR' && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-18px', marginBottom: '18px' }}>
                          ≈ LKR {Number(boarding.price).toLocaleString()} original
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to={`/boarding/${boarding._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                          <button style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}>
                            <FiEye /> View Details
                          </button>
                        </Link>
                        <button
                          onClick={() => handleRemove(boarding._id)}
                          style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.8rem', borderRadius: 15, cursor: 'pointer', transition: '0.2s' }}
                          title="Remove from favorites"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
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

export default Favorites;