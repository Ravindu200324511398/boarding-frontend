import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrash2, FiEye, FiShield, FiUser, FiSearch, FiSlash } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import UserAvatar from '../components/UserAvatar';
import { useTheme } from '../context/ThemeContext';

const getTokens = (isDark) => isDark ? {
  pageBg: '#060f2a',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.08)',
  filterBg: 'rgba(255,255,255,0.04)',
  filterBorder: 'rgba(255,255,255,0.09)',
  searchBg: 'rgba(255,255,255,0.05)',
  searchBorder: 'rgba(255,255,255,0.1)',
  inputColor: 'rgba(220,233,255,0.9)',
  inputPlaceholder: 'rgba(220,233,255,0.3)',
  heading: '#dce9ff',
  textMuted: 'rgba(220,233,255,0.45)',
  breadcrumb: 'rgba(220,233,255,0.35)',
  breadcrumbActive: 'rgba(220,233,255,0.65)',
  theadBg: 'rgba(255,255,255,0.03)',
  theadBorder: 'rgba(255,255,255,0.08)',
  theadColor: 'rgba(220,233,255,0.35)',
  rowBorder: 'rgba(255,255,255,0.05)',
  rowHoverBg: 'rgba(255,255,255,0.04)',
  rowBannedBg: 'rgba(239,68,68,0.04)',
  rowBannedHover: 'rgba(239,68,68,0.07)',
  cellColor: '#dce9ff',
  cellMuted: 'rgba(220,233,255,0.45)',
  pillActive: 'linear-gradient(135deg,#00d4aa,#0ea5e9)',
  pillInactiveBg: 'rgba(255,255,255,0.07)',
  pillInactiveColor: 'rgba(220,233,255,0.5)',
  pillInactiveHoverBg: 'rgba(255,255,255,0.12)',
  pillInactiveHoverColor: 'rgba(220,233,255,0.8)',
  footerBg: 'rgba(255,255,255,0.02)',
  footerBorder: 'rgba(255,255,255,0.06)',
  footerColor: 'rgba(220,233,255,0.3)',
  accent: '#00d4aa',
  accentGlow: '#00d4aa',
  bannedBadgeBg: '#060f2a',
  orbColors: ['#0ea5e928', '#06b6d425', '#00d4aa1a'],
  gridLine: 'rgba(255,255,255,.02)',
} : {
  pageBg: '#f0f4ff',
  cardBg: 'rgba(255,255,255,0.9)',
  cardBorder: 'rgba(0,112,192,0.1)',
  filterBg: 'rgba(255,255,255,0.8)',
  filterBorder: 'rgba(0,112,192,0.12)',
  searchBg: 'rgba(255,255,255,0.9)',
  searchBorder: 'rgba(0,112,192,0.15)',
  inputColor: '#1a2a4a',
  inputPlaceholder: '#8aa0c0',
  heading: '#0d1f3c',
  textMuted: '#4a6080',
  breadcrumb: '#8aa0c0',
  breadcrumbActive: '#4a6080',
  theadBg: 'rgba(0,112,192,0.04)',
  theadBorder: 'rgba(0,112,192,0.1)',
  theadColor: '#6a86a8',
  rowBorder: 'rgba(0,112,192,0.06)',
  rowHoverBg: 'rgba(0,112,192,0.03)',
  rowBannedBg: 'rgba(239,68,68,0.03)',
  rowBannedHover: 'rgba(239,68,68,0.06)',
  cellColor: '#0d1f3c',
  cellMuted: '#4a6080',
  pillActive: 'linear-gradient(135deg,#0070c0,#00b4d8)',
  pillInactiveBg: 'rgba(0,112,192,0.07)',
  pillInactiveColor: '#6a86a8',
  pillInactiveHoverBg: 'rgba(0,112,192,0.12)',
  pillInactiveHoverColor: '#0070c0',
  footerBg: 'rgba(0,112,192,0.02)',
  footerBorder: 'rgba(0,112,192,0.08)',
  footerColor: '#8aa0c0',
  accent: '#0070c0',
  accentGlow: '#0070c0',
  bannedBadgeBg: '#fff',
  orbColors: ['#0070c018', '#00b4d810', '#0096c70c'],
  gridLine: 'rgba(0,112,192,.02)',
};

