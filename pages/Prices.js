// ══════════════════════════════════════════
// pages/Prices.js
// Mandi Price Intelligence — 4 features:
//
// Feature 1 — Live price cards + district filter
//   Per-district price adjustment via DISTRICT_OFFSET.
//   Cards with trend arrow and % change.
//
// Feature 2 — 7-day trend chart (Chart.js)
//   Best sell day highlighted with green dot.
//   Week high / low / today stat row.
//
// Feature 3 — 45-day forecast chart
//   Historical (blue) + forecast (amber dashed).
//   Best sell window banner.
//
// Feature 4 — Price alert
//   Set a target price; toast fires when hit.
//
// Also includes MandiMap sub-component
// (Leaflet map with price labels per mandi).
//
// Props:
//   lang      — 'EN' | 'TE'
//   showToast — (msg: string) => void
// ══════════════════════════════════════════

// ── MandiMap — Leaflet map of AP+TS mandis ──
function MandiMap({ lang, selectedCrop }) {
  const TE = lang === 'TE';
  const mapRef   = useRef(null);
  const mapInst  = useRef(null);
  const [filterCrop, setFilterCrop] = useState(selectedCrop || 'Chilli');

  // Load Leaflet (CDN) and initialise map
  useEffect(() => {
    if (!mapRef.current) return;
    function init() {
      if (mapInst.current) return;
      const L   = window.L;
      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([16.5, 79.5], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap', maxZoom:18 }).addTo(map);
      mapInst.current = map;
      addMarkers(map);
    }
    if (window.L) { init(); }
    else {
      const css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = () => init();
      document.head.appendChild(s);
    }
  }, []);

  // Redraw markers when crop changes
  useEffect(() => {
    if (!mapInst.current) return;
    mapInst.current.eachLayer(l => { if (l._icon || l._popup) mapInst.current.removeLayer(l); });
    addMarkers(mapInst.current);
  }, [filterCrop]);

  function addMarkers(map) {
    const L = window.L;
    if (!L) return;
    const maxPrice = Math.max(...MANDI_LOCATIONS.map(x => x.prices[filterCrop] || 0));
    MANDI_LOCATIONS.forEach(m => {
      const price  = m.prices[filterCrop] || 0;
      const isBest = price === maxPrice;
      const color  = isBest ? '#1D9E75' : '#378ADD';
      const icon   = L.divIcon({
        className: '',
        html: `<div style="background:${color};color:#fff;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;white-space:nowrap;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)">
          ${isBest ? '⭐ ' : ''}₹${price.toLocaleString('en-IN')}
        </div>`,
        iconSize:[80,28], iconAnchor:[40,28],
      });
      const priceRows = Object.entries(m.prices).map(([c, p]) =>
        `<tr><td class="crop">${c}</td><td class="price">₹${p.toLocaleString('en-IN')}</td></tr>`
      ).join('');
      const popup = `
        <div style="font-family:DM Sans,sans-serif;min-width:180px">
          <div style="font-size:13px;font-weight:700;color:#085041;margin-bottom:6px">${m.name}</div>
          <div style="font-size:11px;color:#6B6B6B;margin-bottom:8px">📍 ${m.district} · Speciality: ${m.speciality}</div>
          <table class="mandi-popup-table">${priceRows}</table>
          <div style="font-size:10px;color:#6B6B6B;margin-top:6px">₹ per quintal · Updated today</div>
        </div>`;
      L.marker([m.lat, m.lng], { icon }).bindPopup(popup).addTo(map);
    });
  }

  const bestMandi = MANDI_LOCATIONS.reduce((best, m) =>
    (m.prices[filterCrop] || 0) > (best.prices[filterCrop] || 0) ? m : best, MANDI_LOCATIONS[0]);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:600 }}>{TE ? 'సమీప మండీ మ్యాప్' : 'Nearest Mandi Finder'}</div>
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{TE ? 'పిన్ క్లిక్ చేసి ధరలు చూడండి' : "Click any pin to see today's prices"}</div>
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {CROPS.map(c => (
            <button key={c} className={`btn ${filterCrop === c ? 'btn-p' : 'btn-o'}`}
              style={{ fontSize:11, padding:'4px 10px' }} onClick={() => setFilterCrop(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Best price banner */}
      <div style={{ background:'var(--green-l)', border:'1px solid var(--green)', borderRadius:'var(--rs)', padding:'10px 14px', marginBottom:'1rem', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:20 }}>⭐</span>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:13, fontWeight:700, color:'var(--green-d)' }}>{TE ? 'ఈరోజు అత్యధిక ధర:' : 'Highest price today:'}</span>
          <span style={{ fontSize:13, fontWeight:700, color:'var(--green)', marginLeft:6 }}>{bestMandi.name}</span>
          <span style={{ fontSize:12, color:'var(--muted)', marginLeft:6 }}>₹{(bestMandi.prices[filterCrop] || 0).toLocaleString('en-IN')}/qtl</span>
        </div>
        <span style={{ fontSize:12, color:'var(--muted)' }}>📍 {bestMandi.district}</span>
      </div>

      {/* Leaflet map */}
      <div className="mandi-map-wrap" style={{ marginBottom:'1rem' }}>
        <div ref={mapRef} style={{ height:380, width:'100%', background:'#e8f4e8' }}/>
      </div>

      {/* Price comparison table */}
      <div className="card">
        <div className="card-title">{filterCrop} — {TE ? 'మండీల మధ్య ధర పోలిక' : 'Price Comparison Across Mandis'}</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'var(--bg)' }}>
                {[TE?'మండీ':'Mandi', TE?'జిల్లా':'District', TE?'ధర (₹/క్విం)':'Price (₹/qtl)', TE?'ప్రత్యేకత':'Speciality'].map(h => (
                  <th key={h} style={{ padding:'8px 10px', textAlign: h.includes('ధర') || h.includes('Price') ? 'right' : h.includes('ప్రత్యేకత') || h.includes('Spec') ? 'center' : 'left', fontWeight:600, color:'var(--muted)', fontSize:11, textTransform:'uppercase', letterSpacing:'.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...MANDI_LOCATIONS].sort((a, b) => (b.prices[filterCrop] || 0) - (a.prices[filterCrop] || 0)).map((m, i) => (
                <tr key={m.name} style={{ borderBottom:'1px solid var(--border)', background: i === 0 ? 'var(--green-l)' : 'transparent' }}>
                  <td style={{ padding:'9px 10px', fontWeight: i === 0 ? 700 : 400 }}>{i === 0 && <span style={{ marginRight:5 }}>⭐</span>}{m.name}</td>
                  <td style={{ padding:'9px 10px', color:'var(--muted)', fontSize:12 }}>{m.district}</td>
                  <td style={{ padding:'9px 10px', textAlign:'right', fontWeight:700, color: i === 0 ? 'var(--green)' : 'var(--text)', fontSize:14 }}>₹{(m.prices[filterCrop] || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding:'9px 10px', textAlign:'center' }}>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:99, background: m.speciality === filterCrop ? 'var(--green-l)' : 'var(--bg)', color: m.speciality === filterCrop ? 'var(--green-d)' : 'var(--muted)', fontWeight:500 }}>{m.speciality}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Prices component ──
function Prices({ lang, showToast }) {
  const TE = lang === 'TE';

  const [crop,     setCrop]     = useState('Chilli');
  const [district, setDistrict] = useState('Guntur');
  const [ptab,     setPtab]     = useState('dashboard'); // 'dashboard' | 'forecast' | 'mandimap'
  const [av,       setAv]       = useState('');
  const [alert,    setAlert]    = useState(null);
  const [showTrend,setShowTrend]= useState(true);

  const cref = useRef(); const cinst = useRef();
  const tref = useRef(); const tinst = useRef();

  // ── 7-day trend chart (dashboard tab) ──
  useEffect(() => {
    if (!showTrend || ptab !== 'dashboard') return;
    if (tinst.current) { tinst.current.destroy(); tinst.current = null; }
    if (!tref.current) return;

    const raw   = distPrice(PX[crop], district);
    const week  = raw.slice(-7);
    const today = new Date();
    const labels = Array.from({ length:7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - 6 + i);
      return d.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit' });
    });
    const maxIdx       = week.indexOf(Math.max(...week));
    const pointColors  = week.map((_, i) => i === maxIdx ? '#1D9E75' : 'rgba(55,138,221,0.3)');
    const pointRadius  = week.map((_, i) => i === maxIdx ? 7 : 3);
    const pointBorder  = week.map((_, i) => i === maxIdx ? '#085041' : '#378ADD');

    tinst.current = new Chart(tref.current, {
      type:'line',
      data:{ labels, datasets:[{ label:crop, data:week, borderColor:'#378ADD', borderWidth:2.5, backgroundColor:'rgba(55,138,221,0.06)', fill:true, tension:0.35, pointBackgroundColor:pointColors, pointBorderColor:pointBorder, pointBorderWidth:2, pointRadius, pointHoverRadius:8 }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:ctx=>`₹${ctx.raw.toLocaleString('en-IN')} per quintal`, afterLabel:ctx=>ctx.dataIndex===maxIdx?'⭐ Best sell day this week':'' } } },
        scales:{ x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } }, y:{ ticks:{ callback:v=>`₹${v.toLocaleString('en-IN')}`, font:{ size:10 } }, grid:{ color:'rgba(0,0,0,.04)' } } },
        animation:{ duration:600 },
      }
    });
  }, [crop, district, showTrend, ptab]);

  // ── 45-day forecast chart (forecast tab) ──
  useEffect(() => {
    if (ptab !== 'forecast') return;
    if (cinst.current) { cinst.current.destroy(); cinst.current = null; }
    if (!cref.current) return;

    const raw = distPrice(PX[crop], district);
    const f   = FC[crop].map(p => p + (DISTRICT_OFFSET[district] || 0));
    const today = new Date();
    const hd  = Array.from({ length:30 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - 29 + i); return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }); });
    const fd2 = Array.from({ length:15 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }); });

    cinst.current = new Chart(cref.current, {
      type:'line',
      data:{ labels:[...hd,...fd2], datasets:[
        { label:'Historical', data:[...raw,...Array(15).fill(null)], borderColor:'#378ADD', borderWidth:2, pointRadius:0, tension:0.3, fill:false },
        { label:'Forecast',   data:[...Array(30).fill(null),...f],   borderColor:'#EF9F27', borderWidth:2, borderDash:[5,3], pointRadius:3, pointBackgroundColor:'#EF9F27', tension:0.3, fill:false },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:c=>`₹${c.raw?.toLocaleString('en-IN')||''}` } } }, scales:{ x:{ ticks:{ maxTicksLimit:10, maxRotation:30, font:{ size:10 } }, grid:{ display:false } }, y:{ ticks:{ callback:v=>`₹${v.toLocaleString('en-IN')}`, font:{ size:10 } }, grid:{ color:'rgba(0,0,0,.04)' } } } }
    });
  }, [crop, district, ptab]);

  // ── Price alert polling ──
  useEffect(() => {
    if (!alert) return;
    const iv = setInterval(() => {
      const c = distPrice(PX[alert.crop], district)[29];
      if (c >= alert.target) { showToast(`${alert.crop} hit ₹${c} in ${district}! Target: ₹${alert.target}`); setAlert(null); }
    }, 8000);
    return () => clearInterval(iv);
  }, [alert, district]);

  // ── Derived values ──
  const distPrices   = distPrice(PX[crop], district);
  const todayPrice   = distPrices[29];
  const w            = BW[crop];
  const peakForecast = w.p + (DISTRICT_OFFSET[district] || 0);
  const g            = peakForecast - todayPrice;
  const gp           = ((g / todayPrice) * 100).toFixed(1);
  const week7        = distPrices.slice(-7);
  const bestDayIdx   = week7.indexOf(Math.max(...week7));
  const today2       = new Date();
  const bestDayLabel = Array.from({ length:7 }, (_, i) => { const d = new Date(today2); d.setDate(d.getDate() - 6 + i); return d.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit' }); })[bestDayIdx];
  const fdLabels     = Array.from({ length:15 }, (_, i) => fd(i + 1));

  return (
    <div className="page">
      {/* Header with district filter */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:22, fontWeight:600 }}>📈 {TE ? 'మార్కెట్ ధర సమాచారం' : 'Mandi Price Intelligence'}</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ fontSize:12, color:'var(--muted)' }}>{TE ? 'జిల్లా:' : 'District:'}</span>
          <select className="sel-inp" value={district} onChange={e => { setDistrict(e.target.value); if (tinst.current) { tinst.current.destroy(); tinst.current = null; } }}>
            <optgroup label="Andhra Pradesh">{DIST_AP.map(d => <option key={d}>{d}</option>)}</optgroup>
            <optgroup label="Telangana">{DIST_TS.map(d => <option key={d}>{d}</option>)}</optgroup>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab${ptab === 'dashboard' ? ' active' : ''}`} onClick={() => setPtab('dashboard')}>{TE ? 'లైవ్ ధరలు' : 'Live Prices'}</div>
        <div className={`tab${ptab === 'forecast'  ? ' active' : ''}`} onClick={() => setPtab('forecast')}>{TE ? 'ధర అంచనా' : 'Price Forecast'}</div>
        <div className={`tab${ptab === 'mandimap'  ? ' active' : ''}`} onClick={() => setPtab('mandimap')}>🗺️ {TE ? 'మండీ మ్యాప్' : 'Mandi Map'}</div>
      </div>

      {/* ── Dashboard tab ── */}
      {ptab === 'dashboard' && (
        <>
          <div style={{ background:'var(--blue-l)', borderRadius:'var(--rs)', padding:'8px 14px', fontSize:12, color:'var(--blue-d)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
            📍 {TE ? `${district} జిల్లా మార్కెట్ ధరలు — నేడు అప్‌డేట్ చేయబడింది` : `${district} district mandi prices — updated today`}
          </div>

          {/* Crop price cards */}
          <div className="pgrid">
            {CROPS.map(c => {
              const p   = distPrice(PX[c], district);
              const t   = p[29]; const y = p[28]; const ch = t - y; const up = ch >= 0;
              const chPct = ((Math.abs(ch) / y) * 100).toFixed(1);
              return (
                <div key={c} className={`pcard${crop === c ? ' sel' : ''}`} onClick={() => { setCrop(c); setShowTrend(true); }}>
                  <div className="pcrop">{c}</div>
                  <div className="pprice">₹{t.toLocaleString('en-IN')}</div>
                  <div className="punit">{TE ? 'క్వింటాల్‌కు' : 'per quintal'}</div>
                  <div className={`pch ${up ? 'pup' : 'pdn'}`}>
                    <span style={{ fontSize:16 }}>{up ? '▲' : '▼'}</span>
                    ₹{Math.abs(ch).toLocaleString('en-IN')}
                    <span style={{ fontSize:10, opacity:.8 }}>({chPct}%)</span>
                  </div>
                  <Spark data={p.slice(-7)} color={up ? '#1D9E75' : '#E24B4A'}/>
                  {crop === c && <div style={{ fontSize:10, color:'var(--green-d)', marginTop:4, fontWeight:600 }}>{TE ? '↓ నిలువు చూపు' : '↓ view trend'}</div>}
                </div>
              );
            })}
          </div>

          {/* 7-day trend chart */}
          <div className="card" style={{ marginTop:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
              <div>
                <div className="card-title" style={{ margin:0 }}>{crop} — {TE ? '7 రోజుల ధర చరిత్ర' : '7-Day Price Trend'}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{district} · {TE ? 'గత 7 రోజులు' : 'Last 7 days'}</div>
              </div>
              <div style={{ background:'var(--green-l)', borderRadius:'var(--rs)', padding:'6px 12px', textAlign:'right' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--green-d)', letterSpacing:'.05em', textTransform:'uppercase' }}>{TE ? 'ఈ వారం ఉత్తమ దినం' : 'Best sell day this week'}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'var(--green)' }}>{bestDayLabel}</div>
                <div style={{ fontSize:11, color:'var(--green-d)' }}>₹{Math.max(...week7).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--muted)', marginBottom:8, flexWrap:'wrap' }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:'50%', background:'#1D9E75', display:'inline-block' }}/>{TE ? 'ఉత్తమ విక్రయ దినం' : 'Best sell day'}</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:'50%', background:'rgba(55,138,221,0.3)', display:'inline-block' }}/>{TE ? 'ఇతర రోజులు' : 'Other days'}</span>
            </div>
            <div style={{ position:'relative', width:'100%', height:220 }}><canvas ref={tref}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:'1rem' }}>
              {[{l:TE?'ఈ వారం అత్యధికం':'Week High',v:`₹${Math.max(...week7).toLocaleString('en-IN')}`,c:'var(--green)'},
                {l:TE?'ఈ వారం అత్యల్పం':'Week Low', v:`₹${Math.min(...week7).toLocaleString('en-IN')}`,c:'var(--red)'},
                {l:TE?'నేటి ధర':'Today',             v:`₹${week7[6].toLocaleString('en-IN')}`,c:'var(--blue)'}
              ].map(s => (
                <div key={s.l} style={{ background:'var(--bg)', borderRadius:'var(--rs)', padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'var(--muted)', marginBottom:3 }}>{s.l}</div>
                  <div style={{ fontSize:16, fontWeight:600, color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Best sell window + price alert */}
          <div className="card">
            <div className="card-title">{crop} — {TE ? 'ఉత్తమ విక్రయ సమయం' : 'Best Sell Timing'}</div>
            <div className="bwrap">
              <div><div className="bwlabel">{TE ? 'ఉత్తమ విక్రయ సమయం' : 'Best Sell Window'}</div><div className="bwval">{fdLabels[w.s]} – {fdLabels[w.e]}</div></div>
              <div><div className="bwlabel">{TE ? 'అంచనా గరిష్ట ధర' : 'Expected Peak'}</div><div className="bwval">₹{peakForecast.toLocaleString('en-IN')}</div></div>
              <span className="bwgain">+{gp}%</span>
            </div>
            <div style={{ marginTop:'1rem' }}>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:6 }}>{TE ? 'ధర హెచ్చరిక' : 'Price Alert'}</div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                <input className="alrt-inp" type="number" placeholder={`Target ₹ for ${crop} in ${district}`} value={av} onChange={e => setAv(e.target.value)}/>
                <button className="btn btn-p" onClick={() => { if (av) { setAlert({ crop, target:+av }); showToast(`Alert set: ${crop} @ ₹${av} in ${district}`); } }}>{TE ? 'సెట్ చేయి' : 'Set Alert'}</button>
              </div>
              {alert && <div className="alrt-badge">🔔 {alert.crop} @ ₹{alert.target} · {district} <span style={{ cursor:'pointer', textDecoration:'underline', marginLeft:6 }} onClick={() => setAlert(null)}>cancel</span></div>}
            </div>
          </div>
        </>
      )}

      {/* ── Forecast tab ── */}
      {ptab === 'forecast' && (
        <>
          <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap' }}>
            {CROPS.map(c => <button key={c} className={`btn ${crop === c ? 'btn-p' : 'btn-o'}`} onClick={() => setCrop(c)}>{c}</button>)}
          </div>
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
              <div>
                <div className="card-title" style={{ margin:0 }}>{crop} — {TE ? '45 రోజుల విశ్లేషణ' : '45 Day Analysis'}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{district} · {TE ? 'చారిత్రక + అంచనా ధరలు' : 'Historical + Forecast prices'}</div>
              </div>
              <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--muted)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:16, height:2, background:'#378ADD', display:'inline-block' }}/>{TE ? 'చారిత్రక' : 'Historical'}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:16, height:2, background:'#EF9F27', display:'inline-block' }}/>{TE ? 'అంచనా' : 'Forecast'}</span>
              </div>
            </div>
            <div className="cw"><canvas ref={cref}/></div>
            <div className="bwrap" style={{ marginTop:'1rem' }}>
              <div><div className="bwlabel">{TE ? 'ఉత్తమ సమయం' : 'Best Sell Window'}</div><div className="bwval">{fdLabels[w.s]} – {fdLabels[w.e]}</div></div>
              <div><div className="bwlabel">{TE ? 'అంచనా గరిష్ట ధర' : 'Expected Peak'}</div><div className="bwval">₹{peakForecast.toLocaleString('en-IN')}/qtl</div></div>
              <div><div className="bwlabel">{TE ? 'సంభావ్య లాభం' : 'Potential Gain'}</div><div className="bwval" style={{ color:'var(--green)' }}>+₹{g.toLocaleString('en-IN')} (+{gp}%)</div></div>
            </div>
          </div>
        </>
      )}

      {/* ── Mandi map tab ── */}
      {ptab === 'mandimap' && <MandiMap lang={lang} selectedCrop={crop}/>}
    </div>
  );
}
