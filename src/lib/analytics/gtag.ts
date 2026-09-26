export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Log page views to GA4 safely
 */
export function pageview(url: string, title?: string) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag("event", "page_view", {
    page_path: url,
    page_title: title || (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  });
}

/**
 * Sanitizes parameters to ensure no sensitive personal information,
 * passwords, or tokens are transmitted to GA4.
 */
function sanitizeParams(params?: Record<string, any>): Record<string, any> {
  if (!params) return {};
  const cleaned: Record<string, any> = {};
  const blockedKeys = [
    "password",
    "token",
    "access_token",
    "refreshtoken",
    "secret",
    "authorization",
    "credit_card",
    "cardnumber",
    "cvv",
  ];

  for (const [key, val] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    if (blockedKeys.some((blocked) => lowerKey.includes(blocked))) {
      continue;
    }
    // Block email if sent as raw value
    if (typeof val === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      continue;
    }
    cleaned[key] = val;
  }
  return cleaned;
}

/**
 * Log custom events to GA4 safely
 */
export function event(action: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;
  const safeParams = sanitizeParams(params);
  window.gtag("event", action, safeParams);
}
