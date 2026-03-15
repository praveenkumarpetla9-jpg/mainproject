// ══════════════════════════════════════════
// data/weatherData.js
// WEATHER_DATA — realistic mock weather per
//   AP + Telangana district.
// farmingTip() — context-aware farming
//   advice based on rain/temp + language.
// ══════════════════════════════════════════

const WEATHER_DATA = {
  // ── Andhra Pradesh ──
  "Guntur":       { temp:34, feels:37, rain:20, humidity:68, wind:14, desc:"Partly Cloudy", icon:"⛅" },
  "Bapatla":      { temp:33, feels:36, rain:25, humidity:72, wind:16, desc:"Partly Cloudy", icon:"⛅" },
  "NTR":          { temp:35, feels:38, rain:15, humidity:65, wind:12, desc:"Sunny",         icon:"☀️" },
  "Krishna":      { temp:33, feels:36, rain:30, humidity:74, wind:18, desc:"Cloudy",        icon:"🌤" },
  "Eluru":        { temp:32, feels:35, rain:35, humidity:76, wind:15, desc:"Cloudy",        icon:"🌤" },
  "East Godavari":  { temp:30, feels:33, rain:60, humidity:82, wind:20, desc:"Rain likely", icon:"🌧" },
  "West Godavari":  { temp:31, feels:34, rain:55, humidity:80, wind:18, desc:"Rain likely", icon:"🌧" },
  "Kakinada":     { temp:30, feels:33, rain:65, humidity:84, wind:22, desc:"Heavy rain",    icon:"⛈" },
  "Visakhapatnam":{ temp:31, feels:34, rain:40, humidity:78, wind:24, desc:"Partly Cloudy", icon:"⛅" },
  "Vizianagaram": { temp:30, feels:33, rain:45, humidity:79, wind:20, desc:"Cloudy",        icon:"🌤" },
  "Srikakulam":   { temp:29, feels:32, rain:50, humidity:81, wind:22, desc:"Cloudy",        icon:"🌤" },
  "Kurnool":      { temp:38, feels:42, rain:5,  humidity:45, wind:10, desc:"Hot & Sunny",   icon:"☀️" },
  "Nandyal":      { temp:37, feels:41, rain:8,  humidity:48, wind:11, desc:"Sunny",         icon:"☀️" },
  "Ananthapuramu":{ temp:36, feels:40, rain:5,  humidity:42, wind:9,  desc:"Hot & Sunny",   icon:"🌞" },
  "Kadapa":       { temp:35, feels:39, rain:10, humidity:50, wind:10, desc:"Sunny",         icon:"☀️" },
  "YSR Kadapa":   { temp:35, feels:39, rain:10, humidity:50, wind:10, desc:"Sunny",         icon:"☀️" },
  "Chittoor":     { temp:34, feels:37, rain:20, humidity:60, wind:12, desc:"Partly Cloudy", icon:"⛅" },
  "Tirupati":     { temp:33, feels:36, rain:25, humidity:62, wind:13, desc:"Partly Cloudy", icon:"⛅" },
  "Prakasam":     { temp:35, feels:38, rain:15, humidity:55, wind:11, desc:"Sunny",         icon:"☀️" },
  "Sri Potti Sriramulu Nellore":{ temp:33, feels:36, rain:20, humidity:65, wind:15, desc:"Partly Cloudy", icon:"⛅" },
  // ── Telangana ──
  "Hyderabad":    { temp:32, feels:35, rain:30, humidity:62, wind:18, desc:"Partly Cloudy", icon:"⛅" },
  "Rangareddy":   { temp:31, feels:34, rain:35, humidity:64, wind:16, desc:"Partly Cloudy", icon:"⛅" },
  "Medchal-Malkajgiri":{ temp:31, feels:34, rain:35, humidity:63, wind:16, desc:"Partly Cloudy", icon:"⛅" },
  "Warangal":     { temp:33, feels:36, rain:25, humidity:58, wind:14, desc:"Partly Cloudy", icon:"⛅" },
  "Hanamkonda":   { temp:33, feels:36, rain:25, humidity:58, wind:14, desc:"Partly Cloudy", icon:"⛅" },
  "Karimnagar":   { temp:32, feels:35, rain:30, humidity:60, wind:15, desc:"Cloudy",        icon:"🌤" },
  "Nizamabad":    { temp:31, feels:34, rain:35, humidity:65, wind:16, desc:"Cloudy",        icon:"🌤" },
  "Khammam":      { temp:32, feels:35, rain:40, humidity:68, wind:17, desc:"Cloudy",        icon:"🌤" },
  "Nalgonda":     { temp:33, feels:36, rain:25, humidity:60, wind:14, desc:"Partly Cloudy", icon:"⛅" },
  "Adilabad":     { temp:30, feels:33, rain:45, humidity:72, wind:18, desc:"Cloudy",        icon:"🌤" },
  "Mahabubnagar": { temp:34, feels:37, rain:15, humidity:55, wind:12, desc:"Sunny",         icon:"☀️" },
  "Sangareddy":   { temp:31, feels:34, rain:32, humidity:63, wind:15, desc:"Partly Cloudy", icon:"⛅" },
  "Medak":        { temp:31, feels:34, rain:30, humidity:62, wind:14, desc:"Partly Cloudy", icon:"⛅" },
  // Default fallback
  "Default":      { temp:32, feels:35, rain:25, humidity:65, wind:14, desc:"Partly Cloudy", icon:"⛅" },
};

// ── Context-aware farming tip ──
// Returns a one-line advisory based on rain chance, temperature and current language.
function farmingTip(rain, temp, lang) {
  const TE = lang === 'TE';
  if (rain > 70) return TE
    ? '⚠️ భారీ వర్షం అంచనా — ఈ రోజు పొలంలో పిచికారీ చేయవద్దు. పంట కోత వాయిదా వేయండి.'
    : '⚠️ Heavy rain expected — avoid spraying today. Postpone any harvesting activity.';
  if (rain > 40) return TE
    ? '🌦 మేఘావృత వాతావరణం — శిలీంద్ర వ్యాధులకు అనుకూలం. ఆకులు పరిశీలించండి.'
    : '🌦 Cloudy weather — watch for fungal diseases. Inspect leaves for early signs.';
  if (temp > 38) return TE
    ? '🌡 అత్యంత వేడి — పొద్దున్నే లేదా సాయంత్రం నీరు పెట్టండి. మొక్కలకు నీడ ఇవ్వండి.'
    : '🌡 Extreme heat — water your crops in early morning or evening. Protect seedlings from sun stress.';
  return TE
    ? '✅ మంచి వ్యవసాయ వాతావరణం — మందుల పిచికారీ మరియు ఎరువుల వేయడానికి అనుకూలం.'
    : '✅ Good farming weather — suitable for pesticide spraying and fertiliser application.';
}
