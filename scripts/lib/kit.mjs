// Primitivas de dibujo. El texto se convierte a trazos con las fuentes del
// sitio (Inter Tight, Urbanist, JetBrains Mono): un SVG dentro de <img> no
// puede cargar fuentes web, y así se ve igual en cualquier equipo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const loadFont = (file) => {
  const buf = fs.readFileSync(path.join(ROOT, 'assets', 'fonts', file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

const FONTS = {
  display: loadFont('inter-tight-latin-600-normal.woff'),
  displayBold: loadFont('inter-tight-latin-700-normal.woff'),
  sans: loadFont('urbanist-latin-500-normal.woff'),
  sansSemi: loadFont('urbanist-latin-600-normal.woff'),
  mono: loadFont('jetbrains-mono-latin-400-normal.woff'),
  monoMed: loadFont('jetbrains-mono-latin-500-normal.woff'),
};

/** Tokens de `src/styles/globals.css` del sitio. */
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0A0B0F',
    surface: '#14161C',
    surface2: '#1E2028',
    fg: '#F4F5F7',
    fgSoft: '#D5D7DD',
    muted: '#9A9DA6',
    border: '#262830',
    primary: '#2563EB',
    primaryInk: '#60A5FA',
    cyan: '#06B6D4',
    cyanInk: '#06B6D4',
    violet: '#7C3AED',
    violetInk: '#A78BFA',
    okInk: '#6EE7B7',
    okDot: '#10B981',
    warnInk: '#FCD34D',
    warnDot: '#F59E0B',
    heat: ['#1E2028', '#1B2F66', '#1F4AAF', '#2563EB', '#7DB4FF'],
  },
  light: {
    name: 'light',
    bg: '#F4F5F7',
    surface: '#FFFFFF',
    surface2: '#EEEFF2',
    fg: '#0E0E10',
    fgSoft: '#2B2D33',
    muted: '#64676F',
    border: '#E2E4E9',
    primary: '#2563EB',
    primaryInk: '#1D4ED8',
    cyan: '#06B6D4',
    cyanInk: '#155E75',
    violet: '#7C3AED',
    violetInk: '#6D28D9',
    okInk: '#047857',
    okDot: '#10B981',
    warnInk: '#92400E',
    warnDot: '#F59E0B',
    heat: ['#E4E6EB', '#BFD3FB', '#7FA6F5', '#2563EB', '#1E3A8A'],
  },
};

const r2 = (n) => Math.round(n * 100) / 100;

