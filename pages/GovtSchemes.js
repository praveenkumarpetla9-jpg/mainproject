// ══════════════════════════════════════════
// pages/GovtSchemes.js
// Government scheme eligibility finder — 2 features:
//
// Feature 1 — 5-step wizard
//   Steps: land size → main crop → annual income
//   → district → social category.
//   Animated progress bar + step dots.
//
// Feature 2 — Matched schemes + total ₹
//   matchSchemes() engine (schemesData.js)
//   returns sorted list. Animated total
//   counter. Expandable detail per scheme
//   (docs, deadline, apply link).
//
// Props:
//   lang      — 'EN' | 'TE'
//   showToast — (msg: string) => void
// ══════════════════════════════════════════

function GovtSchemes({ lang, showToast }) {
  const TE = lang === 'TE';

  const [wizStep,   setWizStep]   = useState(0);
  const [form,      setForm]      = useState({ land:'2', crop:'Rice', income:'75000', district:'Guntur', category:'General' });
  const formRef                    = useRef({ land:'2', crop:'Rice', income:'75000', district:'Guntur', category:'General' });
  const [results,   setResults]   = useState(null);
  const [expanded,  setExpanded]  = useState(null);
  const [animTotal, setAnimTotal] = useState(0);

  const WIZARD_STEPS = [
    { key:'land',     label_en:'Land Size',     label_te:'భూమి పరిమాణం',  icon:'📐' },
    { key:'crop',     label_en:'Main Crop',     label_te:'ప్రధాన పంట',    icon:'🌾' },
    { key:'income',   label_en:'Annual Income', label_te:'వార్షిక ఆదాయం', icon:'💰' },
    { key:'district', label_en:'District',      label_te:'జిల్లా',         icon:'📍' },
    { key:'category', label_en:'Category',      label_te:'వర్గం',          icon:'👤' },
  ];

  const CROPS_LIST    = ['Rice','Chilli','Groundnut','Cotton','Onion','Maize','Sunflower','Sugarcane'];
  const CAT_LIST      = ['General','OBC','SC','ST'];
  const INCOME_RANGES = [
    { label:'Below ₹50,000',    label_te:'₹50,000 కంటే తక్కువ',  value:'49000'  },
    { label:'₹50,000–₹1 lakh',  label_te:'₹50,000–₹1 లక్ష',     value:'75000'  },
    { label:'₹1–₹2 lakh',       label_te:'₹1–₹2 లక్షలు',        value:'150000' },
    { label:'Above ₹2 lakh',    label_te:'₹2 లక్షలు పైన',        value:'250000' },
  ];

  function set(k, v) {
    formRef.current = { ...formRef.current, [k]: v };
    setForm(f => ({ ...f, [k]: v }));
  }

  function next() { if (wizStep < 4) setWizStep(w => w + 1); else submit(); }
  function back() { setWizStep(w => Math.max(0, w - 1)); }

  function submit() {
    const f       = formRef.current;
    const matched = matchSchemes(f.land, f.crop, f.income, f.district, f.category);
    setResults(matched);
    setWizStep(5);

    // Animate total benefit counter
    const total = matched.reduce((s, r) => s + r.benefit, 0);
    let cur = 0;
    const inc = Math.max(1, Math.ceil(total / 60));
    const iv = setInterval(() => { cur = Math.min(cur + inc, total); setAnimTotal(cur); if (cur >= total) clearInterval(iv); }, 20);
  }

  function reset() { setWizStep(0); setResults(null); setAnimTotal(0); setExpanded(null); }

  const progress = wizStep < 5 ? Math.round((wizStep / 4) * 100) : 100;
  const canNext  = () => wizStep === 0 ? parseFloat(form.land) > 0 : true;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:'1.5rem' }}>
        <h2 className="stitle" style={{ margin:0 }}>📋 {TE ? 'ప్రభుత్వ పథకాల అన్వేషకుడు' : 'Govt Schemes Finder'}</h2>
        <div style={{ fontSize:12, color:'var(--green-d)', background:'var(--green-l)', borderRadius:'var(--rs)', padding:'4px 12px', fontWeight:600 }}>
          {TE ? '10 AP + కేంద్ర పథకాలు' : '10 AP + Central schemes'}
        </div>
      </div>

      {/* Wizard progress indicator */}
      {wizStep < 5 && (
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:10 }}>
            {WIZARD_STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{
                    width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:600, transition:'all .3s',
                    background: wizStep > i ? 'var(--green)' : wizStep === i ? 'var(--green-l)' : 'var(--bg)',
                    border: `2px solid ${wizStep >= i ? 'var(--green)' : 'var(--border)'}`,
                    color:   wizStep > i ? '#fff' : wizStep === i ? 'var(--green-d)' : 'var(--muted)',
                  }}>
                    {wizStep > i ? '✓' : s.icon}
                  </div>
                  <span style={{ fontSize:10, color: wizStep === i ? 'var(--green-d)' : 'var(--muted)', fontWeight: wizStep === i ? 600 : 400, whiteSpace:'nowrap' }}>
                    {TE ? s.label_te : s.label_en}
                  </span>
                </div>
                {i < 4 && <div style={{ flex:1, height:2, background: wizStep > i ? 'var(--green)' : 'var(--border)', transition:'background .4s', margin:'0 4px', marginBottom:18 }}/>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ height:5, background:'var(--bg)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, background:'var(--green)', width:`${progress}%`, transition:'width .4s ease' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--muted)', marginTop:4 }}>
            <span>{TE ? `ప్రశ్న ${wizStep+1}/5` : `Question ${wizStep+1} of 5`}</span>
            <span>{progress}% {TE ? 'పూర్తయింది' : 'complete'}</span>
          </div>
        </div>
      )}

      {/* ── Step 0: Land size ── */}
      {wizStep === 0 && (
        <div className="card">
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>📐 {TE ? 'మీ భూమి పరిమాణం ఎంత?' : 'How much land do you farm?'}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.25rem' }}>{TE ? 'మీకు ఉన్న మొత్తం వ్యవసాయ భూమి ఎకరాలలో' : 'Total agricultural land you own, in acres'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8, marginBottom:'1.25rem' }}>
            {[{l:'Below 1 acre',te:'1 ఎకరా కంటే తక్కువ',v:'0.5'},{l:'1–2 acres',te:'1–2 ఎకరాలు',v:'1.5'},{l:'2–5 acres',te:'2–5 ఎకరాలు',v:'3.5'},{l:'5–10 acres',te:'5–10 ఎకరాలు',v:'7'},{l:'Above 10 acres',te:'10 ఎకరాలు పైన',v:'12'}].map(opt => (
              <button key={opt.v} className={`btn ${form.land === opt.v ? 'btn-p' : 'btn-o'}`} style={{ justifyContent:'center', padding:'10px' }} onClick={() => set('land', opt.v)}>
                {TE ? opt.te : opt.l}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--muted)' }}>
            <span>{TE ? 'లేదా సరిగ్గా నమోదు చేయండి:' : 'Or enter exact:'}</span>
            <input type="number" min="0.1" max="999" step="0.5" value={form.land} onChange={e => set('land', e.target.value)}
              style={{ width:80, padding:'6px 10px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:13, background:'var(--bg)', color:'var(--text)' }}/>
            <span>{TE ? 'ఎకరాలు' : 'acres'}</span>
          </div>
        </div>
      )}

      {/* ── Step 1: Crop ── */}
      {wizStep === 1 && (
        <div className="card">
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>🌾 {TE ? 'మీ ప్రధాన పంట ఏది?' : 'What is your main crop?'}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.25rem' }}>{TE ? 'ఈ సీజన్‌లో మీరు ప్రధానంగా పండించే పంట' : 'The crop you grow most this season'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
            {CROPS_LIST.map(c => (
              <button key={c} className={`btn ${form.crop === c ? 'btn-p' : 'btn-o'}`} style={{ justifyContent:'center', padding:'10px', gap:6 }} onClick={() => set('crop', c)}>
                <span>{CROP_DB[c]?.emoji || '🌿'}</span> {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Income ── */}
      {wizStep === 2 && (
        <div className="card">
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>💰 {TE ? 'మీ వార్షిక ఆదాయం ఎంత?' : 'What is your annual income?'}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.25rem' }}>{TE ? 'వ్యవసాయం మరియు ఇతర మూలాల నుండి మొత్తం' : 'Total from farming and all other sources combined'}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {INCOME_RANGES.map(opt => (
              <button key={opt.value} className={`btn ${form.income === opt.value ? 'btn-p' : 'btn-o'}`}
                style={{ justifyContent:'flex-start', padding:'12px 16px', fontSize:14 }} onClick={() => set('income', opt.value)}>
                {TE ? opt.label_te : opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: District ── */}
      {wizStep === 3 && (
        <div className="card">
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>📍 {TE ? 'మీరు ఏ జిల్లాలో ఉన్నారు?' : 'Which district are you in?'}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.25rem' }}>{TE ? 'మీ వ్యవసాయ భూమి ఉన్న జిల్లా' : 'The district where your farm is located'}</div>
          <select value={form.district} onChange={e => set('district', e.target.value)}
            style={{ width:'100%', padding:'10px 14px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:14, background:'var(--bg)', color:'var(--text)' }}>
            <optgroup label="── Andhra Pradesh (26 districts) ──">
              {DIST_AP.map(d => <option key={d} value={d}>{TE ? (DIST_TE[d] || d) : d}</option>)}
            </optgroup>
            <optgroup label="── Telangana (33 districts) ──">
              {DIST_TS.map(d => <option key={d} value={d}>{TE ? (DIST_TE[d] || d) : d}</option>)}
            </optgroup>
          </select>
          <div style={{ marginTop:10, fontSize:12, color:'var(--muted)', background:'var(--bg)', borderRadius:'var(--rs)', padding:'8px 12px' }}>
            📍 {TE ? 'ఎంచుకున్నది:' : 'Selected:'} <strong>{TE ? (DIST_TE[form.district] || form.district) : form.district}</strong>
            {DIST_AP.includes(form.district) ? ` — ${TE ? 'ఆంధ్రప్రదేశ్' : 'Andhra Pradesh'}` : ` — ${TE ? 'తెలంగాణ' : 'Telangana'}`}
          </div>
        </div>
      )}

      {/* ── Step 4: Category ── */}
      {wizStep === 4 && (
        <div className="card">
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>👤 {TE ? 'మీ వర్గం ఏది?' : 'What is your category?'}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.25rem' }}>{TE ? 'ఇది కొన్ని ప్రత్యేక పథకాలను అన్‌లాక్ చేస్తుంది' : 'This unlocks certain special schemes'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {[
              { v:'General', l:'General / Forward',      te:'జనరల్ / ఫార్వర్డ్',         d:'No reservation certificate needed',          dte:'రిజర్వేషన్ ధృవపత్రం అవసరం లేదు' },
              { v:'OBC',     l:'OBC',                    te:'OBC',                         d:'Other Backward Class certificate',            dte:'ఇతర వెనుకబడిన వర్గ ధృవపత్రం' },
              { v:'SC',      l:'SC',                     te:'SC',                          d:'Scheduled Caste certificate',                 dte:'షెడ్యూల్డ్ కులం ధృవపత్రం' },
              { v:'ST',      l:'ST',                     te:'ST',                          d:'Scheduled Tribe certificate',                 dte:'షెడ్యూల్డ్ తెగ ధృవపత్రం' },
            ].map(opt => (
              <button key={opt.v} className={`btn ${form.category === opt.v ? 'btn-p' : 'btn-o'}`}
                style={{ flexDirection:'column', alignItems:'flex-start', padding:'12px 14px', height:'auto' }}
                onClick={() => set('category', opt.v)}>
                <span style={{ fontSize:14, fontWeight:600 }}>{TE ? opt.te : opt.l}</span>
                <span style={{ fontSize:11, opacity:.7, marginTop:2 }}>{TE ? opt.dte : opt.d}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wizard nav */}
      {wizStep < 5 && (
        <div style={{ display:'flex', gap:8, justifyContent:'space-between', marginTop:'1rem' }}>
          <button className="btn btn-o" onClick={back} style={{ visibility: wizStep > 0 ? 'visible' : 'hidden' }}>
            ← {TE ? 'వెనుక' : 'Back'}
          </button>
          <button className="btn btn-p" onClick={next} disabled={!canNext()} style={{ padding:'10px 28px', fontSize:14, fontWeight:600 }}>
            {wizStep < 4 ? (TE ? 'తదుపరి →' : 'Next →') : (TE ? 'పథకాలు కనుగొనండి 🔍' : 'Find Schemes 🔍')}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {wizStep === 5 && results && (
        <div>
          {/* Total benefit hero */}
          <div style={{ background:'linear-gradient(135deg,var(--green-d),var(--green))', borderRadius:'var(--r)', padding:'2rem 1.5rem', textAlign:'center', marginBottom:'1.5rem', color:'#fff' }}>
            <div style={{ fontSize:13, fontWeight:600, opacity:.85, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:6 }}>
              {TE ? 'మీరు అర్హులైన మొత్తం ప్రయోజనాలు' : 'Total benefits you qualify for'}
            </div>
            <div style={{ fontSize:'clamp(36px,8vw,52px)', fontWeight:700, letterSpacing:'-1px', marginBottom:4 }}>
              ₹{animTotal.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize:14, opacity:.85 }}>
              {results.length} {TE ? 'పథకాలు మీకు సరిపోతాయి' : 'schemes matched your profile'}
            </div>
            <div style={{ marginTop:'1rem', display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn" style={{ background:'rgba(255,255,255,.2)', color:'#fff', border:'1.5px solid rgba(255,255,255,.4)', fontSize:12 }} onClick={reset}>
                🔄 {TE ? 'మళ్ళీ ప్రయత్నించండి' : 'Try Again'}
              </button>
              <button className="btn" style={{ background:'#fff', color:'var(--green-d)', fontSize:12, fontWeight:600 }}
                onClick={() => showToast(TE ? `మీకు ${results.length} పథకాలలో ₹${results.reduce((s,r)=>s+r.benefit,0).toLocaleString('en-IN')} అర్హత ఉంది!` : `You qualify for ₹${results.reduce((s,r)=>s+r.benefit,0).toLocaleString('en-IN')} in ${results.length} schemes!`)}>
                📤 {TE ? 'షేర్ చేయండి' : 'Share Result'}
              </button>
            </div>
          </div>

          {/* Profile summary pills */}
          <div style={{ background:'var(--bg)', borderRadius:'var(--rs)', padding:'10px 14px', marginBottom:'1.25rem', display:'flex', flexWrap:'wrap', gap:8 }}>
            {[{l:TE?'భూమి':'Land',v:`${form.land} ${TE?'ఎకరాలు':'acres'}`},{l:TE?'పంట':'Crop',v:form.crop},{l:TE?'జిల్లా':'District',v:form.district},{l:TE?'వర్గం':'Category',v:form.category}].map(r => (
              <div key={r.l} style={{ background:'var(--surface)', borderRadius:'var(--rs)', padding:'5px 12px', fontSize:12, border:'1px solid var(--border)' }}>
                <span style={{ color:'var(--muted)' }}>{r.l}: </span>
                <span style={{ fontWeight:600 }}>{r.v}</span>
              </div>
            ))}
          </div>

          {/* Scheme cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {results.map((s, idx) => {
              const tc     = typeColor(s.type);
              const isOpen = expanded === s.id;
              return (
                <div key={s.id} style={{ background:'var(--surface)', border: idx===0 ? '2px solid var(--green)' : '1px solid var(--border)', borderRadius:'var(--r)', overflow:'hidden' }}>
                  {idx === 0 && <div style={{ background:'var(--green)', color:'#fff', fontSize:11, fontWeight:700, textAlign:'center', padding:'3px', letterSpacing:'.04em' }}>⭐ {TE ? 'అత్యధిక ప్రయోజనం' : 'Highest Benefit'}</div>}
                  <div style={{ padding:'1rem 1.25rem', cursor:'pointer' }} onClick={() => setExpanded(isOpen ? null : s.id)}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                          <span style={{ fontSize:15, fontWeight:600 }}>{TE ? s.name_te : s.name}</span>
                          <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:99, background:tc.bg, color:tc.col }}>{TE ? s.type_te : s.type}</span>
                        </div>
                        <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.5 }}>{TE ? s.desc_te : s.desc_en}</div>
                      </div>
                      <div style={{ textAlign:'right', minWidth:100 }}>
                        <div style={{ fontSize:10, color:'var(--muted)', marginBottom:2 }}>{TE ? 'ప్రయోజనం' : 'Benefit'}</div>
                        <div style={{ fontSize:16, fontWeight:700, color:'var(--green)' }}>{TE ? s.benefit_label_te : s.benefit_label}</div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{isOpen ? '▲ collapse' : '▼ details'}</div>
                      </div>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop:'1px solid var(--border)', padding:'1rem 1.25rem', background:'var(--bg)' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:4 }}>📄 {TE ? 'అవసరమైన పత్రాలు' : 'Required Documents'}</div>
                          <div style={{ fontSize:12, color:'var(--text)', lineHeight:1.6, fontFamily: TE?'Tiro Devanagari Telugu,serif':'inherit' }}>{TE ? s.docs_te : s.docs_en}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:4 }}>📅 {TE ? 'దరఖాస్తు గడువు' : 'Application Deadline'}</div>
                          <div style={{ fontSize:12, color:'var(--text)' }}>{s.deadline}</div>
                          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:4, marginTop:10 }}>🌐 {TE ? 'దరఖాస్తు చేయండి' : 'Apply at'}</div>
                          <div style={{ fontSize:12, color:'var(--blue)', fontWeight:500 }}>{s.apply}</div>
                        </div>
                      </div>
                      <button className="btn btn-p" style={{ width:'100%', justifyContent:'center', fontSize:13 }}
                        onClick={() => showToast(TE ? `${s.name_te} కోసం ${s.apply}కు వెళ్ళండి` : `Visit ${s.apply} to apply for ${s.name}`)}>
                        🚀 {TE ? 'ఇప్పుడు దరఖాస్తు చేయండి' : 'How to Apply'} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {results.length === 0 && (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--muted)' }}>
              <div style={{ fontSize:44, marginBottom:'.75rem' }}>🔍</div>
              <div style={{ fontWeight:600, marginBottom:6 }}>{TE ? 'సరిపోలే పథకాలు కేవలం కొన్ని' : 'No exact matches found'}</div>
              <div style={{ fontSize:13 }}>{TE ? 'మీ ఆదాయం లేదా భూమి పరిమాణం తగ్గించి మళ్ళీ ప్రయత్నించండి' : 'Try adjusting your income or land size'}</div>
              <button className="btn btn-p" style={{ marginTop:'1rem' }} onClick={reset}>🔄 {TE ? 'మళ్ళీ ప్రయత్నించండి' : 'Try Again'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
