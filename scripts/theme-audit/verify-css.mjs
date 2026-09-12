import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..').split(path.sep).join('/') + '/';
const SCRATCH = path.join(HERE, '.work') + path.sep;


const CSS = fs.readFileSync(path.join(SCRATCH, 'built.css'), 'utf8');

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
})(ROOT + 'src');

// Escape a class name the way Tailwind does in a CSS selector.
function cssEscape(cls) {
  return cls.replace(/[.:/[\]()#%,!+*~'"<>=^$|@&]/g, (c) => '\\' + c);
}

const COLOR_PROPS = ['bg', 'text', 'border', 'ring', 'divide', 'from', 'via', 'to', 'outline', 'placeholder', 'fill', 'stroke', 'shadow', 'accent', 'caret', 'decoration'];

const used = new Map(); // class -> Set(files)
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const re = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let m;
  while ((m = re.exec(src))) {
    for (const t of m[2].split(/\s+/)) {
      if (!t || t.includes('${')) continue;
      // strip artefacts from template literals that embed their own quotes
      if (/["'`<>{}();,]|\.$/.test(t)) continue;
      if (!/^[a-z]/.test(t)) continue;
      // only care about color utilities that reference a theme token by name
      if (!new RegExp('^(?:[a-z-]+:)*(?:' + COLOR_PROPS.join('|') + ')-').test(t)) continue;
      if (!used.has(t)) used.set(t, new Set());
      used.get(t).add(f.split(path.sep).join('/').replace(ROOT, ''));
    }
  }
}

const missing = [];
for (const [cls, where] of used) {
  const esc = cssEscape(cls);
  // Tailwind writes the class selector as .<escaped>, followed by a non-class char
  if (!CSS.includes('.' + esc)) missing.push([cls, [...where]]);
}

console.log('color utilities referenced in source:', used.size);
console.log('NOT present in the compiled CSS:', missing.length);
for (const [cls, where] of missing.sort()) {
  console.log('  ' + cls.padEnd(46) + where.slice(0, 2).join(', ') + (where.length > 2 ? ' (+' + (where.length - 2) + ')' : ''));
}
