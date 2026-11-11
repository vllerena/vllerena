// Las piezas del perfil. Cada función recibe un tema y devuelve un SVG.
import { brandIcon, card, fmt, icon, logo, measure, paragraph, pill, rect, svgDoc, text } from './lib/kit.mjs';
import { FOOTER, HERO, PROOF, STACK } from './content.mjs';

const FULL = 840;
const HALF = 415;
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};
const GAP = 10;
/** Aire de una pieza a media columna: `side` es 'l' o 'r'. */
const halfPad = (side) => (side === 'l' ? { r: GAP / 2, b: GAP } : { l: GAP / 2, b: GAP });
const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

// ── Hero ────────────────────────────────────────────────────────────────────
const TERM = { bg: '#0B0D12', border: '#262830', bar: '#12141A', text: '#D5D7DD', muted: '#7C808A' };
const MARK = {
  run: ['play', '#C4B5FD'],
  info: ['chevron', '#7DD3FC'],
  ok: ['check', '#34D399'],
  send: ['send', '#38BDF8'],
  done: ['check', '#6EE7B7'],
};

function terminal(x, y, w, h) {
  const s = HERO.terminal;
  const lh = 23;
  let o = rect(x + 0.5, y + 0.5, w - 1, h - 1, 16, `fill="${TERM.bg}" stroke="${TERM.border}"`);
  o += `<path d="M${x + 1} ${y + 36.5}h${w - 2}" stroke="${TERM.border}"/>`;
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => {
    o += `<circle cx="${x + 18 + i * 14}" cy="${y + 18.5}" r="4.5" fill="${c}" opacity=".9"/>`;
  });
  o += text(s.tab, { x: x + 66, y: y + 22.5, size: 11, font: 'monoMed', fill: TERM.text });
  o += text(s.note, { x: x + w - 16, y: y + 22.5, size: 10, font: 'mono', fill: TERM.muted, anchor: 'end' });

  const bx = x + 18;
  let by = y + 36 + 28;
  o += text(s.cwd, { x: bx, y: by, size: 11.5, font: 'monoMed', fill: '#22D3EE' });
  by += lh;
  o += text('$', { x: bx, y: by, size: 11.5, font: 'monoMed', fill: '#A78BFA' });
  o += text(s.cmd, { x: bx + 16, y: by, size: 11.5, font: 'mono', fill: TERM.text });
  s.out.forEach(([tone, line], i) => {
    by += lh;
    const [name, color] = MARK[tone];
    o += `<g class="ln" style="animation-delay:${(0.7 + i * 0.75).toFixed(2)}s">`;
    o += icon(name, { x: bx - 1, y: by - 10, size: 12, color, width: tone === 'done' ? 3 : 2.4 });
    o += text(line, { x: bx + 18, y: by, size: 11.5, font: tone === 'done' ? 'monoMed' : 'mono', fill: tone === 'done' ? color : TERM.text });
    o += '</g>';
  });
  by += lh;
  o += text('$', { x: bx, y: by, size: 11.5, font: 'monoMed', fill: '#A78BFA' });
  o += `<rect class="cur" x="${bx + 16}" y="${by - 10.5}" width="7" height="13" rx="1" fill="${TERM.text}"/>`;
  return o;
}

export function hero(t) {
  const W = FULL;
  const P = 36;
  const dark = t.name === 'dark';
  const colW = 428;

  let left = '';
  const lg = logo(t, { x: P, y: 29, h: 22 });
  left += lg.svg;

  // Estado, a la derecha de la cabecera.
  const stW = measure(HERO.status, { size: 12, font: 'sansSemi' }) + 12 * 2 + 14;
  const stX = W - P - stW;
  left += rect(stX + 0.5, 26.5, stW - 1, 27, 14, `fill="${rgba(t.okDot, dark ? 0.12 : 0.1)}" stroke="${rgba(t.okDot, 0.3)}"`);
  left += `<circle class="dot" cx="${stX + 16}" cy="40" r="3.5" fill="${t.okDot}"/>`;
  left += text(HERO.status, { x: stX + 26, y: 44.3, size: 12, font: 'sansSemi', fill: t.okInk });

  left += text(HERO.eyebrow, { x: P, y: 122, size: 11, font: 'monoMed', fill: t.muted, ls: 0.14 });
  left += text(HERO.lead, { x: P, y: 170, size: 43, font: 'display', fill: t.fg, ls: -0.035 });
  const step = 2.6;
  HERO.phrases.forEach((p, i) => {
    left += `<g class="ph${i === 0 ? ' ph0' : ''}" style="animation-delay:${(i * step).toFixed(1)}s">${text(p, { x: P, y: 218, size: 43, font: 'display', fill: t.primaryInk, ls: -0.035 })}</g>`;
  });
  const intro = paragraph(HERO.intro, { x: P, y: 256, size: 15.5, font: 'sans', fill: t.muted, lineHeight: 23.5, maxWidth: colW });
  left += intro.svg;
  let y = intro.lastY + 36;
  for (const line of HERO.proof) {
    left += `<circle cx="${P + 9}" cy="${y - 5}" r="9" fill="${rgba(t.okDot, dark ? 0.16 : 0.12)}"/>`;
    left += icon('check', { x: P + 3.5, y: y - 10.5, size: 11, color: t.okInk, width: 3 });
    left += text(line, { x: P + 28, y, size: 14, font: 'sansSemi', fill: t.fgSoft });
    y += 26;
  }
  const H = Math.round(y - 26 + 40);

  const termX = 500;
  const termH = 36 + 28 + (HERO.terminal.out.length + 2) * 23 + 22;
  const termY = Math.round(80 + (H - 80 - termH) / 2);

  const total = (HERO.phrases.length * step).toFixed(1);
  const vis = 100 / HERO.phrases.length;
  const css = `<style>
.ph{opacity:0;animation:ph ${total}s infinite both}
@keyframes ph{0%{opacity:0;transform:translateY(9px)}${(vis * 0.16).toFixed(2)}%{opacity:1;transform:none}${(vis * 0.86).toFixed(2)}%{opacity:1;transform:none}${vis.toFixed(2)}%{opacity:0;transform:translateY(-7px)}100%{opacity:0}}
.ln{animation:ln 10s infinite both}
@keyframes ln{0%{opacity:0}2.5%{opacity:1}84%{opacity:1}90%,100%{opacity:0}}
.cur{animation:bl 1.1s steps(1) infinite}
@keyframes bl{50%{opacity:0}}
.dot{animation:pu 2.4s ease-in-out infinite}
@keyframes pu{50%{opacity:.35}}
.gx{animation:gx 8s linear infinite}
@keyframes gx{from{transform:translateX(-160px)}to{transform:translateX(${W}px)}}
.gy{animation:gy 6.5s linear infinite 1.5s}
@keyframes gy{from{transform:translateY(-140px)}to{transform:translateY(${H}px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.ph{opacity:0}.ph0{opacity:1}}
</style>`;

  const defs = `<defs>
<clipPath id="below"><rect y="80" width="${W}" height="${H}"/></clipPath>
<clipPath id="panel"><rect width="${W}" height="${H}" rx="28"/></clipPath>
<pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 .5H.5V56" stroke="${t.border}" stroke-opacity="${dark ? 0.75 : 0.9}"/></pattern>
<radialGradient id="fade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W * 0.62} ${H * 0.5}) scale(${W * 0.62} ${H * 0.85})"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="gm"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<radialGradient id="glow1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90 -20) scale(470 330)"><stop stop-color="${t.primary}" stop-opacity="${dark ? 0.3 : 0.13}"/><stop offset="1" stop-color="${t.primary}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W - 40} ${H + 10}) scale(420 300)"><stop stop-color="${t.violet}" stop-opacity="${dark ? 0.26 : 0.12}"/><stop offset="1" stop-color="${t.violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="hx" x1="0" x2="1" y1="0" y2="0"><stop stop-color="${t.primaryInk}" stop-opacity="0"/><stop offset=".5" stop-color="${t.primaryInk}"/><stop offset="1" stop-color="${t.primaryInk}" stop-opacity="0"/></linearGradient>
<linearGradient id="hy" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${t.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${t.cyan}"/><stop offset="1" stop-color="${t.cyan}" stop-opacity="0"/></linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020617" flood-opacity="${dark ? 0.55 : 0.28}"/></filter>
</defs>`;

  const body = `${css}<g clip-path="url(#panel)">
<rect width="${W}" height="${H}" fill="${t.bg}"/>
<rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#gm)"/>
<rect width="${W}" height="${H}" fill="url(#glow1)"/>
<rect width="${W}" height="${H}" fill="url(#glow2)"/>
<path d="M0 79.5H${W}" stroke="${t.border}"/>
<rect class="gx" x="0" y="79" width="160" height="1.2" fill="url(#hx)"/>
<path d="M468.5 80V${H}" stroke="${t.border}" stroke-opacity=".7"/>
<g clip-path="url(#below)"><rect class="gy" x="468" y="0" width="1.2" height="140" fill="url(#hy)"/></g>
<circle cx="468.5" cy="79.5" r="3" fill="${t.bg}" stroke="${t.primaryInk}" stroke-width="1.2"/>
${left}
<g filter="url(#shadow)">${terminal(termX, termY, W - P - termX, termH)}</g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="27.5" stroke="${t.border}"/>`;

  return svgDoc(W, H, `Victor Llerena — ${HERO.lead} software a medida, integraciones API, CRMs y agentes de IA`, body, defs);
}

