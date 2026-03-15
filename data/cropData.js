// ══════════════════════════════════════════
// data/cropData.js
// CROP_DB  — per-crop metadata (soil, season,
//            irrigation needs, yield, profit)
// recommendCrops() — rule-based scoring
//   engine that simulates a Random Forest
//   recommendation. Returns top 3 crops.
// calcProfit() — profit estimate helper
// Translation maps for form labels
// ══════════════════════════════════════════

const CROP_DB = {
  Rice:      { emoji:'🌾', soil:['Loamy','Clay'],              seasons:['Kharif','Rabi'],       irrigation:'High',   avgYield:25,
    desc_en:'Staple crop. High demand year-round. Grows well in clay-loam soils with good water availability.',
    desc_te:'ప్రధాన పంట. వార్షిక అధిక డిమాండ్. మంచి నీటి లభ్యత గల నేలల్లో బాగా పెరుగుతుంది.' },
  Chilli:    { emoji:'🌶️', soil:['Loamy','Sandy','Red'],        seasons:['Kharif','Rabi'],       irrigation:'Medium', avgYield:12,
    desc_en:'AP speciality. Guntur chilli is globally famous. High value crop with strong export demand.',
    desc_te:'AP ప్రత్యేకత. గుంటూరు మిర్చి ప్రపంచ ప్రసిద్ధి. ఎగుమతి డిమాండ్ అధికంగా ఉంది.' },
  Groundnut: { emoji:'🥜', soil:['Sandy','Red','Loamy'],         seasons:['Kharif','Rabi'],       irrigation:'Low',    avgYield:15,
    desc_en:'Drought tolerant. Good for low-irrigation areas. Strong mandi demand in Kadapa and Kurnool.',
    desc_te:'కరువు తట్టుకుంటుంది. తక్కువ నీటిపారుదల ప్రాంతాలకు అనుకూలం.' },
  Cotton:    { emoji:'🪡', soil:['Black','Clay','Loamy'],         seasons:['Kharif'],              irrigation:'Medium', avgYield:8,
    desc_en:'High-value cash crop. Suited to black cotton soil. Good MSP support from government.',
    desc_te:'అధిక విలువ గల నగదు పంట. నల్ల నేలలకు అనుకూలం.' },
  Onion:     { emoji:'🧅', soil:['Sandy','Loamy','Red'],          seasons:['Rabi','Zaid'],         irrigation:'Medium', avgYield:200,
    desc_en:'High profit potential. Prices volatile but seasonal peaks give excellent returns.',
    desc_te:'అధిక లాభ సామర్థ్యం. ధరలు హెచ్చుతగ్గులు ఉన్నా కాలానుగుణ గరిష్ఠాలు అద్భుతమైన లాభాలు ఇస్తాయి.' },
  Maize:     { emoji:'🌽', soil:['Loamy','Sandy','Red'],          seasons:['Kharif','Rabi'],       irrigation:'Medium', avgYield:40,
    desc_en:'Versatile crop. Used for food, fodder, and starch. Growing demand from poultry industry in AP.',
    desc_te:'బహుముఖ పంట. ఆహారం, మేత మరియు పిండి పదార్థాలకు ఉపయోగిస్తారు.' },
  Sunflower: { emoji:'🌻', soil:['Loamy','Black','Sandy'],        seasons:['Rabi','Zaid'],         irrigation:'Low',    avgYield:10,
    desc_en:'Oilseed crop. Low water requirement. Good for summer season. Stable MSP.',
    desc_te:'నూనె పంట. తక్కువ నీటి అవసరం. వేసవి కాలానికి అనుకూలం.' },
  Sugarcane: { emoji:'🎋', soil:['Loamy','Clay','Black'],         seasons:['Annual'],              irrigation:'High',   avgYield:600,
    desc_en:'Long duration cash crop. High and stable returns. Best for farmers with assured water supply.',
    desc_te:'దీర్ఘకాలిక నగదు పంట. అధిక మరియు స్థిరమైన లాభాలు.' },
};

// ── Telugu translation maps for form dropdowns ──
const SOIL_TE   = { Loamy:'లోమీ', Sandy:'ఇసుక', Clay:'బంకమట్టి', Black:'నల్ల', Red:'ఎర్ర' };
const SEASON_TE = { Kharif:'ఖరీఫ్', Rabi:'రబీ', Zaid:'జాయిద్', Annual:'వార్షిక' };
const IRR_TE    = { High:'అధిక', Medium:'మధ్యస్థ', Low:'తక్కువ' };

