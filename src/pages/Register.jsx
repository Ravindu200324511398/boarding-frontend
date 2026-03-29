// ============================================
// Register Page
// ============================================
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = {
    groupText: { background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRight:'none' },
    input: { borderLeft:'none' }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-logo">🏠 Boarding<span>Finder</span></span>
        <h2>Create account</h2>
        <p className="subtitle">Join thousands of students finding great boardings</p>

        {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text" style={inputGroupStyle.groupText}><FiUser color="#94a3b8" /></span>
              <input type="text" name="name" className="form-control" style={inputGroupStyle.input}
                placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text" style={inputGroupStyle.groupText}><FiMail color="#94a3b8" /></span>
              <input type="email" name="email" className="form-control" style={inputGroupStyle.input}
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={inputGroupStyle.groupText}><FiLock color="#94a3b8" /></span>
              <input type="password" name="password" className="form-control" style={inputGroupStyle.input}
                placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text" style={inputGroupStyle.groupText}><FiLock color="#94a3b8" /></span>
              <input type="password" name="confirmPassword" className="form-control" style={inputGroupStyle.input}
                placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
            ) : (
              <><FiUserPlus />Create Account</>
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize:'0.9rem', color:'#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#2563eb', fontWeight:600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;