// ── Botones ─────────────────────────────────────────────────────────────────
export function button(t, { label, icon: name, primary }) {
  const H = 40;
  const tw = measure(label, { size: 14, font: 'sansSemi' });
  const W = Math.ceil(15 + 16 + 9 + tw + 17);
  const color = primary ? '#FFFFFF' : t.fg;
  let o = rect(0.5, 0.5, W - 1, H - 1, 12, primary ? `fill="${t.primary}" stroke="${t.primary}"` : `fill="${t.surface}" stroke="${t.border}"`);
  o += name === 'chat' && !primary ? brandIcon('whatsapp', t, { x: 15, y: 12, size: 16 }) : icon(name, { x: 15, y: 12, size: 16, color: primary ? '#FFFFFF' : t.primaryInk });
  o += text(label, { x: 40, y: 25, size: 14, font: 'sansSemi', fill: color });
  return svgDoc(W, H, label, o);
}

// ── Cifras ──────────────────────────────────────────────────────────────────
function tiles(t, items, y0 = 0, h = 112) {
  const gap = 12;
  const w = (FULL - gap * 3) / 4;
  const accents = [t.primary, t.cyan, t.violet, t.primary];
  let o = '';
  items.forEach((it, i) => {
    const x = i * (w + gap);
    o += card(t, x, y0, w, h, 22);
    o += rect(x + 22, y0 + 20, 22, 3, 1.5, `fill="${accents[i]}"`);
    o += text(it.value, { x: x + 22, y: y0 + 62, size: 34, font: 'display', fill: t.fg, ls: -0.035 });
    o += paragraph(it.label, { x: x + 22, y: y0 + 84, size: 13, font: 'sans', fill: t.muted, lineHeight: 16.5, maxWidth: w - 40, maxLines: 2 }).svg;
  });
  return o;
}

export const proof = (t) => svgDoc(FULL, 118, PROOF.map((p) => `${p.value} ${p.label}`).join(' · '), tiles(t, PROOF, 0, 118));

