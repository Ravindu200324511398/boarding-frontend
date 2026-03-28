import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter, FiHeart, FiEye, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const BoardingCard = ({ boarding, onFavorite, favorites }) => {
  const isFav = favorites.includes(boarding._id);
  const { isAuth } = useAuth();
  const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;

  return (
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
        {isAuth && (
          <button className="fav-btn" onClick={(e) => { e.preventDefault(); onFavorite(boarding._id, isFav); }}
            style={{position:'absolute',top:'0.8rem',left:'0.8rem'}} title={isFav ? 'Remove' : 'Save'}>
            <FiHeart className={`heart ${isFav ? 'active' : ''}`} fill={isFav ? '#e84444' : 'none'} />
          </button>
        )}
      </div>
      <div className="card-body">
        <h5 className="card-title">{boarding.title}</h5>
        <p className="card-location"><FiMapPin size={12} /> {boarding.location}</p>
        {boarding.amenities?.length > 0 && (
          <div className="amenities-row">
            {boarding.amenities.slice(0, 3).map((a, i) => <span key={i} className="badge-amenity">{a}</span>)}
            {boarding.amenities.length > 3 && <span className="badge-amenity">+{boarding.amenities.length - 3}</span>}
          </div>
        )}
        <div className="card-price-row">
          <div className="card-price">LKR {Number(boarding.price).toLocaleString()}<span>/mo</span></div>
          <Link to={`/boarding/${boarding._id}`}>
            <button className="btn-primary-custom" style={{padding:'0.45rem 1rem',fontSize:'0.82rem',borderRadius:'50px'}}>
              <FiEye size={13} />View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ search: '', location: '', minPrice: '', maxPrice: '', roomType: '' });
  const [heroSearch, setHeroSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const fetchBoardings = useCallback(async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.search) params.search = f.search;
      if (f.location) params.location = f.location;
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      if (f.roomType) params.roomType = f.roomType;
      const res = await api.get('/boardings', { params });
      setBoardings(res.data.boardings);
      setTotalCount(res.data.count);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.favorites.map(f => f._id));
    } catch {}
  }, [isAuth]);

  useEffect(() => { fetchBoardings(); fetchFavorites(); }, []);

  const handleFavorite = async (boardingId, isFav) => {
    if (!isAuth) { navigate('/login'); return; }
    try {
      if (isFav) { await api.delete(`/favorites/${boardingId}`); setFavorites(p => p.filter(id => id !== boardingId)); }
      else { await api.post(`/favorites/${boardingId}`); setFavorites(p => [...p, boardingId]); }
    } catch {}
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const f = { ...filters, search: heroSearch };
    setFilters(f);
    fetchBoardings(f);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClear = () => {
    const f = { search: '', location: '', minPrice: '', maxPrice: '', roomType: '' };
    setFilters(f); setHeroSearch(''); fetchBoardings(f);
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-eyebrow">✨ Sri Lanka's #1 Student Boarding Platform</div>
          <h1>Find Your Perfect<br /><span className="highlight">Boarding Place</span></h1>
          <p>Browse verified boarding houses near universities across Sri Lanka. Safe, affordable, and close to campus.</p>

          <form className="hero-search-wrap" onSubmit={handleHeroSearch}>
            <input type="text" placeholder="Search by location, room type, amenity..."
              value={heroSearch} onChange={e => setHeroSearch(e.target.value)} />
            <button type="submit" className="btn-primary-custom" style={{whiteSpace:'nowrap',flexShrink:0}}>
              <FiSearch size={15} />Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat"><div className="num">{totalCount}+</div><div className="label">Listings</div></div>
            <div className="hero-stat" style={{paddingLeft:'2rem',borderLeft:'1px solid rgba(255,255,255,0.15)'}}><div className="num">Free</div><div className="label">To Browse</div></div>
            <div className="hero-stat" style={{paddingLeft:'2rem',borderLeft:'1px solid rgba(255,255,255,0.15)'}}><div className="num">24/7</div><div className="label">Available</div></div>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <div className="container" style={{marginTop:'-1.5rem',marginBottom:'2rem',position:'relative',zIndex:10}}>
        <div className="row g-3">
          {[
            { icon:'🏠', num: totalCount, label:'Total Listings', cls:'terracotta' },
            { icon:'📍', num:'8+', label:'Cities', cls:'gold' },
            { icon:'✅', num:'100%', label:'Verified', cls:'forest' },
            { icon:'🆓', num:'Free', label:'To List', cls:'sand' },
          ].map((s,i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="stat-card">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div><div className="stat-num">{s.num}</div><div className="stat-label">{s.label}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Listings ── */}
      <div className="container pb-5" id="listings">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-title"><FiFilter size={12} />Filter Listings</div>
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">Keyword</label>
              <input type="text" name="search" className="form-control" placeholder="e.g. WiFi, Kandy..."
                value={filters.search} onChange={e => setFilters({...filters,search:e.target.value})} />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Location</label>
              <input type="text" name="location" className="form-control" placeholder="e.g. Kandy"
                value={filters.location} onChange={e => setFilters({...filters,location:e.target.value})} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Min Price</label>
              <input type="number" className="form-control" placeholder="0"
                value={filters.minPrice} onChange={e => setFilters({...filters,minPrice:e.target.value})} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Max Price</label>
              <input type="number" className="form-control" placeholder="50,000"
                value={filters.maxPrice} onChange={e => setFilters({...filters,maxPrice:e.target.value})} />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Room Type</label>
              <select className="form-select" value={filters.roomType} onChange={e => setFilters({...filters,roomType:e.target.value})}>
                <option value="">All Types</option>
                {['Single','Double','Triple','Annex','Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-1 d-flex gap-2">
              <button className="btn-primary-custom w-100 justify-content-center" onClick={() => fetchBoardings(filters)}
                style={{padding:'0.65rem',fontSize:'0.85rem'}}><FiSearch size={14} /></button>
              {hasFilters && (
                <button className="btn-ghost" onClick={handleClear} style={{padding:'0.65rem',flexShrink:0}} title="Clear filters">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="section-heading">
          <span>{loading ? 'Loading...' : `${boardings.length} Boarding${boardings.length !== 1 ? 's' : ''} Found`}</span>
          <div className="d-flex align-items-center gap-2">
            {hasFilters && <span style={{fontSize:'0.8rem',color:'var(--muted)'}}>Filters applied</span>}
            {isAuth && <Link to="/add"><button className="btn-accent-custom" style={{fontSize:'0.85rem',padding:'0.5rem 1.2rem'}}>+ Add Boarding</button></Link>}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner-container"><div className="spinner-border" /></div>
        ) : boardings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏠</div>
            <h4>No boardings found</h4>
            <p>Try adjusting your filters or search terms.</p>
            {hasFilters && <button className="btn-outline-custom mt-3" onClick={handleClear}><FiX />Clear Filters</button>}
          </div>
        ) : (
          <div className="row g-4">
            {boardings.map(b => (
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