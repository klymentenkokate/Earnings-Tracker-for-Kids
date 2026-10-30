// ─────────────────────────────────────────────────────────────
// KLAXON QUIZ — group game for the TV (30 Oct 2026), in the style of a General Ignorance round.
// One question at a time, picked at random from the questions this household has not seen yet (state.qi.seen,
// synced like the rest of the tracker). Friends discuss, then the klaxon reveals the obvious wrong answer (-10 to
// everyone who said it), then the truth (+10 right, +5 for a quite interesting answer), then the explainer film.
// Points are only for the game; no money. Bank: qi/bank.js. Films: qi/films/.
// ─────────────────────────────────────────────────────────────
const QI_PTS = { right: 10, star: 5, klax: -10 };
let qiG = null;   // the game in progress: { players: [{name, score}], per, n, cur, marks, step }

function qiState() {
  if (!state.qi) state.qi = { seen: [], players: [] };
  return state.qi;
}
const qiLeft = () => QI_BANK.filter(q => !qiState().seen.includes(q.id));

function qiRoot() {
  let r = document.getElementById('qi-root');
  if (!r) { r = document.createElement('div'); r.id = 'qi-root'; document.body.appendChild(r); }
  return r;
}
function qiShow(html, cls = '') {
  const r = qiRoot(); r.className = cls; r.style.display = 'flex';
  r.innerHTML = `<button class="qi-x" onclick="qiClose()" title="Salir">✕</button>` + html;
  if (window.twemoji) twemoji.parse(r, { folder: 'svg', ext: '.svg' });
}
function qiClose() {
  qiStopMedia();
  const r = document.getElementById('qi-root'); if (r) { r.style.display = 'none'; r.innerHTML = ''; }
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  qiG = null;
}
function qiStopMedia() { document.querySelectorAll('#qi-root video').forEach(v => v.pause()); }
let qiAudio = {};
function qiSound(name) {
  try { const a = qiAudio[name] || (qiAudio[name] = new Audio(`qi/au/${name}.mp3`)); a.currentTime = 0; a.play().catch(() => {}); } catch (e) {}
}
const qiE = s => schEsc(s);

// ---------- setup ----------
function openQi() {
  const st = qiState();
  const names = (qiG && qiG.players.map(p => p.name)) || (st.players.length ? st.players : ['', '']);
  const left = qiLeft().length;
  qiShow(`<div class="qi-card qi-setup">
    <div class="qi-logo">📢 KLAXON QUIZ</div>
    <div class="qi-sub">General Ignorance · juego en grupo</div>
    <div class="qi-rules">
      <div><b>+10</b> respuesta correcta</div>
      <div><b>+5</b> respuesta "quite interesting" (aunque sea incorrecta)</div>
      <div class="neg"><b>−10</b> ¡la respuesta obvia! 📢 suena la sirena</div>
    </div>
    <div class="qi-lbl">Jugadores o equipos</div>
    <div id="qi-names">${names.map((n, i) => qiNameRow(n, i)).join('')}</div>
    <button class="qi-btn ghost" onclick="qiAddName()">＋ Añadir jugador</button>
    <div class="qi-lbl">Preguntas en esta partida</div>
    <div class="qi-per">${[3, 5, 8].map(n => `<button class="qi-btn ghost ${n === (st.per || 5) ? 'on' : ''}" onclick="qiPer(${n}, this)">${n}</button>`).join('')}</div>
    <div class="qi-left">${left} de ${QI_BANK.length} preguntas sin ver${left ? '' : ' · <button class="qi-link" onclick="qiReset()">empezar el banco de nuevo</button>'}</div>
    <button class="qi-btn big" ${left ? '' : 'disabled'} onclick="qiStart()">¡Empezar! ▶</button>
    ${left && left < QI_BANK.length ? `<button class="qi-link" onclick="qiReset()">Volver a poner todas las preguntas</button>` : ''}
  </div>`, 'setup');
}
const qiNameRow = (n, i) => `<div class="qi-name"><input value="${qiE(n)}" placeholder="Jugador ${i + 1}" maxlength="16"><button onclick="this.parentNode.remove()" title="Quitar">✕</button></div>`;
function qiAddName() {
  const box = document.getElementById('qi-names'); if (box.children.length >= 8) return;
  box.insertAdjacentHTML('beforeend', qiNameRow('', box.children.length)); box.lastChild.querySelector('input').focus();
}
function qiPer(n, el) { qiState().per = n; el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); }
function qiReset() {
  if (!confirm('¿Volver a poner las ' + QI_BANK.length + ' preguntas? Las ya vistas pueden volver a salir.')) return;
  qiState().seen = []; save(); openQi();
}
function qiStart() {
  const names = [...document.querySelectorAll('#qi-names input')].map((x, i) => x.value.trim() || `Jugador ${i + 1}`);
  if (names.length < 1) return;
  const st = qiState(); st.players = names; save();
  qiG = { players: names.map(name => ({ name, score: 0 })), per: Math.min(st.per || 5, qiLeft().length), n: 0, cur: null, marks: null };
  document.documentElement.requestFullscreen?.().catch(() => {});
  qiSpin();
}

