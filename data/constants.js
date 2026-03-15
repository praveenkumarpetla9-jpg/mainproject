// ══════════════════════════════════════════
// data/constants.js
// Global constants: API endpoint, district
// lists for AP + Telangana, crop names,
// and small utility functions used app-wide.
// ══════════════════════════════════════════

const { useState, useEffect, useRef } = React;

// ── Backend API base URL ──
const API      = "http://localhost:8000";
const API_BASE = API;  // alias used in Chatbot and CropInsurance

// ── Crop list (for price charts) ──
const CROPS = ["Rice", "Chilli", "Groundnut", "Cotton", "Onion"];

// ── All Andhra Pradesh districts (26) ──
const DIST_AP = [
  "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Bapatla", "Chittoor",
  "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kadapa",
  "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
  "Parvathipuram Manyam", "Prakasam", "Srikakulam",
  "Sri Potti Sriramulu Nellore", "Tirupati", "Visakhapatnam",
  "Vizianagaram", "West Godavari", "YSR Kadapa", "Sri Balaji"
];

// ── All Telangana districts (33) ──
const DIST_TS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial",
  "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu",
  "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad",
  "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
  "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
];

// ── Combined district list ──
const DIST = [...DIST_AP, ...DIST_TS];

// ── Telugu district name translations (used in PestMap, CropRecommendation) ──
const DIST_TE = {
  "Guntur":"గుంటూరు", "Kurnool":"కర్నూలు", "Krishna":"కృష్ణా", "Visakhapatnam":"విశాఖపట్నం",
  "East Godavari":"తూర్పు గోదావరి", "West Godavari":"పశ్చిమ గోదావరి", "Nellore":"నెల్లూరు",
  "Kadapa":"కడప", "Ananthapuramu":"అనంతపురం", "Chittoor":"చిత్తూరు", "Tirupati":"తిరుపతి",
  "Kakinada":"కాకినాడ", "Eluru":"ఏలూరు", "Bapatla":"బాపట్ల",
  "Hyderabad":"హైదరాబాద్", "Warangal":"వరంగల్", "Hanamkonda":"హనుమకొండ",
  "Karimnagar":"కరీంనగర్", "Nizamabad":"నిజామాబాద్", "Khammam":"ఖమ్మం",
  "Nalgonda":"నల్గొండ", "Adilabad":"ఆదిలాబాద్", "Medak":"మెదక్",
  "Rangareddy":"రంగారెడ్డి", "Mahabubnagar":"మహబూబ్‌నగర్"
};

// ── History helpers (localStorage) ──
function saveH(d) {
  const h = JSON.parse(localStorage.getItem('kd_h') || '[]');
  h.unshift({
    ...d,
    id: Date.now(),
    date: new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
  });
  localStorage.setItem('kd_h', JSON.stringify(h.slice(0, 30)));
}

function getH() {
  return JSON.parse(localStorage.getItem('kd_h') || '[]');
}

// ── Date helper ──
// Returns a formatted date offset from today (e.g. fd(5) = 5 days from now)
function fd(off = 0) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
