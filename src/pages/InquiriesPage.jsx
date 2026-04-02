import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiTrash2, FiHome, FiClock, FiCheck, FiX } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusConfig = {
  pending:  { label:"Pending",  bg:"#fef3c7", color:"#d97706", border:"#fde68a" },
  seen:     { label:"Seen",     bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
  accepted: { label:"Accepted", bg:"#f0fdf4", color:"#059669", border:"#bbf7d0" },
  rejected: { label:"Rejected", bg:"#fef2f2", color:"#dc2626", border:"#fecaca" },
};

const InquiriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  }, []);

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

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const counts = { all: inquiries.length, pending: inquiries.filter(i=>i.status==="pending").length, seen: inquiries.filter(i=>i.status==="seen").length, accepted: inquiries.filter(i=>i.status==="accepted").length, rejected: inquiries.filter(i=>i.status==="rejected").length };

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

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary"/></div>;

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e293b,#1d4ed8)", padding:"2.5rem 0 3.5rem" }}>
        <div className="container" style={{ maxWidth:900 }}>
          <button onClick={() => navigate(-1)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", borderRadius:10, padding:"0.45rem 1rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.875rem", fontWeight:600, fontFamily:"var(--font-body)", marginBottom:"1rem" }}>
            <FiArrowLeft size={14}/> Back
          </button>
          <h1 style={{ fontFamily:"var(--font-heading)", fontSize:"2rem", fontWeight:800, color:"#fff", margin:0 }}>📬 Visit Inquiries</h1>
          <p style={{ color:"rgba(255,255,255,0.65)", margin:"0.3rem 0 0" }}>Students interested in your listings</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth:900, marginTop:"-2rem", paddingBottom:"3rem" }}>
        {/* Filter tabs + Clear button */}
        <div style={{ display:"flex", gap:"0.8rem", alignItems:"center", marginBottom:"1.5rem" }}>
        <div style={{ background:"#fff", borderRadius:16, padding:"0.5rem", display:"flex", gap:"0.3rem", flex:1, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", flexWrap:"wrap" }}>
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ flex:1, minWidth:80, padding:"0.6rem 0.5rem", borderRadius:10, border:"none", background: filter===key ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "transparent", color: filter===key ? "#fff" : "#64748b", fontWeight:700, cursor:"pointer", fontSize:"0.82rem", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem" }}>
              {key.charAt(0).toUpperCase()+key.slice(1)}
              <span style={{ background: filter===key ? "rgba(255,255,255,0.25)" : "#f1f5f9", color: filter===key ? "#fff" : "#64748b", borderRadius:20, padding:"0.1rem 0.5rem", fontSize:"0.72rem", fontWeight:800 }}>{count}</span>
            </button>
          ))}
        </div>
        {filtered.length > 0 && (
          <button onClick={() => setClearModal(true)}
            style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:12, padding:"0.6rem 1.1rem", fontWeight:700, cursor:"pointer", fontSize:"0.82rem", fontFamily:"var(--font-body)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
            🗑️ Clear {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()+filter.slice(1)}
          </button>
        )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background:"#fff", borderRadius:20, padding:"4rem 2rem", textAlign:"center", boxShadow:"0 4px 24px rgba(15,23,42,0.08)" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📭</div>
            <h3 style={{ fontFamily:"var(--font-heading)", color:"#0f172a", marginBottom:"0.5rem" }}>No inquiries yet</h3>
            <p style={{ color:"#94a3b8" }}>Students will appear here when they request a visit</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {filtered.map(inquiry => {
              const sc = statusConfig[inquiry.status] || statusConfig.pending;
              const imgSrc = inquiry.boarding?.image ? `${IMAGE_BASE}${inquiry.boarding.image}` : null;
              return (
                <div key={inquiry._id} style={{ background:"#fff", borderRadius:16, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", overflow:"hidden", border:`1.5px solid ${inquiry.status==="pending"?"#fde68a":"#f1f5f9"}` }}>
                  {/* Listing info bar */}
                  <div style={{ background:"#f8fafc", padding:"0.75rem 1.2rem", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:"0.8rem" }}>
                    {imgSrc && <img src={imgSrc} alt="" style={{ width:36, height:32, objectFit:"cover", borderRadius:6 }} onError={e=>e.target.style.display="none"}/>}
                    <div style={{ flex:1, minWidth:0 }}>
                      <Link to={`/boarding/${inquiry.boarding?._id}`} style={{ fontWeight:700, fontSize:"0.85rem", color:"#0f172a", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                        <FiHome size={12}/>{inquiry.boarding?.title || "Listing"}
                      </Link>
                      <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>{inquiry.boarding?.location}</div>
                    </div>
                    <span style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, padding:"0.25rem 0.75rem", borderRadius:20, fontSize:"0.75rem", fontWeight:700, flexShrink:0 }}>{sc.label}</span>
                  </div>

                  {/* Inquiry content */}
                  <div style={{ padding:"1.2rem" }}>
                    <div className="row g-2" style={{ marginBottom:"0.8rem" }}>
                      <div className="col-md-6">
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.4rem" }}>
                          <span style={{ fontSize:"1.1rem" }}>👤</span>
                          <span style={{ fontWeight:700, color:"#0f172a", fontSize:"0.95rem" }}>{inquiry.name}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"#64748b", fontSize:"0.82rem", marginBottom:"0.3rem" }}>
                          <FiMail size={12}/>{inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"#64748b", fontSize:"0.82rem" }}>
                            <FiPhone size={12}/>{inquiry.phone}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        {inquiry.visitDate && (
                          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"#2563eb", fontSize:"0.85rem", fontWeight:600, marginBottom:"0.4rem" }}>
                            <FiCalendar size={13}/>Preferred: {new Date(inquiry.visitDate).toLocaleDateString("en-LK", { weekday:"short", year:"numeric", month:"short", day:"numeric" })}
                          </div>
                        )}
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"#94a3b8", fontSize:"0.75rem" }}>
                          <FiClock size={11}/>{new Date(inquiry.createdAt).toLocaleDateString("en-LK", { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div style={{ background:"#f8fafc", borderRadius:10, padding:"0.85rem 1rem", marginBottom:"1rem", borderLeft:"3px solid #2563eb" }}>
                      <p style={{ margin:0, fontSize:"0.875rem", color:"#374151", lineHeight:1.7 }}>"{inquiry.message}"</p>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center" }}>
                      {inquiry.status === "accepted" ? (
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"0.5rem 1rem" }}>
                          <span style={{ fontSize:"1rem" }}>✅</span>
                          <div>
                            <div style={{ fontSize:"0.78rem", fontWeight:800, color:"#059669" }}>Visit Accepted</div>
                            <div style={{ fontSize:"0.72rem", color:"#64748b" }}>Student has been notified</div>
                          </div>
                        </div>
                      ) : inquiry.status === "rejected" ? (
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"0.5rem 1rem" }}>
                          <span style={{ fontSize:"1rem" }}>❌</span>
                          <div>
                            <div style={{ fontSize:"0.78rem", fontWeight:800, color:"#dc2626" }}>Visit Rejected</div>
                            <div style={{ fontSize:"0.72rem", color:"#64748b" }}>Student has been notified</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {inquiry.status === "pending" && (
                            <button onClick={() => handleStatus(inquiry._id, "seen")}
                              style={{ background:"#eff6ff", color:"#2563eb", border:"1px solid #bfdbfe", borderRadius:8, padding:"0.45rem 0.9rem", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>
                              👁 Mark Seen
                            </button>
                          )}
                          <button onClick={() => handleStatus(inquiry._id, "accepted")}
                            style={{ background:"#f0fdf4", color:"#059669", border:"1px solid #bbf7d0", borderRadius:8, padding:"0.45rem 0.9rem", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                            <FiCheck size={12}/> Accept
                          </button>
                          <button onClick={() => handleStatus(inquiry._id, "rejected")}
                            style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:8, padding:"0.45rem 0.9rem", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                            <FiX size={12}/> Reject
                          </button>
                        </>
                      )}
                      <a href={`mailto:${inquiry.email}`}
                        style={{ background:"#f8fafc", color:"#64748b", border:"1px solid #e2e8f0", borderRadius:8, padding:"0.45rem 0.9rem", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                        <FiMail size={12}/> Reply by Email
                      </a>
                      <button onClick={() => setDeleteModal(inquiry._id)}
                        style={{ background:"transparent", color:"#94a3b8", border:"1px solid #e2e8f0", borderRadius:8, padding:"0.45rem 0.65rem", fontSize:"0.78rem", cursor:"pointer", display:"flex", alignItems:"center" }}>
                        <FiTrash2 size={13}/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {clearModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setClearModal(false); }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:420, boxShadow:"0 24px 64px rgba(0,0,0,0.2)", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fef2f2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:"1.5rem" }}>🗑️</div>
            <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"0.5rem" }}>
              Clear {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()+filter.slice(1)} Inquiries?
            </h3>
            <p style={{ color:"#64748b", fontSize:"0.9rem", marginBottom:"0.5rem" }}>
              This will permanently delete <strong>{filtered.length}</strong> {filter === 'all' ? '' : filter} {filtered.length === 1 ? 'inquiry' : 'inquiries'}.
            </p>
            <p style={{ color:"#94a3b8", fontSize:"0.8rem", marginBottom:"1.5rem" }}>This action cannot be undone.</p>
            <div style={{ display:"flex", gap:"0.8rem" }}>
              <button onClick={() => setClearModal(false)}
                style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                Cancel
              </button>
              <button onClick={handleClear} disabled={clearing}
                style={{ flex:1, background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem", opacity:clearing?0.7:1 }}>
                {clearing ? 'Clearing...' : 'Yes, Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:400, boxShadow:"0 24px 64px rgba(0,0,0,0.2)", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fef2f2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:"1.5rem" }}>🗑️</div>
            <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"0.5rem" }}>Delete Inquiry?</h3>
            <p style={{ color:"#64748b", fontSize:"0.9rem", marginBottom:"1.5rem" }}>This will permanently remove this inquiry. This action cannot be undone.</p>
            <div style={{ display:"flex", gap:"0.8rem" }}>
              <button onClick={() => setDeleteModal(null)}
                style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteModal)}
                style={{ flex:1, background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
