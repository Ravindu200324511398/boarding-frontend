import React, { useEffect } from 'react';

const ConfirmModal = ({
  isOpen, onClose, onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = type !== 'warning';
  const accentColor = isDanger ? '#dc2626' : '#d97706';
  const accentLight = isDanger ? '#fef2f2' : '#fffbeb';
  const accentBorder = isDanger ? '#fecaca' : '#fde68a';
  const icon = isDanger ? '🗑️' : '⚠️';
  const btnBg = isDanger
    ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
    : 'linear-gradient(135deg, #d97706, #b45309)';
  const btnShadow = isDanger
    ? '0 4px 12px rgba(220,38,38,0.35)'
    : '0 4px 12px rgba(217,119,6,0.35)';

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(4px)', zIndex:9998, animation:'cmFadeIn 0.18s ease' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:9999, width:'100%', maxWidth:420, padding:'0 1rem', animation:'cmSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 24px 60px rgba(15,23,42,0.25)', overflow:'hidden' }}>
          <div style={{ height:4, background: isDanger ? 'linear-gradient(90deg,#dc2626,#f87171)' : 'linear-gradient(90deg,#d97706,#fbbf24)' }} />
          <div style={{ padding:'2rem' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:accentLight, border:`1.5px solid ${accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:'1.2rem' }}>
              {icon}
            </div>
            <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'1.2rem', color:'#0f172a', margin:'0 0 0.5rem' }}>{title}</h3>
            <p style={{ color:'#64748b', fontSize:'0.9rem', lineHeight:1.65, margin:'0 0 1.8rem' }}>{message}</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={onClose} disabled={loading}
                style={{ flex:1, padding:'0.72rem', background:'#f8fafc', color:'#475569', border:'1.5px solid #e2e8f0', borderRadius:12, fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.9rem', cursor:'pointer' }}
                onMouseEnter={e=>{e.target.style.background='#f1f5f9';}} onMouseLeave={e=>{e.target.style.background='#f8fafc';}}>
                {cancelText}
              </button>
              <button onClick={onConfirm} disabled={loading}
                style={{ flex:1, padding:'0.72rem', background: loading ? '#e2e8f0' : btnBg, color: loading ? '#94a3b8' : '#fff', border:'none', borderRadius:12, fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.9rem', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow: loading ? 'none' : btnShadow }}>
                {loading ? <><span className="spinner-border spinner-border-sm" /> Deleting...</> : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cmFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cmSlideUp {
          from{opacity:0;transform:translate(-50%,calc(-50% + 24px))}
          to{opacity:1;transform:translate(-50%,-50%)}
        }
      `}</style>
    </>
  );
};

export default ConfirmModal;
