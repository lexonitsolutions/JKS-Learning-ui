import React from "react";
import { AboutHeroSection } from "@/components/marketing/about/about-hero-section";
import { AboutWhyStickySection } from "@/components/marketing/about/about-why-sticky-section";
import { AboutWhatWeProvide } from "@/components/marketing/about/about-what-we-provide";
import { AboutJourneyHorizontal } from "@/components/marketing/about/about-journey-horizontal";
import { AboutBeyondClassroom } from "@/components/marketing/about/about-beyond-classroom";
import { AboutVisionSection } from "@/components/marketing/about/about-vision-section";
import { AboutFinalCta } from "@/components/marketing/about/about-final-cta";

export const metadata = {
  title: "About JKS Learning — Learn Today. Build Tomorrow.",
  description:
    "JKS Learning is a modern ed-tech ecosystem built to help students develop practical knowledge, real-world skills, and the confidence to create their future.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-bg-light text-text-heading selection:bg-cyan-500 selection:text-slate-950">
      {/* 01 — Hero / Introduction */}
      <AboutHeroSection />

      {/* 02 — Why JKS Learning (Sticky Storytelling) */}
      <AboutWhyStickySection />

      {/* 03 — What We Provide (Large Editorial Capability Panels) */}
      <AboutWhatWeProvide />

      {/* 04 — The JKS Learning Experience (Cinematic Journey) */}
      <AboutJourneyHorizontal />

      {/* 05 — Learning That Goes Beyond The Classroom */}
      <AboutBeyondClassroom />

      {/* 06 — Our Vision */}
      <AboutVisionSection />

      {/* 07 — Final CTA */}
      <AboutFinalCta />
    </div>
  );
}
