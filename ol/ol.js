// ─────────────────────────────────────────────────────────────
// OLIMPIADA MATEMÁTICA — "Problemas difíciles" under Mates (21 Nov 2026).
// A family tournament of Olympiad-style problems built on what he already knows (Mates 5.º, Temas 1-5).
// One problem per round, shown to everyone. Each player takes a private turn ("los demás, no miréis"):
// asks for hints one at a time (100 → 80 → 60 → 40 → 20), types an answer (checked, equivalent forms accepted),
// optionally explains why. The solution only appears when every player has solved it or given up; then the
// narrated animated explanation (the "pizarra"), then the scoreboard. Points only, no money (like Klaxon).
// Bank: ol/bank.js (OL_BANK). Narration: ol/voice.js (OL_VOICE) + ol/au/. Progress: state.ol.
// ─────────────────────────────────────────────────────────────
const OL_MAX = [100, 80, 60, 40, 20];
const OL_UNLOCK = 3;   // solved problems of a level that open the next one
const OL_LEVELS = [
  { n: 1, name: 'Pensador principiante', emoji: '🌱', color: '#2f9e44', desc: 'Acertijos cortos con truco. ¡Cuidado con lo obvio!' },
  { n: 2, name: 'Detective matemático', emoji: '🔎', color: '#1c7ed6', desc: 'Varias pistas, patrones escondidos.' },
  { n: 3, name: 'Estratega', emoji: '♟️', color: '#e8590c', desc: 'Hace falta un plan: suponer, agrupar, probar.' },
  { n: 4, name: 'Maestro de Olimpiadas', emoji: '🏆', color: '#ae3ec9', desc: 'Problemas de competición de verdad.' },
];
let olAudioEl = null, olFilmT = null, olFilmS = null;

// ---------- state ----------
function olState() {
  if (!state.ol) state.ol = { players: [], per: 3, level: 1, seen: [], log: {}, open: 1, game: null };
  return state.ol;
}
const olG = () => olState().game;
const olQ = id => OL_BANK.find(q => q.id === id);
const olE = s => schEsc(s);
const olMd = s => olE(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
function olSolvedIds(level) {   // problems of this level solved by anyone in this household
  const ids = new Set();
  Object.values(olState().log).forEach(p => Object.entries(p).forEach(([id, r]) => { if (r.ok) ids.add(id); }));
  return OL_BANK.filter(q => q.level === level && ids.has(q.id)).map(q => q.id);
}
function olOpenLevel() {        // highest playable level: all four open (her call, 21 Nov 2026)
  return 4;
  let open = 1;
  while (open < 4 && olSolvedIds(open).length >= OL_UNLOCK) open++;
  return Math.max(open, olState().open || 1);
}

// ---------- shell ----------
function olRoot() {
  let r = document.getElementById('ol-root');
  if (!r) { r = document.createElement('div'); r.id = 'ol-root'; document.body.appendChild(r); }
  return r;
}
function olShow(html, cls = '') {
  olStopAudio();
  const r = olRoot(); r.className = cls; r.style.display = 'flex';
  r.innerHTML = `<button class="ol-x" onclick="olClose()" title="Salir">✕</button>` + html;
  if (window.twemoji) twemoji.parse(r, { folder: 'svg', ext: '.svg' });
  r.scrollTop = 0;
}
function olClose() {
  olStopAudio(); clearTimeout(olFilmT);
  const r = document.getElementById('ol-root'); if (r) { r.style.display = 'none'; r.innerHTML = ''; }
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (typeof openSchoolSubject === 'function' && document.getElementById('school-root')) openSchoolSubject('ma');
}
function olStopAudio() {
  if (olAudioEl) { olAudioEl.onended = null; olAudioEl.pause(); olAudioEl = null; }
  if (window.speechSynthesis) speechSynthesis.cancel();
}
function olSound(name) {   // reuses the Klaxon quiz sound effects
  try { const a = new Audio(`qi/au/${name}.mp3`); a.volume = .6; a.play().catch(() => {}); } catch (e) {}
}
// Speak one line: the recorded neural voice if we have it, else the browser's Spanish voice, else just wait.
function olSay(key, text, done) {
  olStopAudio();
  const file = window.OL_VOICE && OL_VOICE[key];
  const fallbackWait = () => { olFilmT = setTimeout(() => done && done(), Math.max(2500, text.length * 65)); };
  if (file) {
    const a = new Audio(`ol/au/${file}`); olAudioEl = a;
    a.onended = () => { if (olAudioEl === a) done && done(); };
    a.play().catch(() => { if (olAudioEl === a) fallbackWait(); });
    return;
  }
  if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
    const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '')); u.lang = 'es-ES'; u.rate = .95;
    const v = speechSynthesis.getVoices().find(v => /^es(-|_)ES/i.test(v.lang)); if (v) u.voice = v;
    u.onend = () => done && done(); speechSynthesis.speak(u); return;
  }
  fallbackWait();
}
function olReadProblem() {
  const q = olQ(olG().cur); olSay(q.id + ':q', q.qSay || q.q, null);
}

// Tile on the Mates page (called from school.js).
function olTile() {
  const solved = new Set(); Object.values(olState().log).forEach(p => Object.entries(p).forEach(([id, r]) => r.ok && solved.add(id)));
  const g = olG();
  return `<button class="sch-ol" onclick="openOl()"><span class="e">🔎</span><span><b>Problemas difíciles · Olimpiada Matemática</b>
    <span>${g ? '⏸️ Partida a medias · ' : ''}Retos para pensar en familia. ${solved.size} / ${OL_BANK.length} resueltos.</span></span></button>`;
}

