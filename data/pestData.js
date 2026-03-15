// ══════════════════════════════════════════
// data/pestData.js
// PEST_TE  — English → Telugu pest name map
// PESTS    — common pests per crop (for the
//            report form dropdown)
// ══════════════════════════════════════════

// Telugu translations for pest names
const PEST_TE = {
  "Bollworm":           "బోల్‌వర్మ్",
  "Stem Borer":         "కాండం తొలుచు పురుగు",
  "Brown Planthopper":  "గోధుమ రంగు మొక్కజొన్న దుమ్మెద",
  "Fall Armyworm":      "ఫాల్ ఆర్మీవర్మ్",
  "Thrips":             "త్రిప్స్",
  "Aphids":             "నల్లి పురుగులు",
  "Whitefly":           "తెల్ల ఈగ",
  "Mites":              "మైట్లు",
  "Pod Borer":          "పాడ్ తొలుచు పురుగు",
  "Shoot Fly":          "షూట్ ఈగ",
  "Leaf Miner":         "ఆకు తొలుచు పురుగు",
  "Termites":           "చెదపురుగులు",
  "Root Grub":          "వేరు పురుగు",
  "Yellow Stem Borer":  "పసుపు కాండం తొలుచు పురుగు",
};

// Common pests grouped by crop — populates the report form dropdown
const PESTS = {
  Rice:      ["Yellow Stem Borer", "Brown Planthopper", "Thrips", "Leaf Folder", "Gall Midge"],
  Chilli:    ["Thrips", "Mites", "Aphids", "Whitefly", "Fruit Borer"],
  Groundnut: ["Thrips", "Aphids", "Leaf Miner", "Root Grub", "Termites"],
  Cotton:    ["Bollworm", "Whitefly", "Aphids", "Thrips", "Mites"],
  Maize:     ["Fall Armyworm", "Stem Borer", "Shoot Fly", "Aphids", "Pod Borer"],
  Tomato:    ["Whitefly", "Thrips", "Mites", "Leaf Miner", "Fruit Borer"],
  Other:     ["Bollworm", "Stem Borer", "Aphids", "Thrips", "Whitefly"],
};
