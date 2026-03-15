// ══════════════════════════════════════════
// components/Nav.js
// Sticky top navigation bar.
// Contains:
//  - Logo (click → home)
//  - Page tab buttons
//  - Dark mode toggle (persisted in localStorage)
//  - EN / Telugu language toggle
// ══════════════════════════════════════════

function Nav({ tab, setTab, lang, setLang, dark, setDark }) {
  const NAV_TABS = [
    ['home',      'Home'],
    ['disease',   '🌿 Disease'],
    ['prices',    '📈 Prices'],
    ['crop',      '🌱 Crop Rec'],
    ['schemes',   '📋 Schemes'],
    ['insurance', '🛡️ Insurance'],
    ['pest',      '🐛 Pest Map'],
  ];

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-logo" onClick={() => setTab('home')}>
        🌾 KrishiDost
      </div>

      {/* Page tabs */}
      <div className="nav-tabs">
        {NAV_TABS.map(([id, label]) => (
          <button
            key={id}
            className={`ntab${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {/* Dark mode toggle */}
        <button
          className="dark-btn"
          onClick={() => setDark(d => !d)}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Language toggle */}
        <button
          className="lang-btn"
          onClick={() => setLang(l => l === 'EN' ? 'TE' : 'EN')}
        >
          {lang === 'EN' ? 'తెలుగు' : 'English'}
        </button>
      </div>
    </nav>
  );
}