// ── Tarjetas de proyecto ────────────────────────────────────────────────────
export function projectCard(t, c, side) {
  const W = HALF;
  const H = 208;
  const P = 22;
  const dark = t.name === 'dark';
  const accent = t[c.accent];
  const tone = {
    ok: [t.okDot, t.okInk],
    early: [t.violet, t.violetInk],
    info: [t.cyan, t.cyanInk],
  }[c.tone];

  const defs = `<defs><clipPath id="c"><rect width="${W}" height="${H}" rx="22"/></clipPath><radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W - 20} -10) scale(260 170)"><stop stop-color="${accent}" stop-opacity="${dark ? 0.3 : 0.16}"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>`;

  let o = card(t, 0, 0, W, H, 22);
  o += `<rect width="${W}" height="${H}" fill="url(#g)" clip-path="url(#c)"/>`;
  o += text(c.kicker, { x: P, y: 37, size: 10, font: 'monoMed', fill: t.muted, ls: 0.12 });

  const sw = measure(c.status, { size: 10.5, font: 'monoMed' }) + 10 * 2 + 12;
  o += pill(c.status, { x: W - P - sw, y: 22, h: 23, size: 10.5, fill: rgba(tone[0], dark ? 0.14 : 0.1), stroke: rgba(tone[0], 0.32), color: tone[1], dot: tone[0] }).svg;

  o += text(c.title, { x: P, y: 76, size: 23, font: 'display', fill: t.fg, ls: -0.03 });
  o += paragraph(c.summary, { x: P, y: 101, size: 13.5, font: 'sans', fill: t.muted, lineHeight: 19, maxWidth: W - P * 2, maxLines: 3 }).svg;

  let x = P;
  const cy = H - P - 24;
  for (const s of c.stack) {
    const chip = pill(s, { x, y: cy, h: 24, size: 10.5, font: 'mono', fill: dark ? t.surface2 : t.surface2, stroke: t.border, color: t.fgSoft, padX: 9 });
    if (x + chip.w > W - P - 36) break;
    o += chip.svg;
    x += chip.w + 6;
  }
  o += `<circle cx="${W - P - 12}" cy="${cy + 12}" r="12" fill="${rgba(accent, dark ? 0.16 : 0.1)}"/>`;
  o += icon('arrow', { x: W - P - 18, y: cy + 6, size: 12, color: dark ? t.fg : t.primaryInk, width: 2.4 });
  return svgDoc(W, H, `${c.title} — ${c.status}. ${c.summary}`, o, defs, halfPad(side));
}

// ── Actividad en GitHub ─────────────────────────────────────────────────────
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const longDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export function activity(t, s) {
  const cal = s.calendar;
  const kpis = [
    { value: fmt(cal.total), label: 'contribuciones en los últimos 12 meses' },
    { value: fmt(s.commits), label: 'commits, casi todos en repos privados' },
    { value: fmt(s.pullRequests), label: 'pull requests creados' },
    { value: `${s.repos}`, label: 'repositorios con commits este año' },
  ];
  let o = tiles(t, kpis, 0, 118);

  const y0 = 130;
  const P = 28;
  const gridX = P + 34;
  const gridY = y0 + 86;
  const n = cal.weeks.length;
  const pitch = (FULL - P - gridX) / n;
  const cell = pitch - 3;
  const H = gridY + 7 * pitch + 50;

  o += card(t, 0, y0, FULL, H - y0, 24);
  o += text('Actividad del último año', { x: P, y: y0 + 40, size: 18, font: 'display', fill: t.fg, ls: -0.02 });
  const first = cal.weeks[0][0].date;
  const last = cal.weeks[n - 1].at(-1).date;
  o += text(`${longDate(first)} — ${longDate(last)}`, { x: FULL - P, y: y0 + 39, size: 11, font: 'mono', fill: t.muted, anchor: 'end' });

  let prevMonth = -1;
  let lastLabelX = -99;
  cal.weeks.forEach((week, w) => {
    const x = gridX + w * pitch;
    const month = Number(week[0].date.slice(5, 7)) - 1;
    if (month !== prevMonth && week.length === 7 && x - lastLabelX > 30) {
      o += text(MONTHS[month], { x, y: gridY - 10, size: 10, font: 'mono', fill: t.muted });
      lastLabelX = x;
    }
    prevMonth = month;
    for (const d of week) {
      o += `<rect x="${(x).toFixed(2)}" y="${(gridY + d.weekday * pitch).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" rx="3" fill="${t.heat[d.level]}"/>`;
    }
  });
  [['Lun', 1], ['Mié', 3], ['Vie', 5]].forEach(([l, wd]) => {
    o += text(l, { x: P, y: gridY + wd * pitch + cell - 2, size: 9.5, font: 'mono', fill: t.muted });
  });

  const fy = gridY + 7 * pitch + 22;
  o += text(`Mejor día: ${cal.best.count} contribuciones, el ${longDate(cal.best.date)}`, { x: P, y: fy, size: 12.5, font: 'sans', fill: t.muted });
  const lx = FULL - P - 5 * 15 - 30;
  o += text('Menos', { x: lx - 8, y: fy, size: 10, font: 'mono', fill: t.muted, anchor: 'end' });
  t.heat.forEach((c, i) => {
    o += `<rect x="${lx + i * 15}" y="${fy - 10}" width="11.5" height="11.5" rx="3" fill="${c}"/>`;
  });
  o += text('Más', { x: FULL - P, y: fy, size: 10, font: 'mono', fill: t.muted, anchor: 'end' });

  return svgDoc(FULL, Math.round(H), `${fmt(cal.total)} contribuciones en los últimos 12 meses, ${fmt(s.commits)} commits y ${fmt(s.pullRequests)} pull requests`, o);
}