// ── Recommendation engine ──
// Scores each crop by matching soil, season, irrigation, and district-specific bonuses.
// Returns top 3 sorted by score (highest first).
function recommendCrops(district, soilType, season, landSize, irrigation) {
  const scores = {};
  Object.entries(CROP_DB).forEach(([crop, data]) => {
    let score = 50;
    if (data.soil.includes(soilType))       score += 25;
    if (data.seasons.includes(season))      score += 20;
    if (irrigation === 'High'   && data.irrigation === 'High')   score += 15;
    if (irrigation === 'Medium' && data.irrigation === 'Medium') score += 15;
    if (irrigation === 'Low'    && data.irrigation === 'Low')    score += 15;
    if (irrigation === 'Low'    && data.irrigation === 'High')   score -= 20;

    // ── District-specific crop bonuses — AP ──
    if (district === 'Guntur'         && crop === 'Chilli')    score += 20;
    if (district === 'Bapatla'        && crop === 'Rice')      score += 15;
    if (district === 'Kurnool'        && crop === 'Groundnut') score += 20;
    if (district === 'Nandyal'        && crop === 'Groundnut') score += 15;
    if (district === 'Krishna'        && crop === 'Rice')      score += 20;
    if (district === 'NTR'            && crop === 'Rice')      score += 18;
    if (district === 'East Godavari'  && crop === 'Rice')      score += 18;
    if (district === 'West Godavari'  && crop === 'Rice')      score += 18;
    if (district === 'Kadapa'         && crop === 'Groundnut') score += 15;
    if (district === 'YSR Kadapa'     && crop === 'Groundnut') score += 15;
    if (district === 'Ananthapuramu'  && crop === 'Groundnut') score += 18;
    if (district === 'Ananthapuramu'  && crop === 'Sunflower') score += 15;
    if (district === 'Sri Potti Sriramulu Nellore' && crop === 'Rice') score += 15;
    if (district === 'Chittoor'       && crop === 'Sugarcane') score += 12;
    if (district === 'Tirupati'       && crop === 'Sugarcane') score += 12;
    if (district === 'Visakhapatnam'  && crop === 'Sugarcane') score += 10;
    if (district === 'Srikakulam'     && crop === 'Rice')      score += 14;
    if (district === 'Vizianagaram'   && crop === 'Rice')      score += 13;
    if (district === 'Prakasam'       && crop === 'Cotton')    score += 15;
    if (district === 'Kakinada'       && crop === 'Rice')      score += 16;

    // ── District-specific crop bonuses — Telangana ──
    if (district === 'Khammam'    && crop === 'Cotton')    score += 20;
    if (district === 'Warangal'   && crop === 'Cotton')    score += 18;
    if (district === 'Hanamkonda' && crop === 'Cotton')    score += 16;
    if (district === 'Karimnagar' && crop === 'Rice')      score += 15;
    if (district === 'Nalgonda'   && crop === 'Rice')      score += 15;
    if (district === 'Nizamabad'  && crop === 'Maize')     score += 18;
    if (district === 'Nizamabad'  && crop === 'Rice')      score += 12;
    if (district === 'Adilabad'   && crop === 'Maize')     score += 15;
    if (district === 'Mahabubnagar' && crop === 'Groundnut') score += 15;
    if (district === 'Nagarkurnool' && crop === 'Groundnut') score += 12;
    if (district === 'Suryapet'   && crop === 'Rice')      score += 14;
    if (district === 'Bhadradri Kothagudem' && crop === 'Rice') score += 14;
    if (district === 'Medak'      && crop === 'Maize')     score += 14;
    if (district === 'Sangareddy' && crop === 'Maize')     score += 12;

    // Slight randomness — simulates ML variance
    score += Math.floor(Math.sin(crop.length * 3.14) * 8);
    scores[crop] = Math.min(99, Math.max(55, score));
  });

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([crop, score]) => ({ crop, score, ...CROP_DB[crop] }));
}

// ── Profit estimate: avg yield × current mandi price × land size ──
function calcProfit(crop, acres) {
  const priceMap = { Rice:2025, Chilli:11900, Groundnut:5910, Cotton:7180, Onion:3080, Maize:1850, Sunflower:6200, Sugarcane:350 };
  const yieldMap = CROP_DB;
  const yieldPerAcre = yieldMap[crop]?.avgYield || 15;
  const price        = priceMap[crop] || 3000;
  return Math.round(yieldPerAcre * price * acres);
}

// ── Score colour and label helpers ──
const scoreColor = s => s >= 85 ? '#1D9E75' : s >= 70 ? '#EF9F27' : '#E24B4A';
const scoreLabel = s => s >= 85 ? '✓ Excellent' : s >= 70 ? '~ Good' : '↓ Fair';
