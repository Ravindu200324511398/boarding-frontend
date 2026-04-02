import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi';
import api from '../api/axios';
import UserAvatar from '../components/UserAvatar';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'1rem' }}>
    <div style={{ width:52, height:52, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.9rem', fontWeight:800, color:'#0f172a', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'0.82rem', color:'#64748b', marginTop:'0.2rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize:'0.78rem', color:'#94a3b8', marginTop:'0.15rem' }}>{sub}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding:'2.5rem 0', marginBottom:'2rem' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'0.4rem' }}>
            <FiShield size={22} color="#60a5fa" />
            <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, color:'#fff', margin:0 }}>Admin Dashboard</h1>
          </div>
          <p style={{ color:'rgba(255,255,255,0.5)', margin:0, fontSize:'0.9rem' }}>Overview of your Boarding Finder platform</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard icon={<FiUsers size={22} color="#2563eb" />} label="Total Users" value={stats.totalUsers} color="#dbeafe" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiHome size={22} color="#059669" />} label="Total Listings" value={stats.totalBoardings} color="#d1fae5" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiShield size={22} color="#7c3aed" />} label="Admins" value={stats.totalAdmins} color="#ede9fe" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard icon={<FiDollarSign size={22} color="#d97706" />} label="Avg Price" value={`LKR ${Math.round(stats.avgPrice).toLocaleString()}`} color="#fef3c7" sub="per month" />
          </div>
        </div>

        <div className="row g-4">
          {/* Room type breakdown */}
          <div className="col-md-4">
            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', height:'100%' }}>
              <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'1.2rem', color:'#0f172a', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <FiTrendingUp size={16} color="#2563eb" /> Listings by Type
              </h5>
              {stats.boardingsByType.map((t, i) => {
                const colors = ['#2563eb','#059669','#d97706','#7c3aed','#db2777'];
                const pct = Math.round((t.count / stats.totalBoardings) * 100);
                return (
                  <div key={i} style={{ marginBottom:'0.8rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                      <span style={{ fontSize:'0.875rem', fontWeight:600, color:'#0f172a' }}>{t._id || 'Other'}</span>
                      <span style={{ fontSize:'0.875rem', color:'#64748b' }}>{t.count} ({pct}%)</span>
                    </div>
                    <div style={{ height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:colors[i % colors.length], borderRadius:4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent boardings */}
          <div className="col-md-8">
            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', margin:0, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <FiHome size={16} color="#2563eb" /> Recent Listings
                </h5>
                <Link to="/admin/boardings"><span style={{ fontSize:'0.82rem', color:'#2563eb', fontWeight:600 }}>View all →</span></Link>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid #f1f5f9' }}>
                      {['Title','Location','Price','Owner','Type'].map(h => (
                        <th key={h} style={{ padding:'0.6rem 0.8rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBoardings.map((b) => (
                      <tr key={b._id} style={{ borderBottom:'1px solid #f8fafc' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'0.8rem', fontSize:'0.875rem', fontWeight:600, color:'#0f172a', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</td>
                        <td style={{ padding:'0.8rem', fontSize:'0.82rem', color:'#64748b' }}>{b.location}</td>
                        <td style={{ padding:'0.8rem', fontSize:'0.875rem', fontWeight:700, color:'#2563eb' }}>LKR {b.price.toLocaleString()}</td>
                        <td style={{ padding:'0.8rem', fontSize:'0.82rem', color:'#64748b' }}>{b.owner?.name}</td>
                        <td style={{ padding:'0.8rem' }}><span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.75rem', fontWeight:600 }}>{b.roomType}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent users — NOW WITH UserAvatar */}
          <div className="col-12">
            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', margin:0, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <FiUsers size={16} color="#2563eb" /> Recent Users
                </h5>
                <Link to="/admin/users"><span style={{ fontSize:'0.82rem', color:'#2563eb', fontWeight:600 }}>View all →</span></Link>
              </div>
              <div className="row g-3">
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="col-12 col-md-6 col-lg-4">
                    <Link to={`/admin/users/${u._id}`} style={{ textDecoration:'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.9rem', borderRadius:12, border:'1px solid #e2e8f0', background:'#f8fafc', transition:'all 0.15s', cursor:'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='#bfdbfe'; e.currentTarget.style.background='#eff6ff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#f8fafc'; }}>
                        <UserAvatar name={u.name} size={44} profilePhoto={u.avatar} />
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</div>
                          <div style={{ fontSize:'0.78rem', color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                        </div>
                        <span style={{ background: u.isAdmin ? '#fef3c7' : '#f0fdf4', color: u.isAdmin ? '#d97706' : '#059669', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>
                          {u.isAdmin ? '⚡ Admin' : 'User'}
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
