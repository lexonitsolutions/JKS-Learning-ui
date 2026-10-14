/**
 * One place for rupee formatting, so the same amount never reads two ways.
 *
 *   formatINR(1907343.5)        -> "₹19,07,343.50"   tables, invoices, line items
 *   formatINRCompact(1907343.5) -> "₹19.07L"         summary tiles
 */
const FULL = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const WHOLE = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const toNumber = (n: unknown): number => {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
};

/** Indian digit grouping with exactly two decimals, e.g. ₹19,07,343.50 */
export function formatINR(amount: unknown): string {
  const v = toNumber(amount);
  return `${v < 0 ? "-" : ""}₹${FULL.format(Math.abs(v))}`;
}

/** Same as formatINR without the symbol (for places that print the ₹ separately). */
export function formatINRNumber(amount: unknown): string {
  const v = toNumber(amount);
  return `${v < 0 ? "-" : ""}${FULL.format(Math.abs(v))}`;
}

const trim = (n: number) => String(+n.toFixed(2));

/**
 * Short form for tiles: ₹19.07L (lakh), ₹1.25Cr (crore). Below one lakh the
 * amount is shown in full, e.g. ₹94,500 (or ₹94,500.50 when it has paise).
 */
export function formatINRCompact(amount: unknown): string {
  const v = toNumber(amount);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)}Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)}L`;
  const hasPaise = Math.round(abs * 100) % 100 !== 0;
  return `${sign}₹${hasPaise ? FULL.format(abs) : WHOLE.format(abs)}`;
}
