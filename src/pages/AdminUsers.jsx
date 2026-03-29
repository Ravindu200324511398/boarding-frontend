import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiTrash2, FiEye, FiShield, FiSearch,
  FiHome, FiCheckCircle, FiAlertCircle, FiUser
} from 'react-icons/fi';
import api from '../api/axios';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// ── Reusable avatar component ─────────────────────────────
const UserAvatar = ({ user, size = 40 }) => {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  // Support both avatarUrl (pre-built by backend) and raw avatar filename
  const avatarUrl = user?.avatarUrl || (user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null);

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
      border: '2px solid #e2e8f0', overflow: 'hidden', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span style={{ fontSize: size * 0.33, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
          {initials}
        </span>
      )}
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all'); // all | admin | user
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [msg, setMsg]           = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch {
      setMsg({ type: 'error', text: 'Failed to load users' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their listings?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      setMsg({ type: 'success', text: `User "${name}" deleted.` });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    } finally { setDeletingId(null); }
  };

  const handleToggleAdmin = async (id, name, current) => {
    if (!window.confirm(`${current ? 'Remove admin from' : 'Make admin'} "${name}"?`)) return;
    setTogglingId(id);
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-admin`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isAdmin: res.data.isAdmin } : u));
      setMsg({ type: 'success', text: res.data.message });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Toggle failed' });
    } finally { setTogglingId(null); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'admin' ? u.isAdmin : !u.isAdmin;
    return matchSearch && matchFilter;
  });

  const pill = (label, count, active, onClick, color) => (
    <button onClick={onClick} style={{
      background: active ? color : '#f1f5f9',
      color: active ? '#fff' : '#64748b',
      border: 'none', borderRadius: 20, padding: '0.35rem 1rem',
      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      transition: 'all 0.15s', fontFamily: 'var(--font-body)',
    }}>
      {label}
      <span style={{ background: active ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: active ? '#fff' : '#64748b', borderRadius: 20, padding: '0 0.45rem', fontSize: '0.75rem' }}>
        {count}
      </span>
    </button>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '2rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '0.82rem', opacity: 0.7, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Link to="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span> Users
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiUsers /> Manage Users
              </h1>
              <p style={{ margin: '0.3rem 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
                {users.length} total accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, marginTop: '-1.5rem', paddingBottom: '3rem' }}>

        {/* Message */}
        {msg.text && (
          <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#059669' : '#b91c1c', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            {msg.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />} {msg.text}
          </div>
        )}

        {/* Filters & Search */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.2rem 1.5rem', boxShadow: '0 4px 20px rgba(15,23,42,0.08)', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', flex: 1, minWidth: 220 }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
            onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
            <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              style={{ border: 'none', outline: 'none', flex: 1, padding: '0.65rem 1rem', fontSize: '0.9rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {pill('All',    users.length,                           filter === 'all',   () => setFilter('all'),   '#475569')}
            {pill('Admins', users.filter(u => u.isAdmin).length,    filter === 'admin', () => setFilter('admin'), '#7c3aed')}
            {pill('Users',  users.filter(u => !u.isAdmin).length,   filter === 'user',  () => setFilter('user'),  '#2563eb')}
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(15,23,42,0.08)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="spinner-border text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <FiUser size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No users found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['User', 'Email', 'Role', 'Listings', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfc'}>

                      {/* User column — avatar + name */}
                      <td style={{ padding: '0.85rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <UserAvatar user={u} size={40} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{u.name}</div>
                            {u.isAdmin && (
                              <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700 }}>⚡ Admin</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.85rem', color: '#475569' }}>
                        {u.email}
                      </td>

                      {/* Role badge */}
                      <td style={{ padding: '0.85rem 1.2rem' }}>
                        <span style={{
                          background: u.isAdmin ? '#ede9fe' : '#f0fdf4',
                          color: u.isAdmin ? '#7c3aed' : '#059669',
                          padding: '0.25rem 0.75rem', borderRadius: 20,
                          fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          {u.isAdmin ? '⚡ Admin' : '👤 User'}
                        </span>
                      </td>

                      {/* Listing count */}
                      <td style={{ padding: '0.85rem 1.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                          <FiHome size={13} color="#94a3b8" />{u.boardingCount || 0}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1.2rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Link to={`/admin/users/${u._id}`}>
                            <button title="View details" style={{ background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <FiEye size={13} />View
                            </button>
                          </Link>
                          <button onClick={() => handleToggleAdmin(u._id, u.name, u.isAdmin)} disabled={togglingId === u._id} title={u.isAdmin ? 'Remove admin' : 'Make admin'}
                            style={{ background: u.isAdmin ? '#ede9fe' : '#f0fdf4', color: u.isAdmin ? '#7c3aed' : '#059669', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {togglingId === u._id ? <span className="spinner-border spinner-border-sm" style={{ width: '0.75rem', height: '0.75rem' }} /> : <FiShield size={13} />}
                            {u.isAdmin ? 'Demote' : 'Promote'}
                          </button>
                          {!u.isAdmin && (
                            <button onClick={() => handleDelete(u._id, u.name)} disabled={deletingId === u._id} title="Delete user"
                              style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {deletingId === u._id ? <span className="spinner-border spinner-border-sm" style={{ width: '0.75rem', height: '0.75rem' }} /> : <FiTrash2 size={13} />}
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary footer */}
        {!loading && filtered.length > 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', marginTop: '1rem' }}>
            Showing {filtered.length} of {users.length} users
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;