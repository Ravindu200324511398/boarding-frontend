import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEdit2, FiSave, FiX, FiTrash2,
  FiHome, FiMapPin, FiHeart, FiEye, FiEyeOff,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import AvatarUpload from '../components/AvatarUpload';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const getTokens = (isDark) => isDark ? {
  bg: '#060f2a',
  bgGrad: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)',
  text: 'rgba(220,233,255,0.9)', textMuted: 'rgba(220,233,255,0.45)',
  textDim: 'rgba(220,233,255,0.25)', textSub: 'rgba(220,233,255,0.35)',
  heading: '#dce9ff',
  cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.08)',
  tabBorder: 'rgba(255,255,255,0.08)',
  tabActive: '#00d4aa', tabInactive: 'rgba(220,233,255,0.45)',
  inpBg: 'rgba(255,255,255,0.04)', inpBorder: 'rgba(255,255,255,0.1)',
  inpFocusBg: 'rgba(0,212,170,0.04)', inpFocusBorder: 'rgba(0,212,170,0.55)',
  inpFocusShadow: 'rgba(0,212,170,0.1)',
  iconBg: 'rgba(255,255,255,0.02)', iconBorder: 'rgba(255,255,255,0.07)',
  iconColor: 'rgba(0,212,170,0.65)',
  labelColor: 'rgba(220,233,255,0.4)',
  displayBg: 'rgba(255,255,255,0.04)', displayBorder: 'rgba(255,255,255,0.08)',
  displayColor: 'rgba(220,233,255,0.75)',
  editBtnBg: 'rgba(0,212,170,0.1)', editBtnBorder: 'rgba(0,212,170,0.25)',
  cancelBg: 'rgba(255,255,255,0.06)', cancelBorder: 'rgba(255,255,255,0.08)',
  cancelColor: 'rgba(220,233,255,0.5)',
  hintBg: 'rgba(245,158,11,0.08)', hintBorder: 'rgba(245,158,11,0.2)', hintColor: 'rgba(251,191,36,0.85)',
  listingRowBg: 'rgba(255,255,255,0.03)', listingRowBorder: 'rgba(255,255,255,0.08)',
  listingRowHoverBg: 'rgba(255,255,255,0.06)', listingRowHoverBorder: 'rgba(0,212,170,0.2)',
  emptyBg: 'rgba(255,255,255,0.03)', emptyBorder: 'rgba(255,255,255,0.1)',
  divider: 'rgba(255,255,255,0.07)',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  orbColors: ['#0ea5e940', '#00d4aa22', '#06b6d428'],
  gridLine: 'rgba(255,255,255,.018)',
  autofillBg: 'rgba(6,15,40,0.95)', autofillColor: 'rgba(220,233,255,0.9)',
  headerBg: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(0,212,170,0.12) 100%)',
  headerBorder: 'rgba(255,255,255,0.08)',
  successBg: 'rgba(0,212,170,0.1)', successColor: '#00d4aa', successBorder: 'rgba(0,212,170,0.25)',
  errorBg: 'rgba(239,68,68,0.1)', errorColor: '#fca5a5', errorBorder: 'rgba(239,68,68,0.2)',
  particleColors: ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'],
} : {
  bg: '#f0f4ff',
  bgGrad: 'linear-gradient(160deg, #e8f0fe 0%, #f0f7ff 40%, #e6f7fa 100%)',
  text: '#1a2a4a', textMuted: '#4a6080',
  textDim: '#8aaac8', textSub: '#5a7a9a',
  heading: '#0d1f3c',
  cardBg: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,112,192,0.12)',
  tabBorder: 'rgba(0,112,192,0.1)',
  tabActive: '#0070c0', tabInactive: '#7a9ab8',
  inpBg: 'rgba(255,255,255,0.9)', inpBorder: 'rgba(0,112,192,0.2)',
  inpFocusBg: 'rgba(0,180,216,0.04)', inpFocusBorder: 'rgba(0,112,192,0.5)',
  inpFocusShadow: 'rgba(0,112,192,0.12)',
  iconBg: 'rgba(0,112,192,0.04)', iconBorder: 'rgba(0,112,192,0.1)',
  iconColor: '#0070c0',
  labelColor: '#4a6080',
  displayBg: 'rgba(255,255,255,0.7)', displayBorder: 'rgba(0,112,192,0.12)',
  displayColor: '#1a2a4a',
  editBtnBg: 'rgba(0,112,192,0.08)', editBtnBorder: 'rgba(0,112,192,0.2)',
  cancelBg: 'rgba(0,0,0,0.04)', cancelBorder: 'rgba(0,0,0,0.08)',
  cancelColor: '#4a6080',
  hintBg: 'rgba(245,158,11,0.06)', hintBorder: 'rgba(245,158,11,0.15)', hintColor: '#92700a',
  listingRowBg: 'rgba(255,255,255,0.7)', listingRowBorder: 'rgba(0,112,192,0.1)',
  listingRowHoverBg: 'rgba(255,255,255,0.95)', listingRowHoverBorder: 'rgba(0,112,192,0.25)',
  emptyBg: 'rgba(255,255,255,0.6)', emptyBorder: 'rgba(0,112,192,0.12)',
  divider: 'rgba(0,112,192,0.08)',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  gridLine: 'rgba(0,112,192,.025)',
  autofillBg: 'rgba(240,247,255,0.95)', autofillColor: '#1a2a4a',
  headerBg: 'linear-gradient(135deg, rgba(0,112,192,0.12) 0%, rgba(0,180,216,0.08) 100%)',
  headerBorder: 'rgba(0,112,192,0.1)',
  successBg: 'rgba(0,112,192,0.08)', successColor: '#0070c0', successBorder: 'rgba(0,112,192,0.2)',
  errorBg: 'rgba(239,68,68,0.08)', errorColor: '#dc2626', errorBorder: 'rgba(239,68,68,0.15)',
  particleColors: ['#0070c0', '#00b4d8', '#0096c7', '#0077b6', '#48cae4'],
};

