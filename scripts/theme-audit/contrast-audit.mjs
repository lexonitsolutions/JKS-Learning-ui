/**
 * Static dark-mode contrast audit.
 *
 * Parses the compiled Tailwind CSS, then walks the server-rendered HTML of every
 * route and resolves each text node's effective foreground/background the way the
 * browser would: class rules in source order, the `dark` variant applied, alpha
 * composited against the nearest opaque ancestor background.
 *
 * Reports text that lands under the WCAG AA threshold for its size.
 */
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..').split(path.sep).join('/') + '/';
const SCRATCH = path.join(HERE, '.work') + path.sep;


const css = fs.readFileSync(path.join(SCRATCH, 'built.css'), 'utf8');
const MODE = process.argv[2] === 'light' ? 'light' : 'dark';
const FILTER = (process.argv[3] || '').replace('hover', '');
const HOVER = process.argv.includes('hover');

/* ------------------------------------------------------------------ */
/* 1. CSS variables (:root and .dark)                                  */
/* ------------------------------------------------------------------ */
// Tailwind emits a hex value plus an @supports-guarded lab()/oklch() twin for
// the same custom property. Only the hex form is worth parsing — they are the
// same colour, and the hex one is what every parser here understands.
function isExoticColor(v) {
  return /\b(?:lab|lch|oklab|oklch|color)\(/i.test(v);
}

const lightVars = {};
const darkVars = {};
{
  const blockRe = /([^{}@]+)\{([^{}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const sel = m[1].trim();
    const body = m[2];
    if (!body.includes('--')) continue;
    const isRootish = /(^|,)\s*(:root|:host|html)\b/.test(sel) || /\.dark\b/.test(sel) || /\[data-theme/.test(sel);
    if (!isRootish) continue;
    // a :where(.dark, .dark *) utility selector is not a theme block
    if (/:where\(/.test(sel) && !/^\s*(?::root|\.dark|\[data-theme)/.test(sel)) continue;
    const target = (/\.dark\b/.test(sel) || /\[data-theme=["']?dark/.test(sel)) ? darkVars : lightVars;
    const dre = /(--[\w-]+)\s*:\s*([^;}]+)/g;
    let d;
    while ((d = dre.exec(body))) {
      const name = d[1], val = d[2].trim();
      if (isExoticColor(val) && target[name] != null) continue;
      if (isExoticColor(val) && !/^var\(/.test(val)) continue;
      target[name] = val;
    }
  }
}

const VARS = { ...lightVars, ...(MODE === 'dark' ? darkVars : {}) };

/* ------------------------------------------------------------------ */
/* 2. Class rules                                                      */
/* ------------------------------------------------------------------ */
// Strip at-rule wrappers we don't simulate (media/supports keep their inner rules).
const PROPS = ['background-color', 'color', 'background', 'background-image', 'opacity'];

/**
 * Split a selector list on top-level commas only. `:where(.dark, .dark *)`
 * carries its own comma, and splitting naively shreds every dark: utility into
 * fragments that then get mis-classified as resting styles.
 */
function splitSelectorList(selector) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of selector) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** rules: [{cls, dark, state, decls:{prop:value}, order}] */
const rules = [];
let order = 0;
// naive but adequate rule splitter: selector { decls }
const ruleRe = /([^{}@]+)\{([^{}]*)\}/g;
let rm;
while ((rm = ruleRe.exec(css))) {
  const selector = rm[1].trim();
  const body = rm[2];
  if (!selector.startsWith('.')) continue;
  const decls = {};
  for (const p of PROPS) {
    const d = new RegExp('(?:^|;)\\s*' + p + '\\s*:\\s*([^;]+)').exec(body);
    if (d) decls[p] = d[1].trim();
  }
  if (!Object.keys(decls).length) continue;

  for (const sel of splitSelectorList(selector)) {
    const s = sel.trim();
    if (!s.startsWith('.')) continue;
    // class name = leading escaped-class token
    const cm = /^\.((?:\\.|[^\\\s.:>+~[(])+)/.exec(s);
    if (!cm) continue;
    const cls = cm[1].replace(/\\(.)/g, '$1');
    const rest = s.slice(cm[0].length);
    const isDark = /:where\(\.dark/.test(rest) || /^\.dark\s/.test(s);
    const bare = rest.replace(/:where\([^)]*\)/g, '');
    // a plain `.cls:hover` (optionally dark-scoped) is the hover style we simulate
    const hoverOnly = /^:hover$/.test(bare.trim());
    // other interactive / structural states are not the resting style either
    const state = /:hover|:focus|:active|:checked|:disabled|:placeholder|::|:not\(|:has\(|\s/.test(bare);
    rules.push({ cls, dark: isDark, state, hoverOnly, decls, order: order++ });
  }
}

const byClass = new Map();
for (const r of rules) {
  if (!byClass.has(r.cls)) byClass.set(r.cls, []);
  byClass.get(r.cls).push(r);
}

/* ------------------------------------------------------------------ */
/* 3. Colour resolution                                                */
/* ------------------------------------------------------------------ */
function resolveVar(v, depth = 0) {
  if (depth > 10 || typeof v !== 'string') return v;
  return v.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (_, name, fb) => {
    if (VARS[name] != null) return resolveVar(VARS[name], depth + 1);
    return fb != null ? resolveVar(fb.trim(), depth + 1) : 'transparent';
  });
}

function parseColor(raw) {
  if (!raw) return null;
  let v = resolveVar(raw).trim();
  if (!v || v === 'transparent' || v === 'none') return { r: 0, g: 0, b: 0, a: 0 };
  if (v === 'currentcolor' || v === 'inherit' || v === 'currentColor') return 'inherit';

  // color-mix(in <space>, <color> <pct>%, transparent)
  const mix = /^color-mix\(\s*in\s+[\w-]+\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/i.exec(v);
  if (mix) {
    const base = parseColor(mix[1]);
    const other = parseColor(mix[3]);
    const p = Number(mix[2]) / 100;
    if (!base || base === 'inherit') return null;
    if (other && other !== 'inherit' && other.a === 0) return { ...base, a: base.a * p };
    if (other && other !== 'inherit') {
      return {
        r: base.r * p + other.r * (1 - p),
        g: base.g * p + other.g * (1 - p),
        b: base.b * p + other.b * (1 - p),
        a: base.a * p + other.a * (1 - p),
      };
    }
    return { ...base, a: base.a * p };
  }
  let m;
  if ((m = /^#([0-9a-f]{3,8})$/i.exec(v))) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a };
  }
  if ((m = /^rgba?\(([^)]+)\)$/i.exec(v))) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    const n = parts.map((x) => (x.endsWith('%') ? (parseFloat(x) / 100) * 255 : parseFloat(x)));
    return { r: n[0], g: n[1], b: n[2], a: parts[3] != null ? (parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1 };
  }
  if ((m = /^oklab\(([^)]+)\)$/i.exec(v))) return null; // not simulated
  const NAMED = { white: [255, 255, 255], black: [0, 0, 0] };
  if (NAMED[v]) return { r: NAMED[v][0], g: NAMED[v][1], b: NAMED[v][2], a: 1 };
  return null;
}

function over(fg, bg) {
  if (!fg) return bg;
  if (fg.a >= 0.999) return fg;
  if (!bg) return fg;
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}
function lum(c) {
  const f = (x) => {
    x = Math.min(255, Math.max(0, x)) / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}
function ratio(a, b) {
  const l1 = lum(a), l2 = lum(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}
const hex = (c) => c ? '#' + [c.r, c.g, c.b].map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0')).join('') + (c.a < 0.999 ? '@' + c.a.toFixed(2) : '') : 'none';

/**
 * Effective declarations for a class list, honouring source order + dark.
 * With `hover` the element's own `:hover` rules are layered on top, which is
 * how the browser paints a pointer-over row / nav item / button.
 */
function stylesFor(classes, hover = false) {
  const picks = {};
  const cands = [];
  for (const c of classes) {
    for (const r of byClass.get(c) || []) {
      if (r.state && !(hover && r.hoverOnly)) continue;
      if (r.dark && MODE !== 'dark') continue;
      cands.push(r);
    }
  }
  // resting first, then hover; dark variants win over their base (emitted later)
  cands.sort((a, b) => {
    if (a.hoverOnly !== b.hoverOnly) return a.hoverOnly ? 1 : -1;
    if (a.dark !== b.dark) return a.dark ? 1 : -1;
    return a.order - b.order;
  });
  for (const r of cands) for (const [k, v] of Object.entries(r.decls)) picks[k] = v;
  return picks;
}

/* ------------------------------------------------------------------ */
/* 4. Minimal HTML walker                                              */
/* ------------------------------------------------------------------ */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const SKIP = new Set(['script', 'style', 'svg', 'head', 'noscript', 'template', 'title']);

function walk(html, visit) {
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  const stack = [{ tag: '#root', classes: [], style: '' }];
  let last = 0, m;
  while ((m = tagRe.exec(html))) {
    const text = html.slice(last, m.index);
    last = tagRe.lastIndex;
    if (text.trim() && !stack.some((s) => SKIP.has(s.tag))) {
      visit(stack, text.replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim());
    }
    const [, close, tagRaw, attrs, selfClose] = m;
    const tag = tagRaw.toLowerCase();
    if (close) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
    } else if (!VOID.has(tag) && !selfClose) {
      const cm = /\sclass=("([^"]*)"|'([^']*)')/.exec(attrs);
      const sm = /\sstyle=("([^"]*)"|'([^']*)')/.exec(attrs);
      stack.push({
        tag,
        classes: (cm ? cm[2] ?? cm[3] : '').split(/\s+/).filter(Boolean),
        style: sm ? sm[2] ?? sm[3] : '',
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* 5. Audit                                                            */
/* ------------------------------------------------------------------ */
if (process.env.DEBUG_TOKENS) {
  console.log('vars --foreground =', JSON.stringify(VARS['--foreground']), '->', JSON.stringify(parseColor(VARS['--foreground'])));
  console.log('vars --background =', JSON.stringify(VARS['--background']));
  console.log('lightVars count', Object.keys(lightVars).length, 'darkVars count', Object.keys(darkVars).length);
  console.log('text-slate-900 rules:', JSON.stringify(byClass.get('text-slate-900')));
  console.log('dark:text-white rules:', JSON.stringify(byClass.get('dark:text-white')));
  console.log('stylesFor([text-slate-900, dark:text-white]) =', JSON.stringify(stylesFor(['text-slate-900','dark:text-white'])));
  process.exit(0);
}
const PAGES = fs.readdirSync(path.join(SCRATCH, 'pages')).filter((f) => f.endsWith('.html'));
const pageBg = parseColor(VARS['--background']) || { r: 255, g: 255, b: 255, a: 1 };

// font-size utilities so we can apply the correct AA threshold
function fontPx(classes) {
  let px = 16, bold = false;
  for (const c of classes) {
    const base = c.includes(':') ? c.slice(c.lastIndexOf(':') + 1) : c;
    let m;
    if ((m = /^text-\[(\d+(?:\.\d+)?)px\]$/.exec(base))) px = Number(m[1]);
    else if (base === 'text-xs') px = 12;
    else if (base === 'text-sm') px = 14;
    else if (base === 'text-base') px = 16;
    else if (base === 'text-lg') px = 18;
    else if (base === 'text-xl') px = 20;
    else if (/^text-(?:2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(base)) px = 24;
    else if (base === 'text-label') px = 13;
    else if (/^text-(?:h1|h2|h3|display)$/.test(base)) px = 24;
    if (/^font-(?:bold|extrabold|black|semibold)$/.test(base)) bold = true;
  }
  return { px, bold };
}
const threshold = (px, bold) => (px >= 24 || (bold && px >= 18.66) ? 3.0 : 4.5);

const findings = [];
for (const file of PAGES) {
  if (FILTER && !file.includes(FILTER)) continue;
  const html = fs.readFileSync(path.join(SCRATCH, 'pages') + path.sep + file, 'utf8');
  const route = file.replace(/\.html$/, '').replace(/^_/, '/').replace(/_/g, '/');
  const seen = new Set();

  walk(html, (stack, text) => {
    if (text.length < 2) return;

    // Which ancestors define a hover style at all? Only those get the hover pass.
    const hoverDepths = new Set();
    for (let i = 1; i < stack.length; i++) {
      if (stack[i].classes.some((c) => (byClass.get(c) || []).some((r) => r.hoverOnly))) hoverDepths.add(i);
    }
    const passes = HOVER ? (hoverDepths.size ? [true] : []) : [false];

    for (const hoverPass of passes) {
      const stFor = (i) => stylesFor(stack[i].classes, hoverPass && hoverDepths.has(i));

      // resolve background by walking up to the nearest opaque layer
      let bg = null;
      for (let i = 1; i < stack.length; i++) {
        const st = stFor(i);
        const inline = /background(?:-color)?\s*:\s*([^;]+)/.exec(stack[i].style);
        let c = parseColor(inline ? inline[1] : st['background-color'] ?? st['background']);
        if (c === 'inherit' || !c) continue;
        if (c.a === 0) continue;
        bg = c.a >= 0.999 ? c : over(c, bg || pageBg);
      }
      bg = bg || pageBg;

      // resolve colour: nearest ancestor that sets one
      let fg = null;
      for (let i = 1; i < stack.length; i++) {
        const st = stFor(i);
        const inline = /(?:^|;)\s*color\s*:\s*([^;]+)/.exec(stack[i].style);
        const c = parseColor(inline ? inline[1] : st['color']);
        if (c && c !== 'inherit') fg = c;
      }
      if (!fg) fg = parseColor(VARS['--foreground']) || { r: 0, g: 0, b: 0, a: 1 };

      const eff = over(fg, bg);
      const r = ratio(eff, bg);
      const leaf = stack[stack.length - 1];
      const { px, bold } = fontPx(stack.flatMap((s) => s.classes));
      const need = threshold(px, bold);
      if (r >= need) continue;
      // sr-only / visually hidden text is not a contrast problem
      if (stack.some((s) => s.classes.includes('sr-only') || s.classes.includes('hidden'))) continue;

      const key = leaf.classes.join(' ') + '|' + text.slice(0, 40);
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({
        route, text: text.slice(0, 46), ratio: r, need, px,
        fg: hex(fg), bg: hex(bg), cls: leaf.classes.slice(0, 10).join(' '),
      });
    }
  });
}

findings.sort((a, b) => a.ratio - b.ratio);
console.log('MODE:', MODE, (HOVER ? '(hover state)' : '(resting state)'), '| pages:', PAGES.length, '| findings below AA:', findings.length, '\n');
const byRoute = {};
for (const f of findings) (byRoute[f.route] ||= []).push(f);
for (const [route, list] of Object.entries(byRoute).sort((a, b) => b[1].length - a[1].length)) {
  console.log('### ' + route + '  (' + list.length + ')');
  for (const f of list.slice(0, 12)) {
    console.log('   ' + f.ratio.toFixed(2) + ':1 (need ' + f.need + ')  fg=' + f.fg + ' bg=' + f.bg + '  "' + f.text + '"');
    console.log('        ' + f.cls);
  }
  if (list.length > 12) console.log('   ... +' + (list.length - 12) + ' more');
}