const AdminUsers = () => {
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [banningId, setBanningId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', confirmText: '', confirmColor: 'blue', icon: '', onConfirm: null });

  const openModal = (config) => setModal({ isOpen: true, ...config });
  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-40px) scale(1.06);} 66%{transform:translate(-20px,25px) scale(0.96);} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
    @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
    .au-table-wrap { background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:16px; overflow:hidden; animation:fadeUp 0.5s ease; }
    .au-row { transition:background 0.15s; }
    .au-row:hover td { background:${t.rowHoverBg}; }
    .au-row.banned { background:${t.rowBannedBg}; }
    .au-row.banned:hover td { background:${t.rowBannedHover} !important; }
    .pill-btn { padding:0.4rem 1rem; border-radius:50px; font-size:0.82rem; font-weight:700; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
    .pill-btn.active { background:${t.pillActive}; color:#fff; }
    .pill-btn.inactive { background:${t.pillInactiveBg}; color:${t.pillInactiveColor}; }
    .pill-btn.inactive:hover { background:${t.pillInactiveHoverBg}; color:${t.pillInactiveHoverColor}; }
    .action-btn { border-radius:8px; padding:0.4rem 0.85rem; cursor:pointer; display:flex; align-items:center; gap:0.35rem; font-size:0.8rem; font-weight:700; transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif; border:1px solid transparent; text-decoration:none; }
    .btn-view { background:rgba(14,165,233,0.12); color:#38bdf8; border-color:rgba(14,165,233,0.2); }
    .btn-view:hover { background:rgba(14,165,233,0.22); }
    .btn-ban { background:rgba(239,68,68,0.1); color:#f87171; border-color:rgba(239,68,68,0.2); }
    .btn-ban:hover { background:rgba(239,68,68,0.2); }
    .btn-unban { background:rgba(34,197,94,0.1); color:#4ade80; border-color:rgba(34,197,94,0.2); }
    .btn-unban:hover { background:rgba(34,197,94,0.2); }
    .btn-promote { background:rgba(251,191,36,0.1); color:#fbbf24; border-color:rgba(251,191,36,0.2); }
    .btn-promote:hover { background:rgba(251,191,36,0.2); }
    .btn-demote { background:rgba(234,88,12,0.1); color:#fb923c; border-color:rgba(234,88,12,0.2); }
    .btn-demote:hover { background:rgba(234,88,12,0.2); }
    .btn-delete { background:rgba(225,29,72,0.1); color:#fb7185; border-color:rgba(225,29,72,0.2); }
    .btn-delete:hover { background:rgba(225,29,72,0.2); }
    .filter-input { border:none; outline:none; flex:1; font-size:0.9rem; background:transparent; color:${t.inputColor}; font-family:'Plus Jakarta Sans',sans-serif; }
    .filter-input::placeholder { color:${t.inputPlaceholder}; }
  `;

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

  const confirmDelete = (id, name) => openModal({ title: 'Delete User', icon: '🗑️', confirmColor: 'red', confirmText: 'Yes, Delete', message: `Are you sure you want to delete "${name}" and all their listings? This cannot be undone.`, onConfirm: () => doDelete(id) });
  const doDelete = async (id) => {
    closeModal(); setDeletingId(id);
    try { await api.delete(`/admin/users/${id}`); setUsers(prev => prev.filter(u => u._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const confirmToggleAdmin = (id, name, currentlyAdmin) => openModal({
    title: currentlyAdmin ? 'Remove Admin Access' : 'Grant Admin Access', icon: currentlyAdmin ? '⬇️' : '⬆️',
    confirmColor: currentlyAdmin ? 'red' : 'blue', confirmText: currentlyAdmin ? 'Yes, Demote' : 'Yes, Promote',
    message: currentlyAdmin ? `Remove admin privileges from "${name}"?` : `Grant admin access to "${name}"?`,
    onConfirm: () => doToggleAdmin(id),
  });
  const doToggleAdmin = async (id) => {
    closeModal(); setTogglingId(id);
    try { const res = await api.patch(`/admin/users/${id}/toggle-admin`); setUsers(prev => prev.map(u => u._id === id ? { ...u, isAdmin: res.data.isAdmin } : u)); }
    catch { alert('Failed to update admin status'); }
    finally { setTogglingId(null); }
  };

  const confirmToggleBan = (id, name, currentlyBanned) => openModal({
    title: currentlyBanned ? 'Unban User' : 'Ban User', icon: currentlyBanned ? '✅' : '🚫',
    confirmColor: currentlyBanned ? 'blue' : 'red', confirmText: currentlyBanned ? 'Yes, Unban' : 'Yes, Ban',
    message: currentlyBanned ? `Unban "${name}"? They will regain access.` : `Ban "${name}"? They will not be able to post or edit listings.`,
    onConfirm: () => doToggleBan(id),
  });
  const doToggleBan = async (id) => {
    closeModal(); setBanningId(id);
    try { const res = await api.patch(`/admin/users/${id}/toggle-ban`); setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: res.data.isBanned } : u)); }
    catch { alert('Failed to update ban status'); }
    finally { setBanningId(null); }
  };

  const adminCount = users.filter(u => u.isAdmin).length;
  const userCount = users.filter(u => !u.isAdmin).length;
  const bannedCount = users.filter(u => u.isBanned).length;

  return (
    <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style key={isDark ? 'dark' : 'light'}>{CSS}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: t.orbColors[0], top: '-200px', left: '-150px', delay: '0s' },
          { w: 500, h: 500, color: t.orbColors[1], top: '40%', right: '-150px', delay: '-6s' },
          { w: 350, h: 350, color: t.orbColors[2], bottom: '-100px', left: '30%', delay: '-11s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle,${o.color},transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: 'orbFloat 14s ease-in-out infinite', animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <ConfirmModal isOpen={modal.isOpen} title={modal.title} message={modal.message} confirmText={modal.confirmText} confirmColor={modal.confirmColor} icon={modal.icon} onConfirm={modal.onConfirm} onCancel={closeModal} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ fontSize: '0.8rem', color: t.breadcrumb, marginBottom: '0.5rem' }}>
            <Link to="/admin/dashboard" style={{ color: t.breadcrumb, textDecoration: 'none' }}>Dashboard</Link>
            {' / '}<span style={{ color: t.breadcrumbActive }}>Users</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,112,192,0.08)', border: `1px solid ${isDark ? 'rgba(0,212,170,0.25)' : 'rgba(0,112,192,0.2)'}`, borderRadius: 50, padding: '0.3rem 0.9rem', marginBottom: '0.8rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, boxShadow: `0 0 6px ${t.accentGlow}`, display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: t.heading, margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiUsers size={22} color={t.accent} /> Manage Users
          </h1>
          <p style={{ color: t.textMuted, margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
            {users.length} total accounts
            {bannedCount > 0 && <span style={{ color: '#f87171', marginLeft: '0.6rem' }}>· 🚫 {bannedCount} banned</span>}
          </p>
        </div>
      </div>

      <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Filter Bar */}
        <div style={{ background: t.filterBg, border: `1px solid ${t.filterBorder}`, borderRadius: 16, padding: '1rem 1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 200, background: t.searchBg, borderRadius: 10, padding: '0.5rem 1rem', border: `1px solid ${t.searchBorder}` }}>
            <FiSearch color={t.accent} size={15} />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="filter-input" />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: `All ${users.length}` },
              { key: 'admins', label: `Admins ${adminCount}` },
              { key: 'users', label: `Users ${userCount}` },
              { key: 'banned', label: `🚫 Banned ${bannedCount}` },
            ].map(f => (
              <button key={f.key} onClick={() => setRoleFilter(f.key)} className={`pill-btn ${roleFilter === f.key ? 'active' : 'inactive'}`}>{f.label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: t.accent }}>
            <div className="spinner-border" style={{ color: t.accent }} />
          </div>
        ) : (
          <div className="au-table-wrap">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.theadBorder}` }}>
                    {['User', 'Email', 'Role', 'Status', 'Listings', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '1rem 1.2rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: t.theadColor, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} className={`au-row${u.isBanned ? ' banned' : ''}`} style={{ borderBottom: `1px solid ${t.rowBorder}` }}>
                      {/* User */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ position: 'relative' }}>
                            <UserAvatar name={u.name} size={40} profilePhoto={u.avatar} />
                            {u.isBanned && (
                              <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#ef4444', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.bannedBadgeBg}` }}>
                                <FiSlash size={7} color="#fff" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: u.isBanned ? t.textMuted : t.cellColor }}>{u.name}</div>
                            {u.isAdmin && <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>⚡ Admin</div>}
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td style={{ padding: '1rem 1.2rem', fontSize: '0.875rem', color: t.cellMuted }}>{u.email}</td>
                      {/* Role */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <span style={{ background: u.isAdmin ? 'rgba(251,191,36,0.12)' : (isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,112,192,0.08)'), color: u.isAdmin ? '#fbbf24' : t.accent, border: `1px solid ${u.isAdmin ? 'rgba(251,191,36,0.25)' : (isDark ? 'rgba(0,212,170,0.2)' : 'rgba(0,112,192,0.2)')}`, padding: '0.28rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                          {u.isAdmin ? <><FiShield size={11} />Admin</> : <><FiUser size={11} />User</>}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        {u.isBanned ? (
                          <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', padding: '0.28rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                            <FiSlash size={11} /> Banned
                          </span>
                        ) : (
                          <span style={{ background: isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,112,192,0.08)', color: t.accent, border: `1px solid ${isDark ? 'rgba(0,212,170,0.2)' : 'rgba(0,112,192,0.2)'}`, padding: '0.28rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                            ✓ Active
                          </span>
                        )}
                      </td>
                      {/* Listings */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <span style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                          🏠 {u.boardingCount}
                        </span>
                      </td>
                      {/* Joined */}
                      <td style={{ padding: '1rem 1.2rem', fontSize: '0.82rem', color: t.cellMuted, whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Link to={`/admin/users/${u._id}`} className="action-btn btn-view">
                            <FiEye size={13} />View
                          </Link>
                          {!u.isAdmin && (
                            <button onClick={() => confirmToggleBan(u._id, u.name, u.isBanned)} disabled={banningId === u._id} className={`action-btn ${u.isBanned ? 'btn-unban' : 'btn-ban'}`}>
                              {banningId === u._id ? <span className="spinner-border spinner-border-sm" /> : <><FiSlash size={13} />{u.isBanned ? 'Unban' : 'Ban'}</>}
                            </button>
                          )}
                          <button onClick={() => confirmToggleAdmin(u._id, u.name, u.isAdmin)} disabled={togglingId === u._id} className={`action-btn ${u.isAdmin ? 'btn-demote' : 'btn-promote'}`}>
                            {togglingId === u._id ? <span className="spinner-border spinner-border-sm" /> : <><FiShield size={13} />{u.isAdmin ? 'Demote' : 'Promote'}</>}
                          </button>
                          {!u.isAdmin && (
                            <button onClick={() => confirmDelete(u._id, u.name)} disabled={deletingId === u._id} className="action-btn btn-delete">
                              {deletingId === u._id ? <span className="spinner-border spinner-border-sm" /> : <><FiTrash2 size={13} />Delete</>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: t.textMuted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                  <p style={{ margin: 0 }}>No users found.</p>
                </div>
              )}
            </div>
            {filtered.length > 0 && (
              <div style={{ padding: '0.9rem 1.5rem', background: t.footerBg, borderTop: `1px solid ${t.footerBorder}`, fontSize: '0.82rem', color: t.footerColor, textAlign: 'center' }}>
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