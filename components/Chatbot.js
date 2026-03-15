// ══════════════════════════════════════════
// components/Chatbot.js
// Floating AI farming assistant bubble.
// Visible on every page (rendered in App).
//
// Depends on: API, WEATHER_DATA (globals)
// Props: lang — 'EN' | 'TE'
// ══════════════════════════════════════════


// ── District name aliases ─────────────────
// Maps common spoken names / partial matches
// to the exact key used in WEATHER_DATA.
const DISTRICT_ALIASES = {
  // Andhra Pradesh
  'palnadu':        'Palnadu',
  'guntur':         'Guntur',
  'bapatla':        'Bapatla',
  'ntr':            'NTR',
  'vijayawada':     'NTR',
  'krishna':        'Krishna',
  'eluru':          'Eluru',
  'east godavari':  'East Godavari',
  'east god':       'East Godavari',
  'rajahmundry':    'East Godavari',
  'west godavari':  'West Godavari',
  'west god':       'West Godavari',
  'bhimavaram':     'West Godavari',
  'kakinada':       'Kakinada',
  'konaseema':      'Dr. B.R. Ambedkar Konaseema',
  'anakapalli':     'Anakapalli',
  'visakhapatnam':  'Visakhapatnam',
  'vizag':          'Visakhapatnam',
  'vizianagaram':   'Vizianagaram',
  'srikakulam':     'Srikakulam',
  'kurnool':        'Kurnool',
  'nandyal':        'Nandyal',
  'ananthapuramu':  'Ananthapuramu',
  'anantapur':      'Ananthapuramu',
  'sri balaji':     'Sri Balaji',
  'tirupati':       'Tirupati',
  'kadapa':         'Kadapa',
  'ysr kadapa':     'YSR Kadapa',
  'chittoor':       'Chittoor',
  'prakasam':       'Prakasam',
  'ongole':         'Prakasam',
  'nellore':        'Sri Potti Sriramulu Nellore',
  'palnadu':        'Palnadu',
  // Telangana
  'hyderabad':      'Hyderabad',
  'hyd':            'Hyderabad',
  'rangareddy':     'Rangareddy',
  'medchal':        'Medchal-Malkajgiri',
  'sangareddy':     'Sangareddy',
  'medak':          'Medak',
  'siddipet':       'Siddipet',
  'karimnagar':     'Karimnagar',
  'jagtial':        'Jagtial',
  'peddapalli':     'Peddapalli',
  'mancherial':     'Mancherial',
  'adilabad':       'Adilabad',
  'nirmal':         'Nirmal',
  'nizamabad':      'Nizamabad',
  'kamareddy':      'Kamareddy',
  'hanamkonda':     'Hanamkonda',
  'warangal':       'Warangal',
  'jangaon':        'Jangaon',
  'yadadri':        'Yadadri Bhuvanagiri',
  'nalgonda':       'Nalgonda',
  'suryapet':       'Suryapet',
  'khammam':        'Khammam',
  'bhadradri':      'Bhadradri Kothagudem',
  'kothagudem':     'Bhadradri Kothagudem',
  'mahabubabad':    'Mahabubabad',
  'mulugu':         'Mulugu',
  'jayashankar':    'Jayashankar Bhupalpally',
  'mahabubnagar':   'Mahabubnagar',
  'nagarkurnool':   'Nagarkurnool',
  'wanaparthy':     'Wanaparthy',
  'gadwal':         'Jogulamba Gadwal',
  'narayanpet':     'Narayanpet',
  'vikarabad':      'Vikarabad',
};

// Find which district (if any) the user mentioned
function detectDistrict(ql) {
  for (const [alias, canonical] of Object.entries(DISTRICT_ALIASES)) {
    if (ql.includes(alias)) return canonical;
  }
  return null;
}

// Build a weather answer for a specific district
function weatherAnswer(district, lang) {
  const TE = lang === 'TE';
  const w = WEATHER_DATA[district] || WEATHER_DATA['Default'];
  const rainTip = w.rain > 60
    ? (TE ? 'ఈ రోజు పొలంలో పిచికారీ చేయవద్దు — వర్షం అంచనా అధికంగా ఉంది.' : 'Avoid spraying today — high rain chance. Wait for clear weather.')
    : w.rain > 30
    ? (TE ? 'మేఘావృత వాతావరణం — శిలీంద్ర వ్యాధులకు జాగ్రత్త.' : 'Cloudy — watch for fungal disease outbreaks on leaves.')
    : w.temp > 38
    ? (TE ? 'అత్యంత వేడి — పొద్దున్నే లేదా సాయంత్రం నీరు పెట్టండి.' : 'Extreme heat — water crops in early morning or evening only.')
    : (TE ? 'వ్యవసాయ పనులకు అనుకూలమైన వాతావరణం.' : 'Good conditions for farming activities today.');

  if (TE) {
    return `${district}లో నేటి వాతావరణం: ${w.icon} ${w.temp}°C (అనుభూతి ${w.feels}°C), వర్షం అంచనా ${w.rain}%, తేమ ${w.humidity}%, గాలి వేగం ${w.wind} km/h. ${w.desc}. 🌱 ${rainTip}`;
  }
  return `${district} weather today: ${w.icon} ${w.temp}°C (feels ${w.feels}°C), ${w.rain}% rain chance, ${w.humidity}% humidity, wind ${w.wind} km/h. ${w.desc}. 🌱 Tip: ${rainTip}`;
}

// ── farmingAnswer ──────────────────────────
// Smart rule engine. Covers 20+ topic areas.
// Returns a specific, useful answer for almost
// any farming question — not just 7 keywords.
function farmingAnswer(q, lang) {
  const TE = lang === 'TE';
  const ql = q.toLowerCase();

  // ── 1. Weather queries — detect district first ──
  if (/weather|rain|temp|climate|వాతావరణం|వర్షం|ఉష్ణోగ్రత|forecast|humidity/.test(ql)) {
    const district = detectDistrict(ql);
    if (district) return weatherAnswer(district, lang);
    // Generic weather tip if no district named
    return TE
      ? 'మీ జిల్లా పేరు చెప్పండి — ఉదా. "గుంటూరు వాతావరణం" — నేటి ఖచ్చితమైన వాతావరణం మరియు వ్యవసాయ సలహా ఇస్తాను.'
      : 'Tell me your district — e.g. "Guntur weather" — and I\'ll give you today\'s exact weather and farming advice.';
  }

  // ── 2. Best crop / what to grow queries ──
  if (/best crop|which crop|what.*grow|what.*plant|what.*sow|grow.*district|పంట.*ఏది|ఏ పంట|ఏది సాగు/.test(ql)) {
    const district = detectDistrict(ql);
    const cropMap = {
      'Guntur':'Chilli 🌶️', 'Kurnool':'Groundnut 🥜', 'Nandyal':'Groundnut 🥜',
      'Ananthapuramu':'Groundnut 🥜', 'Krishna':'Rice 🌾', 'NTR':'Rice 🌾',
      'East Godavari':'Rice 🌾', 'West Godavari':'Rice 🌾', 'Khammam':'Cotton 🪡',
      'Warangal':'Cotton 🪡', 'Hanamkonda':'Cotton 🪡', 'Nizamabad':'Maize 🌽',
      'Karimnagar':'Rice 🌾', 'Nalgonda':'Rice 🌾', 'Prakasam':'Cotton 🪡',
      'Palnadu':'Rice 🌾', 'Kadapa':'Groundnut 🥜',
    };
    if (district && cropMap[district]) {
      return TE
        ? `${district}కు అత్యుత్తమ పంట: ${cropMap[district]}. మట్టి, నీటిపారుదల, సీజన్ ఆధారంగా సిఫార్సు కోసం 🌱 Crop Recommendation పేజీ ఉపయోగించండి.`
        : `Best crop for ${district}: ${cropMap[district]}. For a personalised recommendation based on your soil, irrigation and season, use the 🌱 Crop Recommendation page.`;
    }
    return TE
      ? 'మీ జిల్లా, నేల రకం మరియు సీజన్ ఆధారంగా పంట సిఫార్సు కోసం 🌱 Crop Recommendation పేజీ ఉపయోగించండి. ఇది మీకు అగ్ర 3 పంటలు మరియు అంచనా లాభాన్ని చూపిస్తుంది.'
      : 'Use the 🌱 Crop Recommendation page — enter your district, soil type and season to get the top 3 crops with estimated profit for your farm.';
  }

  // ── 3. Chilli sowing ──
  if (/chilli|mirchi|మిర్చి/.test(ql) && /sow|plant|when|ఎప్పుడు|విత్తన|నాటు/.test(ql)) {
    return TE
      ? 'మిర్చి విత్తనాలు జూన్–జూలైలో (ఖరీఫ్) వేయాలి. నర్సరీ బెడ్‌లు తయారు చేసి 30–35 రోజుల తర్వాత మొక్కలు నాటండి. HPS 1/BG రకాలు ఉపయోగించండి. గుంటూరు జిల్లాలో అత్యుత్తమ దిగుబడి వస్తుంది.'
      : 'Sow chilli in June–July (Kharif). Prepare nursery beds, transplant after 30–35 days when seedlings are 15cm. Use certified HPS 1/BG varieties. Guntur district gives the best yield for chilli in AP.';
  }

  // ── 4. Chilli disease/pest ──
  if (/chilli|mirchi|మిర్చి/.test(ql) && /diseas|pest|bug|వ్యాధి|పురుగు|thrip|mite|whitefly/.test(ql)) {
    return TE
      ? 'మిర్చి సాధారణ సమస్యలు: థ్రిప్స్ — స్పినోసాడ్ 0.3mL/L; మైట్‌లు — అబమెక్టిన్ 0.5mL/L; వైట్‌ఫ్లై — ఇమిడాక్లోప్రిడ్ 0.5mL/L. ఉదయం పిచికారీ చేయండి. మేఘావృత వాతావరణంలో పిచికారీ చేయవద్దు.'
      : 'Common chilli pests: Thrips — spray Spinosad 0.3mL/L; Mites — Abamectin 0.5mL/L; Whitefly — Imidacloprid 0.5mL/L. Always spray in early morning. Avoid spraying on cloudy or rainy days.';
  }

  // ── 5. Rice / paddy water/irrigation ──
  if (/rice|paddy|వరి/.test(ql) && /water|irrig|నీరు|నీటి/.test(ql)) {
    return TE
      ? 'వరి పంటకు సీజన్‌కు 1200–1500mm నీరు అవసరం. నాటిన తర్వాత 5cm నీరు ఉంచండి. పంటి దశలో నీటి లేమి ఉండకూడదు. కోత 10 రోజుల ముందు నీరు తీసివేయండి — ఇది గింజ నాణ్యత మెరుగుపరుస్తుంది.'
      : 'Rice needs 1200–1500mm per season. Keep 5cm standing water after transplanting. Never let fields dry during tillering stage. Drain 10 days before harvest for better grain quality and easier harvesting.';
  }

  // ── 6. Rice disease ──
  if (/rice|paddy|వరి/.test(ql) && /diseas|blast|blight|pest|వ్యాధి|పురుగు/.test(ql)) {
    return TE
      ? 'వరి సాధారణ వ్యాధులు: బ్లాస్ట్ — ట్రైసైక్లాజోల్ 0.6g/L; బ్రౌన్ ప్లాంట్‌హాపర్ — బుప్రోఫెజిన్ 1.5mL/L; స్టెమ్ బోరర్ — కార్టాప్ హైడ్రోక్లోరైడ్ 1g/L. 🌿 Disease Detector పేజీలో ఆకు ఫోటో అప్‌లోడ్ చేయండి — AI వెంటనే నిర్ధారిస్తుంది.'
      : 'Common rice diseases: Blast — spray Tricyclazole 0.6g/L; Brown Planthopper — Buprofezin 1.5mL/L; Stem Borer — Cartap Hydrochloride 1g/L. For accurate diagnosis, upload a leaf photo to the 🌿 Disease Detector page.';
  }

  // ── 7. Cotton pest ──
  if (/cotton|పత్తి/.test(ql) && /pest|bollworm|bug|పురుగు|బోల్/.test(ql)) {
    return TE
      ? 'కాటన్ బోల్‌వర్మ్‌కు: ఎమామెక్టిన్ బెంజోయేట్ 5% @ 0.4g/L వేయండి. ఫెరోమోన్ ట్రాప్‌లు (5/ఎకరం) పెట్టండి. వైట్‌ఫ్లైకి: ఇమిడాక్లోప్రిడ్ 0.5mL/L. పురుగుమందులు మార్చి వేయండి — రెసిస్టెన్స్ నివారణకు.'
      : 'For cotton bollworm: Apply Emamectin benzoate 5% @ 0.4g/L. Use pheromone traps (5 per acre). For whitefly: Imidacloprid 0.5mL/L. Rotate insecticides to prevent resistance. Spray in early morning.';
  }

  // ── 8. Groundnut ──
  if (/groundnut|వేరుశెనగ|peanut/.test(ql)) {
    if (/diseas|pest|వ్యాధి|పురుగు/.test(ql)) {
      return TE
        ? 'వేరుశెనగ వ్యాధులు: టిక్కా లీఫ్ స్పాట్ — మాంకోజెబ్ 2g/L; కాలర్ రాట్ — ట్రైకోడర్మ విత్తన చికిత్స; లీఫ్ మైనర్ — క్లోర్‌పైరిఫాస్ 2mL/L. 🌿 Disease Detector లో ఫోటో అప్‌లోడ్ చేయండి.'
        : 'Groundnut diseases: Tikka leaf spot — spray Mancozeb 2g/L; Collar rot — use Trichoderma seed treatment 4g/kg; Leaf miner — Chlorpyriphos 2mL/L. Upload a photo to the 🌿 Disease Detector for exact diagnosis.';
    }
    return TE
      ? 'వేరుశెనగ కర్నూలు, నంద్యాల, అనంతపురం, కడప జిల్లాలలో అత్యుత్తమంగా పెరుగుతుంది. ఇసుక లేదా ఎర్ర నేలలకు అనుకూలం. తక్కువ నీటిపారుదలతో పని చేస్తుంది. ఖరీఫ్ మరియు రబీ రెండు సీజన్లలో సాగు చేయవచ్చు.'
      : 'Groundnut grows best in Kurnool, Nandyal, Ananthapuramu and Kadapa. Suited to sandy or red soil. Low water requirement — ideal for rain-fed farming. Can be grown in both Kharif and Rabi seasons.';
  }

  // ── 9. Fertiliser / manure ──
  if (/fertil|manure|npk|ఎరువు|నత్రజని|పొటాష్|urea/.test(ql)) {
    if (/sandy|ఇసుక/.test(ql)) {
      return TE
        ? 'ఇసుక నేలకు ఎరువులు 3 విడతలుగా వేయండి. FYM 5 టన్నులు/ఎకరం వేయండి. ఒకేసారి వేస్తే పోషకాలు కొట్టుకుపోతాయి. బేసల్ డోస్‌లో 50%, 30 రోజులకు 30%, 60 రోజులకు 20% వేయండి.'
        : 'For sandy soil: split NPK into 3 doses — 50% as basal, 30% at 30 days, 20% at 60 days. Sandy soil loses nutrients quickly. Add FYM 5 tonnes/acre before sowing to improve water retention.';
    }
    if (/rice|paddy|వరి/.test(ql)) {
      return TE
        ? 'వరికి: ఎకరాకు 40kg నత్రజని, 20kg భాస్వరం, 20kg పొటాష్. నత్రజనిని 3 విడతలు: నాటే సమయం, 25 రోజులు, 45 రోజులు. జింక్ సల్ఫేట్ 10kg/ఎకరం వేయండి — దిగుబడి పెరుగుతుంది.'
        : 'Rice fertiliser: 40kg N + 20kg P + 20kg K per acre. Split nitrogen 3 times: at transplanting, 25 days, 45 days. Apply Zinc Sulphate 10kg/acre — significantly improves grain yield.';
    }
    return TE
      ? 'సాధారణంగా: నాటే ముందు ఎకరాకు 40:20:20 NPK వేయండి. FYM లేదా వర్మీకంపోస్ట్ 2 టన్నులు వేయండి. నేల పరీక్ష చేయించి ఖచ్చితమైన డోస్ తెలుసుకోండి — దగ్గరలోని వ్యవసాయ కార్యాలయం వద్ద నేల పరీక్ష ఉచితంగా చేస్తారు.'
      : 'General dose: apply 40:20:20 NPK per acre before sowing. Add FYM or vermicompost 2 tonnes/acre. Get a soil test done at your nearest agriculture office (usually free) for exact recommendations.';
  }

  // ── 10. Soil types ──
  if (/soil|నేల|black soil|red soil|నల్ల నేల|ఎర్ర నేల/.test(ql)) {
    if (/black|నల్ల/.test(ql)) {
      return TE
        ? 'నల్ల నేల (రేగడ నేల) పత్తి, జొన్న, మొక్కజొన్న, సోయాబీన్‌కు అనుకూలం. నీటిని బాగా నిల్వ చేస్తుంది. ఖమ్మం, వరంగల్, హనుమకొండ జిల్లాలలో ఎక్కువగా కనిపిస్తుంది.'
        : 'Black (regur) soil is best for cotton, sorghum, maize and soybean. It retains moisture well. Common in Khammam, Warangal, Hanamkonda. Avoid waterlogging — poor drainage can cause root rot.';
    }
    if (/red|ఎర్ర/.test(ql)) {
      return TE
        ? 'ఎర్ర నేల వేరుశెనగ, మిర్చి, రాగి, పప్పు దినుసులకు అనుకూలం. నీరు త్వరగా ఇంకిపోతుంది — పదే పదే నీరు పెట్టాలి. FYM 5 టన్నులు/ఎకరం వేస్తే నేల మెరుగుపడుతుంది.'
        : 'Red soil is ideal for groundnut, chilli, finger millet and pulses. Well-drained but low moisture retention — needs more frequent irrigation. Adding FYM 5t/acre significantly improves its quality.';
    }
    return TE
      ? 'AP & తెలంగాణలో 5 ప్రధాన నేల రకాలు: నల్ల (పత్తి), ఎర్ర (వేరుశెనగ), లోమీ (వరి, మిర్చి), ఇసుక (వేరుశెనగ, జొన్న), బంకమట్టి (వరి). మీ నేల రకానికి అనుకూలమైన పంట కోసం 🌱 Crop Recommendation ఉపయోగించండి.'
      : 'AP & Telangana has 5 main soil types: Black (cotton), Red (groundnut), Loamy (rice/chilli), Sandy (groundnut/sorghum), Clay (rice). Use 🌱 Crop Recommendation to find the best crop for your exact soil type.';
  }

  // ── 11. Mandi / market price ──
  if (/price|mandi|market|rate|ధర|మండీ|మార్కెట్/.test(ql)) {
    const cropPrices = { rice:2025, chilli:11900, groundnut:5910, cotton:7180, onion:3080, maize:1850 };
    const mentioned = Object.keys(cropPrices).find(c => ql.includes(c) || ql.includes(c === 'rice' ? 'paddy' : c));
    if (mentioned) {
      return TE
        ? `నేడు ${mentioned} ధర సుమారు ₹${cropPrices[mentioned].toLocaleString('en-IN')}/క్వింటాల్ (గుంటూరు బేస్). మీ జిల్లాలో ఖచ్చితమైన ధర మరియు 15 రోజుల అంచనా కోసం 📈 Prices పేజీ చూడండి.`
        : `Today's ${mentioned} price is approx ₹${cropPrices[mentioned].toLocaleString('en-IN')}/quintal (Guntur base). For your district's exact price and 15-day forecast, check the 📈 Prices page.`;
    }
    return TE
      ? 'నేటి ప్రధాన ధరలు: వరి ₹2,025 | మిర్చి ₹11,900 | వేరుశెనగ ₹5,910 | పత్తి ₹7,180 | ఉల్లిపాయ ₹3,080 (క్వింటాల్‌కు). జిల్లా వారీగా ధర మరియు అంచనా కోసం 📈 Prices పేజీ చూడండి.'
      : 'Today\'s prices: Rice ₹2,025 | Chilli ₹11,900 | Groundnut ₹5,910 | Cotton ₹7,180 | Onion ₹3,080 per quintal. Visit the 📈 Prices page for district-wise prices and 15-day forecast.';
  }

  // ── 12. Government schemes ──
  if (/scheme|subsid|kisan|yojana|pmfby|insurance|పథకం|సబ్సిడీ|బీమా/.test(ql)) {
    if (/insurance|pmfby|బీమా/.test(ql)) {
      return TE
        ? 'PM Fasal Bima Yojana (PMFBY): వరద, కరువు, పడగల దాడికి పంట బీమా. ప్రీమియం కేవలం 1.5–2%. దరఖాస్తు: pmfby.gov.in. విత్తిన 2 వారాల్లో దరఖాస్తు చేయాలి. 🛡️ Insurance పేజీలో AI నష్టం అంచనా మరియు PDF క్లెయిమ్ జనరేటర్ ఉంది.'
        : 'PM Fasal Bima Yojana (PMFBY): covers flood, drought, hail damage. Premium only 1.5–2% of sum insured. Apply at pmfby.gov.in within 2 weeks of sowing. Use the 🛡️ Insurance page to assess damage with AI and generate a claim PDF.';
    }
    if (/kisan|pm-kisan/.test(ql)) {
      return TE
        ? 'PM-KISAN: సంవత్సరానికి ₹6,000 (4 నెలలకు ₹2,000) అన్ని చిన్న/మధ్యతరగతి రైతులకు. దరఖాస్తు: pmkisan.gov.in లేదా దగ్గరలోని CSC. అవసరం: ఆధార్, బ్యాంక్ ఖాతా, భూ రికార్డులు.'
        : 'PM-KISAN gives ₹6,000/year (₹2,000 every 4 months) to all small/marginal farmers. Apply at pmkisan.gov.in or nearest CSC. Need: Aadhaar, bank account linked to Aadhaar, and land records (Pattadar Passbook).';
    }
    if (/drip|irrigat|నీటిపారుదల/.test(ql)) {
      return TE
        ? 'మైక్రో ఇరిగేషన్ సబ్సిడీ (PMKSY): జనరల్ రైతులకు 55%, SC/ST కి 90% సబ్సిడీ. దరఖాస్తు: agriculture.ap.gov.in లేదా pmksy.gov.in. వ్యవసాయ శాఖ కార్యాలయంలో కూడా దరఖాస్తు చేయవచ్చు.'
        : 'Micro Irrigation subsidy (PMKSY): 55% for general farmers, 90% for SC/ST. Apply at agriculture.ap.gov.in or pmksy.gov.in or your nearest agriculture department office before installation.';
    }
    return TE
      ? 'మీ అర్హత ఆధారంగా పథకాలు తెలుసుకోవడానికి 📋 Schemes పేజీ ఉపయోగించండి. ప్రధాన పథకాలు: PM-KISAN (₹6,000/సం), PMFBY బీమా, KCC రుణం @ 4%, RKVY గ్రాంట్, Rythu Bharosa (₹13,500/సం AP).'
      : 'Use the 📋 Schemes page to find schemes based on your profile. Key schemes: PM-KISAN (₹6,000/yr), PMFBY crop insurance, KCC loan @ 4%, RKVY grants, YSR Rythu Bharosa (₹13,500/yr — AP only).';
  }

  // ── 13. Disease detection ──
  if (/diseas|leaf|spot|blight|rot|wilt|yellow|వ్యాధి|ఆకు|మచ్చ|కుళ్ళు/.test(ql)) {
    return TE
      ? 'పంట వ్యాధి గుర్తింపు కోసం 🌿 Disease Detector పేజీ ఉపయోగించండి — ఆకు ఫోటో అప్‌లోడ్ చేయండి, AI 3 సెకన్లలో వ్యాధి గుర్తించి తెలుగులో చికిత్స చెప్తుంది. మీరు ఫోటో తీయలేకపోతే, లక్షణాలు వివరించండి — నేను సహాయం చేస్తాను.'
      : 'For disease identification, use the 🌿 Disease Detector — upload a leaf photo and AI will diagnose in 3 seconds with treatment in Telugu and English. If you can\'t upload a photo, describe the symptoms here and I\'ll help.';
  }

  // ── 14. Sowing season ──
  if (/sow|plant|seed|when.*grow|season|kharif|rabi|విత్తు|నాటు|సీజన్|ఖరీఫ్|రబీ/.test(ql)) {
    return TE
      ? 'ప్రధాన పంట సీజన్లు — ఖరీఫ్ (జూన్–నవంబర్): వరి, మిర్చి, పత్తి, మొక్కజొన్న. రబీ (నవంబర్–మార్చి): వేరుశెనగ, ఉల్లిపాయ, సూర్యకాంతి. మీ జిల్లా మరియు నేల రకాన్ని బట్టి 🌱 Crop Recommendation పేజీలో ఖచ్చితమైన సమయం తెలుసుకోండి.'
      : 'Main seasons — Kharif (June–Nov): Rice, Chilli, Cotton, Maize. Rabi (Nov–Mar): Groundnut, Onion, Sunflower, Wheat. For exact sowing dates and best variety for your district and soil, use the 🌱 Crop Recommendation page.';
  }

  // ── 15. Irrigation / water ──
  if (/irrig|drip|sprinkler|canal|bore|నీటిపారుదల|డ్రిప్|కాలువ|బావి/.test(ql)) {
    return TE
      ? 'నీటిపారుదల చిట్కాలు: డ్రిప్ ఇరిగేషన్ 50% నీటి ఆదా చేస్తుంది — PMKSY లో 55–90% సబ్సిడీ అందుబాటులో ఉంది. స్ప్రింక్లర్ చిన్న పంటలకు అనుకూలం. వేసవిలో ఉదయం లేదా సాయంత్రం మాత్రమే నీరు పెట్టండి — మధ్యాహ్నం నీరు పెట్టవద్దు.'
      : 'Irrigation tips: Drip irrigation saves 50% water — 55-90% subsidy available under PMKSY. Sprinklers work well for small crops. In summer, water only in early morning or evening — never midday as it causes leaf scorch.';
  }

  // ── 16. Pest map / outbreak ──
  if (/pest|outbreak|heatmap|పురుగు|వ్యాప్తి/.test(ql)) {
    return TE
      ? '🐛 Pest Map పేజీలో AP & తెలంగాణ అంతటా లైవ్ పురుగు వ్యాప్తి హీట్‌మ్యాప్ చూడవచ్చు. మీ జిల్లాలో పురుగు సమాచారం నివేదించవచ్చు — పొరుగు రైతులకు హెచ్చరిక వెళ్తుంది. 3+ నివేదికలు ఉంటే అవుట్‌బ్రేక్ అలర్ట్ వస్తుంది.'
      : 'Visit the 🐛 Pest Map page to see live pest outbreak heatmap across AP & Telangana. You can report a pest sighting in your district — it alerts nearby farmers. An outbreak alert triggers automatically when 3+ reports come from the same district.';
  }

  // ── 17. Insurance / damage claim ──
  if (/claim|damage|flood|cyclone|hail|క్లెయిమ్|నష్టం|వరద|తుఫాను/.test(ql)) {
    return TE
      ? '🛡️ Insurance పేజీ ఉపయోగించండి: పొలం ఫోటోలు అప్‌లోడ్ చేయండి → AI నష్టం శాతం అంచనా వేస్తుంది → PMFBY ఆటో-క్లెయిమ్ PDF జనరేట్ అవుతుంది. ఈ PDF ని CSC లేదా Mee Seva లో సమర్పించండి.'
      : 'Use the 🛡️ Insurance page: upload field photos → AI estimates damage % → auto-generates a PMFBY claim PDF. Take that PDF to your nearest CSC / Mee Seva centre to file the official claim.';
  }

  // ── 18. Hello / greeting ──
  if (/^(hi|hello|hey|నమస్కారం|నమస్తే|హలో)\b/.test(ql)) {
    return TE
      ? 'నమస్కారం! 🌾 నేను మీ వ్యవసాయ AI సహాయకుడిని. వాతావరణం, పంట ధరలు, వ్యాధి గుర్తింపు, ప్రభుత్వ పథకాలు — ఏదైనా అడగండి! ఉదా: "గుంటూరు వాతావరణం ఎలా ఉంది?" లేదా "మిర్చికి ఏ పురుగుమందు వేయాలి?"'
      : 'Hello! 🌾 I\'m your AI farming assistant. Ask me anything — weather, crop prices, disease treatment, govt schemes, best crops for your district. Try: "What is the weather in Guntur?" or "Which crop is best for Kurnool?"';
  }

  // ── 19. Thank you ──
  if (/thank|thanks|ధన్యవాదాలు|మంచిది/.test(ql)) {
    return TE
      ? 'మీకు స్వాగతం! 🌾 మరో సందేహం ఉంటే అడగండి. మీ పంట బాగా పెరగాలని కోరుకుంటున్నాను!'
      : 'You\'re welcome! 🌾 Ask me anything else — I\'m here to help your farm thrive!';
  }

  // ── 20. Location without context ──
  const onlyDistrict = detectDistrict(ql);
  if (onlyDistrict) {
    return weatherAnswer(onlyDistrict, lang) + (TE
      ? '\n\n💡 ఈ జిల్లాకు అత్యుత్తమ పంట, మండీ ధరలు లేదా ప్రభుత్వ పథకాల గురించి అడగవచ్చు.'
      : '\n\n💡 You can also ask me about the best crop, mandi prices or govt schemes for this district.');
  }

  // ── 21. Smart default — always helpful ──
  return TE
    ? '🌾 మీరు ఇలా అడగవచ్చు:\n• "గుంటూరు వాతావరణం ఎలా ఉంది?"\n• "మిర్చికి ఏ పురుగుమందు వేయాలి?"\n• "కర్నూలుకు అత్యుత్తమ పంట ఏది?"\n• "PM-KISAN కి ఎలా దరఖాస్తు చేయాలి?"\n• "పత్తి ధర ఎంత?"\nమీ ప్రశ్న మరింత వివరంగా అడగండి — నేను సహాయం చేస్తాను!'
    : '🌾 You can ask me things like:\n• "What is the weather in Palnadu?"\n• "Which pesticide for chilli thrips?"\n• "Best crop for Kurnool district?"\n• "How to apply for PM-KISAN?"\n• "What is today\'s cotton price?"\nAsk in Telugu or English — I\'ll do my best to help!';
}


