import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Scale,
  CreditCard,
  RefreshCw,
  Award,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowLeft,
  BookOpen,
  Briefcase,
  Sparkles,
  Gavel,
  Mail,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | JKS Learning",
  description:
    "Review the Terms of Service, enrollment agreements, refund policies, intellectual property rights, and code of conduct for JKS Learning students.",
};

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms", icon: Scale },
  { id: "accounts", title: "2. Accounts & Security", icon: Lock },
  { id: "enrollment-fees", title: "3. Enrollment & Fees", icon: CreditCard },
  { id: "refund-policy", title: "4. Cancellation & Refund Policy", icon: RefreshCw },
  { id: "intellectual-property", title: "5. Intellectual Property Rights", icon: BookOpen },
  { id: "code-of-conduct", title: "6. Student Code of Conduct", icon: UserCheck },
  { id: "ai-interview-rules", title: "7. AI Mock Interview Rules", icon: Sparkles },
  { id: "certificates", title: "8. Verified Certification", icon: Award },
  { id: "career-disclaimer", title: "9. Career Placement Disclaimer", icon: Briefcase },
  { id: "liability-disclaimer", title: "10. Limitation of Liability", icon: AlertTriangle },
  { id: "termination", title: "11. Suspension & Termination", icon: ShieldAlert },
  { id: "governing-law", title: "12. Governing Law & Contact", icon: Gavel },
];

