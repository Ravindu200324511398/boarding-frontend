import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';
import api from '../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapPage = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/boardings')
      .then(res => setBoardings(res.data.boardings.filter(b => b.lat && b.lng)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{background:'var(--cream)',minHeight:'100vh'}}>
      <div className="page-header">
        <div className="container">
          <h1><FiMapPin style={{marginRight:10}} />Boarding Map</h1>
          <p>{boardings.length} listing{boardings.length !== 1 ? 's' : ''} with GPS coordinates across Sri Lanka</p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="spinner-container"><div className="spinner-border" /></div>
        ) : boardings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🗺️</div>
            <h4>No locations yet</h4>
            <p>Add boardings with GPS coordinates to see them on the map.</p>
            <Link to="/add"><button className="btn-primary-custom mt-3">Add a Boarding</button></Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Map */}
            <div className="col-12">
              <div className="map-container" style={{height:520}}>
                <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{height:'100%',width:'100%'}}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {boardings.map(b => (
                    <Marker key={b._id} position={[b.lat, b.lng]}
                      eventHandlers={{ click: () => setSelected(b) }}>
                      <Popup>
                        <div style={{minWidth:200,fontFamily:'var(--font-body)'}}>
                          <div style={{fontWeight:700,fontSize:'0.95rem',marginBottom:'0.3rem',color:'var(--ink)'}}>{b.title}</div>
                          <div style={{fontSize:'0.8rem',color:'#64748b',marginBottom:'0.3rem',display:'flex',alignItems:'center',gap:'0.3rem'}}>
                            <FiMapPin size={11} />{b.location}
                          </div>
                          <div style={{fontWeight:700,color:'var(--terracotta)',fontSize:'0.95rem',marginBottom:'0.6rem'}}>
                            LKR {Number(b.price).toLocaleString()}/mo
                          </div>
                          <Link to={`/boarding/${b._id}`}>
                            <button style={{background:'var(--terracotta)',color:'#fff',border:'none',borderRadius:'8px',padding:'0.35rem 0.8rem',fontWeight:600,cursor:'pointer',fontSize:'0.8rem',width:'100%'}}>
                              View Details →
                            </button>
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Location list */}
            <div className="col-12">
              <div style={{background:'var(--white)',borderRadius:'var(--radius-lg)',padding:'1.5rem',border:'1px solid var(--parchment)',boxShadow:'var(--shadow-sm)'}}>
                <h5 style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',marginBottom:'1rem',color:'var(--ink)'}}>
                  📍 All Locations ({boardings.length})
                </h5>
                <div className="row g-2">
                  {boardings.map(b => (
                    <div key={b._id} className="col-12 col-md-6 col-lg-4">
                      <Link to={`/boarding/${b._id}`} style={{textDecoration:'none'}}>
                        <div style={{
                          display:'flex',alignItems:'center',gap:'0.7rem',
                          padding:'0.7rem 1rem',borderRadius:'12px',border:'1.5px solid var(--parchment)',
                          transition:'all 0.2s',cursor:'pointer',
                          background: selected?._id === b._id ? 'var(--terracotta-light)' : 'transparent',
                          borderColor: selected?._id === b._id ? 'var(--terracotta)' : 'var(--parchment)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='var(--cream)'; e.currentTarget.style.borderColor='var(--sand)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background=selected?._id===b._id?'var(--terracotta-light)':'transparent'; e.currentTarget.style.borderColor=selected?._id===b._id?'var(--terracotta)':'var(--parchment)'; }}>
                          <div style={{width:36,height:36,background:'var(--terracotta-light)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <FiMapPin size={14} color="var(--terracotta)" />
                          </div>
                          <div style={{minWidth:0}}>
                            <div style={{fontSize:'0.875rem',fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</div>
                            <div style={{fontSize:'0.78rem',color:'var(--muted)'}}>{b.location} · LKR {Number(b.price).toLocaleString()}</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;