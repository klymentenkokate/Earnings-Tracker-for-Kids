// ─────────────────────────────────────────────────────────────
// SCHOOL — practice packs that follow the kid's school books (26 Oct 2026)
// Subjects register here; packs come from school/<subject>/data.js (built by Documents\school\<subject>\build_school.py).
// Instructions are in Spanish (his school language); the subject content is in the subject's language.
// Pay: each pack pays once, on the first pass (>= 80%), an amount set from its estimated working time
// (EUR 0.50 per hour). Active time (tab visible + input in the last 60 s) is logged per pack to check the estimates.
// ─────────────────────────────────────────────────────────────
const SCHOOL_PASS = 0.8;
// The subjects of his school year, in Kateryna's order (26 Oct 2026); a subject's data file fills it in when it exists.
const SCHOOL_SUBJECTS = [
  { id: 'fr', name: 'Français', emoji: '🇫🇷', units: [], soon: true },
  { id: 'cm', name: 'Conocimiento del medio', emoji: '🌍', units: [], soon: true },
  { id: 'le', name: 'Lengua', emoji: '📖', units: [], soon: true },
  { id: 'ma', name: 'Mates', emoji: '🔢', units: [], soon: true },
  { id: 'en', name: 'English', emoji: '🇬🇧', units: [], soon: true },
];
const SCHOOL_PACKS = {};
function schoolRegister(subject, packs) {
  const i = SCHOOL_SUBJECTS.findIndex(s => s.id === subject.id);
  if (i >= 0) SCHOOL_SUBJECTS[i] = subject; else SCHOOL_SUBJECTS.push(subject);
  packs.forEach(p => { p.subject = subject.id; SCHOOL_PACKS[p.id] = p; });
}

let schoolCur = { subject: null, pack: null, i: 0, done: false };
let schoolLastInput = Date.now();
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { schoolLastInput = Date.now(); }, { passive: true }));
setInterval(() => {   // active time: pack open, page visible, input within the last minute (a film playing counts too)
  if (!schoolCur.pack || document.hidden || !state) return;
  const vid = document.getElementById('sch-vid');
  const watching = vid && !vid.paused && !vid.ended;
  if (!watching && Date.now() - schoolLastInput > 60000) return;
  const st = schoolPackState(schoolCur.pack);
  st.activeSec = (st.activeSec || 0) + 5;
}, 5000);

const schEsc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const schRich = s => schEsc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');   // underscores are always gaps (____, p__tal__), never formatting - underline markup removed 26 Oct 2026
const schMoney = n => fmtAmt(n);

function schoolState() {
  if (!state) return {};
  if (!state.school) state.school = {};
  return state.school;
}
function schoolPackState(p) {
  const s = schoolState();
  if (!s[p.id]) s[p.id] = { best: null, passed: false, paid: false, watched: false, activeSec: 0, run: null };
  return s[p.id];
}
function schoolPacksOf(subjectId, unit) {
  return Object.values(SCHOOL_PACKS).filter(p => p.subject === subjectId && (unit === undefined || p.unit === unit));
}

// ---------- screens ----------
function schoolShow(html) {
  const el = document.getElementById('school-root');
  if (el) { el.innerHTML = html; if (window.twemoji) twemoji.parse(el, { folder: 'svg', ext: '.svg' }); }
  window.scrollTo(0, 0);
}
function renderSchool() {
  schoolStopMedia();
  schoolCur = { subject: null, pack: null, i: 0, done: false };
  schoolShow(`<div class="section-title">🏫 Escuela</div><div class="sch-subjects">` + SCHOOL_SUBJECTS.map(s => {
    const packs = schoolPacksOf(s.id), done = packs.filter(p => schoolPackState(p).passed).length;
    return s.soon || !packs.length
      ? `<div class="sch-subject soon"><span class="sch-subj-emoji">${s.emoji}</span><span class="sch-subj-name">${schEsc(s.name)}</span><span class="sch-subj-sub">Pronto ✨</span></div>`
      : `<button class="sch-subject" onclick="openSchoolSubject('${s.id}')"><span class="sch-subj-emoji">${s.emoji}</span>
      <span class="sch-subj-name">${schEsc(s.name)}</span><span class="sch-subj-sub">${done} / ${packs.length} superadas</span></button>`;
  }).join('') + `</div>`);
}

