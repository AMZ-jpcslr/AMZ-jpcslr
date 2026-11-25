// ポートフォリオ（紙・真鍮・歯車の工房ノート）に合わせたREADME用SVGを生成します。
// 色・歯車の形はポートフォリオの notebook/style.css と notebook/gears/*.svg に合わせています。
import {readFileSync} from 'node:fs';

const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const source = new URL('../assets/source/', import.meta.url);
const imageCache = new Map();
const image = name => {
  if (!imageCache.has(name)) imageCache.set(name, 'data:image/webp;base64,' + readFileSync(new URL(name, source)).toString('base64'));
  return imageCache.get(name);
};

export const themes = {
  day: {
    paper:'#f8f3e7', ink:'#3d3433', soft:'#6b605a', green:'#405a50', rust:'#985333', line:'#c9c0aa', plum:'#654e60',
    card:'#fdfaf2', blueprint:'#e4ebe1', grid:'#c9d6cb', dot:'rgba(158,145,103,.28)', chip:'#f3ecdb', track:'#e4dccb',
    nameplate:['#405a50','#6f8a76'], art:'', shadow:'rgba(61,52,51,.12)'
  },
  night: {
    paper:'#29231f', ink:'#efe6cf', soft:'#bfb3a0', green:'#b5cdb1', rust:'#f0a46c', line:'#4d4239', plum:'#c9afc2',
    card:'#322a25', blueprint:'#352d27', grid:'#4a4038', dot:'rgba(243,196,107,.12)', chip:'#3a312b', track:'#40362f',
    nameplate:['#2f4139','#4f6758'], art:' filter="url(#lamp)"', shadow:'rgba(0,0,0,.45)'
  }
};
const brass = {brass:'#cba569', light:'#ecd6a2', dark:'#6f513b', iron:'#3a322c', ivory:'#efe6cf', enamel:'#b0352a', lamp:'#f3c46b'};

const SERIF = "Georgia, 'Times New Roman', serif";
const MINCHO = "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif";
const SANS = "'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', Meiryo, sans-serif";
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";

