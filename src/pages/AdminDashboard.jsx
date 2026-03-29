import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi';
import api from '../api/axios';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

// ── Reusable avatar ───────────────────────────────────────
const UserAvatar = ({ user, size = 40 }) => {
  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarUrl = user?.avatarUrl || (user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null);

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', border: '2px solid #e2e8f0',
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
        <span style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.33, fontFamily: 'var(--font-heading)' }}>
          {initials}
        </span>
      )}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────
const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '2.5rem 0', marginBottom: '2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
            <FiShield size={22} color="#60a5fa" />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Admin Dashboard
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.95rem' }}>
            Overview of your Boarding Finder platform
          </p>
        </div>
      </div>

      <div className="container pb-5">

        {/* ── Stat Cards ── */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard icon={<FiUsers size={22} color="#2563eb" />} label="Total Users"    value={stats.totalUsers}    color="#dbeafe" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiHome size={22} color="#059669" />}  label="Total Listings" value={stats.totalBoardings} color="#d1fae5" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiShield size={22} color="#7c3aed" />} label="Admins"        value={stats.totalAdmins}    color="#ede9fe" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiDollarSign size={22} color="#d97706" />} label="Avg Price"
              value={`LKR ${Math.round(stats.avgPrice).toLocaleString()}`}
              color="#fef3c7" sub="per month" />
          </div>
        </div>

        <div className="row g-4">

          {/* ── Room type breakdown ── */}
          <div className="col-md-4">
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0', height: '100%' }}>
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiTrendingUp size={16} color="#2563eb" /> Listings by Type
              </h5>
              {stats.boardingsByType.map((t, i) => {
                const colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777'];
                const pct    = Math.round((t.count / stats.totalBoardings) * 100);
                return (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{t._id || 'Other'}</span>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Recent listings ── */}
          <div className="col-md-8">
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiHome size={16} color="#2563eb" /> Recent Listings
                </h5>
                <Link to="/admin/boardings">
                  <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>View all →</span>
                </Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      {['Title', 'Location', 'Price', 'Owner', 'Type'].map(h => (
                        <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBoardings.map(b => (
                      <tr key={b._id}
                        style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '0.8rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.title}
                        </td>
                        <td style={{ padding: '0.8rem', fontSize: '0.82rem', color: '#64748b' }}>{b.location}</td>
                        <td style={{ padding: '0.8rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                          LKR {b.price.toLocaleString()}
                        </td>
                        {/* Owner — avatar + name */}
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UserAvatar user={b.owner} size={28} />
                            <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                              {b.owner?.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                            {b.roomType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Recent Users ── */}
          <div className="col-12">
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 24px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiUsers size={16} color="#2563eb" /> Recent Users
                </h5>
                <Link to="/admin/users">
                  <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>View all →</span>
                </Link>
              </div>

              <div className="row g-3">
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="col-12 col-md-6 col-lg-4">
                    <Link to={`/admin/users/${u._id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.85rem',
                        padding: '0.9rem 1rem', borderRadius: 12,
                        border: '1px solid #e2e8f0', background: '#f8fafc',
                        transition: 'box-shadow 0.15s, border-color 0.15s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.1)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>

                        {/* ── Real photo or initials ── */}
                        <UserAvatar user={u} size={44} />

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.email}
                          </div>
                          {/* Show "Has photo" hint when avatar exists */}
                          {u.avatar && (
                            <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '0.15rem', fontWeight: 600 }}>
                              📷 Profile photo
                            </div>
                          )}
                        </div>

                        <span style={{
                          background: u.isAdmin ? '#ede9fe' : '#f0fdf4',
                          color:      u.isAdmin ? '#7c3aed' : '#059669',
                          padding: '0.2rem 0.6rem', borderRadius: 20,
                          fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                        }}>
                          {u.isAdmin ? '⚡ Admin' : '👤 User'}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;