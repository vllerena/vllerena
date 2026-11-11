// Datos de GitHub. El calendario de contribuciones es público (incluye las
// privadas porque el perfil las muestra), así que el token del workflow basta.
// Commits, pull requests y lenguajes viven en repos privados: solo se
// refrescan con un token que los vea (secreto PROFILE_TOKEN); si no, se
// conserva lo último guardado en data/stats.json.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './kit.mjs';
import { LANG_SKIP } from '../content.mjs';

const USER = 'vllerena';
const CACHE = path.join(ROOT, 'data', 'stats.json');

async function gql(token, query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'profile-readme' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub GraphQL: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

function streaks(days) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Hoy puede no tener actividad todavía: la racha vigente termina hoy o ayer.
  let i = days.length - 1;
  if (days[i]?.count === 0) i--;
  let current = 0;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { current, longest };
}

async function languages(token) {
  const since = new Date(Date.now() - 365 * 864e5).toISOString();
  const totals = new Map();
  let cursor = null;
  do {
    const data = await gql(
      token,
      `query($login:String!,$cursor:String){ user(login:$login){ repositories(first:100, after:$cursor, ownerAffiliations:OWNER, isFork:false){
        pageInfo{hasNextPage endCursor}
        nodes{ pushedAt languages(first:12, orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name color } } } } } } }`,
      { login: USER, cursor },
    );
    const page = data.user.repositories;
    for (const repo of page.nodes) {
      if (repo.pushedAt < since) continue;
      for (const { size, node } of repo.languages.edges) {
        if (LANG_SKIP.has(node.name)) continue;
        const cur = totals.get(node.name) ?? { name: node.name, color: node.color ?? '#8B8F98', size: 0 };
        cur.size += size;
        totals.set(node.name, cur);
      }
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  const list = [...totals.values()].sort((a, b) => b.size - a.size);
  const sum = list.reduce((s, l) => s + l.size, 0);
  const top = list.slice(0, 6).map((l) => ({ name: l.name, color: l.color, pct: (l.size / sum) * 100 }));
  const rest = 100 - top.reduce((s, l) => s + l.pct, 0);
  if (rest > 0.05) top.push({ name: 'Otros', color: '#8B8F98', pct: rest });
  return top;
}

export async function loadStats(token) {
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  if (!token) {
    if (!cache.calendar) throw new Error('Sin token y sin data/stats.json: define GH_TOKEN.');
    console.log('· sin token: se usa data/stats.json');
    return cache;
  }

  const data = await gql(
    token,
    `query($login:String!){ user(login:$login){
      privateRepos: repositories(ownerAffiliations:OWNER, privacy:PRIVATE){ totalCount }
      contributionsCollection{
        totalCommitContributions totalPullRequestContributions restrictedContributionsCount
        totalRepositoriesWithContributedCommits
        contributionCalendar{ totalContributions weeks{ contributionDays{ date weekday contributionCount contributionLevel } } }
      } } }`,
    { login: USER },
  );
  const cc = data.user.contributionsCollection;
  const weeks = cc.contributionCalendar.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, weekday: d.weekday, count: d.contributionCount, level: LEVEL[d.contributionLevel] })),
  );
  const days = weeks.flat();
  const byWeekday = Array(7).fill(0);
  for (const d of days) byWeekday[d.weekday] += d.count;
  const best = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);

  const stats = {
    ...cache,
    updatedAt: new Date().toISOString().slice(0, 10),
    calendar: {
      total: cc.contributionCalendar.totalContributions,
      weeks,
      activeDays: days.filter((d) => d.count > 0).length,
      totalDays: days.length,
      byWeekday,
      best: { date: best.date, count: best.count },
      ...streaks(days),
    },
  };

  // Son dos permisos distintos. Ver los repos privados alcanza para los
  // lenguajes; el detalle de commits y pull requests solo lo ve un token que
  // lea las contribuciones privadas (si no, GitHub las cuenta como «restringidas»).
  const seesRepos = data.user.privateRepos.totalCount > 0;
  const seesContribs = cc.restrictedContributionsCount === 0;
  console.log(`· repos privados visibles: ${data.user.privateRepos.totalCount} · contribuciones restringidas: ${cc.restrictedContributionsCount}`);
  if (seesRepos) {
    stats.languages = await languages(token);
    stats.languagesAt = stats.updatedAt;
    console.log('· lenguajes actualizados');
  } else console.log(`· sin acceso a repos privados: los lenguajes quedan como el ${cache.languagesAt ?? cache.privateAt ?? '—'}`);
  if (seesRepos && seesContribs) {
    stats.commits = cc.totalCommitContributions;
    stats.pullRequests = cc.totalPullRequestContributions;
    stats.repos = cc.totalRepositoriesWithContributedCommits;
    stats.privateAt = stats.updatedAt;
    console.log('· commits, PRs y repos actualizados');
  } else console.log(`· commits, PRs y repos quedan como el ${cache.privateAt ?? '—'}`);

  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, `${JSON.stringify(stats)}\n`);
  return stats;
}