const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
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
  }, [colors]);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(40px,-50px) scale(1.07);} 66%{transform:translate(-25px,30px) scale(0.95);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes shimmerBtn { 0%{background-position:200% center;} 100%{background-position:-200% center;} }

  .profile-card {
    background: ${t.cardBg}; border: 1px solid ${t.cardBorder};
    border-radius: 20px; overflow: hidden;
    backdrop-filter: blur(14px); animation: fadeUp 0.5s ease;
  }
  .tab-active {
    padding: 0.65rem 1.3rem; border: none;
    border-bottom: 2.5px solid ${t.tabActive};
    background: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700; color: ${t.tabActive};
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; transition: all 0.15s;
  }
  .tab-inactive {
    padding: 0.65rem 1.3rem; border: none;
    border-bottom: 2.5px solid transparent;
    background: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: ${t.tabInactive};
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; transition: all 0.15s;
  }
  .tab-inactive:hover { color: ${t.text}; }
  .profile-inp-wrap {
    display: flex; align-items: center;
    border: 1.5px solid ${t.inpBorder}; border-radius: 11px; overflow: hidden;
    background: ${t.inpBg}; transition: all 0.2s;
  }
  .profile-inp-wrap:focus-within {
    border-color: ${t.inpFocusBorder}; background: ${t.inpFocusBg};
    box-shadow: 0 0 0 3px ${t.inpFocusShadow};
  }
  .profile-inp {
    border: none; outline: none; flex: 1;
    padding: 0.75rem 1rem; font-size: 0.95rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: ${t.text};
  }
  .profile-inp::placeholder { color: ${t.textDim}; }
  .profile-inp-icon {
    padding: 0 0.85rem; color: ${t.iconColor};
    background: ${t.iconBg}; align-self: stretch; display: flex; align-items: center;
    border-right: 1px solid ${t.iconBorder};
  }
  .profile-label {
    display: block; font-size: 0.78rem; font-weight: 700;
    color: ${t.labelColor}; text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .field-display {
    padding: 0.85rem 1rem; background: ${t.displayBg};
    border-radius: 11px; border: 1px solid ${t.displayBorder};
    font-size: 0.95rem; font-weight: 600; color: ${t.displayColor};
    display: flex; align-items: center; gap: 0.6rem;
  }
  .edit-btn {
    background: ${t.editBtnBg}; color: ${t.accent};
    border: 1px solid ${t.editBtnBorder};
    border-radius: 10px; padding: 0.55rem 1.1rem;
    cursor: pointer; font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .save-btn {
    background: linear-gradient(135deg, ${t.accent}, ${t.accentSecondary});
    color: #fff; border: none; border-radius: 10px;
    padding: 0.55rem 1.1rem; cursor: pointer;
    font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(0,212,170,0.3); transition: all 0.15s;
  }
  .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .cancel-sm-btn {
    background: ${t.cancelBg}; color: ${t.cancelColor};
    border: 1px solid ${t.cancelBorder};
    border-radius: 10px; padding: 0.55rem 1rem;
    cursor: pointer; font-weight: 600; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .pw-submit-btn {
    background: linear-gradient(135deg, ${t.accent} 0%, #2de2e6 40%, ${t.accentSecondary} 80%);
    background-size: 300% 300%;
    color: #fff; border: none; border-radius: 11px;
    padding: 0.75rem 2rem; cursor: pointer;
    font-weight: 700; font-size: 0.95rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: shimmerBtn 4s linear infinite;
    box-shadow: 0 6px 20px rgba(0,212,170,0.3); transition: all 0.2s;
  }
  .pw-submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .pw-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .listing-row {
    display: flex; gap: 1rem; padding: 1rem 1.2rem;
    border-radius: 14px; border: 1px solid ${t.listingRowBorder};
    background: ${t.listingRowBg}; align-items: center; transition: all 0.15s;
  }
  .listing-row:hover { background: ${t.listingRowHoverBg}; border-color: ${t.listingRowHoverBorder}; }
  .listing-view-btn {
    background: ${t.editBtnBg}; color: ${t.accent};
    border: 1px solid ${t.editBtnBorder};
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
  .hint-box {
    background: ${t.hintBg}; border: 1px solid ${t.hintBorder};
    border-radius: 10px; padding: 0.8rem 1rem;
    margin-bottom: 1.2rem; font-size: 0.8rem; color: ${t.hintColor};
  }
  .add-listing-btn {
    background: linear-gradient(135deg, ${t.accent}, ${t.accentSecondary});
    color: #fff; border: none; border-radius: 10px;
    padding: 0.6rem 1.2rem; cursor: pointer;
    font-weight: 700; font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(0,180,192,0.25); transition: all 0.15s;
  }
  .add-listing-btn:hover { transform: translateY(-1px); }
  .empty-listings {
    text-align: center; padding: 3.5rem 2rem;
    background: ${t.emptyBg}; border-radius: 16px;
    border: 2px dashed ${t.emptyBorder};
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px ${t.autofillBg} inset !important;
    -webkit-text-fill-color: ${t.autofillColor} !important;
  }
`;

const Profile = () => {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const CSS = getCSS(t);
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
        setProfileData(res.data.user); setBoardings(res.data.boardings);
        setFavCount(res.data.favoritesCount); setFormName(res.data.user.name); setFormEmail(res.data.user.email);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true); setSaveMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', { name: formName, email: formEmail });
      setProfileData(prev => ({ ...prev, name: res.data.user.name, email: res.data.user.email }));
      login(res.data.user, res.data.token); setEditing(false);
      setSaveMsg({ type: 'success', text: '✓ Profile updated successfully!' });
      setTimeout(() => setSaveMsg({ type: '', text: '' }), 3000);
    } catch (err) { setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' }); }
    finally { setSaving(false); }
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
    } catch (err) { setPwMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' }); }
    finally { setPwSaving(false); }
  };

  const handleDeleteBoarding = async (id, title) => {
    if (!window.confirm(`Delete listing "${title}"?`)) return;
    setDeletingId(id);
    try { await api.delete(`/auth/profile/boarding/${id}`); setBoardings(prev => prev.filter(b => b._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleCancelEdit = () => { setFormName(profileData.name); setFormEmail(profileData.email); setEditing(false); setSaveMsg({ type: '', text: '' }); };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: t.bgGrad }}>
      <div className="spinner-border" style={{ color: t.accent, width: '3rem', height: '3rem' }} />
    </div>
  );

  const msgStyle = (type) => ({
    background: type === 'success' ? t.successBg : t.errorBg,
    color: type === 'success' ? t.successColor : t.errorColor,
    border: `1px solid ${type === 'success' ? t.successBorder : t.errorBorder}`,
    borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem',
  });

  return (
    <div style={{ background: t.bgGrad, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <ParticleCanvas colors={t.particleColors} />

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((color, i) => {
          const positions = [{ top: '-150px', left: '-150px' }, { top: '40%', right: '-140px' }, { bottom: '-100px', left: '30%' }];
          const delays = ['0s', '-6s', '-11s'];
          const sizes = [600, 500, 400];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: 'blur(70px)', ...positions[i], animation: `orbFloat 14s ease-in-out infinite`, animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Banner */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, padding: '3rem 0 4.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}66, ${t.accentSecondary}55, transparent)` }} />
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <AvatarUpload size={96} showControls={true} />
            <div style={{ paddingBottom: '0.3rem' }}>
              <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: 0, marginBottom: '0.15rem', color: t.heading }}>{user?.name}</h1>
              <p style={{ margin: 0, opacity: 0.65, fontSize: '0.9rem', color: t.textMuted }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHome size={13} color={t.accent} />{boardings.length} Listing{boardings.length !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.82rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHeart size={13} color={t.accentSecondary} />{favCount} Favorite{favCount !== 1 ? 's' : ''}
                </span>
                {profileData?.isAdmin && (
                  <span style={{ background: `rgba(14,165,233,0.15)`, border: `1px solid rgba(14,165,233,0.3)`, color: t.accentSecondary, padding: '0.15rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>⚡ Admin</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 860, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <div className="profile-card">
          <div style={{ borderBottom: `1px solid ${t.tabBorder}`, display: 'flex', padding: '0 1.5rem', overflowX: 'auto' }}>
            <button className={tab === 'info' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('info')}><FiUser size={14} />Personal Info</button>
            <button className={tab === 'password' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('password')}><FiLock size={14} />Change Password</button>
            <button className={tab === 'listings' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('listings')}><FiHome size={14} />My Listings ({boardings.length})</button>
          </div>

          {tab === 'info' && (
            <div style={{ padding: '2rem' }}>
              {saveMsg.text && <div style={msgStyle(saveMsg.type)}>{saveMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />} {saveMsg.text}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, margin: 0 }}>Personal Information</h4>
                  <p style={{ color: t.textSub, fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Update your name and email address</p>
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
                  ) : <div className="field-display"><FiUser size={15} color={t.textDim} />{profileData?.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="profile-label">Email Address</label>
                  {editing ? (
                    <div className="profile-inp-wrap">
                      <span className="profile-inp-icon"><FiMail size={15} /></span>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="profile-inp" />
                    </div>
                  ) : <div className="field-display"><FiMail size={15} color={t.textDim} />{profileData?.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="profile-label">Account Role</label>
                  <div className="field-display">
                    <span style={{ background: profileData?.isAdmin ? 'rgba(14,165,233,0.15)' : `rgba(0,180,192,0.12)`, color: profileData?.isAdmin ? t.accentSecondary : t.accent, padding: '0.25rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${profileData?.isAdmin ? 'rgba(14,165,233,0.25)' : 'rgba(0,180,192,0.2)'}` }}>
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
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${t.divider}`, display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <Link to="/favorites" style={{ textDecoration: 'none' }}>
                  <button style={{ background: `rgba(14,165,233,0.1)`, color: t.accentSecondary, border: `1px solid rgba(14,165,233,0.2)`, borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <FiHeart size={14} />View Favorites ({favCount})
                  </button>
                </Link>
                <Link to="/add" style={{ textDecoration: 'none' }}>
                  <button style={{ background: t.editBtnBg, color: t.accent, border: `1px solid ${t.editBtnBorder}`, borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <FiHome size={14} />Add New Listing
                  </button>
                </Link>
                {profileData?.isAdmin && (
                  <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{ background: `rgba(14,165,233,0.1)`, color: t.accentSecondary, border: `1px solid rgba(14,165,233,0.2)`, borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      ⚡ Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div style={{ padding: '2rem', maxWidth: 480 }}>
              <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, marginBottom: '0.4rem' }}>Change Password</h4>
              <p style={{ color: t.textSub, fontSize: '0.85rem', marginBottom: '1.8rem' }}>Enter your current password then choose a new one.</p>
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
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: t.textDim }}>
                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                  {isConfirm && confirmPw && confirmPw !== newPw && <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem' }}>⚠ Passwords don't match</div>}
                  {isConfirm && confirmPw && confirmPw === newPw && <div style={{ fontSize: '0.75rem', color: t.accent, marginTop: '0.25rem' }}>✓ Passwords match</div>}
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
                  <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, margin: 0 }}>My Listings</h4>
                  <p style={{ color: t.textSub, fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Manage your boarding listings</p>
                </div>
                <Link to="/add"><button className="add-listing-btn">+ Add New Listing</button></Link>
              </div>
              {boardings.length === 0 ? (
                <div className="empty-listings">
                  <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🏠</div>
                  <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: t.heading, marginBottom: '0.4rem' }}>No listings yet</h5>
                  <p style={{ color: t.textSub, marginBottom: '1.2rem' }}>You haven't added any boarding listings.</p>
                  <Link to="/add"><button className="add-listing-btn">Add Your First Listing</button></Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} className="listing-row">
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                          : <div style={{ width: 80, height: 64, background: t.displayBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🏠</div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: t.heading, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                          <div style={{ fontSize: '0.8rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}><FiMapPin size={11} color={t.accent} />{b.location}</div>
                          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: t.accent }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background: `rgba(14,165,233,0.1)`, color: t.accentSecondary, border: `1px solid rgba(14,165,233,0.2)`, padding: '0.1rem 0.55rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>{b.roomType}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <Link to={`/boarding/${b._id}`}><button className="listing-view-btn"><FiEye size={13} />View</button></Link>
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