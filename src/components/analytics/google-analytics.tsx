"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, isStaffPath, pageview } from "@/lib/analytics/gtag";
import { DEFAULT_SITE_TITLE, getPageTitle } from "@/lib/analytics/page-titles";

// Title this tracker last assigned, so a later navigation can tell "still our
// auto-title from the previous page" apart from a title the page set itself.
let lastAutoTitle: string | null = null;

function GAPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !GA_MEASUREMENT_ID) return;
    if (isStaffPath(pathname)) return;
    const queryString = searchParams?.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    // Wait for the new route to commit, then give pages that still carry the
    // site-wide default title their own, so GA4 can tell them apart.
    const frame = requestAnimationFrame(() => {
      const current = document.title;
      if (!current || current === DEFAULT_SITE_TITLE || current === lastAutoTitle) {
        lastAutoTitle = getPageTitle(pathname);
        document.title = lastAutoTitle;
      }
      pageview(url, document.title);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  );
}
