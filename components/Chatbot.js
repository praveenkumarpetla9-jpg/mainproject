// ══════════════════════════════════════════
// components/Chatbot.js
// Floating AI farming assistant bubble.
// Visible on every page.
//
// Flow:
//  1. User opens drawer via FAB button
//  2. Quick-chip suggestions shown on open
//  3. User types or taps a chip
//  4. Tries Claude API via backend (/chat)
//  5. Falls back to farmingAnswer() if offline
//
// Props:
//   lang — 'EN' | 'TE'
// ══════════════════════════════════════════

// ── Rule-based fallback responses ──
// Used when the backend Claude API is unreachable.
function farmingAnswer(q, lang) {
  const TE = lang === 'TE';
  const ql = q.toLowerCase();

  const D = {
    chilli_sow:  {
      en: "Chilli should be sown in Guntur and AP in June–July for Kharif season. Prepare nursery beds, sow seeds, transplant after 30–35 days when seedlings are 15cm tall. Use certified HPS 1/BG varieties.",
      te: "గుంటూరులో మిర్చి విత్తనాలు జూన్–జూలైలో వేయాలి. నర్సరీ బెడ్‌లు తయారు చేసి, విత్తనాలు వేసి, 30–35 రోజుల తర్వాత మొక్కలు నాటండి.",
    },
    rice_water:  {
      en: "Rice needs 1200–1500mm of water per crop season. During tillering and panicle initiation stages keep 5cm standing water. Drain field 10 days before harvest for better grain quality.",
      te: "వరి పంటకు సీజన్‌కు 1200–1500mm నీరు అవసరం. పంటి దశలో 5cm నీరు ఉంచండి. కోత 10 రోజుల ముందు నీరు తీసివేయండి.",
    },
    sandy_fert:  {
      en: "For sandy soil, use split fertiliser doses — apply NPK in 3 splits instead of one dose. Sandy soil loses nutrients quickly. Add organic matter (FYM 5 tonnes/acre) to improve water retention.",
      te: "ఇసుక నేలకు ఎరువులు 3 విడతలుగా వేయండి. FYM 5 టన్నులు/ఎకరం వేసి నేల నీటి నిల్వ సామర్థ్యం పెంచండి.",
    },
    groundnut_d: {
      en: "Common groundnut diseases in AP: Tikka leaf spot — spray Mancozeb 2g/L; Collar rot — use Trichoderma seed treatment; Bud necrosis — control thrips which spread this virus.",
      te: "AP లో వేరుశెనగ వ్యాధులు: టిక్కా లీఫ్ స్పాట్ — మాంకోజెబ్ 2గ్రా/లీ పిచికారీ; కాలర్ రాట్ — ట్రైకోడర్మ విత్తన చికిత్స.",
    },
    cotton_pest: {
      en: "For cotton bollworm in Telangana/AP: Apply Emamectin benzoate 5% SG @ 0.4g/L. Use pheromone traps (5/acre). Spray in early morning or evening. Avoid chemical resistance by rotating insecticides.",
      te: "కాటన్ బోల్‌వర్మ్‌కు: ఎమామెక్టిన్ బెంజోయేట్ 5% @ 0.4గ్రా/లీ వేయండి. ఫెరోమోన్ ట్రాప్‌లు (5/ఎకరం) ఉపయోగించండి.",
    },
    kisan_scheme:{
      en: "PM-KISAN gives ₹6,000/year (₹2,000 every 4 months) to all small/marginal farmers. Apply at pmkisan.gov.in or nearest CSC. Need Aadhaar, bank account linked to Aadhaar, and land records.",
      te: "PM-KISAN సంవత్సరానికి ₹6,000 (4 నెలలకు ₹2,000) అన్ని చిన్న/మధ్యతరగతి రైతులకు ఇస్తుంది. pmkisan.gov.in లో దరఖాస్తు చేయండి.",
    },
    irrigation:  {
      en: "For drip irrigation subsidy in AP/Telangana: General farmers get 55% subsidy, SC/ST get 90% under PMKSY. Apply at your nearest agriculture department office or agriculture.ap.gov.in / pmksy.gov.in",
      te: "AP/తెలంగాణలో డ్రిప్ ఇరిగేషన్‌కు: జనరల్ రైతులకు 55%, SC/ST కి 90% సబ్సిడీ PMKSY కింద. వ్యవసాయ శాఖ కార్యాలయంలో దరఖాస్తు చేయండి.",
    },
    default:     {
      en: "Great question! For the best advice, I'd recommend: 1- Check the Disease Detector for crop health, 2- Use Crop Recommendation for what to grow this season, 3- Check Govt Schemes for subsidies you qualify for.",
      te: "మంచి ప్రశ్న! వ్యాధి గుర్తింపు, పంట సిఫార్సు, లేదా ప్రభుత్వ పథకాలలో ఏది సహాయం కావాలి?",
    },
  };

  const pick = k => TE ? D[k].te : D[k].en;

  if (/chilli|mirchi|మిర్చి/.test(ql)     && /sow|plant|when|ఎప్పుడు|విత్తన/.test(ql)) return pick('chilli_sow');
  if (/rice|paddy|వరి/.test(ql)           && /water|irrig|నీరు/.test(ql))               return pick('rice_water');
  if (/sandy|ఇసుక/.test(ql)              && /fertil|ఎరువు/.test(ql))                   return pick('sandy_fert');
  if (/groundnut|వేరుశెనగ/.test(ql)      && /diseas|వ్యాధి/.test(ql))                  return pick('groundnut_d');
  if (/cotton|పత్తి/.test(ql)            && /pest|bollworm|బోల్/.test(ql))              return pick('cotton_pest');
  if (/kisan|subsid|scheme|పథకం|సబ్సిడీ/.test(ql))                                      return pick('kisan_scheme');
  if (/drip|irrigat|నీటిపారుదల/.test(ql))                                                return pick('irrigation');
  return pick('default');
}

