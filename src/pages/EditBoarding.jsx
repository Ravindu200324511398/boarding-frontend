import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiHome, FiMapPin, FiDollarSign, FiPhone,
  FiSave, FiX, FiUpload, FiCheckCircle, FiAlertCircle, FiArrowLeft
} from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const AMENITY_OPTIONS = [
  "WiFi","Hot Water","Air Conditioning","Fan","Attached Bathroom",
  "Kitchen Access","Laundry","Parking","Furnished","Study Desk",
  "CCTV","Private Entrance","Common Kitchen","Meals Available",
];
const ROOM_TYPES = ["Single","Double","Triple","Annex","Studio"];

const getTokens = (isDark) => isDark ? {
  pageBg: '#060f2a',
  orb1: '#0ea5e944', orb2: '#00d4aa22', orb3: '#06b6d422',
  gridLine: 'rgba(255,255,255,.018)',
  headerBg: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(0,212,170,0.12) 100%)',
  headerBorder: 'rgba(255,255,255,0.08)',
  sectionBg: 'rgba(255,255,255,0.04)',
  sectionBorder: 'rgba(255,255,255,0.08)',
  sectionDivider: 'rgba(255,255,255,0.07)',
  headingColor: 'rgba(220,233,255,0.9)',
  subText: 'rgba(220,233,255,0.5)',
  labelColor: 'rgba(220,233,255,0.45)',
  inputBg: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.1)',
  inputBorderFocus: 'rgba(0,212,170,0.55)',
  inputFocusShadow: 'rgba(0,212,170,0.1)',
  inputFocusBg: 'rgba(0,212,170,0.04)',
  inputColor: 'rgba(220,233,255,0.9)',
  inputPlaceholder: 'rgba(220,233,255,0.25)',
  iconBg: 'rgba(255,255,255,0.02)',
  iconBorder: 'rgba(255,255,255,0.07)',
  iconColor: 'rgba(0,212,170,0.65)',
  accent: '#00d4aa',
  accentBg: 'rgba(0,212,170,0.15)',
  accentBorder: 'rgba(0,212,170,0.5)',
  chipInactiveBg: 'rgba(255,255,255,0.04)',
  chipInactiveBorder: 'rgba(255,255,255,0.1)',
  chipInactiveColor: 'rgba(220,233,255,0.5)',
  chipInactiveHoverBorder: 'rgba(0,212,170,0.3)',
  chipInactiveHoverColor: 'rgba(220,233,255,0.8)',
  roomBtnInactiveBg: 'rgba(255,255,255,0.03)',
  roomBtnInactiveBorder: 'rgba(255,255,255,0.1)',
  roomBtnInactiveColor: 'rgba(220,233,255,0.5)',
  cancelBg: 'rgba(255,255,255,0.06)',
  cancelColor: 'rgba(220,233,255,0.6)',
  cancelBorder: 'rgba(255,255,255,0.1)',
  cancelHoverBg: 'rgba(255,255,255,0.1)',
  imgSlotBorder: 'rgba(255,255,255,0.12)',
  imgSlotBg: 'rgba(255,255,255,0.03)',
  imgSlotHoverBorder: 'rgba(0,212,170,0.4)',
  imgSlotTextColor: 'rgba(220,233,255,0.3)',
  backBtnBg: 'rgba(255,255,255,0.1)',
  backBtnBorder: 'rgba(255,255,255,0.15)',
  backBtnColor: 'rgba(220,233,255,0.8)',
  backBtnHoverBg: 'rgba(255,255,255,0.16)',
  hintColor: 'rgba(220,233,255,0.3)',
  photoHintColor: 'rgba(220,233,255,0.35)',
  errorBg: 'rgba(239,68,68,0.1)',
  errorColor: '#fca5a5',
  errorBorder: 'rgba(239,68,68,0.25)',
  successBg: 'rgba(0,212,170,0.1)',
  successColor: '#00d4aa',
  successBorder: 'rgba(0,212,170,0.25)',
  btnShadow: 'rgba(0,212,170,0.35)',
  btnHoverShadow: 'rgba(0,212,170,0.5)',
} : {
  pageBg: '#f0f6ff',
  orb1: '#bae6fd88', orb2: '#99f6e488', orb3: '#e0f2fe88',
  gridLine: 'rgba(14,165,233,0.06)',
  headerBg: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(0,212,170,0.08) 100%)',
  headerBorder: 'rgba(14,165,233,0.15)',
  sectionBg: 'rgba(255,255,255,0.85)',
  sectionBorder: 'rgba(14,165,233,0.12)',
  sectionDivider: 'rgba(14,165,233,0.1)',
  headingColor: '#0f2a4a',
  subText: '#5a7a99',
  labelColor: '#6b8aaa',
  inputBg: 'rgba(255,255,255,0.9)',
  inputBorder: 'rgba(14,165,233,0.2)',
  inputBorderFocus: 'rgba(0,212,170,0.6)',
  inputFocusShadow: 'rgba(0,212,170,0.12)',
  inputFocusBg: 'rgba(0,212,170,0.03)',
  inputColor: '#1a3a5c',
  inputPlaceholder: '#a0b8cc',
  iconBg: 'rgba(14,165,233,0.06)',
  iconBorder: 'rgba(14,165,233,0.12)',
  iconColor: '#0ea5e9',
  accent: '#0ea5e9',
  accentBg: 'rgba(14,165,233,0.1)',
  accentBorder: 'rgba(14,165,233,0.4)',
  chipInactiveBg: 'rgba(14,165,233,0.05)',
  chipInactiveBorder: 'rgba(14,165,233,0.15)',
  chipInactiveColor: '#5a7a99',
  chipInactiveHoverBorder: 'rgba(14,165,233,0.35)',
  chipInactiveHoverColor: '#1a3a5c',
  roomBtnInactiveBg: 'rgba(14,165,233,0.04)',
  roomBtnInactiveBorder: 'rgba(14,165,233,0.15)',
  roomBtnInactiveColor: '#5a7a99',
  cancelBg: 'rgba(14,165,233,0.08)',
  cancelColor: '#5a7a99',
  cancelBorder: 'rgba(14,165,233,0.15)',
  cancelHoverBg: 'rgba(14,165,233,0.14)',
  imgSlotBorder: 'rgba(14,165,233,0.2)',
  imgSlotBg: 'rgba(14,165,233,0.03)',
  imgSlotHoverBorder: 'rgba(0,212,170,0.45)',
  imgSlotTextColor: '#a0b8cc',
  backBtnBg: 'rgba(14,165,233,0.08)',
  backBtnBorder: 'rgba(14,165,233,0.18)',
  backBtnColor: '#1a3a5c',
  backBtnHoverBg: 'rgba(14,165,233,0.15)',
  hintColor: '#a0b8cc',
  photoHintColor: '#8aaccc',
  errorBg: 'rgba(239,68,68,0.07)',
  errorColor: '#dc2626',
  errorBorder: 'rgba(239,68,68,0.2)',
  successBg: 'rgba(0,212,170,0.07)',
  successColor: '#059669',
  successBorder: 'rgba(0,212,170,0.2)',
  btnShadow: 'rgba(0,212,170,0.25)',
  btnHoverShadow: 'rgba(0,212,170,0.4)',
};

const makeCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .edit-section {
    background: ${t.sectionBg};
    border: 1px solid ${t.sectionBorder};
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(12px);
    animation: fadeUp 0.5s ease both;
    box-shadow: 0 4px 24px rgba(14,165,233,0.06);
  }

  .edit-submit-btn {
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%;
    color: #fff;
    border: none;
    border-radius: 13px;
    padding: 0.9rem 2.2rem;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    animation: shimmerBtn 4s linear infinite;
    box-shadow: 0 6px 24px ${t.btnShadow};
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .edit-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px ${t.btnHoverShadow};
  }
  .edit-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .edit-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid ${t.inputBorder};
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    background: ${t.inputBg};
  }
  .edit-input-wrap.focused {
    border-color: ${t.inputBorderFocus};
    background: ${t.inputFocusBg};
    box-shadow: 0 0 0 3px ${t.inputFocusShadow};
  }

  .edit-inp {
    border: none; outline: none; flex: 1;
    padding: 0.75rem 1rem; font-size: 0.93rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    color: ${t.inputColor}; width: 100%;
  }
  .edit-inp::placeholder { color: ${t.inputPlaceholder}; }

  .edit-inp-icon {
    padding: 0 0.85rem;
    color: ${t.iconColor};
    display: flex; align-items: center;
    border-right: 1px solid ${t.iconBorder};
    background: ${t.iconBg};
    align-self: stretch;
  }

  .edit-label {
    display: block;
    font-size: 0.78rem; font-weight: 700;
    color: ${t.labelColor};
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .amenity-chip { padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.82rem; cursor: pointer; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; display: inline-flex; align-items: center; gap: 0.3rem; font-weight: 500; }
  .amenity-chip.active { background: ${t.accentBg}; border: 1.5px solid ${t.accentBorder}; color: ${t.accent}; font-weight: 700; }
  .amenity-chip.inactive { background: ${t.chipInactiveBg}; border: 1.5px solid ${t.chipInactiveBorder}; color: ${t.chipInactiveColor}; }
  .amenity-chip.inactive:hover { border-color: ${t.chipInactiveHoverBorder}; color: ${t.chipInactiveHoverColor}; }

  .room-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .room-btn.active { border: 1.5px solid ${t.accentBorder}; background: ${t.accentBg}; color: ${t.accent}; font-weight: 700; }
  .room-btn.inactive { border: 1.5px solid ${t.roomBtnInactiveBorder}; background: ${t.roomBtnInactiveBg}; color: ${t.roomBtnInactiveColor}; font-weight: 500; }
  .room-btn.inactive:hover { border-color: ${t.chipInactiveHoverBorder}; }

  .cancel-btn { background: ${t.cancelBg}; color: ${t.cancelColor}; border: 1px solid ${t.cancelBorder}; border-radius: 12px; padding: 0.9rem 1.8rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
  .cancel-btn:hover { background: ${t.cancelHoverBg}; }

  .img-slot { border: 2px dashed ${t.imgSlotBorder}; border-radius: 10px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${t.imgSlotBg}; gap: 0.3rem; cursor: pointer; transition: border-color 0.2s; }
  .img-slot:hover { border-color: ${t.imgSlotHoverBorder}; }

  .edit-textarea {
    width: 100%; border: 1.5px solid ${t.inputBorder}; border-radius: 12px;
    padding: 0.85rem 1rem; font-size: 0.9rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; resize: vertical;
    color: ${t.inputColor};
    background: ${t.inputBg};
    transition: border-color 0.2s;
  }
  .edit-textarea:focus { border-color: ${t.inputBorderFocus}; }
  .edit-textarea::placeholder { color: ${t.inputPlaceholder}; }

  .back-btn {
    background: ${t.backBtnBg};
    border: 1px solid ${t.backBtnBorder};
    color: ${t.backBtnColor};
    border-radius: 10px;
    padding: 0.45rem 1rem;
    cursor: pointer;
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.875rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 1rem;
    transition: background 0.2s;
  }
  .back-btn:hover { background: ${t.backBtnHoverBg}; }

  @media (max-width: 767px) { .edit-section { padding: 1.4rem; } }
`;

const InputWrap = ({ icon, children, focused, t }) => (
  <div className={`edit-input-wrap${focused ? ' focused' : ''}`}>
    {icon && <span className="edit-inp-icon">{icon}</span>}
    {children}
  </div>
);

const Field = ({ label, required, children, hint, t }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label className="edit-label">
      {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: "0.75rem", color: t.hintColor, margin: "0.3rem 0 0" }}>{hint}</p>}
  </div>
);

const EditBoarding = () => {
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ title: "", description: "", location: "", price: "", roomType: "Single", contact: "", lat: "", lng: "" });
  const [amenities, setAmenities] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inpStyle = {
    border: "none", outline: "none", flex: 1, padding: "0.75rem 1rem",
    fontSize: "0.93rem", fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "transparent", color: t.inputColor, width: "100%"
  };

  useEffect(() => {
    api.get(`/boardings/${id}`).then(res => {
      const b = res.data.boarding;
      if (user && b.owner?._id !== user.id && b.owner?._id !== user._id) { navigate("/"); return; }
      setForm({ title: b.title || "", description: b.description || "", location: b.location || "", price: b.price || "", roomType: b.roomType || "Single", contact: b.contact || "", lat: b.lat || "", lng: b.lng || "" });
      setAmenities(b.amenities || []);
      const imgs = b.images && b.images.length > 0 ? b.images : b.image ? [b.image] : [];
      setExistingImages(imgs);
    }).catch(() => navigate("/")).finally(() => setLoading(false));
  }, [id]);

  const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.filter(i => !removedImages.includes(i)).length + newImages.length + files.length;
    if (total > 8) { setError("Maximum 8 photos allowed"); return; }
    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => { const reader = new FileReader(); reader.onload = ev => setNewPreviews(prev => [...prev, ev.target.result]); reader.readAsDataURL(file); });
  };

  const removeExisting = (img) => setRemovedImages(prev => [...prev, img]);
  const removeNew = (idx) => { setNewImages(prev => prev.filter((_, i) => i !== idx)); setNewPreviews(prev => prev.filter((_, i) => i !== idx)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.price || !form.contact) { setError("Please fill in all required fields."); return; }
    setSubmitting(true); setError(""); setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") formData.append(k, v); });
      amenities.forEach(a => formData.append("amenities", a));
      newImages.forEach(img => formData.append("images", img));
      const kept = existingImages.filter(i => !removedImages.includes(i));
      kept.forEach(img => formData.append("keepImages", img));
      await api.put(`/boardings/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Listing updated successfully!");
      setTimeout(() => navigate(`/boarding/${id}`), 1500);
    } catch (err) { setError(err.response?.data?.message || "Update failed."); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: t.pageBg }}>
      <div className="spinner-border" style={{ color: t.accent, width: '3rem', height: '3rem' }} />
    </div>
  );

  const activeExisting = existingImages.filter(i => !removedImages.includes(i));
  const totalPhotos = activeExisting.length + newImages.length;

  return (
    <div style={{ background: t.pageBg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden', transition: 'background 0.3s' }}>
      <style>{makeCSS(t)}</style>

      {/* Background Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 600, h: 600, color: t.orb1, top: '-150px', left: '-150px', delay: '0s' },
          { w: 500, h: 500, color: t.orb2, top: '40%', right: '-140px', delay: '-6s' },
          { w: 400, h: 400, color: t.orb3, bottom: '-100px', left: '30%', delay: '-11s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, padding: '2.5rem 0 3.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <button onClick={() => navigate(-1)} className="back-btn"><FiArrowLeft size={14} /> Back</button>
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: t.headingColor, margin: 0 }}>Edit Listing</h1>
          <p style={{ color: t.subText, margin: 0, fontSize: '0.9rem' }}>Update your boarding listing details</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820, marginTop: '-2rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: t.errorBg, color: t.errorColor, border: `1px solid ${t.errorBorder}`, borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiAlertCircle size={15} />{error}
            </div>
          )}
          {success && (
            <div style={{ background: t.successBg, color: t.successColor, border: `1px solid ${t.successBorder}`, borderRadius: 12, padding: '0.85rem 1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <FiCheckCircle size={15} />{success}
            </div>
          )}

          {/* Basic Details */}
          <div className="edit-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', paddingBottom: '0.8rem', borderBottom: `1px solid ${t.sectionDivider}` }}>
              <span style={{ fontSize: '1.1rem' }}>📋</span>
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: t.headingColor }}>Basic Details</span>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <Field label="Title" required t={t}>
                  <InputWrap icon={<FiHome size={15} />} focused={focused === "title"} t={t}>
                    <input value={form.title} onChange={e => set("title", e.target.value)} onFocus={() => setFocused("title")} onBlur={() => setFocused("")} placeholder="Listing title" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Location" required t={t}>
                  <InputWrap icon={<FiMapPin size={15} />} focused={focused === "location"} t={t}>
                    <input value={form.location} onChange={e => set("location", e.target.value)} onFocus={() => setFocused("location")} onBlur={() => setFocused("")} placeholder="e.g. Kandy" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Monthly Price (LKR)" required t={t}>
                  <InputWrap icon={<FiDollarSign size={15} />} focused={focused === "price"} t={t}>
                    <input type="number" value={form.price} onChange={e => set("price", e.target.value)} onFocus={() => setFocused("price")} onBlur={() => setFocused("")} placeholder="e.g. 15000" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Contact" required t={t}>
                  <InputWrap icon={<FiPhone size={15} />} focused={focused === "contact"} t={t}>
                    <input value={form.contact} onChange={e => set("contact", e.target.value)} onFocus={() => setFocused("contact")} onBlur={() => setFocused("")} placeholder="e.g. 0771234567" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Room Type" required t={t}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {ROOM_TYPES.map(ty => (
                      <button type="button" key={ty} onClick={() => set("roomType", ty)} className={`room-btn ${form.roomType === ty ? 'active' : 'inactive'}`}>{ty}</button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-12">
                <Field label="Description" required t={t}>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={5} placeholder="Describe your boarding place..." className="edit-textarea" />
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Latitude" t={t}>
                  <InputWrap focused={focused === "lat"} t={t}>
                    <input type="number" step="any" value={form.lat} onChange={e => set("lat", e.target.value)} onFocus={() => setFocused("lat")} onBlur={() => setFocused("")} placeholder="Latitude" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Longitude" t={t}>
                  <InputWrap focused={focused === "lng"} t={t}>
                    <input type="number" step="any" value={form.lng} onChange={e => set("lng", e.target.value)} onFocus={() => setFocused("lng")} onBlur={() => setFocused("")} placeholder="Longitude" style={inpStyle} />
                  </InputWrap>
                </Field>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="edit-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', paddingBottom: '0.8rem', borderBottom: `1px solid ${t.sectionDivider}` }}>
              <span style={{ fontSize: '1.1rem' }}>✨</span>
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: t.headingColor }}>Amenities</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {AMENITY_OPTIONS.map(a => {
                const active = amenities.includes(a);
                return (
                  <button type="button" key={a} onClick={() => toggleAmenity(a)} className={`amenity-chip ${active ? 'active' : 'inactive'}`}>
                    {active && <FiCheckCircle size={11} />}{a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos */}
          <div className="edit-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', paddingBottom: '0.8rem', borderBottom: `1px solid ${t.sectionDivider}` }}>
              <span style={{ fontSize: '1.1rem' }}>📸</span>
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: t.headingColor }}>Photos ({totalPhotos}/8)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: t.photoHintColor, marginBottom: '1rem' }}>First photo is the cover. Click X to remove.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: "0.6rem" }}>
              {activeExisting.map((img, idx) => (
                <div key={img} style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 100 }}>
                  <img src={`${IMAGE_BASE}${img}`} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {idx === 0 && totalPhotos > 0 && <div style={{ position: "absolute", top: 4, left: 4, background: 'linear-gradient(135deg,#00d4aa,#0ea5e9)', color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 20 }}>COVER</div>}
                  <button type="button" onClick={() => removeExisting(img)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.65)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><FiX size={11} /></button>
                </div>
              ))}
              {newPreviews.map((preview, idx) => (
                <div key={idx} style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 100 }}>
                  <img src={preview} alt={`New ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 4, left: 4, background: "#059669", color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 20 }}>NEW</div>
                  <button type="button" onClick={() => removeNew(idx)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.65)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><FiX size={11} /></button>
                </div>
              ))}
              {totalPhotos < 8 && (
                <label style={{ cursor: "pointer" }}>
                  <div className="img-slot">
                    <FiUpload size={20} color={t.imgSlotTextColor} />
                    <span style={{ fontSize: "0.72rem", color: t.imgSlotTextColor, fontWeight: 600 }}>Add Photo</span>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ display: "none" }} />
                </label>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={submitting} className="edit-submit-btn">
              {submitting ? "Saving..." : <><FiSave size={15} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoarding;