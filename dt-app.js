/**
 * DORIAN TRIAD — Interactive App Layer
 * dt-app.js  |  Add <script src="dt-app.js"></script> before </body>
 *
 * Features:
 *   • localStorage workout log with weekly grouping
 *   • Predictive weight input (last session + increment)
 *   • Workout Mode overlay per session (Atlas / Hades / Apollo)
 *   • Session timer + rest timer with audio cue
 *   • Collapsible technique cues
 *   • Strength Standards calculator (bodyweight-relative)
 *   • Slide-in workout log panel
 */

const DT = (function () {
  'use strict';

  /* ── CONSTANTS ────────────────────────────────────────────── */

  const STORE    = 'dorianTriad_v1';
  const SESSIONS = ['atlas', 'hades', 'apollo'];

  const SESSION_COLORS = {
    atlas:  '#00E587',
    hades:  '#FF5C2B',
    apollo: '#4DA6FF',
  };

  const STRENGTH_STANDARDS = [
    { id: 'back-squat',           name: 'Back Squat',        beg: 0.75, int: 1.25, adv: 1.75, eli: 2.0  },
    { id: 'deadlift',             name: 'Deadlift',           beg: 1.0,  int: 1.5,  adv: 2.0,  eli: 2.5  },
    { id: 'incline-barbell',      name: 'Incline Barbell',    beg: 0.5,  int: 0.85, adv: 1.15, eli: 1.4  },
    { id: 'overhead-press',       name: 'Overhead Press',     beg: 0.35, int: 0.6,  adv: 0.85, eli: 1.0  },
    { id: 'pull-ups',             name: 'Pull-ups (+added)',  beg: 0.0,  int: 0.15, adv: 0.4,  eli: 0.65 },
    { id: 'dips',                 name: 'Dips (+added)',      beg: 0.0,  int: 0.2,  adv: 0.5,  eli: 0.75 },
    { id: 'romanian-deadlift',    name: 'Romanian DL',        beg: 0.65, int: 1.1,  adv: 1.5,  eli: 1.8  },
    { id: 'bulgarian-split-squat',name: 'Bulgarian SS (each)',beg: 0.2,  int: 0.4,  adv: 0.6,  eli: 0.8  },
  ];

  /* ── UTILITIES ────────────────────────────────────────────── */

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function isoWeek(d) {
    const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
    const y1 = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil((((utc - y1) / 86400000) + 1) / 7);
  }

  function weekKey(d) {
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}-W${String(isoWeek(dt)).padStart(2, '0')}`;
  }

  function weekDateRange(wk) {
    const [yr, w] = wk.split('-W').map(Number);
    const d = new Date(yr, 0, 1 + (w - 1) * 7);
    d.setDate(d.getDate() - d.getDay() + 1);
    const e = new Date(d); e.setDate(e.getDate() + 6);
    const f = x => x.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
    return `${f(d)} – ${f(e)}`;
  }

  function fmt(n) { return String(Math.floor(n)).padStart(2, '0'); }

  function fmtSecs(s) { return `${fmt(s / 60)}:${fmt(s % 60)}`; }

  function parseRest(text) {
    if (!text) return 90;
    if (text.startsWith('→'))            return 0;   // superset: immediate
    if (/full rest/i.test(text))         return 180;
    if (/3\s*min/i.test(text))           return 180;
    if (/2\.5\s*min/i.test(text))        return 150;
    if (/2\s*min/i.test(text))           return 120;
    if (/90\s*sec/i.test(text))          return 90;
    return 90;
  }

  function beep() {
    try {
      const ac  = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const gn  = ac.createGain();
      osc.connect(gn); gn.connect(ac.destination);
      osc.frequency.setValueAtTime(880, ac.currentTime);
      gn.gain.setValueAtTime(0.28, ac.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
      osc.start(); osc.stop(ac.currentTime + 0.55);
    } catch (_) {}
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  /* ── STORAGE ──────────────────────────────────────────────── */

  function defaultStore() {
    return { v: 1, profile: { bodyweight: 81 }, bwHistory: [], log: {} };
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || defaultStore(); }
    catch (_) { return defaultStore(); }
  }

  function save(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); }
    catch (e) { console.warn('DT storage:', e); }
  }

  /* ── LOG ──────────────────────────────────────────────────── */

  function logEntry(exId, weight) {
    if (!exId || isNaN(+weight)) return;
    const data = load();
    if (!data.log[exId]) data.log[exId] = [];
    data.log[exId].push({
      ts:     Date.now(),
      date:   new Date().toISOString().slice(0, 10),
      week:   weekKey(new Date()),
      weight: +parseFloat(weight).toFixed(2),
    });
    save(data);
  }

  function lastWeight(exId) {
    const entries = (load().log[exId] || []);
    return entries.length ? entries[entries.length - 1].weight : null;
  }

  function recommendedWeight(exId, incrPct) {
    const last = lastWeight(exId);
    if (last === null) return null;
    if (!incrPct)      return last;
    return Math.round(last * (1 + incrPct / 100) * 4) / 4;
  }

  function weeklyLog() {
    const data = load();
    const wks  = {};
    Object.entries(data.log).forEach(([exId, entries]) => {
      entries.forEach(e => {
        const k = e.week || weekKey(new Date(e.date));
        if (!wks[k]) wks[k] = [];
        wks[k].push({ exId, ...e });
      });
    });
    const sorted = {};
    Object.keys(wks).sort().reverse().forEach(k => {
      sorted[k] = wks[k].sort((a, b) => b.ts - a.ts);
    });
    return sorted;
  }

  /* ── SESSION TIMER ────────────────────────────────────────── */

  let _sStart = null, _sInterval = null;

  function startSessionTimer() {
    _sStart = Date.now();
    _sInterval = setInterval(() => {
      const el = document.getElementById('dt-session-timer');
      if (!el) return;
      const s = Math.floor((Date.now() - _sStart) / 1000);
      el.textContent = `${fmt(s / 3600)}:${fmt((s % 3600) / 60)}:${fmt(s % 60)}`;
    }, 1000);
  }

  function stopSessionTimer() {
    clearInterval(_sInterval);
    _sInterval = null;
    _sStart = null;
  }

  /* ── REST TIMER ───────────────────────────────────────────── */

  let _rTotal = 0, _rLeft = 0, _rInterval = null;

  function startRest(seconds, label) {
    clearInterval(_rInterval);
    _rTotal = seconds;
    _rLeft  = seconds;

    const panel     = document.getElementById('dt-rest-panel');
    const countdown = document.getElementById('dt-rest-count');
    const fill      = document.getElementById('dt-rest-fill');
    const lbl       = document.getElementById('dt-rest-label');

    if (!panel) return;
    if (lbl)  lbl.textContent = label || 'Rest';
    panel.classList.add('up');
    vibrate(40);

    const tick = () => {
      _rLeft = Math.max(0, _rLeft - 1);
      const pct = ((_rTotal - _rLeft) / _rTotal) * 100;

      if (countdown) {
        countdown.textContent = fmtSecs(_rLeft);
        countdown.classList.toggle('ending', _rLeft <= 10);
      }
      if (fill) {
        fill.style.width = pct + '%';
        fill.classList.toggle('ending', _rLeft <= 10);
      }

      if (_rLeft <= 0) {
        clearInterval(_rInterval);
        beep();
        vibrate([200, 100, 200]);
        setTimeout(dismissRest, 1800);
      }
    };

    if (countdown) countdown.textContent = fmtSecs(_rLeft);
    if (fill)      fill.style.width = '0%';
    _rInterval = setInterval(tick, 1000);
  }

  function dismissRest() {
    clearInterval(_rInterval);
    const panel = document.getElementById('dt-rest-panel');
    if (panel) panel.classList.remove('up');
  }

  function addRestTime(n) {
    _rLeft  += n;
    _rTotal += n;
    const el = document.getElementById('dt-rest-count');
    if (el) el.textContent = fmtSecs(_rLeft);
    const fill = document.getElementById('dt-rest-fill');
    if (fill) fill.style.width = ((_rTotal - _rLeft) / _rTotal * 100) + '%';
  }

  /* ── EXERCISE DATA EXTRACTION ─────────────────────────────── */

  function extractExercises(sessionId) {
    const sec  = document.getElementById(sessionId);
    if (!sec)  return [];
    const rows = sec.querySelectorAll('.ex-row');
    const exs  = [];

    rows.forEach(row => {
      const nameEl  = row.querySelector('.ex-n');
      const setsEl  = row.querySelector('.ex-s');
      const repsEl  = row.querySelector('.ex-r');
      const cueEl   = row.querySelector('.ex-cue');
      const tgtEl   = row.querySelector('.ex-tgt');
      if (!nameEl) return;

      /* --- Name (strip inner badges/notes to get clean text) --- */
      const clone = nameEl.cloneNode(true);
      clone.querySelectorAll('.ex-ss').forEach(n => n.remove());
      const rawName = clone.textContent.replace(/[★✓]/g, '').trim();

      /* --- Star / SS badge --- */
      const badgeEl  = nameEl.querySelector('span[style]');
      const badgeText = badgeEl ? badgeEl.textContent.trim() : null;
      const isStar    = badgeText === '★';

      /* --- Superset note --- */
      const ssEl   = nameEl.querySelector('.ex-ss');
      const ssNote = ssEl ? ssEl.textContent.trim() : null;

      /* --- Cues --- */
      const cues = [];
      if (cueEl) {
        cueEl.innerHTML.split(/<br\s*\/?>/i).forEach(part => {
          const tmp = document.createElement('div');
          tmp.innerHTML = part;
          const t = tmp.textContent.replace(/^·\s*/, '').trim();
          if (t) cues.push(t);
        });
      }

      /* --- Rest & increment from tgt div --- */
      let restText = '90 sec', incrPct = 0;
      if (tgtEl) {
        const spans = tgtEl.querySelectorAll('span');
        spans.forEach(sp => {
          if (sp.textContent.includes('Rest:')) {
            restText = sp.textContent.replace('Rest:', '').trim();
          }
        });
        const firstText = (tgtEl.childNodes[0] || {}).textContent || '';
        const match = firstText.match(/\+?([\d.]+)%/);
        if (match) incrPct = parseFloat(match[1]);
      }

      const restSecs = parseRest(restText);
      const id = slugify(rawName);

      exs.push({
        id, name: rawName, badgeText, isStar, ssNote, cues,
        sets:     (setsEl ? setsEl.textContent.trim() : '3'),
        reps:     (repsEl ? repsEl.textContent.replace('×', '').trim() : ''),
        restText, restSecs, incrPct,
      });
    });

    return exs;
  }

  /* ── BUILD WORKOUT OVERLAY ────────────────────────────────── */

  function buildOverlay(sessionId) {
    document.getElementById('dt-workout-overlay')?.remove();

    const exs = extractExercises(sessionId);
    const col = SESSION_COLORS[sessionId] || '#C9A84C';
    const NAMES = { atlas: 'ATLAS', hades: 'HADES', apollo: 'APOLLO' };

    const overlay = document.createElement('div');
    overlay.id        = 'dt-workout-overlay';
    overlay.className = 'dt-overlay';

    /* Header */
    overlay.innerHTML = `
      <div class="dt-wk-bar" style="border-bottom-color:${col}40;">
        <div class="dt-wk-name" style="color:${col};">${NAMES[sessionId]}</div>
        <div class="dt-wk-timer" id="dt-session-timer">00:00:00</div>
        <button class="dt-end-btn" onclick="DT.exitWorkout()">End</button>
      </div>
      <div class="dt-ex-scroll" id="dt-ex-scroll"></div>
    `;

    document.body.appendChild(overlay);
    const scroll = overlay.querySelector('#dt-ex-scroll');

    /* Exercise cards */
    exs.forEach(ex => {
      const last    = lastWeight(ex.id);
      const rec     = recommendedWeight(ex.id, ex.incrPct);
      const prevLbl = rec
        ? `Rec: ${rec}kg${last ? ` (last: ${last}kg)` : ''}`
        : (last ? `Last: ${last}kg` : 'First session');

      const card = document.createElement('div');
      card.className = 'dt-card';
      card.setAttribute('data-ex-id', ex.id);
      card.setAttribute('data-anchor', ex.isStar ? 'true' : 'false');
      card.setAttribute('data-rest', ex.restSecs);
      card.style.setProperty('--sc', col);

      const badgeHtml = ex.badgeText
        ? `<span class="dt-card-badge ${ex.isStar ? 'star' : 'ss'}">${ex.badgeText}</span>`
        : '';

      const cuesHtml = ex.cues.map(c => `<li>${c}</li>`).join('');

      const restLabel = ex.restSecs === 0
        ? null
        : fmtSecs(ex.restSecs);

      const restBtnHtml = restLabel
        ? `<button class="dt-rest-btn" style="border-color:${col}55;color:${col};"
             onclick="DT.startRest(${ex.restSecs}, '${ex.name}')">⏱ ${restLabel}</button>`
        : `<span class="dt-rest-btn ss-tag">→ SS</span>`;

      card.innerHTML = `
        <div class="dt-card-top">
          <button class="dt-card-name-btn" onclick="DT.toggleCues(this)">
            <div class="dt-card-name">${ex.name}${badgeHtml}</div>
            <div class="dt-cue-hint">▾ technique cues</div>
          </button>
          <div class="dt-card-setsreps">${ex.sets}&thinsp;×&thinsp;${ex.reps}</div>
        </div>
        ${ex.ssNote ? `<div class="dt-ss-label">${ex.ssNote}</div>` : ''}
        <ul class="dt-cues" hidden>${cuesHtml}</ul>
        <div class="dt-controls">
          <div class="dt-weight-group">
            <div class="dt-prev">${prevLbl}</div>
            <input class="dt-weight-input"
              type="number" inputmode="decimal"
              placeholder="${last || 'kg'}" step="0.5" min="0"
              value="${rec ?? last ?? ''}"
              data-ex-id="${ex.id}"
              onchange="DT.handleWeight(this)"
              onblur="DT.handleWeight(this)">
            <span class="dt-kg">kg</span>
          </div>
          <div class="dt-btn-row">
            ${restBtnHtml}
            <button class="dt-check-btn" onclick="DT.markDone(this)"
              aria-label="Mark complete">✓</button>
          </div>
        </div>
        ${ex.incrPct ? `<div class="dt-incr-lbl">+${ex.incrPct}% / session</div>` : ''}
      `;

      scroll.appendChild(card);
    });

    /* Finish button */
    const footer = document.createElement('div');
    footer.className = 'dt-session-footer';
    footer.innerHTML = `<button class="dt-complete-btn" onclick="DT.finishSession()">Complete Session</button>`;
    scroll.appendChild(footer);

    requestAnimationFrame(() => overlay.classList.add('in'));
  }

  /* ── WORKOUT MODE ─────────────────────────────────────────── */

  let _activeSession = null;

  function enterWorkout(sessionId) {
    _activeSession = sessionId;
    document.body.classList.add('dt-active');
    buildOverlay(sessionId);
    startSessionTimer();
    window.scrollTo(0, 0);
  }

  function exitWorkout() {
    stopSessionTimer();
    dismissRest();
    _activeSession = null;
    document.body.classList.remove('dt-active');
    document.getElementById('dt-workout-overlay')?.remove();
  }

  function finishSession() {
    const elapsed = _sStart ? Math.floor((Date.now() - _sStart) / 1000) : 0;
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    const inputs = document.querySelectorAll('.dt-weight-input');
    const logged = Array.from(inputs).filter(i => i.value && !isNaN(+i.value)).length;
    if (confirm(`Session complete ✓\nDuration: ${m}m ${s}s\nExercises logged: ${logged}\n\nExit workout mode?`)) {
      exitWorkout();
    }
  }

  /* ── CARD INTERACTIONS ────────────────────────────────────── */

  function toggleCues(btn) {
    const card  = btn.closest('.dt-card');
    const cues  = card.querySelector('.dt-cues');
    const hint  = btn.querySelector('.dt-cue-hint');
    if (!cues) return;
    const opening = cues.hidden;
    cues.hidden = !opening;
    if (hint) hint.textContent = opening ? '▴ hide cues' : '▾ technique cues';
    card.classList.toggle('cues-open', opening);
  }

  function handleWeight(input) {
    const exId   = input.getAttribute('data-ex-id');
    const weight = parseFloat(input.value);
    if (!exId || isNaN(weight) || weight <= 0) return;
    logEntry(exId, weight);
    input.classList.add('saved');
    setTimeout(() => input.classList.remove('saved'), 1200);
  }

  function markDone(btn) {
    const card  = btn.closest('.dt-card');
    const isDone = card.classList.toggle('done');
    btn.textContent = isDone ? '✓' : '○';
    vibrate(isDone ? [30, 20, 30] : 15);
    // Auto-log if weight is present
    const inp = card.querySelector('.dt-weight-input');
    if (inp && inp.value && !isNaN(+inp.value)) handleWeight(inp);
    // Scroll next card into view
    if (isDone) {
      const allCards = Array.from(document.querySelectorAll('.dt-card'));
      const idx = allCards.indexOf(card);
      const next = allCards[idx + 1];
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ── STRENGTH STANDARDS SECTION ───────────────────────────── */

  function buildStrengthSection() {
    const prog = document.getElementById('programme');
    if (!prog || document.getElementById('strength-calc')) return;

    const data = load();
    const bw   = data.profile.bodyweight || 81;

    const sec = document.createElement('section');
    sec.className = 'sec';
    sec.id = 'strength-calc';
    sec.innerHTML = `
      <div class="sec-ey">Performance Metrics</div>
      <div class="sec-ti">Strength Standards</div>
      <div class="sec-de">Bodyweight-relative targets across four tiers. Your best logged weights from workout sessions are compared against the Intermediate column. Update bodyweight below to recalculate everything.</div>
      <div class="dt-bw-row">
        <label for="dt-bw-in">Current Bodyweight</label>
        <div class="dt-bw-wrap">
          <input type="number" id="dt-bw-in" inputmode="decimal"
            value="${bw}" step="0.1" min="40" max="250"
            oninput="DT.updateBW(this.value)">
          <span>kg</span>
        </div>
      </div>
      <div class="dt-strength-wrap">
        <table class="dt-str-tbl">
          <thead>
            <tr>
              <th>Exercise</th>
              <th class="col-beg">Beginner</th>
              <th class="col-int">Intermediate</th>
              <th class="col-adv">Advanced</th>
              <th class="col-eli">Elite</th>
              <th>Your Best</th>
              <th>vs Intermediate</th>
            </tr>
          </thead>
          <tbody id="dt-str-body"></tbody>
        </table>
      </div>
      <p class="dt-standards-note">Working set weights as multiples of bodyweight. Logged via Workout Mode. Ratios will be refined as your data builds.</p>
    `;

    prog.parentNode.insertBefore(sec, prog.nextSibling);
    renderStrength(bw);

    /* Inject nav link */
    const nav = document.querySelector('.nav');
    if (nav) {
      const a = document.createElement('a');
      a.href = '#strength-calc';
      a.textContent = 'Strength';
      const nutLink = nav.querySelector('a[href="#nutrition"]');
      nutLink ? nav.insertBefore(a, nutLink) : nav.appendChild(a);
    }
  }

  function renderStrength(bw) {
    const tbody = document.getElementById('dt-str-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    STRENGTH_STANDARDS.forEach(s => {
      const begKg = +(s.beg * bw).toFixed(1);
      const intKg = +(s.int * bw).toFixed(1);
      const advKg = +(s.adv * bw).toFixed(1);
      const eliKg = +(s.eli * bw).toFixed(1);

      const best = lastWeight(s.id);
      let pct = 0, cls = '';
      if (best !== null) {
        pct = Math.round((best / intKg) * 100);
        cls = pct >= 100 ? 'achieved' : pct >= 80 ? 'near' : '';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="col-ex">${s.name}</td>
        <td class="col-beg">${begKg}kg</td>
        <td class="col-int">${intKg}kg</td>
        <td class="col-adv">${advKg}kg</td>
        <td class="col-eli">${eliKg}kg</td>
        <td class="col-cur">${best !== null ? best + 'kg' : '<span style="color:#3A3C3A">—</span>'}</td>
        <td class="col-prog">
          <div class="dt-prog-track">
            <div class="dt-prog-fill ${cls}" style="width:${Math.min(pct, 100)}%;"></div>
          </div>
          <span class="dt-prog-pct ${cls}">${best !== null ? pct + '%' : '—'}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateBW(val) {
    const bw = parseFloat(val);
    if (!bw || bw < 30 || bw > 300) return;
    const data = load();
    data.profile.bodyweight = bw;
    data.bwHistory.push({ date: new Date().toISOString().slice(0, 10), weight: bw });
    save(data);
    renderStrength(bw);
  }

  /* ── LOG PANEL ────────────────────────────────────────────── */

  function buildLogPanel() {
    const panel = document.createElement('div');
    panel.id = 'dt-log-panel';
    panel.className = 'dt-log-panel';
    panel.innerHTML = `
      <div class="dt-log-topbar">
        <div class="dt-log-title">Workout Log</div>
        <button class="dt-log-close" onclick="DT.toggleLog()" aria-label="Close">✕</button>
      </div>
      <div class="dt-log-body" id="dt-log-body">
        <div class="dt-log-empty">No workouts logged yet.<br>Start a session to begin.</div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  function renderLog() {
    const body = document.getElementById('dt-log-body');
    if (!body) return;
    const log = weeklyLog();
    const weeks = Object.keys(log);

    if (!weeks.length) {
      body.innerHTML = '<div class="dt-log-empty">No workouts logged yet.<br>Start a session to begin.</div>';
      return;
    }

    body.innerHTML = weeks.map(wk => {
      const entries = log[wk];
      const rows = entries.map(e => {
        const name = e.exId.split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const date = new Date(e.date).toLocaleDateString('en-IE', {
          weekday: 'short', day: 'numeric', month: 'short',
        });
        return `<div class="dt-log-entry">
          <span class="dt-log-entry-name">${name}</span>
          <span class="dt-log-entry-wt">${e.weight}kg</span>
          <span class="dt-log-entry-date">${date}</span>
        </div>`;
      }).join('');

      return `<div class="dt-week-block">
        <div class="dt-week-hdr">
          ${wk} <span class="dt-week-dates">${weekDateRange(wk)}</span>
        </div>
        ${rows}
      </div>`;
    }).join('');
  }

  function toggleLog() {
    const panel = document.getElementById('dt-log-panel');
    if (!panel) return;
    const opening = panel.classList.toggle('open');
    if (opening) renderLog();
  }

  /* ── INJECT START BUTTONS ─────────────────────────────────── */

  function injectStartButtons() {
    SESSIONS.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec || sec.querySelector('.dt-start-btn')) return;
      const title = sec.querySelector('.sec-ti');
      if (!title) return;
      const col = SESSION_COLORS[id];
      const btn = document.createElement('button');
      btn.className = 'dt-start-btn';
      btn.style.color = col;
      btn.setAttribute('data-session', id);
      btn.innerHTML = `<svg viewBox="0 0 16 16"><polygon points="3,2 13,8 3,14"/></svg>
        Start ${id.charAt(0).toUpperCase() + id.slice(1)} Session`;
      btn.onclick = () => enterWorkout(id);
      title.insertAdjacentElement('afterend', btn);
    });
  }

  /* ── BUILD REST FLOAT PANEL ───────────────────────────────── */

  function buildRestPanel() {
    if (document.getElementById('dt-rest-panel')) return;
    const p = document.createElement('div');
    p.id = 'dt-rest-panel';
    p.className = 'dt-rest-float';
    p.innerHTML = `
      <div class="dt-rest-ex-name" id="dt-rest-label">Rest</div>
      <div class="dt-rest-count" id="dt-rest-count">1:30</div>
      <div class="dt-rest-track">
        <div class="dt-rest-fill" id="dt-rest-fill"></div>
      </div>
      <div class="dt-rest-btns">
        <button onclick="DT.addRestTime(30)">+30s</button>
        <button onclick="DT.dismissRest()">Skip</button>
      </div>
    `;
    document.body.appendChild(p);
  }

  /* ── NAV LOG BUTTON ───────────────────────────────────────── */

  function injectLogButton() {
    const nav = document.querySelector('.nav');
    if (!nav || nav.querySelector('.dt-log-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'dt-log-btn';
    btn.textContent = 'Log';
    btn.onclick = toggleLog;
    nav.appendChild(btn);
  }

  /* ── INIT ─────────────────────────────────────────────────── */

  function init() {
    injectStartButtons();
    buildRestPanel();
    buildStrengthSection();
    buildLogPanel();
    injectLogButton();

    /* Close log on outside click */
    document.addEventListener('click', e => {
      const panel = document.getElementById('dt-log-panel');
      if (panel?.classList.contains('open') && !panel.contains(e.target)) {
        const btn = e.target.closest('.dt-log-btn');
        if (!btn) panel.classList.remove('open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ── PUBLIC API ───────────────────────────────────────────── */
  return {
    enterWorkout,
    exitWorkout,
    finishSession,
    startRest,
    dismissRest,
    addRestTime,
    toggleCues,
    handleWeight,
    markDone,
    updateBW,
    toggleLog,
  };

})();