// ---------- spin: the randomizer lands on an unseen question ----------
function qiSpin() {
  const left = qiLeft();
  if (!left.length || qiG.n >= qiG.per) return qiFinal();
  const pick = left[Math.floor(Math.random() * left.length)];
  qiG.cur = pick; qiG.n++; qiG.marks = qiG.players.map(() => ({ klax: false, right: false, star: false }));
  const st = qiState(); st.seen.push(pick.id); save();   // seen as soon as it is drawn: it never comes back
  qiShow(`<div class="qi-spin"><div class="qi-qn">Pregunta ${qiG.n} de ${qiG.per}</div><div class="qi-reel" id="qi-reel">❓</div></div>`, 'spin');
  const reel = document.getElementById('qi-reel'), pool = QI_BANK.map(q => q.emoji);
  let k = 0; const ticks = 16;
  const step = () => {
    if (!document.getElementById('qi-reel')) return;
    if (k < ticks) { reel.textContent = pool[(Math.random() * pool.length) | 0]; qiSound('tick'); k++; setTimeout(step, 60 + k * 12); }
    else qiQuestion();
  };
  step();
}

// ---------- the question ----------
function qiQuestion() {
  const q = qiG.cur;
  qiSound('pop');
  qiShow(`<div class="qi-stage">
    <div class="qi-qn">Pregunta ${qiG.n} de ${qiG.per} · ${q.emoji}</div>
    <div class="qi-q">${qiE(q.q)}</div><div class="qi-qes">${qiE(q.qes)}</div>
    <div class="qi-timer" id="qi-timer"><button class="qi-btn ghost" onclick="qiTimer(60)">⏱️ 60 s para pensar</button></div>
    <div class="qi-hint">Pensad, discutid… cada uno dice su respuesta en voz alta. ¡Cuidado con lo obvio!</div>
    <button class="qi-btn big" onclick="qiKlaxon()">Respuestas finales ✋ → ¿Sirena?</button>
  </div>`, 'q');
}
let qiTimerId = null;
function qiTimer(sec) {
  clearInterval(qiTimerId);
  const box = document.getElementById('qi-timer'); if (!box) return;
  let s = sec; box.innerHTML = `<div class="qi-count">${s}</div>`;
  qiTimerId = setInterval(() => {
    const b = document.getElementById('qi-timer'); if (!b) return clearInterval(qiTimerId);
    s--; b.innerHTML = `<div class="qi-count ${s <= 10 ? 'low' : ''}">${Math.max(0, s)}</div>`;
    if (s <= 3 && s > 0) qiSound('tick');
    if (s <= 0) { clearInterval(qiTimerId); qiSound('chime'); }
  }, 1000);
}

// ---------- the klaxon: the obvious wrong answer ----------
function qiKlaxon() {
  clearInterval(qiTimerId);
  const q = qiG.cur;
  qiSound('klaxon');
  qiShow(`<div class="qi-klax">
    <div class="qi-klax-top">📢 KLAXON!</div>
    <div class="qi-trap">${qiE(q.trap)}</div><div class="qi-qes light">${qiE(q.trapEs)}</div>
    <div class="qi-ask">¿Quién dijo esto? Tocad su nombre: <b>−10</b></div>
    <div class="qi-players">${qiG.players.map((p, i) => `<button class="qi-pl ${qiG.marks[i].klax ? 'on klax' : ''}" onclick="qiMark(${i}, 'klax', this)">${qiE(p.name)}</button>`).join('')}</div>
    <button class="qi-btn big white" onclick="qiTruth()">¿Y la respuesta de verdad? →</button>
  </div>`, 'klax');
}
function qiMark(i, kind, el) {
  const m = qiG.marks[i]; m[kind] = !m[kind];
  if (kind === 'right' && m.right) m.star = false;
  if (kind === 'star' && m.star) m.right = false;
  if (el) { if (kind === 'klax') el.classList.toggle('on', m.klax); else qiTruthPlayers(); }
  if (m[kind]) qiSound(kind === 'klax' ? 'buzz' : 'pop');
}