// ---------- lobby ----------
function openOl() {
  const st = olState(), g = olG();
  const names = st.players.length ? st.players : [''];
  const open = olOpenLevel();
  if (st.level > open) st.level = open;
  const lv = OL_LEVELS.map(L => {
    const all = OL_BANK.filter(q => q.level === L.n), done = olSolvedIds(L.n).length, locked = L.n > open;
    return `<button class="ol-lv ${st.level === L.n ? 'on' : ''} ${locked ? 'locked' : ''}" style="--lc:${L.color}" ${locked ? '' : `onclick="olPickLevel(${L.n})"`}>
      <span class="ol-lv-e">${locked ? '🔒' : L.emoji}</span><span class="ol-lv-n">Nivel ${L.n}</span><span class="ol-lv-name">${L.name}</span>
      <span class="ol-lv-d">${locked ? `Resuelve ${OL_UNLOCK} del nivel ${L.n - 1} para abrirlo` : L.desc}</span>
      <span class="ol-lv-bar"><span style="width:${done / all.length * 100}%"></span></span><span class="ol-lv-c">${done} / ${all.length} resueltos</span></button>`;
  }).join('');
  olShow(`<div class="ol-card ol-lobby">
    <div class="ol-logo">🔎 OLIMPIADA MATEMÁTICA</div>
    <div class="ol-sub">Problemas difíciles · un torneo de detectives en familia</div>
    ${g ? `<div class="ol-resume"><b>Partida a medias</b> · problema ${g.n} de ${g.per} · ${g.players.map(p => olE(p.name)).join(', ')}
      <span class="ol-row"><button class="ol-btn" onclick="olResume()">Continuar ▶</button><button class="ol-btn ghost" onclick="olAbandon()">Empezar otra</button></span></div>` : ''}
    <div class="ol-rules">
      <div>🧠 <b>100</b> puntos sin pistas</div><div>💡 cada pista: máximo <b>−20</b></div><div>❌ si fallas, ¡sigue pensando!</div><div>🐢 no hay prisa: gana quien piensa</div>
    </div>
    <div class="ol-lbl">Detectives</div>
    <div id="ol-names">${names.map((n, i) => olNameRow(n, i)).join('')}</div>
    <button class="ol-btn ghost sm" onclick="olAddName()">＋ Añadir jugador</button>
    <div class="ol-lbl">Nivel</div>
    <div class="ol-levels">${lv}</div>
    ${open < 4 ? `<button class="ol-link" onclick="olUnlockAll()">Abrir todos los niveles (adultos)</button>` : ''}
    <div class="ol-lbl">Problemas en esta partida</div>
    <div class="ol-row">${[1, 3, 5].map(n => `<button class="ol-btn ghost ${n === st.per ? 'on' : ''}" onclick="olPer(${n}, this)">${n}</button>`).join('')}</div>
    <button class="ol-btn big" onclick="olStart()">¡A investigar! ▶</button>
  </div>`, 'lobby');
}
const olNameRow = (n, i) => `<div class="ol-name"><input value="${olE(n)}" placeholder="Jugador ${i + 1}" maxlength="16"><button onclick="this.parentNode.remove()" title="Quitar">✕</button></div>`;
function olAddName() {
  const box = document.getElementById('ol-names'); if (box.children.length >= 6) return;
  box.insertAdjacentHTML('beforeend', olNameRow('', box.children.length)); box.lastChild.querySelector('input').focus();
}
function olReadNames() { return [...document.querySelectorAll('#ol-names input')].map((x, i) => x.value.trim() || `Jugador ${i + 1}`); }
function olPickLevel(n) { const st = olState(); st.players = olReadNames(); st.level = n; save(); openOl(); }
function olPer(n, el) { olState().per = n; el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); }
function olUnlockAll() {
  if (!confirm('¿Abrir los 4 niveles sin tener que superar los anteriores?')) return;
  const st = olState(); st.players = olReadNames(); st.open = 4; save(); openOl();
}
function olAbandon() {
  if (!confirm('¿Dejar la partida a medias y empezar otra?')) return;
  olState().game = null; save(); openOl();
}
function olStart() {
  const names = olReadNames(); if (!names.length) return;
  const st = olState(); st.players = names;
  st.game = { openAtStart: olOpenLevel(), level: st.level, per: st.per, n: 0, cur: null, phase: 'q', applied: 0,
    players: names.map(name => ({ name, score: 0, last: 0 })), turns: [] };
  save();
  document.documentElement.requestFullscreen?.().catch(() => {});
  olNext();
}
function olResume() {
  const g = olG(); if (!g) return openOl();
  if (g.phase === 'reveal') return olReveal();
  if (g.phase === 'board') return olBoard();
  olProblem();
}

// ---------- choosing the next problem: unseen first, from the chosen level ----------
function olNext() {
  const g = olG(), st = olState();
  if (g.n >= g.per) return olFinal();
  const pool = OL_BANK.filter(q => q.level === g.level);
  const played = new Set(g.ids || []);
  let left = pool.filter(q => !st.seen.includes(q.id) && !played.has(q.id));
  if (!left.length) left = pool.filter(q => !played.has(q.id));
  if (!left.length) return olFinal();
  const q = left[Math.floor(Math.random() * left.length)];
  g.ids = [...(g.ids || []), q.id]; g.cur = q.id; g.n++; g.phase = 'q';
  g.turns = g.players.map(() => ({ hints: 0, tries: [], done: false, ok: false, pts: 0, why: '' }));
  if (!st.seen.includes(q.id)) st.seen.push(q.id);
  save();
  olSound('pop');
  olProblem();
}

// ---------- the problem (everyone looks) ----------
function olLevel(n) { return OL_LEVELS[n - 1]; }
function olProblem() {
  const g = olG(), q = olQ(g.cur), L = olLevel(q.level);
  const all = g.turns.every(t => t.done), waiting = g.turns.filter(t => !t.done).length;
  olShow(`<div class="ol-stage" style="--lc:${L.color}">
    <div class="ol-top"><span>Problema ${g.n} de ${g.per}</span><span class="ol-chip">${L.emoji} ${L.name}</span><span class="ol-chip">🧩 ${olE(q.cat)}</span></div>
    <div class="ol-prob">
      <div class="ol-ptitle">${q.emoji} ${olE(q.title)}</div>
      <div class="ol-ptext">${olMd(q.q)}</div>
      ${q.pic ? `<div class="ol-pic">${q.pic}</div>` : ''}
      <button class="ol-read" onclick="olReadProblem()">🔊 Leer en voz alta</button>
    </div>
    <div class="ol-lbl light">Cada detective, en su turno · toca tu nombre</div>
    <div class="ol-players">${g.players.map((p, i) => olPlayerChip(i)).join('')}</div>
    <div class="ol-hint">Pensad con papel y lápiz. Las pistas son secretas: solo las ve quien las pide.</div>
    <button class="ol-btn big ${all ? '' : 'ghost'}" onclick="olRevealAsk()">🔎 Ver la solución${all ? '' : ` · ${waiting} pensando`}</button>
  </div>`, 'q');
}
function olPlayerChip(i) {
  const g = olG(), p = g.players[i], t = g.turns[i];
  const st = t.done ? (t.ok ? `✅ +${t.pts}` : '🏳️ 0') : `🤔 ${t.hints ? `💡×${t.hints} · ` : ''}máx. ${OL_MAX[t.hints]}`;
  return `<button class="ol-pl ${t.done ? (t.ok ? 'ok' : 'gave') : ''}" ${t.done ? 'disabled' : `onclick="olTurn(${i})"`}>
    <span class="nm">${olE(p.name)}</span><span class="st">${st}</span></button>`;
}
function olRevealAsk() {
  const g = olG(), left = g.players.filter((p, i) => !g.turns[i].done);
  if (left.length && !confirm(`${left.map(p => p.name).join(', ')} ${left.length > 1 ? 'siguen' : 'sigue'} pensando. Si veis la solución ahora, se ${left.length > 1 ? 'rinden' : 'rinde'} (0 puntos). ¿Seguro?`)) return;
  g.turns.forEach(t => { if (!t.done) { t.done = true; t.ok = false; t.pts = 0; } });
  olReveal();
}

