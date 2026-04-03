import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEdit2, FiSave, FiX, FiTrash2,
  FiHome, FiMapPin, FiHeart, FiEye, FiEyeOff,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AvatarUpload from '../components/AvatarUpload';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

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

  .profile-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    overflow: hidden;
    backdrop-filter: blur(14px);
    animation: fadeUp 0.5s ease;
  }

  .tab-active {
    padding: 0.65rem 1.3rem; border: none;
    border-bottom: 2.5px solid #00d4aa;
    background: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700; color: #00d4aa;
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem;
    transition: all 0.15s;
  }
  .tab-inactive {
    padding: 0.65rem 1.3rem; border: none;
    border-bottom: 2.5px solid transparent;
    background: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: rgba(220,233,255,0.45);
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem;
    transition: all 0.15s;
  }
  .tab-inactive:hover { color: rgba(220,233,255,0.8); }

  .profile-inp-wrap {
    display: flex; align-items: center;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 11px; overflow: hidden;
    background: rgba(255,255,255,0.04);
    transition: all 0.2s;
  }
  .profile-inp-wrap:focus-within {
    border-color: rgba(0,212,170,0.55);
    background: rgba(0,212,170,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }

  .profile-inp {
    border: none; outline: none; flex: 1;
    padding: 0.75rem 1rem; font-size: 0.95rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: rgba(220,233,255,0.9);
  }
  .profile-inp::placeholder { color: rgba(220,233,255,0.25); }

  .profile-inp-icon {
    padding: 0 0.85rem;
    color: rgba(0,212,170,0.65);
    background: rgba(255,255,255,0.02);
    align-self: stretch; display: flex; align-items: center;
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  .profile-label {
    display: block; font-size: 0.78rem; font-weight: 700;
    color: rgba(220,233,255,0.4); text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .field-display {
    padding: 0.85rem 1rem;
    background: rgba(255,255,255,0.04);
    border-radius: 11px;
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 0.95rem; font-weight: 600;
    color: rgba(220,233,255,0.75);
    display: flex; align-items: center; gap: 0.6rem;
  }

  .edit-btn {
    background: rgba(0,212,170,0.1);
    color: #00d4aa; border: 1px solid rgba(0,212,170,0.25);
    border-radius: 10px; padding: 0.55rem 1.1rem;
    cursor: pointer; font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .edit-btn:hover { background: rgba(0,212,170,0.18); }

  .save-btn {
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    color: #fff; border: none; border-radius: 10px;
    padding: 0.55rem 1.1rem; cursor: pointer;
    font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(0,212,170,0.3);
    transition: all 0.15s;
  }
  .save-btn:hover { transform: translateY(-1px); }
  .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .cancel-sm-btn {
    background: rgba(255,255,255,0.06);
    color: rgba(220,233,255,0.5);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 0.55rem 1rem;
    cursor: pointer; font-weight: 600; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .cancel-sm-btn:hover { background: rgba(255,255,255,0.1); }

  .pw-submit-btn {
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%);
    background-size: 300% 300%;
    color: #fff; border: none; border-radius: 11px;
    padding: 0.75rem 2rem; cursor: pointer;
    font-weight: 700; font-size: 0.95rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: shimmerBtn 4s linear infinite;
    box-shadow: 0 6px 20px rgba(0,212,170,0.3);
    transition: all 0.2s;
  }
  .pw-submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .pw-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .listing-row {
    display: flex; gap: 1rem; padding: 1rem 1.2rem;
    border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03); align-items: center;
    transition: all 0.15s;
  }
  .listing-row:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(0,212,170,0.2);
  }

  .listing-view-btn {
    background: rgba(0,212,170,0.1); color: #00d4aa;
    border: 1px solid rgba(0,212,170,0.2);
    border-radius: 8px; padding: 0.5rem 0.8rem;
    cursor: pointer; font-size: 0.8rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .listing-del-btn {
    background: rgba(248,113,113,0.08); color: #f87171;
    border: 1px solid rgba(248,113,113,0.15);
    border-radius: 8px; padding: 0.5rem 0.8rem;
    cursor: pointer; font-size: 0.8rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .quick-link-btn {
    border-radius: 10px; padding: 0.55rem 1.1rem;
    cursor: pointer; font-weight: 600; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
    text-decoration: none;
  }

  .hint-box {
    background: rgba(245,158,11,0.08);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 10px; padding: 0.8rem 1rem;
    margin-bottom: 1.2rem; font-size: 0.8rem;
    color: rgba(251,191,36,0.85);
  }

  .add-listing-btn {
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    color: #fff; border: none; border-radius: 10px;
    padding: 0.6rem 1.2rem; cursor: pointer;
    font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(0,212,170,0.3);
    transition: all 0.15s;
  }
  .add-listing-btn:hover { transform: translateY(-1px); }

  .empty-listings {
    text-align: center; padding: 3.5rem 2rem;
    background: rgba(255,255,255,0.03);
    border-radius: 16px;
    border: 2px dashed rgba(255,255,255,0.1);
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(6,15,40,0.95) inset !important;
    -webkit-text-fill-color: rgba(220,233,255,0.9) !important;
  }
`;

const Profile = () => {
  const { user, login, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [boardings, setBoardings] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });

  const [showPw, setShowPw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const [deletingId, setDeletingId] = useState(null);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => {
        setProfileData(res.data.user);
        setBoardings(res.data.boardings);
        setFavCount(res.data.favoritesCount);
        setFormName(res.data.user.name);
        setFormEmail(res.data.user.email);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true); setSaveMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', { name: formName, email: formEmail });
      setProfileData(prev => ({ ...prev, name: res.data.user.name, email: res.data.user.email }));
      login(res.data.user, res.data.token);
      setEditing(false);
      setSaveMsg({ type: 'success', text: '✓ Profile updated successfully!' });
      setTimeout(() => setSaveMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally { setSaving(false); }
  };

  const handleSavePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { setPwMsg({ type: 'error', text: 'All password fields are required' }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'New passwords do not match' }); return; }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'New password must be at least 6 characters' }); return; }
    setPwSaving(true); setPwMsg({ type: '', text: '' });
    try {
      await api.put('/auth/profile', { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwMsg({ type: 'success', text: '✓ Password changed successfully!' });
      setTimeout(() => setPwMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally { setPwSaving(false); }
  };

  const handleDeleteBoarding = async (id, title) => {
    if (!window.confirm(`Delete listing "${title}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/auth/profile/boarding/${id}`);
      setBoardings(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleCancelEdit = () => {
    setFormName(profileData.name); setFormEmail(profileData.email);
    setEditing(false); setSaveMsg({ type: '', text: '' });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#060f2a' }}>
      <div className="spinner-border" style={{ color: '#00d4aa', width: '3rem', height: '3rem' }} />
    </div>
  );

  const msgStyle = (type) => ({
    background: type === 'success' ? 'rgba(0,212,170,0.1)' : 'rgba(239,68,68,0.1)',
    color: type === 'success' ? '#00d4aa' : '#fca5a5',
    border: `1px solid ${type === 'success' ? 'rgba(0,212,170,0.25)' : 'rgba(239,68,68,0.2)'}`,
    borderRadius: 10, padding: '0.85rem 1rem',
    marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
    gap: '0.5rem', fontSize: '0.875rem',
  });

  return (
    <div style={{ background: '#060f2a', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <ParticleCanvas />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: '#0ea5e940', top: '-150px', left: '-150px', delay: '0s' },
          { w: 500, h: 500, color: '#00d4aa22', top: '40%', right: '-140px', delay: '-6s' },
          { w: 400, h: 400, color: '#06b6d428', bottom: '-100px', left: '30%', delay: '-11s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(0,212,170,0.12) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '3rem 0 4.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)' }} />
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <AvatarUpload size={96} showControls={true} />
            <div style={{ paddingBottom: '0.3rem' }}>
              <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: 0, marginBottom: '0.15rem', color: '#dce9ff' }}>{user?.name}</h1>
              <p style={{ margin: 0, opacity: 0.55, fontSize: '0.9rem', color: 'rgba(220,233,255,0.7)' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHome size={13} color="#00d4aa" />{boardings.length} Listing{boardings.length !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHeart size={13} color="#0ea5e9" />{favCount} Favorite{favCount !== 1 ? 's' : ''}
                </span>
                {profileData?.isAdmin && (
                  <span style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', padding: '0.15rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>⚡ Admin</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 860, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <div className="profile-card">
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', padding: '0 1.5rem', overflowX: 'auto' }}>
            <button className={tab === 'info' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('info')}><FiUser size={14} />Personal Info</button>
            <button className={tab === 'password' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('password')}><FiLock size={14} />Change Password</button>
            <button className={tab === 'listings' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('listings')}><FiHome size={14} />My Listings ({boardings.length})</button>
          </div>

          {tab === 'info' && (
            <div style={{ padding: '2rem' }}>
              {saveMsg.text && <div style={msgStyle(saveMsg.type)}>{saveMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />} {saveMsg.text}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0 }}>Personal Information</h4>
                  <p style={{ color: 'rgba(220,233,255,0.35)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Update your name and email address</p>
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="edit-btn"><FiEdit2 size={14} />Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleSaveProfile} disabled={saving} className="save-btn">
                      {saving ? <span className="spinner-border spinner-border-sm" /> : <><FiSave size={14} />Save</>}
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-sm-btn"><FiX size={14} />Cancel</button>
                  </div>
                )}
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="profile-label">Full Name</label>
                  {editing ? (
                    <div className="profile-inp-wrap">
                      <span className="profile-inp-icon"><FiUser size={15} /></span>
                      <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="profile-inp" />
                    </div>
                  ) : (
                    <div className="field-display"><FiUser size={15} color="rgba(220,233,255,0.3)" />{profileData?.name}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="profile-label">Email Address</label>
                  {editing ? (
                    <div className="profile-inp-wrap">
                      <span className="profile-inp-icon"><FiMail size={15} /></span>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="profile-inp" />
                    </div>
                  ) : (
                    <div className="field-display"><FiMail size={15} color="rgba(220,233,255,0.3)" />{profileData?.email}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="profile-label">Account Role</label>
                  <div className="field-display">
                    <span style={{ background: profileData?.isAdmin ? 'rgba(14,165,233,0.15)' : 'rgba(0,212,170,0.12)', color: profileData?.isAdmin ? '#0ea5e9' : '#00d4aa', padding: '0.25rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${profileData?.isAdmin ? 'rgba(14,165,233,0.25)' : 'rgba(0,212,170,0.2)'}` }}>
                      {profileData?.isAdmin ? '⚡ Admin' : '👤 User'}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="profile-label">Member Since</label>
                  <div className="field-display" style={{ fontSize: '0.9rem' }}>
                    {new Date(profileData?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <Link to="/favorites" style={{ textDecoration: 'none' }}>
                  <button className="quick-link-btn" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)' }}>
                    <FiHeart size={14} />View Favorites ({favCount})
                  </button>
                </Link>
                <Link to="/add" style={{ textDecoration: 'none' }}>
                  <button className="quick-link-btn" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                    <FiHome size={14} />Add New Listing
                  </button>
                </Link>
                {profileData?.isAdmin && (
                  <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="quick-link-btn" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)' }}>
                      ⚡ Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div style={{ padding: '2rem', maxWidth: 480 }}>
              <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', marginBottom: '0.4rem' }}>Change Password</h4>
              <p style={{ color: 'rgba(220,233,255,0.35)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>Enter your current password then choose a new one.</p>
              {pwMsg.text && <div style={msgStyle(pwMsg.type)}>{pwMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />} {pwMsg.text}</div>}
              {[
                { label: 'Current Password', val: currentPw, set: setCurrentPw, ph: 'Your current password', showToggle: true },
                { label: 'New Password', val: newPw, set: setNewPw, ph: 'Min. 6 characters', showToggle: false },
                { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, ph: 'Repeat new password', showToggle: false, isConfirm: true },
              ].map(({ label, val, set, ph, showToggle, isConfirm }, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <label className="profile-label">{label}</label>
                  <div className="profile-inp-wrap">
                    <span className="profile-inp-icon"><FiLock size={15} /></span>
                    <input type={showPw ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)} placeholder={ph} className="profile-inp" />
                    {showToggle && (
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: 'rgba(220,233,255,0.3)' }}>
                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                  {isConfirm && confirmPw && confirmPw !== newPw && <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem' }}>⚠ Passwords don't match</div>}
                  {isConfirm && confirmPw && confirmPw === newPw && <div style={{ fontSize: '0.75rem', color: '#00d4aa', marginTop: '0.25rem' }}>✓ Passwords match</div>}
                </div>
              ))}
              <div className="hint-box">💡 Password must be at least 6 characters. Use a mix of letters and numbers for a stronger password.</div>
              <button onClick={handleSavePassword} disabled={pwSaving} className="pw-submit-btn">
                {pwSaving ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><FiLock size={14} />Update Password</>}
              </button>
            </div>
          )}

          {tab === 'listings' && (
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0 }}>My Listings</h4>
                  <p style={{ color: 'rgba(220,233,255,0.35)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Manage your boarding listings</p>
                </div>
                <Link to="/add">
                  <button className="add-listing-btn">+ Add New Listing</button>
                </Link>
              </div>
              {boardings.length === 0 ? (
                <div className="empty-listings">
                  <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🏠</div>
                  <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: '#dce9ff', marginBottom: '0.4rem' }}>No listings yet</h5>
                  <p style={{ color: 'rgba(220,233,255,0.35)', marginBottom: '1.2rem' }}>You haven't added any boarding listings.</p>
                  <Link to="/add">
                    <button className="add-listing-btn">Add Your First Listing</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} className="listing-row">
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                          : <div style={{ width: 80, height: 64, background: 'rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🏠</div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dce9ff', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(220,233,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}><FiMapPin size={11} color="#00d4aa" />{b.location}</div>
                          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#00d4aa' }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', padding: '0.1rem 0.55rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>{b.roomType}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <Link to={`/boarding/${b._id}`}>
                            <button className="listing-view-btn"><FiEye size={13} />View</button>
                          </Link>
                          <button onClick={() => handleDeleteBoarding(b._id, b.title)} disabled={deletingId === b._id} className="listing-del-btn">
                            {deletingId === b._id ? <span className="spinner-border spinner-border-sm" style={{ width: '0.8rem', height: '0.8rem' }} /> : <FiTrash2 size={13} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;