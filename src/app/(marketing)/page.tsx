import Link from "next/link";
import { BrainCircuit, LayoutGrid, ShieldCheck, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { InteractiveHero } from "@/components/marketing/interactive-hero";
import { CourseCard } from "@/components/marketing/course-card";
import { LearningJourney } from "@/components/marketing/learning-journey";
import { AnimatedScoreBar } from "@/components/marketing/animated-score-bar";
import { CountUpStat } from "@/components/marketing/count-up-stat";
import { TestimonialWall } from "@/components/marketing/testimonial-wall";
import { NetworkBackground } from "@/components/three/network-background";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { Reveal } from "@/lib/motion/reveal";
import { COURSES } from "@/lib/data/courses";
import { HOMEPAGE_TESTIMONIALS } from "@/lib/data/testimonials";

const TRUST_STATS = [
  { label: "Learners trained", target: 8000, suffix: "+" },
  { label: "Course completion rate", target: 87, suffix: "%" },
  { label: "AI mock interviews run", target: 22000, suffix: "+" },
  { label: "Avg. score improvement", target: 34, prefix: "+", suffix: "%" },
];

const WHY_JKS = [
  {
    icon: LayoutGrid,
    title: "Structured mastery",
    body: "Every course follows Course → Module → Topic → Video, so progress always maps to a visible path, not a flat video list.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered readiness",
    body: "Practice with adaptive AI mock interviews that generate questions from your track and experience level, then score you objectively.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise trust",
    body: "Built for working professionals evaluating this against employer-sponsored training — verified certificates, data accuracy, no filler.",
  },
  {
    icon: TrendingUp,
    title: "Outcome-focused",
    body: "Skills → project work → interview readiness → job outcome. Every section of the platform points toward that path.",
  },
];

const SAMPLE_SCORES: [string, number][] = [
  ["Technical Knowledge", 82],
  ["Problem Solving", 76],
  ["Communication", 88],
  ["Confidence", 71],
];

export default function HomePage() {
  return (
    <>
      <InteractiveHero />

      {/* Trust stats */}
      <section className="border-b border-border bg-white">
        <Reveal
          variant="stagger"
          className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4 lg:px-16"
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-h1 text-primary-blue">
                <CountUpStat target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-body-sm text-text-body">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-label text-primary-blue">Featured Courses</span>
            <h2 className="text-h2 mt-2 text-text-heading">Start with a career track</h2>
          </div>
          <Link
            href="/courses"
            className="text-sm font-semibold text-primary-blue hover:underline"
          >
            View all courses &rarr;
          </Link>
        </Reveal>
        <Reveal
          variant="stagger"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {COURSES.slice(0, 3).map((course) => (
            // Plain wrapper so GSAP's entrance transform (on this div) never
            // fights CourseCard's own Framer-Motion-controlled transform.
            <div key={course.slug}>
              <CourseCard course={course} />
            </div>
          ))}
        </Reveal>
      </section>

      {/* Why JKS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <Reveal className="mb-12 max-w-xl">
            <span className="text-label text-primary-blue">Why JKS Learning</span>
            <h2 className="text-h2 mt-2 text-text-heading">
              Built for outcomes, not just content
            </h2>
          </Reveal>
          <Reveal
            variant="stagger"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {WHY_JKS.map((item) => (
              <div key={item.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-blue/10">
                  <item.icon className="h-6 w-6 text-primary-blue" />
                </div>
                <h3 className="text-h3 mt-4 text-text-heading">{item.title}</h3>
                <p className="mt-2 text-sm text-text-body">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <LearningJourney />

      {/* AI Mock Interview feature */}
      <section className="relative overflow-hidden bg-primary-dark py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 30%, rgba(30,94,255,0.4), transparent 45%)",
          }}
        />
        <NetworkBackground variant="compact" />
        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-16">
          <Reveal variant="fade-up">
            <span className="text-label text-primary-blue">The JKS Differentiator</span>
            <h2 className="text-h2 mt-2 text-white">AI Mock Interview & Readiness Report</h2>
            <p className="mt-4 text-white/70">
              Select your technology, experience level, and interview type. Our AI
              generates adaptive questions, evaluates your answers across five
              categories, and returns a full readiness report with an improvement plan.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" /> Technical,
                scenario-based, HR, and experience-based modes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" /> Scored on
                Technical Knowledge, Problem Solving, Communication, Answer Quality,
                Confidence
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" /> Saved to
                your profile, retake with adjusted focus areas
              </li>
            </ul>
            <MagneticButton className="mt-8 inline-block">
              <Link href="/ai-mock-interview" className={buttonVariants({ size: "lg" })}>
                Try a Mock Interview <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
          </Reveal>
          <Reveal variant="scale-in" className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-label text-white/50">Sample Report</span>
              <span className="text-label text-success">Interview Ready</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {SAMPLE_SCORES.map(([label, score]) => (
                <AnimatedScoreBar key={label} label={label} score={score} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Success stories — 3D testimonial wall */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-label text-primary-blue">Success Stories</span>
            <h2 className="text-h2 mt-2 text-text-heading">Learners who made the switch</h2>
          </div>
          <Link
            href="/success-stories"
            className="text-sm font-semibold text-primary-blue hover:underline"
          >
            View all stories &rarr;
          </Link>
        </Reveal>
        <Reveal variant="scale-in">
          <TestimonialWall testimonials={HOMEPAGE_TESTIMONIALS} />
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-blue">
        <Reveal variant="scale-in" className="mx-auto max-w-[1280px] px-6 py-16 text-center lg:px-16">
          <h2 className="text-h2 text-white">Ready to build a career-ready skillset?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Join thousands of learners upskilling with structured courses and AI-driven
            interview practice.
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