// ---------- one player's private turn ----------
function olTurn(i, msg = '', cls = '') {
  const g = olG(), q = olQ(g.cur), p = g.players[i], t = g.turns[i], L = olLevel(q.level);
  const nextMax = OL_MAX[t.hints + 1];
  olShow(`<div class="ol-turn" style="--lc:${L.color}">
    <div class="ol-who">Turno de <b>${olE(p.name)}</b> <span class="ol-shh">🙈 los demás, ¡no miréis!</span></div>
    <details class="ol-mini"><summary>${q.emoji} ${olE(q.title)} · ver el problema</summary><div>${olMd(q.q)}</div>${q.pic ? `<div class="ol-pic sm">${q.pic}</div>` : ''}</details>
    <div class="ol-max">Ahora puedes ganar <b>${OL_MAX[t.hints]}</b> puntos</div>
    <div class="ol-hints">${q.hints.slice(0, t.hints).map((h, k) => `<div class="ol-hintcard"><span>💡 Pista ${k + 1}</span>${olMd(h)}</div>`).join('')}</div>
    ${t.hints < 4 ? `<div id="ol-hintask"><button class="ol-btn ghost" onclick="olHintAsk(${i})">💡 Pedir la pista ${t.hints + 1} · tu máximo baja de ${OL_MAX[t.hints]} a ${nextMax}</button></div>` : `<div class="ol-hint">Ya tienes todas las pistas. ¡El último paso es tuyo!</div>`}
    <div class="ol-answer">
      <label>${olE(q.ask || 'Tu respuesta')}</label>
      <input id="ol-ans" autocomplete="off" placeholder="${olE(q.ph || 'Escribe tu respuesta')}" onkeydown="if(event.key==='Enter')olCheck(${i})">
      ${q.why ? `<label class="why">🧠 ${olE(q.why)} <i>(opcional: lo leeremos todos al final)</i></label><textarea id="ol-why" rows="2" placeholder="Porque…">${olE(t.why)}</textarea>` : ''}
      <div id="ol-fb" class="ol-fb ${cls}">${msg}</div>
      <button class="ol-btn big" onclick="olCheck(${i})">Comprobar ✔</button>
    </div>
    <div class="ol-row"><button class="ol-btn ghost" onclick="olProblem()">← Seguir pensando</button>
      <button class="ol-btn ghost" onclick="olGiveUp(${i})">🏳️ Me rindo</button></div>
  </div>`, 'turn');
  setTimeout(() => document.getElementById('ol-ans')?.focus(), 50);
}
function olHintAsk(i) {   // two taps: the cost is said out loud before the hint shows
  const t = olG().turns[i];
  document.getElementById('ol-hintask').innerHTML = `<div class="ol-confirm">¿Seguro? Con la pista ${t.hints + 1} podrás ganar como máximo <b>${OL_MAX[t.hints + 1]}</b> puntos (−20).
    <span class="ol-row"><button class="ol-btn" onclick="olHint(${i})">Sí, ver la pista</button><button class="ol-btn ghost" onclick="olTurn(${i})">No, sigo solo</button></span></div>`;
}
function olHint(i) {
  const g = olG(), t = g.turns[i]; if (t.hints >= 4 || t.done) return;
  t.why = document.getElementById('ol-why')?.value || t.why;
  t.hints++; save(); olSound('pop'); olTurn(i);
}
function olGiveUp(i) {
  const g = olG(), t = g.turns[i];
  if (!confirm(`${g.players[i].name}: ¿te rindes? Este problema te da 0 puntos y verás la solución con los demás.`)) return;
  t.done = true; t.ok = false; t.pts = 0; t.why = document.getElementById('ol-why')?.value || t.why;
  save(); olProblem();
}
function olCheck(i) {
  const g = olG(), q = olQ(g.cur), t = g.turns[i];
  const raw = document.getElementById('ol-ans').value.trim();
  t.why = document.getElementById('ol-why')?.value.trim() || t.why;
  if (!raw) return;
  const r = olJudge(q, raw);
  if (r.unreadable) { save(); return olTurn(i, r.msg, 'warn'); }
  t.tries.push(raw);
  if (r.ok) {
    t.done = true; t.ok = true; t.pts = OL_MAX[t.hints]; save(); olSound('fanfare');
    olShow(`<div class="ol-turn ok"><div class="ol-big">✅ ¡Correcto, ${olE(g.players[i].name)}!</div>
      <div class="ol-pts">+${t.pts}</div><div class="ol-hint">${t.hints ? `Con ${t.hints} ${t.hints > 1 ? 'pistas' : 'pista'}.` : '¡Sin pistas! Detective de verdad 🕵️'}</div>
      <div class="ol-shh big">🤫 ¡No digas la respuesta! Los demás siguen pensando.</div>
      <button class="ol-btn big" onclick="olProblem()">Volver al problema →</button></div>`, 'turn good');
    return;
  }
  save(); olSound('buzz');
  olTurn(i, `❌ <b>${olE(raw)}</b> no es correcto. ${r.msg || olNope(t.tries.length)}`, 'bad');
}
const olNope = n => ['¡Sigue pensando!', 'Revisa tu razonamiento paso a paso.', '¿Has comprobado tu respuesta con el enunciado?', 'Una pista podría ayudarte… o un dibujo.'][Math.min(n - 1, 3)];

