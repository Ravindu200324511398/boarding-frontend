import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrash2, FiEye, FiShield, FiUser, FiSearch, FiSlash } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import UserAvatar from '../components/UserAvatar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [banningId, setBanningId] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false, title: '', message: '', confirmText: '',
    confirmColor: 'blue', icon: '', onConfirm: null,
  });

  const openModal = (config) => setModal({ isOpen: true, ...config });
  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

  useEffect(() => {
    api.get('/admin/users')
      .then(res => { setUsers(res.data.users); setFiltered(res.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter === 'admins') result = result.filter(u => u.isAdmin);
    if (roleFilter === 'users') result = result.filter(u => !u.isAdmin);
    if (roleFilter === 'banned') result = result.filter(u => u.isBanned);
    setFiltered(result);
  }, [search, users, roleFilter]);

  const confirmDelete = (id, name) => {
    openModal({
      title: 'Delete User', icon: '🗑️', confirmColor: 'red', confirmText: 'Yes, Delete',
      message: `Are you sure you want to delete "${name}" and all their listings? This cannot be undone.`,
      onConfirm: () => doDelete(id),
    });
  };

  const doDelete = async (id) => {
    closeModal(); setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const confirmToggleAdmin = (id, name, currentlyAdmin) => {
    openModal({
      title: currentlyAdmin ? 'Remove Admin Access' : 'Grant Admin Access',
      icon: currentlyAdmin ? '⬇️' : '⬆️',
      confirmColor: currentlyAdmin ? 'red' : 'blue',
      confirmText: currentlyAdmin ? 'Yes, Demote' : 'Yes, Promote',
      message: currentlyAdmin
        ? `Remove admin privileges from "${name}"? They will become a regular user.`
        : `Grant admin access to "${name}"? They will be able to manage all users and listings.`,
      onConfirm: () => doToggleAdmin(id, currentlyAdmin),
    });
  };

  const doToggleAdmin = async (id, currentlyAdmin) => {
    closeModal(); setTogglingId(id);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-admin`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isAdmin: res.data.isAdmin } : u));
    } catch { alert('Failed to update admin status'); }
    finally { setTogglingId(null); }
  };

  const confirmToggleBan = (id, name, currentlyBanned) => {
    openModal({
      title: currentlyBanned ? 'Unban User' : 'Ban User',
      icon: currentlyBanned ? '✅' : '🚫',
      confirmColor: currentlyBanned ? 'blue' : 'red',
      confirmText: currentlyBanned ? 'Yes, Unban' : 'Yes, Ban',
      message: currentlyBanned
        ? `Unban "${name}"? They will regain access to the platform.`
        : `Ban "${name}"? They will not be able to post or edit listings.`,
      onConfirm: () => doToggleBan(id),
    });
  };

  const doToggleBan = async (id) => {
    closeModal(); setBanningId(id);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-ban`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: res.data.isBanned } : u));
    } catch { alert('Failed to update ban status'); }
    finally { setBanningId(null); }
  };

  const adminCount = users.filter(u => u.isAdmin).length;
  const userCount = users.filter(u => !u.isAdmin).length;
  const bannedCount = users.filter(u => u.isBanned).length;

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        confirmColor={modal.confirmColor}
        icon={modal.icon}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', padding:'2.5rem 0', marginBottom:'2rem' }}>
        <div className="container">
          <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.4rem' }}>
            <Link to="/admin/dashboard" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>Dashboard</Link>
            {' / '}<span style={{ color:'rgba(255,255,255,0.7)' }}>Users</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.9rem', fontWeight:800, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:'0.8rem' }}>
            <FiUsers size={22} color="#60a5fa" /> Manage Users
          </h1>
          <p style={{ color:'rgba(255,255,255,0.5)', margin:'0.3rem 0 0', fontSize:'0.9rem' }}>
            {users.length} total accounts
            {bannedCount > 0 && <span style={{ color:'#f87171', marginLeft:'0.6rem' }}>· 🚫 {bannedCount} banned</span>}
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Search + Filter Bar */}
        <div style={{ background:'#fff', borderRadius:16, padding:'1rem 1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.07)', border:'1px solid #e2e8f0', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flex:1, minWidth:200, background:'#f8fafc', borderRadius:10, padding:'0.5rem 1rem', border:'1px solid #e2e8f0' }}>
            <FiSearch color="#94a3b8" size={15} />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border:'none', outline:'none', flex:1, fontSize:'0.9rem', fontFamily:'var(--font-body)', color:'#0f172a', background:'transparent' }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>×</button>}
          </div>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {[
              { key:'all', label:`All ${users.length}` },
              { key:'admins', label:`Admins ${adminCount}` },
              { key:'users', label:`Users ${userCount}` },
              { key:'banned', label:`🚫 Banned ${bannedCount}` },
            ].map(f => (
              <button key={f.key} onClick={() => setRoleFilter(f.key)}
                style={{ padding:'0.4rem 1rem', borderRadius:50, fontSize:'0.82rem', fontWeight:700, border:'none', cursor:'pointer', transition:'all 0.15s', background: roleFilter === f.key ? '#0f172a' : '#f1f5f9', color: roleFilter === f.key ? '#fff' : '#64748b', fontFamily:'var(--font-body)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner-border text-primary" /></div>
        ) : (
          <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 4px 24px rgba(15,23,42,0.07)', border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                    {['User','Email','Role','Status','Listings','Joined','Actions'].map(h => (
                      <th key={h} style={{ padding:'1rem 1.2rem', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id}
                      style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.15s', background: u.isBanned ? '#fff5f5' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = u.isBanned ? '#fff0f0' : '#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background = u.isBanned ? '#fff5f5' : 'transparent'}>

                      {/* User */}
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
                          <div style={{ position:'relative' }}>
                            <UserAvatar name={u.name} size={40} profilePhoto={u.avatar} />
                            {u.isBanned && (
                              <div style={{ position:'absolute', bottom:-2, right:-2, background:'#ef4444', borderRadius:'50%', width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>
                                <FiSlash size={7} color="#fff" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:'0.9rem', color: u.isBanned ? '#94a3b8' : '#0f172a' }}>{u.name}</div>
                            {u.isAdmin && <div style={{ fontSize:'0.7rem', color:'#f59e0b', fontWeight:700 }}>⚡ Admin</div>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding:'1rem 1.2rem', fontSize:'0.875rem', color:'#64748b' }}>{u.email}</td>

                      {/* Role */}
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <span style={{ background: u.isAdmin ? '#fef3c7' : '#f0fdf4', color: u.isAdmin ? '#d97706' : '#059669', padding:'0.3rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                          {u.isAdmin ? <><FiShield size={11} />Admin</> : <><FiUser size={11} />User</>}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding:'1rem 1.2rem' }}>
                        {u.isBanned ? (
                          <span style={{ background:'#fef2f2', color:'#dc2626', padding:'0.3rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                            <FiSlash size={11} />Banned
                          </span>
                        ) : (
                          <span style={{ background:'#f0fdf4', color:'#059669', padding:'0.3rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700 }}>
                            ✓ Active
                          </span>
                        )}
                      </td>

                      {/* Listings */}
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <span style={{ background:'#eff6ff', color:'#2563eb', padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                          🏠 {u.boardingCount}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding:'1rem 1.2rem', fontSize:'0.82rem', color:'#94a3b8', whiteSpace:'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <div style={{ display:'flex', gap:'0.4rem', alignItems:'center', flexWrap:'wrap' }}>
                          <Link to={`/admin/users/${u._id}`}>
                            <button style={{ background:'#eff6ff', color:'#2563eb', border:'none', borderRadius:8, padding:'0.45rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', fontWeight:700, fontFamily:'var(--font-body)' }}>
                              <FiEye size={13} />View
                            </button>
                          </Link>

                          {!u.isAdmin && (
                            <button
                              onClick={() => confirmToggleBan(u._id, u.name, u.isBanned)}
                              disabled={banningId === u._id}
                              style={{ background: u.isBanned ? '#f0fdf4' : '#fff1f2', color: u.isBanned ? '#16a34a' : '#e11d48', border: `1px solid ${u.isBanned ? '#bbf7d0' : '#fecdd3'}`, borderRadius:8, padding:'0.45rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', fontWeight:700, fontFamily:'var(--font-body)' }}>
                              {banningId === u._id
                                ? <span className="spinner-border spinner-border-sm" />
                                : <><FiSlash size={13} />{u.isBanned ? 'Unban' : 'Ban'}</>}
                            </button>
                          )}

                          <button
                            onClick={() => confirmToggleAdmin(u._id, u.name, u.isAdmin)}
                            disabled={togglingId === u._id}
                            style={{ background: u.isAdmin ? '#fff7ed' : '#f0fdf4', color: u.isAdmin ? '#ea580c' : '#16a34a', border: `1px solid ${u.isAdmin ? '#fed7aa' : '#bbf7d0'}`, borderRadius:8, padding:'0.45rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', fontWeight:700, fontFamily:'var(--font-body)' }}>
                            {togglingId === u._id
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><FiShield size={13} />{u.isAdmin ? 'Demote' : 'Promote'}</>}
                          </button>

                          {!u.isAdmin && (
                            <button
                              onClick={() => confirmDelete(u._id, u.name)}
                              disabled={deletingId === u._id}
                              style={{ background:'#fff1f2', color:'#e11d48', border:'1px solid #fecdd3', borderRadius:8, padding:'0.45rem 0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.8rem', fontWeight:700, fontFamily:'var(--font-body)' }}>
                              {deletingId === u._id
                                ? <span className="spinner-border spinner-border-sm" />
                                : <><FiTrash2 size={13} />Delete</>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>👥</div>
                  <p>No users found.</p>
                </div>
              )}
            </div>
            {filtered.length > 0 && (
              <div style={{ padding:'0.9rem 1.5rem', background:'#f8fafc', borderTop:'1px solid #e2e8f0', fontSize:'0.82rem', color:'#94a3b8', textAlign:'center' }}>
                Showing {filtered.length} of {users.length} users
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;