"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CalendarDays,
  Code2,
  FileText,
  GraduationCap,
  Quote,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { fetchDbCourses, type Course } from "@/lib/data/courses";
import { fetchPublicEvents, type EventItem } from "@/lib/data/events-api";
import { HOMEPAGE_TESTIMONIALS } from "@/lib/data/testimonials";

export type FlyoutKey = "courses" | "events" | "ai" | "stories" | "about";

/* ── Data: fetched once, on first hover, then shared ─────────────────── */

let coursesPromise: Promise<Course[]> | null = null;
let eventsPromise: Promise<EventItem[]> | null = null;

const loadCourses = () => (coursesPromise ??= fetchDbCourses().catch(() => []));
const loadEvents = () => (eventsPromise ??= fetchPublicEvents().catch(() => []));

/** Most-enrolled first, then best rated - the real signal of "popular". */
export function pickPopularCourses(courses: Course[], limit = 4): Course[] {
  return [...courses]
    .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled || b.rating - a.rating)
    .slice(0, limit);
}

/** Upcoming first; anything that has ended or is not open for registration is skipped. */
export function pickUpcomingEvents(events: EventItem[], limit = 3): EventItem[] {
  return events
    .filter((e) => !e.hasEnded && e.status === "PUBLISHED")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
}

/* ── Motion ──────────────────────────────────────────────────────────── */

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Shared pieces ───────────────────────────────────────────────────── */

function Intro({ eyebrow, title, body, href, cta }: { eyebrow: string; title: string; body: string; href: string; cta: string }) {
  return (
    <motion.div variants={item} className="flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-blue dark:text-blue-400">{eyebrow}</span>
        <h3 className="mt-1.5 text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{body}</p>
      </div>
      <Link
        href={href}
        className="group mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary-blue hover:underline dark:text-blue-400"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

const card =
  "group/card relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-blue/40 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-surface dark:hover:border-blue-500/40";

function Skeleton({ n }: { n: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-[104px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" aria-hidden />
      ))}
    </>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <motion.p variants={item} className="col-span-full rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {text}
    </motion.p>
  );
}

/* ── Panels ──────────────────────────────────────────────────────────── */