export function languages(t, s) {
  const W = HALF;
  const H = 244;
  const P = 22;
  const langs = s.languages;
  let o = card(t, 0, 0, W, H, 24);
  o += text('Lenguajes', { x: P, y: 40, size: 18, font: 'display', fill: t.fg, ls: -0.02 });
  o += text('REPOS ACTIVOS · ÚLTIMOS 12 MESES', { x: P, y: 60, size: 9.5, font: 'monoMed', fill: t.muted, ls: 0.1 });

  const bw = W - P * 2;
  let bx = P;
  let bar = '';
  for (const l of langs) {
    const w = (l.pct / 100) * bw;
    bar += `<rect x="${bx.toFixed(2)}" y="80" width="${Math.max(w - 2, 1).toFixed(2)}" height="10" rx="2.5" fill="${l.color}"/>`;
    bx += w;
  }
  o += bar;

  const colW = (bw - 20) / 2;
  langs.forEach((l, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = P + col * (colW + 20);
    const y = 124 + row * 28;
    o += `<circle cx="${x + 5}" cy="${y - 4.5}" r="4.5" fill="${l.color}"/>`;
    o += text(l.name, { x: x + 18, y, size: 13.5, font: 'sansSemi', fill: t.fg });
    o += text(`${l.pct < 10 ? l.pct.toFixed(1) : Math.round(l.pct)}%`, { x: x + colW, y, size: 11.5, font: 'mono', fill: t.muted, anchor: 'end' });
  });
  return svgDoc(W, H, `Lenguajes: ${langs.map((l) => `${l.name} ${Math.round(l.pct)}%`).join(', ')}`, o, '', halfPad('l'));
}

