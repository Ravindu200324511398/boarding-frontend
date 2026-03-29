import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTrash2, FiEye, FiShield, FiUser, FiSearch } from 'react-icons/fi';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [adminModal, setAdminModal] = useState({ open: false, id: null, name: '', isAdmin: false });

  useEffect(() => {
    api.get('/admin/users')
      .then(res => { setUsers(res.data.users); setFiltered(res.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  }, [search, users]);

  const handleDelete = async () => {
    setDeletingId(deleteModal.id);
    try {
      await api.delete(`/admin/users/${deleteModal.id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, name: '' });
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleToggleAdmin = async () => {
    setTogglingId(adminModal.id);
    try {
      const res = await api.patch(`/admin/users/${adminModal.id}/toggle-admin`);
      setUsers(prev => prev.map(u => u._id === adminModal.id ? { ...u, isAdmin: res.data.isAdmin } : u));
      setAdminModal({ open: false, id: null, name: '', isAdmin: false });
    } catch (err) { alert('Failed to update admin status'); }
    finally { setTogglingId(null); }
  };

  return (
    <div>
      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: '' })}
        onConfirm={handleDelete}
        loading={deletingId === deleteModal.id}
        title="Delete User?"
        message={`"${deleteModal.name}" and all their listings will be permanently deleted. This cannot be undone.`}
        confirmText="Yes, Delete User"
        cancelText="Cancel"
        type="danger"
      />

      {/* Toggle Admin Modal */}
      <ConfirmModal
        isOpen={adminModal.open}
        onClose={() => setAdminModal({ open: false, id: null, name: '', isAdmin: false })}
        onConfirm={handleToggleAdmin}
        loading={togglingId === adminModal.id}
        title={adminModal.isAdmin ? 'Remove Admin?' : 'Make Admin?'}
        message={adminModal.isAdmin
          ? `"${adminModal.name}" will lose all admin privileges.`
          : `"${adminModal.name}" will gain full admin access to the dashboard.`}
        confirmText={adminModal.isAdmin ? 'Yes, Remove Admin' : 'Yes, Make Admin'}
        cancelText="Cancel"
        type="warning"
      />

      <div style={{ background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding:'2.5rem 0', marginBottom:'2rem' }}>
        <div className="container">
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.8rem', fontWeight:800, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:'0.8rem' }}>
            <FiUsers size={22} color="#60a5fa" /> User Management
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', margin:'0.3rem 0 0', fontSize:'0.95rem' }}>
            {users.length} total accounts registered
          </p>
        </div>
      </div>

      <div className="container pb-5">
        <div style={{ background:'#fff', borderRadius:16, padding:'1.2rem 1.5rem', boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.8rem' }}>
          <FiSearch color="#94a3b8" size={18} />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border:'none', outline:'none', flex:1, fontSize:'0.95rem', fontFamily:'var(--font-body)', color:'#0f172a', background:'transparent' }} />
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'0.85rem' }}>Clear</button>}
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner-border text-primary" /></div>
        ) : (
          <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 4px 24px rgba(15,23,42,0.08)', border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                    {['User','Email','Role','Listings','Joined','Actions'].map(h => (
                      <th key={h} style={{ padding:'1rem 1.2rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg, #2563eb, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.95rem', flexShrink:0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight:600, fontSize:'0.875rem', color:'#0f172a' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'1rem 1.2rem', fontSize:'0.875rem', color:'#64748b' }}>{u.email}</td>
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <span style={{ background: u.isAdmin ? '#ede9fe' : '#f0fdf4', color: u.isAdmin ? '#7c3aed' : '#059669', padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                          {u.isAdmin ? <><FiShield size={11} />Admin</> : <><FiUser size={11} />User</>}
                        </span>
                      </td>
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <span style={{ background:'#dbeafe', color:'#1d4ed8', padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700 }}>
                          {u.boardingCount} listing{u.boardingCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td style={{ padding:'1rem 1.2rem', fontSize:'0.82rem', color:'#94a3b8', whiteSpace:'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                      </td>
                      <td style={{ padding:'1rem 1.2rem' }}>
                        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'nowrap' }}>
                          <Link to={`/admin/users/${u._id}`}>
                            <button title="View Details" style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', fontWeight:600 }}>
                              <FiEye size={13} />View
                            </button>
                          </Link>
                          <button
                            onClick={() => setAdminModal({ open: true, id: u._id, name: u.name, isAdmin: u.isAdmin })}
                            disabled={togglingId === u._id}
                            title={u.isAdmin ? 'Remove admin' : 'Make admin'}
                            style={{ background: u.isAdmin ? '#fef3c7' : '#ede9fe', color: u.isAdmin ? '#d97706' : '#7c3aed', border:'none', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', fontWeight:600 }}>
                            <FiShield size={13} />{u.isAdmin ? 'Demote' : 'Admin'}
                          </button>
                          {!u.isAdmin && (
                            <button
                              onClick={() => setDeleteModal({ open: true, id: u._id, name: u.name })}
                              disabled={deletingId === u._id}
                              title="Delete user"
                              style={{ background:'#fef2f2', color:'#dc2626', border:'none', borderRadius:8, padding:'0.4rem 0.7rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', fontWeight:600 }}>
                              {deletingId === u._id ? <span className="spinner-border spinner-border-sm" /> : <FiTrash2 size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>No users found matching "{search}"</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;