// ── Chatbot component ──────────────────────
function Chatbot({ lang }) {
  const TE = lang === 'TE';

  const [open,   setOpen]   = useState(false);
  const [msgs,   setMsgs]   = useState([{
    role: 'bot',
    text: lang === 'TE'
      ? 'నమస్కారం! 🌾 నేను మీ వ్యవసాయ AI సహాయకుడిని. వాతావరణం, పంట ధరలు, వ్యాధి గుర్తింపు, ప్రభుత్వ పథకాలు — ఏదైనా అడగండి!'
      : "Hello! 🌾 I'm your AI farming assistant. Ask about weather, crop prices, diseases, govt schemes or the best crop for your district. I answer in Telugu or English!",
  }]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const msgsEndRef           = useRef(null);

  useEffect(() => {
    if (open) msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const SUGGESTIONS_EN = [
    'Weather in Guntur today?',
    'Best crop for Kurnool?',
    'Cotton price today?',
    'How to apply PM-KISAN?',
  ];
  const SUGGESTIONS_TE = [
    'గుంటూరు వాతావరణం ఎలా ఉంది?',
    'కర్నూలుకు అత్యుత్తమ పంట?',
    'నేడు పత్తి ధర ఎంత?',
    'PM-KISAN కి ఎలా దరఖాస్తు?',
  ];
  const SUGG = TE ? SUGGESTIONS_TE : SUGGESTIONS_EN;

  async function send(text) {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setTyping(true);

    try {
      const res = await fetch(API + '/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:  q,
          language: lang,
          system: 'You are KrishiDost, an expert agricultural assistant for Andhra Pradesh and Telangana farmers. Answer in ' + (lang === 'TE' ? 'Telugu' : 'English') + ' clearly and concisely. Focus on: crop diseases, fertilisers, pest control, sowing times, govt schemes, mandi prices, weather. Keep answers under 100 words. Be specific to AP/TS districts and crops.',
        }),
      });
      if (!res.ok) throw new Error('backend error');
      const data = await res.json();
      setMsgs(m => [...m, { role: 'bot', text: data.reply || data.content || farmingAnswer(q, lang) }]);
    } catch (_err) {
      await new Promise(r => setTimeout(r, 600));
      setMsgs(m => [...m, { role: 'bot', text: farmingAnswer(q, lang) }]);
    }

    setTyping(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      <button
        className={'chat-fab' + (open ? ' open' : '')}
        onClick={() => setOpen(o => !o)}
        title={TE ? 'వ్యవసాయ సహాయం' : 'Farming Assistant'}
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="chat-drawer">
          <div className="chat-head">
            <span style={{ fontSize: 24 }}>🌾</span>
            <div className="chat-head-info">
              <div className="chat-head-title">{TE ? 'వ్యవసాయ AI సహాయకుడు' : 'KrishiDost AI Assistant'}</div>
              <div className="chat-head-sub">{TE ? 'తెలుగు లేదా ఇంగ్లీష్‌లో అడగండి' : 'Ask in Telugu or English'}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          </div>

          <div className="chat-messages">
            {msgs.map((m, i) => (
              <div key={i} className={'chat-msg ' + m.role}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-msg bot typing">
                <span>{'⋯ '}</span>
                {TE ? 'సమాధానం టైప్ అవుతున్నది...' : 'Typing...'}
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>

          {msgs.length <= 2 && (
            <div className="chat-chips">
              {SUGG.map(s => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-foot">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={TE ? 'మీ ప్రశ్న టైప్ చేయండి...' : 'Type your farming question...'}
            />
            <button className="chat-send" onClick={() => send()}>{'➤'}</button>
          </div>
        </div>
      )}
    </>
  );
}
