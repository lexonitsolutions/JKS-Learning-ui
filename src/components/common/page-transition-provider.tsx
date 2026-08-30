"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    // Subtle, non-blocking route indicator
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Sleek, non-blocking Top Navigation Progress Bar */}
      {navigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] bg-transparent overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#818CF8] shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-[progress_0.3s_ease-out_forwards] w-full" />
        </div>
      )}

      {/* Direct, unhindered page render with smooth CSS fade transition */}
      <div className="flex-1 flex flex-col min-w-0 transition-opacity duration-200 ease-out">
        {children}
      </div>
    </>
  );
}
