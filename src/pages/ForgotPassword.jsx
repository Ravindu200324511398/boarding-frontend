import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle, FiCopy } from 'react-icons/fi';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetUrl(res.data.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 460, boxShadow: '0 8px 40px rgba(15,23,42,0.1)' }}>
        
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <FiArrowLeft size={14} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FiMail size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Forgot Password?</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Enter your account email and we'll generate a reset link for you.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.875rem', marginBottom: '1.2rem', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        {!resetUrl ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
                onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <FiMail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@email.com"
                  required
                  style={{ border: 'none', outline: 'none', flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-body)', color: '#0f172a', background: 'transparent' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Generating...</> : <><FiSend size={15} />Send Reset Link</>}
            </button>
          </form>
        ) : (
          /* Success state */
          <div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
              <FiCheckCircle size={36} color="#059669" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '0.3rem' }}>Reset link generated!</div>
              <p style={{ fontSize: '0.82rem', color: '#047857', margin: 0 }}>
                In production this would be sent to <strong>{email}</strong>. For development, use the link below:
              </p>
            </div>

            {/* Dev-friendly: show reset link */}
            <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔗 Your Reset Link</div>
              <div style={{ fontSize: '0.82rem', color: '#0f172a', wordBreak: 'break-all', lineHeight: 1.6, marginBottom: '0.7rem' }}>{resetUrl}</div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleCopy}
                  style={{ flex: 1, background: copied ? '#059669' : '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'background 0.2s' }}>
                  <FiCopy size={13} />{copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={resetUrl} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{ width: '100%', background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.55rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    Open Link →
                  </button>
                </a>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
              Link expires in 1 hour. <button onClick={() => setResetUrl('')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Try again</button>
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '1.5rem', marginBottom: 0 }}>
          Remembered it? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
