import Link from "next/link";
import {
  PlayCircle,
  ListChecks,
  BrainCircuit,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Code2,
  Puzzle,
  Users,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Activity,
  Cpu,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { CountUpStat } from "@/components/marketing/count-up-stat";
import { AiMockHero } from "@/components/marketing/ai-mock-hero";
import { InterviewSimulator } from "@/components/marketing/interview-simulator";
import { InteractiveReportShowcase } from "@/components/marketing/interactive-report-showcase";
import { InterviewFaq } from "@/components/marketing/interview-faq";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: ListChecks,
    title: "1-Click Custom Setup",
    body: "Select your track (React/Node, Java Spring, SAP S/4HANA, or System Design), target level (Junior to Staff), and interview format in seconds.",
    highlight: "Zero friction onboarding",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "Real-Time Adaptive Questioning",
    body: "Our AI listens to your response and dynamically calibrates difficulty — drilling deeper into architecture nuances or pivoting on gaps.",
    highlight: "Non-linear conversational AI",
  },
  {
    step: "03",
    icon: ClipboardCheck,
    title: "Instant 5-Axis Diagnostic",
    body: "Receive a comprehensive scoring vector across Technical Depth, Problem Solving, Communication, Answer Quality, and Confidence.",
    highlight: "Calibrated to top 1% standards",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Targeted Action Roadmap",
    body: "Identified weak spots automatically convert into an actionable study checklist with direct lesson links, ready for your next retake.",
    highlight: "+34% avg score improvement",
  },
];

const INTERVIEW_TYPES = [
  {
    icon: Code2,
    label: "Technical & Algorithms",
    tags: ["React 19", "Spring Boot", "Concurrency", "CAP Theorem"],
    body: "Deep dive into core runtime mechanics, framework lifecycles, and optimal algorithms with real-time code and theory evaluation.",
    difficulty: "Adaptive Level: L3 - L6",
  },
  {
    icon: Puzzle,
    label: "System Design & Scenarios",
    tags: ["Rate Limiting", "Kafka Sagas", "Edge Caching", "Sharding"],
    body: "Architect distributed systems under realistic enterprise constraints — trade-off analysis, failovers, latency budgets, and scale.",
    difficulty: "Adaptive Level: Senior - Staff",
  },
  {
    icon: Users,
    label: "Behavioral & Leadership",
    tags: ["STAR Method", "Stakeholder Alignment", "Conflict", "Impact"],
    body: "Master the behavioral dynamics recruiters look for: proactive ownership, team mentorship, and executive-level communication.",
    difficulty: "Adaptive Level: All Tiers",
  },
  {
    icon: Briefcase,
    label: "Resume & Project Panel",
    tags: ["Project History", "Architecture Defense", "Production Bugs"],
    body: "Defend your actual resume projects against high-pressure technical panel questions, just like tier-1 company hiring loops.",
    difficulty: "Adaptive Level: Custom Tailored",
  },
];

const STATS = [
  { label: "Mock Interviews Run", target: 22000, suffix: "+" },
  { label: "Avg. Score Improvement", target: 34, prefix: "+", suffix: "%" },
  { label: "Evaluation Latency", target: 120, suffix: "ms" },
  { label: "Candidate Offer Rate", target: 94, suffix: "%" },
];

const COMPARISON_ITEMS = [
  {
    feature: "Evaluation Speed",
    traditional: "2–4 business days via human mentors",
    jksAi: "Instantaneous (under 120ms diagnostic generation)",
  },
  {
    feature: "Question Adaptability",
    traditional: "Static scripts & generic LeetCode lists",
    jksAi: "Dynamic AI calibrates to your exact answers in real time",
  },
  {
    feature: "Scoring Objectivity",
    traditional: "Subjective interviewer bias & varying standards",
    jksAi: "Calibrated 5-axis algorithmic benchmark across 22,000+ tests",
  },
  {
    feature: "Actionable Study Plan",
    traditional: "Vague feedback ('practice more system design')",
    jksAi: "Exact timestamped modules & targeted curriculum links",
  },
  {
    feature: "Availability & Retakes",
    traditional: "Expensive per-session booking with waitlists",
    jksAi: "24/7 unlimited on-demand practice whenever you're ready",
  },
];

