/** Canonical public origin of the website (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://udemycourse.com"
).replace(/\/+$/, "");
