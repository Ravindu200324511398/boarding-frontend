import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      if (!res.data.user.isAdmin) {
        setError('Access denied. Admin accounts only.');
        setLoading(false); return;
      }
      login(res.data.user, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'2.5rem 2rem', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        {/* Icon */}
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ width:64, height:64, background:'linear-gradient(135deg, #1a1a2e, #2563eb)', borderRadius:16, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
            <FiShield size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'1.6rem', fontWeight:800, color:'#0f172a', marginBottom:'0.3rem' }}>Admin Portal</h2>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>Boarding Finder Administration</p>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', color:'#b91c1c', padding:'0.8rem 1rem', borderRadius:10, fontSize:'0.875rem', marginBottom:'1.2rem', border:'1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1rem' }}>
            <label className="form-label">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRight:'none' }}><FiMail color="#94a3b8" /></span>
              <input type="email" className="form-control" style={{ borderLeft:'none' }} placeholder="admin@boardingfinder.com"
                value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
            </div>
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRight:'none' }}><FiLock color="#94a3b8" /></span>
              <input type="password" className="form-control" style={{ borderLeft:'none' }} placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
            </div>
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'linear-gradient(135deg, #1a1a2e, #2563eb)', color:'#fff', border:'none', borderRadius:10, padding:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : <><FiShield />Access Admin Panel</>}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <a href="/" style={{ fontSize:'0.85rem', color:'#64748b' }}>← Back to main site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
