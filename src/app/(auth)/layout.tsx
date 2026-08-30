import { JksLogo } from "@/components/common/jks-logo";

// See (admin)/layout.tsx — same reasoning, for /login and /register: only
// proxy.ts reads the session cookie, so without this Next can statically
// cache these pages (or a prefetch of them) from a moment when the auth
// state differed from what's active when the user actually lands here.
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light px-4 py-12">
      {/* Mobile brand header */}
      <div className="mb-8 md:hidden">
        <JksLogo size="lg" />
      </div>
      {children}
    </div>
  );
}

