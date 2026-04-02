import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiHome, FiMessageSquare } from "react-icons/fi";
import api from "../api/axios";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const statusConfig = {
  pending:  { label:"Pending",   bg:"#fef3c7", color:"#d97706", border:"#fde68a", icon:"⏳", desc:"Your request is waiting for the owner to review." },
  seen:     { label:"Seen",      bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe", icon:"👁",  desc:"The owner has seen your request." },
  accepted: { label:"Accepted",  bg:"#f0fdf4", color:"#059669", border:"#bbf7d0", icon:"✅", desc:"Great news! The owner accepted your visit request." },
  rejected: { label:"Rejected",  bg:"#fef2f2", color:"#dc2626", border:"#fecaca", icon:"❌", desc:"The owner is unable to accommodate your visit." },
};

const roomTypeColors = {
  Single:{ bg:"#dbeafe", color:"#1d4ed8" },
  Double:{ bg:"#d1fae5", color:"#065f46" },
  Triple:{ bg:"#fef3c7", color:"#92400e" },
  Annex:{ bg:"#ede9fe", color:"#5b21b6" },
  Other:{ bg:"#f1f5f9", color:"#475569" },
};

const MyInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [clearModal, setClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    api.get("/inquiries/student/mine")
      .then(res => setInquiries(res.data.inquiries || []))
      .catch(() => setError("Could not load your inquiries."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === "pending").length,
    seen: inquiries.filter(i => i.status === "seen").length,
    accepted: inquiries.filter(i => i.status === "accepted").length,
    rejected: inquiries.filter(i => i.status === "rejected").length,
  };

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

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary"/></div>;

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.miq-card{animation:fadeUp 0.3s ease forwards}`}</style>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e293b 0%,#1d4ed8 100%)", padding:"2.5rem 0 3.5rem" }}>
        <div className="container" style={{ maxWidth:860 }}>
          <button onClick={() => navigate(-1)}
            style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", borderRadius:10, padding:"0.45rem 1rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.875rem", fontWeight:600, fontFamily:"var(--font-body)", marginBottom:"1rem" }}>
            <FiArrowLeft size={14}/> Back
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem" }}>📬</div>
            <div>
              <h1 style={{ fontFamily:"var(--font-heading)", fontSize:"2rem", fontWeight:800, color:"#fff", margin:0 }}>My Inquiries</h1>
              <p style={{ color:"rgba(255,255,255,0.65)", margin:0, fontSize:"0.9rem" }}>Track your visit requests and responses from owners</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", gap:"0.8rem", marginTop:"1.5rem", flexWrap:"wrap" }}>
            {[
              { label:"Total Sent", value:counts.all, color:"#fff" },
              { label:"Accepted", value:counts.accepted, color:"#6ee7b7" },
              { label:"Pending", value:counts.pending, color:"#fcd34d" },
              { label:"Rejected", value:counts.rejected, color:"#fca5a5" },
            ].map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"0.6rem 1.2rem", textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-heading)", fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.6)", fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth:860, marginTop:"-2rem", paddingBottom:"3rem" }}>

        {/* Filter tabs + Clear */}
        <div style={{ display:"flex", gap:"0.8rem", alignItems:"center", marginBottom:"1.5rem" }}>
        <div style={{ background:"#fff", borderRadius:16, padding:"0.5rem", display:"flex", gap:"0.3rem", flex:1, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", flexWrap:"wrap" }}>
          {Object.entries(counts).map(([key, count]) => {
            const sc = key !== "all" ? statusConfig[key] : null;
            return (
              <button key={key} onClick={() => setFilter(key)}
                style={{ flex:1, minWidth:80, padding:"0.6rem 0.5rem", borderRadius:10, border:"none", background: filter===key ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "transparent", color: filter===key ? "#fff" : "#64748b", fontWeight:700, cursor:"pointer", fontSize:"0.82rem", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", transition:"all 0.15s" }}>
                {sc && <span>{sc.icon}</span>}
                {key.charAt(0).toUpperCase()+key.slice(1)}
                <span style={{ background: filter===key ? "rgba(255,255,255,0.25)" : "#f1f5f9", color: filter===key ? "#fff" : "#64748b", borderRadius:20, padding:"0.1rem 0.45rem", fontSize:"0.72rem", fontWeight:800 }}>{count}</span>
              </button>
            );
          })}
        </div>
        {filtered.length > 0 && (
          <button onClick={() => setClearModal(true)}
            style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:12, padding:"0.6rem 1.1rem", fontWeight:700, cursor:"pointer", fontSize:"0.82rem", fontFamily:"var(--font-body)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
            🗑️ Clear {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()+filter.slice(1)}
          </button>
        )}
        </div>

        {error && (
          <div style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:12, padding:"1rem", marginBottom:"1rem", textAlign:"center" }}>{error}</div>
        )}

        {filtered.length === 0 ? (
          <div style={{ background:"#fff", borderRadius:20, padding:"4rem 2rem", textAlign:"center", boxShadow:"0 4px 24px rgba(15,23,42,0.08)" }}>
            <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>📭</div>
            <h3 style={{ fontFamily:"var(--font-heading)", color:"#0f172a", marginBottom:"0.5rem" }}>
              {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
            </h3>
            <p style={{ color:"#94a3b8", marginBottom:"1.5rem" }}>
              {filter === "all" ? "Browse listings and send a visit request to get started!" : `You have no ${filter} inquiries at the moment.`}
            </p>
            <Link to="/">
              <button style={{ background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", border:"none", borderRadius:12, padding:"0.75rem 2rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                🏠 Browse Listings
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {filtered.map((inquiry, idx) => {
              const sc = statusConfig[inquiry.status] || statusConfig.pending;
              const rtc = roomTypeColors[inquiry.boarding?.roomType] || roomTypeColors.Other;
              const imgSrc = inquiry.boarding?.image ? `${IMAGE_BASE}${inquiry.boarding.image}` : null;

              return (
                <div key={inquiry._id} className="miq-card"
                  style={{ background:"#fff", borderRadius:18, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", overflow:"hidden", border:`1.5px solid ${sc.border}`, animationDelay:`${idx*0.05}s` }}>

                  {/* Status banner */}
                  <div style={{ background:sc.bg, padding:"0.65rem 1.2rem", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${sc.border}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                      <span style={{ fontSize:"1rem" }}>{sc.icon}</span>
                      <span style={{ fontWeight:800, color:sc.color, fontSize:"0.85rem" }}>{sc.label}</span>
                      <span style={{ color:sc.color, fontSize:"0.8rem", opacity:0.8 }}>— {sc.desc}</span>
                    </div>
                    <span style={{ fontSize:"0.72rem", color:sc.color, opacity:0.7, display:"flex", alignItems:"center", gap:"0.3rem" }}>
                      <FiClock size={11}/>{new Date(inquiry.updatedAt).toLocaleDateString("en-LK", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                    </span>
                  </div>

                  <div style={{ padding:"1.2rem" }}>
                    <div className="row g-3">
                      {/* Left - Listing info */}
                      <div className="col-md-5">
                        <Link to={`/boarding/${inquiry.boarding?._id}`} style={{ textDecoration:"none" }}>
                          <div style={{ display:"flex", gap:"0.8rem", alignItems:"flex-start", padding:"0.85rem", background:"#f8fafc", borderRadius:12, border:"1px solid #e2e8f0", transition:"all 0.15s", cursor:"pointer" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor="#2563eb"}
                            onMouseLeave={e => e.currentTarget.style.borderColor="#e2e8f0"}>
                            {imgSrc ? (
                              <img src={imgSrc} alt="" style={{ width:56, height:48, objectFit:"cover", borderRadius:8, flexShrink:0 }} onError={e=>e.target.style.display="none"}/>
                            ) : (
                              <div style={{ width:56, height:48, background:"linear-gradient(135deg,#1e293b,#334155)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>🏠</div>
                            )}
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontWeight:800, fontSize:"0.88rem", color:"#0f172a", lineHeight:1.3, marginBottom:"0.3rem" }}>{inquiry.boarding?.title || "Listing"}</div>
                              <div style={{ fontSize:"0.75rem", color:"#64748b", display:"flex", alignItems:"center", gap:"0.3rem", marginBottom:"0.3rem" }}>
                                <FiMapPin size={10}/>{inquiry.boarding?.location}
                              </div>
                              <div style={{ display:"flex", gap:"0.4rem", alignItems:"center" }}>
                                <span style={{ background:rtc.bg, color:rtc.color, fontSize:"0.68rem", fontWeight:700, padding:"0.1rem 0.5rem", borderRadius:20 }}>{inquiry.boarding?.roomType}</span>
                                {inquiry.boarding?.price && <span style={{ fontSize:"0.75rem", color:"#2563eb", fontWeight:700 }}>LKR {inquiry.boarding.price.toLocaleString()}/mo</span>}
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Owner info */}
                        {inquiry.owner && (
                          <div style={{ marginTop:"0.6rem", padding:"0.6rem 0.85rem", background:"#f0f9ff", borderRadius:10, border:"1px solid #bae6fd", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", flexShrink:0 }}>👤</div>
                            <div>
                              <div style={{ fontSize:"0.75rem", color:"#0369a1", fontWeight:700 }}>{inquiry.owner.name}</div>
                              <div style={{ fontSize:"0.7rem", color:"#64748b" }}>{inquiry.owner.email}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right - Inquiry details */}
                      <div className="col-md-7">
                        <div style={{ display:"flex", gap:"1rem", marginBottom:"0.8rem", flexWrap:"wrap" }}>
                          {inquiry.visitDate && (
                            <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:"0.4rem 0.75rem" }}>
                              <FiCalendar size={13} color="#2563eb"/>
                              <span style={{ fontSize:"0.8rem", fontWeight:700, color:"#1d4ed8" }}>
                                {new Date(inquiry.visitDate).toLocaleDateString("en-LK", { weekday:"short", year:"numeric", month:"short", day:"numeric" })}
                              </span>
                            </div>
                          )}
                          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", color:"#94a3b8", fontSize:"0.75rem" }}>
                            <FiClock size={11}/>
                            Sent {new Date(inquiry.createdAt).toLocaleDateString("en-LK", { month:"short", day:"numeric", year:"numeric" })}
                          </div>
                        </div>

                        {/* Message */}
                        <div style={{ background:"#f8fafc", borderRadius:10, padding:"0.85rem 1rem", borderLeft:"3px solid #2563eb", marginBottom:"0.8rem" }}>
                          <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.3rem", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                            <FiMessageSquare size={10}/> Your Message
                          </div>
                          <p style={{ margin:0, fontSize:"0.875rem", color:"#374151", lineHeight:1.7 }}>"{inquiry.message}"</p>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                          <Link to={`/boarding/${inquiry.boarding?._id}`}>
                            <button style={{ background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", border:"none", borderRadius:8, padding:"0.5rem 1rem", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                              <FiHome size={12}/> View Listing
                            </button>
                          </Link>
                          {inquiry.status === "accepted" && (
                            <a href={`mailto:${inquiry.owner?.email}`}
                              style={{ background:"#f0fdf4", color:"#059669", border:"1px solid #bbf7d0", borderRadius:8, padding:"0.5rem 1rem", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                              📧 Contact Owner
                            </a>
                          )}
                          <button onClick={() => setDeleteModal(inquiry._id)}
                            style={{ background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:8, padding:"0.5rem 0.75rem", fontSize:"0.8rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                            title="Delete this request">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Single Modal */}
      {deleteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:400, boxShadow:"0 24px 64px rgba(0,0,0,0.2)", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fef2f2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:"1.5rem" }}>🗑️</div>
            <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"0.5rem" }}>Delete This Request?</h3>
            <p style={{ color:"#64748b", fontSize:"0.9rem", marginBottom:"1.5rem" }}>This will permanently remove this visit request. This action cannot be undone.</p>
            <div style={{ display:"flex", gap:"0.8rem" }}>
              <button onClick={() => setDeleteModal(null)}
                style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteOne(deleteModal)}
                style={{ flex:1, background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", border:"none", borderRadius:12, padding:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.9rem" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {clearModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setClearModal(false); }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:420, boxShadow:"0 24px 64px rgba(0,0,0,0.2)", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fef2f2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:"1.5rem" }}>🗑️</div>
            <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"0.5rem" }}>
              Clear {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()+filter.slice(1)} Requests?
            </h3>
            <p style={{ color:"#64748b", fontSize:"0.9rem", marginBottom:"0.5rem" }}>
              This will permanently delete <strong>{filtered.length}</strong> {filter === 'all' ? '' : filter} {filtered.length === 1 ? 'request' : 'requests'}.
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
    </div>
  );
};

export default MyInquiriesPage;
