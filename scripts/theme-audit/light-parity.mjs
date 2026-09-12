/**
 * Light-mode parity check.
 *
 * Every token swap made during the dark-mode pass was supposed to keep the LIGHT
 * value byte-identical to the utility it replaced. This asserts that against the
 * compiled CSS, so "light mode is unchanged" is a measured claim, not a hope.
 */
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..').split(path.sep).join('/') + '/';
const SCRATCH = path.join(HERE, '.work') + path.sep;


const css = fs.readFileSync(path.join(SCRATCH, 'built.css'), 'utf8');

// light :root block only (the first one that defines --background)
function lightVars() {
  const vars = {};
  const re = /([^{}@]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1].trim();
    if (/\.dark\b|\[data-theme=["']?dark/.test(sel)) continue;
    if (!/(?:^|,)\s*(?::root|:host)\b/.test(sel)) continue;
    const dre = /(--[\w-]+)\s*:\s*([^;}]+)/g;
    let d;
    while ((d = dre.exec(m[2]))) {
      const v = d[2].trim();
      if (/(?:lab|lch|oklab|oklch|color)\(/i.test(v) && vars[d[1]]) continue;
      if (/(?:lab|lch|oklab|oklch|color)\(/i.test(v)) continue;
      vars[d[1]] = v;
    }
  }
  return vars;
}
const V = lightVars();
const resolve = (v, d = 0) => d > 8 || typeof v !== 'string' ? v
  : v.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (_, n, fb) => V[n] != null ? resolve(V[n], d + 1) : (fb ?? '?').trim());

const norm = (h) => {
  h = (h || '').trim().toLowerCase();
  if (h === '#fff') return '#ffffff';
  if (h === '#000') return '#000000';
  return h;
};

// token I now use  ->  the literal/utility value it replaced in LIGHT mode
const PAIRS = [
  ['--surface', '#ffffff', 'Card / skull-loader bg-white'],
  ['--surface-secondary', '#f8fafc', 'skeleton wells (was bg-slate-50)'],
  ['--surface-active', '#e2e8f0', 'ProgressBar track (was bg-border #e2e8f0)'],
  ['--border-subtle', '#f1f5f9', 'sidebar dividers (was border-slate-100)'],
  ['--color-text-heading', '#0f172a', 'Card title (was text-slate-900)'],
  ['--nav-item', '#475569', 'sidebar label (was text-slate-600)'],
  ['--nav-item-icon', '#94a3b8', 'sidebar icon (was text-slate-400)'],
  ['--nav-item-hover-bg', '#f1f5f9', 'sidebar hover (was bg-slate-100)'],
  ['--nav-item-hover-text', '#0f172a', 'sidebar hover text (was text-slate-900)'],
  ['--nav-item-active-bg', '#2563eb', 'sidebar active (was bg-blue-600)'],
  ['--nav-item-active-text', '#ffffff', 'sidebar active text (was text-white)'],
  ['--nav-sub-active-bg', '#eff6ff', 'sidebar sub active (was bg-blue-50)'],
  ['--nav-sub-active-text', '#2563eb', 'sidebar sub active text (was text-[#2563EB])'],
  ['--color-primary-fill', '#1e5eff', 'brand fill (was bg-primary-blue)'],
  ['--color-contrast-ink', '#0b1f3a', 'outline button ink (was text-primary-dark)'],
  ['--color-error-fill', '#dc2626', 'destructive fill (was bg-error)'],
  ['--background', '#f4f7fc', 'skull-loader scrim (was bg-[#F4F7FC])'],
];

let bad = 0;
console.log('LIGHT-MODE PARITY  (token value  vs  value it replaced)\n');
for (const [token, expected, where] of PAIRS) {
  const got = norm(resolve(V[token]));
  const ok = got === norm(expected);
  if (!ok) bad++;
  console.log(`  ${ok ? 'OK  ' : 'DIFF'}  ${token.padEnd(26)} ${String(got).padEnd(10)} expected ${expected.padEnd(10)}  ${where}`);
}

// Values that intentionally changed in light mode — listed so they are not silent.
const INTENTIONAL = [
  ['--text-muted', '#94a3b8', 'now darker; only feeds the new dark placeholder rule + text-text-muted'],
  ['--color-primary-ink', '#1e5eff', 'now deeper so chip labels clear AA on the 10% tint'],
  ['--color-primary-fill-hover', 'brightness(1.1) of #1e5eff', 'explicit hover shade instead of a filter'],
  ['--color-error-fill-hover', 'brightness(1.1) of #dc2626', 'darkens instead of brightening (old value failed AA)'],
];
console.log('\nDeliberate light-mode value changes:');
for (const [t, was, why] of INTENTIONAL) console.log(`  ${t.padEnd(28)} was ${String(was).padEnd(28)} now ${resolve(V[t])}   — ${why}`);

console.log('\n' + (bad ? bad + ' TOKEN(S) DRIFTED' : 'all parity tokens identical to the values they replaced'));
process.exit(bad ? 1 : 0);
