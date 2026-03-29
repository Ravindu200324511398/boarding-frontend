import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = () => {
    if (!password) return { level: 0, label: '', color: '#e2e8f0' };
    if (password.length < 6) return { level: 1, label: 'Too short', color: '#ef4444' };
    if (password.length < 8) return { level: 2, label: 'Weak', color: '#f59e0b' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, label: 'Strong', color: '#059669' };
    return { level: 3, label: 'Good', color: '#2563eb' };
  };
  const str = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      login(res.data.user, res.data.token);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '3rem 2rem', maxWidth: 420, width: '100%', boxShadow: '0 8px 40px rgba(15,23,42,0.1)' }}>
        <FiCheckCircle size={64} color="#059669" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Password Reset!</h2>
        <p style={{ color: '#64748b' }}>Your password has been updated. Redirecting you home...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(15,23,42,0.1)' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FiLock size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Set New Password</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Choose a strong password for your account.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.875rem', marginBottom: '1.2rem', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>New Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
              onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                <FiLock size={16} />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ background: 'none', border: 'none', padding: '0 0.85rem', cursor: 'pointer', color: '#94a3b8' }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {/* Strength bar */}
            {password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${str.level * 25}%`, background: str.color, transition: 'width 0.3s, background 0.3s', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: str.color, fontWeight: 600, marginTop: '0.25rem' }}>{str.label}</div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Confirm Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${confirm && confirm !== password ? '#ef4444' : '#e2e8f0'}`, borderRadius: 10, overflow: 'hidden' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
              onBlurCapture={e => e.currentTarget.style.borderColor = confirm && confirm !== password ? '#ef4444' : '#e2e8f0'}>
              <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                <FiLock size={16} />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
                style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', background: 'transparent' }}
              />
            </div>
            {confirm && confirm !== password && (
              <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.3rem' }}>⚠ Passwords don't match</div>
            )}
            {confirm && confirm === password && (
              <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.3rem' }}>✓ Passwords match</div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</> : <><FiLock size={15} />Reset Password</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '1.5rem', marginBottom: 0 }}>
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