const BRASS_GEAR = 'M76.67,27.92 L78.61,31.03 Q79.21,32.16 80.90,31.96 L88.87,29.89 Q90.15,29.58 90.44,30.25 L91.92,34.32 Q92.13,35.01 90.95,35.60 L83.51,39.15 Q82.09,40.07 82.36,41.32 L82.87,44.95 L82.99,48.61 Q82.95,49.89 84.51,50.55 L92.45,52.75 Q93.71,53.13 93.63,53.84 L92.87,58.11 Q92.71,58.82 91.39,58.74 L83.18,58.09 Q81.49,58.17 81.09,59.39 L79.72,62.79 L78.00,66.03 Q77.32,67.11 78.34,68.47 L84.12,74.34 Q85.03,75.30 84.59,75.88 L81.81,79.20 Q81.31,79.72 80.21,79.00 L73.42,74.33 Q71.91,73.56 70.96,74.41 L68.08,76.67 L64.97,78.61 Q63.84,79.21 64.04,80.90 L66.11,88.87 Q66.42,90.15 65.75,90.44 L61.68,91.92 Q60.99,92.13 60.40,90.95 L56.85,83.51 Q55.93,82.09 54.68,82.36 L51.05,82.87 L47.39,82.99 Q46.11,82.95 45.45,84.51 L43.25,92.45 Q42.87,93.71 42.16,93.63 L37.89,92.87 Q37.18,92.71 37.26,91.39 L37.91,83.18 Q37.83,81.49 36.61,81.09 L33.21,79.72 L29.97,78.00 Q28.89,77.32 27.53,78.34 L21.66,84.12 Q20.70,85.03 20.12,84.59 L16.80,81.81 Q16.28,81.31 17.00,80.21 L21.67,73.42 Q22.44,71.91 21.59,70.96 L19.33,68.08 L17.39,64.97 Q16.79,63.84 15.10,64.04 L7.13,66.11 Q5.85,66.42 5.56,65.75 L4.08,61.68 Q3.87,60.99 5.05,60.40 L12.49,56.85 Q13.91,55.93 13.64,54.68 L13.13,51.05 L13.01,47.39 Q13.05,46.11 11.49,45.45 L3.55,43.25 Q2.29,42.87 2.37,42.16 L3.13,37.89 Q3.29,37.18 4.61,37.26 L12.82,37.91 Q14.51,37.83 14.91,36.61 L16.28,33.21 L18.00,29.97 Q18.68,28.89 17.66,27.53 L11.88,21.66 Q10.97,20.70 11.41,20.12 L14.19,16.80 Q14.69,16.28 15.79,17.00 L22.58,21.67 Q24.09,22.44 25.04,21.59 L27.92,19.33 L31.03,17.39 Q32.16,16.79 31.96,15.10 L29.89,7.13 Q29.58,5.85 30.25,5.56 L34.32,4.08 Q35.01,3.87 35.60,5.05 L39.15,12.49 Q40.07,13.91 41.32,13.64 L44.95,13.13 L48.61,13.01 Q49.89,13.05 50.55,11.49 L52.75,3.55 Q53.13,2.29 53.84,2.37 L58.11,3.13 Q58.82,3.29 58.74,4.61 L58.09,12.82 Q58.17,14.51 59.39,14.91 L62.79,16.28 L66.03,18.00 Q67.11,18.68 68.47,17.66 L74.34,11.88 Q75.30,10.97 75.88,11.41 L79.20,14.19 Q79.72,14.69 79.00,15.79 L74.33,22.58 Q73.56,24.09 74.41,25.04 L76.67,27.92 Z M70.83,40.14 Q78.33,53.35 66.77,63.20 Q63.04,64.13 62.05,57.84 L59.36,52.59 Q57.31,49.64 60.24,47.57 L64.57,43.56 Q67.65,37.99 70.83,40.14 Z M43.39,71.71 Q28.20,71.59 25.45,56.65 Q26.52,52.96 32.46,55.25 L38.35,55.54 Q41.93,55.24 42.25,58.82 L43.56,64.57 Q46.85,70.02 43.39,71.71 Z M29.77,32.16 Q37.47,19.06 51.78,24.15 Q54.45,26.91 49.49,30.92 L46.30,35.87 Q44.77,39.12 41.51,37.61 L35.87,35.87 Q29.51,35.99 29.770,32.16 Z';
const GREEN_GEAR = 'M53.73,26.82 L54.61,29.99 Q54.80,31.13 56.45,31.44 L65.15,32.18 Q66.46,32.36 66.49,33.12 L66.29,37.71 Q66.19,38.47 64.87,38.53 L56.15,38.51 Q54.47,38.67 54.19,39.79 L53.03,42.87 L51.41,45.74 Q50.74,46.68 51.69,48.07 L57.31,54.73 Q58.11,55.79 57.59,56.35 L54.21,59.45 Q53.60,59.92 52.62,59.03 L46.47,52.85 Q45.17,51.78 44.18,52.37 L41.18,53.73 L38.01,54.61 Q36.87,54.80 36.56,56.45 L35.82,65.15 Q35.64,66.46 34.88,66.49 L30.29,66.29 Q29.53,66.19 29.47,64.87 L29.49,56.15 Q29.33,54.47 28.21,54.19 L25.13,53.03 L22.26,51.41 Q21.32,50.74 19.93,51.69 L13.27,57.31 Q12.21,58.11 11.65,57.59 L8.55,54.21 Q8.08,53.60 8.97,52.62 L15.15,46.47 Q16.22,45.17 15.63,44.18 L14.27,41.18 L13.39,38.01 Q13.20,36.87 11.55,36.56 L2.85,35.82 Q1.54,35.64 1.51,34.88 L1.71,30.29 Q1.81,29.53 3.13,29.47 L11.85,29.49 Q13.53,29.33 13.81,28.21 L14.97,25.13 L16.59,22.26 Q17.26,21.32 16.31,19.93 L10.69,13.27 Q9.89,12.21 10.41,11.65 L13.79,8.55 Q14.40,8.08 15.38,8.97 L21.53,15.15 Q22.83,16.22 23.82,15.63 L26.82,14.27 L29.99,13.39 Q31.13,13.20 31.44,11.55 L32.18,2.85 Q32.36,1.54 33.12,1.51 L37.71,1.71 Q38.47,1.81 38.53,3.13 L38.51,11.85 Q38.67,13.53 39.79,13.81 L42.87,14.97 L45.74,16.59 Q46.68,17.26 48.07,16.31 L54.73,10.69 Q55.79,9.89 56.35,10.41 L59.45,13.79 Q59.920,14.40 59.03,15.38 L52.85,21.53 Q51.78,22.83 52.37,23.82 L53.73,26.82 Z M48.46,34.88 Q49.59,43.93 40.91,46.73 Q38.63,46.39 39.53,42.68 L39.24,39.15 Q38.78,37.05 40.88,36.57 L44.20,35.34 Q47.19,32.96 48.46,34.88 Z M26.00,46.08 Q17.61,42.53 19.51,33.62 Q20.95,31.82 23.72,34.45 L26.92,35.96 Q28.97,36.62 28.33,38.68 L27.74,42.16 Q28.30,45.94 26.00,46.08 Z M27.53,21.03 Q34.81,15.54 41.57,21.65 Q42.42,23.79 38.75,24.87 L35.84,26.88 Q34.25,28.34 32.79,26.75 L30.06,24.49 Q26.51,23.10 27.53,21.03 Z';

