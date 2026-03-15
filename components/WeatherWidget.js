// ══════════════════════════════════════════
// components/WeatherWidget.js
// Displays 4 weather cards (temp, rain,
// humidity, wind) for the selected district,
// plus a context-aware farming tip.
//
// Data source: WEATHER_DATA (weatherData.js)
// farmingTip() helper also from weatherData.js
//
// Props:
//   lang  — 'EN' | 'TE'
// The district is read from localStorage key
// 'kd_district', defaulting to 'Guntur'.
// ══════════════════════════════════════════

function WeatherWidget({ lang }) {
  const TE = lang === 'TE';
  const [district, setDistrict] = useState('Guntur');
  const [loading, setLoading]   = useState(true);

  // Simulate async weather fetch with a short delay
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [district]);

  const w          = WEATHER_DATA[district] || WEATHER_DATA['Default'];
  const tempColor  = w.temp > 38 ? 'var(--red)' : w.temp > 33 ? 'var(--amber)' : 'var(--green)';
  const rainColor  = w.rain > 60 ? 'var(--red)' : w.rain > 30  ? 'var(--amber)' : 'var(--green)';

  return (
    <div className="card" style={{ marginBottom:'1.5rem' }}>
      {/* Header with district selector */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>🌤</span>
          <span style={{ fontWeight:600, fontSize:15 }}>
            {TE ? 'వాతావరణం' : 'Weather'} — {district}
          </span>
        </div>
        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          style={{ padding:'5px 10px', borderRadius:'var(--rs)', border:'1px solid var(--border)', fontSize:12, background:'var(--bg)', color:'var(--text)' }}
        >
          <optgroup label="Andhra Pradesh">
            {DIST_AP.map(d => <option key={d}>{d}</option>)}
          </optgroup>
          <optgroup label="Telangana">
            {DIST_TS.map(d => <option key={d}>{d}</option>)}
          </optgroup>
        </select>
      </div>

      {loading ? (
        <div className="weather-loading">
          <div className="aring" style={{ width:20, height:20, borderWidth:2, margin:0, borderTopColor:'var(--blue)' }}/>
          {TE ? 'వాతావరణం లోడ్ అవుతున్నది...' : 'Loading weather...'}
        </div>
      ) : (
        <>
          <div className="weather-widget">
            {/* Temperature */}
            <div className="weather-card">
              <div className="weather-icon">{w.icon}</div>
              <div className="weather-val" style={{ color:tempColor }}>{w.temp}°C</div>
              <div className="weather-label">{TE ? 'ఉష్ణోగ్రత' : 'Temperature'}</div>
              <div className="weather-sub">{TE ? `అనుభూతి ${w.feels}°C` : `Feels ${w.feels}°C`}</div>
              <div className="weather-bar">
                <div className="weather-bar-fill" style={{ width:`${Math.min(w.temp / 45 * 100, 100)}%`, background:tempColor }}/>
              </div>
            </div>

            {/* Rain chance */}
            <div className="weather-card">
              <div className="weather-icon">🌧</div>
              <div className="weather-val" style={{ color:rainColor }}>{w.rain}%</div>
              <div className="weather-label">{TE ? 'వర్షం అంచనా' : 'Rain Chance'}</div>
              <div className="weather-sub">
                {w.rain > 60 ? (TE ? 'వర్షం సాధ్యం' : 'Rain likely')
                  : w.rain > 30 ? (TE ? 'మేఘావృతం' : 'Partly cloudy')
                  : (TE ? 'వర్షం లేదు' : 'Clear')}
              </div>
              <div className="weather-bar">
                <div className="weather-bar-fill" style={{ width:`${w.rain}%`, background:rainColor }}/>
              </div>
            </div>

            {/* Humidity */}
            <div className="weather-card">
              <div className="weather-icon">💧</div>
              <div className="weather-val" style={{ color:'var(--blue)' }}>{w.humidity}%</div>
              <div className="weather-label">{TE ? 'తేమ' : 'Humidity'}</div>
              <div className="weather-sub">
                {w.humidity > 75 ? (TE ? 'అధికం' : 'High')
                  : w.humidity > 55 ? (TE ? 'మధ్యస్థ' : 'Moderate')
                  : (TE ? 'తక్కువ' : 'Low')}
              </div>
              <div className="weather-bar">
                <div className="weather-bar-fill" style={{ width:`${w.humidity}%`, background:'var(--blue)' }}/>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-card">
              <div className="weather-icon">💨</div>
              <div className="weather-val" style={{ color:'var(--muted)' }}>{w.wind}</div>
              <div className="weather-label">{TE ? 'గాలి వేగం km/h' : 'Wind km/h'}</div>
              <div className="weather-sub">
                {w.wind > 25 ? (TE ? 'బలమైన' : 'Strong')
                  : w.wind > 15 ? (TE ? 'మధ్యస్థ' : 'Moderate')
                  : (TE ? 'తేలికైన' : 'Light')}
              </div>
              <div className="weather-bar">
                <div className="weather-bar-fill" style={{ width:`${Math.min(w.wind / 40 * 100, 100)}%`, background:'var(--muted)' }}/>
              </div>
            </div>
          </div>

          {/* Farming tip based on conditions */}
          <div style={{
            background: w.rain > 70 ? 'var(--red-l)' : w.temp > 38 ? 'var(--amber-l)' : 'var(--green-l)',
            borderRadius: 'var(--rs)', padding:'8px 12px', fontSize:12, fontWeight:500,
            color: w.rain > 70 ? 'var(--red-d)' : w.temp > 38 ? 'var(--amber-d)' : 'var(--green-d)',
          }}>
            {farmingTip(w.rain, w.temp, lang)}
          </div>
        </>
      )}
    </div>
  );
}
