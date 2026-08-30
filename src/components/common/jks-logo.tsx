"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface JksLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  imgClassName?: string;
  showSubtitle?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: { height: 28, width: 140, class: "h-7 w-auto" },
  md: { height: 36, width: 180, class: "h-9 w-auto" },
  lg: { height: 44, width: 220, class: "h-11 w-auto" },
  xl: { height: 56, width: 280, class: "h-14 w-auto" },
};

export function JksLogo({
  size = "md",
  href = "/",
  className = "",
  imgClassName = "",
  showSubtitle,
  priority = true,
}: JksLogoProps) {
  const dim = SIZE_MAP[size] || SIZE_MAP.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <Image
        src="/images/jks-logo.png"
        alt="JKS Learning"
        width={dim.width}
        height={dim.height}
        priority={priority}
        className={`object-contain transition-transform duration-200 hover:opacity-95 ${dim.class} ${imgClassName}`}
      />
      {showSubtitle && (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 border-l border-slate-200 hidden sm:inline-block">
          {showSubtitle}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
