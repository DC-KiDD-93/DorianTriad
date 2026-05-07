'use strict';
/* ============================================================
   DORIAN TRIAD — app.js
   All data, storage, timers, charts, views and interactions.
   No external dependencies.
   ============================================================ */

// ════════════════════════════════════════════════════════════
// 1. SESSION DATA
// ════════════════════════════════════════════════════════════

const SESSIONS = {
  atlas: {
    id: 'atlas', name: 'ATLAS', sub: 'Strength Foundation',
    color: '#00E587', dim: 'rgba(0,229,135,0.07)', duration: '~58',
    warmup: [
      '2 min general movement — arm circles, hip circles, leg swings, bodyweight squats ×10',
      'Goblet squat ×10 light — assess hip depth and mobility before loading',
      'Band pull-aparts ×20 — rear delt and scapular activation',
      'Squat ramp-up: empty bar ×10 → 40% ×6 → 60% ×4 → 75% ×2 — then working weight'
    ],
    exercises: [
      { id:'back-squat',       name:'Back Squat',        sets:'3',   reps:'6–8',   restSecs:180, incrPct:1.5, isAnchor:true,  ssTag:null, ssNote:null,
        cues:['Bar on mid-traps, feet shoulder-width with slight outward angle','Big breath, 360° brace before descent — knees track toes throughout','Break parallel, drive through heels, chest up — hips and shoulders rise together'] },
      { id:'incline-db-press', name:'Incline DB Press',  sets:'3',   reps:'6–8',   restSecs:150, incrPct:2,   isAnchor:false, ssTag:null, ssNote:null,
        cues:['30–35° angle only — higher shifts load to front delt, not chest','Elbows at 45° from torso throughout','Feel the stretch at the bottom, slight arc on press, squeeze at top'] },
      { id:'pull-ups',         name:'Pull-Ups',           sets:'3',   reps:'5–8',   restSecs:150, incrPct:3,   isAnchor:false, ssTag:null, ssNote:null,
        cues:['Start from a true dead hang — retract scapulae before pulling','Drive elbows to hips, chest toward the bar','3-sec controlled descent on every rep — don\'t drop'] },
      { id:'cs-row',           name:'CS Row',             sets:'3',   reps:'12–15', restSecs:0,   incrPct:2,   isAnchor:false, ssTag:'A1', ssNote:'Superset immediately into Lateral Raise',
        cues:['Chest on pad throughout — no rising off the support','Scapular retraction initiates the pull, not the arm','Pause 1 sec at full contraction, elbows drive back to pockets'] },
      { id:'lateral-raise',    name:'Lateral Raise',      sets:'3',   reps:'10–20', restSecs:90,  incrPct:4,   isAnchor:false, ssTag:'A2', ssNote:'Rest 90 sec after A1+A2',
        cues:['Slight forward lean from hips, elbows lead the raise','Raise to just above shoulder height — no higher','Pinky slightly higher than thumb (external rotation)'] },
      { id:'calf-raise',       name:'Calf Raise',          sets:'2',   reps:'10–14', restSecs:0,   incrPct:3,   isAnchor:false, ssTag:'B1', ssNote:'Superset immediately into Leg Curl',
        cues:['Full stretch at the bottom — 3-sec hold in lowered position','Drive to full contraction at top, squeeze 1 sec','Single leg = full bodyweight. Control throughout'] },
      { id:'leg-curl',         name:'Leg Curl',            sets:'2',   reps:'8–12',  restSecs:90,  incrPct:3,   isAnchor:false, ssTag:'B2', ssNote:'Rest 90 sec after B1+B2',
        cues:['Full ROM — don\'t cut short at either end','Hips stay flat on the pad throughout','Squeeze at peak contraction, 3-sec controlled return'] }
    ]
  },
  hades: {
    id: 'hades', name: 'HADES', sub: 'Maximum Load',
    color: '#FF5C2B', dim: 'rgba(255,92,43,0.07)', duration: '~57',
    warmup: [
      'Cat-cow ×10, thoracic rotations ×10 each side — spine prep',
      'Glute bridges ×15, single-leg hip hinge ×8 each — posterior chain activation',
      'Deadlift ramp-up: empty bar ×10 → 50% ×5 → 70% ×3 → 85% ×2 — then working weight',
      'Stand tall and reset fully between ramp-up sets — pattern before load'
    ],
    exercises: [
      { id:'deadlift',              name:'Deadlift',              sets:'3',   reps:'5–7',   restSecs:180, incrPct:1.5, isAnchor:true,  ssTag:null, ssNote:null,
        cues:['Bar over mid-foot, hip-width stance — lats engaged (protect your armpits)','Big breath, full 360° brace — push the floor away, don\'t think about pulling','Bar stays in contact with legs throughout — hips and shoulders rise together'] },
      { id:'dips',                  name:'Dips',                  sets:'3',   reps:'5–8',   restSecs:180, incrPct:3,   isAnchor:false, ssTag:'A1', ssNote:'Alternating sets with Chin-ups — full rest between each',
        cues:['Slight forward lean for chest and tricep emphasis','Elbows close to body — controlled descent, feel the stretch','Drive up powerfully but don\'t fully lockout — maintain tension'] },
      { id:'chin-ups',              name:'Chin-ups',              sets:'3',   reps:'5–8',   restSecs:180, incrPct:3,   isAnchor:false, ssTag:'A2', ssNote:'True alternating sets — full rest between each',
        cues:['Supinated grip, start from a true dead hang','Drive elbows down and back — chest to bar if possible','3-sec controlled descent on every rep'] },
      { id:'machine-shoulder-press',name:'Shoulder Press',        sets:'2',   reps:'6–10',  restSecs:120, incrPct:2,   isAnchor:false, ssTag:null, ssNote:null,
        cues:['No leg drive — seated, strict press','Full ROM — don\'t cut the top or bottom short','Controlled descent — resist the weight on the way down'] },
      { id:'ab-wheel',              name:'Ab Wheel',              sets:'2',   reps:'6–12',  restSecs:0,   incrPct:0,   isAnchor:false, ssTag:'B1', ssNote:'Superset immediately into Leg Extensions',
        cues:['Brace core completely before rolling — don\'t initiate with the back','Roll to comfortable extension — lower back must not sag','Pull back using lats and core together'] },
      { id:'leg-extensions',        name:'Leg Extensions',        sets:'2',   reps:'8–12',  restSecs:90,  incrPct:2.5, isAnchor:false, ssTag:'B2', ssNote:'Rest 90 sec after B1+B2',
        cues:['1-sec pause at full lockout — quad peak contraction','3-sec controlled eccentric on every rep','Feel the quad working through the entire range'] },
      { id:'cable-curl',            name:'Cable Curl',            sets:'2',   reps:'8–12',  restSecs:0,   incrPct:3,   isAnchor:false, ssTag:'C1', ssNote:'Superset immediately into Tricep Pushdown',
        cues:['Upper arm stays completely fixed throughout','Full supination at peak — turn the wrist out','Slow, controlled return — don\'t swing'] },
      { id:'tricep-pushdown',       name:'Tricep Pushdown',       sets:'2',   reps:'8–12',  restSecs:90,  incrPct:4,   isAnchor:false, ssTag:'C2', ssNote:'Rest 90 sec after C1+C2',
        cues:['Elbows pinned to sides — no movement at the elbow joint','Full extension at bottom — feel the tricep contract','No body swing or lean'] }
    ]
  },
  apollo: {
    id: 'apollo', name: 'APOLLO', sub: 'CNS Reset',
    color: '#4DA6FF', dim: 'rgba(77,166,255,0.07)', duration: '~55',
    warmup: [
      '2 min general movement — arm circles, shoulder rolls, thoracic rotations',
      'Band pull-aparts ×20, light face pull ×15 — rear delt and rotator cuff activation',
      'Push-ups ×15–20 controlled — feel the chest stretch at the bottom of each rep',
      'Incline barbell ramp-up: empty bar ×10 → 50% ×6 → 70% ×4 — then working weight'
    ],
    exercises: [
      { id:'incline-barbell',       name:'Incline Barbell',       sets:'3',   reps:'6–10',  restSecs:180, incrPct:2.5, isAnchor:true,  ssTag:null, ssNote:null,
        cues:['30° angle only — set shoulder blades back and DOWN before unracking','Lower to upper chest, 1-sec pause at bottom — feel the stretch','Press in a slight arc, squeeze the chest together at the top — this is the priority movement'] },
      { id:'machine-press',         name:'Machine Press',         sets:'3',   reps:'8–12',  restSecs:90,  incrPct:2,   isAnchor:false, ssTag:null, ssNote:null,
        cues:['Seat height so handles are at upper chest level','No full lockout — continuous tension on the pec throughout','2-sec controlled descent, feel the chest stretch at end range'] },
      { id:'cable-fly',             name:'Cable Fly',             sets:'2',   reps:'12–15', restSecs:0,   incrPct:3,   isAnchor:false, ssTag:'A1', ssNote:'Superset immediately into Face Pull',
        cues:['Cables at or above shoulder height — step forward to maintain tension','Hug a tree arc — elbows stay fixed, NOT a press movement','1-sec squeeze at peak, 3-sec return — the eccentric stretch is the stimulus'] },
      { id:'face-pull',             name:'Face Pull',             sets:'2',   reps:'15–20', restSecs:120, incrPct:3,   isAnchor:false, ssTag:'A2', ssNote:'Rest 2 min after A1+A2',
        cues:['Rope at face height — pull rope apart as you pull toward your face','Elbows high and wide at full contraction — external rotation is the point','Protects your shoulder for all the pressing. Don\'t rush or skip it'] },
      { id:'bulgarian-split-squat', name:'Bulgarian Split Squat', sets:'2',   reps:'7–9',   restSecs:120, incrPct:2.5, isAnchor:false, ssTag:null, ssNote:null,
        cues:['Front foot forward enough for a near-vertical shin','Descend straight down — not a lunge forward','All reps one leg before switching — drive through the front heel'] },
      { id:'forearms',              name:'Forearms',              sets:'2',   reps:'8–12',  restSecs:0,   incrPct:4,   isAnchor:false, ssTag:'B1', ssNote:'Superset into Neck Training',
        cues:['Forearm rests on thigh — only the wrist moves','Supinated wrist curl first, then pronated reverse curl','Full range of motion — don\'t cut short at either end'] },
      { id:'neck-training',         name:'Neck Training',         sets:'2',   reps:'12–20', restSecs:90,  incrPct:5,   isAnchor:false, ssTag:'B2', ssNote:'Rest 90 sec after B1+B2',
        cues:['Cable head attachment — flexion (forward) then extension (backward)','Controlled throughout — NO momentum, no jerking','Start conservative and build over months. Cervical adaptation is slow'] }
    ]
  }
};