// ---------- the truth ----------
function qiTruth() {
  const q = qiG.cur;
  qiSound('fanfare');
  qiShow(`<div class="qi-truth">
    <div class="qi-qn">${qiE(q.q)}</div>
    <div class="qi-ans">${q.emoji} ${qiE(q.answer)}</div><div class="qi-qes">${qiE(q.answerEs)}</div>
    <div class="qi-fact">${qiE(q.fact)}<div class="qi-fact-es">${qiE(q.factEs)}</div></div>
    <div class="qi-ask">¿Quién acertó? <b>✅ +10</b> · ¿Respuesta muy interesante? <b>⭐ +5</b></div>
    <div class="qi-players" id="qi-tp"></div>
    <div class="qi-row">
      ${QI_FILMS[q.id] ? `<button class="qi-btn big" onclick="qiFilm()">▶ Ver el vídeo</button>` : ''}
      <button class="qi-btn big ${QI_FILMS[q.id] ? 'ghost' : ''}" onclick="qiBoard()">Marcador →</button>
    </div>
  </div>`, 'truth');
  qiTruthPlayers();
}
function qiTruthPlayers() {
  const box = document.getElementById('qi-tp'); if (!box) return;
  box.innerHTML = qiG.players.map((p, i) => { const m = qiG.marks[i];
    return `<div class="qi-pl2 ${m.klax ? 'was-klax' : ''}"><span>${qiE(p.name)}${m.klax ? ' 📢' : ''}</span>
      <button class="${m.right ? 'on' : ''}" onclick="qiMark(${i}, 'right', this)">✅</button>
      <button class="${m.star ? 'on' : ''}" onclick="qiMark(${i}, 'star', this)">⭐</button></div>`; }).join('');
  if (window.twemoji) twemoji.parse(box, { folder: 'svg', ext: '.svg' });
}

// ---------- the explainer film ----------
function qiFilm() {
  const q = qiG.cur;
  qiShow(`<div class="qi-film"><video id="qi-vid" src="qi/films/${QI_FILMS[q.id]}" controls autoplay playsinline></video>
    <button class="qi-btn big" onclick="qiBoard()">Marcador →</button></div>`, 'film');
  const v = document.getElementById('qi-vid'); if (v) { v.play().catch(() => {}); v.onended = () => qiBoard(); }
}

