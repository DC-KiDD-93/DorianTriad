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

// ── Strength standards — from Ratios2026BW.xlsx "WRT BW (GEM)" sheet.
// Sources: StrengthLevel.com, SymmetricStrength.com, ExRx.net (Kilgore/Rippetoe),
//          Catalyst Athletics (Greg Everett), OpenPowerlifting/IPF data.
// type:'abs' — stored weight is total load; compare directly against ratio×BW.
// type:'bw+' — stored weight is ADDED weight only; effective = stored+BW; ratios are total/BW.
// type:'x2'  — stored weight is per hand/side; effective = stored×2; ratios are (×2 total)/BW.
const STANDARDS = [
  { id:'back-squat',            name:'Back Squat',           beg:0.80, int:1.20, adv:1.60, type:'abs', color:'#00E587' },
  { id:'deadlift',              name:'Deadlift',              beg:1.00, int:1.45, adv:2.00, type:'abs', color:'#FF5C2B' },
  { id:'rdl',                   name:'Romanian DL',           beg:0.80, int:1.20, adv:1.60, type:'abs', color:'#FF8040' },
  { id:'incline-barbell',       name:'Incline Barbell',       beg:0.45, int:0.80, adv:1.10, type:'abs', color:'#4DA6FF' },
  { id:'incline-db-press',      name:'Incline DB (×hand)',    beg:0.35, int:0.55, adv:0.75, type:'x2',  color:'#4DA6FF' },
  { id:'machine-shoulder-press',name:'Shoulder Press',        beg:0.45, int:0.65, adv:0.85, type:'abs', color:'#00C8E8' },
  { id:'dips',                  name:'Dips (BW+added)',       beg:0.80, int:1.00, adv:1.25, type:'bw+', color:'#FF5C2B' },
  { id:'pull-ups',              name:'Pull-Ups (BW+added)',   beg:0.80, int:1.00, adv:1.25, type:'bw+', color:'#9B6DFF' },
  { id:'chin-ups',              name:'Chin-Ups (BW+added)',   beg:0.80, int:1.05, adv:1.30, type:'bw+', color:'#9B6DFF' },
  { id:'cs-row',                name:'CS Row',                beg:0.50, int:0.75, adv:1.00, type:'abs', color:'#C9A84C' },
  { id:'bulgarian-split-squat', name:'BSS (×hand)',           beg:0.35, int:0.55, adv:0.85, type:'x2',  color:'#00E587' },
  { id:'lateral-raise',         name:'Lateral Raise (×hand)', beg:0.10, int:0.15, adv:0.25, type:'x2',  color:'#C9A84C' },
];

// ── Strength ratios vs Squat — from Ratios2026BW.xlsx "WRT SQUAT" sheet.
// Identifies programme-specific imbalances relative to your squat baseline.
const SQUAT_RATIOS = [
  { id:'deadlift',              name:'Deadlift',              low:1.20, opt:1.30, high:1.40, type:'abs' },
  { id:'rdl',                   name:'Romanian DL',           low:0.90, opt:1.00, high:1.10, type:'abs' },
  { id:'incline-barbell',       name:'Incline Barbell',       low:0.60, opt:0.70, high:0.80, type:'abs' },
  { id:'incline-db-press',      name:'Incline DB (total)',    low:0.60, opt:0.65, high:0.70, type:'x2'  },
  { id:'dips',                  name:'Dips (BW+added)',       low:0.90, opt:1.00, high:1.10, type:'bw+' },
  { id:'pull-ups',              name:'Pull-Ups (BW+added)',   low:0.90, opt:1.05, high:1.20, type:'bw+' },
  { id:'chin-ups',              name:'Chin-Ups (BW+added)',   low:0.90, opt:1.05, high:1.20, type:'bw+' },
  { id:'cs-row',                name:'CS Row',                low:0.50, opt:0.53, high:0.70, type:'abs' },
  { id:'machine-shoulder-press',name:'Shoulder Press',        low:0.45, opt:0.53, high:0.60, type:'abs' },
  { id:'lateral-raise',         name:'Lateral Raise (total)', low:0.08, opt:0.12, high:0.15, type:'x2'  },
  { id:'bulgarian-split-squat', name:'BSS (total)',           low:0.30, opt:0.35, high:0.40, type:'x2'  },
];

// ── Helper — compute effective weight for a given type ──────
function effectiveWt(type, stored, bw) {
  if (type === 'bw+') return stored + bw;
  if (type === 'x2')  return stored * 2;
  return stored;
}

