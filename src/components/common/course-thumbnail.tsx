"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Code2,
  Terminal,
  Layers,
  Server,
  Cpu,
  Database,
  Globe,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface CourseThumbnailProps {
  src?: string | null;
  title: string;
  track?: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  showOverlay?: boolean;
}

// Curated themes based on track and title keywords
function getThemeForCourse(title: string, track: string = "") {
  const t = (title + " " + track).toLowerCase();

  if (t.includes("java") || t.includes("spring")) {
    return {
      gradient: "from-amber-950 via-slate-900 to-orange-950",
      accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      glow: "bg-amber-500/15",
      icon: Terminal,
      trackLabel: "JAVA SYSTEM",
      badgeColor: "#F59E0B",
    };
  }
  if (t.includes("react") || t.includes("front") || t.includes("next")) {
    return {
      gradient: "from-cyan-950 via-slate-900 to-blue-950",
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      glow: "bg-cyan-500/15",
      icon: Globe,
      trackLabel: "FRONTEND ENG",
      badgeColor: "#06B6D4",
    };
  }
  if (t.includes("sap") || t.includes("erp") || t.includes("abap")) {
    return {
      gradient: "from-emerald-950 via-slate-900 to-teal-950",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      glow: "bg-emerald-500/15",
      icon: Database,
      trackLabel: "SAP ENTERPRISE",
      badgeColor: "#10B981",
    };
  }
  if (t.includes("dotnet") || t.includes(".net") || t.includes("c#")) {
    return {
      gradient: "from-purple-950 via-slate-900 to-indigo-950",
      accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      glow: "bg-purple-500/15",
      icon: Cpu,
      trackLabel: ".NET ARCHITECTURE",
      badgeColor: "#8B5CF6",
    };
  }
  if (t.includes("cloud") || t.includes("devops") || t.includes("docker")) {
    return {
      gradient: "from-sky-950 via-slate-900 to-indigo-950",
      accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      glow: "bg-sky-500/15",
      icon: Server,
      trackLabel: "CLOUD & DEVOPS",
      badgeColor: "#0EA5E9",
    };
  }

  // Default Full Stack Theme
  return {
    gradient: "from-slate-950 via-blue-950 to-slate-900",
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    glow: "bg-blue-500/15",
    icon: Code2,
    trackLabel: track ? track.replace(/_/g, " ").toUpperCase() : "FULL STACK",
    badgeColor: "#3B82F6",
  };
}

function getFallbackImage(title: string = "", track: string = ""): string {
  const t = (title + " " + track).toLowerCase();
  if (t.includes("java") || t.includes("spring")) {
    return "/images/student-3d-developer.webp";
  }
  return "/images/fullstack-developer-3d.jpg";
}

export function CourseThumbnail({
  src,
  title,
  track = "FULL_STACK",
  className = "w-full h-full",
  priority = false,
  aspectRatio = "16/9",
  showOverlay = true,
}: CourseThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // Normalize backend relative upload URLs if passed directly
  const normalizedSrc =
    typeof src === "string" &&
    src.startsWith("/") &&
    !src.startsWith("/images/") &&
    !src.startsWith("/assets/")
      ? `${(process.env.NEXT_PUBLIC_API_URL || "https://jks-learning-backend-production-c2eb.up.railway.app").replace(/\/$/, "")}${src}`
      : src;

  // Check if src is valid and not one of the obsolete non-existent local fallback paths
  const isObsoleteLocalFallback =
    typeof normalizedSrc === "string" &&
    (normalizedSrc.includes("course-java.png") ||
      normalizedSrc.includes("course-frontend.png") ||
      normalizedSrc.includes("course-sap.png") ||
      normalizedSrc.includes("course-dotnet.png"));

  const hasProvidedValidSrc = Boolean(normalizedSrc && normalizedSrc.trim() && !isObsoleteLocalFallback);
  const resolvedSrc = hasProvidedValidSrc && !hasError ? normalizedSrc! : getFallbackImage(title, track);

  const theme = getThemeForCourse(title, track);
  const Icon = theme.icon;

  if (!hasError && resolvedSrc) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={resolvedSrc}
          alt={title}
          fill
          unoptimized
          priority={priority}
          onError={() => setHasError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
    );
  }

  // Fallback circuit graphic if image fails to load
  return (
    <div
      className={`relative flex flex-col justify-between p-4 sm:p-5 overflow-hidden bg-gradient-to-br ${theme.gradient} ${className}`}
      style={{ aspectRatio }}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className={`absolute -top-10 -right-10 w-44 h-44 rounded-full ${theme.glow} blur-3xl pointer-events-none`}
      />
      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${theme.accent}`}
        >
          <Sparkles className="h-3 w-3" />
          <span>{theme.trackLabel}</span>
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/90 backdrop-blur-md border border-white/15 shadow-xs">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-70"
        style={{ backgroundColor: theme.badgeColor }}
      />
    </div>
  );
}