// ── Chatbot component ──
function Chatbot({ lang }) {
  const TE = lang === 'TE';

  const WELCOME_MSG = TE
    ? 'నమస్కారం! 🌾 నేను మీ వ్యవసాయ సహాయకుడిని. మిర్చి ఎప్పుడు విత్తాలి? ఏ పురుగుమందు? పథకాల గురించి — ఏదైనా అడగండి!'
    : "Hello! 🌾 I'm your AI farming assistant. Ask me anything — when to sow chilli, which fertiliser for sandy soil, govt schemes, crop diseases. I answer in Telugu or English!";

  const [open,   setOpen]   = useState(false);
  const [msgs,   setMsgs]   = useState([{ role:'bot', text: WELCOME_MSG }]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const msgsEndRef           = useRef(null);

  // Scroll to latest message whenever drawer is open
  useEffect(() => {
    if (open) msgsEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [msgs, open]);

  // Reset welcome message when language changes
  useEffect(() => {
    setMsgs([{ role:'bot', text: WELCOME_MSG }]);
  }, [lang]);

  const SUGG_EN = ['When to sow chilli in Guntur?', 'Fertiliser for sandy soil?', 'PM-KISAN scheme eligibility?', 'Cotton bollworm treatment?'];
  const SUGG_TE = ['గుంటూరులో మిర్చి ఎప్పుడు విత్తాలి?', 'ఇసుక నేలకు ఎరువు?', 'PM-KISAN అర్హత?', 'పత్తి బోల్‌వర్మ్ చికిత్స?'];
  const SUGG = TE ? SUGG_TE : SUGG_EN;

  async function send(text) {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMsgs(m => [...m, { role:'user', text:q }]);
    setTyping(true);

    try {
      // Try Claude via backend
      const res = await fetch(`${API_BASE}/chat`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          message: q,
          language: lang,
          system: `You are KrishiDost, an expert agricultural assistant for Andhra Pradesh and Telangana farmers. Answer in ${lang === 'TE' ? 'Telugu' : 'English'} clearly and concisely. Focus on: crop diseases, fertilisers, pest control, sowing times, govt schemes, mandi prices. Keep answers under 80 words. Be specific to AP/TS crops: Rice, Chilli, Groundnut, Cotton, Onion.`
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMsgs(m => [...m, { role:'bot', text: data.reply || data.content || farmingAnswer(q, lang) }]);
    } catch {
      // Smart fallback — no backend needed for demo
      await new Promise(r => setTimeout(r, 800));
      setMsgs(m => [...m, { role:'bot', text: farmingAnswer(q, lang) }]);
    }
    setTyping(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      {/* Floating action button */}
      <button
        className={`chat-fab${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title={TE ? 'వ్యవసాయ సహాయం' : 'Farming Assistant'}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat drawer */}
      {open && (
        <div className="chat-drawer">
          {/* Header */}
          <div className="chat-head">
            <span style={{ fontSize:24 }}>🌾</span>
            <div className="chat-head-info">
              <div className="chat-head-title">{TE ? 'వ్యవసాయ AI సహాయకుడు' : 'KrishiDost AI Assistant'}</div>
              <div className="chat-head-sub">{TE ? 'తెలుగు లేదా ఇంగ్లీష్‌లో అడగండి' : 'Ask in Telugu or English'}</div>
            </div>
            {/* Online indicator */}
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px #4ade80' }}/>
          </div>

          {/* Message list */}
          <div className="chat-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-msg bot typing">
                <span>⋯ </span>{TE ? 'సమాధానం టైప్ అవుతున్నది...' : 'Typing...'}
              </div>
            )}
            <div ref={msgsEndRef}/>
          </div>

          {/* Quick suggestion chips — shown only at conversation start */}
          {msgs.length <= 2 && (
            <div className="chat-chips">
              {SUGG.map(s => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="chat-foot">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={TE ? 'మీ ప్రశ్న టైప్ చేయండి...' : 'Type your farming question...'}
            />
            <button className="chat-send" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