function CoursesPanel() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  useEffect(() => {
    let live = true;
    void loadCourses().then((c) => live && setCourses(c));
    return () => {
      live = false;
    };
  }, []);
  const popular = courses ? pickPopularCourses(courses) : null;

  return (
    <>
      <Intro
        eyebrow="Popular right now"
        title="Learn what employers hire for"
        body="Structured tracks with projects, assessments and a verified certificate."
        href="/courses"
        cta="Browse all courses"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3">
        {popular === null ? (
          <Skeleton n={4} />
        ) : popular.length === 0 ? (
          <Empty text="New courses are launching soon." />
        ) : (
          popular.map((c) => (
            <motion.div key={c.slug} variants={item}>
              <Link href={`/courses/${c.slug}`} className={card}>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-primary-blue dark:bg-blue-950/50 dark:text-blue-300">{c.track}</span>
                <h4 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover/card:text-primary-blue dark:text-white dark:group-hover/card:text-blue-400">
                  {c.title}
                </h4>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {c.level} · {c.durationWeeks} wk
                  </span>
                  {c.rating > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating.toFixed(1)}
                    </span>
                  )}
                  {c.studentsEnrolled > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {c.studentsEnrolled.toLocaleString("en-IN")} learners
                    </span>
                  )}
                </p>
                <ArrowRight className="absolute right-4 top-4 h-4 w-4 -translate-x-1 text-primary-blue opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}

function EventsPanel() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  useEffect(() => {
    let live = true;
    void loadEvents().then((e) => live && setEvents(e));
    return () => {
      live = false;
    };
  }, []);
  const upcoming = events ? pickUpcomingEvents(events) : null;

  return (
    <>
      <Intro
        eyebrow="Upcoming events"
        title="Workshops, webinars and meetups"
        body="Learn live from practitioners and meet the community."
        href="/events"
        cta="See all events"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-3">
        {upcoming === null ? (
          <Skeleton n={3} />
        ) : upcoming.length === 0 ? (
          <Empty text="No upcoming events right now. Check back soon." />
        ) : (
          upcoming.map((e) => {
            const d = new Date(e.startDate);
            return (
              <motion.div key={e.id} variants={item}>
                <Link href={`/events/${e.slug}`} className={card}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                      <span className="text-base font-extrabold leading-none">{d.getDate()}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">{d.toLocaleString("en-IN", { month: "short" })}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover/card:text-primary-blue dark:text-white">{e.title}</h4>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3 w-3" />
                    {e.mode.charAt(0) + e.mode.slice(1).toLowerCase()}
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${e.isSoldOut ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>
                      {e.isSoldOut ? "Sold out" : "Open"}
                    </span>
                  </p>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}

const AI_FEATURES = [
  {
    href: "/ai-mock-interview",
    icon: BrainCircuit,
    title: "AI Mock Interview",
    body: "Adaptive questions for your technology and level, scored with a full readiness report.",
    tint: "from-blue-600 to-indigo-600",
  },
  {
    href: "/dashboard/resume-builder",
    icon: FileText,
    title: "Resume Maker",
    body: "ATS-friendly templates. Upload your existing resume and merge in your JKS certificates.",
    tint: "from-emerald-500 to-teal-600",
  },
  {
    href: "/dashboard/playground",
    icon: Code2,
    title: "Code Playground",
    body: "A VS Code-style editor to write and run code, and to solve assessment questions.",
    tint: "from-violet-500 to-fuchsia-600",
  },
];

function AiPanel() {
  return (
    <>
      <Intro
        eyebrow="Career toolkit"
        title="Practise, build and ship - all in one place"
        body="Everything you need to get interview-ready, available once you are a JKS learner."
        href="/ai-mock-interview"
        cta="Explore AI Mock Interview"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-3">
        {AI_FEATURES.map((f) => (
          <motion.div key={f.title} variants={item}>
            <Link href={f.href} className={`${card} h-full`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.tint} text-white shadow-md transition-transform duration-300 group-hover/card:-rotate-6 group-hover/card:scale-110`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{f.title}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{f.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary-blue opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:text-blue-400">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function StoriesPanel() {
  const stories = HOMEPAGE_TESTIMONIALS.slice(0, 2);
  return (
    <>
      <Intro
        eyebrow="Learner outcomes"
        title="Real people, real switches"
        body="See how learners moved into new roles after training with JKS."
        href="/success-stories"
        cta="Read all stories"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3">
        {stories.map((s) => (
          <motion.div key={s.id} variants={item}>
            <Link href="/success-stories" className={`${card} h-full`}>
              <Quote className="h-4 w-4 text-primary-blue/60" />
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{s.quote}</p>
              <p className="mt-3 text-[11px] font-bold text-slate-900 dark:text-white">
                {s.name} <span className="font-medium text-slate-500 dark:text-slate-400">· {s.role}, {s.placedCompany}</span>
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

const ABOUT_LINKS = [
  { href: "/about", icon: GraduationCap, title: "Our story", body: "Who we are and how we teach." },
  { href: "/certificate/verify", icon: BadgeCheck, title: "Verify a certificate", body: "Check a JKS certificate by its ID." },
  { href: "/register-course", icon: Sparkles, title: "Enroll in a course", body: "Pick a track and get started." },
];

function AboutPanel() {
  return (
    <>
      <Intro eyebrow="About JKS Learning" title="Built for outcomes" body="Career-ready IT upskilling for working professionals and freshers." href="/about" cta="About us" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-3">
        {ABOUT_LINKS.map((l) => (
          <motion.div key={l.title} variants={item}>
            <Link href={l.href} className={`${card} h-full`}>
              <l.icon className="h-5 w-5 text-primary-blue transition-transform duration-300 group-hover/card:scale-110 dark:text-blue-400" />
              <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{l.title}</h4>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{l.body}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

const PANELS: Record<FlyoutKey, () => React.ReactElement> = {
  courses: CoursesPanel,
  events: EventsPanel,
  ai: AiPanel,
  stories: StoriesPanel,
  about: AboutPanel,
};

/**
 * The drop-down shown under the header while a nav item is hovered/focused.
 * Content swaps with a staggered rise; the container itself eases in. When the
 * visitor prefers reduced motion, everything appears instantly.
 */
export function NavFlyout({ openKey, reducedMotion }: { openKey: FlyoutKey; reducedMotion: boolean }) {
  const Panel = PANELS[openKey];
  return (
    <motion.div
      role="region"
      aria-label={`${openKey} menu`}
      initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99, transition: { duration: 0.14 } }}
      transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top center" }}
      className="absolute left-0 right-0 top-full hidden border-b border-slate-200/80 bg-white/95 shadow-[0_24px_48px_-12px_rgba(11,31,58,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-background/95 lg:block"
    >
      <motion.div
        key={openKey}
        variants={reducedMotion ? undefined : list}
        initial={reducedMotion ? false : "hidden"}
        animate="show"
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-4 lg:px-16"
      >
        <Panel />
      </motion.div>
    </motion.div>
  );
}
