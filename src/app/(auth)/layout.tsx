import { ThemeToggle } from "@/components/common/theme-toggle";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1020] p-4 sm:p-6 md:p-10 transition-colors duration-300">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