function openSchoolSubject(id) {
  schoolStopMedia();
  const s = SCHOOL_SUBJECTS.find(x => x.id === id); if (!s) return;
  schoolCur = { subject: id, pack: null, i: 0, done: false };
  const all = schoolPacksOf(id);
  const earned = all.filter(p => schoolPackState(p).paid).reduce((a, p) => a + p.pay, 0);
  const total = all.reduce((a, p) => a + p.pay, 0);
  const passed = all.filter(p => schoolPackState(p).passed).length;
  const units = s.units.map(u => {
    const packs = schoolPacksOf(id, u.n);
    const up = packs.filter(p => schoolPackState(p).passed).length;
    const open = schoolState()['_open_' + id] === u.n;
    return `<div class="sch-unit${open ? ' open' : ''}" style="--uc:${u.color || '#6366f1'}">
      <button class="sch-unit-head" onclick="schoolToggleUnit('${id}',${u.n})">
        <span class="sch-unit-n">${schEsc(s.unitWord || 'Unidad')} ${u.n}</span>
        <span class="sch-unit-title">${schEsc(u.title)}</span>
        <span class="sch-unit-meta">${schEsc(s.pageWord || 'p.')} ${schEsc(u.pages)} · ${packs.length ? `${up}/${packs.length} ✅` : 'próximamente'}</span>
      </button>
      <div class="sch-unit-body">${packs.length ? packs.map(p => schoolPackCard(p)).join('') : `<div class="sch-soon">Esta unidad llegará pronto ✨</div>`}</div>
    </div>`;
  }).join('');
  schoolShow(`<div class="sch-top">
      <button class="btn-quiz-back" onclick="renderSchool()">←</button>
      <div><div class="sch-h1">${s.emoji} ${schEsc(s.name)}</div><div class="sch-sub">${schEsc(s.book)}</div></div></div>
    <div class="oz-reward-card"><div class="oz-reward-title">${passed} / ${all.length} prácticas superadas · ${schMoney(earned)} de ${schMoney(total)}</div>
      <div class="oz-reward-sub">Cada práctica se paga una vez, cuando aciertas el 80 % o más. Busca la página de tu cuaderno 📒</div>
      <div class="oz-reward-track"><div class="oz-reward-fill" style="width:${all.length ? passed / all.length * 100 : 0}%"></div></div></div>
    ${units}`);
}
function schoolToggleUnit(id, n) {
  const k = '_open_' + id, s = schoolState();
  s[k] = s[k] === n ? null : n;
  openSchoolSubject(id);
}
function schoolPackCard(p) {
  const st = schoolPackState(p);
  const status = st.passed ? `✅ ${st.best} %` : st.run ? `⏸️ ${st.run.i}/${p.items.length}` : st.best !== null ? `${st.best} % · necesitas 80` : 'Nuevo';
  return `<button class="sch-pack${st.passed ? ' pass' : ''}" onclick="openSchoolPack('${p.id}')">
    <span class="sch-pack-ico">${p.icon || '📘'}</span>
    <span class="sch-pack-main"><span class="sch-pack-kind">${schEsc(p.label)} · ${schEsc(p.pagesLabel || 'p. ' + p.pages)}</span>
      <span class="sch-pack-title">${schEsc(p.title)}</span>
      <span class="sch-pack-meta">${p.film ? '🎬 ' : ''}${p.items.some(x => x.au) ? '🎧 ' : ''}~${p.min} min · ${st.paid ? 'cobrado ' : ''}${schMoney(p.pay)}</span></span>
    <span class="sch-pack-st">${status}</span></button>`;
}

function openSchoolPack(id) {
  schoolStopMedia();
  const p = SCHOOL_PACKS[id]; if (!p) return;
  schoolCur = { subject: p.subject, pack: p, i: 0, done: false };
  const st = schoolPackState(p);
  const dir = `school/${p.subject}/`;
  const film = p.film ? `<div class="sch-film"><video id="sch-vid" src="${dir}${p.film.src}" controls playsinline preload="metadata"></video>
      <div class="sch-film-hint" id="sch-film-hint">${st.watched ? 'Ya lo has visto: puedes verlo otra vez o empezar.' : 'Mira el vídeo hasta el final y se abren los ejercicios.'}</div></div>` : '';
  const canStart = !p.film || st.watched;
  schoolShow(`<div class="sch-top"><button class="btn-quiz-back" onclick="openSchoolSubject('${p.subject}')">←</button>
      <div><div class="sch-kind">${schEsc(p.label)} · ${schEsc(p.pagesLabel || 'p. ' + p.pages)}</div><div class="sch-h1">${schEsc(p.title)}</div></div></div>
    ${p.intro ? `<div class="sch-intro">${schRich(p.intro)}</div>` : ''}
    ${film}
    <div class="sch-plan">${(p.sections || []).map(s => `<div class="sch-plan-row"><span>${s.icon || '•'}</span><span>${schEsc(s.title)}</span><span class="sch-plan-n">${s.n}</span></div>`).join('')}
      <div class="sch-plan-foot">~${p.min} min · ${p.items.length} ejercicios · ${st.paid ? '✅ ya cobrado' : 'premio ' + schMoney(p.pay)}</div></div>
    <div class="quiz-result-btns">
      ${st.run ? `<button class="btn-quiz-retake" id="sch-go" ${canStart ? '' : 'disabled'} onclick="schoolStart(true)">▶️ Seguir (${st.run.i}/${p.items.length})</button>
                  <button class="btn-quiz-back" onclick="schoolStart(false)">Empezar de nuevo</button>`
                : `<button class="btn-quiz-retake" id="sch-go" ${canStart ? '' : 'disabled'} onclick="schoolStart(false)">▶️ Empezar</button>`}
    </div>`);
  const vid = document.getElementById('sch-vid');
  if (vid) vid.addEventListener('ended', () => {
    st.watched = true; save();
    const go = document.getElementById('sch-go'); if (go) go.disabled = false;
    const h = document.getElementById('sch-film-hint'); if (h) h.textContent = '¡Muy bien! Ya puedes empezar los ejercicios.';
  });
}

