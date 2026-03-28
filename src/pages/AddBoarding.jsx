import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiMapPin, FiPhone, FiInfo, FiCheck } from 'react-icons/fi';
import api from '../api/axios';

const AddBoarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', price:'', location:'', lat:'', lng:'', roomType:'Single', amenities:'', contact:'' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => { setForm({...form,[e.target.name]:e.target.value}); setError(''); };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const formData = new FormData();
    Object.entries(form).forEach(([k,v]) => formData.append(k,v));
    if (image) formData.append('image', image);
    try {
      await api.post('/boardings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Boarding listed successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add boarding.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{background:'var(--cream)',minHeight:'100vh'}}>
      <div className="page-header">
        <div className="container">
          <h1>🏠 List a Boarding Place</h1>
          <p>Fill in the details below to publish your listing</p>
        </div>
      </div>

      <div className="container pb-5" style={{maxWidth:760}}>
        {error && <div className="alert-custom alert-danger-custom mb-3">⚠️ {error}</div>}
        {success && <div className="alert-custom alert-success-custom mb-3"><FiCheck /> {success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section">
            <div className="form-section-title">📝 Basic Information</div>
            <div className="mb-3">
              <label className="form-label">Boarding Title *</label>
              <input type="text" name="title" className="form-control"
                placeholder="e.g. Cozy Single Room near University of Peradeniya"
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" rows={5}
                placeholder="Describe the room, house rules, nearby facilities, and what makes it special..."
                value={form.description} onChange={handleChange} required />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Monthly Price (LKR) *</label>
                <input type="number" name="price" className="form-control" placeholder="e.g. 8000"
                  value={form.price} onChange={handleChange} required min="0" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Room Type</label>
                <select name="roomType" className="form-select" value={form.roomType} onChange={handleChange}>
                  {['Single','Double','Triple','Annex','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <div className="form-section-title"><FiMapPin size={14} /> Location Details</div>
            <div className="mb-3">
              <label className="form-label">Address / Location *</label>
              <input type="text" name="location" className="form-control" placeholder="e.g. Asgiriya, Kandy"
                value={form.location} onChange={handleChange} required />
            </div>
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label">Latitude</label>
                <input type="number" name="lat" step="any" className="form-control" placeholder="e.g. 7.2906"
                  value={form.lat} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Longitude</label>
                <input type="number" name="lng" step="any" className="form-control" placeholder="e.g. 80.6337"
                  value={form.lng} onChange={handleChange} />
              </div>
            </div>
            <div style={{background:'var(--gold-light)',border:'1px solid #e8d5a0',borderRadius:'10px',padding:'0.8rem 1rem',fontSize:'0.82rem',color:'var(--ink-soft)',display:'flex',alignItems:'flex-start',gap:'0.5rem'}}>
              <FiInfo size={14} style={{marginTop:'0.1rem',flexShrink:0,color:'var(--gold)'}} />
              <span>Get coordinates from <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{color:'var(--terracotta)',fontWeight:600}}>Google Maps</a> → right-click your location → copy the lat/lng numbers shown.</span>
            </div>
          </div>

          {/* Contact & Amenities */}
          <div className="form-section">
            <div className="form-section-title"><FiPhone size={14} /> Contact & Amenities</div>
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input type="text" name="contact" className="form-control" placeholder="e.g. 077-1234567"
                value={form.contact} onChange={handleChange} />
            </div>
            <div className="mb-0">
              <label className="form-label">Amenities <span style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>(comma-separated)</span></label>
              <input type="text" name="amenities" className="form-control"
                placeholder="e.g. WiFi, Parking, Water, Meals, AC"
                value={form.amenities} onChange={handleChange} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <div className="form-section-title"><FiUpload size={14} /> Photo</div>
            <label htmlFor="imgUpload" style={{cursor:'pointer',display:'block'}}>
              <div className="image-upload-area">
                {preview
                  ? <img src={preview} alt="Preview" style={{width:'100%',maxHeight:260,objectFit:'cover',borderRadius:10}} />
                  : <>
                    <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📷</div>
                    <div style={{fontWeight:600,color:'var(--ink-soft)',marginBottom:'0.2rem'}}>Click to upload a photo</div>
                    <div style={{fontSize:'0.82rem',color:'var(--muted)'}}>JPEG, PNG or WebP — max 5MB</div>
                  </>}
              </div>
            </label>
            <input id="imgUpload" type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}} />
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}
            style={{padding:'0.95rem',fontSize:'1rem',borderRadius:'14px',boxShadow:'0 8px 24px rgba(196,98,45,0.35)'}}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Publishing...</> : '🏠 Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBoarding;