// ============================================
// Add Boarding Page
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiMapPin, FiDollarSign, FiPhone } from 'react-icons/fi';
import api from '../api/axios';

const AddBoarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    lat: '', lng: '', roomType: 'Single', amenities: '', contact: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Use FormData for multipart (image upload)
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    try {
      await api.post('/boardings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Boarding added successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add boarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>🏠 Add New Boarding</h1>
          <p>Fill in the details to list your boarding place</p>
        </div>
      </div>

      <div className="container pb-5" style={{ maxWidth: 760 }}>
        {error && <div className="alert-custom alert-danger-custom mb-3">{error}</div>}
        {success && <div className="alert-custom alert-success-custom mb-3">{success}</div>}

        <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', padding:'2rem', boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Boarding Title *</label>
              <input type="text" name="title" className="form-control" placeholder="e.g. Cozy Single Room near University of Peradeniya"
                value={form.title} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" rows={4}
                placeholder="Describe the boarding place, rules, nearby facilities..."
                value={form.description} onChange={handleChange} required />
            </div>

            <div className="row g-3 mb-3">
              {/* Price */}
              <div className="col-md-6">
                <label className="form-label"><FiDollarSign size={13} style={{marginRight:4}} />Monthly Price (LKR) *</label>
                <input type="number" name="price" className="form-control" placeholder="e.g. 8000"
                  value={form.price} onChange={handleChange} required min="0" />
              </div>
              {/* Room Type */}
              <div className="col-md-6">
                <label className="form-label">Room Type</label>
                <select name="roomType" className="form-select" value={form.roomType} onChange={handleChange}>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Triple</option>
                  <option>Annex</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label"><FiMapPin size={13} style={{marginRight:4}} />Location / Address *</label>
              <input type="text" name="location" className="form-control" placeholder="e.g. Asgiriya, Kandy"
                value={form.location} onChange={handleChange} required />
            </div>

            <div className="row g-3 mb-3">
              {/* Latitude */}
              <div className="col-md-6">
                <label className="form-label">Latitude (Google Maps)</label>
                <input type="number" name="lat" step="any" className="form-control" placeholder="e.g. 7.2906"
                  value={form.lat} onChange={handleChange} />
              </div>
              {/* Longitude */}
              <div className="col-md-6">
                <label className="form-label">Longitude (Google Maps)</label>
                <input type="number" name="lng" step="any" className="form-control" placeholder="e.g. 80.6337"
                  value={form.lng} onChange={handleChange} />
              </div>
            </div>

            <p style={{ fontSize:'0.8rem', color:'#94a3b8', marginTop:'-0.5rem', marginBottom:'1rem' }}>
              💡 Get coordinates from <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{color:'#2563eb'}}>Google Maps</a> → right-click location → copy lat/lng
            </p>

            {/* Contact */}
            <div className="mb-3">
              <label className="form-label"><FiPhone size={13} style={{marginRight:4}} />Contact Number</label>
              <input type="text" name="contact" className="form-control" placeholder="e.g. 077-1234567"
                value={form.contact} onChange={handleChange} />
            </div>

            {/* Amenities */}
            <div className="mb-3">
              <label className="form-label">Amenities (comma-separated)</label>
              <input type="text" name="amenities" className="form-control"
                placeholder="e.g. WiFi, Parking, Water, Meals"
                value={form.amenities} onChange={handleChange} />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="form-label"><FiUpload size={13} style={{marginRight:4}} />Upload Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" style={{ width:'100%', maxHeight:220, objectFit:'cover', borderRadius:10 }} />
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary-custom w-100 justify-content-center" disabled={loading}
              style={{ padding:'0.8rem', fontSize:'1rem' }}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Adding Boarding...</>
              ) : '🏠 Add Boarding'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBoarding;