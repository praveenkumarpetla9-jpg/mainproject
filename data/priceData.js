// ══════════════════════════════════════════
// data/priceData.js
// Mandi price data for AP + Telangana.
//
// PX  — 30-day historical prices per crop (₹/quintal, Guntur base)
// FC  — 15-day price forecast per crop
// BW  — Best sell window: peak forecast month and peak price
// DISTRICT_OFFSET — per-district price adjustment (± from Guntur base)
// distPrice(basePrices, district) — apply offset to get district price
// MANDI_LOCATIONS — mandi markers for the map view
// ══════════════════════════════════════════

// ── 30-day historical prices (₹/quintal, Guntur base) ──
const PX = {
  Rice:      [1820,1835,1810,1850,1870,1845,1890,1910,1880,1920,1935,1950,1965,1940,1975,1990,2010,2025,2000,1985,1970,1995,2020,2040,2060,2075,2050,2030,2010,2025],
  Chilli:    [9200,9350,9100,9500,9650,9400,9800,10100,9900,10200,10500,10300,10700,10500,10900,11200,11000,11400,11600,11300,11100,11500,11800,12000,12200,12400,12100,11900,11700,11900],
  Groundnut: [5200,5250,5180,5300,5350,5280,5400,5450,5380,5500,5560,5490,5620,5560,5700,5750,5680,5800,5860,5780,5720,5800,5870,5940,6000,6050,5980,5920,5860,5910],
  Cotton:    [6500,6550,6480,6600,6650,6580,6700,6760,6680,6800,6860,6780,6900,6840,6980,7040,6960,7080,7150,7060,6980,7060,7140,7220,7300,7360,7280,7200,7120,7180],
  Onion:     [2100,2050,2200,2150,2300,2250,2400,2380,2450,2500,2480,2550,2600,2570,2640,2700,2680,2750,2800,2760,2820,2880,2860,2920,2980,2950,3000,3050,3020,3080],
};

// ── 15-day price forecast ──
const FC = {
  Rice:      [2040,2055,2070,2085,2100,2095,2110,2130,2120,2140,2155,2170,2160,2145,2130],
  Chilli:    [11950,12100,12250,12400,12550,12480,12600,12750,12900,13050,13000,12900,12800,12700,12600],
  Groundnut: [5930,5960,5990,6020,6050,6080,6060,6040,6020,6000,5980,5960,5950,5940,5930],
  Cotton:    [7200,7240,7280,7320,7360,7400,7380,7360,7340,7320,7300,7280,7260,7240,7220],
  Onion:     [3090,3110,3130,3150,3170,3190,3210,3230,3250,3240,3220,3200,3180,3160,3140],
};

// ── Best sell window: { s=start day, e=end day, p=peak price } ──
const BW = {
  Rice:      { s:10, e:13, p:2170 },
  Chilli:    { s:8,  e:11, p:13050 },
  Groundnut: { s:4,  e:7,  p:6080 },
  Cotton:    { s:5,  e:8,  p:7400 },
  Onion:     { s:9,  e:12, p:3250 },
};

// ── District price offsets (± ₹ from Guntur base) ──
// Reflects real market variation across AP and Telangana
const DISTRICT_OFFSET = {
  // Andhra Pradesh
  "Guntur":0, "Bapatla":-20, "NTR":-10, "Krishna":20, "Eluru":15,
  "East Godavari":30, "West Godavari":25, "Kakinada":35, "Konaseema":20,
  "Anakapalli":10, "Visakhapatnam":40, "Vizianagaram":30, "Srikakulam":20,
  "Alluri Sitharama Raju":15, "Parvathipuram Manyam":10,
  "Kurnool":-50, "Nandyal":-45, "Ananthapuramu":-60, "Sri Balaji":-30,
  "Kadapa":-30, "YSR Kadapa":-30, "Tirupati":-20, "Chittoor":-15,
  "Prakasam":-25, "Sri Potti Sriramulu Nellore":-10, "Palnadu":-35,
  "Dr. B.R. Ambedkar Konaseema":20,
  // Telangana
  "Hyderabad":80, "Rangareddy":70, "Medchal-Malkajgiri":65, "Sangareddy":50,
  "Medak":40, "Siddipet":45, "Karimnagar":35, "Jagtial":30, "Rajanna Sircilla":25,
  "Peddapalli":30, "Mancherial":20, "Adilabad":15, "Nirmal":20,
  "Komaram Bheem Asifabad":10, "Nizamabad":35, "Kamareddy":30,
  "Hanamkonda":40, "Warangal":38, "Jangaon":30, "Yadadri Bhuvanagiri":45,
  "Nalgonda":25, "Suryapet":20, "Khammam":30, "Bhadradri Kothagudem":15,
  "Mahabubabad":20, "Mulugu":10, "Jayashankar Bhupalpally":15,
  "Mahabubnagar":25, "Nagarkurnool":20, "Wanaparthy":22, "Jogulamba Gadwal":18,
  "Narayanpet":15, "Vikarabad":35,
};

// Apply the district offset to an array of base prices
function distPrice(basePrices, district) {
  const off = DISTRICT_OFFSET[district] || 0;
  return basePrices.map(p => p + off);
}

// ── Mandi locations for the map view ──
const MANDI_LOCATIONS = [
  { name:"Guntur Mandi",     lat:16.30, lng:80.44, district:"Guntur",      speciality:"Chilli",    prices:{Rice:2025,Chilli:11900,Groundnut:5910,Cotton:7180,Onion:3080} },
  { name:"Warangal Mandi",   lat:17.98, lng:79.59, district:"Warangal",    speciality:"Cotton",    prices:{Rice:2063,Chilli:11938,Groundnut:5948,Cotton:7218,Onion:3118} },
  { name:"Kurnool Mandi",    lat:15.83, lng:78.04, district:"Kurnool",     speciality:"Groundnut", prices:{Rice:1975,Chilli:11850,Groundnut:5860,Cotton:7130,Onion:3030} },
  { name:"Hyderabad Rythu",  lat:17.38, lng:78.47, district:"Hyderabad",   speciality:"Onion",     prices:{Rice:2105,Chilli:11980,Groundnut:5990,Cotton:7260,Onion:3160} },
  { name:"Vijayawada Mandi", lat:16.51, lng:80.61, district:"NTR",         speciality:"Rice",      prices:{Rice:2015,Chilli:11890,Groundnut:5900,Cotton:7170,Onion:3070} },
  { name:"Khammam Mandi",    lat:17.25, lng:80.15, district:"Khammam",     speciality:"Cotton",    prices:{Rice:2055,Chilli:11930,Groundnut:5940,Cotton:7210,Onion:3110} },
  { name:"Karimnagar Mandi", lat:18.44, lng:79.13, district:"Karimnagar",  speciality:"Rice",      prices:{Rice:2060,Chilli:11935,Groundnut:5945,Cotton:7215,Onion:3115} },
  { name:"Nizamabad Mandi",  lat:18.67, lng:78.10, district:"Nizamabad",   speciality:"Maize",     prices:{Rice:2060,Chilli:11935,Groundnut:5945,Cotton:7215,Onion:3115} },
];
