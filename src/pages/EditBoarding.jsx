import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiHome, FiMapPin, FiDollarSign, FiPhone,
  FiSave, FiX, FiUpload, FiCheckCircle, FiAlertCircle, FiArrowLeft
} from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const IMAGE_BASE = "http://localhost:5001/uploads/";

const AMENITY_OPTIONS = [
  "WiFi","Hot Water","Air Conditioning","Fan","Attached Bathroom",
  "Kitchen Access","Laundry","Parking","Furnished","Study Desk",
  "CCTV","Private Entrance","Common Kitchen","Meals Available",
];
const ROOM_TYPES = ["Single","Double","Triple","Annex","Studio"];

const inpStyle = {
  border:"none", outline:"none", flex:1, padding:"0.75rem 1rem",
  fontSize:"0.95rem", fontFamily:"var(--font-body)",
  background:"transparent", color:"#0f172a", width:"100%"
};

const InputWrap = ({ icon, children, focused }) => (
  <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${focused?"#2563eb":"#e2e8f0"}`, borderRadius:10, overflow:"hidden", transition:"border-color 0.15s" }}>
    {icon && <span style={{ padding:"0 0.85rem", color:"#94a3b8", background:"#f8fafc", alignSelf:"stretch", display:"flex", alignItems:"center", borderRight:"1px solid #e2e8f0" }}>{icon}</span>}
    {children}
  </div>
);

const Field = ({ label, required, children, hint }) => (
  <div style={{ marginBottom:"1.2rem" }}>
    <label style={{ display:"block", fontSize:"0.82rem", fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.45rem" }}>
      {label}{required && <span style={{ color:"#ef4444", marginLeft:3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize:"0.75rem", color:"#94a3b8", margin:"0.3rem 0 0" }}>{hint}</p>}
  </div>
);

const EditBoarding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ title:"", description:"", location:"", price:"", roomType:"Single", contact:"", lat:"", lng:"" });
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

  useEffect(() => {
    api.get(`/boardings/${id}`).then(res => {
      const b = res.data.boarding;
      // Redirect if not owner
      if (user && b.owner?._id !== user.id && b.owner?._id !== user._id) {
        navigate("/");
        return;
      }
      setForm({
        title: b.title || "",
        description: b.description || "",
        location: b.location || "",
        price: b.price || "",
        roomType: b.roomType || "Single",
        contact: b.contact || "",
        lat: b.lat || "",
        lng: b.lng || "",
      });
      setAmenities(b.amenities || []);
      const imgs = b.images && b.images.length > 0 ? b.images : b.image ? [b.image] : [];
      setExistingImages(imgs);
    }).catch(() => navigate("/"))
    .finally(() => setLoading(false));
  }, [id]);

  const toggleAmenity = (a) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.filter(i => !removedImages.includes(i)).length + newImages.length + files.length;
    if (total > 8) { setError("Maximum 8 photos allowed"); return; }
    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setNewPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (img) => setRemovedImages(prev => [...prev, img]);
  const removeNew = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.price || !form.contact) {
      setError("Please fill in all required fields."); return;
    }
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
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner-border text-primary" /></div>;

  const activeExisting = existingImages.filter(i => !removedImages.includes(i));
  const totalPhotos = activeExisting.length + newImages.length;

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#2563eb)", padding:"2.5rem 0 3.5rem" }}>
        <div className="container" style={{ maxWidth:820 }}>
          <button onClick={() => navigate(-1)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", borderRadius:10, padding:"0.45rem 1rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.875rem", fontWeight:600, fontFamily:"var(--font-body)", marginBottom:"1rem" }}>
            <FiArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontFamily:"var(--font-heading)", fontSize:"1.8rem", fontWeight:800, color:"#fff", margin:0 }}>Edit Listing</h1>
          <p style={{ color:"rgba(255,255,255,0.7)", margin:0, fontSize:"0.9rem" }}>Update your boarding listing details</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth:820, marginTop:"-2rem", paddingBottom:"3rem" }}>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fecaca", borderRadius:12, padding:"0.85rem 1.2rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.875rem" }}><FiAlertCircle size={15}/>{error}</div>}
          {success && <div style={{ background:"#f0fdf4", color:"#059669", border:"1px solid #bbf7d0", borderRadius:12, padding:"0.85rem 1.2rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.875rem" }}><FiCheckCircle size={15}/>{success}</div>}

          {/* Basic Details */}
          <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", padding:"2rem", marginBottom:"1rem" }}>
            <h4 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"1.4rem", paddingBottom:"0.8rem", borderBottom:"1px solid #f1f5f9" }}>📋 Basic Details</h4>
            <div className="row g-3">
              <div className="col-12">
                <Field label="Title" required>
                  <InputWrap icon={<FiHome size={15}/>} focused={focused==="title"}>
                    <input value={form.title} onChange={e=>set("title",e.target.value)} onFocus={()=>setFocused("title")} onBlur={()=>setFocused("")} placeholder="Listing title" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Location" required>
                  <InputWrap icon={<FiMapPin size={15}/>} focused={focused==="location"}>
                    <input value={form.location} onChange={e=>set("location",e.target.value)} onFocus={()=>setFocused("location")} onBlur={()=>setFocused("")} placeholder="e.g. Kandy" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Monthly Price (LKR)" required>
                  <InputWrap icon={<FiDollarSign size={15}/>} focused={focused==="price"}>
                    <input type="number" value={form.price} onChange={e=>set("price",e.target.value)} onFocus={()=>setFocused("price")} onBlur={()=>setFocused("")} placeholder="e.g. 15000" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Contact" required>
                  <InputWrap icon={<FiPhone size={15}/>} focused={focused==="contact"}>
                    <input value={form.contact} onChange={e=>set("contact",e.target.value)} onFocus={()=>setFocused("contact")} onBlur={()=>setFocused("")} placeholder="e.g. 0771234567" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Room Type" required>
                  <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                    {ROOM_TYPES.map(t=>(
                      <button type="button" key={t} onClick={()=>set("roomType",t)}
                        style={{ padding:"0.5rem 1rem", borderRadius:8, border:`1.5px solid ${form.roomType===t?"#2563eb":"#e2e8f0"}`, background:form.roomType===t?"#eff6ff":"#f8fafc", color:form.roomType===t?"#1d4ed8":"#64748b", fontWeight:form.roomType===t?700:500, fontSize:"0.85rem", cursor:"pointer", fontFamily:"var(--font-body)" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="col-12">
                <Field label="Description" required>
                  <textarea value={form.description} onChange={e=>set("description",e.target.value)}
                    rows={5} placeholder="Describe your boarding place..."
                    style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:10, padding:"0.85rem 1rem", fontSize:"0.9rem", fontFamily:"var(--font-body)", outline:"none", resize:"vertical", color:"#0f172a" }}/>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Latitude">
                  <InputWrap focused={focused==="lat"}>
                    <input type="number" step="any" value={form.lat} onChange={e=>set("lat",e.target.value)} onFocus={()=>setFocused("lat")} onBlur={()=>setFocused("")} placeholder="Latitude" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
              <div className="col-md-6">
                <Field label="Longitude">
                  <InputWrap focused={focused==="lng"}>
                    <input type="number" step="any" value={form.lng} onChange={e=>set("lng",e.target.value)} onFocus={()=>setFocused("lng")} onBlur={()=>setFocused("")} placeholder="Longitude" style={inpStyle}/>
                  </InputWrap>
                </Field>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", padding:"2rem", marginBottom:"1rem" }}>
            <h4 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"1.4rem", paddingBottom:"0.8rem", borderBottom:"1px solid #f1f5f9" }}>✨ Amenities</h4>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              {AMENITY_OPTIONS.map(a=>{
                const active=amenities.includes(a);
                return(
                  <button type="button" key={a} onClick={()=>toggleAmenity(a)}
                    style={{ padding:"0.4rem 0.9rem", borderRadius:20, border:`1.5px solid ${active?"#2563eb":"#e2e8f0"}`, background:active?"#eff6ff":"#f8fafc", color:active?"#1d4ed8":"#64748b", fontWeight:active?700:500, fontSize:"0.82rem", cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:"0.3rem" }}>
                    {active && <FiCheckCircle size={11}/>}{a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos */}
          <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 4px 24px rgba(15,23,42,0.08)", padding:"2rem", marginBottom:"1.5rem" }}>
            <h4 style={{ fontFamily:"var(--font-heading)", fontWeight:800, color:"#0f172a", marginBottom:"0.4rem", paddingBottom:"0.8rem", borderBottom:"1px solid #f1f5f9" }}>📸 Photos ({totalPhotos}/8)</h4>
            <p style={{ fontSize:"0.8rem", color:"#94a3b8", marginBottom:"1rem" }}>First photo is the cover. Click X to remove.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:"0.6rem" }}>
              {/* Existing images */}
              {activeExisting.map((img, idx)=>(
                <div key={img} style={{ position:"relative", borderRadius:10, overflow:"hidden", height:100 }}>
                  <img src={`${IMAGE_BASE}${img}`} alt={`Photo ${idx+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  {idx===0 && totalPhotos>0 && <div style={{ position:"absolute", top:4, left:4, background:"#2563eb", color:"#fff", fontSize:"0.6rem", fontWeight:800, padding:"0.15rem 0.5rem", borderRadius:20 }}>COVER</div>}
                  <button type="button" onClick={()=>removeExisting(img)}
                    style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff" }}>
                    <FiX size={11}/>
                  </button>
                </div>
              ))}
              {/* New images */}
              {newPreviews.map((preview, idx)=>(
                <div key={idx} style={{ position:"relative", borderRadius:10, overflow:"hidden", height:100 }}>
                  <img src={preview} alt={`New ${idx+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", top:4, left:4, background:"#059669", color:"#fff", fontSize:"0.6rem", fontWeight:800, padding:"0.15rem 0.5rem", borderRadius:20 }}>NEW</div>
                  <button type="button" onClick={()=>removeNew(idx)}
                    style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff" }}>
                    <FiX size={11}/>
                  </button>
                </div>
              ))}
              {/* Add more button */}
              {totalPhotos < 8 && (
                <label style={{ cursor:"pointer" }}>
                  <div style={{ border:"2px dashed #e2e8f0", borderRadius:10, height:100, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#f8fafc", gap:"0.3rem" }}>
                    <FiUpload size={20} color="#94a3b8"/>
                    <span style={{ fontSize:"0.72rem", color:"#94a3b8", fontWeight:600 }}>Add Photo</span>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ display:"none" }}/>
                </label>
              )}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.8rem" }}>
            <button type="button" onClick={()=>navigate(-1)} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:12, padding:"0.85rem 1.8rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)" }}>Cancel</button>
            <button type="submit" disabled={submitting}
              style={{ background:"linear-gradient(135deg,#1e3a8a,#2563eb)", color:"#fff", border:"none", borderRadius:12, padding:"0.85rem 2.2rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", opacity:submitting?0.7:1, display:"flex", alignItems:"center", gap:"0.5rem" }}>
              {submitting ? "Saving..." : <><FiSave size={15}/> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoarding;
