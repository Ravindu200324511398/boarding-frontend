import React, { useState } from 'react';

const AIReviewAssistant = ({ reviews, boarding, isOwner = false }) => {
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [ownerReply, setOwnerReply] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const [error, setError] = useState('');

  

  const avgStars = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);

  const callClaude = async (prompt, systemPrompt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || '';
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setError('');
    setSummary('');
    setHighlights([]);
    setSentiment(null);
    try {
      const reviewText = reviews
        .map((r, i) => `Review ${i + 1} (${r.stars}/5 stars by ${r.user?.name || 'Anonymous'}): ${r.comment || '(no comment)'}`)
        .join('\n');
      const systemPrompt = `You are a helpful review analysis assistant for a student boarding house finder app in Sri Lanka. Be concise, friendly, and helpful. Always respond in valid JSON only — no markdown, no extra text.`;
      const prompt = `Analyze these ${reviews.length} reviews for "${boarding?.title}" in ${boarding?.location}:\n\n${reviewText}\n\nAverage rating: ${avgStars}/5\n\nReturn ONLY a JSON object with these exact keys:\n{\n  "summary": "2-3 sentence summary of what reviewers think overall, written naturally",\n  "sentiment": "positive" or "mixed" or "negative",\n  "highlights": ["up to 4 short phrases of what people mention most, e.g. 'Great WiFi', 'Clean rooms'"],\n  "tip": "one practical tip for a student considering this place, based on the reviews"\n}`;
      const raw = await callClaude(prompt, systemPrompt);
      const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim();
      const parsed = JSON.parse(clean);
      setSummary(parsed.summary + (parsed.tip ? '\n\n💡 ' + parsed.tip : ''));
      setSentiment(parsed.sentiment);
      setHighlights(parsed.highlights || []);
      setSummaryDone(true);
    } catch (err) {
      setError('Could not generate summary. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSuggestReply = async (review) => {
    setSelectedReview(review._id || review.createdAt);
    setOwnerReply('');
    setLoadingReply(true);
    try {
      const systemPrompt = `You are helping a boarding house owner in Sri Lanka write a professional, warm reply to a student's review. Keep replies short (2-3 sentences), friendly, and genuine. No markdown.`;
      const prompt = `A student left this ${review.stars}/5 star review for "${boarding?.title}":\n"${review.comment || '(no comment, just a star rating)'}"\n\nWrite a short, professional owner reply that thanks them, addresses any concern if low rating, and invites others. Under 3 sentences. Plain text only.`;
      const reply = await callClaude(prompt, systemPrompt);
      setOwnerReply(reply.trim());
    } catch {
      setOwnerReply('Could not generate reply. Please try again.');
    } finally {
      setLoadingReply(false);
    }
  };

  const sentimentConfig = {
    positive: { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', icon: '😊', label: 'Mostly Positive' },
    mixed:    { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', icon: '😐', label: 'Mixed Reviews' },
    negative: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', icon: '😞', label: 'Mostly Negative' },
  };
  const sc = sentiment ? sentimentConfig[sentiment] : null;

  return (
    <div style={{ background:'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)', borderRadius:16, padding:'1.5rem', border:'1.5px solid #bae6fd', marginBottom:'1rem' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#0f172a', fontFamily:'var(--font-heading)' }}>AI Review Summary</div>
            <div style={{ fontSize:'0.75rem', color:'#64748b' }}>Powered by Claude AI · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        {!summaryDone ? (
          <button onClick={handleSummarize} disabled={loadingSummary}
            style={{ background:loadingSummary ? '#e0f2fe' : 'linear-gradient(135deg,#0ea5e9,#6366f1)', color:loadingSummary ? '#0ea5e9' : '#fff', border:'none', borderRadius:10, padding:'0.5rem 1.1rem', fontSize:'0.85rem', fontWeight:700, cursor:loadingSummary ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--font-body)' }}>
            {loadingSummary ? <><span style={{ display:'inline-block', width:14, height:14, border:'2px solid #0ea5e9', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />Analyzing...</> : <>✨ Analyze Reviews</>}
          </button>
        ) : (
          <button onClick={() => { setSummaryDone(false); setSummary(''); setSentiment(null); setHighlights([]); }}
            style={{ background:'transparent', border:'1px solid #bae6fd', borderRadius:8, padding:'0.35rem 0.8rem', fontSize:'0.78rem', color:'#0ea5e9', cursor:'pointer', fontWeight:600 }}>
            ↺ Refresh
          </button>
        )}
      </div>

      {error && <div style={{ background:'#fef2f2', color:'#dc2626', padding:'0.7rem 1rem', borderRadius:10, fontSize:'0.85rem', marginBottom:'0.8rem' }}>⚠️ {error}</div>}

      {loadingSummary && (
        <div>
          {[80,60,90].map((w,i) => (
            <div key={i} style={{ height:14, borderRadius:7, marginBottom:10, width:`${w}%`, background:'linear-gradient(90deg,#e0f2fe 25%,#bae6fd 50%,#e0f2fe 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite' }} />
          ))}
        </div>
      )}

      {summaryDone && (
        <div>
          {sc && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, borderRadius:20, padding:'0.3rem 0.9rem', fontSize:'0.82rem', fontWeight:700, marginBottom:'0.9rem' }}>
              {sc.icon} {sc.label}
            </div>
          )}
          {highlights.length > 0 && (
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.9rem' }}>
              {highlights.map((h,i) => (
                <span key={i} style={{ background:'#fff', border:'1px solid #bae6fd', color:'#0369a1', padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:600 }}># {h}</span>
              ))}
            </div>
          )}
          <div style={{ background:'#fff', borderRadius:12, padding:'1rem 1.2rem', border:'1px solid #e0f2fe', fontSize:'0.9rem', color:'#334155', lineHeight:1.75, whiteSpace:'pre-line' }}>
            {summary}
          </div>
        </div>
      )}

      {isOwner && reviews.filter(r => r.comment).length > 0 && (
        <div style={{ marginTop:'1.2rem', paddingTop:'1.1rem', borderTop:'1px dashed #bae6fd' }}>
          <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#0369a1', marginBottom:'0.7rem' }}>
            💬 AI Reply Suggester — <span style={{ fontWeight:400, color:'#64748b' }}>click a review to generate a reply</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {reviews.filter(r => r.comment).slice(0,3).map((r,i) => (
              <div key={i}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'0.7rem', padding:'0.7rem 0.9rem', borderRadius:10, background:selectedReview===(r._id||r.createdAt)?'#e0f2fe':'#f8fafc', border:`1px solid ${selectedReview===(r._id||r.createdAt)?'#bae6fd':'#e2e8f0'}`, cursor:'pointer', transition:'all 0.15s' }}
                  onClick={() => handleSuggestReply(r)}>
                  <span style={{ color:'#f59e0b', fontSize:'0.9rem', flexShrink:0 }}>{'★'.repeat(r.stars)}</span>
                  <span style={{ fontSize:'0.82rem', color:'#475569', flex:1 }}>"{r.comment?.slice(0,80)}{r.comment?.length > 80 ? '…' : ''}"</span>
                  <span style={{ fontSize:'0.75rem', color:'#0ea5e9', fontWeight:600, flexShrink:0 }}>{loadingReply && selectedReview===(r._id||r.createdAt) ? '...' : '→ Reply'}</span>
                </div>
                {selectedReview===(r._id||r.createdAt) && ownerReply && !loadingReply && (
                  <div style={{ background:'#fff', borderRadius:'0 0 10px 10px', padding:'0.8rem 1rem', border:'1px solid #bae6fd', borderTop:'none', fontSize:'0.875rem', color:'#0f172a', lineHeight:1.6 }}>
                    <div style={{ fontSize:'0.72rem', color:'#0ea5e9', fontWeight:700, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>✨ Suggested Reply</div>
                    {ownerReply}
                    <button onClick={() => navigator.clipboard.writeText(ownerReply)}
                      style={{ display:'block', marginTop:'0.6rem', background:'#e0f2fe', color:'#0369a1', border:'none', borderRadius:7, padding:'0.35rem 0.8rem', fontSize:'0.75rem', fontWeight:600, cursor:'pointer' }}>
                      📋 Copy Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReviewAssistant;
