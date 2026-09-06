import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Server,
  UserCheck,
  Globe,
  Bell,
  Mail,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Database,
  KeyRound,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | JKS Learning",
  description:
    "Learn how JKS Learning collects, protects, and manages your personal data, course progression, AI mock interview audio, and certification records.",
};

const SECTIONS = [
  { id: "overview", title: "1. Overview & Scope", icon: ShieldCheck },
  { id: "information-collected", title: "2. Information We Collect", icon: Database },
  { id: "how-we-use-data", title: "3. How We Use Your Information", icon: Eye },
  { id: "ai-data-processing", title: "4. AI Mock Interview & Code Data", icon: Sparkles },
  { id: "third-parties", title: "5. Sub-Processors & Data Sharing", icon: Server },
  { id: "cookies-storage", title: "6. Cookies & Tracking Technologies", icon: KeyRound },
  { id: "data-security", title: "7. Data Protection & Security", icon: Lock },
  { id: "your-rights", title: "8. Your Legal Rights & Data Choices", icon: UserCheck },
  { id: "international-transfers", title: "9. International Transfers & DPDP", icon: Globe },
  { id: "policy-updates", title: "10. Policy Updates & Contact", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 4, 2026";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              Legal & Trust
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
              <Clock className="h-3.5 w-3.5" />
              8 min read
            </span>
            <span className="text-xs text-slate-400">Version 2.4</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            At JKS Learning, we believe in radical transparency. This policy explains how we collect, store, safeguard, and process your data across our courses, AI mock interview engines, and certification verification services.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <span>Last Updated:</span>
            <span className="font-semibold text-slate-200">{lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sticky Navigation */}
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Table of Contents</h2>
              </div>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Have a privacy inquiry?</h3>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      Reach our dedicated Data Protection Officer at{" "}
                      <a href="mailto:privacy@jkslearning.com" className="text-blue-600 font-semibold hover:underline">
                        privacy@jkslearning.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy Text Articles */}
          <main className="space-y-12 lg:col-span-8">
            {/* Quick Summary Callout */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Executive Summary (TL;DR)
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>We never sell your data:</strong> Your personal information, resume files, and learning analytics are never sold or rented to third-party data brokers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>AI Confidentiality:</strong> Audio, code submissions, and transcripts processed during AI Mock Interviews are used strictly to provide you with scoring feedback and are never used to train public LLMs without consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Full Control:</strong> You have full rights to export your certificate history, request data copies, or delete your account at any time.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: Overview & Scope */}
            <article id="overview" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">1. Overview & Scope</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                JKS Learning (&quot;JKS&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website located at{" "}
                <strong className="text-slate-800 font-semibold">https://jks-learning-ui.vercel.app</strong> and associated learning portals, web applications, and APIs. This Privacy Policy governs all information collected from registered students, corporate learners, instructors, and public visitors across our Java Full Stack, Frontend Engineering, SAP, Generative AI, and Mock Interview programs.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By creating an account, enrolling in a course track, participating in live cohort sessions, or using our interactive tools, you consent to the collection, processing, and storage of your information as described in this policy.
              </p>
            </article>

            {/* Section 2: Information We Collect */}
            <article id="information-collected" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Database className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We collect information directly from you when you register, as well as automatically through your ongoing interaction with our platform:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                    A. Account & Profile Data
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    Full name, email address, password hash, phone number, profile avatar, role (Student, Instructor, Admin), and educational background provided during enrollment.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-blue-600" />
                    B. Learning & Academic Progress
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    Video watch timestamps, milestone completions, assessment quiz scores, coding playground submissions, batch schedules, and verified certification records.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-600" />
                    C. Payment & Billing Information
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    Transaction ID, invoice records, payment status, tax identification (GST), and billing address. We do <em>not</em> store raw credit/debit card numbers on our servers.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-blue-600" />
                    D. Technical & Log Data
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    IP address, browser type, operating system version, device identifiers, session cookies, and security event telemetry (e.g. Cloudflare Turnstile bot checks).
                  </p>
                </div>
              </div>
            </article>

            {/* Section 3: How We Use Your Information */}
            <article id="how-we-use-data" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Information</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We process your personal information strictly for legitimate educational, operational, and legal purposes:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
                <li><strong>Course Delivery:</strong> Facilitating live lecture access, automated video tracking, module progression, and assignment reviews.</li>
                <li><strong>Certification Authenticity:</strong> Generating tamper-proof digital certificates with unique verification IDs accessible via public verification portals.</li>
                <li><strong>Personalized Guidance:</strong> Recommending tailored learning milestones, interview practice modules, and career pathways based on your skill assessment performance.</li>
                <li><strong>Customer Support:</strong> Responding to student ticket inquiries, billing queries, and technical assistance requests.</li>
                <li><strong>Security & Anti-Fraud:</strong> Protecting our systems against unauthorized account sharing, automated scraping, credential attacks, and abuse.</li>
              </ul>
            </article>

            {/* Section 4: AI Mock Interview & Code Data */}
            <article id="ai-data-processing" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">4. AI Mock Interview & Code Data</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                JKS Learning features advanced AI-driven tools, including the AI Mock Interview Simulator and automated coding evaluation:
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Audio & Transcripts:</strong> When you record verbal responses during mock interviews, your audio is converted to text for the sole purpose of analyzing technical accuracy, response clarity, and keyword mastery.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>No Public Model Training:</strong> Your voice data, personal interview videos, and resume details are never fed into public foundation models or made publicly available.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Retention of Practice Records:</strong> Your mock interview reports and score history remain accessible in your Student Dashboard until you delete them or close your account.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 5: Sub-Processors & Data Sharing */}
            <article id="third-parties" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Server className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">5. Sub-Processors & Data Sharing</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We only share personal data with trusted third-party service providers (sub-processors) who adhere to strict data protection standards:
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Partner / Provider</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Data Handled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Clerk Auth</td>
                      <td className="p-3">User Authentication & Social SSO (Google/GitHub)</td>
                      <td className="p-3">Email, Name, User ID, Session Tokens</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">MongoDB Atlas / PostgreSQL</td>
                      <td className="p-3">Secure Database Hosting</td>
                      <td className="p-3">Course enrollments, milestone progress, scores</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Cloudflare</td>
                      <td className="p-3">DDoS Protection, WAF & Bot Verification</td>
                      <td className="p-3">IP Address, Request Telemetry</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Razorpay / Stripe</td>
                      <td className="p-3">PCI-DSS Compliant Payment Gateway</td>
                      <td className="p-3">Transaction status, billing receipts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Section 6: Cookies & Tracking Technologies */}
            <article id="cookies-storage" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <KeyRound className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">6. Cookies & Tracking Technologies</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We use strictly necessary and functional cookies to maintain your login session, remember course video playback positions, and preserve dark/light theme preferences. You can manage or disable cookies in your browser settings, though doing so may limit your access to authenticated learning dashboards.
              </p>
            </article>

            {/* Section 7: Data Protection & Security */}
            <article id="data-security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">7. Data Protection & Security</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We employ industry-leading security practices, including:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
                <li><strong>Encryption:</strong> TLS 1.3 encryption in transit for all web requests, and AES-256 encryption at rest for database records.</li>
                <li><strong>Password Hashing:</strong> State-of-the-art Argon2id / bcrypt cryptographic password hashing algorithms.</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Strict internal access isolation ensuring only authorized administrative personnel can access student records.</li>
              </ul>
            </article>

            {/* Section 8: Your Legal Rights */}
            <article id="your-rights" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <UserCheck className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">8. Your Legal Rights & Data Choices</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Regardless of your geographic location, JKS Learning grants all students comprehensive control over their personal data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Right to Access & Export</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Request a machine-readable copy of your course progress, invoices, and certificates.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Right to Rectification</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Update your legal name, contact phone number, and password anytime from your profile.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Right to Deletion</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Request complete erasure of your account, interview audio, and resume files.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Opt-Out of Marketing</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Unsubscribe from promotional emails and webinar announcements with 1 click.</p>
                </div>
              </div>
            </article>

            {/* Section 9: International Transfers & DPDP Act */}
            <article id="international-transfers" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Globe className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">9. International Transfers & DPDP Compliance</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                JKS Learning complies with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> of India, the <strong>General Data Protection Regulation (GDPR)</strong> of the EU, and standard contractual clauses for cross-border data transfers with global cloud providers.
              </p>
            </article>

            {/* Section 10: Updates & Contact */}
            <article id="policy-updates" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Mail className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">10. Policy Updates & Contact Information</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We may periodically update this Privacy Policy to reflect changes in our technology or legal requirements. Material changes will be communicated via your registered email or through an in-app banner announcement.
              </p>
              
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  JKS Learning Data Protection Office
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Official Email:</span>
                    <a href="mailto:privacy@jkslearning.com" className="font-semibold text-blue-400 hover:underline">
                      privacy@jkslearning.com
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Support Desk:</span>
                    <a href="mailto:support@jkslearning.com" className="font-semibold text-blue-400 hover:underline">
                      support@jkslearning.com
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Corporate Office:</span>
                    <p className="font-medium text-slate-200">
                      JKS Learning Technologies Pvt Ltd, Tech Park Corridor, HITEC City, Hyderabad, Telangana 500081, India.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
