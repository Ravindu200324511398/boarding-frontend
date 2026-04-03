import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); 
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({...form,[e.target.name]:e.target.value}); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name:form.name, email:form.email, password:form.password });
      setIsRegistering(true);
      setTimeout(() => {
        login(res.data.user, res.data.token);
        navigate('/');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight:'100vh', 
      display:'flex', 
      flexDirection: 'row-reverse', // SWAP: Form Right, Deco Left
      position:'relative', 
      overflow:'hidden' 
    }}>
      <style>{`
        @keyframes slideInRight {
          from { opacity:0; transform: translateX(50px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes orb {
          0%,100% { transform:scale(1) translateY(0);      opacity:.5; }
          50%     { transform:scale(1.1) translateY(-18px); opacity:.8; }
        }
        .rf-input-wrap { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:12px; overflow:hidden; transition:all .2s; background:#f8fafc; }
        .rf-input-wrap:focus-within { border-color:#10b981 !important; background:#fff !important; box-shadow:0 0 0 3px rgba(16,185,129,.12); }
        .rf-input  { border:none; outline:none; flex:1; padding:.75rem 1rem; font-size:.92rem; background:transparent; color:#0f172a; font-family:inherit; }
        .rf-icon   { padding:0 .9rem; color:#10b981; align-self:stretch; display:flex; align-items:center; border-right:1px solid #e2e8f0; flex-shrink:0; }
        .rf-btn-primary { width:100%; background:linear-gradient(135deg,#059669,#10b981); color:#fff; border:none; border-radius:12px; padding:.9rem; font-weight:700; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem; transition:all .25s; box-shadow:0 4px 15px rgba(16,185,129,.3); font-family:inherit; }
        .rf-btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(16,185,129,.45); }
        .rf-btn-primary:disabled { opacity:.7; cursor:not-allowed; }
        .rf-btn-ghost { width:100%; background:transparent; color:#0f172a; border:2px solid #e2e8f0; border-radius:12px; padding:.8rem; font-weight:700; font-size:.92rem; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:.5rem; font-family:inherit; }
        .rf-btn-ghost:hover { border-color:#10b981; color:#10b981; }
        .rf-card   { animation:slideInRight .5s ease forwards; transition: all 0.8s ease; }
        .rf-form   { animation:fadeUp .65s ease .1s both; }
        .panel-exit { opacity: 0; transform: scale(0.98); transition: all 0.6s ease; }
      `}</style>

      {/* FORM PANEL */}
      <div className={`rf-card ${isRegistering ? 'panel-exit' : ''}`} 
        style={{ 
          width:'100%', 
          maxWidth:520, 
          background:'#fff', 
          display:'flex', 
          flexDirection:'column', 
          alignItems:'center', 
          justifyContent:'center', 
          padding:'2.5rem 2rem', 
          position:'relative', 
          boxShadow:'-20px 0 60px rgba(0,0,0,.08)', 
          zIndex:2 
        }}>
        
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: 'linear-gradient(90deg,#10b981,#34d399,#6ee7b7)' }} />

        <div className="rf-form" style={{ width:'100%', maxWidth:380 }}>
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.3rem' }}>
              <span style={{ fontSize:'1.8rem' }}>🏠</span>
              <span style={{ fontFamily:"Georgia,serif", fontSize:'1.4rem', fontWeight:800, color:'#0f172a' }}>
                Boarding<span style={{ color: '#10b981' }}>Finder</span>
              </span>
            </div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:'1.9rem', fontWeight:800, color:'#0f172a', margin:'.9rem 0 .3rem' }}>Create account</h2>
            <p style={{ color:'#64748b', fontSize:'.9rem', margin:0 }}>Join thousands of students finding great boardings</p>
          </div>

          {error && (
            <div style={{ background:'#fef2f2', color:'#b91c1c', padding:'.85rem 1rem', borderRadius:10, fontSize:'.875rem', marginBottom:'1rem', border:'1px solid #fecaca' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#374151', marginBottom:'.4rem' }}>Full Name</label>
              <div className="rf-input-wrap">
                <span className="rf-icon"><FiUser size={16}/></span>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="rf-input" />
              </div>
            </div>

            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#374151', marginBottom:'.4rem' }}>Email Address</label>
              <div className="rf-input-wrap">
                <span className="rf-icon"><FiMail size={16}/></span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="rf-input" />
              </div>
            </div>

            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#374151', marginBottom:'.4rem' }}>Password</label>
              <div className="rf-input-wrap">
                <span className="rf-icon"><FiLock size={16}/></span>
                <input type={showPw?'text':'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required className="rf-input" />
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ background:'none', border:'none', padding:'0 .9rem', cursor:'pointer', color:'#94a3b8' }}>
                  {showPw?<FiEyeOff size={16}/>:<FiEye size={16}/>}
                </button>
              </div>
            </div>

            <div style={{ marginBottom:'1.4rem' }}>
              <label style={{ display:'block', fontSize:'.78rem', fontWeight:700, color:'#374151', marginBottom:'.4rem' }}>Confirm Password</label>
              <div className="rf-input-wrap">
                <span className="rf-icon"><FiLock size={16}/></span>
                <input type={showCPw?'text':'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required className="rf-input" />
                <button type="button" onClick={()=>setShowCPw(!showCPw)} style={{ background:'none', border:'none', padding:'0 .9rem', cursor:'pointer', color:'#94a3b8' }}>
                  {showCPw?<FiEyeOff size={16}/>:<FiEye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || isRegistering} className="rf-btn-primary">
              {loading ? 'Processing...' : isRegistering ? 'Welcome! 🏠' : <><FiUserPlus size={16}/>Create Account</>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', margin:'1.2rem 0' }}>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }}/><span style={{ fontSize:'.75rem', color:'#94a3b8' }}>Have account?</span><div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
          </div>
          <Link to="/login" style={{ textDecoration:'none' }}><button className="rf-btn-ghost">← Sign in instead</button></Link>
        </div>
      </div>

      {/* DECORATIVE PANEL */}
      <div className="d-none d-lg-flex flex-column align-items-center justify-content-center"
        style={{ flex:1, background:'linear-gradient(155deg,#0f2027 0%,#0d4f3c 50%,#1e3a5f 100%)', position:'relative', overflow:'hidden' }}>
        
        <div style={{ position:'absolute', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,.22) 0%,transparent 70%)', top:'-5%', right:'-15%', animation:'orb 5s ease-in-out infinite' }}/>
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%)', bottom:'5%', left:'-8%', animation:'orb 6.5s ease-in-out infinite 1s' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'44px 44px' }}/>
        
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'2rem 2.5rem', maxWidth:440, opacity: isRegistering ? 0 : 1, transition:'all 0.6s ease' }}>
          <div style={{ fontSize:'5.5rem', marginBottom:'1.2rem', filter:'drop-shadow(0 0 35px rgba(16,185,129,.55))' }}>🏡</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:'2.8rem', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:'1rem' }}>
            Join Our<br/><span style={{ color:'#10b981' }}>Community</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'1rem', lineHeight:1.75 }}>
            Browse hundreds of verified boarding places across Sri Lanka.
          </p>
        </div>
        
        <div style={{ position:'absolute', bottom:'1.5rem', color:'rgba(255,255,255,.25)', fontSize:'.72rem', textTransform:'uppercase' }}>BoardingFinder · Sri Lanka</div>
      </div>
    </div>
  );
};

export default Register;