// ---------- scoreboard ----------
function qiApply() {   // add this round's marks once
  if (!qiG.marks || qiG.applied === qiG.n) return;
  qiG.players.forEach((p, i) => { const m = qiG.marks[i];
    p.last = (m.right ? QI_PTS.right : 0) + (m.star ? QI_PTS.star : 0) + (m.klax ? QI_PTS.klax : 0); p.score += p.last; });
  qiG.applied = qiG.n;
}
function qiBoard() {
  qiStopMedia(); qiApply();
  const done = qiG.n >= qiG.per || !qiLeft().length;
  const rows = [...qiG.players].sort((a, b) => b.score - a.score);
  const max = Math.max(10, ...rows.map(p => Math.abs(p.score)));
  qiShow(`<div class="qi-board"><div class="qi-logo sm">Marcador</div>
    ${rows.map(p => `<div class="qi-bar"><span class="nm">${qiE(p.name)}</span>
      <span class="tr"><span class="fill ${p.score < 0 ? 'neg' : ''}" style="width:${Math.abs(p.score) / max * 100}%"></span></span>
      <span class="sc ${p.score < 0 ? 'neg' : ''}">${p.score}</span><span class="dl">${p.last ? (p.last > 0 ? '+' : '') + p.last : ''}</span></div>`).join('')}
    <button class="qi-btn big" onclick="${done ? 'qiFinal()' : 'qiSpin()'}">${done ? 'Resultado final 🏆' : 'Siguiente pregunta 🎲'}</button>
  </div>`, 'board');
}
function qiFinal() {
  qiApply();
  const rows = [...qiG.players].sort((a, b) => b.score - a.score);
  const top = rows[0].score, last = rows[rows.length - 1];
  qiSound('fanfare');
  qiShow(`<div class="qi-board"><div class="qi-logo">🏆 ${rows.filter(p => p.score === top).map(p => qiE(p.name)).join(' & ')}</div>
    <div class="qi-sub">¡Gana con ${top} puntos!</div>
    ${rows.map((p, i) => `<div class="qi-bar"><span class="nm">${['🥇', '🥈', '🥉'][i] || ''} ${qiE(p.name)}</span><span class="sc ${p.score < 0 ? 'neg' : ''}">${p.score}</span></div>`).join('')}
    ${rows.length > 1 && last.score < 0 ? `<div class="qi-hint">📢 ${qiE(last.name)}: campeón/a de General Ignorance (${last.score}). ¡Ahora ya lo sabes!</div>` : ''}
    <div class="qi-left">${qiLeft().length} preguntas sin ver en el banco</div>
    <div class="qi-row"><button class="qi-btn big" onclick="openQi()">Otra partida 🎲</button><button class="qi-btn big ghost" onclick="qiClose()">Salir</button></div>
  </div>`, 'board');
  qiG.n = qiG.per;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('qi-root')?.style.display === 'flex' && !document.fullscreenElement) qiClose(); });

