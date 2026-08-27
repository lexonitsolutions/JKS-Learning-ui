import { DashboardTopbar } from "@/components/dashboard/topbar";
import { InterviewSetupForm } from "@/components/ai-interview/interview-setup-form";
import { Reveal } from "@/lib/motion/reveal";

export default function AiInterviewSetupPage() {
  return (
    <>
      <DashboardTopbar
        title="AI Mock Interview"
        subtitle="A short setup, then adaptive questions tailored to your inputs."
        userInitials="JD"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Reveal variant="fade-up">
          <InterviewSetupForm />
        </Reveal>
      </div>
    </>
  );
}
