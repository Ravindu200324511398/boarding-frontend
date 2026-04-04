import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiHeart, FiArrowLeft, FiTrash2, FiExternalLink, FiCalendar, FiEdit2, FiX, FiCheck, FiWifi, FiHome, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import AIReviewAssistant from '../components/AIReviewAssistant';
import StarRating, { StarDisplay } from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const amenityIcons = {
  'WiFi': '📶', 'Water': '💧', 'Electricity': '⚡', 'Kitchen': '🍳',
  'Parking': '🚗', 'Air Conditioning': '❄️', 'Laundry': '👕',
  'Security': '🔒', 'CCTV': '📷', 'Meals Included': '🍽️',
  'Meals Available': '🍽️', 'Study Table': '📚', 'Fan': '🌀',
  'Hot Water': '🚿', 'Rooftop': '🏙️', 'Private Bathroom': '🛁',
  'WiFi 100Mbps': '📶', 'Security Gate': '🚪', 'Peaceful Environment': '🌿',
  'Meals on Request': '🍽️',
};

const getTokens = (isDark) => isDark ? {
  bg: 'linear-gradient(160deg, #060f2a 0%, #091428 40%, #071a1f 100%)',
  text: '#dce9ff',
  textMuted: 'rgba(180,210,255,0.75)',
  textDim: 'rgba(180,210,255,0.5)',
  textFaint: 'rgba(180,210,255,0.4)',
  textFainter: 'rgba(180,210,255,0.35)',
  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.08)',
  tabBorder: 'rgba(255,255,255,0.08)',
  tabActive: '#00d4aa',
  tabInactive: 'rgba(180,210,255,0.5)',
  tabHover: '#2de2e6',
  inputBg: 'rgba(255,255,255,0.05)',
  inputBorder: 'rgba(255,255,255,0.1)',
  inputColor: '#dce9ff',
  inputFocus: 'rgba(0,212,170,0.5)',
  accent: '#00d4aa',
  accentSecondary: '#0ea5e9',
  amenityBg: 'rgba(0,212,170,0.08)',
  amenityBorder: 'rgba(0,212,170,0.15)',
  reviewBg: 'rgba(255,255,255,0.03)',
  reviewBorder: 'rgba(255,255,255,0.07)',
  myReviewBg: 'rgba(0,212,170,0.06)',
  myReviewBorder: 'rgba(0,212,170,0.2)',
  writeReviewBg: 'rgba(255,255,255,0.04)',
  writeReviewBorder: 'rgba(255,255,255,0.08)',
  loginBg: 'rgba(14,165,233,0.06)',
  loginBorder: 'rgba(14,165,233,0.15)',
  ratingBarBg: 'rgba(255,255,255,0.08)',
  ratingBlockBg: 'rgba(255,255,255,0.03)',
  ratingBlockBorder: 'rgba(255,255,255,0.07)',
  sidebarBg: 'rgba(255,255,255,0.04)',
  sidebarBorder: 'rgba(255,255,255,0.1)',
  infoBg: 'rgba(255,255,255,0.04)',
  infoBorder: 'rgba(255,255,255,0.06)',
  phoneIconBg: 'rgba(14,165,233,0.12)',
  phoneIconBorder: 'rgba(14,165,233,0.2)',
  phoneIconColor: '#38bdf8',
  dateColor: 'rgba(180,210,255,0.35)',
  dateBg: 'rgba(255,255,255,0.04)',
  dateBorderColor: 'rgba(255,255,255,0.06)',
  gpsBg: 'rgba(0,212,170,0.06)',
  gpsBorder: 'rgba(0,212,170,0.15)',
  gpsTitle: '#00d4aa',
  smallAmenityBg: 'rgba(255,255,255,0.04)',
  smallAmenityBorder: 'rgba(255,255,255,0.08)',
  smallAmenityMoreBg: 'rgba(255,255,255,0.04)',
  smallAmenityMoreColor: 'rgba(180,210,255,0.5)',
  smallAmenityMoreBorder: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.07)',
  orbColors: ['#0ea5e940', '#00d4aa25', '#06b6d428'],
  gridLine: 'rgba(255,255,255,.018)',
  inquiryBg: 'linear-gradient(160deg, #0d1b3e, #091428)',
  inquiryBorder: 'rgba(0,212,170,0.2)',
  inquiryInputBg: 'rgba(255,255,255,0.05)',
  inquiryInputBorder: 'rgba(255,255,255,0.1)',
  inquiryInputColor: '#dce9ff',
  inquiryCloseBg: 'rgba(255,255,255,0.08)',
  inquiryCloseColor: '#dce9ff',
  modalBg: 'linear-gradient(160deg, #0d1b3e, #091428)',
  cancelBtnBg: 'rgba(255,255,255,0.05)',
  cancelBtnColor: 'rgba(180,210,255,0.6)',
  cancelBtnBorder: 'rgba(255,255,255,0.08)',
  editBtnBg: 'rgba(14,165,233,0.1)',
  editBtnColor: '#38bdf8',
  editBtnBorder: 'rgba(14,165,233,0.2)',
  deleteBtnBg: 'rgba(239,68,68,0.1)',
  deleteBtnColor: '#f87171',
  deleteBtnBorder: 'rgba(239,68,68,0.2)',
  availOccupiedBg: 'rgba(239,68,68,0.08)',
  availOccupiedBorder: 'rgba(239,68,68,0.2)',
  availOccupiedColor: '#f87171',
  notAvailBg: 'rgba(239,68,68,0.08)',
  notAvailBorder: 'rgba(239,68,68,0.2)',
  notAvailColor: '#f87171',
  backBtnBg: 'rgba(255,255,255,0.1)',
  backBtnBorder: 'rgba(255,255,255,0.2)',
  backBtnColor: '#fff',
  shareBtnBg: 'rgba(255,255,255,0.1)',
  shareBtnBorder: 'rgba(255,255,255,0.2)',
  shareBtnColor: '#fff',
  monthlyLabel: 'rgba(180,210,255,0.45)',
  priceColor: '#00d4aa',
  origPriceColor: 'rgba(180,210,255,0.35)',
} : {
  bg: 'linear-gradient(160deg, #e8f0fe 0%, #f0f7ff 40%, #e6f7fa 100%)',
  text: '#1a2a4a',
  textMuted: '#2a4a6a',
  textDim: '#4a6080',
  textFaint: '#6a8aaa',
  textFainter: '#7a9ab8',
  cardBg: 'rgba(255,255,255,0.85)',
  cardBorder: 'rgba(0,112,192,0.12)',
  tabBorder: 'rgba(0,112,192,0.1)',
  tabActive: '#0070c0',
  tabInactive: '#4a6080',
  tabHover: '#00b4d8',
  inputBg: 'rgba(255,255,255,0.9)',
  inputBorder: 'rgba(0,112,192,0.2)',
  inputColor: '#1a2a4a',
  inputFocus: 'rgba(0,112,192,0.5)',
  accent: '#0070c0',
  accentSecondary: '#00b4d8',
  amenityBg: 'rgba(0,112,192,0.06)',
  amenityBorder: 'rgba(0,112,192,0.12)',
  reviewBg: 'rgba(255,255,255,0.7)',
  reviewBorder: 'rgba(0,112,192,0.1)',
  myReviewBg: 'rgba(0,112,192,0.05)',
  myReviewBorder: 'rgba(0,112,192,0.18)',
  writeReviewBg: 'rgba(255,255,255,0.8)',
  writeReviewBorder: 'rgba(0,112,192,0.12)',
  loginBg: 'rgba(0,180,216,0.05)',
  loginBorder: 'rgba(0,180,216,0.18)',
  ratingBarBg: 'rgba(0,112,192,0.08)',
  ratingBlockBg: 'rgba(255,255,255,0.7)',
  ratingBlockBorder: 'rgba(0,112,192,0.1)',
  sidebarBg: 'rgba(255,255,255,0.9)',
  sidebarBorder: 'rgba(0,112,192,0.15)',
  infoBg: 'rgba(255,255,255,0.7)',
  infoBorder: 'rgba(0,112,192,0.08)',
  phoneIconBg: 'rgba(0,180,216,0.1)',
  phoneIconBorder: 'rgba(0,180,216,0.2)',
  phoneIconColor: '#0070c0',
  dateColor: '#6a8aaa',
  dateBg: 'rgba(255,255,255,0.6)',
  dateBorderColor: 'rgba(0,112,192,0.08)',
  gpsBg: 'rgba(0,112,192,0.04)',
  gpsBorder: 'rgba(0,112,192,0.15)',
  gpsTitle: '#0070c0',
  smallAmenityBg: 'rgba(0,112,192,0.06)',
  smallAmenityBorder: 'rgba(0,112,192,0.12)',
  smallAmenityMoreBg: 'rgba(255,255,255,0.6)',
  smallAmenityMoreColor: '#4a6080',
  smallAmenityMoreBorder: 'rgba(0,112,192,0.1)',
  divider: 'rgba(0,112,192,0.08)',
  orbColors: ['#0070c022', '#00b4d815', '#0096c710'],
  gridLine: 'rgba(0,112,192,.02)',
  inquiryBg: 'linear-gradient(160deg, #f0f7ff, #e8f4fb)',
  inquiryBorder: 'rgba(0,112,192,0.2)',
  inquiryInputBg: 'rgba(255,255,255,0.9)',
  inquiryInputBorder: 'rgba(0,112,192,0.18)',
  inquiryInputColor: '#1a2a4a',
  inquiryCloseBg: 'rgba(0,112,192,0.08)',
  inquiryCloseColor: '#1a2a4a',
  modalBg: 'linear-gradient(160deg, #f0f7ff, #e8f4fb)',
  cancelBtnBg: 'rgba(0,112,192,0.06)',
  cancelBtnColor: '#4a6080',
  cancelBtnBorder: 'rgba(0,112,192,0.12)',
  editBtnBg: 'rgba(0,180,216,0.08)',
  editBtnColor: '#0070c0',
  editBtnBorder: 'rgba(0,180,216,0.2)',
  deleteBtnBg: 'rgba(239,68,68,0.06)',
  deleteBtnColor: '#dc2626',
  deleteBtnBorder: 'rgba(239,68,68,0.15)',
  availOccupiedBg: 'rgba(239,68,68,0.06)',
  availOccupiedBorder: 'rgba(239,68,68,0.15)',
  availOccupiedColor: '#dc2626',
  notAvailBg: 'rgba(239,68,68,0.06)',
  notAvailBorder: 'rgba(239,68,68,0.15)',
  notAvailColor: '#dc2626',
  backBtnBg: 'rgba(255,255,255,0.75)',
  backBtnBorder: 'rgba(255,255,255,0.5)',
  backBtnColor: '#1a2a4a',
  shareBtnBg: 'rgba(255,255,255,0.75)',
  shareBtnBorder: 'rgba(255,255,255,0.5)',
  shareBtnColor: '#1a2a4a',
  monthlyLabel: '#4a6080',
  priceColor: '#0070c0',
  origPriceColor: '#7a9ab8',
};

const getCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmerBtn { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-50px) scale(1.07); }
    66%      { transform: translate(-25px,30px) scale(0.95); }
  }
  .bd-fade { animation: fadeUp 0.4s ease forwards; }
  .tab-btn {
    background: transparent; border: none;
    padding: 0.7rem 1.3rem; font-size: 0.875rem; font-weight: 700;
    cursor: pointer; border-bottom: 2.5px solid transparent;
    color: ${t.tabInactive}; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .tab-btn.active { color: ${t.tabActive}; border-bottom-color: ${t.tabActive}; }
  .tab-btn:hover { color: ${t.tabHover}; }
  .reg-submit-btn {
    border: none; border-radius: 14px; padding: 0.8rem 1.5rem;
    font-weight: 800; font-size: 0.9rem; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #00d4aa 0%, #2de2e6 40%, #0ea5e9 80%, #0891b2 100%);
    background-size: 300% 300%; color: #fff;
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    animation: shimmerBtn 5s linear infinite;
  }
  .reg-submit-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 36px rgba(0,212,170,0.5); }
  .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .review-card:hover { background: ${t.myReviewBg} !important; border-color: ${t.myReviewBorder} !important; }
  .action-btn { transition: all 0.15s; }
  .action-btn:hover { transform: translateY(-2px); }
  .amenity-chip { background: ${t.amenityBg}; border: 1px solid ${t.amenityBorder}; transition: all 0.2s; }
  .amenity-chip:hover { background: ${t.myReviewBg} !important; border-color: ${t.myReviewBorder} !important; transform: translateY(-2px); }
  input::placeholder { color: ${t.textFainter}; }
  textarea::placeholder { color: ${t.textFainter}; }
`;

const ParticleCanvas = ({ colors }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45, vy: -Math.random() * 0.65 - 0.25, alpha: Math.random() * 0.55 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [colors]);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

const BoardingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  const { format, currency } = useCurrency();
  const { isDark } = useTheme();
  const t = getTokens(isDark);

  const particleColors = isDark
    ? ['#0ea5e9', '#06b6d4', '#00d4aa', '#2de2e6', '#0891b2']
    : ['#0070c0', '#00b4d8', '#0096c7', '#0077b6', '#48cae4'];

  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [copied, setCopied] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formStars, setFormStars] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [deleteRatingLoading, setDeleteRatingLoading] = useState(false);
  const [deleteListingModal, setDeleteListingModal] = useState(false);
  const [deleteRatingModal, setDeleteRatingModal] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availLoading, setAvailLoading] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', visitDate: '', message: '' });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    const fetchBoarding = async () => {
      try { const res = await api.get(`/boardings/${id}`); setBoarding(res.data.boarding); setIsAvailable(res.data.boarding.isAvailable !== false); }
      catch { setError('Boarding not found.'); } finally { setLoading(false); }
    };
    const fetchFavStatus = async () => {
      if (!isAuth) return;
      try { const res = await api.get('/favorites'); setIsFav(res.data.favorites.map(f => f._id).includes(id)); } catch {}
    };
    const fetchRatings = async () => {
      try {
        const res = await api.get(`/ratings/${id}`);
        setRatings(res.data.ratings); setAvgRating(res.data.average); setTotalRatings(res.data.total);
        if (isAuth && user) { const mine = res.data.ratings.find(r => r.user._id === user.id); if (mine) { setMyRating(mine); setFormStars(mine.stars); setFormComment(mine.comment || ''); } }
      } catch {}
    };
    fetchBoarding(); fetchFavStatus(); fetchRatings();
  }, [id, isAuth]);

  const glassInputStyle = {
    width: '100%', background: t.inputBg, border: `1.5px solid ${t.inputBorder}`,
    borderRadius: 12, padding: '0.7rem 1rem', fontSize: '0.875rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none',
    color: t.inputColor, boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  const handleToggleAvailability = async () => {
    setAvailLoading(true);
    try { const res = await api.patch(`/boardings/${id}/availability`); setIsAvailable(res.data.isAvailable); }
    catch { alert('Failed to update availability'); } finally { setAvailLoading(false); }
  };

  const handleInquirySubmit = async () => {
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) return alert('Please fill name, email and message');
    setInquiryLoading(true);
    try { await api.post(`/inquiries/${id}`, { ...inquiryForm, studentId: user?._id || user?.id || null }); setInquirySent(true); setInquiryForm({ name: '', email: '', phone: '', visitDate: '', message: '' }); }
    catch (err) { alert(err.response?.data?.message || 'Failed to send inquiry'); } finally { setInquiryLoading(false); }
  };

  const handleFavorite = async () => {
    if (!isAuth) { navigate('/login'); return; }
    setFavLoading(true);
    try { if (isFav) { await api.delete(`/favorites/${id}`); setIsFav(false); } else { await api.post(`/favorites/${id}`); setIsFav(true); } }
    finally { setFavLoading(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/boardings/${id}`); navigate('/'); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmitRating = async () => {
    if (!formStars) return alert('Please select a star rating');
    setRatingLoading(true);
    try {
      await api.post(`/ratings/${id}`, { stars: formStars, comment: formComment });
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings); setAvgRating(res.data.average); setTotalRatings(res.data.total);
      const mine = res.data.ratings.find(r => r.user._id === user.id);
      setMyRating(mine); setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save rating'); } finally { setRatingLoading(false); }
  };

  const handleDeleteRating = async () => {
    setDeleteRatingLoading(true);
    try {
      await api.delete(`/ratings/${id}`);
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data.ratings); setAvgRating(res.data.average); setTotalRatings(res.data.total);
      setMyRating(null); setFormStars(0); setFormComment(''); setShowForm(false); setDeleteRatingModal(false);
    } catch {} finally { setDeleteRatingLoading(false); }
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'linear-gradient(160deg, #060f2a, #091428)' : 'linear-gradient(160deg, #e8f0fe, #f0f7ff)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `3px solid rgba(0,212,170,0.2)`, borderTopColor: '#00d4aa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: t.textFaint, fontSize: '0.9rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading listing...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div className="container py-5 text-center" style={{ background: t.bg, minHeight: '100vh', color: t.text }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
      <h4 style={{ color: t.text, marginBottom: '0.5rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{error}</h4>
      <Link to="/"><button className="reg-submit-btn" style={{ marginTop: '1rem' }}>Go Home</button></Link>
    </div>
  );

  const CSS = getCSS(t);
  const imageUrl = boarding.image ? `${IMAGE_BASE}${boarding.image}` : null;
  const isOwner = user && (boarding.owner?._id === user.id || boarding.owner?._id === user._id);
  const starCounts = [5, 4, 3, 2, 1].map(s => ({
    star: s, count: ratings.filter(r => r.stars === s).length,
    pct: ratings.length ? Math.round((ratings.filter(r => r.stars === s).length / ratings.length) * 100) : 0
  }));
  const typeColors = {
    Single: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    Double: { bg: 'rgba(0,212,170,0.15)', color: '#00d4aa' },
    Triple: { bg: 'rgba(45,226,230,0.15)', color: '#2de2e6' },
    Annex:  { bg: 'rgba(8,145,178,0.15)', color: '#0891b2' },
    Other:  { bg: 'rgba(255,255,255,0.08)', color: 'rgba(180,210,255,0.5)' },
  };
  const tc = typeColors[boarding.roomType] || typeColors.Other;

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: t.text, position: 'relative' }}>
      <style>{CSS}</style>
      <ParticleCanvas colors={particleColors} />

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { w: 650, h: 650, color: t.orbColors[0], top: '-200px', left: '-200px', delay: '0s' },
          { w: 550, h: 550, color: t.orbColors[1], top: '35%', right: '-160px', delay: '-5s' },
          { w: 450, h: 450, color: t.orbColors[2], bottom: '-130px', left: '25%', delay: '-10s' },
        ].map((o, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: o.w, height: o.h, background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(70px)', top: o.top, left: o.left, right: o.right, bottom: o.bottom, animation: `orbFloat 14s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px), linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowInquiry(false); }}>
          <div style={{ background: t.inquiryBg, borderRadius: 24, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 24px 80px rgba(0,0,0,0.4)', border: `1px solid ${t.inquiryBorder}` }}>
            {inquirySent ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>✅</div>
                <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.accent, marginBottom: '0.5rem' }}>Inquiry Sent!</h3>
                <p style={{ color: t.textDim, marginBottom: '1.5rem', fontSize: '0.9rem' }}>The owner will contact you soon.</p>
                <button onClick={() => setShowInquiry(false)} className="reg-submit-btn" style={{ padding: '0.75rem 2rem' }}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, color: t.text, margin: 0 }}>📅 Request a Visit</h3>
                  <button onClick={() => setShowInquiry(false)} style={{ background: t.inquiryCloseBg, border: 'none', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.inquiryCloseColor }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { key: 'name', label: 'Your Name *', placeholder: 'Full name', type: 'text' },
                    { key: 'email', label: 'Email Address *', placeholder: 'your@email.com', type: 'email' },
                    { key: 'phone', label: 'Phone Number', placeholder: '+94 77 xxx xxxx', type: 'tel' },
                    { key: 'visitDate', label: 'Preferred Visit Date', placeholder: '', type: 'date' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.textFaint, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={inquiryForm[f.key]}
                        onChange={e => setInquiryForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{ ...glassInputStyle, background: t.inquiryInputBg, border: `1.5px solid ${t.inquiryInputBorder}`, color: t.inquiryInputColor }}
                        onFocus={e => e.target.style.borderColor = t.inputFocus}
                        onBlur={e => e.target.style.borderColor = t.inquiryInputBorder} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: t.textFaint, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
                    <textarea rows={3} placeholder="Hi, I am interested in this room..."
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                      style={{ ...glassInputStyle, resize: 'vertical', background: t.inquiryInputBg, border: `1.5px solid ${t.inquiryInputBorder}`, color: t.inquiryInputColor }}
                      onFocus={e => e.target.style.borderColor = t.inputFocus}
                      onBlur={e => e.target.style.borderColor = t.inquiryInputBorder} />
                  </div>
                  <button onClick={handleInquirySubmit} disabled={inquiryLoading} className="reg-submit-btn" style={{ opacity: inquiryLoading ? 0.7 : 1 }}>
                    {inquiryLoading ? 'Sending...' : '📨 Send Inquiry'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* <ConfirmModal isOpen={deleteListingModal} onClose={() => setDeleteListingModal(false)} onConfirm={handleDelete}
        title="Delete This Listing?" message={`"${boarding.title}" will be permanently removed.`}
        confirmText="Yes, Delete" cancelText="Keep It" type="danger" />
      <ConfirmModal isOpen={deleteRatingModal} onClose={() => setDeleteRatingModal(false)} onConfirm={handleDeleteRating}
        loading={deleteRatingLoading} title="Remove Your Review?" message="Your rating and comment will be permanently deleted."
        confirmText="Yes, Remove" cancelText="Keep It" type="danger" /> */}

        // ✅ Correct
<ConfirmModal
  isOpen={deleteListingModal}
  onCancel={() => setDeleteListingModal(false)}
  onConfirm={handleDelete}
  title="Delete This Listing?"
  message={`"${boarding.title}" will be permanently removed.`}
  confirmText="Yes, Delete"
  confirmColor="red"
  icon="🗑️"
/>

<ConfirmModal
  isOpen={deleteRatingModal}
  onCancel={() => setDeleteRatingModal(false)}
  onConfirm={handleDeleteRating}
  title="Remove Your Review?"
  message="Your rating and comment will be permanently deleted."
  confirmText="Yes, Remove"
  confirmColor="red"
  icon="⭐"
/>

      {/* Hero */}
      <div style={{ position: 'relative', height: 430, background: isDark ? '#060f2a' : '#e8f0fe', overflow: 'hidden', zIndex: 2 }}>
        {(() => {
          const allImages = boarding.images?.length > 0 ? boarding.images : imageUrl ? [boarding.image] : [];
          return allImages.length > 0 ? (
            <>
              <img src={`${IMAGE_BASE}${allImages[activePhoto]}`} alt={boarding.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'opacity 0.3s ease' }} />
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setActivePhoto(p => p === 0 ? allImages.length - 1 : p - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.1rem', zIndex: 5 }}>‹</button>
                  <button onClick={() => setActivePhoto(p => p === allImages.length - 1 ? 0 : p + 1)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.1rem', zIndex: 5 }}>›</button>
                  <div style={{ position: 'absolute', bottom: 88, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem', zIndex: 5 }}>
                    {allImages.map((_, i) => (
                      <button key={i} onClick={() => setActivePhoto(i)} style={{ width: i === activePhoto ? 20 : 8, height: 8, borderRadius: 4, background: i === activePhoto ? '#00d4aa' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', background: isDark ? 'linear-gradient(135deg, #0d1b3e, #091428)' : 'linear-gradient(135deg, #dbeafe, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>🏠</div>
          );
        })()}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,42,0.85) 0%, rgba(6,15,42,0.3) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: t.backBtnBg, backdropFilter: 'blur(8px)', border: `1px solid ${t.backBtnBorder}`, color: t.backBtnColor, borderRadius: 11, padding: '0.5rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,170,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = t.backBtnBg}>
            <FiArrowLeft size={15} /> Back
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleShare} className="action-btn" style={{ background: t.shareBtnBg, backdropFilter: 'blur(8px)', border: `1px solid ${t.shareBtnBorder}`, color: t.shareBtnColor, borderRadius: 11, padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <FiShare2 size={13} /> {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={handleFavorite} disabled={favLoading} className="action-btn" style={{ background: isFav ? 'rgba(239,68,68,0.7)' : t.shareBtnBg, backdropFilter: 'blur(8px)', border: `1px solid ${t.shareBtnBorder}`, color: '#fff', borderRadius: 11, padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <FiHeart size={13} fill={isFav ? '#fff' : 'none'} /> {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ background: tc.bg, color: tc.color, padding: '0.2rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${tc.color}44` }}>{boarding.roomType}</span>
            {totalRatings > 0 && <span style={{ background: 'rgba(0,212,170,0.2)', color: '#00d4aa', padding: '0.2rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>★ {avgRating} · {totalRatings} review{totalRatings !== 1 ? 's' : ''}</span>}
            {!isAvailable && <span style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '0.2rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)' }}>🔴 Occupied</span>}
          </div>
          <h1 style={{ color: '#fff', fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, margin: '0 0 0.4rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{boarding.title}</h1>
          <p style={{ color: 'rgba(220,233,255,0.8)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}><FiMapPin size={14} color="#06b6d4" /> {boarding.location}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container bd-fade" style={{ maxWidth: 1060, paddingTop: '1.8rem', paddingBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div style={{ background: t.cardBg, borderRadius: 20, border: `1px solid ${t.cardBorder}`, marginBottom: '1.2rem', overflow: 'hidden', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', borderBottom: `1px solid ${t.tabBorder}`, paddingLeft: '0.5rem' }}>
                {[{ key: 'about', label: '📋 About' }, { key: 'amenities', label: '✨ Amenities' }, { key: 'reviews', label: `⭐ Reviews${totalRatings > 0 ? ` (${totalRatings})` : ''}` }].map(tab => (
                  <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
                ))}
              </div>
              <div style={{ padding: '1.5rem' }}>
                {activeTab === 'about' && (
                  <div>
                    <p style={{ color: t.textMuted, lineHeight: 1.85, margin: 0, fontSize: '0.95rem' }}>{boarding.description}</p>
                    {boarding.lat && boarding.lng && (
                      <div style={{ marginTop: '1.2rem', background: t.gpsBg, borderRadius: 14, padding: '1rem 1.2rem', border: `1px solid ${t.gpsBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: t.gpsTitle, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>📍 GPS Location</div>
                          <div style={{ fontSize: '0.875rem', color: t.textDim, fontWeight: 600 }}>{boarding.lat}, {boarding.lng}</div>
                        </div>
                        <a href={`https://maps.google.com/?q=${boarding.lat},${boarding.lng}`} target="_blank" rel="noreferrer">
                          <button style={{ background: t.gpsBg, color: t.gpsTitle, border: `1px solid ${t.gpsBorder}`, borderRadius: 10, padding: '0.45rem 1rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}>
                            <FiExternalLink size={13} /> Open Maps
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'amenities' && (
                  <div>
                    {boarding.amenities?.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.7rem' }}>
                        {boarding.amenities.map((a, i) => (
                          <div key={i} className="amenity-chip" style={{ borderRadius: 14, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>{amenityIcons[a] || '✓'}</span>
                            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: t.text }}>{a}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p style={{ color: t.textFaint, textAlign: 'center', padding: '1.5rem 0' }}>No amenities listed.</p>}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    <AIReviewAssistant reviews={ratings} boarding={boarding} isOwner={isOwner} />
                    {totalRatings > 0 && (
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', background: t.ratingBlockBg, borderRadius: 16, padding: '1.2rem', border: `1px solid ${t.ratingBlockBorder}`, flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center', minWidth: 80 }}>
                          <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '3.2rem', fontWeight: 900, color: t.accent, lineHeight: 1 }}>{avgRating}</div>
                          <StarDisplay rating={avgRating} size={16} showNumber={false} />
                          <div style={{ fontSize: '0.73rem', color: t.textFaint, marginTop: '0.3rem' }}>{totalRatings} review{totalRatings !== 1 ? 's' : ''}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          {starCounts.map(({ star, count, pct }) => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <span style={{ fontSize: '0.73rem', color: t.textFaint, width: 8 }}>{star}</span>
                              <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★</span>
                              <div style={{ flex: 1, height: 7, background: t.ratingBarBg, borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${t.accent}, #2de2e6)`, borderRadius: 4, transition: 'width 0.6s ease' }} />
                              </div>
                              <span style={{ fontSize: '0.7rem', color: t.textFainter, width: 18 }}>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {isAuth && !isOwner ? (
                      <div style={{ marginBottom: '1.5rem' }}>
                        {myRating && !showForm ? (
                          <div style={{ background: t.myReviewBg, borderRadius: 14, padding: '1.1rem 1.3rem', border: `1px solid ${t.myReviewBorder}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <span style={{ width: 16, height: 16, background: t.accent, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#060f2a', fontSize: '0.6rem', fontWeight: 900 }}>✓</span> Your Review
                                </div>
                                <StarDisplay rating={myRating.stars} size={18} />
                                {myRating.comment && <p style={{ fontSize: '0.875rem', color: t.textMuted, marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.65 }}>{myRating.comment}</p>}
                              </div>
                              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, marginLeft: '0.8rem' }}>
                                <button onClick={() => setShowForm(true)} style={{ background: t.editBtnBg, color: t.editBtnColor, border: `1px solid ${t.editBtnBorder}`, borderRadius: 9, padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  <FiEdit2 size={12} /> Edit
                                </button>
                                <button onClick={() => setDeleteRatingModal(true)} style={{ background: t.deleteBtnBg, color: t.deleteBtnColor, border: `1px solid ${t.deleteBtnBorder}`, borderRadius: 9, padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  <FiTrash2 size={12} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : showForm || !myRating ? (
                          <div style={{ background: t.writeReviewBg, borderRadius: 16, padding: '1.3rem', border: `1px solid ${t.writeReviewBorder}` }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: t.text, marginBottom: '1rem', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                              {myRating ? '✏️ Edit Your Review' : '✏️ Write a Review'}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.72rem', color: t.textFaint, marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rating *</div>
                              <StarRating value={formStars} onChange={setFormStars} size={34} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.72rem', color: t.textFaint, marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment (optional)</div>
                              <textarea value={formComment} onChange={e => setFormComment(e.target.value)} placeholder="Share your experience..." rows={3}
                                style={{ ...glassInputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                onFocus={e => e.target.style.borderColor = t.inputFocus}
                                onBlur={e => e.target.style.borderColor = t.inputBorder} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={handleSubmitRating} disabled={ratingLoading || !formStars}
                                className={formStars && !ratingLoading ? 'reg-submit-btn' : ''}
                                style={formStars && !ratingLoading ? { padding: '0.6rem 1.3rem', borderRadius: 10, fontSize: '0.875rem' } : { background: t.writeReviewBg, color: t.textFaint, border: `1px solid ${t.writeReviewBorder}`, borderRadius: 10, padding: '0.6rem 1.3rem', fontWeight: 700, cursor: 'not-allowed', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {ratingLoading ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> : <FiCheck size={14} />}
                                {myRating ? 'Update Review' : 'Submit Review'}
                              </button>
                              {(myRating || showForm) && (
                                <button onClick={() => setShowForm(false)} style={{ background: t.cancelBtnBg, color: t.cancelBtnColor, border: `1px solid ${t.cancelBtnBorder}`, borderRadius: 10, padding: '0.6rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  <FiX size={14} /> Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : !isAuth ? (
                      <div style={{ background: t.loginBg, borderRadius: 14, padding: '1.2rem', border: `1px solid ${t.loginBorder}`, marginBottom: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: t.textDim, margin: '0 0 0.8rem', fontSize: '0.9rem' }}>Login to share your experience</p>
                        <Link to="/login"><button className="reg-submit-btn" style={{ padding: '0.55rem 1.5rem', fontSize: '0.875rem' }}>Login to Review</button></Link>
                      </div>
                    ) : null}
                    {ratings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem', color: t.textFaint }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                        <p style={{ margin: 0, fontWeight: 500 }}>No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {ratings.map(r => (
                          <div key={r._id} className="review-card" style={{ padding: '1.1rem 1.3rem', borderRadius: 14, border: `1px solid ${t.reviewBorder}`, background: t.reviewBg, transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
                                  {r.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: t.text }}>{r.user?.name}</div>
                                  <StarDisplay rating={r.stars} size={13} showNumber={false} />
                                </div>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: t.dateColor, background: t.dateBg, padding: '0.2rem 0.65rem', borderRadius: 20, border: `1px solid ${t.dateBorderColor}` }}>
                                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            {r.comment && <p style={{ fontSize: '0.875rem', color: t.textMuted, margin: 0, lineHeight: 1.7, paddingLeft: '0.2rem' }}>{r.comment}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {!isOwner && isAvailable && (
              <button onClick={() => { setShowInquiry(true); setInquirySent(false); }} className="reg-submit-btn" style={{ width: '100%', marginBottom: '0.8rem', background: 'linear-gradient(135deg, #059669, #00d4aa)' }}>📅 Request a Visit</button>
            )}
            {!isOwner && !isAvailable && (
              <div style={{ background: t.notAvailBg, border: `1px solid ${t.notAvailBorder}`, borderRadius: 14, padding: '0.85rem', textAlign: 'center', marginBottom: '0.8rem' }}>
                <span style={{ color: t.notAvailColor, fontWeight: 700, fontSize: '0.9rem' }}>🔴 This room is currently occupied</span>
              </div>
            )}
            {isOwner && (
              <>
                <button onClick={handleToggleAvailability} disabled={availLoading} style={{ width: '100%', border: 'none', borderRadius: 14, padding: '0.8rem', background: isAvailable ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.8rem', opacity: availLoading ? 0.7 : 1 }}>
                  {availLoading ? 'Updating...' : isAvailable ? '🔴 Mark as Occupied' : '✅ Mark as Available'}
                </button>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <Link to={`/edit/${id}`}>
                    <button style={{ background: t.editBtnBg, color: t.editBtnColor, border: `1px solid ${t.editBtnBorder}`, borderRadius: 12, padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,165,233,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = t.editBtnBg}>
                      <FiEdit2 size={15} /> Edit Listing
                    </button>
                  </Link>
                  <button onClick={() => setDeleteListingModal(true)} style={{ background: t.deleteBtnBg, color: t.deleteBtnColor, border: `1px solid ${t.deleteBtnBorder}`, borderRadius: 12, padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = t.deleteBtnBg}>
                    <FiTrash2 size={15} /> Delete Listing
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: t.sidebarBg, borderRadius: 22, padding: '1.6rem', border: `1px solid ${t.sidebarBorder}`, backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.68rem', color: t.monthlyLabel, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Monthly Rent</div>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '2.4rem', fontWeight: 900, color: t.priceColor, lineHeight: 1 }}>
                    {format(boarding.price)}<span style={{ fontSize: '0.9rem', color: t.origPriceColor, fontWeight: 400 }}>/mo</span>
                  </div>
                  {currency.code !== 'LKR' && <div style={{ marginTop: '0.3rem', fontSize: '0.76rem', color: t.origPriceColor }}>≈ LKR {Number(boarding.price).toLocaleString()} original</div>}
                  {totalRatings > 0 && <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><StarDisplay rating={avgRating} size={14} /><span style={{ fontSize: '0.75rem', color: t.textFaint }}>({totalRatings} review{totalRatings !== 1 ? 's' : ''})</span></div>}
                </div>
                <div style={{ height: 1, background: t.divider, margin: '1rem 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.2rem' }}>
                  {boarding.contact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', background: t.infoBg, borderRadius: 12, border: `1px solid ${t.infoBorder}` }}>
                      <div style={{ width: 32, height: 32, background: t.phoneIconBg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${t.phoneIconBorder}` }}>
                        <FiPhone size={14} color={t.phoneIconColor} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', color: t.textFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: t.text }}>{boarding.contact}</div>
                      </div>
                    </div>
                  )}
                  {boarding.owner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0.9rem', background: t.infoBg, borderRadius: 12, border: `1px solid ${t.infoBorder}` }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #00d4aa, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                        {boarding.owner.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.66rem', color: t.textFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listed by</div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.owner.name}</div>
                        <div style={{ fontSize: '0.73rem', color: t.textFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{boarding.owner.email}</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem', fontSize: '0.75rem', color: t.textFaint }}>
                    <FiCalendar size={12} /> Listed {new Date(boarding.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                {isAuth && !isOwner ? (
                  <button onClick={handleFavorite} disabled={favLoading} style={{ width: '100%', border: isFav ? `1px solid rgba(239,68,68,0.3)` : 'none', borderRadius: 14, padding: '0.85rem', background: isFav ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #00d4aa, #0ea5e9)', color: isFav ? '#f87171' : '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s', boxShadow: isFav ? 'none' : '0 4px 20px rgba(0,212,170,0.3)' }}>
                    <FiHeart fill={isFav ? '#f87171' : 'none'} size={16} />{isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                  </button>
                ) : !isAuth ? (
                  <Link to="/login"><button className="reg-submit-btn" style={{ width: '100%', padding: '0.85rem' }}>Login to Save</button></Link>
                ) : null}
                {!showForm && !myRating && isAuth && !isOwner && (
                  <button onClick={() => { setActiveTab('reviews'); setShowForm(true); }} style={{ width: '100%', marginTop: '0.6rem', background: t.myReviewBg, color: t.accent, border: `1px solid ${t.myReviewBorder}`, borderRadius: 14, padding: '0.8rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}>
                    ⭐ Write a Review
                  </button>
                )}
              </div>
              {boarding.amenities?.length > 0 && (
                <div style={{ background: t.sidebarBg, borderRadius: 18, padding: '1.2rem', border: `1px solid ${t.cardBorder}`, backdropFilter: 'blur(12px)' }}>
                  <div style={{ fontSize: '0.72rem', color: t.textFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>What's Included</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {boarding.amenities.slice(0, 6).map((a, i) => (
                      <span key={i} style={{ background: t.smallAmenityBg, color: t.accent, border: `1px solid ${t.smallAmenityBorder}`, padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.76rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {amenityIcons[a] || '✓'} {a}
                      </span>
                    ))}
                    {boarding.amenities.length > 6 && (
                      <button onClick={() => setActiveTab('amenities')} style={{ background: t.smallAmenityMoreBg, color: t.smallAmenityMoreColor, border: `1px solid ${t.smallAmenityMoreBorder}`, padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        +{boarding.amenities.length - 6} more
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingDetail;