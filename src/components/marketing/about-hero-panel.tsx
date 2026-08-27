export interface HeroPanelData {
  label: string;
  gradient: string;
  /** Real photo, sourced from Pexels (free-to-use) and verified to resolve
   * before being wired in — see about-scroll-hero.tsx's header comment.
   * `gradient` still backs the panel as the load-in color and tint. */
  photoUrl: string;
  photoAlt: string;
}

const PEXELS = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;

// DESIGN.md defaults to procedural/abstract visuals over photography — this
// panel set is an explicit, deliberate exception for the About page hero
// (client direction, 2026-08-22), using real stock photography instead.
// Each photo maps to one step of the same learning-journey narrative used
// in learning-journey.tsx.
export const HERO_PANELS: HeroPanelData[] = [
  {
    label: "Structured Courses",
    gradient: "linear-gradient(135deg, #0b1f3a 0%, #1e5eff 100%)",
    photoUrl: PEXELS(7988086),
    photoAlt: "Developer writing code on a laptop",
  },
  {
    label: "Hands-on Projects",
    gradient: "linear-gradient(135deg, #14265a 0%, #3d78ff 100%)",
    photoUrl: PEXELS(3184357),
    photoAlt: "Team collaborating on a project at computers",
  },
  {
    label: "AI Mock Interview",
    gradient: "linear-gradient(135deg, #0b1f3a 0%, #4c7cff 100%)",
    photoUrl: PEXELS(6937837),
    photoAlt: "Person taking a video call on a laptop",
  },
  {
    label: "Verified Certificate",
    gradient: "linear-gradient(135deg, #0e2c52 0%, #1e5eff 100%)",
    photoUrl: PEXELS(9829483),
    photoAlt: "Certificate of completion on a desk",
  },
  {
    label: "Career Growth",
    gradient: "linear-gradient(135deg, #0b1f3a 0%, #2f6dff 100%)",
    photoUrl: PEXELS(33175653),
    photoAlt: "Professional handshake between business partners",
  },
];

export function HeroPanel({
  variant,
  className,
}: {
  variant: number;
  className?: string;
}) {
  const panel = HERO_PANELS[variant % HERO_PANELS.length];
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: panel.gradient }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external
          hotlinked stock photo; next/image's optimizer only covers
          configured domains and this is a deliberate one-off exception. */}
      <img
        src={panel.photoUrl}
        alt={panel.photoAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: panel.gradient, opacity: 0.35 }} />
    </div>
  );
}