export function rhythm(t, s) {
  const W = HALF;
  const H = 244;
  const P = 22;
  const cal = s.calendar;
  let o = card(t, 0, 0, W, H, 24);
  o += text('Ritmo semanal', { x: P, y: 40, size: 18, font: 'display', fill: t.fg, ls: -0.02 });
  o += text('CONTRIBUCIONES POR DÍA DE LA SEMANA', { x: P, y: 60, size: 9.5, font: 'monoMed', fill: t.muted, ls: 0.1 });

  // GitHub cuenta la semana desde el domingo; aquí va de lunes a domingo.
  const order = [1, 2, 3, 4, 5, 6, 0];
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const max = Math.max(...cal.byWeekday);
  const top = 78;
  const maxH = 62;
  const bw = 34;
  const gap = (W - P * 2 - bw * 7) / 6;
  order.forEach((wd, i) => {
    const v = cal.byWeekday[wd];
    const h = Math.max((v / max) * maxH, 3);
    const x = P + i * (bw + gap);
    o += rect(x, top, bw, maxH, 7, `fill="${t.surface2}"`);
    o += rect(x, top + maxH - h, bw, h, 7, `fill="${v === max ? t.primaryInk : t.primary}"`);
    o += text(names[wd], { x: x + bw / 2, y: top + maxH + 16, size: 9.5, font: 'mono', fill: v === max ? t.fg : t.muted, anchor: 'middle' });
  });

  o += `<path d="M${P} 176.5H${W - P}" stroke="${t.border}"/>`;
  const minis = [
    [`${cal.current} días`, 'RACHA ACTUAL'],
    [`${cal.longest} días`, 'RACHA MÁS LARGA'],
    [(cal.total / cal.totalDays).toFixed(1), 'PROMEDIO DIARIO'],
  ];
  const cw = (W - P * 2) / 3;
  minis.forEach(([v, l], i) => {
    const x = P + i * cw;
    o += text(v, { x, y: 204, size: 17, font: 'display', fill: t.fg, ls: -0.02 });
    o += text(l, { x, y: 222, size: 8.5, font: 'monoMed', fill: t.muted, ls: 0.08 });
  });
  return svgDoc(W, H, `Ritmo semanal: racha actual de ${cal.current} días, la más larga de ${cal.longest} días`, o, '', halfPad('r'));
}

// ── Stack ───────────────────────────────────────────────────────────────────
export function stack(t) {
  const W = FULL;
  const P = 28;
  const dark = t.name === 'dark';
  let o = '';
  let y = P;
  STACK.forEach((group, gi) => {
    if (gi > 0) {
      o += `<path d="M${P} ${y + 0.5}H${W - P}" stroke="${t.border}"/>`;
      y += 24;
    }
    o += text(group.label, { x: P, y: y + 14, size: 14.5, font: 'sansSemi', fill: t.fg });
    const lw = measure(group.label, { size: 14.5, font: 'sansSemi' });
    o += text(String(group.tools.length).padStart(2, '0'), { x: P + lw + 9, y: y + 14, size: 10.5, font: 'mono', fill: t.muted });
    y += 30;
    let x = P;
    for (const [ic, name] of group.tools) {
      const tw = measure(name, { size: 13.5, font: 'sansSemi' });
      const cw = 12 + 16 + 8 + tw + 14;
      if (x + cw > W - P) {
        x = P;
        y += 42;
      }
      o += rect(x + 0.5, y + 0.5, cw - 1, 33, 11, `fill="${dark ? t.bg : t.bg}" stroke="${t.border}"`);
      o += brandIcon(ic, t, { x: x + 12, y: y + 9, size: 16 });
      o += text(name, { x: x + 36, y: y + 21.8, size: 13.5, font: 'sansSemi', fill: t.fgSoft });
      x += cw + 8;
    }
    y += 34 + 24;
  });
  const H = y - 24 + P;
  return svgDoc(W, H, `Stack: ${STACK.map((g) => `${g.label}: ${g.tools.map((x) => x[1]).join(', ')}`).join('. ')}`, card(t, 0, 0, W, H, 24) + o);
}

// ── Pie ─────────────────────────────────────────────────────────────────────
export function footer(t) {
  const W = FULL;
  const H = 76;
  let o = card(t, 0, 0, W, H, 22);
  o += logo(t, { x: 28, y: 28, h: 20 }).svg;
  o += text(FOOTER.tagline, { x: W - 28, y: 43.5, size: 17, font: 'display', fill: t.fg, anchor: 'end', ls: -0.02 });
  return svgDoc(W, H, `Victor Llerena — ${FOOTER.tagline}`, o);
}
