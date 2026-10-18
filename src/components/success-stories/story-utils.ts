import type { PublicStory } from "@/lib/data/success-stories-api";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** "Software Engineer at Acme", or whichever half exists. */
export function roleLine(s: Pick<PublicStory, "currentRole" | "company">) {
  if (s.currentRole && s.company) return `${s.currentRole} at ${s.company}`;
  return s.currentRole || s.company || null;
}

export function dateLabel(s: Pick<PublicStory, "achievedAt" | "completionYear">) {
  if (s.achievedAt) {
    const d = new Date(s.achievedAt);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }
  return s.completionYear ? String(s.completionYear) : null;
}

export function playLabel(s: Pick<PublicStory, "studentName" | "title" | "video">) {
  const dur = s.video?.durationLabel ? `, ${s.video.durationLabel}` : "";
  return `Play video story: ${s.title}, by ${s.studentName}${dur}`;
}
