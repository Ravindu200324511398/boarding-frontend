import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiMapPin, FiDollarSign, FiUsers, FiPhone,
  FiFileText, FiPlus, FiX, FiUpload, FiSave, FiZap,
  FiCheckCircle, FiAlertCircle, FiRefreshCw, FiEdit3
} from 'react-icons/fi';
import api from '../api/axios';

// ── 1. CONSTANTS & STATIC STYLES (Moved Outside) ──────────
const AMENITY_OPTIONS = [
  'WiFi', 'Hot Water', 'Air Conditioning', 'Fan', 'Attached Bathroom',
  'Kitchen Access', 'Laundry', 'Parking', 'Furnished', 'Study Desk',
  'CCTV', 'Private Entrance', 'Common Kitchen', 'Meals Available',
];

const ROOM_TYPES  = ['Single', 'Double', 'Triple', 'Annex', 'Studio'];
const GENDER_OPTS = ['Any', 'Male', 'Female'];

const inpBaseStyle = { 
  border: 'none', 
  outline: 'none', 
  flex: 1, 
  padding: '0.75rem 1rem', 
  fontSize: '0.95rem', 
  fontFamily: 'var(--font-body)', 
  background: 'transparent', 
  color: '#0f172a', 
  width: '100%' 
};

// ── 2. HELPER COMPONENTS (Moved Outside to fix focus issue) ──

const AIButton = ({ onClick, loading, label, icon, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
        background: isPrimary
          ? 'linear-gradient(135deg, #6d28d9, #2563eb)'
          : 'rgba(109,40,217,0.08)',
        color: isPrimary ? '#fff' : '#6d28d9',
        border: isPrimary ? 'none' : '1.5px solid rgba(109,40,217,0.25)',
        borderRadius: 10, padding: isPrimary ? '0.65rem 1.2rem' : '0.5rem 1rem',
        fontFamily: 'var(--font-body)', fontWeight: 700,
        fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1, transition: 'all 0.18s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading
        ? <><span className="spinner-border spinner-border-sm" style={{ width: '0.8rem', height: '0.8rem' }} /> Generating...</>
        : <>{icon || <FiZap size={14} />} {label}</>}
    </button>
  );
};

const Field = ({ label, hint, required, children, badge }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {badge && (
        <span style={{ background: 'linear-gradient(135deg,#6d28d9,#2563eb)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.5rem', borderRadius: 20, letterSpacing: '0.06em' }}>
          {badge}
        </span>
      )}
    </div>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.3rem 0 0' }}>{hint}</p>}
  </div>
);

const AIResultCard = ({ title, description, onApply, onRegenerate, loading }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(109,40,217,0.04), rgba(37,99,235,0.04))',
    border: '1.5px solid rgba(109,40,217,0.2)',
    borderRadius: 14, padding: '1.2rem 1.3rem', marginTop: '0.8rem',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(135deg,rgba(109,40,217,0.1),transparent)', borderRadius: '0 14px 0 60px' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
      <FiZap size={14} color="#6d28d9" />
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Generated</span>
    </div>
    {title && (
      <>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.9rem', lineHeight: 1.4 }}>{title}</p>
      </>
    )}
    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
    <p style={{ fontSize: '0.88rem', color: '#374151', margin: '0 0 1rem', lineHeight: 1.65 }}>{description}</p>
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
      <button type="button" onClick={onApply}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#6d28d9,#2563eb)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
        <FiCheckCircle size={13} /> Apply to form
      </button>
      <button type="button" onClick={onRegenerate} disabled={loading}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(109,40,217,0.08)', color: '#6d28d9', border: '1.5px solid rgba(109,40,217,0.2)', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
        <FiRefreshCw size={12} /> Regenerate
      </button>
    </div>
  </div>
);

