import React from 'react';

const ConfirmModal = ({ isOpen, title, message, confirmText, confirmColor, onConfirm, onCancel, icon }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'1rem',
      }}
    >
      {/* Backdrop */}
      <div style={{
        position:'absolute', inset:0,
        background:'rgba(15,23,42,0.55)',
        backdropFilter:'blur(4px)',
      }} />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:'relative', background:'#fff',
          borderRadius:20, padding:'2rem',
          width:'100%', maxWidth:400,
          boxShadow:'0 24px 60px rgba(15,23,42,0.25)',
          animation:'modalPop 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Icon */}
        <div style={{
          width:56, height:56, borderRadius:16,
          background: confirmColor === 'red' ? '#fef2f2' : '#eff6ff',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.6rem', margin:'0 auto 1.2rem',
        }}>
          {icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:'var(--font-heading)', fontSize:'1.25rem',
          fontWeight:800, color:'#0f172a', textAlign:'center',
          marginBottom:'0.5rem',
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          color:'#64748b', fontSize:'0.9rem', textAlign:'center',
          lineHeight:1.6, marginBottom:'1.8rem',
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex:1, padding:'0.75rem',
              background:'#f1f5f9', color:'#475569',
              border:'none', borderRadius:12,
              fontFamily:'var(--font-heading)', fontWeight:700,
              fontSize:'0.9rem', cursor:'pointer',
              transition:'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background='#f1f5f9'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex:1, padding:'0.75rem',
              background: confirmColor === 'red'
                ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
                : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color:'#fff', border:'none', borderRadius:12,
              fontFamily:'var(--font-heading)', fontWeight:700,
              fontSize:'0.9rem', cursor:'pointer',
              boxShadow: confirmColor === 'red'
                ? '0 4px 14px rgba(220,38,38,0.35)'
                : '0 4px 14px rgba(37,99,235,0.35)',
              transition:'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity:0; transform:scale(0.85) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;