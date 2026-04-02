import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiTrash2, FiShield, FiHome, FiMail,
  FiCalendar, FiMapPin, FiEye, FiCheckCircle, FiAlertCircle, FiSlash
} from 'react-icons/fi';
import api from '../api/axios';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';
const IMAGE_BASE  = 'http://localhost:5001/uploads/';

const UserAvatar = ({ user, size = 80 }) => {
  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarUrl = user?.avatarUrl || (user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null);
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background: avatarUrl ? 'transparent' : 'linear-gradient(135deg,#2563eb,#7c3aed)', border:'3px solid rgba(255,255,255,0.5)', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={user?.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
        : <span style={{ fontSize:size*0.3, fontWeight:800, color:'#fff', fontFamily:'var(--font-heading)' }}>{initials}</span>}
    </div>
  );
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user,     setUser]     = useState(null);
  const [boardings,setBoardings]= useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [banning,  setBanning]  = useState(false);
  const [msg,      setMsg]      = useState({ type:'', text:'' });

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => { setUser(res.data.user); setBoardings(res.data.boardings); })
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${user.name}" and all their listings?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${id}`);
      navigate('/admin/users');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Delete failed');
      setDeleting(false);
    }
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
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spinner-border text-primary" />
    </div>
  );
  if (!user) return null;

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>

      {/* Banner */}
      <div style={{ background: user.isBanned ? 'linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c)' : 'linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)', padding:'2.5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth:900 }}>
          <Link to="/admin/users" style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.4rem', marginBottom:'1.5rem' }}>
            <FiArrowLeft size={14} /> Back to Users
          </Link>

          {user.isBanned && (
            <div style={{ background:'rgba(239,68,68,0.2)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:10, padding:'0.6rem 1rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', color:'#fca5a5', fontSize:'0.85rem', fontWeight:700 }}>
              <FiSlash size={14} /> This user is currently banned
            </div>
          )}

          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.5rem', flexWrap:'wrap' }}>
            <UserAvatar user={user} size={88} />
            <div style={{ color:'#fff', flex:1 }}>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, margin:0, marginBottom:'0.2rem' }}>{user.name}</h1>
              <p style={{ margin:0, opacity:0.8, fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <FiMail size={13} /> {user.email}
              </p>
              <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.7rem', flexWrap:'wrap' }}>
                <span style={{ background: user.isAdmin ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.15)', padding:'0.2rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700 }}>
                  {user.isAdmin ? '⚡ Admin' : '👤 User'}
                </span>
                {user.isBanned && (
                  <span style={{ background:'rgba(239,68,68,0.3)', padding:'0.2rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700 }}>
                    🚫 Banned
                  </span>
                )}
                <span style={{ fontSize:'0.82rem', opacity:0.85, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                  <FiHome size={13} /> {boardings.length} Listing{boardings.length !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize:'0.82rem', opacity:0.85, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                  <FiCalendar size={13} />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
              {/* Ban / Unban */}
              {!user.isAdmin && (
                <button onClick={handleToggleBan} disabled={banning}
                  style={{ background: user.isBanned ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', backdropFilter:'blur(8px)', color:'#fff', border: `1px solid ${user.isBanned ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, borderRadius:10, padding:'0.55rem 1.1rem', cursor:'pointer', fontWeight:700, fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--font-body)' }}>
                  {banning ? <span className="spinner-border spinner-border-sm" style={{ width:'0.85rem', height:'0.85rem' }} /> : <FiSlash size={14} />}
                  {user.isBanned ? 'Unban User' : 'Ban User'}
                </button>
              )}

              <button onClick={handleToggleAdmin} disabled={toggling}
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', borderRadius:10, padding:'0.55rem 1.1rem', cursor:'pointer', fontWeight:700, fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--font-body)' }}>
                {toggling ? <span className="spinner-border spinner-border-sm" style={{ width:'0.85rem', height:'0.85rem' }} /> : <FiShield size={14} />}
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>

              {!user.isAdmin && (
                <button onClick={handleDelete} disabled={deleting}
                  style={{ background:'rgba(239,68,68,0.2)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(239,68,68,0.4)', borderRadius:10, padding:'0.55rem 1.1rem', cursor:'pointer', fontWeight:700, fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--font-body)' }}>
                  {deleting ? <span className="spinner-border spinner-border-sm" style={{ width:'0.85rem', height:'0.85rem' }} /> : <FiTrash2 size={14} />}
                  Delete User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth:900, marginTop:'-2rem', paddingBottom:'3rem' }}>
        {msg.text && (
          <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#059669' : '#b91c1c', border:`1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius:12, padding:'0.85rem 1.2rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.875rem' }}>
            {msg.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />} {msg.text}
          </div>
        )}

        <div className="row g-3">
          {/* Left: User Info Card */}
          <div className="col-md-4">
            <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 4px 20px rgba(15,23,42,0.08)', overflow:'hidden' }}>
              <div style={{ background: user.isBanned ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.8rem' }}>
                <UserAvatar user={user} size={96} />
                <div style={{ textAlign:'center', color:'#fff' }}>
                  <div style={{ fontWeight:800, fontSize:'1rem', fontFamily:'var(--font-heading)' }}>{user.name}</div>
                  <div style={{ fontSize:'0.8rem', opacity:0.8 }}>{user.email}</div>
                </div>
              </div>
              <div style={{ padding:'1.2rem' }}>
                {[
                  { label:'Role',         value: user.isAdmin ? '⚡ Admin' : '👤 User' },
                  { label:'Status',       value: user.isBanned ? '🚫 Banned' : '✅ Active' },
                  { label:'Listings',     value: boardings.length },
                  { label:'Favorites',    value: user.favorites?.length || 0 },
                  { label:'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) },
                  { label:'Photo',        value: user.avatar ? '✅ Uploaded' : '— None' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ fontSize:'0.82rem', color:'#94a3b8', fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:'0.85rem', color: label === 'Status' && user.isBanned ? '#dc2626' : '#0f172a', fontWeight:700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Listings */}
          <div className="col-md-8">
            <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 4px 20px rgba(15,23,42,0.08)', overflow:'hidden' }}>
              <div style={{ padding:'1.2rem 1.5rem', borderBottom:'1px solid #f1f5f9' }}>
                <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', margin:0, fontSize:'1rem' }}>Boarding Listings</h4>
                <p style={{ color:'#94a3b8', fontSize:'0.82rem', margin:'0.1rem 0 0' }}>{boardings.length} listing{boardings.length !== 1 ? 's' : ''} by this user</p>
              </div>

              {boardings.length === 0 ? (
                <div style={{ textAlign:'center', padding:'3rem 2rem', color:'#94a3b8' }}>
                  <FiHome size={36} style={{ marginBottom:'0.8rem', opacity:0.4 }} />
                  <p style={{ margin:0 }}>No listings yet</p>
                </div>
              ) : (
                <div style={{ padding:'1rem 1.2rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} style={{ display:'flex', gap:'0.9rem', padding:'0.9rem 1rem', borderRadius:12, border:'1px solid #e2e8f0', background:'#fafbfc', alignItems:'center' }}>
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width:72, height:58, objectFit:'cover', borderRadius:8, flexShrink:0 }} onError={e => e.target.style.display='none'} />
                          : <div style={{ width:72, height:58, background:'#e2e8f0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>🏠</div>}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'0.2rem' }}>{b.title}</div>
                          <div style={{ fontSize:'0.78rem', color:'#64748b', display:'flex', alignItems:'center', gap:'0.35rem', marginBottom:'0.2rem' }}><FiMapPin size={10} />{b.location}</div>
                          <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
                            <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#2563eb' }}>LKR {b.price?.toLocaleString()}/mo</span>
                            <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'0.1rem 0.5rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>{b.roomType}</span>
                            {b.isPromoted && <span style={{ background:'#fef3c7', color:'#d97706', padding:'0.1rem 0.5rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>⭐ Promoted</span>}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                          <Link to={`/boarding/${b._id}`} target="_blank">
                            <button style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:8, padding:'0.45rem 0.75rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                              <FiEye size={12} />View
                            </button>
                          </Link>
                          <button onClick={() => handleDeleteBoarding(b._id, b.title)}
                            style={{ background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:8, padding:'0.45rem 0.75rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
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