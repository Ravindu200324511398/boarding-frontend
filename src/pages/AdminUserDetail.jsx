// ============================================================
// AdminUserDetail.jsx — dark/light mode + beautiful modals
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiShield, FiHome, FiMail, FiCalendar, FiMapPin, FiEye, FiCheckCircle, FiAlertCircle, FiSlash, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';
const IMAGE_BASE  = 'http://localhost:5001/uploads/';

const getTokens = (isDark) => isDark ? {
  bg: '#060f2a', heading: '#dce9ff', text: 'rgba(220,233,255,0.9)', textMuted: 'rgba(220,233,255,0.4)',
  cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.09)',
  infoBorder: 'rgba(255,255,255,0.06)', infoLabel: 'rgba(220,233,255,0.4)',
  listingBg: 'rgba(255,255,255,0.03)', listingBorder: 'rgba(255,255,255,0.08)',
  listingHoverBg: 'rgba(255,255,255,0.06)', listingHoverBorder: 'rgba(0,212,170,0.2)',
  accent: '#00d4aa', accentSecondary: '#38bdf8',
  gridLine: 'rgba(255,255,255,.02)',
  orbColors: ['#0ea5e928', '#06b6d425', '#00d4aa1a'],
  successBg: 'rgba(0,212,170,0.1)', successColor: '#00d4aa', successBorder: 'rgba(0,212,170,0.25)',
  errorBg: 'rgba(239,68,68,0.1)', errorColor: '#f87171', errorBorder: 'rgba(239,68,68,0.25)',
  modalBg: 'rgba(6,15,42,0.97)', modalBorder: 'rgba(255,255,255,0.1)',
  modalShadow: '0 25px 60px rgba(0,0,0,0.7)',
  overlayBg: 'rgba(0,0,0,0.7)',
  cancelBg: 'rgba(255,255,255,0.05)', cancelBorder: 'rgba(255,255,255,0.1)', cancelColor: 'rgba(220,233,255,0.6)',
  modalTitle: '#dce9ff', modalMsg: 'rgba(220,233,255,0.6)',
  banBtnBg: 'linear-gradient(135deg,#ef4444,#dc2626)', banBtnShadow: '0 4px 15px rgba(239,68,68,0.4)',
  unbanBtnBg: 'linear-gradient(135deg,#22c55e,#16a34a)', unbanBtnShadow: '0 4px 15px rgba(34,197,94,0.4)',
  adminBtnBg: 'linear-gradient(135deg,#a78bfa,#7c3aed)', adminBtnShadow: '0 4px 15px rgba(167,139,250,0.4)',
  demoteBtnBg: 'linear-gradient(135deg,#f97316,#ea580c)', demoteBtnShadow: '0 4px 15px rgba(249,115,22,0.4)',
  deleteBtnBg: 'linear-gradient(135deg,#f43f5e,#e11d48)', deleteBtnShadow: '0 4px 15px rgba(244,63,94,0.4)',
} : {
  bg: '#f0f4ff', heading: '#0d1f3c', text: '#1a2a4a', textMuted: '#4a6080',
  cardBg: 'rgba(255,255,255,0.95)', cardBorder: 'rgba(0,112,192,0.12)',
  infoBorder: 'rgba(0,112,192,0.08)', infoLabel: '#4a6080',
  listingBg: 'rgba(255,255,255,0.7)', listingBorder: 'rgba(0,112,192,0.1)',
  listingHoverBg: 'rgba(255,255,255,0.95)', listingHoverBorder: 'rgba(0,112,192,0.25)',
  accent: '#0070c0', accentSecondary: '#0096c7',
  gridLine: 'rgba(0,112,192,.02)',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  successBg: 'rgba(0,112,192,0.08)', successColor: '#0070c0', successBorder: 'rgba(0,112,192,0.2)',
  errorBg: 'rgba(239,68,68,0.08)', errorColor: '#dc2626', errorBorder: 'rgba(239,68,68,0.2)',
  modalBg: 'rgba(255,255,255,0.99)', modalBorder: 'rgba(0,112,192,0.15)',
  modalShadow: '0 25px 60px rgba(0,0,0,0.15)',
  overlayBg: 'rgba(0,20,60,0.5)',
  cancelBg: 'rgba(0,0,0,0.04)', cancelBorder: 'rgba(0,0,0,0.1)', cancelColor: '#4a6080',
  modalTitle: '#0d1f3c', modalMsg: '#4a6080',
  banBtnBg: 'linear-gradient(135deg,#ef4444,#dc2626)', banBtnShadow: '0 4px 15px rgba(239,68,68,0.35)',
  unbanBtnBg: 'linear-gradient(135deg,#22c55e,#16a34a)', unbanBtnShadow: '0 4px 15px rgba(34,197,94,0.35)',
  adminBtnBg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', adminBtnShadow: '0 4px 15px rgba(124,58,237,0.35)',
  demoteBtnBg: 'linear-gradient(135deg,#f97316,#ea580c)', demoteBtnShadow: '0 4px 15px rgba(249,115,22,0.35)',
  deleteBtnBg: 'linear-gradient(135deg,#f43f5e,#e11d48)', deleteBtnShadow: '0 4px 15px rgba(244,63,94,0.35)',
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-40px) scale(1.06);} 66%{transform:translate(-20px,25px) scale(0.96);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.92) translateY(16px);} to{opacity:1;transform:scale(1) translateY(0);} }
  @keyframes overlayIn { from{opacity:0;} to{opacity:1;} }
  .glass-card { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:16px; overflow:hidden; animation:fadeUp 0.5s ease both; }
  .action-btn { color:#fff; border-radius:12px; padding:0.6rem 1.2rem; cursor:pointer; font-weight:700; font-size:0.875rem; display:flex; align-items:center; gap:0.45rem; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; border:none; }
  .action-btn:hover { transform:translateY(-2px); filter:brightness(1.1); }
  .action-btn:active { transform:translateY(0); }
  .action-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none !important; filter:none !important; }
  .listing-card { display:flex; gap:0.9rem; padding:0.9rem 1rem; border-radius:12px; border:1px solid ${t.listingBorder}; background:${t.listingBg}; align-items:center; transition:all 0.2s; }
  .listing-card:hover { background:${t.listingHoverBg}; border-color:${t.listingHoverBorder}; }
  .info-row { display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0; border-bottom:1px solid ${t.infoBorder}; }
  .btn-sm-view { background:rgba(14,165,233,0.15); color:#38bdf8; border:1px solid rgba(14,165,233,0.25); border-radius:8px; padding:0.45rem 0.75rem; cursor:pointer; font-size:0.78rem; font-weight:600; display:flex; align-items:center; gap:0.3rem; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.2s; }
  .btn-sm-delete { background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:0.45rem 0.75rem; cursor:pointer; font-size:0.78rem; font-weight:600; display:flex; align-items:center; gap:0.3rem; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.2s; }
  .modal-overlay { position:fixed; inset:0; background:${t.overlayBg}; z-index:9999; display:flex; align-items:center; justify-content:center; padding:1rem; animation:overlayIn 0.2s ease; backdrop-filter:blur(6px); }
  .modal-box { background:${t.modalBg}; border:1px solid ${t.modalBorder}; border-radius:20px; padding:2rem; width:100%; max-width:420px; box-shadow:${t.modalShadow}; animation:modalIn 0.25s cubic-bezier(.34,1.56,.64,1); font-family:'Plus Jakarta Sans',sans-serif; }
  .modal-cancel-btn { flex:1; padding:0.7rem; border:1px solid ${t.cancelBorder}; border-radius:12px; background:${t.cancelBg}; color:${t.cancelColor}; font-weight:700; font-size:0.875rem; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
  .modal-cancel-btn:hover { opacity:0.8; }
  .modal-confirm-btn { flex:1; padding:0.7rem; border:none; border-radius:12px; color:#fff; font-weight:700; font-size:0.875rem; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
  .modal-confirm-btn:hover { transform:translateY(-1px); filter:brightness(1.08); }
`;

// ── Beautiful Confirm Modal ──────────────────────────────────
const ConfirmModal = ({ isOpen, onCancel, onConfirm, config }) => {
  if (!isOpen || !config) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '14px', background: config.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
            {config.emoji}
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,170,210,0.6)', padding: '0.3rem', borderRadius: '8px', display: 'flex' }}>
            <FiX size={18} />
          </button>
        </div>
        <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: config.titleColor, margin: '0 0 0.5rem' }}>{config.title}</h3>
        <p style={{ color: config.msgColor, fontSize: '0.9rem', margin: '0 0 1.6rem', lineHeight: 1.6 }}>{config.message}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} className="modal-cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="modal-confirm-btn" style={{ background: config.confirmBg, boxShadow: config.confirmShadow }}>
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Avatar ───────────────────────────────────────────────────
const UserAvatar = ({ user, size = 80 }) => {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarUrl = user?.avatarUrl || (user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: avatarUrl ? 'transparent' : 'linear-gradient(135deg,#0ea5e9,#00d4aa)', border: '3px solid rgba(255,255,255,0.2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,212,170,0.2)' }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
        : <span style={{ fontSize: size * 0.3, fontWeight: 800, color: '#fff', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{initials}</span>}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────
const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const [user, setUser] = useState(null);
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [banning, setBanning] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [modal, setModal] = useState({ isOpen: false, config: null, onConfirm: null });

  const openModal = (config, onConfirm) => setModal({ isOpen: true, config, onConfirm });
  const closeModal = () => setModal({ isOpen: false, config: null, onConfirm: null });

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => { setUser(res.data.user); setBoardings(res.data.boardings); })
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const handleDelete = async () => {
    closeModal(); setDeleting(true);
    try { await api.delete(`/admin/users/${id}`); navigate('/admin/users'); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Delete failed'); setDeleting(false); }
  };

  const handleToggleAdmin = async () => {
    closeModal(); setToggling(true);
    try { const res = await api.patch(`/admin/users/${id}/toggle-admin`); setUser(prev => ({ ...prev, isAdmin: res.data.isAdmin })); showMsg('success', res.data.message); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Toggle failed'); }
    finally { setToggling(false); }
  };

  const handleToggleBan = async () => {
    closeModal(); setBanning(true);
    try { const res = await api.patch(`/admin/users/${id}/toggle-ban`); setUser(prev => ({ ...prev, isBanned: res.data.isBanned })); showMsg('success', res.data.message); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Failed'); }
    finally { setBanning(false); }
  };

  const handleDeleteBoarding = async (boardingId, title) => {
    if (!window.confirm(`Delete listing "${title}"?`)) return;
    try { await api.delete(`/admin/boardings/${boardingId}`); setBoardings(prev => prev.filter(b => b._id !== boardingId)); showMsg('success', `Listing "${title}" deleted.`); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner-border" style={{ color: t.accent }} /></div>;
  if (!user) return null;

  const isBanned = user.isBanned;
  const bannerGradient = isBanned
    ? (isDark ? 'linear-gradient(135deg,#450a0a,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#fff1f1,#ffe4e4)')
    : (isDark ? 'linear-gradient(135deg,#060f2a,#0c2051,#0ea5e920)' : 'linear-gradient(135deg,#e8f0fe,#f0f7ff,#e6f7fa)');

  // ── Modal configs ─────────────────────────────────────────
  const banConfig = isBanned ? {
    emoji: '✅', iconBg: 'rgba(34,197,94,0.15)', title: 'Unban User',
    titleColor: t.modalTitle, msgColor: t.modalMsg,
    message: `"${user.name}" will regain full access to the platform.`,
    confirmBg: t.unbanBtnBg, confirmShadow: t.unbanBtnShadow, confirmText: 'Yes, Unban',
  } : {
    emoji: '🚫', iconBg: 'rgba(239,68,68,0.15)', title: 'Ban User',
    titleColor: t.modalTitle, msgColor: t.modalMsg,
    message: `"${user.name}" will lose access to post, edit, or interact on the platform.`,
    confirmBg: t.banBtnBg, confirmShadow: t.banBtnShadow, confirmText: 'Yes, Ban User',
  };

  const adminConfig = user.isAdmin ? {
    emoji: '⬇️', iconBg: 'rgba(249,115,22,0.15)', title: 'Remove Admin Access',
    titleColor: t.modalTitle, msgColor: t.modalMsg,
    message: `"${user.name}" will lose all admin privileges immediately.`,
    confirmBg: t.demoteBtnBg, confirmShadow: t.demoteBtnShadow, confirmText: 'Yes, Demote',
  } : {
    emoji: '⚡', iconBg: 'rgba(167,139,250,0.15)', title: 'Grant Admin Access',
    titleColor: t.modalTitle, msgColor: t.modalMsg,
    message: `"${user.name}" will get full admin access to manage the platform.`,
    confirmBg: t.adminBtnBg, confirmShadow: t.adminBtnShadow, confirmText: 'Yes, Make Admin',
  };

  const deleteConfig = {
    emoji: '🗑️', iconBg: 'rgba(244,63,94,0.15)', title: 'Delete User Permanently',
    titleColor: t.modalTitle, msgColor: t.modalMsg,
    message: `This will permanently delete "${user.name}" and all their listings. This cannot be undone.`,
    confirmBg: t.deleteBtnBg, confirmShadow: t.deleteBtnShadow, confirmText: '🗑️ Delete Forever',
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style key={isDark ? 'dark' : 'light'}>{getCSS(t)}</style>

      <ConfirmModal isOpen={modal.isOpen} onCancel={closeModal} onConfirm={modal.onConfirm} config={modal.config} />

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {t.orbColors.map((color, i) => {
          const pos = [{ top: '-200px', left: '-150px' }, { top: '40%', right: '-150px' }, { bottom: '-100px', left: '30%' }];
          const sizes = [600, 500, 350]; const delays = ['0s', '-6s', '-11s'];
          return <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: sizes[i], height: sizes[i], background: `radial-gradient(circle,${color},transparent 70%)`, filter: 'blur(70px)', ...pos[i], animation: 'orbFloat 14s ease-in-out infinite', animationDelay: delays[i] }} />;
        })}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Banner */}
      <div style={{ background: bannerGradient, padding: '2.5rem 0 4rem', position: 'relative', zIndex: 2, borderBottom: `1px solid ${t.cardBorder}` }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Link to="/admin/users" style={{ color: t.textMuted, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <FiArrowLeft size={14} /> Back to Users
          </Link>
          {isBanned && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem', fontWeight: 700 }}>
              <FiSlash size={14} /> This user is currently banned
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <UserAvatar user={user} size={88} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem', color: t.heading }}>{user.name}</h1>
              <p style={{ margin: 0, color: t.textMuted, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FiMail size={13} /> {user.email}</p>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
                <span style={{ background: user.isAdmin ? 'rgba(167,139,250,0.2)' : 'rgba(0,180,192,0.15)', border: `1px solid ${user.isAdmin ? 'rgba(167,139,250,0.3)' : 'rgba(0,180,192,0.25)'}`, padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: user.isAdmin ? '#a78bfa' : t.accent }}>
                  {user.isAdmin ? '⚡ Admin' : '👤 User'}
                </span>
                {isBanned && <span style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>🚫 Banned</span>}
                <span style={{ fontSize: '0.82rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiHome size={13} /> {boardings.length} Listing{boardings.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.82rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiCalendar size={13} /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* ── VIVID ACTION BUTTONS ── */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {!user.isAdmin && (
                <button onClick={() => openModal(banConfig, handleToggleBan)} disabled={banning} className="action-btn"
                  style={{ background: isBanned ? t.unbanBtnBg : t.banBtnBg, boxShadow: isBanned ? t.unbanBtnShadow : t.banBtnShadow }}>
                  {banning ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiSlash size={14} />}
                  {isBanned ? 'Unban User' : 'Ban User'}
                </button>
              )}
              <button onClick={() => openModal(adminConfig, handleToggleAdmin)} disabled={toggling} className="action-btn"
                style={{ background: user.isAdmin ? t.demoteBtnBg : t.adminBtnBg, boxShadow: user.isAdmin ? t.demoteBtnShadow : t.adminBtnShadow }}>
                {toggling ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiShield size={14} />}
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              {!user.isAdmin && (
                <button onClick={() => openModal(deleteConfig, handleDelete)} disabled={deleting} className="action-btn"
                  style={{ background: t.deleteBtnBg, boxShadow: t.deleteBtnShadow }}>
                  {deleting ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiTrash2 size={14} />}
                  Delete User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ maxWidth: 900, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        {msg.text && (
          <div style={{ background: msg.type === 'success' ? t.successBg : t.errorBg, color: msg.type === 'success' ? t.successColor : t.errorColor, border: `1px solid ${msg.type === 'success' ? t.successBorder : t.errorBorder}`, borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', animation: 'fadeUp 0.3s ease' }}>
            {msg.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />} {msg.text}
          </div>
        )}
        <div className="row g-3">
          {/* Left — profile card */}
          <div className="col-md-4">
            <div className="glass-card" style={{ animationDelay: '0.1s' }}>
              <div style={{ background: isBanned ? (isDark ? 'linear-gradient(135deg,#450a0a,#7f1d1d)' : 'linear-gradient(135deg,#fff1f1,#ffe4e4)') : 'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(0,212,170,0.2))', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', borderBottom: `1px solid ${t.cardBorder}` }}>
                <UserAvatar user={user} size={96} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: "'Cabinet Grotesk', sans-serif", color: t.heading }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: t.textMuted }}>{user.email}</div>
                </div>
              </div>
              <div style={{ padding: '1.2rem' }}>
                {[
                  { label: 'Role',         value: user.isAdmin ? '⚡ Admin' : '👤 User' },
                  { label: 'Status',       value: isBanned ? '🚫 Banned' : '✅ Active' },
                  { label: 'Listings',     value: boardings.length },
                  { label: 'Favorites',    value: user.favorites?.length || 0 },
                  { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Photo',        value: user.avatar ? '✅ Uploaded' : '— None' },
                ].map(({ label, value }) => (
                  <div key={label} className="info-row">
                    <span style={{ fontSize: '0.82rem', color: t.infoLabel, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', color: label === 'Status' && isBanned ? '#f87171' : t.heading, fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — listings */}
          <div className="col-md-8">
            <div className="glass-card" style={{ animationDelay: '0.15s' }}>
              <div style={{ padding: '1.2rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}` }}>
                <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.heading, margin: 0, fontSize: '1rem' }}>Boarding Listings</h4>
                <p style={{ color: t.textMuted, fontSize: '0.82rem', margin: '0.1rem 0 0' }}>{boardings.length} listing{boardings.length !== 1 ? 's' : ''} by this user</p>
              </div>
              {boardings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: t.textMuted }}>
                  <FiHome size={36} style={{ marginBottom: '0.8rem', opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>No listings yet</p>
                </div>
              ) : (
                <div style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} className="listing-card">
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width: 72, height: 58, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: `1px solid ${t.cardBorder}` }} onError={e => e.target.style.display = 'none'} />
                          : <div style={{ width: 72, height: 58, background: t.listingBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🏠</div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{b.title}</div>
                          <div style={{ fontSize: '0.78rem', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}><FiMapPin size={10} />{b.location}</div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', padding: '0.1rem 0.5rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>{b.roomType}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          <Link to={`/boarding/${b._id}`} target="_blank">
                            <button className="btn-sm-view"><FiEye size={12} />View</button>
                          </Link>
                          <button onClick={() => handleDeleteBoarding(b._id, b.title)} className="btn-sm-delete">
                            <FiTrash2 size={12} />Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;