import { HERO_PANELS } from "./about-hero-panel";

export interface AboutChapter {
  /** Displayed as 01–05; also drives the deck order. */
  index: string;
  kicker: string;
  title: string;
  body: string;
  metric: string;
  photoUrl: string;
  photoAlt: string;
}

// Five chapters of the same learning journey the rest of the site tells
// (learning-journey.tsx), re-cut as the About hero's scroll narrative:
// foundation → practice → proof → credential → outcome. Photography reuses
// the already-verified panel set in about-hero-panel.tsx.
export const ABOUT_CHAPTERS: AboutChapter[] = [
  {
    index: "01",
    kicker: "Foundation",
    title: "A path you can actually see",
    body: "Every course runs Course → Module → Topic → Video. Learners always know where they stand and what comes next — never a flat pile of recordings.",
    metric: "8 courses · 3 tracks",
    photoUrl: HERO_PANELS[0].photoUrl,
    photoAlt: HERO_PANELS[0].photoAlt,
  },
  {
    index: "02",
    kicker: "Practice",
    title: "Built, not just watched",
    body: "Each module ends in something you shipped — reviewed by trainers who did the job in production before they taught it.",
    metric: "40+ guided projects",
    photoUrl: HERO_PANELS[1].photoUrl,
    photoAlt: HERO_PANELS[1].photoAlt,
  },
  {
    index: "03",
    kicker: "Proof",
    title: "Readiness, measured before it matters",
    body: "Finishing videos is not readiness. Our AI mock interview scores structure, depth and clarity — then names the answer that would have cost you the round.",
    metric: "22,000+ interviews run",
    photoUrl: HERO_PANELS[2].photoUrl,
    photoAlt: HERO_PANELS[2].photoAlt,
  },
  {
    index: "04",
    kicker: "Credential",
    title: "A certificate that verifies",
    body: "Every certificate carries an ID an employer can check. No filler modules, no inflated hours — only what was genuinely completed.",
    metric: "100% verifiable IDs",
    photoUrl: HERO_PANELS[3].photoUrl,
    photoAlt: HERO_PANELS[3].photoAlt,
  },
  {
    index: "05",
    kicker: "Outcome",
    title: "Careers, not completions",
    body: "We hold ourselves to offers, switches and raises — the outcomes learners came for, tracked long after the final lesson ends.",
    metric: "8,000+ learners trained",
    photoUrl: HERO_PANELS[4].photoUrl,
    photoAlt: HERO_PANELS[4].photoAlt,
  },
];
