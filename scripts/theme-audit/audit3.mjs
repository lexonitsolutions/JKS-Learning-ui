/**
 * Light-only-utility audit, with the deliberate exceptions classified rather
 * than hidden, so the leftover count means something.
 */
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..').split(path.sep).join('/') + '/';
const SCRATCH = path.join(HERE, '.work') + path.sep;


const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
})(ROOT + 'src');

const LIGHT_NEUTRAL = new Set(['slate', 'gray', 'zinc', 'neutral', 'stone']);
const TINTS = new Set(['blue', 'indigo', 'emerald', 'green', 'amber', 'yellow', 'rose', 'red', 'purple', 'violet', 'sky', 'teal', 'orange', 'pink', 'cyan', 'fuchsia', 'lime']);

/* Files that render a paper facsimile — a GST tax invoice, a printed
   certificate, an ATS resume sheet. These are white documents by design and are
   sent to window.print(); theming them would be a bug, not a fix. */
const PAPER = [
  'src/components/common/invoice-modal.tsx',
  'src/components/common/certificate-modal.tsx',
  'src/app/(student)/dashboard/resume-builder/page.tsx',
];

function classify(base) {
  const core = base.split('/')[0];
  const hasAlpha = base.includes('/');
  const m = /^(bg|text|border|ring|divide|from|via|to|outline|placeholder|fill|stroke|decoration)-(.+)$/.exec(core);
  if (!m) return null;
  const [, prop, val] = m;
  if (val === 'white') {
    if (prop === 'text') return null;
    // white at partial opacity is the standard glass overlay on a dark band
    return { prop, kind: hasAlpha ? 'glass' : 'solid', tok: core };
  }
  if (val === 'black' && prop === 'text') return { prop: 'text', kind: 'solid', tok: core };
  const cm = /^([a-z]+)-(\d{2,3})$/.exec(val);
  if (!cm) return null;
  const [, fam, shadeStr] = cm;
  const shade = Number(shadeStr);
  if (['bg', 'from', 'via', 'to'].includes(prop)) {
    if ((LIGHT_NEUTRAL.has(fam) && shade <= 200) || (TINTS.has(fam) && shade <= 100)) return { prop: prop === 'bg' ? 'bg' : 'grad', kind: 'solid', tok: core };
    return null;
  }
  if (['text', 'placeholder', 'fill', 'stroke', 'decoration'].includes(prop)) {
    if ((LIGHT_NEUTRAL.has(fam) && shade >= 500) || (TINTS.has(fam) && shade >= 700)) return { prop: 'text', kind: 'solid', tok: core };
    return null;
  }
  if (['border', 'ring', 'divide', 'outline'].includes(prop)) {
    if ((LIGHT_NEUTRAL.has(fam) && shade <= 300) || (TINTS.has(fam) && shade <= 200)) return { prop: 'border', kind: 'solid', tok: core };
    return null;
  }
  return null;
}

function parse(tok) {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of tok) {
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (ch === ':' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  return { variants: parts, base: parts.pop() };
}

const buckets = { paper: [], glass: [], real: [] };

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = f.split(path.sep).join('/').replace(ROOT, '');
  const isPaper = PAPER.includes(rel);
  const re = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let m;
  while ((m = re.exec(src))) {
    const content = m[2];
    if (content.length > 4000) continue;
    const lineNo = src.slice(0, m.index).split(/\r?\n/).length;
    const toks = content.split(/[\s\n]+/).filter(t => t && /^[a-z]/.test(t) && !t.includes('${'));
    const darkSet = new Set();
    for (const t of toks) {
      const { variants, base } = parse(t);
      if (!variants.includes('dark')) continue;
      const p = /^([a-z]+)-/.exec(base);
      if (p) darkSet.add(variants.filter(v => v !== 'dark').sort().join('|') + '##' + p[1]);
    }
    for (const t of toks) {
      const { variants, base } = parse(t);
      if (variants.includes('dark')) continue;
      const c = classify(base);
      if (!c) continue;
      const propKey = /^([a-z]+)-/.exec(base)[1];
      if (darkSet.has(variants.slice().sort().join('|') + '##' + propKey)) continue;
      const entry = { rel, lineNo, tok: t, chunk: content.replace(/\s+/g, ' ').slice(0, 110) };
      if (isPaper) buckets.paper.push(entry);
      else if (c.kind === 'glass') buckets.glass.push(entry);
      else buckets.real.push(entry);
    }
  }
}

console.log('Light-only utilities with no dark: counterpart\n');
console.log('  ' + String(buckets.paper.length).padStart(4) + '  printed-document surfaces (invoice / certificate / resume sheet) — intentional');
console.log('  ' + String(buckets.glass.length).padStart(4) + '  translucent white glass on always-dark bands — correct in both themes');
console.log('  ' + String(buckets.real.length).padStart(4) + '  everything else\n');

const byFile = {};
for (const e of buckets.real) (byFile[e.rel] ||= []).push(e);
for (const [f, list] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
  console.log('## ' + f + '  (' + list.length + ')');
  for (const e of list) console.log('   L' + e.lineNo + '  [' + e.tok + ']  ' + e.chunk);
}
