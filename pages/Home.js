// ══════════════════════════════════════════
// pages/Home.js
// Landing page.
// Contains:
//  - WeatherWidget (top of dashboard)
//  - Hero section with animated stat counters
//  - 6-card feature grid linking to all pages
//
// Props:
//   setTab — (tabId: string) => void
//   lang   — 'EN' | 'TE'
// ══════════════════════════════════════════

function Home({ setTab, lang }) {
  const TE = lang === 'TE';

  // Animated counters for hero stats
  const [cnt, setCnt] = useState({ d:0, f:0, s:0 });

  useEffect(() => {
    const h   = getH();
    const tgt = { d: 1247 + h.length, f: 842, s: 32 };
    let fr = 0;
    const a = setInterval(() => {
      fr++;
      if (fr >= 60) { setCnt(tgt); clearInterval(a); return; }
      setCnt({
        d: Math.round(tgt.d * fr / 60),
        f: Math.round(tgt.f * fr / 60),
        s: Math.round(tgt.s * fr / 60),
      });
    }, 18);
    return () => clearInterval(a);
  }, []);

  const FEATURES = [
    {
      id:'disease',   icon:'🌿', bg:'#E1F5EE',
      t:  'Crop Disease Detector',
      d:  'Upload leaf photo → AI diagnoses disease in 3 seconds → Treatment in Telugu',
    },
    {
      id:'prices',    icon:'📈', bg:'#FAEEDA',
      t:  'Mandi Price Intelligence',
      d:  'Live prices + 15-day forecast + Best sell window for max profit',
    },
    {
      id:'crop',      icon:'🌱', bg:'#EEEDFE',
      t:  'Crop Recommendation',
      d:  'Enter soil + season → AI recommends top 3 crops with profit comparison chart',
    },
    {
      id:'schemes',   icon:'📋', bg:'#E1F5EE',
      t:  'Govt Schemes Finder',
      d:  '5-step wizard → find all subsidies you qualify for → see total ₹ benefit',
    },
    {
      id:'insurance', icon:'🛡️', bg:'#FCEBEB',
      t:  'Crop Damage & Insurance',
      d:  'Upload field photos → AI assesses damage % → auto-generate PMFBY claim PDF',
    },
    {
      id:'pest',      icon:'🐛', bg:'#FAEEDA',
      t:  'Pest Outbreak Heatmap',
      d:  'Report pest sighting → live heatmap across AP & TS → outbreak alert if district has 3+ reports',
    },
  ];

  return (
    <div className="page">
      {/* Live weather widget */}
      <WeatherWidget lang={lang}/>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">UDGAMA Hackathon — AgriTech</div>
        <h1>Smart Farming for<br/>Andhra Pradesh</h1>
        <p>AI crop disease detection and mandi price intelligence — built for farmers, in Telugu and English.</p>

        {/* Animated stats */}
        <div className="stats-row">
          <div>
            <div className="stat-n">{cnt.d.toLocaleString('en-IN')}</div>
            <div className="stat-l">Diagnoses done</div>
          </div>
          <div>
            <div className="stat-n">{cnt.f.toLocaleString('en-IN')}</div>
            <div className="stat-l">Farmers helped</div>
          </div>
          <div>
            <div className="stat-n">₹{cnt.s}L+</div>
            <div className="stat-l">Crop losses prevented</div>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="fgrid">
        {FEATURES.map(f => (
          <div key={f.id} className="fcard" onClick={() => setTab(f.id)}>
            <div className="ficon" style={{ background: f.bg }}>{f.icon}</div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>{f.t}</div>
            <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.5 }}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
