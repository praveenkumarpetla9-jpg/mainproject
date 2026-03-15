// ══════════════════════════════════════════
// data/schemesData.js
// SCHEMES_DB — All AP + Central agri schemes
// matchSchemes() — rule engine that filters
//   schemes by farmer profile (land, crop,
//   income, district, social category).
// typeColor() — badge color helper
// ══════════════════════════════════════════

const SCHEMES_DB = [
  {
    id:'pmkisan', name:'PM-KISAN', name_te:'పిఎం-కిసాన్',
    type:'Central', type_te:'కేంద్ర',
    benefit:6000, benefit_label:'₹6,000/year', benefit_label_te:'₹6,000/సంవత్సరం',
    desc_en:'₹2,000 every 4 months directly into farmer bank account. All small/marginal farmers qualify.',
    desc_te:'రైతు బ్యాంక్ ఖాతాలో ప్రతి 4 నెలలకు ₹2,000. చిన్న/మధ్యతరగతి రైతులందరికీ అర్హత.',
    apply:'pmkisan.gov.in', deadline:'Open year-round',
    docs_en:'Aadhaar, bank passbook, land records (Pattadar Passbook)',
    docs_te:'ఆధార్, బ్యాంక్ పాస్‌బుక్, భూ రికార్డులు',
    rules:{ maxLand:999, minLand:0, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Any'] }
  },
  {
    id:'pmfby', name:'PM Fasal Bima Yojana', name_te:'పిఎం ఫసల్ బీమా యోజన',
    type:'Central', type_te:'కేంద్ర',
    benefit:15000, benefit_label:'Up to ₹15,000/acre', benefit_label_te:'ఎకరాకు ₹15,000 వరకు',
    desc_en:'Crop insurance against flood, drought, hail, pest attack. Premium is only 1.5–2% of sum insured.',
    desc_te:'వరద, కరువు, పడగల దాడి నుండి పంట బీమా. ప్రీమియం కేవలం 1.5–2%.',
    apply:'pmfby.gov.in', deadline:'Within 2 weeks of sowing',
    docs_en:'Land records, bank account, Aadhaar, sowing certificate',
    docs_te:'భూ రికార్డులు, బ్యాంక్ ఖాతా, ఆధార్, విత్తన ధృవపత్రం',
    rules:{ maxLand:999, minLand:0, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Rice','Chilli','Groundnut','Cotton','Onion','Maize','Any'] }
  },
  {
    id:'kcc', name:'Kisan Credit Card (KCC)', name_te:'కిసాన్ క్రెడిట్ కార్డ్',
    type:'Central', type_te:'కేంద్ర',
    benefit:50000, benefit_label:'Credit up to ₹3 lakh @ 4%', benefit_label_te:'₹3 లక్షల వరకు 4% వడ్డీకి రుణం',
    desc_en:'Short-term crop loans at 4% interest. Up to ₹3 lakh without collateral. For all farm expenses.',
    desc_te:'4% వడ్డీకి స్వల్పకాలిక పంట రుణాలు. ₹3 లక్షల వరకు హామీ లేకుండా.',
    apply:'Any nationalised bank', deadline:'Open year-round',
    docs_en:'Land records, identity proof, 2 photographs, income certificate',
    docs_te:'భూ రికార్డులు, గుర్తింపు రుజువు, 2 ఫోటోలు',
    rules:{ maxLand:999, minLand:0, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Any'] }
  },
  {
    id:'rkvy', name:'RKVY Agri Infrastructure', name_te:'RKVY వ్యవసాయ మౌలిక సదుపాయాలు',
    type:'Central', type_te:'కేంద్ర',
    benefit:25000, benefit_label:'Grant up to ₹25,000', benefit_label_te:'₹25,000 వరకు గ్రాంట్',
    desc_en:'Subsidies for farm machinery, storage, irrigation infrastructure. 50% subsidy for small farmers.',
    desc_te:'వ్యవసాయ యంత్రాలు, నిల్వ, నీటిపారుదల మౌలిక సదుపాయాలకు సబ్సిడీలు. చిన్న రైతులకు 50% సబ్సిడీ.',
    apply:'agriculture.ap.gov.in', deadline:'Apply by March 31',
    docs_en:'Land records, bank account, project proposal',
    docs_te:'భూ రికార్డులు, బ్యాంక్ ఖాతా, ప్రాజెక్ట్ ప్రతిపాదన',
    rules:{ maxLand:10, minLand:0, incomeMax:200000, categories:['SC','ST','OBC','General'], crops:['Any'] }
  },
  {
    id:'sc_subsidy', name:'SC Farmer Special Subsidy (AP)', name_te:'SC రైతు ప్రత్యేక సబ్సిడీ (AP)',
    type:'State - AP', type_te:'రాష్ట్రం - AP',
    benefit:10000, benefit_label:'₹10,000 input subsidy', benefit_label_te:'₹10,000 ఇన్‌పుట్ సబ్సిడీ',
    desc_en:'AP state scheme for SC farmers. Subsidy on seeds, fertilisers, and pesticides. Apply at village secretariat.',
    desc_te:'SC రైతులకు AP రాష్ట్ర పథకం. విత్తనాలు, ఎరువులు, పురుగుమందులపై సబ్సిడీ.',
    apply:'Village Secretariat / meeseva.gov.in', deadline:'Kharif: May 31 | Rabi: Oct 31',
    docs_en:'SC caste certificate, land records, Aadhaar, bank account',
    docs_te:'SC కుల ధృవపత్రం, భూ రికార్డులు, ఆధార్',
    rules:{ maxLand:5, minLand:0, incomeMax:100000, categories:['SC'], crops:['Any'] }
  },
  {
    id:'st_subsidy', name:'ST Farmer Welfare Scheme (AP)', name_te:'ST రైతు సంక్షేమ పథకం (AP)',
    type:'State - AP', type_te:'రాష్ట్రం - AP',
    benefit:12000, benefit_label:'₹12,000 + free seeds', benefit_label_te:'₹12,000 + ఉచిత విత్తనాలు',
    desc_en:'Free seeds + ₹12,000 cash input support for ST tribal farmers. Priority allocation of irrigation water.',
    desc_te:'ST గిరిజన రైతులకు ఉచిత విత్తనాలు + ₹12,000 నగదు మద్దతు.',
    apply:'Tribal Welfare Department / Village Secretariat', deadline:'Before sowing season',
    docs_en:'ST caste certificate, land records, Aadhaar',
    docs_te:'ST కుల ధృవపత్రం, భూ రికార్డులు, ఆధార్',
    rules:{ maxLand:5, minLand:0, incomeMax:150000, categories:['ST'], crops:['Any'] }
  },
  {
    id:'drip_subsidy', name:'Micro Irrigation (Drip/Sprinkler) Subsidy', name_te:'సూక్ష్మ నీటిపారుదల సబ్సిడీ',
    type:'Central + AP', type_te:'కేంద్ర + AP',
    benefit:40000, benefit_label:'55–90% subsidy on drip system', benefit_label_te:'డ్రిప్ సిస్టమ్‌పై 55–90% సబ్సిడీ',
    desc_en:'55% subsidy for general farmers, 90% for SC/ST. Covers drip irrigation and sprinkler systems installation.',
    desc_te:'సాధారణ రైతులకు 55% సబ్సిడీ, SC/ST కి 90%. డ్రిప్ మరియు స్ప్రింక్లర్ వ్యవస్థ స్థాపనకు.',
    apply:'agriculture.ap.gov.in / PMKSY portal', deadline:'Apply before installation',
    docs_en:'Land records, Aadhaar, bank account, quotation from vendor',
    docs_te:'భూ రికార్డులు, ఆధార్, బ్యాంక్ ఖాతా, వెండర్ కోటేషన్',
    rules:{ maxLand:999, minLand:0.5, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Any'] }
  },
  {
    id:'rythu_bharosa', name:'YSR Rythu Bharosa (AP)', name_te:'వైఎస్ఆర్ రైతు భరోసా',
    type:'State - AP', type_te:'రాష్ట్రం - AP',
    benefit:13500, benefit_label:'₹13,500/year + free insurance', benefit_label_te:'₹13,500/సంవత్సరం + ఉచిత బీమా',
    desc_en:'AP state scheme. ₹7,500 input support + ₹6,000 from PM-KISAN = ₹13,500 total. Plus free crop insurance.',
    desc_te:'AP రాష్ట్ర పథకం. ₹7,500 ఇన్‌పుట్ సహాయం + PM-KISAN నుండి ₹6,000 = మొత్తం ₹13,500.',
    apply:'meeseva.gov.in / Village Secretariat', deadline:'Open year-round for registered farmers',
    docs_en:'Pattadar Passbook, Aadhaar, bank account linked to Aadhaar',
    docs_te:'పట్టాదార్ పాస్‌బుక్, ఆధార్, ఆధార్‌తో అనుసంధానించిన బ్యాంక్ ఖాతా',
    rules:{ maxLand:999, minLand:0, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Any'] }
  },
  {
    id:'chilli_board', name:'Spices Board Chilli Development Scheme', name_te:'మసాలా బోర్డ్ మిర్చి అభివృద్ధి పథకం',
    type:'Central', type_te:'కేంద్ర',
    benefit:8000, benefit_label:'₹8,000/acre grant', benefit_label_te:'ఎకరాకు ₹8,000 గ్రాంట్',
    desc_en:'Grant for Guntur chilli farmers. Supports quality seeds, certified inputs. Export promotion scheme.',
    desc_te:'గుంటూరు మిర్చి రైతులకు గ్రాంట్. నాణ్యమైన విత్తనాలు, ధృవీకరించిన ఇన్‌పుట్‌లకు మద్దతు.',
    apply:'spicesboard.gov.in', deadline:'Before Kharif season',
    docs_en:'Land records, Aadhaar, bank account, previous crop details',
    docs_te:'భూ రికార్డులు, ఆధార్, బ్యాంక్ ఖాతా',
    rules:{ maxLand:999, minLand:0.5, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Chilli'] }
  },
  {
    id:'oilseeds', name:'National Food Security Mission — Oilseeds', name_te:'జాతీయ ఆహార భద్రత మిషన్ — నూనె పంటలు',
    type:'Central', type_te:'కేంద్ర',
    benefit:5000, benefit_label:'₹5,000 input subsidy', benefit_label_te:'₹5,000 ఇన్‌పుట్ సబ్సిడీ',
    desc_en:'Subsidy for groundnut, sunflower farmers. Free high-yielding variety seeds + subsidised fertilisers.',
    desc_te:'వేరుశెనగ, సూర్యకాంతి రైతులకు సబ్సిడీ. ఉచిత అధిక దిగుబడి రకాల విత్తనాలు.',
    apply:'agriculture.ap.gov.in', deadline:'Before sowing',
    docs_en:'Land records, bank account, Aadhaar',
    docs_te:'భూ రికార్డులు, బ్యాంక్ ఖాతా, ఆధార్',
    rules:{ maxLand:999, minLand:0, incomeMax:999999, categories:['SC','ST','OBC','General'], crops:['Groundnut','Sunflower'] }
  },
];

// ── Eligibility engine ──
// Filters SCHEMES_DB to schemes the farmer qualifies for,
// then sorts by benefit amount (highest first).
function matchSchemes(land, crop, income, district, category) {
  const landNum   = parseFloat(land)  || 1;
  const incomeNum = parseInt(income)  || 75000;
  return SCHEMES_DB
    .filter(s => {
      const r = s.rules;
      return (
        landNum   >= r.minLand    &&
        landNum   <= r.maxLand    &&
        incomeNum <= r.incomeMax  &&
        r.categories.includes(category) &&
        (r.crops.includes('Any') || r.crops.includes(crop))
      );
    })
    .sort((a, b) => b.benefit - a.benefit);
}

// ── Badge colour by scheme type ──
function typeColor(type) {
  if (type.includes('Central'))     return { bg:'var(--blue-l)',   col:'var(--blue-d)'   };
  if (type.includes('AP'))          return { bg:'var(--green-l)',  col:'var(--green-d)'  };
  if (type.includes('Telangana'))   return { bg:'var(--purple-l)', col:'var(--purple-d)' };
  return                                   { bg:'var(--bg)',        col:'var(--muted)'    };
}
