import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(a => a !== '--check')) throw new Error('Use --check or no arguments.');
const p = JSON.parse(await readFile(path.join(root, 'profile.json'), 'utf8'));
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const font = "'Yu Gothic','Meiryo',sans-serif";
const serif = "'Yu Mincho','Hiragino Mincho ProN',serif";
const colors = ['#f3dfa0','#c7d1b5','#dec6b8','#c8d9dc','#d6c9dd','#ddd9b5'];
function text(x,y,value,size=18,fill='#24362c',extra='') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${e(value)}</text>`;
}
function svg(w,h,title,content,style='') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${e(title)}</title>${style}<g font-family="${font}">${content}</g></svg>\n`;
}
function validate() {
  if (!/^[a-z\d-]{1,39}$/i.test(p.username)) throw new Error('Invalid username');
  if (new URL(p.portfolio).protocol !== 'https:') throw new Error('Use an HTTPS portfolio');
  for (const key of ['name','nameEn','tagline','about']) if (typeof p[key] !== 'string' || !p[key].trim() || /[\u0000-\u001f\ufffd]/.test(p[key])) throw new Error(`Invalid ${key}`);
  if (p.focus.length !== 3 || p.focus.some(s => [...s].length > 10)) throw new Error('Use three short focus labels');
  if (!p.projects.length || p.projects.length > 8) throw new Error('Expected 1–8 projects');
  const slugs = new Set();
  for (const item of p.projects) {
    if (!/^[a-z\d-]+$/.test(item.slug) || slugs.has(item.slug)) throw new Error('Invalid/duplicate slug');
    slugs.add(item.slug);
    if (!/^[a-z\d_.-]+$/i.test(item.repository) || /^\.{1,2}$/.test(item.repository)) throw new Error('Invalid repository');
    if (!/^#[a-f\d]{6}$/i.test(item.color)) throw new Error('Invalid color');
    for (const key of ['title','description','category','status']) if (!item[key] || /[\u0000-\u001f\ufffd]/.test(item[key])) throw new Error(`Invalid project ${key}`);
    if (item.title.length > 36 || item.tags.some(s => s.length > 24)) throw new Error('Project label too long');
  }
}
validate();

function note(x,y,w,label,fill,angle=0) {
  return `<g transform="translate(${x} ${y}) rotate(${angle} ${w/2} 25)"><path d="M3 4H${w+3}V50L${w-9} 62H3Z" fill="#000" opacity=".13"/><path d="M0 0H${w}V48L${w-12} 60H0Z" fill="${fill}"/><path d="M0 0H${w}V9H0Z" fill="#665331" opacity=".07"/><path d="M${w-12} 60V48H${w}" fill="#000" opacity=".09"/>${text(w<150?10:16,37,label,w<150?13:17)}</g>`;
}
function hero(mobile=false,motion=false) {
  const w=mobile?480:880, h=mobile?492:362;
  const pageW=w-48;
  const paperH=mobile?370:284;
  let content=`<rect width="${w}" height="${h}" rx="4" fill="#151c19"/>`;
  content+=text(26,34,'amz.',25,'#f5f0e4',`font-family="Georgia,serif"`);
  content+=text(w-26,31,'NOTES & WORKS',12,'#d8bb85','text-anchor="end" letter-spacing="2"');
  content+=`<rect x="29" y="65" width="${pageW}" height="${paperH}" fill="#8b8065"/><rect x="24" y="59" width="${pageW}" height="${paperH}" fill="#f5f0e4"/>`;
  for(let y=102;y<59+paperH;y+=28) content+=`<path d="M41 ${y}H${w-38}" stroke="#d9d9c9" stroke-width=".8"/>`;
  content+=`<path d="M65 59V${59+paperH}" stroke="#c89282" opacity=".55"/>`;
  for(let y=88;y<59+paperH-10;y+=36) content+=`<ellipse cx="35" cy="${y}" rx="4" ry="3" fill="#b7b29e"/><path d="M16 ${y}q23 -15 24 0" fill="none" stroke="#969c8c" stroke-width="2"/>`;
  content+=text(83,100,'PROFILE / 01',11,'#62705d','letter-spacing="2"');
  content+=text(82,155,p.name,mobile?35:43,'#202d27',`font-family="${serif}" font-weight="600"`);
  content+=text(84,185,`${p.nameEn} / ${p.alias}`,14,'#52614f');
  content+=text(83,238,mobile?'身近な課題から、':p.tagline,mobile?25:28,'#202d27',`font-family="${serif}"`);
  if(mobile) content+=text(83,272,'使えるものを。',25,'#202d27',`font-family="${serif}"`);
  content+=text(84,mobile?317:277,'個人開発と研究の記録。',14,'#52614f');
  content+=text(84,mobile?349:307,'@'+p.username,12,'#52614f');
  p.focus.forEach((label,i)=>{
    const item=mobile?note(42+i*139,395,128,label,colors[i],[-2,1,-1][i]):note(610,102+i*73,207,label,colors[i],[-2,1,-1][i]);
    content+=motion?`<g class="note-entry note-${i}">${item}</g>`:item;
  });
  // A few understated cloth-bound books establish the shared portfolio motif.
  if(mobile) content+=text(454,476,'AMZ / GITHUB',10,'#bbc5bb','text-anchor="end" letter-spacing="1"');
  else {content+=`<path d="M83 334H547" stroke="#a39170" stroke-width="3"/>`; content+=text(852,355,'AMZ / GITHUB',10,'#bbc5bb','text-anchor="end" letter-spacing="1"');}
  // SVG images can animate declaratively without scripts or README CSS.
  // Final positions are the base state: ignored styles still show the complete design.
  const style=motion?`<style>@media (prefers-reduced-motion:no-preference){.note-entry{animation:note-land .9s cubic-bezier(.2,.7,.3,1) backwards}.note-1{animation-delay:.15s}.note-2{animation-delay:.3s}@keyframes note-land{0%{transform:translateY(-12px);opacity:.45}75%{transform:translateY(1px);opacity:1}100%{transform:none;opacity:1}}}</style>`:'';
  return svg(w,h,`${p.name} / ${p.tagline} 個人開発と研究の記録。`,content,style);
}
function book(project,index,mobile=false) {
  const w=mobile?480:880,h=mobile?108:88;
  const titleSize=mobile?Math.min(23,Math.floor(390/(project.title.length*.57))):28;
  return svg(w,h,`${String(index+1).padStart(2,'0')} ${project.title} / ${project.status}`,
    `<rect x="5" y="8" width="${w-10}" height="${h-13}" rx="6" fill="#574d3c"/><rect x="0" y="1" width="${w-5}" height="${h-13}" rx="6" fill="${project.color}"/><path d="M11 6V${h-17}M17 6V${h-17}" stroke="#796344" opacity=".45"/><path d="M2 4H${w-12}" stroke="#fff" opacity=".45"/><path d="M27 5V${h-17}" stroke="#000" opacity=".07"/>`
    +text(42,27,`${String(index+1).padStart(2,'0')} / ${project.category}`,11,'#465240')
    +text(41,mobile?62:59,project.title,titleSize,'#24362c',`font-family="${serif}" font-weight="600"`)
    +text(mobile?42:w-32,mobile?85:32,project.status,11,'#465240',mobile?'':'text-anchor="end"'));
}
function badge(label,i) {
  const w=Math.ceil(label.length*8.5+36);
  return svg(w,38,label,`<path d="M2 3H${w}V30L${w-8} 37H2Z" fill="#000" opacity=".14"/><path d="M0 0H${w-2}V28L${w-10} 35H0Z" fill="${colors[i%colors.length]}"/><path d="M0 0H${w-2}V6H0" fill="#000" opacity=".04"/>${text(13,24,label,14)}`);
}
function picture(stem,alt) {
  const motion=stem==='notebook'?`\n  <source media="(prefers-reduced-motion: no-preference) and (max-width: 540px)" srcset="assets/notebook-motion-mobile.svg">\n  <source media="(prefers-reduced-motion: no-preference)" srcset="assets/notebook-motion.svg">`:'';
  return `<picture>${motion}\n  <source media="(max-width: 540px)" srcset="assets/${stem}-mobile.svg">\n  <img src="assets/${stem}.svg" alt="${e(alt)}" width="100%">\n</picture>`;
}
const repository = item => `https://github.com/${p.username}/${item.repository}`;
const detail = item => `${p.portfolio}projects/${item.slug}/`;
const content = `${picture('notebook',`${p.name} / ${p.tagline} 個人開発と研究の記録。`)}

<p align="center"><a href="${e(p.portfolio)}"><b>ポートフォリオ ↗</b></a> &nbsp; · &nbsp; <a href="https://github.com/${p.username}?tab=repositories">リポジトリ一覧 ↗</a></p>

<h2>自己紹介</h2>
<p>${e(p.about)}</p>

<h2>使っている技術</h2>
<p>${p.skills.map((s,i)=>`<img src="assets/tool-${i+1}.svg" alt="${e(s)}" height="38">`).join('\n')}</p>

<h2>つくったもの</h2>
<p>つくった理由や工夫は、ポートフォリオの各作品ページにまとめています。</p>

${p.projects.map((item,i)=>`<h3><a href="${e(detail(item))}">${picture(`book-${item.slug}`,`${item.title} — ${item.status}`)}</a></h3>
<p>${e(item.description)}</p>
<p>${item.tags.map(t=>`<code>${e(t)}</code>`).join(' ')}<br>
<a href="${e(detail(item))}">詳しく読む ↗</a> &nbsp; · &nbsp; <a href="${e(repository(item))}">コードを見る ↗</a></p>`).join('\n\n')}

<h2>大切にしていること</h2>
<ul>
<li><b>課題を理解する。</b> 誰が、どんな場面で使うのかを考えます。</li>
<li><b>試して改善する。</b> 小さく形にして、使う人の声を次の改善につなげます。</li>
<li><b>伝わる形にする。</b> 必要な情報を見つけやすくし、迷わず判断できるようにします。</li>
</ul>

<hr>
<p align="center"><sub>つくったものと、その過程を少しずつ記録しています。</sub><br><a href="${e(p.portfolio)}">AMZ — Notes & Works ↗</a></p>
`;

function preview() {
  // The article is the exact README HTML. Its layout deliberately follows GitHub:
  // no CSS grid, sticky positioning, or responsive table transformations.
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AMZ / GitHub README preview</title><style>
:root{color-scheme:light;--bg:#fff;--fg:#1f2328;--line:#d1d9e0;--subtle:#f6f8fa;--link:#0969da;--muted:#59636e}
:root[data-theme="dark"]{color-scheme:dark;--bg:#0d1117;--fg:#f0f6fc;--line:#3d444d;--subtle:#151b23;--link:#4493f8;--muted:#9198a1}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Yu Gothic",Meiryo,sans-serif}header{padding:14px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;flex-wrap:wrap;gap:10px;color:var(--muted);font-size:12px}header span{margin-right:auto}button{font:inherit;border:1px solid var(--line);background:var(--subtle);color:var(--fg);padding:6px 12px;border-radius:6px;cursor:pointer}button[aria-pressed="true"]{border-color:var(--link)}main{max-width:1012px;margin:24px auto;padding:0 24px 40px}.repo{border:1px solid var(--line);border-bottom:0;padding:14px 24px;border-radius:6px 6px 0 0;font-size:13px}.markdown-body{padding:32px;border:1px solid var(--line);border-radius:0 0 6px 6px;overflow-wrap:break-word;min-width:0}.markdown-body img{max-width:100%;vertical-align:middle;box-sizing:content-box}.markdown-body>picture{display:block}.markdown-body a{color:var(--link);text-decoration:none}.markdown-body a:hover{text-decoration:underline}.markdown-body p,.markdown-body ul{margin-top:0;margin-bottom:16px}.markdown-body>p[align]{margin-top:20px}.markdown-body h2{margin:24px 0 16px;font-size:1.5em;line-height:1.25;padding-bottom:.3em;border-bottom:1px solid var(--line)}.markdown-body h3{margin:24px 0 16px;line-height:1.25;font-size:1.25em}.markdown-body code{padding:.2em .4em;background:var(--subtle);font:85% Consolas,monospace;border-radius:6px}.markdown-body hr{border:0;height:1px;margin:24px 0;background:var(--line)}li+li{margin-top:.25em}sub{font-size:12px}a:focus-visible,button:focus-visible{outline:2px solid var(--link);outline-offset:4px}
@media(max-width:540px){main{padding:0 12px;margin:16px auto}.markdown-body{padding:16px}.repo{padding:12px 16px}header{padding:12px}header span{width:100%}}
</style></head><body><header><span>README プレビュー · GitHubに近い表示 / 実際のGitHubとは余白などが異なる場合があります</span><button data-theme="light" aria-pressed="true">Light</button><button data-theme="dark" aria-pressed="false">Dark</button></header><main><div class="repo">${p.username} / README.md</div><article class="markdown-body">${content}</article></main><script>document.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.theme;document.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));</script></body></html>\n`;
}
const outputs=new Map([
  ['README.md','<!-- Generated by scripts/generate.mjs. Edit profile.json, then run npm run build. -->\n\n'+content],
  ['preview.html',preview()],['assets/notebook.svg',hero()],['assets/notebook-mobile.svg',hero(true)],
  ['assets/notebook-motion.svg',hero(false,true)],['assets/notebook-motion-mobile.svg',hero(true,true)]
]);
p.projects.forEach((item,i)=>{outputs.set(`assets/book-${item.slug}.svg`,book(item,i));outputs.set(`assets/book-${item.slug}-mobile.svg`,book(item,i,true));});
p.skills.forEach((label,i)=>outputs.set(`assets/tool-${i+1}.svg`,badge(label,i)));
const stale=[];
for(const [name,value] of outputs){
  const target=path.join(root,name);
  if(check){if(await readFile(target,'utf8').catch(()=>null)!==value)stale.push(name);}
  else{await mkdir(path.dirname(target),{recursive:true});await writeFile(target,value,'utf8');}
}
if(stale.length){console.error('Out of date: '+stale.join(', '));process.exitCode=1;}
else console.log(`${check?'Verified':'Generated'} ${outputs.size} files. No dependencies or network required.`);
