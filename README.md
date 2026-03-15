# KrishiDost — Modular Structure

Smart Farming Platform for Andhra Pradesh & Telangana.
AI-powered crop disease detection, mandi price intelligence,
crop recommendation, govt schemes, insurance claim generation,
and pest outbreak heatmap. Bilingual: English + Telugu.

---

## File Structure

```
krishidost_modular/
│
├── index.html                  ← Entry point. Loads all modules in order.
│                                 Contains only the root App component.
│
├── styles/
│   ├── base.css                ← CSS variables, dark mode, reset, typography
│   ├── components.css          ← Shared UI: Nav, Cards, Buttons, Chatbot,
│   │                             Weather widget, Upload zone, Animations
│   └── pages.css               ← Page-specific: Hero, Price cards, Mandi map
│
├── data/
│   ├── constants.js            ← API_BASE, DIST_AP, DIST_TS, DIST_TE,
│   │                             saveH(), getH(), fd() date helper
│   ├── treatments.js           ← TX disease treatment database + MOCK_D
│   ├── priceData.js            ← PX prices, FC forecast, BW windows,
│   │                             DISTRICT_OFFSET, distPrice(), MANDI_LOCATIONS
│   ├── cropData.js             ← CROP_DB, recommendCrops(), calcProfit(),
│   │                             scoreColor(), scoreLabel(), translation maps
│   ├── schemesData.js          ← SCHEMES_DB, matchSchemes(), typeColor()
│   ├── pestData.js             ← PEST_TE translations, PESTS per crop
│   └── weatherData.js          ← WEATHER_DATA per district, farmingTip()
│
├── components/
│   ├── Toast.js                ← Auto-dismiss notification (4 seconds)
│   ├── Nav.js                  ← Sticky nav: tabs, dark mode, language toggle
│   ├── WeatherWidget.js        ← 4-card weather display + farming tip
│   ├── Chatbot.js              ← Floating AI farming assistant bubble
│   │                             (Claude API with rule-based fallback)
│   └── Spark.js                ← Mini 30px sparkline chart (Chart.js)
│
└── pages/
    ├── Home.js                 ← Landing: weather, animated stats, feature grid
    ├── DiseaseDetector.js      ← AI disease detection, treatment card,
    │                             Telugu output, diagnosis history
    ├── Prices.js               ← Live prices, 7-day trend, 45-day forecast,
    │                             price alerts, MandiMap (Leaflet)
    ├── CropRecommendation.js   ← ML crop advisor, profit comparison chart
    ├── GovtSchemes.js          ← 5-step eligibility wizard, scheme cards
    ├── CropInsurance.js        ← Multi-photo damage assessment, PMFBY PDF
    └── PestMap.js              ← Leaflet heatmap, pest reporting, outbreak alerts
```

---

## How Modules Communicate

Because this app uses in-browser Babel (no bundler), modules are loaded
as sequential `<script type="text/babel">` tags in `index.html`. Variables
declared in earlier scripts are available as globals to later scripts —
no `import/export` needed.

**Load order (from index.html):**
1. Data modules (constants → treatments → priceData → cropData → schemesData → pestData → weatherData)
2. Shared components (Toast → Nav → WeatherWidget → Chatbot → Spark)
3. Page components (Home → DiseaseDetector → Prices → … → PestMap)
4. Root `App` component (inline in index.html)

**To convert to a real module system** (Vite/webpack), add
`export` to each function/constant and `import` them in the consuming files.

---

## Key Data Flows

| Page | Data used | Components used |
|------|-----------|----------------|
| Home | getH(), WEATHER_DATA | WeatherWidget |
| DiseaseDetector | TX, MOCK_D, saveH/getH | Toast |
| Prices | PX, FC, BW, DISTRICT_OFFSET, MANDI_LOCATIONS | Spark, Toast |
| CropRecommendation | CROP_DB, recommendCrops(), calcProfit() | Toast |
| GovtSchemes | SCHEMES_DB, matchSchemes() | Toast |
| CropInsurance | CROP_MANDI_PRICE, CROP_YIELD_PER_ACRE | Toast |
| PestMap | DISTRICT_COORDS, MOCK_REPORTS, PEST_TE | Toast |
| All pages | DIST_AP, DIST_TS, DIST_TE | Nav, Chatbot |

---

## Running the App

Open `index.html` directly in a browser — no build step needed.
For the AI features (disease prediction, chatbot) to use live data,
run the backend at `http://localhost:8000`.

All features fall back to mock/rule-based responses when offline.