const SectionHead = ({ number, title, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6d28d9,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{number}</span>
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{title}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.1rem' }}>{sub}</div>}
    </div>
  </div>
);

const InputWrapper = ({ icon, children, isFocused }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    border: `1.5px solid ${isFocused ? '#2563eb' : '#e2e8f0'}`, 
    borderRadius: 10, 
    overflow: 'hidden', 
    transition: 'border-color 0.15s' 
  }}>
    {icon && (
      <span style={{ padding: '0 0.85rem', color: '#94a3b8', background: '#f8fafc', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0' }}>
        {icon}
      </span>
    )}
    {children}
  </div>
);

// ── 3. MAIN COMPONENT ────────────────────────────────────
const AddBoarding = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    price: '', roomType: 'Single', gender: 'Any', contact: '',
    lat: '', lng: '',
  });
  const [amenities, setAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI state
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // AI state
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiResult, setAiResult]         = useState(null);
  const [aiImproving, setAiImproving]   = useState(false);
  const [aiImproved, setAiImproved]     = useState(null);
  const [aiError, setAiError]           = useState('');

  // helpers
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleAmenity = (a) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities(prev => [...prev, trimmed]);
      setCustomAmenity('');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setImage(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!form.location || !form.price || !form.roomType) {
      setAiError('Please fill in Location, Price and Room Type before generating.');
      return;
    }
    setAiLoading(true); setAiError(''); setAiResult(null);
    try {
      const res = await api.post('/ai/generate-listing', {
        location:    form.location,
        price:       form.price,
        roomType:    form.roomType,
        amenities,
        gender:      form.gender,
        description: form.description,
      });
      setAiResult({ title: res.data.title, description: res.data.description });
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI generation failed. Please try again.');
    } finally { setAiLoading(false); }
  };

  const applyGenerated = () => {
    if (!aiResult) return;
    set('title', aiResult.title);
    set('description', aiResult.description);
    setAiResult(null);
  };

  const handleImprove = async () => {
    if (!form.description.trim()) {
      setAiError('Write something in the description field first, then click Improve.');
      return;
    }
    setAiImproving(true); setAiError(''); setAiImproved(null);
    try {
      const res = await api.post('/ai/improve-listing', {
        existingDescription: form.description,
        location:  form.location,
        roomType:  form.roomType,
        price:     form.price,
      });
      setAiImproved({ description: res.data.description });
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI improve failed. Please try again.');
    } finally { setAiImproving(false); }
  };

  const applyImproved = () => {
    if (!aiImproved) return;
    set('description', aiImproved.description);
    setAiImproved(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.price || !form.contact) {
      setError('Please fill in all required fields.'); return;
    }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      amenities.forEach(a => formData.append('amenities', a));
      if (image) formData.append('image', image);

      await api.post('/boardings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Listing created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #6d28d9 100%)', padding: '2.5rem 0 3.5rem' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
            <FiHome size={22} color="rgba(255,255,255,0.8)" />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Add Boarding Listing
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>
            Fill in the details below — or let AI write the perfect listing for you ✨
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820, marginTop: '-2rem', paddingBottom: '3rem' }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiAlertCircle size={15} /> {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiCheckCircle size={15} /> {success}
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.08)', padding: '2rem', marginBottom: '1rem' }}>
            <SectionHead number="1" title="Basic Details" sub="Location, price, and room type" />
            <div className="row g-3">
              <div className="col-md-6">
                <Field label="Location" required>
                  <InputWrapper icon={<FiMapPin size={15} />} isFocused={focused === 'location'}>
                    <input name="location" value={form.location} onChange={e => set('location', e.target.value)}
                      onFocus={() => setFocused('location')} onBlur={() => setFocused('')}
                      placeholder="e.g. Nugegoda, Colombo" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Monthly Price (LKR)" required>
                  <InputWrapper icon={<FiDollarSign size={15} />} isFocused={focused === 'price'}>
                    <input name="price" type="number" value={form.price} onChange={e => set('price', e.target.value)}
                      onFocus={() => setFocused('price')} onBlur={() => setFocused('')}
                      placeholder="e.g. 15000" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Room Type" required>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ROOM_TYPES.map(t => (
                      <button type="button" key={t} onClick={() => set('roomType', t)}
                        style={{ padding: '0.5rem 1rem', borderRadius: 8, border: `1.5px solid ${form.roomType === t ? '#2563eb' : '#e2e8f0'}`, background: form.roomType === t ? '#eff6ff' : '#f8fafc', color: form.roomType === t ? '#1d4ed8' : '#64748b', fontWeight: form.roomType === t ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Suitable For">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {GENDER_OPTS.map(g => (
                      <button type="button" key={g} onClick={() => set('gender', g)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: `1.5px solid ${form.gender === g ? '#2563eb' : '#e2e8f0'}`, background: form.gender === g ? '#eff6ff' : '#f8fafc', color: form.gender === g ? '#1d4ed8' : '#64748b', fontWeight: form.gender === g ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-12">
                <Field label="Contact Number" required>
                  <InputWrapper icon={<FiPhone size={15} />} isFocused={focused === 'contact'}>
                    <input name="contact" value={form.contact} onChange={e => set('contact', e.target.value)}
                      onFocus={() => setFocused('contact')} onBlur={() => setFocused('')}
                      placeholder="e.g. 0771234567" style={inpBaseStyle} />
                  </InputWrapper>
                </Field>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.08)', padding: '2rem', marginBottom: '1rem' }}>
            <SectionHead number="2" title="Amenities" sub="Select everything included in the rent" />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {AMENITY_OPTIONS.map(a => {
                const active = amenities.includes(a);
                return (
                  <button type="button" key={a} onClick={() => toggleAmenity(a)}
                    style={{ padding: '0.4rem 0.9rem', borderRadius: 20, border: `1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`, background: active ? '#eff6ff' : '#f8fafc', color: active ? '#1d4ed8' : '#64748b', fontWeight: active ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {active && <FiCheckCircle size={11} />}{a}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }}
                placeholder="Add custom amenity…"
                style={{ flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 1rem', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none', color: '#0f172a' }} />
              <button type="button" onClick={addCustomAmenity}
                style={{ background: '#f1f5f9', color: '#374151', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 1rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-body)' }}>
                <FiPlus size={14} /> Add
              </button>
            </div>
            {amenities.filter(a => !AMENITY_OPTIONS.includes(a)).length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.7rem' }}>
                {amenities.filter(a => !AMENITY_OPTIONS.includes(a)).map(a => (
                  <span key={a} style={{ background: '#fdf4ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: 20, padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {a}
                    <button type="button" onClick={() => toggleAmenity(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: 0, display: 'flex' }}>
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.08)', padding: '2rem', marginBottom: '1rem' }}>
            <SectionHead number="3" title="Title & Description" sub="Write your own or generate with AI" />
            {aiError && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiAlertCircle size={14} /> {aiError}
              </div>
            )}
            <div style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.03), rgba(37,99,235,0.03))', border: '1.5px dashed rgba(109,40,217,0.2)', borderRadius: 14, padding: '1.2rem 1.3rem', marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <FiZap size={15} color="#6d28d9" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>AI Listing Writer</span>
                    <span style={{ background: 'linear-gradient(135deg,#6d28d9,#2563eb)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.1rem 0.5rem', borderRadius: 20 }}>POWERED BY CLAUDE</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Fill in Section 1 first, then click Generate.
                  </p>
                </div>
                <AIButton onClick={handleGenerate} loading={aiLoading} label="Generate listing" icon={<FiZap size={14} />} variant="primary" />
              </div>
              {aiResult && <AIResultCard title={aiResult.title} description={aiResult.description} onApply={applyGenerated} onRegenerate={handleGenerate} loading={aiLoading} />}
            </div>

            <Field label="Listing Title" required>
              <InputWrapper icon={<FiHome size={15} />} isFocused={focused === 'title'}>
                <input name="title" value={form.title} onChange={e => set('title', e.target.value)}
                  onFocus={() => setFocused('title')} onBlur={() => setFocused('')}
                  placeholder="e.g. Cozy Single Room Near Moratuwa University" style={inpBaseStyle} />
              </InputWrapper>
            </Field>

            <Field label="Description" required badge="AI can improve this">
              <div style={{ border: `1.5px solid ${focused === 'desc' ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, overflow: 'hidden' }}>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  onFocus={() => setFocused('desc')} onBlur={() => setFocused('')}
                  placeholder="Describe your boarding place..."
                  rows={5}
                  style={{ width: '100%', border: 'none', outline: 'none', padding: '0.85rem 1rem', fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: '#0f172a', resize: 'vertical', background: 'transparent' }}
                />
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.6rem 0.85rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{form.description.length} characters</span>
                  <AIButton onClick={handleImprove} loading={aiImproving} label="✨ Improve with AI" variant="secondary" />
                </div>
              </div>
              {aiImproved && <AIResultCard title={null} description={aiImproved.description} onApply={applyImproved} onRegenerate={handleImprove} loading={aiImproving} />}
            </Field>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.08)', padding: '2rem', marginBottom: '1.5rem' }}>
            <SectionHead number="4" title="Photo & Map Location" sub="Optional but recommended" />
            <div className="row g-3">
              <div className="col-md-6">
                <Field label="Listing Photo">
                  <label style={{ display: 'block', cursor: 'pointer' }}>
                    <div style={{ border: `2px dashed ${imagePreview ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imagePreview ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover' }} /> : <div style={{ textAlign: 'center' }}><FiUpload size={28} color="#94a3b8" /><div style={{ fontSize: '0.85rem' }}>Click to upload</div></div>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                  </label>
                  {imagePreview && <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} style={{ marginTop: '0.5rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.4rem 0.85rem', cursor: 'pointer' }}><FiX size={12} /> Remove</button>}
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Map Coordinates">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <InputWrapper isFocused={focused === 'lat'}>
                      <input name="lat" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} onFocus={() => setFocused('lat')} onBlur={() => setFocused('')} placeholder="Latitude" style={inpBaseStyle} />
                    </InputWrapper>
                    <InputWrapper isFocused={focused === 'lng'}>
                      <input name="lng" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} onFocus={() => setFocused('lng')} onBlur={() => setFocused('')} placeholder="Longitude" style={inpBaseStyle} />
                    </InputWrapper>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, padding: '0.85rem 1.8rem', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.85rem 2.2rem', fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Publishing...' : <><FiSave size={15} /> Publish Listing</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBoarding;