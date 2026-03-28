import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const gs = { background:'var(--cream)', border:'1.5px solid var(--sand)', borderRight:'none', borderRadius:'12px 0 0 12px' };
  const gi = { borderLeft:'none', borderRadius:'0 12px 12px 0' };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'#fff',fontWeight:700,marginBottom:'2rem'}}>🏠 BoardingFinder</div>
          <h2>Join thousands of students finding great boardings</h2>
          <p style={{marginTop:'1rem'}}>Create a free account and start browsing verified boarding places near your university today.</p>
        </div>
        <div className="auth-left-features">
          {[
            { icon: '✅', text: 'Free to register & browse' },
            { icon: '🏠', text: 'List your own boarding' },
            { icon: '🗺️', text: 'Map view of all locations' },
            { icon: '⭐', text: 'Save your favourite places' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">🏠 Boarding<span>Finder</span></div>
          <h2>Create account</h2>
          <p className="subtitle">It's free and takes less than a minute</p>

          {error && <div className="alert-custom alert-danger-custom mb-3">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text" style={gs}><FiUser color="var(--muted)" size={15} /></span>
                <input type="text" name="name" className="form-control" style={gi}
                  placeholder="John Perera" value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text" style={gs}><FiMail color="var(--muted)" size={15} /></span>
                <input type="email" name="email" className="form-control" style={gi}
                  placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" style={gs}><FiLock color="var(--muted)" size={15} /></span>
                <input type="password" name="password" className="form-control" style={gi}
                  placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text" style={gs}><FiLock color="var(--muted)" size={15} /></span>
                <input type="password" name="confirmPassword" className="form-control" style={gi}
                  placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}
              style={{padding:'0.8rem',fontSize:'0.95rem',borderRadius:'12px'}}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : <><FiUserPlus />Create Account</>}
            </button>
          </form>

          <div style={{textAlign:'center',marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid var(--parchment)'}}>
            <span style={{fontSize:'0.88rem',color:'var(--muted)'}}>Already have an account? </span>
            <Link to="/login" style={{color:'var(--terracotta)',fontWeight:600,fontSize:'0.88rem'}}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;