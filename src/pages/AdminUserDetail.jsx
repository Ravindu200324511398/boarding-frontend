import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiHome, FiShield, FiTrash2, FiMapPin } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingBoarding, setDeletingBoarding] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ open: false, id: null, title: '' });

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => setData(res.data))
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteBoarding = async () => {
    setDeletingBoarding(modal.id);
    try {
      await api.delete(`/admin/boardings/${modal.id}`);
      setData(prev => ({ ...prev, boardings: prev.boardings.filter(b => b._id !== modal.id) }));
      setModal({ open: false, id: null, title: '' });
    } catch (err) { alert('Delete failed'); }
    finally { setDeletingBoarding(null); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;
  if (!data) return null;
  const { user, boardings } = data;

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteBoarding}
        loading={deletingBoarding === modal.id}
        title="Delete Listing?"
        message={`"${modal.title}" will be permanently removed from this user's account.`}
        confirmText="Yes, Delete"
        cancelText="Keep It"
        type="danger"
      />

      <div style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)', padding:'2rem 0', marginBottom:'2rem' }}>
        <div className="container">
          <button onClick={() => navigate('/admin/users')} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:8, padding:'0.45rem 1rem', cursor:'pointer', fontSize:'0.875rem', display:'inline-flex', alignItems:'center', gap:'0.4rem', marginBottom:'1rem' }}>
            <FiArrowLeft size={14} />Back to Users
          </button>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, color:'#fff', margin:0 }}>User Profile</h1>
        </div>
      </div>

      <div className="container pb-5" style={{ maxWidth:900 }}>
        <div className="row g-4">
          <div className="col-md-4">
            <div style={{ background:'#fff', borderRadius:16, padding:'2rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', textAlign:'center' }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg, #2563eb, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'2rem', margin:'0 auto 1.2rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', marginBottom:'0.3rem' }}>{user.name}</h3>
              <span style={{ background: user.isAdmin ? '#ede9fe' : '#f0fdf4', color: user.isAdmin ? '#7c3aed' : '#059669', padding:'0.3rem 0.9rem', borderRadius:20, fontSize:'0.8rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                {user.isAdmin ? <><FiShield size={12} />Admin</> : <><FiUser size={12} />Regular User</>}
              </span>

              <div style={{ marginTop:'1.5rem', textAlign:'left' }}>
                {[
                  { icon:<FiMail size={14} color="#2563eb" />, label:'Email', val:user.email },
                  { icon:<FiCalendar size={14} color="#2563eb" />, label:'Joined', val:new Date(user.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) },
                  { icon:<FiHome size={14} color="#2563eb" />, label:'Listings', val:`${boardings.length} boarding${boardings.length !== 1 ? 's' : ''}` },
                ].map((row,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.7rem', padding:'0.8rem 0', borderBottom:i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width:30, height:30, background:'#dbeafe', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{row.icon}</div>
                    <div><div style={{ fontSize:'0.72rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{row.label}</div><div style={{ fontSize:'0.875rem', fontWeight:600, color:'#0f172a', marginTop:'0.1rem' }}>{row.val}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div style={{ background:'#fff', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0' }}>
              <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', marginBottom:'1.2rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <FiHome size={16} color="#2563eb" /> Their Listings ({boardings.length})
              </h4>
              {boardings.length === 0 ? (
                <div style={{ textAlign:'center', padding:'2.5rem', color:'#94a3b8' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🏠</div>
                  <p>This user has no listings yet.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  {boardings.map(b => {
                    const imgUrl = b.image ? `${IMAGE_BASE}${b.image}` : null;
                    return (
                      <div key={b._id} style={{ display:'flex', gap:'1rem', padding:'1rem', borderRadius:12, border:'1px solid #e2e8f0', alignItems:'center', background:'#fafbfc' }}>
                        {imgUrl
                          ? <img src={imgUrl} alt={b.title} style={{ width:72, height:60, objectFit:'cover', borderRadius:10, flexShrink:0 }} />
                          : <div style={{ width:72, height:60, background:'#e2e8f0', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🏠</div>}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0f172a', marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</div>
                          <div style={{ fontSize:'0.78rem', color:'#64748b', display:'flex', alignItems:'center', gap:'0.3rem', marginBottom:'0.2rem' }}><FiMapPin size={11} />{b.location}</div>
                          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#2563eb' }}>LKR {b.price.toLocaleString()}/month</div>
                        </div>
                        <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                          <Link to={`/boarding/${b._id}`} target="_blank">
                            <button style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                              <FiHome size={12} />View
                            </button>
                          </Link>
                          <button
                            onClick={() => setModal({ open: true, id: b._id, title: b.title })}
                            disabled={deletingBoarding === b._id}
                            style={{ background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                            {deletingBoarding === b._id ? <span className="spinner-border spinner-border-sm" /> : <FiTrash2 size={12} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;