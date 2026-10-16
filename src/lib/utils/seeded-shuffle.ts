/**
 * Deterministic shuffle: the same seed always gives the same order, different
 * seeds give different orders. Used to give each student their own question
 * order that does not change when they reload the page.
 *
 * Mirrors backend/src/modules/explore-quizzes/explore-quiz-rules.ts.
 */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const rand = seededRandom(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Original indexes 0..n-1 in this seed's order. */
export function seededOrder(length: number, seed: string): number[] {
  return seededShuffle(
    Array.from({ length }, (_, i) => i),
    seed,
  );
}
