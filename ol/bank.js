// Olimpiada Matemática - problem bank (21 Nov 2026). Every answer is brute-force checked by
// Documents/school/olimpiada/verify.py. Built on Mates 5.º Temas 1-5 (numbers to 7 digits, + − × ÷ with remainders,
// brackets and order of operations, powers, symbol puzzles, multi-step problems): no maths he has not seen,
// the difficulty is in the thinking. Film lines are recorded by Documents/school/olimpiada/build_voice.py.
// Problem fields: q statement (**bold**), pic (svg), ask/ph answer prompt, ans {num, also} or {text, forbid},
// traps [{v, m}] = nudges for common wrong answers (never the answer), why = optional "explain why" prompt,
// hints x4, answer, idea, steps, film [{say, show:[elements], clear}].
(function () {
const R = (a, b, s = 1) => { const r = []; for (let i = a; i <= b; i += s) r.push(i); return r; };
const EMO = ch => 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.3/assets/svg/' + [...ch].map(c => c.codePointAt(0).toString(16)).filter(c => c !== 'fe0f').join('-') + '.svg';
const em = (ch, x, y, s, cls = '') => `<image class="${cls}" href="${EMO(ch)}" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}"/>`;
const RS = '#ffc9c9|🧦', BS = '#a5d8ff|🧦';

// --- pictures ---
function well(h, out) {     // the snail's well, 0-10 m
  const y = v => 322 - v * 30;
  let s = `<rect x="95" y="20" width="130" height="304" fill="#d0ebff" stroke="#495057" stroke-width="5" rx="6"/><rect x="30" y="14" width="260" height="10" fill="#51cf66" rx="4"/>`;
  for (let v = 0; v <= 10; v++) s += `<line x1="76" x2="95" y1="${y(v)}" y2="${y(v)}" stroke="#868e96" stroke-width="2"/><text x="68" y="${y(v) + 6}" font-size="17" text-anchor="end" fill="#495057">${v} m</text>`;
  s += out ? em('🐌', 260, -10, 44, 'pop') + em('🎉', 210, -26, 34, 'pop') : em('🐌', 160, y(h) - 18, 40, 'pop');
  return s;
}
function bar(cuts) {        // the carpenter's bar with its cuts
  let s = `<rect x="10" y="40" width="580" height="50" rx="8" fill="#e8b778" stroke="#8a5a2b" stroke-width="4"/>`;
  for (let k = 1; k <= cuts; k++) { const x = 10 + 580 * k / 6; s += `<line class="draw" x1="${x}" x2="${x}" y1="20" y2="110" stroke="#e03131" stroke-width="6" style="animation-delay:${k * 250}ms"/><text x="${x}" y="14" font-size="20" text-anchor="middle" fill="#e03131">${k}</text>`; }
  for (let k = 0; k < 6 && cuts === 5; k++) s += `<text x="${10 + 580 * (k + .5) / 6}" y="72" font-size="22" text-anchor="middle" fill="#5c3a12">${k + 1}</text>`;
  return s;
}
function pond(frac, day) {  // lilies covering 1, 1/2, 1/4 of the pond
  const w = 520 * frac;
  return `<rect x="20" y="20" width="520" height="160" rx="30" fill="#74c0fc"/><rect class="pop" x="20" y="20" width="${w}" height="160" rx="30" fill="#51cf66"/>
    ${em('🪷', 20 + w / 2, 100, 46)}<text x="280" y="215" font-size="26" text-anchor="middle" fill="#1d1442">Día ${day}</text>`;
}
function hexHands(n) {      // 6 friends on a hexagon, the first n handshake lines drawn
  const P = R(0, 5).map(k => [200 + 150 * Math.cos(Math.PI / 2 + k * Math.PI / 3), 175 - 150 * Math.sin(Math.PI / 2 + k * Math.PI / 3)]);
  const L = []; for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) L.push([a, b]);
  const col = ['#e03131', '#f08c00', '#2f9e44', '#1c7ed6', '#ae3ec9'];
  let s = '';
  L.slice(0, n).forEach(([a, b], k) => { s += `<line class="draw" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${col[a]}" stroke-width="5" style="animation-delay:${k * 90}ms"/>`; });
  P.forEach(([x, y], k) => { s += `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="#1d1442" stroke-width="4"/><text x="${x}" y="${y + 8}" font-size="22" text-anchor="middle">${'ABCDEF'[k]}</text>`; });
  return s;
}
function grid3(hl) {        // the 3 × 3 grid, with one highlighted square [x, y, size]
  let s = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += `<rect x="${10 + c * 80}" y="${10 + r * 80}" width="80" height="80" fill="#fff" stroke="#1d1442" stroke-width="4"/>`;
  (hl || []).forEach(([x, y, n, col], k) => { s += `<rect class="pop" x="${16 + x * 80}" y="${16 + y * 80}" width="${n * 80 - 12}" height="${n * 80 - 12}" fill="${col}" fill-opacity=".45" stroke="${col}" stroke-width="5" rx="6" style="animation-delay:${k * 200}ms"/>`; });
  return s;
}
function scale(left, right, tip, out) {   // two-pan balance; tip: -1 left heavier, 0 level, 1 right heavier
  const a = tip * 9, ly = 110 + tip * -22, ry = 110 + tip * 22;
  let s = `<polygon points="300,250 270,300 330,300" fill="#868e96"/><line x1="300" y1="250" x2="300" y2="110" stroke="#495057" stroke-width="8"/>
    <line x1="150" y1="${ly}" x2="450" y2="${ry}" stroke="#495057" stroke-width="8"/>
    <path d="M90 ${ly + 60} h120 l-20 26 h-80 z" fill="#ced4da" stroke="#495057" stroke-width="3"/><line x1="150" y1="${ly}" x2="110" y2="${ly + 60}" stroke="#868e96" stroke-width="2"/><line x1="150" y1="${ly}" x2="190" y2="${ly + 60}" stroke="#868e96" stroke-width="2"/>
    <path d="M390 ${ry + 60} h120 l-20 26 h-80 z" fill="#ced4da" stroke="#495057" stroke-width="3"/><line x1="450" y1="${ry}" x2="410" y2="${ry + 60}" stroke="#868e96" stroke-width="2"/><line x1="450" y1="${ry}" x2="490" y2="${ry + 60}" stroke="#868e96" stroke-width="2"/>`;
  const coins = (lst, cx, cy) => lst.map((t, k) => `<circle class="pop" cx="${cx - (lst.length - 1) * 19 + k * 38}" cy="${cy}" r="17" fill="${t === 'F' ? '#ffa94d' : '#ffd43b'}" stroke="#e67700" stroke-width="3"/><text x="${cx - (lst.length - 1) * 19 + k * 38}" y="${cy + 6}" font-size="16" text-anchor="middle" fill="#5c3a12">${t === 'F' ? '?' : t}</text>`).join('');
  s += coins(left, 150, ly + 42) + coins(right, 450, ry + 42) + coins(out || [], 300, 335);
  if (out && out.length) s += `<text x="300" y="372" font-size="16" text-anchor="middle" fill="#495057">fuera</text>`;
  return s;
}
function stairs(n, path) {  // staircase of n steps; path = list of step sizes drawn as hops
  const w = 60, h = 34, cx = k => k ? 20 + (k - 1) * w + 30 : 0, cy = k => 300 - k * h;
  let s = '';
  for (let k = 0; k < n; k++) s += `<rect x="${20 + k * w}" y="${300 - (k + 1) * h}" width="${(n - k) * w}" height="${h}" fill="${k % 2 ? '#ffe8cc' : '#ffd8a8'}" stroke="#e8590c" stroke-width="2"/><text x="${20 + k * w + 30}" y="${300 - k * h - 9}" font-size="18" text-anchor="middle" fill="#a14600">${k + 1}</text>`;
  if (path) { let at = 0; path.forEach((d, k) => { const x0 = cx(at), y0 = cy(at) - 4, x1 = cx(at + d), y1 = cy(at + d) - 4; s += `<path class="draw" d="M${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 45} ${x1} ${y1}" fill="none" stroke="${d === 1 ? '#1c7ed6' : '#c2255c'}" stroke-width="5" stroke-linecap="round" style="animation-delay:${k * 300}ms"/>`; at += d; }); }
  return s;
}
function odd(n) {           // squares built from odd L-shapes
  const c = ['#ffd43b', '#74c0fc', '#8ce99a', '#ffa8a8', '#d0bfff'], u = 46;
  let s = '';
  for (let k = 0; k < n; k++) for (let i = 0; i <= k; i++) for (const [x, y] of (i === k ? [[k, k]] : [[i, k], [k, i]]))
    s += `<rect class="pop" x="${10 + x * u}" y="${10 + y * u}" width="${u - 4}" height="${u - 4}" rx="6" fill="${c[k]}" stroke="#1d1442" stroke-width="2" style="animation-delay:${(i) * 80}ms"/>`;
  return s;
}

function barco(rise) {      // the ship's rope ladder; rise = hours of tide (1 rung each)
  const wl = 250 - rise * 14, top = wl - 170;
  let s = `<rect x="10" y="30" width="44" height="270" fill="#ced4da" stroke="#495057" stroke-width="3"/>`;
  for (let k = 0; k <= 5; k++) s += `<line x1="36" x2="54" y1="${250 - k * 14}" y2="${250 - k * 14}" stroke="#212529" stroke-width="3"/><text x="30" y="${255 - k * 14}" font-size="12" text-anchor="end" fill="#212529">${k}</text>`;
  s += `<path d="M110 ${top} H410 L380 ${wl + 40} H140 Z" fill="#e8590c" stroke="#7a2a05" stroke-width="4"/>`;
  s += `<line x1="185" x2="185" y1="${top}" y2="${wl + 30}" stroke="#7a4b12" stroke-width="5"/><line x1="235" x2="235" y1="${top}" y2="${wl + 30}" stroke="#7a4b12" stroke-width="5"/>`;
  for (let k = -1; k <= 10; k++) if (k) s += `<line x1="185" x2="235" y1="${wl - 14 * k}" y2="${wl - 14 * k}" stroke="#f4d58d" stroke-width="5"/>`;
  s += `<text x="258" y="${wl - 140 + 6}" font-size="17" font-weight="900" fill="#fff">10</text><text x="258" y="${wl - 14 + 6}" font-size="17" font-weight="900" fill="#fff">1</text>`;
  s += `<rect x="0" y="${wl}" width="420" height="${300 - wl}" fill="#339af0" fill-opacity=".78"/><path d="M0 ${wl} q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#1971c2" stroke-width="3"/>`;
  return s;
}
function cubo(hl) {         // 3 × 3 × 3 painted cube; hl = paint counts to colour yellow (3 corner, 2 edge, 1 face)
  const u = 46, cx = 150, cy = 165;
  const P = (x, y, z) => `${(cx + (x - y) * u * 0.866).toFixed(1)},${(cy + (x + y) * u * 0.5 - z * u).toFixed(1)}`;
  const paint = c => c.filter(v => v !== 1).length;
  const face = (pts, cube, base) => `<polygon points="${pts.map(p => P(...p)).join(' ')}" fill="${(hl || []).includes(paint(cube)) ? '#ffd43b' : base}" stroke="#1d1442" stroke-width="2.5" stroke-linejoin="round"/>`;
  let s = '';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += face([[i, j, 3], [i + 1, j, 3], [i + 1, j + 1, 3], [i, j + 1, 3]], [i, j, 2], '#ff8787');
  for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) s += face([[3, j, k], [3, j + 1, k], [3, j + 1, k + 1], [3, j, k + 1]], [2, j, k], '#e03131');
  for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) s += face([[i, 3, k], [i + 1, 3, k], [i + 1, 3, k + 1], [i, 3, k + 1]], [i, 2, k], '#c92a2a');
  return s;
}
function rejilla(rs) {      // the 2 × 3 grid with rectangles [row0, col0, row1, col1] drawn on it
  const W = 100, X = 20, Y = 20, col = ['#e03131', '#1c7ed6', '#2f9e44', '#f08c00', '#ae3ec9', '#0c8599'];
  let s = '';
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) s += `<rect x="${X + c * W}" y="${Y + r * W}" width="${W}" height="${W}" fill="#fff" stroke="#1d1442" stroke-width="4"/>`;
  (rs || []).forEach(([r0, c0, r1, c1], k) => { const i = 7 + (k % 3) * 6;
    s += `<rect class="pop" x="${X + c0 * W + i}" y="${Y + r0 * W + i}" width="${(c1 - c0 + 1) * W - 2 * i}" height="${(r1 - r0 + 1) * W - 2 * i}" rx="8" fill="${col[k % 6]}" fill-opacity=".2" stroke="${col[k % 6]}" stroke-width="5" style="animation-delay:${k * 160}ms"/>`; });
  return s;
}
function mesas(n) {         // n square tables pushed into one long table; one person on each free side
  const S = 60, x0 = 200 - n * S / 2, y0 = 70;
  let s = `<rect x="${x0}" y="${y0}" width="${n * S}" height="${S}" rx="4" fill="#d9a066" stroke="#7a4b12" stroke-width="4"/>`;
  for (let k = 1; k < n; k++) s += `<line x1="${x0 + k * S}" x2="${x0 + k * S}" y1="${y0}" y2="${y0 + S}" stroke="#7a4b12" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  const seat = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#ffd43b" stroke="#1d1442" stroke-width="3"/><circle cx="${x - 5}" cy="${y - 3}" r="2.2" fill="#1d1442"/><circle cx="${x + 5}" cy="${y - 3}" r="2.2" fill="#1d1442"/><path d="M${x - 5} ${y + 5} q5 4 10 0" fill="none" stroke="#1d1442" stroke-width="2"/>`;
  for (let k = 0; k < n; k++) s += seat(x0 + k * S + S / 2, y0 - 26) + seat(x0 + k * S + S / 2, y0 + S + 26);
  return s + seat(x0 - 26, y0 + S / 2) + seat(x0 + n * S + 26, y0 + S / 2);
}
function cerillas(n, col) { // n matchstick squares in a row; col: first square blue, each new square's 3 sticks green
  const S = 50, x0 = (300 - n * S) / 2, y0 = 30;
  const stick = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="5.5" fill="#e03131"/>`;
  let s = '';
  for (let k = 0; k < n; k++) {
    const c = !col ? '#e8b04a' : k ? '#51cf66' : '#4dabf7', x = x0 + k * S;
    if (k === 0) s += stick(x, y0 + S - 5, x, y0 + 5, c);
    s += stick(x + 5, y0, x + S - 5, y0, c) + stick(x + 5, y0 + S, x + S - 5, y0 + S, c) + stick(x + S, y0 + S - 5, x + S, y0 + 5, c);
  }
  return s;
}
function pizza(cuts, nums) { // round pizza; cuts = [[normal angle°, distance from the centre]]; nums: number the 7 pieces of the 3-cut picture
  const cx = 150, cy = 150, R = 120;
  let s = `<circle cx="${cx}" cy="${cy}" r="${R + 9}" fill="#e8a33d"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#ffd8a8" stroke="#d9480f" stroke-width="3"/>`;
  [[105, 95], [200, 112], [168, 205], [92, 178], [212, 172], [140, 140], [150, 62], [62, 140], [238, 140]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="10" fill="#e03131" opacity=".8"/>`);
  (cuts || []).forEach(([a, d]) => { const r = a * Math.PI / 180, nx = Math.cos(r), ny = Math.sin(r), h = Math.sqrt(R * R - d * d);
    s += `<line x1="${(cx + d * nx - h * ny).toFixed(1)}" y1="${(cy + d * ny + h * nx).toFixed(1)}" x2="${(cx + d * nx + h * ny).toFixed(1)}" y2="${(cy + d * ny - h * nx).toFixed(1)}" stroke="#1d1442" stroke-width="5" stroke-linecap="round"/>`; });
  if (nums) [[0, 0], [90, 84], [210, 84], [330, 84], [270, 100], [30, 100], [150, 100]].forEach(([a, q], k) => { const r = a * Math.PI / 180, x = (cx + q * Math.cos(r)).toFixed(1), y = cy + q * Math.sin(r);
    s += `<circle cx="${x}" cy="${y.toFixed(1)}" r="15" fill="#fff" stroke="#1d1442" stroke-width="2.5"/><text x="${x}" y="${(y + 6).toFixed(1)}" font-size="17" font-weight="900" text-anchor="middle" fill="#1d1442">${k + 1}</text>`; });
  return s;
}
function vias(h) {          // 360 km of track at 1 px per km; the two trains after h hours (50 and 70 km/h)
  const a = 30 + 50 * h, b = 390 - 70 * h, meet = a >= b;
  let s = `<line x1="30" x2="390" y1="70" y2="70" stroke="#495057" stroke-width="4"/>`;
  for (let x = 30; x <= 390; x += 12) s += `<line x1="${x}" x2="${x}" y1="64" y2="76" stroke="#adb5bd" stroke-width="2"/>`;
  s += `<circle cx="30" cy="70" r="7" fill="#1d1442"/><circle cx="390" cy="70" r="7" fill="#1d1442"/>`;
  if (!h) s += `<line x1="30" x2="390" y1="96" y2="96" stroke="#495057" stroke-width="2"/><rect x="170" y="84" width="80" height="24" fill="#fff"/><text x="210" y="102" font-size="17" font-weight="900" text-anchor="middle" fill="#1d1442">360 km</text>`;
  else s += `<line x1="30" x2="${a}" y1="92" y2="92" stroke="#1c7ed6" stroke-width="6"/><line x1="${b}" x2="390" y1="100" y2="100" stroke="#e03131" stroke-width="6"/>`
    + `<text x="${(30 + a) / 2}" y="120" font-size="15" font-weight="900" text-anchor="middle" fill="#1c7ed6">${50 * h} km</text><text x="${(b + 390) / 2}" y="120" font-size="15" font-weight="900" text-anchor="middle" fill="#e03131">${70 * h} km</text>`;
  s += `<text x="${meet ? a - 16 : a}" y="58" font-size="28" text-anchor="middle">🚆</text><text x="${meet ? b + 16 : b}" y="58" font-size="28" text-anchor="middle">🚆</text>`;
  if (!h) s += `<text x="${a + 6}" y="20" font-size="14" font-weight="900" fill="#1c7ed6">50 km/h →</text><text x="${b - 6}" y="20" font-size="14" font-weight="900" text-anchor="end" fill="#e03131">← 70 km/h</text>`;
  return s;
}
function calles(nums, paths) { // 3 × 2 blocks of streets; corner (i, j): i to the right 0-3, j up 0-2; nums[j][i] at corners ('!' = gold); paths like 'RRUUR'
  const X = i => 50 + i * 80, Y = j => 210 - j * 80, col = ['#e03131', '#1c7ed6', '#2f9e44'];
  let s = '';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) s += `<rect x="${X(i) + 10}" y="${Y(j + 1) + 10}" width="60" height="60" rx="6" fill="#ced4da"/>`;
  for (let i = 0; i <= 3; i++) s += `<line x1="${X(i)}" x2="${X(i)}" y1="${Y(0)}" y2="${Y(2)}" stroke="#868e96" stroke-width="3"/>`;
  for (let j = 0; j <= 2; j++) s += `<line x1="${X(0)}" x2="${X(3)}" y1="${Y(j)}" y2="${Y(j)}" stroke="#868e96" stroke-width="3"/>`;
  (paths || []).forEach((p, k) => { const o = (k - (paths.length - 1) / 2) * 6; let i = 0, j = 0, d = `M${X(0) + o} ${Y(0) - o}`;
    for (const c of p) { if (c === 'R') i++; else j++; d += ` L${X(i) + o} ${Y(j) - o}`; }
    s += `<path d="${d}" fill="none" stroke="${col[k % 3]}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`; });
  (nums || []).forEach((row, j) => (row || []).forEach((v, i) => { if (v == null) return; v = String(v); const hl = v[0] === '!'; if (hl) v = v.slice(1);
    s += `<circle cx="${X(i)}" cy="${Y(j)}" r="16" fill="${hl ? '#ffd43b' : '#fff'}" stroke="#1d1442" stroke-width="2.5"/><text x="${X(i)}" y="${Y(j) + 6}" font-size="17" font-weight="900" text-anchor="middle" fill="#1d1442">${v}</text>`; }));
  return s + `<text x="4" y="252" font-size="30">🏠</text><text x="300" y="32" font-size="30">🏫</text>`;
}
function corro(out, hl) {   // 10 children in a ring, 1 at the top, numbered clockwise; out = crossed out, hl = gold
  const o = new Set(out || []), w = new Set(hl || []);
  let s = `<circle cx="150" cy="140" r="100" fill="none" stroke="#dee2e6" stroke-width="4" stroke-dasharray="6 8"/><text x="150" y="154" font-size="40" text-anchor="middle" fill="#adb5bd">↻</text>`;
  for (let k = 1; k <= 10; k++) { const r = ((k - 1) * 36 - 90) * Math.PI / 180, x = +(150 + 100 * Math.cos(r)).toFixed(1), y = +(140 + 100 * Math.sin(r)).toFixed(1), gone = o.has(k);
    s += `<circle cx="${x}" cy="${y}" r="24" fill="${gone ? '#f1f3f5' : w.has(k) ? '#ffd43b' : '#a5d8ff'}" stroke="${gone ? '#adb5bd' : '#1d1442'}" stroke-width="3"/><text x="${x}" y="${y + 7}" font-size="20" font-weight="900" text-anchor="middle" fill="${gone ? '#adb5bd' : '#1d1442'}">${k}</text>`;
    if (gone) s += `<path d="M${x - 14} ${y - 14} L${x + 14} ${y + 14} M${x + 14} ${y - 14} L${x - 14} ${y + 14}" stroke="#e03131" stroke-width="4" stroke-linecap="round"/>`; }
  return s;
}
function tomos(st) {        // three volumes seen from above, spines towards you (bottom); 2 px per mm. st 1: page 1 of vol 1; 2: + last page of vol 3; 3: + the moth's path
  const col = ['#1864ab', '#c92a2a', '#2b8a3e'];
  let s = '';
  for (let k = 0; k < 3; k++) { const x = 20 + k * 100;
    s += `<rect x="${x + 10}" y="50" width="80" height="120" fill="#fff9db"/>`;
    for (let p = x + 16; p < x + 90; p += 6) s += `<line x1="${p}" x2="${p}" y1="52" y2="168" stroke="#e9dfb3" stroke-width="1.5"/>`;
    s += `<rect x="${x}" y="46" width="10" height="138" fill="${col[k]}"/><rect x="${x + 90}" y="46" width="10" height="138" fill="${col[k]}"/><rect x="${x}" y="170" width="100" height="14" fill="${col[k]}"/>`
      + `<text x="${x + 50}" y="181.5" font-size="11" font-weight="900" text-anchor="middle" fill="#fff">TOMO ${k + 1}</text>`; }
  if (st >= 1) s += `<line x1="109" x2="109" y1="50" y2="170" stroke="#f08c00" stroke-width="5"/><text x="109" y="38" font-size="13" font-weight="900" text-anchor="middle" fill="#d9480f">1.ª página ↓</text>`;
  if (st >= 2) s += `<line x1="231" x2="231" y1="50" y2="170" stroke="#f08c00" stroke-width="5"/><text x="231" y="38" font-size="13" font-weight="900" text-anchor="middle" fill="#d9480f">↓ última página</text>`;
  if (st >= 3) s += `<line x1="109" x2="231" y1="110" y2="110" stroke="#e03131" stroke-width="5" stroke-dasharray="9 6"/><text x="104" y="106" font-size="22" text-anchor="end">🐛</text>`;
  return s + `<text x="170" y="210" font-size="14" font-weight="700" text-anchor="middle" fill="#495057">👀 Tú, mirando los lomos</text>`;
}
function edificio(lit, at) { // 9-floor building; stair flights from floor 1 up to floor `lit` drawn red and numbered; Lola on floor `at`
  const y = f => 392 - (f - 1) * 40;
  let s = `<polygon points="70,${y(9) - 40} 145,${y(9) - 70} 220,${y(9) - 40}" fill="#e8590c"/><rect x="80" y="${y(9) - 40}" width="130" height="${y(1) - y(9) + 40}" fill="#fff4e6" stroke="#7a4b12" stroke-width="4"/><rect x="10" y="392" width="285" height="8" rx="3" fill="#51cf66"/>`;
  for (let f = 1; f <= 9; f++) s += `<line x1="80" x2="210" y1="${y(f)}" y2="${y(f)}" stroke="#7a4b12" stroke-width="2"/><rect x="96" y="${y(f) - 30}" width="22" height="18" fill="#a5d8ff"/><rect x="172" y="${y(f) - 30}" width="22" height="18" fill="#a5d8ff"/><text x="66" y="${y(f) - 12}" font-size="17" font-weight="800" text-anchor="end" fill="#495057">${f}</text>`;
  for (let f = 1; f < 9; f++) {
    const on = f < lit, x1 = f % 2 ? 228 : 272, x2 = f % 2 ? 272 : 228;
    s += `<line x1="${x1}" y1="${y(f)}" x2="${x2}" y2="${y(f + 1)}" stroke="${on ? '#e03131' : '#ced4da'}" stroke-width="${on ? 6 : 4}" stroke-linecap="round"/>`;
    if (on) s += `<circle cx="250" cy="${y(f) - 20}" r="11" fill="#fff" stroke="#e03131" stroke-width="2.5"/><text x="250" y="${y(f) - 15}" font-size="13" font-weight="900" text-anchor="middle" fill="#e03131">${f}</text>`;
  }
  return s + (at ? em('👧', 145, y(at) - 17, 30, 'pop') : '');
}
function ronda(n, a, b, half) { // n children in a ring, numbered clockwise from the top; a, b gold and joined; half: colour the children between a and b
  const R0 = 115, r = n > 10 ? 14 : 22, fs = n > 10 ? 12 : 20;
  const P = k => { const t = ((k - 1) * 360 / n - 90) * Math.PI / 180; return [+(150 + R0 * Math.cos(t)).toFixed(1), +(150 + R0 * Math.sin(t)).toFixed(1)]; };
  let s = `<circle cx="150" cy="150" r="${R0}" fill="none" stroke="#dee2e6" stroke-width="4" stroke-dasharray="6 8"/>`;
  if (a && b) s += `<line x1="${P(a)[0]}" y1="${P(a)[1]}" x2="${P(b)[0]}" y2="${P(b)[1]}" stroke="#e03131" stroke-width="4" stroke-dasharray="8 6"/>`;
  for (let k = 1; k <= n; k++) {
    const [x, y] = P(k), gold = k === a || k === b, side = half && k > a && k < b;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${gold ? '#ffd43b' : side ? '#a5d8ff' : '#f1f3f5'}" stroke="#1d1442" stroke-width="2.5"/><text x="${x}" y="${y + fs * .36}" font-size="${fs}" font-weight="900" text-anchor="middle" fill="#1d1442">${k}</text>`;
  }
  return s;
}
function meses(per, extra) { // the 12 months as boxes with `per` people each; box `extra` (0-11) gets one more, in red
  const M = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  let s = '';
  M.forEach((m, k) => {
    const x = 10 + (k % 4) * 97, y = 10 + Math.floor(k / 4) * 92, more = extra === k;
    s += `<rect x="${x}" y="${y}" width="88" height="82" rx="10" fill="${more ? '#ffe3e3' : '#f8f9fa'}" stroke="${more ? '#e03131' : '#adb5bd'}" stroke-width="3"/><text x="${x + 44}" y="${y + 22}" font-size="16" font-weight="800" text-anchor="middle" fill="#495057">${m}</text>`;
    for (let i = 0; i < per + (more ? 1 : 0); i++) s += em(i < per ? '🙂' : '😮', x + 22 + i * 22, y + 55, 22, i >= per ? 'pop' : '');
  });
  return s;
}
function piramide(rows) {   // number pyramid; rows from the bottom ([4], [3], [2], [1]); '' empty, '?' hidden, '!x' gold
  let s = '';
  rows.forEach((row, r) => row.forEach((v, k) => {
    const x = 200 - (4 - r) * 45 + k * 90, y = 200 - r * 55; v = String(v);
    const g = v[0] === '!' && v.length > 1, t = g ? v.slice(1) : v, q = t === '?';
    s += `<rect x="${x + 2}" y="${y}" width="86" height="50" rx="6" fill="${g ? '#ffd43b' : q ? '#e5dbff' : '#ffc9a8'}" stroke="#a0522d" stroke-width="3"/><text x="${x + 45}" y="${y + 34}" font-size="26" font-weight="900" text-anchor="middle" fill="${q ? '#7048e8' : '#1d1442'}">${t}</text>`;
  }));
  return s;
}
function cuadrado(k) {      // 1+2+…+k (blue) and 1+2+…+(k−1) (orange) fitting together into a k × k square of dots
  const c = 260 / k;
  let s = '';
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) s += `<circle class="pop" cx="${(20 + c * (j + .5)).toFixed(1)}" cy="${(20 + c * (i + .5)).toFixed(1)}" r="${(c * .38).toFixed(1)}" fill="${j <= i ? '#4dabf7' : '#ffa94d'}" style="animation-delay:${(i * k + j) * 25}ms"/>`;
  return s;
}
const chkP = v => ({ v, m: `Comprueba: pon el ${v} en el ladrillo **?** y calcula la pirámide hasta arriba. ¿Sale 36?` });
const chkC = v => ({ v, m: `Comprueba con la casa ${v}: ¿cuánto suman las casas de **antes**? ¿Podrían sumar lo mismo las de **después**, con menos de 50 casas en la calle?` });
const selT = v => { for (let b = 0; 5 * b <= v; b++) if ((v - 5 * b) % 3 === 0) return { v, m: `Comprueba: ${v} = ${[...Array((v - 5 * b) / 3).fill(3), ...Array(b).fill(5)].join(' + ')}. ¡Ese **sí** se puede pagar justo!` }; };
const dadT = v => ({ v, m: `La suma ${v} sale de ${6 - Math.abs(v - 7)} ${6 - Math.abs(v - 7) === 1 ? 'manera' : 'maneras'}. ¿Hay alguna suma que salga de **más**?` });
const puT = v => ({ v, m: [19, 20, 21, 23, 24, 25].includes(v) ? '¡Eso funciona! Pero se puede **más rápido**. Prueba otras parejas y apunta cada viaje.' : 'Comprueba viaje a viaje: ¿quién vuelve con la linterna cada vez? Escribe todos los viajes y súmalos.' });
const dTab = hl => [['+', 1, 2, 3, 4, 5, 6], ...R(1, 6).map(b => [b, ...R(1, 6).map(a => (hl.includes(a + b) ? '!' : '') + (a + b))])];
function jardin(hl) {        // square garden, 5 trees per side (16 in all); hl: corner trees on gold discs
  const P = [40, 95, 150, 205, 260];
  let s = `<rect x="40" y="40" width="220" height="220" fill="#d3f9d8" stroke="#2b8a3e" stroke-width="3" stroke-dasharray="8 6"/>`;
  P.forEach(x => P.forEach(y => {
    if (!(x === 40 || x === 260 || y === 40 || y === 260)) return;
    const c = (x === 40 || x === 260) && (y === 40 || y === 260);
    if (hl && c) s += `<circle cx="${x}" cy="${y}" r="25" fill="#ffd43b" stroke="#e03131" stroke-width="3"/>`;
    s += em('🌳', x, y, 34);
  }));
  return s;
}
function tunel(x) {          // 400 m tunnel; 200 m train whose front is at metre x (0 = tunnel mouth); last wagon red, engine yellow
  const P = m => 40 + (m + 200) * .65;
  let s = `<rect x="0" y="150" width="600" height="6" fill="#868e96"/><path d="M140,150 L170,80 Q300,10 430,80 L460,150 Z" fill="#c08552"/><rect x="170" y="92" width="260" height="58" fill="#343a40"/><text x="300" y="62" font-size="20" font-weight="900" text-anchor="middle" fill="#fff">túnel 400 m</text>`;
  for (let k = 0; k < 4; k++) {
    const a = P(x - 200 + k * 50) + 2, w = 50 * .65 - 4;
    s += `<rect x="${a}" y="104" width="${w}" height="38" rx="6" fill="${k === 3 ? '#fab005' : k === 0 ? '#e03131' : '#4dabf7'}" stroke="#1d1442" stroke-width="2"/><circle cx="${a + 8}" cy="146" r="5" fill="#1d1442"/><circle cx="${a + w - 8}" cy="146" r="5" fill="#1d1442"/>`;
  }
  return s + `<text x="${(P(x - 200) + P(x)) / 2}" y="182" font-size="17" font-weight="800" text-anchor="middle" fill="#495057">tren 200 m</text>`;
}
function cuerda(st) {        // 0 straight rope · 1 folded in half + cut line · 2 folded and cut (3 colours) · 3 unfolded: 3 pieces
  const L = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
  const cut = `<line x1="210" y1="40" x2="210" y2="165" stroke="#e03131" stroke-width="3" stroke-dasharray="8 6"/>` + em('✂️', 210, 26, 30);
  if (st === 0) return L(30, 100, 370, 100, '#a0522d');
  if (st === 1) return `<path d="M330,70 H90 A30,30 0 0 0 90,130 H330" fill="none" stroke="#a0522d" stroke-width="10" stroke-linecap="round"/>` + cut;
  if (st === 2) return `<path d="M200,70 H90 A30,30 0 0 0 90,130 H200" fill="none" stroke="#40c057" stroke-width="10" stroke-linecap="round"/>` + L(222, 70, 330, 70, '#fd7e14') + L(222, 130, 330, 130, '#4dabf7') + cut;
  const T = (x, t) => `<text x="${x}" y="70" font-size="22" font-weight="900" text-anchor="middle" fill="#1d1442">${t}</text>`;
  return L(30, 100, 105, 100, '#fd7e14') + L(130, 100, 270, 100, '#40c057') + L(295, 100, 370, 100, '#4dabf7') + T(67, 1) + T(200, 2) + T(332, 3);
}
function tableta(r, c, sep, done) { // r × c chocolate; sep: rows pulled apart; done: how many rows are split into single squares
  let s = '';
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    const x = 20 + j * 52 + (i < done ? j * 10 : 0), y = 20 + i * 52 + (sep ? i * 12 : 0);
    s += `<rect x="${x}" y="${y}" width="50" height="50" rx="5" fill="#8b5a2b" stroke="#5c3a1a" stroke-width="3"/><rect x="${x + 8}" y="${y + 8}" width="34" height="34" rx="4" fill="#a0693a"/>`;
  }
  return s;
}
function ruedas(spin) {      // 12-tooth gear meshed with a 36-tooth gear; one red tooth each; spin: both turn (big at 1/3 speed)
  const gear = (cx, cy, r, n, fill, to, lab) => {
    let g = '';
    for (let k = 0; k < n; k++) g += `<rect x="${cx - 5}" y="${cy - r - 11}" width="10" height="15" rx="2" fill="${k ? '#868e96' : '#e03131'}" transform="rotate(${(k * 360 / n).toFixed(2)} ${cx} ${cy})"/>`;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#495057" stroke-width="3"/><circle cx="${cx}" cy="${cy - r + 12}" r="6" fill="#e03131"/>`;
    const anim = spin ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${to} ${cx} ${cy}" dur="4s" repeatCount="indefinite"/>` : '';
    return `<g>${g}${anim}</g><text x="${cx}" y="${cy + 9}" font-size="${r > 60 ? 26 : 20}" font-weight="900" text-anchor="middle" fill="#1d1442">${lab}</text>`;
  };
  return gear(80, 150, 45, 12, '#ffe8cc', 360, '12') + gear(268, 150, 135, 36, '#d0ebff', -120, '36 dientes');
}
function barras(m) {         // bar model: Bea 1 bar, Ana 2 bars; m 1: Ana's extra bar halved, half goes to Bea (6); m 2: bars = 12
  const B = (x, y, w, f, t, dash) => `<rect x="${x}" y="${y}" width="${w}" height="50" rx="6" fill="${f}" stroke="#1d1442" stroke-width="2.5"${dash ? ' stroke-dasharray="7 5"' : ''}/>` + (t ? `<text x="${x + w / 2}" y="${y + 33}" font-size="22" font-weight="900" text-anchor="middle" fill="#1d1442">${t}</text>` : '');
  let s = `<text x="70" y="63" font-size="20" font-weight="800" text-anchor="end" fill="#1d1442">Bea</text><text x="70" y="143" font-size="20" font-weight="800" text-anchor="end" fill="#1d1442">Ana</text>`;
  s += B(80, 30, 130, '#a5d8ff', m >= 2 ? '12' : '') + B(80, 110, 130, '#ffc9c9', m >= 2 ? '12' : '');
  return s + (m === 0 ? B(210, 110, 130, '#ffc9c9', '') : B(210, 110, 65, '#ffc9c9', '6') + B(275, 110, 65, '#ffd43b', '6') + B(210, 30, 65, '#fff3bf', '+6', true));
}
function reloj(h, m) {       // analogue clock at h:m (m may have decimals); hour hand dark, minute hand red
  const hand = (deg, L, w, c) => { const a = deg * Math.PI / 180; return `<line x1="150" y1="150" x2="${(150 + L * Math.sin(a)).toFixed(1)}" y2="${(150 - L * Math.cos(a)).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
  let s = `<circle cx="150" cy="150" r="135" fill="#fff" stroke="#1d1442" stroke-width="6"/>`;
  for (let k = 1; k <= 12; k++) { const a = k * 30 * Math.PI / 180; s += `<text x="${(150 + 108 * Math.sin(a)).toFixed(1)}" y="${(158 - 108 * Math.cos(a)).toFixed(1)}" font-size="24" font-weight="900" text-anchor="middle" fill="#495057">${k}</text>`; }
  return s + hand(((h % 12) + m / 60) * 30, 68, 11, '#1d1442') + hand(m * 6, 108, 6, '#e03131') + `<circle cx="150" cy="150" r="9" fill="#1d1442"/>`;
}
function jarras(b, sm) {     // 5-litre and 3-litre jugs holding b and sm litres
  const J = (x, w, cap, v, lab) => `<rect x="${x}" y="${230 - v * 36}" width="${w}" height="${v * 36}" fill="#74c0fc"/><path d="M${x},${230 - cap * 36 - 8} V230 H${x + w} V${230 - cap * 36 - 8}" fill="none" stroke="#1d1442" stroke-width="5" stroke-linejoin="round"/><text x="${x + w / 2}" y="${230 - cap * 36 - 18}" font-size="24" font-weight="900" text-anchor="middle" fill="#1971c2">${v} L</text><text x="${x + w / 2}" y="255" font-size="16" font-weight="800" text-anchor="middle" fill="#495057">${lab}</text>`;
  return J(50, 110, 5, b, 'jarra de 5 L') + J(210, 90, 3, sm, 'jarra de 3 L');
}
function piedras(row) {      // stones in a row: 'G' green frog, 'B' brown frog, '_' empty  (width 70 + 58 per extra stone)
  let s = '';
  [...row].forEach((ch, i) => {
    const x = 35 + i * 58;
    s += `<ellipse cx="${x}" cy="78" rx="26" ry="13" fill="#adb5bd" stroke="#495057" stroke-width="2"/>`;
    if (ch !== '_') s += `<circle cx="${x}" cy="48" r="23" fill="${ch === 'G' ? '#8ce99a' : '#d9a066'}" stroke="#1d1442" stroke-width="2.5"/>` + em('🐸', x, 48, 32);
  });
  return s;
}
const jaT = v => ({ v, m: v > 7 ? '¡Eso funciona! Pero se puede con **menos** movimientos. ¿Sobra algún movimiento? ¿Y si empiezas por la **otra** jarra?' : 'Comprueba movimiento a movimiento en una tabla: ¿cuántos litros hay en cada jarra después de cada uno?' });
const raT = v => ({ v, m: 'Prueba primero con **pocas** ranas: 1 verde y 1 marrón, luego 2 y 2. Cuenta los movimientos y busca cómo crecen.' });

// --- batch 7 helpers (28 Nov 2026) ---
function filacole(st) {     // 12 children, front (left) to back (right); Ana = 5th (gold). st 1: front count 1-5 · 2: + back count 1-8 · 3: brackets 4 | Ana | 7
  const X = i => 30 + i * 49;
  let s = `<text x="8" y="22" font-size="15" font-weight="800" fill="#495057">⬅ delante</text><text x="592" y="22" font-size="15" font-weight="800" text-anchor="end" fill="#495057">detrás ➡</text>`;
  for (let i = 0; i < 12; i++) {
    const ana = i === 4;
    s += `<circle cx="${X(i)}" cy="85" r="21" fill="${ana ? '#ffd43b' : '#e9ecef'}" stroke="${ana && st === 2 ? '#e03131' : '#868e96'}" stroke-width="${ana && st === 2 ? 4 : 2}"/>` + em(ana ? '👧' : '🧒', X(i), 85, 30);
    if (st >= 1 && st < 3 && i <= 4) s += `<text x="${X(i)}" y="55" font-size="19" font-weight="900" text-anchor="middle" fill="#1971c2">${i + 1}</text>`;
    if (st === 2 && i >= 4) s += `<text x="${X(i)}" y="133" font-size="19" font-weight="900" text-anchor="middle" fill="#e8590c">${12 - i}</text>`;
  }
  if (st < 2) s += `<text x="${X(4)}" y="133" font-size="17" font-weight="900" text-anchor="middle" fill="#1d1442">Ana</text>`;
  if (st === 3) {
    const br = (a, b, t, c) => `<path d="M${X(a) - 18},120 v10 H${X(b) + 18} v-10" fill="none" stroke="${c}" stroke-width="3"/><text x="${(X(a) + X(b)) / 2}" y="155" font-size="18" font-weight="900" text-anchor="middle" fill="${c}">${t}</text>`;
    s += br(0, 3, '4 delante', '#1971c2') + `<text x="${X(4)}" y="133" font-size="17" font-weight="900" text-anchor="middle" fill="#1d1442">Ana</text>` + br(5, 11, '7 detrás', '#e8590c');
  }
  return s;
}
function recta(st) {         // number line 40-60. st 1: 45-54 green (round to 50) · 2: + 44 and 55 red with where they go · 3: + brace "10 números"
  const X = n => 20 + (n - 40) * 28;
  let s = `<line x1="10" y1="90" x2="590" y2="90" stroke="#495057" stroke-width="3"/>`;
  for (let n = 40; n <= 60; n++) {
    const g = st >= 1 && n >= 45 && n <= 54, r = st >= 2 && (n === 44 || n === 55), big = n % 10 === 0;
    if (g || r) s += `<circle cx="${X(n)}" cy="90" r="12" fill="${g ? '#8ce99a' : '#ffc9c9'}" stroke="${g ? '#2b8a3e' : '#e03131'}" stroke-width="2.5"/>`;
    s += `<line x1="${X(n)}" y1="${big ? 76 : 83}" x2="${X(n)}" y2="${big ? 104 : 97}" stroke="#495057" stroke-width="${big ? 4 : 2}"/>`;
    s += `<text x="${X(n)}" y="${big ? 132 : 125}" font-size="${big ? 20 : 14}" font-weight="${big ? 900 : 700}" text-anchor="middle" fill="${big ? '#1d1442' : '#495057'}">${n}</text>`;
  }
  if (st >= 2) s += `<text x="${X(44)}" y="66" font-size="15" font-weight="800" text-anchor="middle" fill="#e03131">→ 40</text><text x="${X(55)}" y="66" font-size="15" font-weight="800" text-anchor="middle" fill="#e03131">→ 60</text>`;
  if (st >= 3) s += `<path d="M${X(45) - 10},50 v-10 H${X(54) + 10} v10" fill="none" stroke="#2b8a3e" stroke-width="3"/><text x="${X(49.5)}" y="28" font-size="19" font-weight="900" text-anchor="middle" fill="#2b8a3e">10 números</text>`;
  return s;
}
function movil(st) {         // hanging mobile ■ ● ● ■ ; st 1: the two ■● pairs boxed · 2: each box labelled 320 g
  const sq = x => `<rect x="${x - 24}" y="150" width="48" height="48" rx="4" fill="#4dabf7" stroke="#1d1442" stroke-width="3"/>`;
  const ci = x => `<circle cx="${x}" cy="174" r="25" fill="#ff8787" stroke="#1d1442" stroke-width="3"/>`;
  const th = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#495057" stroke-width="2.5"/>`;
  let s = th(300, 0, 300, 40) + `<rect x="140" y="38" width="320" height="8" rx="4" fill="#868e96"/>` + th(150, 46, 150, 92) + th(450, 46, 450, 92);
  s += `<rect x="80" y="90" width="140" height="7" rx="3" fill="#868e96"/><rect x="380" y="90" width="140" height="7" rx="3" fill="#868e96"/>`;
  s += th(90, 97, 90, 150) + th(210, 97, 210, 149) + th(390, 97, 390, 149) + th(510, 97, 510, 150);
  s += sq(90) + ci(210) + ci(390) + sq(510);
  if (st >= 1) s += `<rect x="55" y="80" width="190" height="135" rx="16" fill="none" stroke="#f08c00" stroke-width="4" stroke-dasharray="10 7"/><rect x="355" y="80" width="190" height="135" rx="16" fill="none" stroke="#f08c00" stroke-width="4" stroke-dasharray="10 7"/>`;
  if (st >= 2) s += `<text x="150" y="250" font-size="27" font-weight="900" text-anchor="middle" fill="#e8590c">320 g</text><text x="450" y="250" font-size="27" font-weight="900" text-anchor="middle" fill="#e8590c">320 g</text>`;
  return s;
}
function areas(st) {         // 37 × 25 (blue) and 63 × 25 (orange) as rectangles; st 1: pushed together into 100 × 25
  const k = 4.6, gap = st ? 0 : 24, y = 50, h = 100, x0 = 50, w1 = 37 * k, w2 = 63 * k;
  let s = `<text x="${x0 - 10}" y="${y + h / 2 + 8}" font-size="22" font-weight="900" text-anchor="end" fill="#1d1442">25</text>`;
  s += `<rect x="${x0}" y="${y}" width="${w1}" height="${h}" fill="#a5d8ff" stroke="#1d1442" stroke-width="3"/><text x="${x0 + w1 / 2}" y="${y + h / 2 + 8}" font-size="20" font-weight="900" text-anchor="middle" fill="#1d1442">37 × 25</text>`;
  s += `<rect x="${x0 + w1 + gap}" y="${y}" width="${w2}" height="${h}" fill="#ffd8a8" stroke="#1d1442" stroke-width="3"/><text x="${x0 + w1 + gap + w2 / 2}" y="${y + h / 2 + 8}" font-size="20" font-weight="900" text-anchor="middle" fill="#1d1442">63 × 25</text>`;
  if (!st) s += `<text x="${x0 + w1 / 2}" y="${y - 14}" font-size="18" font-weight="800" text-anchor="middle" fill="#1971c2">37</text><text x="${x0 + w1 + gap + w2 / 2}" y="${y - 14}" font-size="18" font-weight="800" text-anchor="middle" fill="#e8590c">63</text>`;
  else s += `<path d="M${x0},${y - 10} v-10 H${x0 + w1 + w2} v10" fill="none" stroke="#2b8a3e" stroke-width="3"/><text x="${x0 + (w1 + w2) / 2}" y="${y - 28}" font-size="20" font-weight="900" text-anchor="middle" fill="#2b8a3e">37 + 63 = 100</text>`;
  return s;
}
function arbol(n) {          // the secret spreading: Nora on top, then n levels of 3, 9, 27 people
  const L = [[300], [100, 300, 500]];
  L.push(R(0, 8).map(i => 40 + i * 65)); L.push(R(0, 26).map(i => 14 + i * 21.7));
  const Y = [28, 95, 165, 228], rr = [20, 17, 13, 7];
  let s = '';
  for (let l = 1; l <= n; l++) L[l].forEach((x, i) => { s += `<line x1="${L[l - 1][Math.floor(i / 3)]}" y1="${Y[l - 1]}" x2="${x}" y2="${Y[l]}" stroke="#adb5bd" stroke-width="2"/>`; });
  for (let l = 0; l <= n; l++) L[l].forEach(x => { s += `<circle cx="${x}" cy="${Y[l]}" r="${rr[l]}" fill="${['#ffd43b', '#a5d8ff', '#b2f2bb', '#ffc9c9'][l]}" stroke="#1d1442" stroke-width="2"/>`; });
  s += em('👧', 300, 28, 26);
  return s;
}
function platos(per, extra, miss) { // 3 plates with `per` cookies each; `extra` loose cookies on the right; miss: last cookie of the last plate is missing (dashed)
  let s = '';
  for (let p = 0; p < 3; p++) {
    const cx = (extra ? 80 : 145) + p * 155;
    s += `<ellipse cx="${cx}" cy="110" rx="70" ry="22" fill="#f1f3f5" stroke="#868e96" stroke-width="3"/>`;
    for (let c = 0; c < per; c++) {
      const x = cx - (per - 1) * 15 + c * 30;
      if (miss && p === 2 && c === per - 1) s += `<circle cx="${x}" cy="92" r="14" fill="none" stroke="#e03131" stroke-width="3" stroke-dasharray="5 4"/><text x="${x}" y="68" font-size="18" font-weight="900" text-anchor="middle" fill="#e03131">?</text>`;
      else s += em('🍪', x, 92, 30);
    }
    s += em('🧒', cx, 150, 30);
  }
  if (extra) { s += `<text x="555" y="58" font-size="15" font-weight="800" text-anchor="middle" fill="#2b8a3e">sobran</text>`; for (let e = 0; e < extra; e++) s += em('🍪', 540 + e * 30 - (extra - 1) * 0, 92, 30); }
  return s;
}
const huT = v => ({ v, m: `Comprueba: empieza con ${v} €, gasta **la mitad** y luego **4 €**. ¿Te quedan justo 6 €?` });
const gaT = v => ({ v, m: `Comprueba con ${v} galletas: al dar 3 a cada nieto, ¿sobran justo 2? Y al dar 4, ¿falta justo 1?` });
window.OL_BANK = [
// ===================== NIVEL 1 · Pensador principiante =====================
{ id: 'calcetines', level: 1, emoji: '🧦', title: 'Calcetines a oscuras', cat: 'Pensar en el peor caso',
  q: 'En tu cajón hay **10 calcetines rojos** y **10 calcetines azules**, todos mezclados. Se ha ido la luz y no ves nada. 🌑\n\n¿Cuántos calcetines tienes que sacar, **como mínimo**, para estar **completamente seguro** de tener dos del mismo color?',
  ask: '¿Cuántos calcetines?', ph: 'Un número', ans: { num: 3 },
  traps: [{ v: 2, m: '¿Y si te sale uno rojo y uno azul? Con esa cantidad no estás <b>seguro</b>.' }, { v: 11, m: 'Con esos seguro que tienes pareja… pero buscamos el <b>mínimo</b>. ¿Te hacen falta tantos?' }, { v: 20, m: 'Seguro que sí… pero buscamos el <b>mínimo</b>.' }, { v: 21, m: 'Solo hay 20 calcetines. ¡Y buscamos el mínimo!' }, { v: 12, m: 'No hace falta que sean rojos (ni azules): basta con <b>dos del mismo color</b>, el que sea.' }],
  why: '¿Por qué no te hacen falta más?',
  hints: ['No pienses en la suerte: piensa en la **peor suerte** posible. ¿Qué es lo peor que te puede pasar al ir sacando calcetines?',
    'Solo hay **dos colores**. ¿Cuántos calcetines puedes sacar, como mucho, **sin** tener todavía ninguna pareja?',
    'Imagina lo peor: el primero es rojo y el segundo es azul. Todavía no tienes pareja. ¿De qué colores puede ser el siguiente?',
    'Con 2 calcetines puedes tener uno de cada color. El siguiente **tiene** que ser rojo o azul… y ya tienes uno de ese color fuera. ¿Cuántos has sacado en total?'],
  answer: '3 calcetines', idea: 'Piensa en el **peor caso**: con 2 colores, al sacar 3 calcetines dos tienen que repetir color. ¡Da igual que haya 10 o 1000 de cada!',
  steps: ['El número de calcetines de cada color (10) es una **trampa**: no importa.', 'Peor caso: 1.º rojo, 2.º azul → todavía no hay pareja.', 'El 3.º es rojo o azul → seguro que hace pareja con uno de los dos.', 'Respuesta: **3**. Es el **principio del palomar**: si hay más calcetines que colores, algún color se repite.'],
  film: [
    { clear: true, say: 'Tenemos un cajón con diez calcetines rojos y diez azules, todos mezclados. Y está todo a oscuras.', show: [{ t: 'h', x: '🧦 Calcetines a oscuras' }, { t: 'row', items: [RS, BS, RS, RS, BS, RS, BS, BS, RS, BS], gap: 70 }] },
    { say: 'La pregunta es: ¿cuántos tengo que sacar, como mínimo, para estar completamente seguro de tener dos del mismo color?', show: [{ t: 'p', x: '¿Cuántos sacar para estar **SEGURO** de tener una pareja?' }] },
    { clear: true, say: 'El truco de los detectives es pensar en la peor suerte posible. No en lo que suele pasar: en lo peor.', show: [{ t: 'h', x: 'Pensemos en la PEOR suerte 😈' }] },
    { say: 'Saco el primero: es rojo. Claro, con uno solo todavía no tengo pareja.', show: [{ t: 'row', k: 'm', label: 'Saco:', items: [RS] }] },
    { say: 'Saco el segundo y, con mala suerte, es azul. Uno de cada color. ¡Todavía nada!', show: [{ t: 'row', k: 'm', label: 'Saco:', items: [RS, BS] }] },
    { say: 'Ahora saco el tercero. ¿De qué color puede ser? Solo hay dos colores…', show: [{ t: 'row', k: 'm', label: 'Saco:', items: [RS, BS, '!❓'] }] },
    { say: 'Si es rojo, hace pareja con el rojo. Si es azul, hace pareja con el azul. ¡Pase lo que pase, ya tengo pareja!', show: [{ t: 'cols', items: [{ t: 'row', items: ['!' + RS, BS, '!' + RS] }, { t: 'row', items: [RS, '!' + BS, '!' + BS] }] }] },
    { say: 'Así que con tres calcetines estoy seguro. Y fíjate: daba igual que hubiera diez o mil de cada color.', show: [{ t: 'ans', x: '3 calcetines' }] },
    { say: 'Esta idea se llama el principio del palomar: si hay más palomas que agujeros, en algún agujero tiene que haber dos palomas.', show: [{ t: 'idea', x: '**Principio del palomar**: más calcetines que colores → algún color se repite.' }] },
  ] },

{ id: 'nueves', level: 1, emoji: '9️⃣', title: 'La cifra traviesa', cat: 'Contar con orden',
  q: 'Escribes en una hoja **todos los números del 1 al 100**: 1, 2, 3, 4… hasta el 100.\n\n¿Cuántas veces escribes la **cifra 9**?',
  ask: '¿Cuántas veces?', ph: 'Un número', ans: { num: 20 },
  traps: [{ v: 10, m: 'Has encontrado un grupo de nueves… ¡pero hay nueves escondidos en otro sitio!' }, { v: 11, m: 'Casi. ¿Has mirado bien todos los números de los noventa?' }, { v: 19, m: '¡Muy cerca! ¿Hay algún número que tenga <b>dos</b> nueves?' }, { v: 18, m: 'Cerca. Revisa los noventa, uno por uno.' }],
  hints: ['No cuentes número a número: separa los nueves en **grupos**.',
    'Un 9 puede estar en el lugar de las **unidades** o en el lugar de las **decenas**.',
    'Cuenta primero los números que **terminan** en 9 (9, 19, 29…). Luego los que **empiezan** por 9 (90, 91…).',
    'Terminan en 9: 9, 19, 29, 39, 49, 59, 69, 79, 89, 99 → 10 nueves. Empiezan por 9: del 90 al 99 → otros 10. El 99 está en las dos listas: ¿cuántos nueves escribes al escribir el 99?'],
  answer: '20 veces', idea: 'Cuenta **por posiciones**: los nueves de las unidades y los de las decenas, por separado. El 99 tiene dos nueves y cuenta dos veces.',
  steps: ['Nueves en las **unidades**: 9, 19, 29, …, 99 → **10**.', 'Nueves en las **decenas**: 90, 91, …, 99 → **10**.', 'El 99 sale en las dos listas, y está bien: ¡tiene dos nueves!', 'Total: 10 + 10 = **20**.'],
  film: [
    { clear: true, say: 'Escribimos todos los números del uno al cien. ¿Cuántas veces aparece la cifra nueve?', show: [{ t: 'grid', k: 'g', n: 100, cols: 10, stagger: 6 }] },
    { say: 'Primero, los nueves que están en el lugar de las unidades: el nueve, el diecinueve, el veintinueve… hasta el noventa y nueve. Una columna entera: diez nueves.', show: [{ t: 'grid', k: 'g', n: 100, cols: 10, hl: R(9, 99, 10) }, { t: 'p', k: 'a', x: '🟨 Unidades: **10** nueves' }] },
    { say: 'Ahora, los nueves que están en el lugar de las decenas: del noventa al noventa y nueve. Una fila entera: otros diez.', show: [{ t: 'grid', k: 'g', n: 100, cols: 10, hl: R(9, 99, 10), hl2: R(90, 99) }, { t: 'p', k: 'a', x: '🟨 Unidades: **10** · 🟦 Decenas: **10**' }] },
    { say: '¿Y el noventa y nueve? Está en las dos listas. Pero eso está bien, porque se escribe con dos nueves.', show: [{ t: 'eq', x: '9**9** → ¡dos nueves!' }] },
    { clear: true, say: 'Así que en total escribimos diez más diez: veinte nueves. La trampa era decir diez u once.', show: [{ t: 'ans', x: '10 + 10 = 20' }] },
    { say: 'La idea clave: contar por posiciones. Primero las unidades, luego las decenas. Con orden, no se escapa ninguno.', show: [{ t: 'idea', x: 'Cuenta **por posiciones**: unidades y decenas por separado.' }] },
  ] },

{ id: 'caracol', level: 1, emoji: '🐌', title: 'El caracol en el pozo', cat: 'Cuidado con el último paso',
  q: 'Un caracol está en el **fondo de un pozo de 10 metros**. Cada **día** sube **3 metros**, pero cada **noche**, mientras duerme, resbala **2 metros** hacia abajo.\n\nEmpieza a subir el día 1 por la mañana. ¿Qué **día** consigue salir del pozo?',
  ask: '¿Qué día sale?', ph: 'Por ejemplo: día 12', ans: { num: 8 },
  traps: [{ v: 10, m: 'Gana 1 metro cada día completo, sí… pero ¿qué pasa el último día, cuando llega arriba? ¿Resbala?' }, { v: 9, m: 'Cerca. Haz una tabla día a día y mira cuándo toca los 10 metros.' }, { v: 7, m: '¿Dónde está el caracol al final del día 7? ¿Ya ha llegado a 10?' }],
  why: '¿Por qué no son 10 días?',
  hints: ['Ve **día a día**. Apunta dónde está el caracol al final de cada día y al final de cada noche.',
    'Cada día con su noche avanza 3 − 2 = 1 metro. Pero… ¿pasa lo mismo el **último** día?',
    'Cuando el caracol llega arriba **durante el día**, ya ha salido: esa noche no resbala. ¿A qué altura tiene que estar por la mañana para salir ese mismo día?',
    'Para salir subiendo 3 m, por la mañana tiene que estar a 7 m. Cada día completo gana 1 m: ¿qué mañana empieza a 7 m?'],
  answer: 'El día 8', idea: 'El **último día es diferente**: cuando llega arriba ya no resbala. No todo funciona igual hasta el final.',
  steps: ['Cada día completo (sube 3, baja 2) gana **1 metro**.', 'Pero el último día no resbala: en cuanto toca los 10 m, sale.', 'Para salir, por la mañana tiene que estar a **7 m** (7 + 3 = 10).', 'Tras 7 días completos está a 7 m. El **día 8** sube 3 → ¡10 m, fuera! La trampa era decir 10.'],
  film: [
    { clear: true, say: 'Nuestro caracol está en el fondo de un pozo de diez metros.', show: [{ t: 'svg', k: 'w', vb: '0 -40 320 370', h: '78%', x: well(0) }] },
    { say: 'El día uno sube tres metros. Pero por la noche resbala dos. Así que a la mañana siguiente, la del día dos, empieza solo a un metro.', show: [{ t: 'svg', k: 'w', vb: '0 -40 320 370', h: '78%', x: well(1) }] },
    { clear: true, say: 'Cada día completo gana un metro. Parece fácil: diez metros, diez días. Pero… ¡cuidado!', show: [{ t: 'eq', x: '+3 − 2 = **+1** metro al día' }, { t: 'p', x: '¿10 metros → 10 días? 🤔' }] },
    { clear: true, say: 'Hagamos la tabla. Por la tarde, después de subir, y por la noche, después de resbalar.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Día', 'Tarde (sube)', 'Noche (resbala)'], [1, '3 m', '1 m'], [2, '4 m', '2 m'], [3, '5 m', '3 m']] }] },
    { say: 'Seguimos igual… y el día siete, por la noche, está a siete metros.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Día', 'Tarde (sube)', 'Noche (resbala)'], [1, '3 m', '1 m'], [2, '4 m', '2 m'], ['…', '…', '…'], [7, '9 m', '!7 m']] }] },
    { say: 'El día ocho sube tres metros: siete más tres, ¡diez! Llega arriba y sale. Esa noche ya no resbala, porque ya no está en el pozo.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Día', 'Tarde (sube)', 'Noche (resbala)'], [1, '3 m', '1 m'], [2, '4 m', '2 m'], ['…', '…', '…'], [7, '9 m', '7 m'], ['!8', '!10 m 🎉', '¡fuera!']] }] },
    { clear: true, say: '¡Fuera! El caracol sale el día ocho, no el diez.', show: [{ t: 'svg', vb: '0 -40 320 370', h: '62%', x: well(10, true) }, { t: 'ans', x: '¡El día 8!' }] },
    { clear: true, say: 'La idea clave: el último día es diferente. Cuando algo se repite, revisa siempre si el final también se repite.', show: [{ t: 'ans', x: '¡El día 8!' }, { t: 'idea', x: 'El **último paso** es diferente: al llegar arriba ya no resbala.' }] },
  ] },

{ id: 'cortes', level: 1, emoji: '🪚', title: 'La barra del carpintero', cat: 'Contar los huecos',
  q: 'Un carpintero tiene una barra de madera larga. Cada **corte** le lleva **3 minutos**. Hace los cortes de uno en uno (no junta trozos para cortarlos a la vez).\n\n¿Cuántos **minutos** tarda en cortar la barra en **6 trozos**?',
  ask: '¿Cuántos minutos?', ph: 'Un número', ans: { num: 15 },
  traps: [{ v: 18, m: '¿Cuántos <b>cortes</b> hacen falta de verdad para tener 6 trozos? Haz un dibujo.' }, { v: 6, m: 'Esos son los trozos. ¿Y el tiempo?' }, { v: 2, m: '¿Cuántos cortes haces?' }],
  hints: ['Haz un **dibujo** de la barra. ¿Qué cuenta el reloj: los trozos o los cortes?',
    'Prueba con números pequeños: para tener **2 trozos**, ¿cuántos cortes haces?',
    'Con 1 corte → 2 trozos. Con 2 cortes → 3 trozos. ¿Ves la relación entre cortes y trozos?',
    'Siempre hay **un trozo más** que cortes. Para 6 trozos hacen falta 5 cortes. ¿Cuántos minutos son?'],
  answer: '15 minutos', idea: 'Los cortes son los **huecos entre trozos**: siempre hay **uno menos** que trozos.',
  steps: ['Lo que cuesta tiempo son los **cortes**, no los trozos.', 'Con 1 corte salen 2 trozos; con 2 cortes, 3 trozos: siempre **un trozo más** que cortes.', 'Para 6 trozos → **5 cortes**.', '5 × 3 = **15 minutos** (no 6 × 3 = 18).'],
  film: [
    { clear: true, say: 'Esta es la barra del carpintero. Cada corte le lleva tres minutos.', show: [{ t: 'h', x: '🪚 La barra del carpintero' }, { t: 'svg', k: 'b', vb: '0 0 600 120', h: '22%', x: bar(0) }] },
    { say: 'Lo fácil es pensar: seis trozos, seis por tres, dieciocho minutos. Pero el reloj no cuenta trozos. ¡Cuenta cortes!', show: [{ t: 'eq', k: 'e', x: '6 × 3 = 18? 🤔' }] },
    { say: 'Con un corte, la barra queda en dos trozos.', show: [{ t: 'svg', k: 'b', vb: '0 0 600 120', h: '22%', x: bar(1) }, { t: 'eq', k: 'e', x: '1 corte → 2 trozos' }] },
    { say: 'Con dos cortes, tres trozos. Siempre hay un trozo más que cortes.', show: [{ t: 'svg', k: 'b', vb: '0 0 600 120', h: '22%', x: bar(2) }, { t: 'eq', k: 'e', x: '2 cortes → 3 trozos' }] },
    { say: 'Así que para tener seis trozos solo hacen falta cinco cortes. ¡Cuéntalos!', show: [{ t: 'svg', k: 'b', vb: '0 0 600 120', h: '22%', x: bar(5) }, { t: 'eq', k: 'e', x: '**5 cortes** → 6 trozos' }] },
    { say: 'Cinco cortes por tres minutos: quince minutos.', show: [{ t: 'ans', x: '5 × 3 = 15 minutos' }] },
    { say: 'La idea clave: los cortes son los huecos entre los trozos, y siempre hay un hueco menos que trozos. Pasa lo mismo con los árboles de una calle o los postes de una valla.', show: [{ t: 'idea', x: 'Huecos entre trozos = trozos **− 1**.' }] },
  ] },

{ id: 'estanque', level: 1, emoji: '🪷', title: 'Los nenúfares', cat: 'Pensar hacia atrás',
  q: 'En un estanque crecen nenúfares. **Cada día ocupan el doble** de sitio que el día anterior. El **día 20** cubren el estanque **entero**.\n\n¿Qué día cubrían **la mitad** del estanque?',
  ask: '¿Qué día?', ph: 'Por ejemplo: día 3', ans: { num: 19 },
  traps: [{ v: 10, m: '¡Esa es la respuesta que parece obvia! Si cada día se doblan, ¿qué pasa entre el día de la mitad y el día siguiente?' }, { v: 18, m: 'El día 18 cubrían menos de la mitad. Mira el día de después.' }],
  hints: ['No empieces por el día 1. Empieza por el **final**: el día 20.',
    'Si cada día ocupan el doble, ¿qué parte ocupaban el **día antes** de cubrirlo todo?',
    'El doble de la mitad es… el estanque entero.',
    'El día 20 está lleno. Un día antes ocupaban justo la mitad, porque la mitad × 2 = todo. ¿Qué día es «un día antes» del 20?'],
  answer: 'El día 19', idea: '**Piensa hacia atrás**: desde el final, cada día hacia atrás es la mitad.',
  steps: ['Empezamos por el final: el **día 20** está lleno.', 'Cada día se doblan, así que el día anterior ocupaban la **mitad**.', 'Día 19 → **la mitad**. (Día 18 → un cuarto…)', 'La trampa era decir 10: crecer «el doble» no es crecer «lo mismo cada día».'],
  film: [
    { clear: true, say: 'El día veinte, los nenúfares cubren el estanque entero.', show: [{ t: 'svg', k: 'p', vb: '0 0 560 230', h: '55%', x: pond(1, 20) }] },
    { say: 'Muchos piensan: la mitad de veinte es diez, así que el día diez. ¡Pero cuidado!', show: [{ t: 'eq', k: 'e', x: '20 : 2 = 10? 🤔' }] },
    { say: 'Vamos hacia atrás. Cada día ocupan el doble que el día anterior. Así que el día anterior ocupaban… la mitad.', show: [{ t: 'svg', k: 'p', vb: '0 0 560 230', h: '55%', x: pond(.5, 19) }, { t: 'eq', k: 'e', x: 'Día 19 → **la mitad**' }] },
    { say: 'Y un día antes, el dieciocho, la mitad de la mitad: un cuarto.', show: [{ t: 'svg', k: 'p', vb: '0 0 560 230', h: '55%', x: pond(.25, 18) }, { t: 'eq', k: 'e', x: 'Día 18 → **un cuarto**' }] },
    { clear: true, say: 'Así que la mitad del estanque la cubrían el día diecinueve. ¡Solo un día antes del final!', show: [{ t: 'ans', x: 'El día 19' }] },
    { say: 'La idea clave: a veces es más fácil pensar hacia atrás, empezando por el final.', show: [{ t: 'idea', x: '**Piensa hacia atrás**: un día antes, la mitad.' }] },
  ] },

{ id: 'gatos', level: 1, emoji: '🐈', title: 'Gatos cazadores', cat: 'Reducir a uno',
  q: '**5 gatos** cazan **5 ratones** en **5 minutos**. Todos los gatos cazan igual de rápido.\n\n¿Cuántos gatos hacen falta para cazar **100 ratones** en **100 minutos**?',
  ask: '¿Cuántos gatos?', ph: 'Un número', ans: { num: 5 },
  traps: [{ v: 100, m: '¡Ese es el número que «suena bien»! Piensa: ¿cuánto tarda <b>un</b> gato en cazar <b>un</b> ratón?' }, { v: 20, m: 'Mira bien: en 100 minutos, ¿cuántos ratones caza un solo gato?' }, { v: 1, m: '¿Un solo gato puede cazar 100 ratones en 100 minutos? Calcula cuántos caza.' }],
  why: '¿Por qué no hacen falta 100 gatos?',
  hints: ['Tres cincos y tres cienes… ¡no te dejes llevar por la música de los números!',
    'Piensa en **un solo gato**. Si los 5 cazan a la vez, ¿cuánto tarda cada gato en cazar su ratón?',
    'Cada gato caza 1 ratón cada 5 minutos. ¿Cuántos ratones caza un gato en 100 minutos?',
    'Un gato caza 100 : 5 = 20 ratones en 100 minutos. ¿Cuántos gatos necesitas para llegar a 100 ratones?'],
  answer: '5 gatos', idea: '**Reduce a uno**: un gato caza un ratón cada 5 minutos.',
  steps: ['5 gatos, 5 ratones, 5 minutos → cada gato caza **1 ratón en 5 minutos**.', 'En 100 minutos, un gato caza 100 : 5 = **20 ratones**.', 'Para 100 ratones: 100 : 20 = **5 gatos**.', 'La trampa era decir 100: los números «riman», pero la cuenta no.'],
  film: [
    { clear: true, say: 'Cinco gatos cazan cinco ratones en cinco minutos.', show: [{ t: 'row', items: ['🐈', '🐈', '🐈', '🐈', '🐈'] }, { t: 'row', items: ['🐭', '🐭', '🐭', '🐭', '🐭'] }, { t: 'p', x: '⏱️ 5 minutos' }] },
    { say: 'Si cazan todos a la vez, cada gato caza su ratón. Un gato, un ratón, cinco minutos.', show: [{ t: 'eq', x: '1 🐈 → 1 🐭 cada **5 minutos**' }] },
    { clear: true, say: 'En cien minutos hay veinte veces cinco minutos. Así que un solo gato caza veinte ratones.', show: [{ t: 'eq', x: '100 : 5 = **20** ratones por gato' }, { t: 'row', sm: true, label: '1 🐈:', items: Array(20).fill('🐭'), gap: 40 }] },
    { say: 'Queremos cien ratones. Cada gato caza veinte. Veinte, cuarenta, sesenta, ochenta, cien: ¡cinco gatos!', show: [{ t: 'eq', x: '100 : 20 = **5** gatos' }] },
    { say: 'Los mismos cinco gatos de antes. La trampa era decir cien.', show: [{ t: 'ans', x: '5 gatos' }] },
    { say: 'La idea clave: reduce a uno. Primero averigua lo que hace un solo gato, y luego multiplica.', show: [{ t: 'idea', x: '**Reduce a uno**: ¿qué hace UN gato en UN minuto?' }] },
  ] },

// ===================== NIVEL 2 · Detective matemático =====================
{ id: 'gauss', qSay: 'Cuentan que a un niño llamado Carl Gauss su maestro le mandó sumar todos los números del uno al cien para tenerlo ocupado, y lo hizo en un minuto. Ahora te toca a ti. ¿Cuánto es uno más dos más tres más cuatro, y así hasta cuarenta y nueve más cincuenta?', level: 2, emoji: '➕', title: 'El truco del pequeño Gauss', cat: 'Emparejar',
  q: 'Cuentan que a un niño llamado **Carl Gauss** su maestro le mandó sumar todos los números del 1 al 100 para tenerlo ocupado… ¡y lo hizo en un minuto!\n\nAhora te toca a ti. ¿Cuánto es\n**1 + 2 + 3 + 4 + … + 49 + 50**?',
  ask: '¿Cuánto da la suma?', ph: 'Un número', ans: { num: 1275 },
  traps: [{ v: 2550, m: '¡Casi! ¿Cuántas parejas salen de verdad con 50 números?' }, { v: 1250, m: 'Revisa cuánto suma cada pareja.' }, { v: 1300, m: 'Revisa cuánto suma cada pareja.' }, { v: 5050, m: 'Esa es la suma hasta el 100, la de Gauss. Aquí solo llegamos hasta el 50.' }],
  why: '¿Cómo lo has hecho tan rápido?',
  hints: ['Sumar uno a uno es muy largo. ¿Puedes juntar los números en **parejas** que sumen lo mismo?',
    'Junta el primero con el último: 1 + 50. Y el segundo con el penúltimo: 2 + 49…',
    'Todas las parejas suman **51**. ¿Cuántas parejas hay con 50 números?',
    'Hay 25 parejas y cada una suma 51. Solo falta multiplicar 25 × 51.'],
  answer: '1275', idea: '**Emparejar** el primero con el último: todas las parejas suman lo mismo.',
  steps: ['1 + 50 = 51, 2 + 49 = 51, 3 + 48 = 51… **todas las parejas suman 51**.', 'Con 50 números salen 50 : 2 = **25 parejas**.', '25 × 51 = 25 × 50 + 25 = 1250 + 25 = **1275**.'],
  film: [
    { clear: true, say: 'Queremos sumar todos los números del uno al cincuenta. Uno a uno tardaríamos muchísimo.', show: [{ t: 'h', x: '1 + 2 + 3 + … + 49 + 50' }, { t: 'row', sm: true, items: [...R(1, 8), '…', ...R(43, 50)], gap: 50 }] },
    { say: 'El truco de Gauss: juntar el primero con el último. Uno más cincuenta: cincuenta y uno.', show: [{ t: 'row', k: 'r', sm: true, items: ['!1', ...R(2, 8), '…', ...R(43, 49), '!50'], gap: 0 }, { t: 'eq', k: 'e1', x: '1 + 50 = **51**' }] },
    { say: 'El segundo con el penúltimo: dos más cuarenta y nueve… ¡otra vez cincuenta y uno!', show: [{ t: 'row', k: 'r', sm: true, items: ['~1', '!2', ...R(3, 8), '…', ...R(43, 48), '!49', '~50'], gap: 0 }, { t: 'eq', k: 'e2', x: '2 + 49 = **51**' }] },
    { say: 'Tres más cuarenta y ocho, también. Si el número de la izquierda sube uno y el de la derecha baja uno, la suma no cambia.', show: [{ t: 'eq', k: 'e3', x: '3 + 48 = **51**   …   25 + 26 = **51**' }] },
    { clear: true, say: '¿Cuántas parejas hay? Cincuenta números, de dos en dos: veinticinco parejas.', show: [{ t: 'eq', x: '50 : 2 = **25** parejas' }] },
    { say: 'Veinticinco parejas de cincuenta y uno. Veinticinco por cincuenta son mil doscientos cincuenta, y veinticinco más: mil doscientos setenta y cinco.', show: [{ t: 'eq', x: '25 × 51 = 1250 + 25' }, { t: 'ans', x: '1275' }] },
    { say: 'La idea clave: emparejar. Cuando los números suben de uno en uno, el primero y el último siempre suman lo mismo que el segundo y el penúltimo.', show: [{ t: 'idea', x: '**Empareja** el primero con el último: todas las parejas suman igual.' }] },
  ] },

{ id: 'misterioso', level: 2, emoji: '🕵️', title: 'El número misterioso', cat: 'Lista y descarta',
  q: 'Soy un **número de dos cifras**.\n• Mis dos cifras suman **9**.\n• Si le das la vuelta a mis cifras, el número nuevo es **27 más** que yo.\n\n¿Quién soy?',
  ask: '¿Qué número soy?', ph: 'Un número de dos cifras', ans: { num: 36 },
  traps: [{ v: 63, m: '¡Al revés! Si le das la vuelta a ese número, ¿se hace más grande o más pequeño?' }, { v: 27, m: 'Dale la vuelta al 27 y resta: ¿sale 27?' }, { v: 45, m: 'Comprueba: 54 − 45 = ?' }, { v: 18, m: 'Comprueba: 81 − 18 = ?' }],
  hints: ['Haz una **lista** de todos los números de dos cifras cuyas cifras suman 9. ¡No son tantos!',
    'La lista es: 18, 27, 36, 45, 54, 63, 72, 81, 90. Ahora usa la segunda pista con cada uno.',
    'Para que al darle la vuelta sea **más grande**, la cifra de las unidades tiene que ser mayor que la de las decenas. Eso deja solo 18, 27, 36 y 45.',
    'Prueba: 81 − 18 = 63, 72 − 27 = 45… Sigue con 36 y con 45.'],
  answer: '36', idea: '**Haz una lista ordenada** de candidatos y ve tachando con cada pista. Detective puro.',
  steps: ['Cifras que suman 9: 18, 27, 36, 45, 54, 63, 72, 81, 90.', 'Al darle la vuelta tiene que crecer → solo 18, 27, 36, 45.', '81 − 18 = 63 ✗ · 72 − 27 = 45 ✗ · **63 − 36 = 27 ✓** · 54 − 45 = 9 ✗.', 'El número misterioso es **36**.'],
  film: [
    { clear: true, say: 'Un detective no adivina: hace una lista de sospechosos. ¿Qué números de dos cifras tienen cifras que suman nueve?', show: [{ t: 'h', x: '🕵️ Los sospechosos' }, { t: 'row', k: 'r', items: [18, 27, 36, 45, 54, 63, 72, 81, 90], gap: 120 }] },
    { say: 'Segunda pista: al darle la vuelta, el número crece. Así que la cifra de las unidades tiene que ser mayor. Tachamos los demás.', show: [{ t: 'row', k: 'r', items: [18, 27, 36, 45, '~54', '~63', '~72', '~81', '~90'] }] },
    { clear: true, say: 'Quedan cuatro sospechosos. Los interrogamos uno a uno. Ochenta y uno menos dieciocho: sesenta y tres. No es veintisiete.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Número', 'Al revés', 'Diferencia'], [18, 81, '63 ✗']] }] },
    { say: 'Setenta y dos menos veintisiete: cuarenta y cinco. Tampoco.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Número', 'Al revés', 'Diferencia'], [18, 81, '63 ✗'], [27, 72, '45 ✗']] }] },
    { say: 'Sesenta y tres menos treinta y seis: ¡veintisiete! Y cincuenta y cuatro menos cuarenta y cinco da nueve: descartado.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Número', 'Al revés', 'Diferencia'], [18, 81, '63 ✗'], [27, 72, '45 ✗'], ['!36', '!63', '!27 ✓'], [45, 54, '9 ✗']] }] },
    { clear: true, say: 'Comprobamos: tres más seis, nueve. Sesenta y tres menos treinta y seis, veintisiete. ¡Caso resuelto!', show: [{ t: 'ans', x: '36' }, { t: 'idea', x: '**Lista ordenada** de candidatos + tachar con cada pista.' }] },
  ] },

{ id: 'apretones', level: 2, emoji: '🤝', title: 'Apretones de manos', cat: 'Contar sin repetir',
  q: 'En una fiesta hay **6 amigos**. **Cada dos amigos** se dan la mano **una sola vez**.\n\n¿Cuántos apretones de manos hay en total?',
  ask: '¿Cuántos apretones?', ph: 'Un número', ans: { num: 15 },
  traps: [{ v: 30, m: 'Cuando Ana da la mano a Bruno, Bruno también da la mano a Ana: ¿has contado ese apretón dos veces?' }, { v: 36, m: '¿Se da alguien la mano a sí mismo?' }, { v: 6, m: 'Cada amigo da la mano a varios. Haz un dibujo con 6 puntos.' }, { v: 21, m: 'Cuenta otra vez: con 6 personas, el primero saluda a 5.' }],
  why: '¿Cómo has contado sin repetir?',
  hints: ['**Dibuja** 6 puntos (los amigos) y une con una línea cada apretón.',
    'Ve por orden: el primero da la mano a 5. El segundo ya saludó al primero… ¿a cuántos **nuevos** saluda?',
    'Los apretones nuevos van bajando: 5, 4, 3, …',
    '5 + 4 + 3 + 2 + 1 = ? (o también: 6 × 5 = 30, pero así cada apretón se cuenta **dos veces**).'],
  answer: '15 apretones', idea: 'Cuenta **solo los nuevos** en cada paso, o cuenta todo y **divide entre 2**, porque cada apretón tiene dos manos.',
  steps: ['Ana (A) saluda a 5 · Bruno (B) a 4 nuevos · Carla (C) a 3 · Dani (D) a 2 · Elena (E) a 1 · Fran (F) ya saludó a todos.', '5 + 4 + 3 + 2 + 1 = **15**.', 'Otra forma: cada uno da 5 apretones → 6 × 5 = 30, pero cada apretón tiene **dos** personas → 30 : 2 = **15**.'],
  film: [
    { clear: true, say: 'Seis amigos: Ana, Bruno, Carla, Dani, Elena y Fran. Cada línea será un apretón de manos.', show: [{ t: 'svg', k: 's', vb: '0 0 400 350', h: '72%', x: hexHands(0) }] },
    { say: 'Ana saluda a los otros cinco. Cinco apretones.', show: [{ t: 'svg', k: 's', vb: '0 0 400 350', h: '72%', x: hexHands(5) }, { t: 'eq', k: 'e', x: '5' }] },
    { say: 'Bruno ya ha saludado a Ana. Solo le quedan cuatro nuevos.', show: [{ t: 'svg', k: 's', vb: '0 0 400 350', h: '72%', x: hexHands(9) }, { t: 'eq', k: 'e', x: '5 + 4' }] },
    { say: 'Carla, tres nuevos. Dani, dos. Elena, uno. Y Fran… ya ha saludado a todos.', show: [{ t: 'svg', k: 's', vb: '0 0 400 350', h: '72%', x: hexHands(15) }, { t: 'eq', k: 'e', x: '5 + 4 + 3 + 2 + 1 = **15**' }] },
    { clear: true, say: 'Otra forma de pensarlo: cada amigo da cinco apretones, seis por cinco, treinta. Pero así cada apretón lo contamos dos veces, una por cada mano. Treinta entre dos: quince.', show: [{ t: 'eq', x: '6 × 5 = 30 → 30 : 2 = **15**' }] },
    { say: 'Quince apretones de manos.', show: [{ t: 'ans', x: '15 apretones' }] },
    { say: 'La idea clave: no contar dos veces lo mismo. Cuenta solo los nuevos, o cuenta todo y divide entre dos.', show: [{ t: 'idea', x: 'Cada apretón tiene **dos** manos: no lo cuentes dos veces.' }] },
  ] },

{ id: 'frutas', qSay: 'Cada fruta vale siempre el mismo número. Manzana más plátano es catorce. Plátano más coco es nueve. Manzana más coco es once. ¿Cuánto vale manzana más plátano más coco?', level: 2, emoji: '🍎', title: 'El jeroglífico de las frutas', cat: 'Sumar todas las pistas',
  q: 'Cada fruta vale siempre el mismo número:\n🍎 + 🍌 = **14**\n🍌 + 🥥 = **9**\n🍎 + 🥥 = **11**\n\n¿Cuánto vale **🍎 + 🍌 + 🥥**?',
  ask: '¿Cuánto vale?', ph: 'Un número', ans: { num: 17 },
  traps: [{ v: 34, m: '¡Muy buena idea sumar las tres líneas! Pero mira: ¿cuántas veces aparece cada fruta en esa suma?' }, { v: 25, m: '¿Has sumado solo dos líneas? Prueba con las tres.' }, { v: 23, m: '¿Has sumado solo dos líneas? Prueba con las tres.' }, { v: 20, m: '¿Has sumado solo dos líneas? Prueba con las tres.' }],
  why: '¿Cómo lo has calculado?',
  hints: ['No hace falta saber cuánto vale cada fruta… aunque puedes averiguarlo.',
    'Prueba a **sumar las tres líneas** a la vez.',
    'Si sumas las tres líneas sale 14 + 9 + 11 = 34. ¿Cuántas manzanas, plátanos y cocos hay en esa suma?',
    'En la suma de las tres líneas cada fruta aparece **dos veces**: 34 son dos manzanas, dos plátanos y dos cocos. Tú quieres solo una de cada.'],
  answer: '17', idea: 'Sumar todas las pistas a la vez: cada fruta aparece **dos veces**, así que la mitad es la respuesta.',
  steps: ['Sumamos las tres líneas: 14 + 9 + 11 = **34**.', 'En esa suma cada fruta aparece **dos veces**: 🍎🍎 + 🍌🍌 + 🥥🥥 = 34.', 'Una de cada es la mitad: 34 : 2 = **17**.', 'Comprobación: 🥥 = 17 − 14 = 3, 🍌 = 9 − 3 = 6, 🍎 = 11 − 3 = 8 → 8 + 6 + 3 = 17 ✓. ¡Como los móviles de tu cuaderno: cada pieza cuenta dos veces!'],
  film: [
    { clear: true, say: 'Tres pistas y tres frutas. Podríamos averiguar cuánto vale cada fruta… pero hay un camino más corto.', show: [{ t: 'eq', x: '🍎 + 🍌 = 14' }, { t: 'eq', x: '🍌 + 🥥 = 9' }, { t: 'eq', x: '🍎 + 🥥 = 11' }] },
    { say: 'Sumamos las tres pistas a la vez. Catorce más nueve más once: treinta y cuatro.', show: [{ t: 'eq', x: '14 + 9 + 11 = **34**' }] },
    { clear: true, say: 'Pero mira qué hemos sumado: dos manzanas, dos plátanos y dos cocos. ¡Cada fruta aparece dos veces!', show: [{ t: 'row', items: ['!🍎', '!🍎', '🍌', '🍌', '🥥', '🥥'], gap: 200 }, { t: 'eq', x: '🍎🍎 + 🍌🍌 + 🥥🥥 = 34' }] },
    { say: 'Nosotros queremos solo una de cada. Así que es la mitad: treinta y cuatro entre dos, diecisiete.', show: [{ t: 'eq', x: '🍎 + 🍌 + 🥥 = 34 : 2 = **17**' }] },
    { clear: true, say: 'Comprobamos. Si las tres juntas valen diecisiete, y manzana más plátano es catorce, el coco vale tres. Entonces el plátano vale seis, y la manzana ocho. ¡Encaja!', show: [{ t: 'eq', x: '🥥 = 17 − 14 = **3**' }, { t: 'eq', x: '🍌 = 9 − 3 = **6**' }, { t: 'eq', x: '🍎 = 11 − 3 = **8**' }] },
    { say: 'Diecisiete.', show: [{ t: 'ans', x: '17' }] },
    { clear: true, say: 'La idea clave: a veces sumar todas las pistas a la vez es el atajo. Y cuidado: cada fruta salía dos veces, como las piezas de los móviles de tu cuaderno.', show: [{ t: 'ans', x: '17' }, { t: 'idea', x: '**Suma todas las pistas**: cada fruta sale **dos veces** → la mitad.' }] },
  ] },

{ id: 'calendario', level: 2, emoji: '📅', title: 'Dentro de 100 días', cat: 'El resto de la división',
  q: 'Hoy es **miércoles**. (Mañana es «dentro de 1 día».)\n\n¿Qué **día de la semana** será dentro de **100 días**?',
  ask: '¿Qué día será?', ph: 'Escribe solo el día', ans: { text: ['viernes'], last: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] },
  traps: [{ v: 'jueves', m: 'Revisa la cuenta: ¿cuántos días sobran después de las semanas completas?' }, { v: 'miercoles', m: 'Eso sería si 100 días fueran un número exacto de semanas. ¿Lo son?' }, { v: 'sabado', m: 'Revisa cuántos días sobran: divide 100 entre 7.' }],
  why: '¿Cómo lo has calculado?',
  hints: ['La semana se repite cada **7 días**. ¿Qué día será dentro de 7 días? ¿Y dentro de 14?',
    'Las semanas completas no cambian el día. Solo importan los días que **sobran**.',
    'Divide 100 entre 7: ¿cuál es el **resto**?',
    '100 = 7 × 14 + 2. Las 14 semanas te dejan otra vez en miércoles. Ahora avanza 2 días más.'],
  answer: 'Viernes', idea: 'Los días de la semana dan vueltas cada 7: solo importa el **resto** de dividir entre 7.',
  steps: ['Cada 7 días vuelve a ser miércoles.', '100 : 7 = **14** semanas y **resto 2**.', 'Tras 14 semanas: miércoles. 2 días más: jueves, **viernes**.'],
  film: [
    { clear: true, say: 'Hoy es miércoles. ¿Qué día será dentro de cien días? No hace falta contar cien días en el calendario.', show: [{ t: 'row', k: 'w', items: ['L', 'M', '!X', 'J', 'V', 'S', 'D'] }] },
    { say: 'Dentro de siete días, otra vez miércoles. Dentro de catorce, también. Las semanas completas son vueltas enteras.', show: [{ t: 'p', x: '+7 días → miércoles · +14 días → miércoles 🔁' }] },
    { clear: true, say: '¿Cuántas semanas caben en cien días? Dividimos cien entre siete: catorce semanas, y sobran dos días.', show: [{ t: 'eq', x: '100 = 7 × 14 + **2**' }, { t: 'p', x: 'cociente **14** (vueltas) · resto **2** (días que sobran)' }] },
    { say: 'Las catorce vueltas nos dejan otra vez en miércoles. Y luego avanzamos los dos días que sobran: jueves… viernes.', show: [{ t: 'row', k: 'w', items: ['L', 'M', 'X', '+J', '!V', 'S', 'D'], gap: 250 }] },
    { say: '¡Viernes!', show: [{ t: 'ans', x: 'Viernes' }] },
    { say: 'La idea clave: lo que se repite en vueltas, como los días de la semana, solo depende del resto de la división.', show: [{ t: 'idea', x: 'Vueltas de 7: solo importa el **resto**.' }] },
  ] },

{ id: 'cuadrados', qSay: 'Mira esta cuadrícula de tres por tres casillas. ¿Cuántos cuadrados hay en total? Cuenta todos los cuadrados que se pueden ver, de cualquier tamaño.', level: 2, emoji: '🟩', title: '¿Cuántos cuadrados ves?', cat: 'Contar por tamaños',
  q: 'Mira esta cuadrícula de **3 × 3** casillas.\n\n¿Cuántos **cuadrados** hay en total? Cuenta todos los cuadrados que se pueden ver, **de cualquier tamaño**.',
  pic: `<svg viewBox="0 0 260 260">${grid3()}</svg>`,
  ask: '¿Cuántos cuadrados?', ph: 'Un número', ans: { num: 14 },
  traps: [{ v: 9, m: 'Esos son los pequeños. ¿Hay cuadrados más grandes, formados por varias casillas?' }, { v: 10, m: '¿Solo hay un cuadrado más grande? Busca los de 2 × 2.' }, { v: 11, m: 'Busca bien los de 2 × 2: pueden solaparse.' }, { v: 13, m: '¡Casi! ¿Has contado el cuadrado más grande de todos?' }, { v: 12, m: 'Revisa los de 2 × 2: ¿cuántos hay?' }],
  hints: ['Hay cuadrados de **distintos tamaños**. Cuéntalos por separado.',
    'Tamaños posibles: 1 × 1, 2 × 2 y 3 × 3.',
    'Los de 1 × 1 son 9. El de 3 × 3 es 1. ¿Cuántos de 2 × 2? ¡Se pueden **solapar**!',
    'Un cuadrado de 2 × 2 puede estar arriba a la izquierda, arriba a la derecha, abajo a la izquierda o abajo a la derecha.'],
  answer: '14 cuadrados', idea: 'Cuenta **por tamaños**, y deja que los cuadrados se **solapen**: 9 + 4 + 1 = 14.',
  steps: ['1 × 1: **9**.', '2 × 2: **4** (en las cuatro esquinas, solapándose).', '3 × 3: **1** (el grande).', '9 + 4 + 1 = **14**. Y fíjate: 9 = 3², 4 = 2², 1 = 1².'],
  film: [
    { clear: true, say: 'Una cuadrícula de tres por tres. A primera vista hay nueve cuadrados. Pero un detective mira mejor.', show: [{ t: 'svg', k: 'g', vb: '0 0 260 260', h: '70%', x: grid3() }] },
    { say: 'Contamos por tamaños. Los pequeños, de uno por uno: nueve.', show: [{ t: 'svg', k: 'g', vb: '0 0 260 260', h: '70%', x: grid3([[0, 0, 1, '#f08c00'], [1, 0, 1, '#f08c00'], [2, 0, 1, '#f08c00'], [0, 1, 1, '#f08c00'], [1, 1, 1, '#f08c00'], [2, 1, 1, '#f08c00'], [0, 2, 1, '#f08c00'], [1, 2, 1, '#f08c00'], [2, 2, 1, '#f08c00']]) }, { t: 'eq', k: 'e', x: '1 × 1 → **9**' }] },
    { say: 'Ahora los de dos por dos. Arriba a la izquierda…', show: [{ t: 'svg', k: 'g', vb: '0 0 260 260', h: '70%', x: grid3([[0, 0, 2, '#1c7ed6']]) }, { t: 'eq', k: 'e', x: '2 × 2 → 1…' }] },
    { say: '…arriba a la derecha, abajo a la izquierda, y abajo a la derecha. Se solapan, ¡pero son cuatro cuadrados distintos!', show: [{ t: 'svg', k: 'g', vb: '0 0 260 260', h: '70%', x: grid3([[0, 0, 2, '#1c7ed6'], [1, 0, 2, '#2f9e44'], [0, 1, 2, '#c2255c'], [1, 1, 2, '#ae3ec9']]) }, { t: 'eq', k: 'e', x: '2 × 2 → **4**' }] },
    { say: 'Y el más grande, que se ve tan poco porque es el borde: el de tres por tres. Uno.', show: [{ t: 'svg', k: 'g', vb: '0 0 260 260', h: '70%', x: grid3([[0, 0, 3, '#e03131']]) }, { t: 'eq', k: 'e', x: '3 × 3 → **1**' }] },
    { clear: true, say: 'Nueve más cuatro más uno: catorce. ¿Y te has fijado? Nueve, cuatro y uno son los cuadrados de tres, dos y uno.', show: [{ t: 'eq', x: '9 + 4 + 1 = 3² + 2² + 1²' }, { t: 'ans', x: '14 cuadrados' }] },
    { say: 'La idea clave: contar por tamaños, con orden, y aceptar que las figuras se pueden solapar.', show: [{ t: 'idea', x: 'Cuenta **por tamaños**. ¡Los cuadrados se pueden solapar!' }] },
  ] },

// ===================== NIVEL 3 · Estratega =====================
{ id: 'potencia', qSay: 'Dos elevado a cincuenta es multiplicar cincuenta doses: dos por dos por dos, y así hasta cincuenta doses. Es un número enorme, de dieciséis cifras. ¿En qué cifra termina?', level: 3, emoji: '2️⃣', title: 'La última cifra de un gigante', cat: 'Buscar el patrón',
  q: '**2⁵⁰** es multiplicar **50 doses**: 2 × 2 × 2 × … × 2 (el 2 aparece 50 veces). ¡Es un número enorme, de 16 cifras!\n\n¿En qué **cifra termina**?',
  ask: '¿Cuál es la última cifra?', ph: 'Una cifra', ans: { num: 4 },
  traps: [{ v: 2, m: 'Mira cómo terminan 2¹, 2², 2³, 2⁴, 2⁵… ¿se repite algo? ¿Dónde cae el 50?' }, { v: 6, m: 'Revisa en qué lugar del ciclo cae el 50.' }, { v: 8, m: 'Revisa en qué lugar del ciclo cae el 50.' }, { v: 0, m: 'Multiplicando doses nunca sale un 0 al final: haría falta un 5.' }],
  why: '¿Cómo lo has sabido sin calcularlo entero?',
  hints: ['No intentes calcularlo entero. Calcula las primeras potencias de 2 y mira **solo la última cifra**.',
    '2, 4, 8, 16, 32, 64, 128, 256… Últimas cifras: 2, 4, 8, 6, 2, 4, 8, 6…',
    'Las últimas cifras se repiten **cada 4** potencias: 2, 4, 8, 6. Para saber dónde cae 2⁵⁰, divide 50 entre 4.',
    '50 = 4 × 12 + 2. Después de 12 vueltas completas del ciclo 2, 4, 8, 6, avanzas 2 lugares más. ¿Qué cifra ocupa ese lugar?'],
  answer: 'Termina en 4', idea: 'Para la última cifra **solo importa la última cifra**: busca el **ciclo** y usa el resto.',
  steps: ['2¹ = 2, 2² = 4, 2³ = 8, 2⁴ = 16, 2⁵ = 32, 2⁶ = 64…', 'Últimas cifras: **2, 4, 8, 6** y vuelta a empezar (ciclo de 4).', '50 : 4 = 12, **resto 2** → el 2.º del ciclo.', 'Termina en **4**. (2⁵⁰ = 1 125 899 906 842 62**4**.)'],
  film: [
    { clear: true, say: 'Dos elevado a cincuenta es gigantesco. Pero no nos preguntan el número entero, solo su última cifra.', show: [{ t: 'h', x: '2⁵⁰ = 2 × 2 × 2 × … × 2' }, { t: 'p', x: '¿En qué cifra termina?' }] },
    { say: 'Al multiplicar por dos, la última cifra solo depende de la última cifra de antes. Así que miramos solo esa.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Potencia', '2¹', '2²', '2³', '2⁴'], ['Valor', 2, 4, 8, 16], ['Última cifra', '!2', '!4', '!8', '!6']] }] },
    { say: 'Seguimos: treinta y dos, sesenta y cuatro, ciento veintiocho, doscientos cincuenta y seis… ¡Las últimas cifras se repiten! Dos, cuatro, ocho, seis.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Potencia', '2¹', '2²', '2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸'], ['Valor', 2, 4, 8, 16, 32, 64, 128, 256], ['Última cifra', '!2', '!4', '!8', '!6', '!2', '!4', '!8', '!6']] }] },
    { clear: true, say: 'Es un ciclo de cuatro. Como los días de la semana, pero con cuatro casillas.', show: [{ t: 'row', items: ['!2', '!4', '!8', '!6', '🔁'], gap: 250 }] },
    { say: 'Cincuenta entre cuatro: doce vueltas completas, y sobran dos. Así que caemos en la segunda casilla del ciclo.', show: [{ t: 'eq', x: '50 = 4 × 12 + **2**' }, { t: 'row', items: ['2', '!4', '8', '6'] }] },
    { say: 'La segunda casilla es el cuatro. Dos elevado a cincuenta termina en cuatro. ¡Y es verdad: es más de mil billones, y acaba en seiscientos veinticuatro!', show: [{ t: 'ans', x: 'Termina en 4' }, { t: 'p', x: '2⁵⁰ = 1 125 899 906 842 62**4**' }] },
    { say: 'La idea clave: cuando algo se repite en ciclo, busca el ciclo y usa el resto de la división.', show: [{ t: 'idea', x: 'Busca el **ciclo** (2, 4, 8, 6) y usa el **resto**.' }] },
  ] },

{ id: 'libro', level: 3, emoji: '📖', title: 'Las cifras del libro', cat: 'Contar por grupos',
  q: 'Para numerar todas las páginas de un libro, empezando por la página 1, una imprenta ha usado **270 cifras** en total.\n(Por ejemplo, la página 25 usa 2 cifras: el 2 y el 5.)\n\n¿Cuántas **páginas** tiene el libro?',
  ask: '¿Cuántas páginas?', ph: 'Un número', ans: { num: 126 },
  traps: [{ v: 90, m: 'No todas las páginas usan 3 cifras: las primeras usan menos.' }, { v: 135, m: '¿Todas las páginas usan 2 cifras?' }, { v: 127, m: '¡Casi! Cuenta bien: si empiezas en la 100, ¿en qué página acaban 27 páginas?' }, { v: 27, m: 'Esas son las páginas de 3 cifras. ¿Cuántas hay en total?' }],
  hints: ['Agrupa las páginas según **cuántas cifras** usa cada número.',
    'Páginas 1 a 9: 1 cifra cada una. Páginas 10 a 99: 2 cifras cada una. Desde la 100: 3 cifras.',
    'Páginas 1–9 → 9 cifras. Páginas 10–99 → 90 páginas × 2 = 180 cifras. Ya llevas 189. ¿Cuántas cifras quedan?',
    'Quedan 270 − 189 = 81 cifras, y cada página desde la 100 usa 3: 81 : 3 = 27 páginas. Empiezan en la 100: ¡cuidado al contar la última!'],
  answer: '126 páginas', idea: 'Agrupa por número de cifras; al final, cuenta bien: 27 páginas desde la 100 llegan a la **126**, no a la 127.',
  steps: ['1–9: 9 páginas × 1 = **9** cifras.', '10–99: 90 páginas × 2 = **180** cifras. Total hasta la 99: **189**.', 'Quedan 270 − 189 = **81** cifras → 81 : 3 = **27** páginas de 3 cifras.', 'De la 100 a la **126** hay 27 páginas (126 − 100 + 1 = 27).'],
  film: [
    { clear: true, say: 'La imprenta ha gastado doscientas setenta cifras. No todas las páginas gastan lo mismo, así que hacemos grupos.', show: [{ t: 'h', x: '📖 270 cifras' }] },
    { say: 'Primer grupo: de la página uno a la nueve. Nueve páginas, una cifra cada una: nueve cifras.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Páginas', 'Cuántas', 'Cifras cada una', 'Cifras'], ['1 – 9', 9, 1, '!9']] }] },
    { say: 'Segundo grupo: de la diez a la noventa y nueve. ¿Cuántas son? Noventa y nueve menos diez, más uno: noventa. Con dos cifras cada una: ciento ochenta.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Páginas', 'Cuántas', 'Cifras cada una', 'Cifras'], ['1 – 9', 9, 1, 9], ['10 – 99', 90, 2, '!180']] }] },
    { say: 'Hasta la noventa y nueve llevamos ciento ochenta y nueve cifras. Nos quedan ochenta y una.', show: [{ t: 'eq', x: '270 − 189 = **81**' }] },
    { clear: true, say: 'Desde la página cien, cada página gasta tres cifras. Ochenta y una entre tres: veintisiete páginas.', show: [{ t: 'eq', x: '81 : 3 = **27** páginas' }] },
    { say: '¡Ahora la trampa! Veintisiete páginas desde la cien no acaban en la ciento veintisiete. La cien es la primera, la ciento uno la segunda… y la ciento veintiséis es la veintisiete.', show: [{ t: 'row', sm: true, items: ['!100', '101', '102', '…', '125', '!126'] }, { t: 'p', x: '100 es la 1.ª · 126 es la 27.ª' }] },
    { say: 'El libro tiene ciento veintiséis páginas.', show: [{ t: 'ans', x: '126 páginas' }] },
    { say: 'La idea clave: agrupar por número de cifras, y contar con cuidado dónde empieza y dónde acaba cada grupo.', show: [{ t: 'idea', x: '**Agrupa** por cifras y cuida el **principio y el final** de cada grupo.' }] },
  ] },

{ id: 'granja', level: 3, emoji: '🐔', title: 'Gallinas y conejos', cat: 'Suponer y corregir',
  q: 'En una granja hay **gallinas** 🐔 y **conejos** 🐰. En total cuentas **20 cabezas** y **56 patas**.\n\n¿Cuántos **conejos** hay?',
  ask: '¿Cuántos conejos?', ph: 'Un número', ans: { num: 8, also: [12, 20, 56] },
  traps: [{ v: 12, m: 'Ese número es de otro animal. ¿Y los conejos?' }, { v: 14, m: 'Comprueba las patas con tu respuesta.' }, { v: 16, m: '16 son las patas que faltan. ¿Cuántos conejos son?' }],
  why: '¿Cómo lo has averiguado?',
  hints: ['Cada animal tiene 1 cabeza. Las gallinas tienen **2 patas** y los conejos **4**.',
    'Imagina que **todos** fueran gallinas. ¿Cuántas patas habría?',
    '20 gallinas tendrían 40 patas. Pero hay 56: faltan 16. ¿Qué pasa con las patas si cambias una gallina por un conejo?',
    'Cada vez que cambias una gallina por un conejo, sumas **2 patas**. Para conseguir 16 patas más, ¿cuántos cambios haces?'],
  answer: '8 conejos (y 12 gallinas)', idea: '**Supón** algo fácil (todos son gallinas), mira cuánto **falta** y corrige.',
  steps: ['Supongamos que los 20 son gallinas → 20 × 2 = **40** patas.', 'Hay 56 → faltan 56 − 40 = **16** patas.', 'Cambiar una gallina por un conejo suma **2** patas → 16 : 2 = **8** conejos.', 'Comprobación: 12 gallinas × 2 + 8 conejos × 4 = 24 + 32 = 56 ✓.'],
  film: [
    { clear: true, say: 'Veinte cabezas y cincuenta y seis patas. ¿Cuántos conejos hay? Vamos a suponer algo fácil.', show: [{ t: 'p', x: '20 cabezas · 56 patas' }] },
    { say: 'Supongamos que los veinte animales son gallinas. Veinte por dos patas: cuarenta patas.', show: [{ t: 'row', k: 'r', sm: true, items: Array(20).fill('🐔'), gap: 50 }, { t: 'eq', k: 'e', x: '20 × 2 = **40** patas' }] },
    { say: 'Pero tenemos cincuenta y seis. Nos faltan dieciséis patas.', show: [{ t: 'eq', k: 'f', x: '56 − 40 = **16** patas que faltan' }] },
    { say: 'Si cambio una gallina por un conejo, las cabezas siguen siendo veinte, pero gano dos patas.', show: [{ t: 'row', k: 'r', sm: true, items: ['!🐰', ...Array(19).fill('🐔')] }, { t: 'eq', k: 'e', x: '🐔 → 🐰 = **+2** patas' }] },
    { say: 'Para ganar dieciséis patas, de dos en dos, hacen falta ocho cambios. Ocho conejos.', show: [{ t: 'row', k: 'r', sm: true, items: [...Array(8).fill('!🐰'), ...Array(12).fill('🐔')], gap: 60 }, { t: 'eq', k: 'f', x: '16 : 2 = **8** conejos' }] },
    { clear: true, say: 'Comprobamos: doce gallinas por dos, veinticuatro. Ocho conejos por cuatro, treinta y dos. Veinticuatro más treinta y dos: ¡cincuenta y seis!', show: [{ t: 'eq', x: '12 × 2 + 8 × 4 = 24 + 32 = 56 ✓' }, { t: 'ans', x: '8 conejos' }] },
    { say: 'La idea clave: supón algo fácil aunque sea falso, mira cuánto te equivocas y corrige poco a poco.', show: [{ t: 'idea', x: '**Supón** que todos son gallinas y **corrige** la diferencia.' }] },
  ] },

{ id: 'mentiras', level: 3, emoji: '🎭', title: '¿Quién dice la verdad?', cat: 'Lógica',
  q: 'Ana, Bea y Carlos dicen lo siguiente. Cada uno **o siempre dice la verdad, o siempre miente**.\n🗨️ **Ana**: «Bea miente».\n🗨️ **Bea**: «Carlos miente».\n🗨️ **Carlos**: «Ana y Bea mienten las dos».\n\n¿Quién o quiénes dicen la **verdad**?',
  ask: '¿Quién dice la verdad?', ph: 'Escribe solo el nombre o los nombres de quien dice la verdad', ans: { liars: true, text: ['bea', 'solo bea'], forbid: ['ana', 'carlos', 'nadie', 'ninguno', 'todos'] },
  traps: [{ v: 'carlos', m: 'Comprueba: si Carlos dice la verdad, Ana miente… entonces, ¿qué pasa con Bea? ¿Encaja?' }, { v: 'ana', m: 'Comprueba: si Ana dice la verdad, Bea miente… ¿y entonces Carlos? ¿Encaja con lo que dice Carlos?' }, { v: 'nadie', m: 'Si todos mintieran, lo que dice Carlos sería verdad. ¡Contradicción!' }],
  why: '¿Cómo has descubierto a los mentirosos?',
  hints: ['Haz una **suposición**: imagina que alguien dice la verdad y mira si todo encaja.',
    'Empieza por Carlos. Si Carlos dijera la verdad, Ana y Bea mentirían. ¿Encaja con lo que dice **Ana**?',
    'Si Ana mintiera, «Bea miente» sería falso: Bea diría la verdad. ¡Pero Carlos decía que Bea miente! Así que Carlos **no puede** decir la verdad.',
    'Carlos miente. Bea dice «Carlos miente»: eso es verdad. ¿Y Ana, que dice «Bea miente»?'],
  answer: 'Solo Bea', idea: '**Supón** y busca una **contradicción**: si una suposición choca consigo misma, es falsa.',
  steps: ['Supongamos que Carlos dice la verdad → Ana y Bea mienten.', 'Si Ana miente, «Bea miente» es falso → Bea dice la verdad. ¡Choca! → **Carlos miente**.', '¡Ojo! Si Carlos miente, eso **no** quiere decir que Ana y Bea digan las dos la verdad: basta con que **una** de las dos no mienta.', 'Carlos miente → lo que dice Bea («Carlos miente») es verdad → **Bea dice la verdad**.', 'Bea dice la verdad → «Bea miente» es falso → **Ana miente**. Comprobamos Carlos: «Ana y Bea mienten» es falso ✓.'],
  film: [
    { clear: true, say: 'Tres personas, tres frases. Cada una o siempre dice la verdad, o siempre miente.', show: [{ t: 'tbl', head: true, rows: [['', 'Dice…'], ['Ana', '«Bea miente»'], ['Bea', '«Carlos miente»'], ['Carlos', '«Ana y Bea mienten»']] }] },
    { clear: true, say: 'Hacemos una suposición: Carlos dice la verdad. Entonces Ana y Bea mienten.', show: [{ t: 'row', k: 'r', items: ['-Ana 🤥', '-Bea 🤥', '+Carlos 😇'] }, { t: 'p', k: 'p', x: 'Suposición: **Carlos dice la verdad**' }] },
    { say: 'Pero si Ana miente, su frase «Bea miente» es falsa. Así que Bea diría la verdad. ¡Y habíamos dicho que Bea miente! Contradicción.', show: [{ t: 'eq', x: 'Ana miente → «Bea miente» es falso → Bea 😇 ⚡ ¡choque!' }] },
    { clear: true, say: 'Cuando una suposición choca consigo misma, es falsa. Así que Carlos miente.', show: [{ t: 'row', k: 'r', items: ['Ana ❓', 'Bea ❓', '-Carlos 🤥'] }] },
    { say: 'Ojo con una trampa: si Carlos miente, no quiere decir que las dos digan la verdad. Basta con que una de ellas no mienta.', show: [{ t: 'p', x: 'Carlos miente ≠ «Ana y Bea dicen las dos la verdad»' }] },
    { say: 'Si Carlos miente, la frase de Bea, «Carlos miente», es verdad. ¡Bea dice la verdad!', show: [{ t: 'row', k: 'r', items: ['Ana ❓', '+Bea 😇', '-Carlos 🤥'] }] },
    { say: 'Y Ana dice «Bea miente», que es falso. Ana miente.', show: [{ t: 'row', k: 'r', items: ['-Ana 🤥', '+Bea 😇', '-Carlos 🤥'] }] },
    { say: 'Comprobamos a Carlos: dice que Ana y Bea mienten las dos. Es falso, porque Bea dice la verdad. ¡Encaja! Carlos miente, como habíamos visto.', show: [{ t: 'p', x: 'Carlos: «Ana y Bea mienten» → falso ✓' }, { t: 'ans', x: 'Solo Bea' }] },
    { say: 'La idea clave: supón algo, sigue las consecuencias, y si llegas a una contradicción, tu suposición era falsa.', show: [{ t: 'idea', x: '**Supón** y busca una **contradicción**.' }] },
  ] },

{ id: 'monedas', level: 3, emoji: '⚖️', title: 'La moneda falsa', cat: 'Estrategia',
  q: 'Tienes **9 monedas** que parecen iguales, pero **una es falsa y pesa un poco más**. Tienes una **balanza de dos platos** sin pesas: solo te dice qué lado pesa más, o si están iguales.\n\n¿Cuál es el **número mínimo de pesadas** que te asegura encontrar **siempre** la moneda falsa?',
  ask: '¿Cuántas pesadas?', ph: 'Un número', ans: { num: 2 },
  traps: [{ v: 3, m: 'Con 3 lo consigues… ¿y con menos? Prueba a hacer grupos de 3.' }, { v: 4, m: 'Se puede con menos: no peses las monedas de dos en dos.' }, { v: 1, m: 'Una pesada solo tiene 3 resultados: izquierda, derecha o iguales. ¿Bastan para 9 monedas?' }, { v: 8, m: 'Se puede con muchas menos. ¿Y si pones varias monedas en cada plato?' }, { v: 5, m: 'Se puede con menos. Prueba a poner varias monedas en cada plato.' }],
  why: '¿Cómo lo harías?',
  hints: ['Una balanza tiene **tres** resultados posibles, no dos: baja la izquierda, baja la derecha, o están iguales.',
    'No pongas las monedas de dos en dos. Prueba a hacer **3 grupos**.',
    'Haz 3 grupos de 3 monedas. Pon un grupo en cada plato y deja un grupo **fuera**. ¿Qué te dice la balanza?',
    'La primera pesada te dice en qué grupo de 3 está la falsa. Con esas 3 monedas: pon 1 en cada plato y deja 1 fuera…'],
  answer: '2 pesadas', idea: 'Aprovecha los **tres resultados** de la balanza: divide siempre en **3 grupos**.',
  steps: ['Grupos A, B, C de 3 monedas. Pesada 1: A contra B.', 'Si baja A → está en A. Si baja B → en B. Si están iguales → en **C**, la que estaba fuera.', 'Pesada 2: de las 3 sospechosas, una en cada plato y una fuera. Mismo razonamiento → ¡encontrada!', 'Con 1 pesada no basta: solo hay 3 resultados posibles y 9 monedas sospechosas. Mínimo: **2**.'],
  film: [
    { clear: true, say: 'Nueve monedas, una falsa que pesa más. Lo normal sería pesar de dos en dos… pero eso puede llevar cuatro pesadas.', show: [{ t: 'row', items: ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => '#ffd43b|' + n), gap: 80 }] },
    { say: 'El secreto: una balanza tiene tres respuestas, no dos. Baja la izquierda, baja la derecha… o se queda igual. ¡Usemos las tres!', show: [{ t: 'p', x: '⬅️ baja la izquierda · ➡️ baja la derecha · ⚖️ iguales' }] },
    { clear: true, say: 'Hacemos tres grupos de tres. Uno en cada plato, y el tercero fuera.', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '80%', x: scale(['1', '2', '3'], ['4', '5', '6'], 0, ['7', '8', '9']) }] },
    { say: 'Si baja la izquierda, la falsa está en la izquierda. Si baja la derecha, en la derecha. Y si se queda igual, ¡está en el grupo de fuera!', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '80%', x: scale(['1', '2', '3'], ['4', '5', '6'], -1, ['7', '8', '9']) }] },
    { clear: true, say: 'Con una pesada ya sabemos en qué grupo de tres está. Ahora, con esas tres, hacemos lo mismo: una en cada plato y una fuera.', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '80%', x: scale(['1'], ['2'], 0, ['3']) }] },
    { say: 'Si baja un lado, esa es la falsa. Si se quedan iguales, es la de fuera. ¡Encontrada en dos pesadas!', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '66%', x: scale(['1'], ['2'], 1, ['3']) }, { t: 'ans', x: '2 pesadas' }] },
    { clear: true, say: '¿Y con una sola pesada? Imposible: una pesada solo tiene tres respuestas posibles, y hay nueve monedas sospechosas. Dos pesadas dan tres por tres, nueve respuestas. ¡Justo!', show: [{ t: 'eq', x: '1 pesada → 3 respuestas · 2 pesadas → 3 × 3 = **9**' }] },
    { say: 'La idea clave: aprovecha las tres respuestas de la balanza y divide siempre en tres grupos.', show: [{ t: 'idea', x: 'La balanza tiene **3 respuestas** → divide en **3 grupos**.' }] },
  ] },

{ id: 'capicuas', level: 3, emoji: '🔁', title: 'Números capicúa', cat: 'Contar posibilidades',
  q: 'Un número es **capicúa** si se lee igual de izquierda a derecha que de derecha a izquierda, como **434** o **707**.\n\n¿Cuántos números **capicúa de tres cifras** hay?',
  ask: '¿Cuántos hay?', ph: 'Un número', ans: { num: 90 },
  traps: [{ v: 100, m: '¿Puede un número de tres cifras empezar por 0?' }, { v: 81, m: '¿La cifra del medio puede ser 0? Piensa en el 404.' }, { v: 9, m: 'Para cada primera cifra hay muchos capicúas: 101, 111, 121…' }, { v: 10, m: 'Solo empezando por 1 ya hay 10: 101, 111, … 191. ¿Y empezando por 2?' }, { v: 900, m: 'Esos son todos los números de tres cifras. ¿Cuántos son capicúa?' }],
  hints: ['Un capicúa de tres cifras tiene la forma **A B A**. ¿Qué cifras puedes **elegir** libremente?',
    'La última cifra **no** la eliges: tiene que ser igual a la primera. Solo eliges la primera y la del medio.',
    'La primera cifra puede ser del 1 al 9 (no puede ser 0). La del medio, del 0 al 9.',
    'Para cada primera cifra (9 opciones) hay 10 cifras del medio posibles. Multiplica.'],
  answer: '90', idea: 'Cuenta **las decisiones**: 9 opciones para la primera × 10 para la del medio; la última viene **gratis**.',
  steps: ['Forma **A B A**: solo se eligen A y B.', 'A: del 1 al 9 → **9** opciones (un número no empieza por 0).', 'B: del 0 al 9 → **10** opciones.', '9 × 10 = **90** capicúas (101, 111, …, 989, 999).'],
  film: [
    { clear: true, say: 'Un capicúa de tres cifras se lee igual al derecho y al revés. Como cuatrocientos treinta y cuatro.', show: [{ t: 'row', items: ['!4', '3', '!4'] }, { t: 'p', x: '¡La primera y la última son iguales!' }] },
    { say: 'Así que tiene la forma letra A, letra B, letra A. Para fabricar uno, solo tomamos dos decisiones: la primera cifra, y la del medio. La última viene gratis.', show: [{ t: 'row', items: ['!A', '!B', '+A'] }, { t: 'p', x: 'Eliges **A** y **B** · la última **A** viene gratis 🎁' }] },
    { clear: true, say: 'La primera cifra: del uno al nueve. No puede ser cero, porque entonces no sería de tres cifras. Nueve opciones.', show: [{ t: 'row', label: 'A:', sm: true, items: R(1, 9), gap: 60 }, { t: 'eq', k: 'a', x: 'A → **9** opciones' }] },
    { say: 'La del medio sí puede ser cero, como en cuatrocientos cuatro. Diez opciones, del cero al nueve.', show: [{ t: 'row', label: 'B:', sm: true, items: R(0, 9), gap: 60 }, { t: 'eq', k: 'b', x: 'B → **10** opciones' }] },
    { clear: true, say: 'Con el uno delante hay diez: ciento uno, ciento once, ciento veintiuno… hasta ciento noventa y uno. Con el dos, otros diez. Y así nueve veces.', show: [{ t: 'row', sm: true, items: [101, 111, 121, 131, 141, 151, 161, 171, 181, 191], gap: 60 }, { t: 'eq', x: '9 × 10 = 90' }] },
    { say: 'Noventa capicúas de tres cifras.', show: [{ t: 'ans', x: '90' }] },
    { say: 'La idea clave: para contar, cuenta las decisiones que tomas, y multiplica las opciones de cada una.', show: [{ t: 'idea', x: 'Cuenta las **decisiones** y **multiplica** las opciones.' }] },
  ] },

// ===================== NIVEL 4 · Maestro de Olimpiadas =====================
{ id: 'taquillas', level: 4, emoji: '🚪', title: 'Las 100 taquillas', cat: 'Divisores y cuadrados',
  q: 'En un colegio hay **100 taquillas cerradas**, numeradas del 1 al 100, y **100 alumnos**.\n• El alumno 1 **abre** todas.\n• El alumno 2 cambia las taquillas de la tabla del 2 (la 2, la 4, la 6…): si está abierta la cierra, si está cerrada la abre.\n• El alumno 3 cambia las de la tabla del 3 (la 3, la 6, la 9…), y así sucesivamente, hasta el alumno 100.\n\nAl final, ¿cuántas taquillas quedan **abiertas**?',
  ask: '¿Cuántas quedan abiertas?', ph: 'Un número', ans: { num: 10, also: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100] },
  traps: [{ v: 50, m: 'No es la mitad: cada taquilla se toca un número diferente de veces. Prueba solo con las 10 primeras.' }, { v: 0, m: 'Prueba con las 10 primeras: ¿la taquilla 1 se cierra alguna vez?' }, { v: 1, m: 'Te preguntamos <b>cuántas</b> quedan abiertas: escribe un solo número. (Y si te sale 1, prueba con las 10 primeras: ¿solo queda abierta una?)' }, { v: 25, m: 'Prueba con las 10 primeras: ¿cuáles quedan abiertas? ¿Ves algo especial en esos números?' }],
  why: '¿Por qué esas y no otras?',
  hints: ['Haz la prueba solo con las taquillas **1 a 10** y apunta cuáles quedan abiertas.',
    'A cada taquilla la tocan los alumnos cuyo número la **divide exactamente** (sus **divisores**). La 6 la tocan los alumnos 1, 2, 3 y 6, porque 6 : 1, 6 : 2, 6 : 3 y 6 : 6 son divisiones exactas.',
    'Si se toca un número **par** de veces, acaba cerrada; si es **impar**, abierta. ¿Qué números tienen un número impar de divisores?',
    'Los divisores van en **parejas** (1 × 6, 2 × 3)… salvo cuando la pareja es el mismo número, como 3 × 3 = 9. Las abiertas son 1, 4, 9, 16… ¿cuántas hay hasta 100?'],
  answer: '10 taquillas: 1, 4, 9, 16, 25, 36, 49, 64, 81 y 100', idea: 'Los divisores van **en parejas**; solo los **cuadrados** (como 3 × 3 = 9) tienen uno suelto → número impar de cambios → abierta.',
  steps: ['A cada taquilla la toca cada alumno cuyo número la divide exactamente (sus **divisores**).', 'Los divisores van en parejas: 12 → (1, 12), (2, 6), (3, 4) → 6 divisores, **par** → cerrada.', 'En los **cuadrados** una pareja es doble: 16 → (1, 16), (2, 8), **(4, 4)** → 5 divisores, **impar** → abierta.', 'Cuadrados hasta 100: 1², 2², …, 10² → **10** taquillas.'],
  film: [
    { clear: true, say: 'Cien taquillas y cien alumnos. Es mucho para hacerlo a mano. Probemos primero con las diez primeras.', show: [{ t: 'h', x: '🚪 Las taquillas 1 a 10' }, { t: 'grid', k: 'g', n: 10, cols: 10 }] },
    { say: 'La taquilla seis la tocan los alumnos uno, dos, tres y seis: los divisores de seis. Abre, cierra, abre, cierra. Cuatro veces: acaba cerrada.', show: [{ t: 'eq', k: 'e', x: '6 → alumnos 1, 2, 3, 6 → **4** veces → cerrada 🔒' }] },
    { say: 'La taquilla nueve la tocan el uno, el tres y el nueve. Tres veces: abre, cierra, abre. ¡Abierta!', show: [{ t: 'eq', k: 'e', x: '9 → alumnos 1, 3, 9 → **3** veces → abierta 🔓' }] },
    { say: 'Si lo hacemos con las diez, quedan abiertas la uno, la cuatro y la nueve. ¿Te suenan? ¡Uno por uno, dos por dos, tres por tres!', show: [{ t: 'grid', k: 'g', n: 10, cols: 10, hl: [1, 4, 9] }, { t: 'eq', k: 'e', x: '1 = 1 × 1 · 4 = 2 × 2 · 9 = 3 × 3' }] },
    { clear: true, say: '¿Por qué? Los divisores van en parejas. Doce: uno por doce, dos por seis, tres por cuatro. Seis divisores, un número par. Cerrada.', show: [{ t: 'eq', x: '12 = 1 × 12 = 2 × 6 = 3 × 4 → **6** divisores 🔒' }] },
    { say: 'Pero dieciséis: uno por dieciséis, dos por ocho… y cuatro por cuatro. ¡El cuatro está solo! Cinco divisores, número impar. Abierta.', show: [{ t: 'eq', x: '16 = 1 × 16 = 2 × 8 = **4 × 4** → **5** divisores 🔓' }] },
    { clear: true, say: 'Así que solo quedan abiertas las taquillas que son cuadrados: uno, cuatro, nueve, dieciséis… hasta cien, que es diez por diez.', show: [{ t: 'grid', n: 100, cols: 10, hl: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100], stagger: 4 }] },
    { say: 'Diez taquillas abiertas.', show: [{ t: 'ans', x: '10 taquillas' }] },
    { clear: true, say: 'La idea clave: los divisores van en parejas, menos en los cuadrados. Y el truco de detective: probar primero con un caso pequeño y buscar el patrón.', show: [{ t: 'ans', x: '10 taquillas' }, { t: 'idea', x: 'Divisores **en parejas** → solo los **cuadrados** tienen uno suelto.' }] },
  ] },

{ id: 'ceros', qSay: 'Multiplicas todos los números del uno al treinta: uno por dos por tres por cuatro, y así hasta veintinueve por treinta. El resultado es un número gigante. ¿En cuántos ceros termina?', level: 4, emoji: '0️⃣', title: '¿Cuántos ceros al final?', cat: 'Descomponer en factores',
  q: 'Multiplicas todos los números del 1 al 30:\n**1 × 2 × 3 × 4 × … × 29 × 30**\n\nEl resultado es un número gigante. ¿En **cuántos ceros** termina?',
  ask: '¿Cuántos ceros?', ph: 'Un número', ans: { num: 7 },
  traps: [{ v: 3, m: 'No cuentes solo el 10, el 20 y el 30. ¿Qué otra multiplicación da un 0 al final? Piensa en 4 × 5.' }, { v: 6, m: '¡Casi! Hay un número que esconde <b>dos</b> cincos.' }, { v: 4, m: 'Busca todos los números que llevan un 5 dentro (multiplicando).' }, { v: 15, m: 'Los doses sobran: lo que limita son los cincos.' }],
  why: '¿Cómo los has contado?',
  hints: ['Un cero al final aparece al multiplicar por **10**. ¿Y 10 es…? **2 × 5**.',
    'Doses hay muchísimos (todos los pares). Lo difícil es encontrar **cincos**. Cada pareja 2 × 5 da un cero.',
    'Busca en la tabla del 5 hasta el 30: 5, 10, 15, 20, 25, 30. Cada uno aporta un 5… ¿todos aportan solo uno?',
    '25 = 5 × 5: ¡aporta **dos** cincos! Cuenta: 5, 10, 15, 20 y 30 dan uno cada uno, y 25 da dos.'],
  answer: '7 ceros', idea: 'Cada cero es una pareja **2 × 5**. Como sobran doses, cuenta los **cincos**… ¡y el 25 tiene dos!',
  steps: ['Cada cero final sale de un **10 = 2 × 5**.', 'Hay doses de sobra (2, 4, 6, 8…), así que cuentan los **cincos**.', '5, 10, 15, 20, 30 → un 5 cada uno = **5**. 25 = 5 × 5 → **2**.', 'Total: 5 + 2 = **7** ceros. (El resultado es 265 252 859 812 191 058 636 308 48**0 000 000**.)'],
  film: [
    { clear: true, say: 'Multiplicamos del uno al treinta. ¿En cuántos ceros termina? Muchos dirían tres, por el diez, el veinte y el treinta. ¡Pero hay ceros escondidos!', show: [{ t: 'h', x: '1 × 2 × 3 × … × 30' }, { t: 'p', x: '¿Solo el 10, el 20 y el 30? 🤔' }] },
    { say: 'Por ejemplo, cuatro por cinco son veinte. ¡Un cero! Y no hay ningún diez a la vista.', show: [{ t: 'eq', x: '4 × 5 = 2**0**' }] },
    { say: 'Cada cero al final sale de multiplicar por diez. Y diez es dos por cinco. Así que contamos parejas de dos y cinco.', show: [{ t: 'eq', x: '10 = **2 × 5**' }] },
    { clear: true, say: 'Doses hay muchísimos: cada número par tiene al menos uno. Los que escasean son los cincos. Busquémoslos.', show: [{ t: 'grid', k: 'g', n: 30, cols: 10, hl2: R(2, 30, 2) }, { t: 'p', k: 'p', x: '🟦 con un 2 dentro: ¡muchísimos!' }] },
    { say: 'Los números de la tabla del cinco: cinco, diez, quince, veinte, veinticinco y treinta.', show: [{ t: 'grid', k: 'g', n: 30, cols: 10, hl: R(5, 30, 5) }, { t: 'p', k: 'p', x: '🟨 con un 5 dentro: 5, 10, 15, 20, 25, 30' }] },
    { say: '¡Pero cuidado! Veinticinco es cinco por cinco. Esconde dos cincos.', show: [{ t: 'eq', x: '25 = **5 × 5**' }] },
    { clear: true, say: 'Cinco cincos de los demás, más dos del veinticinco: siete cincos. Cada uno se empareja con un dos, y hace un cero.', show: [{ t: 'row', items: ['5 → 5', '10 → 5', '15 → 5', '20 → 5', '!25 → 5 × 5', '30 → 5'], gap: 150 }, { t: 'eq', x: '5 + 2 = **7**' }] },
    { say: 'Siete ceros.', show: [{ t: 'ans', x: '7 ceros' }] },
    { say: 'La idea clave: descomponer. Un cero es un dos por un cinco, y hay que contar lo que más escasea, los cincos.', show: [{ t: 'idea', x: 'Cero = **2 × 5**. Cuenta lo que escasea: los **cincos**.' }] },
  ] },

{ id: 'pirata', level: 4, emoji: '🏴‍☠️', title: 'El tesoro del pirata', cat: 'Restos',
  q: 'Un pirata cuenta sus monedas de oro.\n• Si las reparte en grupos de **3**, le **sobran 2**.\n• En grupos de **4**, le **sobran 3**.\n• En grupos de **5**, le **sobran 4**.\n\n¿Cuál es el **menor número** de monedas que puede tener?',
  ask: '¿Cuántas monedas?', ph: 'Un número', ans: { num: 59 },
  traps: [{ v: 60, m: 'Con 60 no sobra nada en ningún grupo. ¡Pero estás muy cerca!' }, { v: 119, m: 'Funciona… pero ¿es el <b>menor</b>?' }, { v: 61, m: 'Con 61 sobra 1 en cada grupo. ¡Muy cerca!' }, { v: 11, m: 'Comprueba con grupos de 4: 11 = 4 × 2 + 3 ✓… ¿y con grupos de 5?' }],
  why: '¿Cuál ha sido el truco?',
  hints: ['Fíjate en los restos: siempre sobra **uno menos** que el tamaño del grupo.',
    'Si al pirata le dieras **1 moneda más**, ¿qué pasaría con los restos?',
    'Con 1 moneda más, los repartos en grupos de 3, de 4 y de 5 saldrían **exactos**. Busca un número que se pueda dividir exactamente entre 3, entre 4 y entre 5.',
    'Los que se dividen exactamente entre 4 y entre 5 son 20, 40, 60, 80… ¿Cuál es el primero que también se divide entre 3? Recuerda: ese número es **con** la moneda extra.'],
  answer: '59 monedas', idea: 'Mira lo que **falta** en vez de lo que **sobra**: con una moneda más, todo sale exacto.',
  steps: ['Siempre sobra uno menos que el grupo → con **1 moneda más** no sobraría nada.', 'Monedas + 1 se divide exactamente entre 3, 4 y 5. Probando 20, 40, 60… el primero que vale es **60**.', 'Monedas = 60 − 1 = **59**.', 'Comprobación: 59 = 3 × 19 + 2 = 4 × 14 + 3 = 5 × 11 + 4 ✓.'],
  film: [
    { clear: true, say: 'El pirata reparte sus monedas en grupos de tres, de cuatro y de cinco, y siempre le sobran algunas.', show: [{ t: 'tbl', head: true, rows: [['Grupos de', 'Sobran'], [3, 2], [4, 3], [5, 4]] }] },
    { say: 'Fíjate en algo curioso: siempre sobra justo una menos que el tamaño del grupo. A cada reparto le falta solo una moneda para salir exacto.', show: [{ t: 'p', x: 'Sobran 2 de 3 · 3 de 4 · 4 de 5 → ¡siempre **falta 1**!' }] },
    { clear: true, say: 'Así que, si le regalamos una moneda más al pirata, todos los repartos salen exactos.', show: [{ t: 'eq', x: 'monedas **+ 1** → exacto en grupos de 3, 4 y 5' }] },
    { say: 'Buscamos el menor número que se pueda dividir exactamente entre tres, entre cuatro y entre cinco. Los que salen exactos con cuatro y con cinco son veinte, cuarenta, sesenta… El veinte y el cuarenta no se dividen entre tres. ¡El sesenta sí!', show: [{ t: 'p', x: 'Exactos entre 4 y entre 5: 20 · 40 · 60 · 80…' }, { t: 'eq', x: '20 ✗ · 40 ✗ · **60** ✓ (60 : 3 = 20)' }] },
    { say: 'Sesenta es con la moneda regalada. Se la quitamos: cincuenta y nueve.', show: [{ t: 'eq', x: '60 − 1 = **59**' }] },
    { clear: true, say: 'Comprobamos. Cincuenta y nueve entre tres: diecinueve, y sobran dos. Entre cuatro: catorce, y sobran tres. Entre cinco: once, y sobran cuatro. ¡Perfecto!', show: [{ t: 'eq', x: '59 = 3 × 19 + **2**' }, { t: 'eq', x: '59 = 4 × 14 + **3**' }, { t: 'eq', x: '59 = 5 × 11 + **4**' }] },
    { say: 'Cincuenta y nueve monedas.', show: [{ t: 'ans', x: '59 monedas' }] },
    { say: 'La idea clave: a veces es más fácil mirar lo que falta que lo que sobra.', show: [{ t: 'idea', x: 'Mira lo que **falta** (1 moneda), no lo que sobra.' }] },
  ] },

{ id: 'escalera', qSay: 'Lucas sube una escalera de ocho escalones. En cada paso puede subir un escalón, o dos escalones de golpe. ¿De cuántas formas distintas puede subir la escalera? Por ejemplo, uno, dos, uno, dos, dos es una forma, y dos, dos, dos, dos es otra. Ojo: el orden importa. Empezar con uno y luego dos es distinto de empezar con dos y luego uno.', level: 4, emoji: '🪜', title: 'Subiendo la escalera', cat: 'Construir paso a paso',
  q: 'Lucas sube una escalera de **8 escalones**. En cada paso puede subir **1 escalón** o **2 escalones** de golpe.\n\n¿De cuántas **formas distintas** puede subir la escalera?\n(Por ejemplo, 1 + 2 + 1 + 2 + 2 es una forma, y 2 + 2 + 2 + 2 es otra. ¡El **orden** importa: 1 + 2 + … y 2 + 1 + … son formas **distintas**!)',
  ask: '¿Cuántas formas?', ph: 'Un número', ans: { num: 34 },
  traps: [{ v: 21, m: 'Revisa tu tabla: ¿has llegado hasta el escalón 8, ni uno más ni uno menos?' }, { v: 55, m: 'Revisa tu tabla: ¿has llegado hasta el escalón 8, ni uno más ni uno menos?' }, { v: 5, m: '¿Has contado 1 + 2 y 2 + 1 como la misma forma? Aquí el orden importa: son formas distintas.' }, { v: 16, m: 'Prueba con escaleras pequeñas (1, 2, 3, 4 escalones) y busca el patrón.' }, { v: 8, m: 'Prueba con escaleras pequeñas (1, 2, 3, 4 escalones) y busca el patrón.' }],
  why: '¿Qué patrón has encontrado?',
  hints: ['8 escalones son muchos. Empieza con escaleras **pequeñas**: ¿cuántas formas hay con 1 escalón? ¿Y con 2? ¿Y con 3?',
    '1 escalón: 1 forma. 2 escalones: 2 formas (1+1, 2). 3 escalones: 3 formas (1+1+1, 1+2, 2+1). 4 escalones: 5 formas.',
    'Para llegar al escalón 4, tu **último paso** fue desde el 3 (paso de 1) o desde el 2 (paso de 2). Así que las formas de llegar al 4 = las formas de llegar al 3 + las formas de llegar al 2.',
    'Cada número es la **suma de los dos anteriores**: 1, 2, 3, 5, 8, … Sigue hasta el escalón 8.'],
  answer: '34 formas', idea: 'Para llegar a un escalón vienes del **anterior** o del de **dos antes**: suma sus formas. ¡Son los números de **Fibonacci**!',
  steps: ['Escalones 1, 2, 3, 4 → 1, 2, 3, 5 formas.', 'A un escalón llegas o desde el escalón de justo debajo (paso de 1) o desde dos más abajo (paso de 2).', 'Así que las formas de un escalón = las formas del de debajo + las formas del de dos más abajo.', '1, 2, 3, 5, 8, 13, 21, **34** → 8 escalones: **34** formas.'],
  film: [
    { clear: true, say: 'Ocho escalones, pasos de uno o de dos. Contarlas todas a mano es un lío. El estratega empieza por escaleras pequeñas.', show: [{ t: 'svg', vb: '-10 -30 530 340', h: '58%', x: stairs(8, [1, 2, 1, 2, 2]) }, { t: 'p', x: '1 + 2 + 1 + 2 + 2' }] },
    { clear: true, say: 'Un escalón: una forma. Dos escalones: dos formas, uno más uno, o dos. Tres escalones: tres formas.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Escalones', 1, 2, 3], ['Formas', 1, 2, 3], ['¿Cuáles?', '1', '1+1 · 2', '1+1+1 · 1+2 · 2+1']] }] },
    { say: 'Cuatro escalones: cinco formas. Uno, dos, tres, cinco… ¿Ves el patrón?', show: [{ t: 'tbl', k: 't', head: true, rows: [['Escalones', 1, 2, 3, 4], ['Formas', 1, 2, 3, '!5']] }] },
    { clear: true, say: 'Piensa en el último paso. Para llegar al escalón cuatro, o vienes del tres con un paso corto, o vienes del dos con un paso largo.', show: [{ t: 'svg', vb: '0 140 280 170', h: '40%', x: stairs(4, [1, 1, 2]) }, { t: 'eq', x: 'formas(4) = formas(3) + formas(2) = 3 + 2 = **5**' }] },
    { clear: true, say: 'Así que cada número es la suma de los dos anteriores. Tres más cinco, ocho. Cinco más ocho, trece. Ocho más trece, veintiuno. Trece más veintiuno… ¡treinta y cuatro!', show: [{ t: 'row', items: [1, 2, 3, 5, 8, 13, 21, '!34'], gap: 300 }] },
    { say: 'Treinta y cuatro formas de subir ocho escalones.', show: [{ t: 'ans', x: '34 formas' }] },
    { say: 'Estos números se llaman números de Fibonacci, y aparecen en las piñas, en los girasoles… y en las escaleras. La idea clave: construir la respuesta grande a partir de las pequeñas.', show: [{ t: 'idea', x: 'Construye **paso a paso**: cada número es la **suma de los dos anteriores**.' }] },
  ] },

{ id: 'abcd', qSay: 'Cada letra es una cifra. A B C D, multiplicado por cuatro, es igual a D C B A. Es decir: un número de cuatro cifras, multiplicado por cuatro, da el mismo número al revés. ¿Qué número es A B C D?', level: 4, emoji: '🔤', title: 'El número que se da la vuelta', cat: 'Cifras escondidas',
  q: 'Cada letra es una cifra:\n\n**A B C D × 4 = D C B A**\n\nEs decir: un número de 4 cifras, multiplicado por 4, da **el mismo número al revés**. ¿Qué número es **ABCD**?',
  ask: '¿Qué número es ABCD?', ph: 'Un número de 4 cifras', ans: { num: 2178 },
  traps: [{ v: 8712, m: 'Ese es <b>DCBA</b>, el resultado. ¿Cuál es ABCD?' }, { v: 2128, m: 'Comprueba: 2128 × 4 = ?' }],
  why: '¿Por dónde has empezado?',
  hints: ['Empieza por la primera cifra, **A**. Si ABCD × 4 sigue teniendo solo 4 cifras, A no puede ser muy grande.',
    'A solo puede ser 1 o 2 (con 3, ya 3000 × 4 = 12 000 tiene 5 cifras). Además, A es la **última cifra** de D × 4… así que A es **par**.',
    'A = 2. Entonces D × 4 termina en 2 → D es 3 u 8. Pero DCBA es por lo menos 2000 × 4 = 8000 → **D = 8**.',
    '2BC8 × 4 = 8CB2. Para no pasar de 8999, B tiene que ser 0, 1 o 2. Y 8 × 4 = 32 lleva 3: C × 4 + 3 termina en B, que es **impar** → B = 1. Busca C.'],
  answer: '2178', idea: 'Empieza por las **puntas** (A y D) y usa las **llevadas**: cada cifra te da una pista para la siguiente.',
  steps: ['ABCD × 4 tiene 4 cifras → A es 1 o 2. A es la última cifra de D × 4 → par → **A = 2**.', 'D × 4 termina en 2 → D = 3 u 8; DCBA ≥ 8000 → **D = 8**.', '8 × 4 = 32: se escribe 2 y **se lleva 3**. C × 4 + 3 es impar → B impar; y B × 4 no puede llevar nada → **B = 1**.', 'C × 4 + 3 termina en 1 → C × 4 termina en 8 → C = 2 o 7. Probando: 2128 × 4 = 8512 ✗, **2178 × 4 = 8712 ✓**.'],
  film: [
    { clear: true, say: 'Un número de cuatro cifras que, multiplicado por cuatro, se da la vuelta. Parece magia. Vamos cifra a cifra, empezando por las puntas.', show: [{ t: 'row', k: 'top', items: ['A', 'B', 'C', 'D'] }, { t: 'p', x: '× 4 =' }, { t: 'row', k: 'bot', items: ['D', 'C', 'B', 'A'] }] },
    { say: 'Primero, la cifra A. Si la A fuera tres o más, al multiplicar por cuatro tendríamos cinco cifras. Así que la A es uno o dos.', show: [{ t: 'eq', k: 'e', x: '3000 × 4 = 12 000 → ¡5 cifras! → A = 1 o 2' }] },
    { say: 'Pero la A también es la última cifra del resultado: la última cifra de D por cuatro. Y cualquier número por cuatro es par. ¡La A es dos!', show: [{ t: 'row', k: 'top', items: ['!2', 'B', 'C', 'D'] }, { t: 'row', k: 'bot', items: ['D', 'C', 'B', '!2'] }, { t: 'eq', k: 'e', x: 'A = **2**' }] },
    { say: 'Ahora la D. D por cuatro termina en dos: la D es tres u ocho. Pero el resultado es al menos dos mil por cuatro, ocho mil. Así que la D es ocho.', show: [{ t: 'row', k: 'top', items: ['2', 'B', 'C', '!8'] }, { t: 'row', k: 'bot', items: ['!8', 'C', 'B', '2'] }, { t: 'eq', k: 'e', x: 'D = **8**' }] },
    { say: 'Ocho por cuatro, treinta y dos: escribimos dos y nos llevamos tres. Además, el resultado empieza por ocho y no puede pasar de ocho mil novecientos noventa y nueve, así que B por cuatro no puede llevarse nada: B es cero, uno o dos.', show: [{ t: 'eq', k: 'e', x: '8 × 4 = 3**2** → me llevo **3** · B ≤ 2' }] },
    { say: 'Y C por cuatro más tres siempre es impar, y termina en B. Así que B es impar: ¡B es uno!', show: [{ t: 'row', k: 'top', items: ['2', '!1', 'C', '8'] }, { t: 'row', k: 'bot', items: ['8', 'C', '!1', '2'] }, { t: 'eq', k: 'e', x: 'B = **1**' }] },
    { say: 'Por último, C por cuatro más tres termina en uno. Entonces C por cuatro termina en ocho: C es dos o siete. Probamos: dos mil ciento veintiocho por cuatro no funciona. ¡Dos mil ciento setenta y ocho por cuatro es ocho mil setecientos doce!', show: [{ t: 'row', k: 'top', items: ['2', '1', '!7', '8'] }, { t: 'row', k: 'bot', items: ['8', '!7', '1', '2'] }, { t: 'eq', k: 'e', x: '2178 × 4 = 8712 ✓' }] },
    { clear: true, say: 'El número es dos mil ciento setenta y ocho.', show: [{ t: 'ans', x: '2178' }] },
    { say: 'La idea clave: empieza por donde hay menos posibilidades, las puntas, y usa las llevadas como pistas.', show: [{ t: 'idea', x: 'Empieza por las **puntas** y usa las **llevadas** como pistas.' }] },
  ] },

{ id: 'impares', qSay: 'Mira estas sumas de números impares. Uno es uno. Uno más tres es cuatro. Uno más tres más cinco es nueve. Uno más tres más cinco más siete es dieciséis. ¿Cuánto es uno más tres más cinco más siete, y así hasta noventa y siete más noventa y nueve?', level: 4, emoji: '🔲', title: 'La suma de los impares', cat: 'Ver con dibujos',
  q: 'Mira estas sumas de números impares:\n1 = 1\n1 + 3 = 4\n1 + 3 + 5 = 9\n1 + 3 + 5 + 7 = 16\n\n¿Cuánto es **1 + 3 + 5 + 7 + … + 97 + 99**?',
  ask: '¿Cuánto da la suma?', ph: 'Un número', ans: { num: 2500 },
  traps: [{ v: 5000, m: 'Revisa: ¿cuántos números impares hay entre 1 y 99?' }, { v: 9801, m: 'Ese es 99 × 99. ¿Cuántos números estás sumando de verdad?' }, { v: 2401, m: 'Ese es 49 × 49. ¿Cuántos impares hay del 1 al 99?' }, { v: 2550, m: 'Revisa: ¿cuántos números impares hay entre 1 y 99?' }, { v: 2450, m: 'Revisa: ¿cuántos números impares hay entre 1 y 99?' }],
  why: '¿Por qué funciona el patrón?',
  hints: ['Mira los resultados: 1, 4, 9, 16… ¿te suenan? Piensa en las **potencias**.',
    '1 = 1², 4 = 2², 9 = 3², 16 = 4². ¿Qué relación hay con **cuántos** números sumas?',
    'Sumando los primeros 4 impares sale 4 × 4. Sumando los primeros 5 impares sale 5 × 5. ¿**Cuántos** impares hay del 1 al 99?',
    'Del 1 al 99 hay **50** impares (la mitad de 100). Calcula 50².'],
  answer: '2500', idea: 'Cada impar añade una **«L»** alrededor del cuadrado: 4 impares forman un cuadrado de 4 × 4, 50 impares uno de **50 × 50**.',
  steps: ['1 = 1 × 1, 1 + 3 = 2 × 2, 1 + 3 + 5 = 3 × 3… → sumando los primeros impares sale **tantas veces tantas** como impares sumas.', '¿Por qué? Cada impar es una «L» que agranda el cuadrado en una fila y una columna.', 'Del 1 al 99 hay **50** impares.', '50 × 50 = **2500**.', 'Otra forma, como Gauss: 1 + 99 = 100, 3 + 97 = 100… 25 parejas de 100 = **2500**.'],
  film: [
    { clear: true, say: 'Uno. Uno más tres, cuatro. Uno más tres más cinco, nueve. Uno, cuatro, nueve, dieciséis… ¡son cuadrados! Pero ¿por qué?', show: [{ t: 'eq', x: '1 = 1² · 1 + 3 = 2² · 1 + 3 + 5 = 3² · 1 + 3 + 5 + 7 = 4²' }] },
    { clear: true, say: 'Dibujémoslo. El uno es un cuadradito.', show: [{ t: 'svg', k: 's', vb: '0 0 240 240', h: '62%', x: odd(1) }, { t: 'eq', k: 'e', x: '1 = **1 × 1**' }] },
    { say: 'El tres es una L de tres cuadraditos que rodea al primero. ¡Forman un cuadrado de dos por dos!', show: [{ t: 'svg', k: 's', vb: '0 0 240 240', h: '62%', x: odd(2) }, { t: 'eq', k: 'e', x: '1 + 3 = **2 × 2**' }] },
    { say: 'El cinco es una L un poco más grande: cuadrado de tres por tres.', show: [{ t: 'svg', k: 's', vb: '0 0 240 240', h: '62%', x: odd(3) }, { t: 'eq', k: 'e', x: '1 + 3 + 5 = **3 × 3**' }] },
    { say: 'Y el siete, otra L: cuatro por cuatro. Cada impar agranda el cuadrado una fila y una columna. Por eso, si sumas los primeros impares, sale un cuadrado.', show: [{ t: 'svg', k: 's', vb: '0 0 240 240', h: '62%', x: odd(4) }, { t: 'eq', k: 'e', x: '4 impares → **4 × 4**' }] },
    { clear: true, say: '¿Cuántos impares hay del uno al noventa y nueve? La mitad de los números del uno al cien: cincuenta.', show: [{ t: 'eq', x: '1, 3, 5, …, 99 → **50** impares' }] },
    { say: 'Así que forman un cuadrado de cincuenta por cincuenta: dos mil quinientos.', show: [{ t: 'eq', x: '50 × 50 = 2500' }, { t: 'ans', x: '2500' }] },
    { say: 'La idea clave: un dibujo puede explicar un patrón. Cada número impar es una L que hace crecer el cuadrado.', show: [{ t: 'idea', x: 'Cada impar es una **«L»**: 50 impares forman un **cuadrado de 50 × 50**.' }] },
  ] },

// ===================== Batch 2 (21 Nov 2026): 3 more per level. Answers: verify2.py =====================
// --- Nivel 1 ---
{ id: 'hermanos', level: 1, emoji: '👨‍👩‍👧‍👦', title: 'La familia de Ana', cat: 'Leer con cuidado',
  q: 'Ana tiene **3 hermanos** (chicos). Cada uno de sus hermanos tiene **una sola hermana**.\n\n¿Cuántos **hijos e hijas** hay en total en la familia?',
  ask: '¿Cuántos hijos e hijas?', ph: 'Un número', ans: { num: 4, also: [1, 3] },
  traps: [{ v: 7, m: '¿Quién es la hermana de esos chicos? ¡Puede que ya la hayas contado!' }, { v: 6, m: 'Solo cuentan los <b>hijos e hijas</b>, no los padres. Y, ¿cuántas chicas hay de verdad?' }, { v: 3, m: '¿Has contado a Ana?' }, { v: 5, m: 'Dibuja la familia: Ana y sus hermanos. ¿Hay alguien más?' }],
  hints: ['Haz un **dibujo** de la familia.',
    'Los hermanos de Ana tienen **una sola** hermana. ¿Quién puede ser esa hermana?',
    'Si hubiera otra chica en la familia, cada chico tendría **dos** hermanas: Ana y ella. ¿Puede haberla?',
    'La única hermana de los chicos es Ana: no hay más chicas. Cuenta a Ana y a sus hermanos.'],
  answer: '4 (Ana y sus 3 hermanos)', idea: 'Lee con cuidado: la «una sola hermana» de los chicos es **Ana**, que ya estaba contada.',
  steps: ['Ana tiene 3 hermanos chicos.', 'Cada chico tiene una sola hermana: esa hermana es **Ana**.', 'No hay más chicas: Ana + 3 chicos = **4** hijos.'],
  film: [
    { clear: true, say: 'Ana tiene tres hermanos chicos. Y cada uno de ellos tiene una sola hermana.', show: [{ t: 'h', x: '👨‍👩‍👧‍👦 La familia de Ana' }, { t: 'row', k: 'r', items: ['👧 Ana', '👦', '👦', '👦'] }] },
    { say: 'Mucha gente piensa: tres chicos, cada uno con su hermana, tres hermanas más… ¡siete! Pero, ¿quién es la hermana de cada chico?', show: [{ t: 'p', k: 'p', x: 'Ana + 3 chicos + 3 hermanas = 7? 🤔' }] },
    { say: 'Pregúntale al primer hermano: ¿quién es tu hermana? ¡Ana! ¿Y al segundo? ¡Ana! Y al tercero, también Ana.', show: [{ t: 'row', k: 'r', items: ['!👧 Ana', '👦', '👦', '👦'] }, { t: 'p', k: 'p', x: 'La hermana de los tres es **la misma**: Ana' }] },
    { say: 'Así que en la familia están Ana y sus tres hermanos. Cuatro hijos.', show: [{ t: 'ans', x: '4 hijos' }] },
    { say: 'La idea clave: lee con mucho cuidado, y no cuentes dos veces a la misma persona.', show: [{ t: 'idea', x: 'La única hermana de los chicos es **Ana**: no la cuentes dos veces.' }] },
  ] },

{ id: 'velas', level: 1, emoji: '🕯️', title: 'Restos de vela', cat: 'No pararse antes de tiempo',
  q: 'Cuando una vela se gasta, queda un **resto** de cera. Con **3 restos** se puede fabricar **1 vela nueva**.\n\nTienes **9 velas**. ¿Cuántas velas puedes encender **en total**, como máximo?',
  ask: '¿Cuántas velas en total?', ph: 'Un número', ans: { num: 13, also: [9, 3, 1] },
  traps: [{ v: 12, m: '¡Muy bien, ya has hecho velas nuevas! Pero esas velas nuevas, al gastarse, ¿no dejan restos?' }, { v: 9, m: 'Las velas gastadas dejan restos… ¿y qué haces con los restos?' }, { v: 3, m: 'Esas son solo las primeras velas nuevas. ¿Y las 9 del principio?' }, { v: 4, m: 'Esas son las velas nuevas. ¿Y las 9 del principio?' }, { v: 14, m: 'Revisa: al final, ¿cuántos restos te quedan? ¿Llegan para otra vela?' }],
  hints: ['Ve **paso a paso**: enciende las velas que tienes y mira qué te queda.',
    'Las 9 velas dejan 9 restos. ¿Cuántas velas nuevas salen?',
    '9 restos → 3 velas nuevas. Cuando se gastan esas 3, dejan 3 restos… ¿y entonces?',
    '3 restos → 1 vela más. Suma todas las velas que has encendido: 9 + 3 + 1.'],
  answer: '13 velas', idea: 'Las velas nuevas **también dejan restos**: sigue hasta que de verdad no puedas hacer más.',
  steps: ['Enciendes las **9** velas → 9 restos.', '9 restos → **3** velas nuevas → al gastarse, 3 restos.', '3 restos → **1** vela más → 1 resto (no llega para otra).', 'Total: 9 + 3 + 1 = **13** velas.'],
  film: [
    { clear: true, say: 'Tienes nueve velas. Cuando se gastan, cada una deja un resto de cera. Y con tres restos haces una vela nueva.', show: [{ t: 'row', items: Array(9).fill('🕯️'), gap: 80 }, { t: 'p', x: '3 restos → 1 vela nueva' }] },
    { say: 'Enciendes las nueve velas. Quedan nueve restos.', show: [{ t: 'eq', k: 'e', x: 'Encendidas: **9** · restos: 9' }] },
    { say: 'Con nueve restos fabricas tres velas nuevas. Las enciendes, y dejan tres restos.', show: [{ t: 'row', k: 'n', label: 'Nuevas:', items: ['!🕯️', '!🕯️', '!🕯️'] }, { t: 'eq', k: 'e', x: 'Encendidas: 9 + **3** · restos: 3' }] },
    { say: 'Mucha gente se para aquí: doce. ¡Pero con esos tres restos haces otra vela más!', show: [{ t: 'row', k: 'n', label: 'Nuevas:', items: ['🕯️', '🕯️', '🕯️', '!🕯️'] }, { t: 'eq', k: 'e', x: 'Encendidas: 9 + 3 + **1** · resto: 1' }] },
    { clear: true, say: 'Al final queda un solo resto, y con uno no se puede hacer otra vela. Total: nueve más tres más uno, trece.', show: [{ t: 'eq', x: '9 + 3 + 1 = 13' }, { t: 'ans', x: '13 velas' }] },
    { say: 'La idea clave: lo nuevo también deja restos. No te pares hasta que de verdad no puedas seguir.', show: [{ t: 'idea', x: 'Las velas nuevas **también** dejan restos: ¡sigue hasta el final!' }] },
  ] },

{ id: 'fila', level: 1, emoji: '🎬', title: 'La cola del cine', cat: 'Ordenar con pistas',
  q: 'Cinco amigos hacen cola para entrar al cine: **Eva, Luis, Marta, Pablo y Sara**.\n• Pablo es el **primero**.\n• Marta es la **última**.\n• Sara está **justo detrás** de Eva (Eva entra antes que Sara).\n• Luis **no** está al lado de Pablo.\n\n¿Quién está **en medio** de la cola?',
  ask: '¿Quién está en medio?', ph: 'Escribe solo un nombre', ans: { text: ['sara'], mid: ['eva', 'luis', 'marta', 'pablo', 'sara'] },
  traps: [{ v: 'luis', m: 'Comprueba: si Luis estuviera en el medio, ¿pueden Eva y Sara estar juntas?' }, { v: 'eva', m: 'Si Eva está en el medio, Sara va justo detrás… ¿y dónde queda Luis? Mira la última pista.' }, { v: 'pablo', m: 'Pablo es el primero, no el del medio.' }, { v: 'marta', m: 'Marta es la última, no la del medio.' }],
  hints: ['Dibuja **5 huecos** en fila y pon primero a quien sabes seguro dónde va.',
    'Pablo va en el hueco 1 y Marta en el 5. Quedan los huecos 2, 3 y 4 para Eva, Sara y Luis.',
    'Luis no puede ir en el 2 (estaría al lado de Pablo). Y Eva y Sara tienen que ir **juntas**, con Sara justo detrás.',
    'Si Luis va en el 3, Eva y Sara no caben juntas. Así que Luis va en el 4… ¿y Eva y Sara?'],
  answer: 'Sara (Pablo, Eva, Sara, Luis, Marta)', idea: 'Empieza por las pistas **seguras** (el primero y el último) y prueba las demás en los huecos que quedan.',
  steps: ['Huecos: **Pablo** _ _ _ **Marta**.', 'Luis no puede ir en el 2 (al lado de Pablo).', 'Si Luis va en el 3, Eva y Sara quedan separadas → Luis va en el **4**.', 'Eva en el 2, Sara en el 3: Pablo, Eva, **Sara**, Luis, Marta. Sara está en medio.'],
  film: [
    { clear: true, say: 'Cinco amigos en la cola. Dibujamos cinco huecos.', show: [{ t: 'row', k: 'f', items: ['1', '2', '3', '4', '5'] }] },
    { say: 'Primero, las pistas seguras: Pablo es el primero y Marta la última.', show: [{ t: 'row', k: 'f', items: ['!Pablo', '2', '3', '4', '!Marta'] }] },
    { say: 'Quedan tres huecos para Eva, Sara y Luis. Luis no puede estar al lado de Pablo, así que no va en el dos.', show: [{ t: 'row', k: 'f', items: ['Pablo', '2', '3', '4', 'Marta'] }, { t: 'p', k: 'p', x: 'Luis **no** va en el 2' }] },
    { say: 'Si Luis estuviera en el tres, Eva y Sara tendrían que ir separadas, en el dos y en el cuatro. ¡Pero tienen que ir juntas!', show: [{ t: 'row', k: 'f', items: ['Pablo', 'Eva?', '-Luis', 'Sara?', 'Marta'] }, { t: 'p', k: 'p', x: 'Luis en el 3 → Eva y Sara separadas ❌' }] },
    { clear: true, say: 'Así que Luis va en el cuatro, y Eva y Sara en el dos y el tres, con Sara justo detrás de Eva.', show: [{ t: 'row', k: 'f', items: ['Pablo', '+Eva', '+Sara', '+Luis', 'Marta'] }] },
    { say: 'En medio de la cola está Sara.', show: [{ t: 'row', k: 'f', items: ['Pablo', 'Eva', '!Sara', 'Luis', 'Marta'] }, { t: 'ans', x: 'Sara' }] },
    { say: 'La idea clave: empieza por lo seguro, y prueba lo demás en los huecos que quedan.', show: [{ t: 'idea', x: 'Primero lo **seguro**; después, prueba en los **huecos** que quedan.' }] },
  ] },

// --- Nivel 2 ---
{ id: 'edad', level: 2, emoji: '🎂', title: 'El doble de años', cat: 'Lo que no cambia',
  q: 'Lucía tiene **8 años** y su madre **32**.\n\n¿Cuántos años tendrá **Lucía** cuando su madre tenga **el doble** de años que ella?',
  ask: '¿Cuántos años tendrá Lucía?', ph: 'Un número', ans: { num: 24, also: [48, 8, 16] },
  traps: [{ v: 16, m: 'Comprueba: cuando Lucía tenga 16 años, ¿cuántos tendrá su madre? ¿Es el doble?' }, { v: 48, m: 'Esa será la edad de la madre. ¿Y la de Lucía?' }, { v: 4, m: 'Hoy la madre tiene 4 veces la edad de Lucía. ¿Cuándo tendrá el doble?' }, { v: 12, m: 'Comprueba: si Lucía tiene 12, la madre tiene 36. ¿Es el doble?' }],
  why: '¿Cómo lo has pensado?',
  hints: ['Haz una **tabla**: cada año, Lucía cumple uno… y su madre también.',
    'Fíjate en la **diferencia** de edad: hoy es 32 − 8 = 24. ¿Cambia con los años?',
    'Piensa en un ejemplo cualquiera de «el doble»: un niño de 10 y su madre de 20. ¿Cuánto se llevan? ¿Y si son 7 y 14? ¿Qué notas?',
    'Cuando la madre tiene el doble, lo que se llevan es **igual a la edad del hijo**. Y Lucía y su madre siempre se llevan 24…'],
  answer: 'Lucía tendrá 24 años (y su madre 48)', idea: 'La **diferencia de edad no cambia nunca**. Cuando la madre tenga el doble, esa diferencia es igual a la edad de Lucía.',
  steps: ['La diferencia de edad es 32 − 8 = **24** años, y **no cambia nunca**.', 'El doble es «Lucía + Lucía». Entonces madre − Lucía = Lucía.', 'Así que Lucía tendrá **24** años, y su madre 48 = 2 × 24 ✓.', 'Pasarán 24 − 8 = 16 años.'],
  film: [
    { clear: true, say: 'Lucía tiene ocho años y su madre treinta y dos. Hoy la madre tiene cuatro veces la edad de Lucía.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Lucía', 'Madre'], ['Hoy', 8, 32]] }] },
    { say: 'Cada año que pasa, las dos cumplen uno. Así que la diferencia entre sus edades no cambia: siempre veinticuatro años.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Lucía', 'Madre'], ['Hoy', 8, 32], ['+1 año', 9, 33], ['+2 años', 10, 34]] }, { t: 'eq', x: 'Diferencia: 32 − 8 = **24**, siempre' }] },
    { clear: true, say: 'Ahora, el doble. Si la madre tiene el doble de años que Lucía, es como tener la edad de Lucía dos veces.', show: [{ t: 'eq', x: 'Madre = Lucía + Lucía' }] },
    { say: 'Entonces la diferencia, madre menos Lucía, es justo la edad de Lucía. ¡Y la diferencia siempre es veinticuatro!', show: [{ t: 'eq', x: 'Madre − Lucía = **Lucía** = 24' }] },
    { clear: true, say: 'Lucía tendrá veinticuatro años, y su madre cuarenta y ocho, que es el doble. Faltan dieciséis años.', show: [{ t: 'tbl', head: true, rows: [['', 'Lucía', 'Madre'], ['Hoy', 8, 32], ['Dentro de 16 años', '!24', '!48']] }, { t: 'ans', x: 'Lucía: 24 años' }] },
    { say: 'La idea clave: busca lo que no cambia. La diferencia de edad siempre es la misma.', show: [{ t: 'idea', x: 'Busca **lo que no cambia**: la diferencia de edad siempre es 24.' }] },
  ] },

{ id: 'truco', level: 2, emoji: '🎩', title: 'El truco del mago', cat: 'Seguir las operaciones',
  qSay: 'Un mago te dice: piensa un número. Súmale cinco. Multiplícalo por dos. Réstale cuatro. Divídelo entre dos. Y ahora, réstale el número que pensaste. ¡El mago adivina el resultado sin saber tu número! ¿Qué número te sale siempre?',
  q: 'Un mago te dice:\n«Piensa un número. **Súmale 5**. **Multiplícalo por 2**. **Réstale 4**. **Divídelo entre 2**. Y ahora **réstale el número que pensaste**».\n\n¡El mago adivina el resultado sin saber tu número! ¿**Qué número** te sale siempre?',
  ask: '¿Qué número sale siempre?', ph: 'Un número', ans: { num: 3 },
  traps: [{ v: 5, m: 'Pruébalo con un número de verdad, por ejemplo el 10, paso a paso.' }, { v: 6, m: 'Revisa el paso de dividir entre 2.' }, { v: 13, m: '¡Casi! ¿Has hecho el último paso, quitar tu número?' }, { v: 10, m: 'Pruébalo con un número de verdad, por ejemplo el 10, y haz todos los pasos.' }],
  why: '¿Por qué sale siempre lo mismo?',
  hints: ['Pruébalo con un número cualquiera, por ejemplo el **10**, y haz las cuentas.',
    'Prueba con otro número, por ejemplo el 7. ¿Sale lo mismo? Ahora piensa **por qué**.',
    'Imagina tu número como una caja 📦. Súmale 5: 📦 + 5. Por 2: 📦📦 + 10. Sigue tú con las cajas.',
    '📦📦 + 10 − 4 = 📦📦 + 6. Entre 2: 📦 + 3. Ahora quita tu número (la caja)…'],
  answer: '3', idea: 'Llama a tu número **📦**: por el camino la caja desaparece y solo queda el **3**. Por eso da igual qué número pienses.',
  steps: ['Tu número = 📦.', '+ 5 → 📦 + 5 · × 2 → 📦📦 + 10 · − 4 → 📦📦 + 6.', ': 2 → 📦 + 3 · − 📦 → **3**.', 'La caja desaparece: sale **3** con cualquier número.'],
  film: [
    { clear: true, say: 'Probemos el truco con el diez. Diez más cinco, quince. Por dos, treinta. Menos cuatro, veintiséis. Entre dos, trece. Y menos diez… ¡tres!', show: [{ t: 'row', items: ['10', '→ 15', '→ 30', '→ 26', '→ 13', '!→ 3'], gap: 450 }] },
    { say: 'Con el siete: doce, veinticuatro, veinte, diez, y menos siete… ¡tres otra vez! ¿Por qué?', show: [{ t: 'row', items: ['7', '→ 12', '→ 24', '→ 20', '→ 10', '!→ 3'], gap: 300 }] },
    { clear: true, say: 'Vamos a llamar «caja» a tu número, porque no sabemos qué hay dentro.', show: [{ t: 'eq', x: 'Tu número = 📦' }] },
    { say: 'Le sumas cinco: caja más cinco. Lo multiplicas por dos: dos cajas y diez.', show: [{ t: 'eq', x: '📦 + 5  →  📦📦 + 10' }] },
    { say: 'Le restas cuatro: dos cajas y seis. Lo divides entre dos: una caja y tres.', show: [{ t: 'eq', x: '📦📦 + 6  →  📦 + 3' }] },
    { say: 'Y al final le quitas tu número, la caja. ¡Solo queda el tres!', show: [{ t: 'eq', x: '📦 + 3 − 📦 = **3**' }] },
    { clear: true, say: 'Por eso el mago siempre acierta: tu número desaparece por el camino. La idea clave: cuando no sabes un número, llámalo caja y sigue las operaciones.', show: [{ t: 'ans', x: '3' }, { t: 'idea', x: 'Llama **📦** a tu número: al final la caja se va y queda el **3**.' }] },
  ] },

{ id: 'magico', level: 2, emoji: '✨', title: 'El cuadrado mágico', cat: 'Sumar todo de golpe',
  qSay: 'Colocas los números del uno al nueve en un cuadrado de tres por tres, uno en cada casilla, de forma que las tres filas sumen lo mismo, y las columnas y las diagonales también. ¿Cuánto suma cada fila?',
  q: 'Colocas los números del **1 al 9** en un cuadrado de 3 × 3, uno en cada casilla, de forma que **las tres filas** sumen lo mismo (y las columnas y las diagonales también).\n\n¿Cuánto **suma cada fila**?',
  pic: `<svg viewBox="0 0 260 260">${grid3()}</svg>`,
  ask: '¿Cuánto suma cada fila?', ph: 'Un número', ans: { num: 15, also: [45, 3] },
  traps: [{ v: 45, m: 'Esa es la suma de todos los números. Pero están repartidos en 3 filas…' }, { v: 9, m: 'Prueba a sumar primero todos los números del 1 al 9.' }, { v: 18, m: 'Prueba a sumar primero todos los números del 1 al 9.' }, { v: 12, m: 'Prueba a sumar primero todos los números del 1 al 9.' }, { v: 5, m: 'El 5 va en el centro, sí. Pero te preguntamos cuánto suma una <b>fila entera</b>.' }],
  hints: ['No hace falta construir el cuadrado. Piensa en **todos los números juntos**.',
    '¿Cuánto suman todos los números del 1 al 9? Truco: empareja el primero con el último (1 + 9, 2 + 8…).',
    'Del 1 al 9 suman 45. Esos 45 están repartidos en **3 filas** que suman lo mismo.',
    '45 repartido en 3 filas iguales: 45 : 3 = ?'],
  answer: '15', idea: 'No construyas el cuadrado: **suma todo** (45) y **repártelo** entre las 3 filas.',
  steps: ['Todos los números: 1 + 2 + … + 9 = **45** (cuatro parejas que suman 10, y el 5).', 'Cada número está en **una** fila → las 3 filas juntas suman 45.', 'Las 3 filas suman lo mismo → 45 : 3 = **15**.', 'Un cuadrado así: 2 7 6 / 9 5 1 / 4 3 8 (¡compruébalo!).'],
  film: [
    { clear: true, say: 'Hay que poner del uno al nueve en el cuadrado, y que todas las filas sumen lo mismo. ¿Cuánto? No hace falta construirlo.', show: [{ t: 'svg', vb: '0 0 260 260', h: '64%', x: grid3() }] },
    { clear: true, say: 'Primero sumamos todos los números, emparejando el primero con el último. Uno más nueve, diez. Dos más ocho, diez. Tres más siete, y cuatro más seis. Cuatro dieces y el cinco: cuarenta y cinco.', show: [{ t: 'eq', x: '1 + 2 + 3 + … + 9 = **45**' }, { t: 'p', x: '(1 + 9) + (2 + 8) + (3 + 7) + (4 + 6) + 5' }] },
    { say: 'Cada número está en una sola fila. Así que, si sumas las tres filas, también te sale cuarenta y cinco.', show: [{ t: 'eq', x: 'fila 1 + fila 2 + fila 3 = 45' }] },
    { say: 'Y las tres filas suman igual. Cuarenta y cinco entre tres: quince.', show: [{ t: 'eq', x: '45 : 3 = **15**' }] },
    { clear: true, say: 'Aquí tienes uno. Dos más siete más seis, quince. Nueve más cinco más uno, quince. Cuatro más tres más ocho, quince. ¡Y las columnas y las diagonales también!', show: [{ t: 'tbl', rows: [['2', '7', '6'], ['9', '!5', '1'], ['4', '3', '8']] }, { t: 'ans', x: '15' }] },
    { say: 'La idea clave: a veces no hace falta construir nada. Suma todo, y reparte.', show: [{ t: 'idea', x: 'Suma **todo** (45) y **reparte** entre las 3 filas.' }] },
  ] },

// --- Nivel 3 ---
{ id: 'nim', level: 3, emoji: '🍬', title: 'El último caramelo', cat: 'Estrategia de juego',
  q: 'Hay **15 caramelos** en la mesa. Juegas contra tu hermano: por turnos, cada uno coge **1, 2 o 3** caramelos. **Gana quien coge el último.**\n\nEmpiezas tú. ¿Cuántos caramelos tienes que coger **en tu primer turno** para estar **seguro de ganar**, juegue como juegue tu hermano?',
  ask: '¿Cuántos coges al principio?', ph: '1, 2 o 3', ans: { num: 3, also: [12, 15] },
  traps: [{ v: 1, m: 'Pruébalo: si coges 1 y quedan 14, ¿puede tu hermano dejarte en un mal sitio?' }, { v: 2, m: 'Pruébalo: si coges 2 y quedan 13, ¿puede tu hermano dejarte en un mal sitio?' }, { v: 15, m: 'Solo puedes coger 1, 2 o 3 cada vez.' }, { v: 4, m: 'Solo puedes coger 1, 2 o 3 cada vez.' }],
  why: '¿Cómo seguirías jugando después para ganar?',
  hints: ['Piensa **hacia atrás**, desde el final. ¿Con cuántos caramelos en la mesa **pierdes** si te toca a ti?',
    'Si te toca y quedan **4**, coges 1, 2 o 3… y tu hermano coge los que quedan. ¡4 es un número **malo** para quien le toca!',
    'Así que quieres dejarle 4 a tu hermano. Si le dejas **8**, coja lo que coja (1, 2 o 3), ¿puedes dejarle 4 en tu turno? ¿Qué otros números son malos para él?',
    'Los números malos para quien juega son 4, 8, 12… (la tabla del 4). Empiezas con 15: ¿cuántos coges para dejarle uno de ellos?'],
  answer: 'Coger 3 (y dejarle 12)', idea: 'Deja siempre a tu rival un número de la **tabla del 4**. Si él coge 1, tú 3; si coge 2, tú 2; si coge 3, tú 1: entre los dos, siempre **4**.',
  steps: ['Si te toca con **4** caramelos, pierdes: cojas lo que cojas, el otro coge el resto.', 'Hacia atrás: con 8 y con 12 también pierde quien juega, porque el otro siempre le puede dejar en el siguiente número malo (de 12 a 8, de 8 a 4).', 'Empiezas con 15 → coges **3** y le dejas 12.', 'Después coges siempre lo que falte para que entre los dos sumen 4: le dejas 8, luego 4, luego 0. ¡Ganas!'],
  film: [
    { clear: true, say: 'Quince caramelos. Cada uno coge uno, dos o tres. Gana quien coge el último. Pensemos desde el final.', show: [{ t: 'row', items: Array(15).fill('🍬'), gap: 60 }] },
    { clear: true, say: 'Imagina que te toca y quedan cuatro. Si coges uno, quedan tres, y tu hermano se los lleva todos. Si coges dos o tres, igual. ¡Con cuatro, pierdes!', show: [{ t: 'row', items: ['🍬', '🍬', '🍬', '🍬'] }, { t: 'p', x: 'Te toca con **4** → pierdes 😱' }] },
    { say: 'Así que lo bueno es dejarle cuatro a tu hermano. ¿Y cómo? Si a él le toca con ocho, coja lo que coja, tú coges lo que falta para cuatro… y le dejas cuatro. ¡Con ocho también pierde!', show: [{ t: 'tbl', head: true, rows: [['Él coge', 1, 2, 3], ['Tú coges', 3, 2, 1], ['Juntos', '!4', '!4', '!4']] }] },
    { clear: true, say: 'Entonces, los números malos para quien le toca son doce, ocho, cuatro y cero: la tabla del cuatro.', show: [{ t: 'row', items: ['!12', '!8', '!4', '!0'] }, { t: 'p', x: 'Déjale siempre uno de estos' }] },
    { say: 'Empiezas con quince. Para dejarle doce, coges tres.', show: [{ t: 'eq', x: '15 − **3** = 12' }, { t: 'ans', x: 'Coge 3' }] },
    { clear: true, say: 'Y luego, cada vez que tu hermano coja, tú coges lo que falte hasta cuatro. Doce, ocho, cuatro, cero. ¡El último es tuyo!', show: [{ t: 'row', items: ['15', '→ 12', '→ 8', '→ 4', '!→ 0 🏆'], gap: 300 }] },
    { say: 'La idea clave: en los juegos, piensa hacia atrás desde el final, y busca los números que hacen perder al otro.', show: [{ t: 'idea', x: 'Piensa **hacia atrás**: deja siempre al otro en la **tabla del 4**.' }] },
  ] },

{ id: 'pagar', level: 3, emoji: '💶', title: 'Pagar 30 euros', cat: 'No olvidar ningún caso',
  q: 'Tienes muchas **monedas de 2 €** y muchos **billetes de 5 €**. Quieres pagar **exactamente 30 €**.\n\n¿De **cuántas formas distintas** puedes hacerlo? (Puedes usar solo monedas, solo billetes, o mezclar.)',
  ask: '¿Cuántas formas?', ph: 'Escribe solo el número de formas', ans: { num: 4, also: [0, 2, 6, 15, 10, 5] },
  traps: [{ v: 2, m: 'Has encontrado las fáciles (solo monedas, solo billetes). ¿Se pueden mezclar?' }, { v: 3, m: '¡Casi! Prueba con todos los números de billetes posibles: 0, 1, 2, 3…' }, { v: 7, m: 'Cuidado: con 1 billete de 5 €, ¿puedes completar 30 € con monedas de 2 €?' }, { v: 6, m: 'Comprueba cada caso: ¿siempre se puede completar con monedas de 2 €?' }, { v: 5, m: 'Comprueba cada caso: ¿siempre se puede completar con monedas de 2 €?' }],
  hints: ['Ve con **orden**: prueba con 0 billetes, luego con 1 billete, con 2 billetes…',
    'Con cada número de billetes, lo que falta hasta 30 € hay que pagarlo con monedas de 2 €. ¿Siempre se puede?',
    'Con 1 billete faltan 25 €, que es **impar**: con monedas de 2 € no se puede. ¡Solo valen los números **pares** de billetes!',
    'Prueba 0, 2, 4 y 6 billetes (con 8 billetes te pasas: 40 €). Cuenta cuántos funcionan.'],
  answer: '4 formas', idea: 'Haz una **tabla ordenada**. Con monedas de 2 € solo se pagan cantidades **pares**, así que los billetes tienen que dejar una cantidad par.',
  steps: ['0 billetes → 30 € = 15 monedas ✓', '1, 3 o 5 billetes → faltan 25 €, 15 € o 5 € (impares) ✗', '2 billetes → 10 monedas ✓ · 4 billetes → 5 monedas ✓ · 6 billetes → 0 monedas ✓', 'Total: **4** formas.'],
  film: [
    { clear: true, say: 'Monedas de dos euros y billetes de cinco. Hay que pagar treinta euros justos. Hacemos una tabla, probando con cero billetes, con uno, con dos…', show: [{ t: 'tbl', k: 't', head: true, rows: [['Billetes de 5 €', 'Faltan', 'Monedas de 2 €']] }] },
    { say: 'Con cero billetes faltan treinta euros: quince monedas. ¡Vale!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Billetes de 5 €', 'Faltan', 'Monedas de 2 €'], [0, '30 €', '!15 ✓']] }] },
    { say: 'Con un billete faltan veinticinco. Pero con monedas de dos euros solo salen números pares. ¡No se puede!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Billetes de 5 €', 'Faltan', 'Monedas de 2 €'], [0, '30 €', '!15 ✓'], [1, '25 €', '✗ impar']] }] },
    { say: 'Con dos billetes faltan veinte: diez monedas. Con tres faltan quince: impar, no. Con cuatro faltan diez: cinco monedas.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Billetes de 5 €', 'Faltan', 'Monedas de 2 €'], [0, '30 €', '!15 ✓'], [1, '25 €', '✗ impar'], [2, '20 €', '!10 ✓'], [3, '15 €', '✗ impar'], [4, '10 €', '!5 ✓']] }] },
    { say: 'Con cinco faltan cinco: no. Con seis, treinta justos, y cero monedas. ¡Vale! Con más billetes nos pasamos.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Billetes de 5 €', 'Faltan', 'Monedas de 2 €'], [0, '30 €', '!15 ✓'], [1, '25 €', '✗ impar'], [2, '20 €', '!10 ✓'], [3, '15 €', '✗ impar'], [4, '10 €', '!5 ✓'], [5, '5 €', '✗ impar'], [6, '0 €', '!0 ✓']] }] },
    { clear: true, say: 'Las que valen: cero, dos, cuatro y seis billetes. Cuatro formas.', show: [{ t: 'row', label: 'Billetes:', items: ['!0', '!2', '!4', '!6'] }, { t: 'ans', x: '4 formas' }] },
    { say: 'La idea clave: haz una tabla con orden para no olvidar ningún caso. Y fíjate: con monedas de dos euros solo se pagan cantidades pares.', show: [{ t: 'idea', x: 'Tabla **ordenada**: con monedas de 2 € solo se pagan cantidades **pares**.' }] },
  ] },

{ id: 'consecutivos', level: 3, emoji: '🔢', title: 'Cinco números seguidos', cat: 'El número del medio',
  q: 'Cinco números **seguidos** (como 7, 8, 9, 10, 11) suman **100**.\n\n¿Cuál es el **mayor** de los cinco?',
  ask: '¿Cuál es el mayor?', ph: 'Un número', ans: { num: 22, also: [18, 19, 20, 21, 100] },
  traps: [{ v: 20, m: 'Ese es el del medio. ¿Y el mayor?' }, { v: 18, m: 'Ese es el menor. ¿Y el mayor?' }, { v: 24, m: 'Comprueba: ¿suman 100 los cinco números que acaban en 24?' }, { v: 21, m: 'Comprueba: ¿suman 100 los cinco números que acaban en 21?' }],
  hints: ['Prueba con el ejemplo: ¿cuánto suman 7, 8, 9, 10 y 11? ¿Qué relación tiene con el 9?',
    '7 + 8 + 9 + 10 + 11 = 45 = 5 × 9. ¡Es 5 veces el número del **medio**!',
    'Al de antes del medio le falta 1 y al de después le sobra 1: se compensan. Así que la suma es 5 × (el del medio).',
    'Si 5 × (el del medio) = 100, el del medio es 20. ¿Cuáles son los cinco números? ¿Y el mayor?'],
  answer: '22 (los números son 18, 19, 20, 21 y 22)', idea: 'En números seguidos, lo que le falta a uno le sobra a otro: con 5 números, la suma es **5 × el del medio**.',
  steps: ['Los de los lados se compensan: el de −1 con el de +1, el de −2 con el de +2.', 'Suma = 5 × (el del medio) → el del medio = 100 : 5 = **20**.', 'Los números: 18, 19, **20**, 21, 22 → el mayor es **22**.', 'Comprobación: 18 + 19 + 20 + 21 + 22 = 100 ✓.'],
  film: [
    { clear: true, say: 'Cinco números seguidos que suman cien. Miremos primero el ejemplo: siete, ocho, nueve, diez y once.', show: [{ t: 'row', items: ['7', '8', '!9', '10', '11'] }, { t: 'eq', x: '7 + 8 + 9 + 10 + 11 = 45' }] },
    { say: 'Al siete le faltan dos para el nueve, y al once le sobran dos. Al ocho le falta uno, y al diez le sobra uno. ¡Se compensan! Es como tener cinco nueves.', show: [{ t: 'eq', x: '45 = 5 × **9**' }] },
    { clear: true, say: 'Con nuestros números pasa lo mismo: la suma es cinco veces el número del medio. Cien entre cinco: veinte.', show: [{ t: 'eq', x: '100 : 5 = **20**' }, { t: 'row', k: 'r', items: ['?', '?', '!20', '?', '?'] }] },
    { say: 'Y alrededor del veinte: dieciocho, diecinueve, veinte, veintiuno y veintidós.', show: [{ t: 'row', k: 'r', items: ['18', '19', '!20', '21', '+22'] }] },
    { say: 'Comprobamos que suman cien. El mayor es el veintidós.', show: [{ t: 'eq', x: '18 + 19 + 20 + 21 + 22 = 100 ✓' }, { t: 'ans', x: '22' }] },
    { clear: true, say: 'La idea clave: en números seguidos, lo que le falta a uno le sobra a otro. La suma es el número del medio, por cuántos números hay.', show: [{ t: 'ans', x: '22' }, { t: 'idea', x: '5 números seguidos: la suma es **5 × el del medio**.' }] },
  ] },

// --- Nivel 4 ---
{ id: 'minimo30', level: 4, emoji: '🔎', title: 'El número más pequeño', cat: 'Construir el mejor número',
  qSay: '¿Cuál es el número más pequeño cuyas cifras suman treinta? Un número sin coma. Por ejemplo, las cifras de ochocientos setenta y cinco suman ocho más siete más cinco, veinte.',
  q: '¿Cuál es el **número más pequeño** cuyas cifras suman **30**? (Un número sin coma, como 875.)\n(Por ejemplo, las cifras de 875 suman 8 + 7 + 5 = 20.)',
  ask: '¿Qué número es?', ph: 'Un número', ans: { num: 3999, also: [3, 9, 27, 30] },
  traps: [{ v: 9993, m: 'Tiene las cifras buenas… ¡pero en mal orden! ¿Dónde tiene que ir la cifra pequeña?' }, { v: 9399, m: 'Tiene las cifras buenas… ¡pero en mal orden! ¿Dónde tiene que ir la cifra pequeña?' }, { v: 9939, m: 'Tiene las cifras buenas… ¡pero en mal orden! ¿Dónde tiene que ir la cifra pequeña?' }, { v: 6888, m: 'Sus cifras suman 30, sí. Pero hay otro de 4 cifras más pequeño.' }, { v: 39999, m: 'Revisa: ¿cuánto suman sus cifras?' }, { v: 999, m: '¿Cuánto suman las cifras de 999?' }, { v: 2999, m: 'Revisa: ¿cuánto suman sus cifras?' }],
  why: '¿Cómo sabes que no hay uno más pequeño?',
  hints: ['Un número con **menos cifras** siempre es más pequeño. ¿Cuántas cifras necesitas, como mínimo, para sumar 30?',
    'La cifra más grande es el 9. Con 3 cifras, como mucho sumas 9 + 9 + 9 = 27. ¡No llega! Necesitas **4 cifras**.',
    'Con 4 cifras, quieres que la **primera** sea lo más pequeña posible. Así que las otras tres tienen que ser lo más grandes posible.',
    'Las tres últimas cifras: 9, 9, 9 (suman 27). ¿Qué cifra falta delante para llegar a 30?'],
  answer: '3999', idea: '**Pocas cifras** primero; después, la cifra **pequeña delante** y las grandes (los 9) detrás.',
  steps: ['Con 3 cifras, el máximo es 9 + 9 + 9 = 27, menos de 30 → hacen falta **4 cifras**.', 'Para que sea pequeño, la primera cifra debe ser la menor posible → las demás, lo más grandes: **999**.', '30 − 27 = **3** → el número es **3999**.', 'Empezar por 1 o por 2 es imposible: las otras tres cifras tendrían que sumar 29 o 28, y como mucho suman 27.'],
  film: [
    { clear: true, say: 'Buscamos el número más pequeño cuyas cifras sumen treinta. Primera pregunta: ¿cuántas cifras necesita?', show: [{ t: 'h', x: 'Cifras que suman 30' }] },
    { say: 'La cifra más grande es el nueve. Con tres cifras, como mucho, nueve más nueve más nueve: veintisiete. ¡No llega a treinta!', show: [{ t: 'row', items: ['9', '9', '9'] }, { t: 'eq', x: '9 + 9 + 9 = 27 ❌ no llega a 30' }] },
    { clear: true, say: 'Así que necesitamos cuatro cifras. Y entre los números de cuatro cifras, es más pequeño el que tiene la primera cifra más pequeña.', show: [{ t: 'row', k: 'r', items: ['!?', '?', '?', '?'] }, { t: 'p', x: 'La **primera** cifra, lo más pequeña posible' }] },
    { say: 'Para que la primera sea pequeña, las otras tres tienen que ser lo más grandes posible: nueve, nueve, nueve.', show: [{ t: 'row', k: 'r', items: ['?', '+9', '+9', '+9'] }] },
    { say: 'Ya suman veintisiete. Faltan tres. ¡La primera cifra es un tres!', show: [{ t: 'row', k: 'r', items: ['!3', '9', '9', '9'] }, { t: 'eq', x: '30 − 27 = **3**' }] },
    { clear: true, say: 'Tres mil novecientos noventa y nueve. La idea clave: para hacer un número pequeño, usa pocas cifras, y pon la pequeña delante y las grandes detrás.', show: [{ t: 'ans', x: '3999' }, { t: 'idea', x: '**Pocas cifras**, la pequeña **delante** y los 9 **detrás**.' }] },
  ] },

{ id: 'etiquetas', level: 4, emoji: '📦', title: 'Las cajas mal etiquetadas', cat: 'Lógica',
  q: 'Hay tres cajas cerradas. Una tiene solo **manzanas** 🍎, otra solo **naranjas** 🍊 y otra una **mezcla** de las dos. Cada caja lleva una etiqueta: «Manzanas», «Naranjas» o «Mezcla»… pero **todas las etiquetas están mal puestas**.\n\nPuedes sacar **una sola fruta** de **una sola caja**, sin mirar dentro. ¿De qué caja debes sacarla para saber qué hay en **las tres**?',
  qSay: 'Hay tres cajas cerradas. Una tiene solo manzanas, otra solo naranjas, y otra una mezcla de las dos. Cada caja lleva una etiqueta: manzanas, naranjas o mezcla. Pero todas las etiquetas están mal puestas. Puedes sacar una sola fruta de una sola caja, sin mirar dentro. ¿De qué caja debes sacarla para saber qué hay en las tres?',
  ask: '¿De qué caja sacas la fruta?', ph: 'Escribe la etiqueta de esa caja', ans: { text: ['mezcla', 'mezclada', 'mixta'], first: ['mezcla', 'mezclada', 'mixta', 'manzanas', 'manzana', 'naranjas', 'naranja'] },
  traps: [{ v: 'manzanas', m: 'Si sacas de «Manzanas» y sale una naranja, ¿esa caja es de naranjas o de mezcla? No podrías saberlo.' }, { v: 'naranjas', m: 'Si sacas de «Naranjas» y sale una manzana, ¿esa caja es de manzanas o de mezcla? No podrías saberlo.' }],
  why: '¿Cómo descubres después las otras dos cajas?',
  hints: ['Usa bien la pista: **todas** las etiquetas están mal. Para cada caja, piensa: ¿qué puede haber dentro de verdad?',
    'Prueba con la caja «Manzanas»: no tiene manzanas, así que tiene naranjas o la mezcla. Si sacas una naranja, ¿sabes cuál de las dos es?',
    'Busca una caja en la que **cualquier** fruta que saques te diga seguro lo que tiene. ¿En qué caja **no** puede haber mezcla?',
    'La caja «Mezcla» no tiene mezcla: tiene solo manzanas o solo naranjas. Una fruta te dice cuál… y después las otras dos cajas salen solas.'],
  answer: 'De la caja que pone «Mezcla»', idea: 'Saca de la caja de la que **más sabes**: la que pone «Mezcla» seguro que **no** es mezcla, así que una sola fruta lo dice todo.',
  steps: ['La caja «Mezcla» no es mezcla → tiene solo manzanas o solo naranjas.', 'Sacas una fruta: si es una manzana, esa caja es la de **manzanas**.', 'La caja «Naranjas» no tiene naranjas, y las manzanas ya tienen caja → tiene la **mezcla**.', 'La caja «Manzanas» tiene las **naranjas**. (Si sale una naranja, igual pero al revés.)', 'Si sacaras de «Manzanas» y saliera una naranja, no sabrías si es la caja de naranjas o la de mezcla.'],
  film: [
    { clear: true, say: 'Tres cajas, con etiquetas que están todas mal. Solo puedes sacar una fruta de una caja.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Etiqueta', '«Manzanas»', '«Naranjas»', '«Mezcla»'], ['Dentro', '❓', '❓', '❓']] }] },
    { say: 'La pista clave: la caja que pone mezcla no tiene mezcla, porque su etiqueta está mal. Tiene solo manzanas, o solo naranjas.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Etiqueta', '«Manzanas»', '«Naranjas»', '«Mezcla»'], ['Dentro', '❓', '❓', '!🍎 o 🍊']] }] },
    { say: 'Sacamos una fruta de esa caja. Imagina que sale una manzana. Entonces es la caja de las manzanas.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Etiqueta', '«Manzanas»', '«Naranjas»', '«Mezcla»'], ['Dentro', '❓', '❓', '!🍎🍎']] }] },
    { say: 'La caja que pone naranjas no puede tener naranjas, porque está mal. Y las manzanas ya tienen su caja. Así que tiene la mezcla.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Etiqueta', '«Manzanas»', '«Naranjas»', '«Mezcla»'], ['Dentro', '❓', '!🍎🍊', '🍎🍎']] }] },
    { say: 'Y la que pone manzanas se queda con las naranjas. ¡Las tres descubiertas con una sola fruta!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Etiqueta', '«Manzanas»', '«Naranjas»', '«Mezcla»'], ['Dentro', '!🍊🍊', '🍎🍊', '🍎🍎']] }] },
    { clear: true, say: 'Si hubieras sacado de la caja que pone manzanas, y saliera una naranja, no sabrías si es la caja de las naranjas o la de la mezcla. Por eso hay que sacar de la caja que pone mezcla.', show: [{ t: 'p', x: 'De «Manzanas» sale 🍊 → ¿naranjas o mezcla? 🤷' }, { t: 'ans', x: 'De la caja «Mezcla»' }] },
    { say: 'La idea clave: empieza por donde más sabes. La etiqueta equivocada de la mezcla te da la mejor pista.', show: [{ t: 'idea', x: 'Empieza por donde **más sabes**: «Mezcla» seguro que **no** es mezcla.' }] },
  ] },

{ id: 'sumacifras', level: 4, emoji: '🧮', title: 'Todas las cifras', cat: 'Emparejar',
  q: 'Escribes todos los números del **1 al 100** y sumas **todas sus cifras**. Por ejemplo, el 47 aporta 4 + 7 = 11, y el 100 aporta 1 + 0 + 0 = 1.\n\n¿Cuánto da la suma de **todas las cifras**?',
  qSay: 'Escribes todos los números del uno al cien y sumas todas sus cifras. Por ejemplo, el cuarenta y siete aporta cuatro más siete, once. Y el cien aporta uno más cero más cero, uno. ¿Cuánto da la suma de todas las cifras?',
  ask: '¿Cuánto da?', ph: 'Un número', ans: { num: 901, also: [50, 18, 900, 1] },
  traps: [{ v: 5050, m: 'Esa es la suma de los números, no la de sus cifras.' }, { v: 900, m: '¡Casi! ¿Has contado el 100?' }, { v: 450, m: 'Revisa: las cifras de las decenas también cuentan.' }, { v: 451, m: 'Revisa: las cifras de las decenas también cuentan.' }],
  why: '¿Qué truco has usado?',
  hints: ['Sumar uno a uno es larguísimo. **Empareja** números, como cuando sumas 1 + 9, 2 + 8… (el truco de Gauss).',
    'Añade el 0 (no cambia nada) y empareja del 0 al 99: el 0 con el 99, el 1 con el 98, el 2 con el 97… ¿Cuánto suman las cifras de cada pareja?',
    '0 y 99 → 0 + 9 + 9 = 18. 1 y 98 → 1 + 9 + 8 = 18. 23 y 76 → 2 + 3 + 7 + 6 = 18. ¡Siempre 18! ¿Cuántas parejas hay?',
    'Del 0 al 99 hay 100 números → 50 parejas de 18. Y no te olvides del 100.'],
  answer: '901', idea: '**Empareja** cada número con el que le falta para llegar a 99: sus cifras siempre suman **18**.',
  steps: ['Del 0 al 99 emparejamos: 0 y 99, 1 y 98, … 49 y 50.', 'En cada pareja, las decenas suman 9 y las unidades suman 9 → **18**.', '50 parejas × 18 = **900**.', 'Más el 100 (1 + 0 + 0 = 1): **901**.'],
  film: [
    { clear: true, say: 'Sumamos todas las cifras del uno al cien. Una a una sería larguísimo. Usamos el truco de Gauss: emparejar.', show: [{ t: 'h', x: 'Todas las cifras del 1 al 100' }] },
    { say: 'Añadimos el cero, que no suma nada, y lo emparejamos con el noventa y nueve. Sus cifras: cero, nueve y nueve. Dieciocho.', show: [{ t: 'eq', x: '0 y 99 → 0 + 9 + 9 = **18**' }] },
    { say: 'El uno con el noventa y ocho: uno, nueve y ocho. ¡Dieciocho otra vez!', show: [{ t: 'eq', x: '1 y 98 → 1 + 9 + 8 = **18**' }] },
    { say: 'Veintitrés con setenta y seis: dos, tres, siete y seis. ¡Dieciocho! Las decenas se completan hasta nueve, y las unidades también.', show: [{ t: 'eq', x: '23 y 76 → 2 + 3 + 7 + 6 = **18**' }] },
    { clear: true, say: 'Del cero al noventa y nueve hay cien números: cincuenta parejas. Cincuenta por dieciocho: novecientos.', show: [{ t: 'eq', x: '50 parejas × 18 = **900**' }] },
    { say: 'Y no olvidemos el cien, que aporta un uno. Novecientos uno.', show: [{ t: 'eq', x: '900 + 1 = 901' }, { t: 'ans', x: '901' }] },
    { say: 'La idea clave: empareja cada número con el que le falta para noventa y nueve. Sus cifras siempre suman dieciocho.', show: [{ t: 'idea', x: '**Empareja** con lo que falta para 99: siempre **18**.' }] },
  ] },
// ===================== Batch 3 (21 Nov 2026): 3 more per level. Answers: verify3.py =====================
// --- Nivel 1 ---
{ id: 'ladrillo', level: 1, emoji: '🧱', title: 'El ladrillo misterioso', cat: 'Dibujar el problema',
  q: 'Un ladrillo pesa **1 kg más medio ladrillo**.\n\n¿Cuántos kilos pesa un ladrillo **entero**?',
  qSay: 'Un ladrillo pesa un kilo más medio ladrillo. ¿Cuántos kilos pesa un ladrillo entero?',
  ask: '¿Cuántos kg pesa?', ph: 'Un número', ans: { num: 2, also: [1] },
  traps: [{ v: 1.5, m: 'Cuidado: «medio ladrillo» no es medio kilo. ¿Cuánto pesa de verdad medio ladrillo?' }, { v: 1, m: 'Cuidado: «medio ladrillo» no es medio kilo (¡ni cero!). ¿Cuánto pesa de verdad medio ladrillo? Dibújalo.' }, { v: 5, m: 'Cuidado: «medio ladrillo» no es medio kilo. ¿Cuánto pesa de verdad medio ladrillo? Dibújalo partido en dos mitades.' }, { v: 3, m: 'Comprueba: si pesara 3 kg, medio ladrillo pesaría 1 kg y medio. ¿1 kg + 1 kg y medio da 3?' }, { v: 0.5, m: '¿Medio ladrillo pesa medio kilo? Dibuja el ladrillo partido en dos mitades.' }],
  hints: ['**Dibuja** el ladrillo partido en **dos mitades** iguales.',
    'El ladrillo entero = medio ladrillo + medio ladrillo. Y también = 1 kg + medio ladrillo. Compara las dos cosas.',
    'Una mitad del dibujo es el «medio ladrillo». Entonces la **otra mitad** tiene que pesar…',
    'Medio ladrillo pesa 1 kg. Las dos mitades pesan lo mismo. ¿Cuánto pesa el ladrillo entero?'],
  answer: '2 kg', idea: 'Dibuja el ladrillo en **dos mitades**: una mitad es el «medio ladrillo», así que la otra mitad pesa **1 kg**.',
  steps: ['Un ladrillo = medio ladrillo + medio ladrillo.', 'Un ladrillo = **1 kg** + medio ladrillo.', 'Comparando: la otra mitad pesa **1 kg**, así que medio ladrillo = 1 kg.', 'El ladrillo entero = 1 + 1 = **2 kg**. Comprueba: 1 kg + medio ladrillo (1 kg) = 2 kg ✓.'],
  film: [
    { clear: true, say: 'Un ladrillo pesa un kilo más medio ladrillo. Mucha gente dice enseguida: un kilo y medio. ¡Vamos a comprobarlo con un dibujo!', show: [{ t: 'h', x: '🧱 El ladrillo misterioso' }, { t: 'eq', k: 'e', x: '🧱 = 1 kg + medio 🧱' }] },
    { say: 'Dibujamos el ladrillo partido en dos mitades iguales.', show: [{ t: 'row', k: 'r', items: ['#ffa94d|½', '#ffa94d|½'], gap: 300 }] },
    { say: 'Una de las mitades es el medio ladrillo del problema. Así que la otra mitad tiene que ser el kilo.', show: [{ t: 'row', k: 'r', items: ['#ffa94d|½', '!1 kg'] }] },
    { say: 'Pero las dos mitades pesan lo mismo. Así que la primera mitad también pesa un kilo.', show: [{ t: 'row', k: 'r', items: ['!1 kg', '!1 kg'] }, { t: 'eq', k: 'e', x: 'medio 🧱 = **1 kg**' }] },
    { clear: true, say: 'Un kilo más un kilo: el ladrillo pesa dos kilos. Comprobamos: un kilo, más medio ladrillo, que es otro kilo, dos. ¡Cuadra!', show: [{ t: 'eq', x: '🧱 = 1 kg + 1 kg = **2 kg** ✓' }, { t: 'ans', x: '2 kg' }] },
    { say: 'La idea clave: dibuja el problema. Con el dibujo se ve que medio ladrillo pesa un kilo.', show: [{ t: 'idea', x: 'Dibuja **dos mitades**: si una es «medio ladrillo», la otra pesa **1 kg**.' }] },
  ] },

{ id: 'campanas', level: 1, emoji: '🔔', title: 'Las campanadas', cat: 'Contar los espacios',
  q: 'El reloj de la plaza da las **6** con **6 campanadas**. Desde la primera campanada hasta la última pasan **5 segundos**.\n\nCuando da las **12**, con **12 campanadas**, ¿cuántos segundos pasan desde la primera hasta la última?',
  qSay: 'El reloj de la plaza da las seis con seis campanadas. Desde la primera campanada hasta la última pasan cinco segundos. Cuando da las doce, con doce campanadas, ¿cuántos segundos pasan desde la primera hasta la última?',
  ask: '¿Cuántos segundos?', ph: 'Un número', ans: { num: 11, also: [12, 1, 5, 6] },
  traps: [{ v: 10, m: 'Parece el doble… pero ¿cuántos **espacios** hay entre 6 campanadas? Dibújalas.' }, { v: 12, m: '¿Cuánto tiempo pasa entre una campanada y la siguiente? Cuenta los **espacios**, no las campanadas.' }, { v: 1, m: 'Ese es el tiempo entre dos campanadas seguidas. ¿Y desde la primera hasta la última?' }, { v: 13, m: 'Dibuja 12 campanadas en fila: ¿cuántos espacios hay entre ellas?' }],
  hints: ['**Dibuja** las 6 campanadas como puntos en una línea.',
    'Entre 6 campanadas, ¿cuántos **espacios** hay? En esos espacios pasan los 5 segundos.',
    '6 campanadas → 5 espacios → cada espacio dura 1 segundo. ¿Cuántos espacios hay entre 12 campanadas?',
    'Entre 12 campanadas hay un espacio menos que campanadas. Cada espacio, 1 segundo.'],
  answer: '11 segundos', idea: 'El tiempo pasa en los **espacios** entre campanadas, y siempre hay **un espacio menos** que campanadas.',
  steps: ['6 campanadas tienen **5** espacios → 5 segundos : 5 = **1 segundo** por espacio.', '12 campanadas tienen **11** espacios.', '11 × 1 segundo = **11 segundos** (¡no 10!).'],
  film: [
    { clear: true, say: 'A las seis, seis campanadas, y de la primera a la última pasan cinco segundos. Mucha gente piensa: doce es el doble de seis, así que diez segundos. Vamos a verlo.', show: [{ t: 'row', k: 'r', items: Array(6).fill('🔔'), gap: 200 }] },
    { say: 'Fíjate en los espacios entre campanadas. Entre seis campanadas solo hay cinco espacios.', show: [{ t: 'row', k: 'r', sm: true, items: ['🔔', '!1', '🔔', '!2', '🔔', '!3', '🔔', '!4', '🔔', '!5', '🔔'], gap: 90 }] },
    { say: 'Los cinco segundos se reparten en cinco espacios: un segundo cada uno.', show: [{ t: 'eq', x: '5 segundos : 5 espacios = **1 segundo**' }] },
    { clear: true, say: 'A las doce hay doce campanadas. Y entre ellas, once espacios. Siempre un espacio menos que campanadas.', show: [{ t: 'row', sm: true, items: Array(12).fill('🔔'), gap: 80 }, { t: 'eq', x: '12 campanadas → **11** espacios' }] },
    { say: 'Once espacios de un segundo: once segundos.', show: [{ t: 'eq', x: '11 × 1 = **11** segundos' }, { t: 'ans', x: '11 segundos' }] },
    { clear: true, say: 'La idea clave: cuenta los espacios, no las campanadas. Siempre hay uno menos.', show: [{ t: 'ans', x: '11 segundos' }, { t: 'idea', x: 'Cuenta los **espacios**: siempre hay **uno menos** que campanadas.' }] },
  ] },

{ id: 'barco', level: 1, emoji: '🚢', title: 'La escalera del barco', cat: 'Imaginar la situación',
  q: 'Un barco está en el puerto. Por un costado cuelga una **escalera de cuerda**, y **10 peldaños** quedan por encima del agua.\n\nSube la marea: el agua sube **lo que mide 1 peldaño cada hora**.\n\nDespués de **3 horas**, ¿cuántos peldaños quedan por encima del agua?',
  qSay: 'Un barco está en el puerto. Por un costado cuelga una escalera de cuerda, y diez peldaños quedan por encima del agua. Sube la marea: el agua sube lo que mide un peldaño cada hora. Después de tres horas, ¿cuántos peldaños quedan por encima del agua?',
  pic: `<svg viewBox="0 0 420 300">${barco(0)}</svg>`,
  ask: '¿Cuántos peldaños fuera del agua?', ph: 'Un número', ans: { num: 10, also: [1, 3] },
  traps: [{ v: 7, m: 'Has hecho la cuenta… pero ¿has imaginado la escena de verdad? Mira bien el dibujo.' }, { v: 13, m: 'El agua sube, no baja. Y el barco… ¿qué hace?' }, { v: 0, m: 'Has hecho la cuenta… pero ¿has imaginado la escena de verdad? Mira bien el dibujo.' }],
  why: '¿Por qué?',
  hints: ['Antes de hacer cuentas, **imagina la escena** de verdad: un barco en el puerto, y el agua subiendo.',
    'Mira el dibujo: el **muro** del puerto está fijo en el suelo. ¿Y el barco? ¿Está fijo?',
    'Un barco **flota**. ¿Qué le pasa a algo que flota cuando sube el agua?',
    'El barco sube con el agua, y la escalera está atada al barco. ¿Cambia el número de peldaños que quedan fuera?'],
  answer: '10 peldaños (el barco flota y sube con el agua)', idea: 'Antes de hacer cuentas, **imagina la situación**: el barco flota, sube con la marea, y la escalera sube con él.',
  steps: ['El barco **flota**: cuando el agua sube, el barco sube lo mismo.', 'La escalera está atada al barco: también sube lo mismo.', 'Siguen quedando **10** peldaños fuera. (10 − 3 = 7 solo sería verdad si la escalera estuviera clavada al muelle.)'],
  film: [
    { clear: true, say: 'Un barco en el puerto, con una escalera de cuerda colgando. Diez peldaños fuera del agua. A la izquierda, el muro del puerto, con marcas para medir la marea.', show: [{ t: 'svg', vb: '0 0 420 300', h: '66%', x: barco(0) }] },
    { say: 'Sube la marea: un peldaño cada hora. Mucha gente calcula: diez menos tres, siete. Pero, ¿qué hace un barco cuando sube el agua?', show: [{ t: 'p', x: '10 − 3 = 7? 🤔' }] },
    { clear: true, say: '¡Flota! El barco sube con el agua. Y la escalera, que está atada al barco, sube también.', show: [{ t: 'svg', vb: '0 0 420 300', h: '66%', x: barco(3) }] },
    { say: 'En el muro del puerto, el agua ha subido tres marcas. Pero en la escalera siguen quedando diez peldaños fuera.', show: [{ t: 'ans', x: '10 peldaños' }] },
    { clear: true, say: 'La idea clave: antes de hacer cuentas, imagina lo que pasa de verdad.', show: [{ t: 'ans', x: '10 peldaños' }, { t: 'idea', x: 'Antes de calcular, **imagina la escena**: el barco **flota** y sube con el agua.' }] },
  ] },

// --- Nivel 2 ---
{ id: 'canicas', level: 2, emoji: '🔵', title: 'Las canicas', cat: 'Lo que no cambia',
  q: 'Ana tiene **25 canicas** y Bea tiene **5**. Ana le da algunas canicas a Bea, y ahora **Bea tiene el doble que Ana**.\n\n¿Cuántas canicas le ha dado Ana a Bea?',
  qSay: 'Ana tiene veinticinco canicas y Bea tiene cinco. Ana le da algunas canicas a Bea, y ahora Bea tiene el doble que Ana. ¿Cuántas canicas le ha dado Ana a Bea?',
  ask: '¿Cuántas le ha dado?', ph: 'Un número', ans: { num: 15, also: [10, 20, 30, 3] },
  traps: [{ v: 10, m: 'Esas son las que le **quedan** a Ana. ¿Cuántas le ha **dado**?' }, { v: 20, m: 'Esas son las que tiene Bea al final. ¿Cuántas le ha dado Ana?' }, { v: 5, m: 'Comprueba: si Ana le da 5, Ana tiene 20 y Bea 10. ¿Bea tiene el doble?' }, { v: 30, m: 'Ese es el total de canicas. Ahora piensa cómo se reparte al final.' }],
  why: '¿Cómo lo has pensado?',
  hints: ['Hay algo que **no cambia** cuando Ana le da canicas a Bea. ¿Qué es?',
    'El **total** de canicas no cambia: 25 + 5 = 30.',
    'Al final Bea tiene el doble que Ana: si Ana tiene **una parte**, Bea tiene **dos partes** iguales. 30 canicas en 3 partes…',
    'Al final Ana tiene 10 y Bea 20. Ana empezó con 25: ¿cuántas ha dado?'],
  answer: '15 canicas (al final Ana tiene 10 y Bea 20)', idea: 'Cuando las cosas pasan de uno a otro, **el total no cambia**. Empieza por el total y repártelo.',
  steps: ['Total: 25 + 5 = **30** canicas, y no cambia.', 'Al final, Ana = 1 parte y Bea = 2 partes → 3 partes = 30 → 1 parte = **10**.', 'Ana acaba con 10 y Bea con 20 (el doble ✓).', 'Ana tenía 25 y acaba con 10 → ha dado 25 − 10 = **15**.'],
  film: [
    { clear: true, say: 'Ana tiene veinticinco canicas y Bea cinco. Ana le da algunas a Bea, y al final Bea tiene el doble que Ana.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Ana', 'Bea'], ['Al principio', 25, 5], ['Al final', '?', '?']] }] },
    { say: 'Las canicas pasan de una a otra, pero no desaparecen. El total no cambia: treinta.', show: [{ t: 'eq', k: 'e', x: 'Total: 25 + 5 = **30**, siempre' }] },
    { clear: true, say: 'Al final, Bea tiene el doble. Si Ana tiene una parte, Bea tiene dos partes iguales. Tres partes en total.', show: [{ t: 'row', k: 'r', items: ['#ffc9c9|A', '#a5d8ff|B', '#a5d8ff|B'], gap: 250 }, { t: 'eq', k: 'e', x: '3 partes = 30 canicas' }] },
    { say: 'Treinta entre tres: diez cada parte. Ana tiene diez y Bea veinte.', show: [{ t: 'row', k: 'r', items: ['#ffc9c9|10', '#a5d8ff|10', '#a5d8ff|10'] }, { t: 'eq', k: 'e', x: '30 : 3 = **10** → Ana 10, Bea 20' }] },
    { clear: true, say: 'Ana empezó con veinticinco y acaba con diez. Le ha dado quince.', show: [{ t: 'tbl', head: true, rows: [['', 'Ana', 'Bea'], ['Al principio', 25, 5], ['Al final', '!10', '!20']] }, { t: 'eq', x: '25 − 10 = **15**' }, { t: 'ans', x: '15 canicas' }] },
    { clear: true, say: 'La idea clave: cuando las cosas pasan de uno a otro, el total no cambia. Empieza por el total.', show: [{ t: 'ans', x: '15 canicas' }, { t: 'idea', x: 'Pasan de uno a otro → **el total no cambia**. Empieza por ahí.' }] },
  ] },

{ id: 'torneo', level: 2, emoji: '🎾', title: 'El torneo de tenis', cat: 'Contar de otra forma',
  q: 'En un torneo de tenis hay **32 jugadores**. En cada partido juegan dos, y **el que pierde queda eliminado**. Se juega hasta que solo queda **el campeón**.\n\n¿Cuántos **partidos** se juegan en total?',
  qSay: 'En un torneo de tenis hay treinta y dos jugadores. En cada partido juegan dos, y el que pierde queda eliminado. Se juega hasta que solo queda el campeón. ¿Cuántos partidos se juegan en total?',
  ask: '¿Cuántos partidos?', ph: 'Un número', ans: { num: 31, also: [16, 8, 4, 2, 1, 32] },
  traps: [{ v: 16, m: 'Esos son los partidos de la **primera ronda**. ¿Y después?' }, { v: 32, m: 'Casi. ¿El campeón pierde algún partido?' }, { v: 30, m: 'Revisa las rondas: 16, 8, 4, 2… ¿y la final?' }, { v: 64, m: 'En cada partido juegan dos, pero solo **uno** queda eliminado.' }, { v: 15, m: '¿Has contado los 16 partidos de la primera ronda?' }, { v: 63, m: 'Has sumado **jugadores**. En cada partido juegan dos: ¿cuántos **partidos** hay en cada ronda?' }, { v: 62, m: 'Has sumado **jugadores**. En cada partido juegan dos: ¿cuántos **partidos** hay en cada ronda?' }],
  why: '¿Cómo lo has contado?',
  hints: ['Prueba primero con un torneo pequeño, de **4 jugadores**. ¿Cuántos partidos hay?',
    'Con 32 jugadores, en la primera ronda hay 16 partidos y quedan 16 jugadores. Sigue ronda a ronda.',
    'Hay un truco más rápido: en cada partido queda eliminado **un** jugador. ¿Cuántos jugadores tienen que quedar eliminados?',
    'Quedan eliminados todos menos el campeón: 32 − 1. Y cada partido elimina a uno.'],
  answer: '31 partidos', idea: 'Cada partido elimina **a un jugador**. Para que quede solo el campeón hay que eliminar a 31 → **31 partidos**.',
  steps: ['Ronda a ronda: 16 + 8 + 4 + 2 + 1 = **31** partidos.', 'Más rápido: cada partido elimina a **un** jugador.', 'Hay que eliminar a todos menos al campeón: 32 − 1 = **31** → 31 partidos.', '¡Con 1000 jugadores serían 999 partidos, sin contar rondas!'],
  film: [
    { clear: true, say: 'Treinta y dos jugadores. En cada partido, el que pierde se va a casa. Hasta que solo queda el campeón.', show: [{ t: 'h', x: '🎾 Torneo de 32 jugadores' }, { t: 'eq', x: '32 jugadores → 🏆 1 campeón' }] },
    { say: 'Podemos contar ronda a ronda. Primera ronda, dieciséis partidos. Quedan dieciséis jugadores: ocho partidos. Luego cuatro, dos, y la final.', show: [{ t: 'tbl', head: true, rows: [['Ronda', '1.ª', '2.ª', 'Cuartos', 'Semifinal', 'Final'], ['Partidos', 16, 8, 4, 2, 1]] }] },
    { say: 'Dieciséis más ocho más cuatro más dos más uno: treinta y uno.', show: [{ t: 'eq', x: '16 + 8 + 4 + 2 + 1 = **31**' }] },
    { clear: true, say: 'Pero hay un truco más rápido. En cada partido pierde uno, y se va a casa. Un partido, un eliminado.', show: [{ t: 'eq', x: '1 partido = **1** eliminado' }] },
    { say: 'Al final se han ido todos menos el campeón: treinta y uno. Así que hubo treinta y un partidos.', show: [{ t: 'eq', x: '32 − 1 = **31** eliminados → **31** partidos' }, { t: 'ans', x: '31 partidos' }] },
    { clear: true, say: 'La idea clave: cuenta de otra forma. En vez de contar partidos, cuenta a los que pierden.', show: [{ t: 'ans', x: '31 partidos' }, { t: 'idea', x: 'Cuenta a los que **pierden**: cada partido elimina a **uno**.' }] },
  ] },

{ id: 'botella', level: 2, emoji: '🫙', title: 'El bote de agua', cat: 'Comparar',
  q: 'Un bote **lleno** de agua pesa **1000 gramos**. El mismo bote **lleno hasta la mitad** pesa **600 gramos**.\n\n¿Cuánto pesa el bote **vacío**?',
  qSay: 'Un bote lleno de agua pesa mil gramos. El mismo bote, lleno hasta la mitad, pesa seiscientos gramos. ¿Cuánto pesa el bote vacío?',
  ask: '¿Cuántos gramos?', ph: 'Un número', ans: { num: 200, also: [400, 800, 1000, 600, 2] },
  traps: [{ v: 400, m: 'Eso pesa **la mitad del agua**. ¿Y el bote solo?' }, { v: 500, m: 'La mitad de 1000 es 500… pero ¡el bote también pesa algo!' }, { v: 800, m: 'Eso pesa toda el agua. ¿Y el bote solo?' }, { v: 100, m: 'Comprueba: si el bote pesara 100 g, toda el agua pesaría 900 g. Entonces, lleno hasta la mitad, ¿pesaría 600 g?' }],
  hints: ['Compara los dos botes: ¿qué tiene uno que no tenga el otro?',
    'La diferencia, 1000 − 600 = 400 gramos, es lo que pesa **la mitad del agua**.',
    'Si la mitad del agua pesa 400 g, ¿cuánto pesa **toda** el agua?',
    'Toda el agua pesa 800 g, y el bote lleno pesa 1000 g. ¿Qué queda si quitas el agua?'],
  answer: '200 gramos', idea: '**Compara** los dos botes: la diferencia es la mitad del agua (400 g). Con eso sabes lo que pesa el agua, y lo que sobra es el bote.',
  steps: ['Lleno − a la mitad = 1000 − 600 = **400 g** = la mitad del agua.', 'Toda el agua: 2 × 400 = **800 g**.', 'Bote vacío: 1000 − 800 = **200 g**.', 'Comprueba: 200 + 400 = 600 ✓.'],
  film: [
    { clear: true, say: 'Lleno, mil gramos. A la mitad, seiscientos. Mucha gente dice: la mitad de mil, quinientos. ¡Pero el bote también pesa!', show: [{ t: 'tbl', head: true, rows: [['', 'Pesa'], ['🫙 + 💧💧 lleno', '1000 g'], ['🫙 + 💧 a la mitad', '600 g']] }] },
    { say: 'Comparamos. El bote lleno tiene la mitad del agua de más. Esa mitad del agua pesa mil menos seiscientos: cuatrocientos gramos.', show: [{ t: 'eq', x: '💧 = 1000 − 600 = **400 g**' }] },
    { say: 'Así que toda el agua, las dos mitades, pesa ochocientos gramos.', show: [{ t: 'eq', x: '💧💧 = 2 × 400 = **800 g**' }] },
    { clear: true, say: 'El bote lleno pesa mil. Si quitamos los ochocientos del agua, queda el bote: doscientos gramos.', show: [{ t: 'eq', x: '🫙 = 1000 − 800 = **200 g**' }, { t: 'ans', x: '200 g' }] },
    { say: 'Comprobamos: doscientos del bote, más cuatrocientos de la mitad del agua, seiscientos. ¡Cuadra!', show: [{ t: 'eq', x: '200 + 400 = 600 ✓' }] },
    { clear: true, say: 'La idea clave: compara las dos situaciones. La diferencia te dice cuánto pesa lo que ha cambiado.', show: [{ t: 'ans', x: '200 g' }, { t: 'idea', x: '**Compara**: la diferencia es lo que pesa el agua que falta.' }] },
  ] },

// --- Nivel 3 ---
{ id: 'gallinas', level: 3, emoji: '🐔', title: 'Las gallinas ponedoras', cat: 'Ir a uno',
  q: '**3 gallinas** ponen **3 huevos** en **3 días**.\n\nA ese mismo ritmo, ¿cuántos huevos ponen **6 gallinas** en **6 días**?',
  qSay: 'Tres gallinas ponen tres huevos en tres días. A ese mismo ritmo, ¿cuántos huevos ponen seis gallinas en seis días?',
  ask: '¿Cuántos huevos?', ph: 'Un número', ans: { num: 12, also: [1, 2, 3, 6] },
  traps: [{ v: 6, m: '¡Es lo que parece! Comprueba con **una sola** gallina: ¿cuántos huevos pone en 3 días?' }, { v: 36, m: 'Ve primero a **una** gallina: ¿cuántos huevos pone en 3 días?' }, { v: 24, m: 'Revisa: ¿cuántos huevos pone **una** gallina en 6 días?' }, { v: 18, m: 'Paso a paso: primero, ¿cuántos huevos pone **una** gallina en 3 días?' }],
  hints: ['Empieza por **una sola gallina**. Si 3 gallinas ponen 3 huevos en 3 días, ¿cuántos pone **una** gallina en esos 3 días?',
    'Una gallina pone **1 huevo cada 3 días**. ¿Cuántas veces caben 3 días en 6 días?',
    '¿Cuántos huevos pone **una** gallina en 6 días? Cuando lo sepas, piensa en las 6 gallinas.',
    'Una gallina pone 2 huevos en 6 días. Tienes 6 gallinas: multiplica.'],
  answer: '12 huevos', idea: 'Ve primero **a uno**: ¿cuánto hace **una** gallina? Después, multiplica por los días y por las gallinas.',
  steps: ['3 gallinas, 3 huevos → cada gallina pone **1 huevo cada 3 días**.', 'En 6 días, cada gallina pone **2** huevos.', '6 gallinas × 2 huevos = **12** huevos.', '(Doble de gallinas → doble de huevos; doble de días → doble otra vez: 3 × 2 × 2 = 12.)'],
  film: [
    { clear: true, say: 'Tres gallinas, tres huevos, tres días. Mucha gente contesta: seis gallinas, seis días, seis huevos. ¡Pero no!', show: [{ t: 'row', items: ['🐔', '🐔', '🐔'] }, { t: 'eq', x: '3 gallinas · 3 días → 🥚🥚🥚' }] },
    { say: 'Vamos primero a una sola gallina. Si tres gallinas ponen tres huevos, cada una pone uno. Una gallina pone un huevo cada tres días.', show: [{ t: 'eq', k: 'e', x: '🐔 · 3 días → 🥚' }] },
    { say: 'En seis días, el doble de tiempo, una gallina pone dos huevos.', show: [{ t: 'eq', k: 'e', x: '🐔 · 6 días → 🥚🥚' }] },
    { clear: true, say: 'Y tenemos seis gallinas, cada una con dos huevos. Seis por dos, doce.', show: [{ t: 'row', items: Array(6).fill('🐔'), gap: 100 }, { t: 'row', sm: true, items: Array(12).fill('🥚'), gap: 70 }, { t: 'eq', x: '6 × 2 = **12** huevos' }] },
    { clear: true, say: 'Fíjate: doble de gallinas, doble de huevos. Doble de días, doble otra vez. Tres, por dos, por dos: doce.', show: [{ t: 'eq', x: '3 × 2 × 2 = **12**' }, { t: 'ans', x: '12 huevos' }] },
    { clear: true, say: 'La idea clave: ve primero a uno. ¿Cuánto hace una sola gallina? Luego, multiplica.', show: [{ t: 'ans', x: '12 huevos' }, { t: 'idea', x: 'Ve primero **a uno**: ¿cuánto pone **una** gallina? Luego multiplica.' }] },
  ] },

{ id: 'nidosnitres', level: 3, emoji: '🎯', title: 'Ni entre 2 ni entre 3', cat: 'Buscar el patrón',
  q: '¿Cuántos números del **1 al 100** **no** se pueden dividir exactamente **ni entre 2 ni entre 3**?\n(Por ejemplo, el 7 cuenta: 7 : 2 y 7 : 3 tienen resto. El 9 no cuenta: 9 : 3 = 3, exacto.)',
  qSay: '¿Cuántos números del uno al cien no se pueden dividir exactamente, ni entre dos, ni entre tres? Por ejemplo, el siete cuenta: siete entre dos y siete entre tres tienen resto. El nueve no cuenta: nueve entre tres es tres, exacto.',
  ask: '¿Cuántos números?', ph: 'Un número', ans: { num: 33, also: [1, 2, 3, 5, 6, 16, 32, 96, 97, 100] },
  traps: [{ v: 17, m: 'Has quitado los de la tabla del 2 y los de la del 3… pero algunos, como el 6 o el 12, ¡los has quitado **dos veces**!' }, { v: 50, m: 'Esos son los que no se dividen entre 2. Pero algunos se dividen entre 3, como el 9 o el 15.' }, { v: 67, m: 'Esos son los que **sí** se dividen entre 2 o entre 3. Te preguntamos por los otros.' }, { v: 32, m: 'Casi. Revisa el final: ¿qué pasa con 97, 98, 99 y 100?' }, { v: 34, m: 'Casi. Revisa el final: ¿qué pasa con 97, 98, 99 y 100?' }, { v: 16, m: 'Esos son los **grupos** de 6. ¿Cuántos números valen en cada grupo?' }],
  why: '¿Cómo los has contado?',
  hints: ['Mira los números **de 6 en 6**: del 1 al 6, ¿cuáles valen?',
    'Del 1 al 6 solo valen el **1** y el **5**. Del 7 al 12, el 7 y el 11. ¡Siempre **2 de cada 6**!',
    'Del 1 al 96 hay 96 : 6 = 16 grupos de 6. ¿Cuántos números valen ahí? Luego mira los que faltan: 97, 98, 99 y 100.',
    'En los 16 grupos valen 16 × 2 = 32. Ahora revisa 97, 98, 99 y 100 uno a uno.'],
  answer: '33 números', idea: 'Busca el **patrón que se repite**: en cada grupo de 6 números seguidos, solo 2 no se dividen ni entre 2 ni entre 3.',
  steps: ['Del 1 al 6 valen solo **1 y 5**. Y el patrón se repite cada 6: 7 y 11, 13 y 17…', 'Del 1 al 96 hay 96 : 6 = **16** grupos → 16 × 2 = **32** números.', 'Quedan 97, 98, 99, 100: 98 y 100 se dividen entre 2 y 99 entre 3 → solo vale el **97**.', 'Total: 32 + 1 = **33**.'],
  film: [
    { clear: true, say: 'Escribimos los números de seis en seis. Del uno al seis, ¿cuáles no se dividen ni entre dos ni entre tres?', show: [{ t: 'grid', k: 'g', n: 18, cols: 6 }] },
    { say: 'El dos, el cuatro y el seis se dividen entre dos. El tres, entre tres. Solo quedan el uno y el cinco.', show: [{ t: 'grid', k: 'g', n: 18, cols: 6, hl: [1, 5], off: [2, 3, 4, 6] }] },
    { say: 'Y en cada fila pasa lo mismo: siempre quedan dos, en las mismas columnas. Siete y once. Trece y diecisiete.', show: [{ t: 'grid', k: 'g', n: 18, cols: 6, hl: [1, 5, 7, 11, 13, 17], off: [2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18] }] },
    { clear: true, say: 'Del uno al noventa y seis hay dieciséis filas de seis. Dieciséis por dos: treinta y dos.', show: [{ t: 'eq', x: '96 : 6 = **16** filas' }, { t: 'eq', x: '16 × 2 = **32**' }] },
    { say: 'Quedan noventa y siete, noventa y ocho, noventa y nueve y cien. El noventa y ocho y el cien son pares. El noventa y nueve se divide entre tres. Solo vale el noventa y siete.', show: [{ t: 'row', items: ['+97', '~98', '~99', '~100'] }] },
    { clear: true, say: 'Treinta y dos más uno: treinta y tres números.', show: [{ t: 'eq', x: '32 + 1 = **33**' }, { t: 'ans', x: '33 números' }] },
    { say: 'La idea clave: busca el patrón que se repite, cuenta un grupo y multiplica. Y revisa lo que sobra al final.', show: [{ t: 'idea', x: 'Busca el **patrón**: 2 de cada 6. Y revisa **el final**.' }] },
  ] },

{ id: 'producto', level: 3, emoji: '✖️', title: 'El mayor producto', cat: 'Construir el mejor número',
  q: 'Con las cifras **1, 2, 3 y 4** (usando cada cifra **una sola vez**) formas **dos números de dos cifras** y los **multiplicas**.\n\n¿Cuál es el **mayor resultado** posible?',
  qSay: 'Con las cifras uno, dos, tres y cuatro, usando cada cifra una sola vez, formas dos números de dos cifras, y los multiplicas. ¿Cuál es el mayor resultado posible?',
  ask: '¿Cuál es el mayor resultado?', ph: 'Un número', ans: { num: 1312, also: [41, 32, 42, 31, 1302, 43, 21, 903] },
  traps: [{ v: 1302, m: '¡Muy cerca! Prueba a cambiar de sitio las cifras de las **unidades**.' }, { v: 903, m: 'Pon las cifras grandes en las **decenas**.' }, { v: 4321, m: 'Tienen que ser **dos** números de dos cifras, y multiplicarlos.' }, { v: 1271, m: 'Revisa: ¿has usado cada cifra una sola vez?' }],
  why: '¿Cómo sabes que es el mayor?',
  hints: ['Para que el producto sea grande, ¿dónde tienen que ir las cifras grandes: en las **decenas** o en las unidades?',
    'El 4 y el 3 van en las decenas: 4_ × 3_. Quedan el 1 y el 2, y hay **dos formas** de ponerlos. ¡Prueba las dos!',
    'Las dos formas son 42 × 31 y 41 × 32. Calcula las dos.',
    '42 × 31 = 1302. Ahora calcula 41 × 32 y compara.'],
  answer: '1312 (41 × 32)', idea: 'Cifras grandes en las **decenas**. Y si dos números suman lo mismo, cuanto **más parecidos** sean, mayor es su producto.',
  steps: ['Las decenas valen más → el 4 y el 3 van delante: 4_ × 3_.', 'Dos formas para el 1 y el 2: 42 × 31 = 1302 y 41 × 32 = **1312**.', 'Gana **41 × 32**: los dos suman 73, pero 41 y 32 están más igualados que 42 y 31.', 'Las demás opciones son menores: por ejemplo, 43 × 21 = 903.'],
  film: [
    { clear: true, say: 'Cifras uno, dos, tres y cuatro. Dos números de dos cifras, y los multiplicamos. ¿Cuál es el mayor resultado?', show: [{ t: 'row', items: ['1', '2', '3', '4'] }] },
    { say: 'Las decenas valen diez veces más. Así que el cuatro y el tres van delante.', show: [{ t: 'eq', k: 'e', x: '**4**_ × **3**_' }] },
    { say: 'Quedan el uno y el dos. Primera forma: cuarenta y dos por treinta y uno. Sale mil trescientos dos.', show: [{ t: 'eq', k: 'e', x: '42 × 31 = 1302' }] },
    { say: 'Segunda forma: cuarenta y uno por treinta y dos. Sale mil trescientos doce. ¡Un poco más!', show: [{ t: 'eq', k: 'e2', x: '41 × 32 = **1312**' }, { t: 'ans', x: '1312' }] },
    { clear: true, say: '¿Por qué gana? Las dos parejas suman setenta y tres. Pero cuarenta y uno y treinta y dos están más igualados. Pasa siempre: cinco por cinco, veinticinco, es más que nueve por uno, nueve.', show: [{ t: 'eq', x: '42 + 31 = 73 · 41 + 32 = 73' }, { t: 'p', x: 'Misma suma: gana la pareja **más igualada** (5 × 5 = 25 > 9 × 1 = 9)' }] },
    { clear: true, say: 'La idea clave: las cifras grandes, delante. Y si suman lo mismo, cuanto más parecidos son los números, mayor es el producto.', show: [{ t: 'ans', x: '1312' }, { t: 'idea', x: 'Grandes **delante**; y, con la misma suma, gana la pareja **más igualada**.' }] },
  ] },

// --- Nivel 4 ---
{ id: 'cubo', level: 4, emoji: '🧊', title: 'El cubo pintado', cat: 'Ver en 3D',
  q: 'Un **cubo grande** está hecho con **27 cubitos** (3 × 3 × 3). Pintamos de rojo **todas sus caras por fuera**, y después lo separamos en los 27 cubitos.\n\n¿Cuántos cubitos tienen **exactamente 2 caras** pintadas?',
  qSay: 'Un cubo grande está hecho con veintisiete cubitos, tres por tres por tres. Pintamos de rojo todas sus caras por fuera, y después lo separamos en los veintisiete cubitos. ¿Cuántos cubitos tienen exactamente dos caras pintadas?',
  pic: `<svg viewBox="0 0 300 320">${cubo([])}</svg>`,
  ask: '¿Cuántos cubitos?', ph: 'Un número', ans: { num: 12, also: [8, 6, 1, 27, 2, 3, 4] },
  traps: [{ v: 8, m: 'Esos son los de las **esquinas**: tienen 3 caras pintadas.' }, { v: 6, m: 'Esos son los del **centro de cada cara**: tienen 1 sola cara pintada.' }, { v: 24, m: 'Cuidado: cada borde lo comparten **dos** caras. ¿Has contado algún cubito dos veces?' }, { v: 1, m: 'Ese es el del centro, escondido: no tiene ninguna cara pintada.' }, { v: 9, m: 'Esos son los que se ven en el dibujo. ¡Algunos están escondidos detrás!' }, { v: 26, m: 'Esos son todos los que tienen **alguna** cara pintada. ¿Cuántos tienen **exactamente 2**?' }, { v: 4, m: 'Esos son los bordes de **una** cara. ¡El cubo tiene más caras y más bordes!' }],
  hints: ['Piensa **dónde** está cada cubito: en una esquina, en el medio de un **borde** (arista), en el centro de una cara, o escondido dentro.',
    'Los de las **esquinas** tienen 3 caras pintadas. Los del **centro de una cara**, 1. ¿Y los del medio de un borde?',
    'En el medio de cada borde (arista) del cubo hay un cubito con 2 caras pintadas. ¿Cuántas aristas tiene un cubo?',
    'Cuenta las aristas: 4 arriba, 4 abajo y 4 de pie.'],
  answer: '12 cubitos', idea: 'Clasifica cada cubito por **dónde está**: esquina (3 caras), arista (2), centro de cara (1), dentro (0). Los de 2 caras están en las **12 aristas**.',
  steps: ['Esquinas: **8** cubitos con 3 caras pintadas.', 'Medio de cada arista: **12** aristas → **12** cubitos con 2 caras.', 'Centro de cada cara: **6** cubitos con 1 cara.', 'Dentro: **1** sin pintar. Comprueba: 8 + 12 + 6 + 1 = 27 ✓.'],
  film: [
    { clear: true, say: 'Un cubo de tres por tres por tres, veintisiete cubitos, pintado por fuera. ¿Cuántos cubitos tienen exactamente dos caras pintadas?', show: [{ t: 'svg', k: 'c', vb: '0 0 300 320', h: '62%', x: cubo([]) }] },
    { say: 'Miremos dónde está cada cubito. En las esquinas hay ocho cubitos, cada uno con tres caras pintadas. Aquí ves siete; el octavo está detrás, abajo.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 320', h: '62%', x: cubo([3]) }, { t: 'p', k: 'p', x: 'Esquinas: **8** cubitos con 3 caras' }] },
    { say: 'En el centro de cada cara hay un cubito con una sola cara pintada. Aquí ves tres; los otros tres están en las caras de detrás. Seis caras, seis cubitos.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 320', h: '62%', x: cubo([1]) }, { t: 'p', k: 'p', x: 'Centro de cada cara: **6** con 1 cara' }] },
    { say: 'Y en el medio de cada arista, es decir, de cada borde, hay un cubito con dos caras pintadas. Aquí ves nueve; otros tres están escondidos detrás.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 320', h: '62%', x: cubo([2]) }, { t: 'p', k: 'p', x: 'Medio de cada arista: **2** caras' }] },
    { clear: true, say: 'Un cubo tiene cuatro aristas arriba, cuatro abajo, y cuatro de pie. Doce aristas, doce cubitos.', show: [{ t: 'eq', x: '4 + 4 + 4 = **12** aristas' }, { t: 'ans', x: '12 cubitos' }] },
    { clear: true, say: 'Comprobamos: ocho esquinas, doce aristas, seis caras, y uno escondido dentro. Ocho más doce más seis más uno: veintisiete. ¡Están todos!', show: [{ t: 'tbl', head: true, rows: [['Dónde', 'Esquina', 'Arista', 'Cara', 'Dentro'], ['Caras pintadas', 3, '!2', 1, 0], ['Cubitos', 8, '!12', 6, 1]] }, { t: 'eq', x: '8 + 12 + 6 + 1 = 27 ✓' }] },
    { clear: true, say: 'La idea clave: clasifica cada pieza por dónde está, y comprueba que no te falta ninguna.', show: [{ t: 'ans', x: '12 cubitos' }, { t: 'idea', x: 'Clasifica por **dónde está** cada cubito, y comprueba que suman **27**.' }] },
  ] },

{ id: 'carrera', level: 4, emoji: '🏃', title: 'La carrera de 100 metros', cat: 'Pensar en un momento',
  q: 'En una carrera de **100 metros**, cuando **Ana** llega a la meta, **Bea** va por el metro **90**. En otra carrera de 100 metros, cuando **Bea** llega a la meta, **Carla** va por el metro **90**.\n\nAhora corren **las tres juntas**, cada una a la misma velocidad de siempre. Cuando Ana llega a la meta, ¿**cuántos metros le faltan a Carla**?',
  qSay: 'En una carrera de cien metros, cuando Ana llega a la meta, Bea va por el metro noventa. En otra carrera de cien metros, cuando Bea llega a la meta, Carla va por el metro noventa. Ahora corren las tres juntas, cada una a la misma velocidad de siempre. Cuando Ana llega a la meta, ¿cuántos metros le faltan a Carla?',
  ask: '¿Cuántos metros le faltan a Carla?', ph: 'Un número', ans: { num: 19, also: [81, 90, 100, 9, 10] },
  traps: [{ v: 20, m: '¡Es lo que parece! Pero Carla va 10 m detrás de Bea solo cuando **Bea llega a la meta**. Cuando Ana llega, Bea solo lleva 90 m…' }, { v: 81, m: 'Ahí va Carla cuando Ana llega a la meta. ¿Cuántos metros le **faltan**?' }, { v: 10, m: 'Eso le falta a **Bea**. ¿Y a Carla?' }, { v: 18, m: 'Revisa: por cada 10 metros que corre Bea, Carla corre 9. ¿Cuánto corre Carla mientras Bea corre 90?' }, { v: 80, m: 'Revisa: por cada 10 metros que corre Bea, Carla corre 9. ¿Cuánto corre Carla mientras Bea corre 90?' }],
  why: '¿Cómo lo has pensado?',
  hints: ['Piensa en el momento en que **Ana llega a la meta**: ¿dónde está Bea? ¿Y Carla?',
    'Cuando Ana llega, Bea lleva **90 m**. Y cuando Bea corre 100 m, Carla corre 90 m: por cada **10 m** de Bea, Carla corre **9 m**.',
    'Mientras Bea corre 90 m (9 veces 10 m), ¿cuántos metros corre Carla?',
    'Carla corre 9 veces 9 metros. ¿Cuánto le falta para llegar a 100?'],
  answer: '19 metros (Carla va por el metro 81)', idea: 'Carla **no** va siempre 10 m detrás de Bea: va 1 m detrás por cada 10 m que corre Bea. Cuando Ana llega, Bea lleva 90 m y Carla **81 m**.',
  steps: ['Cuando Ana llega a la meta (100 m), Bea lleva **90 m**.', 'Carla corre **9 m** por cada **10 m** de Bea (90 de cada 100).', 'Mientras Bea corre 90 m = 9 × 10 m, Carla corre 9 × 9 = **81 m**.', 'A Carla le faltan 100 − 81 = **19 m**, no 20.'],
  film: [
    { clear: true, say: 'Ana le saca diez metros a Bea, y Bea le saca diez metros a Carla. Mucha gente piensa: a Carla le faltan veinte. ¡Vamos a ver!', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Ana', 'Bea', 'Carla'], ['Cuando Ana llega', '100 m', '90 m', '?']] }] },
    { say: 'Cuando Bea corre cien metros, Carla corre noventa. Es decir, por cada diez metros de Bea, Carla corre nueve.', show: [{ t: 'eq', k: 'e', x: 'Bea 10 m → Carla **9 m**' }] },
    { say: 'Cuando Ana llega a la meta, Bea ha corrido noventa metros: nueve veces diez. Así que Carla ha corrido nueve veces nueve: ochenta y uno.', show: [{ t: 'eq', k: 'e', x: 'Bea 90 m = 9 × 10 → Carla 9 × 9 = **81 m**' }] },
    { say: 'Carla va por el metro ochenta y uno. Le faltan diecinueve metros.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Ana', 'Bea', 'Carla'], ['Cuando Ana llega', '100 m', '90 m', '!81 m']] }, { t: 'eq', k: 'e', x: '100 − 81 = **19 m**' }, { t: 'ans', x: '19 metros' }] },
    { clear: true, say: '¿Por qué no veinte? Porque Carla va diez metros detrás de Bea solo cuando Bea llega a la meta. Cuando Bea lleva noventa, Carla va solo nueve metros detrás. Bea, diez detrás de Ana; Carla, nueve detrás de Bea: diez más nueve, diecinueve.', show: [{ t: 'eq', x: 'Bea 90 m · Carla 81 m → **9 m** detrás' }, { t: 'eq', x: '10 + 9 = **19**' }] },
    { clear: true, say: 'La idea clave: cuidado con sumar ventajas. Piensa en un momento concreto, y en dónde está cada una.', show: [{ t: 'ans', x: '19 metros' }, { t: 'idea', x: 'No sumes ventajas sin pensar: mira **un momento** y dónde está **cada una**.' }] },
  ] },

{ id: 'rectangulos', level: 4, emoji: '🟦', title: 'Rectángulos escondidos', cat: 'Contar con orden',
  q: 'En esta cuadrícula de **2 filas y 3 columnas** hay muchos **rectángulos** escondidos, de distintos tamaños.\n\n¿Cuántos hay en total? (Los cuadrados también cuentan como rectángulos, y la cuadrícula entera también.)',
  qSay: 'En esta cuadrícula de dos filas y tres columnas hay muchos rectángulos escondidos, de distintos tamaños. ¿Cuántos hay en total? Los cuadrados también cuentan como rectángulos, y la cuadrícula entera también.',
  pic: `<svg viewBox="0 0 340 240">${rejilla([])}</svg>`,
  ask: '¿Cuántos rectángulos?', ph: 'Un número', ans: { num: 18, also: [1, 2, 3, 4, 6, 12] },
  traps: [{ v: 6, m: 'Esos son los pequeños. ¿Y los que se forman juntando casillas?' }, { v: 17, m: '¿Has contado la cuadrícula entera?' }, { v: 12, m: '¿Y los rectángulos que ocupan **las dos filas**?' }, { v: 15, m: '¿Has contado los de 2 × 2 casillas y la cuadrícula entera?' }, { v: 9, m: 'Ve por tamaños: ¿cuántos hay de 2 casillas tumbados? ¿Y de pie?' }],
  hints: ['Cuenta **por tamaños**, con orden: primero los de 1 casilla, luego los de 2 casillas…',
    'De una fila de alto: de 1 casilla hay 6, de 2 casillas hay 4 (2 en cada fila) y de 3 casillas hay 2.',
    'Ahora los que ocupan **las dos filas**: de 1 columna de ancho, de 2 columnas y de 3 columnas.',
    'De dos filas: 3 de una columna, 2 de dos columnas y 1 de tres (la cuadrícula entera). Suma todo.'],
  answer: '18 rectángulos', idea: 'Cuenta **por tamaños** y con orden, para no repetir ni olvidar ninguno.',
  steps: ['De 1 fila de alto: 1 casilla → **6**, 2 casillas → **4**, 3 casillas → **2**. Son 12.', 'De 2 filas de alto: 1 columna → **3**, 2 columnas → **2**, 3 columnas → **1**. Son 6.', 'Total: 12 + 6 = **18**.', 'Truco extra: el ancho se puede elegir de 3 + 2 + 1 = 6 formas, y el alto de 3 (fila de arriba, de abajo o las dos): 6 × 3 = 18.'],
  film: [
    { clear: true, say: 'Una cuadrícula de dos filas y tres columnas. ¿Cuántos rectángulos hay? Contamos por tamaños, con orden.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([]) }] },
    { say: 'Los de una casilla: seis.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([[0, 0, 0, 0], [0, 1, 0, 1], [0, 2, 0, 2], [1, 0, 1, 0], [1, 1, 1, 1], [1, 2, 1, 2]]) }, { t: 'p', k: 'p', x: '1 casilla: **6**' }] },
    { say: 'Los de dos casillas, tumbados: dos en cada fila. Cuatro.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([[0, 0, 0, 1], [0, 1, 0, 2], [1, 0, 1, 1], [1, 1, 1, 2]]) }, { t: 'p', k: 'p', x: '2 casillas tumbados: **4**' }] },
    { say: 'Los de tres casillas, una fila entera: dos.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([[0, 0, 0, 2], [1, 0, 1, 2]]) }, { t: 'p', k: 'p', x: '3 casillas tumbados: **2**' }] },
    { say: 'Ahora los que ocupan las dos filas. De una columna de ancho: tres.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([[0, 0, 1, 0], [0, 1, 1, 1], [0, 2, 1, 2]]) }, { t: 'p', k: 'p', x: 'De pie, 1 columna: **3**' }] },
    { say: 'De dos columnas: dos. Y la cuadrícula entera: uno.', show: [{ t: 'svg', k: 'g', vb: '0 0 340 240', h: '52%', x: rejilla([[0, 0, 1, 1], [0, 1, 1, 2], [0, 0, 1, 2]]) }, { t: 'p', k: 'p', x: '2 columnas: **2** · entera: **1**' }] },
    { clear: true, say: 'Sumamos todo. Seis, cuatro y dos: doce. Tres, dos y uno: seis. Doce más seis: dieciocho.', show: [{ t: 'tbl', head: true, rows: [['', '1 columna', '2 columnas', '3 columnas'], ['1 fila', 6, 4, 2], ['2 filas', 3, 2, 1]] }, { t: 'eq', x: '12 + 6 = **18**' }, { t: 'ans', x: '18 rectángulos' }] },
    { clear: true, say: 'La idea clave: cuenta por tamaños y con orden. Así no se te escapa ninguno, ni cuentas uno dos veces.', show: [{ t: 'ans', x: '18 rectángulos' }, { t: 'idea', x: 'Cuenta **por tamaños** y con **orden**: ni repites ni olvidas.' }] },
  ] },
// ===================== Batch 4 (21 Nov 2026): 3 more per level. Answers: verify4.py =====================
// --- Nivel 1 ---
{ id: 'mesas', level: 1, emoji: '🍽️', title: 'La mesa larga', cat: 'Dibujar el problema',
  q: 'En una **mesa cuadrada** se sientan **4 personas**, una en cada lado.\n\nPara una fiesta juntamos **5 mesas** iguales en fila, formando una mesa larga. ¿Cuántas personas se pueden sentar, una en cada lado libre?',
  qSay: 'En una mesa cuadrada se sientan cuatro personas, una en cada lado. Para una fiesta juntamos cinco mesas iguales en fila, formando una mesa larga. ¿Cuántas personas se pueden sentar, una en cada lado libre?',
  pic: `<svg viewBox="0 0 400 200">${mesas(1)}</svg>`,
  ask: '¿Cuántas personas?', ph: 'Un número', ans: { num: 12, also: [5, 2, 10, 6, 4, 1, 3, 8, 20] },
  traps: [{ v: 20, m: 'Has hecho la cuenta… pero ¿has **dibujado** las 5 mesas juntas, como en la fiesta? Cuenta las personas una a una.' }, { v: 10, m: '¿Y en las dos **puntas** de la mesa larga?' }, { v: 11, m: 'Revisa las dos **puntas** de la mesa larga.' }, { v: 16, m: 'Dibuja las 5 mesas juntas y cuenta los lados **libres**, uno a uno.' }, { v: 14, m: 'Dibuja las 5 mesas juntas y cuenta los lados **libres**, uno a uno.' }],
  hints: ['**Dibuja** las mesas juntas y pon una persona en cada lado libre.',
    'Prueba primero con **2 mesas** juntas: ¿cuántas personas caben?',
    'En la mesa larga, cada mesa tiene una persona **arriba** y una **abajo**. ¿Y en las puntas?',
    'Arriba 5, abajo 5, y una en cada punta.'],
  answer: '12 personas', idea: 'Dibuja el problema: al juntar las mesas, los lados que se tocan **desaparecen**.',
  steps: ['Arriba: una persona por mesa → **5**.', 'Abajo: otras **5**.', 'En las dos puntas: **2**.', '5 + 5 + 2 = **12** (no 20: los lados pegados no cuentan).'],
  film: [
    { clear: true, say: 'Una mesa cuadrada: cuatro personas, una en cada lado. ¿Y si juntamos cinco mesas? Mucha gente dice: cinco por cuatro, veinte. ¡Vamos a dibujarlo!', show: [{ t: 'svg', k: 'm', vb: '0 0 400 200', h: '50%', x: mesas(1) }] },
    { say: 'Juntamos dos mesas. Los lados que se tocan quedan pegados: ahí no se sienta nadie. Caben seis.', show: [{ t: 'svg', k: 'm', vb: '0 0 400 200', h: '50%', x: mesas(2) }, { t: 'eq', k: 'e', x: '2 mesas → **6** personas' }] },
    { say: 'Ahora, cinco mesas en fila. Arriba, una persona por mesa: cinco. Abajo, otras cinco.', show: [{ t: 'svg', k: 'm', vb: '0 0 400 200', h: '50%', x: mesas(5) }, { t: 'eq', k: 'e', x: '5 arriba + 5 abajo' }] },
    { say: 'Y en las dos puntas, una persona en cada una. Cinco más cinco más dos: doce.', show: [{ t: 'eq', k: 'e', x: '5 + 5 + 2 = **12**' }, { t: 'ans', x: '12 personas' }] },
    { clear: true, say: 'La idea clave: dibuja el problema. Al juntar las mesas, los lados que se tocan desaparecen.', show: [{ t: 'ans', x: '12 personas' }, { t: 'idea', x: 'Dibújalo: al juntar las mesas, los lados que se tocan **desaparecen**.' }] },
  ] },

{ id: 'lapiz', level: 1, emoji: '✏️', title: 'El cuaderno y el lápiz', cat: 'Comprobar la primera idea',
  q: 'Un **cuaderno** y un **lápiz** cuestan juntos **110 céntimos**.\nEl cuaderno cuesta **100 céntimos más** que el lápiz.\n\n¿Cuántos céntimos cuesta el **lápiz**?',
  qSay: 'Un cuaderno y un lápiz cuestan juntos ciento diez céntimos. El cuaderno cuesta cien céntimos más que el lápiz. ¿Cuántos céntimos cuesta el lápiz?',
  ask: '¿Cuántos céntimos?', ph: 'Un número', ans: { num: 5, also: [105, 110, 100, 10, 2] },
  traps: [{ v: 10, m: 'Comprueba: si el lápiz costara 10, el cuaderno costaría 100 más. ¿Cuánto costarían **juntos**?' }, { v: 105, m: 'Ese es el precio del **cuaderno**. ¿Y el del lápiz?' }, { v: 100, m: 'Comprueba: si el cuaderno costara 100 y el lápiz 10, ¿costaría el cuaderno 100 céntimos **más** que el lápiz?' }, { v: 55, m: 'Comprueba: si el lápiz costara 55, ¿costaría el cuaderno 100 más?' }, { v: 0, m: 'Comprueba: si el lápiz no costara nada, ¿cuánto costarían juntos?' }],
  hints: ['¿Has **comprobado** la primera respuesta que se te ha ocurrido? Súmala con el precio del cuaderno.',
    '**Dibuja** dos barras: el lápiz, y el cuaderno, que es como el lápiz **más 100**.',
    'Las dos barras juntas valen 110. Si quitas los 100 de más, ¿cuánto queda?',
    'Quedan 10 céntimos, y eso es lo que cuestan **dos** lápices.'],
  answer: '5 céntimos (y el cuaderno, 105)', idea: '**Comprueba** siempre la primera idea: con el lápiz a 10, juntos costarían 120, no 110.',
  steps: ['El cuaderno = lápiz + 100.', 'Juntos: lápiz + lápiz + 100 = 110.', 'Dos lápices = 110 − 100 = 10 → un lápiz = **5** céntimos.', 'Comprueba: cuaderno 105, lápiz 5 → 105 − 5 = 100 ✓ y 105 + 5 = 110 ✓.'],
  film: [
    { clear: true, say: 'Un cuaderno y un lápiz cuestan ciento diez céntimos. El cuaderno cuesta cien más. Casi todo el mundo dice: el lápiz, diez céntimos. ¡Comprobemos!', show: [{ t: 'eq', x: '📓 + ✏️ = 110' }, { t: 'eq', x: '📓 = ✏️ + 100' }] },
    { say: 'Si el lápiz costara diez, el cuaderno costaría cien más: ciento diez. Y juntos, ciento veinte. ¡No cuadra!', show: [{ t: 'eq', k: 'c', x: '✏️ 10 → 📓 110 → juntos **120** ✗' }] },
    { clear: true, say: 'Dibujemos. El lápiz es una barra pequeña. El cuaderno es una barra igual, más cien.', show: [{ t: 'row', label: '✏️', items: ['#a5d8ff|✏️'] }, { t: 'row', label: '📓', items: ['#a5d8ff|✏️', '#ffd43b|100'] }] },
    { say: 'Todo junto vale ciento diez. Si quitamos los cien, quedan diez céntimos para dos lápices.', show: [{ t: 'eq', x: '✏️ + ✏️ = 110 − 100 = **10**' }] },
    { say: 'Así que el lápiz cuesta cinco céntimos, y el cuaderno, ciento cinco. Juntos, ciento diez. ¡Ahora sí cuadra!', show: [{ t: 'eq', x: '✏️ = **5** · 📓 = 105 · 5 + 105 = 110 ✓' }, { t: 'ans', x: '5 céntimos' }] },
    { clear: true, say: 'La idea clave: comprueba siempre la primera respuesta que se te ocurre. Si no cuadra, dibuja.', show: [{ t: 'ans', x: '5 céntimos' }, { t: 'idea', x: '**Comprueba** la primera idea. Si no cuadra, dibuja las dos barras.' }] },
  ] },

{ id: 'sumaedades', level: 1, emoji: '👩‍👧', title: 'La suma de edades', cat: 'Pasa para todos',
  q: 'Hoy, **Marta** y **su madre** tienen entre las dos **40 años** (si sumas sus edades, da 40).\n\n¿Cuánto sumarán sus edades **dentro de 5 años**?',
  qSay: 'Hoy, Marta y su madre tienen entre las dos cuarenta años: si sumas sus edades, da cuarenta. ¿Cuánto sumarán sus edades dentro de cinco años?',
  ask: '¿Cuántos años sumarán?', ph: 'Un número', ans: { num: 50, also: [40, 5, 10, 2, 15, 30, 35] },
  traps: [{ v: 45, m: 'Compruébalo con **edades inventadas**: Marta 10 y su madre 30. ¿Cuántos años tendrá cada una dentro de 5 años?' }, { v: 40, m: 'Al pasar 5 años, ¿siguen teniendo la misma edad?' }, { v: 35, m: 'Dentro de 5 años serán **mayores**, no más jóvenes.' }, { v: 80, m: 'Prueba con edades inventadas: Marta 10 y su madre 30. ¿Cuántos años tendrá cada una dentro de 5 años?' }],
  hints: ['Prueba con **edades inventadas** que sumen 40: por ejemplo, Marta 10 y su madre 30.',
    'Dentro de 5 años, ¿cuántos años tendrá Marta? ¿Y su madre?',
    'Las **dos** cumplen años. ¿Cuántos años de más suman entre las dos?',
    'Marta suma 5 años y su madre otros 5: 40 + 10.'],
  answer: '50 años', idea: 'El tiempo pasa **para todos**: 2 personas × 5 años = **10** años más en la suma.',
  steps: ['Ejemplo: Marta 10 y su madre 30 → suman 40.', 'Dentro de 5 años: Marta 15 y su madre 35 → suman **50**.', 'Siempre es así: cada una suma 5 años → 40 + 5 + 5 = **50**.'],
  film: [
    { clear: true, say: 'Marta y su madre suman cuarenta años. ¿Y dentro de cinco años? Mucha gente dice: cuarenta y cinco.', show: [{ t: 'eq', x: '👧 + 👩 = 40 años' }] },
    { say: 'Probemos con un ejemplo. Marta tiene diez años y su madre treinta. Suman cuarenta.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '👧 Marta', '👩 Madre', 'Suma'], ['Hoy', 10, 30, 40]] }] },
    { say: 'Dentro de cinco años, Marta tendrá quince, y su madre treinta y cinco. ¡Las dos cumplen años!', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '👧 Marta', '👩 Madre', 'Suma'], ['Hoy', 10, 30, 40], ['Dentro de 5 años', '!15', '!35', '?']] }] },
    { say: 'Quince más treinta y cinco: cincuenta. Cinco años más cada una: diez años más en total.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '👧 Marta', '👩 Madre', 'Suma'], ['Hoy', 10, 30, 40], ['Dentro de 5 años', 15, 35, '!50']] }, { t: 'eq', x: '40 + 5 + 5 = **50**' }, { t: 'ans', x: '50 años' }] },
    { clear: true, say: 'La idea clave: cuando pasa el tiempo, todos cumplen años. Cuenta cuántas personas hay.', show: [{ t: 'ans', x: '50 años' }, { t: 'idea', x: 'El tiempo pasa **para todos**: 2 personas × 5 años = **10** años más.' }] },
  ] },

// --- Nivel 2 ---
{ id: 'cerillas', level: 2, emoji: '🔥', title: 'Cuadrados de cerillas', cat: 'Buscar el patrón',
  q: 'Con cerillas formamos **cuadrados en fila**, pegados unos a otros.\n**1 cuadrado** → **4** cerillas · **2 cuadrados** → **7** cerillas · **3 cuadrados** → **10** cerillas\n\n¿Cuántas cerillas hacen falta para **10 cuadrados** en fila?',
  qSay: 'Con cerillas formamos cuadrados en fila, pegados unos a otros. Un cuadrado, cuatro cerillas. Dos cuadrados, siete cerillas. Tres cuadrados, diez cerillas. ¿Cuántas cerillas hacen falta para diez cuadrados en fila?',
  pic: `<svg viewBox="0 0 300 110">${cerillas(3)}</svg>`,
  ask: '¿Cuántas cerillas?', ph: 'Un número', ans: { num: 31, also: [1, 3, 4, 9, 10, 27, 30, 7, 13, 16, 19, 22, 25, 28, 40] },
  traps: [{ v: 40, m: 'Comprueba con los datos: si fuera 4 por cuadrado, 2 cuadrados serían 8 cerillas. ¿Cuántas dice el enunciado?' }, { v: 30, m: 'Casi. Revisa el primer cuadrado: ¿cuántas cerillas tiene?' }, { v: 34, m: 'Revisa: ¿cuántas cerillas se añaden cada vez que pones un cuadrado más?' }, { v: 28, m: 'Revisa: después del primer cuadrado, ¿cuántos cuadrados **más** pones?' }, { v: 13, m: 'Esas son para 4 cuadrados. ¡Sigue hasta 10!' }],
  hints: ['Mira los números: 4, 7, 10… ¿cuánto aumentan cada vez?',
    'Cada cuadrado nuevo añade **3** cerillas: arriba, abajo y a la derecha. El lado izquierdo ya estaba.',
    'El primer cuadrado necesita 4 cerillas. Después de él, ¿cuántos cuadrados más hay que poner hasta llegar a 10?',
    'El primero, 4 cerillas; los otros 9, 3 cerillas cada uno.'],
  answer: '31 cerillas', idea: 'Busca el **patrón**: cada cuadrado nuevo añade **3** cerillas, porque comparte un lado con el anterior.',
  steps: ['4, 7, 10… → cada cuadrado nuevo añade **3** cerillas.', 'El primero: 4. Los otros 9: 9 × 3 = 27.', '4 + 27 = **31** cerillas.', 'Otra forma: 1 cerilla al principio + 3 por cada cuadrado → 1 + 3 × 10 = 31.'],
  film: [
    { clear: true, say: 'Cuadrados de cerillas en fila. Uno, cuatro cerillas. Dos, siete. Tres, diez. ¿Y diez cuadrados? Mucha gente dice: diez por cuatro, cuarenta.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 110', h: '40%', x: cerillas(3) }] },
    { say: 'Pero los cuadrados están pegados: comparten un lado. El primero usa cuatro cerillas, en azul. Cada cuadrado nuevo solo necesita tres más, en verde.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 110', h: '40%', x: cerillas(3, 1) }, { t: 'eq', k: 'e', x: '4, 7, 10… → **+3** cada vez' }] },
    { say: 'Para diez cuadrados: el primero, cuatro cerillas. Y los otros nueve, tres cada uno: veintisiete.', show: [{ t: 'eq', k: 'e', x: '4 + 9 × 3 = 4 + 27' }] },
    { say: 'Cuatro más veintisiete: treinta y una cerillas.', show: [{ t: 'eq', k: 'e', x: '4 + 27 = **31**' }, { t: 'ans', x: '31 cerillas' }] },
    { clear: true, say: 'Otra forma de verlo: una cerilla al principio, la de la izquierda, y tres por cada cuadrado. Uno más treinta: treinta y uno.', show: [{ t: 'svg', vb: '0 0 300 110', h: '40%', x: cerillas(5, 1) }, { t: 'eq', x: '1 + 3 × 10 = **31**' }] },
    { clear: true, say: 'La idea clave: busca el patrón. ¿Cuánto se añade cada vez, y por qué?', show: [{ t: 'ans', x: '31 cerillas' }, { t: 'idea', x: 'Busca el **patrón**: cada cuadrado nuevo añade **3** cerillas.' }] },
  ] },

{ id: 'papel', level: 2, emoji: '📄', title: 'Doblar y agujerear', cat: 'Duplicar',
  q: 'Doblas una hoja de papel **por la mitad**. Luego la vuelves a doblar por la mitad, y otra vez más: **3 dobleces**.\n\nCon la hoja doblada, haces **un agujero** en el centro con un punzón, que atraviesa todo el papel.\n\nAl desdoblar la hoja, ¿cuántos agujeros hay?',
  qSay: 'Doblas una hoja de papel por la mitad. Luego la vuelves a doblar por la mitad, y otra vez más: tres dobleces. Con la hoja doblada, haces un agujero en el centro con un punzón, que atraviesa todo el papel. Al desdoblar la hoja, ¿cuántos agujeros hay?',
  ask: '¿Cuántos agujeros?', ph: 'Un número', ans: { num: 8, also: [1, 2, 4, 3] },
  traps: [{ v: 3, m: 'Esos son los **dobleces**. Cuando doblas, ¿qué le pasa al número de **capas** de papel?' }, { v: 6, m: 'Coge una hoja de verdad, dóblala 3 veces y cuenta las **capas** con cuidado.' }, { v: 4, m: 'Revisa: con 2 dobleces ya hay 4 capas. ¿Y con el tercero?' }, { v: 1, m: 'El agujero atraviesa **todas** las capas del papel doblado.' }, { v: 16, m: 'Revisa: ¿cuántas capas hay después de 3 dobleces? Cuenta doblez a doblez.' }],
  hints: ['El agujero atraviesa todas las **capas** de papel. Cuenta las capas.',
    'Sin doblar: 1 capa. Con 1 doblez: 2 capas. ¿Y con 2 dobleces?',
    'Cada doblez **duplica** las capas: 1, 2, 4…',
    'Con 3 dobleces hay 8 capas, y cada capa tiene su agujero.'],
  answer: '8 agujeros', idea: 'Cada doblez **duplica** las capas: 1, 2, 4, 8. El agujero atraviesa todas.',
  steps: ['Sin doblar: **1** capa.', '1 doblez: **2** capas · 2 dobleces: **4** · 3 dobleces: **8**.', 'El agujero atraviesa las 8 capas → **8** agujeros al desdoblar.'],
  film: [
    { clear: true, say: 'Una hoja, tres dobleces y un agujero. ¿Cuántos agujeros al desdoblar? Mucha gente dice tres, o seis. Contemos las capas de papel.', show: [{ t: 'h', x: '📄 Doblar y agujerear' }, { t: 'row', k: 'r', label: 'Sin doblar', items: ['#a5d8ff|1'] }] },
    { say: 'Doblamos por la mitad: ahora hay dos capas de papel, una encima de otra.', show: [{ t: 'row', k: 'r', label: '1 doblez', items: ['#a5d8ff|1', '#a5d8ff|2'] }] },
    { say: 'Doblamos otra vez: cada una de las dos capas se dobla. Cuatro capas.', show: [{ t: 'row', k: 'r', label: '2 dobleces', items: ['#a5d8ff|1', '#a5d8ff|2', '#a5d8ff|3', '#a5d8ff|4'] }] },
    { say: 'Y el tercer doblez: ocho capas. ¡Cada doblez duplica las capas!', show: [{ t: 'row', k: 'r', sm: true, label: '3 dobleces', items: [1, 2, 3, 4, 5, 6, 7, 8].map(n => '#a5d8ff|' + n) }] },
    { clear: true, say: 'El agujero atraviesa las ocho capas: un agujero en cada una. Al desdoblar, ocho agujeros.', show: [{ t: 'tbl', head: true, rows: [['Dobleces', 0, 1, 2, 3], ['Capas', 1, 2, 4, '!8']] }, { t: 'eq', x: '1 → 2 → 4 → **8**' }, { t: 'ans', x: '8 agujeros' }] },
    { clear: true, say: 'La idea clave: cada doblez duplica. Con un doblez más, serían dieciséis.', show: [{ t: 'ans', x: '8 agujeros' }, { t: 'idea', x: 'Cada doblez **duplica** las capas: 1, 2, 4, **8**, 16…' }] },
  ] },

{ id: 'pizza', level: 2, emoji: '🍕', title: 'Tres cortes a la pizza', cat: 'Probar y mejorar',
  q: 'Tienes una **pizza redonda** y haces **3 cortes rectos** con un cuchillo largo, de arriba abajo y de lado a lado de la pizza, **sin mover los trozos**.\n\n¿Cuál es el **mayor número de trozos** que puedes conseguir? (Los trozos no tienen que ser iguales.)',
  qSay: 'Tienes una pizza redonda y haces tres cortes rectos con un cuchillo largo, de arriba abajo y de lado a lado de la pizza, sin mover los trozos. ¿Cuál es el mayor número de trozos que puedes conseguir? Los trozos no tienen que ser iguales.',
  pic: `<svg viewBox="0 0 300 300">${pizza([])}</svg>`,
  ask: '¿Cuántos trozos como máximo?', ph: 'Un número', ans: { num: 7, also: [1, 2, 3, 4] },
  traps: [{ v: 6, m: 'Con 6 trozos vas bien… pero ¿se puede conseguir **más**? Dibuja los cortes de otra forma.' }, { v: 8, m: '¿Has partido la pizza en dos capas? No vale: cada corte va de arriba abajo, como se corta siempre una pizza. Dibuja tus cortes vistos desde arriba y cuenta los trozos.' }, { v: 5, m: 'Dibuja y prueba otras formas de cortar: ¿se puede conseguir más?' }, { v: 4, m: 'Con 2 cortes ya salen 4. ¿Y con el tercero?' }, { v: 3, m: 'Prueba a que los cortes se **crucen**.' }],
  why: '¿Cómo has cortado?',
  hints: ['**Dibuja** pizzas y prueba. Con 1 corte, 2 trozos. Con 2 cortes que se cruzan, 4.',
    'El tercer corte: cada trozo que **atraviesa** lo parte en dos. ¿Cuántos trozos puede atravesar como mucho?',
    'Si el tercer corte pasa por el mismo punto que los otros dos, atraviesa solo 2 trozos. ¿Y si cruza a cada uno **en un sitio distinto**?',
    'Cruzando a los otros dos cortes en sitios distintos, el tercer corte atraviesa 3 trozos: 4 + 3.'],
  answer: '7 trozos', idea: 'Cada corte nuevo tiene que **cruzar a todos** los anteriores, en sitios **distintos**: así atraviesa más trozos.',
  steps: ['1 corte: **2** trozos.', '2 cortes que se cruzan: **4** trozos.', 'Si el 3.º corte pasa por el centro, atraviesa 2 trozos → 6.', 'Si cruza a los otros dos en sitios distintos, atraviesa **3** trozos → 4 + 3 = **7**.'],
  film: [
    { clear: true, say: 'Una pizza y tres cortes rectos. ¿Cuántos trozos como máximo? Lo normal es cortar por el centro: seis trozos. ¿Se puede conseguir más?', show: [{ t: 'svg', k: 'z', vb: '0 0 300 300', h: '58%', x: pizza([[90, 0], [30, 0], [150, 0]]) }, { t: 'p', k: 'p', x: 'Por el centro: **6** trozos' }] },
    { say: 'Vamos paso a paso. Un corte: dos trozos.', show: [{ t: 'svg', k: 'z', vb: '0 0 300 300', h: '58%', x: pizza([[90, 30]]) }, { t: 'p', k: 'p', x: '1 corte → **2**' }] },
    { say: 'Dos cortes que se cruzan: cuatro trozos.', show: [{ t: 'svg', k: 'z', vb: '0 0 300 300', h: '58%', x: pizza([[90, 30], [210, 30]]) }, { t: 'p', k: 'p', x: '2 cortes → **4**' }] },
    { say: 'Ahora el tercer corte. Si cruza a los otros dos en sitios distintos, atraviesa tres trozos, y parte cada uno en dos. ¡Tres trozos más!', show: [{ t: 'svg', k: 'z', vb: '0 0 300 300', h: '58%', x: pizza([[90, 30], [210, 30], [330, 30]]) }, { t: 'p', k: 'p', x: '3 cortes → 4 + 3 = **7**' }] },
    { say: 'Cuéntalos: un triangulito en el centro, y seis trozos alrededor. ¡Siete trozos!', show: [{ t: 'svg', k: 'z', vb: '0 0 300 300', h: '58%', x: pizza([[90, 30], [210, 30], [330, 30]], 1) }, { t: 'p', k: 'p', x: '**7** trozos' }, { t: 'ans', x: '7 trozos' }] },
    { clear: true, say: 'La idea clave: cada corte nuevo tiene que cruzar a todos los anteriores, en sitios distintos. Así parte más trozos.', show: [{ t: 'ans', x: '7 trozos' }, { t: 'idea', x: 'Que cada corte nuevo **cruce a todos** los anteriores, en puntos **distintos**.' }] },
  ] },

// --- Nivel 3 ---
{ id: 'trenes', level: 3, emoji: '🚆', title: 'Los dos trenes', cat: 'Juntar velocidades',
  q: 'Dos ciudades están a **360 km**. A la misma hora sale un tren de cada ciudad, uno **hacia el otro**, por vías paralelas.\nUno va a **50 km por hora** y el otro a **70 km por hora**.\n\n¿Cuántas **horas** tardan en cruzarse?',
  qSay: 'Dos ciudades están a trescientos sesenta kilómetros. A la misma hora sale un tren de cada ciudad, uno hacia el otro, por vías paralelas. Uno va a cincuenta kilómetros por hora y el otro a setenta kilómetros por hora. ¿Cuántas horas tardan en cruzarse?',
  pic: `<svg viewBox="0 0 420 130">${vias(0)}</svg>`,
  ask: '¿Cuántas horas?', ph: 'Un número', ans: { num: 3, also: [50, 70, 120, 360, 1, 150, 210] },
  traps: [{ v: 6, m: 'Comprueba: en 6 horas, ¿cuántos km habría hecho cada tren? ¿Se habrían cruzado ya?' }, { v: 7, m: 'Comprueba: en ese tiempo, ¿cuántos km habría hecho cada tren? ¿Se habrían cruzado ya?' }, { v: 5, m: 'Comprueba: en 5 horas, ¿cuántos km habría hecho cada tren? ¿Se habrían cruzado ya?' }, { v: 18, m: 'Comprueba: en 18 horas, ¿cuántos km habría hecho cada tren? ¿Se habrían cruzado ya?' }, { v: 120, m: 'Eso es lo que se acercan en **una hora**. ¿Cuántas horas para 360 km?' }, { v: 180, m: 'Ese es el punto medio, pero los trenes no van igual de rápido. ¿Cuántas **horas** tardan?' }],
  hints: ['Piensa en lo que pasa en **una hora**: ¿cuántos km recorre cada tren?',
    'En una hora, uno recorre 50 km y el otro 70 km. ¿Cuántos km se ha acortado la distancia entre ellos?',
    'Cada hora se acercan **120 km**. ¿Cuántas horas hacen falta para 360 km?',
    '360 : 120.'],
  answer: '3 horas', idea: 'Si van **uno hacia el otro**, suma lo que avanzan: se acercan 50 + 70 = **120 km** cada hora.',
  steps: ['En 1 hora: 50 km + 70 km = **120 km** más cerca.', '360 : 120 = **3** horas.', 'Comprueba: en 3 horas, uno hace 150 km y el otro 210 km → 150 + 210 = 360 ✓.'],
  film: [
    { clear: true, say: 'Dos trenes, a trescientos sesenta kilómetros, van uno hacia el otro. Uno a cincuenta kilómetros por hora, el otro a setenta.', show: [{ t: 'svg', k: 'v', vb: '0 0 420 130', h: '42%', x: vias(0) }] },
    { say: 'Miremos una hora. El primero avanza cincuenta, el segundo setenta. Entre los dos, se han acercado ciento veinte kilómetros.', show: [{ t: 'svg', k: 'v', vb: '0 0 420 130', h: '42%', x: vias(1) }, { t: 'eq', k: 'e', x: '50 + 70 = **120 km** cada hora' }] },
    { say: 'Cada hora, ciento veinte kilómetros menos. Después de dos horas, doscientos cuarenta. ¿Cuántas veces cabe ciento veinte en trescientos sesenta? Tres.', show: [{ t: 'svg', k: 'v', vb: '0 0 420 130', h: '42%', x: vias(2) }, { t: 'eq', k: 'e', x: '360 : 120 = **3**' }] },
    { say: 'A las tres horas se cruzan. Comprobamos: el primero ha hecho ciento cincuenta, el segundo doscientos diez. Suman trescientos sesenta. ¡Cuadra!', show: [{ t: 'svg', k: 'v', vb: '0 0 420 130', h: '42%', x: vias(3) }, { t: 'eq', k: 'e', x: '150 + 210 = 360 ✓' }, { t: 'ans', x: '3 horas' }] },
    { clear: true, say: 'La idea clave: cuando dos van uno hacia el otro, suma lo que avanzan. Juntos se acercan ciento veinte kilómetros cada hora.', show: [{ t: 'ans', x: '3 horas' }, { t: 'idea', x: 'Si van **uno hacia el otro**, suma lo que avanzan: se acercan **120 km** cada hora.' }] },
  ] },

{ id: 'caminos', level: 3, emoji: '🗺️', title: 'Camino al cole', cat: 'Contar con orden',
  q: 'Para ir de **casa** 🏠 al **cole** 🏫, Nora va por las calles de este barrio, siempre hacia la **derecha** → o hacia **arriba** ↑ (nunca hacia atrás).\n\n¿Cuántos **caminos distintos** puede seguir?',
  qSay: 'Para ir de casa al cole, Nora va por las calles de este barrio, siempre hacia la derecha o hacia arriba, nunca hacia atrás. ¿Cuántos caminos distintos puede seguir?',
  pic: `<svg viewBox="0 0 340 260">${calles()}</svg>`,
  ask: '¿Cuántos caminos?', ph: 'Un número', ans: { num: 10, also: [1, 2, 3, 4, 5, 6] },
  traps: [{ v: 5, m: 'Todos los caminos tienen 5 tramos, sí. Pero ¿cuántos caminos **distintos** hay?' }, { v: 6, m: 'Casi: es fácil olvidar alguno. Busca una forma de contar **con orden**.' }, { v: 7, m: 'Casi: es fácil olvidar alguno. Busca una forma de contar **con orden**.' }, { v: 8, m: 'Casi: es fácil olvidar alguno. Busca una forma de contar **con orden**.' }, { v: 9, m: 'Casi: es fácil olvidar alguno. Busca una forma de contar **con orden**.' }, { v: 12, m: '¿Has contado algún camino dos veces?' }, { v: 2, m: 'Esos son los caminos «por fuera». ¡Hay muchos más por dentro!' }],
  hints: ['Dibuja algunos caminos. Todos tienen **3** tramos hacia la derecha y **2** hacia arriba, en distinto orden.',
    'Escribe en cada **esquina** cuántos caminos llegan hasta ella. A las esquinas de abajo y de la izquierda solo llega **1** (todo recto).',
    'A cada esquina se llega desde la esquina de su **izquierda** o desde la de **abajo**. Suma los dos números.',
    'Fila del medio: 1, 2, 3, 4. Sigue sumando hasta el cole.'],
  answer: '10 caminos', idea: 'No cuentes a ciegas: escribe en cada esquina cuántos caminos llegan, **sumando** los de la izquierda y los de abajo.',
  steps: ['Fila de abajo y columna de la izquierda: **1** camino a cada esquina.', 'Cada esquina = la de su izquierda + la de abajo.', 'Fila del medio: 1, 2, 3, 4. Fila de arriba: 1, 3, 6, **10**.', 'Otra forma: los 5 tramos son 3 → y 2 ↑; basta elegir **cuáles 2** son ↑ → 10 formas.'],
  film: [
    { clear: true, say: 'De casa al cole, siempre hacia la derecha o hacia arriba. ¿Cuántos caminos hay? Dibujemos algunos.', show: [{ t: 'svg', k: 'c', vb: '0 0 340 260', h: '60%', x: calles(null, ['RRRUU', 'UURRR', 'RURUR']) }] },
    { say: 'Hay muchos, y es fácil perderse contando. Mejor, contamos con orden: escribimos en cada esquina cuántos caminos llegan hasta ella.', show: [{ t: 'svg', k: 'c', vb: '0 0 340 260', h: '60%', x: calles() }] },
    { say: 'A las esquinas de abajo y de la izquierda solo se llega de una forma: todo recto. Uno.', show: [{ t: 'svg', k: 'c', vb: '0 0 340 260', h: '60%', x: calles([[1, 1, 1, 1], [1], [1]]) }, { t: 'p', k: 'p', x: 'Todo recto: **1** camino' }] },
    { say: 'A las demás se llega desde la izquierda o desde abajo: sumamos. Uno más uno, dos. Dos más uno, tres. Tres más uno, cuatro.', show: [{ t: 'svg', k: 'c', vb: '0 0 340 260', h: '60%', x: calles([[1, 1, 1, 1], [1, 2, 3, 4], [1]]) }, { t: 'p', k: 'p', x: 'izquierda + abajo' }] },
    { say: 'Fila de arriba. Uno más dos, tres. Tres más tres, seis. Y seis más cuatro: diez. ¡Diez caminos hasta el cole!', show: [{ t: 'svg', k: 'c', vb: '0 0 340 260', h: '60%', x: calles([[1, 1, 1, 1], [1, 2, 3, 4], [1, 3, 6, '!10']]) }, { t: 'p', k: 'p', x: '6 + 4 = **10**' }, { t: 'ans', x: '10 caminos' }] },
    { clear: true, say: 'La idea clave: no cuentes a ciegas. Escribe en cada esquina cuántos caminos llegan, y suma.', show: [{ t: 'ans', x: '10 caminos' }, { t: 'idea', x: 'En cada esquina, **suma** los caminos que llegan por la izquierda y por abajo.' }] },
  ] },

{ id: 'vuelta', level: 3, emoji: '🔄', title: 'Darle la vuelta', cat: 'Buscar el patrón',
  q: 'Al número **12** le damos la vuelta y sale **21**, que es **9 más** que 12.\n\n¿Cuántos números de **dos cifras** aumentan **exactamente 9** al darles la vuelta? (El 12 cuenta.)',
  qSay: 'Al número doce le damos la vuelta y sale veintiuno, que es nueve más que doce. ¿Cuántos números de dos cifras aumentan exactamente nueve al darles la vuelta? El doce cuenta.',
  ask: '¿Cuántos números?', ph: 'Escribe cuántos hay', ans: { num: 8, also: [12, 21, 23, 32, 34, 43, 45, 54, 56, 65, 67, 76, 78, 87, 89, 98, 9, 1] },
  traps: [{ v: 9, m: 'Revisa tu lista: ¿todos son de **dos cifras**? ¿Todos aumentan **exactamente** 9?' }, { v: 7, m: 'Casi. Revisa el principio y el final de tu lista.' }, { v: 1, m: 'El 12 es uno. Prueba con otros: ¿qué pasa con el 23?' }, { v: 2, m: 'Hay más. Prueba con muchos números y apunta los que funcionan.' }, { v: 10, m: 'Revisa tu lista: ¿todos aumentan **exactamente** 9?' }],
  why: '¿Cuáles son?',
  hints: ['Prueba con más números: ¿qué le pasa al 13? ¿Y al 23?',
    'El 12 y el 23 funcionan. Mira sus cifras: ¿qué tienen en común?',
    'Funciona cuando la cifra de las unidades es **una más** que la de las decenas.',
    'Escríbelos con orden: 12, 23, 34… ¿Hasta dónde puedes llegar?'],
  answer: '8 números: 12, 23, 34, 45, 56, 67, 78 y 89', idea: 'Prueba unos cuantos, busca el **patrón** (unidades = decenas + 1) y luego cuenta **con orden**.',
  steps: ['Probando: 12 → 21 (+9), 23 → 32 (+9), 13 → 31 (+18), 15 → 51 (+36).', 'Aumenta 9 cuando las cifras se llevan **1**, con la mayor en las unidades.', 'Con orden: 12, 23, 34, 45, 56, 67, 78, 89 → **8** números.', '(01 no es de dos cifras, y después del 9 no hay cifra «10».)'],
  film: [
    { clear: true, say: 'Doce, al darle la vuelta, es veintiuno: nueve más. ¿Qué otros números hacen lo mismo? Probemos algunos.', show: [{ t: 'tbl', head: true, rows: [['Número', 'Al revés', 'Aumenta'], [12, 21, '!+9'], [13, 31, '+18'], [23, 32, '!+9'], [15, 51, '+36']] }] },
    { say: 'Funcionan el doce y el veintitrés. Fíjate en sus cifras: la de las unidades es una más que la de las decenas.', show: [{ t: 'eq', k: 'e', x: 'unidades = decenas **+ 1**' }] },
    { say: 'Y cuando las cifras están más lejos, aumenta más. En el trece se llevan dos: aumenta dieciocho, dos veces nueve.', show: [{ t: 'eq', k: 'e', x: '13 → 31: se llevan 2 → 2 × 9 = 18' }] },
    { clear: true, say: 'Así que buscamos números con la cifra de las unidades una más que la de las decenas. Con orden: doce, veintitrés, treinta y cuatro… hasta ochenta y nueve.', show: [{ t: 'row', items: ['12', '23', '34', '45', '56', '67', '78', '89'], gap: 150 }] },
    { say: '¿Y después? Haría falta una cifra diez: no existe. ¿Y cero uno? No es un número de dos cifras. Son ocho.', show: [{ t: 'eq', x: '**8** números' }, { t: 'ans', x: '8 números' }] },
    { clear: true, say: 'La idea clave: prueba unos cuantos, busca el patrón, y luego cuenta con orden.', show: [{ t: 'ans', x: '8 números' }, { t: 'idea', x: 'Prueba, busca el **patrón** (unidades = decenas + 1) y cuenta **con orden**.' }] },
  ] },

// --- Nivel 4 ---
{ id: 'abuela', level: 4, emoji: '🥚', title: 'Los huevos de la abuela', cat: 'Quitar lo que sobra',
  q: 'La abuela tiene una cesta de huevos.\nSi los cuenta **de 2 en 2**, le sobra **1**. Si los cuenta **de 3 en 3**, **de 4 en 4**, **de 5 en 5** o **de 6 en 6**, también le sobra **1**.\nPero si los cuenta **de 7 en 7**, no le sobra **ninguno**.\n\nEn la cesta hay **menos de 400** huevos. ¿Cuántos hay?',
  qSay: 'La abuela tiene una cesta de huevos. Si los cuenta de dos en dos, le sobra uno. Si los cuenta de tres en tres, de cuatro en cuatro, de cinco en cinco o de seis en seis, también le sobra uno. Pero si los cuenta de siete en siete, no le sobra ninguno. En la cesta hay menos de cuatrocientos huevos. ¿Cuántos hay?',
  ask: '¿Cuántos huevos?', ph: 'Un número', ans: { num: 301, also: [60, 1, 61, 121, 181, 241, 7, 43, 2, 3, 4, 5, 6, 300, 361, 120, 180, 240, 360] },
  traps: [{ v: 61, m: 'Muy bien con 2, 3, 4, 5 y 6. Pero ¿se pueden contar 61 huevos de 7 en 7 sin que sobre ninguno?' }, { v: 121, m: 'Muy bien con 2, 3, 4, 5 y 6. Pero ¿y de 7 en 7?' }, { v: 181, m: 'Muy bien con 2, 3, 4, 5 y 6. Pero ¿y de 7 en 7?' }, { v: 241, m: 'Muy bien con 2, 3, 4, 5 y 6. Pero ¿y de 7 en 7?' }, { v: 361, m: 'Muy bien con 2, 3, 4, 5 y 6. Pero ¿y de 7 en 7?' }, { v: 49, m: 'De 7 en 7 sí… pero de 2 en 2 ¿sobra 1? ¿Y de 3 en 3?' }, { v: 7, m: 'De 7 en 7 sí… pero ¿y de 3 en 3?' }, { v: 721, m: 'Funciona… ¡pero hay menos de 400 huevos!' }, { v: 60, m: 'Con 60, de 2 en 2 no sobra **nada**. Y la abuela tiene 1 de más…' }],
  why: '¿Cómo lo has encontrado?',
  hints: ['Aparta el huevo que sobra. ¿Qué pasa entonces al contar el resto de 2 en 2, de 3 en 3… hasta de 6 en 6?',
    'Sin ese huevo, el número es **múltiplo** de 2, 3, 4, 5 y 6 a la vez. ¿Cuál es el más pequeño?',
    'El más pequeño es **60**. Así que los huevos pueden ser 60 + 1, 120 + 1, 180 + 1… Ahora, de 7 en 7.',
    'Prueba 61, 121, 181, 241, 301 y 361: ¿cuál se puede contar de 7 en 7 sin que sobre ninguno?'],
  answer: '301 huevos', idea: '¿Siempre sobra **1**? Quítalo: lo que queda es múltiplo de todos (de 60). Luego busca el que va de 7 en 7.',
  steps: ['Quitando el huevo que sobra, el resto es múltiplo de 2, 3, 4, 5 y 6 → múltiplo de **60**.', 'Posibles: 61, 121, 181, 241, 301, 361 (menos de 400).', 'De 7 en 7: solo **301** = 7 × 43.', 'Comprueba: 301 = 300 + 1, y 300 es múltiplo de 2, 3, 4, 5 y 6 ✓.'],
  film: [
    { clear: true, say: 'La abuela cuenta sus huevos. De dos en dos, sobra uno. Y de tres en tres, de cuatro en cuatro, de cinco en cinco y de seis en seis, también. De siete en siete, ninguno.', show: [{ t: 'tbl', head: true, rows: [['De … en …', 2, 3, 4, 5, 6, 7], ['Sobran', 1, 1, 1, 1, 1, '!0']] }] },
    { say: 'Truco: apartamos el huevo que sobra. Lo que queda se puede contar de dos en dos, de tres en tres… hasta de seis en seis, sin que sobre nada.', show: [{ t: 'eq', x: '🥚 − 1 → múltiplo de 2, 3, 4, 5 y 6' }] },
    { clear: true, say: 'Tiene que ser múltiplo de cuatro, de cinco y de tres. El más pequeño: cuatro por cinco por tres, sesenta. Y sesenta también es múltiplo de dos y de seis.', show: [{ t: 'eq', x: '4 × 5 × 3 = **60**' }] },
    { say: 'Así que los huevos son sesenta más uno, o ciento veinte más uno… Menos de cuatrocientos: estos seis.', show: [{ t: 'row', k: 'r', items: ['61', '121', '181', '241', '301', '361'], gap: 200 }] },
    { say: 'Ahora, de siete en siete. Sesenta y uno, no. Ciento veintiuno, no. Ciento ochenta y uno, no. Doscientos cuarenta y uno, no. ¡Trescientos uno, sí! Siete por cuarenta y tres.', show: [{ t: 'row', k: 'r', items: ['~61', '~121', '~181', '~241', '!301', '361'], gap: 0 }, { t: 'eq', k: 'e', x: '301 = 7 × 43 ✓' }] },
    { say: '¿Y trescientos sesenta y uno? Tampoco va de siete en siete. Solo vale trescientos uno.', show: [{ t: 'row', k: 'r', items: ['~61', '~121', '~181', '~241', '!301', '~361'], gap: 0 }, { t: 'ans', x: '301 huevos' }] },
    { clear: true, say: 'La idea clave: si siempre sobra uno, quita ese uno. Lo que queda es múltiplo de todos.', show: [{ t: 'ans', x: '301 huevos' }, { t: 'idea', x: '¿Siempre sobra **1**? Quítalo: lo que queda es **múltiplo** de todos.' }] },
  ] },

{ id: 'corro', level: 4, emoji: '🧒', title: 'El último del corro', cat: 'Probar con pocos',
  q: '**10 niños** forman un corro, numerados del **1 al 10**. Van contando por orden: el **1 se queda**, el **2 sale**, el 3 se queda, el 4 sale… y así, **uno sí y uno no**, dando vueltas al corro sin parar, hasta que solo queda uno.\n\n¿Qué número tiene el **último** que queda?',
  qSay: 'Diez niños forman un corro, numerados del uno al diez. Van contando por orden: el uno se queda, el dos sale, el tres se queda, el cuatro sale, y así, uno sí y uno no, dando vueltas al corro sin parar, hasta que solo queda uno. ¿Qué número tiene el último que queda?',
  pic: `<svg viewBox="0 0 300 280">${corro()}</svg>`,
  ask: '¿Qué número?', ph: 'Solo el número del que queda', ans: { num: 5, also: [2, 4, 6, 8, 10] },
  traps: [{ v: 1, m: 'Revisa la segunda vuelta con cuidado. Ve tachando en un dibujo del corro.' }, { v: 7, m: 'Revisa la segunda vuelta con cuidado. Ve tachando en un dibujo del corro.' }, { v: 9, m: 'Revisa el final paso a paso: cuando quedan tres niños, ¿a quién le toca salir?' }, { v: 3, m: 'Revisa la segunda vuelta con cuidado. Ve tachando en un dibujo del corro.' }, { v: 2, m: 'Ese sale en la primera vuelta: ¡salen todos los pares!' }, { v: 4, m: 'Ese sale en la primera vuelta: ¡salen todos los pares!' }, { v: 6, m: 'Ese sale en la primera vuelta: ¡salen todos los pares!' }, { v: 8, m: 'Ese sale en la primera vuelta: ¡salen todos los pares!' }, { v: 10, m: 'Ese sale en la primera vuelta: ¡salen todos los pares!' }],
  hints: ['**Dibuja** el corro con los 10 números y ve tachando, sin prisa.',
    'En la primera vuelta salen todos los **pares**. Después del 10, ¿le toca al 1 quedarse o salir?',
    'El 10 acaba de salir, así que al 1 le toca **quedarse**. Sale el 3, se queda el 5, sale el 7…',
    'Quedan el 1, el 5 y el 9. El 9 se acaba de quedar: ahora sale el 1. ¿Y luego?'],
  answer: 'El 5', idea: 'Juega despacio, tachando. Truco: con 2, 4, 8, 16… niños gana el que empieza; con 10, cuando salen 2 quedan 8 y empieza el 5.',
  steps: ['1.ª vuelta: salen **2, 4, 6, 8, 10**.', 'Como el 10 acaba de salir, el 1 se queda: salen **3** y **7**.', 'Quedan 1, 5 y 9: sale el **1**, se queda el 5, sale el **9**.', 'Queda el **5**.'],
  film: [
    { clear: true, say: 'Diez niños en corro. Uno sí, uno no, dando vueltas, hasta que solo queda uno. Vamos a jugar despacio.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 280', h: '60%', x: corro() }] },
    { say: 'Primera vuelta: el uno se queda, el dos sale, el tres se queda, el cuatro sale… Salen todos los pares.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 280', h: '60%', x: corro([2, 4, 6, 8, 10]) }, { t: 'p', k: 'p', x: 'Salen: 2, 4, 6, 8, 10' }] },
    { say: 'Segunda vuelta. El diez acaba de salir, así que al uno le toca quedarse. Sale el tres. El cinco se queda, sale el siete, el nueve se queda.', show: [{ t: 'svg', k: 'c', vb: '0 0 300 280', h: '60%', x: corro([2, 4, 6, 8, 10, 3, 7]) }, { t: 'p', k: 'p', x: 'Salen: 3, 7' }] },
    { say: 'Quedan el uno, el cinco y el nueve. El nueve se acaba de quedar, así que ahora sale el uno. El cinco se queda… y sale el nueve. ¡Gana el cinco!', show: [{ t: 'svg', k: 'c', vb: '0 0 300 280', h: '60%', x: corro([2, 4, 6, 8, 10, 3, 7, 1, 9], [5]) }, { t: 'p', k: 'p', x: 'Salen: 1, 9 → queda el **5**' }, { t: 'ans', x: 'El 5' }] },
    { clear: true, say: 'Hay un truco. Si probamos con pocos niños, vemos que con dos, cuatro, ocho o dieciséis niños, siempre gana el primero que cuenta.', show: [{ t: 'tbl', head: true, rows: [['Niños', 2, 4, 8, 16], ['Gana', '!1', '!1', '!1', '!1']] }] },
    { say: 'Con diez niños: en cuanto salen dos, el dos y el cuatro, quedan ocho, y el siguiente en contar es el cinco. ¡Con ocho gana el que empieza: el cinco!', show: [{ t: 'svg', vb: '0 0 300 280', h: '52%', x: corro([2, 4], [5]) }, { t: 'eq', x: '10 − 2 = 8 → empieza el **5** → gana el **5**' }] },
    { clear: true, say: 'La idea clave: prueba con pocos niños y busca el patrón.', show: [{ t: 'ans', x: 'El 5' }, { t: 'idea', x: 'Prueba con **pocos** y busca el **patrón**: con 2, 4, 8, 16… gana el que empieza.' }] },
  ] },

{ id: 'polilla', level: 4, emoji: '📚', title: 'La polilla de la biblioteca', cat: 'Imaginar la situación',
  q: 'En una estantería hay **3 tomos** de una enciclopedia, en orden: **tomo 1, tomo 2, tomo 3**, de izquierda a derecha, colocados como siempre: de pie, con el **lomo hacia ti**.\nCada tomo tiene **40 mm** de páginas y **dos tapas** de **5 mm** cada una.\n\nUna polilla empieza en la **primera página del tomo 1** y avanza en línea recta, comiendo, hasta la **última página del tomo 3**. ¿Cuántos **milímetros** recorre?\n(El dibujo es la estantería **vista desde arriba**.)',
  qSay: 'En una estantería hay tres tomos de una enciclopedia, en orden: tomo uno, tomo dos, tomo tres, de izquierda a derecha, colocados como siempre: de pie, con el lomo hacia ti. Cada tomo tiene cuarenta milímetros de páginas y dos tapas de cinco milímetros cada una. Una polilla empieza en la primera página del tomo uno y avanza en línea recta, comiendo, hasta la última página del tomo tres. ¿Cuántos milímetros recorre? El dibujo es la estantería vista desde arriba.',
  pic: `<svg viewBox="0 0 340 220">${tomos(0)}</svg>`,
  ask: '¿Cuántos milímetros?', ph: 'Un número', ans: { num: 60, also: [5, 40, 50, 1, 2, 3, 6, 10] },
  traps: [{ v: 150, m: 'Esa es la estantería entera. ¿Dónde está **de verdad** la primera página del tomo 1? Coge un libro, ponlo de pie con el lomo hacia ti y mira.' }, { v: 140, m: '¿Dónde está **de verdad** la primera página del tomo 1? Coge un libro, ponlo de pie con el lomo hacia ti y mira.' }, { v: 130, m: '¿Dónde está **de verdad** la primera página del tomo 1? Coge un libro, ponlo de pie con el lomo hacia ti y mira.' }, { v: 120, m: '¿Dónde está **de verdad** la primera página del tomo 1? Coge un libro, ponlo de pie con el lomo hacia ti y mira.' }, { v: 50, m: 'Eso es el tomo 2 entero. ¿La polilla no atraviesa nada más?' }, { v: 40, m: 'Esas son las páginas del tomo 2. ¿Y las tapas?' }, { v: 6, m: 'Escribe la respuesta en **milímetros**.' }, { v: 70, m: 'Revisa: ¿cuántas tapas atraviesa la polilla? Mira el dibujo.' }],
  why: '¿Por qué?',
  hints: ['Coge un libro de casa y ponlo de pie en una estantería, con el lomo hacia ti. ¿En qué lado queda la **primera página**: a la izquierda o a la derecha?',
    'La tapa de delante queda a la **derecha**. Así que la primera página del tomo 1 está en su lado derecho, pegada al **tomo 2**.',
    'Y la última página del tomo 3 queda en su lado **izquierdo**, también pegada al tomo 2.',
    'La polilla atraviesa: una tapa del tomo 1, el tomo 2 entero y una tapa del tomo 3.'],
  answer: '60 mm', idea: 'Antes de calcular, **mira la escena de verdad**: la primera página del tomo 1 está a su **derecha**, pegada al tomo 2.',
  steps: ['Con el lomo hacia ti, la tapa de delante de un libro queda a la **derecha**.', 'La primera página del tomo 1 está a su derecha; la última del tomo 3, a su izquierda: las dos, junto al tomo 2.', 'La polilla atraviesa: tapa del tomo 1 (5) + tomo 2 entero (5 + 40 + 5) + tapa del tomo 3 (5).', '5 + 50 + 5 = **60 mm** (¡no 130 ni 150!).'],
  film: [
    { clear: true, say: 'Tres tomos en la estantería, vistos desde arriba, con el lomo hacia nosotros. Una polilla va de la primera página del tomo uno a la última del tomo tres. Parece que atraviesa casi todo… ¿O no?', show: [{ t: 'svg', k: 's', vb: '0 0 340 220', h: '58%', x: tomos(0) }] },
    { say: 'Coge un libro y míralo. Con el lomo hacia ti, la tapa de delante queda a la derecha. Así que la primera página del tomo uno está a su derecha, ¡pegada al tomo dos!', show: [{ t: 'svg', k: 's', vb: '0 0 340 220', h: '58%', x: tomos(1) }] },
    { say: 'Y la última página del tomo tres está a su izquierda, también pegada al tomo dos.', show: [{ t: 'svg', k: 's', vb: '0 0 340 220', h: '58%', x: tomos(2) }] },
    { say: 'La polilla solo atraviesa la tapa del tomo uno, el tomo dos entero, y la tapa del tomo tres. Cinco, más cincuenta, más cinco: sesenta milímetros.', show: [{ t: 'svg', k: 's', vb: '0 0 340 220', h: '58%', x: tomos(3) }, { t: 'eq', x: '5 + (5 + 40 + 5) + 5 = **60 mm**' }, { t: 'ans', x: '60 mm' }] },
    { clear: true, say: 'La idea clave: antes de calcular, mira la escena de verdad. Mejor aún: coge un libro y compruébalo.', show: [{ t: 'ans', x: '60 mm' }, { t: 'idea', x: 'Antes de calcular, **mira la escena de verdad**: ¿dónde está la primera página?' }] },
  ] },

// ===================== Batch 5 (22 Nov 2026): 3 more per level. Answers: verify5.py =====================
// --- Nivel 1 ---
{ id: 'pisos', level: 1, emoji: '🏢', title: 'Subiendo pisos', cat: 'Contar los tramos',
  q: 'Lola sube andando las escaleras de su edificio. Del **piso 1** al **piso 3** tarda **2 minutos**.\n\nSi sube siempre al mismo ritmo, ¿cuántos minutos tarda del **piso 1** al **piso 9**?',
  qSay: 'Lola sube andando las escaleras de su edificio. Del piso uno al piso tres tarda dos minutos. Si sube siempre al mismo ritmo, ¿cuántos minutos tarda del piso uno al piso nueve?',
  pic: `<svg viewBox="0 0 300 405">${edificio(0, 1)}</svg>`,
  ask: '¿Cuántos minutos?', ph: 'Un número', ans: { num: 8, also: [1, 2, 3, 9, 6] },
  traps: [{ v: 6, m: '¿Seguro? Dibuja el edificio, pon a Lola en el piso 1 y mira bien lo que sube hasta el piso 3.' }, { v: 9, m: '¿Seguro? Dibuja el edificio, pon a Lola en el piso 1 y mira bien lo que sube hasta el piso 3.' }, { v: 18, m: '¡Eso es muchísimo! Comprueba: si tardara 18 minutos en total, ¿tardaría 2 minutos del piso 1 al 3?' }, { v: 4, m: 'Del piso 1 al 9 se sube mucho más que del 1 al 3. ¿De verdad tarda solo el doble?' }, { v: 16, m: 'Comprueba con los datos: a ese ritmo, ¿cuánto tardaría del piso 1 al piso 3?' }],
  why: '¿Por qué no son 6 minutos?',
  hints: ['**Dibuja** el edificio: piso 1, piso 2, piso 3… y pon a Lola en el piso 1.',
    'Del piso 1 al piso 3, ¿cuántos **tramos** de escalera sube? (Un tramo = de un piso al siguiente.)',
    'Sube 2 tramos en 2 minutos: **1 minuto** por tramo. ¿Cuántos tramos hay del piso 1 al 9?',
    'Del piso 1 al 9 hay 8 tramos.'],
  answer: '8 minutos', idea: 'Cuenta los **tramos**, no los pisos: del piso 1 al 3 solo hay **2** tramos.',
  steps: ['Del piso 1 al 3 sube **2 tramos** (del 1 al 2 y del 2 al 3).', '2 tramos en 2 minutos → **1 minuto** por tramo.', 'Del piso 1 al 9 hay **8 tramos**.', '8 tramos × 1 minuto = **8 minutos** (no 6).'],
  film: [
    { clear: true, say: 'Lola sube del piso uno al tres en dos minutos. ¿Y del uno al nueve? Mucha gente piensa: el nueve es tres veces el tres, así que seis minutos. ¡Vamos a dibujarlo!', show: [{ t: 'svg', k: 's', vb: '0 0 300 405', h: '58%', x: edificio(0, 1) }] },
    { say: 'Del piso uno al tres, Lola sube un tramo hasta el dos, y otro tramo hasta el tres. Solo dos tramos, en dos minutos: un minuto cada uno.', show: [{ t: 'svg', k: 's', vb: '0 0 300 405', h: '58%', x: edificio(3, 3) }, { t: 'eq', k: 'e', x: '2 tramos → 2 min → **1 min** por tramo' }] },
    { say: 'Del piso uno al nueve: uno, dos, tres, cuatro, cinco, seis, siete, ¡ocho tramos! Ocho minutos.', show: [{ t: 'svg', k: 's', vb: '0 0 300 405', h: '58%', x: edificio(9, 9) }, { t: 'eq', k: 'e', x: '8 tramos × 1 min = **8 minutos**' }, { t: 'ans', x: '8 minutos' }] },
    { clear: true, say: 'La idea clave: cuenta los tramos, no los pisos. Entre el piso uno y el tres solo hay dos tramos.', show: [{ t: 'ans', x: '8 minutos' }, { t: 'idea', x: 'Cuenta los **tramos**, no los pisos: del 1 al 3 solo hay **2**.' }] },
  ] },

{ id: 'adelantar', level: 1, emoji: '🏃', title: 'Adelantar al segundo', cat: 'Imaginar la situación',
  q: 'Estás corriendo una carrera y **adelantas al corredor que va segundo**.\n\n¿En qué **puesto** vas ahora?',
  qSay: 'Estás corriendo una carrera y adelantas al corredor que va segundo. ¿En qué puesto vas ahora?',
  ask: '¿En qué puesto vas?', ph: 'Solo el número de tu puesto', ans: { num: 2, also: [1, 3] },
  traps: [{ v: 1, m: '¡Hazlo de verdad! Poneos tres en fila, como en una carrera, y prueba a adelantar al segundo. ¿Dónde acabas?' }, { v: 3, m: 'Después de adelantar a alguien, ¿vas **mejor** o peor que antes?' }],
  why: '¿Y si adelantaras al **último**? ¿En qué puesto irías?',
  hints: ['**Imagínalo** con 3 corredores: Ana va 1.ª, Bea va 2.ª… ¿y tú?',
    'Justo antes de adelantar a Bea, ¿en qué puesto ibas tú?',
    'Pasas a Bea: ahora ella va detrás de ti. ¿Has pasado también a Ana?',
    'Ana sigue delante de ti.'],
  answer: '2.º puesto (segundo)', idea: '**Imagina la escena**: si adelantas al segundo, te quedas con **su** puesto. El primero sigue delante.',
  steps: ['Para adelantar al 2.º, tú ibas justo detrás de él: **3.º**.', 'Al adelantarlo, te pones en **su** sitio.', 'El 1.º sigue delante → vas **2.º** (¡no primero!).', '¿Y adelantar al último? ¡Imposible! Para adelantarlo tendrías que ir **detrás** de él.'],
  film: [
    { clear: true, say: 'Vas corriendo y adelantas al que va segundo. ¿En qué puesto vas? Casi todo el mundo dice: ¡primero! Vamos a verlo con tres corredores.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Puesto', '1.º', '2.º', '3.º'], ['Antes', '🏃 Ana', '🏃 Bea', '!🏃 Tú']] }] },
    { say: 'Para adelantar a Bea, tenías que ir justo detrás de ella. Eras el tercero.', show: [{ t: 'eq', k: 'e', x: 'Antes: **3.º** puesto' }] },
    { say: 'Pasas a Bea. Ahora ella va detrás de ti… pero Ana sigue delante. ¡Vas segundo!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Puesto', '1.º', '2.º', '3.º'], ['Antes', '🏃 Ana', '🏃 Bea', '🏃 Tú'], ['Después', '🏃 Ana', '!🏃 Tú', '🏃 Bea']] }, { t: 'eq', k: 'e', x: 'Ocupas **su** puesto: **2.º**' }, { t: 'ans', x: '2.º puesto' }] },
    { say: '¿Y si adelantas al último? ¡Imposible! Para adelantarlo, tendrías que ir detrás de él.', show: [{ t: 'p', x: '¿Adelantar al último? 🤔 ¡Nadie va detrás de él!' }] },
    { clear: true, say: 'La idea clave: imagina la escena. Si adelantas al segundo, te quedas con su puesto. El primero sigue delante.', show: [{ t: 'ans', x: '2.º puesto' }, { t: 'idea', x: '**Imagina la escena**: adelantas al 2.º → te quedas con **su** puesto.' }] },
  ] },

{ id: 'tortitas', level: 1, emoji: '🥞', title: 'Las tortitas', cat: 'No dejar huecos',
  q: 'En la sartén caben **2 tortitas** a la vez. Cada tortita se hace por **los dos lados**, y cada lado tarda **1 minuto**.\n\n¿Cuántos **minutos como mínimo** tardas en hacer **3 tortitas**?',
  qSay: 'En la sartén caben dos tortitas a la vez. Cada tortita se hace por los dos lados, y cada lado tarda un minuto. ¿Cuántos minutos como mínimo tardas en hacer tres tortitas?',
  ask: '¿Cuántos minutos?', ph: 'Solo el número de minutos', ans: { num: 3, also: [1, 2] },
  traps: [{ v: 4, m: '¡Funciona, pero se puede **más rápido**! Apunta minuto a minuto qué hay en la sartén.' }, { v: 6, m: 'Cuidado: en la sartén caben **2** tortitas a la vez. Apunta minuto a minuto qué hay en la sartén.' }, { v: 2, m: 'Apunta minuto a minuto: después de 2 minutos, ¿están las 3 tortitas hechas por los **dos** lados?' }, { v: 5, m: '¡Se puede más rápido! Apunta minuto a minuto qué hay en la sartén.' }],
  why: '¿Por qué no hacen falta 4 minutos?',
  hints: ['Llama a las tortitas **A**, **B** y **C**, y apunta **minuto a minuto** qué hay en la sartén.',
    'Lo normal: A y B por un lado, A y B por el otro, y luego C sola… ¿Hay algún minuto con un **sitio libre** en la sartén?',
    '¿Y si en el minuto 2 sacas una tortita **a medias** y metes la C?',
    'Minuto 1: A y B. Minuto 2: A (por el otro lado) y C.'],
  answer: '3 minutos', idea: '**No dejes huecos**: hay 6 lados que hacer y en cada minuto se hacen 2 → 3 minutos.',
  steps: ['Hay que hacer **6 lados** (3 tortitas × 2 lados).', 'Cada minuto, la sartén hace **2 lados**.', 'Minuto 1: A y B · Minuto 2: A (vuelta) y C · Minuto 3: B (vuelta) y C (vuelta).', '6 lados ÷ 2 por minuto = **3 minutos**, sin ningún sitio libre.'],
  film: [
    { clear: true, say: 'En la sartén caben dos tortitas, y cada lado tarda un minuto. ¿Cuánto tardas en hacer tres? Casi todo el mundo dice: cuatro minutos.', show: [{ t: 'row', items: ['🥞 A', '🥞 B', '🥞 C'] }] },
    { say: 'Así se hace normalmente: A y B por un lado, luego por el otro. Y después, C sola, por un lado y por el otro. Cuatro minutos… ¡pero con un sitio vacío dos veces!', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Sitio 1', 'Sitio 2'], ['Min 1', 'A lado 1', 'B lado 1'], ['Min 2', 'A lado 2', 'B lado 2'], ['Min 3', 'C lado 1', '!vacío'], ['Min 4', 'C lado 2', '!vacío']] }] },
    { clear: true, say: 'Mejor así. Minuto uno: A y B. Minuto dos: le damos la vuelta a A, y sacamos B a medio hacer para meter la C.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Sitio 1', 'Sitio 2'], ['Min 1', 'A lado 1', 'B lado 1'], ['Min 2', 'A lado 2', '!C lado 1']] }] },
    { say: 'Minuto tres: B vuelve a la sartén por su otro lado, y C también se da la vuelta. ¡Tres tortitas en tres minutos!', show: [{ t: 'tbl', k: 't', head: true, rows: [['', 'Sitio 1', 'Sitio 2'], ['Min 1', 'A lado 1', 'B lado 1'], ['Min 2', 'A lado 2', 'C lado 1'], ['Min 3', '!B lado 2', '!C lado 2']] }, { t: 'eq', x: '6 lados ÷ 2 a la vez = **3 minutos**' }, { t: 'ans', x: '3 minutos' }] },
    { clear: true, say: 'La idea clave: no dejes huecos. Hay seis lados que hacer, y en cada minuto se hacen dos.', show: [{ t: 'ans', x: '3 minutos' }, { t: 'idea', x: '**No dejes huecos**: 6 lados, 2 por minuto → **3 minutos**.' }] },
  ] },

// --- Nivel 2 ---
{ id: 'enfrente', level: 2, emoji: '⭕', title: 'Sentados en círculo', cat: 'Probar con pocos',
  q: 'Unos niños se sientan **en círculo**, a la misma distancia unos de otros, y se numeran **1, 2, 3…** en orden, uno detrás de otro alrededor del círculo.\n\nEl niño número **6** está **justo enfrente** del número **17**. ¿Cuántos niños hay en el círculo?',
  qSay: 'Unos niños se sientan en círculo, a la misma distancia unos de otros, y se numeran uno, dos, tres, en orden, uno detrás de otro alrededor del círculo. El niño número seis está justo enfrente del número diecisiete. ¿Cuántos niños hay en el círculo?',
  ask: '¿Cuántos niños?', ph: 'Un número', ans: { num: 22, also: [11, 2, 6, 17, 10, 5, 1] },
  traps: [{ v: 11, m: 'Comprueba: si en el círculo hubiera 11 niños, ¿existiría el niño número 17?' }, { v: 23, m: 'Comprueba: dibuja un círculo con 23 niños. ¿Quedan el 6 y el 17 **justo** enfrente?' }, { v: 21, m: 'Comprueba: dibuja un círculo con 21 niños. ¿Quedan el 6 y el 17 **justo** enfrente?' }, { v: 24, m: 'Comprueba: dibuja un círculo con 24 niños. ¿Quedan el 6 y el 17 **justo** enfrente?' }, { v: 34, m: 'Comprueba: dibuja un círculo con 34 niños. ¿Quedan el 6 y el 17 **justo** enfrente?' }, { v: 12, m: 'Comprueba: si hubiera 12 niños, ¿existiría el niño número 17?' }, { v: 20, m: 'Comprueba: dibuja un círculo con 20 niños. ¿Quedan el 6 y el 17 **justo** enfrente?' }],
  hints: ['Prueba con un círculo **pequeño**: dibuja 6 niños en círculo. ¿Quién está enfrente del 1?',
    'Con 6 niños, el 1 está enfrente del 4. ¿Cuántos pasos hay del 1 al 4? ¿Y cuántos tiene la vuelta entera?',
    'Ir hasta el que tienes enfrente es dar **media vuelta**. Del 6 al 17, ¿cuántos pasos hay?',
    'Del 6 al 17 hay 11 pasos: media vuelta.'],
  answer: '22 niños', idea: '**Enfrente = media vuelta.** Del 6 al 17 hay 11 pasos, así que la vuelta entera tiene 22.',
  steps: ['Del 6 al 17 hay 17 − 6 = **11** pasos.', 'Ir de un niño al que tiene enfrente es dar **media vuelta**.', 'Media vuelta = 11 → vuelta entera = **22** niños.', 'Comprueba por el otro lado: del 17 al 22 hay 5 pasos, del 22 al 1 uno, y del 1 al 6 otros 5 → **11** ✓.'],
  film: [
    { clear: true, say: 'Niños en círculo, numerados en orden. El seis está justo enfrente del diecisiete. ¿Cuántos hay? Probemos primero con un círculo pequeño, de seis niños.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '62%', x: ronda(6) }] },
    { say: 'Con seis niños, el uno está justo enfrente del cuatro. Del uno al cuatro hay tres pasos: media vuelta. Y la vuelta entera, seis.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '62%', x: ronda(6, 1, 4, true) }, { t: 'eq', k: 'e', x: '1 → 4: **3** pasos = media vuelta → vuelta entera **6**' }] },
    { clear: true, say: 'Ahora el nuestro. Del seis al diecisiete hay once pasos. Y eso es media vuelta.', show: [{ t: 'eq', k: 'e', x: '17 − 6 = **11** pasos = media vuelta' }] },
    { say: 'La vuelta entera es el doble: veintidós niños. Y por el otro lado, del diecisiete al seis, ¡también once pasos!', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '62%', x: ronda(22, 6, 17, true) }, { t: 'eq', k: 'e', x: '11 × 2 = **22**' }, { t: 'ans', x: '22 niños' }] },
    { clear: true, say: 'La idea clave: prueba primero con pocos. Enfrente quiere decir media vuelta.', show: [{ t: 'ans', x: '22 niños' }, { t: 'idea', x: '**Enfrente = media vuelta**: 11 pasos → la vuelta entera, **22**.' }] },
  ] },

{ id: 'sellos', level: 2, emoji: '✉️', title: 'Sellos de 3 y de 5', cat: 'Hacer una lista',
  q: 'En correos solo quedan sellos de **3 céntimos** y de **5 céntimos** (muchos de cada).\n\nAlgunos precios se pueden pagar **justos**, como 8 (3 + 5) o 9 (3 + 3 + 3). Otros, no.\n¿Cuál es el **precio más alto** que **no** se puede pagar justo?',
  qSay: 'En correos solo quedan sellos de tres céntimos y de cinco céntimos, muchos de cada. Algunos precios se pueden pagar justos, como ocho, que es tres más cinco, o nueve, tres más tres más tres. Otros, no. ¿Cuál es el precio más alto que no se puede pagar justo?',
  ask: '¿Qué precio?', ph: 'Un número (céntimos)', ans: { num: 7, also: [1, 2, 4, 3, 5, 6, 8, 9, 10] },
  traps: [{ v: 4, m: 'Es verdad que 4 no se puede… pero sigue probando precios más altos, uno a uno.' }, { v: 2, m: 'Es verdad que 2 no se puede… pero sigue probando precios más altos, uno a uno.' }, { v: 1, m: 'Es verdad que 1 no se puede… pero sigue probando precios más altos, uno a uno.' },
    ...[3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 29].map(selT)],
  why: '¿Cómo sabes que a partir de 8 se pueden pagar **todos**?',
  hints: ['Haz una **lista**: 1, 2, 3, 4… y al lado de cada precio apunta si se puede pagar justo o no.',
    '¿Cuándo dejan de salir los "no"? Fíjate en cuántos "sí" seguidos consigues.',
    'Cuando tienes **3 precios seguidos** que sí, ya salen todos los siguientes: basta con añadir un sello de 3.',
    '8, 9 y 10 se pueden pagar. El último "no" está antes.'],
  answer: '7 céntimos', idea: 'Haz la lista hasta encontrar **3 seguidos** que sí: a partir de ahí, añadiendo sellos de 3, salen **todos**.',
  steps: ['Lista: 1 ✗, 2 ✗, 3 ✓, 4 ✗, 5 ✓, 6 ✓, **7 ✗**, 8 ✓, 9 ✓, 10 ✓.', '8, 9 y 10 se pueden: **3 seguidos**.', 'Añadiendo un sello de 3: 11, 12, 13; otro más: 14, 15, 16… ¡todos!', 'El precio más alto que no se puede pagar: **7**.'],
  film: [
    { clear: true, say: 'Sellos de tres y de cinco céntimos. ¿Qué precios se pueden pagar justos? Hagamos la lista.', show: [{ t: 'grid', k: 'g', n: 20, cols: 10, stagger: 30 }] },
    { say: 'El uno y el dos, no. El tres, sí. El cuatro, no. El cinco y el seis, sí. Y el siete… no hay manera.', show: [{ t: 'grid', k: 'g', n: 20, cols: 10, hl: [3, 5, 6], off: [1, 2, 4, 7] }] },
    { say: 'Ocho: tres más cinco. Nueve: tres más tres más tres. Diez: cinco más cinco. ¡Tres seguidos!', show: [{ t: 'grid', k: 'g', n: 20, cols: 10, hl: [3, 5, 6, 8, 9, 10], off: [1, 2, 4, 7] }, { t: 'eq', k: 'e', x: '8 = 3 + 5 · 9 = 3 + 3 + 3 · 10 = 5 + 5' }] },
    { say: 'Y ahora, el truco: añadiendo un sello de tres, salen el once, el doce y el trece. Otro más, y el catorce, el quince y el dieciséis. ¡Ya salen todos!', show: [{ t: 'grid', k: 'g', n: 20, cols: 10, hl: [3, 5, 6, ...R(8, 20)], off: [1, 2, 4, 7] }, { t: 'eq', k: 'e', x: '+3 → 11, 12, 13 · +3 → 14, 15, 16 · …' }] },
    { say: 'Así que el precio más alto que no se puede pagar es siete céntimos.', show: [{ t: 'ans', x: '7 céntimos' }] },
    { clear: true, say: 'La idea clave: haz la lista hasta encontrar tres seguidos. A partir de ahí, sumando sellos de tres, salen todos.', show: [{ t: 'ans', x: '7 céntimos' }, { t: 'idea', x: 'Busca **3 seguidos** que sí: sumando sellos de 3 salen **todos** los demás.' }] },
  ] },

{ id: 'dados', level: 2, emoji: '🎲', title: 'La suma de dos dados', cat: 'Hacer una tabla',
  q: 'Lanzas **dos dados**, uno **rojo** y uno **azul**, y **sumas** los puntos.\n\n¿Qué **suma** puede salir de **más maneras distintas**?',
  qSay: 'Lanzas dos dados, uno rojo y uno azul, y sumas los puntos. ¿Qué suma puede salir de más maneras distintas?',
  ask: '¿Qué suma?', ph: 'Un número', ans: { num: 7, also: [1, 2, 3, 4, 5, 6, 36, 12] },
  traps: [{ v: 36, m: 'Esas son **todas** las tiradas posibles. ¿Qué suma sale en más de ellas?' }, ...[2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map(dadT)],
  why: '¿Por qué rojo 3 + azul 4 y rojo 4 + azul 3 cuentan como **dos** maneras?',
  hints: ['Haz una **tabla**: el dado rojo arriba (del 1 al 6), el azul a la izquierda (del 1 al 6), y en cada casilla, la suma.',
    'Rojo 3 + azul 4 y rojo 4 + azul 3 son tiradas **distintas** (por eso los dados tienen colores).',
    'En la tabla, las sumas iguales forman **diagonales**. ¿Cuál es la diagonal más larga?',
    'La diagonal más larga va de la esquina de arriba a la derecha a la de abajo a la izquierda: 6 casillas.'],
  answer: '7 (sale de 6 maneras)', idea: 'Haz la **tabla de todas las tiradas**: 36 casillas. El 7 está en la diagonal más larga: **6 veces**.',
  steps: ['Hay 6 × 6 = **36** tiradas distintas.', 'Suma 2: solo 1 + 1. Suma 12: solo 6 + 6.', 'Suma 7: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 → **6 maneras**.', 'Ninguna otra sale tanto: el 6 y el 8 salen de 5 maneras; el 2 y el 12, de una.'],
  film: [
    { clear: true, say: 'Dos dados, uno rojo y uno azul. ¿Qué suma sale de más maneras? Hagamos la tabla de todas las tiradas: el rojo arriba, el azul a la izquierda.', show: [{ t: 'tbl', k: 't', head: true, rows: dTab([]) }] },
    { say: 'Treinta y seis casillas. El dos solo sale una vez: uno y uno. El doce, también una: seis y seis.', show: [{ t: 'tbl', k: 't', head: true, rows: dTab([2, 12]) }] },
    { say: 'Y mira la diagonal del siete: uno y seis, dos y cinco, tres y cuatro, cuatro y tres, cinco y dos, seis y uno. ¡Seis casillas! Es la diagonal más larga.', show: [{ t: 'tbl', k: 't', head: true, rows: dTab([7]) }] },
    { say: 'El seis y el ocho salen cinco veces cada uno. El siete, seis. ¡Gana el siete!', show: [{ t: 'eq', x: '6 → 5 · **7 → 6 maneras** · 8 → 5' }, { t: 'ans', x: '7' }] },
    { clear: true, say: 'La idea clave: haz la tabla de todas las tiradas, y cuenta.', show: [{ t: 'ans', x: '7 (6 maneras)' }, { t: 'idea', x: 'Haz la **tabla de todas las tiradas**: el 7 sale **6 veces** de 36.' }] },
  ] },

// --- Nivel 3 ---
{ id: 'relojdigital', level: 3, emoji: '⏰', title: 'El reloj digital', cat: 'Construir el mejor número',
  q: 'Un reloj digital marca las horas de **00:00** a **23:59**.\nA las 10:25, por ejemplo, la **suma de sus cifras** es 1 + 0 + 2 + 5 = 8.\n\n¿Cuál es la **suma más grande** que puede salir en el reloj en todo el día?',
  qSay: 'Un reloj digital marca las horas desde las cero horas hasta las veintitrés cincuenta y nueve. A las diez y veinticinco, por ejemplo, la suma de sus cifras es uno más cero más dos más cinco: ocho. ¿Cuál es la suma más grande que puede salir en el reloj en todo el día?',
  ask: '¿Qué suma?', ph: 'Un número', ans: { num: 24, also: [19, 59, 1, 9, 5, 10, 14] },
  traps: [{ v: 19, m: 'Prueba la suma con muchas otras horas del día. ¿Alguna pasa de 19?' }, { v: 59, m: '¡Buena elección de minutos! Ahora completa la hora y **suma** todas sus cifras.' }, { v: 36, m: 'El reloj no puede marcar 99:99. ¿Qué cifras puede tener **cada** posición?' },
    { v: 23, m: 'Casi. Revisa cada cifra, una a una: ¿alguna podría ser más grande?' }, { v: 22, m: 'Casi. Revisa cada cifra, una a una: ¿alguna podría ser más grande?' }, { v: 20, m: 'Revisa cada cifra, una a una: ¿alguna podría ser más grande?' },
    { v: 27, m: 'Comprueba que tu hora existe: las horas van de 00 a 23 y los minutos de 00 a 59.' }, { v: 25, m: 'Comprueba que tu hora existe: las horas van de 00 a 23 y los minutos de 00 a 59.' }, { v: 28, m: 'Comprueba que tu hora existe: las horas van de 00 a 23 y los minutos de 00 a 59.' }],
  why: '¿Por qué las 23:59 no es la hora que más suma?',
  hints: ['Mira **cada posición** del reloj por separado: ¿qué cifras puede tener cada una?',
    'Los minutos: la primera cifra llega como mucho a **5**, y la segunda a **9**.',
    'Las horas: ¿suma más 23, o una hora que empiece por 1 y tenga un **9** detrás?',
    'La mejor hora es 19, y los mejores minutos, 59.'],
  answer: '24 (a las 19:59)', idea: 'Piensa **cada cifra por separado** y no te fíes de la hora "más alta": las 23:59 solo suman 19.',
  steps: ['Minutos: lo mejor es **59** (5 + 9 = 14).', 'Horas: 23 suma 5, 09 suma 9… y **19** suma **10**, ¡lo máximo!', '19:59 → 1 + 9 + 5 + 9 = **24**.', 'No se puede más: ninguna hora suma más de 10, ni ningunos minutos más de 14.'],
  film: [
    { clear: true, say: '¿A qué hora suman más las cifras del reloj? Mucha gente dice: la última del día, las veintitrés cincuenta y nueve. Suma diecinueve.', show: [{ t: 'eq', k: 'c', x: '⏰ **23:59**' }, { t: 'eq', k: 'e', x: '2 + 3 + 5 + 9 = 19' }] },
    { say: 'Miremos cada parte por separado. En los minutos, lo mejor es cincuenta y nueve: cinco más nueve, catorce.', show: [{ t: 'tbl', k: 'm', head: true, rows: [['Minutos', 'Suma'], ['30', 3], ['45', 9], ['!59', '!14']] }] },
    { say: 'En las horas, las veintitrés suman solo cinco. Las nueve suman nueve. ¡Y las diecinueve suman diez!', show: [{ t: 'cols', k: 'm', items: [{ t: 'tbl', head: true, rows: [['Minutos', 'Suma'], ['59', 14]] }, { t: 'tbl', head: true, rows: [['Horas', 'Suma'], ['23', 5], ['09', 9], ['!19', '!10']] }] }] },
    { say: 'Así que la mejor hora es las diecinueve cincuenta y nueve. Uno, más nueve, más cinco, más nueve: veinticuatro.', show: [{ t: 'eq', k: 'c', x: '⏰ **19:59**' }, { t: 'eq', k: 'e', x: '1 + 9 + 5 + 9 = **24**' }, { t: 'ans', x: '24' }] },
    { clear: true, say: 'La idea clave: para construir el mejor número, piensa cada cifra por separado. La hora más alta no es la que más suma.', show: [{ t: 'ans', x: '24 (a las 19:59)' }, { t: 'idea', x: 'Piensa **cada cifra por separado**: las 23:59 solo suman 19.' }] },
  ] },

{ id: 'meses', level: 3, emoji: '🎂', title: 'Cumpleaños en el mismo mes', cat: 'Pensar en el peor caso',
  q: '¿Cuántas personas tiene que haber **como mínimo** en un grupo para estar **completamente seguros** de que **al menos 3** cumplen años **el mismo mes**?',
  qSay: '¿Cuántas personas tiene que haber como mínimo en un grupo para estar completamente seguros de que al menos tres cumplen años el mismo mes?',
  ask: '¿Cuántas personas?', ph: 'Un número', ans: { num: 25, also: [12, 2, 24, 1, 3] },
  traps: [{ v: 24, m: 'Comprueba: ¿puedes repartir los cumpleaños de 24 personas de forma que **ningún** mes tenga 3?' }, { v: 36, m: 'Con 36 seguro que sí… pero ¿hacen falta **tantas**? Busca el número más pequeño.' }, { v: 37, m: 'Con 37 seguro que sí… pero ¿hacen falta **tantas**? Busca el número más pequeño.' }, { v: 13, m: 'Comprueba: ¿puedes repartir los cumpleaños de 13 personas de forma que **ningún** mes tenga 3?' }, { v: 3, m: 'Con 3 personas, ¿no podrían cumplir en enero, febrero y marzo?' }, { v: 4, m: 'Con 4 personas, ¿no podrían cumplir cada una en un mes distinto?' }, { v: 26, m: 'Comprueba con una persona menos: ¿podrían repartirse sin que ningún mes tenga 3?' }, { v: 12, m: 'Con 12 personas, ¿no podría cumplir cada una en un mes distinto?' }],
  hints: ['Piensa en el **peor caso**: los cumpleaños repartidos de la forma más "mala" posible.',
    'Imagina 12 cajas, una por mes. Mete a las personas una a una intentando que **ninguna** caja llegue a 3.',
    '¿Cuántas personas caben como mucho sin que ningún mes tenga 3? Con 2 en cada mes…',
    '2 en cada mes son 24 personas, y ningún mes tiene 3.'],
  answer: '25 personas', idea: '**Peor caso**: 2 personas en cada uno de los 12 meses son 24, y ningún mes tiene 3. La persona número **25** lo consigue seguro.',
  steps: ['Hay **12 meses**.', 'Peor caso: **2 personas en cada mes** → 12 × 2 = 24, y ningún mes tiene 3.', 'La persona 25 tiene que caer en algún mes… que ya tiene 2 → ¡**3**!', 'Con 24 no es seguro; con **25**, sí.'],
  film: [
    { clear: true, say: 'Doce meses. ¿Cuántas personas hacen falta para estar seguros de que tres cumplen años el mismo mes? Pensemos en el peor caso: los cumpleaños lo más repartidos posible.', show: [{ t: 'svg', k: 's', vb: '0 0 400 290', h: '58%', x: meses(0) }] },
    { say: 'Una persona en cada mes: doce personas, y nadie coincide.', show: [{ t: 'svg', k: 's', vb: '0 0 400 290', h: '58%', x: meses(1) }, { t: 'eq', k: 'e', x: '12 × 1 = 12' }] },
    { say: 'Dos en cada mes: veinticuatro personas, y todavía ningún mes tiene tres.', show: [{ t: 'svg', k: 's', vb: '0 0 400 290', h: '58%', x: meses(2) }, { t: 'eq', k: 'e', x: '12 × 2 = **24** → ningún mes con 3' }] },
    { say: 'Llega la persona veinticinco. Caiga en el mes que caiga, ya hay dos. ¡Tres, seguro!', show: [{ t: 'svg', k: 's', vb: '0 0 400 290', h: '58%', x: meses(2, 3) }, { t: 'eq', k: 'e', x: '24 + 1 = **25**' }, { t: 'ans', x: '25 personas' }] },
    { clear: true, say: 'La idea clave: piensa en el peor caso. Con veinticuatro, todavía puede fallar. Con veinticinco, es imposible.', show: [{ t: 'ans', x: '25 personas' }, { t: 'idea', x: '**Peor caso**: 2 por mes = 24 sin ningún 3. La **25** lo asegura.' }] },
  ] },

{ id: 'piramide', level: 3, emoji: '🧱', title: 'La pirámide de números', cat: 'Probar y mejorar',
  q: 'En esta pirámide, cada ladrillo vale la **suma de los dos** que tiene **justo debajo**.\nEn la fila de abajo están el **2**, un número escondido **?**, el **4** y el **1**. Arriba del todo sale **36**.\n\n¿Qué número es **?**',
  qSay: 'En esta pirámide, cada ladrillo vale la suma de los dos que tiene justo debajo. En la fila de abajo están el dos, un número escondido, el cuatro y el uno. Arriba del todo sale treinta y seis. ¿Qué número está escondido?',
  pic: `<svg viewBox="0 0 400 255">${piramide([[2, '?', 4, 1], ['', '', ''], ['', ''], [36]])}</svg>`,
  ask: '¿Qué número es?', ph: 'Un número', ans: { num: 7, also: [2, 4, 1, 3, 6, 9, 11, 5, 20, 16, 36, 15, 18, 33, 21] },
  traps: [{ v: 36, m: 'El 36 es el de **arriba**. ¿Qué número va en el ladrillo **?**?' }, ...[29, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 18, 21].map(chkP)],
  why: '¿Por qué el número de arriba sube de 3 en 3?',
  hints: ['**Prueba** un número en el **?**, por ejemplo el 1, y calcula la pirámide hasta arriba.',
    'Prueba ahora con el 2. ¿Cuánto **ha subido** el número de arriba?',
    'Cada vez que el **?** sube 1, el de arriba sube **3**. ¿Cuánto le falta para llegar a 36?',
    'Con el 1, arriba sale 18. Faltan 18, y cada 1 de más suma 3.'],
  answer: '7', idea: 'Prueba y **fíjate en cuánto cambia**: cada 1 que añades abajo suma 3 arriba, porque el **?** llega arriba por **3 caminos**.',
  steps: ['Con el 1, arriba sale **18**. Con el 2, **21**. ¡Sube de 3 en 3!', 'Para llegar a 36 faltan 36 − 18 = **18**, y 18 ÷ 3 = **6** pasos más.', '1 + 6 = **7**.', 'Comprueba: 2, 7, 4, 1 → 9, 11, 5 → 20, 16 → **36** ✓.'],
  film: [
    { clear: true, say: 'Cada ladrillo es la suma de los dos de abajo. Abajo: dos, uno escondido, cuatro y uno. Arriba, treinta y seis. ¿Qué número se esconde?', show: [{ t: 'svg', k: 's', vb: '0 0 400 255', h: '56%', x: piramide([[2, '?', 4, 1], ['', '', ''], ['', ''], [36]]) }] },
    { say: 'Probemos con un uno. Dos más uno, tres. Uno más cuatro, cinco. Cuatro más uno, cinco. Luego, ocho y diez. Y arriba, dieciocho. ¡Muy poco!', show: [{ t: 'svg', k: 's', vb: '0 0 400 255', h: '56%', x: piramide([[2, '!1', 4, 1], [3, 5, 5], [8, 10], [18]]) }, { t: 'eq', k: 'e', x: 'con 1 → arriba **18**' }] },
    { say: 'Probemos con un dos. Arriba sale veintiuno. ¡Ha subido tres!', show: [{ t: 'svg', k: 's', vb: '0 0 400 255', h: '56%', x: piramide([[2, '!2', 4, 1], [4, 6, 5], [10, 11], [21]]) }, { t: 'eq', k: 'e', x: 'con 2 → arriba **21** (+3)' }] },
    { say: '¿Por qué tres? Porque el número escondido llega hasta arriba por tres caminos distintos. Cada uno que sumas abajo son tres más arriba.', show: [{ t: 'eq', k: 'e', x: '+1 abajo → **+3** arriba' }] },
    { say: 'De dieciocho a treinta y seis faltan dieciocho. Dieciocho entre tres: seis pasos más. Uno más seis: ¡siete!', show: [{ t: 'svg', k: 's', vb: '0 0 400 255', h: '56%', x: piramide([[2, '!7', 4, 1], [9, 11, 5], [20, 16], ['!36']]) }, { t: 'eq', k: 'e', x: '36 − 18 = 18 · 18 ÷ 3 = 6 · 1 + 6 = **7**' }, { t: 'ans', x: '7' }] },
    { clear: true, say: 'La idea clave: prueba, y fíjate en cuánto cambia el resultado. Así sabes cuánto te falta.', show: [{ t: 'ans', x: '7' }, { t: 'idea', x: 'Prueba y **fíjate en cuánto cambia**: +1 abajo es **+3** arriba.' }] },
  ] },

// --- Nivel 4 ---
{ id: 'puente', level: 4, emoji: '🔦', title: 'El puente y la linterna', cat: 'Estrategia',
  q: 'Es de noche. **Cuatro amigos** tienen que cruzar un puente viejo con **una sola linterna**.\n• En el puente caben **como mucho 2** a la vez, y siempre hay que llevar la linterna.\n• La linterna no se puede lanzar: alguien tiene que **volver** con ella.\n• Ana tarda **1 minuto**, Bea **2**, Carlos **5** y Dani **10**. Si van dos juntos, van al paso del **más lento**.\n\n¿Cuántos **minutos como mínimo** tardan en cruzar los cuatro?',
  qSay: 'Es de noche. Cuatro amigos tienen que cruzar un puente viejo con una sola linterna. En el puente caben como mucho dos a la vez, y siempre hay que llevar la linterna. La linterna no se puede lanzar: alguien tiene que volver con ella. Ana tarda un minuto, Bea dos, Carlos cinco y Dani diez. Si van dos juntos, van al paso del más lento. ¿Cuántos minutos como mínimo tardan en cruzar los cuatro?',
  ask: '¿Cuántos minutos?', ph: 'Un número', ans: { num: 17, also: [1, 2, 5, 10, 19] },
  traps: [...[19, 18, 20, 21, 22, 23, 24, 25, 16, 15, 14, 13, 12].map(puT)],
  why: '¿Por qué conviene que Carlos y Dani crucen **juntos**?',
  hints: ['Apunta **cada viaje** en una tabla: quién va, quién vuelve con la linterna, y cuántos minutos.',
    'Lo primero que se le ocurre a todo el mundo: Ana, la más rápida, acompaña a cada uno y vuelve. ¿Cuánto sale? ¿Dónde se pierde más tiempo?',
    '¿Y si Carlos y Dani, los dos lentos, cruzan **juntos**? Así sus minutos lentos se gastan **una sola vez**.',
    'Primero cruzan Ana y Bea, y vuelve Ana. Luego cruzan Carlos y Dani… ¿quién vuelve ahora con la linterna?'],
  answer: '17 minutos', idea: 'Que **los dos lentos crucen juntos**: los 10 minutos de Dani ya tapan los 5 de Carlos.',
  steps: ['Ana y Bea cruzan → **2** min. Vuelve Ana → **1** min.', 'Carlos y Dani cruzan juntos → **10** min. Vuelve Bea → **2** min.', 'Ana y Bea cruzan → **2** min.', '2 + 1 + 10 + 2 + 2 = **17** minutos (si Ana acompaña a todos, salen 19).'],
  film: [
    { clear: true, say: 'Cuatro amigos, un puente y una linterna. Ana tarda uno, Bea dos, Carlos cinco y Dani diez. Lo primero que se nos ocurre: que Ana, la más rápida, acompañe a todos.', show: [{ t: 'row', items: ['#d3f9d8|Ana 1', '#d0ebff|Bea 2', '#fff3bf|Carlos 5', '#ffe3e3|Dani 10'] }] },
    { say: 'Ana y Bea cruzan: dos minutos. Ana vuelve: uno. Ana y Carlos: cinco. Ana vuelve: uno. Ana y Dani: diez. Total, diecinueve.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Viaje', 'Min'], ['➡️ Ana + Bea', 2], ['⬅️ Ana', 1], ['➡️ Ana + Carlos', 5], ['⬅️ Ana', 1], ['➡️ Ana + Dani', 10], ['Total', '!19']] }] },
    { clear: true, say: 'El problema: los minutos de Carlos y los de Dani se gastan por separado. ¿Y si los dos lentos cruzan juntos? Solo gastan diez.', show: [{ t: 'eq', x: 'Por separado: 5 + 10 = 15 · Juntos: solo **10**' }] },
    { clear: true, say: 'Primero cruzan Ana y Bea: dos minutos. Vuelve Ana: uno. Ahora, Carlos y Dani juntos: diez.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Viaje', 'Min'], ['➡️ Ana + Bea', 2], ['⬅️ Ana', 1], ['➡️ Carlos + Dani', '!10']] }] },
    { say: 'Bea, que estaba al otro lado, vuelve con la linterna: dos. Y Ana y Bea cruzan juntas: dos. ¡Diecisiete minutos!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Viaje', 'Min'], ['➡️ Ana + Bea', 2], ['⬅️ Ana', 1], ['➡️ Carlos + Dani', 10], ['⬅️ Bea', 2], ['➡️ Ana + Bea', 2], ['Total', '!17']] }, { t: 'ans', x: '17 minutos' }] },
    { clear: true, say: 'La idea clave: que los dos lentos crucen juntos. Los diez minutos de Dani ya tapan los cinco de Carlos.', show: [{ t: 'ans', x: '17 minutos' }, { t: 'idea', x: 'Que **los dos lentos crucen juntos**: los 10 min de Dani tapan los 5 de Carlos.' }] },
  ] },

{ id: 'pesas', level: 4, emoji: '⚖️', title: 'Tres pesas mágicas', cat: 'Restar también',
  q: 'Tienes una balanza de dos platillos y solo **tres pesas**: de **1 g**, de **3 g** y de **9 g**.\nPuedes poner las pesas en **cualquiera de los dos platillos**, también **al lado** de lo que quieres pesar.\n\n¿Cuántos pesos distintos (1 g, 2 g, 3 g…) puedes medir?',
  qSay: 'Tienes una balanza de dos platillos y solo tres pesas: de un gramo, de tres gramos y de nueve gramos. Puedes poner las pesas en cualquiera de los dos platillos, también al lado de lo que quieres pesar. ¿Cuántos pesos distintos, un gramo, dos gramos, tres gramos, puedes medir?',
  pic: `<svg viewBox="0 0 600 380">${scale(['F'], [], 0, ['1', '3', '9'])}</svg>`,
  ask: '¿Cuántos pesos distintos?', ph: 'Solo cuántos pesos (un número)', ans: { num: 13, also: [1, 3, 9, 2, 4, 5, 6, 8] },
  traps: [{ v: 7, m: 'Revisa el enunciado: las pesas pueden ir en **los dos** platillos. ¿Salen más pesos así?' }, { v: 12, m: 'Casi. Revisa tu lista, uno a uno, desde 1 g hasta el más pesado que puedes medir.' }, { v: 11, m: 'Revisa tu lista, uno a uno, desde 1 g hasta el más pesado que puedes medir.' }, { v: 10, m: 'Revisa tu lista, uno a uno, desde 1 g hasta el más pesado que puedes medir.' }, { v: 26, m: 'Cuidado: cuenta solo pesos de verdad, 1 g, 2 g, 3 g… ¿Cuál es el más pesado que puedes medir?' }, { v: 14, m: 'Revisa tu lista: ¿cuál es el peso más grande que puedes medir con las tres pesas?' }, { v: 27, m: 'Revisa tu lista: ¿cuál es el peso más grande que puedes medir con las tres pesas?' }, { v: 3, m: 'Con 3 pesas salen muchos más pesos. Empieza: ¿cuáles salen con las pesas en un solo platillo?' }],
  why: '¿Cómo mides **2 gramos** con pesas de 1, 3 y 9?',
  hints: ['Primero, con las pesas **en un solo platillo**: ¿qué pesos salen? (1, 3, 4…)',
    '¿Cómo medirías **2 g**? Pon la pesa de 3 en un platillo, y el objeto con la pesa de 1 en el otro.',
    'Una pesa **al lado del objeto** es como **restarla**: 2 = 3 − 1. Haz la lista del 1 al 13.',
    'Por ejemplo, 5 = 9 − 3 − 1 y 11 = 9 + 3 − 1. El más pesado es 1 + 3 + 9.'],
  answer: '13 pesos (todos, del 1 g al 13 g)', idea: 'Una pesa **al lado del objeto** cuenta como una **resta**: 2 = 3 − 1. ¡Así se llenan todos los huecos hasta 13!',
  steps: ['En un solo platillo salen 1, 3, 4, 9, 10, 12 y 13: solo **7** pesos.', 'Con una pesa al lado del objeto, se **resta**: 2 = 3 − 1, 5 = 9 − 3 − 1, 6 = 9 − 3, 7 = 9 − 3 + 1, 8 = 9 − 1, 11 = 9 + 3 − 1.', 'Así salen **todos**, del 1 g al 13 g.', 'El más pesado es 1 + 3 + 9 = 13 → **13** pesos distintos.'],
  film: [
    { clear: true, say: 'Pesas de uno, tres y nueve gramos. Si las pesas van siempre en el otro platillo, nunca al lado del objeto, salen siete pesos: uno, tres, cuatro, nueve, diez, doce y trece. Faltan huecos.', show: [{ t: 'grid', k: 'g', n: 13, cols: 7, hl: [1, 3, 4, 9, 10, 12, 13] }] },
    { say: '¿Y el dos? Ponemos la pesa de tres en un platillo, y el objeto con la pesa de uno en el otro. ¡Equilibrio! El objeto pesa tres menos uno: dos.', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '52%', x: scale(['F', '1'], ['3'], 0) }, { t: 'eq', k: 'e', x: '? + 1 = 3 → ? = 3 − 1 = **2**' }] },
    { say: 'Una pesa al lado del objeto cuenta como una resta. El cinco: nueve menos tres, menos uno.', show: [{ t: 'svg', k: 's', vb: '0 0 600 380', h: '52%', x: scale(['F', '3', '1'], ['9'], 0) }, { t: 'eq', k: 'e', x: '? + 3 + 1 = 9 → ? = **5**' }] },
    { clear: true, say: '¡Así se llenan todos los huecos! Seis es nueve menos tres. Siete, nueve menos tres más uno. Ocho, nueve menos uno. Y once, nueve más tres menos uno.', show: [{ t: 'grid', k: 'g', n: 13, cols: 7, hl: [1, 3, 4, 9, 10, 12, 13], hl2: [2, 5, 6, 7, 8, 11] }, { t: 'eq', x: '6 = 9 − 3 · 7 = 9 − 3 + 1 · 8 = 9 − 1 · 11 = 9 + 3 − 1' }] },
    { say: 'Y el más pesado, las tres juntas: trece. Del uno al trece, todos. Trece pesos distintos.', show: [{ t: 'ans', x: '13 pesos' }] },
    { clear: true, say: 'La idea clave: una pesa al lado del objeto cuenta como una resta. Sumando y restando, salen todos.', show: [{ t: 'ans', x: '13 pesos' }, { t: 'idea', x: 'Una pesa **al lado del objeto** cuenta como una **resta**: 2 = 3 − 1.' }] },
  ] },

{ id: 'calle', level: 4, emoji: '🏘️', title: 'La casa de Leo', cat: 'Empezar por lo pequeño',
  q: 'En una calle, las casas están numeradas **1, 2, 3, 4…** seguidas, todas en la misma acera. Hay **más de 10** casas y **menos de 50**.\n\nLeo vive en una casa muy especial: si **sumas** los números de todas las casas que hay **antes** de la suya, da **lo mismo** que si sumas los de todas las casas que hay **después**.\n\n¿Qué **número** tiene la casa de Leo?',
  qSay: 'En una calle, las casas están numeradas uno, dos, tres, cuatro, seguidas, todas en la misma acera. Hay más de diez casas y menos de cincuenta. Leo vive en una casa muy especial: si sumas los números de todas las casas que hay antes de la suya, da lo mismo que si sumas los de todas las casas que hay después. ¿Qué número tiene la casa de Leo?',
  ask: '¿Qué número tiene su casa?', ph: 'Un número', ans: { num: 35, also: [49, 595, 1225, 34, 36, 8, 6, 15, 1, 2] },
  traps: [{ v: 49, m: 'Ese sería el número de **casas** de la calle. ¿Y el de la casa de Leo?' }, { v: 6, m: 'Eso funciona en una calle de **8** casas. Pero esta calle tiene **más de 10**.' }, { v: 595, m: 'Esa es la suma de un lado. ¿Qué número tiene la **casa** de Leo?' }, { v: 1225, m: 'Esa es la suma de **todas** las casas. ¿Qué número tiene la casa de Leo?' },
    ...[24, 25, 30, 33, 34, 36, 40, 20, 12, 14].map(chkC)],
  why: '¿Por qué la suma de **todas** las casas es el número de Leo multiplicado por sí mismo?',
  hints: ['Empieza con **calles pequeñas**. En una calle de 8 casas, ¿hay alguna casa especial?',
    'Con 8 casas, la casa 6 funciona: 1 + 2 + 3 + 4 + 5 = 15 y 7 + 8 = 15. Ahora **suma todas** las casas de esa calle. ¿Qué tiene de especial ese número?',
    'La suma de **todas** las casas es 36 = **6 × 6**: el número de la casa por sí mismo. Busca una calle más larga cuya suma total sea un número **× sí mismo**.',
    'Suma las casas de 11, 12, 13… (o usa el truco de Gauss) y compara con 11 × 11, 12 × 12, 13 × 13… Con 49 casas, la suma es 1225.'],
  answer: 'La casa 35 (la calle tiene 49 casas)', idea: '**Empieza por lo pequeño**: con 8 casas la especial es la 6, y la suma total es 36 = 6 × 6. Busca otra calle cuya suma sea un número × sí mismo: 1225 = 35 × 35.',
  steps: ['Calle de 8 casas: la casa **6** → 1+2+3+4+5 = 15 = 7+8 ✓. Suma total: 36 = **6 × 6**.', 'Siempre pasa: la suma de **todas** las casas = número de Leo × número de Leo.', 'Sumas totales: 11 casas → 66, 12 → 78, 13 → 91… ninguna es un número × sí mismo hasta **49 casas → 1225 = 35 × 35**.', 'Comprueba: 1 + 2 + … + 34 = **595** y 36 + 37 + … + 49 = **595** ✓.'],
  film: [
    { clear: true, say: 'Leo vive en una casa donde las casas de antes suman lo mismo que las de después. Empecemos por lo pequeño: una calle de ocho casas.', show: [{ t: 'row', k: 'r', label: '🏘️', items: R(1, 8).map(String) }] },
    { say: 'En esta calle, la casa seis funciona. Antes: uno, dos, tres, cuatro y cinco suman quince. Después: siete y ocho, quince también.', show: [{ t: 'row', k: 'r', label: '🏘️', items: ['1', '2', '3', '4', '5', '!6', '7', '8'] }, { t: 'eq', k: 'e', x: '1 + 2 + 3 + 4 + 5 = **15** · 7 + 8 = **15**' }] },
    { say: 'Ahora sumemos todas las casas de la calle: treinta y seis. ¡Seis por seis! El número de la casa, por sí mismo.', show: [{ t: 'eq', k: 'e', x: '1 + 2 + … + 8 = **36** = 6 × 6' }] },
    { clear: true, say: '¿Por qué? Las casas de después suman lo mismo que las de antes. Así que el total es: de la uno a la seis, en azul, y otra vez de la uno a la cinco, en naranja. ¡Juntas forman un cuadrado de seis por seis!', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '56%', x: cuadrado(6) }, { t: 'eq', x: '(1 + … + 6) + (1 + … + 5) = 6 × 6' }] },
    { clear: true, say: 'Así que buscamos una calle de más de diez casas cuya suma total sea un número por sí mismo. Sumamos casa a casa… y con cuarenta y nueve casas: mil doscientos veinticinco. ¡Treinta y cinco por treinta y cinco!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Casas', 'Suma total', '¿n × n?'], [11, 66, '✗'], [12, 78, '✗'], [13, 91, '✗'], ['…', '…', ''], [49, '!1225', '!35 × 35 ✓']] }] },
    { say: 'Comprobemos. Antes de la treinta y cinco, las casas suman quinientos noventa y cinco. Después, también quinientos noventa y cinco. ¡Leo vive en la casa treinta y cinco!', show: [{ t: 'eq', k: 'e', x: '1 + … + 34 = **595** · 36 + … + 49 = **595**' }, { t: 'ans', x: 'Casa 35' }] },
    { clear: true, say: 'La idea clave: empieza por lo pequeño y busca lo que siempre pasa. Un problema parecido se lo leyeron al gran matemático indio Ramanujan mientras removía la verdura en una sartén, ¡y dictó la solución sin dejar de cocinar!', show: [{ t: 'ans', x: 'Casa 35' }, { t: 'idea', x: '**Empieza por lo pequeño**: con 8 casas, 36 = 6 × 6. Con 49 casas, 1225 = **35 × 35**.' }] },
  ] },

// ===================== Batch 6 (24 Nov 2026): 3 more per level. Answers: verify6.py =====================
// --- Nivel 1 ---
{ id: 'arboles', level: 1, emoji: '🌳', title: 'Árboles en el jardín', cat: 'No contar dos veces',
  q: 'Un jardín tiene forma de **cuadrado**. El jardinero planta árboles en el borde, de forma que en **cada lado** hay **5 árboles**, contando los de las **esquinas**.\n\n¿Cuántos árboles planta **en total**?',
  qSay: 'Un jardín tiene forma de cuadrado. El jardinero planta árboles en el borde, de forma que en cada lado hay cinco árboles, contando los de las esquinas. ¿Cuántos árboles planta en total?',
  ask: '¿Cuántos árboles?', ph: 'Un número', ans: { num: 16, also: [4, 5, 20, 3, 12] },
  traps: [{ v: 20, m: '¡Dibújalo! Pon 5 árboles en cada lado. El árbol de una esquina, ¿en cuántos lados está?' }, { v: 24, m: 'Dibuja el jardín con 5 árboles en cada lado y cuenta los árboles uno a uno.' }, { v: 12, m: 'Dibuja el jardín con 5 árboles en cada lado y cuenta los árboles uno a uno. ¿Has contado las esquinas?' }, { v: 15, m: 'Casi. Dibuja el jardín y cuenta los árboles uno a uno.' }, { v: 18, m: 'Dibuja el jardín con 5 árboles en cada lado y cuenta los árboles uno a uno.' }],
  why: '¿Por qué no son 4 × 5 = 20?',
  hints: ['**Dibuja** el cuadrado y pon 5 árboles en el lado de arriba.',
    'Ahora el lado de la derecha: el árbol de la esquina **ya está puesto**. ¿Cuántos árboles nuevos añades?',
    'Cada árbol de una esquina está en **dos lados** a la vez. Si haces 4 × 5, ¿cuántas veces cuentas cada esquina?',
    '4 × 5 = 20, pero los 4 árboles de las esquinas se han contado dos veces.'],
  answer: '16 árboles', idea: '**No cuentes dos veces**: cada árbol de una esquina está en **dos lados** a la vez.',
  steps: ['4 lados × 5 árboles = 20… ¡pero cuidado!', 'Cada árbol de una esquina está en **dos lados**: lo has contado **dos veces**.', 'Hay 4 esquinas → sobran 4: 20 − 4 = **16**.', 'Otra forma: 3 árboles en el medio de cada lado (3 × 4 = 12) más las 4 esquinas = **16**.'],
  film: [
    { clear: true, say: 'Un jardín cuadrado, con cinco árboles en cada lado, contando las esquinas. ¿Cuántos árboles hay? Mucha gente hace cuatro por cinco: veinte. ¡Vamos a contarlos!', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '60%', x: jardin(false) }] },
    { say: 'Mira el árbol de esta esquina: está en el lado de arriba, y también en el de la izquierda. Si cuentas lado por lado, ¡lo cuentas dos veces! Y lo mismo pasa en las cuatro esquinas.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '60%', x: jardin(true) }, { t: 'eq', k: 'e', x: '4 × 5 = 20 → las **4 esquinas**, contadas **dos veces**' }] },
    { say: 'Así que quitamos las cuatro esquinas repetidas. Veinte menos cuatro: dieciséis árboles.', show: [{ t: 'eq', k: 'e', x: '20 − 4 = **16**' }, { t: 'ans', x: '16 árboles' }] },
    { say: 'Otra forma: en el medio de cada lado hay tres árboles. Tres por cuatro, doce. Más las cuatro esquinas: dieciséis.', show: [{ t: 'eq', k: 'e', x: '3 × 4 + 4 = **16**' }] },
    { clear: true, say: 'La idea clave: no cuentes dos veces. Los árboles de las esquinas están en dos lados a la vez.', show: [{ t: 'ans', x: '16 árboles' }, { t: 'idea', x: '**No cuentes dos veces**: cada esquina está en **dos lados**.' }] },
  ] },

{ id: 'tunel', level: 1, emoji: '🚆', title: 'El tren y el túnel', cat: 'Seguir el último vagón',
  q: 'Un tren de **200 metros** de largo va a **200 metros por minuto**. Tiene que atravesar un túnel de **400 metros**.\n\n¿Cuántos **minutos** pasan desde que la **locomotora entra** en el túnel hasta que el **último vagón sale**?',
  qSay: 'Un tren de doscientos metros de largo va a doscientos metros por minuto. Tiene que atravesar un túnel de cuatrocientos metros. ¿Cuántos minutos pasan desde que la locomotora entra en el túnel hasta que el último vagón sale?',
  pic: `<svg viewBox="0 0 600 190">${tunel(0)}</svg>`,
  ask: '¿Cuántos minutos?', ph: 'Solo el número de minutos', ans: { num: 3, also: [200, 400, 600, 2, 1] },
  traps: [{ v: 2, m: 'A los 2 minutos sale la **locomotora**. ¿Dónde está en ese momento el **último vagón**?' }, { v: 600, m: 'Eso son **metros**. ¿Cuántos **minutos** tarda en recorrerlos?' }, { v: 1, m: 'En 1 minuto el tren avanza 200 metros. ¿Le da tiempo a cruzar un túnel de 400?' }, { v: 4, m: 'Dibuja el túnel y el tren. Fíjate en el **último vagón**: ¿cuántos metros recorre hasta salir?' }, { v: 6, m: 'Dibuja el túnel y el tren. Fíjate en el **último vagón**: ¿cuántos metros recorre hasta salir?' }],
  why: '¿Por qué no bastan 2 minutos?',
  hints: ['**Dibuja** el túnel y el tren. Fíjate solo en el **último vagón**: ¿dónde está cuando la locomotora entra?',
    'Cuando la locomotora entra, el último vagón está **200 metros por detrás**, todavía fuera.',
    'Para salir, el último vagón tiene que recorrer esos 200 metros **y además** los 400 del túnel.',
    'El último vagón recorre 600 metros, a 200 metros por minuto.'],
  answer: '3 minutos', idea: '**Sigue al último vagón**: el tren no ha salido hasta que sale **entero**.',
  steps: ['Cuando la locomotora entra, el último vagón va **200 m** por detrás.', 'Para salir, el último vagón recorre 200 + 400 = **600 m**.', 'A 200 m por minuto: 600 ÷ 200 = **3 minutos**.', 'Ojo: a los 2 minutos sale la locomotora, pero el tren aún no ha salido entero.'],
  film: [
    { clear: true, say: 'Un tren de doscientos metros atraviesa un túnel de cuatrocientos, a doscientos metros por minuto. Mucha gente piensa: el túnel mide cuatrocientos, así que dos minutos.', show: [{ t: 'svg', k: 's', vb: '0 0 600 190', h: '48%', x: tunel(0) }] },
    { say: 'A los dos minutos, la locomotora amarilla sale del túnel. Pero mira el último vagón, el rojo: ¡todavía está dentro!', show: [{ t: 'svg', k: 's', vb: '0 0 600 190', h: '48%', x: tunel(400) }, { t: 'eq', k: 'e', x: '2 min → sale la locomotora… ¡el último vagón sigue **dentro**!' }] },
    { say: 'El último vagón empezó doscientos metros por detrás. Tiene que recorrer esos doscientos, más los cuatrocientos del túnel: seiscientos metros.', show: [{ t: 'svg', k: 's', vb: '0 0 600 190', h: '48%', x: tunel(600) }, { t: 'eq', k: 'e', x: '200 + 400 = **600 m**' }] },
    { say: 'Seiscientos metros, a doscientos por minuto: tres minutos.', show: [{ t: 'eq', k: 'e', x: '600 ÷ 200 = **3 minutos**' }, { t: 'ans', x: '3 minutos' }] },
    { clear: true, say: 'La idea clave: sigue al último vagón. El tren no ha salido del túnel hasta que sale entero.', show: [{ t: 'ans', x: '3 minutos' }, { t: 'idea', x: '**Sigue al último vagón**: el tren no ha salido hasta que sale **entero**.' }] },
  ] },

{ id: 'cuerda', level: 1, emoji: '✂️', title: 'La cuerda doblada', cat: 'Hacerlo de verdad',
  q: 'Coges una cuerda, la **doblas por la mitad** y, con las dos partes bien juntas, das **un solo corte** con las tijeras justo **por el medio** de la cuerda doblada, a mitad de camino entre el doblez y las puntas.\n\n¿En cuántos **trozos** queda la cuerda?',
  qSay: 'Coges una cuerda, la doblas por la mitad y, con las dos partes bien juntas, das un solo corte con las tijeras justo por el medio de la cuerda doblada, a mitad de camino entre el doblez y las puntas. ¿En cuántos trozos queda la cuerda?',
  ask: '¿Cuántos trozos?', ph: 'Un número', ans: { num: 3, also: [1, 2] },
  traps: [{ v: 2, m: '¡Pruébalo con un cordón o un hilo de verdad! Dobla, corta y **cuenta** los trozos.' }, { v: 4, m: '¡Pruébalo con un hilo de verdad! Después de cortar, ¿están **todos** los trozos sueltos?' }, { v: 1, m: '¡Pruébalo con un hilo de verdad! Dobla, corta y **cuenta** los trozos.' }],
  why: '¿Por qué no salen 4 trozos?',
  hints: ['**Hazlo de verdad** con un cordón o un trozo de lana (¡pide permiso para usar las tijeras!).',
    'Si no tienes cuerda, **dibújala**: una línea doblada por la mitad, como una U tumbada. Marca dónde corta la tijera.',
    'Con la cuerda doblada, la tijera corta la cuerda en **2 sitios** a la vez.',
    'Al cortar por 2 sitios salen los dos extremos… y el trozo del medio, el del doblez.'],
  answer: '3 trozos', idea: '**Hazlo de verdad** (o dibújalo): el corte pasa por 2 sitios de la cuerda, y el trozo del **doblez** queda de una pieza.',
  steps: ['Al doblarla, la tijera corta la cuerda en **2 sitios** a la vez.', 'Una cuerda cortada en 2 sitios queda en **3 trozos**.', 'Los dos extremos sueltos y el trozo del **medio**, el que tiene el doblez.', 'No salen 4: el doblez mantiene unido el trozo del medio.'],
  film: [
    { clear: true, say: 'Doblas una cuerda por la mitad y das un corte justo por el medio. ¿Cuántos trozos salen? Mucha gente dice dos, o cuatro. ¡Vamos a verlo!', show: [{ t: 'svg', k: 's', vb: '0 0 400 190', h: '46%', x: cuerda(0) }] },
    { say: 'La doblamos. Ahora la cuerda pasa dos veces por debajo de la tijera. El corte la corta por dos sitios a la vez.', show: [{ t: 'svg', k: 's', vb: '0 0 400 190', h: '46%', x: cuerda(1) }, { t: 'eq', k: 'e', x: '1 corte → la cuerda, cortada en **2 sitios**' }] },
    { say: 'Cortamos. Salen dos extremos sueltos, el naranja y el azul… y el trozo verde del doblez, que sigue de una pieza.', show: [{ t: 'svg', k: 's', vb: '0 0 400 190', h: '46%', x: cuerda(2) }] },
    { say: 'Si la estiramos, se ve claro: tres trozos.', show: [{ t: 'svg', k: 's', vb: '0 0 400 190', h: '46%', x: cuerda(3) }, { t: 'eq', k: 'e', x: 'Cortada en 2 sitios → **3 trozos**' }, { t: 'ans', x: '3 trozos' }] },
    { clear: true, say: 'La idea clave: si puedes, hazlo de verdad. Y si no, dibújalo. El doblez mantiene unido el trozo del medio.', show: [{ t: 'ans', x: '3 trozos' }, { t: 'idea', x: '**Hazlo de verdad** (o dibújalo): el trozo del **doblez** queda de una pieza.' }] },
  ] },

// --- Nivel 2 ---
{ id: 'chocolate', level: 2, emoji: '🍫', title: 'La tableta de chocolate', cat: 'Cada corte, un trozo más',
  q: 'Una tableta de chocolate tiene **4 filas** de **6 onzas**: 24 onzas en total. Quieres separarla en **onzas sueltas**.\nCada vez, coges **un solo trozo** y lo partes **en dos** por una de sus rayas (sin poner trozos uno encima de otro).\n\n¿Cuántas veces tienes que partir, **como mínimo**?',
  qSay: 'Una tableta de chocolate tiene cuatro filas de seis onzas: veinticuatro onzas en total. Quieres separarla en onzas sueltas. Cada vez, coges un solo trozo y lo partes en dos por una de sus rayas, sin poner trozos uno encima de otro. ¿Cuántas veces tienes que partir, como mínimo?',
  pic: `<svg viewBox="0 0 370 250">${tableta(4, 6, false, 0)}</svg>`,
  ask: '¿Cuántas veces?', ph: 'Un número', ans: { num: 23, also: [4, 6, 24, 1, 3, 5, 20] },
  traps: [{ v: 8, m: 'Cuidado: cada vez partes **un solo trozo**. Prueba con una tableta pequeña, de 2 × 2, y cuenta.' }, { v: 24, m: 'Comprueba con una tableta muy pequeña: una de **2** onzas, ¿cuántas veces hay que partirla?' }, { v: 20, m: 'Casi. ¿Has contado también las veces que separas las **filas**?' }, { v: 18, m: 'Prueba con una tableta pequeña, de 2 × 2, y cuenta las veces que partes.' }, { v: 22, m: 'Casi. Prueba con una tableta pequeña, de 2 × 2, y cuenta las veces que partes.' }, { v: 12, m: 'Prueba con una tableta pequeña, de 2 × 2, y cuenta las veces que partes.' }, { v: 10, m: 'Cuidado: cada vez partes **un solo trozo**. Prueba con una tableta pequeña, de 2 × 2, y cuenta.' }],
  why: '¿Por qué da igual **cómo** la partas?',
  hints: ['Prueba con una tableta **pequeña**, de 2 × 2 onzas. ¿Cuántas veces la partes?',
    'Fíjate en **cuántos trozos** tienes antes y después de cada partida.',
    'Cada vez que partes, tienes **un trozo más**. Empiezas con 1 trozo y quieres llegar a 24.',
    'De 1 trozo a 24 trozos hacen falta 23 "trozos más".'],
  answer: '23 veces', idea: '**Cada partida, un trozo más**: de 1 trozo a 24 hacen falta **23** partidas, ¡la partas como la partas!',
  steps: ['Al principio tienes **1 trozo**: la tableta entera.', 'Cada vez que partes un trozo en dos, tienes **un trozo más**.', 'Para llegar a **24** trozos hacen falta 24 − 1 = **23** partidas.', 'Por ejemplo: 3 partidas para separar las 4 filas, y 5 en cada fila: 3 + 4 × 5 = **23**.'],
  film: [
    { clear: true, say: 'Una tableta de veinticuatro onzas. ¿Cuántas veces hay que partirla para tener todas las onzas sueltas? Probemos primero con una pequeña, de dos por dos.', show: [{ t: 'svg', k: 's', vb: '0 0 160 160', h: '34%', x: tableta(2, 2, false, 0) }] },
    { say: 'Una partida: dos trozos. Otra: tres. Otra: cuatro. Tres partidas para cuatro onzas. ¡Cada partida da un trozo más!', show: [{ t: 'svg', k: 's', vb: '0 0 160 160', h: '34%', x: tableta(2, 2, true, 2) }, { t: 'tbl', k: 't', head: true, rows: [['Partidas', 0, 1, 2, 3], ['Trozos', 1, 2, 3, '!4']] }] },
    { clear: true, say: 'Con la grande: empiezas con un trozo y quieres veinticuatro. Cada partida, un trozo más. Así que veintitrés partidas.', show: [{ t: 'svg', k: 's', vb: '0 0 370 250', h: '46%', x: tableta(4, 6, false, 0) }, { t: 'eq', k: 'e', x: '1 trozo → 24 trozos: 24 − 1 = **23** partidas' }] },
    { say: 'Comprobemos: tres partidas para separar las cuatro filas, y cinco en cada fila. Tres más veinte: veintitrés.', show: [{ t: 'svg', k: 's', vb: '0 0 420 290', h: '46%', x: tableta(4, 6, true, 4) }, { t: 'eq', k: 'e', x: '3 + 4 × 5 = **23**' }, { t: 'ans', x: '23 veces' }] },
    { clear: true, say: 'La idea clave: cada partida da un trozo más. Da igual cómo la partas: siempre veintitrés.', show: [{ t: 'ans', x: '23 veces' }, { t: 'idea', x: '**Cada partida, un trozo más**: de 1 a 24 trozos, **23** partidas.' }] },
  ] },

{ id: 'engranajes', level: 2, emoji: '⚙️', title: 'Las ruedas dentadas', cat: 'Contar dientes',
  q: 'Dos ruedas dentadas están **engranadas**: cuando una gira, empuja a la otra. La pequeña tiene **12 dientes** y la grande **36**.\n\nSi la rueda **pequeña** da **6 vueltas**, ¿cuántas vueltas da la **grande**?',
  qSay: 'Dos ruedas dentadas están engranadas: cuando una gira, empuja a la otra. La pequeña tiene doce dientes y la grande treinta y seis. Si la rueda pequeña da seis vueltas, ¿cuántas vueltas da la grande?',
  pic: `<svg viewBox="0 0 420 300">${ruedas(false)}</svg>`,
  ask: '¿Cuántas vueltas?', ph: 'Un número', ans: { num: 2, also: [12, 36, 6, 72, 3] },
  traps: [{ v: 18, m: 'La rueda grande, ¿gira **más** deprisa o más despacio que la pequeña?' }, { v: 6, m: '¿Dan las dos ruedas las mismas vueltas? Cuenta los **dientes** que pasan.' }, { v: 72, m: '72 son **dientes**. ¿Cuántas **vueltas** de la grande son?' }, { v: 3, m: 'Cuenta los dientes: en 6 vueltas de la pequeña, ¿cuántos dientes pasan?' }, { v: 4, m: 'Cuenta los dientes: en 6 vueltas de la pequeña, ¿cuántos dientes pasan?' }, { v: 1, m: 'Cuenta los dientes: en 6 vueltas de la pequeña, ¿cuántos dientes pasan?' }, { v: 24, m: 'La rueda grande, ¿gira **más** deprisa o más despacio que la pequeña?' }],
  why: '¿Y si la pequeña diera **9** vueltas? ¿Cuántas daría la grande?',
  hints: ['Mira el sitio donde se tocan las ruedas: cada vez que pasa **un diente** de la pequeña, pasa **un diente** de la grande.',
    'En 6 vueltas de la pequeña, ¿cuántos dientes pasan? (12 en cada vuelta.)',
    'Pasan 72 dientes de la pequeña… y también **72** de la grande.',
    'Una vuelta de la grande son 36 dientes. ¿Cuántas vueltas son 72 dientes?'],
  answer: '2 vueltas', idea: '**Cuenta los dientes que pasan**: por las dos ruedas pasan **los mismos**.',
  steps: ['En cada vuelta de la pequeña pasan **12** dientes.', '6 vueltas → 6 × 12 = **72** dientes.', 'Por la grande pasan los mismos **72** dientes.', '72 ÷ 36 = **2 vueltas**.'],
  film: [
    { clear: true, say: 'Dos ruedas dentadas: la pequeña tiene doce dientes, la grande treinta y seis. Si la pequeña da seis vueltas, ¿cuántas da la grande?', show: [{ t: 'svg', k: 's', vb: '0 0 420 300', h: '56%', x: ruedas(false) }] },
    { say: 'Fíjate donde se tocan: cada vez que pasa un diente de la pequeña, pasa también un diente de la grande. Uno y uno. Por eso la grande gira más despacio.', show: [{ t: 'svg', k: 's', vb: '0 0 420 300', h: '56%', x: ruedas(true) }] },
    { say: 'En seis vueltas de la pequeña pasan seis por doce: setenta y dos dientes.', show: [{ t: 'eq', k: 'e', x: '6 vueltas × 12 dientes = **72** dientes' }] },
    { say: 'Por la grande pasan los mismos setenta y dos dientes. Y cada vuelta suya son treinta y seis. Setenta y dos entre treinta y seis: ¡dos vueltas!', show: [{ t: 'eq', k: 'e', x: '72 ÷ 36 = **2 vueltas**' }, { t: 'ans', x: '2 vueltas' }] },
    { clear: true, say: 'La idea clave: cuenta los dientes que pasan. Por las dos ruedas pasan los mismos.', show: [{ t: 'ans', x: '2 vueltas' }, { t: 'idea', x: '**Cuenta los dientes**: por las dos ruedas pasan **los mismos**.' }] },
  ] },

{ id: 'cromos', level: 2, emoji: '🃏', title: 'Los cromos de Ana y Bea', cat: 'Dibujar barras',
  q: 'Ana tiene **el doble** de cromos que Bea. Si Ana le da **6 cromos** a Bea, las dos tienen **los mismos**.\n\n¿Cuántos cromos tienen **entre las dos**?',
  qSay: 'Ana tiene el doble de cromos que Bea. Si Ana le da seis cromos a Bea, las dos tienen los mismos. ¿Cuántos cromos tienen entre las dos?',
  ask: '¿Cuántos cromos entre las dos?', ph: 'Un número', ans: { num: 36, also: [6, 12, 24, 18, 2] },
  traps: [{ v: 12, m: '¿12 cromos **entre las dos**? Comprueba con el enunciado: ¿cuántos tendría cada una?' }, { v: 24, m: '¿24 cromos **entre las dos**? Comprueba con el enunciado: ¿cuántos tendría cada una?' }, { v: 18, m: 'Comprueba: si Bea tuviera 6 y Ana 12, después de darle 6 cromos, ¿tendrían las mismas?' }, { v: 6, m: 'Comprueba: si tuvieran 6 entre las dos, ¿podría Ana darle 6 cromos a Bea?' }, { v: 30, m: 'Comprueba: ¿tiene Ana el doble que Bea? ¿Y después de darle 6, tienen las mismas?' }, { v: 48, m: 'Comprueba: ¿tiene Ana el doble que Bea? ¿Y después de darle 6, tienen las mismas?' }, { v: 9, m: 'Comprueba: ¿tiene Ana el doble que Bea? ¿Y después de darle 6, tienen las mismas?' }],
  why: '¿Cómo compruebas que tu respuesta cumple **las dos** cosas que dice el enunciado?',
  hints: ['**Dibuja** una barra para los cromos de Bea, y para Ana, **dos barras** iguales.',
    'Ana tiene **una barra de más** que Bea. Para quedar iguales, ¿le da la barra entera?',
    'Si Ana le diera la barra entera, ¡Bea tendría más! Le da **la mitad** de esa barra. Esa mitad son 6 cromos.',
    'Media barra = 6 cromos, así que una barra entera = 12.'],
  answer: '36 cromos (Ana 24, Bea 12)', idea: '**Dibuja barras**: para igualar, el que tiene más da **la mitad** de lo que le sobra.',
  steps: ['Bea: **1 barra**. Ana: **2 barras**. Ana tiene 1 barra de más.', 'Para igualar, Ana da **media barra** (y se queda la otra media): media barra = 6.', 'Una barra = **12** cromos: Bea 12, Ana 24.', 'Entre las dos: 12 + 24 = **36**. Comprueba: Ana 24 − 6 = 18 y Bea 12 + 6 = 18 ✓.'],
  film: [
    { clear: true, say: 'Ana tiene el doble de cromos que Bea. Dibujemos barras: una para Bea, y dos iguales para Ana.', show: [{ t: 'svg', k: 's', vb: '0 0 360 180', h: '42%', x: barras(0) }] },
    { say: 'Ana tiene una barra de más. Si le da a Bea la mitad de esa barra, ¡quedan iguales! Así que media barra son los seis cromos.', show: [{ t: 'svg', k: 's', vb: '0 0 360 180', h: '42%', x: barras(1) }, { t: 'eq', k: 'e', x: 'media barra = **6** cromos' }] },
    { say: 'Una barra entera: doce. Bea tiene doce, y Ana, veinticuatro. Entre las dos, treinta y seis.', show: [{ t: 'svg', k: 's', vb: '0 0 360 180', h: '42%', x: barras(2) }, { t: 'eq', k: 'e', x: '12 + 24 = **36**' }, { t: 'ans', x: '36 cromos' }] },
    { say: 'Comprobemos: Ana da seis y se queda con dieciocho. Bea recibe seis y tiene dieciocho. ¡Iguales!', show: [{ t: 'eq', k: 'e', x: 'Ana: 24 − 6 = **18** · Bea: 12 + 6 = **18** ✓' }] },
    { clear: true, say: 'La idea clave: dibuja barras. Para igualar, el que tiene más da la mitad de lo que le sobra.', show: [{ t: 'ans', x: '36 cromos' }, { t: 'idea', x: '**Dibuja barras**: para igualar, se da **la mitad** de lo que sobra.' }] },
  ] },

// --- Nivel 3 ---
{ id: 'grifos', level: 3, emoji: '🛁', title: 'Los dos grifos', cat: 'Mirar el mismo tiempo',
  q: 'El grifo **grande** llena la bañera en **3 minutos**. El grifo **pequeño** la llena en **6 minutos**.\n\nSi abres **los dos a la vez**, ¿cuántos **minutos** tarda en llenarse la bañera?',
  qSay: 'El grifo grande llena la bañera en tres minutos. El grifo pequeño la llena en seis minutos. Si abres los dos a la vez, ¿cuántos minutos tarda en llenarse la bañera?',
  ask: '¿Cuántos minutos?', ph: 'Solo el número de minutos', ans: { num: 2, also: [3, 6] },
  traps: [{ v: 9, m: 'Con los dos grifos abiertos, ¿tardará **más** o menos que con el grande solo?' }, { v: 3, m: 'Eso es lo que tarda el grande **solo**. Con el pequeño ayudando, ¿no irá más rápido?' }, { v: 4, m: 'Con los dos abiertos, ¿tardará más o menos que con el grande **solo** (3 minutos)?' }, { v: 5, m: 'Con los dos abiertos, ¿tardará más o menos que con el grande **solo** (3 minutos)?' }, { v: 1, m: 'Comprueba: en 1 minuto, ¿qué parte de la bañera llena cada grifo? ¿Se llena entera?' }, { v: 18, m: 'Con los dos grifos abiertos, ¿tardará **más** o menos que con el grande solo?' }],
  why: '¿Por qué tiene que salir **menos** de 3 minutos?',
  hints: ['Piensa en un tiempo en el que **los dos** grifos llenen bañeras **enteras**. Por ejemplo, **6 minutos** (con bañeras de sobra).',
    'En 6 minutos, el grande llena **2** bañeras y el pequeño **1**.',
    'Juntos, en 6 minutos llenan **3 bañeras**.',
    '3 bañeras en 6 minutos. ¿Cuánto tardan en llenar una?'],
  answer: '2 minutos', idea: '**Mira lo que hacen en el mismo tiempo**: en 6 minutos, los dos juntos llenan 3 bañeras → una cada 2 minutos.',
  steps: ['Imagina **6 minutos** con los dos grifos abiertos (y bañeras de sobra).', 'El grande llena 6 ÷ 3 = **2** bañeras; el pequeño, 6 ÷ 6 = **1**.', 'Juntos: **3 bañeras en 6 minutos**.', 'Una bañera: 6 ÷ 3 = **2 minutos**.'],
  film: [
    { clear: true, say: 'El grifo grande llena la bañera en tres minutos; el pequeño, en seis. ¿Y los dos juntos? Mucha gente suma: nueve. ¡Pero con dos grifos tiene que ir más rápido!', show: [{ t: 'eq', k: 'e', x: 'Grande: **3 min** · Pequeño: **6 min** · ¿Juntos?' }] },
    { say: 'El truco: imagina seis minutos, con bañeras de sobra. El grande llena dos bañeras. El pequeño, una.', show: [{ t: 'tbl', k: 't', head: true, rows: [['En 6 minutos', 'Bañeras'], ['Grifo grande', '🛁 🛁'], ['Grifo pequeño', '🛁']] }] },
    { say: 'Juntos, tres bañeras en seis minutos. Así que una bañera, en dos minutos.', show: [{ t: 'tbl', k: 't', head: true, rows: [['En 6 minutos', 'Bañeras'], ['Grifo grande', '🛁 🛁'], ['Grifo pequeño', '🛁'], ['Los dos', '!🛁 🛁 🛁']] }, { t: 'eq', k: 'e', x: '3 bañeras en 6 min → 1 bañera en **2 min**' }, { t: 'ans', x: '2 minutos' }] },
    { clear: true, say: 'La idea clave: mira lo que hacen en el mismo tiempo. En seis minutos, los dos grifos llenan tres bañeras.', show: [{ t: 'ans', x: '2 minutos' }, { t: 'idea', x: '**El mismo tiempo**: en 6 min llenan 3 bañeras → una cada **2 min**.' }] },
  ] },

{ id: 'fotos', level: 3, emoji: '📸', title: 'La foto de los cuatro', cat: 'Elegir al primero',
  q: '**Cuatro amigos**, Ana, Bea, Carlos y Dani, se ponen **en fila** para hacerse una foto.\n\n¿Cuántas fotos **distintas** pueden hacerse, cambiando el **orden** de la fila?',
  qSay: 'Cuatro amigos, Ana, Bea, Carlos y Dani, se ponen en fila para hacerse una foto. ¿Cuántas fotos distintas pueden hacerse, cambiando el orden de la fila?',
  ask: '¿Cuántas fotos?', ph: 'Un número', ans: { num: 24, also: [4, 3, 2, 1, 6] },
  traps: [{ v: 16, m: 'Comprueba con solo **3** amigos: haz la lista de todas las filas posibles. ¿Cuántas salen?' }, { v: 12, m: 'Hay más. ¿Quién puede ir **primero**? Para cada uno, ¿cuántas filas salen?' }, { v: 6, m: 'Hay más. Haz la lista de las filas que empiezan por **Ana**. ¿Y las que empiezan por los demás?' }, { v: 4, m: 'Hay muchas más. ¿Quién puede ir **primero**? Para cada uno, ¿cuántas filas salen?' }, { v: 8, m: 'Hay más. ¿Quién puede ir **primero**? Para cada uno, ¿cuántas filas salen?' }, { v: 10, m: 'Comprueba con solo **3** amigos: haz la lista de todas las filas posibles.' }, { v: 256, m: '¿Puede salir la misma persona **dos veces** en la foto?' }, { v: 64, m: '¿Puede salir la misma persona **dos veces** en la foto?' }, { v: 120, m: '¡Esas son las fotos de **5** amigos! Aquí son 4.' }],
  why: '¿Y si fueran **5** amigos?',
  hints: ['Empieza con **3** amigos: haz la lista de todas las filas. ¿Cuántas salen?',
    'Con 4: ¿cuántos pueden ir **primero**? Si Ana va primera, quedan 3 para ordenar detrás.',
    'Elijas a quien elijas como primero, los otros 3 se pueden ordenar de **6** maneras.',
    '4 posibles primeros, y para cada uno, 6 filas.'],
  answer: '24 fotos', idea: '**Elige al primero** y cuenta lo que queda: 4 primeros × 6 filas detrás = 24.',
  steps: ['Con 3 amigos salen **6** filas: ABC, ACB, BAC, BCA, CAB, CBA.', 'Con 4, el primero puede ser cualquiera de los **4**.', 'Detrás, los otros 3 se ordenan de **6** maneras.', '4 × 6 = **24** fotos. (Es 4 × 3 × 2 × 1; con 5 amigos, 5 × 24 = 120.)'],
  film: [
    { clear: true, say: 'Cuatro amigos en fila para una foto. ¿Cuántas fotos distintas? Empecemos con solo tres: Ana, Bea y Carlos.', show: [{ t: 'row', k: 'r', items: ['#d3f9d8|Ana', '#d0ebff|Bea', '#fff3bf|Carlos'] }] },
    { say: 'Si Ana va primera: Ana, Bea, Carlos; o Ana, Carlos, Bea. Dos filas. Y lo mismo si empieza Bea, o Carlos. Tres por dos: seis.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Primero', 'Filas'], ['Ana', 'A B C · A C B'], ['Bea', 'B A C · B C A'], ['Carlos', 'C A B · C B A']] }, { t: 'eq', k: 'e', x: '3 × 2 = **6** filas' }] },
    { clear: true, say: 'Ahora llega Dani. Hay cuatro que pueden ir primeros. Y detrás de cada uno, los otros tres se ordenan de seis maneras.', show: [{ t: 'row', k: 'r', items: ['#d3f9d8|Ana', '#d0ebff|Bea', '#fff3bf|Carlos', '#ffe3e3|Dani'] }, { t: 'tbl', k: 't', head: true, rows: [['Primero', 'Detrás', 'Filas'], ['Ana', 'B, C, D', 6], ['Bea', 'A, C, D', 6], ['Carlos', 'A, B, D', 6], ['Dani', 'A, B, C', 6]] }] },
    { say: 'Cuatro por seis: veinticuatro fotos. Es cuatro, por tres, por dos, por uno.', show: [{ t: 'eq', k: 'e', x: '4 × 6 = 4 × 3 × 2 × 1 = **24**' }, { t: 'ans', x: '24 fotos' }] },
    { clear: true, say: 'La idea clave: elige primero quién va delante, y luego cuenta lo que queda. Con cinco amigos serían cinco por veinticuatro: ¡ciento veinte fotos!', show: [{ t: 'ans', x: '24 fotos' }, { t: 'idea', x: '**Elige al primero** y cuenta lo que queda: 4 × 6 = **24**.' }] },
  ] },

{ id: 'revista', level: 3, emoji: '📰', title: 'La hoja de la revista', cat: 'Hacerlo de verdad',
  q: 'Una revista de **20 páginas** está hecha con hojas de papel **dobladas por la mitad**, metidas **una dentro de otra** y grapadas en el doblez. Cada hoja lleva **4 páginas** de la revista.\n\nUna de las hojas lleva la **página 3**. ¿Cuánto **suman** los números de las **4 páginas** de esa hoja?',
  qSay: 'Una revista de veinte páginas está hecha con hojas de papel dobladas por la mitad, metidas una dentro de otra y grapadas en el doblez. Cada hoja lleva cuatro páginas de la revista. Una de las hojas lleva la página tres. ¿Cuánto suman los números de las cuatro páginas de esa hoja?',
  ask: '¿Cuánto suman?', ph: 'Un número', ans: { num: 42, also: [20, 4, 3, 17, 18, 21, 2, 5] },
  traps: [{ v: 18, m: '¡Dobla unas hojas de papel y numera las páginas! ¿Están de verdad las páginas 3, 4, 5 y 6 en la misma hoja?' }, { v: 10, m: '¡Dobla unas hojas de papel y numera las páginas! ¿Están de verdad las páginas 1, 2, 3 y 4 en la misma hoja?' }, { v: 7, m: 'Has sumado solo **2** páginas. La hoja lleva **4**: ¿cuáles son las otras dos?' }, { v: 21, m: 'Has sumado solo **2** páginas. La hoja lleva **4**: ¿cuáles son las otras dos?' }, { v: 35, m: 'Has sumado solo **2** páginas. La hoja lleva **4**: ¿cuáles son las otras dos?' }, { v: 40, m: 'Casi. Dobla 5 hojas, mételas una dentro de otra y numera las páginas: ¿cuáles van con la 3?' }, { v: 44, m: 'Casi. Dobla 5 hojas, mételas una dentro de otra y numera las páginas: ¿cuáles van con la 3?' }, { v: 38, m: 'Dobla 5 hojas, mételas una dentro de otra y numera las páginas: ¿cuáles van con la 3?' }, { v: 46, m: 'Dobla 5 hojas, mételas una dentro de otra y numera las páginas: ¿cuáles van con la 3?' }],
  why: '¿Qué páginas lleva la hoja **del centro**, la de las grapas?',
  hints: ['**Hazlo de verdad**: dobla 5 hojas de papel, mételas una dentro de otra y numera las páginas del 1 al 20.',
    'La hoja de **fuera** lleva las páginas 1 y 2… y también **las dos últimas**: 19 y 20.',
    'La siguiente hoja, la que lleva la página 3, lleva también la 4… y **dos páginas del final** de la revista.',
    'En cada hoja, una página del principio y una del final suman siempre **21** (1 + 20, 2 + 19…).'],
  answer: '42 (páginas 3, 4, 17 y 18)', idea: '**Hazlo de verdad, y empareja**: en cada hoja, una página del principio va con una del final, y suman 21.',
  steps: ['20 páginas ÷ 4 = **5 hojas**.', 'Hoja de fuera: **1, 2, 19, 20**. La siguiente: **3, 4, 17, 18**.', '3 + 4 + 17 + 18 = **42**.', 'Truco: 3 + 18 = 21 y 4 + 17 = 21 → 2 × 21 = 42. ¡Todas las hojas suman 42!'],
  film: [
    { clear: true, say: 'Una revista de veinte páginas, hecha con hojas dobladas, una dentro de otra. Cada hoja lleva cuatro páginas, así que hay cinco hojas. ¿Qué páginas van con la tres? ¡Coge papel y hazlo!', show: [{ t: 'row', label: '5 hojas:', items: ['📄', '📄', '📄', '📄', '📄'] }, { t: 'eq', x: '20 páginas ÷ 4 = **5 hojas**' }] },
    { clear: true, say: 'La hoja de fuera es la portada y la contraportada. Lleva la página uno y la dos, al principio… y las dos últimas: la diecinueve y la veinte.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Hoja', 'Páginas'], ['1.ª (fuera)', '1 · 2 · 19 · 20']] }] },
    { say: 'La siguiente hoja, justo dentro, lleva la tres y la cuatro, y por el final, la diecisiete y la dieciocho.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Hoja', 'Páginas'], ['1.ª (fuera)', '1 · 2 · 19 · 20'], ['2.ª', '!3 · 4 · 17 · 18']] }] },
    { say: 'Sumamos: tres, más cuatro, más diecisiete, más dieciocho: cuarenta y dos.', show: [{ t: 'eq', k: 'e', x: '3 + 4 + 17 + 18 = **42**' }, { t: 'ans', x: '42' }] },
    { clear: true, say: 'Y fíjate: tres más dieciocho, veintiuno. Cuatro más diecisiete, veintiuno. ¡Todas las hojas suman cuarenta y dos!', show: [{ t: 'tbl', head: true, rows: [['Hoja', 'Páginas', 'Suma'], ['1.ª', '1 · 2 · 19 · 20', 42], ['2.ª', '3 · 4 · 17 · 18', '!42'], ['3.ª', '5 · 6 · 15 · 16', 42], ['4.ª', '7 · 8 · 13 · 14', 42], ['5.ª', '9 · 10 · 11 · 12', 42]] }] },
    { clear: true, say: 'La idea clave: hazlo de verdad, y empareja. En cada hoja, una página del principio va con una del final, y suman veintiuno.', show: [{ t: 'ans', x: '42' }, { t: 'idea', x: '**Empareja**: principio + final = **21** en cada hoja → 2 × 21 = 42.' }] },
  ] },

// --- Nivel 4 ---
{ id: 'agujas', level: 4, emoji: '🕰️', title: 'Las agujas del reloj', cat: 'Contar adelantamientos',
  q: 'A las **12 en punto del mediodía**, las dos agujas de un reloj están **una encima de la otra**.\n\nDespués de ese momento, ¿cuántas veces vuelven a ponerse **una encima de la otra** hasta las **12 de la noche**, contando también la de las 12 de la noche?',
  qSay: 'A las doce en punto del mediodía, las dos agujas de un reloj están una encima de la otra. Después de ese momento, ¿cuántas veces vuelven a ponerse una encima de la otra hasta las doce de la noche, contando también la de las doce de la noche?',
  pic: `<svg viewBox="0 0 300 300">${reloj(12, 0)}</svg>`,
  ask: '¿Cuántas veces?', ph: 'Solo el número de veces', ans: { num: 11, also: [1] },
  traps: [{ v: 12, m: '¿Se juntan entre las 11 y las 12? Mira dónde está la aguja de las horas a las 11:55… ¿y el minutero?' }, { v: 13, m: '¿Se juntan entre las 11 y las 12? Mira dónde está la aguja de las horas a las 11:55… ¿y el minutero?' }, { v: 22, m: 'Eso sería en **24** horas. Aquí, del mediodía a la medianoche, son 12.' }, { v: 24, m: 'Eso sería contando 24 horas. Aquí, del mediodía a la medianoche, son 12. ¿Y se juntan en **todas** las horas?' }, { v: 10, m: 'Revisa hora a hora: hacia la 1:05, hacia las 2:11… ¿Cuántas te salen hasta las 12 de la noche, incluida?' }, { v: 720, m: 'Eso son los **minutos** que hay en 12 horas. ¿Cuántas veces se juntan las agujas?' }],
  why: '¿A qué hora, más o menos, se juntan entre las **5** y las **6**?',
  hints: ['Mira un reloj de verdad (o dibújalo): después de la 1 en punto, ¿hacia qué hora se juntan las agujas?',
    'Se juntan hacia la 1:05, hacia las 2:11, hacia las 3:16… cada vez un poco más tarde. ¿Pasa en **todas** las horas?',
    'Piensa en una **carrera**: en 12 horas, el minutero da **12 vueltas** y la aguja de las horas solo **1**.',
    'Cada vez que el minutero le saca **una vuelta** de ventaja a la aguja de las horas, la alcanza.'],
  answer: '11 veces', idea: '**Es una carrera**: en 12 horas el minutero da 12 vueltas y la aguja de las horas 1. Le saca 11 vueltas → la alcanza **11 veces**.',
  steps: ['En 12 horas, el minutero da **12 vueltas**, y la aguja de las horas, **1**.', 'Cada vez que el minutero le saca **una vuelta** de ventaja, la alcanza: se ponen una encima de la otra.', '12 − 1 = **11** vueltas de ventaja → **11 veces**.', 'Por eso no hay ninguna entre las 11 y las 12: la siguiente ya es a las 12.'],
  film: [
    { clear: true, say: 'A las doce, las agujas están una encima de la otra. ¿Cuántas veces vuelven a juntarse hasta las doce de la noche? Mucha gente dice: doce, una cada hora.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '56%', x: reloj(12, 0) }] },
    { say: 'A la una en punto no están juntas: el minutero tiene que ir a buscar a la aguja de las horas, que se ha movido un poco. La alcanza hacia la una y cinco.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '56%', x: reloj(1, 60 / 11) }, { t: 'eq', k: 'e', x: 'hacia la 1:05 → **1.ª** vez' }] },
    { say: 'Hacia las tres y dieciséis, otra vez. Cada vez, un poco más tarde: una y cinco, dos y once, tres y dieciséis…', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '56%', x: reloj(3, 180 / 11) }, { t: 'eq', k: 'e', x: '1:05 · 2:11 · **3:16** · 4:22 · …' }] },
    { say: 'Pero entre las once y las doce, el minutero no llega a alcanzarla antes de las doce. A las once y cincuenta y cinco, la aguja de las horas ya está casi en el doce… y el minutero, todavía en el once.', show: [{ t: 'svg', k: 's', vb: '0 0 300 300', h: '56%', x: reloj(11, 55) }, { t: 'eq', k: 'e', x: '11:55 → ¡todavía no se han juntado!' }] },
    { clear: true, say: 'Míralo como una carrera. En doce horas, el minutero da doce vueltas, y la aguja de las horas, una. El minutero le saca once vueltas de ventaja: la alcanza once veces.', show: [{ t: 'eq', x: 'Minutero: **12** vueltas · Horas: **1** vuelta' }, { t: 'eq', x: '12 − 1 = **11** veces' }, { t: 'ans', x: '11 veces' }] },
    { clear: true, say: 'La idea clave: es una carrera. Cada vuelta de ventaja es un adelantamiento. Doce menos una: once.', show: [{ t: 'ans', x: '11 veces' }, { t: 'idea', x: '**Es una carrera**: 12 vueltas contra 1 → **11** adelantamientos.' }] },
  ] },

{ id: 'jarras', level: 4, emoji: '🫗', title: 'Las dos jarras', cat: 'Apuntar cada movimiento',
  q: 'Tienes una jarra de **5 litros**, otra de **3 litros** (las dos **sin marcas**) y un grifo. Quieres tener **exactamente 4 litros** en la jarra de 5.\n\nCada **movimiento** es una de estas tres cosas:\n• **llenar** una jarra entera en el grifo,\n• **vaciar** una jarra entera en el fregadero,\n• **echar** agua de una jarra en la otra, hasta que la primera se vacía o la otra se llena.\n\n¿Cuántos movimientos necesitas **como mínimo**?',
  qSay: 'Tienes una jarra de cinco litros, otra de tres litros, las dos sin marcas, y un grifo. Quieres tener exactamente cuatro litros en la jarra de cinco. Cada movimiento es una de estas tres cosas: llenar una jarra entera en el grifo, vaciar una jarra entera en el fregadero, o echar agua de una jarra en la otra, hasta que la primera se vacía o la otra se llena. ¿Cuántos movimientos necesitas como mínimo?',
  pic: `<svg viewBox="0 0 340 265">${jarras(0, 0)}</svg>`,
  ask: '¿Cuántos movimientos?', ph: 'Un número', ans: { num: 6, also: [5, 3, 4, 8, 1, 2] },
  traps: [{ v: 4, m: 'Comprueba movimiento a movimiento en una tabla: ¿cuántos litros hay en cada jarra después de cada uno? Recuerda: las jarras **no tienen marcas**.' }, ...[2, 3, 5, 7, 8, 9, 10, 12].map(jaT)],
  why: '¿Cómo sabes que **no** se puede con menos movimientos?',
  hints: ['Haz una **tabla**: en cada fila, cuántos litros hay en la jarra de 5 y en la de 3.',
    'Echar de una jarra a otra sirve para **medir**: si llenas la de 5 y la echas en la de 3, ¿cuánto queda en la de 5?',
    'Con 2 litros en la jarra **pequeña**, solo le cabe 1 litro más. ¿Cómo podrías usar eso?',
    'Empieza así: llenar la de 5, echarla en la de 3, vaciar la de 3, echar los 2 litros en la de 3…'],
  answer: '6 movimientos', idea: '**Apunta cada movimiento** en una tabla: echar agua de una jarra a otra sirve para **medir** lo que sobra.',
  steps: ['Llenar la de 5 → (5, 0). Echar en la de 3 → (**2**, 3).', 'Vaciar la de 3 → (2, 0). Echar los 2 litros en la de 3 → (0, 2).', 'Llenar la de 5 → (5, 2). Echar en la de 3 hasta llenarla: solo cabe **1 litro** → (**4**, 3).', '**6 movimientos**. (Empezando por la de 3 se puede, pero salen 8.)'],
  film: [
    { clear: true, say: 'Una jarra de cinco litros, otra de tres, y un grifo. ¿Cómo conseguimos cuatro litros justos? Hagamos una tabla, movimiento a movimiento.', show: [{ t: 'svg', k: 's', vb: '0 0 340 265', h: '46%', x: jarras(0, 0) }] },
    { say: 'Uno: llenamos la de cinco. Dos: la echamos en la de tres. Caben tres, y en la grande quedan dos.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '5 L', '3 L'], ['1. Llenar la de 5', 5, 0], ['2. Echar en la de 3', '!2', 3]] }] },
    { say: 'Tres: vaciamos la pequeña. Cuatro: echamos en ella los dos litros de la grande.', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '5 L', '3 L'], ['1. Llenar la de 5', 5, 0], ['2. Echar en la de 3', 2, 3], ['3. Vaciar la de 3', 2, 0], ['4. Echar en la de 3', 0, '!2']] }] },
    { say: 'Cinco: llenamos otra vez la grande. Seis: rellenamos la pequeña con ella. A la pequeña solo le cabe un litro… ¡y en la grande quedan cuatro!', show: [{ t: 'tbl', k: 't', head: true, rows: [['', '5 L', '3 L'], ['1 a 4. Lo de antes', 0, 2], ['5. Llenar la de 5', 5, 2], ['6. Echar en la de 3', '!4', 3]] }] },
    { clear: true, say: 'Si empezamos llenando la pequeña, también se puede, pero hacen falta ocho movimientos. Seis es el mínimo.', show: [{ t: 'svg', vb: '0 0 340 265', h: '40%', x: jarras(4, 3) }, { t: 'eq', x: 'Empezando por la de 3: **8** · Empezando por la de 5: **6**' }] },
    { clear: true, say: 'La idea clave: apunta cada movimiento en una tabla. Echar agua de una jarra a otra sirve para medir lo que sobra.', show: [{ t: 'ans', x: '6 movimientos' }, { t: 'idea', x: '**Apunta cada movimiento**: echar de una jarra a otra **mide** lo que sobra.' }] },
  ] },

{ id: 'ranas', level: 4, emoji: '🐸', title: 'Las ranas saltarinas', cat: 'Probar con pocos',
  q: 'En una fila de **7 piedras** hay **3 ranas verdes** a la izquierda, una piedra **vacía** en el medio y **3 ranas marrones** a la derecha.\nLas verdes solo van hacia la **derecha**, y las marrones solo hacia la **izquierda**. En cada movimiento, **una** rana:\n• **pasa** a la piedra vacía de al lado, o\n• **salta** por encima de **una** rana hasta la piedra vacía.\n\n¿Cuántos movimientos hacen falta, **como mínimo**, para que las verdes y las marrones **cambien de lado**?',
  qSay: 'En una fila de siete piedras hay tres ranas verdes a la izquierda, una piedra vacía en el medio y tres ranas marrones a la derecha. Las verdes solo van hacia la derecha, y las marrones solo hacia la izquierda. En cada movimiento, una rana pasa a la piedra vacía de al lado, o salta por encima de una rana hasta la piedra vacía. ¿Cuántos movimientos hacen falta, como mínimo, para que las verdes y las marrones cambien de lado?',
  pic: `<svg viewBox="0 0 420 100">${piedras('GGG_BBB')}</svg>`,
  ask: '¿Cuántos movimientos?', ph: 'Un número', ans: { num: 15, also: [7, 3, 1, 8, 9, 6, 2] },
  traps: [...[6, 9, 12, 14, 16, 18, 21, 24, 10, 13].map(raT)],
  why: '¿Y con **4** ranas de cada color, en 9 piedras?',
  hints: ['Prueba con **pocas** ranas: 1 verde y 1 marrón, en 3 piedras. ¿Cuántos movimientos?',
    'Con 1 y 1 salen **3** movimientos. Con 2 y 2 (en 5 piedras) salen **8**. Ahora cuenta **saltos** y **pasos** por separado.',
    'Cada verde tiene que cruzarse con **cada** marrón, y para cruzarse una salta por encima de la otra: 3 × 3 = **9 saltos**.',
    'Cada rana avanza **4 piedras**: 6 × 4 = 24 piedras en total. Cada salto avanza 2; cada paso, 1.'],
  answer: '15 movimientos (9 saltos y 6 pasos)', idea: '**Prueba con pocas** y cuenta **saltos** y **pasos** por separado: 9 saltos (cada verde con cada marrón) + 6 pasos = 15.',
  steps: ['Cada verde tiene que cruzarse con cada marrón: 3 × 3 = **9 saltos**.', 'Cada rana avanza **4 piedras**: 6 × 4 = **24** piedras en total.', 'Los 9 saltos avanzan 9 × 2 = 18; faltan 24 − 18 = **6 pasos**.', '9 saltos + 6 pasos = **15** movimientos. (Con 1 y 1 salen 3; con 2 y 2, 8.)'],
  film: [
    { clear: true, say: 'Tres ranas verdes, tres marrones, y una piedra vacía en el medio. ¿Cuántos movimientos para que cambien de lado? Probemos primero con una de cada.', show: [{ t: 'svg', k: 's', vb: '0 0 420 100', h: '22%', x: piedras('GGG_BBB') }] },
    { clear: true, say: 'Con una de cada: la verde pasa. La marrón salta por encima. Y la verde pasa otra vez. Tres movimientos.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Movimiento', 'Piedras'], ['Inicio', '🟢 ⬜ 🟤'], ['1. pasa la verde', '⬜ 🟢 🟤'], ['2. salta la marrón', '🟤 🟢 ⬜'], ['3. pasa la verde', '!🟤 ⬜ 🟢']] }] },
    { clear: true, say: 'Con dos de cada, hacen falta ocho. ¿Y con tres? Contemos de otra forma: saltos y pasos por separado.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Ranas de cada color', 'Movimientos'], [1, 3], [2, 8], [3, '?']] }] },
    { say: 'Cada verde tiene que cruzarse con cada marrón, y para cruzarse, una salta por encima de la otra. Tres por tres: nueve saltos.', show: [{ t: 'eq', k: 'e', x: '3 verdes × 3 marrones = **9 saltos**' }] },
    { say: 'Cada rana avanza cuatro piedras: seis ranas, veinticuatro piedras. Los nueve saltos avanzan dieciocho. Faltan seis: seis pasos.', show: [{ t: 'eq', k: 'f', x: '6 × 4 = 24 · 9 × 2 = 18 · 24 − 18 = **6 pasos**' }] },
    { say: 'Nueve saltos y seis pasos: quince movimientos.', show: [{ t: 'eq', k: 'f', x: '9 saltos + 6 pasos = **15**' }, { t: 'ans', x: '15 movimientos' }] },
    { clear: true, say: 'La idea clave: prueba con pocas y cuenta saltos y pasos por separado. Una de cada: tres. Dos: ocho. Tres: quince.', show: [{ t: 'svg', vb: '0 0 420 100', h: '16%', x: piedras('BBB_GGG') }, { t: 'ans', x: '15 movimientos' }, { t: 'idea', x: '**Prueba con pocas**: 9 saltos + 6 pasos = **15**.' }] },
  ] },


{ id: 'filacole', level: 1, emoji: '🏫', title: 'La fila del cole', cat: 'Dibujar la fila',
  q: 'Los niños de la clase hacen **una fila** para salir al patio. **Ana** es la **5.ª** empezando por **delante**, y la **8.ª** empezando por **detrás**.\n\n¿Cuántos niños hay en la fila?',
  qSay: 'Los niños de la clase hacen una fila para salir al patio. Ana es la quinta empezando por delante, y la octava empezando por detrás. ¿Cuántos niños hay en la fila?',
  ask: '¿Cuántos niños?', ph: 'Un número', ans: { num: 12, also: [5, 8, 4, 7, 1] },
  traps: [{ v: 13, m: '¡Dibuja la fila! Cuenta 5 desde delante y 8 desde detrás. ¿Hay alguien a quien hayas contado **dos veces**?' }, { v: 14, m: 'Dibuja la fila: los niños de delante de Ana, Ana, y los de detrás. Cuéntalos uno a uno.' }, { v: 11, m: 'Casi. ¿Has contado a **Ana**?' }, { v: 3, m: 'Esa es la diferencia entre 8 y 5. Dibuja la fila y cuenta **todos** los niños.' }, { v: 15, m: 'Dibuja la fila: los niños de delante de Ana, Ana, y los de detrás. Cuéntalos uno a uno.' }],
  why: '¿Por qué no son 5 + 8 = 13?',
  hints: ['**Dibuja** la fila: un palito por niño. Empieza por Ana.',
    'Si Ana es la 5.ª por delante, ¿cuántos niños tiene **delante** de ella?',
    'Si es la 8.ª por detrás, ¿cuántos niños tiene **detrás**?',
    'Delante de Ana hay 4 niños y detrás hay 7… ¡y no te olvides de Ana!'],
  answer: '12 niños', idea: '**Dibuja la fila**: si sumas 5 + 8, a Ana la cuentas **dos veces**.',
  steps: ['Ana es la 5.ª por delante → tiene **4** niños delante.', 'Es la 8.ª por detrás → tiene **7** niños detrás.', '4 + 1 (Ana) + 7 = **12**.', 'Otra forma: 5 + 8 = 13, pero Ana está contada dos veces: 13 − 1 = **12**.'],
  film: [
    { clear: true, say: 'Ana es la quinta por delante y la octava por detrás. ¿Cuántos niños hay en la fila? Mucha gente suma cinco más ocho: trece. ¡Vamos a dibujar la fila!', show: [{ t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: filacole(0) }] },
    { say: 'Contamos desde delante: uno, dos, tres, cuatro… y cinco: ¡Ana! Delante de ella hay cuatro niños.', show: [{ t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: filacole(1) }, { t: 'eq', k: 'e', x: 'Delante de Ana: **4** niños' }] },
    { say: 'Ahora desde detrás: uno, dos, tres… hasta ocho, que vuelve a ser Ana. ¡Ana tiene dos números! Si sumamos cinco más ocho, la contamos dos veces.', show: [{ t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: filacole(2) }, { t: 'eq', k: 'e', x: '5 + 8 = 13 → ¡Ana, contada **dos veces**!' }] },
    { say: 'Cuatro delante, Ana, y siete detrás. Cuatro más uno más siete: doce niños.', show: [{ t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: filacole(3) }, { t: 'eq', k: 'e', x: '4 + 1 + 7 = **12**' }, { t: 'ans', x: '12 niños' }] },
    { clear: true, say: 'La idea clave: dibuja la fila. Si sumas las dos posiciones, la persona del medio se cuenta dos veces.', show: [{ t: 'ans', x: '12 niños' }, { t: 'idea', x: '**Dibuja la fila**: si sumas 5 + 8, a Ana la cuentas **dos veces**.' }] },
  ] },

{ id: 'redondeo', level: 1, emoji: '🎯', title: 'Redondear a 50', cat: 'Mirar los bordes',
  q: 'Lucas piensa un número **entero**. Si lo **redondeas a las decenas**, sale **50**.\n(Recuerda: si la cifra de las unidades es **5 o más**, se redondea **hacia arriba**.)\n\n¿Cuántos números **distintos** puede haber pensado Lucas?',
  qSay: 'Lucas piensa un número entero. Si lo redondeas a las decenas, sale cincuenta. Recuerda: si la cifra de las unidades es cinco o más, se redondea hacia arriba. ¿Cuántos números distintos puede haber pensado Lucas?',
  ask: '¿Cuántos números?', ph: 'Un número', ans: { num: 10, also: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 1] },
  traps: [{ v: 9, m: 'Escríbelos **todos** en una lista, del más pequeño al más grande, y cuéntalos uno a uno. ¿Has contado el **primero** y el **último**?' }, { v: 11, m: 'Comprueba el **55**: redondeado a las decenas, ¿da 50 o da 60?' }, { v: 5, m: 'Hay números **más pequeños** que 50 que también se redondean a 50. ¿Cuáles?' }, { v: 4, m: 'Hay números **más pequeños** que 50 que también se redondean a 50. ¿Cuáles?' }, { v: 6, m: 'Hay más: piensa en los números de **debajo** y de **encima** de 50.' }, { v: 20, m: 'Comprueba alguno: el 42, redondeado a las decenas, ¿da 50?' }],
  why: '¿Y si al redondear a las **centenas** saliera **500**? ¿Cuántos números podrían ser?',
  hints: ['Prueba con algunos: ¿el **52** se redondea a 50? ¿Y el **48**?',
    'Busca el **más pequeño** que se redondea a 50. ¿El 44? ¿El 45?',
    'Ahora el **más grande**: ¿el 54? ¿El 55?',
    'Van del 45 al 54. Escríbelos todos y cuéntalos.'],
  answer: '10 números', idea: '**Mira los bordes**: busca el primero y el último… y cuenta **los dos**.',
  steps: ['El más pequeño es el **45** (el 44 se redondea a 40).', 'El más grande es el **54** (el 55 se redondea a 60).', 'Del 45 al 54: 45, 46, 47, 48, 49, 50, 51, 52, 53, 54 → **10** números.', 'Ojo: 54 − 45 = 9 cuenta los **saltos** entre ellos, no los números.'],
  film: [
    { clear: true, say: 'Lucas piensa un número, y redondeado a las decenas da cincuenta. ¿Qué números pueden ser? Miremos la recta numérica.', show: [{ t: 'svg', k: 's', vb: '0 0 600 150', h: '38%', x: recta(0) }] },
    { say: 'Del cincuenta al cincuenta y cuatro se redondean hacia abajo, a cincuenta. Y del cuarenta y cinco al cuarenta y nueve, hacia arriba: ¡también a cincuenta!', show: [{ t: 'svg', k: 's', vb: '0 0 600 150', h: '38%', x: recta(1) }] },
    { say: 'Ahora los bordes. El cuarenta y cuatro se va al cuarenta. Y el cincuenta y cinco se va al sesenta. Así que van del cuarenta y cinco al cincuenta y cuatro.', show: [{ t: 'svg', k: 's', vb: '0 0 600 150', h: '38%', x: recta(2) }, { t: 'eq', k: 'e', x: 'Del **45** al **54**' }] },
    { say: 'Los contamos uno a uno: diez números. Cuidado: cincuenta y cuatro menos cuarenta y cinco da nueve, pero eso cuenta los saltos, no los números.', show: [{ t: 'svg', k: 's', vb: '0 0 600 150', h: '38%', x: recta(3) }, { t: 'eq', k: 'e', x: '54 − 45 = 9 saltos → 9 + 1 = **10** números' }, { t: 'ans', x: '10 números' }] },
    { clear: true, say: 'La idea clave: mira los bordes. Busca el primero y el último, y no te olvides de contar los dos.', show: [{ t: 'ans', x: '10 números' }, { t: 'idea', x: '**Mira los bordes**: busca el primero y el último… y cuenta **los dos**.' }] },
  ] },

{ id: 'movil', level: 1, emoji: '🎐', title: 'El móvil de figuras', cat: 'Cada pieza cuenta',
  q: 'Mira este móvil: tiene **cuadrados** y **círculos** colgados. Todos los cuadrados pesan lo mismo, y todos los círculos pesan lo mismo. El móvil entero pesa **640 gramos** (los hilos y las barras no pesan nada).\n\n¿Cuántos gramos pesan **un cuadrado y un círculo juntos**?',
  qSay: 'Mira este móvil: tiene cuadrados y círculos colgados. Todos los cuadrados pesan lo mismo, y todos los círculos pesan lo mismo. El móvil entero pesa seiscientos cuarenta gramos, y los hilos y las barras no pesan nada. ¿Cuántos gramos pesan un cuadrado y un círculo juntos?',
  pic: `<svg viewBox="0 0 600 230">${movil(0)}</svg>`,
  ask: '¿Cuántos gramos?', ph: 'Solo el número de gramos', ans: { num: 320, also: [640, 2, 4, 1] },
  traps: [{ v: 640, m: 'Eso pesa el móvil **entero**. Cuenta las figuras: ¿cuántos cuadrados y cuántos círculos hay?' }, { v: 160, m: 'Eso pesaría **una** figura si todas pesaran lo mismo. Pero te preguntan por un cuadrado **y** un círculo juntos.' }, { v: 1280, m: 'Al revés: el móvil entero pesa **más** que un cuadrado y un círculo, no menos.' }, { v: 213, m: 'Fíjate bien en el dibujo: ¿cuántas figuras hay de cada tipo?' }],
  why: '¿Se puede saber cuánto pesa **solo** un cuadrado?',
  hints: ['Cuenta las figuras: ¿cuántos cuadrados hay? ¿Y cuántos círculos?',
    'Junta las figuras en **parejas**: un cuadrado con un círculo. ¿Cuántas parejas salen?',
    'Las parejas son iguales, y entre todas pesan 640 g.',
    'Hay 2 parejas iguales que pesan 640 g entre las dos.'],
  answer: '320 gramos', idea: '**Cada pieza cuenta**: mira cuántas veces aparece cada figura antes de repartir.',
  steps: ['En el móvil hay **2** cuadrados y **2** círculos.', 'Se juntan en **2 parejas** iguales: cuadrado + círculo, y cuadrado + círculo.', '2 parejas pesan 640 g → 1 pareja pesa 640 ÷ 2 = **320 g**.', 'Con estos datos **no** se sabe cuánto pesa cada figura sola (200 + 120, 250 + 70…), ¡solo la pareja!'],
  film: [
    { clear: true, say: 'Un móvil con dos cuadrados y dos círculos pesa seiscientos cuarenta gramos. ¿Cuánto pesan un cuadrado y un círculo juntos? Mucha gente contesta seiscientos cuarenta. ¡Pero mira bien el móvil!', show: [{ t: 'svg', k: 's', vb: '0 0 600 260', h: '50%', x: movil(0) }] },
    { say: 'Cada lado del móvil tiene un cuadrado y un círculo. ¡Son dos parejas iguales!', show: [{ t: 'svg', k: 's', vb: '0 0 600 260', h: '50%', x: movil(1) }, { t: 'eq', k: 'e', x: '640 g = pareja + pareja' }] },
    { say: 'Dos parejas pesan seiscientos cuarenta. Una pareja pesa la mitad: trescientos veinte gramos.', show: [{ t: 'svg', k: 's', vb: '0 0 600 260', h: '50%', x: movil(2) }, { t: 'eq', k: 'e', x: '640 ÷ 2 = **320 g**' }, { t: 'ans', x: '320 gramos' }] },
    { say: '¿Y cuánto pesa solo el cuadrado? ¡No se puede saber! Podría ser doscientos y ciento veinte, o doscientos cincuenta y setenta. Solo sabemos la pareja.', show: [{ t: 'eq', k: 'e', x: '200 + 120 = 320 · 250 + 70 = 320 · … ¡solo sabemos la **pareja**!' }] },
    { clear: true, say: 'La idea clave: cada pieza cuenta. Antes de repartir, mira cuántas veces aparece cada figura.', show: [{ t: 'ans', x: '320 gramos' }, { t: 'idea', x: '**Cada pieza cuenta**: mira cuántas veces aparece cada figura antes de repartir.' }] },
  ] },

{ id: 'hucha', level: 1, emoji: '🐷', title: 'La hucha de Lía', cat: 'Pensar hacia atrás',
  q: 'Lía abre su hucha. Primero gasta **la mitad** de su dinero en un libro. Después gasta **4 €** en un helado. Al final le quedan **6 €**.\n\n¿Cuántos euros tenía en la hucha **al principio**?',
  qSay: 'Lía abre su hucha. Primero gasta la mitad de su dinero en un libro. Después gasta cuatro euros en un helado. Al final le quedan seis euros. ¿Cuántos euros tenía en la hucha al principio?',
  ask: '¿Cuántos euros?', ph: 'Solo el número de euros', ans: { num: 20, also: [6, 4, 10, 2] },
  traps: [{ v: 10, m: 'Eso es lo que tenía **después de comprar el libro**. ¿Y antes del libro?' }, huT(16), huT(8), huT(14), huT(12), huT(24), huT(22), huT(18), huT(26), huT(5)],
  why: '¿Cómo puedes **comprobar** tu respuesta?',
  hints: ['Empieza por el **final**: le quedan 6 €. ¿Cuánto tenía **justo antes** del helado?',
    'Antes del helado tenía 6 + 4 = 10 €.',
    'Esos 10 € son **la mitad** que le quedó después del libro. Si 10 es la mitad, ¿cuánto es todo?',
    'Si la mitad es 10, el total es el doble de 10.'],
  answer: '20 €', idea: '**Piensa hacia atrás**: empieza por el final y haz **lo contrario** de cada paso (restar → sumar, mitad → doble).',
  steps: ['Empezamos por el final: **6 €**.', 'Deshacemos el helado: 6 + 4 = **10 €**.', 'Deshacemos el libro: 10 € era la mitad → 10 × 2 = **20 €**.', 'Comprobación: 20 → la mitad, 10 → menos 4 → **6** ✓.'],
  film: [
    { clear: true, say: 'Lía gasta la mitad de su dinero, luego cuatro euros, y le quedan seis. ¿Cuánto tenía? No sabemos el principio… ¡pero sí sabemos el final!', show: [{ t: 'row', k: 'r', items: ['?', '½ ➜', '…', '− 4 € ➜', '!6 €'] }] },
    { say: 'Vamos hacia atrás. Antes del helado tenía cuatro euros más: seis más cuatro, diez euros.', show: [{ t: 'row', k: 'r', items: ['?', '½ ➜', '!10 €', '− 4 € ➜', '6 €'] }, { t: 'eq', k: 'e', x: '6 + 4 = **10 €**' }] },
    { say: 'Esos diez euros eran la mitad de lo que tenía. Si la mitad es diez, el total es el doble: veinte euros.', show: [{ t: 'row', k: 'r', items: ['!20 €', '½ ➜', '10 €', '− 4 € ➜', '6 €'] }, { t: 'eq', k: 'e', x: '10 × 2 = **20 €**' }, { t: 'ans', x: '20 €' }] },
    { say: 'Comprobamos hacia delante: veinte, la mitad son diez, menos cuatro, seis. ¡Correcto!', show: [{ t: 'eq', k: 'e', x: '20 ➜ 10 ➜ **6** ✓' }] },
    { clear: true, say: 'La idea clave: piensa hacia atrás. Empieza por el final y haz lo contrario de cada paso: si restaba, sumas; si era la mitad, haces el doble.', show: [{ t: 'ans', x: '20 €' }, { t: 'idea', x: '**Piensa hacia atrás**: haz **lo contrario** de cada paso (restar → sumar, mitad → doble).' }] },
  ] },

{ id: 'rapido', level: 2, emoji: '⚡', title: 'Cálculo relámpago', cat: 'Agrupar antes de calcular',
  q: 'Calcula **sin calculadora**, y con el **menor esfuerzo** posible:\n\n**37 × 25 + 63 × 25**',
  qSay: 'Calcula sin calculadora, y con el menor esfuerzo posible: treinta y siete por veinticinco, más sesenta y tres por veinticinco.',
  ask: '¿Cuánto da?', ph: 'El resultado', ans: { num: 2500, also: [37, 25, 63, 100, 925, 1575] },
  traps: [{ v: 925, m: 'Eso es solo **37 × 25**. Te falta la otra parte.' }, { v: 1575, m: 'Eso es solo **63 × 25**. Te falta la otra parte.' }, { v: 100, m: '37 + 63 = 100, ¡bien visto! Pero cada uno iba **multiplicado por 25**.' }, { v: 125, m: 'Cuidado: no se suman los 25. ¿Cuántas veces 25 hay en total?' }, { v: 2400, m: 'Revisa la cuenta. ¿Hay algún número que se repita en las dos multiplicaciones?' }, { v: 2600, m: 'Revisa la cuenta. ¿Hay algún número que se repita en las dos multiplicaciones?' }, { v: 2525, m: 'Revisa la cuenta. ¿Hay algún número que se repita en las dos multiplicaciones?' }],
  why: '¿Cómo podrías **comprobar** el resultado de otra manera?',
  hints: ['Mira bien: ¿qué número aparece en **las dos** multiplicaciones?',
    '37 × 25 son 37 veces 25. Y luego sumas 63 veces 25 más. ¿Cuántas veces 25 hay **en total**?',
    '37 + 63 = 100. Así que es lo mismo que **100 × 25**.',
    '37 × 25 + 63 × 25 = (37 + 63) × 25 = 100 × 25.'],
  answer: '2500', idea: '**Agrupa antes de calcular**: si un número se repite, júntalo. 37 × 25 + 63 × 25 = (37 + 63) × 25 (propiedad **distributiva**).',
  steps: ['El **25** está en las dos multiplicaciones.', '37 veces 25 más 63 veces 25 son **100 veces 25**: es la propiedad distributiva.', '(37 + 63) × 25 = 100 × 25 = **2500**.', 'Haciendo las dos multiplicaciones también sale (925 + 1575 = 2500), pero se tarda mucho más.'],
  film: [
    { clear: true, say: 'Treinta y siete por veinticinco, más sesenta y tres por veinticinco. Se pueden hacer las dos multiplicaciones… pero hay un camino mucho más corto.', show: [{ t: 'eq', k: 'q', x: '37 × 25 + 63 × 25' }] },
    { say: 'Imagínalas como dos rectángulos, los dos de veinticinco de alto. Uno de treinta y siete de ancho, y otro de sesenta y tres.', show: [{ t: 'eq', k: 'q', x: '37 × 25 + 63 × 25' }, { t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: areas(0) }] },
    { say: 'Los juntamos: un solo rectángulo de veinticinco de alto y, de ancho, treinta y siete más sesenta y tres: ¡cien!', show: [{ t: 'svg', k: 's', vb: '0 0 600 170', h: '40%', x: areas(1) }, { t: 'eq', k: 'q', x: '(37 + 63) × 25 = **100 × 25**' }] },
    { say: 'Y cien por veinticinco es facilísimo: dos mil quinientos.', show: [{ t: 'eq', k: 'e', x: '100 × 25 = **2500**' }, { t: 'ans', x: '2500' }] },
    { clear: true, say: 'La idea clave: agrupa antes de calcular. Si un número se repite, júntalo. Es la propiedad distributiva.', show: [{ t: 'ans', x: '2500' }, { t: 'idea', x: '**Agrupa antes de calcular**: 37 × 25 + 63 × 25 = (37 + 63) × 25.' }] },
  ] },

{ id: 'parentesis', level: 2, emoji: '🧮', title: 'El paréntesis poderoso', cat: 'Probar todas las opciones',
  q: 'Mira esta operación:\n\n**8 + 2 × 5 − 3**\n\nPuedes poner **un solo paréntesis** (un « ( » y un « ) ») rodeando dos o más números seguidos.\n\n¿Cuál es el **mayor resultado** que puedes conseguir?',
  qSay: 'Mira esta operación: ocho más dos por cinco menos tres. Puedes poner un solo paréntesis, rodeando dos o más números seguidos. ¿Cuál es el mayor resultado que puedes conseguir?',
  ask: '¿El mayor resultado?', ph: 'Un número', ans: { num: 47, also: [8, 2, 5, 3, 10, 50, 15, 12] },
  traps: [{ v: 15, m: 'Ese es el resultado **sin** paréntesis (primero se multiplica). ¿Dónde podrías poner el paréntesis para que **cambie**?' }, { v: 12, m: 'Ese paréntesis hace el resultado **más pequeño**. Prueba en otros sitios.' }, { v: 20, m: 'Si has puesto (8 + 2) × (5 − 3), eso son **dos** paréntesis, y solo puedes poner **uno**. Si has puesto 8 + 2 × (5 − 3), recuerda: la multiplicación va **antes** que la suma.' }, { v: 50, m: '¡Casi! Pero no te olvides del **− 3** del final.' }, { v: 32, m: 'Repasa la cuenta paso a paso: primero lo de dentro del paréntesis, luego la multiplicación.' }, { v: 35, m: 'Repasa la cuenta paso a paso: primero lo de dentro del paréntesis, luego la multiplicación.' }],
  why: '¿Dónde pondrías el paréntesis para conseguir el resultado **más pequeño**?',
  hints: ['Primero calcula **sin** paréntesis. Recuerda: la multiplicación va **antes** que la suma y la resta.',
    'Escribe **todos** los sitios donde puede ir el paréntesis. No son muchos.',
    'Para que salga grande, conviene que el **× 5** multiplique a algo **grande**.',
    'Prueba con (8 + 2) × 5 − 3.'],
  answer: '47', idea: '**Prueba todas las opciones** con orden: así sabes **seguro** cuál es la mayor.',
  steps: ['Sin paréntesis: 8 + 2 × 5 − 3 = 8 + 10 − 3 = **15**.', 'Probamos todos los sitios: (8 + 2) × 5 − 3 = **47** · 8 + 2 × (5 − 3) = **12** · los demás dan **15**.', 'El mayor es **47**: el paréntesis hace que el × 5 multiplique al 10.', 'Truco: para un resultado grande, haz que la multiplicación actúe sobre el número más grande posible.'],
  film: [
    { clear: true, say: 'Ocho más dos por cinco menos tres. Sin paréntesis, primero se multiplica: dos por cinco, diez. Ocho más diez menos tres: quince.', show: [{ t: 'eq', k: 'q', x: '8 + 2 × 5 − 3 = 8 + 10 − 3 = **15**' }] },
    { say: 'Ahora probamos el paréntesis en todos los sitios posibles, con orden, empezando por la izquierda.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Paréntesis', 'Resultado'], ['(8 + 2) × 5 − 3', '?'], ['(8 + 2 × 5) − 3', '?'], ['(8 + 2 × 5 − 3)', '?'], ['8 + (2 × 5) − 3', '?'], ['8 + (2 × 5 − 3)', '?'], ['8 + 2 × (5 − 3)', '?']] }] },
    { say: 'Ocho más dos, diez, por cinco, cincuenta, menos tres: cuarenta y siete. Y con el paréntesis en cinco menos tres: cinco menos tres, dos; dos por dos, cuatro; y ocho más cuatro, doce. Y los demás no cambian nada: quince.', show: [{ t: 'tbl', k: 't', head: true, rows: [['Paréntesis', 'Resultado'], ['(8 + 2) × 5 − 3', '!47'], ['(8 + 2 × 5) − 3', 15], ['(8 + 2 × 5 − 3)', 15], ['8 + (2 × 5) − 3', 15], ['8 + (2 × 5 − 3)', 15], ['8 + 2 × (5 − 3)', 12]] }] },
    { say: 'El mayor es cuarenta y siete: el paréntesis consigue que el por cinco multiplique a diez, en lugar de a dos.', show: [{ t: 'eq', k: 'q', x: '(8 + 2) × 5 − 3 = 10 × 5 − 3 = **47**' }] },
    { clear: true, say: 'La idea clave: prueba todas las opciones con orden. Así sabes seguro cuál es la mayor, y no te dejas ninguna.', show: [{ t: 'ans', x: '47' }, { t: 'idea', x: '**Prueba todas las opciones** con orden: así sabes **seguro** cuál es la mayor.' }] },
  ] },

{ id: 'mensajes', level: 2, emoji: '🤫', title: 'El secreto que vuela', cat: 'Multiplicar una y otra vez',
  q: 'El **lunes**, Nora cuenta un secreto a **3 amigos**. El **martes**, **cada uno** de esos amigos se lo cuenta a **3 amigos nuevos**. El **miércoles**, cada uno de los que se enteraron el martes se lo cuenta a **3 amigos nuevos**, y así cada día.\n\n¿Cuántas personas **nuevas** se enteran del secreto **el jueves**?',
  qSay: 'El lunes, Nora cuenta un secreto a tres amigos. El martes, cada uno de esos amigos se lo cuenta a tres amigos nuevos. El miércoles, cada uno de los que se enteraron el martes se lo cuenta a tres amigos nuevos, y así cada día. ¿Cuántas personas nuevas se enteran del secreto el jueves?',
  ask: '¿Cuántas personas?', ph: 'Un número', ans: { num: 81, also: [3, 4, 9, 27] },
  traps: [{ v: 120, m: 'Eso son **todas** las personas que se enteran de lunes a jueves. ¿Cuántas se enteran **solo el jueves**?' }, { v: 121, m: 'Eso son todas, contando a Nora. ¿Cuántas se enteran **solo el jueves**?' }, { v: 12, m: 'Cuidado: no se enteran 3 más cada día. **Cada** persona nueva se lo cuenta a 3. Dibuja el lunes y el martes.' }, { v: 27, m: 'Ese es el **miércoles**. Te falta un día.' }, { v: 9, m: 'Ese es el **martes**. Sigue hasta el jueves.' }, { v: 243, m: 'Te has pasado un día. Haz una tabla: lunes, martes, miércoles, jueves.' }, { v: 36, m: 'Cuidado: cada día se **multiplica** por 3. Haz una tabla: lunes, martes, miércoles, jueves.' }, { v: 64, m: 'Cada persona se lo cuenta a **3**, no a 4. Haz una tabla: lunes, martes, miércoles, jueves.' }],
  why: '¿Cómo se escribe ese número como una **potencia**?',
  hints: ['Haz una tabla con los días: lunes, martes, miércoles, jueves.',
    'El lunes se enteran 3. El martes, **cada uno** de esos 3 se lo cuenta a 3 personas. ¿Cuántas son?',
    'Cada día se entera el **triple** de gente que el día anterior: 3, 9, …',
    '3 × 3 × 3 × 3.'],
  answer: '81 personas', idea: '**Multiplica una y otra vez**: cada día es el triple, 3 × 3 × 3 × 3 = 3⁴ = 81.',
  steps: ['Lunes: **3** personas.', 'Martes: 3 × 3 = **9**. Miércoles: 9 × 3 = **27**.', 'Jueves: 27 × 3 = **81**.', 'Es una **potencia**: 3 × 3 × 3 × 3 = 3⁴ = 81.'],
  film: [
    { clear: true, say: 'Nora cuenta un secreto a tres amigos el lunes. Y cada día, cada persona nueva se lo cuenta a tres más. Vamos a dibujarlo.', show: [{ t: 'svg', k: 's', vb: '0 0 600 245', h: '50%', x: arbol(1) }, { t: 'tbl', k: 't', head: true, rows: [['Lunes', 'Martes', 'Miércoles', 'Jueves'], ['!3', '', '', '']] }] },
    { say: 'El martes, cada uno de esos tres se lo cuenta a tres: tres por tres, nueve.', show: [{ t: 'svg', k: 's', vb: '0 0 600 245', h: '50%', x: arbol(2) }, { t: 'tbl', k: 't', head: true, rows: [['Lunes', 'Martes', 'Miércoles', 'Jueves'], [3, '!9', '', '']] }] },
    { say: 'El miércoles, cada uno de los nueve se lo cuenta a tres: veintisiete. ¡Ya casi no caben!', show: [{ t: 'svg', k: 's', vb: '0 0 600 245', h: '50%', x: arbol(3) }, { t: 'tbl', k: 't', head: true, rows: [['Lunes', 'Martes', 'Miércoles', 'Jueves'], [3, 9, '!27', '']] }] },
    { say: 'Y el jueves, veintisiete por tres: ochenta y una personas. Es tres por tres por tres por tres: ¡tres elevado a cuatro!', show: [{ t: 'tbl', k: 't', head: true, rows: [['Lunes', 'Martes', 'Miércoles', 'Jueves'], [3, 9, 27, '!81']] }, { t: 'eq', k: 'e', x: '3 × 3 × 3 × 3 = 3⁴ = **81**' }] },
    { clear: true, say: 'La idea clave: cuando cada día se multiplica por tres, el número crece muy deprisa. Eso es una potencia.', show: [{ t: 'ans', x: '81 personas' }, { t: 'idea', x: '**Multiplica una y otra vez**: 3 × 3 × 3 × 3 = 3⁴ = 81.' }] },
  ] },

{ id: 'galletas', level: 2, emoji: '🍪', title: 'Las galletas de la abuela', cat: 'Comparar los dos repartos',
  q: 'La abuela reparte galletas entre sus nietos. Si da **3 galletas** a cada nieto, le **sobran 2**. Pero si quiere dar **4 galletas** a cada nieto, le **falta 1**.\n\n¿Cuántas **galletas** tiene la abuela?',
  qSay: 'La abuela reparte galletas entre sus nietos. Si da tres galletas a cada nieto, le sobran dos. Pero si quiere dar cuatro galletas a cada nieto, le falta una. ¿Cuántas galletas tiene la abuela?',
  ask: '¿Cuántas galletas?', ph: 'Un número', ans: { num: 11, also: [3, 4, 2, 1, 9] },
  traps: [{ v: 3, m: '¿3 **galletas**? Comprueba: ¿podría dar 3 a cada nieto y que aún le sobraran 2? ¿Qué has encontrado con ese 3?' }, gaT(8), gaT(10), gaT(12), gaT(13), gaT(14), gaT(9), gaT(5), gaT(7), gaT(15), gaT(17)],
  why: '¿Cuántos **nietos** tiene la abuela? ¿Cómo lo sabes?',
  hints: ['Prueba con pocos nietos: si tuviera **2** nietos, ¿cuántas galletas tendría? ¿Funciona el segundo reparto?',
    'Del primer reparto al segundo, cada nieto recibe **1 galleta más**.',
    'Para darle esa galleta de más a cada nieto, usa las 2 que sobraban… y aún le falta 1. ¿Cuántas galletas de más hacen falta?',
    'Hacen falta 3 galletas más, una por nieto: hay 3 nietos.'],
  answer: '11 galletas', idea: '**Compara los dos repartos**: la diferencia (2 que sobran + 1 que falta) te dice cuántos nietos hay.',
  steps: ['Pasar de 3 a 4 galletas por nieto = **1 galleta más** para cada uno.', 'Para eso usa las **2** que sobran y le falta **1**: hacen falta 2 + 1 = **3** galletas → hay **3 nietos**.', 'Galletas: 3 nietos × 3 + 2 = **11** (11 : 3 = 3 y sobran 2).', 'Comprobación: 3 × 4 = 12, y 12 − 11 = **1** que falta ✓.'],
  film: [
    { clear: true, say: 'Con tres galletas a cada nieto sobran dos; con cuatro, falta una. Vamos a comparar los dos repartos.', show: [{ t: 'svg', k: 's', vb: '0 0 600 175', h: '40%', x: platos(3, 2, false) }, { t: 'eq', k: 'e', x: '3 a cada uno → **sobran 2**' }] },
    { say: 'Para dar cuatro, cada nieto necesita una galleta más. Usamos las dos que sobraban… y aún falta una para el último.', show: [{ t: 'svg', k: 's', vb: '0 0 600 175', h: '40%', x: platos(4, 0, true) }, { t: 'eq', k: 'e', x: '4 a cada uno → **falta 1**' }] },
    { say: 'Así que dar una galleta más a cada nieto necesita tres galletas: las dos que sobraban y la que falta. Una por nieto: ¡hay tres nietos!', show: [{ t: 'eq', k: 'e', x: '2 que sobran + 1 que falta = **3** → **3 nietos**' }] },
    { say: 'Tres nietos con tres galletas, nueve, más las dos que sobran: once galletas. Comprobamos: para dar cuatro a cada uno harían falta doce, y falta una. ¡Correcto!', show: [{ t: 'eq', k: 'e', x: '3 × 3 + 2 = **11** · 3 × 4 = 12 → falta 1 ✓' }, { t: 'ans', x: '11 galletas' }] },
    { clear: true, say: 'La idea clave: compara los dos repartos. Lo que sobra más lo que falta te dice cuántos nietos hay.', show: [{ t: 'ans', x: '11 galletas' }, { t: 'idea', x: '**Compara los dos repartos**: 2 que sobran + 1 que falta = **3 nietos**.' }] },
  ] },
];
})();
