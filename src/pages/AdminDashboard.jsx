import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi';
import api from '../api/axios';
import UserAvatar from '../components/UserAvatar';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
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
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

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
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    animation: fadeUp 0.5s ease both;
    transition: all 0.25s ease;
  }
  .glass-card:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(0,212,170,0.2);
  }
  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: 1.4rem;
    display: flex; align-items: center; gap: 1rem;
    animation: fadeUp 0.5s ease both;
    transition: all 0.25s ease;
  }
  .stat-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(0,212,170,0.3);
    box-shadow: 0 8px 32px rgba(0,212,170,0.08);
    transform: translateY(-2px);
  }
  .glass-table tr:hover td { background: rgba(255,255,255,0.04) !important; }
  .user-link-card {
    display: flex; align-items: center; gap: 0.8rem;
    padding: 0.9rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    transition: all 0.2s; cursor: pointer;
    text-decoration: none;
  }
  .user-link-card:hover {
    border-color: rgba(0,212,170,0.3);
    background: rgba(0,212,170,0.05);
  }
  .bar-fill {
    height: 100%; border-radius: 4px;
    background: linear-gradient(90deg,#00d4aa,#0ea5e9);
    transition: width 0.6s ease;
  }
`;

const StatCard = ({ icon, label, value, gradient, sub, delay = '0s' }) => (
  <div className="stat-card" style={{ animationDelay: delay }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#dce9ff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.45)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(220,233,255,0.3)', marginTop: '0.1rem' }}>{sub}</div>}
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060f2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: '#00d4aa' }} />
    </div>
  );

  const typeGradients = ['#0ea5e9', '#00d4aa', '#fbbf24', '#a78bfa', '#f472b6'];

  return (
    <div style={{ minHeight: '100vh', background: '#060f2a', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 700, h: 700, color: '#0ea5e928', top: '-220px', left: '-180px', delay: '0s' },
          { w: 550, h: 550, color: '#06b6d425', top: '35%', right: '-170px', delay: '-5s' },
          { w: 400, h: 400, color: '#00d4aa20', bottom: '-120px', left: '25%', delay: '-10s' },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', width: o.w, height: o.h,
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom,
            animation: 'orbFloat 14s ease-in-out infinite', animationDelay: o.delay,
          }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 0 2rem', overflow: 'hidden' }}>
        <ParticleCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 50, padding: '0.3rem 0.9rem', marginBottom: '0.8rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 6px #00d4aa', display: 'inline-block', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00d4aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Overview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiShield size={22} color="#0ea5e9" />
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#dce9ff', margin: 0 }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: 'rgba(220,233,255,0.45)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>Overview of your Boarding Finder platform</p>
        </div>
      </div>

      <div className="container pb-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {[
            { icon: <FiUsers size={22} color="#38bdf8" />, label: 'Total Users', value: stats.totalUsers, gradient: 'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(6,182,212,0.2))', delay: '0s' },
            { icon: <FiHome size={22} color="#34d399" />, label: 'Total Listings', value: stats.totalBoardings, gradient: 'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(0,212,170,0.2))', delay: '0.1s' },
            { icon: <FiShield size={22} color="#a78bfa" />, label: 'Admins', value: stats.totalAdmins, gradient: 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(139,92,246,0.2))', delay: '0.2s' },
            { icon: <FiDollarSign size={22} color="#fbbf24" />, label: 'Avg Price', value: `LKR ${Math.round(stats.avgPrice).toLocaleString()}`, gradient: 'linear-gradient(135deg,rgba(251,191,36,0.3),rgba(217,119,6,0.2))', sub: 'per month', delay: '0.3s' },
          ].map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <StatCard {...s} />
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Room type breakdown */}
          <div className="col-md-4">
            <div className="glass-card" style={{ padding: '1.5rem', height: '100%', animationDelay: '0.1s' }}>
              <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, marginBottom: '1.4rem', color: '#dce9ff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <FiTrendingUp size={16} color="#0ea5e9" /> Listings by Type
              </h5>
              {stats.boardingsByType.map((t, i) => {
                const pct = Math.round((t.count / stats.totalBoardings) * 100);
                return (
                  <div key={i} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(220,233,255,0.8)' }}>{t._id || 'Other'}</span>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.4)' }}>{t.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent boardings */}
          <div className="col-md-8">
            <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <FiHome size={16} color="#0ea5e9" /> Recent Listings
                </h5>
                <Link to="/admin/boardings" style={{ fontSize: '0.82rem', color: '#00d4aa', fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Title', 'Location', 'Price', 'Owner', 'Type'].map(h => (
                        <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(220,233,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBoardings.map(b => (
                      <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 600, color: '#dce9ff', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: 'rgba(220,233,255,0.5)' }}>{b.location}</td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.875rem', fontWeight: 700 }}>
                          <span style={{ background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LKR {b.price.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '0.85rem 0.8rem', fontSize: '0.82rem', color: 'rgba(220,233,255,0.5)' }}>{b.owner?.name}</td>
                        <td style={{ padding: '0.85rem 0.8rem' }}>
                          <span style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{b.roomType}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="col-12">
            <div className="glass-card" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <FiUsers size={16} color="#0ea5e9" /> Recent Users
                </h5>
                <Link to="/admin/users" style={{ fontSize: '0.82rem', color: '#00d4aa', fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div className="row g-3">
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="col-12 col-md-6 col-lg-4">
                    <Link to={`/admin/users/${u._id}`} className="user-link-card">
                      <UserAvatar name={u.name} size={44} profilePhoto={u.avatar} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#dce9ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                      <span style={{ background: u.isAdmin ? 'rgba(251,191,36,0.15)' : 'rgba(0,212,170,0.12)', color: u.isAdmin ? '#fbbf24' : '#00d4aa', padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, border: `1px solid ${u.isAdmin ? 'rgba(251,191,36,0.3)' : 'rgba(0,212,170,0.25)'}` }}>
                        {u.isAdmin ? '⚡ Admin' : 'User'}
                      </span>
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