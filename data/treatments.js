// ══════════════════════════════════════════
// data/treatments.js
// TX — Disease treatment database.
// Each key maps a PlantVillage disease label
// to bilingual (EN + Telugu) treatment info.
// MOCK_D — fallback diagnoses for offline demo.
// ══════════════════════════════════════════

const TX = {
  // ── Tomato ──
  "Tomato___Early_blight": {
    n_en:"Early Blight", n_te:"అర్లీ బ్లైట్",
    c_en:"Tomato",       c_te:"టొమాటో", sc:"orange",
    r_en:"Apply Mancozeb 75% WP @ 2g per litre of water. Spray every 10 days. Remove all infected lower leaves immediately and burn them.",
    r_te:"మాంకోజెబ్ 75% WP @ 2గ్రా లీటరు నీటికి వేయండి. 10 రోజులకు ఒకసారి పిచికారీ. వ్యాధిగ్రస్త ఆకులు వెంటనే తొలగించి కాల్చివేయండి.",
    pest_en:"Mancozeb 75% WP",     pest_te:"మాంకోజెబ్ 75%",
    dose_en:"2g per litre — spray 3 times, 10 days apart", dose_te:"లీటరుకు 2గ్రా — 10 రోజుల వ్యవధిలో 3 సార్లు", rec:18
  },
  "Tomato___Late_blight": {
    n_en:"Late Blight", n_te:"లేట్ బ్లైట్",
    c_en:"Tomato",      c_te:"టొమాటో", sc:"red",
    r_en:"Apply Metalaxyl 8% + Mancozeb 64% WP @ 2.5g per litre IMMEDIATELY. This disease spreads within hours — act same day you see symptoms.",
    r_te:"మెటలాక్సిల్ + మాంకోజెబ్ @ 2.5గ్రా లీటరుకు వెంటనే వేయండి. ఈ వ్యాధి గంటల్లో వ్యాపిస్తుంది — వెంటనే చర్య తీసుకోండి.",
    pest_en:"Metalaxyl + Mancozeb (Ridomil Gold)", pest_te:"మెటలాక్సిల్ + మాంకోజెబ్",
    dose_en:"2.5g per litre — spray every 7 days", dose_te:"లీటరుకు 2.5గ్రా — 7 రోజులకు ఒకసారి", rec:21
  },
  "Tomato___Bacterial_spot": {
    n_en:"Bacterial Spot", n_te:"బాక్టీరియల్ స్పాట్",
    c_en:"Tomato",         c_te:"టొమాటో", sc:"orange",
    r_en:"Apply Copper Oxychloride 50% WP @ 3g per litre. Spray every 7 days. Avoid working in the field when plants are wet to prevent spread.",
    r_te:"కాపర్ ఆక్సీక్లోరైడ్ @ 3గ్రా లీటరుకు వేయండి. 7 రోజులకు ఒకసారి పిచికారీ.",
    pest_en:"Copper Oxychloride 50% WP", pest_te:"కాపర్ ఆక్సీక్లోరైడ్",
    dose_en:"3g per litre — spray every 7 days", dose_te:"లీటరుకు 3గ్రా — 7 రోజులకు ఒకసారి", rec:14
  },
  "Tomato___Septoria_leaf_spot": {
    n_en:"Septoria Leaf Spot", n_te:"సెప్టోరియా లీఫ్ స్పాట్",
    c_en:"Tomato",             c_te:"టొమాటో", sc:"orange",
    r_en:"Apply Chlorothalonil @ 2g per litre. Remove infected leaves. Mulch soil to prevent soil-splash spreading spores.",
    r_te:"క్లోరోథలోనిల్ @ 2గ్రా లీటరుకు వేయండి. వ్యాధిగ్రస్త ఆకులు తొలగించండి.",
    pest_en:"Chlorothalonil 75% WP", pest_te:"క్లోరోథలోనిల్",
    dose_en:"2g per litre — spray every 10 days", dose_te:"లీటరుకు 2గ్రా — 10 రోజులకు ఒకసారి", rec:16
  },
  "Tomato___healthy": {
    n_en:"Healthy Plant", n_te:"ఆరోగ్యకరమైన మొక్క",
    c_en:"Tomato",        c_te:"టొమాటో", sc:"green",
    r_en:"Your crop is healthy! Continue regular watering and fertilisation. Monitor weekly for early disease signs.",
    r_te:"మీ పంట ఆరోగ్యంగా ఉంది! సాధారణ నీటిపారుదల కొనసాగించండి.",
    pest_en:"None required", pest_te:"అవసరం లేదు",
    dose_en:"No treatment needed", dose_te:"చికిత్స అవసరం లేదు", rec:0
  },

  // ── Potato ──
  "Potato___Early_blight": {
    n_en:"Early Blight", n_te:"అర్లీ బ్లైట్",
    c_en:"Potato",       c_te:"బంగాళాదుంప", sc:"orange",
    r_en:"Apply Mancozeb 75% WP @ 2g per litre. Practice crop rotation next season. Avoid overhead irrigation.",
    r_te:"మాంకోజెబ్ 75% WP @ 2గ్రా లీటరుకు వేయండి. పంట మార్పిడి చేయండి.",
    pest_en:"Mancozeb 75% WP", pest_te:"మాంకోజెబ్",
    dose_en:"2g per litre — spray every 10 days", dose_te:"లీటరుకు 2గ్రా — 10 రోజులకు ఒకసారి", rec:18
  },
  "Potato___Late_blight": {
    n_en:"Late Blight", n_te:"లేట్ బ్లైట్",
    c_en:"Potato",      c_te:"బంగాళాదుంప", sc:"red",
    r_en:"Apply Metalaxyl + Mancozeb @ 2.5g per litre IMMEDIATELY. This disease spreads extremely fast — every hour of delay costs more crop.",
    r_te:"మెటలాక్సిల్ + మాంకోజెబ్ @ 2.5గ్రా వెంటనే వేయండి.",
    pest_en:"Metalaxyl + Mancozeb", pest_te:"మెటలాక్సిల్ + మాంకోజెబ్",
    dose_en:"2.5g per litre — spray every 7 days", dose_te:"లీటరుకు 2.5గ్రా — 7 రోజులకు ఒకసారి", rec:21
  },
  "Potato___healthy": {
    n_en:"Healthy Plant", n_te:"ఆరోగ్యకరమైన మొక్క",
    c_en:"Potato",        c_te:"బంగాళాదుంప", sc:"green",
    r_en:"Potato crop looks healthy. Continue monitoring.",
    r_te:"మీ పంట ఆరోగ్యంగా ఉంది.",
    pest_en:"None required", pest_te:"అవసరం లేదు",
    dose_en:"No treatment needed", dose_te:"చికిత్స అవసరం లేదు", rec:0
  },

  // ── Chilli / Pepper ──
  "Pepper,_bell___Bacterial_spot": {
    n_en:"Bacterial Spot", n_te:"బాక్టీరియల్ స్పాట్",
    c_en:"Chilli / Pepper", c_te:"మిర్చి", sc:"orange",
    r_en:"Apply Copper Hydroxide 77% WP @ 3g per litre. Avoid working in wet fields. Use certified disease-free seeds next season.",
    r_te:"కాపర్ హైడ్రాక్సైడ్ @ 3గ్రా లీటరుకు వేయండి.",
    pest_en:"Copper Hydroxide 77% WP", pest_te:"కాపర్ హైడ్రాక్సైడ్",
    dose_en:"3g per litre — spray every 7–10 days", dose_te:"లీటరుకు 3గ్రా — 7-10 రోజులకు ఒకసారి", rec:14
  },
  "Pepper,_bell___healthy": {
    n_en:"Healthy Plant", n_te:"ఆరోగ్యకరమైన మొక్క",
    c_en:"Chilli / Pepper", c_te:"మిర్చి", sc:"green",
    r_en:"Pepper crop is healthy! Maintain regular fertilisation.",
    r_te:"మీ మిర్చి పంట ఆరోగ్యంగా ఉంది!",
    pest_en:"None required", pest_te:"అవసరం లేదు",
    dose_en:"No treatment needed", dose_te:"చికిత్స అవసరం లేదు", rec:0
  },
};

// ── Mock diagnoses (used when backend is offline) ──
// Filters out healthy entries so demo always shows actionable results
const MOCK_D = Object.entries(TX)
  .filter(([, v]) => v.sc !== "green")
  .map(([k, v]) => ({ key: k, ...v, conf: +(Math.random() * .13 + .82).toFixed(2) }));