const SESSION_CYCLE = ['atlas', 'hades', 'apollo'];

// ════════════════════════════════════════════════════════════
// 2. STRENGTH STANDARDS
// ════════════════════════════════════════════════════════════

const STANDARDS = [
  { id:'back-squat',           name:'Back Squat',          beg:0.75, int:1.25, adv:1.75, eli:2.0  },
  { id:'deadlift',             name:'Deadlift',             beg:1.0,  int:1.5,  adv:2.0,  eli:2.5  },
  { id:'incline-barbell',      name:'Incline Barbell',      beg:0.5,  int:0.85, adv:1.15, eli:1.4  },
  { id:'machine-shoulder-press',name:'Overhead Press',      beg:0.35, int:0.6,  adv:0.85, eli:1.0  },
  { id:'pull-ups',             name:'Pull-ups (+added)',    beg:0.0,  int:0.15, adv:0.4,  eli:0.65 },
  { id:'dips',                 name:'Dips (+added)',        beg:0.0,  int:0.2,  adv:0.5,  eli:0.75 },
  { id:'bulgarian-split-squat',name:'Bulgarian SS (×hand)', beg:0.2,  int:0.4,  adv:0.6,  eli:0.8  },
  { id:'incline-db-press',     name:'Incline DB Press (×hand)', beg:0.2, int:0.35, adv:0.5, eli:0.65 }
];

// ════════════════════════════════════════════════════════════
// 3. GUIDE DATA
// ════════════════════════════════════════════════════════════

