// ============================================
// Map Page — All boardings as map markers
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';
import api from '../api/axios';

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapPage = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardings = async () => {
      try {
        const res = await api.get('/boardings');
        // Filter only boardings that have coordinates
        const withCoords = res.data.boardings.filter((b) => b.lat && b.lng);
        setBoardings(withCoords);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoardings();
  }, []);

  // Default center: Sri Lanka
  const center = [7.8731, 80.7718];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><FiMapPin style={{marginRight:10}} />Boarding Map</h1>
          <p>
            Showing {boardings.length} boarding{boardings.length !== 1 ? 's' : ''} with GPS coordinates
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="spinner-container"><div className="spinner-border text-primary" /></div>
        ) : boardings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🗺️</div>
            <h4>No locations to show</h4>
            <p>Add boardings with latitude & longitude coordinates to see them on the map.</p>
            <Link to="/add"><button className="btn-primary-custom mt-3">Add a Boarding</button></Link>
          </div>
        ) : (
          <>
            <div className="map-container" style={{ height: 560 }}>
              <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {boardings.map((b) => (
                  <Marker key={b._id} position={[b.lat, b.lng]}>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <h6 style={{ fontWeight:700, marginBottom:'0.3rem', fontSize:'0.95rem' }}>{b.title}</h6>
                        <p style={{ fontSize:'0.8rem', color:'#64748b', marginBottom:'0.2rem' }}>
                          📍 {b.location}
                        </p>
                        <p style={{ fontWeight:700, color:'#2563eb', marginBottom:'0.5rem', fontSize:'0.9rem' }}>
                          LKR {Number(b.price).toLocaleString()}/month
                        </p>
                        <Link to={`/boarding/${b._id}`} style={{ fontSize:'0.8rem', color:'#2563eb', fontWeight:600 }}>
                          View Details →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div style={{ background:'#fff', borderRadius:'var(--radius)', padding:'1rem 1.5rem', marginTop:'1.2rem', boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
              <h6 style={{ fontFamily:'var(--font-heading)', fontWeight:700, marginBottom:'0.8rem' }}>
                📍 {boardings.length} Locations on Map
              </h6>
              <div className="row g-2">
                {boardings.map((b) => (
                  <div key={b._id} className="col-12 col-md-6">
                    <Link to={`/boarding/${b._id}`} style={{ textDecoration:'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 0.8rem', borderRadius:8, border:'1px solid var(--border)', transition:'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        <FiMapPin color="#2563eb" size={13} />
                        <div>
                          <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#0f172a' }}>{b.title}</div>
                          <div style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{b.location} · LKR {Number(b.price).toLocaleString()}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapPage;