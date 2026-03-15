// ══════════════════════════════════════════
// pages/PestMap.js
// Pest Outbreak Heatmap — 2 features:
//
// Feature 1 — Live Leaflet heatmap
//   30 pre-seeded mock reports across AP+TS.
//   Leaflet.heat plugin for intensity overlay.
//   Filterable by crop and pest type.
//   Outbreak district markers (circles with
//   report count) for districts with ≥3 reports.
//
// Feature 2 — Outbreak alert banners + list
//   Alert banners for top 3 outbreaks shown
//   above the map. Alerts tab shows full list
//   with recommended pesticide actions.
//   Users can submit new pest sightings via
//   the Report tab — updates the live map.
//
// Props:
//   lang      — 'EN' | 'TE'
//   showToast — (msg: string) => void
// ══════════════════════════════════════════

// ── District lat/lng centroids (AP + TS) ──
const DISTRICT_COORDS = {
  "Guntur":[16.3067,80.4365],"Bapatla":[15.9000,80.4600],"NTR":[16.5200,80.6400],
  "Krishna":[16.6096,80.7214],"Eluru":[16.7100,81.0950],"East Godavari":[17.0005,81.8040],
  "West Godavari":[16.9174,81.3368],"Kakinada":[16.9891,82.2475],"Dr. B.R. Ambedkar Konaseema":[16.8200,82.1500],
  "Anakapalli":[17.6910,83.0050],"Visakhapatnam":[17.6868,83.2185],"Vizianagaram":[18.1067,83.3956],
  "Srikakulam":[18.2949,83.8938],"Alluri Sitharama Raju":[18.0700,82.5400],"Parvathipuram Manyam":[18.7833,83.4250],
  "Kurnool":[15.8281,78.0373],"Nandyal":[15.4786,78.4838],"Ananthapuramu":[14.6819,77.6006],
  "Sri Balaji":[13.6288,79.4192],"Kadapa":[14.4674,78.8242],"YSR Kadapa":[14.4674,78.8242],
  "Tirupati":[13.6288,79.4192],"Chittoor":[13.2172,79.1003],"Prakasam":[15.3408,79.5748],
  "Sri Potti Sriramulu Nellore":[14.4426,79.9865],"Palnadu":[16.2400,79.5800],
  "Hyderabad":[17.3850,78.4867],"Rangareddy":[17.2400,78.3900],"Medchal-Malkajgiri":[17.6300,78.5600],
  "Sangareddy":[17.6200,77.9700],"Medak":[18.0500,78.2600],"Siddipet":[18.1000,78.8500],
  "Karimnagar":[18.4386,79.1288],"Jagtial":[18.7944,79.3680],"Rajanna Sircilla":[18.3867,78.8117],
  "Peddapalli":[18.6139,79.3761],"Mancherial":[18.8700,79.4600],"Adilabad":[19.6641,78.5320],
  "Nirmal":[19.0983,78.3442],"Komaram Bheem Asifabad":[19.3700,79.2900],"Nizamabad":[18.6725,78.0941],
  "Kamareddy":[18.3200,78.3400],"Hanamkonda":[17.9784,79.5941],"Warangal":[17.9800,79.5800],
  "Jangaon":[17.7246,79.1560],"Yadadri Bhuvanagiri":[17.5600,79.4900],"Nalgonda":[17.0575,79.2690],
  "Suryapet":[17.1400,79.6200],"Khammam":[17.2473,80.1514],"Bhadradri Kothagudem":[17.5500,80.6200],
  "Mahabubabad":[17.6012,80.0007],"Mulugu":[18.1900,80.0400],"Jayashankar Bhupalpally":[18.4400,79.9500],
  "Mahabubnagar":[16.7376,77.9862],"Nagarkurnool":[16.4800,78.3200],"Wanaparthy":[16.3600,78.0600],
  "Jogulamba Gadwal":[16.2300,77.8000],"Narayanpet":[16.7400,77.4900],"Vikarabad":[17.3400,77.9000],
};

// ── Pre-seeded mock reports (30 across AP + TS) ──
const MOCK_REPORTS = [
  {district:"Guntur",crop:"Chilli",pest:"Thrips",severity:4,lat:16.31,lng:80.44},
  {district:"Guntur",crop:"Chilli",pest:"Thrips",severity:5,lat:16.28,lng:80.41},
  {district:"Guntur",crop:"Chilli",pest:"Mites",severity:3,lat:16.33,lng:80.46},
  {district:"Guntur",crop:"Chilli",pest:"Whitefly",severity:4,lat:16.29,lng:80.42},
  {district:"Kurnool",crop:"Groundnut",pest:"Leaf Miner",severity:4,lat:15.83,lng:78.04},
  {district:"Kurnool",crop:"Groundnut",pest:"Aphids",severity:3,lat:15.80,lng:78.01},
  {district:"Kurnool",crop:"Cotton",pest:"Bollworm",severity:5,lat:15.85,lng:78.07},
  {district:"Krishna",crop:"Rice",pest:"Brown Planthopper",severity:4,lat:16.62,lng:80.73},
  {district:"Krishna",crop:"Rice",pest:"Stem Borer",severity:3,lat:16.58,lng:80.69},
  {district:"East Godavari",crop:"Rice",pest:"Stem Borer",severity:4,lat:17.01,lng:81.82},
  {district:"East Godavari",crop:"Rice",pest:"Leaf Folder",severity:3,lat:16.98,lng:81.78},
  {district:"West Godavari",crop:"Rice",pest:"Gall Midge",severity:5,lat:16.92,lng:81.35},
  {district:"West Godavari",crop:"Rice",pest:"Brown Planthopper",severity:4,lat:16.89,lng:81.31},
  {district:"West Godavari",crop:"Rice",pest:"Stem Borer",severity:3,lat:16.94,lng:81.38},
  {district:"Khammam",crop:"Cotton",pest:"Bollworm",severity:5,lat:17.25,lng:80.16},
  {district:"Khammam",crop:"Cotton",pest:"Whitefly",severity:4,lat:17.22,lng:80.12},
  {district:"Khammam",crop:"Cotton",pest:"Jassids",severity:3,lat:17.27,lng:80.18},
  {district:"Warangal",crop:"Cotton",pest:"Bollworm",severity:4,lat:17.99,lng:79.59},
  {district:"Warangal",crop:"Maize",pest:"Fall Armyworm",severity:5,lat:17.96,lng:79.56},
  {district:"Karimnagar",crop:"Rice",pest:"Stem Borer",severity:3,lat:18.44,lng:79.13},
  {district:"Karimnagar",crop:"Maize",pest:"Fall Armyworm",severity:4,lat:18.41,lng:79.10},
  {district:"Nalgonda",crop:"Rice",pest:"Gall Midge",severity:4,lat:17.06,lng:79.27},
  {district:"Visakhapatnam",crop:"Sugarcane",pest:"Woolly Aphid",severity:3,lat:17.69,lng:83.22},
  {district:"Ananthapuramu",crop:"Groundnut",pest:"Leaf Miner",severity:4,lat:14.69,lng:77.60},
  {district:"Ananthapuramu",crop:"Groundnut",pest:"Thrips",severity:3,lat:14.66,lng:77.57},
  {district:"Nizamabad",crop:"Maize",pest:"Fall Armyworm",severity:4,lat:18.68,lng:78.10},
  {district:"Nizamabad",crop:"Maize",pest:"Stem Borer",severity:3,lat:18.65,lng:78.07},
  {district:"Medak",crop:"Maize",pest:"Fall Armyworm",severity:5,lat:18.06,lng:78.27},
  {district:"Adilabad",crop:"Maize",pest:"Fall Armyworm",severity:3,lat:19.67,lng:78.53},
  {district:"Prakasam",crop:"Cotton",pest:"Bollworm",severity:4,lat:15.34,lng:79.58},
];

const PEST_TYPES  = ["Thrips","Aphids","Whitefly","Bollworm","Stem Borer","Brown Planthopper","Leaf Miner","Fall Armyworm","Mites","Gall Midge","Leaf Folder","Jassids","Woolly Aphid","Mealy Bug","Root Grub","Other"];
const PEST_TE_MAP = {"Thrips":"థ్రిప్స్","Aphids":"అఫిడ్స్","Whitefly":"వైట్‌ఫ్లై","Bollworm":"బోల్‌వర్మ్","Stem Borer":"స్టెమ్ బోరర్","Brown Planthopper":"బ్రౌన్ ప్లాంట్‌హాపర్","Leaf Miner":"లీఫ్ మైనర్","Fall Armyworm":"ఫాల్ ఆర్మీవర్మ్","Mites":"మైట్స్","Gall Midge":"గాల్ మిడ్జ్","Leaf Folder":"లీఫ్ ఫోల్డర్","Jassids":"జాసిడ్స్","Woolly Aphid":"వూలీ అఫిడ్","Mealy Bug":"మీలీ బగ్","Root Grub":"రూట్ గ్రబ్","Other":"ఇతర"};
const CROP_PESTS  = {"Rice":["Brown Planthopper","Stem Borer","Gall Midge","Leaf Folder"],"Chilli":["Thrips","Mites","Whitefly","Aphids"],"Cotton":["Bollworm","Whitefly","Jassids","Mealy Bug"],"Groundnut":["Leaf Miner","Thrips","Aphids","Root Grub"],"Maize":["Fall Armyworm","Stem Borer","Aphids"],"Sugarcane":["Woolly Aphid","Mealy Bug","Root Grub"]};

