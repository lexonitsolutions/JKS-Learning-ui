import Link from "next/link";
import { Trophy, ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { Reveal } from "@/lib/motion/reveal";
import { SuccessStoriesHero } from "@/components/marketing/success-stories-hero";
import { SuccessStoriesExplorer } from "@/components/marketing/success-stories-explorer";
import { TestimonialWall } from "@/components/marketing/testimonial-wall";
import { TESTIMONIALS } from "@/lib/data/testimonials";

const HIRING_PARTNERS = [
  { name: "Deloitte", tier: "Big 4 Consulting" },
  { name: "Infosys", tier: "Global IT Services" },
  { name: "Razorpay", tier: "FinTech Unicorn" },
  { name: "Accenture", tier: "Enterprise Solutions" },
  { name: "PwC", tier: "Big 4 Advisory" },
  { name: "Swiggy", tier: "Tier-1 Consumer Tech" },
  { name: "Capgemini", tier: "Enterprise Cloud" },
  { name: "Oracle", tier: "Enterprise Systems" },
  { name: "BrowserStack", tier: "Developer Tools" },
  { name: "TCS", tier: "Global Technology" },
  { name: "IBM", tier: "Cloud & Cognitive" },
  { name: "Wipro", tier: "Digital Operations" },
];

const COMPARISON_POINTS = [
  {
    pillar: "Skill Verification",
    traditional: "Passive video certificates that recruiters ignore",
    jksApproach: "100% Verifiable capstones + recorded AI mock interview readiness diagnostics",
  },
  {
    pillar: "Interview Preparedness",
    traditional: "Random LeetCode grinding with no adaptive conversational feedback",
    jksApproach: "Enterprise-calibrated AI mock interviews with 5-axis instant diagnostic reports",
  },
  {
    pillar: "Curriculum Alignment",
    traditional: "Outdated toy apps (todo lists, counter buttons) with zero enterprise depth",
    jksApproach: "Production-grade distributed systems, S/4HANA workflows, and micro-frontends",
  },
  {
    pillar: "Career Outcome",
    traditional: "Months stuck in tutorial hell without clear roadmap or mentorship",
    jksApproach: "Targeted action plan with structured modules that directly convert to job offers",
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      {/* 1. ULTRA-PREMIUM 3D HERO SECTION */}
      <SuccessStoriesHero />

      {/* 2. TRUSTED HIRING PARTNER NETWORK MARQUEE */}
      <section className="border-y border-border bg-white py-12">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-text-body/70">
              Where JKS Learning Alumni Build Their Careers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {HIRING_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-bg-light/60 p-4 transition-all hover:bg-white hover:border-primary-blue/30 hover:shadow-sm"
              >
                <span className="text-sm font-bold text-text-heading">{partner.name}</span>
                <span className="text-[10px] text-text-body/60 font-medium mt-0.5">
                  {partner.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE STORIES EXPLORER WITH SPOTLIGHT & 3D TILT CARDS */}
      <SuccessStoriesExplorer />

      {/* 5. THE JKS TRANSFORMATION DIFFERENCE MATRIX */}
      <section className="py-20 lg:py-28 bg-white border-y border-border">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
          <Reveal className="mb-14 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-blue/10 px-3.5 py-1 text-xs font-semibold text-primary-blue">
              <Sparkles className="h-3.5 w-3.5" /> Proven Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading mt-3">
              Why JKS Graduates Land Offers 3x Faster
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-body">
              How our structured curriculum, production capstones, and AI Mock Interview simulator
              transform candidates into high-confidence engineering hires.
            </p>
          </Reveal>

          <Reveal
            variant="scale-in"
            className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-light/90 text-xs font-bold text-text-heading uppercase tracking-wider">
                    <th className="p-5 sm:p-6">Transformation Pillar</th>
                    <th className="p-5 sm:p-6 text-text-body">Traditional Tutorials & Bootcamps</th>
                    <th className="p-5 sm:p-6 text-primary-blue bg-primary-blue/[0.04]">
                      JKS Career Accelerator
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COMPARISON_POINTS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-bg-light/40 transition-colors">
                      <td className="p-5 sm:p-6 font-bold text-text-heading text-sm">
                        {item.pillar}
                      </td>
                      <td className="p-5 sm:p-6 text-xs sm:text-sm text-text-body">
                        <div className="flex items-start gap-2.5">
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{item.traditional}</span>
                        </div>
                      </td>
                      <td className="p-5 sm:p-6 text-xs sm:text-sm font-medium text-text-heading bg-primary-blue/[0.02]">
                        <div className="flex items-start gap-2.5 text-slate-900">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-semibold">{item.jksApproach}</span>
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

      {/* 6. 3D PERSPECTIVE TESTIMONIAL FEEDBACK WALL */}
      <section className="py-20 lg:py-28 bg-bg-light">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
          <Reveal className="mb-12 text-center max-w-xl mx-auto">
            <span className="text-label text-primary-blue">Continuous Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading mt-2">
              Wall of Alumni Love
            </h2>
            <p className="mt-2 text-sm text-text-body">
              Live feedback from thousands of learners sharpening their skills every single day.
            </p>
          </Reveal>

          <Reveal variant="scale-in">
            <TestimonialWall testimonials={TESTIMONIALS} />
          </Reveal>
        </div>
      </section>

      {/* 7. HIGH-CONVERTING FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0B1120] via-primary-blue to-[#0B1120] py-20 lg:py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(0,240,255,0.45), transparent 70%)",
          }}
        />

        <Reveal
          variant="scale-in"
          className="relative mx-auto max-w-[1280px] px-6 text-center lg:px-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
            <Trophy className="h-3.5 w-3.5" /> Your Breakthrough Awaits
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4">
            Your Success Story Starts Here
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-white/85 leading-relaxed">
            Join thousands of motivated engineers upskilling with structured courses, production
            capstone portfolios, and AI-powered adaptive mock interviews.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                href="/courses"
                className={
                  buttonVariants({ variant: "secondary", size: "lg" }) +
                  " border-white bg-white text-primary-blue hover:bg-white/90 hover:text-primary-blue font-bold shadow-xl shadow-black/20"
                }
              >
                Explore Courses <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                href="/dashboard/ai-interview"
                className={
                  buttonVariants({ variant: "secondary", size: "lg" }) +
                  " border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md font-semibold"
                }
              >
                Try Free AI Mock Interview
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
