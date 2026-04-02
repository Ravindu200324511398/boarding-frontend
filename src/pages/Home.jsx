// ============================================
// Home Page — Hero + Boarding Listings
// ============================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiHeart, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../api/axios';
import { StarDisplay } from '../components/StarRating';

// ── Boarding Card ────────────────────────────
const BoardingCard = ({ boarding, onFavorite, favorites }) => {
  const isFav = favorites.includes(boarding._id);
  const { isAuth } = useAuth();
  const { format } = useCurrency();

  const imageUrl = boarding.image
    ? `http://localhost:5001/uploads/${boarding.image}`
    : null;

  return (
    <div className="boarding-card">
      {/* Image */}
      {imageUrl ? (
        <img src={imageUrl} alt={boarding.title} className="card-img" />
      ) : (
        <div className="card-img-placeholder">🏠</div>
      )}

      {/* Body */}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title">{boarding.title}</h5>
          {isAuth && (
            <button className="fav-btn" onClick={() => onFavorite(boarding._id, isFav)} title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
              <FiHeart className={`heart ${isFav ? 'active' : ''}`} />
            </button>
          )}
        </div>

        {boarding.avgRating > 0 && (
          <div style={{ marginBottom: '0.3rem' }}>
            <StarDisplay rating={boarding.avgRating} size={13} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.3rem' }}>({boarding.totalRatings})</span>
          </div>
        )}

        <p className="card-location">
          <FiMapPin size={13} /> {boarding.location}
        </p>

        <div className="mb-2">
          <span className="badge-room">{boarding.roomType}</span>
        </div>

        {boarding.amenities?.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {boarding.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="badge-amenity">{a}</span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <p className="card-price">
            {format(boarding.price)}
            <span>/month</span>
          </p>
          <Link to={`/boarding/${boarding._id}`}>
            <button className="btn-primary-custom w-100 justify-content-center" style={{ fontSize: '0.875rem' }}>
              <FiEye />View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Home Component ───────────────────────────
const Home = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    search: '', location: '', minPrice: '', maxPrice: '', roomType: ''
  });
  const [heroSearch, setHeroSearch] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  // Fetch boardings with current filters
  const fetchBoardings = useCallback(async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (appliedFilters.search)    params.search    = appliedFilters.search;
      if (appliedFilters.location)  params.location  = appliedFilters.location;
      if (appliedFilters.minPrice)  params.minPrice  = appliedFilters.minPrice;
      if (appliedFilters.maxPrice)  params.maxPrice  = appliedFilters.maxPrice;
      if (appliedFilters.roomType)  params.roomType  = appliedFilters.roomType;

      const res = await api.get('/boardings', { params });
      setBoardings(res.data.boardings);
      setStats({ total: res.data.count });
    } catch (err) {
      console.error('Failed to fetch boardings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.favorites.map((f) => f._id));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  }, [isAuth]);

  useEffect(() => {
    fetchBoardings();
    fetchFavorites();
  }, []);

  // Toggle favorite
  const handleFavorite = async (boardingId, isFav) => {
    if (!isAuth) { navigate('/login'); return; }
    try {
      if (isFav) {
        await api.delete(`/favorites/${boardingId}`);
        setFavorites((prev) => prev.filter((id) => id !== boardingId));
      } else {
        await api.post(`/favorites/${boardingId}`);
        setFavorites((prev) => [...prev, boardingId]);
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => fetchBoardings(filters);

  const handleClearFilters = () => {
    const cleared = { search: '', location: '', minPrice: '', maxPrice: '', roomType: '' };
    setFilters(cleared);
    setHeroSearch('');
    fetchBoardings(cleared);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const updated = { ...filters, search: heroSearch };
    setFilters(updated);
    fetchBoardings(updated);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="hero-banner">
        <div className="container position-relative">
          <h1>Find Your Perfect <span className="highlight">Boarding Place</span></h1>
          <p>Browse hundreds of verified boarding houses near universities across Sri Lanka</p>

          <form className="hero-search" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="Search by location, name..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary-custom" style={{ whiteSpace: 'nowrap' }}>
              <FiSearch />Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <div className="container mt-4 mb-2">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-num">100%</div>
              <div className="stat-label">Verified</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-num">Free</div>
              <div className="stat-label">To List</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-num">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar + Listings ── */}
      <div className="container py-4" id="listings">
        {/* Filters */}
        <div className="filter-bar">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label"><FiSearch size={13} style={{ marginRight: 4 }} />Search</label>
              <input
                type="text" name="search" className="form-control"
                placeholder="Keywords..." value={filters.search} onChange={handleFilterChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label"><FiMapPin size={13} style={{ marginRight: 4 }} />Location</label>
              <input
                type="text" name="location" className="form-control"
                placeholder="e.g. Kandy" value={filters.location} onChange={handleFilterChange}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Min Price (LKR)</label>
              <input
                type="number" name="minPrice" className="form-control"
                placeholder="0" value={filters.minPrice} onChange={handleFilterChange}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Max Price (LKR)</label>
              <input
                type="number" name="maxPrice" className="form-control"
                placeholder="50000" value={filters.maxPrice} onChange={handleFilterChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Room Type</label>
              <select name="roomType" className="form-select" value={filters.roomType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
                <option>Annex</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-12 col-md-1 d-flex gap-2">
              <button className="btn-primary-custom w-100 justify-content-center" onClick={handleApplyFilters}
                style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}>
                <FiFilter />
              </button>
              <button className="btn-outline-custom" onClick={handleClearFilters}
                style={{ padding: '0.65rem 0.7rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            {loading ? 'Loading...' : `${boardings.length} Boarding${boardings.length !== 1 ? 's' : ''} Found`}
          </h5>
          {isAuth && (
            <Link to="/add">
              <button className="btn-accent-custom" style={{ fontSize: '0.875rem' }}>
                + Add Boarding
              </button>
            </Link>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : boardings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏠</div>
            <h4>No boardings found</h4>
            <p>Try adjusting your search filters or check back later.</p>
            {isAuth && (
              <Link to="/add">
                <button className="btn-primary-custom mt-3">Add the first boarding!</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {boardings.map((b) => (
              <div key={b._id} className="col-12 col-sm-6 col-lg-4">
                <BoardingCard boarding={b} onFavorite={handleFavorite} favorites={favorites} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;