const GUIDE = {
  roi: [
    { name:'Sleep',             pct:33, color:'#9B6DFF', detail:'Foundation of everything — hormones, recovery, neuroplasticity, body composition.' },
    { name:'Nutrition',         pct:26, color:'#00E587', detail:'Fuels adaptation and recovery. Cannot out-train a poor diet.' },
    { name:'Training',          pct:20, color:'#FF5C2B', detail:'The direct stimulus for muscle growth, cardiovascular health and metabolic function.' },
    { name:'Stress/Recovery',   pct:9,  color:'#4DA6FF', detail:'Chronic stress suppresses testosterone, disrupts sleep and blunts adaptation.' },
    { name:'Hydration',         pct:4,  color:'#00C8E8', detail:'2% dehydration reduces strength output 5–8%. Often the silent limiter.' },
    { name:'Light/Circadian',   pct:3,  color:'#F0CC70', detail:'Morning sunlight sets your cortisol rhythm and governs sleep quality downstream.' },
    { name:'Gut Health',        pct:2,  color:'#88D040', detail:'Microbiome diversity affects immunity, neurotransmitters and nutrient absorption.' },
    { name:'Supplements',       pct:2,  color:'#C9A84C', detail:'Marginal gains on a solid foundation. High ROI only when everything above is in order.' },
    { name:'Heat Exposure',     pct:1,  color:'#FF8040', detail:'Sauna drives cardiovascular adaptation and GH release. Valuable but supporting.' }
  ],
  supplements: [
    { name:'Creatine Monohydrate', amt:'5g',         timing:'Anytime daily',          note:'Same time every day — saturation depends on consistency, not timing.',               flag:'good' },
    { name:'Whey Protein',         amt:'As needed',  timing:'Post-training / as needed',note:'Only when food falls short of 175g protein target.',                               flag:null },
    { name:'Collagen',             amt:'10–15g',     timing:'30–60 min pre-training',  note:'With vitamin C source — connective tissue synthesis benefit.',                      flag:null },
    { name:'Multivitamin A-Z',     amt:'Per label',  timing:'Breakfast 08:15',         note:'With food for fat-soluble absorption. Check D3 vs standalone dose.',                flag:null },
    { name:'Omega-3 (Essential)',  amt:'3 capsules', timing:'With fattiest meal',       note:'Each capsule = 600mg EPA/DHA. 1 capsule insufficient — take 3.',                   flag:'warn' },
    { name:'Vitamin D3',           amt:'2500 IU',    timing:'With fattiest meal',       note:'Good dose. Account for D3 in multivitamin.',                                       flag:'good' },
    { name:'Magnesium',            amt:'300–400mg',  timing:'30–60 min before bed',     note:'Switch oxide → glycinate form. Significantly better absorbed.',                   flag:'warn' },
    { name:'Electrolytes',         amt:'1 serving',  timing:'Training + hot days',      note:'650mg sodium. Don\'t limit to training only in Tenerife heat.',                   flag:'good' }
  ],
  meals: [
    { time:'07:45', title:'Breakfast',          sub:'Porridge bowl or eggs / bacon / avocado',
      desc:'Option A: whole milk porridge, muesli, yogurt, peanut butter, honey — ~35–40g protein. Option B: eggs, bacon, avocado, butter, bread — ~45–50g protein, ~850 kcal.',
      color:'#00E587' },
    { time:'11:30', title:'Mid-morning Snack',  sub:'Figs, nuts, banana, yogurt',
      desc:'Deliberate calorie insertion. Add 2 boiled eggs or sardines to meaningfully improve protein distribution.',
      color:'#C9A84C' },
    { time:'13:00', title:'Lunch',              sub:'Previous night\'s dinner',
      desc:'Large portion of the evening meal. Zero decision fatigue. Consistent protein hit.',
      color:'#4DA6FF' },
    { time:'16:00', title:'Afternoon Snack',    sub:'Protein shake + fruit / yogurt',
      desc:'The 3-hour gap between lunch and dinner is the day\'s weakest point. A whey shake with milk or large Greek yogurt + fruit bridges this gap and keeps protein synthesis elevated.',
      color:'#9B6DFF' },
    { time:'19:00', title:'Dinner',             sub:'Weighed meat + carb + veg',
      desc:'Chicken/rice/broccoli or beef/pasta. Protein weighed. Generous Kerrygold and olive oil. Glass of whole milk. Most controlled meal of the day.',
      color:'#FF5C2B' },
    { time:'22:00', title:'Pre-bed Meal',       sub:'Cereal + 250g yogurt + peanut butter',
      desc:'Casein-rich yogurt supports overnight muscle protein synthesis. Don\'t skip this on late nights.',
      color:'#88D040' }
  ],
  morning: [
    { time:'07:00', title:'Wake — no snooze',       color:'#C9A84C', desc:'Alarm across the room. Snooze cycles deepen grogginess — 18 minutes of fragmented sleep amplifies sleep inertia, not resolves it.' },
    { time:'07:00', title:'500ml water + electrolytes', color:'#00C8E8', desc:'Immediately on waking. Overnight dehydration is a primary driver of morning grogginess. Rehydrate before anything else.' },
    { time:'07:05', title:'Open son\'s blinds',       color:'#00E587', desc:'Natural light begins your circadian reset. School run — no sunglasses. 10 min direct Tenerife sun is more powerful than most supplements.' },
    { time:'07:45', title:'Breakfast + matcha',        color:'#F0CC70', desc:'Porridge or eggs/bacon/avocado. Matcha: ½–1 tsp max. 1 tbsp = ~280mg caffeine before your espresso — too much stacking.' },
    { time:'08:15', title:'Supplements',               color:'#585856', desc:'Multivitamin, Omega-3 (3 caps), Vitamin D3 with food. Magnesium moves to bedtime.' },
    { time:'08:30', title:'School run by bike',        color:'#00E587', desc:'10+ min direct morning sun — no sunglasses. Photoreceptors in the eyes are the primary circadian driver.' },
    { time:'09:00+','title':'First double espresso',   color:'#FF5C2B', desc:'Delayed ~90 min post-wake. Cortisol peaks naturally at 30–45 min — let it work first, then layer caffeine on top.' },
    { time:'12:00', title:'Second double espresso',    color:'#585856', desc:'Last caffeine of the day. 6-hour half-life means 60mg+ still circulating at midnight without this rule.' },
    { time:'22:30', title:'Magnesium glycinate',       color:'#4DA6FF', desc:'300–400mg, 30–60 min before sleep. Switch from oxide form. Sleep quality improvement compounds over weeks.' }
  ],
  recovery: [
    { name:'Sauna / Hot Bath', color:'#FF8040', freq:'2–3× per week on rest days only',
      points:['Do NOT use within 2 hours of training — blunts the acute inflammatory signal that drives adaptation','On rest days or evenings of training days, heat is beneficial — vasodilation, GH release, parasympathetic shift','Robust evidence for cardiovascular adaptation and longevity markers from regular sauna use','Mental reset value on rest days is real and hard to quantify — leverage it'] },
    { name:'Sleep Protocol',   color:'#9B6DFF', freq:'7–9 hours. The highest ROI item in the guide',
      points:['The two nights after Hades are disproportionately important — deadlift sessions create the most CNS demand','Consistent 07:00 wake time regardless of when you sleep — the wake anchor sets the circadian clock','Dark, cool room. Magnesium glycinate 30–60 min before bed consistently','Don\'t train on fewer than 6 hours sleep if avoidable — anabolic signalling is meaningfully blunted'] },
    { name:'Breathing',        color:'#4DA6FF', freq:'Post-session and as needed',
      points:['Box breathing (4 in / 4 hold / 4 out / 4 hold) for 5 min post-heavy session shifts sympathetic to parasympathetic','Physiological sigh (double inhale through nose, long exhale) is the fastest known acute stress reducer','Nasal breathing during walking improves CO₂ tolerance and sleep quality over time','5-min walk post-session is not optional — actively assists recovery and down-regulation'] },
    { name:'Hydration',        color:'#00C8E8', freq:'2.5–3L daily minimum',
      points:['500ml with electrolytes immediately on waking — before coffee, before food','Electrolytes during training and on hot Tenerife days — 650mg sodium per serve is well dosed','Pale yellow urine is the target — reliable real-time dehydration indicator','Thirst signal lags actual dehydration by a meaningful margin — don\'t rely on it alone'] },
    { name:'Cold Exposure',    color:'#88D040', freq:'Not recommended post-training',
      points:['Cold immersion post-training significantly blunts hypertrophic adaptation — stronger evidence than the heat equivalent','If using cold exposure, minimum 4 hours after training or on rest days only','No strong rationale for cold at current goals given warm climate and no endurance sport component','Contrast therapy (hot→cold) on rest days is acceptable if desired'] },
    { name:'Active Recovery',  color:'#F0CC70', freq:'Rest days are not sedentary days',
      points:['Walking, light cycling, swimming — low intensity movement maintains blood flow without adding stress','Tenerife offers excellent outdoor activity — leverage the climate on rest days','Full ROM joint movement on rest days maintains mobility without adding soreness','Progressive overload is only productive because of recovery periods — protect them as seriously as training'] }
  ],
  lifestyle: [
    { name:'Gut Health',             color:'#88D040',
      points:['Target 30+ different plant foods per week — diversity is the primary microbiome health metric','Daily fermented foods: Greek yogurt, kefir if available — live cultures matter','Fibre minimum 30g daily — oats, legumes, vegetables, fruit, whole grains','Minimise ultra-processed food, refined sugar and artificial sweeteners — all documented microbiome disruptors'] },
    { name:'Flexibility & ROM',      color:'#4DA6FF',
      points:['Full ROM on every exercise in the programme is more valuable than dedicated stretching sessions','Post-session stretching (chest, hip flexors, hamstrings) compounds significantly over months for just 5 minutes','Thoracic mobility is the most limiting factor for most pressing athletes — extensions over bench daily','Deep squat and full hip hinge patterns with true ROM prevent the restriction patterns that accumulate over time'] },
    { name:'Sunlight & Vitamin D',   color:'#F0CC70',
      points:['Morning sunlight without sunglasses within 60 minutes of waking — the most powerful free circadian intervention','Despite Tenerife, supplement 2500 IU D3 daily — years in Ireland likely created a deficiency not yet corrected','Mid-day Tenerife sun is intense — high SPF at peak hours is sensible. Low-angle morning sun has lower UV risk','D3 plays documented roles in testosterone production, muscle function, immune regulation and mood stabilisation'] },
    { name:'Caffeine Strategy',      color:'#FF5C2B',
      points:['Total daily: ½–1 tsp matcha + 2 double espressos = 190–320mg — upper end of optimal range','Delay first caffeine 60–90 min after waking — let natural cortisol peak work first','Last caffeine by 12:00 — 6-hour half-life means 60mg+ still active at midnight','Periodic breaks (5–7 days every 6–8 weeks) restore full caffeine sensitivity — tolerance builds within a week'] },
    { name:'Stress & Mental Health', color:'#9B6DFF',
      points:['Chronic stress elevates cortisol which directly suppresses testosterone and growth hormone — the hormones you need','The consistency built this year is itself a stress-management tool — routine creates psychological stability','Training from identity and enjoyment is more durable than training from feeling too skinny — both work, one compounds better','Sleep, training, good food and morning sunlight are evidence-based mood regulators — the lifestyle IS the mental health protocol'] },
    { name:'Cardiovascular Health',  color:'#00C8E8',
      points:['Your training already provides significant cardiovascular stimulus through compound movements and density of work','Walking daily — particularly Tenerife terrain — provides Zone 2 cardiovascular work that compounds over time','Nasal breathing during low-intensity activity is the simplest cardiovascular health habit available','Sauna 2–3× weekly adds meaningful cardiovascular adaptation independent of exercise — VO2max and HRV both improve'] }
  ]
};

// ════════════════════════════════════════════════════════════
// 4. STORAGE
// ════════════════════════════════════════════════════════════