function PestMap({ lang, showToast }) {
  const TE = lang === 'TE';

  const mapRef     = useRef(null);
  const mapInst    = useRef(null);
  const heatInst   = useRef(null);
  const markerGrp  = useRef(null);

  const [reports,     setReports]     = useState(MOCK_REPORTS);
  const [viewTab,     setViewTab]     = useState('map'); // 'map' | 'report' | 'alerts'
  const [form,        setForm]        = useState({ district:'Guntur', crop:'Chilli', pest:'Thrips', severity:'3' });
  const [submitted,   setSubmitted]   = useState(false);
  const [filterCrop,  setFilterCrop]  = useState('All');
  const [filterPest,  setFilterPest]  = useState('All');

  // ── Derived data ──
  const districtCounts = reports.reduce((acc, r) => { acc[r.district] = (acc[r.district]||0)+1; return acc; }, {});
  const outbreaks = Object.entries(districtCounts).filter(([,c]) => c >= 3).sort(([,a],[,b]) => b-a);
  const districtPests  = reports.reduce((acc, r) => { if (!acc[r.district]) acc[r.district]={}; acc[r.district][r.pest]=(acc[r.district][r.pest]||0)+1; return acc; }, {});
  function topPest(dist) { const p=districtPests[dist]; if(!p) return ''; return Object.entries(p).sort(([,a],[,b])=>b-a)[0][0]; }

  // Severity helpers
  const sevColor  = s => s >= 4 ? 'var(--red)'   : s >= 3 ? 'var(--amber)'   : 'var(--green)';
  const sevBg     = s => s >= 4 ? 'var(--red-l)' : s >= 3 ? 'var(--amber-l)' : 'var(--green-l)';
  const sevLabel  = s => s >= 4 ? (TE?'తీవ్రమైన':'Severe') : s >= 3 ? (TE?'మధ్యస్థ':'Moderate') : (TE?'తక్కువ':'Mild');

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  // ── Feature 1: Initialise Leaflet + heatmap ──
  useEffect(() => {
    if (viewTab !== 'map' || !mapRef.current) return;

    function updateHeatmap(map) {
      const L = window.L;
      if (!L) return;
      let filtered = reports;
      if (filterCrop !== 'All') filtered = filtered.filter(r => r.crop === filterCrop);
      if (filterPest !== 'All') filtered = filtered.filter(r => r.pest === filterPest);
      if (heatInst.current) { map.removeLayer(heatInst.current); heatInst.current = null; }
      if (markerGrp.current) markerGrp.current.clearLayers();
      const heatData = filtered.map(r => {
        const c = DISTRICT_COORDS[r.district]; if (!c) return null;
        const j = (Math.random() - 0.5) * 0.3;
        return [c[0]+j, c[1]+j, r.severity/5];
      }).filter(Boolean);
      if (heatData.length > 0 && L.heatLayer) {
        heatInst.current = L.heatLayer(heatData, { radius:35, blur:25, maxZoom:10, gradient:{'0.2':'#1D9E75','0.5':'#EF9F27','0.8':'#E24B4A','1.0':'#791F1F'} }).addTo(map);
      }
      Object.entries(districtCounts).forEach(([dist, count]) => {
        if (count < 3) return;
        const c = DISTRICT_COORDS[dist]; if (!c) return;
        const color = count >= 5 ? '#E24B4A' : '#EF9F27';
        const icon = L.divIcon({ className:'', html:`<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${count}</div>`, iconSize:[28,28], iconAnchor:[14,14] });
        L.marker(c, {icon}).bindPopup(`<b>⚠️ ${dist}</b><br/>${count} reports · Top pest: ${topPest(dist)}`).addTo(markerGrp.current);
      });
    }

    function initMap() {
      if (mapInst.current) return;
      const L   = window.L;
      const map = L.map(mapRef.current, { zoomControl:true, scrollWheelZoom:false }).setView([16.5,80.5], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap contributors', maxZoom:18 }).addTo(map);
      mapInst.current  = map;
      markerGrp.current = L.layerGroup().addTo(map);
      updateHeatmap(map);
    }

    function loadHeatPlugin() {
      if (window.L?.heatLayer) { initMap(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js';
      s.onload = () => initMap(); document.head.appendChild(s);
    }

    if (window.L) { loadHeatPlugin(); }
    else {
      const css = document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
      const s = document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload=()=>loadHeatPlugin(); document.head.appendChild(s);
    }
  }, [viewTab]);

  // Redraw heatmap when filters or reports change
  useEffect(() => {
    if (!mapInst.current || !window.L) return;
    const L = window.L;
    if (heatInst.current) { mapInst.current.removeLayer(heatInst.current); heatInst.current = null; }
    if (markerGrp.current) markerGrp.current.clearLayers();
    let filtered = reports;
    if (filterCrop !== 'All') filtered = filtered.filter(r => r.crop === filterCrop);
    if (filterPest !== 'All') filtered = filtered.filter(r => r.pest === filterPest);
    const heatData = filtered.map(r => { const c=DISTRICT_COORDS[r.district]; if(!c) return null; const j=(Math.random()-.5)*.3; return [c[0]+j,c[1]+j,r.severity/5]; }).filter(Boolean);
    if (heatData.length > 0 && L.heatLayer) {
      heatInst.current = L.heatLayer(heatData, { radius:35, blur:25, maxZoom:10, gradient:{'0.2':'#1D9E75','0.5':'#EF9F27','0.8':'#E24B4A','1.0':'#791F1F'} }).addTo(mapInst.current);
    }
    Object.entries(districtCounts).forEach(([dist, count]) => {
      if (count < 3) return; const c=DISTRICT_COORDS[dist]; if(!c) return;
      const color = count>=5?'#E24B4A':'#EF9F27';
      const icon = L.divIcon({ className:'', html:`<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${count}</div>`, iconSize:[28,28], iconAnchor:[14,14] });
      L.marker(c, {icon}).bindPopup(`<b>⚠️ ${dist}</b><br/>${count} reports · Top pest: ${topPest(dist)}`).addTo(markerGrp.current);
    });
  }, [reports, filterCrop, filterPest]);

  // ── Feature 1: Submit a new pest report ──
  function submitReport() {
    const coords = DISTRICT_COORDS[form.district];
    if (!coords) return;
    const jitter = (Math.random() - 0.5) * 0.25;
    setReports(prev => [...prev, { district:form.district, crop:form.crop, pest:form.pest, severity:parseInt(form.severity), lat:coords[0]+jitter, lng:coords[1]+jitter, isNew:true }]);
    setSubmitted(true);
    showToast(TE ? `✅ ${form.district}లో ${PEST_TE_MAP[form.pest]||form.pest} నివేదించబడింది!` : `✅ ${form.pest} reported in ${form.district}!`);
    setTimeout(() => { setSubmitted(false); setViewTab('map'); }, 2000);
  }

  const allCrops = ['All', ...new Set(reports.map(r => r.crop))];
  const allPests = ['All', ...new Set(reports.map(r => r.pest))];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:'1rem' }}>
        <h2 className="stitle" style={{ margin:0 }}>🐛 {TE ? 'పురుగుల వ్యాప్తి హీట్‌మ్యాప్' : 'Pest Outbreak Heatmap'}</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:99, background:'var(--red-l)', color:'var(--red-d)' }}>
            {outbreaks.length} {TE?'చురుకైన వ్యాప్తులు':'active outbreaks'}
          </span>
          <span style={{ fontSize:12, color:'var(--muted)', padding:'4px 12px', borderRadius:99, background:'var(--bg)' }}>
            {reports.length} {TE?'మొత్తం నివేదికలు':'total reports'}
          </span>
        </div>
      </div>

      {/* Outbreak alert banners (top 3) */}
      {outbreaks.length > 0 && (
        <div style={{ marginBottom:'1rem' }}>
          {outbreaks.slice(0,3).map(([dist, count]) => (
            <div key={dist} style={{ background: count>=5?'var(--red-l)':'var(--amber-l)', border:`1.5px solid ${count>=5?'var(--red)':'var(--amber)'}`, borderRadius:'var(--rs)', padding:'10px 14px', marginBottom:6, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontSize:18 }}>{count >= 5 ? '🚨' : '⚠️'}</span>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, fontWeight:700, color: count>=5?'var(--red-d)':'var(--amber-d)' }}>
                  {TE ? `${DIST_TE[dist]||dist}లో ${PEST_TE_MAP[topPest(dist)]||topPest(dist)} వ్యాప్తి గుర్తించబడింది` : `${topPest(dist)} outbreak detected in ${dist}`}
                </span>
                <span style={{ fontSize:12, color:'var(--muted)', marginLeft:8 }}>{count} {TE?'నివేదికలు':'reports'}</span>
              </div>
              <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99, background: count>=5?'var(--red)':'var(--amber)', color:'#fff' }}>
                {count >= 5 ? (TE?'అత్యవసరం':'URGENT') : (TE?'హెచ్చరిక':'WARNING')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab${viewTab==='map'?' active':''}`} onClick={() => setViewTab('map')}>🗺️ {TE?'లైవ్ మ్యాప్':'Live Map'}</div>
        <div className={`tab${viewTab==='report'?' active':''}`} onClick={() => setViewTab('report')}>📝 {TE?'పురుగు నివేదించు':'Report Pest'}</div>
        <div className={`tab${viewTab==='alerts'?' active':''}`} onClick={() => setViewTab('alerts')}>🚨 {TE?'వ్యాప్తి జాబితా':'Outbreaks'} ({outbreaks.length})</div>
      </div>

      {/* ── Map tab ── */}
      {viewTab === 'map' && (
        <div>
          {/* Filters */}
          <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--muted)', fontWeight:500 }}>{TE?'ఫిల్టర్:':'Filter:'}</span>
            <select value={filterCrop} onChange={e=>setFilterCrop(e.target.value)} style={{ padding:'5px 10px', borderRadius:99, border:'1px solid var(--border)', fontSize:12, background:'var(--surface)', color:'var(--text)' }}>
              {allCrops.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={filterPest} onChange={e=>setFilterPest(e.target.value)} style={{ padding:'5px 10px', borderRadius:99, border:'1px solid var(--border)', fontSize:12, background:'var(--surface)', color:'var(--text)' }}>
              {allPests.map(p=><option key={p}>{p}</option>)}
            </select>
            <button className="btn btn-o" style={{ fontSize:11, padding:'4px 10px' }} onClick={() => { setFilterCrop('All'); setFilterPest('All'); }}>✕ {TE?'క్లియర్':'Clear'}</button>
          </div>

          {/* Heatmap legend */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8, fontSize:11, color:'var(--muted)', flexWrap:'wrap' }}>
            <span style={{ fontWeight:600 }}>{TE?'తీవ్రత:':'Intensity:'}</span>
            {[['#1D9E75',TE?'తక్కువ':'Low'],['#EF9F27',TE?'మధ్యస్థ':'Medium'],['#E24B4A',TE?'అధికం':'High'],['#791F1F',TE?'అత్యధికం':'Critical']].map(([c,l]) => (
              <span key={l} style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:12, height:12, borderRadius:'50%', background:c, display:'inline-block' }}/>{l}</span>
            ))}
          </div>

          {/* Map container */}
          <div style={{ borderRadius:'var(--r)', overflow:'hidden', border:'1px solid var(--border)', marginBottom:'1rem' }}>
            <div ref={mapRef} style={{ height:420, width:'100%', background:'#e8f4e8' }}/>
          </div>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:'1rem' }}>
            {[
              {l:TE?'మొత్తం నివేదికలు':'Total Reports',v:reports.length,c:'var(--blue)'},
              {l:TE?'వ్యాప్తి జిల్లాలు':'Outbreak Districts',v:outbreaks.length,c:'var(--red)'},
              {l:TE?'అత్యంత ప్రభావిత పంట':'Most Affected Crop',v:[...reports.reduce((m,r)=>{m.set(r.crop,(m.get(r.crop)||0)+1);return m;},new Map())].sort((a,b)=>b[1]-a[1])[0]?.[0]||'-',c:'var(--amber)'},
              {l:TE?'అత్యంత సాధారణ పురుగు':'Most Common Pest',v:[...reports.reduce((m,r)=>{m.set(r.pest,(m.get(r.pest)||0)+1);return m;},new Map())].sort((a,b)=>b[1]-a[1])[0]?.[0]||'-',c:'var(--green)'},
            ].map(s => (
              <div key={s.l} style={{ background:'var(--bg)', borderRadius:'var(--rs)', padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:'var(--muted)', marginBottom:3, lineHeight:1.3 }}>{s.l}</div>
                <div style={{ fontSize: typeof s.v==='number'?20:13, fontWeight:600, color:s.c, lineHeight:1.2 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Recent reports list */}
          <div className="card">
            <div className="card-title">{TE?'తాజా నివేదికలు':'Recent Reports'}</div>
            {reports.slice(-6).reverse().map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:sevColor(r.severity), minWidth:8 }}/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, fontWeight:500 }}>{TE?(PEST_TE_MAP[r.pest]||r.pest):r.pest}</span>
                  <span style={{ fontSize:12, color:'var(--muted)', marginLeft:6 }}>on {r.crop}</span>
                </div>
                <span style={{ fontSize:11, color:'var(--muted)' }}>{TE?(DIST_TE[r.district]||r.district):r.district}</span>
                <span style={{ fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:99, background:sevBg(r.severity), color:sevColor(r.severity) }}>{sevLabel(r.severity)}</span>
                {r.isNew && <span style={{ fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:99, background:'var(--green-l)', color:'var(--green-d)' }}>NEW</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Report tab ── */}
      {viewTab === 'report' && (
        <div>
          {submitted ? (
            <div style={{ textAlign:'center', padding:'4rem 1rem' }}>
              <div style={{ fontSize:56, marginBottom:'1rem' }}>✅</div>
              <div style={{ fontSize:18, fontWeight:600, color:'var(--green-d)', marginBottom:6 }}>{TE?'నివేదిక విజయవంతంగా సమర్పించబడింది!':'Report submitted successfully!'}</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>{TE?'మ్యాప్ నవీకరించబడుతోంది...':'Updating the heatmap...'}</div>
            </div>
          ) : (
            <div className="two">
              <div className="card">
                <div className="card-title">📝 {TE?'పురుగు సమాచారం నివేదించు':'Report Pest Sighting'}</div>

                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5 }}>📍 {TE?'జిల్లా':'District'}</div>
                  <select value={form.district} onChange={e=>setF('district',e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:13, background:'var(--bg)', color:'var(--text)' }}>
                    <optgroup label="Andhra Pradesh">{DIST_AP.map(d=><option key={d}>{d}</option>)}</optgroup>
                    <optgroup label="Telangana">{DIST_TS.map(d=><option key={d}>{d}</option>)}</optgroup>
                  </select>
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5 }}>🌾 {TE?'పంట రకం':'Crop Type'}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {Object.keys(CROP_PESTS).map(c => (
                      <button key={c} className={`btn ${form.crop===c?'btn-p':'btn-o'}`} style={{ fontSize:12, padding:'5px 12px' }}
                        onClick={() => { setF('crop',c); setF('pest',CROP_PESTS[c][0]); }}>
                        {CROP_DB[c]?.emoji||'🌿'} {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5 }}>🐛 {TE?'పురుగు రకం':'Pest Type'}</div>
                  <select value={form.pest} onChange={e=>setF('pest',e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:13, background:'var(--bg)', color:'var(--text)' }}>
                    {(CROP_PESTS[form.crop]||[]).map(p=><option key={p} value={p}>{TE?(PEST_TE_MAP[p]||p):p} ⭐</option>)}
                    <option disabled>──────────</option>
                    {PEST_TYPES.filter(p=>!(CROP_PESTS[form.crop]||[]).includes(p)).map(p=><option key={p} value={p}>{TE?(PEST_TE_MAP[p]||p):p}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5 }}>
                    📊 {TE?'తీవ్రత':'Severity'}: <span style={{ color:sevColor(parseInt(form.severity)), fontWeight:700 }}>{sevLabel(parseInt(form.severity))} ({form.severity}/5)</span>
                  </div>
                  <input type="range" min="1" max="5" step="1" value={form.severity} onChange={e=>setF('severity',e.target.value)} style={{ width:'100%' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--muted)', marginTop:3 }}>
                    <span>{TE?'తక్కువ':'Low (1)'}</span><span>{TE?'మధ్యస్థ':'Medium (3)'}</span><span>{TE?'అత్యధికం':'Critical (5)'}</span>
                  </div>
                </div>

                <button className="btn btn-p" style={{ width:'100%', justifyContent:'center', padding:'11px', fontSize:14, fontWeight:600, background:'var(--amber)', borderColor:'var(--amber)' }} onClick={submitReport}>
                  📍 {TE?'పురుగు సమాచారం సమర్పించు':'Submit Pest Report'}
                </button>
              </div>

              {/* Right: crop-specific pest info */}
              <div>
                <div className="card" style={{ background:'var(--amber-l)', border:'1px solid rgba(239,159,39,.3)' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--amber-d)', marginBottom:10 }}>
                    🌾 {TE?`${form.crop}కు సాధారణ పురుగులు`:`Common pests for ${form.crop}`}
                  </div>
                  {(CROP_PESTS[form.crop]||[]).map(p => (
                    <div key={p} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(239,159,39,.2)', fontSize:13 }}>
                      <span>🐛</span>
                      <span style={{ flex:1, fontWeight:500 }}>{TE?(PEST_TE_MAP[p]||p):p}</span>
                      <span style={{ fontSize:11, color:'var(--amber-d)', background:'rgba(239,159,39,.2)', padding:'1px 8px', borderRadius:99 }}>{TE?'సాధారణం':'Common'}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ marginTop:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>💡 {TE?'మీ నివేదిక సహాయం చేస్తుంది:':'Your report helps:'}</div>
                  {[TE?'పొరుగు రైతులను హెచ్చరించండి':'Alert nearby farmers',TE?'వ్యాప్తి ముందస్తుగా గుర్తించండి':'Detect outbreaks early',TE?'వ్యవసాయ అధికారులకు తెలియజేయండి':'Notify agriculture officials'].map(t => (
                    <div key={t} style={{ display:'flex', gap:6, fontSize:12, color:'var(--muted)', padding:'3px 0' }}>
                      <span style={{ color:'var(--green)' }}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Alerts tab ── */}
      {viewTab === 'alerts' && (
        <div>
          {outbreaks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>
              <div style={{ fontSize:44, marginBottom:'.75rem' }}>✅</div>
              <div>{TE?'ప్రస్తుతం చురుకైన వ్యాప్తులు లేవు':'No active outbreaks currently'}</div>
            </div>
          ) : outbreaks.map(([dist, count]) => {
            const pest      = topPest(dist);
            const distReports = reports.filter(r => r.district === dist);
            const crops     = [...new Set(distReports.map(r=>r.crop))].join(', ');
            const pests     = [...new Set(distReports.map(r=>r.pest))].join(', ');
            const isUrgent  = count >= 5;
            const ACTION_MAP = {'Bollworm':'Apply Emamectin Benzoate 5% SG @ 0.4g/L','Stem Borer':'Apply Cartap Hydrochloride 50% SP @ 1g/L','Brown Planthopper':'Apply Buprofezin 25% SC @ 1.5mL/L','Fall Armyworm':'Apply Spinetoram 11.7% SC @ 0.5mL/L','Thrips':'Apply Spinosad 45% SC @ 0.3mL/L'};
            return (
              <div key={dist} style={{ background:'var(--surface)', border:`2px solid ${isUrgent?'var(--red)':'var(--amber)'}`, borderRadius:'var(--r)', padding:'1.25rem', marginBottom:'1rem' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, flexWrap:'wrap', marginBottom:10 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:22 }}>{isUrgent?'🚨':'⚠️'}</span>
                      <span style={{ fontSize:16, fontWeight:700, color: isUrgent?'var(--red-d)':'var(--amber-d)' }}>{TE?(DIST_TE[dist]||dist):dist}</span>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background: isUrgent?'var(--red)':'var(--amber)', color:'#fff' }}>
                        {isUrgent?(TE?'అత్యవసరం':'URGENT'):(TE?'హెచ్చరిక':'WARNING')}
                      </span>
                    </div>
                    <div style={{ fontSize:13, color:'var(--muted)' }}>{count} {TE?'నివేదికలు':'reports'} · {TE?'పంటలు':'Crops'}: {crops}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{TE?'అత్యంత సాధారణ పురుగు':'Top pest'}</div>
                    <div style={{ fontSize:15, fontWeight:700, color: isUrgent?'var(--red)':'var(--amber)' }}>{TE?(PEST_TE_MAP[pest]||pest):pest}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', background:'var(--bg)', borderRadius:'var(--rs)', padding:'8px 12px', marginBottom:10 }}>
                  🐛 {TE?'గుర్తించిన పురుగులు:':'Pests identified:'} <strong>{pests}</strong>
                </div>
                <div style={{ fontSize:12, color: isUrgent?'var(--red-d)':'var(--amber-d)', fontWeight:500 }}>
                  💊 {TE?'సిఫార్సు చేయబడిన చర్య:':'Recommended action:'} {ACTION_MAP[pest] || `Consult local agricultural officer for ${pest} management`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
