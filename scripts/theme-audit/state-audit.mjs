/**
 * State-distinctness audit.
 *
 * Contrast tells you whether text is readable. It does not tell you whether a
 * hover actually looks different, or whether a card is separable from the page
 * behind it. This checks both, per theme:
 *
 *   1. HOVER DEAD    - element declares a hover style but the painted result is
 *                      indistinguishable from its resting state.
 *   2. SURFACE FLAT  - element paints its own background, but that background is
 *                      indistinguishable from what is behind it AND it has no
 *                      border to give it an edge — it dissolves into the page.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..').split(path.sep).join('/') + '/';
const SCRATCH = path.join(HERE, '.work') + path.sep;


const css = fs.readFileSync(path.join(SCRATCH, 'built.css'), 'utf8');
const MODE = process.argv[2] === 'light' ? 'light' : 'dark';

/* ---- theme variables ---- */
const lightVars = {}, darkVars = {};
{
  const re = /([^{}@]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1].trim();
    if (!m[2].includes('--')) continue;
    const rootish = /(?:^|,)\s*(?::root|:host|html)\b/.test(sel) || /\.dark\b/.test(sel) || /\[data-theme/.test(sel);
    if (!rootish) continue;
    if (/:where\(/.test(sel) && !/^\s*(?::root|\.dark|\[data-theme)/.test(sel)) continue;
    const target = (/\.dark\b/.test(sel) || /\[data-theme=["']?dark/.test(sel)) ? darkVars : lightVars;
    const d = /(--[\w-]+)\s*:\s*([^;}]+)/g;
    let x;
    while ((x = d.exec(m[2]))) {
      const v = x[2].trim();
      if (/(?:lab|lch|oklab|oklch|color)\(/i.test(v)) continue;
      target[x[1]] = v;
    }
  }
}
const VARS = { ...lightVars, ...(MODE === 'dark' ? darkVars : {}) };

/* ---- rules ---- */
function splitSelectorList(selector) {
  const out = []; let depth = 0, cur = '';
  for (const ch of selector) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur); return out;
}
const PROPS = ['background-color', 'color', 'background', 'border-color', 'border-width', 'border-style', 'outline-color', 'box-shadow', 'border-top-width', 'border-left-width'];
const byClass = new Map();
{
  const re = /([^{}@]+)\{([^{}]*)\}/g;
  let m, order = 0;
  while ((m = re.exec(css))) {
    if (!m[1].trim().startsWith('.')) continue;
    const decls = {};
    for (const p of PROPS) {
      const d = new RegExp('(?:^|;)\\s*' + p + '\\s*:\\s*([^;]+)').exec(m[2]);
      if (d) decls[p] = d[1].trim();
    }
    if (!Object.keys(decls).length) continue;
    for (const sel of splitSelectorList(m[1])) {
      const s = sel.trim();
      if (!s.startsWith('.')) continue;
      const cm = /^\.((?:\\.|[^\\\s.:>+~[(])+)/.exec(s);
      if (!cm) continue;
      const cls = cm[1].replace(/\\(.)/g, '$1');
      const rest = s.slice(cm[0].length);
      const bare = rest.replace(/:where\([^)]*\)/g, '');
      const hoverOnly = /^:hover$/.test(bare.trim());
      const state = /:hover|:focus|:active|:checked|:disabled|:placeholder|::|:not\(|:has\(|\s/.test(bare);
      const dark = /:where\(\.dark/.test(rest) || /^\.dark\s/.test(s);
      if (!byClass.has(cls)) byClass.set(cls, []);
      byClass.get(cls).push({ cls, dark, state, hoverOnly, decls, order: order++ });
    }
  }
}
function stylesFor(classes, hover = false) {
  const picks = {}, cands = [];
  for (const c of classes) for (const r of byClass.get(c) || []) {
    if (r.state && !(hover && r.hoverOnly)) continue;
    if (r.dark && MODE !== 'dark') continue;
    cands.push(r);
  }
  cands.sort((a, b) => a.hoverOnly !== b.hoverOnly ? (a.hoverOnly ? 1 : -1)
    : a.dark !== b.dark ? (a.dark ? 1 : -1) : a.order - b.order);
  for (const r of cands) for (const [k, v] of Object.entries(r.decls)) picks[k] = v;
  return picks;
}

/* ---- colour ---- */
const resolve = (v, d = 0) => d > 10 || typeof v !== 'string' ? v
  : v.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (_, n, fb) => VARS[n] != null ? resolve(VARS[n], d + 1) : (fb != null ? resolve(fb.trim(), d + 1) : 'transparent'));
function parseColor(raw) {
  if (!raw) return null;
  const v = resolve(raw).trim();
  if (!v || v === 'transparent' || v === 'none') return { r: 0, g: 0, b: 0, a: 0 };
  if (/^(currentcolor|inherit)$/i.test(v)) return 'inherit';
  const mix = /^color-mix\(\s*in\s+[\w-]+\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/i.exec(v);
  if (mix) {
    const base = parseColor(mix[1]), other = parseColor(mix[3]), p = Number(mix[2]) / 100;
    if (!base || base === 'inherit') return null;
    if (!other || other === 'inherit') return { ...base, a: base.a * p };
    if (other.a === 0) return { ...base, a: base.a * p };
    return { r: base.r * p + other.r * (1 - p), g: base.g * p + other.g * (1 - p), b: base.b * p + other.b * (1 - p), a: base.a * p + other.a * (1 - p) };
  }
  let m;
  if ((m = /^#([0-9a-f]{3,8})$/i.exec(v))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  if ((m = /^rgba?\(([^)]+)\)$/i.exec(v))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    const n = p.map(x => x.endsWith('%') ? parseFloat(x) / 100 * 255 : parseFloat(x));
    return { r: n[0], g: n[1], b: n[2], a: p[3] != null ? (p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])) : 1 };
  }
  if (v === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (v === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  return null;
}
const over = (fg, bg) => !fg ? bg : fg.a >= 0.999 ? fg : !bg ? fg : (() => {
  const a = fg.a + bg.a * (1 - fg.a);
  if (!a) return { r: 0, g: 0, b: 0, a: 0 };
  return { r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a, g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a, b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a, a };
})();
const lum = c => { const f = x => { x = Math.min(255, Math.max(0, x)) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
const hex = c => c ? '#' + [c.r, c.g, c.b].map(x => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0')).join('') : 'none';
const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);

/* ---- HTML walk (elements, not text) ---- */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const SKIP = new Set(['script', 'style', 'svg', 'head', 'noscript', 'template', 'title', 'path']);
function walkElements(html, visit) {
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  const stack = [{ tag: '#root', classes: [] }];
  let m;
  while ((m = tagRe.exec(html))) {
    const [, close, tagRaw, attrs, selfClose] = m;
    const tag = tagRaw.toLowerCase();
    if (close) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === tag) { stack.length = i; break; }
      continue;
    }
    const cm = /\sclass=("([^"]*)"|'([^']*)')/.exec(attrs);
    const node = { tag, classes: (cm ? cm[2] ?? cm[3] : '').split(/\s+/).filter(Boolean) };
    if (!SKIP.has(tag) && !stack.some(s => SKIP.has(s.tag))) visit(stack, node);
    if (!VOID.has(tag) && !selfClose) stack.push(node);
  }
}

const pageBg = parseColor(VARS['--background']) || { r: 255, g: 255, b: 255, a: 1 };
function bgOf(stack, hoverAt = -1) {
  let bg = null;
  for (let i = 1; i < stack.length; i++) {
    const st = stylesFor(stack[i].classes, i === hoverAt);
    let c = parseColor(st['background-color'] ?? st['background']);
    if (!c || c === 'inherit' || c.a === 0) continue;
    bg = c.a >= 0.999 ? c : over(c, bg || pageBg);
  }
  return bg || pageBg;
}

const PAGES = fs.readdirSync(path.join(SCRATCH, 'pages')).filter(f => f.endsWith('.html'));
const deadHover = [], flatSurface = [];
const seenH = new Set(), seenF = new Set();

for (const file of PAGES) {
  const html = fs.readFileSync(path.join(SCRATCH, 'pages') + path.sep + file, 'utf8');
  const route = file.replace(/\.html$/, '').replace(/^_/, '/').replace(/_/g, '/');

  walkElements(html, (stack, node) => {
    const chain = [...stack, node];
    const self = chain.length - 1;

    /* 1. dead hover */
    const hasHover = node.classes.some(c => (byClass.get(c) || []).some(r => r.hoverOnly));
    if (hasHover) {
      const rest = bgOf(chain, -1);
      const hov = bgOf(chain, self);
      const stRest = stylesFor(node.classes, false);
      const stHov = stylesFor(node.classes, true);
      // a hover that only changes text colour, border or shadow is still distinct
      const changesInk = stRest['color'] !== stHov['color']
        || stRest['border-color'] !== stHov['border-color']
        || stRest['box-shadow'] !== stHov['box-shadow'];
      if (!changesInk && dist(rest, hov) <= 6) {
        const key = node.classes.join(' ');
        if (!seenH.has(key)) {
          seenH.add(key);
          deadHover.push({ route, bg: hex(rest), hov: hex(hov), cls: node.classes.slice(0, 12).join(' ') });
        }
      }
    }

    /* 2. surface that dissolves into what's behind it */
    const st = stylesFor(node.classes, false);
    const own = parseColor(st['background-color'] ?? st['background']);
    if (own && own !== 'inherit' && own.a > 0.02) {
      const behind = bgOf(stack, -1);
      const painted = over(own, behind);
      const hasBorder = node.classes.some(c => /^(?:dark:)?border(?:-[trblxy])?(?:-\d)?$/.test(c))
        && (() => { const bc = parseColor(st['border-color']); return bc && bc !== 'inherit' && bc.a > 0.08 && dist(bc, painted) > 10; })();
      const hasRing = node.classes.some(c => /(?:^|:)(?:ring|shadow)-/.test(c) && !/shadow-none/.test(c));
      if (!hasBorder && !hasRing && dist(painted, behind) <= 4 && ratio(painted, behind) < 1.02) {
        const key = node.classes.join(' ');
        if (!seenF.has(key) && node.classes.length > 2) {
          seenF.add(key);
          flatSurface.push({ route, bg: hex(painted), behind: hex(behind), cls: node.classes.slice(0, 12).join(' ') });
        }
      }
    }
  });
}

console.log('MODE:', MODE, '| pages:', PAGES.length);
console.log('\n=== HOVER THAT PAINTS NOTHING (' + deadHover.length + ') ===');
for (const d of deadHover.slice(0, 25)) console.log('  ' + d.route + '  ' + d.bg + ' -> ' + d.hov + '\n      ' + d.cls);
if (deadHover.length > 25) console.log('  ... +' + (deadHover.length - 25) + ' more');
console.log('\n=== SURFACE WITH NO EDGE AGAINST ITS BACKGROUND (' + flatSurface.length + ') ===');
for (const d of flatSurface.slice(0, 25)) console.log('  ' + d.route + '  ' + d.bg + ' on ' + d.behind + '\n      ' + d.cls);
if (flatSurface.length > 25) console.log('  ... +' + (flatSurface.length - 25) + ' more');
