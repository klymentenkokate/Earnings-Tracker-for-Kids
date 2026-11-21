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
];
})();