// 共通の定義：紙の点描、歯車、真鍮のグラデーション、夜のランプ色フィルター、回転アニメーション
function defs(t, extra = '') {
  return '<defs>' +
    '<pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r=".9" fill="' + t.dot + '"/></pattern>' +
    '<pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="' + t.grid + '" stroke-width=".8"/></pattern>' +
    '<linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d9a2"/><stop offset=".55" stop-color="#cfa462"/><stop offset="1" stop-color="#a77b45"/></linearGradient>' +
    '<linearGradient id="brassFrame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c88d"/><stop offset=".5" stop-color="#c39556"/><stop offset="1" stop-color="#8d6537"/></linearGradient>' +
    '<symbol id="gBrass" viewBox="0 0 96 96"><path fill="#cba569" fill-rule="evenodd" stroke="#6f513b" stroke-width="1.45" stroke-linejoin="round" d="' + BRASS_GEAR + '"/><circle cx="48" cy="48" r="9.12" fill="#eddaaa" stroke="#6f513b" stroke-width="1.35"/><path d="M44.79,51.10 L51.21,44.90" stroke="#6f513b" stroke-width="1.25" stroke-linecap="round"/><circle cx="73.24" cy="31.61" r="1.65" fill="#6f513b"/></symbol>' +
    '<symbol id="gGreen" viewBox="0 0 68 68"><path fill="#788c77" fill-rule="evenodd" stroke="#405a50" stroke-width="1.45" stroke-linejoin="round" d="' + GREEN_GEAR + '"/><circle cx="34" cy="34" r="6.46" fill="#dbd9b9" stroke="#405a50" stroke-width="1.35"/><path d="M31.72,36.20 L36.28,31.80" stroke="#405a50" stroke-width="1.25" stroke-linecap="round"/><circle cx="51.76" cy="30.71" r="1.65" fill="#405a50"/></symbol>' +
    '<filter id="lamp" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".78 .12 .02 0 0  .08 .72 .05 0 0  .04 .06 .58 0 0  0 0 0 1 0"/></filter>' +
    '<filter id="soft" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="' + t.shadow + '" flood-opacity="1"/></filter>' +
    extra + '</defs>' +
    '<style>.spin{transform-box:fill-box;transform-origin:center;animation:spin var(--p,40s) linear infinite}.rev{animation-direction:reverse}' +
    '.needle{transform-box:view-box;animation:sweep 9s ease-in-out infinite alternate}' +
    '@keyframes spin{to{transform:rotate(360deg)}}@keyframes sweep{from{transform:rotate(-62deg)}to{transform:rotate(38deg)}}' +
    '@media (prefers-reduced-motion: reduce){.spin,.needle{animation:none}}</style>';
}

// 歯車：(x,y)は中心、sizeは直径
const gear = (kind, x, y, size, period, reverse = false) =>
  '<g transform="translate(' + (x - size / 2) + ' ' + (y - size / 2) + ')"><use href="#' + kind + '" width="' + size + '" height="' + size + '" class="spin' + (reverse ? ' rev' : '') + '" style="--p:' + period + 's"/></g>';

// 黒いキー帽の英字ラベル（ポートフォリオの「§ WELCOME」）
function keycaps(x, y, word, t, size = 22) {
  let out = '<text x="' + x + '" y="' + (y + size * .72) + '" font-family="' + SERIF + '" font-size="' + size * .8 + '" fill="' + t.rust + '">§</text>';
  let cx = x + size * .95;
  for (const ch of word) {
    out += '<rect x="' + cx + '" y="' + y + '" width="' + size * .82 + '" height="' + size + '" rx="3" fill="' + brass.iron + '"/>' +
      '<rect x="' + (cx + 1.5) + '" y="' + (y + 1.5) + '" width="' + (size * .82 - 3) + '" height="' + (size - 5) + '" rx="2" fill="#4a4038"/>' +
      '<text x="' + (cx + size * .41) + '" y="' + (y + size * .66) + '" text-anchor="middle" font-family="' + MONO + '" font-size="' + size * .52 + '" font-weight="700" fill="' + brass.ivory + '">' + esc(ch) + '</text>';
    cx += size * .9;
  }
  return out;
}

