import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiTrash2, FiShield, FiHome, FiMail,
  FiCalendar, FiMapPin, FiEye, FiCheckCircle, FiAlertCircle, FiSlash
} from 'react-icons/fi';
import api from '../api/axios';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';
const IMAGE_BASE  = 'http://localhost:5001/uploads/';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes orbFloat {
    0%,100% { transform:translate(0,0) scale(1); }
    33%      { transform:translate(30px,-40px) scale(1.06); }
    66%      { transform:translate(-20px,25px) scale(0.96); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp 0.5s ease both;
  }
  .action-btn {
    backdrop-filter: blur(8px);
    color: #fff;
    border-radius: 10px;
    padding: 0.55rem 1.1rem;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.875rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s;
  }
  .listing-card {
    display: flex; gap: 0.9rem; padding: 0.9rem 1rem;
    border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03); align-items: center;
    transition: all 0.2s;
  }
  .listing-card:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(0,212,170,0.2);
  }
  .info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.7rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .btn-sm-view {
    background: rgba(14,165,233,0.15); color: #38bdf8;
    border: 1px solid rgba(14,165,233,0.25);
    border-radius: 8px; padding: 0.45rem 0.75rem;
    cursor: pointer; font-size: 0.78rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.3rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.2s;
  }
  .btn-sm-view:hover { background: rgba(14,165,233,0.25); }
  .btn-sm-delete {
    background: rgba(239,68,68,0.12); color: #f87171;
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px; padding: 0.45rem 0.75rem;
    cursor: pointer; font-size: 0.78rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.3rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.2s;
  }
  .btn-sm-delete:hover { background: rgba(239,68,68,0.22); }
`;

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

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [banning, setBanning] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => { setUser(res.data.user); setBoardings(res.data.boardings); })
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${user.name}" and all their listings?`)) return;
    setDeleting(true);
    try { await api.delete(`/admin/users/${id}`); navigate('/admin/users'); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Delete failed'); setDeleting(false); }
  };

  const handleToggleAdmin = async () => {
    if (!window.confirm(`${user.isAdmin ? 'Remove admin from' : 'Make admin'} "${user.name}"?`)) return;
    setToggling(true);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-admin`);
      setUser(prev => ({ ...prev, isAdmin: res.data.isAdmin }));
      showMsg('success', res.data.message);
    } catch (err) { showMsg('error', err.response?.data?.message || 'Toggle failed'); }
    finally { setToggling(false); }
  };

  const handleToggleBan = async () => {
    const action = user.isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;
    setBanning(true);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-ban`);
      setUser(prev => ({ ...prev, isBanned: res.data.isBanned }));
      showMsg('success', res.data.message);
    } catch (err) { showMsg('error', err.response?.data?.message || 'Failed'); }
    finally { setBanning(false); }
  };

  const handleDeleteBoarding = async (boardingId, title) => {
    if (!window.confirm(`Delete listing "${title}"?`)) return;
    try {
      await api.delete(`/admin/boardings/${boardingId}`);
      setBoardings(prev => prev.filter(b => b._id !== boardingId));
      showMsg('success', `Listing "${title}" deleted.`);
    } catch (err) { showMsg('error', err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060f2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: '#00d4aa' }} />
    </div>
  );
  if (!user) return null;

  const isBanned = user.isBanned;
  const bannerGradient = isBanned
    ? 'linear-gradient(135deg,#450a0a,#7f1d1d,#991b1b)'
    : 'linear-gradient(135deg,#060f2a,#0c2051,#0ea5e920)';

  return (
    <div style={{ minHeight: '100vh', background: '#060f2a', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: '#0ea5e928', top: '-200px', left: '-150px', delay: '0s' },
          { w: 500, h: 500, color: '#06b6d425', top: '40%', right: '-150px', delay: '-6s' },
          { w: 350, h: 350, color: '#00d4aa1a', bottom: '-100px', left: '30%', delay: '-11s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle,${o.color},transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: 'orbFloat 14s ease-in-out infinite', animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Banner */}
      <div style={{ background: bannerGradient, padding: '2.5rem 0 4rem', position: 'relative', zIndex: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Link to="/admin/users" style={{ color: 'rgba(220,233,255,0.5)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <FiArrowLeft size={14} /> Back to Users
          </Link>

          {isBanned && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '0.6rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem', fontWeight: 700 }}>
              <FiSlash size={14} /> This user is currently banned
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <UserAvatar user={user} size={88} />
            <div style={{ color: '#dce9ff', flex: 1 }}>
              <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>{user.name}</h1>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiMail size={13} /> {user.email}
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
                <span style={{ background: user.isAdmin ? 'rgba(167,139,250,0.2)' : 'rgba(0,212,170,0.15)', border: `1px solid ${user.isAdmin ? 'rgba(167,139,250,0.3)' : 'rgba(0,212,170,0.25)'}`, padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: user.isAdmin ? '#a78bfa' : '#00d4aa' }}>
                  {user.isAdmin ? '⚡ Admin' : '👤 User'}
                </span>
                {isBanned && <span style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>🚫 Banned</span>}
                <span style={{ fontSize: '0.82rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiHome size={13} /> {boardings.length} Listing{boardings.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.82rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiCalendar size={13} /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {!user.isAdmin && (
                <button onClick={handleToggleBan} disabled={banning} className="action-btn"
                  style={{ background: isBanned ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${isBanned ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {banning ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiSlash size={14} />}
                  {isBanned ? 'Unban User' : 'Ban User'}
                </button>
              )}
              <button onClick={handleToggleAdmin} disabled={toggling} className="action-btn"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {toggling ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiShield size={14} />}
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              {!user.isAdmin && (
                <button onClick={handleDelete} disabled={deleting} className="action-btn"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {deleting ? <span className="spinner-border spinner-border-sm" style={{ width: '0.85rem', height: '0.85rem' }} /> : <FiTrash2 size={14} />}
                  Delete User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: 900, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        {msg.text && (
          <div style={{ background: msg.type === 'success' ? 'rgba(0,212,170,0.1)' : 'rgba(239,68,68,0.1)', color: msg.type === 'success' ? '#00d4aa' : '#f87171', border: `1px solid ${msg.type === 'success' ? 'rgba(0,212,170,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', animation: 'fadeUp 0.3s ease' }}>
            {msg.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />} {msg.text}
          </div>
        )}

        <div className="row g-3">
          {/* Left: User Info Card */}
          <div className="col-md-4">
            <div className="glass-card" style={{ animationDelay: '0.1s' }}>
              <div style={{ background: isBanned ? 'linear-gradient(135deg,#450a0a,#7f1d1d)' : 'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(0,212,170,0.2))', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <UserAvatar user={user} size={96} />
                <div style={{ textAlign: 'center', color: '#dce9ff' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email}</div>
                </div>
              </div>
              <div style={{ padding: '1.2rem' }}>
                {[
                  { label: 'Role', value: user.isAdmin ? '⚡ Admin' : '👤 User' },
                  { label: 'Status', value: isBanned ? '🚫 Banned' : '✅ Active' },
                  { label: 'Listings', value: boardings.length },
                  { label: 'Favorites', value: user.favorites?.length || 0 },
                  { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Photo', value: user.avatar ? '✅ Uploaded' : '— None' },
                ].map(({ label, value }) => (
                  <div key={label} className="info-row">
                    <span style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.4)', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', color: label === 'Status' && isBanned ? '#f87171' : '#dce9ff', fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Listings */}
          <div className="col-md-8">
            <div className="glass-card" style={{ animationDelay: '0.15s' }}>
              <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0, fontSize: '1rem' }}>Boarding Listings</h4>
                <p style={{ color: 'rgba(220,233,255,0.4)', fontSize: '0.82rem', margin: '0.1rem 0 0' }}>{boardings.length} listing{boardings.length !== 1 ? 's' : ''} by this user</p>
              </div>
              {boardings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'rgba(220,233,255,0.35)' }}>
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
                          ? <img src={imgUrl} alt={b.title} style={{ width: 72, height: 58, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} onError={e => e.target.style.display = 'none'} />
                          : <div style={{ width: 72, height: 58, background: 'rgba(255,255,255,0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🏠</div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#dce9ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{b.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.45)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}><FiMapPin size={10} />{b.location}</div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', padding: '0.1rem 0.5rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>{b.roomType}</span>
                            {b.isPromoted && <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '0.1rem 0.5rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>⭐ Promoted</span>}
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