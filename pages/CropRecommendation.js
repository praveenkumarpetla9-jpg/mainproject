// ══════════════════════════════════════════
// pages/CropRecommendation.js
// ML-powered crop advisor — 2 features:
//
// Feature 1 — 5-field input form
//   District, soil type, season, land size,
//   irrigation → recommendCrops() engine
//   (from cropData.js) → top 3 crop cards
//   with ML score badge and profit estimate.
//
// Feature 2 — Profit comparison bar chart
//   Horizontal Chart.js bar chart shows
//   estimated profit per acre for each
//   recommended crop. Best crop = dark green.
//
// Props:
//   lang      — 'EN' | 'TE'
//   showToast — (msg: string) => void
// ══════════════════════════════════════════

function CropRecommendation({ lang, showToast }) {
  const TE = lang === 'TE';

  const [form,    setForm]    = useState({ district:'Guntur', soil:'Loamy', season:'Kharif', land:'2', irrigation:'Medium' });
  const [results, setResults] = useState(null);
  const [step,    setStep]    = useState(0); // 0=form 1=loading 2=results
  const chartRef  = useRef();
  const chartInst = useRef();

  const SOILS      = ['Loamy', 'Clay', 'Sandy', 'Red', 'Black'];
  const SEASONS    = ['Kharif', 'Rabi', 'Zaid'];
  const IRRIGATION = ['Low', 'Medium', 'High'];

  // ── Feature 2: Build profit comparison chart after results load ──
  useEffect(() => {
    if (!results || step !== 2) return;
    if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null; }
    if (!chartRef.current)  return;
    const land    = parseFloat(form.land) || 1;
    const profits = results.map(r => calcProfit(r.crop, land));
    const maxP    = Math.max(...profits);

    setTimeout(() => {
      chartInst.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: results.map(r => `${r.emoji} ${r.crop}`),
          datasets: [{
            label: 'Est. profit per acre (₹)',
            data:  profits,
            backgroundColor: profits.map(p => p === maxP ? '#1D9E75' : 'rgba(29,158,117,0.25)'),
            borderColor:     profits.map(p => p === maxP ? '#085041' : '#1D9E75'),
            borderWidth: 2, borderRadius: 8,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, indexAxis: 'y',
          plugins: { legend:{ display:false }, tooltip:{ callbacks:{ label: ctx => `₹${ctx.raw.toLocaleString('en-IN')} for ${form.land} acre(s)` } } },
          scales: {
            x: { ticks: { callback: v => `₹${(v/1000).toFixed(0)}k`, font:{ size:10 } }, grid:{ color:'rgba(0,0,0,.04)' } },
            y: { ticks: { font:{ size:12 } }, grid:{ display:false } },
          },
          animation: { duration:800, easing:'easeOutQuart' },
        }
      });
    }, 100);
  }, [results, step]);

  function handleChange(k, v) { setForm(f => ({ ...f, [k]: v })); }

  // ── Feature 1: Run recommendation engine ──
  async function recommend() {
    setStep(1);
    await new Promise(r => setTimeout(r, 1200)); // Simulate ML delay
    const recs = recommendCrops(form.district, form.soil, form.season, parseFloat(form.land) || 1, form.irrigation);
    setResults(recs);
    setStep(2);
  }

  function reset() { setStep(0); setResults(null); }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:'1.5rem' }}>
        <h2 className="stitle" style={{ margin:0 }}>🌱 {TE ? 'పంట సిఫార్సు' : 'Crop Recommendation'}</h2>
        <div style={{ fontSize:12, color:'var(--muted)', background:'var(--purple-l)', borderRadius:'var(--rs)', padding:'4px 12px' }}>
          {TE ? 'Random Forest ML మోడల్ శక్తితో' : 'Powered by Random Forest ML'}
        </div>
      </div>

      {/* Step indicator */}
      <div className="steps">
        {(TE ? ['ఇన్‌పుట్ నమోదు', 'AI విశ్లేషణ', 'ఫలితాలు'] : ['Enter Details', 'AI Analysis', 'Results']).map((s, i) => (
          <React.Fragment key={s}>
            <div className="sdot" style={{ background: step >= i ? 'var(--purple)' : 'var(--bg)', color: step >= i ? '#fff' : 'var(--muted)', border:`1.5px solid ${step >= i ? 'var(--purple)' : 'var(--border)'}` }}>
              {i + 1}
            </div>
            <span style={{ fontSize:12, color: step === i ? 'var(--purple-d)' : 'var(--muted)', fontWeight: step === i ? 600 : 400 }}>{s}</span>
            {i < 2 && <div className="sline" style={{ background: step > i ? 'var(--purple)' : 'var(--border)' }}/>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 0: Input form ── */}
      {step === 0 && (
        <div className="two">
          <div>
            <div className="card">
              <div className="card-title">🌍 {TE ? 'మీ వ్యవసాయ వివరాలు నమోదు చేయండి' : 'Enter your farm details'}</div>

              {/* District */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>📍 {TE ? 'జిల్లా' : 'District'}</div>
                <select value={form.district} onChange={e => handleChange('district', e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:14, background:'var(--bg)', color:'var(--text)' }}>
                  <optgroup label="── Andhra Pradesh ──">
                    {DIST_AP.map(d => <option key={d} value={d}>{TE ? (DIST_TE[d] || d) : d}</option>)}
                  </optgroup>
                  <optgroup label="── Telangana ──">
                    {DIST_TS.map(d => <option key={d} value={d}>{TE ? (DIST_TE[d] || d) : d}</option>)}
                  </optgroup>
                </select>
              </div>

              {/* Soil type */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>🪨 {TE ? 'నేల రకం' : 'Soil Type'}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {SOILS.map(s => (
                    <button key={s} className={`btn ${form.soil === s ? 'btn-p' : 'btn-o'}`} style={{ fontSize:12, padding:'5px 12px' }} onClick={() => handleChange('soil', s)}>
                      {TE ? SOIL_TE[s] : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>🌤 {TE ? 'సీజన్' : 'Season'}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {SEASONS.map(s => (
                    <button key={s} className={`btn ${form.season === s ? 'btn-p' : 'btn-o'}`} style={{ fontSize:12, padding:'5px 12px' }} onClick={() => handleChange('season', s)}>
                      {TE ? SEASON_TE[s] : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Land size + Irrigation */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>📐 {TE ? 'భూమి (ఎకరాలు)' : 'Land Size (acres)'}</div>
                  <input type="number" min="0.5" max="100" step="0.5" value={form.land}
                    onChange={e => handleChange('land', e.target.value)}
                    style={{ width:'100%', padding:'8px 12px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:14, background:'var(--bg)', color:'var(--text)' }}/>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.05em' }}>💧 {TE ? 'నీటిపారుదల' : 'Irrigation'}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {IRRIGATION.map(ir => (
                      <button key={ir} className={`btn ${form.irrigation === ir ? 'btn-p' : 'btn-o'}`} style={{ fontSize:12, padding:'4px 12px', justifyContent:'flex-start' }} onClick={() => handleChange('irrigation', ir)}>
                        {ir === 'Low' ? '💧' : ir === 'Medium' ? '💧💧' : '💧💧💧'} {TE ? IRR_TE[ir] : ir}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn btn-p" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:15, fontWeight:600 }} onClick={recommend}>
                🔍 {TE ? 'పంటలను సిఫార్సు చేయండి' : 'Get Crop Recommendations'}
              </button>
            </div>
          </div>

          {/* Right info panel */}
          <div>
            <div className="card" style={{ background:'var(--purple-l)', border:'1px solid rgba(127,119,221,.2)' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--purple-d)', marginBottom:10 }}>📊 {TE ? 'ఇది ఎలా పని చేస్తుంది' : 'How this works'}</div>
              {[
                { i:'1', t: TE?'మీ వివరాలు నమోదు చేయండి':'Enter your farm details', d: TE?'జిల్లా, నేల రకం, సీజన్, భూమి పరిమాణం':'District, soil type, season, land size' },
                { i:'2', t: TE?'AI మోడల్ విశ్లేషిస్తుంది':'AI model analyses', d: TE?'Random Forest ML కాగల్ డేటాసెట్‌పై శిక్షణ పొందింది':'Random Forest trained on Kaggle Crop dataset' },
                { i:'3', t: TE?'అగ్ర 3 పంటలు':'Top 3 crops shown', d: TE?'అంచనా దిగుబడి మరియు లాభంతో':'With expected yield and profit estimate' },
              ].map(s => (
                <div key={s.i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                  <div style={{ width:24, height:24, minWidth:24, borderRadius:'50%', background:'var(--purple)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>{s.i}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--purple-d)' }}>{s.t}</div>
                    <div style={{ fontSize:12, color:'var(--purple-d)', opacity:.8, marginTop:2 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>{TE ? 'మీ ఎంపికలు:' : 'Your selections:'}</div>
              {[
                { l: TE?'జిల్లా':'District',   v: TE?(DIST_TE[form.district]||form.district):form.district },
                { l: TE?'నేల':'Soil',           v: TE?SOIL_TE[form.soil]:form.soil },
                { l: TE?'సీజన్':'Season',        v: TE?SEASON_TE[form.season]:form.season },
                { l: TE?'భూమి':'Land',           v: `${form.land} ${TE?'ఎకరాలు':'acres'}` },
                { l: TE?'నీటిపారుదల':'Irrigation', v: TE?IRR_TE[form.irrigation]:form.irrigation },
              ].map(r => (
                <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{r.l}</span>
                  <span style={{ fontWeight:500 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Loading ── */}
      {step === 1 && (
        <div className="analyzing" style={{ padding:'4rem 1rem' }}>
          <div className="aring" style={{ borderTopColor:'var(--purple)', borderColor:'var(--purple-l)' }}/>
          <div style={{ fontSize:14, fontWeight:500, color:'var(--purple-d)', marginBottom:6 }}>{TE ? 'Random Forest మోడల్ అమలు అవుతున్నది...' : 'Running Random Forest model...'}</div>
          <div className="adots"><span style={{ background:'var(--purple)' }}/><span style={{ background:'var(--purple)' }}/><span style={{ background:'var(--purple)' }}/></div>
          <div style={{ marginTop:'1.25rem', fontSize:12, color:'var(--muted)' }}>
            {['Analysing soil composition', 'Checking seasonal suitability', 'Calculating yield potential', 'Estimating profit margins'].map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 0', opacity: i === 0 ? 1 : 0.35 }}>
                <span style={{ color:'var(--purple)' }}>✓</span>{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Results ── */}
      {step === 2 && results && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600 }}>{TE ? 'మీకు సిఫార్సు చేయబడిన అగ్ర 3 పంటలు' : 'Top 3 recommended crops for you'}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>
                {TE ? (DIST_TE[form.district] || form.district) : form.district} · {TE ? SOIL_TE[form.soil] : form.soil} {TE ? 'నేల' : 'soil'} · {TE ? SEASON_TE[form.season] : form.season} · {form.land} {TE ? 'ఎకరాలు' : 'acres'}
              </div>
            </div>
            <button className="btn btn-o" onClick={reset}>🔄 {TE ? 'మళ్ళీ ప్రయత్నించండి' : 'Try Again'}</button>
          </div>

          {/* Top 3 crop cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12, marginBottom:'1.5rem' }}>
            {results.map((r, idx) => {
              const profit = calcProfit(r.crop, parseFloat(form.land) || 1);
              const isTop  = idx === 0;
              return (
                <div key={r.crop} style={{ background:'var(--surface)', border: isTop ? '2px solid var(--green)' : '1px solid var(--border)', borderRadius:'var(--r)', overflow:'hidden' }}>
                  {isTop && <div style={{ background:'var(--green)', color:'#fff', fontSize:11, fontWeight:700, textAlign:'center', padding:'4px', letterSpacing:'.05em' }}>{TE ? '⭐ ఉత్తమ సిఫార్సు' : '⭐ BEST RECOMMENDATION'}</div>}
                  <div style={{ padding:'1rem 1.25rem' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:28 }}>{r.emoji}</span>
                        <div>
                          <div style={{ fontSize:16, fontWeight:600 }}>{r.crop}</div>
                          <div style={{ fontSize:11, color:'var(--muted)' }}>{TE ? IRR_TE[r.irrigation] : r.irrigation} {TE ? 'నీటిపారుదల' : 'irrigation'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:2 }}>{TE ? 'ML స్కోర్' : 'ML Score'}</div>
                        <div style={{ fontSize:18, fontWeight:700, color:scoreColor(r.score) }}>{r.score}%</div>
                        <div style={{ fontSize:10, color:scoreColor(r.score), fontWeight:600 }}>{scoreLabel(r.score)}</div>
                      </div>
                    </div>
                    <div style={{ height:4, background:'var(--bg)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
                      <div style={{ height:'100%', borderRadius:99, background:scoreColor(r.score), width:`${r.score}%`, transition:'width 1s ease' }}/>
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.5, marginBottom:10 }}>{TE ? r.desc_te : r.desc_en}</div>
                    <div style={{ background: isTop ? 'var(--green-l)' : 'var(--bg)', borderRadius:'var(--rs)', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color: isTop?'var(--green-d)':'var(--muted)', textTransform:'uppercase', letterSpacing:'.05em' }}>{TE ? 'అంచనా లాభం' : 'Est. Profit'} · {form.land} {TE ? 'ఎకరా' : 'acre(s)'}</div>
                        <div style={{ fontSize:18, fontWeight:700, color: isTop?'var(--green)':'var(--text)' }}>₹{profit.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:10, color:'var(--muted)' }}>{TE ? 'సగటు దిగుబడి' : 'Avg yield'}</div>
                        <div style={{ fontSize:13, fontWeight:500 }}>{r.avgYield} {TE ? 'క్విం/ఎకరా' : 'qtl/acre'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profit comparison chart */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
              <div>
                <div className="card-title" style={{ margin:0 }}>📊 {TE ? 'లాభం పోలిక' : 'Profit Comparison'}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{TE ? `${form.land} ఎకరాలకు అంచనా లాభం (₹)` : `Estimated profit for ${form.land} acre(s) in ₹`}</div>
              </div>
              <div style={{ fontSize:11, background:'var(--green-l)', color:'var(--green-d)', padding:'4px 10px', borderRadius:99, fontWeight:600 }}>
                {TE ? 'ఆకుపచ్చ బార్ = ఉత్తమ ఎంపిక' : 'Green bar = best pick'}
              </div>
            </div>
            <div style={{ position:'relative', width:'100%', height:160 }}>
              <canvas ref={chartRef}/>
            </div>
            <div style={{ marginTop:'1rem', background:'var(--bg)', borderRadius:'var(--rs)', padding:'10px 14px', fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>
              💡 <strong>{TE ? 'గమనిక:' : 'Note:'}</strong> {TE ? `లాభం = సగటు దిగుబడి × ప్రస్తుత మండీ ధర × ${form.land} ఎకరాలు. ఇవి అంచనాలు మాత్రమే.` : `Profit = avg yield per acre × current mandi price × ${form.land} acres. These are estimates based on current market data.`}
            </div>
          </div>

          {/* Soil + season tips */}
          <div className="card">
            <div className="card-title">{TE ? 'మీ సిఫార్సుల కోసం వ్యవసాయ చిట్కాలు' : 'Farming tips for your recommendations'}</div>
            {results.map(r => (
              <div key={r.crop} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:20 }}>{r.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{r.crop}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                    {TE ? 'మంచి నేలలు:' : 'Best soils:'} {r.soil.join(', ')} · {TE ? 'సీజన్లు:' : 'Seasons:'} {r.seasons.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
