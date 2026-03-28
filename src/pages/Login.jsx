import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'#fff',fontWeight:700,marginBottom:'2rem'}}>
            🏠 BoardingFinder
          </div>
          <h2>Find your home<br/>away from home</h2>
          <p style={{marginTop:'1rem'}}>Thousands of verified boarding places near universities across Sri Lanka, curated just for students.</p>
        </div>
        <div className="auth-left-features">
          {[
            { icon: '🏠', text: '500+ verified listings' },
            { icon: '📍', text: 'Map-based search' },
            { icon: '❤️', text: 'Save your favourites' },
            { icon: '🔒', text: 'Safe & secure platform' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">🏠 Boarding<span>Finder</span></div>
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue your search</p>

          {error && <div className="alert-custom alert-danger-custom mb-3">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text" style={{background:'var(--cream)',border:'1.5px solid var(--sand)',borderRight:'none',borderRadius:'12px 0 0 12px'}}>
                  <FiMail color="var(--muted)" size={15} />
                </span>
                <input type="email" name="email" className="form-control" style={{borderLeft:'none',borderRadius:'0 12px 12px 0'}}
                  placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{background:'var(--cream)',border:'1.5px solid var(--sand)',borderRight:'none',borderRadius:'12px 0 0 12px'}}>
                  <FiLock color="var(--muted)" size={15} />
                </span>
                <input type="password" name="password" className="form-control" style={{borderLeft:'none',borderRadius:'0 12px 12px 0'}}
                  placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}
              style={{padding:'0.8rem',fontSize:'0.95rem',borderRadius:'12px'}}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : <><FiLogIn />Sign In</>}
            </button>
          </form>

          <div style={{textAlign:'center',marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid var(--parchment)'}}>
            <span style={{fontSize:'0.88rem',color:'var(--muted)'}}>Don't have an account? </span>
            <Link to="/register" style={{color:'var(--terracotta)',fontWeight:600,fontSize:'0.88rem'}}>Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;