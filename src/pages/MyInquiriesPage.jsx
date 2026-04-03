import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiHome, FiMessageSquare, FiUser, FiTrash2, FiMail, FiCheckCircle } from "react-icons/fi";
import api from "../api/axios";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusTheme = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  icon: <FiClock /> },
  seen:     { label: "Reviewed", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)",   border: "rgba(14,165,233,0.25)",  icon: <FiCheckCircle /> },
  accepted: { label: "Accepted", color: "#00d4aa", bg: "rgba(0,212,170,0.1)",    border: "rgba(0,212,170,0.25)",   icon: <FiHome /> },
  rejected: { label: "Declined", color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)", icon: <FiTrash2 /> },
};

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2'];
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45, vy: -Math.random() * 0.65 - 0.25,
      alpha: Math.random() * 0.55 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .mi-card {
    animation: slideUp 0.4s ease-out forwards;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; overflow: hidden;
    display: flex; flex-wrap: wrap;
    backdrop-filter: blur(12px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .mi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    border-color: rgba(0,212,170,0.2);
  }

  .mi-filter-bar {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 6px;
    display: flex; gap: 6px;
    backdrop-filter: blur(10px);
    margin-bottom: 2rem;
  }
  .mi-filter-active {
    flex: 1; padding: 0.8rem 1rem; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    color: #fff; font-weight: 800; cursor: pointer; font-size: 0.88rem;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s;
  }
  .mi-filter-inactive {
    flex: 1; padding: 0.8rem 1rem; border-radius: 14px; border: none;
    background: transparent; color: rgba(220,233,255,0.5);
    font-weight: 700; cursor: pointer; font-size: 0.88rem;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s;
  }
  .mi-filter-inactive:hover { background: rgba(255,255,255,0.06); color: rgba(220,233,255,0.9); }

  .view-btn {
    background: rgba(255,255,255,0.06); color: rgba(220,233,255,0.8);
    border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.4rem;
    border-radius: 12px; font-weight: 700; font-size: 0.88rem;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    transition: all 0.2s; text-decoration: none; display: inline-block;
  }
  .view-btn:hover { background: rgba(255,255,255,0.1); }

  .contact-btn {
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    color: #fff; border: none; padding: 0.7rem 1.6rem; border-radius: 12px;
    font-weight: 800; text-decoration: none; font-size: 0.88rem;
    display: flex; align-items: center; gap: 7px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(0,212,170,0.3); transition: all 0.2s;
  }
  .contact-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,212,170,0.45); }

  .del-btn {
    background: rgba(248,113,113,0.08); color: #f87171;
    border: 1px solid rgba(248,113,113,0.2); padding: 0.7rem 0.9rem;
    border-radius: 12px; cursor: pointer; display: flex; align-items: center;
    transition: all 0.2s;
  }
  .del-btn:hover { background: rgba(248,113,113,0.15); }

  .explore-btn {
    background: linear-gradient(135deg, #00d4aa, #0ea5e9);
    background-size: 200%; color: #fff; border: none; padding: 1rem 2.4rem;
    border-radius: 14px; font-weight: 800; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(0,212,170,0.3);
    animation: shimmerBtn 4s linear infinite; transition: all 0.2s;
  }
  .explore-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,212,170,0.45); }

  .clear-btn {
    background: rgba(255,255,255,0.04); color: #f87171;
    border: 1px solid rgba(248,113,113,0.2); padding: 1rem 2.8rem;
    border-radius: 18px; font-weight: 800; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem;
    transition: all 0.2s; backdrop-filter: blur(8px);
  }
  .clear-btn:hover { background: rgba(248,113,113,0.08); }

  .back-btn {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(220,233,255,0.8); border-radius: 12px; padding: 0.6rem 1.2rem;
    cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.9rem; font-weight: 600; margin-bottom: 2rem;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.2s;
  }
  .back-btn:hover { background: rgba(255,255,255,0.15); }

  .modal-cancel {
    flex: 1; padding: 1rem; border-radius: 14px; border: none;
    background: rgba(255,255,255,0.08); font-weight: 800;
    color: rgba(220,233,255,0.7); cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .modal-confirm {
    flex: 1; padding: 1rem; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff; font-weight: 800; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .page-animate { animation: fadeUp 0.6s ease both; }
`;

const MyInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [clearModal, setClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    api.get("/inquiries/student/mine")
      .then(res => setInquiries(res.data.inquiries || []))
      .catch(() => console.error("Could not load inquiries"))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteOne = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(prev => prev.filter(i => i._id !== id));
      setDeleteModal(null);
    } catch { alert('Failed to delete'); }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await api.delete('/inquiries/student/bulk', { data: { status: filter === 'all' ? 'all' : filter } });
      if (filter === 'all') setInquiries([]);
      else setInquiries(prev => prev.filter(i => i.status !== filter));
      setClearModal(false);
    } catch { alert('Failed to clear'); }
    finally { setClearing(false); }
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === "pending").length,
    accepted: inquiries.filter(i => i.status === "accepted").length,
    rejected: inquiries.filter(i => i.status === "rejected").length,
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#060f2a' }}>
      <div className="spinner-border" style={{ color: '#00d4aa', width: '3rem', height: '3rem' }} />
    </div>
  );

  return (
    <div style={{ background: '#060f2a', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <ParticleCanvas />

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 650, h: 650, color: '#0ea5e940', top: '-200px', left: '-200px', delay: '0s' },
          { w: 550, h: 550, color: '#00d4aa25', top: '35%', right: '-160px', delay: '-5s' },
          { w: 450, h: 450, color: '#06b6d428', bottom: '-130px', left: '25%', delay: '-10s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(0,212,170,0.1) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '4rem 0 6.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), rgba(14,165,233,0.35), transparent)' }} />
        <div className="container page-animate" style={{ maxWidth: 950 }}>
          <button onClick={() => navigate(-1)} className="back-btn"><FiArrowLeft size={18} /> Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(220,233,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>My Requests</span>
          </div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#dce9ff', margin: 0 }}>My Visit Requests</h1>
          <p style={{ color: 'rgba(220,233,255,0.5)', fontSize: '1rem', marginTop: '8px' }}>Track your visit requests and owner responses</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 950, marginTop: '-3.5rem', paddingBottom: '6rem', position: 'relative', zIndex: 2 }}>
        <div className="mi-filter-bar">
          {['all', 'pending', 'accepted', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'mi-filter-active' : 'mi-filter-inactive'}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.7 }}>({counts[f] || inquiries.length})</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '6rem 2rem', borderRadius: '28px', textAlign: 'center', backdropFilter: 'blur(12px)', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🍃</div>
              <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: '#dce9ff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.8rem' }}>No requests found</h3>
              <p style={{ color: 'rgba(220,233,255,0.4)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Start your journey by exploring available boardings and sending an inquiry.</p>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="explore-btn">Explore Listings</button>
              </Link>
            </div>
          ) : (
            filtered.map((inq, idx) => {
              const theme = statusTheme[inq.status] || statusTheme.pending;
              const imgSrc = inq.boarding?.image ? `${IMAGE_BASE}${inq.boarding.image}` : null;
              return (
                <div key={inq._id} className="mi-card" style={{ animationDelay: `${idx * 0.07}s` }}>
                  {/* Left */}
                  <div style={{ width: 300, background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ background: theme.bg, color: theme.color, padding: '5px 13px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', marginBottom: '1.5rem', border: `1px solid ${theme.border}` }}>
                      {theme.icon} {theme.label}
                    </div>
                    <div style={{ position: 'relative', marginBottom: '1.1rem' }}>
                      {imgSrc ? (
                        <img src={imgSrc} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 18 }} />
                      ) : (
                        <div style={{ width: '100%', height: 130, background: 'rgba(255,255,255,0.06)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiHome size={32} color="rgba(220,233,255,0.25)" /></div>
                      )}
                    </div>
                    <h5 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', fontSize: '1.1rem', marginBottom: '7px', lineHeight: 1.3 }}>{inq.boarding?.title}</h5>
                    <div style={{ color: 'rgba(220,233,255,0.4)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiMapPin color="#00d4aa" size={13} /> {inq.boarding?.location}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,212,170,0.1)', color: '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          <FiUser />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#dce9ff', fontSize: '0.95rem' }}>{inq.owner?.name || "Property Owner"}</div>
                          <div style={{ fontSize: '0.82rem', color: 'rgba(220,233,255,0.4)' }}>Verified Member</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dce9ff', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <FiCalendar color="#00d4aa" size={13} /> {inq.visitDate ? new Date(inq.visitDate).toLocaleDateString() : 'ASAP'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(220,233,255,0.35)', marginTop: '4px' }}>Preferred Visit Date</div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(220,233,255,0.6)', fontSize: '0.93rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'auto' }}>
                      <FiMessageSquare size={13} style={{ marginRight: 8, color: '#00d4aa' }} />
                      "{inq.message}"
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.8rem', flexWrap: 'wrap' }}>
                      <Link to={`/boarding/${inq.boarding?._id}`} style={{ textDecoration: 'none' }}>
                        <span className="view-btn">View Details</span>
                      </Link>
                      {inq.status === 'accepted' && (
                        <a href={`mailto:${inq.owner?.email}`} className="contact-btn">
                          <FiMail /> Contact Owner
                        </a>
                      )}
                      <button onClick={() => setDeleteModal(inq._id)} className="del-btn"><FiTrash2 size={17} /></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filtered.length > 0 && (
          <div style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '3.5rem' }}>
            <button onClick={() => setClearModal(true)} className="clear-btn">
              <FiTrash2 style={{ marginRight: 10 }} /> Clear All {filter !== 'all' ? filter : ''} History
            </button>
            <p style={{ color: 'rgba(220,233,255,0.3)', fontSize: '0.88rem', marginTop: '12px' }}>Permanently remove these requests from your dashboard.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {(deleteModal || clearModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,15,40,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'rgba(14,25,60,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', borderRadius: 28, maxWidth: 420, textAlign: 'center', backdropFilter: 'blur(20px)', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}><FiTrash2 /></div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: '#dce9ff', fontSize: '1.5rem', marginBottom: '10px' }}>Confirm Deletion</h3>
            <p style={{ color: 'rgba(220,233,255,0.45)', lineHeight: 1.6, marginBottom: '2rem' }}>Are you sure you want to remove these items? This action cannot be reversed.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setDeleteModal(null); setClearModal(false); }} className="modal-cancel">Cancel</button>
              <button onClick={deleteModal ? () => handleDeleteOne(deleteModal) : handleClear} className="modal-confirm">
                {clearing ? 'Processing...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInquiriesPage;