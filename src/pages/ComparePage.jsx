import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMapPin, FiCheck, FiMinus, FiArrowLeft, FiHome } from 'react-icons/fi';
import api from '../api/axios';
import { StarDisplay } from '../components/StarRating';
import { useCurrency } from '../context/CurrencyContext';

const IMAGE_BASE = 'http://localhost:5001/uploads/';

const amenityIcons = {
  'WiFi':'📶','Water':'💧','Electricity':'⚡','Kitchen':'🍳','Parking':'🚗',
  'Air Conditioning':'❄️','Laundry':'👕','Security':'🔒','CCTV':'📷',
  'Meals Included':'🍽️','Meals Available':'🍽️','Study Table':'📚','Fan':'🌀',
  'Hot Water':'🚿','Rooftop':'🏙️','Private Bathroom':'🛁','WiFi 100Mbps':'📶',
  'Security Gate':'🚪','Peaceful Environment':'🌿','Meals on Request':'🍽️',
};

const typeColors = {
  Single:{bg:'#dbeafe',color:'#1d4ed8'},Double:{bg:'#d1fae5',color:'#065f46'},
  Triple:{bg:'#fef3c7',color:'#92400e'},Annex:{bg:'#ede9fe',color:'#5b21b6'},
  Other:{bg:'#f1f5f9',color:'#475569'},
};

const CompareRow = ({ label, children, alt }) => (
  <div style={{ display:'grid', gridTemplateColumns:`200px repeat(${React.Children.count(children)},1fr)`, borderTop:'1px solid #f1f5f9', background:alt?'#fafbfc':'#fff' }}>
    <div style={{ padding:'1rem 1.2rem', display:'flex', alignItems:'center', borderRight:'1px solid #f1f5f9' }}>
      <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#475569' }}>{label}</span>
    </div>
    {children}
  </div>
);

const CellValue = ({ children, highlight }) => (
  <div style={{ padding:'1rem', textAlign:'center', borderLeft:'1px solid #f1f5f9', background:highlight?'rgba(37,99,235,0.02)':'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
    {children}
  </div>
);

const ComparePage = () => {
  const navigate = useNavigate();
  const { format, currency } = useCurrency();
  const [allBoardings, setAllBoardings] = useState([]);
  const [selected, setSelected] = useState([null, null, null]);
  const [search, setSearch] = useState(['','','']);
  const [dropdownOpen, setDropdownOpen] = useState([false,false,false]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/boardings').then(res => setAllBoardings(res.data.boardings||[])).catch(console.error).finally(()=>setLoading(false));
  }, []);

  useEffect(() => {
    selected.forEach(b => {
      if (b && !ratingsMap[b._id]) {
        api.get(`/ratings/${b._id}`).then(res => setRatingsMap(prev=>({...prev,[b._id]:{avg:res.data.average,total:res.data.total}}))).catch(()=>{});
      }
    });
  }, [selected]);

  const handleSelect = (idx, boarding) => {
    const u=[...selected]; u[idx]=boarding; setSelected(u);
    const s=[...search]; s[idx]=''; setSearch(s);
    setDropdownOpen([false,false,false]);
  };

  const handleRemove = (idx) => { const u=[...selected]; u[idx]=null; setSelected(u); };

  const handleSearchChange = (idx, val) => {
    const s=[...search]; s[idx]=val; setSearch(s);
    const d=[...dropdownOpen]; d[idx]=true; setDropdownOpen(d);
  };

  const getFiltered = (idx) => {
    const q=search[idx].toLowerCase();
    const ids=selected.map(b=>b?._id).filter(Boolean);
    return allBoardings.filter(b=>!ids.includes(b._id)&&(b.title.toLowerCase().includes(q)||b.location.toLowerCase().includes(q))).slice(0,6);
  };

  const allAmenities=[...new Set(selected.filter(Boolean).flatMap(b=>b.amenities||[]))].sort();
  const filledCount=selected.filter(Boolean).length;
  const prices=selected.map(b=>b?b.price:null);
  const minPrice=Math.min(...prices.filter(Boolean));
  const ratingVals=selected.map(b=>b?(ratingsMap[b._id]?.avg||0):null);
  const maxRating=Math.max(...ratingVals.filter(Boolean));

  return (
    <div style={{ background:'#f1f5f9', minHeight:'100vh' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.cf{animation:fadeUp 0.35s ease forwards}.si:hover{background:#f0f9ff!important}`}</style>

      <div style={{ background:'linear-gradient(135deg,#1e293b 0%,#1d4ed8 100%)', padding:'2rem 0' }}>
        <div className="container">
          <button onClick={()=>navigate(-1)} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', borderRadius:10, padding:'0.45rem 1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.875rem', fontWeight:600, fontFamily:'var(--font-body)', marginBottom:'1rem' }}>
            <FiArrowLeft size={14}/>Back
          </button>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'2rem', fontWeight:800, color:'#fff', margin:0 }}>Compare Listings</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', margin:'0.3rem 0 0', fontSize:'0.95rem' }}>Select up to 3 boarding places to compare side by side</p>
        </div>
      </div>

      <div className="container cf" style={{ paddingTop:'2rem', paddingBottom:'3rem', maxWidth:1100 }}>
        <div className="row g-3 mb-4">
          {[0,1,2].map(idx=>(
            <div key={idx} className="col-md-4">
              <div style={{ background:'#fff', borderRadius:16, border:selected[idx]?'2px solid #2563eb':'2px dashed #cbd5e1', boxShadow:'0 2px 12px rgba(15,23,42,0.06)', position:'relative' }}>
                {selected[idx] ? (
                  <div>
                    <div style={{ position:'relative', height:160, overflow:'hidden' }}>
                      {selected[idx].image
                        ? <img src={`${IMAGE_BASE}${selected[idx].image}`} alt={selected[idx].title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display="none"}/>
                        : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1e293b,#334155)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🏠</div>}
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.6),transparent)' }}/>
                      <button onClick={()=>handleRemove(idx)} style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                        <FiX size={14}/>
                      </button>
                      {(()=>{const tc=typeColors[selected[idx].roomType]||typeColors.Other; return <span style={{ position:'absolute', bottom:10, left:12, background:tc.bg, color:tc.color, padding:'0.15rem 0.6rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700 }}>{selected[idx].roomType}</span>;})()}
                    </div>
                    <div style={{ padding:'0.9rem 1rem' }}>
                      <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#0f172a', marginBottom:'0.3rem', lineHeight:1.3 }}>{selected[idx].title}</div>
                      <div style={{ fontSize:'0.78rem', color:'#64748b', display:'flex', alignItems:'center', gap:'0.3rem', marginBottom:'0.4rem' }}><FiMapPin size={11}/>{selected[idx].location}</div>
                      <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.2rem', fontWeight:800, color:'#2563eb' }}>
                        {format(selected[idx].price)}<span style={{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:400 }}>/mo</span>
                      </div>
                      {currency.code !== 'LKR' && (
                        <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.2rem' }}>
                          ≈ LKR {selected[idx].price.toLocaleString()} original
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding:'1.5rem 1rem' }}>
                    <div style={{ textAlign:'center', marginBottom:'1rem' }}>
                      <div style={{ width:48, height:48, background:'#f1f5f9', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.6rem', fontSize:'1.5rem' }}>{idx===0?'🏠':idx===1?'🏡':'🏘️'}</div>
                      <div style={{ fontSize:'0.82rem', color:'#94a3b8', fontWeight:600 }}>{idx===0?'First Listing':idx===1?'Second Listing':'Third Listing (Optional)'}</div>
                    </div>
                    <div style={{ position:'relative' }}>
                      <input type="text" placeholder="Search boarding..." value={search[idx]} onChange={e=>handleSearchChange(idx,e.target.value)} onFocus={()=>{const d=[...dropdownOpen];d[idx]=true;setDropdownOpen(d);}}
                        style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0.6rem 0.9rem', fontSize:'0.875rem', fontFamily:'var(--font-body)', outline:'none', color:'#0f172a' }}/>
                      {dropdownOpen[idx]&&(
                        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'#ffffff', borderRadius:12, border:'1px solid #e2e8f0', boxShadow:'0 8px 32px rgba(15,23,42,0.12)', zIndex:100, overflow:'hidden', maxHeight:240, overflowY:'auto' }}>
                          {loading?<div style={{ padding:'1rem', textAlign:'center', color:'#94a3b8', fontSize:'0.85rem' }}>Loading...</div>
                          :getFiltered(idx).length===0?<div style={{ padding:'1rem', textAlign:'center', color:'#94a3b8', fontSize:'0.85rem' }}>No results</div>
                          :getFiltered(idx).map(b=>(
                            <div key={b._id} className="si" style={{ padding:'0.7rem 1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.7rem', borderBottom:'1px solid #f8fafc', transition:'background 0.15s' }} onClick={()=>handleSelect(idx,b)}>
                              {b.image?<img src={`${IMAGE_BASE}${b.image}`} alt={b.title} style={{ width:40,height:34,objectFit:'cover',borderRadius:7,flexShrink:0 }} onError={e=>e.target.style.display="none"}/>
                              :<div style={{ width:40,height:34,background:'#e2e8f0',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0 }}>🏠</div>}
                              <div style={{ minWidth:0 }}>
                                <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</div>
                                <div style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{b.location} · {format(b.price)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {dropdownOpen.some(Boolean)&&<div style={{ position:'fixed', inset:0, zIndex:99 }} onClick={()=>setDropdownOpen([false,false,false])}/>}

        {filledCount>=2?(
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 4px 24px rgba(15,23,42,0.08)' }}>
            <div style={{ display:'grid', gridTemplateColumns:`200px repeat(${filledCount},1fr)`, background:'linear-gradient(135deg,#1e293b,#1d4ed8)' }}>
              <div style={{ padding:'1.2rem', borderRight:'1px solid rgba(255,255,255,0.1)' }}/>
              {selected.filter(Boolean).map((b,i)=>(
                <div key={b._id} style={{ padding:'1.2rem', borderRight:i<filledCount-1?'1px solid rgba(255,255,255,0.1)':'none', textAlign:'center' }}>
                  <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#fff', lineHeight:1.3, marginBottom:'0.3rem' }}>{b.title}</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem' }}><FiMapPin size={10}/>{b.location}</div>
                </div>
              ))}
            </div>

            <CompareRow label="💰 Monthly Rent">
              {selected.filter(Boolean).map(b=>(
                <CellValue key={b._id} highlight={b.price===minPrice}>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.4rem', fontWeight:800, color:b.price===minPrice?'#059669':'#0f172a' }}>
                    {format(b.price)}
                  </div>
                  {currency.code !== 'LKR' && (
                    <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginTop:'0.2rem' }}>
                      LKR {b.price.toLocaleString()}
                    </div>
                  )}
                  {b.price===minPrice&&filledCount>1&&<span style={{ background:'#d1fae5', color:'#059669', fontSize:'0.68rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:20, marginTop:'0.3rem', display:'inline-block' }}>✓ Best Price</span>}
                </CellValue>
              ))}
            </CompareRow>

            <CompareRow label="🏠 Room Type" alt>
              {selected.filter(Boolean).map(b=>{const tc=typeColors[b.roomType]||typeColors.Other; return(
                <CellValue key={b._id}><span style={{ background:tc.bg, color:tc.color, padding:'0.3rem 0.9rem', borderRadius:20, fontSize:'0.82rem', fontWeight:700 }}>{b.roomType}</span></CellValue>
              );})}
            </CompareRow>

            <CompareRow label="⭐ Rating">
              {selected.filter(Boolean).map(b=>{const r=ratingsMap[b._id]; const isTop=r?.avg&&r.avg===maxRating&&maxRating>0; return(
                <CellValue key={b._id} highlight={isTop}>
                  {r&&r.total>0?<div><StarDisplay rating={r.avg} size={16}/><div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:'0.2rem' }}>{r.total} review{r.total!==1?'s':''}</div>{isTop&&filledCount>1&&<span style={{ background:'#fef3c7', color:'#d97706', fontSize:'0.68rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:20, marginTop:'0.3rem', display:'inline-block' }}>✓ Top Rated</span>}</div>
                  :<span style={{ color:'#cbd5e1', fontSize:'0.82rem' }}>No reviews</span>}
                </CellValue>
              );})}
            </CompareRow>

            <CompareRow label="✨ Amenities Count" alt>
              {selected.filter(Boolean).map(b=>{const count=b.amenities?.length||0; const maxCount=Math.max(...selected.filter(Boolean).map(x=>x.amenities?.length||0)); return(
                <CellValue key={b._id} highlight={count===maxCount&&maxCount>0}>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.6rem', fontWeight:800, color:count===maxCount?'#2563eb':'#0f172a' }}>{count}</div>
                  {count===maxCount&&filledCount>1&&<span style={{ background:'#dbeafe', color:'#1d4ed8', fontSize:'0.68rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:20, display:'inline-block' }}>✓ Most</span>}
                </CellValue>
              );})}
            </CompareRow>

            <CompareRow label="📞 Contact">
              {selected.filter(Boolean).map(b=>(<CellValue key={b._id}><span style={{ fontSize:'0.875rem', fontWeight:600, color:'#0f172a' }}>{b.contact||'—'}</span></CellValue>))}
            </CompareRow>

            <CompareRow label="👤 Listed By" alt>
              {selected.filter(Boolean).map(b=>(<CellValue key={b._id}><span style={{ fontSize:'0.875rem', fontWeight:600, color:'#0f172a' }}>{b.owner?.name||'—'}</span></CellValue>))}
            </CompareRow>

            {allAmenities.length>0&&<>
              <div style={{ padding:'0.8rem 1.2rem', background:'#f8fafc', borderTop:'2px solid #e2e8f0', borderBottom:'1px solid #e2e8f0' }}>
                <span style={{ fontSize:'0.78rem', fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em' }}>Amenities Breakdown</span>
              </div>
              {allAmenities.map((amenity,i)=>(
                <CompareRow key={amenity} label={`${amenityIcons[amenity]||'•'} ${amenity}`} alt={i%2===0}>
                  {selected.filter(Boolean).map(b=>{const has=b.amenities?.includes(amenity); return(
                    <CellValue key={b._id}>
                      {has?<div style={{ width:28,height:28,background:'#d1fae5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto' }}><FiCheck size={14} color="#059669"/></div>
                      :<div style={{ width:28,height:28,background:'#f1f5f9',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto' }}><FiMinus size={14} color="#cbd5e1"/></div>}
                    </CellValue>
                  );})}
                </CompareRow>
              ))}
            </>}

            <div style={{ display:'grid', gridTemplateColumns:`200px repeat(${filledCount},1fr)`, borderTop:'2px solid #e2e8f0', background:'#f8fafc' }}>
              <div style={{ padding:'1.2rem', display:'flex', alignItems:'center' }}><span style={{ fontSize:'0.78rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase' }}>Actions</span></div>
              {selected.filter(Boolean).map(b=>(
                <div key={b._id} style={{ padding:'1rem', textAlign:'center', borderLeft:'1px solid #e2e8f0' }}>
                  <Link to={`/boarding/${b._id}`}>
                    <button style={{ background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', border:'none', borderRadius:10, padding:'0.6rem 1.2rem', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', fontFamily:'var(--font-body)', display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
                      <FiHome size={14}/>View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ):(
          <div style={{ background:'#fff', borderRadius:20, border:'2px dashed #cbd5e1', padding:'3rem', textAlign:'center' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>⚖️</div>
            <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#0f172a', marginBottom:'0.5rem' }}>Select at least 2 listings to compare</h3>
            <p style={{ color:'#94a3b8', margin:'0 0 1.5rem' }}>Use the search boxes above to pick boarding places side by side</p>
            <Link to="/"><button style={{ background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', border:'none', borderRadius:12, padding:'0.75rem 1.8rem', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:'var(--font-body)' }}>Browse Listings</button></Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;