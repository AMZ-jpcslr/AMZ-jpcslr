import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--check')) throw new Error('Use --check or no arguments.');
const check = args.includes('--check');
const p = JSON.parse(await readFile(new URL('profile.json', root), 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => 'assets/workshop/' + name;
const site = new URL(p.portfolio);
if (site.protocol !== 'https:' || !/^[a-z0-9-]{1,39}$/i.test(p.username)) throw new Error('Invalid portfolio or username.');
const detail = slug => new URL('projects/' + slug + '/', site).href;
const repo = name => 'https://github.com/' + p.username + '/' + name;
const link = (href, label) => '<a href="' + esc(href) + '">' + label + '</a>';
const art = (file, alt, width) => '<img src="' + asset(file) + '" alt="' + esc(alt) + '" width="' + width + '">';
function requiredText(value) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f]/u.test(value)) throw new Error('Invalid profile text: ' + value);
}
[p.name, p.nameEn, p.affiliation, p.about, ...p.skills].forEach(requiredText);
const seen = new Set();
if (!p.projects.length) throw new Error('No works in profile.');
for (const project of p.projects) {
  const {slug,repository,title,category,description,imageAlt,caption} = project;
  if (!/^[a-z0-9-]+$/.test(slug) || seen.has(slug)) throw new Error('Invalid/duplicate work: ' + slug);
  seen.add(slug);
  if (!/^[a-z0-9][a-z0-9_.-]*$/i.test(repository)) throw new Error('Invalid repository name: ' + repository);
  [title,category,description,imageAlt].forEach(requiredText);
  if (caption !== undefined) requiredText(caption);
}
// Keep the finished page offline-readable and fail early if a gallery image was lost.
for (const file of ['cover.png', ...p.projects.map(pr => pr.slug + '.webp')]) {
  const buf = await readFile(new URL(asset(file), root));
  if (file.endsWith('.png') ? !buf.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')) :
      buf.toString('ascii',0,4) !== 'RIFF' || buf.toString('ascii',8,12) !== 'WEBP') throw new Error('Invalid image: ' + file);
}

function entry(pr, index) {
  const page = detail(pr.slug);
  const thumb = link(page, art(pr.slug + '.webp', pr.imageAlt, 148));
  const caption = pr.caption ? '<br><sub>' + esc(pr.caption) + '</sub>' : '';
  return '<tr>\n<td align="center" width="24%">' + thumb + caption + '</td>\n<td>\n' +
    '<sub>' + String(index+1).padStart(2,'0') + '　/　' + esc(pr.category) + '</sub><br>\n' +
    '<strong>' + link(page, esc(pr.title)) + '</strong><br>\n' + esc(pr.description) +
    '<br>\n' + link(repo(pr.repository), 'コードを見る ↗') + '\n</td>\n</tr>';
}

const content = [
  link(site.href, art('cover.png', p.name + ' / ' + p.nameEn + ' の制作ノート。からくり修理屋が歯車を手にした表紙。ポートフォリオへ', '100%')),
  '<p align="center">' + [link(new URL('#works', site).href,'作品を画面で見る'), link(new URL('about/',site).href,'経歴とスキル'), link('https://github.com/' + p.username + '?tab=repositories','リポジトリ一覧')].join('　·　') + '</p>',
  '<h2>制作ノート</h2>\n<p><b>' + esc(p.name) + '</b>　/　' + esc(p.affiliation) + '</p>\n<p>' + esc(p.about) + '</p>\n<p>' + p.skills.map(v=>'<code>'+esc(v)+'</code>').join(' ') + '</p>',
  '<h2>Works · 作品目録</h2>\n<p>作品名を選ぶと制作ノートへ、「コードを見る」から各リポジトリへ移動できます。</p>',
  '<table>\n' + p.projects.map(entry).join('\n') + '\n</table>',
  '<p>' + link(new URL('#message',site).href,'一緒につくりたいことを読む →') + '</p>'
].join('\n\n') + '\n';

const template = await readFile(new URL('scripts/preview-template.html',root),'utf8');
const outputs = {
  'README.md': '<!-- Generated from profile.json by scripts/generate.mjs. -->\n\n' + content,
  'preview.html': template.replace('<!-- USERNAME -->', () => esc(p.username)).replace('<!-- CONTENT -->', () => content)
};
for (const [name,value] of Object.entries(outputs)) {
  const dest = new URL(name,root);
  if (check) {
    const actual = await readFile(dest,'utf8');
    if (actual.replace(/\r\n/g,'\n') !== value.replace(/\r\n/g,'\n')) throw new Error(fileURLToPath(dest) + ' is out of date. Run npm run build.');
  } else await writeFile(dest,value,'utf8');
}
console.log((check ? 'Verified' : 'Generated') + ' README and preview, with ' + p.projects.length + ' illustrated works.');
