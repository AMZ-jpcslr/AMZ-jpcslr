import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
const unknown = process.argv.slice(2).filter(arg => arg !== '--check');
if (unknown.length) throw new Error(`Unknown option: ${unknown.join(', ')}`);
const profile = JSON.parse(await readFile(path.join(root, 'profile.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const units = value => [...value].reduce((sum, c) => sum + (c.codePointAt(0) > 255 ? 2 : 1), 0);

function text(value, name, max = 200) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/u.test(value) || units(value) > max) {
    throw new Error(`${name}: a non-empty single-line string of at most ${max} display units is required.`);
  }
}
function list(value, name, min, max) {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error(`${name}: expected ${min}–${max} items.`);
}
function validate(p) {
  text(p.username, 'username', 39);
  if (!/^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(p.username)) throw new Error('Invalid GitHub username.');
  text(p.name, 'name', 26);
  text(p.alias, 'alias', 16);
  text(p.tagline, 'tagline', 62);
  text(p.about, 'about', 600);
  list(p.focus, 'focus', 1, 5);
  p.focus.forEach((v, i) => text(v, `focus[${i}]`, 54));
  const portfolio = new URL(p.portfolio);
  if (portfolio.protocol !== 'https:' || portfolio.username || portfolio.password) throw new Error('portfolio must be an HTTPS URL without credentials.');
  list(p.skills, 'skills', 1, 12);
  p.skills.forEach((v, i) => text(v, `skills[${i}]`, 24));
  list(p.projects, 'projects', 1, 8);
  list(p.moreProjects, 'moreProjects', 0, 8);
  [...p.projects, ...p.moreProjects].forEach((v, i) => {
    if (!/^[a-z\d_.-]+$/i.test(v.repository) || /^\.{1,2}$/.test(v.repository)) throw new Error(`Invalid repository at index ${i}.`);
    text(v.title, `project[${i}].title`, 80);
    text(v.description, `project[${i}].description`, 500);
  });
  p.projects.forEach((v, i) => {
    text(v.category, `project[${i}].category`, 40);
    list(v.tags, `project[${i}].tags`, 1, 5);
    v.tags.forEach(tag => text(tag, 'tag', 30));
  });
}
validate(profile);

const palettes = {
  dark: {bg:'#0d1117', panel:'#151b23', bar:'#1c232d', border:'#303b49', text:'#e6edf3', muted:'#a2afbf', green:'#7ee787', blue:'#a5c9ff', inset:'#101820'},
  light: {bg:'#ffffff', panel:'#f6f8fa', bar:'#eaeef2', border:'#cbd3dc', text:'#1f2328', muted:'#596674', green:'#176c38', blue:'#2456a6', inset:'#edf4ef'}
};
function terminal(theme) {
  const c = palettes[theme];
  const height = 364 + profile.focus.length * 34;
  const line = (x, y, content, color = c.text, size = 19, extra = '') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${escape(content)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="${height}" viewBox="0 0 880 ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escape(profile.name)} | ${escape(profile.username)}</title>
  <desc id="desc">${escape(profile.tagline)} ${escape(profile.focus.join('. '))}</desc>
  <rect x="1" y="1" width="878" height="${height - 2}" rx="14" fill="${c.bg}" stroke="${c.border}"/>
  <path d="M15 1H865Q879 1 879 15V51H1V15Q1 1 15 1Z" fill="${c.bar}"/>
  <path d="M1 51H879" stroke="${c.border}"/>
  <circle cx="27" cy="26" r="6" fill="#ef6b67"/><circle cx="49" cy="26" r="6" fill="#e6bd4f"/><circle cx="71" cy="26" r="6" fill="#69c269"/>
  <g font-family="'Cascadia Code', Consolas, 'Liberation Mono', monospace">
  ${line(105, 31, 'profile.sh', c.muted, 15)}
  ${line(850, 31, '~ / ' + profile.alias.toLowerCase(), c.muted, 14, 'text-anchor="end"')}
  ${line(36, 98, '❯', c.green, 22)}${line(62, 98, 'whoami', c.text, 20)}
  ${line(36, 160, profile.name, c.text, 44, 'font-weight="700"')}
  ${line(38, 193, '@' + profile.username, c.green, 18)}
  ${line(38, 229, profile.tagline, c.muted, 18)}
  <path d="M36 253H844" stroke="${c.border}"/>
  ${line(36, 293, '❯', c.green, 22)}${line(62, 293, 'cat focus.txt', c.text, 20)}
  ${profile.focus.map((v, i) => `${line(39, 330 + i * 34, '→', c.green, 19)}${line(69, 330 + i * 34, v, c.blue, 19)}`).join('\n  ')}
  <rect x="22" y="${height - 45}" width="836" height="30" rx="5" fill="${c.inset}"/>
  ${line(37, height - 25, '~ / projects', c.green, 14)}
  ${line(839, height - 25, 'explore below ↓', c.muted, 14, 'text-anchor="end"')}
  </g>
</svg>\n`;
}
function badge(label, theme) {
  const c = palettes[theme];
  const width = units(label) * 8 + 35;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="30" viewBox="0 0 ${width} 30" role="img" aria-label="${escape(label)}"><rect x=".5" y=".5" width="${width - 1}" height="29" rx="5" fill="${c.panel}" stroke="${c.border}"/><rect x="10" y="12" width="5" height="5" rx="1" fill="${c.green}"/><text x="23" y="20" fill="${c.text}" font-family="Consolas, 'Liberation Mono', monospace" font-size="13">${escape(label)}</text></svg>\n`;
}
function wrap(value, limit) {
  const lines = [];
  let rest = value;
  while (units(rest) > limit) {
    let end = 0;
    let width = 0;
    for (const char of rest) {
      if (width + units(char) > limit) break;
      width += units(char);
      end += char.length;
    }
    const space = rest.lastIndexOf(' ', end);
    if (space > end / 2) end = space;
    lines.push(rest.slice(0, end).trim());
    rest = rest.slice(end).trim();
  }
  if (rest) lines.push(rest);
  return lines;
}
function mobileTerminal(theme) {
  const c = palettes[theme];
  const textLine = (x, y, value, color, size = 18, extra = '') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${escape(value)}</text>`;
  const tagline = wrap(profile.tagline, 38);
  const divider = 182 + tagline.length * 24;
  let y = divider + 66;
  const focus = [];
  for (const item of profile.focus) {
    wrap(item, 34).forEach((line, i) => {
      if (!i) focus.push(textLine(26, y, '→', c.green));
      focus.push(textLine(52, y, line, c.blue));
      y += 26;
    });
    y += 10;
  }
  const height = y + 58;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${height}" viewBox="0 0 480 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${escape(profile.name)} | ${escape(profile.username)}</title><desc id="desc">${escape(profile.tagline)} ${escape(profile.focus.join('. '))}</desc>
<rect x="1" y="1" width="478" height="${height - 2}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
<path d="M13 1H467Q479 1 479 13V45H1V13Q1 1 13 1Z" fill="${c.bar}"/><path d="M1 45H479" stroke="${c.border}"/>
<circle cx="23" cy="24" r="5" fill="#ef6b67"/><circle cx="41" cy="24" r="5" fill="#e6bd4f"/><circle cx="59" cy="24" r="5" fill="#69c269"/>
<g font-family="'Cascadia Code', Consolas, 'Liberation Mono', monospace">
${textLine(88, 29, 'profile.sh', c.muted, 15)}
${textLine(26, 84, '❯ whoami', c.green, 19)}
${textLine(26, 130, profile.name, c.text, Math.min(34, Math.floor(420 / (units(profile.name) * .62))), 'font-weight="700"')}
${textLine(27, 159, '@' + profile.username, c.green, Math.min(17, Math.floor(420 / ((units(profile.username) + 1) * .62))))}
${tagline.map((line, i) => textLine(27, 195 + i * 24, line, c.muted, 17)).join('\n')}
<path d="M26 ${divider}H454" stroke="${c.border}"/>
${textLine(26, divider + 35, '❯ cat focus.txt', c.text, 19)}
${focus.join('\n')}
<rect x="16" y="${height - 46}" width="448" height="30" rx="5" fill="${c.inset}"/>
${textLine(27, height - 25, '~/projects', c.green, 14)}
${textLine(452, height - 25, 'explore below ↓', c.muted, 14, 'text-anchor="end"')}
</g></svg>\n`;
}
function picture(stem, alt, extra = '') {
  const mobile = stem === 'terminal' ? `\n  <source media="(max-width: 540px) and (prefers-color-scheme: dark)" srcset="assets/terminal-mobile-dark.svg">\n  <source media="(max-width: 540px) and (prefers-color-scheme: light)" srcset="assets/terminal-mobile-light.svg">` : '';
  return `<picture>${mobile}\n  <source media="(prefers-color-scheme: dark)" srcset="assets/${stem}-dark.svg">\n  <source media="(prefers-color-scheme: light)" srcset="assets/${stem}-light.svg">\n  <img src="assets/${stem}-dark.svg" alt="${escape(alt)}" ${extra}>\n</picture>`;
}
const repoURL = name => `https://github.com/${profile.username}/${name}`;
function projectCell(project, index) {
  return `<td width="50%" valign="top">\n<p><sub>${String(index + 1).padStart(2, '0')} / ${escape(project.category)}</sub></p>\n<h3><a href="${escape(repoURL(project.repository))}">${escape(project.title)} ↗</a></h3>\n<p>${escape(project.description)}</p>\n<p>${project.tags.map(tag => `<code>${escape(tag)}</code>`).join(' ')}</p>\n</td>`;
}
function body() {
  const rows = [];
  for (let i = 0; i < profile.projects.length; i += 2) {
    rows.push(`<tr>\n${profile.projects.slice(i, i + 2).map((p, n) => projectCell(p, i + n)).join('\n')}\n${i + 1 === profile.projects.length ? '<td width="50%"></td>\n' : ''}</tr>`);
  }
  return `${picture('terminal', `${profile.name} (@${profile.username}) — ${profile.tagline} ${profile.focus.join(' / ')}`, 'width="100%"')}

<p align="center"><a href="${escape(profile.portfolio)}"><b>Portfolio ↗</b></a> &nbsp;·&nbsp; <a href="https://github.com/${escape(profile.username)}?tab=repositories">All repositories ↗</a></p>

<h2><code>~/about</code></h2>
<p>${escape(profile.about)}</p>

<h2><code>~/toolbox</code></h2>
<p>
${profile.skills.map((skill, i) => picture(`skill-${i + 1}`, skill, 'height="30"')).join('\n')}
</p>

<h2><code>~/projects</code></h2>
<table>
${rows.join('\n')}
</table>
${profile.moreProjects.length ? `\n<details>\n<summary>More projects</summary>\n<ul>\n${profile.moreProjects.map(p => `<li><a href="${escape(repoURL(p.repository))}">${escape(p.title)}</a> — ${escape(p.description)}</li>`).join('\n')}\n</ul>\n</details>\n` : ''}
<hr>
<p align="center"><sub><code>${escape(profile.alias.toLowerCase())}@github:~$</code> Thanks for stopping by.</sub></p>
`;
}
const content = body();
function preview() {
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(profile.name)} · Profile preview</title>
<style>
:root { color-scheme:dark; --bg:#0d1117; --fg:#e6edf3; --muted:#a2afbf; --line:#30363d; --surface:#151b23; --link:#4493f8; }
:root[data-theme="light"] { color-scheme:light; --bg:#fff; --fg:#1f2328; --muted:#59636e; --line:#d1d9e0; --surface:#f6f8fa; --link:#0969da; }
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","Yu Gothic UI",sans-serif} a{color:var(--link);text-decoration:none} a:hover{text-decoration:underline} .preview-bar{padding:16px 24px;display:flex;gap:16px;flex-wrap:wrap;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);color:var(--muted);font-size:13px}.preview-bar span{margin-right:auto}.preview-bar button{font:inherit;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:6px 12px;cursor:pointer}.preview-bar button[aria-pressed="true"]{border-color:var(--link);color:var(--link)}main{max-width:946px;margin:32px auto;padding:0 20px 40px}.repo-label{font:12px Consolas,monospace;color:var(--muted);padding:16px 24px;border:1px solid var(--line);border-bottom:0;border-radius:7px 7px 0 0}.markdown-body{padding:28px;border:1px solid var(--line);border-radius:0 0 7px 7px;overflow-wrap:anywhere}.markdown-body>picture{display:block}.markdown-body img{max-width:100%}h2{font-size:21px;line-height:1.4;border-bottom:1px solid var(--line);padding-bottom:10px;margin:30px 0 16px}h3{font-size:17px;line-height:1.5;margin:10px 0 14px}p{margin:0 0 16px}p[align="center"]{margin-top:20px}code{font:85% Consolas,"Liberation Mono",monospace;background:var(--surface);padding:.2em .4em;border-radius:5px}h2 code{background:transparent;padding:0}table{border-collapse:collapse;width:100%;table-layout:fixed;margin-bottom:16px}td{border:1px solid var(--line);padding:16px 18px}td p{font-size:14px}td p:last-child{margin:16px 0 0}td code{display:inline-block;margin:2px 1px}sub{font-size:11px;color:var(--muted);vertical-align:baseline;letter-spacing:.3px}details{margin-top:22px}summary{cursor:pointer;color:var(--muted)}li{margin:10px 0}hr{border:0;border-top:1px solid var(--line);margin:28px 0 0}.markdown-body>p>picture{display:inline-block;margin:0 5px 5px 0;vertical-align:middle}
@media(max-width:540px){body{font-size:14px}main{padding:0 10px;margin:16px auto}.markdown-body{padding:14px}.repo-label{padding:12px 14px}td{padding:10px}td p{font-size:13px}h3{font-size:15px}sub{font-size:10px}.preview-bar{padding:12px;gap:8px}.preview-bar span{width:100%}}
</style></head><body><header class="preview-bar"><span>README PREVIEW · ローカル確認用</span><button type="button" data-theme="dark" aria-pressed="true">Dark</button><button type="button" data-theme="light" aria-pressed="false">Light</button></header><main><div class="repo-label">${escape(profile.username)} / README.md</div><article class="markdown-body">${content}</article></main>
<script>
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('button[data-theme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === theme)));
  document.querySelectorAll('picture').forEach(picture => {
    const sources = picture.querySelectorAll('source');
    sources.forEach(source => { source.media = source.srcset.includes('-' + theme + '.svg') ? (source.srcset.includes('-mobile-') ? '(max-width: 540px)' : 'all') : 'not all'; });
    const img = picture.querySelector('img');
    img.src = img.getAttribute('src').replace(/-(dark|light)\\.svg$/, '-' + theme + '.svg');
  });
};
document.querySelectorAll('button[data-theme]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.theme)));
applyTheme('dark');
</script></body></html>\n`;
}
const outputs = new Map([
  ['README.md', '<!-- Generated by scripts/generate.mjs. Edit profile.json, then run npm run build. -->\n\n' + content],
  ['preview.html', preview()]
]);
for (const theme of Object.keys(palettes)) {
  outputs.set(`assets/terminal-${theme}.svg`, terminal(theme));
  outputs.set(`assets/terminal-mobile-${theme}.svg`, mobileTerminal(theme));
  profile.skills.forEach((label, i) => outputs.set(`assets/skill-${i + 1}-${theme}.svg`, badge(label, theme)));
}
// Validate all input before any output is written. --check performs no writes.
const stale = [];
for (const [name, expected] of outputs) {
  const destination = path.join(root, name);
  if (check) {
    const actual = await readFile(destination, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (actual !== expected) stale.push(name);
  } else {
    await mkdir(path.dirname(destination), {recursive:true});
    await writeFile(destination, expected, 'utf8');
  }
}
if (stale.length) {
  console.error(`Generated files are missing or out of date:\n${stale.join('\n')}\nRun npm run build.`);
  process.exitCode = 1;
} else console.log(`${check ? 'Verified' : 'Generated'} ${outputs.size} files. No network access or dependencies required.`);
