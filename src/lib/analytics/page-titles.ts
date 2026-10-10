export const DEFAULT_SITE_TITLE = "JKS Learning — Career-Ready IT Upskilling";

const SITE_SUFFIX = "JKS Learning";

const STATIC_TITLES: Record<string, string> = {
  "/": DEFAULT_SITE_TITLE,
  "/about": "About Us",
  "/courses": "Courses",
  "/events": "Events & Masterclasses",
  "/certificate": "Verify a Certificate",
  "/ai-mock-interview": "AI Mock Interview",
  "/register-course": "Register for a Course",
  "/success-stories": "Success Stories",
  "/privacy": "Privacy Policy",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms & Conditions",
  "/sign-in": "Sign In",
  "/sign-up": "Sign Up",
  "/dashboard": "My Dashboard",
};

function prettifySegment(segment: string): string {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * A distinct, readable title for a route. Many pages are client components and
 * cannot export Next metadata, so without this every page in GA4 (and every
 * browser tab) carried the same site-wide title.
 */
export function getPageTitle(pathname: string): string {
  const clean = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  if (clean === "/") return DEFAULT_SITE_TITLE;

  const known = STATIC_TITLES[clean];
  if (known) return `${known} | ${SITE_SUFFIX}`;

  const segments = clean.split("/").filter(Boolean);
  const last = prettifySegment(segments[segments.length - 1]);
  const parent = segments.length > 1 ? STATIC_TITLES[`/${segments[0]}`] : undefined;
  return parent ? `${last} — ${parent} | ${SITE_SUFFIX}` : `${last} | ${SITE_SUFFIX}`;
}