// ---------- styles (TV: sizes follow the screen width) ----------
(function () {
  const css = `
  #qi-root{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;overflow-y:auto;
    background:#1B1F3B;color:#fff;font-family:'Nunito',sans-serif;padding:3vh 4vw;box-sizing:border-box;}
  #qi-root.klax{animation:qiFlash .22s steps(1) 6;background:#E03131;}
  @keyframes qiFlash{50%{background:#7a0d0d;}}
  #qi-root.truth{background:#0B6E4F;}
  #qi-root.film{background:#000;}
  #qi-root .qi-x{position:fixed;top:12px;right:16px;background:rgba(255,255,255,.15);color:#fff;border:0;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer;z-index:2;}
  #qi-root > div{width:100%;max-width:1400px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:min(2.2vh,18px);}
  .qi-logo{font-size:clamp(34px,6vw,96px);font-weight:900;letter-spacing:.04em;color:#FFD43B;line-height:1.05;}
  .qi-logo.sm{font-size:clamp(28px,4vw,60px);}
  .qi-sub{font-size:clamp(16px,2vw,30px);opacity:.85;}
  .qi-rules{display:flex;flex-wrap:wrap;gap:10px 22px;justify-content:center;font-size:clamp(14px,1.6vw,24px);background:rgba(255,255,255,.08);padding:12px 20px;border-radius:16px;}
  .qi-rules b{color:#FFD43B;} .qi-rules .neg b{color:#FF8787;}
  .qi-lbl{font-size:clamp(13px,1.3vw,20px);text-transform:uppercase;letter-spacing:.12em;opacity:.7;margin-top:6px;}
  #qi-names{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
  .qi-name{display:flex;background:#fff;border-radius:12px;overflow:hidden;}
  .qi-name input{border:0;padding:10px 12px;font-size:clamp(16px,1.6vw,24px);font-family:inherit;font-weight:700;width:min(220px,40vw);color:#1B1F3B;}
  .qi-name button{border:0;background:#eee;color:#555;padding:0 12px;cursor:pointer;font-size:16px;}
  .qi-per,.qi-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}
  .qi-btn{border:0;border-radius:14px;padding:12px 22px;font-family:inherit;font-weight:900;font-size:clamp(16px,1.6vw,24px);cursor:pointer;background:#FFD43B;color:#1B1F3B;}
  .qi-btn.big{font-size:clamp(20px,2.4vw,38px);padding:16px 34px;border-radius:18px;margin-top:6px;}
  .qi-btn.ghost{background:rgba(255,255,255,.14);color:#fff;} .qi-btn.ghost.on{background:#FFD43B;color:#1B1F3B;}
  .qi-btn.white{background:#fff;color:#C92A2A;}
  .qi-btn:disabled{opacity:.4;cursor:default;}
  .qi-link{background:none;border:0;color:#FFD43B;text-decoration:underline;font:inherit;cursor:pointer;font-size:clamp(13px,1.2vw,18px);}
  .qi-left{font-size:clamp(14px,1.4vw,22px);opacity:.8;}
  .qi-qn{font-size:clamp(16px,1.8vw,28px);opacity:.8;letter-spacing:.05em;}
  .qi-reel{font-size:clamp(120px,22vw,320px);line-height:1.1;}
  .qi-q{font-size:clamp(34px,5.4vw,96px);font-weight:900;line-height:1.1;background:#fff;color:#1B1F3B;padding:3vh 3vw;border-radius:28px;box-shadow:0 10px 0 #FFD43B;}
  .qi-qes{font-size:clamp(18px,2.4vw,40px);opacity:.85;font-style:italic;}
  .qi-hint{font-size:clamp(15px,1.6vw,26px);opacity:.85;}
  .qi-count{font-size:clamp(60px,9vw,150px);font-weight:900;color:#FFD43B;line-height:1;} .qi-count.low{color:#FF8787;}
  .qi-klax-top{font-size:clamp(30px,4.5vw,72px);font-weight:900;letter-spacing:.2em;color:#FFE3E3;}
  .qi-trap{font-size:clamp(60px,11vw,200px);font-weight:900;line-height:1;text-decoration:line-through;text-decoration-thickness:.1em;}
  .qi-ask{font-size:clamp(17px,2vw,32px);}
  .qi-players{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;}
  .qi-pl{border:3px solid #fff;background:transparent;color:#fff;border-radius:16px;padding:12px 24px;font:900 clamp(18px,2vw,32px) 'Nunito',sans-serif;cursor:pointer;}
  .qi-pl.on{background:#fff;color:#C92A2A;} .qi-pl.on::after{content:' −10';}
  .qi-ans{font-size:clamp(40px,7vw,120px);font-weight:900;line-height:1.05;color:#FFD43B;}
  .qi-fact{font-size:clamp(18px,2.2vw,36px);line-height:1.35;background:rgba(0,0,0,.18);padding:2vh 2.4vw;border-radius:20px;max-width:1200px;}
  .qi-fact-es{font-size:.7em;opacity:.8;margin-top:10px;font-style:italic;}
  .qi-pl2{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border-radius:16px;padding:6px 8px 6px 18px;font:900 clamp(17px,1.9vw,30px) 'Nunito',sans-serif;}
  .qi-pl2 button{border:0;background:rgba(255,255,255,.18);border-radius:12px;padding:8px 12px;cursor:pointer;font-size:clamp(18px,2vw,30px);opacity:.55;}
  .qi-pl2 button.on{background:#FFD43B;opacity:1;}
  .qi-pl2 img.emoji{width:1em;height:1em;}
  .qi-film video{width:min(100%,calc(80vh * 16 / 9));max-height:80vh;border-radius:12px;background:#000;}
  .qi-board{max-width:1100px !important;}
  .qi-bar{display:grid;grid-template-columns:minmax(120px,26%) 1fr auto 3.2em;align-items:center;gap:14px;width:100%;font:900 clamp(18px,2.4vw,40px) 'Nunito',sans-serif;}
  .qi-bar .nm{text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .qi-bar .tr{height:.8em;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;}
  .qi-bar .fill{display:block;height:100%;background:#FFD43B;border-radius:99px;} .qi-bar .fill.neg{background:#FF8787;}
  .qi-bar .sc{color:#FFD43B;min-width:2.2em;text-align:right;} .qi-bar .sc.neg{color:#FF8787;}
  .qi-bar .dl{font-size:.6em;opacity:.8;text-align:left;}
  #qi-root img.emoji{height:1em;width:1em;vertical-align:-0.1em;}
  .qi-reel img.emoji{height:1em;width:1em;}
  .sch-qi{display:flex;align-items:center;gap:14px;width:100%;margin-top:14px;padding:16px 18px;border:0;border-radius:18px;cursor:pointer;
    background:#1B1F3B;color:#fff;font-family:'Nunito',sans-serif;text-align:left;box-shadow:0 4px 0 #FFD43B;}
  .sch-qi .e{font-size:2.2rem;} .sch-qi b{display:block;font-size:1.15rem;color:#FFD43B;font-weight:900;} .sch-qi span{font-size:.9rem;opacity:.85;}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
