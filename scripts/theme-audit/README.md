# Theme audit

Static checks for the light/dark theme. They build the app, read the **compiled**
Tailwind CSS and the server-rendered HTML of every route, then resolve each
element's real colours the way a browser would — class rules in source order, the
`dark` variant applied, alpha composited against the nearest opaque ancestor.

No browser required, so this runs in CI or on a machine where headless Chrome
cannot reach the dev server.

## Run

```bash
bash scripts/theme-audit/refresh.sh build     # build + capture CSS and all routes
node scripts/theme-audit/contrast-audit.mjs dark          # resting-state contrast
node scripts/theme-audit/contrast-audit.mjs dark hover    # hover-state contrast
node scripts/theme-audit/contrast-audit.mjs light
node scripts/theme-audit/contrast-audit.mjs light hover
node scripts/theme-audit/state-audit.mjs dark             # dead hovers / edgeless surfaces
node scripts/theme-audit/audit3.mjs                       # light-only utilities
node scripts/theme-audit/verify-css.mjs                   # utilities that never compiled
node scripts/theme-audit/light-parity.mjs                 # light tokens vs what they replaced
```

`refresh.sh` writes into `scripts/theme-audit/.work/` (gitignored) and serves a
production build on port 4321. It forges the `jks_mock_session` cookie so the
`/admin`, `/instructor` and `/dashboard` routes render instead of redirecting.

## What each one catches

| Script | Catches |
| --- | --- |
| `contrast-audit.mjs` | text below the WCAG AA ratio for its size, per theme, resting **and** hover |
| `state-audit.mjs` | a hover that paints nothing; a surface with no edge against its background |
| `audit3.mjs` | light-only utilities with no `dark:` counterpart, with printed-document and glass-overlay cases classified rather than hidden |
| `verify-css.mjs` | classes referenced in source that Tailwind never generated — the silent failure that makes elements vanish (e.g. `slate-850`, `bg-opacity-20`) |
| `light-parity.mjs` | drift in the light value of any token introduced during the dark-mode pass |

## Known non-findings

- `bg-clip-text text-transparent` gradient headings report 1:1 — gradients are not
  simulated.
- Backgrounds painted by `bg-gradient-*` fall back to the page colour, so white
  text on a gradient banner reports as white-on-page.
- `hover:-translate-*` and coloured glow shadows are real hover feedback that the
  state audit does not model.
