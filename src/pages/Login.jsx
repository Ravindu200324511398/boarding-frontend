import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(15,23,42,0.1)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏠</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Sign in to your Boarding Finder account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.875rem', marginBottom: '1.2rem', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
              onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                <FiMail size={16} />
              </span>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="yourname@email.com" required
                style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }} />
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
              onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                <FiLock size={16} />
              </span>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required
                style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: '#94a3b8' }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.2rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : <><FiLogIn size={15} />Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', marginTop: '1.5rem', marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
