import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FiHome, FiMapPin, FiDollarSign, FiUsers, FiPhone,
  FiFileText, FiPlus, FiX, FiUpload, FiSave, FiZap,
  FiCheckCircle, FiAlertCircle, FiRefreshCw, FiEdit3
} from 'react-icons/fi';
import api from '../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const AMENITY_OPTIONS = [
  'WiFi', 'Hot Water', 'Air Conditioning', 'Fan', 'Attached Bathroom',
  'Kitchen Access', 'Laundry', 'Parking', 'Furnished', 'Study Desk',
  'CCTV', 'Private Entrance', 'Common Kitchen', 'Meals Available',
];
const ROOM_TYPES  = ['Single', 'Double', 'Triple', 'Annex', 'Studio'];
const GENDER_OPTS = ['Any', 'Male', 'Female'];
const SRI_LANKA_CENTER = [7.8731, 80.7718];

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
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45, vy: -Math.random() * 0.65 - 0.25,
      alpha: Math.random() * 0.55 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .add-section {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(12px);
    animation: fadeUp 0.5s ease both;
  }

  .add-submit-btn {
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%;
    color: #fff;
    border: none;
    border-radius: 13px;
    padding: 0.9rem 2.2rem;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    animation: shimmerBtn 4s linear infinite;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .add-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px rgba(0,212,170,0.5);
  }
  .add-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .ai-gen-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: linear-gradient(135deg, #0ea5e9, #06b6d4);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 0.65rem 1.2rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .ai-gen-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,165,233,0.4); }
  .ai-gen-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .ai-sec-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: rgba(14,165,233,0.1);
    color: #0ea5e9;
    border: 1.5px solid rgba(14,165,233,0.25);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.18s;
  }
  .ai-sec-btn:hover:not(:disabled) { background: rgba(14,165,233,0.18); }
  .ai-sec-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .amenity-chip {
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 500;
  }
  .amenity-chip.active {
    background: rgba(0,212,170,0.15);
    border: 1.5px solid rgba(0,212,170,0.5);
    color: #00d4aa;
    font-weight: 700;
  }
  .amenity-chip.inactive {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.1);
    color: rgba(220,233,255,0.5);
  }
  .amenity-chip.inactive:hover { border-color: rgba(0,212,170,0.3); color: rgba(220,233,255,0.8); }

  .room-type-btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .room-type-btn.active {
    border: 1.5px solid rgba(0,212,170,0.6);
    background: rgba(0,212,170,0.12);
    color: #00d4aa;
    font-weight: 700;
  }
  .room-type-btn.inactive {
    border: 1.5px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.03);
    color: rgba(220,233,255,0.5);
    font-weight: 500;
  }
  .room-type-btn.inactive:hover { border-color: rgba(0,212,170,0.3); }

  .add-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    background: rgba(255,255,255,0.04);
  }
  .add-input-wrap.focused {
    border-color: rgba(0,212,170,0.55);
    background: rgba(0,212,170,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }

  .add-inp {
    border: none;
    outline: none;
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.93rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    color: rgba(220,233,255,0.9);
    width: 100%;
  }
  .add-inp::placeholder { color: rgba(220,233,255,0.25); }

  .add-inp-icon {
    padding: 0 0.85rem;
    color: rgba(0,212,170,0.65);
    display: flex;
    align-items: center;
    border-right: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    align-self: stretch;
  }

  .add-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(220,233,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .section-num {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cancel-btn {
    background: rgba(255,255,255,0.06);
    color: rgba(220,233,255,0.6);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 0.9rem 1.8rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s;
  }
  .cancel-btn:hover { background: rgba(255,255,255,0.1); }

  textarea.add-inp {
    resize: vertical;
    min-height: 120px;
    padding: 0.85rem 1rem;
  }

  .add-textarea-wrap {
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255,255,255,0.04);
    transition: all 0.2s;
  }
  .add-textarea-wrap.focused {
    border-color: rgba(0,212,170,0.55);
    background: rgba(0,212,170,0.03);
    box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }

  .add-ai-box {
    background: rgba(14,165,233,0.05);
    border: 1.5px dashed rgba(14,165,233,0.25);
    border-radius: 14px;
    padding: 1.2rem 1.3rem;
    margin-bottom: 1.4rem;
  }

  .ai-result-card {
    background: rgba(0,212,170,0.05);
    border: 1.5px solid rgba(0,212,170,0.2);
    border-radius: 14px;
    padding: 1.2rem 1.3rem;
    margin-top: 0.8rem;
    position: relative;
    overflow: hidden;
  }

  .custom-amenity-input {
    flex: 1;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none;
    color: rgba(220,233,255,0.9);
    background: rgba(255,255,255,0.04);
    transition: border-color 0.2s;
  }
  .custom-amenity-input::placeholder { color: rgba(220,233,255,0.25); }
  .custom-amenity-input:focus { border-color: rgba(0,212,170,0.5); }

  .add-btn-sm {
    background: rgba(0,212,170,0.1);
    color: #00d4aa;
    border: 1.5px solid rgba(0,212,170,0.3);
    border-radius: 10px;
    padding: 0.6rem 1rem;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .add-btn-sm:hover { background: rgba(0,212,170,0.18); }

  .custom-chip {
    background: rgba(14,165,233,0.1);
    color: #0ea5e9;
    border: 1px solid rgba(14,165,233,0.25);
    border-radius: 20px;
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .map-wrap {
    border-radius: 14px;
    overflow: hidden;
    border: 1.5px solid rgba(255,255,255,0.1);
    height: 340px;
    position: relative;
  }

  .coord-input {
    width: 100%;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 0.55rem 0.85rem;
    font-size: 0.85rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: rgba(220,233,255,0.9);
    outline: none;
    background: rgba(255,255,255,0.05);
    transition: border-color 0.2s;
  }
  .coord-input:focus { border-color: rgba(0,212,170,0.5); }
  .coord-input::placeholder { color: rgba(220,233,255,0.25); }

  .img-upload-slot {
    border: 2px dashed rgba(255,255,255,0.12);
    border-radius: 10px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.03);
    gap: 0.3rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .img-upload-slot:hover { border-color: rgba(0,212,170,0.4); }

  @media (max-width: 767px) {
    .add-section { padding: 1.4rem; }
  }
`;

const inpBaseStyle = {
  border: 'none', outline: 'none', flex: 1,
  padding: '0.75rem 1rem', fontSize: '0.93rem',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  background: 'transparent',
  color: 'rgba(220,233,255,0.9)', width: '100%',
};

const AIButton = ({ onClick, loading, label, icon, variant = 'primary' }) => (
  <button type="button" onClick={onClick} disabled={loading}
    className={variant === 'primary' ? 'ai-gen-btn' : 'ai-sec-btn'}>
    {loading
      ? <><span className="spinner-border spinner-border-sm" style={{ width: '0.8rem', height: '0.8rem' }} /> Generating...</>
      : <>{icon || <FiZap size={14} />} {label}</>}
  </button>
);

const Field = ({ label, hint, required, children, badge }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
      <label className="add-label" style={{ marginBottom: 0 }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {badge && (
        <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.5rem', borderRadius: 20, letterSpacing: '0.06em' }}>
          {badge}
        </span>
      )}
    </div>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: 'rgba(220,233,255,0.3)', margin: '0.3rem 0 0' }}>{hint}</p>}
  </div>
);

const AIResultCard = ({ title, description, onApply, onRegenerate, loading }) => (
  <div className="ai-result-card">
    <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(135deg,rgba(0,212,170,0.15),transparent)', borderRadius: '0 14px 0 60px' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
      <FiZap size={14} color="#00d4aa" />
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Generated</span>
    </div>
    {title && (
      <>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(220,233,255,0.35)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgba(220,233,255,0.9)', margin: '0 0 0.9rem', lineHeight: 1.4 }}>{title}</p>
      </>
    )}
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(220,233,255,0.35)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
    <p style={{ fontSize: '0.88rem', color: 'rgba(220,233,255,0.7)', margin: '0 0 1rem', lineHeight: 1.65 }}>{description}</p>
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
      <button type="button" onClick={onApply} className="ai-gen-btn">
        <FiCheckCircle size={13} /> Apply to form
      </button>
      <button type="button" onClick={onRegenerate} disabled={loading} className="ai-sec-btn">
        <FiRefreshCw size={12} /> Regenerate
      </button>
    </div>
  </div>
);

const SectionHead = ({ number, title, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="section-num">
      <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{number}</span>
    </div>
    <div>
      <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'rgba(220,233,255,0.9)' }}>{title}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.35)', marginTop: '0.1rem' }}>{sub}</div>}
    </div>
  </div>
);

const InputWrapper = ({ icon, children, isFocused }) => (
  <div className={`add-input-wrap${isFocused ? ' focused' : ''}`}>
    {icon && <span className="add-inp-icon">{icon}</span>}
    {children}
  </div>
);

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({ click(e) { onLocationSelect(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const MapPicker = ({ lat, lng, onChange }) => {
  const hasPin = lat !== '' && lng !== '';
  const markerPos = hasPin ? [parseFloat(lat), parseFloat(lng)] : null;
  const handleSelect = useCallback((newLat, newLng) => {
    onChange(parseFloat(newLat.toFixed(6)), parseFloat(newLng.toFixed(6)));
  }, [onChange]);

  return (
    <div>
      <div style={{
        background: hasPin ? 'rgba(0,212,170,0.08)' : 'rgba(14,165,233,0.06)',
        border: `1.5px solid ${hasPin ? 'rgba(0,212,170,0.3)' : 'rgba(14,165,233,0.2)'}`,
        borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiMapPin size={15} color={hasPin ? '#00d4aa' : '#0ea5e9'} />
          {hasPin ? (
            <span style={{ fontSize: '0.85rem', color: '#00d4aa', fontWeight: 600 }}>
              📍 Location pinned — <span style={{ fontWeight: 400, color: 'rgba(220,233,255,0.6)' }}>{lat}, {lng}</span>
            </span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#0ea5e9', fontWeight: 600 }}>Click anywhere on the map to drop a pin</span>
          )}
        </div>
        {hasPin && (
          <button type="button" onClick={() => onChange('', '')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <FiX size={12} /> Clear pin
          </button>
        )}
      </div>
      <div className="map-wrap">
        <MapContainer center={markerPos || SRI_LANKA_CENTER} zoom={markerPos ? 14 : 7} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onLocationSelect={handleSelect} />
          {markerPos && <Marker position={markerPos} />}
        </MapContainer>
        {!hasPin && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(6,15,40,0.85)', color: '#fff', borderRadius: 20, padding: '0.35rem 0.9rem', fontSize: '0.75rem', fontWeight: 600, zIndex: 1000, backdropFilter: 'blur(6px)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            🗺️ Scroll to zoom · Click to pin location
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.75rem' }}>
        {[{ key: 'lat', label: 'Latitude', val: lat }, { key: 'lng', label: 'Longitude', val: lng }].map(({ key, label, val }) => (
          <div key={key}>
            <label className="add-label">{label}</label>
            <input type="number" step="any" value={val}
              onChange={e => { const v = e.target.value; key === 'lat' ? onChange(v, lng) : onChange(lat, v); }}
              placeholder={key === 'lat' ? '7.8731' : '80.7718'}
              className="coord-input" />
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.74rem', color: 'rgba(220,233,255,0.3)', margin: '0.4rem 0 0' }}>You can also type coordinates directly above if you know the exact location.</p>
    </div>
  );
};

const AddBoarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', location: '', price: '', roomType: 'Single', gender: 'Any', contact: '', lat: '', lng: '' });
  const [amenities, setAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiImproving, setAiImproving] = useState(false);
  const [aiImproved, setAiImproved] = useState(null);
  const [aiError, setAiError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handleMapChange = useCallback((newLat, newLng) => { setForm(f => ({ ...f, lat: newLat, lng: newLng })); }, []);
  const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) { setAmenities(prev => [...prev, trimmed]); setCustomAmenity(''); }
  };
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 8) { setError('Maximum 8 photos allowed'); return; }
    const oversized = files.find(f => f.size > 5 * 1024 * 1024);
    if (oversized) { setError('Each image must be under 5MB'); return; }
    setImages(prev => [...prev, ...files]);
    files.forEach(file => { const reader = new FileReader(); reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]); reader.readAsDataURL(file); });
  };
  const removeImage = (idx) => { setImages(prev => prev.filter((_, i) => i !== idx)); setImagePreviews(prev => prev.filter((_, i) => i !== idx)); };

  const handleGenerate = async () => {
    if (!form.location || !form.price || !form.roomType) { setAiError('Please fill in Location, Price and Room Type before generating.'); return; }
    setAiLoading(true); setAiError(''); setAiResult(null);
    try {
      const res = await api.post('/ai/generate-listing', { location: form.location, price: form.price, roomType: form.roomType, amenities, gender: form.gender, description: form.description });
      setAiResult({ title: res.data.title, description: res.data.description });
    } catch (err) { setAiError(err.response?.data?.message || 'AI generation failed. Please try again.'); }
    finally { setAiLoading(false); }
  };

  const handleImprove = async () => {
    if (!form.description.trim()) { setAiError('Write something in the description field first, then click Improve.'); return; }
    setAiImproving(true); setAiError(''); setAiImproved(null);
    try {
      const res = await api.post('/ai/improve-listing', { existingDescription: form.description, location: form.location, roomType: form.roomType, price: form.price });
      setAiImproved({ description: res.data.description });
    } catch (err) { setAiError(err.response?.data?.message || 'AI improve failed. Please try again.'); }
    finally { setAiImproving(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.price || !form.contact) { setError('Please fill in all required fields.'); return; }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      amenities.forEach(a => formData.append('amenities', a));
      if (images.length > 0) images.forEach(img => formData.append('images', img));
      await api.post('/boardings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Listing created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Failed to create listing. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ background: '#060f2a', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <ParticleCanvas />

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: '#0ea5e944', top: '-150px', left: '-150px', delay: '0s' },
          { w: 500, h: 500, color: '#00d4aa22', top: '40%', right: '-140px', delay: '-6s' },
          { w: 400, h: 400, color: '#06b6d422', bottom: '-100px', left: '30%', delay: '-11s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(0,212,170,0.12) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 0 3.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)' }} />
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
            <FiHome size={22} color="rgba(0,212,170,0.8)" />
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#dce9ff', margin: 0 }}>Add Boarding Listing</h1>
          </div>
          <p style={{ color: 'rgba(220,233,255,0.5)', margin: 0, fontSize: '0.9rem' }}>Fill in the details below — or let AI write the perfect listing for you ✨</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiAlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiCheckCircle size={15} /> {success}
            </div>
          )}

          {/* Section 1 */}
          <div className="add-section">
            <SectionHead number="1" title="Basic Details" sub="Location, price, and room type" />
            <div className="row g-3">
              <div className="col-md-6">
                <Field label="Location" required>
                  <InputWrapper icon={<FiMapPin size={15} />} isFocused={focused === 'location'}>
                    <input name="location" value={form.location} onChange={e => set('location', e.target.value)} onFocus={() => setFocused('location')} onBlur={() => setFocused('')} placeholder="e.g. Nugegoda, Colombo" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Monthly Price (LKR)" required>
                  <InputWrapper icon={<FiDollarSign size={15} />} isFocused={focused === 'price'}>
                    <input name="price" type="number" value={form.price} onChange={e => set('price', e.target.value)} onFocus={() => setFocused('price')} onBlur={() => setFocused('')} placeholder="e.g. 15000" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Room Type" required>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ROOM_TYPES.map(t => (
                      <button type="button" key={t} onClick={() => set('roomType', t)} className={`room-type-btn ${form.roomType === t ? 'active' : 'inactive'}`}>{t}</button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Suitable For">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {GENDER_OPTS.map(g => (
                      <button type="button" key={g} onClick={() => set('gender', g)} className={`room-type-btn ${form.gender === g ? 'active' : 'inactive'}`} style={{ flex: 1 }}>{g}</button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-12">
                <Field label="Contact Number" required>
                  <InputWrapper icon={<FiPhone size={15} />} isFocused={focused === 'contact'}>
                    <input name="contact" value={form.contact} onChange={e => set('contact', e.target.value)} onFocus={() => setFocused('contact')} onBlur={() => setFocused('')} placeholder="e.g. 0771234567" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="add-section">
            <SectionHead number="2" title="Amenities" sub="Select everything included in the rent" />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {AMENITY_OPTIONS.map(a => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)} className={`amenity-chip ${amenities.includes(a) ? 'active' : 'inactive'}`}>
                  {amenities.includes(a) && <FiCheckCircle size={11} />}{a}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={customAmenity} onChange={e => setCustomAmenity(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }} placeholder="Add custom amenity…" className="custom-amenity-input" />
              <button type="button" onClick={addCustomAmenity} className="add-btn-sm"><FiPlus size={14} /> Add</button>
            </div>
            {amenities.filter(a => !AMENITY_OPTIONS.includes(a)).length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.7rem' }}>
                {amenities.filter(a => !AMENITY_OPTIONS.includes(a)).map(a => (
                  <span key={a} className="custom-chip">
                    {a}
                    <button type="button" onClick={() => toggleAmenity(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9', padding: 0, display: 'flex' }}><FiX size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="add-section">
            <SectionHead number="3" title="Title & Description" sub="Write your own or generate with AI" />
            {aiError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiAlertCircle size={14} /> {aiError}
              </div>
            )}
            <div className="add-ai-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <FiZap size={15} color="#0ea5e9" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'rgba(220,233,255,0.9)' }}>AI Listing Writer</span>
                    <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.1rem 0.5rem', borderRadius: 20 }}>POWERED BY CLAUDE</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(220,233,255,0.4)', margin: 0 }}>Fill in Section 1 first, then click Generate.</p>
                </div>
                <AIButton onClick={handleGenerate} loading={aiLoading} label="Generate listing" icon={<FiZap size={14} />} variant="primary" />
              </div>
              {aiResult && <AIResultCard title={aiResult.title} description={aiResult.description} onApply={() => { set('title', aiResult.title); set('description', aiResult.description); setAiResult(null); }} onRegenerate={handleGenerate} loading={aiLoading} />}
            </div>

            <Field label="Listing Title" required>
              <InputWrapper icon={<FiHome size={15} />} isFocused={focused === 'title'}>
                <input name="title" value={form.title} onChange={e => set('title', e.target.value)} onFocus={() => setFocused('title')} onBlur={() => setFocused('')} placeholder="e.g. Cozy Single Room Near Moratuwa University" style={inpBaseStyle} />
              </InputWrapper>
            </Field>

            <Field label="Description" required badge="AI can improve this">
              <div className={`add-textarea-wrap${focused === 'desc' ? ' focused' : ''}`}>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} onFocus={() => setFocused('desc')} onBlur={() => setFocused('')} placeholder="Describe your boarding place..." rows={5}
                  style={{ width: '100%', border: 'none', outline: 'none', padding: '0.85rem 1rem', fontSize: '0.9rem', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(220,233,255,0.9)', resize: 'vertical', background: 'transparent' }} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(220,233,255,0.3)' }}>{form.description.length} characters</span>
                  <AIButton onClick={handleImprove} loading={aiImproving} label="✨ Improve with AI" variant="secondary" />
                </div>
              </div>
              {aiImproved && <AIResultCard title={null} description={aiImproved.description} onApply={() => { set('description', aiImproved.description); setAiImproved(null); }} onRegenerate={handleImprove} loading={aiImproving} />}
            </Field>
          </div>

          {/* Section 4 */}
          <div className="add-section">
            <SectionHead number="4" title="Photo & Map Location" sub="Optional but recommended" />
            <Field label={`Photos (${images.length}/8)`} hint="First photo will be the cover image. Up to 8 photos allowed.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: '0.6rem', marginBottom: '0.6rem' }}>
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 100 }}>
                    <img src={preview} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {idx === 0 && <div style={{ position: 'absolute', top: 4, left: 4, background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 20 }}>COVER</div>}
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><FiX size={11} /></button>
                  </div>
                ))}
                {images.length < 8 && (
                  <label style={{ cursor: 'pointer' }}>
                    <div className="img-upload-slot"><FiUpload size={20} color="rgba(220,233,255,0.3)" /><span style={{ fontSize: '0.72rem', color: 'rgba(220,233,255,0.3)', fontWeight: 600 }}>Add Photo</span></div>
                    <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </Field>
            <Field label="Pin Location on Map" hint="Click on the map to set the exact location of your boarding place.">
              <MapPicker lat={form.lat} lng={form.lng} onChange={handleMapChange} />
            </Field>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={submitting} className="add-submit-btn">
              {submitting ? 'Publishing...' : <><FiSave size={15} /> Publish Listing</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBoarding;