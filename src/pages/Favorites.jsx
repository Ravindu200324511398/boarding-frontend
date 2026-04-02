// ============================================
// Favorites Page
// ============================================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiEye } from 'react-icons/fi';
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

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><FiHeart style={{marginRight:10}} />My Favorites</h1>
          <p>Your saved boarding places</p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="spinner-container"><div className="spinner-border text-primary" /></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="icon">❤️</div>
            <h4>No favorites yet</h4>
            <p>Browse boardings and save the ones you like!</p>
            <Link to="/"><button className="btn-primary-custom mt-3">Browse Boardings</button></Link>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((boarding) => {
              const imageUrl = boarding.image ? `http://localhost:5001/uploads/${boarding.image}` : null;
              return (
                <div key={boarding._id} className="col-12 col-sm-6 col-lg-4">
                  <div className="boarding-card">
                    {imageUrl ? (
                      <img src={imageUrl} alt={boarding.title} className="card-img" />
                    ) : (
                      <div className="card-img-placeholder">🏠</div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{boarding.title}</h5>
                      <p className="card-location"><FiMapPin size={13} /> {boarding.location}</p>
                      <div className="mb-2"><span className="badge-room">{boarding.roomType}</span></div>
                      <p className="card-price">
                        {format(boarding.price)}<span>/month</span>
                      </p>
                      {currency.code !== 'LKR' && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '8px' }}>
                          ≈ LKR {Number(boarding.price).toLocaleString()} original
                        </p>
                      )}
                      <div className="d-flex gap-2 mt-auto">
                        <Link to={`/boarding/${boarding._id}`} style={{ flex:1 }}>
                          <button className="btn-primary-custom w-100 justify-content-center" style={{ fontSize:'0.85rem' }}>
                            <FiEye />View
                          </button>
                        </Link>
                        <button
                          className="btn-outline-custom"
                          onClick={() => handleRemove(boarding._id)}
                          style={{ padding:'0.65rem 0.9rem', color:'#ef4444', borderColor:'#ef4444' }}
                          title="Remove from favorites"
                        >
                          <FiTrash2 />
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