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
    <div style={{ minHeight:'100vh', display:'flex', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0;    }
          10%  { opacity: 0.18; }
          90%  { opacity: 0.07; }
          100% { transform: translateY(-15vh) rotate(540deg); opacity: 0;    }
        }
        @keyframes slideInRight {
          from { opacity:0; transform: translateX(50px); }
          to   { opacity:1; transform: translateX(0);    }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0);    }
        }
        @keyframes orb {
          0%,100% { transform: scale(1)   translateY(0);   opacity:.5; }
          50%     { transform: scale(1.1) translateY(-20px); opacity:.8; }
        }
        .lf-input-wrap { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; transition:all .2s; background:#f8fafc; }
        .lf-input-wrap:focus-within { border-color:#f97316 !important; background:#fff !important; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
        .lf-input { border:none; outline:none; flex:1; padding:.8rem 1rem; font-size:.92rem; background:transparent; color:#0f172a; font-family:inherit; }
        .lf-icon  { padding:0 .9rem; color:#f97316; align-self:stretch; display:flex; align-items:center; border-right:1px solid #e2e8f0; flex-shrink:0; }
        .lf-btn-primary { width:100%; background:linear-gradient(135deg,#ea580c,#f97316); color:#fff; border:none; border-radius:12px; padding:.9rem; font-weight:700; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem; transition:all .25s; box-shadow:0 4px 15px rgba(249,115,22,.3); }
        .lf-btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,.45); }
        .lf-btn-primary:disabled { opacity:.7; cursor:not-allowed; }
        .lf-btn-ghost { width:100%; background:transparent; color:#0f172a; border:2px solid #e2e8f0; border-radius:12px; padding:.8rem; font-weight:700; font-size:.92rem; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:.5rem; font-family:inherit; }
        .lf-btn-ghost:hover { border-color:#f97316; color:#f97316; }
        .lf-float { position:absolute; animation:floatUp linear infinite; pointer-events:none; user-select:none; font-size:2rem; }
        .lf-card { animation: slideInRight .5s ease forwards; }
        .lf-form { animation: fadeUp .65s ease .1s both; }
      `}</style>

      {/* ═══ LEFT — decorative panel ═══ */}
      <div className="d-none d-lg-flex flex-column align-items-center justify-content-center"
        style={{ flex:1, background:'linear-gradient(155deg,#0f172a 0%,#1e3a5f 45%,#0d4f3c 100%)', position:'relative', overflow:'hidden' }}>

       

        {/* Glowing orbs */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,.22) 0%,transparent 70%)', top:'-5%', left:'-15%', animation:'orb 5s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,.18) 0%,transparent 70%)', bottom:'5%', right:'-10%', animation:'orb 6s ease-in-out infinite 1.5s' }} />

        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'44px 44px' }} />

        {/* Text content */}
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'2rem 2.5rem', maxWidth:440 }}>
          <div style={{ fontSize:'5.5rem', marginBottom:'1.2rem', filter:'drop-shadow(0 0 35px rgba(249,115,22,.55))' }}>🏠</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:'3rem', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:'1rem', letterSpacing:'-.02em' }}>
            Find Your<br/><span style={{ color:'#f97316' }}>Perfect</span> Room
          </h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'1rem', lineHeight:1.75, marginBottom:'2.2rem' }}>
            Thousands of verified boarding places across Sri Lanka — Colombo, Kandy, Galle and beyond.
          </p>
          <div style={{ display:'flex', gap:'2rem', justifyContent:'center' }}>
            {[['20+','Listings'],['12','Cities'],['100%','Trusted']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"Georgia,serif", fontSize:'2rem', fontWeight:800, color:'#f97316' }}>{v}</div>
                <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.1em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'1.5rem', color:'rgba(255,255,255,.25)', fontSize:'.72rem', letterSpacing:'.12em', textTransform:'uppercase' }}>
          BoardingFinder · Sri Lanka
        </div>
      </div>

      {/* ═══ RIGHT — form panel ═══ */}
      <div className="lf-card" style={{ width:'100%', maxWidth:520, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2.5rem 2rem', position:'relative', boxShadow:'-20px 0 60px rgba(0,0,0,.1)' }}>

        {/* Top accent */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#f97316,#fb923c,#fbbf24)' }} />

        <div className="lf-form" style={{ width:'100%', maxWidth:380 }}>

          {/* Brand */}
          <div style={{ marginBottom:'2rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.3rem' }}>
              <span style={{ fontSize:'1.8rem' }}>🏠</span>
              <span style={{ fontFamily:"Georgia,serif", fontSize:'1.4rem', fontWeight:800, color:'#0f172a' }}>
                Boarding<span style={{ color:'#f97316' }}>Finder</span>
              </span>
            </div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:'2rem', fontWeight:800, color:'#0f172a', margin:'.9rem 0 .3rem', letterSpacing:'-.02em' }}>Welcome back</h2>
            <p style={{ color:'#64748b', fontSize:'.9rem', margin:0 }}>Sign in to your Boarding Finder account</p>
          </div>

          {error && (
            <div style={{ background:'#fef2f2', color:'#b91c1c', padding:'.85rem 1rem', borderRadius:10, fontSize:'.875rem', marginBottom:'1.2rem', border:'1px solid #fecaca', display:'flex', alignItems:'center', gap:'.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:'1.2rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#374151', marginBottom:'.45rem', textTransform:'uppercase', letterSpacing:'.05em' }}>Email Address</label>
              <div className="lf-input-wrap">
                <span className="lf-icon"><FiMail size={16}/></span>
                <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                  placeholder="yourname@email.com" required className="lf-input" />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.45rem' }}>
                <label style={{ fontSize:'.78rem', fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'.05em' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize:'.8rem', color:'#f97316', fontWeight:600, textDecoration:'none' }}>Forgot password?</Link>
              </div>
              <div className="lf-input-wrap">
                <span className="lf-icon"><FiLock size={16}/></span>
                <input type={showPw?'text':'password'} value={form.password}
                  onChange={e => setForm({...form,password:e.target.value})}
                  placeholder="••••••••" required className="lf-input" />
                <button type="button" onClick={()=>setShowPw(!showPw)}
                  style={{ background:'none', border:'none', padding:'0 .9rem', cursor:'pointer', color:'#94a3b8', transition:'color .2s', flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.color='#f97316'}
                  onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                  {showPw?<FiEyeOff size={16}/>:<FiEye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="lf-btn-primary">
              {loading?<><span className="spinner-border spinner-border-sm me-2"/>Signing in...</>:<><FiLogIn size={16}/>Sign In</>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', margin:'1.5rem 0' }}>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
            <span style={{ fontSize:'.75rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em' }}>New here?</span>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
          </div>

          <Link to="/register" style={{ textDecoration:'none' }}>
            <button className="lf-btn-ghost">Create a free account →</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;