const Store = {
  KEY: 'dt_v2',

  defaults() {
    return { v:2, profile:{ bodyweight:81, targetWeight:90, targetBF:14 },
             bwLog:[], sessions:[], exerciseLog:{} };
  },

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || this.defaults(); }
    catch(_) { return this.defaults(); }
  },

  set(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch(e) { console.warn('Storage:', e); }
  },

  // ── Bodyweight ──────────────────────────────────────────
  logBW(weight) {
    const d = this.get();
    const entry = { ts: Date.now(), date: todayStr(), weight: +parseFloat(weight).toFixed(1) };
    d.bwLog.push(entry);
    d.profile.bodyweight = entry.weight;
    this.set(d);
    return entry;
  },

  getBWHistory(days) {
    const d = this.get();
    if (!days) return d.bwLog;
    const cutoff = Date.now() - days * 86400000;
    return d.bwLog.filter(e => e.ts >= cutoff);
  },

  latestBW() {
    const h = this.get().bwLog;
    return h.length ? h[h.length-1].weight : this.get().profile.bodyweight;
  },

  // ── Exercise log ────────────────────────────────────────
  logWeight(exId, weight) {
    if (!exId || isNaN(+weight)) return;
    const d = this.get();
    if (!d.exerciseLog[exId]) d.exerciseLog[exId] = [];
    d.exerciseLog[exId].push({ ts: Date.now(), date: todayStr(), week: weekKey(new Date()), weight: +parseFloat(weight).toFixed(2) });
    this.set(d);
  },

  lastWeight(exId) {
    const entries = (this.get().exerciseLog[exId] || []);
    return entries.length ? entries[entries.length-1].weight : null;
  },

  recommended(exId, incrPct) {
    const last = this.lastWeight(exId);
    if (last === null) return null;
    if (!incrPct) return last;
    return Math.round(last * (1 + incrPct/100) * 4) / 4;
  },

  allPRs() {
    const d = this.get();
    const prs = {};
    Object.entries(d.exerciseLog).forEach(([id, entries]) => {
      if (!entries.length) return;
      const best = entries.reduce((m,e) => e.weight > m.weight ? e : m, entries[0]);
      prs[id] = best;
    });
    return prs;
  },

  // ── Sessions ────────────────────────────────────────────
  saveSession(sessionId, durationSecs, exerciseWeights) {
    const d = this.get();
    const sess = { id: `s_${Date.now()}`, sessionId, date: todayStr(), week: weekKey(new Date()), duration: durationSecs, exercises: exerciseWeights };
    d.sessions.unshift(sess);
    // Also update exerciseLog
    exerciseWeights.forEach(({ exId, weight }) => { if (weight) this.logWeight(exId, weight); });
    this.set(d);
    return sess;
  },

  lastSessionId() {
    const s = this.get().sessions;
    return s.length ? s[0].sessionId : null;
  },

  nextSession() {
    const last = this.lastSessionId();
    if (!last) return 'atlas';
    const idx = SESSION_CYCLE.indexOf(last);
    return SESSION_CYCLE[(idx + 1) % 3];
  },

  weeklyGroups() {
    const d = this.get();
    const groups = {};
    d.sessions.forEach(s => {
      if (!groups[s.week]) groups[s.week] = [];
      groups[s.week].push(s);
    });
    const sorted = {};
    Object.keys(groups).sort().reverse().forEach(k => sorted[k] = groups[k]);
    return sorted;
  },

  sessionsThisWeek() {
    const wk = weekKey(new Date());
    return (this.get().sessions.filter(s => s.week === wk)).length;
  },

  totalSessions() { return this.get().sessions.length; },

  // ── Export ──────────────────────────────────────────────
  exportCSV() {
    const d = this.get();
    const rows = ['Date,Session,Exercise,Weight (kg)'];
    d.sessions.forEach(s => {
      s.exercises.forEach(e => {
        if (e.weight) rows.push(`${s.date},${s.sessionId},${e.exId},${e.weight}`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dorian-triad-log-${todayStr()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }
};

// ════════════════════════════════════════════════════════════
// 5. UTILITIES
// ════════════════════════════════════════════════════════════

function todayStr() { return new Date().toISOString().slice(0,10); }

function isoWeek(d) {
  const u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  u.setUTCDate(u.getUTCDate() + 4 - (u.getUTCDay()||7));
  const y1 = new Date(Date.UTC(u.getUTCFullYear(),0,1));
  return Math.ceil((((u-y1)/86400000)+1)/7);
}

function weekKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-W${String(isoWeek(dt)).padStart(2,'0')}`;
}

function weekRange(wk) {
  const [yr,w] = wk.split('-W').map(Number);
  const d = new Date(yr,0,1+(w-1)*7);
  d.setDate(d.getDate()-d.getDay()+1);
  const e = new Date(d); e.setDate(e.getDate()+6);
  const f = x => x.toLocaleDateString('en-IE',{day:'numeric',month:'short'});
  return `${f(d)} – ${f(e)}`;
}

function fmtDur(secs) {
  const m = Math.floor(secs/60), s = secs%60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function fmtClock(secs) {
  return `${pad(Math.floor(secs/3600))}:${pad(Math.floor(secs%3600/60))}:${pad(secs%60)}`;
}

function fmtRest(secs) {
  return `${Math.floor(secs/60)}:${pad(secs%60)}`;
}

function pad(n) { return String(Math.floor(n)).padStart(2,'0'); }

function fmtDate(str) {
  return new Date(str+'T12:00:00').toLocaleDateString('en-IE',{weekday:'short',day:'numeric',month:'short'});
}

function beep() {
  try {
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.frequency.setValueAtTime(880, ac.currentTime);
    g.gain.setValueAtTime(0.25, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+0.5);
    o.start(); o.stop(ac.currentTime+0.5);
  } catch(_) {}
}

function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }
function qs(sel) { return document.querySelector(sel); }
function el(id) { return document.getElementById(id); }

// ════════════════════════════════════════════════════════════
// 6. SESSION TIMER
// ════════════════════════════════════════════════════════════

const SessionTimer = {
  _start: null, _iv: null,
  start() {
    this._start = Date.now();
    this._iv = setInterval(() => {
      const d = el('wk-timer');
      if (d) d.textContent = fmtClock(Math.floor((Date.now()-this._start)/1000));
    }, 1000);
  },
  stop() { clearInterval(this._iv); this._iv = null; },
  elapsed() { return this._start ? Math.floor((Date.now()-this._start)/1000) : 0; }
};

// ════════════════════════════════════════════════════════════
// 7. REST TIMER
// ════════════════════════════════════════════════════════════

const RestTimer = {
  _total:0, _left:0, _iv:null,

  start(seconds, label) {
    clearInterval(this._iv);
    this._total = seconds; this._left = seconds;
    const panel=el('rest-panel'), cnt=el('rest-count'), fill=el('rest-fill'), lbl=el('rest-label');
    if (!panel) return;
    if (lbl) lbl.textContent = label || 'Rest';
    panel.classList.add('up'); vib(40);
    if (cnt) { cnt.textContent = fmtRest(this._left); cnt.classList.remove('ending'); }
    if (fill) { fill.style.width='0%'; fill.classList.remove('ending'); }
    this._iv = setInterval(() => this._tick(), 1000);
  },

  _tick() {
    this._left = Math.max(0, this._left-1);
    const pct = ((this._total-this._left)/this._total)*100;
    const cnt=el('rest-count'), fill=el('rest-fill');
    if (cnt) { cnt.textContent = fmtRest(this._left); cnt.classList.toggle('ending', this._left<=10); }
    if (fill) { fill.style.width=pct+'%'; fill.classList.toggle('ending', this._left<=10); }
    if (this._left<=0) { clearInterval(this._iv); beep(); vib([200,100,200]); setTimeout(()=>this.dismiss(),2000); }
  },

  dismiss() {
    clearInterval(this._iv);
    const p = el('rest-panel');
    if (p) p.classList.remove('up');
  },

  add(n) {
    this._left += n; this._total += n;
    const cnt=el('rest-count'); if(cnt) cnt.textContent = fmtRest(this._left);
  }
};

// ════════════════════════════════════════════════════════════
// 8. CHARTS
// ════════════════════════════════════════════════════════════

const Charts = {
  roi(canvas) {
    if (!canvas) return;
    const C = GUIDE.roi;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth * devicePixelRatio;
    const H = canvas.offsetHeight * devicePixelRatio;
    canvas.width = W; canvas.height = H;
    const cx=W/2, cy=H/2, ro=Math.min(cx,cy)*0.82, ri=ro*0.54;
    let a = -Math.PI/2;
    C.forEach(d => {
      const sw = (d.pct/100)*2*Math.PI;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,ro,a,a+sw); ctx.closePath();
      ctx.fillStyle=d.color; ctx.fill();
      ctx.strokeStyle='#090909'; ctx.lineWidth=2*devicePixelRatio; ctx.stroke();
      a += sw;
    });
    ctx.beginPath(); ctx.arc(cx,cy,ri,0,2*Math.PI);
    ctx.fillStyle='#090909'; ctx.fill();
    ctx.fillStyle='#C9A84C';
    ctx.font=`700 ${14*devicePixelRatio}px Barlow Condensed,sans-serif`;
    ctx.textAlign='center'; ctx.fillText('HEALTH',cx,cy-4*devicePixelRatio);
    ctx.fillStyle='#585856';
    ctx.font=`${10*devicePixelRatio}px DM Sans,sans-serif`;
    ctx.fillText('ROI',cx,cy+12*devicePixelRatio);
  },

  bwTrend(canvas, history, targetBW) {
    if (!canvas || !history.length) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth * devicePixelRatio;
    const H = canvas.offsetHeight * devicePixelRatio;
    canvas.width = W; canvas.height = H;
    const PAD = { t:16*devicePixelRatio, r:16*devicePixelRatio, b:24*devicePixelRatio, l:44*devicePixelRatio };
    const cW = W-PAD.l-PAD.r, cH = H-PAD.t-PAD.b;
    const weights = history.map(e=>e.weight);
    const minW = Math.min(...weights, targetBW||0)-2;
    const maxW = Math.max(...weights, targetBW||0)+2;
    const scaleX = i => PAD.l + (i/(history.length-1||1))*cW;
    const scaleY = w => PAD.t + cH - ((w-minW)/(maxW-minW))*cH;

    // Grid lines
    ctx.strokeStyle='rgba(30,32,30,1)'; ctx.lineWidth=devicePixelRatio;
    for (let i=0;i<=4;i++) {
      const y = PAD.t + (i/4)*cH;
      ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(W-PAD.r,y); ctx.stroke();
      const val = maxW - (i/4)*(maxW-minW);
      ctx.fillStyle='#585856'; ctx.font=`${9*devicePixelRatio}px DM Sans,sans-serif`;
      ctx.textAlign='right'; ctx.fillText(val.toFixed(1), PAD.l-6*devicePixelRatio, y+3*devicePixelRatio);
    }

    // Target line
    if (targetBW) {
      const ty = scaleY(targetBW);
      ctx.strokeStyle='rgba(201,168,76,0.3)'; ctx.lineWidth=devicePixelRatio;
      ctx.setLineDash([4*devicePixelRatio,4*devicePixelRatio]);
      ctx.beginPath(); ctx.moveTo(PAD.l,ty); ctx.lineTo(W-PAD.r,ty); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#C9A84C'; ctx.font=`${9*devicePixelRatio}px DM Sans,sans-serif`;
      ctx.textAlign='right'; ctx.fillText(`${targetBW}kg`, W-PAD.r, ty-3*devicePixelRatio);
    }

    if (history.length < 2) {
      // Single point
      const x=scaleX(0), y=scaleY(history[0].weight);
      ctx.beginPath(); ctx.arc(x,y,4*devicePixelRatio,0,Math.PI*2);
      ctx.fillStyle='#00E587'; ctx.fill();
      return;
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0,PAD.t,0,H-PAD.b);
    grad.addColorStop(0,'rgba(0,229,135,0.2)'); grad.addColorStop(1,'rgba(0,229,135,0)');
    ctx.beginPath();
    history.forEach((e,i) => { const x=scaleX(i),y=scaleY(e.weight); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.lineTo(scaleX(history.length-1), H-PAD.b);
    ctx.lineTo(scaleX(0), H-PAD.b);
    ctx.closePath(); ctx.fillStyle=grad; ctx.fill();

    // Line
    ctx.strokeStyle='#00E587'; ctx.lineWidth=2*devicePixelRatio; ctx.lineJoin='round';
    ctx.beginPath();
    history.forEach((e,i) => { const x=scaleX(i),y=scaleY(e.weight); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.stroke();

    // Dots
    history.forEach((e,i) => {
      const x=scaleX(i), y=scaleY(e.weight);
      ctx.beginPath(); ctx.arc(x,y,3*devicePixelRatio,0,Math.PI*2);
      ctx.fillStyle='#00E587'; ctx.fill();
    });
  }
};

// ════════════════════════════════════════════════════════════
// 9. VIEWS
// ════════════════════════════════════════════════════════════

const Views = {

  // ── HOME ─────────────────────────────────────────────────
  home() {
    const d = Store.get();
    const bw = Store.latestBW();
    const tgt = d.profile.targetWeight;
    const nextId = Store.nextSession();
    const next = SESSIONS[nextId];
    const totalSess = Store.totalSessions();
    const weekSess  = Store.sessionsThisWeek();
    const lastDate  = d.sessions.length ? fmtDate(d.sessions[0].date) : 'Not started';
    const now = new Date();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    // Progress to target
    const bwPct = Math.min(Math.round(((bw-75)/(tgt-75))*100), 100);

    return `
    <div class="page">
      <div class="home-hero">
        <div class="hero-date">${dateStr}</div>
        <div class="hero-greeting">DORIAN <span>TRIAD</span></div>
        <div class="hero-stats">
          <div class="hero-stat"><div class="hero-stat-val">${totalSess}</div><div class="hero-stat-lbl">Sessions</div></div>
          <div class="hero-stat"><div class="hero-stat-val">${weekSess}</div><div class="hero-stat-lbl">This week</div></div>
          <div class="hero-stat"><div class="hero-stat-val">${bw}kg</div><div class="hero-stat-lbl">Current</div></div>
        </div>
      </div>

      <div class="section-label">Next Session</div>
      <div class="next-session-card" style="background:${next.dim};border-color:${next.color}30;">
        <div class="next-session-head">
          <div>
            <div class="next-session-name" style="color:${next.color};">${next.name}</div>
            <div class="next-session-sub">${next.sub} · ~${next.duration} min</div>
          </div>
          <button class="next-session-btn" style="background:${next.color};border-color:${next.color};color:#090909;"
            onclick="App.startWorkout('${nextId}')">Start</button>
        </div>
      </div>

      <div class="section-label">Bodyweight</div>
      <div class="card">
        <div class="bw-card">
          <div class="bw-info">
            <div class="bw-val">${bw}<span style="font-size:16px;color:var(--text3);font-weight:400;">kg</span></div>
            <div class="bw-target">Target: <span>${tgt}kg</span> · &lt;${d.profile.targetBF}% BF</div>
            <div style="margin-top:8px;" class="progress-track">
              <div class="progress-fill atlas" style="width:${bwPct}%;"></div>
            </div>
            <div style="font-size:10px;color:var(--text3);margin-top:3px;">${bwPct}% to target</div>
          </div>
          <div class="bw-entry">
            <input class="bw-input" type="number" id="bw-quick-input" inputmode="decimal"
              placeholder="${bw}" step="0.1" min="50" max="200">
            <button class="bw-log-btn" onclick="App.logBW()">Log</button>
          </div>
        </div>
      </div>

      <div class="section-label">Daily Targets</div>
      <div class="card">
        <div class="macro-reminder">
          <div class="macro-item"><div class="macro-val" style="color:var(--gold-l);">3200</div><div class="macro-lbl">kcal</div></div>
          <div class="macro-item"><div class="macro-val" style="color:var(--atlas);">175g</div><div class="macro-lbl">protein</div></div>
          <div class="macro-item"><div class="macro-val" style="color:var(--apollo);">360g</div><div class="macro-lbl">carbs</div></div>
          <div class="macro-item"><div class="macro-val" style="color:var(--hades);">100g</div><div class="macro-lbl">fat</div></div>
        </div>
      </div>

      <div class="section-label">Last Session</div>
      <div class="card">
        <div class="card-row">
          <div style="font-size:13px;color:var(--text2);">Last trained</div>
          <div style="font-size:13px;color:var(--text);font-weight:500;">${lastDate}</div>
        </div>
        <div class="card-row">
          <div style="font-size:13px;color:var(--text2);">Rolling cycle</div>
          <div style="display:flex;gap:6px;">
            ${SESSION_CYCLE.map(id=>{
              const s=SESSIONS[id];
              const isCur = id===nextId;
              return `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;
                background:${isCur?s.color+'22':'transparent'};
                color:${isCur?s.color:'var(--text3)'};
                border:.5px solid ${isCur?s.color+'50':'var(--border)'};
                font-family:var(--fn-head);letter-spacing:.06em;">${s.name}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  // ── WORKOUT ──────────────────────────────────────────────
  workout() {
    const cards = SESSION_CYCLE.map(id => {
      const s = SESSIONS[id];
      const d = Store.get();
      const last = d.sessions.find(x=>x.sessionId===id);
      const lastDate = last ? fmtDate(last.date) : 'Not yet trained';
      const anchors = s.exercises.filter(e=>e.isAnchor).map(e=>
        `<span class="session-card-ex anchor">${e.name}</span>`).join('');
      const others = s.exercises.filter(e=>!e.isAnchor).map(e=>
        `<span class="session-card-ex">${e.name}</span>`).join('');
      return `
      <div class="session-card" style="background:${s.dim};border-color:${s.color}30;"
        onclick="App.startWorkout('${id}')">
        <div class="session-card-head">
          <div>
            <div class="session-card-name" style="color:${s.color};">${s.name}</div>
            <div class="session-card-sub">${s.sub}</div>
          </div>
          <div class="session-card-meta">
            <div class="session-card-time" style="color:${s.color};">~${s.duration} min</div>
            <div class="session-card-last">${lastDate}</div>
          </div>
        </div>
        <div class="session-card-exercises">${anchors}${others}</div>
      </div>`;
    }).join('');

    return `<div class="page">
      <div class="section-label">Choose Session</div>
      <div class="session-select-grid">${cards}</div>
    </div>`;
  },

  // ── LOG ──────────────────────────────────────────────────
  log() {
    const groups = Store.weeklyGroups();
    const weeks = Object.keys(groups);

    if (!weeks.length) return `
      <div class="page">
        <div class="log-empty">
          <p>No sessions logged yet.</p>
          <small>Start a workout from the Workout tab<br>to begin tracking your progress.</small>
        </div>
      </div>`;

    const weeksHtml = weeks.map(wk => {
      const sessions = groups[wk];
      const sessHtml = sessions.map(s => {
        const sess = SESSIONS[s.sessionId];
        const exHtml = (s.exercises||[]).filter(e=>e.weight).map(e=>{
          const exData = sess.exercises.find(x=>x.id===e.exId);
          return `<div class="log-ex-row">
            <span class="log-ex-name">${exData?exData.name:e.exId}</span>
            <span class="log-ex-wt" style="color:${sess.color};">${e.weight}kg</span>
          </div>`;
        }).join('');
        return `
        <div class="log-session-card">
          <div class="log-session-head" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <div class="log-session-dot" style="background:${sess.color};"></div>
            <div class="log-session-name">${sess.name}</div>
            <div class="log-session-date">${fmtDate(s.date)}</div>
            <div class="log-session-dur">${s.duration?fmtDur(s.duration):''}</div>
            <div class="log-session-toggle">▾</div>
          </div>
          <div class="log-ex-rows hidden">${exHtml||'<div style="padding:10px 16px;font-size:12px;color:var(--text3);">No weights logged</div>'}</div>
        </div>`;
      }).join('');
      return `
      <div class="log-week">
        <div class="log-week-hdr">
          <span class="log-week-key">${wk}</span>
          <span class="log-week-dates">${weekRange(wk)}</span>
        </div>
        ${sessHtml}
      </div>`;
    }).join('');

    return `<div class="page">
      <div class="section-label">History</div>
      ${weeksHtml}
      <div class="export-row">
        <button class="btn btn-ghost" onclick="App.exportCSV()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>
    </div>`;
  },

  // ── GUIDE ────────────────────────────────────────────────
  guide() {
    const sections = [
      { id:'roi',          icon:'📊', color:'#C9A84C', title:'Health ROI' },
      { id:'programme',    icon:'🗓',  color:'#00E587', title:'The Programme' },
      { id:'nutrition',    icon:'🥗',  color:'#88D040', title:'Daily Nutrition' },
      { id:'supplements',  icon:'💊',  color:'#9B6DFF', title:'Supplement Stack' },
      { id:'recovery',     icon:'🛌',  color:'#4DA6FF', title:'Sleep & Recovery' },
      { id:'morning',      icon:'☀️',  color:'#F0CC70', title:'Morning Routine' },
      { id:'lifestyle',    icon:'🌿',  color:'#00C8E8', title:'Lifestyle Factors' },
    ];
    const navHtml = sections.map(s=>
      `<button class="guide-nav-btn" onclick="App.scrollGuideSection('${s.id}')">${s.title}</button>`
    ).join('');
    const secHtml = sections.map(s=>`
      <div class="guide-section" id="gsec-${s.id}">
        <div class="guide-section-card" id="gcard-${s.id}">
          <div class="guide-section-hdr" onclick="App.toggleGuide('${s.id}')">
            <div class="guide-section-icon" style="background:${s.color}18;">${s.icon}</div>
            <div class="guide-section-title">${s.title}</div>
            <div class="guide-section-arrow">▾</div>
          </div>
          <div class="guide-section-body" id="gbody-${s.id}"></div>
        </div>
      </div>`
    ).join('');

    return `
    <div class="guide-nav">${navHtml}</div>
    <div style="padding:10px 0 20px;">${secHtml}</div>`;
  },

  // ── STATS ────────────────────────────────────────────────
  stats() {
    const d = Store.get();
    const bw = Store.latestBW();
    const bwHistory = Store.getBWHistory(90);
    const prs = Store.allPRs();
    const total = Store.totalSessions();
    const thisWk = Store.sessionsThisWeek();

    const prHtml = Object.keys(prs).length
      ? Object.entries(prs).map(([id,e])=>{
          const name = id.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
          const sess = Object.values(SESSIONS).find(s=>s.exercises.some(ex=>ex.id===id));
          const col = sess ? sess.color : 'var(--gold)';
          return `<div class="pr-row">
            <div class="pr-ex">${name}</div>
            <div class="pr-wt" style="color:${col};">${e.weight}kg</div>
            <div class="pr-date">${fmtDate(e.date)}</div>
          </div>`;
        }).join('')
      : '<div style="padding:14px 16px;font-size:12px;color:var(--text3);">No lifts logged yet</div>';

    const strRows = STANDARDS.map(s=>{
      const begKg  = (s.beg*bw).toFixed(1);
      const intKg  = (s.int*bw).toFixed(1);
      const advKg  = (s.adv*bw).toFixed(1);
      const eliKg  = (s.eli*bw).toFixed(1);
      const best   = Store.lastWeight(s.id);
      let pct=0, cls='';
      if (best!==null) { pct=Math.round((best/parseFloat(intKg))*100); cls=pct>=100?'achieved':pct>=80?'near':''; }
      return `<tr>
        <td class="col-ex">${s.name}</td>
        <td class="col-beg">${begKg}</td>
        <td class="col-int">${intKg}</td>
        <td class="col-adv">${advKg}</td>
        <td class="col-eli">${eliKg}</td>
        <td class="col-cur">${best!==null?best+'kg':'<span style="color:var(--text3)">—</span>'}</td>
        <td class="col-prog">
          <div class="progress-track" style="width:100%;margin-bottom:3px;">
            <div class="progress-fill ${cls}" style="width:${Math.min(pct,100)}%;"></div>
          </div>
          <span class="prog-pct ${cls}">${best!==null?pct+'%':'—'}</span>
        </td>
      </tr>`;
    }).join('');

    return `<div class="stats-page">
      <div class="section-label">Progress</div>
      <div class="card chart-card">
        <div class="chart-title">Bodyweight Trend</div>
        <canvas id="bw-chart" class="chart-canvas"></canvas>
        <div class="bw-stats-row">
          <div class="bw-stat-box">
            <div class="bw-stat-val" style="color:var(--text);">${bw}kg</div>
            <div class="bw-stat-lbl">Current</div>
          </div>
          <div class="bw-stat-box">
            <div class="bw-stat-val" style="color:var(--gold);">${d.profile.targetWeight}kg</div>
            <div class="bw-stat-lbl">Target</div>
          </div>
          <div class="bw-stat-box">
            <div class="bw-stat-val" style="color:${bwHistory.length>=2?(bwHistory[bwHistory.length-1].weight-bwHistory[0].weight>=0?'var(--atlas)':'var(--hades)'):'var(--text3)'};">
              ${bwHistory.length>=2?(bwHistory[bwHistory.length-1].weight-bwHistory[0].weight>=0?'+':'')+((bwHistory[bwHistory.length-1].weight-bwHistory[0].weight).toFixed(1))+'kg':'—'}
            </div>
            <div class="bw-stat-lbl">90-day</div>
          </div>
        </div>
      </div>

      <div class="section-label">Session Summary</div>
      <div class="card">
        <div class="card-row"><div style="font-size:13px;color:var(--text2);">Total sessions</div><div class="mono" style="font-size:16px;font-weight:600;">${total}</div></div>
        <div class="card-row"><div style="font-size:13px;color:var(--text2);">This week</div><div class="mono" style="font-size:16px;font-weight:600;color:var(--gold);">${thisWk}</div></div>
      </div>

      <div class="section-label">Strength Standards</div>
      <div class="card">
        <div class="str-bw-row">
          <div class="str-bw-label">Bodyweight for calculations</div>
          <input class="str-bw-input" type="number" inputmode="decimal"
            id="str-bw-input" value="${bw}" step="0.1" oninput="App.updateStdBW(this.value)">
          <div class="str-bw-unit">kg</div>
        </div>
        <div class="str-table-wrap">
          <table class="str-table" id="str-table">
            <thead><tr>
              <th>Exercise</th><th class="col-beg">Beg.</th><th class="col-int">Inter.</th>
              <th class="col-adv">Adv.</th><th class="col-eli">Elite</th>
              <th>Best</th><th>vs Inter.</th>
            </tr></thead>
            <tbody>${strRows}</tbody>
          </table>
        </div>
        <div class="str-note">Working set weights as bodyweight multiples. Logged via Workout Mode.</div>
      </div>

      <div class="section-label">Personal Records</div>
      <div class="card"><div class="pr-grid">${prHtml}</div></div>
    </div>`;
  }
};

// ════════════════════════════════════════════════════════════
// 10. WORKOUT MODE
// ════════════════════════════════════════════════════════════

const WorkoutMode = {
  sessionId: null,
  pendingWeights: {},

  enter(sessionId) {
    this.sessionId = sessionId;
    this.pendingWeights = {};
    const s = SESSIONS[sessionId];
    const overlay = el('workout-overlay');
    overlay.innerHTML = this._buildHTML(s);
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('open'));
    SessionTimer.start();
    document.body.style.overflow = 'hidden';
  },

  exit() {
    SessionTimer.stop();
    RestTimer.dismiss();
    const overlay = el('workout-overlay');
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    }, 320);
    document.body.style.overflow = '';
    this.sessionId = null;
    this.pendingWeights = {};
  },

  _buildHTML(s) {
    const warmupHtml = s.warmup.map((step,i)=>
      `<div class="warmup-step"><div class="warmup-step-num">${i+1}</div><div>${step}</div></div>`
    ).join('');

    const exHtml = s.exercises.map(ex => {
      const last = Store.lastWeight(ex.id);
      const rec  = Store.recommended(ex.id, ex.incrPct);
      const prevTxt = rec ? `Rec: ${rec}kg` : last ? `Last: ${last}kg` : 'First session';
      const badgeHtml = ex.isAnchor
        ? `<span class="badge badge-gold">★</span>`
        : ex.ssTag ? `<span class="badge badge-ss">${ex.ssTag}</span>` : '';
      const ssNoteHtml = ex.ssNote ? `<div class="ex-ss-note">${ex.ssNote}</div>` : '';
      const cuesHtml = ex.cues.map(c=>`<li>${c}</li>`).join('');
      const restHtml = ex.restSecs > 0
        ? `<button class="ex-rest-btn" style="border-color:${s.color}50;color:${s.color};"
             onclick="App.startRest(${ex.restSecs},'${ex.name}')">⏱ ${fmtRest(ex.restSecs)}</button>`
        : `<span class="ex-rest-btn ss">→ SS</span>`;

      return `
      <div class="ex-card" data-ex-id="${ex.id}" data-anchor="${ex.isAnchor}" style="--session-col:${s.color};">
        <div class="ex-card-top">
          <button class="ex-card-name-btn" onclick="App.toggleCues(this)">
            <div class="ex-card-name">${ex.name}${badgeHtml}</div>
            <div class="ex-cue-hint">▾ technique cues</div>
          </button>
          <div class="ex-card-setsreps">${ex.sets}&thinsp;×&thinsp;${ex.reps}</div>
        </div>
        ${ssNoteHtml}
        <ul class="ex-cues hidden">${cuesHtml}</ul>
        <div class="ex-controls">
          <div class="ex-weight-group">
            <div class="ex-prev">${prevTxt}</div>
            <input class="ex-weight-input" type="number" inputmode="decimal"
              placeholder="${rec||last||''}" step="0.5" min="0"
              value="${rec||last||''}"
              data-ex-id="${ex.id}"
              onchange="App.handleWeight(this)"
              onblur="App.handleWeight(this)">
            <span class="ex-kg">kg</span>
          </div>
          <div class="ex-btns">
            ${restHtml}
            <button class="ex-done-btn" onclick="App.markDone(this)" aria-label="Mark done">✓</button>
          </div>
        </div>
        ${ex.incrPct ? `<div class="ex-incr-lbl">+${ex.incrPct}% / session</div>` : ''}
      </div>`;
    }).join('');

    return `
    <div class="wk-header" style="border-bottom-color:${s.color}50;">
      <div class="wk-session-name" style="color:${s.color};">${s.name}</div>
      <div class="wk-timer" id="wk-timer">00:00:00</div>
      <div class="wk-progress" id="wk-progress">0/${s.exercises.length}</div>
      <button class="wk-end-btn" onclick="App.exitWorkout()">End</button>
    </div>
    <div class="wk-scroll">
      <div class="warmup-card">
        <div class="warmup-header" onclick="this.nextElementSibling.classList.toggle('open')">
          <div class="warmup-title">Warm-Up Protocol</div>
          <div class="warmup-toggle">▾</div>
        </div>
        <div class="warmup-steps">${warmupHtml}</div>
      </div>
      ${exHtml}
      <div class="wk-finish">
        <button class="wk-finish-btn" onclick="App.finishSession()">Complete Session</button>
      </div>
    </div>`;
  },

  updateProgress() {
    const done = el('workout-overlay')?.querySelectorAll('.ex-card.done').length || 0;
    const total = SESSIONS[this.sessionId]?.exercises.length || 0;
    const p = el('wk-progress');
    if (p) p.textContent = `${done}/${total}`;
  },

  collectWeights() {
    const inputs = el('workout-overlay')?.querySelectorAll('.ex-weight-input') || [];
    return Array.from(inputs).map(inp => ({
      exId: inp.getAttribute('data-ex-id'),
      weight: inp.value ? parseFloat(inp.value) : null
    }));
  }
};

// ════════════════════════════════════════════════════════════
// 11. GUIDE SECTION RENDERERS
// ════════════════════════════════════════════════════════════

const GuideRenderers = {
  roi() {
    const rows = GUIDE.roi.map(r=>`
      <div class="roi-row">
        <div class="roi-color" style="background:${r.color};"></div>
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:600;">${r.name}</div>
          <div style="font-size:10px;color:var(--text3);line-height:1.4;">${r.detail}</div>
        </div>
        <div style="text-align:right;min-width:80px;">
          <div class="roi-pct" style="color:${r.color};">${r.pct}%</div>
          <div class="roi-bar-bg" style="width:80px;margin-top:4px;">
            <div class="roi-bar" style="width:${r.pct*3}px;background:${r.color};height:4px;border-radius:2px;"></div>
          </div>
        </div>
      </div>`).join('');
    return `
    <canvas id="roi-canvas" class="guide-roi-canvas" width="200" height="200" style="width:160px;height:160px;margin:12px auto;"></canvas>
    <div class="guide-insight"><strong>Key insight:</strong> Sleep and nutrition account for ~60% of your total health and performance outcome. Optimise supplements only after these are consistent.</div>
    <div class="guide-roi-grid">${rows}</div>`;
  },

  programme() {
    const cycle = [
      ['D1','ATLAS','atlas'],['D2','REST',null],['D3','HADES','hades'],
      ['D4','REST',null],['D5','APOLLO','apollo'],['D6','REST',null],['D7','REST',null]
    ];
    const pillsHtml = cycle.map(([d,n,id])=>{
      const col = id ? SESSIONS[id].color : 'var(--text4)';
      const bg  = id ? SESSIONS[id].dim   : 'transparent';
      return `<div class="cycle-pill" style="background:${bg};border-color:${col}${id?'50':'20'};">
        <div class="cycle-pill-d">${d}</div>
        <div class="cycle-pill-n" style="color:${col};font-size:${id?11:10}px;">${n}</div>
      </div>`;
    }).join('');
    const sessCards = SESSION_CYCLE.map(id=>{
      const s = SESSIONS[id];
      return `<div style="background:${s.dim};border:.5px solid ${s.color}30;border-radius:var(--r);padding:12px;">
        <div style="font-family:var(--fn-head);font-size:22px;font-weight:800;color:${s.color};">${s.name}</div>
        <div style="font-size:11px;color:var(--text3);font-style:italic;">${s.sub}</div>
        <div style="font-family:var(--fn-mono);font-size:11px;color:var(--text3);margin-top:4px;">~${s.duration} min · ${s.exercises.length} exercises</div>
      </div>`;
    }).join('');
    return `
    <div class="cycle-pills">${pillsHtml}</div>
    <p class="guide-text" style="margin:10px 0;">Not weekly — rotate continuously. Minimum one full rest day between every session. Deadlift on Hades and Incline Barbell on Apollo are the two priority movements of the programme.</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">${sessCards}</div>`;
  },

  nutrition() {
    const mealHtml = GUIDE.meals.map(m=>`
      <div class="guide-meal" style="border-left-color:${m.color};">
        <div class="guide-meal-time" style="color:${m.color};">${m.time}</div>
        <div class="guide-meal-title">${m.title}</div>
        <div style="font-size:11px;color:var(--text3);font-style:italic;margin-bottom:3px;">${m.sub}</div>
        <div class="guide-meal-desc">${m.desc}</div>
      </div>`).join('');
    return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;">
      ${[['3200','kcal','var(--gold-l)'],['175g','protein','var(--atlas)'],['360g','carbs','var(--apollo)'],['100g','fat','var(--hades)']].map(([v,l,c])=>`
      <div style="background:var(--bg2);border-radius:var(--r);padding:10px;text-align:center;border:.5px solid var(--border);">
        <div style="font-family:var(--fn-mono);font-size:16px;font-weight:600;color:${c};">${v}</div>
        <div style="font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;">${l}</div>
      </div>`).join('')}
    </div>
    <div class="guide-insight"><strong>Priority 1:</strong> Hit 175g protein. <strong>Priority 2:</strong> Maximise calories. The most important variable is intake on low-appetite days — not optimising the good days, but protecting the average.</div>
    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Pre-Workout Protocol</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;">
      ${[['–90 min','Complex meal','Pasta, rice, meat — sustained glycogen','#00E587'],['–20 min','2–3 dates','Fast glucose spike at warm-up onset','#E8C870'],['–20 min','Black coffee','CNS stimulation — double espresso','#FF5C2B'],['During','Electrolytes','650mg sodium in water throughout','#4DA6FF']].map(([t,l,d,c])=>`
      <div style="background:var(--bg2);border-radius:var(--r);padding:10px;border:.5px solid ${c}25;">
        <div style="font-family:var(--fn-mono);font-size:12px;font-weight:600;color:${c};margin-bottom:3px;">${t}</div>
        <div style="font-size:12px;font-weight:600;">${l}</div>
        <div style="font-size:10px;color:var(--text3);">${d}</div>
      </div>`).join('')}
    </div>
    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Meal Structure</div>
    <div class="guide-meal-grid">${mealHtml}</div>`;
  },

  supplements() {
    const rows = GUIDE.supplements.map(s=>`
      <tr>
        <td><strong>${s.name}</strong>${s.flag==='good'?'<span class="flag-good">✓</span>':s.flag==='warn'?'<span class="flag-warn">REVIEW</span>':''}</td>
        <td class="amt">${s.amt}</td>
        <td class="timing">${s.timing}</td>
        <td class="note">${s.note}</td>
      </tr>`).join('');
    return `
    <div class="guide-insight"><strong>Principle:</strong> Supplements occupy ~2% of the Health ROI. They earn their place only when sleep, training and nutrition are consistent. The magnesium form and omega-3 dose are the two items requiring action.</div>
    <table class="guide-table">
      <thead><tr><th>Supplement</th><th>Amount</th><th>Timing</th><th>Notes</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  },

  recovery() {
    return GUIDE.recovery.map(r=>`
      <div style="background:var(--bg2);border-left:3px solid ${r.color};border-radius:0 var(--r) var(--r) 0;padding:12px 14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
          <div style="font-size:13px;font-weight:600;color:${r.color};">${r.name}</div>
          <div style="font-size:10px;color:var(--text3);font-style:italic;">${r.freq}</div>
        </div>
        <ul class="guide-list">${r.points.map(p=>`<li>${p}</li>`).join('')}</ul>
      </div>`).join('');
  },

  morning() {
    const items = GUIDE.morning.map(item=>`
      <div class="guide-tl-item">
        <div class="guide-tl-time" style="color:${item.color};">${item.time}</div>
        <div class="guide-tl-dot" style="background:${item.color};border:2px solid ${item.color}30;"></div>
        <div class="guide-tl-title">${item.title}</div>
        <div class="guide-tl-desc">${item.desc}</div>
      </div>`).join('');
    return `
    <div class="guide-insight"><strong>Key principle:</strong> Delay first caffeine 60–90 minutes after waking. Your cortisol peaks naturally at 30–45 min — let it work first, then add caffeine on top. Already half-achieved by your 09:00+ espresso.</div>
    <div class="guide-timeline">${items}</div>`;
  },

  lifestyle() {
    return `<div style="display:flex;flex-direction:column;gap:8px;">` +
      GUIDE.lifestyle.map(l=>`
        <div style="background:var(--bg2);border-radius:var(--r);padding:12px 14px;border:.5px solid var(--border);">
          <div style="font-size:13px;font-weight:600;color:${l.color};margin-bottom:8px;">${l.name}</div>
          <ul class="guide-list">${l.points.map(p=>`<li>${p}</li>`).join('')}</ul>
        </div>`).join('') + `</div>`;
  }
};

// ════════════════════════════════════════════════════════════
// 12. APP — PUBLIC API + ROUTER
// ════════════════════════════════════════════════════════════

const App = {
  _tab: 'home',
  _guideOpen: new Set(),

  // ── Navigation ──────────────────────────────────────────
  goTab(tab) {
    this._tab = tab;
    // Update nav
    document.querySelectorAll('.nav-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    // Update topbar title
    const titles = { home:'DORIAN TRIAD', workout:'WORKOUT', log:'LOG', guide:'GUIDE', stats:'STATS' };
    const t = el('topbar-title'); if (t) t.textContent = titles[tab] || 'DORIAN TRIAD';
    // Render
    const content = el('content');
    if (!content) return;
    content.innerHTML = Views[tab] ? Views[tab]() : '';
    content.scrollTop = 0;
    this._afterRender(tab);
  },

  back() { this.goTab('home'); },

  _afterRender(tab) {
    if (tab === 'stats') {
      requestAnimationFrame(() => {
        const canvas = el('bw-chart');
        if (canvas) {
          const hist = Store.getBWHistory(90);
          Charts.bwTrend(canvas, hist, Store.get().profile.targetWeight);
        }
      });
    }
  },

  // ── Workout ─────────────────────────────────────────────
  startWorkout(sessionId) {
    WorkoutMode.enter(sessionId);
  },

  exitWorkout() {
    if (confirm('End session without saving?')) {
      WorkoutMode.exit();
    }
  },

  finishSession() {
    const secs = SessionTimer.elapsed();
    const weights = WorkoutMode.collectWeights();
    const logged = weights.filter(w => w.weight).length;
    const dur = fmtDur(secs);
    if (confirm(`Session complete ✓\nDuration: ${dur}\nExercises logged: ${logged}/${weights.length}\n\nSave and exit?`)) {
      Store.saveSession(WorkoutMode.sessionId, secs, weights);
      WorkoutMode.exit();
      this.goTab('log');
    }
  },

  // ── Exercise interactions ────────────────────────────────
  toggleCues(btn) {
    const card = btn.closest('.ex-card');
    const cues = card?.querySelector('.ex-cues');
    const hint = btn.querySelector('.ex-cue-hint');
    if (!cues) return;
    const open = cues.classList.toggle('hidden');
    if (hint) hint.textContent = open ? '▾ technique cues' : '▴ hide cues';
    card.classList.toggle('cues-open', !open);
  },

  handleWeight(input) {
    const exId = input.getAttribute('data-ex-id');
    const w = parseFloat(input.value);
    if (!exId || isNaN(w) || w <= 0) return;
    WorkoutMode.pendingWeights[exId] = w;
    input.classList.add('saved');
    setTimeout(() => input.classList.remove('saved'), 1200);
  },

  markDone(btn) {
    const card = btn.closest('.ex-card');
    const isDone = card.classList.toggle('done');
    btn.textContent = isDone ? '✓' : '○';
    vib(isDone ? [30,20,30] : 15);
    // Auto-save weight
    const inp = card.querySelector('.ex-weight-input');
    if (inp && inp.value) this.handleWeight(inp);
    // Scroll next
    if (isDone) {
      WorkoutMode.updateProgress();
      const all = Array.from(document.querySelectorAll('.ex-card'));
      const next = all[all.indexOf(card) + 1];
      if (next) setTimeout(() => next.scrollIntoView({ behavior:'smooth', block:'nearest' }), 200);
    }
  },

  // ── Rest timer ──────────────────────────────────────────
  startRest(secs, label) { RestTimer.start(secs, label); },
  restAdd(n)             { RestTimer.add(n); },
  restDismiss()          { RestTimer.dismiss(); },

  // ── Bodyweight ──────────────────────────────────────────
  logBW() {
    const inp = el('bw-quick-input');
    if (!inp) return;
    const w = parseFloat(inp.value);
    if (!w || w < 30 || w > 300) { inp.focus(); return; }
    Store.logBW(w);
    inp.value = '';
    this.goTab('home');
  },

  // ── Stats ────────────────────────────────────────────────
  updateStdBW(val) {
    const bw = parseFloat(val);
    if (!bw || bw < 30 || bw > 300) return;
    const d = Store.get(); d.profile.bodyweight = bw; Store.set(d);
    const tbody = el('str-table')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = STANDARDS.map(s=>{
      const bKg=(s.beg*bw).toFixed(1), iKg=(s.int*bw).toFixed(1);
      const aKg=(s.adv*bw).toFixed(1), eKg=(s.eli*bw).toFixed(1);
      const best=Store.lastWeight(s.id);
      let pct=0,cls='';
      if(best!==null){pct=Math.round((best/parseFloat(iKg))*100);cls=pct>=100?'achieved':pct>=80?'near':'';}
      return `<tr>
        <td class="col-ex">${s.name}</td>
        <td class="col-beg">${bKg}</td><td class="col-int">${iKg}</td>
        <td class="col-adv">${aKg}</td><td class="col-eli">${eKg}</td>
        <td class="col-cur">${best!==null?best+'kg':'<span style="color:var(--text3)">—</span>'}</td>
        <td class="col-prog">
          <div class="progress-track" style="width:100%;margin-bottom:3px;">
            <div class="progress-fill ${cls}" style="width:${Math.min(pct,100)}%;"></div>
          </div>
          <span class="prog-pct ${cls}">${best!==null?pct+'%':'—'}</span>
        </td>
      </tr>`;
    }).join('');
  },

  // ── Guide ────────────────────────────────────────────────
  toggleGuide(id) {
    const card = el(`gcard-${id}`);
    const body = el(`gbody-${id}`);
    if (!card || !body) return;
    const isOpen = card.classList.toggle('open');
    if (isOpen && !body.innerHTML.trim()) {
      const fn = GuideRenderers[id];
      body.innerHTML = fn ? fn() : '<p style="padding:12px;font-size:12px;color:var(--text3);">Content coming soon.</p>';
      // Render ROI canvas after DOM update
      if (id === 'roi') requestAnimationFrame(() => Charts.roi(el('roi-canvas')));
    }
  },

  scrollGuideSection(id) {
    const sec = el(`gsec-${id}`);
    if (!sec) return;
    sec.scrollIntoView({ behavior:'smooth', block:'start' });
    // Auto-open if closed
    const card = el(`gcard-${id}`);
    if (card && !card.classList.contains('open')) this.toggleGuide(id);
  },

  // ── Export ───────────────────────────────────────────────
  exportCSV() { Store.exportCSV(); }
};

// ════════════════════════════════════════════════════════════
// 13. INIT
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  App.goTab('home');
});