export default function AiMockInterviewPage() {
  return (
    <>
      {/* 1. EXACT 1:1 3D HERO SECTION MATCHING DESIGN SPEC */}
      <AiMockHero />

      {/* 2. LIVE INTERACTIVE AI MOCK INTERVIEW SIMULATOR */}
      <section className="relative py-24 bg-bg-light overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16 mb-12 text-center">
          <Reveal>
            <span className="text-label text-primary-blue">Interactive Test Drive</span>
            <h2 className="text-h2 mt-2 text-text-heading">
              Experience the AI Interviewer in Action
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-body text-sm sm:text-base">
              Select a specialized track below to see how our AI synthesizes adaptive questions,
              evaluates candidate answers, and outputs instant diagnostic scoring.
            </p>
          </Reveal>
        </div>

        <Reveal variant="scale-in">
          <InterviewSimulator />
        </Reveal>
      </section>

      {/* 3. HOW IT WORKS: CONNECTED 4-STEP TIMELINE */}
      <section className="relative mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
        <Reveal className="mb-14 max-w-xl">
          <span className="text-label text-primary-blue">Step-by-Step Flow</span>
          <h2 className="text-h2 mt-2 text-text-heading">
            From setup to personalized roadmap in 15 minutes
          </h2>
          <p className="mt-3 text-text-body text-sm sm:text-base">
            Designed to simulate realistic tier-1 company rounds without scheduling bottlenecks or interviewer bias.
          </p>
        </Reveal>

        <Reveal variant="stagger" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item) => (
            <TiltCard
              key={item.step}
              className="relative flex flex-col justify-between rounded-2xl border border-border bg-white p-7 shadow-xs hover:border-primary-blue/40 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-blue/10 text-primary-blue">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-primary-blue/25">{item.step}</span>
                </div>
                <h3 className="text-h3 mt-5 text-text-heading font-semibold">{item.title}</h3>
                <p className="mt-2.5 text-sm text-text-body leading-relaxed">{item.body}</p>
              </div>
              <div className="mt-6 border-t border-border/60 pt-3 text-[11px] font-semibold text-primary-blue">
                ✓ {item.highlight}
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </section>

      {/* 4. INTERVIEW TYPES: 3D INTERACTIVE TILT CARDS */}
      <section className="relative bg-white py-24 border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <Reveal className="mb-14 max-w-xl">
            <span className="text-label text-primary-blue">Specialized Tracks</span>
            <h2 className="text-h2 mt-2 text-text-heading">
              Practice the exact format you&apos;ll face
            </h2>
            <p className="mt-3 text-text-body text-sm sm:text-base">
              Calibrated specifically for enterprise roles across Full Stack, Frontend, Java Spring, and SAP ecosystems.
            </p>
          </Reveal>

          <Reveal variant="stagger" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INTERVIEW_TYPES.map((type) => (
              <TiltCard
                key={type.label}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-bg-light p-6 transition-all hover:bg-white hover:border-primary-blue/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-blue/10 text-primary-blue group-hover:bg-primary-blue group-hover:text-white transition-colors">
                    <type.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-text-heading">{type.label}</h3>
                  <p className="mt-2 text-xs text-text-body leading-relaxed">{type.body}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {type.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white border border-border/80 px-2 py-0.5 text-[10px] font-medium text-text-body"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60 text-[11px] font-mono text-primary-blue">
                  {type.difficulty}
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 5. INTERACTIVE SCORE REPORT SHOWCASE */}
      <section className="relative overflow-hidden bg-primary-dark py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 30%, rgba(30,94,255,0.5), transparent 50%), radial-gradient(circle at 25% 70%, rgba(0,240,255,0.3), transparent 50%)",
          }}
        />
        <InteractiveReportShowcase />
      </section>

      {/* 6. COMPARISON MATRIX: TRADITIONAL VS JKS AI */}
      <section className="py-20 lg:py-24 bg-bg-light">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-16">
          <Reveal className="mb-10 sm:mb-14 text-center">
            <span className="text-label text-primary-blue">Comparative Advantage</span>
            <h2 className="text-2xl sm:text-3xl lg:text-h2 mt-2 text-text-heading font-extrabold">
              Why Candidates Prefer JKS AI Mock Interviews
            </h2>
          </Reveal>

          {/* Mobile Card Stack (< md) */}
          <div className="space-y-4 md:hidden">
            {COMPARISON_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-3.5"
              >
                <div className="font-extrabold text-slate-900 text-sm border-b border-border/60 pb-2">
                  {item.feature}
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl bg-rose-50/70 p-3 text-xs text-slate-700 space-y-1 border border-rose-100/80">
                    <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span>Traditional Mock Interviews</span>
                    </div>
                    <p className="font-medium text-slate-600 pl-4">{item.traditional}</p>
                  </div>

                  <div className="rounded-xl bg-blue-50/80 p-3 text-xs text-slate-900 space-y-1 border border-blue-200/80 shadow-xs">
                    <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>JKS AI Mock Interview</span>
                    </div>
                    <p className="font-bold text-slate-900 pl-4">{item.jksAi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <Reveal variant="scale-in" className="hidden md:block overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-light/80 text-xs font-semibold text-text-heading uppercase tracking-wider">
                    <th className="p-5">Evaluation Feature</th>
                    <th className="p-5 text-text-body">Traditional Mock Interviews</th>
                    <th className="p-5 text-primary-blue bg-primary-blue/[0.04]">JKS AI Mock Interview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COMPARISON_ITEMS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-light/40 transition-colors">
                      <td className="p-5 font-semibold text-text-heading">{item.feature}</td>
                      <td className="p-5 text-text-body">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          <span>{item.traditional}</span>
                        </div>
                      </td>
                      <td className="p-5 font-medium text-text-heading bg-primary-blue/[0.02]">
                        <div className="flex items-center gap-2 text-primary-blue">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{item.jksAi}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>


      {/* 7. STATS STRIP */}
      <section className="border-b border-border bg-white">
        <Reveal
          variant="stagger"
          className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4 lg:px-16"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-h1 font-bold text-primary-blue">
                <CountUpStat target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm font-medium text-text-body">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 8. INTERACTIVE FAQ ACCORDION */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <Reveal className="mb-12 text-center">
            <span className="text-label text-primary-blue">Frequently Asked Questions</span>
            <h2 className="text-h2 mt-2 text-text-heading">
              Everything you need to know about AI Mock Interviews
            </h2>
          </Reveal>

          <Reveal variant="scale-in">
            <InterviewFaq />
          </Reveal>
        </div>
      </section>

      {/* 9. FINAL HIGH-CONVERTING CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary-blue to-primary-dark py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(0,240,255,0.4), transparent 70%)",
          }}
        />
        <Reveal variant="scale-in" className="relative mx-auto max-w-[1280px] px-6 text-center lg:px-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" /> Start Free Today
          </span>
          <h2 className="text-display mt-4 font-bold text-white">
            Discover your real technical readiness score
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 leading-relaxed">
            No signup friction to get started. Select your technology track and experience level,
            answer adaptive questions, and receive your comprehensive diagnostic report instantly.
          </p>
          <MagneticButton className="mt-8 inline-block">
            <Link
              href="/dashboard/ai-interview"
              className={
                buttonVariants({ variant: "secondary", size: "lg" }) +
                " border-white bg-white text-primary-blue hover:bg-white/90 hover:text-primary-blue font-bold shadow-xl shadow-black/20"
              }
            >
              Start Your Mock Interview <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </MagneticButton>
        </Reveal>
      </section>
    </>
  );
}