// ---------- answer checking ----------
// Numbers: "1.275", "1 275", "1275 €", "el día 8" all read as the numbers in them; Spanish thousands dots are
// joined; commas separate numbers. A number answer is right when its numbers are the expected one(s), plus
// any listed as also-fine (e.g. "8 conejos y 12 gallinas"), or when he shows his working and the LAST number is
// the answer ("63 − 36 = 27, soy el 36") - unless he hedges with "o" ("3 o 4"). Text answers: a word list minus
// forbidden words; `last` = the last of those words he names decides ("miércoles + 2 = viernes"); `liars` = names
// he says lie are ignored ("Solo Bea; Ana y Carlos mienten").
function olNums(s) {
  const t = s.replace(/(\d)[.\s](?=\d{3}(\D|$))/g, '$1');   // all answers are whole numbers: commas separate
  return (t.match(/\d+(\.\d+)?/g) || []).map(Number);   // a hyphen is a minus sign, not a negative number
}
const olNorm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
function olJudge(q, raw) {
  const a = q.ans;
  if (a.num !== undefined) {
    const ns = olNums(raw);
    if (!ns.length) return { unreadable: true, msg: '🤔 No veo ningún número. Escribe tu respuesta con cifras, por ejemplo <b>12</b>.' };
    const okSet = new Set([a.num, ...(a.also || [])]);
    const last = ns[ns.length - 1], hedged = / o /.test(' ' + olNorm(raw) + ' ');
    const ok = !hedged && ((ns.includes(a.num) && ns.every(n => okSet.has(n))) || last === a.num);
    if (ok) return { ok: true };
    const trap = (q.traps || []).find(tr => tr.v === last) || (q.traps || []).find(tr => ns.includes(tr.v));
    return { ok: false, msg: trap ? trap.m : '' };
  }
  let txt = raw;
  if (a.liars) txt = olNorm(raw).replace(/\b(ana|bea|carlos)( y (ana|bea|carlos))* (no dicen la verdad|no dice la verdad|mienten|miente|no)\b/g, ' ');
  const n = ' ' + olNorm(txt) + ' ';
  const has = w => n.includes(' ' + olNorm(w) + ' ');
  let ok;
  const isAns = w => a.text.some(t => olNorm(t) === olNorm(w));
  if (a.last || a.first) {   // the last (or first) of these words he names decides
    const list = a.last || a.first, at = w => a.last ? n.lastIndexOf(' ' + olNorm(w) + ' ') : n.indexOf(' ' + olNorm(w) + ' ');
    const pos = list.map(w => ({ w, i: at(w) })).filter(x => x.i >= 0).sort((x, y) => a.last ? y.i - x.i : x.i - y.i);
    ok = !!pos.length && isAns(pos[0].w);
  } else if (a.mid) {        // the whole line written out: the middle one decides
    const pos = a.mid.map(w => ({ w, i: n.indexOf(' ' + olNorm(w) + ' ') })).filter(x => x.i >= 0).sort((x, y) => x.i - y.i);
    const pick = pos.length === a.mid.length ? pos[(a.mid.length - 1) / 2] : pos[0];   // fewer names: the first one decides
    ok = !!pick && isAns(pick.w) && !/ o /.test(n);
  } else ok = a.text.some(has) && !(a.forbid || []).some(has);
  if (ok) return { ok: true };
  const trap = (q.traps || []).find(tr => has(String(tr.v)));
  return { ok: false, msg: trap ? trap.m : '' };
}

// ---------- the solution (everyone looks) ----------
function olReveal() {
  const g = olG(), q = olQ(g.cur), L = olLevel(q.level);
  g.phase = 'reveal'; olApply(); save();
  olSound('fanfare');
  olShow(`<div class="ol-stage reveal" style="--lc:${L.color}">
    <div class="ol-top"><span>Problema ${g.n} de ${g.per}</span><span class="ol-chip">${q.emoji} ${olE(q.title)}</span></div>
    <div class="ol-sol">${olE(q.answer)}</div>
    <div class="ol-idea"><span>💡 La idea clave</span>${olMd(q.idea)}</div>
    <ol class="ol-steps">${q.steps.map(s => `<li>${olMd(s)}</li>`).join('')}</ol>
    <div class="ol-res">${g.players.map((p, i) => { const t = g.turns[i];
      return `<div class="ol-resrow ${t.ok ? 'ok' : ''}"><span class="nm">${t.ok ? '✅' : '🏳️'} ${olE(p.name)}</span>
        <span class="ht">${t.hints ? `💡×${t.hints}` : t.ok ? 'sin pistas' : ''}${t.tries.length > 1 ? ` · ${t.tries.length} intentos` : ''}</span><span class="sc">+${t.pts}</span>
        ${t.why ? `<span class="why">“${olE(t.why)}”</span>` : ''}</div>`; }).join('')}</div>
    <div class="ol-row">
      <button class="ol-btn big" onclick="olFilm(0)">▶ Ver la explicación animada</button>
      <button class="ol-btn big ghost" onclick="olBoard()">Marcador →</button>
    </div>
  </div>`, 'reveal');
}
function olApply() {   // add this round's points once, and remember each player's best result per problem
  const g = olG(); if (g.applied === g.n) return;
  const log = olState().log;
  g.players.forEach((p, i) => {
    const t = g.turns[i]; p.last = t.pts; p.score += t.pts;
    const mine = log[p.name] || (log[p.name] = {}), old = mine[g.cur];
    if (!old || t.pts > old.pts) mine[g.cur] = { ok: t.ok, pts: t.pts, hints: t.hints, at: todayStr() };
  });
  g.applied = g.n;
}

