// Genera las piezas SVG del README en assets/generated, en tema claro y oscuro.
//   GH_TOKEN=$(gh auth token) npm run build
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, THEMES } from './lib/kit.mjs';
import { loadStats } from './lib/data.mjs';
import { BUTTONS, CARDS } from './content.mjs';
import { activity, button, footer, hero, languages, projectCard, proof, rhythm, stack } from './pieces.mjs';

const OUT = path.join(ROOT, 'assets', 'generated');
fs.mkdirSync(OUT, { recursive: true });

const stats = await loadStats(process.env.GH_TOKEN || process.env.GITHUB_TOKEN);

let count = 0;
const write = (name, theme, svg) => {
  const file = path.join(OUT, `${name}-${theme}.svg`);
  // No tocar el archivo si no cambió: así el workflow solo hace commit cuando hay datos nuevos.
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== svg) fs.writeFileSync(file, svg);
  count++;
};

for (const t of Object.values(THEMES)) {
  write('hero', t.name, hero(t));
  write('proof', t.name, proof(t));
  write('stack', t.name, stack(t));
  write('footer', t.name, footer(t));
  write('activity', t.name, activity(t, stats));
  write('languages', t.name, languages(t, stats));
  write('rhythm', t.name, rhythm(t, stats));
  for (const b of BUTTONS) write(`btn-${b.id}`, t.name, button(t, b));
  CARDS.forEach((c, i) => write(`card-${c.id}`, t.name, projectCard(t, c, i % 2 === 0 ? 'l' : 'r')));
}
console.log(`✓ ${count} piezas en assets/generated`);
