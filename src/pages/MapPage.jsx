
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiEye, FiInfo } from 'react-icons/fi';
import api from '../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes spin { to { transform: rotate(360deg); } }

  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.85rem 1.5rem;
    font-weight: 800; font-size: 0.95rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%;
    color: #fff;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
  }
  .reg-submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,212,170,0.5);
  }

  .map-location-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .map-location-item:hover {
    background: rgba(0,212,170,0.06) !important;
    border-color: rgba(0,212,170,0.25) !important;
    transform: translateX(5px);
  }

  .custom-map-popup .leaflet-popup-content-wrapper {
    background: #0d1b3e;
    color: #dce9ff;
    border-radius: 16px;
    border: 1px solid rgba(0,212,170,0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    padding: 4px;
  }
  .custom-map-popup .leaflet-popup-tip {
    background: #0d1b3e;
  }
  .leaflet-bar {
    border: none !important;
    box-shadow: 0 5px 20px rgba(0,0,0,0.4) !important;
  }
  .leaflet-bar a {
    background: #0d1b3e !important;
    color: #dce9ff !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
  }
  .leaflet-bar a:hover {
    background: rgba(0,212,170,0.15) !important;
  }
`;

/* ─── Particle Canvas ─── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.55 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

/* ─── Orb Background ─── */
const OrbBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[
      { w: 600, h: 600, color: '#00d4aa22', top: '-160px', left: '-160px', delay: '0s' },
      { w: 550, h: 550, color: '#0ea5e933', top: '30%', right: '-160px', delay: '-5s' },
      { w: 450, h: 450, color: '#06b6d422', bottom: '-130px', left: '22%', delay: '-10s' },
    ].map((o, i) => (
      <div key={i} style={{
        position: 'absolute', borderRadius: '50%',
        width: o.w, height: o.h,
        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        filter: 'blur(80px)',
        top: o.top, left: o.left, right: o.right, bottom: o.bottom,
        animation: `orbFloat 16s ease-in-out infinite`,
        animationDelay: o.delay,
      }} />
    ))}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
      backgroundSize: '60px 60px',
    }} />
  </div>
);

const MapPage = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardings = async () => {
      try {
        const res = await api.get('/boardings');
        setBoardings(res.data.boardings.filter(b => b.lat && b.lng));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchBoardings();
  }, []);

  const center = [7.8731, 80.7718];

  return (
    <div style={{ background: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)', minHeight: '100vh', color: '#dce9ff', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{SHARED_CSS}</style>
      <OrbBackground />

      {/* ── Header ── */}
      <section style={{ padding: '110px 0 70px', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
        <ParticleCanvas />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div style={{ animation: 'fadeUp 0.7s ease' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
              borderRadius: 99, padding: '6px 18px', marginBottom: '1.5rem',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
              <span style={{ color: 'rgba(180,230,220,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>Live GPS Locations</span>
            </div>

            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#dce9ff' }}>
              Boarding <span style={{ background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Explorer</span>
            </h1>
            <p style={{ color: 'rgba(180,210,255,0.55)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiMapPin style={{ color: '#06b6d4' }} />
              Showing {boardings.length} boarding{boardings.length !== 1 ? 's' : ''} with active GPS locations
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container pb-5" style={{ position: 'relative', zIndex: 5 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(0,212,170,0.2)', borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : boardings.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: 'rgba(255,255,255,0.03)', borderRadius: 30,
            border: '1px dashed rgba(0,212,170,0.2)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🗺️</div>
            <h4 style={{ fontWeight: 800, color: '#dce9ff', fontFamily: "'Cabinet Grotesk', sans-serif" }}>No locations to show</h4>
            <p style={{ color: 'rgba(180,210,255,0.5)', marginBottom: '2rem' }}>Add boardings with latitude & longitude coordinates to see them on the map.</p>
            <Link to="/add">
              <button className="reg-submit-btn" style={{ padding: '0.8rem 2rem', borderRadius: 12 }}>
                Add a Boarding
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Map Container */}
            <div style={{
              height: 560, borderRadius: 28, overflow: 'hidden',
              border: '1px solid rgba(0,212,170,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.08)',
              animation: 'fadeUp 0.6s ease',
            }}>
              <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  eventHandlers={{
                    add: (e) => {
                      e.target.getContainer().style.filter = 'invert(100%) hue-rotate(180deg) brightness(90%) contrast(85%) saturate(0.8)';
                    }
                  }}
                />
                {boardings.map(b => (
                  <Marker key={b._id} position={[b.lat, b.lng]}>
                    <Popup className="custom-map-popup">
                      <div style={{ minWidth: 210, padding: '6px' }}>
                        <h6 style={{ fontWeight: 800, color: '#dce9ff', marginBottom: '0.5rem', fontSize: '0.95rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{b.title}</h6>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(180,210,255,0.6)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiMapPin color="#06b6d4" size={12} /> {b.location}
                        </p>
                        <p style={{ fontWeight: 800, color: '#00d4aa', marginBottom: '1rem', fontSize: '0.92rem' }}>
                          LKR {Number(b.price).toLocaleString()} <span style={{ fontWeight: 400, fontSize: '0.7rem', color: 'rgba(180,210,255,0.4)' }}>/mo</span>
                        </p>
                        <Link to={`/boarding/${b._id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)',
                            color: '#fff', textAlign: 'center',
                            padding: '7px', borderRadius: 10,
                            fontSize: '0.8rem', fontWeight: 700,
                            cursor: 'pointer',
                          }}>
                            View Full Details
                          </div>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Location List */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              borderRadius: 24, padding: '1.8rem',
              marginTop: '2rem',
              border: '1px solid rgba(255,255,255,0.08)',
              animation: 'fadeUp 0.7s ease 0.1s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: 12 }}>
                <div style={{ background: 'rgba(0,212,170,0.12)', padding: 10, borderRadius: 12, border: '1px solid rgba(0,212,170,0.2)' }}>
                  <FiInfo color="#00d4aa" size={18} />
                </div>
                <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, margin: 0, color: '#dce9ff' }}>
                  Quick Navigation List
                </h5>
              </div>

              <div className="row g-3">
                {boardings.map(b => (
                  <div key={b._id} className="col-12 col-md-6 col-lg-4">
                    <Link to={`/boarding/${b._id}`} style={{ textDecoration: 'none' }}>
                      <div className="map-location-item">
                        <div style={{ background: 'rgba(0,212,170,0.1)', padding: 10, borderRadius: 10, border: '1px solid rgba(0,212,170,0.15)', flexShrink: 0 }}>
                          <FiMapPin color="#00d4aa" size={15} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#dce9ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(180,210,255,0.45)' }}>
                            {b.location} · <span style={{ color: '#00d4aa', fontWeight: 600 }}>LKR {Number(b.price).toLocaleString()}</span>
                          </div>
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