import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiTrash2, FiClock, FiCheckCircle, FiXCircle, FiUser, FiMapPin, FiMessageSquare, FiMail } from "react-icons/fi";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusTheme = {
  pending:  { label:"Pending",  color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.25)",  icon:<FiClock /> },
  seen:     { label:"Reviewed", color:"#0ea5e9", bg:"rgba(14,165,233,0.1)",   border:"rgba(14,165,233,0.25)",  icon:<FiCheckCircle /> },
  accepted: { label:"Accepted", color:"#00d4aa", bg:"rgba(0,212,170,0.1)",    border:"rgba(0,212,170,0.25)",   icon:<FiCheckCircle /> },
  rejected: { label:"Declined", color:"#f87171", bg:"rgba(248,113,113,0.1)",  border:"rgba(248,113,113,0.25)", icon:<FiXCircle /> },
};

const getTokens = (isDark) => isDark ? {
  bg: '#060f2a', text: 'rgba(220,233,255,0.9)', textMuted: 'rgba(220,233,255,0.5)', textDim: 'rgba(220,233,255,0.45)',
  headerBg: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(0,212,170,0.1) 100%)',
  cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.08)',
  cardLeftBg: 'rgba(255,255,255,0.03)', cardLeftBorder: 'rgba(255,255,255,0.07)',
  filterBg: 'rgba(255,255,255,0.04)', filterBorder: 'rgba(255,255,255,0.08)',
  filterActiveBg: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', filterActiveColor: '#fff',
  filterInactiveColor: 'rgba(220,233,255,0.5)', filterInactiveHoverBg: 'rgba(255,255,255,0.06)',
  emptyBg: 'rgba(255,255,255,0.04)', emptyBorder: 'rgba(255,255,255,0.08)',
  msgBg: 'rgba(255,255,255,0.03)', msgBorder: 'rgba(255,255,255,0.07)', msgColor: 'rgba(220,233,255,0.65)',
  userIconBg: 'rgba(0,212,170,0.1)', userIconColor: '#00d4aa',
  accent: '#00d4aa', accentSecondary: '#0ea5e9',
  backBtnBg: 'rgba(255,255,255,0.1)', backBtnBorder: 'rgba(255,255,255,0.15)', backBtnColor: 'rgba(220,233,255,0.8)',
  acceptBtnShadow: '0 4px 16px rgba(0,212,170,0.3)',
  replyBtnBg: 'rgba(255,255,255,0.06)', replyBtnBorder: 'rgba(255,255,255,0.1)', replyBtnColor: 'rgba(220,233,255,0.8)',
  delBtnBg: 'rgba(248,113,113,0.08)', delBtnColor: '#f87171', delBtnBorder: 'rgba(248,113,113,0.2)',
  clearBtnBg: 'rgba(255,255,255,0.04)', clearBtnColor: '#f87171', clearBtnBorder: 'rgba(248,113,113,0.2)',
  modalBg: 'rgba(6,15,40,0.85)', modalInnerBg: 'rgba(14,25,60,0.95)', modalBorder: 'rgba(255,255,255,0.1)',
  modalCancelBg: 'rgba(255,255,255,0.08)', modalCancelColor: 'rgba(220,233,255,0.7)',
  dotColor: '#00d4aa', dotShadow: '#00d4aa',
  gridLine: 'rgba(255,255,255,.018)', orbColors: ['#0ea5e940','#00d4aa25','#06b6d428'],
  visitColor: '#dce9ff', visitDateColor: 'rgba(220,233,255,0.35)',
  locationColor: 'rgba(220,233,255,0.45)',
} : {
  bg: '#f0f4ff', text: '#1a2a4a', textMuted: '#4a6080', textDim: '#6a8aaa',
  headerBg: 'linear-gradient(135deg, rgba(0,112,192,0.1) 0%, rgba(0,180,216,0.07) 100%)',
  cardBg: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,112,192,0.12)',
  cardLeftBg: 'rgba(255,255,255,0.7)', cardLeftBorder: 'rgba(0,112,192,0.08)',
  filterBg: 'rgba(255,255,255,0.8)', filterBorder: 'rgba(0,112,192,0.12)',
  filterActiveBg: 'linear-gradient(135deg, #0070c0, #00b4d8)', filterActiveColor: '#fff',
  filterInactiveColor: '#4a6080', filterInactiveHoverBg: 'rgba(0,112,192,0.06)',
  emptyBg: 'rgba(255,255,255,0.8)', emptyBorder: 'rgba(0,112,192,0.12)',
  msgBg: 'rgba(255,255,255,0.6)', msgBorder: 'rgba(0,112,192,0.1)', msgColor: '#2a4a6a',
  userIconBg: 'rgba(0,112,192,0.08)', userIconColor: '#0070c0',
  accent: '#0070c0', accentSecondary: '#00b4d8',
  backBtnBg: 'rgba(255,255,255,0.7)', backBtnBorder: 'rgba(0,112,192,0.15)', backBtnColor: '#1a2a4a',
  acceptBtnShadow: '0 4px 16px rgba(0,112,192,0.2)',
  replyBtnBg: 'rgba(255,255,255,0.7)', replyBtnBorder: 'rgba(0,112,192,0.15)', replyBtnColor: '#1a2a4a',
  delBtnBg: 'rgba(239,68,68,0.06)', delBtnColor: '#dc2626', delBtnBorder: 'rgba(239,68,68,0.15)',
  clearBtnBg: 'rgba(255,255,255,0.6)', clearBtnColor: '#dc2626', clearBtnBorder: 'rgba(239,68,68,0.15)',
  modalBg: 'rgba(0,0,0,0.5)', modalInnerBg: 'rgba(240,247,255,0.97)', modalBorder: 'rgba(0,112,192,0.15)',
  modalCancelBg: 'rgba(0,112,192,0.06)', modalCancelColor: '#4a6080',
  dotColor: '#0070c0', dotShadow: '#0070c0',
  gridLine: 'rgba(0,112,192,.02)', orbColors: ['#0070c022','#00b4d815','#0096c710'],
  visitColor: '#1a2a4a', visitDateColor: '#6a8aaa',
  locationColor: '#4a6080',
};