// ---------- the animated, narrated explanation ("la pizarra") ----------
// Each film step adds elements to the board (or clears it) and has one narrated line; the next step starts when the
// line ends. Elements with the same key k replace the earlier one in place, so a picture can change step by step.
function olFilm(i) {
  const g = olG(), q = olQ(g.cur), L = olLevel(q.level);
  clearTimeout(olFilmT);
  olFilmS = { i, playing: true };
  olShow(`<div class="ol-film" style="--lc:${L.color}">
    <div class="ol-board" id="ol-board"></div>
    <div class="ol-sub2" id="ol-say"></div>
    <div class="ol-ctrl">
      <button onclick="olFilmGo(-1)" title="Anterior">⏮</button>
      <button id="ol-pp" onclick="olFilmPause()" title="Pausa">⏸</button>
      <button onclick="olFilmGo(0)" title="Repetir">🔁</button>
      <button onclick="olFilmGo(1)" title="Siguiente">⏭</button>
      <span class="ol-dots" id="ol-dots"></span>
      <button class="ol-btn" onclick="olBoard()">Marcador →</button>
    </div>
  </div>`, 'film');
  olFilmStep(i);
}
function olFilmStep(i) {
  const g = olG(), q = olQ(g.cur), F = q.film;
  clearTimeout(olFilmT);
  if (i >= F.length) return olFilmEnd();
  olFilmS.i = i;
  const b = document.getElementById('ol-board'); if (!b) return;
  b.innerHTML = olScene(F, i);
  if (window.twemoji) twemoji.parse(b, { folder: 'svg', ext: '.svg' });
  document.getElementById('ol-say').innerHTML = olMd(F[i].say);
  document.getElementById('ol-dots').innerHTML = F.map((s, k) => `<i class="${k < i ? 'past' : k === i ? 'now' : ''}" onclick="olFilmJump(${k})"></i>`).join('');
  if (olFilmS.playing) olSay(`${q.id}:${i}`, F[i].say, () => { olFilmT = setTimeout(() => olFilmStep(i + 1), 900); });
}
function olFilmGo(d) { olStopAudio(); olFilmS.playing = true; olPP(); olFilmStep(Math.max(0, olFilmS.i + d)); }
function olFilmJump(k) { olStopAudio(); olFilmS.playing = true; olPP(); olFilmStep(k); }
function olFilmPause() {
  olFilmS.playing = !olFilmS.playing; olPP();
  if (olFilmS.playing) olFilmStep(olFilmS.i); else { olStopAudio(); clearTimeout(olFilmT); }
}
function olPP() { const b = document.getElementById('ol-pp'); if (b) b.textContent = olFilmS.playing ? '⏸' : '▶'; }
function olFilmEnd() {
  const b = document.getElementById('ol-board'); if (!b) return;
  b.insertAdjacentHTML('beforeend', `<div class="olf-end">¡Ah, ahora lo entiendo! 💡<span class="ol-row">
    <button class="ol-btn" onclick="olFilm(0)">🔁 Otra vez</button><button class="ol-btn" onclick="olBoard()">Marcador →</button></span></div>`);
  if (window.twemoji) twemoji.parse(b, { folder: 'svg', ext: '.svg' });
  olFilmS.playing = false; olPP();
}
function olScene(F, i) {
  let start = 0; for (let k = i; k >= 0; k--) if (F[k].clear) { start = k; break; }
  const els = [];
  for (let k = start; k <= i; k++) (F[k].show || []).forEach(e => {
    const item = { e, fresh: k === i };
    const at = e.k ? els.findIndex(x => x.e.k === e.k) : -1;
    if (at >= 0) els[at] = item; else els.push(item);
  });
  return els.map(x => olEl(x.e, x.fresh)).join('');
}
function olTok(s, d) {   // token flags: ! highlight, ~ crossed out, + green, - red; "#hex|x" coloured disc
  let cls = '', m;
  while (/^[!~+\-]/.test(s) && s.length > 1) { cls += { '!': ' hl', '~': ' off', '+': ' good', '-': ' bad' }[s[0]]; s = s.slice(1); }
  let bg = ''; if ((m = s.match(/^(#[0-9a-f]{3,6})\|(.*)$/i))) { bg = `background:${m[1]};`; s = m[2]; cls += ' disc'; }
  return `<span class="olf-tok${cls}" style="${bg}--d:${d}ms">${olMd(s)}</span>`;
}
function olEl(e, fresh) {
  const c = fresh ? ' in' : '';
  switch (e.t) {
    case 'h': return `<div class="olf-h${c}">${olMd(e.x)}</div>`;
    case 'p': return `<div class="olf-p${c}">${olMd(e.x)}</div>`;
    case 'eq': return `<div class="olf-eq${c}">${olMd(e.x)}</div>`;
    case 'idea': return `<div class="olf-idea${c}"><i>💡</i><span>${olMd(e.x)}</span></div>`;
    case 'ans': return `<div class="olf-ans${c}">${olMd(e.x)}</div>`;
    case 'row': return `<div class="olf-row${c}${e.sm ? ' sm' : ''}">${e.label ? `<span class="olf-lab">${olMd(e.label)}</span>` : ''}${e.items.map((s, k) => olTok(String(s), fresh ? k * (e.gap || 140) : 0)).join('')}</div>`;
    case 'cols': return `<div class="olf-cols${c}">${e.items.map(x => `<div>${olEl(x, false)}</div>`).join('')}</div>`;
    case 'tbl': return `<table class="olf-tbl${c}">${e.rows.map((r, ri) => `<tr>${r.map(v => { v = String(v); const hl = v[0] === '!' && v.length > 1; return `<${ri === 0 && e.head ? 'th' : 'td'} class="${hl ? 'hl' : ''}">${olMd(hl ? v.slice(1) : v)}</${ri === 0 && e.head ? 'th' : 'td'}>`; }).join('')}</tr>`).join('')}</table>`;
    case 'grid': {
      const hl = new Set(e.hl || []), hl2 = new Set(e.hl2 || []), off = new Set(e.off || []);
      return `<div class="olf-grid${c}" style="grid-template-columns:repeat(${e.cols},1fr)">${Array.from({ length: e.n }, (_, k) => { const v = (e.start ?? 1) + k;
        return `<span class="${hl.has(v) && hl2.has(v) ? 'both' : hl.has(v) ? 'hl' : hl2.has(v) ? 'hl2' : ''}${off.has(v) ? ' off' : ''}" style="--d:${fresh ? k * (e.stagger || 0) : 0}ms">${e.labels ? e.labels[k] : v}</span>`; }).join('')}</div>`;
    }
    case 'svg': return `<svg class="olf-svg${c}" viewBox="${e.vb}" style="height:${e.h || '45%'}">${e.x}</svg>`;
    default: return '';
  }
}

// ---------- scoreboard ----------
function olBoard() {
  olStopAudio(); clearTimeout(olFilmT);
  const g = olG(); if (!g) return openOl();
  g.phase = 'board'; olApply(); save();
  const done = g.n >= g.per;
  const rows = [...g.players].sort((a, b) => b.score - a.score);
  const max = Math.max(100, ...rows.map(p => p.score));
  olShow(`<div class="ol-board-s"><div class="ol-logo sm">Marcador</div><div class="ol-sub">Después del problema ${g.n} de ${g.per}</div>
    ${rows.map(p => `<div class="ol-bar"><span class="nm">${olE(p.name)}</span>
      <span class="tr"><span class="fill" style="width:${p.score / max * 100}%"></span></span>
      <span class="sc">${p.score}</span><span class="dl">${p.last ? '+' + p.last : ''}</span></div>`).join('')}
    <button class="ol-btn big" onclick="${done ? 'olFinal()' : 'olNext()'}">${done ? 'Resultado final 🏆' : 'Siguiente problema 🔎'}</button>
  </div>`, 'board');
}
function olFinal() {
  const g = olG(); if (!g) return openOl();
  if (g.phase !== 'board' && g.cur) olApply();
  const rows = [...g.players].sort((a, b) => b.score - a.score);
  const top = rows[0].score, L = olLevel(g.level);
  olState().game = null; save();
  const open = olOpenLevel(), next = OL_LEVELS[open - 1];
  olSound('fanfare');
  olShow(`<div class="ol-board-s"><div class="ol-logo">🏆 ${rows.filter(p => p.score === top).map(p => olE(p.name)).join(' & ')}</div>
    <div class="ol-sub">${top ? `¡Gana con ${top} puntos!` : '¡Hoy los problemas ganaron! La próxima vez, a por ellos.'} · ${L.emoji} ${L.name}</div>
    ${rows.map((p, i) => `<div class="ol-bar"><span class="nm">${['🥇', '🥈', '🥉'][i] || ''} ${olE(p.name)}</span><span class="tr"></span><span class="sc">${p.score}</span><span class="dl"></span></div>`).join('')}
    ${open > (g.openAtStart || 1) && next ? `<div class="ol-unlock">🔓 ¡Nivel ${open} abierto: ${next.emoji} ${next.name}!</div>` : ''}
    <div class="ol-hint">Lo importante no es correr: es no rendirse y entender el truco. 🧠</div>
    <div class="ol-row"><button class="ol-btn big" onclick="openOl()">Otra partida 🔎</button><button class="ol-btn big ghost" onclick="olClose()">Salir</button></div>
  </div>`, 'board');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('ol-root')?.style.display === 'flex' && !document.fullscreenElement) olClose(); });

// ---------- styles ----------
(function () {
  const css = `
  #ol-root{position:fixed;inset:0;z-index:9999;display:none;align-items:flex-start;justify-content:center;overflow-y:auto;
    background:radial-gradient(circle at 20% 0%,#3b2a7a 0,#1d1442 60%);color:#fff;font-family:'Nunito',sans-serif;padding:4vh 4vw 6vh;box-sizing:border-box;}
  #ol-root.turn{background:#14213d;} #ol-root.turn.good{background:#0b6e4f;} #ol-root.film{background:#0f0a24;padding:2vh 2vw;}
  #ol-root .ol-x{position:fixed;top:12px;right:16px;background:rgba(255,255,255,.15);color:#fff;border:0;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer;z-index:3;}
  #ol-root > div{width:100%;max-width:1200px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:min(2vh,16px);margin:auto;}
  #ol-root img.emoji{height:1em;width:1em;vertical-align:-0.12em;}
  .ol-logo{font-family:'Fredoka One',sans-serif;font-size:clamp(30px,5.2vw,80px);letter-spacing:.03em;color:#ffd43b;line-height:1.05;text-shadow:0 4px 0 #0005;}
  .ol-logo.sm{font-size:clamp(26px,3.6vw,54px);}
  .ol-sub{font-size:clamp(15px,1.8vw,26px);opacity:.85;}
  .ol-rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px 18px;font-size:clamp(14px,1.4vw,20px);background:rgba(255,255,255,.08);padding:12px 18px;border-radius:16px;width:100%;box-sizing:border-box;}
  .ol-rules b{color:#ffd43b;}
  .ol-lbl{font-size:clamp(12px,1.2vw,17px);text-transform:uppercase;letter-spacing:.12em;opacity:.7;margin-top:4px;} .ol-lbl.light{opacity:.85;}
  #ol-names{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
  .ol-name{display:flex;background:#fff;border-radius:12px;overflow:hidden;}
  .ol-name input{border:0;padding:10px 12px;font-size:clamp(16px,1.6vw,22px);font-family:inherit;font-weight:800;width:min(200px,38vw);color:#1d1442;}
  .ol-name button{border:0;background:#eee;color:#555;padding:0 12px;cursor:pointer;}
  .ol-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center;}
  .ol-btn{border:0;border-radius:14px;padding:11px 20px;font-family:inherit;font-weight:900;font-size:clamp(15px,1.5vw,22px);cursor:pointer;background:#ffd43b;color:#1d1442;box-shadow:0 4px 0 #c99a00;}
  .ol-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #c99a00;}
  .ol-btn.big{font-size:clamp(18px,2.1vw,32px);padding:14px 30px;border-radius:18px;margin-top:4px;}
  .ol-btn.sm{font-size:clamp(13px,1.2vw,17px);padding:8px 14px;}
  .ol-btn.ghost{background:rgba(255,255,255,.13);color:#fff;box-shadow:none;} .ol-btn.ghost.on{background:#ffd43b;color:#1d1442;}
  .ol-link{background:none;border:0;color:#ffd43b;text-decoration:underline;font:inherit;cursor:pointer;font-size:clamp(12px,1.1vw,16px);opacity:.8;}
  .ol-resume{background:#ffd43b;color:#1d1442;border-radius:16px;padding:12px 16px;display:flex;flex-direction:column;gap:8px;font-size:clamp(15px,1.5vw,21px);}
  .ol-resume .ol-btn{background:#1d1442;color:#fff;box-shadow:none;} .ol-resume .ol-btn.ghost{background:transparent;color:#1d1442;border:2px solid #1d1442;}
  .ol-levels{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;width:100%;}
  .ol-lv{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:3px;padding:14px 16px;border-radius:18px;border:3px solid transparent;cursor:pointer;
    background:rgba(255,255,255,.08);color:#fff;font-family:inherit;}
  .ol-lv.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 30%,transparent);}
  .ol-lv.locked{opacity:.45;cursor:default;}
  .ol-lv-e{font-size:30px;} .ol-lv-n{font-size:13px;text-transform:uppercase;letter-spacing:.1em;opacity:.75;} .ol-lv-name{font-family:'Fredoka One';font-size:clamp(17px,1.6vw,22px);}
  .ol-lv-d{font-size:14px;opacity:.85;min-height:2.4em;} .ol-lv-c{font-size:13px;opacity:.75;}
  .ol-lv-bar{width:100%;height:7px;background:rgba(255,255,255,.15);border-radius:9px;overflow:hidden;margin-top:4px;} .ol-lv-bar span{display:block;height:100%;background:var(--lc);}
  .ol-top{display:flex;flex-wrap:wrap;gap:8px 12px;justify-content:center;align-items:center;font-size:clamp(14px,1.5vw,21px);opacity:.92;}
  .ol-chip{background:color-mix(in srgb,var(--lc) 45%,transparent);border:2px solid var(--lc);padding:3px 12px;border-radius:99px;font-weight:800;}
  .ol-prob{background:#fffdf5;color:#1d1442;border-radius:26px;padding:3vh 3vw;box-shadow:0 10px 0 var(--lc);width:100%;box-sizing:border-box;text-align:left;}
  .ol-ptitle{font-family:'Fredoka One';font-size:clamp(24px,3.4vw,52px);color:var(--lc);text-align:center;margin-bottom:1.5vh;}
  .ol-ptext{font-size:clamp(19px,2.3vw,36px);line-height:1.45;font-weight:700;} .ol-ptext b{color:#c2255c;}
  .ol-pic{display:flex;justify-content:center;margin-top:1.5vh;} .ol-pic svg{height:min(30vh,260px);width:auto;} .ol-pic.sm svg{height:150px;}
  .ol-read{margin-top:1.5vh;background:none;border:2px solid #1d144233;color:#1d1442;border-radius:99px;padding:6px 14px;font:800 15px 'Nunito';cursor:pointer;}
  .ol-players{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;}
  .ol-pl{display:flex;flex-direction:column;align-items:center;gap:2px;border:3px solid #fff;background:rgba(255,255,255,.06);color:#fff;border-radius:18px;padding:10px 22px;cursor:pointer;font-family:inherit;min-width:140px;}
  .ol-pl .nm{font:900 clamp(18px,2vw,30px) 'Nunito';} .ol-pl .st{font-size:clamp(13px,1.3vw,18px);opacity:.85;}
  .ol-pl.ok{background:#2f9e44;border-color:#2f9e44;cursor:default;} .ol-pl.gave{opacity:.55;cursor:default;}
  .ol-hint{font-size:clamp(14px,1.5vw,22px);opacity:.85;}
  .ol-turn{max-width:860px !important;}
  .ol-who{font-size:clamp(22px,2.8vw,40px);} .ol-who b{color:#ffd43b;}
  .ol-shh{display:block;font-size:.55em;opacity:.85;} .ol-shh.big{font-size:clamp(17px,2vw,28px);background:rgba(0,0,0,.2);padding:10px 16px;border-radius:14px;}
  .ol-mini{background:rgba(255,255,255,.08);border-radius:14px;padding:8px 14px;width:100%;box-sizing:border-box;text-align:left;font-size:clamp(14px,1.5vw,20px);}
  .ol-mini summary{cursor:pointer;font-weight:800;} .ol-mini div{margin-top:8px;line-height:1.4;} .ol-mini b{color:#ffd43b;}
  .ol-max{font-size:clamp(17px,1.9vw,28px);} .ol-max b{color:#ffd43b;font-size:1.3em;}
  .ol-hints{display:flex;flex-direction:column;gap:10px;width:100%;}
  .ol-hintcard{background:#fff9db;color:#1d1442;border-radius:16px;padding:12px 16px;text-align:left;font-size:clamp(16px,1.8vw,24px);line-height:1.4;border-left:8px solid #ffd43b;animation:olIn .4s;}
  .ol-hintcard span{display:block;font-size:.7em;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#e67700;}
  .ol-confirm{background:rgba(255,212,59,.15);border:2px dashed #ffd43b;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px;font-size:clamp(15px,1.6vw,21px);}
  .ol-confirm b{color:#ffd43b;}
  .ol-answer{display:flex;flex-direction:column;gap:8px;width:100%;background:rgba(255,255,255,.07);border-radius:18px;padding:16px;box-sizing:border-box;}
  .ol-answer label{font-weight:800;font-size:clamp(15px,1.6vw,22px);text-align:left;} .ol-answer label.why{font-weight:700;opacity:.9;} .ol-answer label i{opacity:.7;font-size:.85em;}
  .ol-answer input,.ol-answer textarea{border:0;border-radius:12px;padding:12px 14px;font:800 clamp(20px,2.2vw,32px) 'Nunito';color:#1d1442;}
  .ol-answer textarea{font-size:clamp(15px,1.6vw,21px);font-weight:600;resize:vertical;}
  .ol-fb{min-height:1.2em;font-size:clamp(15px,1.6vw,22px);line-height:1.35;} .ol-fb.bad{color:#ffc9c9;} .ol-fb.warn{color:#ffe066;} .ol-fb b{color:#fff;}
  .ol-big{font-family:'Fredoka One';font-size:clamp(28px,4vw,60px);} .ol-pts{font-family:'Fredoka One';font-size:clamp(60px,10vw,150px);color:#ffd43b;line-height:1;}
  .ol-sol{font-family:'Fredoka One';font-size:clamp(34px,5.5vw,84px);color:#ffd43b;line-height:1.1;}
  .ol-idea{background:#fff9db;color:#1d1442;border-radius:20px;padding:14px 20px;font-size:clamp(17px,2vw,28px);line-height:1.4;text-align:left;border-left:10px solid #ffd43b;}
  .ol-idea span{display:block;font-weight:900;font-size:.7em;text-transform:uppercase;letter-spacing:.08em;color:#e67700;} .ol-idea b{color:#c2255c;}
  .ol-steps{text-align:left;font-size:clamp(15px,1.7vw,24px);line-height:1.45;background:rgba(255,255,255,.07);border-radius:18px;padding:14px 18px 14px 44px;margin:0;width:100%;box-sizing:border-box;}
  .ol-steps b{color:#ffd43b;} .ol-steps li{margin:4px 0;}
  .ol-res{display:flex;flex-direction:column;gap:8px;width:100%;}
  .ol-resrow{display:grid;grid-template-columns:1fr auto auto;gap:4px 14px;align-items:center;background:rgba(255,255,255,.08);border-radius:14px;padding:8px 16px;text-align:left;font-size:clamp(15px,1.7vw,24px);}
  .ol-resrow.ok{background:rgba(47,158,68,.35);} .ol-resrow .nm{font-weight:900;} .ol-resrow .ht{opacity:.8;font-size:.85em;} .ol-resrow .sc{font-weight:900;color:#ffd43b;}
  .ol-resrow .why{grid-column:1/-1;font-style:italic;opacity:.9;font-size:.85em;}
  .ol-board-s{max-width:1000px !important;}
  .ol-bar{display:grid;grid-template-columns:minmax(110px,28%) 1fr auto 3em;align-items:center;gap:14px;width:100%;font:900 clamp(18px,2.3vw,36px) 'Nunito';}
  .ol-bar .nm{text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .ol-bar .tr{height:.8em;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;} .ol-bar .fill{display:block;height:100%;background:#ffd43b;border-radius:99px;transition:width .8s;}
  .ol-bar .sc{color:#ffd43b;text-align:right;} .ol-bar .dl{font-size:.6em;opacity:.8;text-align:left;}
  .ol-unlock{background:#ffd43b;color:#1d1442;font-weight:900;font-size:clamp(17px,2vw,28px);padding:10px 18px;border-radius:14px;}
  /* the pizarra */
  .ol-film{max-width:min(1500px,calc(78vh * 16 / 9)) !important;gap:10px !important;}
  .ol-board{position:relative;width:100%;aspect-ratio:16/9;background:#fffdf5;color:#1d1442;border-radius:22px;box-shadow:0 8px 0 var(--lc);container-type:inline-size;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.2cqw;padding:3cqw 4cqw;box-sizing:border-box;overflow:hidden;
    background-image:linear-gradient(#1d14420a 1px,transparent 1px),linear-gradient(90deg,#1d14420a 1px,transparent 1px);background-size:3cqw 3cqw;}
  .ol-board b{color:#c2255c;}
  .olf-h{font-family:'Fredoka One';font-size:4.4cqw;color:var(--lc);line-height:1.1;}
  .olf-p{font-size:2.7cqw;font-weight:700;line-height:1.35;max-width:88cqw;}
  .olf-eq{font-family:'Fredoka One';font-size:4cqw;letter-spacing:.02em;line-height:1.2;}
  .olf-idea{display:flex;gap:1.4cqw;align-items:center;background:#fff3bf;border:.35cqw solid #ffd43b;border-radius:2cqw;padding:1.4cqw 2.2cqw;font-size:2.6cqw;font-weight:800;text-align:left;max-width:86cqw;}
  .olf-idea > i{font-size:4cqw;font-style:normal;}
  .olf-ans{font-family:'Fredoka One';font-size:6.4cqw;color:#fff;background:var(--lc);padding:1cqw 4cqw;border-radius:3cqw;box-shadow:0 .6cqw 0 #0003;}
  .olf-row{display:flex;flex-wrap:wrap;gap:1cqw;justify-content:center;align-items:center;max-width:92cqw;}
  .olf-lab{font-weight:900;font-size:2.4cqw;margin-right:1cqw;opacity:.75;}
  .olf-tok{display:inline-flex;align-items:center;justify-content:center;min-width:5cqw;height:5cqw;padding:0 .9cqw;border-radius:1.2cqw;background:#edf2ff;font:900 2.8cqw 'Nunito';
    border:.3cqw solid transparent;box-sizing:border-box;animation:olPop .45s both;animation-delay:var(--d);}
  .olf-row.sm .olf-tok{min-width:3.6cqw;height:3.6cqw;font-size:2cqw;}
  .olf-tok.disc{border-radius:50%;width:5.6cqw;height:5.6cqw;font-size:3.2cqw;}
  .olf-tok.hl{border-color:#f08c00;background:#ffe066;transform:scale(1.08);} .olf-tok.good{background:#b2f2bb;border-color:#2f9e44;} .olf-tok.bad{background:#ffc9c9;border-color:#e03131;}
  .olf-tok.off{opacity:.35;text-decoration:line-through;text-decoration-thickness:.3cqw;}
  .olf-tok img.emoji{width:1.15em !important;height:1.15em !important;}
  .olf-cols{display:flex;gap:4cqw;justify-content:center;align-items:center;flex-wrap:wrap;} .olf-cols > div{display:flex;flex-direction:column;align-items:center;gap:1cqw;}
  .olf-tbl{border-collapse:separate;border-spacing:.5cqw;font:800 2.4cqw 'Nunito';}
  .olf-tbl td,.olf-tbl th{background:#edf2ff;padding:.6cqw 1.6cqw;border-radius:1cqw;} .olf-tbl th{background:var(--lc);color:#fff;} .olf-tbl td.hl{background:#ffe066;outline:.3cqw solid #f08c00;}
  .olf-grid{display:grid;gap:.35cqw;width:min(62cqw,100%);} .olf-grid span{background:#edf2ff;border-radius:.6cqw;font:800 1.7cqw 'Nunito';padding:.45cqw 0;animation:olPop .35s both;animation-delay:var(--d);}
  .olf-grid span.hl{background:#ffe066;outline:.25cqw solid #f08c00;} .olf-grid span.hl2{background:#a5d8ff;outline:.25cqw solid #1c7ed6;} .olf-grid span.both{background:linear-gradient(135deg,#ffe066 50%,#a5d8ff 50%);outline:.25cqw solid #c2255c;}
  .olf-grid span.off{opacity:.3;}
  .olf-svg{max-width:90cqw;overflow:visible;} .olf-svg text{font-family:'Nunito';font-weight:900;}
  .olf-svg .draw{stroke-dasharray:1000;stroke-dashoffset:1000;animation:olDraw 1.4s forwards;} .olf-svg .pop{animation:olPop .5s both;transform-box:fill-box;transform-origin:center;}
  .olf-svg:not(.in) .draw{animation:none;stroke-dashoffset:0;}
  .in{animation:olIn .55s both;}
  .olf-end{position:absolute;inset:0;background:#1d1442e6;color:#ffd43b;font:2.4em 'Fredoka One';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3cqw;animation:olIn .5s both;font-size:5cqw;}
  .olf-end .ol-btn{font-size:2.2cqw;}
  .ol-sub2{min-height:3.4em;font-size:clamp(15px,1.8vw,26px);line-height:1.35;background:rgba(0,0,0,.35);border-radius:14px;padding:8px 16px;width:100%;box-sizing:border-box;}
  .ol-sub2 b{color:#ffd43b;}
  .ol-ctrl{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;width:100%;}
  .ol-ctrl > button:not(.ol-btn){background:rgba(255,255,255,.14);border:0;color:#fff;border-radius:12px;width:52px;height:46px;font-size:22px;cursor:pointer;}
  .ol-dots{display:flex;gap:6px;flex:1;justify-content:center;min-width:120px;}
  .ol-dots i{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;} .ol-dots i.past{background:rgba(255,212,59,.5);} .ol-dots i.now{background:#ffd43b;transform:scale(1.25);}
  @keyframes olIn{from{opacity:0;transform:translateY(1.2cqw)}to{opacity:1;transform:none}}
  @keyframes olPop{0%{opacity:0;transform:scale(.4)}70%{transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
  @keyframes olDraw{to{stroke-dashoffset:0}}
  .sch-ol{display:flex;align-items:center;gap:14px;width:100%;margin:0 0 14px;padding:16px 18px;border:0;border-radius:18px;cursor:pointer;
    background:linear-gradient(135deg,#3b2a7a,#1d1442);color:#fff;font-family:'Nunito',sans-serif;text-align:left;box-shadow:0 4px 0 #ffd43b;}
  .sch-ol .e{font-size:2.2rem;} .sch-ol b{display:block;font-size:1.1rem;color:#ffd43b;font-weight:900;} .sch-ol span{font-size:.88rem;opacity:.9;}
  @media (max-width:600px){ #ol-root{padding:56px 14px 40px;} .ol-pl{min-width:110px;padding:8px 14px;} }
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
