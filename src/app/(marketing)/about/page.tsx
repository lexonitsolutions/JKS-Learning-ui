import Link from "next/link";
import { LayoutGrid, BrainCircuit, ShieldCheck, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountUpStat } from "@/components/marketing/count-up-stat";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { AboutScrollHero } from "@/components/marketing/about-scroll-hero";
import { Reveal } from "@/lib/motion/reveal";

const STATS = [
  { label: "Learners trained", target: 8000, suffix: "+" },
  { label: "Courses launched", target: 8 },
  { label: "Tracks covered", target: 3 },
  { label: "AI interviews run", target: 22000, suffix: "+" },
];

const PILLARS = [
  {
    icon: LayoutGrid,
    title: "Structured mastery",
    body: "Every course follows Course → Module → Topic → Video, so learners always see a visible path — not a flat pile of recordings.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered readiness",
    body: "Video completion isn't the finish line. Our AI mock interview exists because passing a course and being interview-ready are different things.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise trust",
    body: "Built for working professionals evaluating this against employer-sponsored training — verified certificates, accurate data, no filler content.",
  },
];

const TRAINERS = [
  {
    initials: "RK",
    name: "Rohit Kapoor",
    role: "Lead Trainer, Java Full Stack",
    bio: "12+ years building and teaching Spring Boot / React systems for enterprise teams.",
  },
  {
    initials: "MS",
    name: "Meera Subramaniam",
    role: "Lead Trainer, SAP",
    bio: "Former SAP MM/ABAP consultant, now focused on making enterprise systems teachable.",
  },
  {
    initials: "DP",
    name: "Dev Patil",
    role: "Lead Trainer, Frontend",
    bio: "Built production React/TypeScript UIs at scale before moving into full-time training.",
  },
  {
    initials: "AF",
    name: "Aisha Farooqui",
    role: "AI Interview Design Lead",
    bio: "Designs the question/evaluation logic behind every AI mock interview category.",
  },
];

export default function AboutPage() {
  return (
    <>
      <AboutScrollHero />

      {/* Stats */}
      <section className="border-b border-border bg-white">
        <Reveal
          variant="stagger"
          className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4 lg:px-16"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-h1 text-primary-blue">
                <CountUpStat target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-body-sm text-text-body">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Brand pillars */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mb-12 max-w-xl">
          <span className="text-label text-primary-blue">What We Believe</span>
          <h2 className="text-h2 mt-2 text-text-heading">Three pillars behind every decision</h2>
        </Reveal>
        <Reveal variant="stagger" className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-blue/10">
                <pillar.icon className="h-6 w-6 text-primary-blue" />
              </div>
              <h3 className="text-h3 mt-4 text-text-heading">{pillar.title}</h3>
              <p className="mt-2 text-sm text-text-body">{pillar.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Trainers */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <Reveal className="mb-12 max-w-xl">
            <span className="text-label text-primary-blue">Meet the Trainers</span>
            <h2 className="text-h2 mt-2 text-text-heading">Taught by people who did the job</h2>
          </Reveal>
          <Reveal variant="stagger" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINERS.map((trainer) => (
              <div
                key={trainer.name}
                className="rounded-lg border border-border bg-bg-light p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-blue text-sm font-semibold text-white">
                  {trainer.initials}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text-heading">{trainer.name}</h3>
                <Badge variant="primary" className="mt-1">
                  {trainer.role}
                </Badge>
                <p className="mt-3 text-body-sm text-text-body">{trainer.bio}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-blue">
        <Reveal variant="scale-in" className="mx-auto max-w-[1280px] px-6 py-16 text-center lg:px-16">
          <h2 className="text-h2 text-white">Ready to see the courses?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Structured tracks across Full Stack, Frontend, and SAP — every course includes free
            demo lessons.
          </p>
          <MagneticButton className="mt-8 inline-block">
            <Link
              href="/courses"
              className={
                buttonVariants({ variant: "secondary", size: "lg" }) +
                " border-white bg-white text-primary-blue hover:bg-white/90 hover:text-primary-blue"
              }
            >
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </MagneticButton>
        </Reveal>
      </section>
    </>
  );
}
