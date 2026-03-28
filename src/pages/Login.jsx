// ============================================
// Login Page
// ============================================
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      <div className="auth-card">
        <span className="auth-logo">🏠 Boarding<span>Finder</span></span>
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your account to continue</p>

        {error && (
          <div className="alert-custom alert-danger-custom mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRight:'none' }}>
                <FiMail color="#94a3b8" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ borderLeft:'none' }}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRight:'none' }}>
                <FiLock color="#94a3b8" />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                style={{ borderLeft:'none' }}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
            ) : (
              <><FiLogIn />Sign In</>
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize:'0.9rem', color:'#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#2563eb', fontWeight:600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;