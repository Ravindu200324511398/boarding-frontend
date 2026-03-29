import React, { useState, useRef } from 'react';
import { FiCamera, FiTrash2, FiUpload, FiX, FiCheck } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AVATAR_BASE = 'http://localhost:5001/uploads/avatars/';

const AvatarUpload = ({ size = 88, showControls = true }) => {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const avatarUrl = user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setError('Image must be under 3MB'); return; }
    if (!/image\/(jpeg|jpg|png|webp|gif)/.test(file.type)) { setError('Only JPG, PNG, WEBP or GIF allowed'); return; }
    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data.user, res.data.token);
      setPreview(null);
      setSelectedFile(null);
      setSuccess('Photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove your profile photo?')) return;
    setRemoving(true); setError(''); setSuccess('');
    try {
      const res = await api.delete('/auth/avatar');
      updateUser(res.data.user, res.data.token);
      setSuccess('Photo removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Remove failed');
    } finally { setRemoving(false); }
  };

  const displaySrc = preview || avatarUrl;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
      {/* Avatar circle */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: displaySrc ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
          border: preview ? '3px solid #2563eb' : '3px solid rgba(255,255,255,0.5)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'border-color 0.2s',
          cursor: showControls ? 'pointer' : 'default',
        }} onClick={() => showControls && fileRef.current?.click()}>
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span style={{
              fontSize: size * 0.28,
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.02em',
            }}>
              {initials}
            </span>
          )}
        </div>

        {/* Camera overlay button */}
        {showControls && (
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              position: 'absolute', bottom: 2, right: 2,
              width: size * 0.32, height: size * 0.32,
              borderRadius: '50%',
              background: '#2563eb',
              border: '2.5px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
              transition: 'background 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'scale(1)'; }}
            title="Change photo"
          >
            <FiCamera size={size * 0.14} color="#fff" />
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Action buttons — shown only when a new file is selected */}
      {selectedFile && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleUpload} disabled={uploading}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.45rem 1rem', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? <span className="spinner-border spinner-border-sm" style={{ width: '0.75rem', height: '0.75rem' }} /> : <FiCheck size={13} />}
            {uploading ? 'Saving...' : 'Save Photo'}
          </button>
          <button onClick={handleCancel} disabled={uploading}
            style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 8, padding: '0.45rem 0.85rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)' }}>
            <FiX size={13} />Cancel
          </button>
        </div>
      )}

      {/* Remove button — only shown when user has an avatar and no new selection */}
      {!selectedFile && avatarUrl && showControls && (
        <button onClick={handleRemove} disabled={removing}
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.35rem 0.85rem', cursor: removing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)' }}>
          {removing ? <span className="spinner-border spinner-border-sm" style={{ width: '0.65rem', height: '0.65rem' }} /> : <FiTrash2 size={11} />}
          Remove photo
        </button>
      )}

      {/* Upload hint — only when no photo at all */}
      {!selectedFile && !avatarUrl && showControls && (
        <button onClick={() => fileRef.current?.click()}
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '0.35rem 0.9rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', backdropFilter: 'blur(4px)' }}>
          <FiUpload size={11} />Upload Photo
        </button>
      )}

      {/* Messages */}
      {error && (
        <div style={{ fontSize: '0.78rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.35rem 0.8rem', borderRadius: 8, textAlign: 'center', maxWidth: 220 }}>
          ⚠ {error}
        </div>
      )}
      {success && (
        <div style={{ fontSize: '0.78rem', color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '0.35rem 0.8rem', borderRadius: 8, textAlign: 'center' }}>
          ✓ {success}
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