const InqParticle = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 35 }, () => ({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*2+0.5, color: colors[Math.floor(Math.random()*colors.length)], vx: (Math.random()-0.5)*0.45, vy: -Math.random()*0.65-0.25, alpha: Math.random()*0.55+0.2 }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = p.color + Math.round(p.alpha*255).toString(16).padStart(2,'0'); ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill(); p.x += p.vx; p.y += p.vy; if (p.y < -10) { p.y = canvas.height+10; p.x = Math.random()*canvas.width; } if (p.x < 0 || p.x > canvas.width) p.vx *= -1; });
      animId = requestAnimationFrame(draw);
    };
    draw(); return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [colors]);
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }} />;
};

const InquiriesPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTokens(isDark);
  const particleColors = isDark ? ['#0ea5e9','#06b6d4','#00d4aa','#2de2e6','#0891b2'] : ['#0070c0','#00b4d8','#0096c7','#0077b6','#48cae4'];

  const [inquiries, setInquiries] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [clearModal, setClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-50px) scale(1.07)} 66%{transform:translate(-25px,30px) scale(0.95)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .inq-card { animation:slideUp 0.4s ease-out forwards; background:${t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:24px; overflow:hidden; display:flex; flex-wrap:wrap; backdrop-filter:blur(12px); transition:transform 0.3s ease,box-shadow 0.3s ease; }
    .inq-card:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,0.15); border-color:rgba(0,180,216,0.25); }
    .filter-bar { background:${t.filterBg}; border:1px solid ${t.filterBorder}; border-radius:20px; padding:6px; display:flex; gap:6px; backdrop-filter:blur(10px); margin-bottom:2rem; overflow-x:auto; }
    .filter-btn-active { flex:1; min-width:110px; padding:0.8rem 1rem; border-radius:14px; border:none; background:${t.filterActiveBg}; color:${t.filterActiveColor}; font-weight:800; cursor:pointer; font-size:0.88rem; font-family:'Plus Jakarta Sans',sans-serif; }
    .filter-btn-inactive { flex:1; min-width:110px; padding:0.8rem 1rem; border-radius:14px; border:none; background:transparent; color:${t.filterInactiveColor}; font-weight:700; cursor:pointer; font-size:0.88rem; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
    .filter-btn-inactive:hover { background:${t.filterInactiveHoverBg}; color:${t.text}; }
    .accept-btn { background:linear-gradient(135deg,#00d4aa,#0ea5e9); color:#fff; border:none; padding:0.7rem 1.6rem; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.88rem; box-shadow:${t.acceptBtnShadow}; transition:all 0.2s; }
    .accept-btn:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,212,170,0.4); }
    .reply-btn { background:${t.replyBtnBg}; color:${t.replyBtnColor}; border:1px solid ${t.replyBtnBorder}; padding:0.7rem 1.4rem; border-radius:12px; font-weight:700; text-decoration:none; font-size:0.88rem; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
    .reply-btn:hover { background:${t.filterInactiveHoverBg}; }
    .del-btn { background:${t.delBtnBg}; color:${t.delBtnColor}; border:1px solid ${t.delBtnBorder}; padding:0.7rem 0.9rem; border-radius:12px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; }
    .del-btn:hover { opacity:0.85; }
    .clear-btn { background:${t.clearBtnBg}; color:${t.clearBtnColor}; border:1px solid ${t.clearBtnBorder}; padding:1rem 2.8rem; border-radius:18px; font-weight:800; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.9rem; transition:all 0.2s; backdrop-filter:blur(8px); }
    .clear-btn:hover { opacity:0.85; }
    .back-btn { background:${t.backBtnBg}; border:1px solid ${t.backBtnBorder}; color:${t.backBtnColor}; border-radius:12px; padding:0.6rem 1.2rem; cursor:pointer; display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; font-weight:600; margin-bottom:2rem; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.2s; }
    .back-btn:hover { opacity:0.85; }
    .modal-cancel { flex:1; padding:1rem; border-radius:14px; border:none; background:${t.modalCancelBg}; font-weight:800; color:${t.modalCancelColor}; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .modal-confirm { flex:1; padding:1rem; border-radius:14px; border:none; background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; font-weight:800; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; }
    .page-animate { animation:fadeUp 0.6s ease both; }
  `;

  useEffect(() => {
    api.get("/inquiries/owner/all").then(res => setInquiries(res.data.inquiries || [])).catch(() => navigate("/")).finally(() => setLoading(false));
  }, [navigate]);

  const handleStatus = async (id, status) => {
    try { await api.patch(`/inquiries/${id}/status`, { status }); setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i)); }
    catch { alert("Failed to update status"); }
  };
  const handleDelete = async (id) => {
    try { await api.delete(`/inquiries/${id}`); setInquiries(prev => prev.filter(i => i._id !== id)); setDeleteModal(null); }
    catch { alert("Failed to delete"); }
  };
  const handleClear = async () => {
    setClearing(true);
    try { await api.delete('/inquiries/owner/bulk', { data: { status: filter === 'all' ? 'all' : filter } }); if (filter === 'all') setInquiries([]); else setInquiries(prev => prev.filter(i => i.status !== filter)); setClearModal(false); }
    catch { alert('Failed to clear'); } finally { setClearing(false); }
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const counts = { all: inquiries.length, pending: inquiries.filter(i => i.status==="pending").length, seen: inquiries.filter(i => i.status==="seen").length, accepted: inquiries.filter(i => i.status==="accepted").length, rejected: inquiries.filter(i => i.status==="rejected").length };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background: t.bg }}><div className="spinner-border" style={{ color:'#00d4aa', width:'3rem', height:'3rem' }} /></div>;

  return (
    <div style={{ background: t.bg, minHeight:'100vh', fontFamily:"'Plus Jakarta Sans',sans-serif", position:'relative', overflow:'hidden' }}>
      <style>{CSS}</style>
      <InqParticle colors={particleColors} />
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        {t.orbColors.map((color, i) => {
          const positions = [{ top:'-200px', left:'-200px' },{ top:'35%', right:'-160px' },{ bottom:'-130px', left:'25%' }];
          const sizes = [[650,650],[550,550],[450,450]]; const delays=['0s','-5s','-10s'];
          return <div key={i} style={{ position:'absolute', borderRadius:'50%', width:sizes[i][0], height:sizes[i][1], background:`radial-gradient(circle, ${color}, transparent 70%)`, filter:'blur(70px)', ...positions[i], animation:`orbFloat 14s ease-in-out infinite`, animationDelay:delays[i] }} />;
        })}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
      </div>

      <div style={{ background: t.headerBg, borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.07)':'rgba(0,112,192,0.1)'}`, padding:'4rem 0 6.5rem', position:'relative', zIndex:2 }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${t.accent}66, ${t.accentSecondary}55, transparent)` }} />
        <div className="container page-animate" style={{ maxWidth:950 }}>
          <button onClick={() => navigate(-1)} className="back-btn"><FiArrowLeft size={18} /> Back</button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:t.dotColor, boxShadow:`0 0 8px ${t.dotShadow}`, animation:'blink 2s infinite' }} />
            <span style={{ fontSize:'0.78rem', fontWeight:700, color:t.textMuted, letterSpacing:'0.08em', textTransform:'uppercase' }}>Live Inbox</span>
          </div>
          <h1 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'2.4rem', fontWeight:800, color:t.text, margin:0 }}>Visit Inquiries</h1>
          <p style={{ color:t.textMuted, fontSize:'1rem', marginTop:'8px' }}>Manage requests and connect with potential tenants</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth:950, marginTop:'-3.5rem', paddingBottom:'6rem', position:'relative', zIndex:2 }}>
        <div className="filter-bar">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)} className={filter===key?'filter-btn-active':'filter-btn-inactive'}>
              {key.charAt(0).toUpperCase()+key.slice(1)} <span style={{ opacity:0.7 }}>({count})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background:t.emptyBg, border:`1px solid ${t.emptyBorder}`, borderRadius:28, padding:'6rem 2rem', textAlign:'center', backdropFilter:'blur(12px)', animation:'fadeUp 0.5s ease' }}>
            <div style={{ width:90, height:90, background:'linear-gradient(135deg,#00d4aa,#0ea5e9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 2rem', boxShadow:'0 10px 30px rgba(0,212,170,0.3)' }}><FiMail size={35} color="#fff" /></div>
            <h3 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, color:t.text, fontSize:'1.6rem', marginBottom:'0.8rem' }}>No {filter!=='all'?filter:''} inquiries yet</h3>
            <p style={{ color:t.textDim, maxWidth:'320px', margin:'0 auto', lineHeight:1.6 }}>When students request to visit your boarding, their messages will appear here.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {filtered.map((inq, idx) => {
              const theme = statusTheme[inq.status] || statusTheme.pending;
              return (
                <div key={inq._id} className="inq-card" style={{ animationDelay:`${idx*0.07}s` }}>
                  <div style={{ width:280, background:t.cardLeftBg, padding:'2rem', borderRight:`1px solid ${t.cardLeftBorder}` }}>
                    <div style={{ background:theme.bg, color:theme.color, padding:'5px 13px', borderRadius:12, fontSize:'0.75rem', fontWeight:900, display:'inline-flex', alignItems:'center', gap:'6px', textTransform:'uppercase', marginBottom:'1.5rem', border:`1px solid ${theme.border}` }}>{theme.icon} {theme.label}</div>
                    <h5 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, color:t.text, fontSize:'1.1rem', marginBottom:'8px', lineHeight:1.3 }}>{inq.boarding?.title || "Property Unit"}</h5>
                    <div style={{ color:t.locationColor, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'6px' }}><FiMapPin color={t.accent} size={13} /> {inq.boarding?.location}</div>
                  </div>
                  <div style={{ flex:1, padding:'2rem', display:'flex', flexDirection:'column' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                        <div style={{ width:48, height:48, borderRadius:14, background:t.userIconBg, color:t.userIconColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}><FiUser /></div>
                        <div>
                          <div style={{ fontWeight:800, color:t.text, fontSize:'0.95rem' }}>{inq.name}</div>
                          <div style={{ fontSize:'0.82rem', color:t.textMuted }}>{inq.email}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'0.9rem', fontWeight:800, color:t.visitColor, display:'flex', alignItems:'center', gap:'6px', justifyContent:'flex-end' }}><FiCalendar color={t.accent} size={13} /> {inq.visitDate ? new Date(inq.visitDate).toLocaleDateString() : 'ASAP'}</div>
                        <div style={{ fontSize:'0.78rem', color:t.visitDateColor, marginTop:'4px' }}>Requested Visit</div>
                      </div>
                    </div>
                    <div style={{ background:t.msgBg, padding:'1.2rem', borderRadius:16, border:`1px solid ${t.msgBorder}`, color:t.msgColor, fontSize:'0.93rem', fontStyle:'italic', lineHeight:1.7, marginBottom:'auto' }}>
                      <FiMessageSquare size={13} style={{ marginRight:8, color:t.accent }} />"{inq.message}"
                    </div>
                    <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'1.8rem', flexWrap:'wrap' }}>
                      {inq.status === 'pending' && <button onClick={() => handleStatus(inq._id,'accepted')} className="accept-btn">Accept Visit</button>}
                      <a href={`mailto:${inq.email}`} className="reply-btn">Reply Email</a>
                      <button onClick={() => setDeleteModal(inq._id)} className="del-btn"><FiTrash2 size={17} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ marginTop:'5rem', textAlign:'center', borderTop:`1px dashed ${isDark?'rgba(255,255,255,0.1)':'rgba(0,112,192,0.15)'}`, paddingTop:'3.5rem' }}>
            <button onClick={() => setClearModal(true)} className="clear-btn"><FiTrash2 style={{ marginRight:10 }} /> Clear All {filter!=='all'?filter:''} History</button>
          </div>
        )}
      </div>

      {(deleteModal || clearModal) && (
        <div style={{ position:'fixed', inset:0, background:t.modalBg, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(8px)' }}>
          <div style={{ background:t.modalInnerBg, border:`1px solid ${t.modalBorder}`, padding:'2.5rem', borderRadius:28, maxWidth:420, textAlign:'center', backdropFilter:'blur(20px)', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:64, height:64, background:'rgba(248,113,113,0.12)', color:'#f87171', border:'1px solid rgba(248,113,113,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', fontSize:'1.8rem' }}><FiTrash2 /></div>
            <h3 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, color:t.text, fontSize:'1.5rem', marginBottom:'10px' }}>Confirm Action</h3>
            <p style={{ color:t.textDim, marginBottom:'2rem' }}>Are you sure? This cannot be undone.</p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => { setDeleteModal(null); setClearModal(false); }} className="modal-cancel">Cancel</button>
              <button onClick={deleteModal ? () => handleDelete(deleteModal) : handleClear} className="modal-confirm">{clearing?'Processing...':'Yes, Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;