function schoolStart(resume) {
  const p = schoolCur.pack, st = schoolPackState(p);
  if (!resume || !st.run) st.run = { i: 0, pts: [], order: p.items.map((_, i) => i) };
  save();
  schoolItem();
}

// ---------- one exercise ----------
let schoolItemState = null;
function schoolItem() {
  schoolStopMedia();
  const p = schoolCur.pack, st = schoolPackState(p), run = st.run;
  if (run.i >= p.items.length) { schoolFinish(); return; }
  const it = p.items[run.i];
  const sec = (p.sections || []).find(s => run.i >= s.from && run.i < s.from + s.n);
  schoolItemState = { answered: false, it, picks: [], misses: 0, matched: {} };
  const au = it.au ? `<button class="sch-say" onclick="schoolPlay('${it.au}')">🔊</button>` : '';
  const head = `<div class="sch-top"><button class="btn-quiz-back" onclick="openSchoolPack('${p.id}')">⏸</button>
      <div style="flex:1"><div class="sch-kind">${sec ? `${sec.icon || ''} ${schEsc(sec.title)}` : schEsc(p.title)}</div>
      <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${(run.i) / p.items.length * 100}%"></div></div></div>
      <div class="sch-count">${run.i + 1}/${p.items.length}</div></div>`;
  let body = `<div class="sch-q">${schRich(it.q)}</div>`;
  if (it.img) body += `<div class="sch-img">${it.img}</div>`;
  if (it.pre) body += `<pre class="sch-pre">${schEsc(it.pre)}</pre>`;   // maths: a sum laid out in columns, a table, a number line
  if (it.fr) body += `<div class="sch-fr">${au}<span>${schRich(it.fr)}</span></div>`;
  else if (it.au) body += `<div class="sch-listen">${au}<span>Escucha</span></div>`;
  if (it.t === 'choice') {
    const order = it.keep ? it.opts.map((_, i) => i) : shuffle(it.opts.map((_, i) => i));
    body += `<div class="sch-opts${it.opts.every(o => String(o).length <= 14) ? ' grid' : ''}">` +
      order.map(oi => `<button class="quiz-option" data-oi="${oi}" onclick="schoolPick(${oi})">${schRich(it.opts[oi])}</button>`).join('') + `</div>`;
  } else if (it.t === 'type') {
    body += `<div class="sch-type"><input id="sch-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${schEsc(it.ph || 'Escribe aquí')}" onkeydown="if(event.key==='Enter')schoolCheckType()">
      <div class="sch-keys">${((SCHOOL_SUBJECTS.find(s => s.id === p.subject) || {}).keys || ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û', '’']).map(k => `<button onclick="schoolKey('${k === '’' ? "\\'" : k}')">${k}</button>`).join('')}</div>
      <button class="btn-quiz-retake" onclick="schoolCheckType()">Comprobar</button></div>`;
  } else if (it.t === 'num') {   // maths: a number answer (thousands with or without dots/spaces, decimals with a comma)
    body += `<div class="sch-type sch-num"><input id="sch-in" inputmode="decimal" autocomplete="off" placeholder="${schEsc(it.ph || 'Escribe el número')}" onkeydown="if(event.key==='Enter')schoolCheckNum()">${it.unit ? `<span class="sch-unit-lbl">${schEsc(it.unit)}</span>` : ''}
      <button class="btn-quiz-retake" onclick="schoolCheckNum()">Comprobar</button></div>`;
  } else if (it.t === 'order') {
    const tiles = shuffle(it.words.map((w, i) => i));
    schoolItemState.tiles = tiles;
    body += `<div class="sch-built" id="sch-built"></div><div class="sch-tiles" id="sch-tiles">` +
      tiles.map(i => `<button class="sch-tile" data-i="${i}" onclick="schoolTile(${i})">${schEsc(it.words[i])}</button>`).join('') +
      `</div><button class="btn-quiz-retake" onclick="schoolCheckOrder()">Comprobar</button>`;
  } else if (it.t === 'match') {
    const L = it.pairs.map((_, i) => i), Rr = shuffle(it.pairs.map((_, i) => i));
    body += `<div class="sch-match"><div>${L.map(i => `<button class="sch-m sch-ml" data-i="${i}" onclick="schoolMatch('L',${i})">${schRich(it.pairs[i][0])}</button>`).join('')}</div>
      <div>${Rr.map(i => `<button class="sch-m sch-mr" data-i="${i}" onclick="schoolMatch('R',${i})">${schRich(it.pairs[i][1])}</button>`).join('')}</div></div>`;
  }
  body += `<div class="sch-fb" id="sch-fb" style="display:none;"></div>`;
  schoolShow(head + `<div class="sch-card">${body}</div>`);
  if (it.au && it.auto !== false) setTimeout(() => schoolPlay(it.au), 350);
  const inp = document.getElementById('sch-in'); if (inp) inp.focus();
}

let schoolAudio = null;
function schoolPlay(src) {
  if (schoolAudio) schoolAudio.pause();
  schoolAudio = new Audio(`school/${schoolCur.pack ? schoolCur.pack.subject : 'fr'}/${src}`);
  schoolAudio.play().catch(() => {});
}
function schoolStopMedia() {
  if (schoolAudio) schoolAudio.pause();
  const v = document.getElementById('sch-vid'); if (v) v.pause();
}
function schoolKey(k) {
  const el = document.getElementById('sch-in'); if (!el) return;
  const a = el.selectionStart ?? el.value.length, b = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, a) + k + el.value.slice(b); el.focus(); el.setSelectionRange(a + k.length, a + k.length);
}

// score one item (0..1) and show the explanation
function schoolScore(pts, msg) {
  const s = schoolItemState; if (s.answered) return; s.answered = true;
  const p = schoolCur.pack, st = schoolPackState(p), it = s.it;
  st.run.pts[st.run.i] = pts; save();
  const fb = document.getElementById('sch-fb');
  const good = pts >= 0.999, half = pts > 0 && !good;
  fb.className = 'sch-fb ' + (good ? 'ok' : half ? 'half' : 'bad');
  fb.innerHTML = `<div class="sch-verdict">${good ? '🎉 ¡Correcto!' : half ? '👍 ¡Casi!' : '🤔 No exactamente'}</div>` +
    (msg ? `<div class="sch-msg">${schRich(msg)}</div>` : '') +
    (it.why ? `<div class="sch-why">${schRich(it.why)}</div>` : '') +
    (it.sayA ? `<button class="sch-say small" onclick="schoolPlay('${it.sayA}')">🔊 Escuchar la respuesta</button>` : '') +
    `<button class="btn-quiz-retake" onclick="schoolNext()">${st.run.i === p.items.length - 1 ? 'Ver mi resultado →' : 'Siguiente →'}</button>`;
  fb.style.display = 'block';
  if (it.sayA && !good) setTimeout(() => schoolPlay(it.sayA), 400);
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function schoolNext() {
  const st = schoolPackState(schoolCur.pack);
  st.run.i++; save(); schoolItem();
}

function schoolPick(oi) {
  const it = schoolItemState.it; if (schoolItemState.answered) return;
  const ok = oi === it.a;
  document.querySelectorAll('.sch-opts .quiz-option').forEach(b => {
    const i = +b.dataset.oi; b.disabled = true;
    if (i === it.a) b.classList.add(ok ? 'correct' : 'reveal');
    if (i === oi && !ok) b.classList.add('wrong');
  });
  schoolScore(ok ? 1 : 0, ok ? '' : `La respuesta es: **${it.opts[it.a]}**`);
}

const schNorm = s => String(s).replace(/[’‘`´]/g, "'").replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/\s+/g, ' ').replace(/\s*'\s*/g, "'").trim().replace(/[.!?¡¿,;:]+$/g, '').trim();
const schFold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
function schoolCheckType() {
  const it = schoolItemState.it, el = document.getElementById('sch-in'); if (schoolItemState.answered || !el) return;
  let raw = schNorm(el.value); if (!raw) { el.focus(); return; }
  const answers = (Array.isArray(it.a) ? it.a : [it.a]).map(schNorm);
  // commas can't be heard in a dictation, and a polite ", s'il te/vous plaît" the answer didn't ask for is never wrong (review, 26 Oct 2026)
  const noComma = x => x.replace(/\s*,\s*/g, ' ').replace(/\s+/g, ' ').trim();
  const polite = /[\s,]*s'il (te|vous) pla[iî]t$/i;
  if (!answers.some(a => polite.test(a)) && polite.test(raw)) raw = schNorm(raw.replace(polite, ''));
  answers.push(...answers.map(noComma)); raw = answers.some(a => a.toLowerCase() === noComma(raw).toLowerCase()) ? noComma(raw) : raw;
  // typed more than the gap ("une belle robe" for "____ robe" = belle): fine if it's a piece of the finished sentence that holds the answer
  if (it.show && answers.every(a => a.toLowerCase() !== raw.toLowerCase())) {
    const full = ' ' + noComma(schNorm(it.show)).toLowerCase() + ' ', piece = ' ' + noComma(raw).toLowerCase() + ' ';
    if (full.includes(piece) && answers.some(a => piece.includes(' ' + a.toLowerCase() + ' '))) raw = answers.find(a => piece.includes(' ' + a.toLowerCase() + ' '));
  }
  const cs = it.case ? (x => x) : (x => x.toLowerCase());
  el.disabled = true;
  if (answers.some(a => cs(a) === cs(raw))) {
    if (it.case !== true && answers.some(a => a === raw) === false && answers.some(a => a.toLowerCase() === raw.toLowerCase() && /^[A-ZÀ-Ý]/.test(a) && !/^[A-ZÀ-Ý]/.test(raw)))
      { schoolScore(1, `Ojo con la mayúscula: **${answers[0]}**`); return; }
    el.classList.add('ok'); schoolScore(1, ''); return;
  }
  if (answers.some(a => schFold(cs(a)) === schFold(cs(raw)))) { el.classList.add('half'); schoolScore(0.5, `¡Fíjate en los acentos! Se escribe: **${answers[0]}**`); return; }
  const bare = x => schFold(cs(x)).replace(/['\-\s]/g, '');
  if (answers.some(a => bare(a) === bare(raw))) { el.classList.add('half'); schoolScore(0.5, `¡Casi! Fíjate en el apóstrofo ( ' ), los guiones y los espacios: **${answers[0]}**`); return; }
  el.classList.add('bad'); schoolScore(0, `Se escribe: **${answers[0]}**`);
}

// "3.081.955", "3 081 955" and "3081955" are the same number; a comma is the decimal mark (Spanish school)
const schNum = s => {
  let t = String(s).trim().replace(/[\s'’]/g, '');
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(t)) return +t.replace(/[.,]/g, '');   // 3.081.955 or 3,081,955 (thousands groups, either sign)
  t = t.replace(/\./g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(t) ? +t : NaN;
};
const schNumFmt = n => { const [i, d] = String(n).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (d ? ',' + d : ''); };
function schoolCheckNum() {
  const it = schoolItemState.it, el = document.getElementById('sch-in'); if (schoolItemState.answered || !el) return;
  const v = schNum(el.value);
  if (!el.value.trim()) { el.focus(); return; }
  if (Number.isNaN(v)) {   // not a number: say so (a silent flash looked like "nothing happens"); on the 2nd try mark it and move on
    schoolItemState.badNum = (schoolItemState.badNum || 0) + 1;
    if (schoolItemState.badNum < 2) {
      el.classList.add('half'); el.select();
      let h = document.getElementById('sch-numhint');
      if (!h) { h = document.createElement('div'); h.id = 'sch-numhint'; h.className = 'sch-fb half'; el.parentNode.after(h); }
      h.textContent = 'Escribe solo cifras, por ejemplo 3.081.955 (con o sin puntos). Luego pulsa Comprobar otra vez.';
      return;
    }
  }
  const hint = document.getElementById('sch-numhint'); if (hint) hint.remove();
  if (Number.isNaN(v)) { el.disabled = true; el.classList.add('bad');
    const answers0 = (Array.isArray(it.a) ? it.a : [it.a]).map(Number);
    schoolScore(0, `La respuesta es: **${it.show || schNumFmt(answers0[0])}${it.unit ? ' ' + it.unit : ''}**`); return; }
  el.disabled = true;
  const answers = (Array.isArray(it.a) ? it.a : [it.a]).map(Number);
  const ok = answers.some(a => Math.abs(a - v) < 1e-9);
  el.value = schNumFmt(v); el.classList.add(ok ? 'ok' : 'bad');
  schoolScore(ok ? 1 : 0, ok ? '' : `La respuesta es: **${it.show || schNumFmt(answers[0])}${it.unit ? ' ' + it.unit : ''}**`);
}

function schoolTile(i) {
  const s = schoolItemState; if (s.answered) return;
  const at = s.picks.indexOf(i);
  if (at >= 0) s.picks.splice(at, 1); else s.picks.push(i);
  const it = s.it;
  document.getElementById('sch-built').innerHTML = s.picks.map(k => `<button class="sch-tile on" onclick="schoolTile(${k})">${schEsc(it.words[k])}</button>`).join('');
  document.querySelectorAll('#sch-tiles .sch-tile').forEach(b => b.style.visibility = s.picks.includes(+b.dataset.i) ? 'hidden' : 'visible');
}
function schoolCheckOrder() {
  const s = schoolItemState, it = s.it; if (s.answered) return;
  if (s.picks.length < it.words.length) return;
  const got = schNorm(s.picks.map(k => it.words[k]).join(' '));
  const answers = (Array.isArray(it.a) ? it.a : [it.a]).map(schNorm);
  const ok = answers.some(a => a.toLowerCase() === got.toLowerCase());
  document.getElementById('sch-built').classList.add(ok ? 'ok' : 'bad');
  schoolScore(ok ? 1 : 0, ok ? '' : `Así: **${answers[0]}**`);
}

function schoolMatch(side, i) {
  const s = schoolItemState, it = s.it; if (s.answered || s.matched[i] !== undefined && side === 'L') return;
  if (side === 'L') {
    s.sel = i;
    document.querySelectorAll('.sch-ml').forEach(b => b.classList.toggle('sel', +b.dataset.i === i));
    return;
  }
  if (s.sel === undefined || s.sel === null) return;
  if (document.querySelector(`.sch-mr[data-i="${i}"]`).classList.contains('done')) return;
  const l = document.querySelector(`.sch-ml[data-i="${s.sel}"]`), r = document.querySelector(`.sch-mr[data-i="${i}"]`);
  if (i === s.sel) {
    s.matched[i] = true; l.classList.remove('sel'); l.classList.add('done'); r.classList.add('done'); l.disabled = r.disabled = true;
    if (it.au2 && it.au2[i]) schoolPlay(it.au2[i]);
    s.sel = null;
    if (Object.keys(s.matched).length === it.pairs.length) {
      const n = it.pairs.length, pts = Math.max(0, n - s.misses) / n;
      schoolScore(pts, s.misses ? `${s.misses} ${s.misses === 1 ? 'fallo' : 'fallos'} por el camino.` : '');
    }
  } else {
    s.misses++; r.classList.add('miss'); setTimeout(() => r.classList.remove('miss'), 450);
  }
}

// ---------- result + pay ----------
function schoolFinish() {
  const p = schoolCur.pack, st = schoolPackState(p), run = st.run;
  const pts = p.items.reduce((a, _, i) => a + (run.pts[i] || 0), 0);
  const pct = Math.round(pts / p.items.length * 100);
  const passedNow = pct >= SCHOOL_PASS * 100, wasPaid = st.paid;
  st.best = Math.max(st.best ?? 0, pct);
  st.passed = st.passed || passedNow;
  st.run = null;
  let paidNow = false;
  if (state) {
    state.sessions.push({ id: uid(), type: 'quiz', quizId: 'school-' + p.id, quizTitle: `🏫 ${p.subjectShort || 'Escuela'} · ${p.title}`,
      continent: 'all', date: todayStr(), minutes: 0, earned: 0, score: Math.round(pts * 10) / 10, total: p.items.length, difficulty: 1, manual: false, doneBy: currentUserRef() });
    if (passedNow && !wasPaid) {
      st.paid = true; st.paidAt = todayStr();
      state.sessions.push({ id: uid(), type: 'quest', questId: 'school-' + p.id, questTitle: `🏫 ${p.subjectShort || 'Escuela'} · ${p.title} (${pct} %)`,
        date: todayStr(), minutes: p.min, earned: p.pay, manual: false, doneBy: currentUserRef() });
      state.balance = Math.round((state.balance + p.pay) * 100) / 100;
      paidNow = true;
    }
    save();
  }
  const wrong = p.items.map((it, i) => ({ it, v: run.pts[i] || 0 })).filter(x => x.v < 0.999);
  schoolShow(`<div class="quiz-result-card"><div class="quiz-result-emoji">${pct === 100 ? '🏆' : passedNow ? '🎉' : '📚'}</div>
      <div class="quiz-result-score">${pct} %</div><div class="quiz-result-label">${schEsc(p.title)}</div>
      <div class="quiz-result-msg">${paidNow ? `¡Superado! +${schMoney(p.pay)} a tu hucha 💰` : passedNow ? (wasPaid ? '¡Superado otra vez! (esta práctica ya estaba cobrada)' : '¡Superado!') : `Necesitas un 80 % para superarla. ¡Repasa y vuelve a intentarlo!`}</div>
      <div class="quiz-result-btns"><button class="btn-quiz-back" onclick="openSchoolSubject('${p.subject}')">← Prácticas</button>
        <button class="btn-quiz-retake" onclick="openSchoolPack('${p.id}')">🔄 Otra vez</button></div></div>
    ${wrong.length ? `<div class="section-title">Para repasar</div><div class="quiz-answers-list">${wrong.map(x => `<div class="quiz-answer-row qa-wrong">
      <span class="quiz-answer-icon">${x.v > 0 ? '🟡' : '❌'}</span><span class="quiz-answer-q">${schRich(x.it.fr || x.it.q)}</span>
      <span class="quiz-answer-a">✓ ${schRich(x.it.show || (x.it.t === 'choice' ? x.it.opts[x.it.a] : x.it.t === 'match' ? 'parejas' : [].concat(x.it.a)[0]))}</span></div>`).join('')}</div>` : ''}`);
  if (paidNow) { showChestToast('🏫', `¡Práctica superada! +${schMoney(p.pay)}`); renderAll(); }
}

// ---------- styles ----------
(function () {
  const css = `
  #school-root{max-width:580px;margin:0 auto 22px;}
  .sch-film video{aspect-ratio:16/9;}
  #school-root img.emoji{height:1em;width:1em;margin:0 .05em;vertical-align:-.12em;display:inline;}
  .sch-top{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  .sch-h1{font-family:'Fredoka One',cursive;font-size:1.25rem;color:var(--text);line-height:1.15;}
  .sch-sub,.sch-kind{font-size:.74rem;font-weight:800;color:var(--muted);letter-spacing:.3px;}
  .sch-count{font-size:.8rem;font-weight:800;color:var(--muted);}
  .sch-empty,.sch-soon{padding:18px;text-align:center;color:var(--muted);font-weight:700;}
  .sch-subjects{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .sch-subject{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:18px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-family:'Nunito',sans-serif;}
  .sch-subject.soon{opacity:.5;cursor:default;}
  .sch-subj-emoji{font-size:2rem}.sch-subj-name{font-weight:900;font-size:.95rem;color:var(--text);text-align:center}.sch-subj-sub{font-size:.74rem;color:var(--muted);font-weight:700}
  .sch-subject{min-height:120px;justify-content:center;}
  .sch-unit{background:var(--card);border:1.5px solid var(--border);border-left:6px solid var(--uc);border-radius:16px;margin-bottom:10px;overflow:hidden;}
  .sch-unit-head{width:100%;background:none;border:none;text-align:left;padding:13px 14px;cursor:pointer;display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-family:'Nunito',sans-serif;}
  .sch-unit-n{grid-row:span 2;align-self:center;background:var(--uc);color:#fff;border-radius:10px;padding:6px 9px;font-weight:900;font-size:.75rem;}
  .sch-unit-title{font-family:'Fredoka One',cursive;font-size:1.02rem;color:var(--text);}
  .sch-unit-meta{font-size:.74rem;font-weight:800;color:var(--muted);}
  .sch-unit-body{display:none;padding:0 10px 10px;}
  .sch-unit.open .sch-unit-body{display:flex;flex-direction:column;gap:8px;}
  .sch-pack{display:flex;align-items:center;gap:10px;background:var(--soft);border:1.5px solid var(--border);border-radius:14px;padding:10px 12px;cursor:pointer;text-align:left;font-family:'Nunito',sans-serif;}
  .sch-pack.pass{background:#ecfdf5;border-color:#86efac;}
  .sch-pack-ico{font-size:1.5rem;}
  .sch-pack-main{flex:1;display:flex;flex-direction:column;gap:1px;min-width:0;}
  .sch-pack-kind{font-size:.68rem;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;}
  .sch-pack-title{font-weight:900;color:var(--text);font-size:.92rem;}
  .sch-pack-meta{font-size:.72rem;font-weight:700;color:var(--muted);}
  .sch-pack-st{font-size:.72rem;font-weight:900;color:var(--text);white-space:nowrap;}
  .sch-intro{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:12px 14px;font-size:.9rem;font-weight:700;color:var(--text);line-height:1.45;margin-bottom:12px;}
  .sch-film video{width:100%;border-radius:14px;background:#000;display:block;}
  .sch-film-hint{font-size:.78rem;font-weight:800;color:var(--muted);text-align:center;margin:6px 0 12px;}
  .sch-plan{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:10px 14px;margin-bottom:6px;}
  .sch-plan-row{display:flex;gap:10px;font-size:.86rem;font-weight:800;color:var(--text);padding:4px 0;}
  .sch-plan-row span:nth-child(2){flex:1}.sch-plan-n{color:var(--muted)}
  .sch-plan-foot{border-top:1px dashed var(--border);margin-top:6px;padding-top:7px;font-size:.78rem;font-weight:800;color:var(--muted);}
  .sch-card{background:var(--card);border:1.5px solid var(--border);border-radius:20px;padding:16px;box-shadow:0 4px 18px var(--shadow);}
  .sch-q{font-size:.95rem;font-weight:800;color:var(--text);line-height:1.4;margin-bottom:10px;}
  .sch-img{font-size:3.2rem;text-align:center;margin:4px 0 10px;line-height:1.1;}
  .sch-img svg{max-width:100%;height:auto;}
  .sch-fr{display:flex;align-items:center;gap:10px;background:#eef2ff;border-radius:14px;padding:12px 14px;font-size:1.15rem;font-weight:800;color:#1e1b4b;margin-bottom:12px;line-height:1.35;}
  .sch-listen{display:flex;align-items:center;gap:10px;justify-content:center;margin:6px 0 14px;font-weight:900;color:var(--muted);}
  .sch-say{border:none;background:#6366f1;color:#fff;border-radius:50%;width:46px;height:46px;font-size:1.3rem;cursor:pointer;flex-shrink:0;}
  .sch-say.small{width:auto;height:auto;border-radius:12px;font-size:.85rem;font-weight:800;padding:8px 12px;margin:6px 0;font-family:'Nunito',sans-serif;}
  .sch-opts{display:flex;flex-direction:column;gap:8px;}
  .sch-opts.grid{display:grid;grid-template-columns:1fr 1fr;}
  .sch-opts .quiz-option{font-size:1rem;}
  .sch-type input{width:100%;box-sizing:border-box;font-size:1.15rem;font-weight:800;padding:12px 14px;border-radius:12px;border:2px solid var(--border);font-family:'Nunito',sans-serif;}
  .sch-type input.ok{border-color:#16a34a;background:#dcfce7}.sch-type input.half{border-color:#f59e0b;background:#fef3c7}.sch-type input.bad{border-color:#ef4444;background:#fee2e2}
  .sch-pre{font-family:'IBM Plex Mono',ui-monospace,Consolas,monospace;font-size:1.05rem;font-weight:700;background:var(--soft);border:1.5px solid var(--border);border-radius:12px;padding:10px 14px;margin:0 0 12px;white-space:pre-wrap;line-height:1.45;overflow-wrap:anywhere;}
  .sch-num{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.sch-num input{flex:1 1 160px;font-size:1.5rem;text-align:center;letter-spacing:.04em}.sch-num .btn-quiz-retake{flex:1 1 100%}
  .sch-unit-lbl{font-weight:900;font-size:1.2rem}
  .sch-keys{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 10px;}
  .sch-keys button{min-width:36px;padding:7px 0;border-radius:9px;border:1.5px solid var(--border);background:var(--soft);font-size:1rem;font-weight:800;cursor:pointer;}
  .sch-built{min-height:52px;border:2px dashed var(--border);border-radius:12px;padding:6px;display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}
  .sch-built.ok{border-color:#16a34a;background:#dcfce7}.sch-built.bad{border-color:#ef4444;background:#fee2e2}
  .sch-tiles{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
  .sch-tile{padding:9px 12px;border-radius:10px;border:2px solid #c7d2fe;background:#eef2ff;font-weight:800;font-size:1rem;cursor:pointer;font-family:'Nunito',sans-serif;}
  .sch-tile.on{background:#6366f1;color:#fff;border-color:#6366f1;}
  .sch-match{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .sch-match>div{display:flex;flex-direction:column;gap:7px;}
  .sch-m{padding:11px 8px;border-radius:12px;border:2px solid var(--border);background:var(--card);font-weight:800;font-size:.95rem;cursor:pointer;font-family:'Nunito',sans-serif;min-height:46px;}
  .sch-m.sel{border-color:#6366f1;background:#eef2ff}.sch-m.done{border-color:#16a34a;background:#dcfce7;color:#15803d}
  .sch-m.miss{border-color:#ef4444;background:#fee2e2;animation:schShake .35s}
  @keyframes schShake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
  .sch-fb{margin-top:14px;border-radius:14px;padding:12px 14px;}
  .sch-fb.ok{background:#dcfce7}.sch-fb.half{background:#fef3c7}.sch-fb.bad{background:#fee2e2}
  .sch-verdict{font-weight:900;font-size:1rem;margin-bottom:4px;}
  .sch-msg,.sch-why{font-size:.88rem;font-weight:700;line-height:1.45;margin-bottom:6px;color:var(--text);}
  .sch-fb .btn-quiz-retake{width:100%;margin-top:6px;}
  `;
  const el = document.createElement('style'); el.textContent = css; document.head.appendChild(el);
})();