// 真鍮のプレート（ボタン風の札）
function plate(x, y, w, h, label, size = 18) {
  return '<g filter="url(#soft)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="url(#brass)" stroke="' + brass.dark + '" stroke-width="1.4"/></g>' +
    '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (w - 6) + '" height="' + (h - 6) + '" rx="5" fill="none" stroke="#f6e6bf" stroke-opacity=".7"/>' +
    '<use href="#gBrass" x="' + (x + 12) + '" y="' + (y + h / 2 - 11) + '" width="22" height="22"/>' +
    '<text x="' + (x + 44) + '" y="' + (y + h / 2 + size * .36) + '" font-family="' + SANS + '" font-size="' + size + '" font-weight="700" fill="' + brass.iron + '">' + esc(label) + '</text>';
}

// 点線のレールと歯車（セクションの区切り）
function rail(x1, x2, y, t) {
  return '<rect x="' + x1 + '" y="' + (y - 4) + '" width="' + (x2 - x1) + '" height="8" rx="4" fill="' + t.chip + '" stroke="' + t.line + '"/>' +
    '<path d="M' + (x1 + 8) + ' ' + y + 'H' + (x2 - 8) + '" stroke="' + t.rust + '" stroke-opacity=".55" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>';
}

// 文字幅の概算（全角1em、半角0.56em）で日本語を折り返す
function wrap(textValue, size, width, maxLines = 3) {
  const lines = []; let line = ''; let w = 0;
  for (const ch of textValue) {
    const cw = (/[\u0000-ÿ]/.test(ch) ? .56 : 1) * size;
    if (w + cw > width && line) {
      if (/[、。」）]/.test(ch)) { line += ch; lines.push(line); line = ''; w = 0; continue; }
      lines.push(line); line = ''; w = 0;
    }
    line += ch; w += cw;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…'; }
  return lines;
}
const lines = (x, y, arr, size, gap, color, family = SANS, extra = '') =>
  arr.map((l, i) => '<text x="' + x + '" y="' + (y + i * gap) + '" font-family="' + family + '" font-size="' + size + '" fill="' + color + '"' + extra + '>' + esc(l) + '</text>').join('');

const svg = (w, h, t, body, title, extraDefs = '') =>
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + esc(title) + '"><title>' + esc(title) + '</title>' +
  defs(t, extraDefs) + body + '</svg>\n';

const paper = (w, h, t, r = 18) =>
  '<rect x="1" y="1" width="' + (w - 2) + '" height="' + (h - 2) + '" rx="' + r + '" fill="' + t.paper + '" stroke="' + t.line + '" stroke-width="1.5"/>' +
  '<rect x="1" y="1" width="' + (w - 2) + '" height="' + (h - 2) + '" rx="' + r + '" fill="url(#dots)"/>';

// 方眼紙のカードとからくり修理屋のイラスト
function blueprint(x, y, w, h, t, name, scale = 1) {
  const corner = (cx, cy, sx, sy) => '<path d="M' + cx + ' ' + (cy + sy * 22) + 'V' + cy + 'H' + (cx + sx * 22) + '" fill="none" stroke="' + brass.brass + '" stroke-width="6" stroke-linecap="square"/>';
  const iw = 330 * scale, ih = iw * 1.25;
  const gx = x + w - 52 * scale, gy = y + 4 * scale;
  return '<g transform="rotate(-1.4 ' + (x + w / 2) + ' ' + (y + h / 2) + ')">' +
    '<g filter="url(#soft)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + t.blueprint + '"/></g>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#grid)"/>' +
    '<g fill="none" stroke="' + t.grid + '" stroke-width="1.2"><circle cx="' + (x + w * .66) + '" cy="' + (y + h * .52) + '" r="' + h * .42 + '"/><circle cx="' + (x + w * .66) + '" cy="' + (y + h * .52) + '" r="' + h * .26 + '" stroke-dasharray="6 6"/><path d="M' + (x + 14) + ' ' + (y + h * .52) + 'H' + (x + w - 14) + 'M' + (x + w * .66) + ' ' + (y + 14) + 'V' + (y + h - 14) + '"/></g>' +
    '<g stroke="' + t.green + '" stroke-opacity=".6" fill="none"><circle cx="' + (x + 38 * scale) + '" cy="' + (y + 70 * scale) + '" r="7"/><path d="M' + (x + 26 * scale) + ' ' + (y + 70 * scale) + 'h24M' + (x + 38 * scale) + ' ' + (y + 58 * scale) + 'v24"/></g>' +
    corner(x - 3, y - 3, 1, 1) + corner(x + w + 3, y - 3, -1, 1) + corner(x - 3, y + h + 3, 1, -1) + corner(x + w + 3, y + h + 3, -1, -1) +
    '</g>' +
    '<image href="' + image(name) + '" xlink:href="' + image(name) + '" x="' + (x + w / 2 - iw / 2) + '" y="' + (y + h - ih + 8 * scale) + '" width="' + iw + '" height="' + ih + '"' + t.art + '/>' +
    // ストップウォッチの計器
    '<g transform="translate(' + gx + ' ' + gy + ') scale(' + scale + ')"><rect x="-7" y="-46" width="14" height="10" rx="2" fill="' + brass.dark + '"/><circle r="36" fill="' + brass.dark + '"/><circle r="30" fill="' + brass.ivory + '"/>' +
    '<path d="M-21 13A24 24 0 0 1 -14 -19M-8 -23A24 24 0 0 1 22 9" fill="none" stroke="' + brass.dark + '" stroke-width="2" stroke-dasharray="1.5 4"/><path d="M12 -20A24 24 0 0 1 23 4" fill="none" stroke="' + brass.enamel + '" stroke-width="3.5"/>' +
    '<g class="needle"><path d="M0 0V-22" stroke="' + brass.iron + '" stroke-width="3" stroke-linecap="round"/></g><circle r="4" fill="' + brass.iron + '"/></g>' +
    gear('gBrass', x + 8 * scale, y + h - 6 * scale, 64 * scale, 48) + gear('gGreen', x + 50 * scale, y + h - 46 * scale, 40 * scale, 30, true);
}

function topbar(w, t, p, pad) {
  return '<use href="#gBrass" x="' + pad + '" y="26" width="34" height="34" class="spin" style="--p:60s"/>' +
    '<rect x="' + (pad + 42) + '" y="25" width="134" height="36" rx="4" fill="url(#brass)" stroke="' + brass.dark + '"/>' +
    '<text x="' + (pad + 109) + '" y="44" text-anchor="middle" font-family="' + SANS + '" font-size="15" fill="' + brass.iron + '">' + esc(p.username) + '</text>' +
    '<text x="' + (pad + 109) + '" y="56" text-anchor="middle" font-family="' + MONO + '" font-size="7" letter-spacing="2.5" fill="' + brass.dark + '">GITHUB PROFILE</text>' +
    '<text x="' + (w - pad) + '" y="48" text-anchor="end" font-family="' + MONO + '" font-size="13" letter-spacing="2.6" fill="' + t.soft + '">AMZ / PORTFOLIO · 2026</text>' +
    '<path d="M' + pad + ' 84H' + (w - pad) + '" stroke="' + t.line + '"/><path d="M' + pad + ' 84H' + (pad + 150) + '" stroke="' + t.green + '" stroke-width="3" stroke-linecap="round"/>';
}

export function hero(p, {mobile = false, theme = 'day'} = {}) {
  const t = themes[theme];
  const title = p.name + ' / ' + p.nameEn + ' — 紙と真鍮と歯車でできた、からくり修理屋の工房。';
  if (mobile) {
    const W = 640, H = 1040, pad = 34;
    return svg(W, H, t, paper(W, H, t) + topbar(W, t, p, pad) +
      keycaps(pad, 128, 'WELCOME', t, 26) +
      '<text x="' + pad + '" y="236" font-family="' + SERIF + '" font-size="66" letter-spacing="-3" fill="' + t.ink + '">Welcome to my</text>' +
      '<text x="' + pad + '" y="310" font-family="' + SERIF + '" font-style="italic" font-size="66" letter-spacing="-2.5" fill="' + t.green + '">GitHub profile.</text>' +
      '<path d="M' + (pad + 4) + ' 334C' + (pad + 150) + ' 322 ' + (pad + 330) + ' 320 ' + (pad + 420) + ' 326" fill="none" stroke="' + t.rust + '" stroke-width="3.2" stroke-linecap="round"/>' +
      lines(pad, 384, ['紙と真鍮と歯車でできた、', 'からくり修理屋の工房へようこそ。'], 24, 38, t.ink, MINCHO, ' letter-spacing="2"') +
      '<text x="' + pad + '" y="476" font-family="' + SANS + '" font-size="19" fill="' + t.soft + '">' + esc(p.name) + '　/　' + esc(p.affiliation) + '</text>' +
      blueprint(70, 548, 500, 400, t, 'working.webp', 1.02) +
      rail(pad, W - 120, 1000, t) + gear('gBrass', W - 86, 994, 46, 40) + gear('gGreen', W - 52, 986, 32, 26, true), title);
  }
  const W = 1280, H = 640, pad = 52;
  return svg(W, H, t, paper(W, H, t) + topbar(W, t, p, pad) +
    keycaps(pad + 4, 168, 'WELCOME', t, 24) +
    '<text x="' + pad + '" y="282" font-family="' + SERIF + '" font-size="84" letter-spacing="-4.5" fill="' + t.ink + '">Welcome to my</text>' +
    '<text x="' + pad + '" y="374" font-family="' + SERIF + '" font-style="italic" font-size="84" letter-spacing="-3.5" fill="' + t.green + '">GitHub profile.</text>' +
    '<path d="M' + (pad + 4) + ' 402C' + (pad + 180) + ' 388 ' + (pad + 400) + ' 386 ' + (pad + 520) + ' 393" fill="none" stroke="' + t.rust + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<text x="' + pad + '" y="456" font-family="' + MINCHO + '" font-size="21" letter-spacing="2.4" fill="' + t.ink + '">紙と真鍮と歯車でできた、からくり修理屋の工房へようこそ。</text>' +
    '<text x="' + pad + '" y="494" font-family="' + SANS + '" font-size="16" fill="' + t.soft + '">' + esc(p.name) + '　/　' + esc(p.affiliation) + '</text>' +
    plate(pad, 524, 250, 50, 'ポートフォリオへ  ↗', 17) +
    blueprint(778, 150, 424, 372, t, 'working.webp', 1) +
    rail(pad, W - 160, 600, t) + gear('gBrass', W - 120, 592, 50, 40) + gear('gGreen', W - 82, 582, 36, 26, true), title);
}

// 見出し：キー帽ラベル＋大きなセリフ体の英字＋日本語
export function heading(label, en, ja, {theme = 'day', mobile = false} = {}) {
  const t = themes[theme];
  const W = mobile ? 640 : 1280, H = mobile ? 200 : 170, pad = mobile ? 6 : 6;
  const big = mobile ? 62 : 70;
  return svg(W, H, t,
    keycaps(pad, 18, label, t, mobile ? 24 : 22) +
    '<text x="' + (pad - 3) + '" y="' + (mobile ? 118 : 116) + '" font-family="' + SERIF + '" font-size="' + big + '" letter-spacing="-2.5" fill="' + t.green + '">' + esc(en) + '</text>' +
    '<text x="' + pad + '" y="' + (mobile ? 162 : 152) + '" font-family="' + MINCHO + '" font-size="' + (mobile ? 24 : 20) + '" letter-spacing="3" fill="' + t.ink + '">' + esc(ja) + '</text>' +
    rail(W - (mobile ? 250 : 330), W - (mobile ? 92 : 104), mobile ? 120 : 104, t) +
    gear('gBrass', W - (mobile ? 64 : 74), mobile ? 112 : 96, mobile ? 44 : 44, 36) + gear('gGreen', W - (mobile ? 34 : 42), mobile ? 98 : 82, mobile ? 30 : 30, 24, true) +
    '<path d="M' + pad + ' ' + (H - 2) + 'H' + (W - pad) + '" stroke="' + t.line + '"/>',
    en + ' / ' + ja);
}

// 作品カード：真鍮の額縁に画面、番号札、分類、作品名、説明
function frame(x, y, w, h, shot) {
  const ix = x + 12, iy = y + 12, iw = w - 24, ih = h - 40;
  return '<g filter="url(#soft)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="16" fill="url(#brassFrame)" stroke="' + brass.dark + '" stroke-width="1.6"/></g>' +
    '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="13" fill="none" stroke="#f3dfae" stroke-opacity=".75"/>' +
    '<clipPath id="screen"><rect x="' + ix + '" y="' + iy + '" width="' + iw + '" height="' + ih + '" rx="9"/></clipPath>' +
    '<rect x="' + (ix - 2) + '" y="' + (iy - 2) + '" width="' + (iw + 4) + '" height="' + (ih + 4) + '" rx="10" fill="' + brass.iron + '"/>' +
    '<image href="' + shot + '" xlink:href="' + shot + '" x="' + ix + '" y="' + iy + '" width="' + iw + '" height="' + ih + '" preserveAspectRatio="xMidYMin slice" clip-path="url(#screen)"/>' +
    '<circle cx="' + (x + 22) + '" cy="' + (y + h - 14) + '" r="4" fill="' + brass.iron + '" opacity=".75"/><circle cx="' + (x + 36) + '" cy="' + (y + h - 14) + '" r="4" fill="' + brass.iron + '" opacity=".75"/>' +
    '<circle cx="' + (x + w - 22) + '" cy="' + (y + h - 16) + '" r="6" fill="' + brass.enamel + '" stroke="' + brass.iron + '" stroke-width="1.4"/>';
}

export function card(pr, index, {theme = 'day', mobile = false} = {}) {
  const t = themes[theme];
  const shot = image('work-' + pr.slug + '.webp');
  const no = 'No. ' + String(index + 1).padStart(2, '0');
  const title = no + ' ' + pr.category + ' — ' + pr.title + '：' + pr.description;
  const tag = (x, y, s) => '<rect x="' + x + '" y="' + y + '" width="' + s * 4.4 + '" height="' + s * 1.55 + '" rx="3" fill="' + brass.light + '" stroke="' + brass.dark + '" stroke-opacity=".6"/>' +
    '<text x="' + (x + s * 2.2) + '" y="' + (y + s * 1.08) + '" text-anchor="middle" font-family="' + MONO + '" font-size="' + s + '" fill="' + brass.dark + '">' + no + '</text>';
  if (mobile) {
    const W = 640, H = 640, fx = 26, fy = 26, fw = 588, fh = 360;
    const desc = wrap(pr.description, 25, 560, 2);
    return svg(W, H, t,
      '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="22" fill="' + t.card + '" stroke="' + t.line + '" stroke-width="1.5"/>' +
      frame(fx, fy, fw, fh, shot) + tag(30, 418, 18) +
      '<text x="120" y="437" font-family="' + SANS + '" font-size="20" fill="' + t.soft + '">' + esc(pr.category) + '</text>' +
      '<text x="' + (W - 36) + '" y="440" text-anchor="end" font-family="' + SANS + '" font-size="28" fill="' + t.rust + '">↗</text>' +
      '<text x="30" y="494" font-family="' + SANS + '" font-size="34" font-weight="700" fill="' + t.ink + '">' + esc(pr.title) + '</text>' +
      lines(30, 548, desc, 25, 40, t.ink), title);
  }
  const W = 1280, H = 300;
  const desc = wrap(pr.description, 23, 800, 2);
  return svg(W, H, t,
    '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="20" fill="' + t.card + '" stroke="' + t.line + '" stroke-width="1.5"/>' +
    frame(22, 22, 370, 256, shot) + tag(440, 58, 17) +
    '<text x="527" y="76" font-family="' + SANS + '" font-size="19" fill="' + t.soft + '">' + esc(pr.category) + '</text>' +
    '<text x="' + (W - 44) + '" y="80" text-anchor="end" font-family="' + SANS + '" font-size="28" fill="' + t.rust + '">↗</text>' +
    '<text x="440" y="140" font-family="' + SANS + '" font-size="36" font-weight="700" fill="' + t.ink + '">' + esc(pr.title) + '</text>' +
    lines(440, 196, desc, 23, 38, t.ink) +
    '<path d="M440 252H' + (W - 44) + '" stroke="' + t.line + '" stroke-dasharray="2 6" stroke-linecap="round"/>', title);
}

// About Me：名前札（イラスト付き）とツール使用歴・スキル
export function about(p, {theme = 'day', mobile = false} = {}) {
  const t = themes[theme];
  const title = p.nameEn + ' / ' + p.name + '（' + p.affiliation + '）。ツール使用歴：' + p.tools.map(x => x.name + ' ' + x.label).join('、') + '。スキル：' + p.skills.join('、') + '。';
  const nameplate = (x, y, w, h, s) =>
    '<linearGradient id="np" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t.nameplate[0] + '"/><stop offset="1" stop-color="' + t.nameplate[1] + '"/></linearGradient>' +
    '<g filter="url(#soft)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="url(#np)"/></g>' +
    '<text font-family="' + SERIF + '" font-size="' + 70 * s + '" fill="' + brass.ivory + '" letter-spacing="-1"><tspan x="' + (x + 30 * s) + '" y="' + (y + 96 * s) + '">' + esc(p.nameEn.split(' ')[0]) + '</tspan><tspan x="' + (x + 30 * s) + '" y="' + (y + 172 * s) + '">' + esc(p.nameEn.split(' ').slice(1).join(' ')) + '</tspan></text>' +
    '<text x="' + (x + 32 * s) + '" y="' + (y + h - 62 * s) + '" font-family="' + MINCHO + '" font-size="' + 24 * s + '" letter-spacing="4" fill="' + brass.ivory + '">' + esc(p.name) + '</text>' +
    '<text x="' + (x + 32 * s) + '" y="' + (y + h - 30 * s) + '" font-family="' + SANS + '" font-size="' + 15 * s + '" fill="' + brass.ivory + '" fill-opacity=".9">' + esc(p.affiliation) + '</text>' +
    '<image href="' + image('guide.webp') + '" xlink:href="' + image('guide.webp') + '" x="' + (x + w - 250 * s) + '" y="' + (y + h - 250 * s) + '" width="' + 260 * s + '" height="' + 250 * s + '"' + t.art + '/>';
  const max = Math.max(...p.tools.map(x => x.months));
  const tools = (x, y, w, s) => {
    let out = '<text x="' + x + '" y="' + y + '" font-family="' + MINCHO + '" font-size="' + 24 * s + '" letter-spacing="3" fill="' + t.green + '">ツール使用歴</text><path d="M' + x + ' ' + (y + 16 * s) + 'H' + (x + w) + '" stroke="' + t.line + '"/>';
    p.tools.forEach((tool, i) => {
      const ty = y + 54 * s + i * 42 * s, ratio = Math.max(.05, tool.months / max);
      out += '<text x="' + x + '" y="' + ty + '" font-family="' + SANS + '" font-size="' + 17 * s + '" fill="' + t.ink + '">' + esc(tool.name) + '</text>' +
        '<text x="' + (x + w) + '" y="' + ty + '" text-anchor="end" font-family="' + SANS + '" font-size="' + 15 * s + '" fill="' + t.soft + '">' + esc(tool.label) + '</text>' +
        '<rect x="' + x + '" y="' + (ty + 9 * s) + '" width="' + w + '" height="' + 5 * s + '" rx="2" fill="' + t.track + '"/>' +
        '<rect x="' + x + '" y="' + (ty + 9 * s) + '" width="' + (w * ratio).toFixed(1) + '" height="' + 5 * s + '" rx="2" fill="' + (theme === 'day' ? '#788c77' : brass.brass) + '"/>';
    });
    const sy = y + 54 * s + p.tools.length * 42 * s + 18 * s;
    out += '<text x="' + x + '" y="' + sy + '" font-family="' + MINCHO + '" font-size="' + 24 * s + '" letter-spacing="3" fill="' + t.green + '">スキル</text>';
    let cx = x;
    for (const skill of p.skills) {
      const cw = [...skill].reduce((a, ch) => a + (/[\u0000-ÿ]/.test(ch) ? .6 : 1), 0) * 16 * s + 30 * s;
      out += '<rect x="' + cx + '" y="' + (sy + 18 * s) + '" width="' + cw + '" height="' + 36 * s + '" rx="3" fill="' + t.chip + '" stroke="' + t.line + '"/>' +
        '<text x="' + (cx + cw / 2) + '" y="' + (sy + 42 * s) + '" text-anchor="middle" font-family="' + SANS + '" font-size="' + 16 * s + '" fill="' + t.ink + '">' + esc(skill) + '</text>';
      cx += cw + 10 * s;
    }
    return out;
  };
  if (mobile) {
    const W = 640, H = 1000;
    return svg(W, H, t, paper(W, H, t, 22) + nameplate(30, 30, 580, 380, 1.15) + tools(40, 482, 560, 1.2), title);
  }
  const W = 1280, H = 520;
  return svg(W, H, t, paper(W, H, t, 20) + nameplate(40, 40, 600, 440, 1.15) + tools(690, 76, 550, 1), title);
}

export function divider({theme = 'day'} = {}) {
  const t = themes[theme];
  const W = 1280, H = 70;
  return svg(W, H, t, rail(30, W - 150, 38, t) + gear('gBrass', W - 112, 32, 48, 40) + gear('gGreen', W - 72, 22, 34, 26, true) + gear('gBrass', W - 40, 46, 26, 22, true), '歯車とレールの区切り');
}