// ── Historical training data — imported from DORIAN_TRIAD.xlsx (13 rounds, Feb–May 2026)
// Loaded into localStorage on first run if no data exists.
const SEED_DATA = {"sessions":[{"id":"hist_hades_2026-05-04","sessionId":"hades","date":"2026-05-04","week":"2026-W19","duration":null,"exercises":[{"exId":"deadlift","weight":107.5},{"exId":"dips","weight":11.25},{"exId":"bulgarian-split-squat","weight":22.5},{"exId":"chin-ups","weight":11.25},{"exId":"machine-shoulder-press","weight":40.8},{"exId":"leg-extensions","weight":43.0},{"exId":"cable-curl","weight":20.3},{"exId":"tricep-pushdown","weight":13.5}]},{"id":"hist_atlas_2026-05-02","sessionId":"atlas","date":"2026-05-02","week":"2026-W18","duration":null,"exercises":[{"exId":"back-squat","weight":87.5},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":11.25},{"exId":"rdl","weight":87.5},{"exId":"cs-row","weight":67.6},{"exId":"lateral-raise","weight":8.0},{"exId":"calf-raise","weight":8.0},{"exId":"leg-curl","weight":36.0}]},{"id":"hist_apollo_2026-04-28","sessionId":"apollo","date":"2026-04-28","week":"2026-W18","duration":null,"exercises":[{"exId":"incline-barbell","weight":50.0},{"exId":"machine-press","weight":23.0},{"exId":"cable-fly","weight":43.0},{"exId":"face-pull","weight":7.0},{"exId":"bulgarian-split-squat","weight":22.5},{"exId":"forearms","weight":7.5},{"exId":"neck-training","weight":2.5}]},{"id":"hist_atlas_2026-04-23","sessionId":"atlas","date":"2026-04-23","week":"2026-W17","duration":null,"exercises":[{"exId":"back-squat","weight":85.0},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":10.0},{"exId":"rdl","weight":85.0},{"exId":"lateral-raise","weight":8.0},{"exId":"calf-raise","weight":8.0}]},{"id":"hist_hades_2026-04-20","sessionId":"hades","date":"2026-04-20","week":"2026-W17","duration":null,"exercises":[{"exId":"deadlift","weight":100.0},{"exId":"dips","weight":7.5},{"exId":"bulgarian-split-squat","weight":20.0},{"exId":"chin-ups","weight":7.5},{"exId":"machine-shoulder-press","weight":32.5}]},{"id":"hist_atlas_2026-04-16","sessionId":"atlas","date":"2026-04-16","week":"2026-W16","duration":null,"exercises":[{"exId":"back-squat","weight":75.0},{"exId":"incline-db-press","weight":25.0},{"exId":"pull-ups","weight":5.0},{"exId":"rdl","weight":75.0},{"exId":"cs-row","weight":57.6},{"exId":"lateral-raise","weight":7.5},{"exId":"calf-raise","weight":7.5}]},{"id":"hist_hades_2026-04-08","sessionId":"hades","date":"2026-04-08","week":"2026-W15","duration":null,"exercises":[{"exId":"deadlift","weight":105.0},{"exId":"dips","weight":10.0},{"exId":"bulgarian-split-squat","weight":22.5},{"exId":"chin-ups","weight":10.0},{"exId":"machine-shoulder-press","weight":35.0}]},{"id":"hist_atlas_2026-04-06","sessionId":"atlas","date":"2026-04-06","week":"2026-W15","duration":null,"exercises":[{"exId":"back-squat","weight":85.0},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":8.75},{"exId":"rdl","weight":85.0},{"exId":"cs-row","weight":65.1},{"exId":"lateral-raise","weight":7.5},{"exId":"calf-raise","weight":7.5}]},{"id":"hist_hades_2026-03-31","sessionId":"hades","date":"2026-03-31","week":"2026-W14","duration":null,"exercises":[{"exId":"deadlift","weight":102.5},{"exId":"dips","weight":8.75},{"exId":"bulgarian-split-squat","weight":20.0},{"exId":"chin-ups","weight":8.75},{"exId":"machine-shoulder-press","weight":30.0}]},{"id":"hist_atlas_2026-03-28","sessionId":"atlas","date":"2026-03-28","week":"2026-W13","duration":null,"exercises":[{"exId":"back-squat","weight":82.5},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":7.5},{"exId":"rdl","weight":82.5},{"exId":"cs-row","weight":62.6},{"exId":"lateral-raise","weight":8.0},{"exId":"calf-raise","weight":8.0}]},{"id":"hist_hades_2026-03-26","sessionId":"hades","date":"2026-03-26","week":"2026-W13","duration":null,"exercises":[{"exId":"deadlift","weight":105.0},{"exId":"dips","weight":10.0},{"exId":"bulgarian-split-squat","weight":22.5},{"exId":"chin-ups","weight":10.0},{"exId":"machine-shoulder-press","weight":35.8},{"exId":"leg-extensions","weight":36.0},{"exId":"cable-curl","weight":18.0},{"exId":"tricep-pushdown","weight":9.0}]},{"id":"hist_hades_2026-03-25","sessionId":"hades","date":"2026-03-25","week":"2026-W13","duration":null,"exercises":[{"exId":"deadlift","weight":100.0},{"exId":"dips","weight":7.5},{"exId":"bulgarian-split-squat","weight":20.0},{"exId":"chin-ups","weight":7.5}]},{"id":"hist_atlas_2026-03-22","sessionId":"atlas","date":"2026-03-22","week":"2026-W12","duration":null,"exercises":[{"exId":"back-squat","weight":80.0},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":6.25},{"exId":"rdl","weight":80.0},{"exId":"cs-row","weight":60.1},{"exId":"lateral-raise","weight":7.0},{"exId":"calf-raise","weight":8.0}]},{"id":"hist_hades_2026-03-18","sessionId":"hades","date":"2026-03-18","week":"2026-W12","duration":null,"exercises":[{"exId":"deadlift","weight":97.5},{"exId":"dips","weight":6.25},{"exId":"bulgarian-split-squat","weight":17.5},{"exId":"chin-ups","weight":6.25}]},{"id":"hist_atlas_2026-03-16","sessionId":"atlas","date":"2026-03-16","week":"2026-W12","duration":null,"exercises":[{"exId":"back-squat","weight":77.5},{"exId":"incline-db-press","weight":27.5},{"exId":"pull-ups","weight":5.0},{"exId":"rdl","weight":77.5},{"exId":"cs-row","weight":57.6},{"exId":"lateral-raise","weight":6.0},{"exId":"calf-raise","weight":7.5}]},{"id":"hist_hades_2026-03-12","sessionId":"hades","date":"2026-03-12","week":"2026-W11","duration":null,"exercises":[{"exId":"deadlift","weight":95.0},{"exId":"dips","weight":5.0},{"exId":"bulgarian-split-squat","weight":15.0},{"exId":"chin-ups","weight":5.0}]},{"id":"hist_atlas_2026-03-10","sessionId":"atlas","date":"2026-03-10","week":"2026-W11","duration":null,"exercises":[{"exId":"back-squat","weight":75.0},{"exId":"incline-db-press","weight":25.0},{"exId":"pull-ups","weight":3.75},{"exId":"rdl","weight":75.0},{"exId":"cs-row","weight":55.1},{"exId":"lateral-raise","weight":6.0}]},{"id":"hist_hades_2026-03-07","sessionId":"hades","date":"2026-03-07","week":"2026-W10","duration":null,"exercises":[{"exId":"deadlift","weight":92.5},{"exId":"dips","weight":3.75},{"exId":"bulgarian-split-squat","weight":12.5},{"exId":"chin-ups","weight":3.75}]},{"id":"hist_atlas_2026-03-04","sessionId":"atlas","date":"2026-03-04","week":"2026-W10","duration":null,"exercises":[{"exId":"back-squat","weight":72.5},{"exId":"incline-db-press","weight":25.0},{"exId":"pull-ups","weight":2.5},{"exId":"rdl","weight":72.5},{"exId":"cs-row","weight":49.5},{"exId":"lateral-raise","weight":5.0},{"exId":"calf-raise","weight":6.0}]},{"id":"hist_hades_2026-03-02","sessionId":"hades","date":"2026-03-02","week":"2026-W10","duration":null,"exercises":[{"exId":"deadlift","weight":90.0},{"exId":"dips","weight":2.5},{"exId":"bulgarian-split-squat","weight":10.0},{"exId":"chin-ups","weight":2.5}]},{"id":"hist_atlas_2026-02-28","sessionId":"atlas","date":"2026-02-28","week":"2026-W09","duration":null,"exercises":[{"exId":"back-squat","weight":70.0},{"exId":"incline-db-press","weight":22.5},{"exId":"pull-ups","weight":1.25},{"exId":"rdl","weight":70.0},{"exId":"cs-row","weight":47.0},{"exId":"lateral-raise","weight":5.0},{"exId":"calf-raise","weight":5.0}]},{"id":"hist_hades_2026-02-23","sessionId":"hades","date":"2026-02-23","week":"2026-W09","duration":null,"exercises":[{"exId":"deadlift","weight":85.0},{"exId":"dips","weight":1.25},{"exId":"bulgarian-split-squat","weight":7.5},{"exId":"chin-ups","weight":1.25}]},{"id":"hist_atlas_2026-02-21","sessionId":"atlas","date":"2026-02-21","week":"2026-W08","duration":null,"exercises":[{"exId":"back-squat","weight":67.5},{"exId":"incline-db-press","weight":22.5},{"exId":"pull-ups","weight":0.0},{"exId":"rdl","weight":67.5},{"exId":"cs-row","weight":44.5},{"exId":"lateral-raise","weight":4.0},{"exId":"calf-raise","weight":0.0}]},{"id":"hist_hades_2026-02-19","sessionId":"hades","date":"2026-02-19","week":"2026-W08","duration":null,"exercises":[{"exId":"deadlift","weight":80.0},{"exId":"dips","weight":0.0},{"exId":"bulgarian-split-squat","weight":5.0},{"exId":"chin-ups","weight":0.0}]},{"id":"hist_atlas_2026-02-16","sessionId":"atlas","date":"2026-02-16","week":"2026-W08","duration":null,"exercises":[{"exId":"back-squat","weight":65.0},{"exId":"incline-db-press","weight":20.0},{"exId":"pull-ups","weight":0.0},{"exId":"rdl","weight":65.0},{"exId":"cs-row","weight":42.0},{"exId":"lateral-raise","weight":4.0},{"exId":"calf-raise","weight":0.0}]},{"id":"hist_hades_2026-02-14","sessionId":"hades","date":"2026-02-14","week":"2026-W07","duration":null,"exercises":[{"exId":"deadlift","weight":70.0},{"exId":"dips","weight":0.0},{"exId":"bulgarian-split-squat","weight":0.0},{"exId":"chin-ups","weight":0.0}]},{"id":"hist_atlas_2026-02-11","sessionId":"atlas","date":"2026-02-11","week":"2026-W07","duration":null,"exercises":[{"exId":"back-squat","weight":62.5},{"exId":"incline-db-press","weight":20.0},{"exId":"pull-ups","weight":0.0},{"exId":"rdl","weight":62.5},{"exId":"cs-row","weight":39.5},{"exId":"lateral-raise","weight":4.0},{"exId":"calf-raise","weight":0.0}]}],"exerciseLog":{"back-squat":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":62.5},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":65.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":67.5},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":70.0},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":72.5},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":75.0},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":77.5},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":80.0},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":82.5},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":85.0},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":75.0},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":85.0},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":87.5}],"incline-db-press":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":20.0},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":20.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":22.5},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":22.5},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":25.0},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":25.0},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":27.5},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":27.5},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":27.5},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":27.5},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":25.0},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":27.5},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":27.5}],"pull-ups":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":0.0},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":0.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":0.0},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":1.25},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":2.5},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":3.75},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":5.0},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":6.25},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":7.5},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":8.75},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":5.0},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":10.0},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":11.25}],"rdl":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":62.5},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":65.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":67.5},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":70.0},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":72.5},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":75.0},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":77.5},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":80.0},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":82.5},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":85.0},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":75.0},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":85.0},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":87.5}],"cs-row":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":39.5},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":42.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":44.5},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":47.0},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":49.5},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":55.1},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":57.6},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":60.1},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":62.6},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":65.1},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":57.6},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":67.6}],"lateral-raise":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":4.0},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":4.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":4.0},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":5.0},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":5.0},{"ts":1773100800000,"date":"2026-03-10","week":"2026-W11","weight":6.0},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":6.0},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":7.0},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":8.0},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":7.5},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":7.5},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":8.0},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":8.0}],"calf-raise":[{"ts":1770768000000,"date":"2026-02-11","week":"2026-W07","weight":0.0},{"ts":1771200000000,"date":"2026-02-16","week":"2026-W08","weight":0.0},{"ts":1771632000000,"date":"2026-02-21","week":"2026-W08","weight":0.0},{"ts":1772236800000,"date":"2026-02-28","week":"2026-W09","weight":5.0},{"ts":1772582400000,"date":"2026-03-04","week":"2026-W10","weight":6.0},{"ts":1773619200000,"date":"2026-03-16","week":"2026-W12","weight":7.5},{"ts":1774137600000,"date":"2026-03-22","week":"2026-W12","weight":8.0},{"ts":1774656000000,"date":"2026-03-28","week":"2026-W13","weight":8.0},{"ts":1775433600000,"date":"2026-04-06","week":"2026-W15","weight":7.5},{"ts":1776297600000,"date":"2026-04-16","week":"2026-W16","weight":7.5},{"ts":1776902400000,"date":"2026-04-23","week":"2026-W17","weight":8.0},{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":8.0}],"leg-curl":[{"ts":1777680000000,"date":"2026-05-02","week":"2026-W18","weight":36.0}],"deadlift":[{"ts":1771027200000,"date":"2026-02-14","week":"2026-W07","weight":70.0},{"ts":1771459200000,"date":"2026-02-19","week":"2026-W08","weight":80.0},{"ts":1771804800000,"date":"2026-02-23","week":"2026-W09","weight":85.0},{"ts":1772409600000,"date":"2026-03-02","week":"2026-W10","weight":90.0},{"ts":1772841600000,"date":"2026-03-07","week":"2026-W10","weight":92.5},{"ts":1773273600000,"date":"2026-03-12","week":"2026-W11","weight":95.0},{"ts":1773792000000,"date":"2026-03-18","week":"2026-W12","weight":97.5},{"ts":1774396800000,"date":"2026-03-25","week":"2026-W13","weight":100.0},{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":105.0},{"ts":1774915200000,"date":"2026-03-31","week":"2026-W14","weight":102.5},{"ts":1775606400000,"date":"2026-04-08","week":"2026-W15","weight":105.0},{"ts":1776643200000,"date":"2026-04-20","week":"2026-W17","weight":100.0},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":107.5}],"dips":[{"ts":1771027200000,"date":"2026-02-14","week":"2026-W07","weight":0.0},{"ts":1771459200000,"date":"2026-02-19","week":"2026-W08","weight":0.0},{"ts":1771804800000,"date":"2026-02-23","week":"2026-W09","weight":1.25},{"ts":1772409600000,"date":"2026-03-02","week":"2026-W10","weight":2.5},{"ts":1772841600000,"date":"2026-03-07","week":"2026-W10","weight":3.75},{"ts":1773273600000,"date":"2026-03-12","week":"2026-W11","weight":5.0},{"ts":1773792000000,"date":"2026-03-18","week":"2026-W12","weight":6.25},{"ts":1774396800000,"date":"2026-03-25","week":"2026-W13","weight":7.5},{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":10.0},{"ts":1774915200000,"date":"2026-03-31","week":"2026-W14","weight":8.75},{"ts":1775606400000,"date":"2026-04-08","week":"2026-W15","weight":10.0},{"ts":1776643200000,"date":"2026-04-20","week":"2026-W17","weight":7.5},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":11.25}],"bulgarian-split-squat":[{"ts":1771027200000,"date":"2026-02-14","week":"2026-W07","weight":0.0},{"ts":1771459200000,"date":"2026-02-19","week":"2026-W08","weight":5.0},{"ts":1771804800000,"date":"2026-02-23","week":"2026-W09","weight":7.5},{"ts":1772409600000,"date":"2026-03-02","week":"2026-W10","weight":10.0},{"ts":1772841600000,"date":"2026-03-07","week":"2026-W10","weight":12.5},{"ts":1773273600000,"date":"2026-03-12","week":"2026-W11","weight":15.0},{"ts":1773792000000,"date":"2026-03-18","week":"2026-W12","weight":17.5},{"ts":1774396800000,"date":"2026-03-25","week":"2026-W13","weight":20.0},{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":22.5},{"ts":1774915200000,"date":"2026-03-31","week":"2026-W14","weight":20.0},{"ts":1775606400000,"date":"2026-04-08","week":"2026-W15","weight":22.5},{"ts":1776643200000,"date":"2026-04-20","week":"2026-W17","weight":20.0},{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":22.5},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":22.5}],"chin-ups":[{"ts":1771027200000,"date":"2026-02-14","week":"2026-W07","weight":0.0},{"ts":1771459200000,"date":"2026-02-19","week":"2026-W08","weight":0.0},{"ts":1771804800000,"date":"2026-02-23","week":"2026-W09","weight":1.25},{"ts":1772409600000,"date":"2026-03-02","week":"2026-W10","weight":2.5},{"ts":1772841600000,"date":"2026-03-07","week":"2026-W10","weight":3.75},{"ts":1773273600000,"date":"2026-03-12","week":"2026-W11","weight":5.0},{"ts":1773792000000,"date":"2026-03-18","week":"2026-W12","weight":6.25},{"ts":1774396800000,"date":"2026-03-25","week":"2026-W13","weight":7.5},{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":10.0},{"ts":1774915200000,"date":"2026-03-31","week":"2026-W14","weight":8.75},{"ts":1775606400000,"date":"2026-04-08","week":"2026-W15","weight":10.0},{"ts":1776643200000,"date":"2026-04-20","week":"2026-W17","weight":7.5},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":11.25}],"machine-shoulder-press":[{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":35.8},{"ts":1774915200000,"date":"2026-03-31","week":"2026-W14","weight":30.0},{"ts":1775606400000,"date":"2026-04-08","week":"2026-W15","weight":35.0},{"ts":1776643200000,"date":"2026-04-20","week":"2026-W17","weight":32.5},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":40.8}],"leg-extensions":[{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":36.0},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":43.0}],"cable-curl":[{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":18.0},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":20.3}],"tricep-pushdown":[{"ts":1774483200000,"date":"2026-03-26","week":"2026-W13","weight":9.0},{"ts":1777852800000,"date":"2026-05-04","week":"2026-W19","weight":13.5}],"incline-barbell":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":50.0}],"machine-press":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":23.0}],"cable-fly":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":43.0}],"face-pull":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":7.0}],"forearms":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":7.5}],"neck-training":[{"ts":1777334400000,"date":"2026-04-28","week":"2026-W18","weight":2.5}]}};

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
             bwLog:[], sessions:[], exerciseLog:{}, sleepLog:[] };
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

  // ── Sleep log ────────────────────────────────────────────
  logSleep(hours, quality) {
    const d = this.get();
    if (!d.sleepLog) d.sleepLog = [];
    // Remove any existing entry for today
    const today = todayStr();
    const idx = d.sleepLog.findIndex(e => e.date === today);
    const entry = { date: today, ts: Date.now(), hours: +parseFloat(hours).toFixed(1), quality: +quality };
    if (idx >= 0) d.sleepLog[idx] = entry;
    else d.sleepLog.push(entry);
    this.set(d);
    return entry;
  },

  getSleepHistory(days) {
    const d = this.get();
    const log = d.sleepLog || [];
    if (!days) return log;
    const cutoff = Date.now() - days * 86400000;
    return log.filter(e => e.ts >= cutoff);
  },

  latestSleep() {
    const log = this.get().sleepLog || [];
    return log.length ? log[log.length-1] : null;
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
  saveSession(sessionId, durationSecs, exerciseWeights, notes) {
    // Single read-modify-write — avoids the overwrite race condition
    const d = this.get();
    const sess = {
      id: `s_${Date.now()}`, sessionId,
      date: todayStr(), week: weekKey(new Date()),
      duration: durationSecs, exercises: exerciseWeights,
      notes: notes || ''
    };
    d.sessions.unshift(sess);
    const now = Date.now();
    exerciseWeights.forEach(({ exId, weight }) => {
      if (!weight || isNaN(+weight)) return;
      if (!d.exerciseLog[exId]) d.exerciseLog[exId] = [];
      d.exerciseLog[exId].push({
        ts: now, date: todayStr(), week: weekKey(new Date()),
        weight: +parseFloat(weight).toFixed(2)
      });
    });
    this.set(d);
    return sess;
  },

  importData(jsonStr) {
    let incoming;
    try { incoming = JSON.parse(jsonStr); } catch(_) { throw new Error('Invalid file — could not parse JSON.'); }
    if (!incoming.sessions || !incoming.exerciseLog) throw new Error('Invalid backup file format.');
    const d = this.get();
    // Merge sessions — skip any already present by ID
    const existIds = new Set(d.sessions.map(s => s.id));
    const newSess = incoming.sessions.filter(s => !existIds.has(s.id));
    d.sessions = [...d.sessions, ...newSess].sort((a,b) => b.date.localeCompare(a.date));
    // Merge exercise log entries — skip duplicates by timestamp
    Object.entries(incoming.exerciseLog).forEach(([exId, entries]) => {
      if (!d.exerciseLog[exId]) d.exerciseLog[exId] = [];
      const existing = new Set(d.exerciseLog[exId].map(e => e.ts));
      const newEntries = entries.filter(e => !existing.has(e.ts));
      d.exerciseLog[exId] = [...d.exerciseLog[exId], ...newEntries].sort((a,b) => a.ts - b.ts);
    });
    this.set(d);
    return newSess.length;
  },

  initFromSeed() {
    const d = this.get();
    if (d.sessions.length === 0 && Object.keys(d.exerciseLog).length === 0) {
      d.sessions = [...SEED_DATA.sessions];
      d.exerciseLog = JSON.parse(JSON.stringify(SEED_DATA.exerciseLog));
      this.set(d);
    }
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

// ── Audio — one shared AudioContext, unlocked on first user tap.
// Creating a fresh AudioContext per beep is unreliable in Chrome (gets suspended).
let _AC = null;

function unlockAudio() {
  if (_AC) return;
  try { _AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(_) {}
}

function beep() {
  unlockAudio();
  if (!_AC) return;
  try {
    if (_AC.state === 'suspended') _AC.resume();
    const t = _AC.currentTime;
    // 3-tone pattern — cuts through music better than a single tone
    [[880,0],[660,0.18],[880,0.36]].forEach(([freq,delay]) => {
      const o = _AC.createOscillator(), g = _AC.createGain();
      o.connect(g); g.connect(_AC.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t+delay);
      g.gain.linearRampToValueAtTime(1.0, t+delay+0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t+delay+0.28);
      o.start(t+delay); o.stop(t+delay+0.3);
    });
  } catch(_) {}
}

function beepShort() {
  // Single short pulse for countdown warnings
  unlockAudio();
  if (!_AC) return;
  try {
    if (_AC.state === 'suspended') _AC.resume();
    const o = _AC.createOscillator(), g = _AC.createGain();
    o.connect(g); g.connect(_AC.destination);
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.5, _AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, _AC.currentTime+0.12);
    o.start(); o.stop(_AC.currentTime+0.12);
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
    unlockAudio(); // Unlock audio context on user tap (required by Chrome)
    const panel=el('rest-panel'), cnt=el('rest-count'), fill=el('rest-fill'), lbl=el('rest-label');
    if (!panel) return;
    if (lbl) lbl.textContent = label || 'Rest';
    panel.classList.remove('alarm');
    panel.classList.add('up');
    vib(40);
    if (cnt) { cnt.textContent = fmtRest(this._left); cnt.classList.remove('ending'); }
    if (fill) { fill.style.width='0%'; fill.classList.remove('ending'); }
    this._iv = setInterval(() => this._tick(), 1000);
  },

  _tick() {
    this._left = Math.max(0, this._left-1);
    const pct = ((this._total-this._left)/this._total)*100;
    const cnt=el('rest-count'), fill=el('rest-fill'), panel=el('rest-panel');
    if (cnt) { cnt.textContent = fmtRest(this._left); cnt.classList.toggle('ending', this._left<=10); }
    if (fill) { fill.style.width=pct+'%'; fill.classList.toggle('ending', this._left<=10); }

    // Warning pulses at 10s and 5s remaining
    if (this._left === 10) { vib(80); beepShort(); }
    if (this._left === 5)  { vib([60,40,60]); beepShort(); }

    if (this._left<=0) {
      clearInterval(this._iv);
      beep();
      vib([300,100,300,100,300]); // More aggressive 3-pulse pattern
      if (panel) panel.classList.add('alarm');
      // Full-screen flash overlay
      const flash = document.createElement('div');
      flash.className = 'rest-complete-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1200);
      setTimeout(() => this.dismiss(), 3000);
    }
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
  },

  strengthChart(canvas, entries, standard, bw) {
    if (!canvas || !entries || entries.length < 1) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth * DPR;
    const H = canvas.offsetHeight * DPR;
    canvas.width = W; canvas.height = H;
    const PAD = { t:28*DPR, r:14*DPR, b:22*DPR, l:46*DPR };
    const cW = W-PAD.l-PAD.r, cH = H-PAD.t-PAD.b;

    const pts = entries.map(e => ({ date:e.date, v:effectiveWt(standard.type, e.weight, bw) }));
    const begV = standard.beg * bw;
    const intV = standard.int * bw;
    const advV = standard.adv * bw;
    const allV = [...pts.map(p=>p.v), begV, intV, advV];
    const minV = Math.min(...allV) * 0.88;
    const maxV = Math.max(...allV) * 1.10;
    const range = maxV - minV || 1;
    const sx = i => PAD.l + (i / (pts.length-1||1)) * cW;
    const sy = v => PAD.t + cH - ((v - minV) / range) * cH;

    // Reference lines
    [
      { v:begV, label:`Beg ${begV.toFixed(0)}kg`, col:'#585856' },
      { v:intV, label:`Inter ${intV.toFixed(0)}kg`, col:'#9B6DFF' },
      { v:advV, label:`Adv ${advV.toFixed(0)}kg`, col:'#C9A84C' },
    ].forEach(r => {
      const y = sy(r.v);
      ctx.save();
      ctx.strokeStyle = r.col; ctx.lineWidth = DPR; ctx.globalAlpha = 0.55;
      ctx.setLineDash([4*DPR, 4*DPR]);
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W-PAD.r, y); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = r.col;
      ctx.font = `${9*DPR}px DM Sans,sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(r.label, PAD.l + 3*DPR, y - 3*DPR);
      ctx.restore();
    });

    const col = standard.color || '#00E587';
    if (pts.length >= 2) {
      const grad = ctx.createLinearGradient(0, PAD.t, 0, H-PAD.b);
      grad.addColorStop(0, col + '30'); grad.addColorStop(1, col + '00');
      ctx.beginPath();
      pts.forEach((p,i) => i===0 ? ctx.moveTo(sx(i),sy(p.v)) : ctx.lineTo(sx(i),sy(p.v)));
      ctx.lineTo(sx(pts.length-1), H-PAD.b);
      ctx.lineTo(sx(0), H-PAD.b);
      ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 2*DPR; ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p,i) => i===0 ? ctx.moveTo(sx(i),sy(p.v)) : ctx.lineTo(sx(i),sy(p.v)));
      ctx.stroke();
    }
    pts.forEach((p,i) => {
      ctx.beginPath(); ctx.arc(sx(i), sy(p.v), 3.5*DPR, 0, Math.PI*2);
      ctx.fillStyle = col; ctx.fill();
    });

    // Y axis labels
    ctx.fillStyle = '#585856'; ctx.textAlign = 'right';
    ctx.font = `${9*DPR}px DM Sans,sans-serif`;
    for (let i=0; i<=4; i++) {
      const v = minV + (i/4)*range;
      ctx.fillText(v.toFixed(0), PAD.l-4*DPR, sy(v)+3*DPR);
    }
    // X axis endpoints
    if (pts.length >= 2) {
      ctx.fillStyle = '#585856'; ctx.font = `${8*DPR}px DM Sans,sans-serif`;
      ctx.textAlign = 'left';  ctx.fillText(pts[0].date.slice(5),      PAD.l,    H-PAD.b+12*DPR);
      ctx.textAlign = 'right'; ctx.fillText(pts[pts.length-1].date.slice(5), W-PAD.r, H-PAD.b+12*DPR);
    }
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

      <div class="section-label">Last Night's Sleep</div>
      <div class="card">${(() => {
        const lastSleep = Store.latestSleep();
        const sleepColor = lastSleep
          ? lastSleep.hours >= 8 ? 'var(--atlas)' : lastSleep.hours >= 7 ? 'var(--gold)' : 'var(--hades)'
          : 'var(--text3)';
        const stars = lastSleep ? '★'.repeat(lastSleep.quality) + '☆'.repeat(5-lastSleep.quality) : '';
        return `<div class="sleep-quick-log">
          <div class="sleep-current">
            <div class="sleep-hrs" style="color:${sleepColor};">${lastSleep ? lastSleep.hours+'h' : '—'}</div>
            <div class="sleep-stars">${stars}</div>
            <div class="sleep-date">${lastSleep ? fmtDate(lastSleep.date) : 'Not logged yet'}</div>
          </div>
          <div class="sleep-entry-form">
            <div style="font-size:10px;color:var(--text3);margin-bottom:6px;letter-spacing:.08em;text-transform:uppercase;">Log tonight</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
              <input id="sleep-hrs-input" type="number" inputmode="decimal" placeholder="7.5"
                step="0.5" min="3" max="12" class="bw-input" style="width:70px;">
              <span style="font-size:12px;color:var(--text3);">hours</span>
            </div>
            <div style="font-size:10px;color:var(--text3);margin-bottom:6px;">Quality</div>
            <div class="sleep-quality-btns" id="sleep-quality-btns">
              ${[1,2,3,4,5].map(q=>`<button class="sleep-q-btn" data-q="${q}" onclick="App.selectSleepQuality(${q})">${q}★</button>`).join('')}
            </div>
            <button class="bw-log-btn" onclick="App.logSleep()" style="margin-top:8px;width:100%;">Log Sleep</button>
          </div>
        </div>`;
      })()}</div>

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
        const notesHtml = s.notes
          ? `<div class="log-session-notes">${s.notes}</div>` : '';
        return `
        <div class="log-session-card">
          <div class="log-session-head" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <div class="log-session-dot" style="background:${sess.color};"></div>
            <div class="log-session-name">${sess.name}</div>
            <div class="log-session-date">${fmtDate(s.date)}</div>
            <div class="log-session-dur">${s.duration?fmtDur(s.duration):''}</div>
            <button onclick="event.stopPropagation();App.editSession('${s.id}')"
              style="background:none;border:none;color:var(--text3);font-size:13px;padding:4px 8px;cursor:pointer;flex-shrink:0;"
              title="Edit session">✎</button>
          </div>
          <div class="log-ex-rows hidden">
            ${exHtml||'<div style="padding:10px 16px;font-size:12px;color:var(--text3);">No weights logged</div>'}
            ${notesHtml}
          </div>
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
        <button class="btn btn-ghost" onclick="App.exportJSON()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Backup JSON
        </button>
        <label class="btn btn-ghost" style="cursor:pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Restore JSON
          <input type="file" accept=".json" style="display:none;" onchange="App.importJSON(this)">
        </label>
      </div>
    </div>`;
  },

  // ── GUIDE ────────────────────────────────────────────────
  guide() {
    const sections = [
      { id:'roi',          icon:'📊', color:'#C9A84C', title:'Health ROI' },
      { id:'programme',    icon:'🗓',  color:'#00E587', title:'The Programme' },
      { id:'nutrition',    icon:'🥗',  color:'#88D040', title:'Daily Nutrition' },
      { id:'kitchen',      icon:'🍳',  color:'#FF8040', title:'Kitchen & Recipes' },
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
    const d   = Store.get();
    const bw  = Store.latestBW();
    const bwH = Store.getBWHistory(90);
    const total   = Store.totalSessions();
    const thisWk  = Store.sessionsThisWeek();
    const squat   = Store.lastWeight('back-squat') || 0;

    // Build exercise selector options (any exercise with logged data)
    const trackedIds = Object.keys(d.exerciseLog).filter(id => d.exerciseLog[id].length > 0);
    const exNames = {};
    Object.values(SESSIONS).forEach(s => s.exercises.forEach(ex => exNames[ex.id] = ex.name));
    const exOptions = trackedIds.map(id =>
      `<option value="${id}">${exNames[id] || id.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}</option>`
    ).join('');

    // WRT BW standards rows
    const bwRows = STANDARDS.map(s => {
      const stored = Store.lastWeight(s.id);
      const eff    = stored !== null ? effectiveWt(s.type, stored, bw) : null;
      const intKg  = (s.int * bw).toFixed(1);
      const begKg  = (s.beg * bw).toFixed(1);
      const advKg  = (s.adv * bw).toFixed(1);
      let pct = 0, cls = '';
      if (eff !== null) {
        pct = Math.round((eff / (s.int * bw)) * 100);
        cls = pct >= 100 ? 'achieved' : pct >= 80 ? 'near' : '';
      }
      const dispStored = stored !== null ? `${stored}kg` : '<span style="color:var(--text3)">—</span>';
      const dispEff    = (eff !== null && s.type !== 'abs') ? `<span style="font-size:9px;color:var(--text3);"> (${eff.toFixed(1)})</span>` : '';
      return `<tr>
        <td class="col-ex">${s.name}</td>
        <td class="col-beg">${begKg}</td>
        <td class="col-int">${intKg}</td>
        <td class="col-adv">${advKg}</td>
        <td class="col-cur">${dispStored}${dispEff}</td>
        <td class="col-prog">
          <div class="progress-track" style="width:100%;margin-bottom:3px;">
            <div class="progress-fill ${cls}" style="width:${Math.min(pct,100)}%;"></div>
          </div>
          <span class="prog-pct ${cls}">${eff !== null ? pct+'%' : '—'}</span>
        </td>
      </tr>`;
    }).join('');

    // WRT Squat rows (only meaningful if squat data exists)
    const sqRows = squat > 0 ? SQUAT_RATIOS.map(s => {
      const stored = Store.lastWeight(s.id);
      const eff    = stored !== null ? effectiveWt(s.type, stored, bw) : null;
      const actual = eff !== null ? eff / squat : null;
      const optWt  = (s.opt * squat).toFixed(1);
      let statusCls = '', statusTxt = '—';
      if (actual !== null) {
        if (actual < s.low)        { statusCls='below'; statusTxt=`${(actual*100).toFixed(0)}% ↓`; }
        else if (actual > s.high)  { statusCls='above'; statusTxt=`${(actual*100).toFixed(0)}% ↑`; }
        else                        { statusCls='ontrack'; statusTxt=`${(actual*100).toFixed(0)}% ✓`; }
      }
      const rangeStr = `${(s.low*100).toFixed(0)}–${(s.high*100).toFixed(0)}%`;
      return `<tr>
        <td class="col-ex">${s.name}</td>
        <td style="font-family:var(--fn-mono);font-size:11px;color:var(--text3);">${rangeStr}</td>
        <td style="font-family:var(--fn-mono);font-size:11px;color:var(--gold);">${optWt}kg</td>
        <td class="col-cur">${eff !== null ? eff.toFixed(1)+'kg' : '<span style="color:var(--text3)">—</span>'}</td>
        <td style="font-family:var(--fn-mono);font-size:12px;font-weight:600;
          color:${statusCls==='ontrack'?'var(--atlas)':statusCls==='below'?'var(--apollo)':'var(--amber)'};">
          ${statusTxt}
        </td>
      </tr>`;
    }).join('') : null;

    // PRs
    const prs = Store.allPRs();
    const prHtml = Object.keys(prs).length
      ? Object.entries(prs).sort((a,b) => b[1].ts - a[1].ts).map(([id,e]) => {
          const name = exNames[id] || id.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
          const sess = Object.values(SESSIONS).find(s => s.exercises.some(ex => ex.id === id));
          return `<div class="pr-row">
            <div class="pr-ex">${name}</div>
            <div class="pr-wt" style="color:${sess?sess.color:'var(--gold)'};">${e.weight}kg</div>
            <div class="pr-date">${fmtDate(e.date)}</div>
          </div>`;
        }).join('')
      : '<div style="padding:14px 16px;font-size:12px;color:var(--text3);">No lifts logged yet.</div>';

    const bwDelta = bwH.length >= 2
      ? bwH[bwH.length-1].weight - bwH[0].weight
      : null;

    return `<div class="stats-page">

      <!-- Bodyweight trend -->
      <div class="section-label">Bodyweight</div>
      <div class="card chart-card">
        <div class="chart-title">90-Day Trend</div>
        <canvas id="bw-chart" class="chart-canvas"></canvas>
        <div class="bw-stats-row">
          <div class="bw-stat-box">
            <div class="bw-stat-val">${bw}kg</div>
            <div class="bw-stat-lbl">Now</div>
          </div>
          <div class="bw-stat-box">
            <div class="bw-stat-val" style="color:var(--gold);">${d.profile.targetWeight}kg</div>
            <div class="bw-stat-lbl">Target</div>
          </div>
          <div class="bw-stat-box">
            <div class="bw-stat-val" style="color:${bwDelta===null?'var(--text3)':bwDelta>=0?'var(--atlas)':'var(--hades)'};">
              ${bwDelta !== null ? (bwDelta >= 0 ? '+' : '') + bwDelta.toFixed(1) + 'kg' : '—'}
            </div>
            <div class="bw-stat-lbl">90-day Δ</div>
          </div>
        </div>
      </div>

      <!-- Exercise progress chart -->
      <div class="section-label">Exercise Progress</div>
      <div class="card chart-card">
        <select id="ex-select" onchange="App.renderExChart()"
          style="width:100%;padding:9px 12px;background:var(--bg);border:1px solid var(--border2);
                 border-radius:var(--r);color:var(--text);font-family:var(--fn-body);font-size:13px;
                 margin-bottom:12px;cursor:pointer;appearance:none;-webkit-appearance:none;">
          <option value="">Select exercise to chart…</option>
          ${exOptions}
        </select>
        <canvas id="ex-chart" class="chart-canvas" style="display:none;"></canvas>
        <div id="ex-chart-meta" style="font-size:11px;color:var(--text3);margin-top:6px;display:none;"></div>
      </div>

      <!-- Session summary -->
      <div class="section-label">Sessions</div>
      <div class="card">
        <div class="card-row">
          <div style="font-size:13px;color:var(--text2);">Total logged</div>
          <div class="mono" style="font-size:17px;font-weight:700;">${total}</div>
        </div>
        <div class="card-row">
          <div style="font-size:13px;color:var(--text2);">This week</div>
          <div class="mono" style="font-size:17px;font-weight:700;color:var(--gold);">${thisWk}</div>
        </div>
      </div>

      <!-- WRT Bodyweight standards -->
      <div class="section-label">Strength Standards — vs Bodyweight</div>
      <div class="card">
        <div class="str-bw-row">
          <div class="str-bw-label">Bodyweight</div>
          <input class="str-bw-input" type="number" inputmode="decimal"
            id="str-bw-input" value="${bw}" step="0.1" oninput="App.updateStdBW(this.value)">
          <div class="str-bw-unit">kg</div>
        </div>
        <div class="str-table-wrap">
          <table class="str-table" id="str-table">
            <thead><tr>
              <th>Exercise</th><th class="col-beg">Beg.</th>
              <th class="col-int">Inter.</th><th class="col-adv">Adv.</th>
              <th>Logged</th><th>vs Inter.</th>
            </tr></thead>
            <tbody id="str-tbody">${bwRows}</tbody>
          </table>
        </div>
        <div class="str-note">
          Sources: StrengthLevel.com, SymmetricStrength.com, ExRx.net (Kilgore/Rippetoe).
          BW+ exercises show added weight; effective total in brackets. ×hand exercises show per-hand; total = ×2.
        </div>
      </div>

      <!-- WRT Squat ratios -->
      <div class="section-label">Strength Balance — vs Squat</div>
      <div class="card">
        <div style="padding:10px 16px 0;font-size:11px;color:var(--text3);line-height:1.5;">
          Compares each lift's effective weight against your current squat (${squat}kg).
          <span style="color:var(--atlas);">✓ in range</span> · 
          <span style="color:var(--apollo);">↓ below range</span> · 
          <span style="color:var(--amber);">↑ above range</span>
        </div>
        ${sqRows ? `
        <div class="str-table-wrap">
          <table class="str-table">
            <thead><tr>
              <th>Exercise</th><th>Target Range</th><th>Optimum</th><th>Actual</th><th>Status</th>
            </tr></thead>
            <tbody>${sqRows}</tbody>
          </table>
        </div>
        <div class="str-note">Source: Ratios2026BW.xlsx — WRT SQUAT sheet (your personal framework).</div>
        ` : `<div style="padding:14px 16px;font-size:12px;color:var(--text3);">Log a Back Squat session to enable this table.</div>`}
      </div>

      <!-- PRs -->
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
    document.body.classList.add('workout-active');
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
    document.body.classList.remove('workout-active');
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
      const prevTxt = rec && last
        ? `Last: ${last}kg &nbsp;→&nbsp; Rec: ${rec}kg`
        : rec ? `Recommended: ${rec}kg`
        : last ? `Last session: ${last}kg`
        : 'First session — establish baseline';

      const badgeHtml = ex.isAnchor
        ? `<span class="badge badge-gold">★</span>`
        : ex.ssTag ? `<span class="badge badge-ss">${ex.ssTag}</span>` : '';
      const ssNoteHtml = ex.ssNote ? `<div class="ex-ss-note">${ex.ssNote}</div>` : '';
      const cuesHtml = ex.cues.map(c=>`<li>${c}</li>`).join('');

      const restBtnHtml = ex.restSecs > 0
        ? `<button class="ex-rest-btn" onclick="App.startRest(${ex.restSecs},'${ex.name}')">⏱ ${fmtRest(ex.restSecs)}</button>`
        : `<span class="ex-rest-btn ss">→ Superset</span>`;

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
        <div class="ex-input-section">
          <div class="ex-prev-row">${prevTxt}</div>
          <div class="ex-input-row">
            <div class="ex-weight-wrap">
              <input class="ex-weight-input"
                type="number"
                inputmode="decimal"
                placeholder="0"
                step="0.5"
                min="0"
                value="${rec !== null ? rec : (last !== null ? last : '')}"
                data-ex-id="${ex.id}"
                onchange="App.handleWeight(this)"
                onblur="App.handleWeight(this)">
              <span class="ex-kg">kg</span>
            </div>
            <div class="ex-btns">
              ${restBtnHtml}
              <button class="ex-done-btn" onclick="App.markDone(this)" aria-label="Mark done">✓</button>
            </div>
          </div>
          ${ex.incrPct ? `<div class="ex-incr-lbl">+${ex.incrPct}% / session when top rep reached</div>` : ''}
        </div>
      </div>`;
    }).join('');

    const presetsHtml = [
      [60,'1:00'], [90,'1:30'], [120,'2:00'], [180,'3:00']
    ].map(([secs,lbl])=>
      `<button class="wk-rest-preset" onclick="App.startRest(${secs},'Rest')">${lbl}</button>`
    ).join('');

    return `
    <div class="wk-header" style="border-bottom-color:${s.color}50;">
      <div class="wk-session-name" style="color:${s.color};">${s.name}</div>
      <div class="wk-timer" id="wk-timer">00:00:00</div>
      <div class="wk-progress" id="wk-progress">0/${s.exercises.length}</div>
      <button class="wk-end-btn" onclick="App.exitWorkout()">End</button>
    </div>
    <div class="wk-rest-bar">
      <div class="wk-rest-bar-label">Rest</div>
      <div class="wk-rest-presets">${presetsHtml}</div>
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
        <div class="wk-notes-wrap">
          <textarea id="session-notes-input" class="wk-notes-input"
            placeholder="Session notes… how it felt, anything notable, sleep quality, energy level"
            rows="3"></textarea>
        </div>
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

    const patterns = [
      { pattern:'Hip Hinge',          chain:'Posterior Chain Dominant',   color:'#FF5C2B', movements:'Deadlift, RDL',                              sessions:'Hades ★, Atlas',   why:'The most systemically demanding pattern. Engages the entire posterior chain — glutes, hamstrings, spinal erectors — and builds the structural foundation for all athletic movement.' },
      { pattern:'Knee Flexion/Ext.',  chain:'Anterior Chain Dominant',    color:'#00E587', movements:'Squat, BSS, Leg Extensions, Leg Curl',        sessions:'Atlas ★, Apollo, Hades', why:'Bilateral and unilateral loading of the quads and hamstrings. The squat develops foundational lower body strength; BSS addresses unilateral imbalances and builds single-leg stability.' },
      { pattern:'Horizontal Push',    chain:'Chest, Anterior Deltoid, Tricep', color:'#4DA6FF', movements:'Incline Barbell, Incline DB, Machine Press, Dips, Cable Fly', sessions:'Apollo ★, Atlas, Hades', why:'Upper chest emphasis throughout. Incline angle preferentially loads the clavicular head of the pectoralis major — the area that links the chest to the shoulder and is typically the most underdeveloped.' },
      { pattern:'Vertical Pull',      chain:'Lats, Biceps, Rear Delt',    color:'#9B6DFF', movements:'Pull-Ups (overhand), Chin-Ups (supinated)',   sessions:'Atlas, Hades',     why:'Two grip variations hit the lats through different lines of pull. Overhand pull-ups emphasise lat width; supinated chin-ups increase bicep involvement and allow a more complete range of motion.' },
      { pattern:'Horizontal Pull',    chain:'Mid-Back, Rear Delt, Rhomboids', color:'#C9A84C', movements:'Chest-Supported Row, Face Pull',          sessions:'Atlas, Apollo',    why:'The CS Row builds mid-back thickness and corrects postural imbalances created by pressing volume. Face pulls specifically target external rotators and rear delts — critical for shoulder health and longevity.' },
      { pattern:'Vertical Push',      chain:'Deltoid, Tricep, Upper Trap', color:'#00C8E8', movements:'Machine Shoulder Press',                     sessions:'Hades',            why:'Overhead pressing builds the deltoid cap that creates the shoulder-to-arm visual transition. Kept as a secondary movement since horizontal pressing volume is already high.' },
      { pattern:'Core / Anti-Ext.',   chain:'Rectus Abdominis, Obliques, Hip Flexors', color:'#88D040', movements:'Ab Wheel',                       sessions:'Hades',            why:'The ab wheel trains anti-extension — resisting lumbar hyperextension under load — which is the core\'s primary function in all compound lifts. More specific and transferable than crunches.' },
    ];

    const patternRows = patterns.map(p=>`
      <div style="background:var(--bg2);border-radius:var(--r);padding:12px 14px;border-left:3px solid ${p.color};margin-bottom:8px;">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
          <div style="font-size:13px;font-weight:700;color:${p.color};">${p.pattern}</div>
          <div style="font-size:10px;color:var(--text3);">${p.chain}</div>
        </div>
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:2px;">${p.movements}</div>
        <div style="font-size:10px;color:var(--text3);font-style:italic;margin-bottom:6px;">Sessions: ${p.sessions}</div>
        <div style="font-size:11px;color:var(--text3);line-height:1.55;">${p.why}</div>
      </div>`).join('');

    const repRanges = [
      { range:'5–8 reps', label:'Strength', color:'#FF5C2B', desc:'Heavy compound anchors — Deadlift, Squat, Pull-Ups, Dips, Incline Barbell. Neural efficiency, maximum motor unit recruitment and progressive overload. These movements form the structural foundation of the programme.' },
      { range:'8–12 reps', label:'Hypertrophy', color:'#4DA6FF', desc:'Secondary compounds and pressing volume. The sweet spot for muscle protein synthesis — sufficient mechanical tension combined with metabolic stress. Most accessory compound work lives here.' },
      { range:'12–20 reps', label:'Metabolic', color:'#00E587', desc:'Isolation and accessory work — Lateral Raises, Cable Fly, Face Pulls, Curls. Metabolic stress, blood flow, joint preparation and connective tissue conditioning. Higher reps protect joints in movements with extreme end-range loads.' },
    ];

    const repHtml = repRanges.map(r=>`
      <div style="background:var(--bg2);border-radius:var(--r);padding:11px 13px;border:.5px solid ${r.color}30;flex:1;min-width:180px;">
        <div style="font-family:var(--fn-mono);font-size:16px;font-weight:700;color:${r.color};margin-bottom:2px;">${r.range}</div>
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:6px;">${r.label}</div>
        <div style="font-size:11px;color:var(--text3);line-height:1.5;">${r.desc}</div>
      </div>`).join('');

    const sessCards = SESSION_CYCLE.map(id=>{
      const s = SESSIONS[id];
      const anchors = s.exercises.filter(e=>e.isAnchor);
      return `<div style="background:${s.dim};border:.5px solid ${s.color}30;border-top:2px solid ${s.color};border-radius:var(--r);padding:12px 14px;">
        <div style="font-family:var(--fn-head);font-size:22px;font-weight:800;color:${s.color};letter-spacing:.06em;">${s.name}</div>
        <div style="font-size:11px;color:var(--text3);font-style:italic;margin-bottom:8px;">${s.sub} · ~${s.duration} min</div>
        <div style="font-size:11px;color:var(--text2);">${s.exercises.length} exercises</div>
        ${anchors.map(a=>`<div style="font-size:10px;color:${s.color};margin-top:3px;">★ ${a.name} — ${a.sets}×${a.reps}</div>`).join('')}
      </div>`;
    }).join('');

    return `
    <div class="guide-insight">
      <strong>Full-body, three days, rolling cycle.</strong> Every session trains the entire body through fundamental movement patterns, working in the strength and hypertrophy rep range with compound lifts that simultaneously deliver cardiovascular adaptation. Full ROM and technique emphasis make every session a flexibility and joint health protocol in parallel.
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:14px 0 8px;">Rolling Cycle</div>
    <div class="cycle-pills">${pillsHtml}</div>
    <p style="font-size:11px;color:var(--text3);margin-top:8px;line-height:1.5;">Not weekly. Rotate continuously with at least one full rest day between sessions. This allows frequency to be determined by recovery quality rather than the calendar — an advantage over fixed weekly splits.</p>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Three Sessions</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">${sessCards}</div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Why Full-Body?</div>
    <div style="background:var(--bg2);border-radius:var(--r);padding:12px 14px;margin-bottom:14px;">
      <div style="font-size:12px;color:var(--text2);line-height:1.65;">
        Body-part splits typically stimulate each muscle group once per week. A full-body protocol hitting the same muscle three times per rolling cycle creates three times the adaptation opportunities — more total stimulus per week with appropriate recovery between sessions. For natural trainees, frequency is one of the most underutilised variables available.
        <br><br>
        The compound nature of the anchor movements also means each session delivers a meaningful cardiovascular stimulus. A three-set deadlift session with two minutes rest is as much a metabolic conditioning session as it is a strength session.
      </div>
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Movement Pattern Coverage</div>
    <p style="font-size:11px;color:var(--text3);margin-bottom:10px;line-height:1.5;">Rather than training individual muscles, the programme is structured around the six fundamental human movement patterns. All six are covered in every session, ensuring complete and balanced development across the entire body.</p>
    ${patternRows}

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Rep Range Rationale</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">${repHtml}</div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Full ROM & Joint Health</div>
    <div style="background:var(--bg2);border-radius:var(--r);padding:12px 14px;">
      <div style="font-size:12px;color:var(--text2);line-height:1.65;">
        Every exercise in the programme includes technique cues that specifically emphasise the full stretch position — the 1-second pause at the bottom of the squat, the full dead hang before each pull-up, the paused bottom position of the incline press. This isn't just for muscle stimulus. Training through complete ranges of motion maintains and develops flexibility in the muscles and tendons being loaded, and promotes synovial fluid circulation in the joints. The programme is designed to build the body while simultaneously keeping it functional, mobile and injury-resistant over the long term.
        <br><br>
        <strong style="color:var(--gold-l);">Intensity principle:</strong> Working sets at 1–2 RIR (reps in reserve). Hard enough to drive adaptation, conservative enough to maintain form through the set and recover fully before the next session.
      </div>
    </div>`;
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
    // ── Breathing protocol cards ──────────────────────────────
    const breathingProtocols = [
      {
        name: 'Box Breathing', col: '#4DA6FF', when: 'Post-training · In sauna · Pre-sleep',
        source: 'Galpin / Mark Divine (SEAL training)',
        steps: [
          { label: 'Inhale', detail: '4 seconds — slow, through the nose, fill the belly first then chest' },
          { label: 'Hold', detail: '4 seconds — shoulders relaxed, jaw unclenched' },
          { label: 'Exhale', detail: '4 seconds — slow release through mouth or nose' },
          { label: 'Hold', detail: '4 seconds — rest here, feel the stillness' },
        ],
        cycles: '4–8 cycles. Stop if dizzy.',
        why: 'The structured hold phases actively engage the vagus nerve. Extended breath-hold after exhale is the key driver — it elevates CO₂ tolerance and shifts the autonomic nervous system toward parasympathetic dominance. HRV (heart rate variability) measurably increases within 4 cycles. Galpin identifies this as the primary tool for post-training CNS downregulation.',
      },
      {
        name: 'Physiological Sigh', col: '#00E587', when: 'Between heavy sets · Acute stress · Any moment',
        source: 'Huberman / Jack Feldman (UCLA, Nature 2017)',
        steps: [
          { label: 'Inhale 1', detail: 'Deep inhale through nose — fill your lungs' },
          { label: 'Inhale 2', detail: 'Immediately sniff again — top up the lungs fully' },
          { label: 'Exhale', detail: 'Long, slow, complete exhale through mouth — empty fully' },
        ],
        cycles: 'Just 1–3 is enough. Works in under 30 seconds.',
        why: 'The double inhale re-inflates collapsed alveoli (air sacs), dramatically increasing the surface area for gas exchange. The long exhale then offloads CO₂ maximally in one breath. This is the fastest known physiological method to reduce acute stress — faster than any other breathing technique. Use it between deadlift sets or any moment you feel the system is running hot.',
      },
      {
        name: 'Nasal Breathing & CO₂ Tolerance', col: '#C9A84C', when: 'Walks · Light cardio · Sauna',
        source: 'Andy Galpin — performance physiology',
        steps: [
          { label: 'Principle', detail: 'Breathe exclusively through the nose during all low-intensity activity' },
          { label: 'Progress', detail: 'When you need to open your mouth, you\'ve exceeded your current CO₂ tolerance' },
          { label: 'Training', detail: 'Maintain nasal-only breathing on your school run, walks, any Zone 1–2 activity' },
        ],
        cycles: 'Daily habit during any low-intensity movement.',
        why: 'CO₂ tolerance — your ability to stay calm and functional as CO₂ builds — is a trainable capacity. The Bohr effect: CO₂ is what actually triggers haemoglobin to release oxygen to tissues. Higher CO₂ tolerance means better oxygen delivery to muscle and better performance under pressure. Galpin flags this as one of the most underappreciated recovery and performance metrics. The sauna is an excellent training environment — heat raises CO₂ production, making nasal breathing harder and the training stimulus greater.',
      },
    ];

    const breathingCards = breathingProtocols.map(b => `
      <div style="background:var(--bg2);border-radius:var(--r-lg);border:.5px solid ${b.col}30;border-top:2px solid ${b.col};padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:4px;">
          <div>
            <div style="font-size:14px;font-weight:700;color:${b.col};">${b.name}</div>
            <div style="font-size:10px;color:var(--text3);margin-top:2px;font-style:italic;">${b.when}</div>
          </div>
          <div style="font-size:9px;color:var(--text4);background:var(--surf);padding:3px 8px;border-radius:100px;white-space:nowrap;">
            ${b.source}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
          ${b.steps.map((s,i) => `
          <div style="display:flex;gap:10px;align-items:flex-start;">
            <div style="background:${b.col};color:var(--bg);font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;flex-shrink:0;margin-top:1px;letter-spacing:.04em;">${s.label}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.45;">${s.detail}</div>
          </div>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--text3);font-style:italic;border-top:.5px solid var(--border);padding-top:8px;margin-bottom:6px;">${b.cycles}</div>
        <div style="font-size:11px;color:var(--text3);line-height:1.6;">${b.why}</div>
      </div>`).join('');

    // ── Combined sauna + breathwork protocol ─────────────────
    const combinedProtocol = `
      <div style="background:rgba(255,128,64,.07);border:.5px solid rgba(255,128,64,.3);border-left:3px solid #FF8040;border-radius:0 var(--r-lg) var(--r-lg) 0;padding:16px;margin-bottom:16px;">
        <div style="font-size:14px;font-weight:700;color:#FF8040;margin-bottom:4px;">Post-Training Protocol — Sauna + Box Breathing</div>
        <div style="font-size:10px;color:var(--text3);font-style:italic;margin-bottom:12px;">Your current practice — validated and expanded</div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
          ${[
            ['1','5 min walk','#FF8040','Don\'t sit immediately after training. 5 minutes of slow walking maintains blood flow, begins the autonomic transition, and prevents blood pooling. This is non-optional after Hades.'],
            ['2','Sauna — 10–15 min','#FF8040','Moderate heat (80–90°C). Heat shock proteins (HSPs) are upregulated — these molecular chaperones actively support muscle protein synthesis and adaptation. Growth hormone spikes significantly post-exercise + heat. Laukkanen\'s Finnish cohort data shows cardiovascular adaptation accumulates here. This is NOT the same as cold immersion — heat is complementary to hypertrophy, not antagonistic.'],
            ['3','Box Breathing in heat','#FF8040','4–8 cycles of box breathing (4-4-4-4) while in the sauna. The heat increases CO₂ production and mild sympathetic activation — you\'re training your parasympathetic override system under physiological stress. This is the intelligent version of the protocol: the breathing has to work harder in this environment, which builds the capacity faster. Galpin\'s framework: the goal is to create a controlled stress and practice regulating it.'],
            ['4','Cool down — 5 min','#FF8040','Exit sauna, let temperature normalise. Cold shower is optional but do not submerge in cold water — the goal is temperature normalisation, not cold immersion (which would blunt the heat adaptation you\'ve just accumulated).'],
          ].map(([n,title,col,desc]) => `
          <div style="display:flex;gap:12px;">
            <div style="background:${col};color:var(--bg);font-family:var(--fn-mono);font-size:12px;font-weight:700;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${n}</div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:3px;">${title}</div>
              <div style="font-size:11px;color:var(--text3);line-height:1.55;">${desc}</div>
            </div>
          </div>`).join('')}
        </div>

        <div style="background:var(--bg);border-radius:var(--r);padding:10px 12px;font-size:11px;color:var(--text3);line-height:1.65;border:.5px solid var(--border);">
          <strong style="color:var(--gold-l);">Why the combination works:</strong> The sauna creates a controlled physiological stressor. The box breathing trains active regulation of that stress — vagal tone, CO₂ tolerance, parasympathetic override. Done consistently, you are training your nervous system's ability to self-regulate under pressure. This capacity transfers directly to performance: the ability to stay composed under the load of a heavy deadlift, or recover faster between sets. This is Galpin's parasympathetic downregulation framework applied in practice.
        </div>
        <div style="font-size:10px;color:var(--text4);margin-top:8px;">Sources: Galpin (parasympathetic downregulation), Laukkanen et al. (Finnish sauna cohort, JAMA Internal Medicine 2015), Roberts et al. (cold vs heat differentiation, J Physiology 2015), Huberman (vagal tone, breathing)</div>
      </div>`;

    // ── Standard recovery cards (updated) ────────────────────
    const recoveryCards = [
      {
        name: 'Sauna', col: '#FF8040', freq: '3–5× per week — including post-training',
        source: 'Laukkanen et al. (Finnish studies) · Galpin',
        points: [
          'Post-workout sauna is BENEFICIAL — heat shock proteins (HSPs) upregulated by heat actively support muscle adaptation and protein synthesis. This is not the same as cold immersion, which blunts hypertrophy.',
          'GH spikes significantly from exercise + sauna combination. Laukkanen\'s cohort: 4×/week sauna use associated with dramatically reduced cardiovascular disease risk and all-cause mortality.',
          'Plasma volume increases over weeks of consistent post-workout sauna use — this is a meaningful cardiovascular adaptation (Scoon et al., 2007).',
          'Temperature: 80–100°C. Duration: 10–20 min. Exit if heart rate exceeds 150bpm at rest.',
          'Rehydrate immediately after — you lose significant sodium and fluid. Your electrolytes post-sauna, not just post-training.',
        ]
      },
      {
        name: 'Sleep', col: '#9B6DFF', freq: '7–9 hours · Consistency is the variable',
        source: 'Matthew Walker · Andy Galpin · Cheri Mah (Stanford)',
        points: [
          'Galpin\'s framing: sleep is not passive recovery — it\'s the primary anabolic window. GH is secreted in pulses during slow-wave sleep. Disrupting sleep duration directly cuts this.',
          'The two nights after Hades (deadlift sessions) are disproportionately important — CNS demand is highest, and CNS recovery happens exclusively during sleep.',
          'Cheri Mah\'s Stanford athlete research: sleep extension to 10 hours improved sprint times, reaction time, mood and decreased fatigue in elite athletes. More sleep is almost always better.',
          'Consistent wake time is the anchor — the circadian clock is set by your wake time, not your sleep time. The 07:00 alarm is more important than what time you went to bed.',
          'Room: dark, cool (18–19°C), quiet. Magnesium glycinate 30–60 min before bed — supports GABA pathways involved in sleep onset.',
        ]
      },
      {
        name: 'Cold Exposure', col: '#00C8E8', freq: 'Rest days only if desired — NOT post-training',
        source: 'Roberts et al. (J Physiology 2015) · Galpin',
        points: [
          'CRITICAL DISTINCTION: Cold water immersion (CWI) post-training significantly attenuates hypertrophic adaptation. Roberts et al. 2015 showed meaningfully blunted muscle protein synthesis, satellite cell activity, and long-term gains. This is clear, replicated evidence.',
          'This is specifically cold water immersion — not sauna, not cool showers, not contrast therapy. Heat post-workout is a different mechanism entirely.',
          'If you want cold exposure: morning-only or rest days, minimum 4 hours from any training session.',
          'Galpin\'s position: cold is a useful tool for specific goals (acute inflammation management, mood, mental resilience training) but has no place immediately post-resistance training for a hypertrophy-focused athlete.',
          'Ice baths for recovery from injury or acute overuse: different context, appropriate. For routine post-training recovery: counterproductive to your goals.',
        ]
      },
      {
        name: 'Hydration', col: '#00C8E8', freq: '2.5–3L minimum daily · More on training + sauna days',
        source: 'ISSN position stand · Galpin hydration protocols',
        points: [
          'Galpin\'s hydration protocol: body weight in kg × 0.033 = daily litres at minimum. At 81kg: ~2.7L base. Add 500ml per hour of training and 500ml per sauna session.',
          '500ml with electrolytes immediately on waking — overnight dehydration is real and measurable. Fix it before coffee.',
          'Sodium is the primary electrolyte for athletic performance. Your Zepp electrolyte serving (650mg) is well-dosed. On sauna days, consider a second serving.',
          'Urine colour is the reliable real-time marker — pale yellow is the target. Dark yellow means you\'re already behind.',
          'Dehydration of even 1.5% bodyweight meaningfully impairs strength, power output, and cognitive function. At 81kg that\'s just 1.2kg of fluid loss.',
        ]
      },
      {
        name: 'Active Recovery', col: '#F0CC70', freq: 'Every rest day — movement, not sedentary',
        source: 'General sports science · Galpin',
        points: [
          'Galpin\'s principle: rest days are not rest — they\'re low-intensity training days for the aerobic and recovery systems.',
          'Your school run by bike + Tenerife terrain walks are ideal active recovery. Zone 1–2 heart rate (you can hold a conversation). This maintains blood flow to recovering tissue without adding stress.',
          'Full ROM joint movements on rest days — bodyweight squats, hip hinges, shoulder circles, neck rotations. 5–10 minutes maintains mobility and prevents the restriction patterns that accumulate over time.',
          'The parasympathetic state on rest days is the target. Sauna, light movement, time outdoors — all support this.',
          'Galpin: cardiovascular adaptations from training are expressed and compounded on rest days, not during training. Don\'t waste them by being sedentary.',
        ]
      },
    ];

    const standardCards = recoveryCards.map(r => `
      <div style="background:var(--bg2);border-left:3px solid ${r.col};border-radius:0 var(--r) var(--r) 0;padding:12px 14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
          <div style="font-size:13px;font-weight:600;color:${r.col};">${r.name}</div>
          <div style="font-size:10px;color:var(--text3);font-style:italic;text-align:right;">${r.freq}</div>
        </div>
        <div style="font-size:9px;color:var(--text4);margin-bottom:8px;">${r.source}</div>
        <ul class="guide-list">${r.points.map(p=>`<li>${p}</li>`).join('')}</ul>
      </div>`).join('');

    return `
    <div class="guide-insight">
      <strong>Primary sources for this section:</strong> Andy Galpin (parasympathetic downregulation, CO₂ tolerance, recovery physiology), Matthew Walker (sleep architecture and athletic performance), Jari Laukkanen et al. (Finnish sauna cohort studies, JAMA Internal Medicine 2015), James Roberts et al. (cold vs heat differentiation, J Physiology 2015), Andrew Huberman / Jack Feldman (breathing mechanisms, Stanford/UCLA), Cheri Mah (sleep extension and athletic performance, Stanford).
      <br><br>
      <strong>Corrected from earlier version:</strong> The previous guide stated sauna should not be used within 2 hours of training. This was incorrect — that restriction applies to <em>cold water immersion</em>, which blunts hypertrophy. Heat has a different mechanism and is beneficial post-training.
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:14px 0 8px;">Breathing Protocols</div>
    ${breathingCards}

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Post-Training Protocol</div>
    ${combinedProtocol}

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Recovery Pillars</div>
    ${standardCards}`;
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
  },

  kitchen() {
    const serve = (items, col) => items.map(i => `
      <tr>
        <td style="font-weight:600;white-space:nowrap;">${i.name}</td>
        <td style="color:var(--text3);font-size:11px;">${i.serving}</td>
        <td style="font-family:var(--fn-mono);font-weight:600;color:${col};">${i.kcal}</td>
        <td style="font-family:var(--fn-mono);color:var(--atlas);">${i.p}g</td>
        <td style="font-family:var(--fn-mono);color:var(--apollo);">${i.c}g</td>
        <td style="font-family:var(--fn-mono);color:var(--hades);">${i.f}g</td>
        ${i.note ? `<td style="font-size:10px;color:var(--text3);font-style:italic;">${i.note}</td>` : '<td></td>'}
      </tr>`).join('');

    const tHead = `<thead><tr>
      <th>Item</th><th>Serving</th><th style="color:var(--gold);">kcal</th>
      <th style="color:var(--atlas);">P</th><th style="color:var(--apollo);">C</th>
      <th style="color:var(--hades);">F</th><th>Note</th>
    </tr></thead>`;

    const proteins = [
      { name:'Chicken Breast',    serving:'200g raw',     kcal:230, p:48, c:0,  f:4,  note:'Weighs raw. ~25% shrink when cooked.' },
      { name:'Beef Mince (lean)', serving:'200g raw',     kcal:360, p:42, c:0,  f:22, note:'5% fat mince. Use 15% for more kcal.' },
      { name:'Salmon Fillet',     serving:'180g raw',     kcal:306, p:36, c:0,  f:18, note:'Rich in omega-3. Cook from fresh.' },
      { name:'Eggs',              serving:'3 large',      kcal:210, p:18, c:1,  f:15, note:'Whole eggs. Yolk is 75% of the kcal.' },
      { name:'Back Bacon',        serving:'100g cooked',  kcal:218, p:22, c:0,  f:14, note:'Rashers. No need to weigh raw.' },
      { name:'Greek Yogurt (FF)', serving:'250g',         kcal:202, p:18, c:10, f:10, note:'Full fat only. Fage 5% or Total.' },
      { name:'Whey Protein',      serving:'1 scoop 35g',  kcal:130, p:25, c:4,  f:2,  note:'Gap filler only. Food first.' },
      { name:'Tuna (tinned)',     serving:'1 tin 120g',   kcal:121, p:28, c:0,  f:1,  note:'Drained weight. In spring water.' },
      { name:'Cottage Cheese',    serving:'200g',         kcal:145, p:22, c:6,  f:4,  note:'Good slow-release pre-bed option.' },
    ];
    const carbs = [
      { name:'Porridge Oats',   serving:'80g dry',   kcal:295, p:7,  c:55, f:5, note:'Dry weight. Add whole milk not water.' },
      { name:'Basmati Rice',    serving:'80g dry',   kcal:285, p:6,  c:63, f:1, note:'Dry weight = ~220g cooked.' },
      { name:'Pasta',           serving:'90g dry',   kcal:315, p:11, c:66, f:1, note:'Dry weight. Weigh dry, not cooked.' },
      { name:'Sweet Potato',    serving:'200g raw',  kcal:170, p:3,  c:40, f:0, note:'High micronutrient density. Good swap.' },
      { name:'Sourdough Bread', serving:'2 slices',  kcal:200, p:7,  c:38, f:2, note:'Real sourdough, not supermarket "sour".' },
      { name:'Banana',          serving:'1 medium',  kcal:105, p:1,  c:27, f:0, note:'Pre-workout or post-training shake.' },
      { name:'Medjool Dates',   serving:'3 dates',   kcal:210, p:1,  c:54, f:0, note:'Pre-training -20min. Fast glucose.' },
      { name:'Muesli',          serving:'60g',       kcal:228, p:5,  c:38, f:6, note:'Add to porridge for density + crunch.' },
    ];
    const fats = [
      { name:'Kerrygold Butter', serving:'15g (1 tbsp)',  kcal:108, p:0, c:0,  f:12, note:'On bread, in eggs, on veg.' },
      { name:'Olive Oil (EVOO)', serving:'15ml (1 tbsp)', kcal:124, p:0, c:0,  f:14, note:'Cooking + drizzle on meals.' },
      { name:'Avocado',          serving:'½ fruit ~80g',  kcal:128, p:2, c:4,  f:12, note:'With eggs or as a side. Satiating.' },
      { name:'Peanut Butter',    serving:'2 tbsp 32g',    kcal:194, p:7, c:6,  f:16, note:'With porridge, yogurt, pre-bed.' },
      { name:'Honey',            serving:'1 tbsp 20g',    kcal:62,  p:0, c:17, f:0,  note:'On porridge or yogurt. Pure carbs.' },
      { name:'Whole Milk',       serving:'250ml',         kcal:168, p:8, c:12, f:10, note:'Kerrygold full-fat. Everything.' },
      { name:'Cheddar Cheese',   serving:'30g',           kcal:120, p:7, c:0,  f:10, note:'On eggs or pasta for easy kcal.' },
    ];

    const meals = [
      {
        name:'Porridge Bowl', tag:'Breakfast A', kcal:910, p:45, c:115, f:32, col:'#00E587',
        ing:[
          ['Porridge oats','80g dry'],['Whole milk (cooking)','250ml'],['Muesli','60g'],
          ['Greek yogurt (FF)','100g'],['Peanut butter','1 tbsp'],['Honey','1 tbsp'],
        ],
        method:'Bring milk to simmer, add oats, stir 4 min on medium. Top with yogurt, muesli, PB, honey. Eat immediately.'
      },
      {
        name:'Irish Breakfast', tag:'Breakfast B', kcal:870, p:52, c:34, f:55, col:'#FF8040',
        ing:[
          ['Eggs','3 large'],['Back bacon','100g'],['Avocado','½'],
          ['Sourdough bread','2 slices'],['Kerrygold butter','15g'],
        ],
        method:'Fry bacon, scramble or fry eggs in butter. Toast bread, butter generously. Serve with sliced avocado. Season with black pepper.'
      },
      {
        name:'Chicken, Rice & Broccoli', tag:'Dinner A', kcal:690, p:60, c:70, f:16, col:'#4DA6FF',
        ing:[
          ['Chicken breast','220g raw'],['Basmati rice','90g dry'],['Broccoli','200g'],
          ['Olive oil','1 tbsp'],['Garlic + seasoning','to taste'],
        ],
        method:'Cook rice (15 min). Season chicken, cook in olive oil 6 min each side until 75°C core. Steam broccoli 4–5 min. Plate together — drizzle the pan juices over rice.'
      },
      {
        name:'Beef Mince & Pasta', tag:'Dinner B', kcal:780, p:54, c:72, f:26, col:'#FF5C2B',
        ing:[
          ['Beef mince (lean)','200g raw'],['Pasta','90g dry'],['Tinned tomatoes','400g'],
          ['Olive oil','1 tbsp'],['Garlic','2 cloves'],['Mixed herbs','generous'],
        ],
        method:'Brown mince, drain excess fat. Add garlic 1 min. Add tomatoes + herbs, simmer 10 min. Cook pasta separately al dente. Combine. Add cheddar if needed for kcal.'
      },
      {
        name:'Pre-bed Bowl', tag:'Pre-bed 22:00', kcal:645, p:37, c:68, f:28, col:'#9B6DFF',
        ing:[
          ['High-protein cereal','50g'],['Greek yogurt (FF)','250g'],
          ['Peanut butter','2 tbsp'],['Honey','optional drizzle'],
        ],
        method:'Layer yogurt → cereal → PB → honey. Eat cold. Casein protein from yogurt supports overnight muscle protein synthesis.'
      },
      {
        name:'Post-training Shake', tag:'Post-workout', kcal:420, p:34, c:50, f:12, col:'#C9A84C',
        ing:[
          ['Whey protein','1 scoop 35g'],['Whole milk','350ml'],
          ['Banana','1 medium'],['Optional: oats','30g for more kcal'],
        ],
        method:'Blend or shake. Drink within 30 min of training. If adding oats, blend — don\'t shake. Add creatine here if convenient.'
      },
    ];

    const mealCards = meals.map(m => `
      <div style="background:var(--bg2);border-radius:var(--r-lg);border:.5px solid ${m.col}30;border-top:2px solid ${m.col};padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:4px;">
          <div>
            <div style="font-size:15px;font-weight:700;color:${m.col};">${m.name}</div>
            <div style="font-size:10px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;">${m.tag}</div>
          </div>
          <div style="display:flex;gap:10px;text-align:center;flex-shrink:0;">
            <div><div style="font-family:var(--fn-mono);font-size:16px;font-weight:700;color:${m.col};">${m.kcal}</div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;">kcal</div></div>
            <div><div style="font-family:var(--fn-mono);font-size:16px;font-weight:700;color:var(--atlas);">${m.p}g</div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;">prot</div></div>
            <div><div style="font-family:var(--fn-mono);font-size:16px;font-weight:700;color:var(--apollo);">${m.c}g</div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;">carbs</div></div>
            <div><div style="font-family:var(--fn-mono);font-size:16px;font-weight:700;color:var(--hades);">${m.f}g</div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;">fat</div></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px;margin-bottom:10px;">
          ${m.ing.map(([name,qty])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:.5px solid var(--border);">
            <span style="color:var(--text2);">${name}</span>
            <span style="font-family:var(--fn-mono);color:var(--text3);">${qty}</span>
          </div>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--text3);line-height:1.55;padding:8px 0 2px;">${m.method}</div>
      </div>`).join('');

    return `
    <div class="guide-insight">
      <strong>Build-a-plate formula:</strong> 200–250g raw protein + 80–100g dry grain (or 200g sweet potato) + 200g veg + 1 tbsp olive oil. This hits ~680–750 kcal, 50–60g protein, 65–75g carbs per meal. Scale up when you need more. Weigh dry and raw — never cooked.
    </div>

    <div style="background:var(--bg2);border-radius:var(--r);padding:12px 14px;margin-bottom:14px;">
      <div style="font-family:var(--fn-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Daily target check</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
        ${[['3200','kcal','var(--gold-l)'],['175g','protein','var(--atlas)'],['360g','carbs','var(--apollo)'],['100g','fat','var(--hades)']].map(([v,l,c])=>`
        <div><div style="font-family:var(--fn-mono);font-size:18px;font-weight:700;color:${c};">${v}</div><div style="font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;">${l}</div></div>`).join('')}
      </div>
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:14px 0 8px;">Standard Meals</div>
    ${mealCards}

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:16px 0 8px;">Protein Sources</div>
    <div class="str-table-wrap" style="margin-bottom:14px;">
      <table class="guide-table"><${tHead}<tbody>${serve(proteins,'var(--atlas)')}</tbody></table>
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:14px 0 8px;">Carbohydrate Sources</div>
    <div class="str-table-wrap" style="margin-bottom:14px;">
      <table class="guide-table"><${tHead}<tbody>${serve(carbs,'var(--apollo)')}</tbody></table>
    </div>

    <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:14px 0 8px;">Fats & Calorie Boosters</div>
    <div class="str-table-wrap">
      <table class="guide-table"><${tHead}<tbody>${serve(fats,'var(--hades)')}</tbody></table>
    </div>
    <p style="font-size:10px;color:var(--text3);font-style:italic;margin-top:8px;">All macros approximate. Protein and carb values rounded to nearest gram.</p>`;
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
        const bwCanvas = el('bw-chart');
        if (bwCanvas) {
          const hist = Store.getBWHistory(90);
          Charts.bwTrend(bwCanvas, hist, Store.get().profile.targetWeight);
        }
        // Auto-select first exercise with enough data for a chart
        const sel = el('ex-select');
        if (sel) {
          const d = Store.get();
          const firstRich = Object.entries(d.exerciseLog)
            .find(([,entries]) => entries.length >= 3);
          if (firstRich) { sel.value = firstRich[0]; this.renderExChart(); }
        }
      });
    }
  },

  renderExChart() {
    const sel = el('ex-select');
    const canvas = el('ex-chart');
    const meta = el('ex-chart-meta');
    if (!sel || !canvas) return;

    const exId = sel.value;
    if (!exId) { canvas.style.display='none'; if(meta) meta.style.display='none'; return; }

    const d = Store.get();
    const entries = (d.exerciseLog[exId] || []).slice(); // oldest first
    if (!entries.length) { canvas.style.display='none'; return; }

    // Find standard for this exercise
    const standard = STANDARDS.find(s => s.id === exId) || { beg:0, int:1, adv:2, type:'abs', color:'#C9A84C' };
    const bw = Store.latestBW();

    canvas.style.display = 'block';
    if (meta) meta.style.display = 'block';

    requestAnimationFrame(() => {
      Charts.strengthChart(canvas, entries, standard, bw);

      if (meta) {
        const last = entries[entries.length-1];
        const eff  = effectiveWt(standard.type, last.weight, bw);
        const intT = standard.int * bw;
        const pct  = Math.round((eff / intT) * 100);
        const typeNote = standard.type === 'bw+' ? ` (+${last.weight}kg added, ${eff.toFixed(1)}kg total)` :
                         standard.type === 'x2'  ? ` (${last.weight}kg ×hand, ${eff.toFixed(1)}kg total)` : '';
        meta.innerHTML = `Latest: <strong>${last.weight}kg</strong>${typeNote} &nbsp;·&nbsp; ${pct}% of intermediate &nbsp;·&nbsp; ${entries.length} sessions logged`;
      }
    });
  },

  // ── Workout ─────────────────────────────────────────────
  startWorkout(sessionId) {
    unlockAudio(); // Unlock before entering workout so beep() works from timers
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
    const notes = (el('session-notes-input')?.value || '').trim();
    const dur = fmtDur(secs);
    if (confirm(`Session complete ✓\nDuration: ${dur}\nExercises logged: ${logged}/${weights.length}\n\nSave and exit?`)) {
      Store.saveSession(WorkoutMode.sessionId, secs, weights, notes);
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

  updateStdBW(val) {
    const bw = parseFloat(val);
    if (!bw || bw < 30 || bw > 300) return;
    const d = Store.get(); d.profile.bodyweight = bw; Store.set(d);
    const tbody = el('str-tbody');
    if (!tbody) return;
    tbody.innerHTML = STANDARDS.map(s => {
      const stored = Store.lastWeight(s.id);
      const eff    = stored !== null ? effectiveWt(s.type, stored, bw) : null;
      const intKg  = (s.int * bw).toFixed(1);
      const begKg  = (s.beg * bw).toFixed(1);
      const advKg  = (s.adv * bw).toFixed(1);
      let pct = 0, cls = '';
      if (eff !== null) { pct = Math.round((eff / (s.int*bw)) * 100); cls = pct>=100?'achieved':pct>=80?'near':''; }
      const dispStored = stored !== null ? `${stored}kg` : '<span style="color:var(--text3)">—</span>';
      const dispEff = (eff !== null && s.type !== 'abs') ? `<span style="font-size:9px;color:var(--text3);"> (${eff.toFixed(1)})</span>` : '';
      return `<tr>
        <td class="col-ex">${s.name}</td>
        <td class="col-beg">${begKg}</td>
        <td class="col-int">${intKg}</td>
        <td class="col-adv">${advKg}</td>
        <td class="col-cur">${dispStored}${dispEff}</td>
        <td class="col-prog">
          <div class="progress-track" style="width:100%;margin-bottom:3px;">
            <div class="progress-fill ${cls}" style="width:${Math.min(pct,100)}%;"></div>
          </div>
          <span class="prog-pct ${cls}">${eff!==null?pct+'%':'—'}</span>
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

  // ── Sleep ─────────────────────────────────────────────────
  _sleepQuality: 4,

  selectSleepQuality(q) {
    this._sleepQuality = q;
    document.querySelectorAll('.sleep-q-btn').forEach(btn => {
      btn.classList.toggle('active', +btn.dataset.q <= q);
    });
  },

  logSleep() {
    const inp = el('sleep-hrs-input');
    if (!inp) return;
    const hrs = parseFloat(inp.value);
    if (!hrs || hrs < 3 || hrs > 14) { inp.focus(); return; }
    Store.logSleep(hrs, this._sleepQuality);
    inp.value = '';
    this.goTab('home');
  },

  // ── Edit past sessions ────────────────────────────────────
  editSession(sessionId) {
    const d = Store.get();
    const sess = d.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    const sessInfo = SESSIONS[sess.sessionId];

    // Build edit modal
    const existing = document.getElementById('edit-modal');
    if (existing) existing.remove();

    const exRows = (sess.exercises || []).map(e => {
      const exInfo = sessInfo.exercises.find(x => x.id === e.exId);
      const name = exInfo ? exInfo.name : e.exId;
      return `<div class="edit-ex-row">
        <div class="edit-ex-name">${name}</div>
        <div style="display:flex;align-items:center;gap:6px;">
          <input class="edit-weight-inp" type="number" inputmode="decimal"
            step="0.25" value="${e.weight || ''}" data-ex-id="${e.exId}" placeholder="kg"
            style="width:72px;padding:7px 8px;background:var(--bg);border:1px solid var(--border2);
                   border-radius:var(--r);color:var(--text);font-family:var(--fn-mono);font-size:16px;text-align:center;">
          <span style="font-size:11px;color:var(--text3);">kg</span>
        </div>
      </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-backdrop" onclick="App.closeEditModal()"></div>
      <div class="edit-sheet">
        <div class="edit-header">
          <div style="font-family:var(--fn-head);font-size:20px;font-weight:800;color:${sessInfo.color};">${sessInfo.name}</div>
          <button onclick="App.closeEditModal()" style="background:none;border:none;color:var(--text3);font-size:20px;padding:4px 8px;cursor:pointer;">✕</button>
        </div>
        <div class="edit-body">
          <div class="edit-field-row">
            <label class="edit-label">Date</label>
            <input id="edit-date" type="date" value="${sess.date}"
              style="padding:8px 10px;background:var(--bg);border:1px solid var(--border2);
                     border-radius:var(--r);color:var(--text);font-family:var(--fn-body);font-size:13px;">
          </div>
          <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin:14px 0 8px;">Weights</div>
          <div id="edit-ex-list">${exRows}</div>
          <div class="edit-field-row" style="margin-top:12px;">
            <label class="edit-label">Notes</label>
            <textarea id="edit-notes" rows="2"
              style="width:100%;padding:8px 10px;background:var(--bg);border:1px solid var(--border2);
                     border-radius:var(--r);color:var(--text);font-family:var(--fn-body);font-size:13px;resize:none;"
              placeholder="Session notes…">${sess.notes || ''}</textarea>
          </div>
        </div>
        <div class="edit-footer">
          <button onclick="App.deleteEditSession('${sessionId}')"
            style="background:none;border:1px solid var(--hades);border-radius:var(--r);
                   color:var(--hades);padding:9px 16px;font-size:12px;font-weight:600;cursor:pointer;">
            Delete Session
          </button>
          <button onclick="App.saveEditSession('${sessionId}')"
            style="background:var(--gold);border:none;border-radius:var(--r);
                   color:var(--bg);padding:9px 20px;font-size:12px;font-weight:700;cursor:pointer;">
            Save Changes
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));
  },

  closeEditModal() {
    const m = el('edit-modal');
    if (m) { m.classList.remove('open'); setTimeout(() => m.remove(), 280); }
  },

  saveEditSession(sessionId) {
    const d = Store.get();
    const idx = d.sessions.findIndex(s => s.id === sessionId);
    if (idx < 0) return;

    const oldDate = d.sessions[idx].date;
    const newDate = el('edit-date')?.value || oldDate;
    const newNotes = el('edit-notes')?.value || '';

    // Collect updated weights
    const updatedExercises = [];
    document.querySelectorAll('.edit-weight-inp').forEach(inp => {
      const exId = inp.getAttribute('data-ex-id');
      const w = parseFloat(inp.value);
      if (exId) updatedExercises.push({ exId, weight: isNaN(w) ? null : w });
    });

    // Update session record
    d.sessions[idx] = {
      ...d.sessions[idx],
      date: newDate,
      week: weekKey(new Date(newDate + 'T12:00:00')),
      exercises: updatedExercises,
      notes: newNotes
    };

    // Update exerciseLog — remove old entries for this session's date, re-add with new values
    updatedExercises.forEach(({ exId, weight }) => {
      if (!weight) return;
      if (!d.exerciseLog[exId]) d.exerciseLog[exId] = [];
      // Find and update the entry matching the old date (by date match)
      const existing = d.exerciseLog[exId].find(e => e.date === oldDate);
      if (existing) {
        existing.weight = weight;
        existing.date = newDate;
        existing.week = weekKey(new Date(newDate + 'T12:00:00'));
      } else {
        d.exerciseLog[exId].push({ ts: Date.now(), date: newDate, week: weekKey(new Date(newDate+'T12:00:00')), weight });
        d.exerciseLog[exId].sort((a,b) => a.date.localeCompare(b.date));
      }
    });

    Store.set(d);
    this.closeEditModal();
    setTimeout(() => this.goTab('log'), 300);
  },

  deleteEditSession(sessionId) {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    const d = Store.get();
    const sess = d.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    // Remove session
    d.sessions = d.sessions.filter(s => s.id !== sessionId);
    // Remove matching exerciseLog entries (same date)
    sess.exercises.forEach(({ exId }) => {
      if (d.exerciseLog[exId]) {
        d.exerciseLog[exId] = d.exerciseLog[exId].filter(e => e.date !== sess.date);
      }
    });
    Store.set(d);
    this.closeEditModal();
    setTimeout(() => this.goTab('log'), 300);
  },

  exportJSON() {
    const d = Store.get();
    const blob = new Blob([JSON.stringify(d, null, 2)], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dorian-triad-backup-${todayStr()}.json`;
    a.click(); URL.revokeObjectURL(url);
  },

  importJSON(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const count = Store.importData(e.target.result);
        alert(`Restore complete. ${count} new session${count!==1?'s':''} imported.`);
        this.goTab('log');
      } catch(err) {
        alert(`Restore failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    input.value = ''; // Reset so same file can be re-imported
  },
};

// ════════════════════════════════════════════════════════════
// 13. INIT
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  Store.initFromSeed();
  App.goTab('home');
});