function layout(str, { size, font = 'sans', ls = 0 }) {
  const f = FONTS[font];
  const scale = size / f.unitsPerEm;
  const glyphs = f.stringToGlyphs(str);
  let x = 0;
  const out = [];
  glyphs.forEach((g, i) => {
    out.push({ g, x });
    x += (g.advanceWidth ?? 0) * scale + ls * size;
    if (i < glyphs.length - 1) x += f.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return { glyphs: out, width: glyphs.length ? x - ls * size : 0 };
}

export const measure = (str, opts) => layout(str, opts).width;

// Cada glifo se define una sola vez por pieza, en unidades de la fuente
// (enteros), y el texto lo referencia con <use>: pesa ~4 veces menos que
// repetir el trazo de cada letra.
const FONT_KEY = Object.fromEntries(Object.keys(FONTS).map((k, i) => [k, String.fromCharCode(97 + i)]));
let glyphDefs = new Map();

/** Texto como trazos. `anchor`: start | middle | end. */
export function text(str, { x, y, size, font = 'sans', fill, ls = 0, anchor = 'start', opacity, cls }) {
  const f = FONTS[font];
  const { glyphs, width } = layout(str, { size, font, ls });
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const scale = size / f.unitsPerEm;
  let uses = '';
  for (const { g, x: gx } of glyphs) {
    const id = `${FONT_KEY[font]}${g.index}`;
    if (!glyphDefs.has(id)) glyphDefs.set(id, g.getPath(0, 0, f.unitsPerEm).toPathData(0));
    if (!glyphDefs.get(id)) continue; // espacio
    uses += `<use href="#${id}" x="${Math.round(gx / scale)}"/>`;
  }
  const extra = `${opacity != null ? ` opacity="${opacity}"` : ''}${cls ? ` class="${cls}"` : ''}`;
  return `<g fill="${fill}"${extra} transform="translate(${r2(x0)} ${r2(y)}) scale(${+scale.toFixed(5)})">${uses}</g>`;
}

/** Parte un texto en líneas que caben en `maxWidth`. */
export function wrap(str, { size, font = 'sans', ls = 0, maxWidth }) {
  const lines = [];
  let line = '';
  for (const word of str.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, { size, font, ls }) > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Párrafo: devuelve el SVG y la `y` de la última línea base. */
export function paragraph(str, { x, y, lineHeight, maxLines, ...opts }) {
  let lines = wrap(str, opts);
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (measure(`${last}…`, opts) > opts.maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last.trimEnd()}…`;
  }
  const svg = lines.map((l, i) => text(l, { x, y: y + i * lineHeight, ...opts })).join('');
  return { svg, lastY: y + (lines.length - 1) * lineHeight, lines: lines.length };
}

export const rect = (x, y, w, h, r, attrs = '') =>
  `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${r}" ${attrs}/>`;

/** Tarjeta: superficie con filo. */
export const card = (t, x, y, w, h, r = 22, fill = t.surface) =>
  rect(x + 0.5, y + 0.5, w - 1, h - 1, r, `fill="${fill}" stroke="${t.border}"`);

/** Píldora con texto; devuelve el SVG y su ancho. */
export function pill(label, { x, y, h = 24, size = 11.5, font = 'monoMed', fill, stroke, color, padX = 10, dot, ls = 0 }) {
  const tw = measure(label, { size, font, ls });
  const dotW = dot ? 12 : 0;
  const w = tw + padX * 2 + dotW;
  let svg = rect(x + 0.5, y + 0.5, w - 1, h - 1, h / 2, `fill="${fill}"${stroke ? ` stroke="${stroke}"` : ''}`);
  if (dot) svg += `<circle cx="${r2(x + padX + 3.5)}" cy="${y + h / 2}" r="3.5" fill="${dot}"/>`;
  svg += text(label, { x: x + padX + dotW, y: y + h / 2 + size * 0.36, size, font, fill: color, ls });
  return { svg, w };
}

/** Iconos de trazo (viewBox 24), al estilo de lucide. */
const STROKES = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  arrow: '<path d="M7 7h10v10M7 17 17 7"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
};

export function icon(name, { x, y, size = 16, color, width = 2 }) {
  return `<svg x="${r2(x)}" y="${r2(y)}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${STROKES[name]}</svg>`;
}

/** Logo de una tecnología, tomado de `public/stack` del sitio. */
let iconSeq = 0;
export function brandIcon(name, t, { x, y, size = 16 }) {
  const variant = t.name === 'dark' ? `${name}-white.svg` : `${name}.svg`;
  let src = fs.readFileSync(path.join(ROOT, 'assets', 'icons', variant), 'utf8');
  const viewBox = src.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  let inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  // Los ids (degradados, máscaras) se repetirían entre iconos de una misma pieza.
  const p = `i${iconSeq++}-`;
  inner = inner
    .replace(/id="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
  return `<svg x="${r2(x)}" y="${r2(y)}" width="${size}" height="${size}" viewBox="${viewBox}" fill="#000">${inner}</svg>`;
}

export function logo(t, { x, y, h }) {
  const file = t.name === 'dark' ? 'logo-dark.png' : 'logo-light.png';
  const ratio = t.name === 'dark' ? 1116 / 144 : 1105 / 142;
  const b64 = fs.readFileSync(path.join(ROOT, 'assets', 'brand', file)).toString('base64');
  return {
    svg: `<image x="${x}" y="${y}" width="${r2(h * ratio)}" height="${h}" href="data:image/png;base64,${b64}"/>`,
    w: h * ratio,
  };
}

// `pad` deja aire transparente alrededor: así dos piezas a media columna quedan
// separadas entre sí y al ras por fuera.
export function svgDoc(w, h, title, body, defs = '', pad = {}) {
  const { l = 0, r = 0, b = 0 } = pad;
  const glyphs = [...glyphDefs].filter(([, d]) => d).map(([id, d]) => `<path id="${id}" d="${d}"/>`).join('');
  glyphDefs = new Map();
  const label = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w + l + r}" height="${h + b}" viewBox="${-l} 0 ${w + l + r} ${h + b}" fill="none" role="img" aria-label="${label.replace(/"/g, '&quot;')}"><title>${label}</title><defs>${glyphs}</defs>${defs}${body}</svg>
`;
}

export const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
