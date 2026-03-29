import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEdit2, FiSave, FiX, FiTrash2,
  FiHome, FiMapPin, FiHeart, FiEye, FiEyeOff, FiCheckCircle,
  FiAlertCircle, FiCamera
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Profile data
  const [profileData, setProfileData] = useState(null);
  const [boardings, setBoardings] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit form
  const [editing, setEditing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });

  // Password section
  const [showPwSection, setShowPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  // Delete listing
  const [deletingId, setDeletingId] = useState(null);

  // Active tab
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
      // Update stored auth
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
      setShowPwSection(false);
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
    setFormName(profileData.name);
    setFormEmail(profileData.email);
    setEditing(false);
    setSaveMsg({ type: '', text: '' });
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;

  const initials = profileData?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const tabStyle = (t) => ({
    padding: '0.65rem 1.3rem',
    border: 'none',
    borderBottom: tab === t ? '2.5px solid #2563eb' : '2.5px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: tab === t ? 700 : 500,
    color: tab === t ? '#2563eb' : '#64748b',
    fontSize: '0.9rem',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #7c3aed 100%)', padding: '3rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {initials}
              </div>
            </div>
            <div style={{ color: '#fff' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>{profileData?.name}</h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{profileData?.email}</p>
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHome size={13} />{boardings.length} Listing{boardings.length !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.82rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiHeart size={13} />{favCount} Favorite{favCount !== 1 ? 's' : ''}
                </span>
                {profileData?.isAdmin && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.7rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                    ⚡ Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card lifted over banner */}
      <div className="container" style={{ maxWidth: 860, marginTop: '-2rem', paddingBottom: '3rem' }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(15,23,42,0.1)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #e2e8f0', display: 'flex', padding: '0 1.5rem', overflowX: 'auto' }}>
            <button style={tabStyle('info')} onClick={() => setTab('info')}>
              <FiUser size={14} /> Personal Info
            </button>
            <button style={tabStyle('password')} onClick={() => setTab('password')}>
              <FiLock size={14} /> Change Password
            </button>
            <button style={tabStyle('listings')} onClick={() => setTab('listings')}>
              <FiHome size={14} /> My Listings ({boardings.length})
            </button>
          </div>

          {/* ── Tab: Personal Info ── */}
          {tab === 'info' && (
            <div style={{ padding: '2rem' }}>
              {saveMsg.text && (
                <div style={{ background: saveMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: saveMsg.type === 'success' ? '#059669' : '#b91c1c', border: `1px solid ${saveMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {saveMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />} {saveMsg.text}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', margin: 0 }}>Personal Information</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Update your name and email address</p>
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    style={{ background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleSaveProfile} disabled={saving}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)' }}>
                      {saving ? <span className="spinner-border spinner-border-sm" /> : <><FiSave size={14} />Save</>}
                    </button>
                    <button onClick={handleCancelEdit}
                      style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 10, padding: '0.55rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)' }}>
                      <FiX size={14} />Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="row g-3">
                {/* Name field */}
                <div className="col-md-6">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                  {editing ? (
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #2563eb', borderRadius: 10, overflow: 'hidden' }}>
                      <span style={{ padding: '0 0.85rem', color: '#2563eb', background: '#eff6ff', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #bfdbfe' }}>
                        <FiUser size={15} />
                      </span>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FiUser size={15} color="#94a3b8" />{profileData?.name}
                    </div>
                  )}
                </div>

                {/* Email field */}
                <div className="col-md-6">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  {editing ? (
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #2563eb', borderRadius: 10, overflow: 'hidden' }}>
                      <span style={{ padding: '0 0.85rem', color: '#2563eb', background: '#eff6ff', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #bfdbfe' }}>
                        <FiMail size={15} />
                      </span>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FiMail size={15} color="#94a3b8" />{profileData?.email}
                    </div>
                  )}
                </div>

                {/* Account info */}
                <div className="col-md-6">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Role</label>
                  <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <span style={{ background: profileData?.isAdmin ? '#ede9fe' : '#f0fdf4', color: profileData?.isAdmin ? '#7c3aed' : '#059669', padding: '0.25rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                      {profileData?.isAdmin ? '⚡ Admin' : '👤 User'}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</label>
                  <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569' }}>
                    {new Date(profileData?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <Link to="/favorites">
                  <button style={{ background: '#fdf4ff', color: '#9333ea', border: '1px solid #e9d5ff', borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                    <FiHeart size={14} /> View Favorites ({favCount})
                  </button>
                </Link>
                <Link to="/add">
                  <button style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                    <FiHome size={14} /> Add New Listing
                  </button>
                </Link>
                {profileData?.isAdmin && (
                  <Link to="/admin/dashboard">
                    <button style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.55rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                      ⚡ Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ── Tab: Change Password ── */}
          {tab === 'password' && (
            <div style={{ padding: '2rem', maxWidth: 480 }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Change Password</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.8rem' }}>Enter your current password then choose a new one.</p>

              {pwMsg.text && (
                <div style={{ background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#059669' : '#b91c1c', border: `1px solid ${pwMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {pwMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />} {pwMsg.text}
                </div>
              )}

              {[
                { label: 'Current Password', val: currentPw, set: setCurrentPw, ph: 'Your current password' },
                { label: 'New Password', val: newPw, set: setNewPw, ph: 'Min. 6 characters' },
                { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, ph: 'Repeat new password' },
              ].map(({ label, val, set, ph }, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}
                    onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
                    onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                      <FiLock size={15} />
                    </span>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={ph}
                      style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
                    />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: '#94a3b8' }}>
                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                  {i === 2 && confirmPw && confirmPw !== newPw && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>⚠ Passwords don't match</div>
                  )}
                  {i === 2 && confirmPw && confirmPw === newPw && (
                    <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>✓ Passwords match</div>
                  )}
                </div>
              ))}

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '0.8rem 1rem', marginBottom: '1.2rem', fontSize: '0.8rem', color: '#92400e' }}>
                💡 Password must be at least 6 characters. Use a mix of letters and numbers for a stronger password.
              </div>

              <button onClick={handleSavePassword} disabled={pwSaving}
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', cursor: pwSaving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', opacity: pwSaving ? 0.7 : 1 }}>
                {pwSaving ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><FiLock size={14} />Update Password</>}
              </button>
            </div>
          )}

          {/* ── Tab: My Listings ── */}
          {tab === 'listings' && (
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Listings</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Manage your boarding listings</p>
                </div>
                <Link to="/add">
                  <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
                    + Add New Listing
                  </button>
                </Link>
              </div>

              {boardings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#f8fafc', borderRadius: 16, border: '2px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🏠</div>
                  <h5 style={{ fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: '0.4rem' }}>No listings yet</h5>
                  <p style={{ color: '#94a3b8', marginBottom: '1.2rem' }}>You haven't added any boarding listings.</p>
                  <Link to="/add">
                    <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
                      Add Your First Listing
                    </button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.2rem', borderRadius: 14, border: '1px solid #e2e8f0', background: '#fafbfc', alignItems: 'center', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                          : <div style={{ width: 80, height: 64, background: '#e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🏠</div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <FiMapPin size={11} />{b.location}
                          </div>
                          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb' }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.1rem 0.55rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>{b.roomType}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <Link to={`/boarding/${b._id}`}>
                            <button title="View listing" style={{ background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: 8, padding: '0.5rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <FiEye size={13} />View
                            </button>
                          </Link>
                          <button onClick={() => handleDeleteBoarding(b._id, b.title)} disabled={deletingId === b._id}
                            title="Delete listing"
                            style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.5rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
