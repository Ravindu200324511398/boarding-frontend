import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, FiCalendar, FiTrash2, FiClock, 
  FiCheckCircle, FiXCircle, FiUser, FiMapPin, 
  FiMessageSquare, FiMail 
} from "react-icons/fi";
import api from "../api/axios";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusTheme = {
  pending:  { label: "Pending",   color: "#b45309", bg: "#fffbeb", icon: <FiClock /> },
  seen:     { label: "Reviewed",  color: "#0d9488", bg: "#f0fdfa", icon: <FiCheckCircle /> },
  accepted: { label: "Accepted",  color: "#059669", bg: "#f0fdf4", icon: <FiCheckCircle /> },
  rejected: { label: "Declined",  color: "#dc2626", bg: "#fef2f2", icon: <FiXCircle /> },
};

const InquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [clearModal, setClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/inquiries/owner/all")
      .then(res => setInquiries(res.data.inquiries || []))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch { alert("Failed to update status"); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(prev => prev.filter(i => i._id !== id));
      setDeleteModal(null);
    } catch { alert("Failed to delete"); }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await api.delete('/inquiries/owner/bulk', { data: { status: filter === 'all' ? 'all' : filter } });
      if (filter === 'all') setInquiries([]);
      else setInquiries(prev => prev.filter(i => i.status !== filter));
      setClearModal(false);
    } catch { alert('Failed to clear inquiries'); }
    finally { setClearing(false); }
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const counts = { 
    all: inquiries.length, 
    pending: inquiries.filter(i=>i.status==="pending").length, 
    seen: inquiries.filter(i=>i.status==="seen").length, 
    accepted: inquiries.filter(i=>i.status==="accepted").length, 
    rejected: inquiries.filter(i=>i.status==="rejected").length 
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
        .inquiry-card { animation: slideUp 0.4s ease-out forwards; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .inquiry-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #10b981 100%)", padding: "4rem 0 6.5rem" }}>
        <div className="container" style={{ maxWidth: 950 }}>
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 12, padding: "0.6rem 1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, marginBottom: "2rem" }}>
            <FiArrowLeft size={18}/> Back
          </button>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.6rem", fontWeight: 800, color: "#fff", margin: 0 }}>Visit Inquiries</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", marginTop: "10px" }}>Manage requests and connect with potential tenants</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 950, marginTop: "-3.5rem", paddingBottom: "6rem" }}>
        
        {/* Filter Bar */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "8px", display: "flex", gap: "8px", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", marginBottom: "2.5rem", overflowX: 'auto' }}>
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ 
                flex: 1, minWidth: 110, padding: "0.9rem 1rem", borderRadius: 18, border: "none", 
                background: filter === key ? "#10b981" : "transparent", 
                color: filter === key ? "#fff" : "#64748b", 
                fontWeight: 800, cursor: "pointer", fontSize: "0.88rem", transition: '0.3s' 
              }}>
              {key.charAt(0).toUpperCase() + key.slice(1)} <span style={{ marginLeft: 6, opacity: 0.7 }}>({count})</span>
            </button>
          ))}
        </div>

        {/* Ternary Condition Start */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 32, padding: "6rem 2rem", textAlign: "center", border: '1px solid #f1f5f9', boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: '#10b981', opacity: 0.1, borderRadius: '50%', transform: 'scale(1.4)' }}></div>
              <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)", borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(16,185,129,0.3)', zIndex: 2 }}>
                <FiMail size={35} color="#fff" />
              </div>
            </div>
            <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: '1.6rem', marginBottom: '0.8rem', fontFamily: "Georgia, serif" }}>No {filter !== 'all' ? filter : ''} inquiries yet</h3>
            <p style={{ color: "#64748b", maxWidth: '320px', margin: '0 auto', lineHeight: 1.6 }}>When students request to visit your boarding, their messages will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            {filtered.map((inq) => {
              const theme = statusTheme[inq.status] || statusTheme.pending;
              return (
                <div key={inq._id} className="inquiry-card" style={{ background: "#fff", borderRadius: 32, overflow: "hidden", border: `1px solid #f1f5f9`, display: 'flex', flexWrap: 'wrap' }}>
                  
                  {/* Left Side */}
                  <div style={{ width: 280, background: '#f8fafc', padding: '2rem', borderRight: '1px solid #f1f5f9' }}>
                    <div style={{ background: theme.bg, color: theme.color, padding: "6px 14px", borderRadius: 14, fontSize: "0.75rem", fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', marginBottom: '1.8rem', border: `1px solid ${theme.color}20` }}>
                      {theme.icon} {theme.label}
                    </div>
                    <h5 style={{ fontWeight: 800, color: "#1e293b", fontSize: '1.2rem', marginBottom: '8px', lineHeight: 1.3 }}>{inq.boarding?.title || "Property Unit"}</h5>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <FiMapPin color="#10b981" /> {inq.boarding?.location}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 52, height: 52, borderRadius: 18, background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          <FiUser />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>{inq.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{inq.email}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                           <FiCalendar color="#10b981"/> {inq.visitDate ? new Date(inq.visitDate).toLocaleDateString() : 'ASAP'}
                         </div>
                         <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>Requested Visit</div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 22, border: '1px solid #f1f5f9', color: '#334155', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'auto' }}>
                      <FiMessageSquare size={14} style={{ marginRight: 8, color: '#10b981' }}/>
                      "{inq.message}"
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      {inq.status === 'pending' && (
                        <button onClick={() => handleStatus(inq._id, 'accepted')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.8rem 1.8rem', borderRadius: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 5px 15px rgba(16,185,129,0.2)' }}>Accept Visit</button>
                      )}
                      <a href={`mailto:${inq.email}`} style={{ background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.8rem 1.5rem', borderRadius: 15, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Reply Email</a>
                      <button onClick={() => setDeleteModal(inq._id)} style={{ background: '#fff', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.8rem', borderRadius: 15, cursor: 'pointer' }}><FiTrash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clear All Section */}
        {filtered.length > 0 && (
          <div style={{ marginTop: '6rem', textAlign: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '4rem' }}>
             <button onClick={() => setClearModal(true)} style={{ background: '#fff', color: '#ef4444', border: '1px solid #fee2e2', padding: '1.1rem 3rem', borderRadius: 22, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(239,68,68,0.06)' }}>
               <FiTrash2 style={{ marginRight: 10 }}/> Clear All {filter !== 'all' ? filter : ''} History
             </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {(deleteModal || clearModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', padding: '3rem', borderRadius: 36, maxWidth: 440, textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.8rem', fontSize: '2rem' }}><FiTrash2 /></div>
            <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.6rem' }}>Confirm Action</h3>
            <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => { setDeleteModal(null); setClearModal(false); }} style={{ flex: 1, padding: '1.1rem', borderRadius: 18, border: 'none', background: '#f1f5f9', fontWeight: 800 }}>Cancel</button>
              <button onClick={deleteModal ? () => handleDelete(deleteModal) : handleClear} style={{ flex: 1, padding: '1.1rem', borderRadius: 18, border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 800 }}>
                {clearing ? 'Processing...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;