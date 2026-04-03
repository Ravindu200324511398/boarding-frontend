import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiHome, FiMessageSquare, FiUser, FiTrash2, FiExternalLink, FiMail, FiCheckCircle } from "react-icons/fi";
import api from "../api/axios";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusTheme = {
  pending:  { label: "Pending",   color: "#b45309", bg: "#fffbeb", icon: <FiClock /> },
  seen:     { label: "Reviewed",  color: "#0d9488", bg: "#f0fdfa", icon: <FiCheckCircle /> },
  accepted: { label: "Accepted",  color: "#059669", bg: "#f0fdf4", icon: <FiHome /> },
  rejected: { label: "Declined",  color: "#dc2626", bg: "#fef2f2", icon: <FiTrash2 /> },
};

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
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background: '#fff' }}>
       <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modern-card { animation: slideUp 0.4s ease-out forwards; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
        .filter-btn:hover { background: #f0fdf4 !important; color: #10b981 !important; }
      `}</style>

      {/* Header - Using the Emerald Brand Gradient */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #10b981 100%)", padding: "4rem 0 6.5rem" }}>
        <div className="container" style={{ maxWidth: 950 }}>
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 12, padding: "0.6rem 1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, marginBottom: "2rem", transition: '0.2s' }}>
            <FiArrowLeft size={18}/> Back
          </button>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.6rem", fontWeight: 800, color: "#fff", margin: 0 }}>My Visit Requests</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", marginTop: "10px" }}>Track your visit requests and owner responses</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 950, marginTop: "-3.5rem", paddingBottom: "6rem" }}>
        
        {/* Modern Emerald Filter Bar */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "8px", display: "flex", gap: "8px", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", marginBottom: "2.5rem" }}>
          {['all', 'pending', 'accepted', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={filter !== f ? "filter-btn" : ""}
              style={{ 
                flex: 1, padding: "0.9rem 1rem", borderRadius: 18, border: "none", 
                background: filter === f ? "#10b981" : "transparent", 
                color: filter === f ? "#fff" : "#64748b", 
                fontWeight: 800, cursor: "pointer", fontSize: "0.88rem", transition: '0.3s' 
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ marginLeft: 6, opacity: 0.7 }}>({counts[f] || inquiries.length})</span>
            </button>
          ))}
        </div>

        {/* Inquiry List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', padding: '6rem 2rem', borderRadius: '32px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
               <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🍃</div>
               <h3 style={{ color: '#1e293b', fontWeight: 800, fontSize: '1.5rem' }}>No requests found</h3>
               <p style={{ color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Start your journey by exploring available boardings and sending an inquiry.</p>
               <Link to="/" style={{ textDecoration: 'none' }}>
                  <button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '1.1rem 2.5rem', borderRadius: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.2)' }}>Explore Listings</button>
               </Link>
            </div>
          ) : (
            filtered.map(inq => {
              const theme = statusTheme[inq.status] || statusTheme.pending;
              const imgSrc = inq.boarding?.image ? `${IMAGE_BASE}${inq.boarding.image}` : null;
              
              return (
                <div key={inq._id} className="modern-card" style={{ background: "#fff", borderRadius: 32, overflow: "hidden", border: `1px solid #f1f5f9`, display: 'flex', flexWrap: 'wrap' }}>
                  
                  {/* Left: Boarding Profile (Grey/Slate accent) */}
                  <div style={{ width: 300, background: '#f8fafc', padding: '2rem', borderRight: '1px solid #f1f5f9' }}>
                    <div style={{ background: theme.bg, color: theme.color, padding: "6px 14px", borderRadius: 14, fontSize: "0.75rem", fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', marginBottom: '1.8rem', border: `1px solid ${theme.color}20` }}>
                      {theme.icon} {theme.label}
                    </div>
                    
                    <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
                        {imgSrc ? (
                            <img src={imgSrc} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 22 }} />
                        ) : (
                            <div style={{ width: '100%', height: 140, background: '#e2e8f0', borderRadius: 22, display:'flex', alignItems:'center', justifyContent:'center' }}><FiHome size={35} color="#94a3b8"/></div>
                        )}
                    </div>

                    <h5 style={{ fontWeight: 800, color: "#1e293b", fontSize: '1.2rem', marginBottom: '8px', lineHeight: 1.3 }}>{inq.boarding?.title}</h5>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <FiMapPin color="#10b981" /> {inq.boarding?.location}
                    </div>
                  </div>

                  {/* Right: Interaction Details (White) */}
                  <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 52, height: 52, borderRadius: 18, background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          <FiUser />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>{inq.owner?.name || "Property Owner"}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Verified Member</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                           <FiCalendar color="#10b981"/> {inq.visitDate ? new Date(inq.visitDate).toLocaleDateString() : 'ASAP'}
                         </div>
                         <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>Preferred Visit Date</div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 22, border: '1px solid #f1f5f9', color: '#334155', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'auto' }}>
                      <FiMessageSquare size={14} style={{ marginRight: 8, color: '#10b981' }}/>
                      "{inq.message}"
                    </div>

                    {/* Action Bar - Styled Emerald */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <Link to={`/boarding/${inq.boarding?._id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.8rem 1.5rem', borderRadius: 15, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' }}>View Details</button>
                      </Link>
                      {inq.status === 'accepted' && (
                        <a href={`mailto:${inq.owner?.email}`} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.8rem 1.8rem', borderRadius: 15, fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 5px 15px rgba(16,185,129,0.2)' }}>
                            <FiMail /> Contact Owner
                        </a>
                      )}
                      <button onClick={() => setDeleteModal(inq._id)} style={{ background: '#fff', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.8rem', borderRadius: 15, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clear All - Bottom Section */}
        {filtered.length > 0 && (
          <div style={{ marginTop: '6rem', textAlign: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '4rem' }}>
             <button onClick={() => setClearModal(true)} style={{ background: '#fff', color: '#ef4444', border: '1px solid #fee2e2', padding: '1.1rem 3rem', borderRadius: 22, fontWeight: 800, cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 25px rgba(239,68,68,0.06)' }}>
               <FiTrash2 style={{ marginRight: 10 }}/> Clear All {filter !== 'all' ? filter : ''} History
             </button>
             <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '15px' }}>Permanently remove these requests from your dashboard.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {(deleteModal || clearModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', padding: '3rem', borderRadius: 36, maxWidth: 440, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ width: 70, height: 70, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.8rem', fontSize: '2rem' }}><FiTrash2 /></div>
            <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.6rem', marginBottom: '12px' }}>Confirm Deletion</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1.05rem' }}>Are you sure you want to remove these items? This action cannot be reversed.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => { setDeleteModal(null); setClearModal(false); }} style={{ flex: 1, padding: '1.1rem', borderRadius: 18, border: 'none', background: '#f1f5f9', fontWeight: 800, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button onClick={deleteModal ? () => handleDeleteOne(deleteModal) : handleClear} style={{ flex: 1, padding: '1.1rem', borderRadius: 18, border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
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