export default function TermsPage() {
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
              <Scale className="h-3.5 w-3.5" />
              Terms of Service
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
              <Clock className="h-3.5 w-3.5" />
              10 min read
            </span>
            <span className="text-xs text-slate-400">Version 2.4</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Please read these Terms of Service carefully before enrolling in courses, utilizing our AI Mock Interview Simulator, or accessing certification services on JKS Learning.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <span>Effective Date:</span>
            <span className="font-semibold text-slate-200">{lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
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
                    <h3 className="text-xs font-bold text-slate-800">Need legal assistance?</h3>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      Contact our legal counsel team at{" "}
                      <a href="mailto:legal@jkslearning.com" className="text-blue-600 font-semibold hover:underline">
                        legal@jkslearning.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Terms Articles */}
          <main className="space-y-12 lg:col-span-8">
            {/* Quick Summary Callout */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Key Points Summary
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Personal License:</strong> Course enrollments and live batch access are licensed solely for your individual, non-transferable educational use.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Refund Period:</strong> A 7-day money-back guarantee is available for live cohorts before completing more than 20% of milestone lessons.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Integrity:</strong> Certificates are issued based on authentic personal assessment completion and project submissions.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: Acceptance */}
            <article id="acceptance" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Scale className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms & Eligibility</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Student&quot;, &quot;User&quot;, or &quot;You&quot;) and JKS Learning Technologies Pvt Ltd (&quot;JKS Learning&quot;, &quot;we&quot;, or &quot;us&quot;). By creating an account, browsing courses, or transacting on{" "}
                <strong className="text-slate-800 font-semibold">https://jks-learning-ui.vercel.app</strong>, you confirm that you are at least 18 years of age (or have explicit parental/guardian consent) and possess legal capacity to enter into this contract.
              </p>
            </article>

            {/* Section 2: Accounts & Security */}
            <article id="accounts" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">2. User Accounts, Credentials & Security</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You must provide accurate, current, and complete registration details. You are solely responsible for maintaining the confidentiality of your credentials (including Clerk SSO credentials and passwords).
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <strong>Strict Prohibition on Account Sharing:</strong> Each enrollment grants access to a single learner. Concurrent multi-device stream sharing or reselling credentials will result in immediate account termination without refund.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 3: Enrollment & Fees */}
            <article id="enrollment-fees" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">3. Course Enrollment, Pricing & Payments</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Course fees for our Java Full Stack, Frontend Engineering, SAP, and AI programs are displayed in Indian Rupees (INR) or your localized currency. All prices are inclusive of applicable Goods and Services Tax (GST) unless explicitly noted.
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
                <li><strong>Payment Processors:</strong> Transactions are securely processed through authorized PCI-DSS compliant payment gateways (Razorpay/Stripe).</li>
                <li><strong>Installment Plans (EMI):</strong> If you choose an EMI or deferred payment plan, you agree to fulfill all scheduled payments on time. Failure to pay installments may result in temporary suspension of LMS access.</li>
              </ul>
            </article>

            {/* Section 4: Cancellation & Refund Policy */}
            <article id="refund-policy" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">4. Cancellation & 7-Day Refund Policy</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We stand behind the quality of our mentorship and curriculum. Our refund terms are as follows:
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>7-Day Window:</strong> You may request a 100% refund within 7 calendar days of your initial enrollment date, provided you have watched less than 20% of the course modules and have not downloaded proprietary source code projects.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Refund Processing:</strong> Approved refunds are credited back to the original payment source within 5–7 business days.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Non-Refundable Items:</strong> Standalone AI Mock Interview credit bundles and verified fast-track assessment fees are non-refundable once activated.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 5: Intellectual Property */}
            <article id="intellectual-property" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">5. Intellectual Property & Course Materials License</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All video lectures, interactive lab environments, interview question banks, curriculum designs, logos, and software code provided on JKS Learning are the exclusive intellectual property of JKS Learning Technologies Pvt Ltd.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You are granted a limited, personal, non-commercial, non-exclusive license to view and practice with the materials. You may <strong>not</strong> record, copy, redistribute, upload to torrents/drives, or use our proprietary materials for commercial instruction.
              </p>
            </article>

            {/* Section 6: Student Code of Conduct */}
            <article id="code-of-conduct" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <UserCheck className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">6. Student Code of Conduct & Academic Integrity</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                JKS Learning maintains a collaborative, professional, and respectful environment. As a student, you agree not to:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
                <li>Harass, intimidate, or use offensive language with faculty, mentors, or fellow students in live batch sessions or community forums.</li>
                <li>Submit plagiarized code solutions or use automated bots during timed coding assessments.</li>
                <li>Attempt to decompile, reverse-engineer, or probe vulnerabilities in our platform infrastructure.</li>
              </ul>
            </article>

            {/* Section 7: AI Mock Interview Simulator */}
            <article id="ai-interview-rules" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">7. AI Mock Interview & Skill Simulator Usage</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our AI Mock Interview system uses advanced LLM and voice evaluation models to simulate real technical hiring rounds. You acknowledge that AI feedback, scoring matrices, and performance metrics are advisory tools designed to guide your preparation, and do not constitute an official employment evaluation.
              </p>
            </article>

            {/* Section 8: Verified Certification */}
            <article id="certificates" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Award className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">8. Verified Certification & Employer Verification</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Digital completion certificates are awarded only upon achieving at least 80% milestone progress and passing the capstone assessment. Each certificate is assigned a permanent cryptographic identifier verifiable by employers via our verification portal. JKS Learning reserves the right to revoke any certificate found to have been obtained fraudulently.
              </p>
            </article>

            {/* Section 9: Career Placement Disclaimer */}
            <article id="career-disclaimer" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">9. Career Placement Support & Disclaimer</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                JKS Learning provides career mentorship, resume reviews, placement assistance, and hiring partner connections. However, <strong>we do not guarantee job offers, specific salary packages, or interview selections</strong>. Employment outcomes depend on the student&apos;s individual technical skill, interview performance, and market conditions.
              </p>
            </article>

            {/* Section 10: Limitation of Liability */}
            <article id="liability-disclaimer" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">10. Limitation of Liability</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To the maximum extent permitted by applicable law, JKS Learning shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from platform downtime, data loss, or reliance on course materials. In no event shall our total aggregate liability exceed the amount paid by you for the applicable course during the twelve (12) months preceding the claim.
              </p>
            </article>

            {/* Section 11: Termination */}
            <article id="termination" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">11. Suspension & Account Termination</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We reserve the right to suspend or terminate your account immediately without prior notice if you violate these Terms, engage in copyright infringement, or commit fraud.
              </p>
            </article>

            {/* Section 12: Governing Law & Contact */}
            <article id="governing-law" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Gavel className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">12. Governing Law, Jurisdiction & Contact</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the courts in <strong>Hyderabad, Telangana, India</strong>.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Legal Notices & Correspondence
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Legal Department:</span>
                    <a href="mailto:legal@jkslearning.com" className="font-semibold text-blue-400 hover:underline">
                      legal@jkslearning.com
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">General Inquiries:</span>
                    <a href="mailto:support@jkslearning.com" className="font-semibold text-blue-400 hover:underline">
                      support@jkslearning.com
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Registered Address:</span>
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
